import {
    Component,
    EventEmitter,
    HostListener,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef,
    ViewChild
} from "@angular/core";
import { NgbModal, NgbModalOptions, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { forkJoin, map as rxJsMap, Observable, of, Subject } from "rxjs";
import { catchError, debounceTime, mergeMap, takeUntil, tap } from "rxjs/operators";
import { DEFAULT_VOCAB_BUILDER_ACTIVITY } from "../../types/activity";
import { DEFAULT_WORD_LIST_TYPE_ID, LAST_LEVEL_LIST, MY_WORDS_LISTS, WordList } from "../../types/word-list-reference";
import {
    MyWordsWordListSettings,
    VOCAB_BUILDER_STYLE_ID_MY_WORDS,
    VocabBuilderClassSetting,
    VocabBuilderSetting,
    VocabBuilderSettings
} from "../../types/vocab-builder-settings";
import { AdaptiveQuizWord, MESSAGE_CODE_COMPLETE, XQuizWord, XWordQuiz } from "../../types/vocabulary-quiz";
import { VocabularyAppSharedService } from "./vocabulary-app-shared.service";
import { SubscriptionAbstract } from "../subscription.abstract";
import { QuizDataSourceAdapter } from "./quiz-data-source/quiz-data-source-adapter";
import { ExamQuestionCheckedEvent } from "./exam-question/mode-handler/mode-handler-abstract";
import { QuizDataSourceAbstract } from "./quiz-data-source/quiz-data-source-abstract";
import { MyWordState } from "../../types/my-word-state-v2";
import {
    assign,
    cloneDeep,
    filter,
    find,
    findIndex,
    head,
    includes,
    isEmpty,
    isEqual,
    isUndefined,
    map,
    max,
    merge
} from "lodash-es";
import { MODE_TYPING, VocabBuilderReference } from "../../types/vocab-builder-reference";
import { WordListLearned } from "../../types/word-list-learned";
import { MyWordStateV1 } from "../../types/my-word-state-v1";
import { WordV1 } from "../../types/word-v1";
import { QuizType } from "./quiz-data-source/quiz-type";
import { Logger } from "../common/logger";
import { StopWatch } from "../common/stopwatch";
import { VocabBuilderStateService } from "./vocab-builder-state.service";
import { VocabBuilderProgressService } from "./vocab-builder-progress.service";
import { AdaptiveQuizModelService } from "../model/adaptive-quiz-model.service";
import { VocabBuilderModelService } from "../model/vocab-builder-model.service";
import { ReferenceModelService } from "../model/reference-model.service";
import { WordProgressModelService } from "../model/word-progress.model.service";
import { IdentityService } from "../common/identity.service";
import { Browser } from "../common/browser";
import { SharedWordHeadProgress } from "../../types/word-head-progress";

@Component({
    selector: "ec-vocab-builder-app",
    templateUrl: "vocab-builder-app.component.html",
    styleUrls: ["vocab-builder-app.component.scss"]
})
export class VocabBuilderAppComponent extends SubscriptionAbstract implements OnInit, OnDestroy {
    @ViewChild("vocabQuizExit", {static: false}) vocabQuizExit: TemplateRef<any>;

    // wordDetails need to be passed from Pronunciation to get real wordInstanceId
    @Input() wordDetails: Map<number, WordV1>;
    // wordInstanceIds to be quizzed, it is used for Pronunciation Quizzes
    @Input() wordInstanceIds: number[];
    @Input() wordIds: number[];

    // It is used for modeId which is available in client but not in services, it helps in mode-handler-adapter
    @Input() questionModeId: number = 0;
    // Below Inputs to control the quiz type for pronunciation
    @Input() isWordPronunciationQuiz: boolean = false;
    @Input() isPhonemePronunciationQuiz: boolean = false;
    // Controls starting quiz automatically
    @Input() autoStartQuiz: boolean = false;
    @Input() activityId: number;
    @Input() activityTypeId: number;
    @Input() levelTestSettingId: number;
    @Input() wordListTypeId: number;
    @Input() vocabBuilderModeIds: number[];
    @Input() courseId: number;
    //to be able to provide full screen vb we need to know parent component header height
    @Input() parentHeaderHeight: number = VocabBuilderAppComponent.PARENT_HEADER_HEIGHT;

    @Output() eventDestroy: EventEmitter<void> = new EventEmitter();
    @Output() backToPreviousActivity: EventEmitter<void> = new EventEmitter();
    @Output() eventHideTabs: EventEmitter<boolean> = new EventEmitter();
    @Output() eventViewWords = new EventEmitter<void>();
    @Output() eventStartNewPractice = new EventEmitter<void>();

    private numberOfQuizItems: number;
    private vocabBuilderStyleId: number;
    private classId: number;
    private classTestExamId: number;
    private sharedMeaningIds: number[];
    private startingRank: number;
    private startingBand: number;
    private listRank: number;
    private shouldAutoStart: boolean = false;
    private isWordsPreSelected: boolean = false;
    private backButtonEnabled: boolean = false;
    private reviewItemRatio: number | undefined;

    // curatedLevelTestId, levelTestSettingId are for VPT
    private curatedLevelTestId: number;

    private logger = new Logger();

    private ERROR_NAVIGATION_UNAVAILABLE: number = 405;

    //calculation of ec header and vocabulary header
    private totalHeaderHeight: number = 0;
    private innerScreenHeight: number = 0;

    private modalRef: NgbModalRef;

    private quizStartPageLoadingStopWatch = new StopWatch();
    private viewWordsQuizStartLoadingStopWatch = new StopWatch();

    static readonly PARENT_HEADER_HEIGHT = 50;

    // controls the VB paywall. Before this gets initialized, no VB module is rendered on the page.
    private vocabPayWallInitialized = true;

    private resizeSubject = new Subject<number>();
    private resizeObservable = this.resizeSubject
        .asObservable()
        .pipe(takeUntil(this.getDestroyInterceptor()), debounceTime(250));

    // BC-79580
    private shouldProceedToNextLevelList: boolean = false;

    @HostListener("window:resize", ["$event"])
    onWindowResize(): void {
        this.resizeSubject.next(undefined);
    }

    constructor(private vocabularyAppSharedService: VocabularyAppSharedService,
                private vocabBuilderStateService: VocabBuilderStateService,
                private vocabBuilderProgressService: VocabBuilderProgressService,
                private adaptiveQuizModelService: AdaptiveQuizModelService,
                private vocabBuilderModelService: VocabBuilderModelService,
                private referenceModelService: ReferenceModelService,
                private wordProgressModelService: WordProgressModelService,
                private identityService: IdentityService,
                private modalService: NgbModal,
                private zone: NgZone) {
        super();
    }

    ngOnInit(): void {
        this.initialize();
    }

    initialize(): void {
        this.startLoadingStopWatches();

        this.setComponentHeight();

        this.vocabBuilderStateService.setLoading(true);

        this.initializeSubscriptions();
        this.initializeProgressPublishers();

        this.setQuizDataSource();
        // Same but with sharedMeaningIds
        this.setSelectedSharedMeaningIds();

        // This is needed for Pron Quiz, wordDetails need to be passed from Pronunciation tab to get real wordInstanceId
        this.setWordDetails();

        // Pronunciation Quizzes always use speaking modeId
        if (this.getQuizDataSource().getQuizModeIds()) {
            this.vocabBuilderModeIds = this.getQuizDataSource().getQuizModeIds();
        }

        this.initializeVocabBuilder();
    }

    private initializeSubscriptions(): void {
        this.initializeStateSubscribers();

        this.resizeObservable.subscribe(() => {
            this.updateScreenInnerHeight();
        });

        this.identityService.getObservable(IdentityService.EVENT_IDENTITY_UPDATE)
            .pipe(
                takeUntil(this.getDestroyInterceptor()),
                tap(() => {
                    if (this.getQuizDataSource().isAccountVlt()) {
                        return;
                    }
                    this.resetWordList();
                })
            )
            .subscribe();
    }

    private initializeStateSubscribers(): void {
        this.vocabBuilderStateService.subscribe(VocabBuilderStateService.EVENT_START, () => {
            if (this.getQuizDataSource().shouldSendStartCompleteEvents(this.wordListTypeId)) {
                this.vocabBuilderProgressService.sendActivityQuizEvents(VocabBuilderProgressService.EVENT_ON_START_QUIZ);
            }
        });

        this.vocabBuilderStateService.subscribe(VocabBuilderStateService.EVENT_FETCH_STATE, (adaptiveQuizWord?: AdaptiveQuizWord) => {
            const accountId = this.identityService.getAccountId();

            if (!this.shouldAutoAdvancedToNextQuiz()) {
                this.vocabBuilderStateService.setCompleted(true);
                this.vocabBuilderStateService.setLoading(false);
                this.onFireHideParentTabs(false);
            }

            if (this.shouldSendCompleteEvent()) {
                this.vocabBuilderProgressService.sendActivityQuizEvents(VocabBuilderProgressService.EVENT_ON_COMPLETE_QUIZ, this.courseId);
            }

            if (this.shouldTriggerCompleteEndpoint()) {
                this.vocabBuilderStateService.setLoading(true);
                this.completeQuiz(accountId, adaptiveQuizWord);
            }
        });

        this.vocabBuilderStateService.subscribe(VocabBuilderStateService.EVENT_APPEND_QUIZDATA, (VocabBuilderQuiz) => {
            this.vocabBuilderStateService.appendQuizData(VocabBuilderQuiz);
            this.vocabBuilderStateService.setLoading(false);
            this.vocabBuilderStateService.setQuizLoading(false);
        });

        this.vocabBuilderStateService.subscribe(VocabBuilderStateService.EVENT_RESET, (resetLists) => {
            this.vocabBuilderStateService.setLoading(true);

            if (resetLists) {
                this.logger.log("Resetting the lists and rehydrating the component");
                this.resetWordList();
                return;
            }

            this.reset();
            this.fetchMyWordListCounts()
                .pipe(
                    takeUntil(this.getDestroyInterceptor()),
                    mergeMap(() => this.fetchSettings(this.identityService.getAccountId(), false)),
                    tap(() => this.vocabBuilderStateService.setLoading(false)),
                    mergeMap(() => {
                        const wordListsTypeIds = this.vocabBuilderStateService.getNonMyWordsWordListsTypeIds();
                        return this.vocabBuilderStateService.fetchWordListsProgress(wordListsTypeIds);
                    })
                )
                .subscribe();
        });

        this.vocabBuilderStateService.subscribe(VocabBuilderStateService.EVENT_FETCH_NEXT_DATA, () => {
            this.generateQuiz(this.vocabBuilderStateService.getCurrentSetting(), true);
        });

        this.vocabBuilderStateService.subscribe(VocabBuilderStateService.EVENT_ON_APP_GO_TO_VOCAB_BUILDER, () => {
            this.activityTypeId = DEFAULT_VOCAB_BUILDER_ACTIVITY.activityTypeID;
            this.setQuizDataSource(this.activityTypeId);
            this.resetWordList();
        });

        this.vocabBuilderStateService.subscribe(VocabBuilderStateService.EVENT_ON_ERROR, (error) => {
            this.logger.error("Error Detected", error);
            this.sendAnalyticsEvent("v2/VocabBuilderEngineErrors", {
                errorMessage: error.toString()
            });

            const completedMessage = "this quiz activity has already been completed";
            const isErrorNavigationUnavailable = isEqual(error?.status, this.ERROR_NAVIGATION_UNAVAILABLE);
            const shouldShowEndScreen = this.getQuizDataSource().shouldShowEndScreenOnCompletedQuizReaccess();

            if (isErrorNavigationUnavailable
                && includes(error.error.key, completedMessage) && shouldShowEndScreen) {
                this.vocabBuilderProgressService.setState(MESSAGE_CODE_COMPLETE);
                this.vocabBuilderStateService.setLoading(false);
                this.vocabBuilderStateService.setQuizLoading(false);
                return this.vocabBuilderStateService.setCompleted(true);
            }

            this.vocabBuilderStateService.setErrorState(true);
        });
    }

    private initializeSettings(accountId: number): Observable<VocabBuilderSettings> {
        this.logger.log("Initializing Settings...");
        return this.vocabBuilderStateService
            .getQuizDataSource()
            .fetchSettings(accountId, {activityId: this.activityId, useAccountWordLists: true, useCache: true})
            .pipe(
                takeUntil(this.getDestroyInterceptor()),
                tap((settings: VocabBuilderSettings) => {

                    const combinedSettings = merge(settings, MyWordsWordListSettings);
                    this.vocabBuilderStateService.setVocabBuilderSettings(combinedSettings);

                    const shouldUseRawSettings = this.vocabBuilderStateService.getQuizDataSource().shouldUseRawSettings();
                    if (shouldUseRawSettings) {
                        this.logger.log("Using raw settings as current settings...");
                        let accountSettings = this.getQuizDataSource().getSettings(combinedSettings) as VocabBuilderSetting;
                        this.updateCurrentSetting(accountSettings);
                    }
                    if (this.shouldProceedToNextLevelList) {
                        this.proceedToNextLevelList();
                        return;
                    }
                    //if wordListTypeId which comes from router onInit is not a my word list then use account setting's wordListTypeId
                    const shouldUseAccountSettings = this.vocabBuilderStateService.getQuizDataSource().shouldUseAccountSettings();
                    const hasSettings = this.hasCurrentSetting();
                    const hasWordListTypeId = !isEqual(this.wordListTypeId, DEFAULT_WORD_LIST_TYPE_ID) && this.wordListTypeId;

                    if (shouldUseAccountSettings && !hasWordListTypeId && hasSettings) {
                        this.wordListTypeId = this.vocabBuilderStateService.getCurrentSetting().wordListTypeId | 0;
                        this.onWordListChanged(this.wordListTypeId);
                    }
                })
            );
    }

    private initializeProgressPublishers(): void {
        map(VocabBuilderProgressService.PROGRESS_DATA_EVENTS, (eventName: string) => {
            this.vocabBuilderProgressService.subscribe(eventName, (event) => {
                this.logger.log("sending evet", event);
            });
        });
    }

    private initializeVocabBuilder(): void {
        this.vocabBuilderProgressService
            .generateDifficultyLevels()
            .pipe(
                takeUntil(this.getDestroyInterceptor())
            ).subscribe();
    }

    private fetchMyWordListCounts(): Observable<MyWordState> {
        if (!this.getQuizDataSource().shouldFetchMyWordsListsCounts()) {
            return of(undefined);
        }

        return this.vocabBuilderStateService.fetchMyWordListCountsSharedMeaning()
            .pipe(
                takeUntil(this.getDestroyInterceptor())
            );
    }

    private fetchReferenceData(): Observable<WordListLearned[]> {
        return this.fetchVocabBuilderReference()
            .pipe(
                takeUntil(this.getDestroyInterceptor()),
                tap(() => this.setQuizDataSource()),
                tap((vocabBuilderReference) => {
                    if (isUndefined(vocabBuilderReference) || !vocabBuilderReference) {
                        return this.onReferenceError();
                    }
                    this.vocabBuilderStateService.setReference(head(vocabBuilderReference));
                }),
                tap(() => this.vocabBuilderProgressService.setArrivalId(this.identityService.getArrivalId())),
                mergeMap(() => {
                    // If it is course quiz then fetch course quiz list, otherwise fetch VB lists
                    if (this.getQuizDataSource().shouldFetchActivityWordList()) {
                        return this.fetchActivityWordList();
                    }

                    // If it is going to be auto started, no need to fetch all wordLists
                    // If it is an accountVlt quiz, wordlists need to be fetched in order to get wordlist name
                    if (this.isAutoStart() && !this.getQuizDataSource().isAccountVlt()) {
                        return of([]);
                    }
                    return this.fetchAccountWordLists();
                }),
                mergeMap(() => this.fetchSettings(this.identityService.getAccountId())),
                mergeMap(() => this.generateQuiz(this.vocabBuilderStateService.getCurrentSetting(), this.isAutoStart())),
                tap(() => {
                    this.vocabBuilderStateService.setLoading(false);

                    this.quizStartPageLoadingStopWatch.stop();
                    if (!this.isAutoStart()) {
                        this.trackMetric("vocab-quiz-tab", this.quizStartPageLoadingStopWatch.getTime());
                    }
                    this.quizStartPageLoadingStopWatch.reset();
                }),
                mergeMap(() => {
                    if (this.isAutoStart() || this.courseId) {
                        return of([]);
                    }
                    const wordListsTypeIds = this.vocabBuilderStateService.getNonMyWordsWordListsTypeIds();
                    // autoStart and course quiz don't have to call this
                    return this.vocabBuilderStateService.fetchWordListsProgress(wordListsTypeIds);
                })
            );
    }

    private fetchVocabBuilderReference(): Observable<VocabBuilderReference[]> {
        return this.referenceModelService.getVocabBuilderReference(true, true)
            .pipe(
                catchError((error) => {
                    this.quizStartPageLoadingStopWatch.reset();
                    this.logger.log("getVocabBuilderReference error", error);
                    this.referenceModelService.clearReferenceCache("vocabBuilder");
                    this.onError(error);
                    return of([]);
                })
            );
    }

    private fetchSettings(accountId: number, applyOverrides: boolean = true): Observable<VocabBuilderSettings | VocabBuilderClassSetting | undefined> {
        if (!accountId) {
            return of(undefined);
        }
        this.logger.log("Fetching Quiz Settings...");

        const stopWatch = new StopWatch(true);

        return this.initializeSettings(accountId)
            .pipe(
                takeUntil(this.getDestroyInterceptor()),
                tap(() => {
                    this.trackMetric("v2/LoadVocabBuilderSettings", stopWatch.getTime());

                    this.loadWordListSettings(this.wordListTypeId);

                    if (this.isRecycleEnabled()) {
                        this.vocabBuilderStateService.generateLocalUserSettings()
                            .then(() => this.logger.log("Local user settings generated", accountId));
                    }

                    this.setQuizDataSource(this.activityTypeId);

                    this.updateCurrentSetting({
                        wordListTypeId: this.wordListTypeId,
                        vocabBuilderModeIds: this.vocabBuilderModeIds,
                        numberOfQuizItems: this.numberOfQuizItems,
                        vocabBuilderStyleId: this.vocabBuilderStyleId,
                        activityId: this.activityId,
                        activityTypeId: this.activityTypeId,
                        accountId: accountId,
                        curatedLevelTestId: this.curatedLevelTestId,
                        levelTestSettingId: this.levelTestSettingId,
                        listRank: this.listRank,
                        wordInstanceIds: this.wordInstanceIds,
                        wordIds: this.wordIds
                    });

                    if (this.classId && !isUndefined(this.reviewItemRatio)) {
                        this.vocabBuilderStateService.setReviewItemRatio(this.reviewItemRatio);
                    }

                    this.setStyle();

                    if (!applyOverrides) {
                        return;
                    }

                    const settingType = this.vocabBuilderStyleId
                        ? this.lowerCaseFirstLetter(this.vocabBuilderStateService.getVocabBuilderStyleNameById(this.vocabBuilderStyleId))
                        : undefined;

                    this.vocabBuilderStateService.setCurrentStyle({
                        band: this.startingBand,
                        rank: this.startingRank,
                        settingType: settingType,
                        sharedMeaningIds: this.sharedMeaningIds
                    });

                    if (this.hasCurrentSetting()) {
                        this.vocabularyAppSharedService.setNumberOfWordItems(this.vocabBuilderStateService.getCurrentSetting().numberOfQuizItems);
                    }

                    this.setStyle();

                    this.logger.log("Updated current style and set the settings");
                })
            );
    }

    private fetchActivityWordList(): Observable<WordList> {
        return this.adaptiveQuizModelService.getActivityWordList(this.activityId)
            .pipe(
                takeUntil(this.getDestroyInterceptor()),
                catchError(() => {
                    return of([]);
                }),
                tap((wordList: WordList) => {
                    this.vocabBuilderStateService.setWordLists(wordList);
                    this.vocabularyAppSharedService.setWordListTypeId(wordList.wordListTypeId);
                })
            );
    }

    private fetchAccountWordLists(): Observable<WordList[]> {
        return this.referenceModelService
            .getCachedAccountWordListsReference(this.identityService.getAccountId(), this.identityService.getSiteLanguage())
            .pipe(
                takeUntil(this.getDestroyInterceptor()),
                catchError(() => {
                    return of({wordLists: []});
                }),
                rxJsMap(wordListReference => wordListReference.wordLists),
                mergeMap((accountWordLists: WordList[]) => {
                    return forkJoin([
                        this.wordProgressModelService.getMyWordsCount({
                            exclude: MyWordStateV1.MASTERED,
                            applyExclusionsTo: MyWordStateV1.APPLY_EXCLUSIONS,
                            accountId: this.identityService.getAccountId()
                        }),
                        of(accountWordLists)
                    ]);
                }),
                rxJsMap(([myWordsCounts, accountWordLists]) => {
                    const myWordsListsToInclude = Object.entries(MY_WORDS_LISTS).filter(([myWordsListType, myWordsList]) => {
                        return myWordsCounts.overall[myWordsListType];
                    }).map(([myWordsListType, myWordsList]) => {
                        return {
                            ...myWordsList,
                            maxWordRank: myWordsCounts.overall[myWordsListType]
                        };
                    });

                    this.vocabBuilderStateService.setWordLists(accountWordLists.concat(myWordsListsToInclude));

                    return accountWordLists;
                })
            );
    }

    private proceedToNextLevelList(): void {
        this.shouldProceedToNextLevelList = false;
        this.wordListTypeId = this.checkNextLevelListId() | 0;
        this.logger.log("Proceeding to the next level list, new wordListTypeId=", this.wordListTypeId);
        this.onWordListChanged(this.wordListTypeId);
    }

    private generateQuiz(currentSettings?: VocabBuilderSetting, autoStart: boolean = false): Observable<XWordQuiz | {
        quizWords: XQuizWord[]
    } | undefined> {
        const accountId = this.identityService.getAccountId();
        this.vocabBuilderModelService.clearAccountClassRank(accountId);

        if (!autoStart) {
            this.viewWordsQuizStartLoadingStopWatch.reset();
            return of(undefined);
        }

        this.logger.log("Quiz Start Settings", this.vocabBuilderStateService.getCurrentSetting());

        // should fetch wordHeadIds from services by fetching progress on active wordListTypeId
        const isMyWordList = this.vocabBuilderStateService.isMyWordList(currentSettings.wordListTypeId);

        if (!this.isWordsPreSelected && isMyWordList) {
            return this.wordProgressModelService.getMyWordProgressWithSharedMeaning(
                {
                    filters: WordList.getMyWordListNameByWordListTypeId(this.vocabBuilderStateService.getCurrentSetting().wordListTypeId),
                    limit: this.vocabBuilderStateService.getCurrentSetting().numberOfQuizItems,
                    sort: MyWordStateV1.READY,
                    sortDesc: true
                })
                .pipe(
                    takeUntil(this.getDestroyInterceptor()),
                    tap((wordProgressList: SharedWordHeadProgress[]) => {
                        this.vocabBuilderStateService.getCurrentSetting().styleSetting.sharedMeaningIds = map(wordProgressList, (wordProgress) => {
                            return wordProgress.sharedMeaningId;
                        });

                    }),
                    mergeMap(() => {
                        return this.triggerGenerateQuiz(accountId, this.vocabBuilderStateService.getCurrentSetting(), autoStart);
                    }),
                    catchError(error => {
                        this.viewWordsQuizStartLoadingStopWatch.reset();
                        this.onError(error);
                        this.vocabBuilderStateService.setErrorState(false);

                        return of(undefined);
                    })
                );
        }

        return this.triggerGenerateQuiz(accountId, this.vocabBuilderStateService.getCurrentSetting(), autoStart);
    }

    private triggerGenerateQuiz(accountId: number, currentSettings: VocabBuilderSetting, autoStart: boolean): Observable<XWordQuiz | {
        quizWords: XQuizWord[]
    } | undefined> {
        const stopWatch = new StopWatch();
        stopWatch.start();

        this.updateCurrentSetting(currentSettings);

        return this.vocabBuilderStateService
            .getQuizDataSource()
            .generateQuiz(accountId, currentSettings)
            .pipe(
                takeUntil(this.getDestroyInterceptor()),
                catchError(error => {
                    if (error?.error?.key) {
                        this.vocabBuilderStateService.appendQuizData(error?.error);
                        return of(undefined);
                    }
                    this.viewWordsQuizStartLoadingStopWatch.reset();
                    this.onError(error);
                    this.vocabBuilderStateService.setErrorState(false);
                    return of(undefined);
                }),
                tap((vocabBuilderQuiz?: XWordQuiz) => {
                    if (!vocabBuilderQuiz) {
                        if (!this.vocabBuilderStateService.isErrorState()) {
                            this.vocabBuilderStateService.setCompleted(true);
                            this.vocabBuilderStateService.setLoading(false);
                            this.onFireHideParentTabs(false);
                        }
                        return;
                    }
                    this.onFireHideParentTabs(true);
                    this.vocabBuilderStateService.appendQuizData(vocabBuilderQuiz, autoStart);

                    stopWatch.stop();
                    if (this.isViewWordsQuiz()) {
                        this.viewWordsQuizStartLoadingStopWatch.stop();
                        this.trackMetric("vocab-view-words-quiz-start", this.viewWordsQuizStartLoadingStopWatch.getTime(), true);
                        this.viewWordsQuizStartLoadingStopWatch.reset();
                        return;
                    }

                    this.trackMetric("vocab-quiz-tab-quiz-start", stopWatch.getTime());
                })
            );
    }

    private completeQuiz(accountId: number, adaptiveQuizWord?: AdaptiveQuizWord): void {
        const additionalParams = adaptiveQuizWord ? {
            theta: adaptiveQuizWord.theta,
            standardError: adaptiveQuizWord.standardError
        } : {};
        this.vocabBuilderModelService
            .completeQuiz(
                accountId,
                this.vocabBuilderProgressService.getStepId(),
                additionalParams
            )
            .pipe(
                mergeMap(() => {
                    if (this.shouldAutoAdvancedToNextQuiz()) {
                        return this.generateQuiz(this.vocabBuilderStateService.getCurrentSetting(), this.isAutoStart());
                    }
                    return of([]);
                }),
                takeUntil(this.getDestroyInterceptor())
            )
            .subscribe(() => {
                if (!this.shouldAutoAdvancedToNextQuiz()) {
                    this.vocabBuilderStateService.setCompleted(true);
                    this.vocabBuilderStateService.setLoading(false);
                    this.onFireHideParentTabs(false);
                }
            });
    }

    private startLoadingStopWatches(): void {
        this.viewWordsQuizStartLoadingStopWatch.start();
        this.quizStartPageLoadingStopWatch.start();
    }

    async startQuiz(newQuiz: boolean = false): Promise<void> {
        this.vocabBuilderStateService.setQuizLoading(true);
        this.vocabBuilderStateService.setLoading(true);

        this.onFireHideParentTabs(true);

        if (!newQuiz && this.isAutoStarted()) {
            return;
        }

        this.generateQuiz(this.vocabBuilderStateService.getCurrentSetting(), newQuiz)
            .pipe(
                takeUntil(this.getDestroyInterceptor())
            )
            .subscribe(() => {
                if (this.isAutoStarted() || newQuiz) {
                    return;
                }

                this.stayInBand();
            });
    }


    exitQuiz(): void {
        this.backToPreviousActivity.emit();
        this.vocabBuilderStateService.reset();
    }

    checkNextLevelListId(): number | undefined {
        const levelLists = this.getLevelLists();
        let wordListTypeId;

        if (levelLists.length > 1) {
            const listIds = map(levelLists, (list) => {
                return list.wordListTypeId;
            });

            wordListTypeId = max(listIds);
        }

        return wordListTypeId;
    }

    loadWordListSettings(wordListTypeId: number): void {
        this.vocabBuilderStateService.loadSetting(wordListTypeId);
        this.onSetWordList();
    }

    getLevelLists(): WordList[] {
        return filter(this.vocabBuilderStateService.getWordLists(), (wordList) => {
            return includes(wordList.name, "Level");
        });
    }

    getParentHeaderHeight(): number {
        return this.parentHeaderHeight;
    }

    getClassId(): number | undefined {
        return this.classId;
    }

    getQuizDataSource(): QuizDataSourceAbstract {
        return this.vocabBuilderStateService.getQuizDataSource();
    }

    getQuizIndex(): number | undefined {
        return this.getQuizDataSource().getQuizIndex(this.vocabBuilderStateService.getCurrentIndex(), this.vocabBuilderProgressService.getPreviousIndex());
    }

    getQuizLength(): number | undefined {
        return this.getQuizDataSource().getQuizLength(this.vocabBuilderStateService.getQuizLength(), this.vocabBuilderProgressService.getPreviousIndex());
    }

    getRemainingLength(): number {
        return this.vocabBuilderStateService.getQuizLength();
    }

    getTotalAnsweredLength(): number {
        return this.vocabBuilderProgressService.getTotalAnsweredLength();
    }

    getUserDifficultyLevel(): number {
        return this.identityService.getDifficultyLevel();
    }

    //For VLT lists
    getTestRank(): number {
        return this.vocabBuilderStateService.getCurrentSetting().listRank;
    }

    getCorrectAnswerCount(): number {
        return this.vocabBuilderProgressService.getCorrectAnswerCount();
    }

    getLockTimerSetting(): number {
        const DEFAULT_TIMER = 30;
        return DEFAULT_TIMER;
    }

    getCurrentRank(): number | undefined {
        return this.vocabBuilderStateService.getCurrentRank();
    }

    getCurrentBand(): number | undefined {
        return this.vocabBuilderStateService.getCurrentBand();
    }

    getCurrentQuizWord(): XQuizWord | undefined {
        return this.vocabBuilderStateService.getCurrentQuizWord();
    }

    getWordInstanceId(): number {
        const wordDetails = this.vocabBuilderStateService.getWordsDetails();
        const quizSource = this.getQuizDataSource();
        return quizSource.getWordInstanceId(this.getCurrentQuizWord(), wordDetails);
    }

    getInnerHeightObject(): object {
        return {"height": `${this.innerScreenHeight}px`};
    }

    getMobileStyleObject(): object | undefined {
        if (!this.isMobile()) {
            return;
        }
        return {"height": `${this.innerScreenHeight}px`, "top": `${this.getTotalHeaderHeight()}px`};
    }

    getFullScreenTopStyleObject(): object | undefined {
        if (!this.isMobile()) {
            return;
        }
        return {"top": `${this.getTotalHeaderHeight()}px`};
    }

    getTotalHeaderHeight(): number {
        return this.totalHeaderHeight;
    }

    getMixedModeRecycleModeId(modeId: number): number {
        const mixedModeReference = this.vocabBuilderStateService.getMixedModeReference();
        const modeIndex = findIndex(mixedModeReference, mixedModeId => isEqual(mixedModeId, modeId));

        let recycleModeId = modeId;

        // we need to check if modeId has easier modeId than itself
        if (mixedModeReference[modeIndex + 1]) {
            recycleModeId = mixedModeReference[modeIndex + 1];
        }

        // if modeIndex is already the easiest mode then go back to the first modeId in mixed modes
        if (isEqual(modeIndex, mixedModeReference.length - 1)) {
            recycleModeId = mixedModeReference[0];
        }

        return recycleModeId;
    }

    getCurrentModeSetting(): number {
        if (this.questionModeId) {
            return this.questionModeId;
        }
        return this.vocabBuilderStateService.getCurrentModeSetting();
    }

    getFallbackMode(): number {
        return MODE_TYPING;
    }

    getCurrentVocabListName(): string {
        return this.vocabBuilderStateService.getCurrentVocabListName();
    }

    getActivityTypeId(): number | undefined {
        return this.activityTypeId || this.vocabBuilderProgressService.getActivity().activityTypeID;
    }

    getCourseId(): number | undefined {
        return this.courseId;
    }

    setStyle(): void {
        if (!this.vocabBuilderStateService.getCurrentSetting()) {
            return;
        }
        const currentWordListTypeId = this.vocabBuilderStateService.getCurrentSetting().wordListTypeId;
        const isMyWordList = this.vocabBuilderStateService.isMyWordList(currentWordListTypeId);

        if (isMyWordList) {
            this.setMyWordsListStyle();
            return;
        }

        const currentStyleName = this.vocabBuilderStateService.getCurrentSetting().styleSetting?.settingType;
        if (!currentStyleName) {
            return;
        }
        const styleId = this.vocabBuilderStateService.getVocabBuilderStyleIdByName(this.upperCaseFirstLetter(currentStyleName));

        this.updateCurrentSetting({vocabBuilderStyleId: styleId});
    }

    setSelectedSharedMeaningIds(): void {
        this.sharedMeaningIds = this.vocabularyAppSharedService.getSelectedSharedMeaningIds();
    }

    setWordDetails(): void {
        this.vocabBuilderStateService.setWordsDetails(this.wordDetails);
    }

    setMyWordsListStyle(): void {
        const myWordsStyle = find(this.vocabBuilderStateService.getStyleReference(), (mode) => {
            return isEqual(mode.vocabBuilderStyleId, VOCAB_BUILDER_STYLE_ID_MY_WORDS);
        });

        this.updateCurrentSetting({vocabBuilderStyleId: VOCAB_BUILDER_STYLE_ID_MY_WORDS});

        this.vocabBuilderStateService.setCurrentStyle({
            settingType: this.lowerCaseFirstLetter(myWordsStyle.name)
        });
        this.logger.log("Updated current style for my words list", myWordsStyle.name);
    }

    setTotalHeaderHeight(headerHeights: number): void {
        this.totalHeaderHeight = headerHeights;
    }

    setQuizDataSource(activityTypeId?: number): void {
        const quizDataSource = QuizDataSourceAdapter.getAdapter({
            activityTypeId: activityTypeId || this.activityTypeId,
            classTestExamId: this.classTestExamId,
            classId: this.classId,
            activityId: this.activityId,
            wordListTypeId: this.wordListTypeId,
            isWordsPreSelected: this.isWordsPreSelected,
            isWordPronunciationQuiz: this.isWordPronunciationQuiz,
            isPhonemePronunciationQuiz: this.isPhonemePronunciationQuiz
        }, this.vocabBuilderModelService);

        this.vocabBuilderStateService.setQuizDataSource(quizDataSource);
        this.vocabBuilderProgressService.setActivity(quizDataSource.getActivity(this.activityId, this.wordListTypeId));
    }

    setComponentHeight(): void {
        this.setTotalHeaderHeight(this.getParentHeaderHeight());
        this.updateScreenInnerHeight();
    }

    isMobile(): boolean {
        return Browser.isMobile();
    }

    isTeacher(): boolean {
        return this.identityService.isTeacher();
    }

    private isAutoStarted(): boolean {
        let quizLength = this.getQuizLength();
        if (quizLength && this.getTotalAnsweredLength() < quizLength) {
            this.vocabBuilderStateService.start();
            return true;
        }

        return false;
    }

    isBackButtonVisible(): boolean {
        // when back button is enabled, and quiz auto starts then back button should be visible only in end screen
        if (this.isBackButtonEnabled() && this.isAutoStart()) {
            return this.showCompletionScreen();
        }

        return this.isBackButtonEnabled() && !this.showQuestion();
    }

    isBackButtonEnabled(): boolean {
        return this.getQuizDataSource().isBackButtonEnabled() || this.backButtonEnabled;
    }

    isLoading(): boolean {
        return this.vocabBuilderStateService.isLoading();
    }

    isQuizLoading(): boolean {
        return this.vocabBuilderStateService.isQuizLoading();
    }

    isPaused(): boolean {
        return this.vocabBuilderStateService.isPaused();
    }

    isStarted(): boolean {
        return this.vocabBuilderStateService.isStarted();
    }

    isCompleted(): boolean {
        return this.vocabBuilderStateService.isCompleted();
    }

    isRecycleEnabled(): boolean {
        return this.getQuizDataSource().isRecycleEnabled();
    }

    isRecyclingSkippedWordsEnabled(): boolean {
        return this.vocabBuilderStateService.getCurrentSetting().recycleSkippedWords;
    }

    isRecyclingMissedWordsEnabled(): boolean {
        return this.vocabBuilderStateService.getCurrentSetting().recycleMissedWords;
    }

    isLevelTest(): boolean {
        return this.getQuizDataSource().isLevelTest();
    }

    isPractice(): boolean {
        return this.getQuizDataSource().isPractice();
    }

    isPronunciationQuiz(): boolean {
        return this.getQuizDataSource().isPronunciation();
    }

    isActivityQuiz(): boolean {
        return this.vocabBuilderStateService.getQuizDataSource().isActivityQuiz();
    }

    isSkipBehaviorEnabled(): boolean {
        return this.getQuizDataSource().isSkipBehaviorEnabled();
    }

    isWordPronunciationEnabled(): boolean {
        return this.getQuizDataSource().isWordPronunciationEnabled();
    }

    isAutoStart(): boolean {
        return (this.getQuizDataSource().isAutoStart() || this.shouldAutoStart);
    }

    isWordsRecycled(): boolean {
        return this.vocabBuilderStateService.isWordsRecycled();
    }

    isAdaptive(): boolean {
        return this.getQuizDataSource()?.isNextWordAdaptive() ?? false;
    }

    isViewWordsQuiz(): boolean {
        return this.getQuizDataSource()?.getQuizType() == QuizType.MyWords;
    }

    getTrackingContext(): Record<string, string> {
        switch (this.getQuizDataSource()?.getQuizType()) {
            case QuizType.VocabLevelTest:
                return {
                    app: "vocabulary",
                    context: "vlt"
                };
                break;
            case QuizType.VocabProgressTest:
                return {
                    app: "vocabulary",
                    context: "vpt"
                };
                break;
            case QuizType.PronQuiz:
                return {
                    app: "speaking",
                    context: "pron-quiz"
                };
                break;
            case QuizType.CourseQuiz:
                return {
                    app: "vocabulary",
                    context: "course-quiz"
                };
                break;
            case QuizType.VocabBuilder:
                return {
                    app: "vocabulary",
                    context: "speak-mode"
                };
            case QuizType.MyWords:
                return {
                    app: "vocabulary",
                    context: "my-words"
                };
        }

    }

    isMixedModeEnabled(): boolean {
        return this.vocabBuilderStateService.getCurrentSetting().vocabBuilderModeIds.length > 1;
    }

    isVocabPayWallInitialized(): boolean {
        return this.vocabPayWallInitialized;
    }

    isCurrentListLevelList(): boolean {
        return includes(this.getCurrentVocabListName(), "Level");
    }

    isLevelUpdateEnabled(): boolean {
        return this.getQuizDataSource().isLevelUpdateEnabled();
    }

    isPaywallEnabled(): boolean {
        return false;
    }

    hasCurrentSetting(): boolean {
        return !isEmpty(this.vocabBuilderStateService.getCurrentSetting()) && !isUndefined(this.vocabBuilderStateService.getCurrentSetting());
    }

    shouldSendCompleteEvent(): boolean {
        const sendCompleteEvent = this.getQuizDataSource().shouldSendStartCompleteEvents(this.wordListTypeId);
        const isPerfect = this.vocabBuilderProgressService.isPerfect(this.isActivityQuiz());
        const isActivityQuiz = this.isActivityQuiz();

        return sendCompleteEvent && (isPerfect || !isActivityQuiz);
    }

    shouldTriggerCompleteEndpoint(): boolean {
        const isPerfect = this.vocabBuilderProgressService.isPerfect(this.isActivityQuiz());
        const isActivityQuiz = this.isActivityQuiz();

        return isPerfect || !isActivityQuiz;
    }

    shouldShowBandScore(): boolean {
        return this.getQuizDataSource().shouldShowBandScore();
    }

    shouldFetchScoreDetail(): boolean {
        return this.getQuizDataSource().shouldFetchScoreDetail(this.getTestRank(), this.getTotalAnsweredLength());
    }

    shouldAutoAdvancedToNextQuiz(): boolean {
        return this.getQuizDataSource().shouldAutoAdvancedToNextQuiz();
    }

    showStartScreen(): boolean {
        return !this.vocabBuilderStateService.isCompleted()
            && !this.vocabBuilderStateService.isStarted();
    }

    showQuestion(): boolean {
        return !this.vocabBuilderStateService.isCompleted()
            && this.vocabBuilderStateService.isStarted()
            && !this.isLoading();
    }

    showCompletionScreen(): boolean {
        return this.vocabBuilderStateService.isCompleted();
    }

    showVocabBuilderCompletionScreen(): boolean {
        return this.showCompletionScreen();
    }

    shouldShowPreviouslyEncounteredVisible(): boolean {
        return this.getQuizDataSource().shouldShowPreviouslyEncounteredVisible();
    }

    shouldShowRank(): boolean {
        return this.getQuizDataSource().shouldShowRank();
    }

    shouldShowBand(): boolean {
        return this.getQuizDataSource().shouldShowBand();
    }

    shouldShowQuizPagination(): boolean {
        return this.getQuizDataSource().shouldShowQuizPagination();
    }

    shouldShowListName(): boolean {
        return this.getQuizDataSource().shouldShowListName();
    }

    isMarkAsKnownButtonVisible(): boolean {
        return this.getQuizDataSource().isMarkAsKnownButtonVisible();
    }

    isAutoMarkAsKnownEnabled(): boolean {
        const vocabBuilderModeIds = this.vocabBuilderStateService.getCurrentSetting()?.vocabBuilderModeIds;
        return this.getQuizDataSource().isAutoMarkAsKnownEnabled() && vocabBuilderModeIds?.[0] == this.getCurrentModeSetting();
    }

    stayInBand(): void {
        this.vocabBuilderStateService.publish(VocabBuilderStateService.EVENT_FETCH_NEXT_DATA, this.vocabBuilderStateService.getCurrentSetting());
    }

    updateNumberOfQuizItems(count: number): void {
        this.updateCurrentSetting({
            numberOfQuizItems: count
        });
    }

    updateCurrentSetting(setting: object = {}): void {
        this.vocabBuilderStateService.setCurrentSetting(setting);
    }

    updateScreenInnerHeight(): void {
        this.innerScreenHeight = window.innerHeight - this.getTotalHeaderHeight();
    }

    lowerCaseFirstLetter(word: string): string {
        return word.charAt(0).toLowerCase() + word.slice(1);
    }

    upperCaseFirstLetter(word: string): string {
        return word.charAt(0).toUpperCase() + word.slice(1);
    }

    private trackMetric(
        eventName: string,
        time: number,
        isViewWordQuiz: boolean = false,
        extraParams: object = {}): void {

        const quizType = isViewWordQuiz ? "WordQuiz" : this.getQuizDataSource().getQuizType();

        const params = assign({}, {
            customMetric: eventName,
            quizType: quizType
        }, extraParams);

        this.logger.log(params, time);
    }

    private sendAnalyticsEvent(
        eventName: string,
        eventDetails: object = {}): void {
        this.zone.runOutsideAngular(() => {
            this.logger.log(eventName, eventDetails);
        });
    }

    onReferenceError(): void {
        this.quizStartPageLoadingStopWatch.reset();
        this.logger.log("getVocabBuilderReference error");
        this.referenceModelService.clearReferenceCache("vocabBuilder");
        this.vocabBuilderStateService.publish(VocabBuilderStateService.EVENT_ON_ERROR);
    }

    onClickViewWords(): void {
        this.eventViewWords.emit();
    }

    onSetWordList(): void {
        if (!this.getQuizDataSource().shouldInitializeFromRouter()) {
            return;
        }
        let wordListTypeId = this.wordListTypeId;
        const currentWordList = cloneDeep(this.vocabBuilderStateService.findVocabListByWordListTypeId(wordListTypeId));

        if (!currentWordList || !currentWordList.maxWordRank) {
            wordListTypeId = this.vocabBuilderStateService.getLatestSetting()?.wordListTypeId;
            if (!wordListTypeId) {
                const wordList: WordList = find(this.vocabBuilderStateService.getWordLists(), wordList => {
                    return !isEqual(wordList.maxWordRank, 0);
                });
                wordListTypeId = wordList?.wordListTypeId;
            }
            if (!wordListTypeId) {
                this.vocabBuilderStateService.setErrorState(true);
                return;
            }
        }
        this.logger.log("Setting the word list type id=", wordListTypeId);
        this.onWordListChanged(wordListTypeId);
    }

    onWordListChanged(wordListTypeId: number): void {
        this.wordListTypeId = wordListTypeId;
        this.vocabularyAppSharedService.setWordListTypeId(this.wordListTypeId);
        this.vocabBuilderStateService.loadSetting(this.wordListTypeId);
        this.setStyle();

        this.setQuizDataSource();

        if (this.hasCurrentSetting()) {
            this.vocabularyAppSharedService.setNumberOfWordItems(this.vocabBuilderStateService.getCurrentSetting().numberOfQuizItems);
        }
    }

    onAttempt(quizWord: XQuizWord, event: ExamQuestionCheckedEvent): void {
        this.vocabBuilderProgressService.addAttempt(quizWord, event);
    }

    onAnswer(quizWord: XQuizWord, event: ExamQuestionCheckedEvent): void {
        this.logger.log("ExamQuestionCheckedEvent", event);
        const isSkipEventEnabled = this.getQuizDataSource().isSkipEventEnabled();
        const acceptedEvent = this.vocabBuilderProgressService.answerQuestion(quizWord, event, isSkipEventEnabled);
        this.vocabBuilderProgressService.flushAttempts(acceptedEvent);
    }

    onRecycleWord(word: XQuizWord): void {
        let recycleWord = cloneDeep(word);
        if (this.isMixedModeEnabled()) {
            recycleWord.modeId = this.getMixedModeRecycleModeId(word.modeId);
        }
        if (!recycleWord.recycleCount) {
            recycleWord.recycleCount = 0;
        }
        recycleWord.recycleCount += 1;
        this.vocabBuilderStateService.addWordToRecycle(recycleWord);
    }

    onComplete(): void {
        this.vocabBuilderStateService.generateNextQuizWord();
    }

    onMarkAsKnown(quizWord: XQuizWord, known: boolean): void {
        this.vocabBuilderProgressService.markAsKnown(quizWord, known, this.isPractice());
    }

    onModeChange(mode: number): void {
        this.vocabBuilderStateService.updateCurrentQuestionMode(mode);
    }

    onError(error: any): void {
        this.vocabBuilderStateService.publish(VocabBuilderStateService.EVENT_ON_ERROR, error);
    }

    onFireHideParentTabs(hide: boolean): void {
        this.vocabularyAppSharedService.publish(VocabularyAppSharedService.EVENT_ON_HIDE_VOCABULARY_TABS, hide);
        this.eventHideTabs.emit(hide);
        if (hide) {
            this.setTotalHeaderHeight(100);
            this.updateScreenInnerHeight();
            return;
        }
        const headerHeights = 100 + this.getParentHeaderHeight();
        this.setTotalHeaderHeight(headerHeights);
        this.updateScreenInnerHeight();
    }

    onClickStartNewPractice(): void {
        this.eventStartNewPractice.emit();
    }

    onFinishedWordList(wordListTypeId: number): void {
        this.referenceModelService.clearReferenceCache("vocabBuilder");
        // If finished list is level list, then next list should be fetched from services
        if (this.isCurrentListLevelList() && this.getCurrentVocabListName() !== LAST_LEVEL_LIST) {
            this.shouldProceedToNextLevelList = true;
            this.vocabBuilderStateService.reset(true);
            this.logger.log("Current level list is completed, quiz will proceed with the next level list");
            return;
        }
        this.logger.log("Current list is completed, quiz will proceed with the next word list");
        this.wordListTypeId = this.vocabBuilderStateService.getNextWordListTypeId(wordListTypeId);
        this.vocabBuilderStateService.reset();
    }

    clearAccountWordListsReference(): void {
        this.referenceModelService.clearAccountWordListsReference(this.identityService.getAccountId());
    }

    resetWordList(): void {
        this.vocabBuilderStateService.resetState();
        this.reset();
        this.vocabBuilderStateService.setLoading(true);
        this.clearAccountWordListsReference();
        this.fetchReferenceData().pipe(takeUntil(this.getDestroyInterceptor())).subscribe();
    }

    reset(resetQueryParams: boolean = true): void {
        this.classTestExamId = 0;
        this.isWordsPreSelected = false;
        this.shouldAutoStart = false;
        this.vocabularyAppSharedService.reset();
    }

    launchModal(content, modalOptions?: NgbModalOptions): void {
        this.modalRef = this.modalService.open(content, assign({
            size: "md",
            centered: true
        }, modalOptions));
    }

    closeModal(): void {
        if (!this.modalRef) {
            return;
        }
        this.modalRef.close();
    }

    ngOnDestroy(): void {
        this.vocabBuilderStateService.resetCurrentSetting();
        this.vocabBuilderStateService.resetReviewItemRatio();
        this.vocabBuilderStateService.resetState();
        this.vocabBuilderStateService.destroy();
        this.vocabularyAppSharedService.reset();
        this.closeModal();
        this.eventDestroy.emit();
        this.destroySubscriptions();
    }
}
