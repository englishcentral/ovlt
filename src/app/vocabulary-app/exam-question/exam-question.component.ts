import {
    AfterViewChecked,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    HostListener,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { XDialogLine } from "../../../types/dialog-line";
import { XQuizWord } from "../../../types/vocabulary-quiz";
import { of, Subject, timer } from "rxjs";
import {
    createStreamName,
    MODE_WORD,
    RecognizerModelService
} from "../../../../model/recognizer/recognizer-model.service";
import { catchError, finalize, first as rxJsFirst, takeUntil } from "rxjs/operators";
import { buildSessionTimeKey } from "../../../../common-app/progress-app/event-factory.service";
import { RECOGNIZER_KALDI, RecognizerResult, WordResult } from "../../../types/speech/recognizer-result";
import {
    MODE_MULTIPLE_CHOICE,
    MODE_REVERSE_MATCH_MULTIPLE_CHOICE,
    MODE_STRICT_TYPING,
    MODE_TYPING
} from "../../../types/vocab-builder-reference";
import {
    MicrophoneHandlerService
} from "../../../../activity-app/shared-activity/microphone/microphone-handler.service";
import { ActivityConstants } from "../../../../activity-app/shared-activity/activity-constants";
import {
    ERROR_NOT_SUPPORTED,
    ERROR_REJECTED
} from "../../../../activity-app/shared-activity/microphone/microphone-constants";
import { NgbModal, NgbModalOptions, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import {
    ExamQuestionCheckedEvent,
    ExamQuestionModeSettings,
    LetterInput,
    ModeHandlerAbstract
} from "./mode-handler/mode-handler-abstract";
import {
    ModeHandlerAdapter
} from "../../../../activity-app/shared-activity/exam-question/mode-handler/mode-handler-adapter";
import { TypingSharedService } from "../../../../class-test-app/shared/typing-shared.service";
import { VocabBuilderModelService } from "../../../../model/vocab-builder-model.service";
import { RecognizerSettingService } from "../../../../model/recognizer/recognizer-setting.service";
import { VideoFactoryService } from "../../../../common-app/video-app/video-factory.service";
import {
    assign,
    compact,
    concat,
    fill,
    filter,
    findIndex,
    get,
    head,
    isEmpty,
    isEqual,
    isUndefined,
    join,
    map,
    reduce,
    sample,
    sampleSize,
    shuffle,
    size,
    some,
    toLower,
    uniqBy
} from "lodash-es";
import { AudioInstance } from "../../../../shared/audio/audio-instance";
import { HTTP_REQUEST_HANDLER, WEBSOCKET_REQUEST_HANDLER } from "../../../types/speech/transport";
import { createAudioInstance } from "../../../../shared/audio/html-audio-instance";
import { LearnStateService } from "../../player-app/overlay/learn/learn-state.service";
import { MicrophoneWidgetStateService } from "../../microphone-widget/microphone-widget-state.service";
import { XWordDetail } from "../../../types/x-word";
import { Logger } from "../../common/logger";
import { SubscriptionAbstract } from "../../subscription.abstract";
import { CountdownTimer, CountdownTimerTick, TIMER_MODE_TOTAL_REMAINING_TIME } from "../../common/countdown-timer";
import { Browser } from "../../common/browser";
import { FeatureService } from "../../common/feature.service";
import { IdentityService } from "../../common/identity.service";

const THRESHOLD_WARNING = 0.5;
const THRESHOLD_DANGER = 0.25;
const ANIMATION_FRAME = 10;

const REJECTION_TRESHOLD = 2;

const NUM_CHOICES = 4;
const FIRST_HINT_INDEX = 0;
const SECOND_HINT_INDEX = 1;

const ALL_VIRTUAL_LETTERS = Array.from("qwertyuiopasdfghjklzxcvbnm1234567890-/:;()$&@\".,?!'[]{}#%^*+=_\\|~<>€£¥•");

@Component({
    selector: "ec-exam-question",
    templateUrl: "exam-question.component.html",
    styleUrls: ["exam-question.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExamQuestionComponent extends SubscriptionAbstract implements OnChanges, OnDestroy, OnInit, AfterViewChecked {
    @ViewChild("unsupportedBrowserPopup", {static: false}) unsupportedBrowser: NgbModal;
    @Input() dialogLine: XDialogLine;
    @Input() levelTest: boolean = false;
    @Input() orthography: string = "";
    @Input() quizIndex: number;
    @Input() quizLength: number;
    @Input() currentBand: number;
    @Input() currentRank: number;
    @Input() currentListName: string;
    @Input() hintLength: number;
    @Input() quizWord?: XQuizWord;
    @Input() activityTypeId?: number;
    @Input() courseId: number;
    //need to take wordInstanceId as a separate input to be able to get real wordInstanceId for pron quiz
    @Input() wordInstanceId: number;
    @Input() accountPronunciationWordId: number;
    @Input() timerExpirationInSeconds: number = 0;
    @Input() showRank: boolean = false;
    @Input() showBand: boolean = false;
    @Input() showQuizPagination: boolean = false;
    @Input() showListName: boolean = false;
    @Input() practice: boolean = false;
    @Input() comprehensionQuizQuestion: boolean = false;

    @Input() wordPronunciationEnabled: boolean = false;

    @Input() isRecyclingSkippedWordsEnabled: boolean = false;
    @Input() isRecyclingMissedWordsEnabled: boolean = false;

    //skip behavior is controlled from mode handler but input is added to control skip behavior from vocab builder level
    @Input() isSkipBehaviorEnabled: boolean = true;
    @Input() exitButtonEnabled: boolean = true;

    @Input() showPreviouslyEncounteredVisible: boolean = false;

    @Input() adaptive: boolean = false;
    @Input() recycleEnabled: boolean = false;
    @Input() isWordRecycled: boolean = false;

    @Input() mode: number;
    @Input() fallbackMode: number = MODE_TYPING;
    @Input() modeSettings: ExamQuestionModeSettings = new ExamQuestionModeSettings();

    @Input() markAsKnownButtonVisible: boolean = false;
    @Input() autoMarkAsKnownEnabled: boolean = false;
    @Input() trackingContext?: Record<string, string>;

    @Output() eventComplete = new EventEmitter<void>();
    @Output() eventAttempt = new EventEmitter<ExamQuestionCheckedEvent>();
    @Output() eventAnswer = new EventEmitter<ExamQuestionCheckedEvent>();
    @Output() eventMarkAsKnown = new EventEmitter<boolean>();
    @Output() eventModeChange = new EventEmitter<number>();
    @Output() eventError = new EventEmitter<any>();
    @Output() eventExitQuiz = new EventEmitter<void>();
    @Output() eventRecycleWord = new EventEmitter<XQuizWord>();

    private loading: boolean = false;
    private logger = new Logger();

    private reset$ = new Subject<boolean>();
    private checked$ = new Subject<boolean>();

    private keyboardEnabled: boolean = false;

    private currentIndex: number = 0;
    private pristine: boolean = true;
    private timerExpired: boolean = false;

    private answerSet: string[];
    private virtualLetterInputValues: string[];
    private virtualLetterInputs: LetterInput[];
    private selectedChoice: XWordDetail;

    private showPlayButton: boolean = false;
    private enableVideo: boolean = false;

    private videoUrl: string = "";
    private videoThumbnailUrl: string = "";
    private videoPlaying: boolean = false;
    private wordInstance?: XWordDetail;
    private remainingTime: string = "";
    private timerWidth?: string;
    private timerRatio: number;
    private lineTranslation: string = "";

    private currentOrthography: string = "";
    private currentAudioUrl?: string;
    private currentWordResult?: WordResult;
    private currentDialogLine?: XDialogLine;
    private currentlyRejected?: boolean;

    private distractors: XWordDetail[] = [];
    private choices: XWordDetail[] = [];
    private example: XDialogLine;

    private isFirstKnownWord: boolean = true;

    private pre: string = "";
    private post: string = "";

    private known: boolean = false;
    private knownProcessing: boolean = false;

    private timer: CountdownTimer;
    private modeHandler: ModeHandlerAbstract;
    private rejectionCounter: number = 0;

    private audio: AudioInstance;
    private modalRef: NgbModalRef;

    constructor(private microphoneWidgetStateService: MicrophoneWidgetStateService,
                private microphoneHandlerService: MicrophoneHandlerService,
                private identityService: IdentityService,
                private featureService: FeatureService,
                private recognizerModelService: RecognizerModelService,
                private recognizerSettingService: RecognizerSettingService,
                private videoFactory: VideoFactoryService,
                private modalService: NgbModal,
                private zone: NgZone,
                private vocabBuilderModelService: VocabBuilderModelService,
                private typingSharedService: TypingSharedService,
                private learnStateService: LearnStateService,
                private changeDetectorRef: ChangeDetectorRef) {
        super();
    }

    @HostListener("window:keyup", ["$event"])
    onKeyDown(event: KeyboardEvent): void {
        event.preventDefault();
        event.stopPropagation();
        const KEYCODE_ENTER = "Enter";
        if (this.isChecked() && event.code == KEYCODE_ENTER) {
            return this.setComplete();
        }
    }

    ngOnInit(): void {
        this.subscribeKeyboardEvents();
        this.learnStateService.setVirtualKeyboardVisibility(true);

        this.microphoneWidgetStateService.getChange$().pipe(
            takeUntil(this.getDestroyInterceptor())
        ).subscribe(() => {
            this.changeDetectorRef.markForCheck();
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        const isWordChanged = changes.quizWord && !isEqual(changes.quizWord.previousValue, changes.quizWord.currentValue);
        const isRecycledWord = changes.isWordRecycled;

        if (isWordChanged || isRecycledWord || changes?.mode || changes?.orthography || changes?.dialogLine) {
            this.initialize();
        }
    }

    ngAfterViewChecked(): void {
        if (this.modeHandler.isBrowserUnsupported() && !this.modalRef) {
            this.launchModal(this.unsupportedBrowser);
        }
    }

    subscribeKeyboardEvents(): void {
        this.typingSharedService.getObservable(TypingSharedService.ENABLE_KEYBOARD)
            .pipe(
                takeUntil(this.getDestroyInterceptor())
            ).subscribe((enableKeyboard) => {
            this.enableKeyboard(enableKeyboard);
            this.typingSharedService.enableKeyboard(enableKeyboard);
        });
    }

    private initialize(): void {
        this.reset();
        this.modeHandler = ModeHandlerAdapter.getAdapter(this.mode, this.modeSettings);

        let orthography: string = this.quizWord?.word?.label || this.orthography;
        let dialogLine = this.dialogLine || this.quizWord?.examples?.[0];
        if (dialogLine) { /* translation does not exist */
            this.lineTranslation = get(dialogLine, "translation");
        }

        this.initializeLetters(orthography);
        this.initializeDialogLine(dialogLine, orthography, this.quizWord.word);

        if (this.showMultipleChoice()) {
            this.initializeMultipleChoices();
        } else {
            this.startTimer();
        }

        if (this.showAudio()) {
            if (this.audio) {
                this.audio.destroy();
            }

            this.audio = createAudioInstance(this.quizWord.word.audioURL);
        }

        if (this.shouldAudioPlay()) {
            this.playAudio();
        }

        if (this.shouldShowExampleWord()) {
            const correctAnswer = this.orthography || get(this.quizWord, "word.label");
            this.answerSet = correctAnswer.split("");
        }
    }

    private startTimer(): void {
        if (!this.shouldShowTimer()) {
            return;
        }
        timer(ANIMATION_FRAME)
            .pipe(
                takeUntil(this.getDestroyInterceptor()),
                takeUntil(this.reset$)
            )
            .subscribe(() => this.initializeTimer());
    }

    private initializeLetters(orthography: string): void {
        if (!orthography) {
            return;
        }

        if (!this.modeHandler.showAutoCompleteFirstHint()) {
            this.hintLength = 0;
        }

        let letterSet = this.modeHandler.generateLetterSet(
            orthography,
            this.hintLength,
            this.modeHandler.showAutoCompleteFirstHint(),
            this.modeHandler.showAutoCompleteSecondHint()
        );

        this.answerSet = reduce(letterSet, (acc, letterInput) => {
            if (letterInput.isReadOnly) {
                acc.push(letterInput.value);
            } else {
                acc.push("");
            }
            return acc;
        }, []);

        //generate letters for partial keyboard (return type is LetterInput)
        this.generateVirtualLetterInputSet(letterSet);

        this.currentIndex = findIndex(letterSet, (letterInput) => {
            return !letterInput.isReadOnly && !letterInput.isSpecialChar;
        });
    }

    private initializeDialogLine(dialogLine: XDialogLine, orthography: string, word?: XWordDetail): void {
        if (!dialogLine) {
            return;
        }
        this.currentDialogLine = dialogLine;
        this.videoUrl = dialogLine.videoURL;
        this.videoThumbnailUrl = dialogLine.thumbnailURL;
        if (dialogLine.wordDetail) {
            this.wordInstance = dialogLine.wordDetail;
        } else if (word) {
            this.wordInstance = word;
        }

        if (!dialogLine.transcript) {
            return;
        }
        let wordIndex = dialogLine.transcript.search(new RegExp(`\\b${orthography}\\b`, "i"));
        if (wordIndex == -1) {
            // TODO delete the following code when base forms are correctly decided
            let alternateOrtography = dialogLine.wordDetails[0].label;
            let alternateWordIndex = dialogLine.transcript.search(new RegExp(`\\b${alternateOrtography}\\b`, "i"));

            this.pre = dialogLine.transcript.substring(0, alternateWordIndex);
            this.post = dialogLine.transcript.substring(alternateWordIndex + size(alternateOrtography));
            this.currentOrthography = alternateOrtography;

            this.orthography = alternateOrtography;

            this.initializeLetters(alternateOrtography);
            // Delete up to this point

            this.logger.error(`RegExp can't match orthography: ${orthography} in the transcript: ${dialogLine.transcript}`);
            return;
        }
        // Also delete this line
        this.orthography = orthography;

        this.pre = dialogLine.transcript.substring(0, wordIndex);
        this.post = dialogLine.transcript.substring(wordIndex + size(orthography));
        this.currentOrthography = dialogLine.transcript.substring(wordIndex, wordIndex + size(orthography));
    }

    private initializeMultipleChoices(): void {
        let currentQuizWord = this.quizWord;
        if (currentQuizWord) {
            this.example = sample(currentQuizWord.examples);
            this.distractors = sampleSize(currentQuizWord.distractors, (NUM_CHOICES - 1) || 0);
        }

        const hasDistractors = this.distractors && !isEmpty(this.distractors);

        if (hasDistractors) {
            let choicePool = concat(this.distractors, this.example.wordDetail || this.example.wordDetails[0]);
            this.choices = shuffle(choicePool);
            this.changeDetectorRef.markForCheck();
            this.startTimer();
        }

        if (!hasDistractors) {
            this.setLoading(true);
            this.vocabBuilderModelService.getDistractors(this.quizWord.word.wordRootId)
                .pipe(
                    takeUntil(this.getDestroyInterceptor()),
                    takeUntil(this.reset$),
                    catchError(() => {
                        return of([]);
                    })
                )
                .subscribe((distractors) => {
                    this.distractors = sampleSize(distractors, (NUM_CHOICES - 1) || 0);
                    this.quizWord.distractors = this.distractors;
                    let choicePool = concat(this.distractors, this.example.wordDetail);
                    this.choices = shuffle(choicePool);
                    this.changeDetectorRef.markForCheck();
                    this.startTimer();
                });
        }
    }

    private initializeTimer(): void {
        if (!this.timerExpirationInSeconds) {
            return;
        }

        const MS_IN_SECS = 1000;
        let originalTime = this.timerExpirationInSeconds * MS_IN_SECS;
        this.remainingTime = this.timerExpirationInSeconds.toString();

        this.timer = new CountdownTimer(undefined, originalTime, 100, "s", TIMER_MODE_TOTAL_REMAINING_TIME);

        this.timer.getObservable()
            .pipe(
                takeUntil(this.getDestroyInterceptor()),
                takeUntil(this.reset$),
                takeUntil(this.checked$),
                catchError(error => {
                    this.logger.log(error);
                    return of(new CountdownTimerTick());
                })
            )
            .subscribe((timerTick) => {
                this.zone.run(() => {
                    let remainingTime = timerTick.time / MS_IN_SECS;
                    this.remainingTime = Math.ceil(remainingTime).toString();
                    this.timerWidth = this.computeWidth(remainingTime, this.timerExpirationInSeconds);
                    this.timerRatio = timerTick.percent;
                    this.changeDetectorRef.detectChanges();

                    // BC-63601
                    const MIN_SECOND_HINT_THRESHOLD = 4;
                    let letterSet = this.modeHandler.getLetterSet();
                    if (this.modeHandler.showAutoCompleteSecondHint()
                        && size(letterSet) >= MIN_SECOND_HINT_THRESHOLD
                        && !this.isIndexReadOnly(SECOND_HINT_INDEX)) {
                        this.giveAdditionalHint(SECOND_HINT_INDEX);
                    }

                    if (!timerTick.isExpired) {
                        return;
                    }

                    this.expireTimer();
                    this.finalizeMicrophone("exam timer");

                    this.checkAnswer();

                    const correctAnswer = this.orthography || this.quizWord?.word?.label;
                    this.answerSet = correctAnswer.split("");

                    this.setChecked(true);
                });
            });
    }

    toggleMarkAsKnown(): void {
        if (this.knownProcessing) {
            return;
        }
        this.markAsKnown(!this.known);
    }

    private markAsKnown(known: boolean): void {
        this.isFirstKnownWord = false;
        this.eventMarkAsKnown.emit(known);
        this.knownProcessing = true;

        const ANIMATION_DELAY = 800;
        timer(ANIMATION_DELAY)
            .pipe(
                takeUntil(this.getDestroyInterceptor()),
                takeUntil(this.reset$)
            )
            .subscribe(() => {
                this.knownProcessing = false;
                this.known = known;
                this.changeDetectorRef.detectChanges();
            });
    }

    switchMode(mode: number): void {
        this.eventModeChange.emit(mode);
    }

    private expireTimer(): void {
        this.timerExpired = true;
    }

    private reset(): void {
        this.learnStateService.setVirtualKeyboardVisibility(true);
        this.pristine = true;
        this.known = false;
        this.pre = "";
        this.post = "";
        this.lineTranslation = "";
        this.currentWordResult = undefined;
        this.currentlyRejected = undefined;
        this.rejectionCounter = 0;
        this.reset$.next(true);
        this.resetTimer();
        this.setVideoPlaying(false);
        this.setVideoEnabled(false);
        this.setShowPlayButton(false);
    }

    private resetTimer(): void {
        this.timer?.destroy();
        this.timer = undefined;
        this.timerWidth = "100%";
        this.timerRatio = 1;
        this.remainingTime = "";
    }

    private generateVirtualLetterInputSet(letterSet: LetterInput[]): void {
        let filtered = filter(letterSet, (letterSet) => !letterSet.isReadOnly && !letterSet.isSpecialChar && !letterSet.isSpace);
        let mapped = map(filtered, letterSet => letterSet);
        const uniqLetterSets = uniqBy(mapped, letterSet => letterSet.value);

        this.virtualLetterInputs = this.shuffleUntilRandom(this.generateDistractorLetters(uniqLetterSets));
        this.virtualLetterInputValues = map(this.virtualLetterInputs, (letterInput) => {
            return letterInput.value;
        });
    }

    generateAutomationWordId(): string {
        if (!this.wordInstance) {
            return "";
        }

        return join(compact([
            this.wordInstance.wordRootId,
            this.wordInstance.wordAdapter.wordHeadId,
            this.wordInstance.wordInstanceId
        ]), "-");
    }

    private generateDistractorLetters(letterSet: LetterInput[]): LetterInput[] {
        const MIN_LETTERSET_LENGTH = 4;
        const letterSetSize = size(letterSet);

        if (!this.modeSettings.generateDistractors || letterSetSize >= MIN_LETTERSET_LENGTH) {
            return letterSet;
        }

        const ALPHABET = "abcdefghijklmnopqrstuvwxyz";

        const distractorLetters = sampleSize(filter(ALPHABET, char => {
            return !some(letterSet, letter => letter.value == char);
        }), MIN_LETTERSET_LENGTH - letterSetSize);

        const distractorLetterInputs: LetterInput[] = map(distractorLetters, (letter) => {
            return new LetterInput(letter);
        });
        return concat(letterSet, distractorLetterInputs);
    }

    private shuffleUntilRandom(letterSet: LetterInput[]): LetterInput[] {
        let shuffled = shuffle(letterSet);
        if (head(shuffled) == head(letterSet)) {
            return this.shuffleUntilRandom(letterSet);
        }
        return shuffled;
    }

    private computeWidth(numerator: number, denominator: number): string | undefined {
        if (!denominator) {
            return undefined;
        }
        const percentage = numerator / denominator * 100;
        return percentage.toString() + "%";
    }

    private giveAdditionalHint(hintIndex: number): void {
        if (!this.isTimerWarning()) {
            return;
        }
        let letter = this.modeHandler.updateLetterSet(hintIndex, {
            isReadOnly: true
        });
        this.answerSet[hintIndex] = letter.value;
        if (this.modeHandler.allowLetterInput()) {
            this.doCheck();
        }

        if (this.currentIndex == hintIndex) {
            this.moveRight();
        }
    }

    enableKeyboard(keyboardEnabled: boolean): void {
        this.keyboardEnabled = keyboardEnabled;
    }

    private getCacheKey(): object {
        return {accountId: this.identityService.getAccountId()};
    }

    getKeyboardLetters(): string[] {
        if (this.isFullVirtualAdvancedKeyboardVisible()) {
            return ALL_VIRTUAL_LETTERS;
        }
        return this.getVirtualLettersInputsValues();
    }

    getQuizWord(): XWordDetail {
        return this.quizWord.word;
    }

    getRemainingTime(): string {
        return this.remainingTime;
    }

    getTimerWidth(): string | undefined {
        return this.timerWidth;
    }

    getCurrentOrthography(): string {
        return this.currentOrthography;
    }

    getLineTranslation(): string {
        return this.lineTranslation;
    }

    getPre(): string {
        return this.pre;
    }

    getPost(): string {
        return this.post;
    }

    getVideoId(): string {
        const VIDEO_ID = "quiz-question";
        return VIDEO_ID;
    }

    getVideoUrl(): string {
        return this.videoUrl;
    }

    getVideoThumbnailUrl(): string {
        return "assets/adaptive-quiz/poster.gif";
    }

    getWordInstance(): XWordDetail | undefined {
        return this.wordInstance;
    }

    getExample(): XDialogLine {
        return this.example;
    }

    getDistractors(): XWordDetail[] {
        return this.distractors;
    }

    getChoices(): XWordDetail[] {
        return this.choices;
    }

    getChoiceIndexClassName(index): string {
        return `choice-${index}`;
    }

    getPlayBackTriggers(): string {
        return this.isMobile() ? "click" : "click,mouseover";
    }

    getQuizIndex(): number | undefined {
        return this.quizIndex;
    }

    getQuizLength(): number | undefined {
        return this.quizLength;
    }

    getCurrentBand(): number | undefined {
        return this.currentBand;
    }

    getCurrentRank(): number | undefined {
        return this.currentRank;
    }

    getCurrentListName(): string | undefined {
        return this.currentListName;
    }

    getLetterSet(): LetterInput[] {
        return this.modeHandler.getLetterSet();
    }

    getVirtualLettersInputsValues(): string[] {
        return this.virtualLetterInputValues;
    }

    getVirtualLetterInputs(): LetterInput[] {
        return this.virtualLetterInputs;
    }

    getFallbackMode(): number {
        return this.fallbackMode;
    }

    isFallbackMultipleChoice(): boolean {
        return [MODE_MULTIPLE_CHOICE, MODE_REVERSE_MATCH_MULTIPLE_CHOICE].includes(this.fallbackMode);
    }

    isFallbackTyping(): boolean {
        return [MODE_TYPING, MODE_STRICT_TYPING].includes(this.fallbackMode);
    }

    isAdaptive(): boolean {
        return this.adaptive;
    }

    getAnswer(index: number): string {
        let letterSet = this.modeHandler.getLetterSet();
        let currentLetterInput = letterSet[index];
        if (currentLetterInput && currentLetterInput.isReadOnly) {
            return currentLetterInput.value;
        }
        if (this.shouldShowBlinkingCursor(index)) {
            return "|";
        }
        return this.answerSet[index];
    }

    getButtonClass(choice): string {
        if (!this.isChecked()) {
            return "";
        }

        let word = this.getQuizWord();
        let isCorrectChoice = word && (word as any).wordAdapter.wordHeadId == (choice?.wordAdapter?.wordHeadId || 0);

        if (this.isAnswerCorrect()
            && isCorrectChoice) {
            return "correct bg-success";
        }

        if (isEqual(this.getSelectedChoice(), choice)) {
            return "incorrect bg-weak";
        }

        if (isCorrectChoice) {
            return "missed bg-success";
        }

        if (!this.getRemainingTime() || this.isChecked()) {
            return "disabled-choice blur";
        }

        return "blur";
    }

    getCharInputClass(index: number): string {
        if (this.isSkipped() || this.isTimerExpired()) {
            return "text-tertiary";
        }
        if (this.isCorrect(index)) {
            return "correct text-success";
        }
        if (this.isIncorrect(index)) {
            return "incorrect text-danger";
        }
        return "";
    }

    getRejectionTooltipTemplate(recordingRejectionTooltipTemplate: TemplateRef<any>): TemplateRef<any> | undefined {
        if (!this.isPristine() && !this.isAnswerCorrect()) {
            return recordingRejectionTooltipTemplate;
        }

        return undefined;
    }

    getRecordingTimeSetting(): number {
        const RECORDING_TIME = 5;
        return RECORDING_TIME;
    }

    getRecognizerType(): number {
        return RECOGNIZER_KALDI;
    }

    getFileTransferMode(): string {
        return this.recognizerSettingService.getFileTransferMode(this.getRecognizerType());
    }

    getTrackingContext(): Record<string, string> {
        return this.trackingContext;
    }

    getSelectedChoice(): XWordDetail {
        return this.selectedChoice;
    }

    getWaveList(): number[] {
        let handler = this.microphoneHandlerService.getHandler();
        if (!handler) {
            return [];
        }

        return handler.getRecordingDataArrayHeartbeat();
    }

    getWordDefinition(word: XWordDetail): string {
        if (!this.isLanguageDefinitionsUsable()) {
            return word?.definitionEn || word?.definition;
        }
        return word?.translation || word?.definition;
    }

    getExamplesOrthography(example: XDialogLine): string {
        return example?.wordDetails?.[0]?.label || "";
    }


    setChecked(checked: boolean): void {
        this.modeHandler.setChecked(checked);
        if (!this.shouldVideoPlayBeforeAnswerChecked()) {
            this.playVideo();
        }
        if (!this.modeHandler.isChecked()) {
            return;
        }
        this.checked$.next(true);
        this.changeDetectorRef.detectChanges();
    }

    setComplete(): void {
        this.timerExpired = false;
        this.eventComplete.emit();
    }

    setSelectedChoice(selectedChoice: XWordDetail): void {
        this.selectedChoice = selectedChoice;
    }

    setShowPlayButton(show: boolean): void {
        this.showPlayButton = show;
    }

    setVideoPlaying(videoPlaying: boolean): void {
        this.videoPlaying = videoPlaying;
    }

    setVideoEnabled(enable: boolean): void {
        this.enableVideo = enable;
    }

    setLoading(loading: boolean): void {
        this.loading = loading;
    }

    setCurrentIndex(index: number): void {
        if (this.isIndexReadOnly(index)) {
            return;
        }
        this.currentIndex = index;
    }

    isTimerExpired(): boolean {
        return this.timerExpired;
    }

    private isIndexReadOnly(index: number): boolean {
        return this.modeHandler.getLetterSet()[index]?.isReadOnly ?? false;
    }

    private isLetterSetCorrect(): boolean {
        return reduce(this.modeHandler.getLetterSet(), (acc, letterInput, index) => {
            if (!acc || letterInput.isReadOnly || letterInput.isSpace || letterInput.isSpecialChar) {
                return acc;
            }
            return letterInput.value == this.answerSet[index];
        }, true);
    }

    isAnswerCorrect(): boolean {
        return this.modeHandler.isAnswerCorrect();
    }

    isKnown(): boolean {
        return this.known;
    }

    private isRejectionThresholdPassed(): boolean {
        return this.rejectionCounter >= REJECTION_TRESHOLD;
    }

    isKnownProcessing(): boolean {
        return this.knownProcessing;
    }

    isFirstKnown(): boolean {
        return this.isFirstKnownWord;
    }

    isLetterInputReadOnly(): boolean {
        return this.modeHandler.isLetterInputReadOnly();
    }

    isPreviouslyEncountered(): boolean {
        return this.quizWord.previouslyEncountered || this.isWordRecycled;
    }

    isVideoPlaying(): boolean {
        return this.videoPlaying;
    }

    isAutoComplete(): boolean {
        return this.modeSettings.autoComplete;
    }

    isVirtualAdvancedKeyboardVisible(): boolean {
        return this.modeHandler.isVirtualAdvancedKeyboardVisible()
            && this.isMobile()
            && !this.isChecked()
            && !this.showVirtualKeyboard()
            && this.learnStateService.isVirtualKeyboardVisible();
    }

    isFullKeyboardEnabled(): boolean {
        return this.modeHandler.isFullKeyboardEnabled();
    }

    isFullVirtualAdvancedKeyboardVisible(): boolean {
        return this.isVirtualAdvancedKeyboardVisible() && this.isFullKeyboardEnabled();
    }

    isCorrect(index: number): boolean {
        if (this.shouldShowExampleWord() && !this.isChecked()) {
            return false;
        }
        return this.modeHandler.isCorrect(index, this.answerSet);
    }

    isUncertain(index: number): boolean {
        return this.modeHandler.isUncertain(index, this.answerSet);
    }

    isIncorrect(index: number): boolean {
        if (this.shouldShowExampleWord() && !this.isChecked()) {
            return false;
        }
        return this.modeHandler.isIncorrect(index, this.answerSet, this.isIndexReadOnly(index));
    }

    isSelected(index: number): boolean {
        return this.modeHandler.isSelected(this.currentIndex, index);
    }

    isSpecial(index: number): boolean {
        return this.modeHandler.isSpecial(index);
    }

    isComplete(): boolean {
        return !some(this.answerSet, letter => letter == "");
    }

    isLanguageDefinitionsUsable(): boolean {
        return this.featureService.getFeature("isLanguageDefinitionsUsable");
    }

    isUppercase(index: number): boolean {
        return isEqual(index, 0);
    }

    isMobile(): boolean {
        return Browser.isMobile();
    }

    isChecked(): boolean {
        return this.modeHandler.isChecked();
    }

    isSkipped(): boolean {
        return this.modeHandler.isSkipped();
    }

    isPristine(): boolean {
        return this.pristine;
    }

    isLocked(): boolean {
        return this.isChecked() && this.modeSettings.lockOnCheck;
    }

    isTimerEnabled(): boolean {
        return this.shouldShowTimer() && this.timerExpirationInSeconds && this.timerExpirationInSeconds > 0;
    }

    isPwaEnabled(): boolean {
        return this.featureService.isPwaV2Enabled();
    }

    isTimerGood(): boolean {
        return this.timerRatio > THRESHOLD_WARNING;
    }

    isTimerWarning(): boolean {
        return this.timerRatio > THRESHOLD_DANGER && this.timerRatio <= THRESHOLD_WARNING;
    }

    isTimerDanger(): boolean {
        return this.timerRatio <= THRESHOLD_DANGER;
    }

    isKeyboardEnabled(): boolean {
        return this.keyboardEnabled;
    }

    isExitButtonEnabled(): boolean {
        return this.exitButtonEnabled;
    }

    isAutoMarkAsKnownEnabled(): boolean {
        return this.markAsKnownButtonVisible && this.autoMarkAsKnownEnabled;
    }

    isAudioPlaying(): boolean {
        return this.audio && this.audio.isPlaying;
    }

    isLoading(): boolean {
        return this.loading;
    }

    isRecycleEnabled(): boolean {
        return this.recycleEnabled;
    }

    shouldEnableVideo(): boolean {
        return this.enableVideo;
    }

    shouldShowPlayButton(): boolean {
        return this.showPlayButton;
    }

    shouldShowVideoThumbnail(): boolean {
        return this.modeHandler.shouldShowVideoThumbnail();
    }

    shouldShowBlinkingCursor(index: number): boolean {
        return this.isSelected(index) && this.isMobile() && !this.answerSet[index] && !this.isChecked();
    }

    shouldShowBottomContinueButton(): boolean {
        return this.showMultipleChoice() && this.isChecked() && !this.isAnswerCorrect();
    }

    shouldVideoPlayBeforeAnswerChecked(): boolean {
        return this.modeHandler.shouldVideoPlayBeforeAnswerChecked();
    }

    shouldAudioPlay(): boolean {
        return this.modeHandler.shouldAudioPlay();
    }

    shouldVideoAutoPlay(): boolean {
        return this.modeHandler.shouldVideoAutoPlay();
    }

    shouldShowHint(): boolean {
        return !this.showMultipleChoice();
    }

    shouldShowTimer(): boolean {
        return this.modeHandler.showTimer();
    }

    shouldShowExampleWord(): boolean {
        return this.modeHandler.shouldShowExampleWord();
    }

    showWordPronunciation(): boolean {
        return this.wordPronunciationEnabled && this.modeHandler.isWordPronunciationEnabled();
    }

    showVirtualKeyboard(): boolean {
        return this.modeHandler.showVirtualKeyboard() && !this.isMobile();
    }

    showMicrophone(): boolean {
        return this.modeHandler.showMicrophone();
    }

    showTyping(): boolean {
        return this.modeHandler.showTyping();
    }

    showTranscript(): boolean {
        return this.modeHandler.showTranscript();
    }

    showMultipleChoice(): boolean {
        return this.modeHandler.showMultipleChoice();
    }

    showControls(): boolean {
        return this.modeHandler.showControls();
    }

    showScrambleHint(): boolean {
        return this.modeHandler.showScrambleHint();
    }

    isMarkAsKnownButtonEnabled(): boolean {
        return (this.markAsKnownButtonVisible || this.autoMarkAsKnownEnabled) && this.isAnswerCorrect();
    }

    showAudio(): boolean {
        return this.modeHandler.showAudio();
    }

    showFallback(): boolean {
        if (!this.showMicrophone() || this.isChecked()) {
            return false;
        }
        return this.microphoneWidgetStateService.isMicrophonePermissionDenied() || this.isRejectionThresholdPassed();
    }

    showSkipButton(): boolean {
        return !(this.isTimerExpired() || this.isChecked())
            && this.modeHandler.shouldShowSkipButton()
            && this.isSkipBehaviorEnabled;
    }

    shouldShowRank(): boolean {
        return this.showRank;
    }

    shouldShowListName(): boolean {
        return this.showListName;
    }

    shouldShowBand(): boolean {
        return this.showBand;
    }

    shouldShowQuizPagination(): boolean {
        return this.showQuizPagination;
    }

    shouldShowPreviouslyEncountered(): boolean {
        return !isUndefined(this.quizWord.previouslyEncountered) && this.showPreviouslyEncounteredVisible;
    }

    private onInput(index: number, letter: string): void {
        if (!this.modeHandler.allowLetterInput()
            || this.isLocked()
            || !letter
            || size(letter) > 1
            || /[^A-Za-z]/gi.test(letter)) {
            return;
        }
        this.onDelete();
        if (!this.isIndexReadOnly(index)) {
            this.pristine = false;
            this.answerSet[index] = toLower(head(letter));
            this.logger.log(index, letter, this.answerSet);
            this.modeHandler.setChecked(false);
            this.doCheck();
        }
        this.moveRight();
    }

    onKeydown(index: number, $event: KeyboardEvent): void {
        let letter = $event.key;
        $event.preventDefault();
        $event.stopPropagation();
        if (this.isLocked() || !letter || /[^A-Za-z]/gi.test(letter)) {
            return;
        }

        this.onInput(index, letter);
    }

    onVirtualInput(letter: string): void {
        this.onInput(this.currentIndex, letter);
    }

    onBackSpace(): void {
        if (this.isLocked()) {
            return;
        }
        if (this.answerSet[this.currentIndex]) {
            return this.onDelete();
        }

        this.moveLeft();
        this.onDelete();
    }

    onDelete(): void {
        if (this.isLocked()) {
            return;
        }
        this.answerSet[this.currentIndex] = "";
    }

    onEnter(): void {
        this.checkAnswer();
    }

    hideVirtualKeyboard(): void {
        this.learnStateService.setVirtualKeyboardVisibility(false);
    }

    onClick(): void {
        this.learnStateService.setVirtualKeyboardVisibility(true);
    }

    onSkip(): void {
        const checkedEvent = this.modeHandler.checkAnswer({
            currentOrthography: this.currentOrthography,
            answerSet: this.answerSet,
            typingCorrect: this.isLetterSetCorrect(),
            wordResult: this.currentWordResult,
            rejected: this.currentlyRejected,
            accepted: true,
            timeout: this.isTimerExpired() ? 1 : undefined,
            correctWordHeadId: this.example?.wordDetails[0]?.wordAdapter.wordHeadId,
            selectedWord: this.example?.wordDetails[0],
            accountPronunciationWordId: this.accountPronunciationWordId,
            wordInstanceId: this.wordInstanceId,
            courseId: this.courseId,
            skipped: true
        });

        map(this.getLetterSet(), (letter, index) => {
            this.modeHandler.updateLetterSet(index, {
                isReadOnly: false
            });
        });

        const correctAnswer = this.orthography || get(this.quizWord, "word.label");
        this.answerSet = correctAnswer.split("");

        this.handleCheckAnswerEvent(checkedEvent);

        timer(ANIMATION_FRAME)
            .pipe(
                takeUntil(this.getDestroyInterceptor()),
                takeUntil(this.reset$)
            )
            .subscribe(() => {
                this.setChecked(true);
                this.modeHandler.setSkipped(true);
                this.handleWordRecycling();
                this.changeDetectorRef.detectChanges();
            });
    }

    onMicReady(): void {
        if (this.getFileTransferMode() === WEBSOCKET_REQUEST_HANDLER) {
            this.recognizeAudio();
        }
    }

    onStop(): void {
        if (this.timer) {
            this.timer.pause();
        }
        this.microphoneWidgetStateService.setMicProcessing();
    }

    onRecordEnd(microphoneWidgetRecording): void {
        if (!microphoneWidgetRecording || !microphoneWidgetRecording.audioBlob) {
            if (!this.shouldShowExampleWord()) {
                fill(this.answerSet, "?");
            }
            return;
        }
        if (this.getFileTransferMode() === HTTP_REQUEST_HANDLER) {
            this.recognizeAudio();
        }
    }

    onSwitchMode(): void {
        this.closeModal();
        this.switchMode(this.getFallbackMode());
    }

    private emitAttempt(): void {
        let checkedEvent = this.modeHandler.checkAnswer({
            currentOrthography: this.currentOrthography,
            answerSet: this.answerSet,
            typingCorrect: this.isLetterSetCorrect(),
            wordResult: this.currentWordResult,
            rejected: this.currentlyRejected,
            accepted: false,
            quizWord: this.quizWord.word,
            wordInstanceId: this.wordInstanceId,
            accountPronunciationWordId: this.accountPronunciationWordId,
            selectedWord: this.getSelectedChoice(),
            timeout: this.isTimerExpired() ? 1 : undefined,
            correctWordHeadId: this.example?.wordDetail?.wordAdapter.wordHeadId
        });
        this.eventAttempt.emit(this.appendStateData(checkedEvent));
    }

    recognizeAudio(): void {
        let microphoneHandler = this.microphoneHandlerService.getHandler();
        if (!microphoneHandler) {
            return this.microphoneWidgetStateService.setMicrophoneError(ERROR_NOT_SUPPORTED, "No handler detected for platform");
        }

        let accountId = this.identityService.getAccountId();
        let sessionTypeId = ActivityConstants.SESSION_TYPE_CLIPLIST_WORD;
        let currentAudioInput = microphoneHandler?.getCurrentMicrophoneSelection();
        let fileTransferMode = this.getFileTransferMode();

        let additionalOptions = {
            wordInstanceID: this.wordInstanceId || this.getQuizWord().wordInstanceId,
            accountID: this.identityService.getAccountId(),
            activityTypeID: this.activityTypeId,
            dialogLineText: this.currentOrthography,
            translation: !!this.lineTranslation,
            fileType: microphoneHandler.getFormat(fileTransferMode),
            gain: microphoneHandler?.getGain() ?? "",
            microphone: currentAudioInput?.name ?? "",
            previousAudioLevelCount: 0,
            previousAverageVoiceLevel: 0,
            sessionTypeID: ActivityConstants.SESSION_TYPE_CLIPLIST_WORD,
            streamName: createStreamName(accountId, sessionTypeId),
            sessionLineTimeKey: buildSessionTimeKey()
        };

        this.microphoneWidgetStateService.setMicProcessing();
        let outputStream = microphoneHandler.getAudioOutputStream();
        if (this.getFileTransferMode() === WEBSOCKET_REQUEST_HANDLER) {
            outputStream.generateAudioObservables();
        }

        this.recognizerModelService.recognizeAudio({
            solution: this.microphoneHandlerService.getSolution(),
            audioStreamObservable: outputStream.getObservable(fileTransferMode),
            additionalOptions: additionalOptions,
            recognizerType: this.getRecognizerType(),
            recognizerMode: MODE_WORD,
            fileTransferMode: fileTransferMode,
            serviceVersion: "v2"
        }, this.trackingContext).pipe(
            rxJsFirst(),
            catchError(error => {
                this.logger.error(error);
                return of(undefined);
            }),
            finalize(() => {
                this.finalizeMicrophone("exam recognition end");
            }),
            takeUntil(this.getDestroyInterceptor()),
            takeUntil(this.reset$)
        ).subscribe((currentSpeechResult: RecognizerResult) => {
            this.pristine = false;
            this.currentAudioUrl = undefined;
            this.currentWordResult = undefined;
            this.currentlyRejected = undefined;
            if (!currentSpeechResult) {
                this.rejectionCounter += 1;
                this.finalizeMicrophone("exam recognition no result");
                return;
            }

            if (currentSpeechResult.isRecordingRejected()) {
                this.microphoneWidgetStateService.setMicrophoneError(ERROR_REJECTED, ERROR_REJECTED);
                this.microphoneWidgetStateService.setRejectionCode(currentSpeechResult.getRejectionCode());
                this.currentlyRejected = true;
                if (!this.shouldShowExampleWord()) {
                    fill(this.answerSet, "?");
                }
                // It is commented for BC-74285
                //this.emitAttempt();
                this.rejectionCounter += 1;
                return;
            }

            this.currentlyRejected = false;
            this.currentAudioUrl = currentSpeechResult.getAudioUrl();
            this.currentWordResult = currentSpeechResult.findWordsByWordInstanceId(this.wordInstance.wordInstanceId, this.currentOrthography);
            this.logger.log("Word Result", this.currentWordResult, this.currentWordResult?.isMatch());

            if (this.currentWordResult?.isMatch()) {
                return this.checkAnswer();
            }
            if (!this.shouldShowExampleWord()) {
                fill(this.answerSet, "?");
                // It is commented for BC-74285
                //this.emitAttempt();
            }
        });
    }

    checkAnswer(): void {
        if (this.isLocked() || this.isPristine() && !this.isTimerExpired()) {
            return;
        }

        const checkedEvent = this.modeHandler.checkAnswer({
            currentOrthography: this.currentOrthography,
            answerSet: this.answerSet,
            typingCorrect: this.isLetterSetCorrect(),
            wordResult: this.currentWordResult,
            rejected: this.currentlyRejected,
            accepted: true,
            quizWord: this.quizWord.word,
            wordInstanceId: this.wordInstanceId,
            wordId: this.wordInstance.wordAdapter.wordId,
            courseId: this.courseId,
            accountPronunciationWordId: this.accountPronunciationWordId,
            selectedWord: this.getSelectedChoice(),
            timeout: this.isTimerExpired() ? 1 : undefined,
            correctWordHeadId: this.example?.wordDetails?.[0]?.wordAdapter?.wordHeadId
        });
        checkedEvent.courseId = this.courseId ? this.courseId : undefined;

        this.handleCheckAnswerEvent(checkedEvent);
        this.handleWordRecycling();

        timer(ANIMATION_FRAME)
            .pipe(takeUntil(this.getDestroyInterceptor()))
            .subscribe(() => {
                this.setChecked(true);
            });

        this.answerSet = checkedEvent.answerSet;

        if (this.modeSettings.autoComplete) {
            this.setComplete();
        }

        this.changeDetectorRef.detectChanges();
    }

    private doCheck(): void {
        if ((this.isComplete() && this.modeSettings.autoCheck) || this.isLetterSetCorrect()) {
            return this.checkAnswer();
        }
    }

    checkChoice(choice?: XWordDetail): void {
        if (this.isChecked()) {
            return;
        }

        this.pristine = false;
        this.setSelectedChoice(choice);
        this.checkAnswer();

        // Multiple choice question should auto advanced to the next question after transition time passed
        if (this.isAnswerCorrect() && !this.isSkipped()) {
            const TRANSITION_TIME = 3500;
            timer(TRANSITION_TIME)
                .pipe(
                    takeUntil(this.getDestroyInterceptor()),
                    takeUntil(this.reset$)
                )
                .subscribe(() => {
                    this.setComplete();
                });
        }
    }

    handleWordRecycling(): void {
        const shouldRecycleWord = this.isRecycleEnabled()
            && ((this.isSkipped() && this.isRecyclingSkippedWordsEnabled)
                || (!this.isAnswerCorrect() && !this.isSkipped() && this.isRecyclingMissedWordsEnabled));

        if (shouldRecycleWord) {
            return this.eventRecycleWord.emit(this.quizWord);
        }
    }

    handleCheckAnswerEvent(event: ExamQuestionCheckedEvent): void {
        this.eventAnswer.emit(this.appendStateData(event));

        if (this.isAnswerCorrect() && this.isAutoMarkAsKnownEnabled()) {
            this.markAsKnown(true);
        }
    }

    private appendStateData(checkedEvent: ExamQuestionCheckedEvent): ExamQuestionCheckedEvent {
        return assign({}, checkedEvent, {
            mode: this.mode,
            audioUrl: this.currentAudioUrl
        });
    }

    moveLeft(): void {
        if (this.currentIndex == 0
            || this.isIndexReadOnly(this.currentIndex - 1)) {
            return;
        }

        this.currentIndex -= 1;
        let letterSet = this.modeHandler.getLetterSet();
        if (letterSet[this.currentIndex] && letterSet[this.currentIndex].isSpecialChar) {
            this.moveLeft();
        }
    }

    moveRight(): void {
        let letterSet = this.modeHandler.getLetterSet();
        if (this.currentIndex >= size(letterSet) - 1) {
            return;
        }
        this.currentIndex += 1;
        if (letterSet[this.currentIndex] && letterSet[this.currentIndex].isSpecialChar) {
            this.moveRight();
        }
    }

    private finalizeMicrophone(from?: string): void {
        let microphoneHandler = this.microphoneHandlerService.getHandler();
        if (!microphoneHandler) {
            return;
        }
        if (microphoneHandler.isRecording()) {
            microphoneHandler.stopRecording(from);
        }
        this.microphoneWidgetStateService.setMicReady();
        if (this.timer) {
            this.timer.resume();
        }
    }

    private reportError(error: any): void {
        this.eventError.emit(error);
    }

    reportVideoError(error: any): void {
        this.logger.error("VideoLoadFailed", {
            dialogId: get(this.currentDialogLine, "dialogID"),
            dialogLineId: get(this.currentDialogLine, "dialogLineID"),
            videoUrl: this.videoUrl,
            errorMessage: error
        });
    }

    playAudio(): void {
        if (this.audio.hasError()) {
            this.playVideo();
        }

        this.audio.play()
            .then(() => {
                if (this.audio.hasError()) {
                    this.playVideo();
                }
            })
            .catch((error) => {
                this.logger.error("Error on playing audio", error);
                this.playVideo();
            });

        this.audio.onEnd(() =>
            timer(300)
                .pipe(
                    takeUntil(this.getDestroyInterceptor()),
                    takeUntil(this.reset$)
                )
                .subscribe(() => {
                    this.playVideo();
                }));
    }

    playVideo(): void {
        this.setShowPlayButton(false);
        this.setVideoEnabled(true);
        const video = this.videoFactory.getInstance(this.getVideoId());
        if (video) {
            video.play()
                .then(() => {
                    this.logger.log("video is playing...");
                    this.setVideoPlaying(true);
                    this.setShowPlayButton(false);
                    this.changeDetectorRef.detectChanges();
                })
                .catch(() => {
                    this.logger.log("error on video playing...");
                    this.setVideoEnabled(false);
                    this.setShowPlayButton(true);
                });
        }
    }

    videoEnded(): void {
        this.setVideoEnabled(false);
        this.setVideoPlaying(false);
        this.setShowPlayButton(true);
    }

    exitQuiz(): void {
        this.closeModal();
        this.eventExitQuiz.emit();
    }

    closeModal(): void {
        if (this.modalRef) {
            this.modalRef.close();
        }
    }

    launchModal(content, modalOptions?: NgbModalOptions): void {
        this.modalRef = this.modalService.open(content, assign({
            size: "lg",
            centered: true
        }, modalOptions));
    }

    override ngOnDestroy(): void {
        this.typingSharedService.destroy();
        this.timer?.destroy();
        this.destroySubscriptions();
    }
}
