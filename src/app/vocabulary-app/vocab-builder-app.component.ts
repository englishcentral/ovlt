import {
    Component,
    ElementRef,
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
import "global-styles/adaptive-quiz.css";
import { Location, LocationStrategy, PathLocationStrategy } from "@angular/common";
import { catchError, debounceTime, finalize, mergeMap, retryWhen, take, takeUntil, tap } from "rxjs/operators";
import { Logger } from "../../../core/logger/logger";
import { VocabBuilderStateService } from "../../../activity-app/vocab-builder-app/vocab-builder-state.service";
import { VocabBuilderProgressService } from "../../../activity-app/vocab-builder-app/vocab-builder-progress.service";
import { AdaptiveQuizModelService } from "../../../model/content/adaptive-quiz-model.service";
import { VocabBuilderModelService } from "../../../model/content/vocab-builder-model.service";
import { ReferenceModelService } from "../../../model/content/reference-model.service";
import { FeatureService } from "../../../core/feature.service";
import { IdentityService } from "../../../core/identity.service";
import { StopWatch } from "../../../core/stopwatch";
import { VocabularyQuizModelService } from "../../../model/content/vocabulary-quiz-model.service";
import { DEFAULT_VOCAB_BUILDER_ACTIVITY } from "../../../model/types/content/activity";
import {
    DEFAULT_WORD_LIST_TYPE_ID,
    LAST_LEVEL_LIST,
    MY_WORDS_LISTS,
    MyWordsListTypeIds,
    WordList
} from "../../../model/types/word-list-reference";
import { Browser } from "../../../core/browser";
import {
    MyWordsWordListSettings,
    VOCAB_BUILDER_STYLE_ID_MY_WORDS,
    VocabBuilderClassSetting,
    VocabBuilderSetting,
    VocabBuilderSettings
} from "../../../model/types/vocab-builder-settings";
import { AdaptiveQuizWord, MESSAGE_CODE_COMPLETE, XQuizWord, XWordQuiz } from "../../../model/types/vocabulary-quiz";
import { servicesRetryStrategy } from "../../../core/retry-helper";
import { ActivatedRoute, NavigationExtras, ParamMap, Router } from "@angular/router";
import { VocabularyAppSharedService } from "../vocabulary-app/vocabulary-app-shared.service";
import { SubscriptionAbstract } from "../../../core/subscription.abstract";
import { ROUTE_VIEW_WORDS, ROUTE_VOCAB_QUIZ } from "../../views/vocabulary-view/vocabulary-view.routes";
import {
    QuizDataSourceAdapter
} from "../../../activity-app/vocab-builder-app/quiz-data-source/quiz-data-source-adapter";
import {
    ExamQuestionCheckedEvent
} from "../../../activity-app/shared-activity/exam-question/mode-handler/mode-handler-abstract";
import { WordProgressModelService } from "../../../model/reportcard/word-progress.model.service";
import { SharedWordHeadProgress } from "../../../model/types/reportcard/word-head-progress";
import { ProgressQueueService } from "../../../common-app/progress-app/progress-queue.service";
import { DailyGoalProgressService } from "../../../activity-app/shared-activity/daily-goal-progress.service";
import { ROUTE_VIDEOS } from "../../views/browse-view/browse-view.routes";
import {
    QuizDataSourceAbstract
} from "../../../activity-app/vocab-builder-app/quiz-data-source/quiz-data-source-abstract";
import { ROUTE_CLASS_TESTS } from "../../views/my-class-view/my-class-view.routes";
import { MyWordState } from "../../../model/types/my-word-state-v2";
import { extractErrorString } from "../../../core/instrumentation/instrumentation-utility";
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
    isNull,
    isUndefined,
    map,
    max,
    merge,
    toNumber
} from "lodash-es";
import { ROUTE_MYENGLISH } from "../../../core/routes";
import { Instrumentation } from "../../../core/instrumentation/instrumentation";
import { PayWallService } from "../../../activity-app/shared-activity/pay-wall.service";
import { PaywallAppContext } from "../paywall-app/paywall-app.helpers";
import { PaywallModalComponent } from "../paywall-app/paywall-modal/paywall-modal.component";
import { DEFAULT_MODAL_OPTIONS } from "../../helpers/modal-options-default";
import { ModalLaunchService } from "../../../core/modal-launch.service";
import {
    MODE_ALL,
    MODE_TYPING,
    scalarToModes,
    VocabBuilderReference
} from "../../../model/types/vocab-builder-reference";
import { PronunciationWordView } from "../../../model/types/pronunciation";
import { BrowserScreen } from "../../../core/browser-screen";
import { WordListLearned } from "../../../model/types/word-list-learned";
import { MyWordStateV1 } from "../../../model/types/my-word-state-v1";
import { WordV1 } from "../../../model/types/content/word-v1";
import { QuizType } from "../../../activity-app/vocab-builder-app/quiz-data-source/quiz-type";
import { ROUTE_BROWSE, ROUTE_MY_CLASS, ROUTE_VOCABULARY } from "../../routes/routes";

