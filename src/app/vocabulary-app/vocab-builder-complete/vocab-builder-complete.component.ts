import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output
} from "@angular/core";
import "global-styles/adaptive-quiz.css";
import { VocabBuilderProgressService } from "../vocab-builder-progress.service";
import { VocabBuilderStateService } from "../vocab-builder-state.service";
import { IdentityService } from "../../common/identity.service";
import { FeatureService } from "../../common/feature.service";
import { Logger } from "../../common/logger";
import { DEFAULT_MODAL_OPTIONS, ModalService } from "../../common/modal.service";
import { SubscriptionAbstract } from "../../subscription.abstract";
import { ADAPTIVE_OVLT2_SETTINGS, VltQuizScore } from "../../../types/vocab-level-test";
import { finalize, mergeMap, takeUntil } from "rxjs/operators";
import { of } from "rxjs";
import { Difficulty } from "../../../types/difficulty";
import { includes, isEqual } from "lodash-es";
import { LAST_LEVEL_TEST_DIFFICULTY } from "../../../types/vocab-level-test-reference";
import { MESSAGE_CODE_COMPLETE } from "../../../types/vocabulary-quiz";
import { ERROR_KEY_LIST_RANK_EXCEEDED } from "../../../types/vocab-builder-reference";
import { MyWordsListTypeIds } from "../../../types/word-list-reference";
import { VocabBuilderSetting } from "../../../types/vocab-builder-settings";