@Component({
    selector: "ec-vocab-builder-app",
    templateUrl: "vocab-builder-app.component.html",
    styleUrls: ["vocab-builder-app.component.scss"],
    providers: [Location, { provide: LocationStrategy, useClass: PathLocationStrategy }]
})
export class VocabBuilderAppComponent extends SubscriptionAbstract implements OnInit, OnDestroy {
    @ViewChild("vocabQuizExit", { static: false }) vocabQuizExit: TemplateRef<any>;

    // wordDetails need to be passed from Pronunciation to get real wordInstanceId
    @Input() wordDetails: Map<number, WordV1>;
    // wordInstanceIds to be quizzed, it is used for Pronunciation Quizzes
    @Input() wordInstanceIds: number[];
    @Input() wordIds: number[];
    @Input() pronunciationQuizWords: PronunciationWordView[];

    // It is used for modeId which is available in client but not in services, it helps in mode-handler-adapter
    @Input() questionModeId: number = 0;
    // Below Inputs to control the quiz type for pronunciation
    @Input() isWordPronunciationQuiz: boolean = false;
    @Input() isPhonemePronunciationQuiz: boolean = false;
    // Controls starting quiz automatically
    @Input() autoStartQuiz: boolean = false;
    @Input() activityId: number;
    @Input() activityTypeId: number;
    @Input() courseId: number;
    //to be able to provide full screen vb we need to know parent component header height
    @Input() parentHeaderHeight: number = VocabBuilderAppComponent.PARENT_HEADER_HEIGHT;

    @Output() eventDestroy: EventEmitter<void> = new EventEmitter();
    @Output() backToPreviousActivity: EventEmitter<void> = new EventEmitter();
    @Output() eventHideTabs: EventEmitter<boolean> = new EventEmitter();
    @Output() eventViewWords = new EventEmitter<void>();
    @Output() eventStartNewPractice = new EventEmitter<void>();

    private vocabBuilderModeIds: number[];
    private wordListTypeId: number;
    private numberOfQuizItems: number;
    private vocabBuilderStyleId: number;
    private classId: number;
    private classTestExamId: number;
    private wordHeadIds: number[];
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
    private levelTestSettingId: number;

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
    private vocabPayWallInitialized = false;

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