@Component({
    selector: "ec-vocab-builder-complete",
    templateUrl: "vocab-builder-complete.component.html",
    styleUrls: ["vocab-builder-complete.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class VocabBuilderCompleteComponent extends SubscriptionAbstract implements OnInit, OnDestroy {
    @Input() practice: boolean = false;
    @Input() pronunciationQuiz: boolean = false;
    @Input() wordPronunciationQuiz: boolean = false;
    @Input() phonemePronunciationQuiz: boolean = false;
    @Input() isLevelUpdateEnabled: boolean = false;
    @Input() levelTest: boolean = false;
    @Input() fetchScoreDetail: boolean = false;
    @Input() showBandScore: boolean = false;
    @Input() classId: number;
    @Input() userDifficultyLevel: number = 0;

    @Output() eventStartQuiz = new EventEmitter<boolean>();
    @Output() eventViewWords = new EventEmitter<void>();
    @Output() eventStartNewPractice = new EventEmitter<void>();
    @Output() eventFinishedWordList = new EventEmitter<number>();
    @Output() eventClearAccountWordListsReference = new EventEmitter<void>();

    private userCurrentLevel;

    private logger = new Logger();

    constructor(private vocabBuilderStateService: VocabBuilderStateService,
                private vocabBuilderProgressService: VocabBuilderProgressService,
                private modalService: ModalService,
                private identityService: IdentityService,
                private featureService: FeatureService,
                private changeDetectorRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit(): void {
        this.initialize();
    }

    isClassTest(): boolean {
        return !!this.classId;
    }

    isLevelTest(): boolean {
        return this.levelTest;
    }

    isPronunciationQuiz(): boolean {
        return this.pronunciationQuiz;
    }

    isWordPronunciationQuiz(): boolean {
        return this.wordPronunciationQuiz;
    }

    isPhonemePronunciationQuiz(): boolean {
        return this.phonemePronunciationQuiz;
    }

    isOvlt2(): boolean {
        return this.getSettings().levelTestSettingId == ADAPTIVE_OVLT2_SETTINGS.levelTestSettingId;
    }

    private initialize(): void {
        this.userCurrentLevel = this.userDifficultyLevel;

        if (this.shouldShowBandScore() || this.shouldFetchLevelTestScoreDetail()) {
            this.fetchLevelTestScoreAndDetail();
        }
    }

    private fetchLevelTestScoreAndDetail(): void {
        this.setScoreCalculationLoading(true);

        this.vocabBuilderStateService.fetchLevelTestScoreAndDetail(this.shouldShowBandScore(), this.shouldFetchLevelTestScoreDetail())
            .pipe(
                takeUntil(this.getDestroyInterceptor()),
                mergeMap(() => {
                    if (this.isLevelTestPassed()) {
                        this.eventClearAccountWordListsReference.emit();
                    }
                    if (!this.isLastUserLevel(this.userCurrentLevel)) {
                        return this.identityService.refreshIdentity(this.identityService.getAccountId());
                    }
                    return of(undefined);
                }),
                finalize(() => {
                    this.changeDetectorRef.detectChanges();
                })
            )
            .subscribe(() => {
                this.setScoreCalculationLoading(false);
                this.setUserCurrentLevel();
                this.vocabBuilderStateService.setCompleted(true);
            });
    }

    updateLevel(level: number): void {
        this.setLevelUpdateProcessing(true);

        this.vocabBuilderStateService.updateLevel(level)
            .pipe(
                takeUntil(this.getDestroyInterceptor()),
                mergeMap(() => this.identityService.refreshIdentity(this.identityService.getAccountId())))
            .subscribe(() => {
                this.eventClearAccountWordListsReference.emit();
                this.setLevelUpdateProcessing(false);
                this.setUserCurrentLevel();
                this.changeDetectorRef.detectChanges();
            });
    }

    getCurrentVocabListName(): string {
        return this.vocabBuilderStateService.getCurrentVocabListName();
    }

    // It is used for VLT, if it is account VLT then fetch it list rank from total count
    getTestRank(): number {
        if (!this.classId) {
            return this.getCurrentTotal();
        }
        return this.vocabBuilderStateService.getCurrentSetting().listRank;
    }

    getUserLevel(): number {
        return this.userCurrentLevel;
    }

    getUserPreviousLevel(): number {
        return this.getUserLevel() - 1;
    }

    getNextLevelTestDifficulty(): number {
        return this.getCurrentLevelTestDifficulty() + 1;
    }

    getDifficultyTypeName(type: string): string {
        return this.vocabBuilderProgressService.getDifficultyTypeName(type);
    }

    getDifficultyType(): string | undefined {
        return this.vocabBuilderProgressService.getDifficultyType();
    }

    getDifficultyLevelName(difficultyLevel: number, showMicroLevel: boolean = true): string | undefined {
        return this.vocabBuilderProgressService.getDifficultyLevelName(difficultyLevel, showMicroLevel);
    }

    setUserCurrentLevel(): void {
        this.userCurrentLevel = this.identityService.getDifficultyLevel();
    }

    getNewLevel(): number {
        // If level test is passed upgrade user
        if (this.isLevelTestPassed()) {
            return this.userDifficultyLevel + 1;
        }
        // If level test is not passed downgrade user
        return this.userDifficultyLevel - 1;
    }

    getLastUserLevel(): number {
        return Difficulty.LEVEL_7;
    }

    getRecommendedLevel(): number {
        return this.getVltQuizScore().computedBand;
    }

    getVltQuizScore(): VltQuizScore {
        return this.vocabBuilderProgressService.getVltQuizScore();
    }

    getQuizLength(): number | undefined {
        return this.vocabBuilderStateService.getQuizLength() + this.vocabBuilderProgressService.getPreviousIndex();
    }

    getRemainingLength(): number {
        return this.vocabBuilderStateService.getQuizLength();
    }

    getCorrectAnswerCount(): number {
        return this.vocabBuilderProgressService.getCorrectAnswerCount(this.isActivityQuiz(), this.levelTest);
    }

    getCurrentTotal(): number {
        if (this.isActivityQuiz() || this.pronunciationQuiz) {
            return this.vocabBuilderProgressService.getTotalAnsweredQuestionsLength();
        }
        return this.vocabBuilderProgressService.getCurrentTotal() || this.vocabBuilderProgressService.getTotalAnsweredQuestionsLength();
    }

    getCurrentWordListTypeId(): number {
        return this.vocabBuilderStateService.getCurrentWordListTypeId();
    }

    getScoreOutOfOneHundered(score: number = 0): number {
        return score * 100;
    }

    getCurrentLevelTestDifficulty(): number {
        return this.vocabBuilderStateService.getCurrentLevelTestDifficulty();
    }

    getErrorKey(): string {
        return this.vocabBuilderStateService.getErrorKey();
    }

    setScoreCalculationLoading(loading: boolean): void {
        this.vocabBuilderStateService.setScoreCalculationLoading(loading);
    }

    setLevelUpdateProcessing(loading: boolean): void {
        this.vocabBuilderStateService.setLevelUpdateProcessing(loading);
    }

    isLastUserLevel(level): boolean {
        return isEqual(level, this.getLastUserLevel());
    }

    isLastLevelTest(): boolean {
        return this.getCurrentLevelTestDifficulty() === LAST_LEVEL_TEST_DIFFICULTY;
    }

    isExtraLevelTest(): boolean {
        return this.getCurrentLevelTestDifficulty() > this.getLastUserLevel();
    }

    isLevelUpdateProcessing(): boolean {
        return this.vocabBuilderStateService.isLevelUpdateProcessing();
    }

    isLoading(): boolean {
        return this.vocabBuilderStateService.isLoading();
    }

    isPerfect(): boolean {
        if (this.levelTest) {
            return this.getCorrectAnswerCount() == this.getTestRank();
        }
        return this.vocabBuilderProgressService.isPerfect(this.isActivityQuiz())
            || !this.hasMissedWords();
    }

    isTestResultPerfect(): boolean {
        return isEqual(this.getCorrectAnswerCount(), this.getTestRank());
    }

    isBandComplete(): boolean {
        return this.vocabBuilderProgressService.getState() == MESSAGE_CODE_COMPLETE;
    }

    isErrorState(): boolean {
        return this.vocabBuilderStateService.isErrorState();
    }

    isRestartQuizEnabled(): boolean {
        return this.vocabBuilderStateService.getQuizDataSource().restartQuizEnabled();
    }

    isActivityQuiz(): boolean {
        return this.vocabBuilderStateService.getQuizDataSource().isActivityQuiz();
    }

    isPractice(): boolean {
        return this.practice;
    }

    isScoreCalculationLoading(): boolean {
        return this.vocabBuilderStateService.isScoreCalculationLoading();
    }

    isLevelTestPassed(): boolean {
        return isLevelTestPassed(this.userDifficultyLevel, this.getScoreOutOfOneHundered(this.getVltQuizScore()?.score));
    }

    isLevelTestScoreUnderDowngradeThreshold(): boolean {
        return isLevelTestScoreUnderDowngradeThreshold(this.userDifficultyLevel, this.getScoreOutOfOneHundered(this.getVltQuizScore()?.score));
    }

    isLevelUpdated(): boolean {
        return this.vocabBuilderStateService.isLevelUpdated();
    }

    launchUserLevelSelector(): void {
        const levelSelectorModalRef = this.modalService.open(
            UserLevelSelectorAppModalComponent, {
                ...DEFAULT_MODAL_OPTIONS,
                centered: false,
                backdrop: "static"
            });
        levelSelectorModalRef.componentInstance.level = this.getUserLevel();
        levelSelectorModalRef.componentInstance.siteLanguage = this.identityService.getSiteLanguage();
        levelSelectorModalRef.componentInstance.eventComplete
            .pipe(takeUntil(this.getDestroyInterceptor()))
            .subscribe(() => this.modalService.close());
    }

    isFirstLevel(): boolean {
        return this.getUserLevel() == 1;
    }

    isRankExceeded(): boolean {
        return includes(ERROR_KEY_LIST_RANK_EXCEEDED, this.vocabBuilderStateService.getErrorKey());
    }

    hasMissedWords(): boolean {
        return this.vocabBuilderProgressService.hasIncorrect();
    }

    shouldUserLevelUpdated(): boolean {
        if (this.userDifficultyLevel == 1 && this.isLevelTestScoreUnderDowngradeThreshold()) {
            // If user level is 1 then level will remain the same, and there will be no downgrade.
            return false;
        }
        return this.isLevelUpdateEnabled && (this.isLevelTestPassed() || this.isLevelTestScoreUnderDowngradeThreshold());
    }

    shouldShowBandScore(): boolean {
        return this.showBandScore;
    }

    shouldFetchLevelTestScoreDetail(): boolean {
        return this.fetchScoreDetail;
    }

    shouldShowPracticeIcon(): boolean {
        if (this.isLevelTest()) {
            return false;
        }
        return this.isErrorState() || this.isBandComplete() || this.isPractice();
    }

    shouldShowOvltIcon(): boolean {
        return this.isLevelTest();
    }

    shouldShowTestIcon(): boolean {
        return !this.shouldShowPracticeIcon() && !this.isLevelTest();
    }

    shouldShowLevelTestFeedback(): boolean {
        return this.isBandComplete() && this.levelTest && !this.isScoreCalculationLoading();
    }

    shouldShowStartNewPracticeButton(): boolean {
        return this.isPractice();
    }

    shouldShowVltRecommendedLevel(): boolean {
        return this.featureService.getFeature("isVltRecommendedLevelEnabled") ?? false;
    }

    onClickStartNewPractice(): void {
        this.eventStartNewPractice.emit();
        if (!this.pronunciationQuiz) {
            this.reset();
        }
    }

    onClickViewWords(): void {
        this.eventViewWords.emit();
    }

    goToViewWordsUrl(): void {
        this.vocabBuilderStateService.publish(VocabBuilderStateService.EVENT_ON_APP_GO_TO_VIEW_WORDS_CLICK, MyWordsListTypeIds.Missed);
    }

    goToVideos(): void {
        this.vocabBuilderStateService.publish(VocabBuilderStateService.EVENT_ON_APP_GO_TO_VIDEOS);
    }

    goToMyEnglish(): void {
        this.vocabBuilderStateService.publish(VocabBuilderStateService.EVENT_ON_GO_TO_MY_ENGLISH);
    }

    goToVocabBuilder(): void {
        this.vocabBuilderStateService.publish(VocabBuilderStateService.EVENT_ON_APP_GO_TO_VOCAB_BUILDER);
    }

    goToPreviousActivity(): void {
        this.vocabBuilderStateService.publish(VocabBuilderStateService.EVENT_ON_APP_GO_TO_PREVIOUS_ACTIVITY);
    }

    startQuiz(newQuiz: boolean = false): void {
        this.eventStartQuiz.emit(newQuiz);
    }

    onOpenSettings(): void {
        this.vocabBuilderStateService.setSettingsDrawerEnabled(true);
    }

    getSettings(): VocabBuilderSetting {
        return this.vocabBuilderStateService.getCurrentSetting();
    }

    reset(finishedListId?: number): void {
        if (finishedListId) {
            this.logger.log("Setting the finished word list id", finishedListId);
            this.vocabBuilderProgressService.setFinishedListId(finishedListId);
            this.eventFinishedWordList.emit(finishedListId);
            return;
        }
        this.vocabBuilderStateService.reset();
    }

    closeApp(): void {
        this.vocabBuilderStateService.close();
    }

    ngOnDestroy(): void {
        this.destroySubscriptions();
    }
}