    constructor(private elementRef: ElementRef,
                private vocabularyAppSharedService: VocabularyAppSharedService,
                private vocabBuilderStateService: VocabBuilderStateService,
                private vocabBuilderProgressService: VocabBuilderProgressService,
                private adaptiveQuizModelService: AdaptiveQuizModelService,
                private vocabBuilderModelService: VocabBuilderModelService,
                private vocabularyQuizModelService: VocabularyQuizModelService,
                private referenceModelService: ReferenceModelService,
                private wordProgressModelService: WordProgressModelService,
                private dailyGoalProgressService: DailyGoalProgressService,
                private payWallService: PayWallService,
                private identityService: IdentityService,
                private featureService: FeatureService,
                private progressQueue: ProgressQueueService,
                private modalService: NgbModal,
                private modalLaunchService: ModalLaunchService,
                private route: ActivatedRoute,
                private router: Router,
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

        if (this.getQuizDataSource().shouldInitializeFromRouter()) {
            this.getRouteParams();
            this.initializeRouterParamMapSubscription();
        }

        // If quiz is started from View Words by selecting words then VB needs to take selected wordHeadIds
        // TODO: remove this only sharedMeaningIds should remain
        this.setSelectedWordHeadIds();
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

        this.vocabBuilderStateService.subscribe(VocabBuilderStateService.EVENT_ON_APP_CLOSE, () => {
            this.navigateOnError();
        });

        this.vocabBuilderStateService.subscribe(VocabBuilderStateService.EVENT_ON_APP_GO_TO_VIEW_WORDS_CLICK, (wordListTypeId) => {
            this.navigateToViewWords(wordListTypeId);
        });

        this.vocabBuilderStateService.subscribe(VocabBuilderStateService.EVENT_ON_APP_GO_TO_VIDEOS, () => {
            this.navigateToVideos();
        });

        this.vocabBuilderStateService.subscribe(VocabBuilderStateService.EVENT_ON_GO_TO_MY_ENGLISH, () => {
            this.navigateToMyEnglish();
        });

        this.vocabBuilderStateService.subscribe(VocabBuilderStateService.EVENT_ON_APP_GO_TO_VOCAB_BUILDER, () => {
            this.activityTypeId = DEFAULT_VOCAB_BUILDER_ACTIVITY.activityTypeID;
            this.setQuizDataSource(this.activityTypeId);
            this.resetWordList();
        });

        this.vocabBuilderStateService.subscribe(VocabBuilderStateService.EVENT_ON_APP_GO_TO_PREVIOUS_ACTIVITY, () => {
            this.navigateBack();
        });

        this.vocabBuilderStateService.subscribe(VocabBuilderStateService.EVENT_ON_ERROR, (error) => {
            this.logger.error("Error Detected", error);
            this.sendAnalyticsEvent("v2/VocabBuilderEngineErrors", {
                errorMessage: extractErrorString(error)
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
            .fetchSettings(accountId, { activityId: this.activityId, useAccountWordLists: true, useCache: true })
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
                this.progressQueue.sendEvent(event);
            });
        });
    }

    private initializeRouterParamMapSubscription(): void {
        this.route.queryParamMap
            .pipe(
                takeUntil(this.getDestroyInterceptor()),
                mergeMap((params: ParamMap) => {
                    if (params) {
                        const activityTypeIdParam = toNumber(params.get("activityTypeId"));
                        if (activityTypeIdParam) {
                            this.activityTypeId = activityTypeIdParam;
                        }
                    }
                    return of(true);
                })
            ).subscribe();

        this.route.paramMap
            .pipe(
                takeUntil(this.getDestroyInterceptor()),
                tap((params: ParamMap) => {
                    if (params) {
                        this.wordListTypeId = toNumber(params.get("wordListTypeId"));
                        this.vocabularyAppSharedService.setWordListTypeId(this.wordListTypeId);
                    }
                })
            ).subscribe();
    }

    private initializeVocabBuilder(): void {
        this.vocabBuilderProgressService
            .generateDifficultyLevels()
            .pipe(
                takeUntil(this.getDestroyInterceptor())
            ).subscribe();

        this.initializeVocabPayWall()
            .pipe(
                takeUntil(this.getDestroyInterceptor()),
                mergeMap(() => this.fetchReferenceData())
            )
            .subscribe();
    }

    private initializeVocabPayWall(): Observable<number> {
        return this.payWallService.initializeVocabPayWall()
            .pipe(
                take(1),
                takeUntil(this.getDestroyInterceptor()),
                finalize(() => this.vocabPayWallInitialized = true)
            );
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
                    return of({ wordLists: [] });
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
        if (this.shouldTriggerPaywall()) {
            if (this.shouldOpenPaywallModal()) {
                this.openPaywallModal();
            }
            this.vocabBuilderStateService.setLoading(false);
            this.vocabBuilderStateService.resetState();
            return of(undefined);
        }

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
                    retryWhen(servicesRetryStrategy()),
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
        if (this.shouldTriggerPaywall()) {
            this.openPaywallModal();
            return Promise.resolve();
        }

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

    private openPaywallModal(): NgbModalRef {
        const modalRef = this.modalLaunchService.open(
            PaywallModalComponent,
            DEFAULT_MODAL_OPTIONS
        );
        modalRef.componentInstance.accountId = this.identityService.getAccountId();
        modalRef.componentInstance.context = PaywallAppContext.VOCABULARY;
        modalRef.componentInstance.eventClose
            .pipe(takeUntil(this.getDestroyInterceptor()))
            .subscribe(() => {
                modalRef.close();
                this.navigateBack();
            });

        return modalRef;
    }

    exitQuiz(): void {
        const quizType = "VocabBuilder";
        const isVocabBuilder = isEqual(this.getQuizDataSource().getQuizType(), quizType);

        if (!this.classId && this.levelTestSettingId) {
            this.navigateToMyEnglish();
            return;
        }

        if (this.classId && !isVocabBuilder) {
            this.router.navigate([ROUTE_MY_CLASS, this.classId, 0, ROUTE_CLASS_TESTS]);
            return;
        }

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

    getRouteParams(): void {
        this.classId = toNumber(this.route.snapshot.queryParamMap.get("classId") || 0);
        this.wordListTypeId = toNumber(this.route.snapshot.queryParamMap.get("wordListTypeId")) || DEFAULT_WORD_LIST_TYPE_ID;
        this.classTestExamId = toNumber(this.route.snapshot.queryParamMap.get("classTestExamId") || 0);

        const vocabBuilderModeIds = this.route.snapshot.queryParamMap.get("mode")?.split(",").map(parseInt);
        this.vocabBuilderModeIds = vocabBuilderModeIds?.length > 1
            ? scalarToModes(MODE_ALL, [], vocabBuilderModeIds)
            : scalarToModes(vocabBuilderModeIds?.[0]);

        this.vocabBuilderStyleId = toNumber(this.route.snapshot.queryParamMap.get("style") || 0);
        this.numberOfQuizItems = toNumber(this.route.snapshot.queryParamMap.get("itemCount") || 0);
        this.startingRank = toNumber(this.route.snapshot.queryParamMap.get("rank") || 0);
        this.startingBand = toNumber(this.route.snapshot.queryParamMap.get("band") || 0);
        this.activityTypeId = toNumber(this.route.snapshot.queryParamMap.get("activityTypeId") || 0);
        this.courseId = toNumber(this.route.snapshot.queryParamMap.get("courseId"));
        this.isWordsPreSelected = JSON.parse(this.route.snapshot.queryParamMap.get("wordsSelected"));
        this.backButtonEnabled = JSON.parse(this.route.snapshot.queryParamMap.get("backButtonEnabled"));
        this.shouldAutoStart = JSON.parse(this.route.snapshot.queryParamMap.get("autoStartQuiz"));

        const paramReviewItemRatio = this.route.snapshot.queryParamMap.get("reviewItemRatio");
        this.reviewItemRatio = isNull(paramReviewItemRatio) ? undefined : toNumber(paramReviewItemRatio);

        this.listRank = toNumber(this.route.snapshot.queryParamMap.get("listRank") || 0);
        this.curatedLevelTestId = JSON.parse(this.route.snapshot.queryParamMap.get("curatedLevelTestId"));
        this.levelTestSettingId = JSON.parse(this.route.snapshot.queryParamMap.get("levelTestSettingId"));
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
        return this.featureService.getFeature("adaptiveQuizTimer") || DEFAULT_TIMER;
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

    getAccountPronunciationWordId(): number {
        const word = find(this.pronunciationQuizWords, (word: PronunciationWordView) => {
            return isEqual(word.instanceId, this.getWordInstanceId());
        });

        return word?.id;
    }

    getInnerHeightObject(): object {
        return { "height": `${this.innerScreenHeight}px` };
    }

    getMobileStyleObject(): object | undefined {
        if (!this.isMobile()) {
            return;
        }
        return { "height": `${this.innerScreenHeight}px`, "top": `${this.getTotalHeaderHeight()}px` };
    }

    getFullScreenTopStyleObject(): object | undefined {
        if (!this.isMobile()) {
            return;
        }
        return { "top": `${this.getTotalHeaderHeight()}px` };
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

    getNavigationExtras(): NavigationExtras {
        return {
            queryParamsHandling: undefined
        };
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

        this.updateCurrentSetting({ vocabBuilderStyleId: styleId });
    }

    setSelectedWordHeadIds(): void {
        this.wordHeadIds = this.vocabularyAppSharedService.getSelectedWordHeadIds();
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

        this.updateCurrentSetting({ vocabBuilderStyleId: VOCAB_BUILDER_STYLE_ID_MY_WORDS });

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
        }, this.vocabBuilderModelService, this.vocabularyQuizModelService);

        this.vocabBuilderStateService.setQuizDataSource(quizDataSource);
        this.vocabBuilderProgressService.setActivity(quizDataSource.getActivity(this.activityId, this.wordListTypeId));
    }

    setComponentHeight(): void {
        this.setTotalHeaderHeight(this.getParentHeaderHeight() + BrowserScreen.EC_HEADER_HEIGHT);
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
        if (this.featureService.getFeature("myWordsSkipVocabPaywall", false)
            && this.vocabBuilderStateService.isMyWordList(this.vocabBuilderStateService.getCurrentSetting()?.wordListTypeId)) {
            return false;
        }
        return this.getQuizDataSource().isPaywallEnabled();
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

    shouldTriggerPaywall(): boolean {
        return this.isPaywallEnabled() && this.payWallService.isVocabPaywallLimitExceeded();
    }

    shouldOpenPaywallModal(): boolean {
        return this.getQuizDataSource().shouldAutoOpenPaywall();
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

        Instrumentation.sendEvent(Instrumentation.EVENT_PERFORMANCE, params, time);
    }

    private sendAnalyticsEvent(
        eventName: string,
        eventDetails: object = {}): void {
        this.zone.runOutsideAngular(() => {
            Instrumentation.sendEvent(eventName, eventDetails);
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
        this.router.navigate([ROUTE_VOCABULARY, ROUTE_VOCAB_QUIZ, wordListTypeId], { queryParamsHandling: "preserve" });
    }

    onAttempt(quizWord: XQuizWord, event: ExamQuestionCheckedEvent): void {
        this.vocabBuilderProgressService.addAttempt(quizWord, event);
    }

    onAnswer(quizWord: XQuizWord, event: ExamQuestionCheckedEvent): void {
        this.logger.log("ExamQuestionCheckedEvent", event);
        const isSkipEventEnabled = this.getQuizDataSource().isSkipEventEnabled();
        this.payWallService.incrementAccessedWordCount();
        const acceptedEvent = this.vocabBuilderProgressService.answerQuestion(quizWord, event, isSkipEventEnabled);
        this.dailyGoalProgressService.updateAccountPointsToday(acceptedEvent);
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
            this.setTotalHeaderHeight(BrowserScreen.EC_HEADER_HEIGHT);
            this.updateScreenInnerHeight();
            return;
        }
        const headerHeights = BrowserScreen.EC_HEADER_HEIGHT + this.getParentHeaderHeight();
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

    navigateToViewWords(wordListTypeIdParam?: number): void {
        const wordListTypeId = wordListTypeIdParam ? wordListTypeIdParam : MyWordsListTypeIds.Missed;
        this.router.navigate(
            [ROUTE_VOCABULARY, ROUTE_VIEW_WORDS, wordListTypeId],
            this.getNavigationExtras()
        );
    }

    navigateToVideos(): void {
        this.router.navigate([ROUTE_BROWSE, ROUTE_VIDEOS]);
    }

    navigateToMyEnglish(): void {
        if (this.featureService.getFeatures().isPwaMyEnglishHeaderLinkEnabled) {
            this.router.navigate([ROUTE_MYENGLISH]);
            return;
        }
        this.navigateToVideos();
    }

    navigateOnError(): void {
        const navigationPlace = this.getQuizDataSource().getNavigateOnError();
        if (navigationPlace) {
            this.router.navigate([navigationPlace]);
            return;
        }
        this.navigateBack();
    }

    navigateBack(): void {
        if (this.classId) {
            this.router.navigate([ROUTE_MY_CLASS, this.classId, 0, ROUTE_CLASS_TESTS]);
            return;
        }
        // When user comes from myenglish for account VLT
        if (!this.classId && this.levelTestSettingId) {
            this.router.navigate([ROUTE_MYENGLISH]);
            return;
        }
        return this.backToPreviousActivity.emit();
    }

    resetWordList(): void {
        this.vocabBuilderStateService.resetState();
        this.reset();
        this.vocabBuilderStateService.setLoading(true);
        this.clearAccountWordListsReference();
        this.fetchReferenceData().pipe(takeUntil(this.getDestroyInterceptor())).subscribe();
    }

    reset(resetQueryParams: boolean = true): void {
        if (this.isWordsPreSelected || resetQueryParams) {
            this.resetQueryParams();
        }
        this.classTestExamId = 0;
        this.isWordsPreSelected = false;
        this.shouldAutoStart = false;
        this.vocabularyAppSharedService.reset();
    }

    resetQueryParams(): void {
        const url = this.router.url;
        const baseUrl: string = url?.substring(0, url.indexOf("?"));
        if (baseUrl) {
            this.router.navigateByUrl(baseUrl);
        }
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
