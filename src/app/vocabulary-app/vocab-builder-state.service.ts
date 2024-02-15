import { Injectable } from "@angular/core";
import { BehaviorSubject, forkJoin, Observable, of, Subject, Subscription, throwError } from "rxjs";

import { VocabBuilderProgressService } from "./vocab-builder-progress.service";


import { VocabBuilderEventHandler } from "./event-handler/vocab-builder-event-handler";



import { LocalForageGeneric } from "../../core/local-forage-generic";
import {
    assign,
    cloneDeep,
    filter,
    find,
    get,
    head,
    includes,
    isArray,
    isBoolean,
    isEmpty,
    isEqual,
    isUndefined,
    map,
    orderBy,
    reduce,
    size,
    some,
    tail,
    unionBy,
    values
} from "lodash-es";


import { catchError, finalize, map as rxJsMap, tap } from "rxjs/operators";
import { StopWatch } from "../common/stopwatch";
import { Logger } from "../common/logger";
import { Emitter } from "../common/emitter";
import {
  LevelTestDetail,
  MESSAGE_CODE_COMPLETE,
  MESSAGE_CODE_INCOMPLETE,
  XQuizWord,
  XWordQuiz
} from "../../types/vocabulary-quiz";
import {
  DEFAULT_WORD_LIST_TYPE_IDS,
  MY_WORDS_WORD_LIST, MY_WORDS_WORD_LIST_COLLECTION,
  MY_WORDS_WORD_LIST_NAMES,
  WordList
} from "../../types/word-list-reference";
import {
  ERROR_BAND_COMPLETE,
  ERROR_KEY_LIST_RANK_EXCEEDED,
  ERROR_KEY_NO_WORDS_AVAILABLE,
  getSupportedModes,
  MIXED_MODE_STRICT,
  MODE_ALL,
  MODE_DEFAULT,
  modesToScalar,
  VocabBuilderMode,
  VocabBuilderReference,
  VocabBuilderStyle
} from "../../types/vocab-builder-reference";
import {
  LocalUserVocabularySettings,
  VOCAB_BUILDER_STYLE_ID_SEQUENTIAL,
  VocabBuilderSetting,
  VocabBuilderSettings
} from "../../types/vocab-builder-settings";
import { QuizDataSourceAbstract } from "./quiz-data-source/quiz-data-source-abstract";
import { WordV1 } from "../../types/word-v1";
import { WordListLearned } from "../../types/word-list-learned";
import { MyWordStateV1 } from "../../types/my-word-state-v1";
import { MyWordState, MyWordStateV2 } from "../../types/my-word-state-v2";
import { VltQuizScore } from "../../types/vocab-level-test";
import { isAfter, isBefore } from "date-fns";
import { WordProgressModelService } from "../model/word-progress.model.service";
import { AdaptiveQuizModelService } from "../model/adaptive-quiz-model.service";
import { ReferenceModelService } from "../model/reference-model.service";
import { StudyLevelModelService } from "../model/study-level-model.service";
import { IdentityService } from "../common/identity.service";
import { FeatureService } from "../common/feature.service";

const LOCAL_VOCABULARY_SETTINGS_KEY = "LocalUserVocabularySettings";

@Injectable()
export class VocabBuilderStateService {

    static EVENT_SET_ACCOUNT_ID = "setAccountId";
    static EVENT_SET_ARRIVAL_ID = "setArrivalId";
    static EVENT_APPEND_QUIZDATA = "appendQuizData";
    static EVENT_INITIALIZE = "initialize";
    static EVENT_RESET = "reset";
    static EVENT_START = "start";
    static EVENT_RESUME = "resumeSession";
    static EVENT_PAUSE = "pauseSession";
    static EVENT_END = "end";
    static EVENT_ON_ERROR = "onError";
    static EVENT_ON_APP_LOAD = "onLoad";
    static EVENT_ON_APP_CONTACT_SUPPORT_CLICK = "onContactSupportClick";
    static EVENT_ON_APP_GO_TO_MYWORDS_CLICK = "onGoToMyWordsClick";
    static EVENT_LEVEL_UP = "levelUp";
    static EVENT_FETCH_STATE = "queryState";
    static EVENT_FETCH_NEXT_DATA = "fetchNextData";
    static EVENT_SET_STATE = "setState";
    static EVENT_ON_APP_CLOSE = "onClose";
    static EVENT_LOAD_SETTING = "loadSetting";
    static EVENT_UPDATE_SETTING = "updateSetting";
    static EVENT_ON_GO_TO_MY_ENGLISH = "onGoToMyEnglish";
    static EVENT_ON_APP_GO_TO_VIDEOS = "onGoToVideos";
    static EVENT_ON_APP_GO_TO_VOCAB_BUILDER = "onGoToVocabBuilder";
    static EVENT_ON_APP_GO_TO_VIEW_WORDS_CLICK = "onGotoViewWords";
    static EVENT_ON_APP_GO_TO_PREVIOUS_ACTIVITY = "onGotoPreviousActivity";
    static EVENT_ON_START_NEW_PRACTICE = "onStartNewPractice";
    static EVENT_ON_NEW_WORD_INSTANCE_IDS = "onNewWordInstanceIds";

    static APP_EVENTS = [
        VocabBuilderStateService.EVENT_ON_APP_CONTACT_SUPPORT_CLICK,
        VocabBuilderStateService.EVENT_ON_APP_GO_TO_MYWORDS_CLICK,
        VocabBuilderStateService.EVENT_ON_APP_LOAD,
        VocabBuilderStateService.EVENT_ON_ERROR,
        VocabBuilderStateService.EVENT_ON_APP_CLOSE,
        VocabBuilderStateService.EVENT_FETCH_NEXT_DATA,
        VocabBuilderStateService.EVENT_FETCH_STATE,
        VocabBuilderStateService.EVENT_LEVEL_UP,
        VocabBuilderStateService.EVENT_UPDATE_SETTING,
        VocabBuilderStateService.EVENT_ON_APP_GO_TO_VIDEOS,
        VocabBuilderStateService.EVENT_ON_APP_GO_TO_PREVIOUS_ACTIVITY,
        VocabBuilderStateService.EVENT_START,
        VocabBuilderStateService.EVENT_ON_START_NEW_PRACTICE,
        VocabBuilderStateService.EVENT_ON_NEW_WORD_INSTANCE_IDS
    ];

    private loading: boolean = true;
    private quizLoading: boolean = false;
    private myWordsListsCountsLoading: boolean = false;
    private scoreCalculationLoading: boolean = false;
    private levelUpdateProcessing: boolean = false;
    private wordListsProgressLoading: boolean = false;

    private started: boolean = false;
    private completed: boolean = false;
    private paused: boolean = false;
    private error: boolean = false;
    private wordsRecycled: boolean = false;
    private errorKey: string;

    private emitter = new Emitter();
    private logger = new Logger();
    private stopwatch = new StopWatch();

    private currentQuiz: XWordQuiz;
    private wordLists: WordList[];
    private accountSelectableWordLists: WordList[] = [];
    private accountSelectableWordListsCount: number;
    private wordQueue?: XQuizWord[];
    private recycleWordQueue?: XQuizWord[] = [];
    private currentQuizWord?: XQuizWord;
    private currentIndex: number = 0;
    private quizLength: number = 0;

    private vocabBuilderReference?: VocabBuilderReference;
    private vocabBuilderSettings: VocabBuilderSettings;
    private currentSetting: VocabBuilderSetting = {};

    private eventHandler: VocabBuilderEventHandler;
    private quizDataSource: QuizDataSourceAbstract;

    private wordDetails: Map<number, WordV1> = new Map();
    private wordListsProgress: Map<number, WordListLearned> = new Map();

    private levelUpdated: boolean = false;
    private lastLevelTest: boolean = false;

    private localUserSettings = new LocalUserVocabularySettings();

    private addWordListPage: number = 0;

    private settingsDrawerEnabled: BehaviorSubject<boolean> = new BehaviorSubject(false);
    private initialStateFn = () => {
    };

    static readonly ADD_WORD_LIST_PAGE_SIZE = 30;

    constructor(private vocabBuilderProgressService: VocabBuilderProgressService,
                private adaptiveQuizModelService: AdaptiveQuizModelService,
                private wordProgressModelService: WordProgressModelService,
                private referenceModelService: ReferenceModelService,
                private studyLevelService: StudyLevelModelService,
                private identityService: IdentityService,
                private featureService: FeatureService) {
    }

    appendQuizData(vocabBuilderQuiz: XWordQuiz, autoStart: boolean = false): void {
        if (vocabBuilderQuiz && vocabBuilderQuiz.key && includes([ERROR_KEY_LIST_RANK_EXCEEDED, ERROR_KEY_NO_WORDS_AVAILABLE, ERROR_BAND_COMPLETE], vocabBuilderQuiz.key)) {
            this.logger.log("appendQuizData", vocabBuilderQuiz.key);

            return this.setStateComplete(vocabBuilderQuiz.key);
        }

        if (!vocabBuilderQuiz || isEmpty(vocabBuilderQuiz) || isEmpty(vocabBuilderQuiz.quizWords)) {
            if (!get(vocabBuilderQuiz, "autoStart", autoStart)) {
                return;
            }
            this.logger.log("appendQuizData: empty quiz object passed");

            return this.setStateComplete();
        }

        this.logger.log("appending data", vocabBuilderQuiz);

        let previouslyCompleted = this.completed;
        this.resetState();

        this.initialStateFn = () => {
            if (!this.hasCurrentSetting()) {
                this.setCurrentSetting({
                    wordListTypeId: vocabBuilderQuiz.wordListTypeId,
                    numberOfQuizItems: vocabBuilderQuiz.currentTotal || size(vocabBuilderQuiz.quizWords)
                });
            }

            this.currentQuiz = vocabBuilderQuiz;
            this.wordQueue = vocabBuilderQuiz.quizWords;
            this.quizLength = size(this.wordQueue);
            this.currentIndex = 0;

            this.vocabBuilderProgressService.setStepId(vocabBuilderQuiz.quizStepId);
            this.vocabBuilderProgressService.setCurrentCorrect(vocabBuilderQuiz.currentCorrect);
            this.vocabBuilderProgressService.setCurrentIncorrect(vocabBuilderQuiz.currentIncorrect);
            this.vocabBuilderProgressService.setCurrentTotal(vocabBuilderQuiz.currentTotal);

            if (!previouslyCompleted
                && (vocabBuilderQuiz.currentCorrect + vocabBuilderQuiz.currentIncorrect) > 0) {
                this.vocabBuilderProgressService.setState(MESSAGE_CODE_INCOMPLETE);
            }

            if (autoStart) {
                this.start();
            }
        };

        this.initialStateFn();

    }

    reInitialize(): void {
        this.initialStateFn();
    }

    fetchMyWordListCounts(): Observable<MyWordStateV2> {
        const params = {exclude: MyWordStateV1.MASTERED, applyExclusionsTo: MyWordStateV1.APPLY_EXCLUSIONS};
        return this.wordProgressModelService
            .getWordStateV2(params)
            .pipe(
                catchError(() => of({})),
                tap((wordsProgressState: MyWordStateV2) => {
                    const listCounts = get(wordsProgressState, "overall", 0) as MyWordStateV1;

                    map(MY_WORDS_WORD_LIST, (wordList) => {
                        this.setMyWordsListsCounts(wordList, listCounts);
                    });
                })
            );
    }

    fetchMyWordListCountsSharedMeaning(): Observable<MyWordState> {
        const params = {
            exclude: MyWordStateV1.MASTERED,
            applyExclusionsTo: MyWordStateV1.APPLY_EXCLUSIONS,
            accountId: this.identityService.getAccountId()
        };
        return this.wordProgressModelService
            .getMyWordsCount(params)
            .pipe(
                catchError(() => of({})),
                tap((myWordsContainer: MyWordState) => {
                    const listCounts = get(myWordsContainer, "overall", 0) as MyWordStateV1;

                    map(MY_WORDS_WORD_LIST, (wordList) => {
                        this.setMyWordsListsCounts(wordList, listCounts);
                    });
                })
            );
    }

    fetchAccountSelectableWordLists(): Observable<WordList[]> {
        return this.referenceModelService.getCachedAccountSelectableWordLists({
            accountSelectable: true,
            allAvailable: true,
            page: this.addWordListPage,
            pageSize: VocabBuilderStateService.ADD_WORD_LIST_PAGE_SIZE,
            siteLanguage: this.identityService.getSiteLanguage()
        })
            .pipe(
                catchError(() => {
                    return of([]);
                }),
                tap((wordList: WordList[]) => {
                    const sortedLists = this.sortAccountSelectableLists(wordList);
                    this.setAccountSelectableWordLists(sortedLists);
                })
            );
    }

    fetchAccountSelectableWordListsCount(): Observable<number> {
        return this.referenceModelService.getCachedAccountSelectableWordListsCount({
            accountSelectable: true,
            allAvailable: true
        })
            .pipe(
                catchError(() => {
                    return of([]);
                }),
                tap((wordListCount: number) => {
                    this.setAccountSelectableWordListsCount(wordListCount);
                })
            );
    }

    fetchLevelTestScoreAndDetail(showBandScore: boolean, fetchScoreDetail: boolean): Observable<any[]> {
        this.setScoreCalculationLoading(true);

        const accountId = this.vocabBuilderProgressService.getAccountId();

        let observableSource: Observable<any>[] = [];

        const bandScore$ = showBandScore ? this.fetchBandScore(accountId, this.getCurrentSetting()) : of(undefined);
        const levelTestResult$ = fetchScoreDetail ? this.fetchLevelTestDetail(accountId, this.getCurrentSetting()) : of(undefined);

        observableSource.push(bandScore$);
        observableSource.push(levelTestResult$);

        return forkJoin(observableSource)
            .pipe(
                finalize(() => this.setScoreCalculationLoading(false)),
                tap(([score, detail]) => {
                    this.calculateTotalCorrectlyAnswered(detail);
                    this.vocabBuilderProgressService.setLevelTestDetail(detail);
                    this.vocabBuilderProgressService.setVltQuizScore(score);
                    this.vocabBuilderProgressService.setState(MESSAGE_CODE_COMPLETE);
                })
            );
    }

    fetchWordListsProgress(wordListTypeIds: number[]): Observable<WordListLearned[]> {
        if (!isEmpty(this.wordListsProgress)) {
            return of(Array.from(this.wordListsProgress.values()));
        }
        this.setWordListsProgressLoading(true);

        const accountID = this.identityService.getAccountId();
        const params = {
            accountId: accountID,
            wordListTypeIds: wordListTypeIds
        };
        return this.adaptiveQuizModelService
            .getWordListsMasteriesContent(params)
            .pipe(
                catchError(() => {
                    const wordListsLearned = map(wordListTypeIds, (wordListTypeId) => {
                        const wordListLearned = assign({}, new WordListLearned(), {
                            wordsLearned: 0,
                            wordCount: this.getWordLists()[wordListTypeId]?.maxWordRank,
                            wordListTypeId: wordListTypeId
                        });
                        this.wordListsProgress.set(wordListTypeId, wordListLearned);
                        return wordListLearned;
                    });
                    return of(wordListsLearned);
                }),
                rxJsMap((wordListsLearned) => {
                    map(wordListsLearned, (wordListLearned) => {
                        this.wordListsProgress.set(wordListLearned.wordListTypeId, wordListLearned);
                    });
                    return wordListsLearned;
                }),
                tap(() => this.setWordListsProgressLoading(false))
            );
    }

    private calculateTotalCorrectlyAnswered(detail: LevelTestDetail): void {
        this.vocabBuilderProgressService.setCurrentCorrect(this.getQuizDataSource().calculateTotalCorrectlyAnswered(detail));
    }

    private fetchBandScore(accountId: number, settings: VocabBuilderSetting): Observable<VltQuizScore> {
        return this.getQuizDataSource().fetchBandScore(accountId, settings).pipe(catchError((error) => {
            this.logger.error("error on fetching band score", error);
            this.setErrorState(true);
            return throwError(error);
        }));
    }

    private fetchLevelTestDetail(accountId: number, settings: VocabBuilderSetting): Observable<LevelTestDetail> {
        return this.getQuizDataSource().fetchLevelTestDetail(accountId, settings).pipe(catchError((error) => {
            this.logger.error("error on fetching level test detail", error);
            this.setErrorState(true);
            return throwError(error);
        }));
    }

    /* sort by name and selected info */
    sortAccountSelectableLists(lists: WordList[]): WordList[] {
        const sortedByName = orderBy(lists, [list => list.name.toLowerCase()], ["asc"]);
        return orderBy(sortedByName, [list => this.isWordListAdded(list.wordListTypeId)], ["desc"]);
    }

    isWordListAdded(wordListTypeId: number): boolean {
        return some(this.getWordLists(), (wordList) => {
            return isEqual(wordListTypeId, wordList.wordListTypeId);
        });
    }

    getWordListsProgress(): Map<number, WordListLearned> {
        return this.wordListsProgress;
    }

    getAddWordListPage(): number {
        return this.addWordListPage;
    }

    setAddWordListPage(page: number): void {
        this.addWordListPage = page;
    }

    getErrorKey(): string {
        return this.errorKey;
    }

    setErrorKey(key: string): void {
        this.errorKey = key;
    }

    updateLevel(level: number): Observable<number> {
        let options = {
            studyLevel: level
        };
        return this.studyLevelService.putLevel(options)
            .pipe(
                catchError((error) => {
                    this.studyLevelService.deleteLevelCache();
                    this.setErrorState(true);
                    this.logger.error(error);
                    return throwError(error);
                }),
                rxJsMap((result: number) => {
                    this.setLevelUpdated(true);
                    this.studyLevelService.deleteLevelCache();
                    return result;
                })
            );
    }

    private setStateComplete(errorKey?: string): void {
        this.vocabBuilderProgressService.setState(MESSAGE_CODE_COMPLETE);
        this.currentQuizWord = undefined;
        this.quizLength = undefined;
        if (errorKey) {
            this.setErrorKey(errorKey);
        }
        this.setCompleted(true);
        this.setQuizLoading(false);
        this.setLoading(false);
    }

    setReference(vocabBuilderReference: VocabBuilderReference): void {
        this.vocabBuilderReference = vocabBuilderReference;

        this.vocabBuilderReference.vocabBuilderStyles = cloneDeep(get(this.vocabBuilderReference, "vocabBuilderStyles", []));
        some(vocabBuilderReference.vocabBuilderStyles, (studyMode, index) => {
            const isSequentialStudyMode = isEqual(studyMode.vocabBuilderStyleId, VOCAB_BUILDER_STYLE_ID_SEQUENTIAL);
            if (isSequentialStudyMode) {
                this.vocabBuilderReference.vocabBuilderStyles.splice(index, 1);
                this.vocabBuilderReference.vocabBuilderStyles.push(studyMode);
            }
            return isSequentialStudyMode;
        });
    }

    addWordToRecycle(word: XQuizWord): void {
        if (some(this.recycleWordQueue, recycleWord => isEqual(recycleWord.word.wordRootId, word.word.wordRootId))) {
            return;
        }
        this.recycleWordQueue.push(word);
    }

    getWordListReference(): WordList[] {
        return get(this.vocabBuilderReference, "wordLists", []);
    }

    getDefaultWordLists(): WordList[] {
        return filter(this.getWordListReference(), (wordList: WordList) => {
            return includes(DEFAULT_WORD_LIST_TYPE_IDS, wordList.wordListTypeId);
        });
    }

    getWordLists(): WordList[] {
        if (isEmpty(this.wordLists)) {
            return this.getDefaultWordLists();
        }
        return this.wordLists;
    }

    getNonMyWordsWordListsTypeIds(): number[] {
        return !this.wordLists ? [] : this.wordLists
            .map((wordList) => wordList.wordListTypeId)
            .filter((wordListTypeId) => !this.isMyWordList(wordListTypeId));
    }

    getAccountSelectableWordLists(): WordList[] {
        return this.accountSelectableWordLists;
    }

    getAccountSelectableWordListsCount(): number {
        return this.accountSelectableWordListsCount;
    }

    setWordLists(wordLists: WordList | WordList[]): void {
        this.wordLists = this.getQuizDataSource().setWordList(wordLists);
    }

    setAccountSelectableWordLists(wordLists: WordList[]): void {
        this.accountSelectableWordLists = wordLists;
    }

    setAccountSelectableWordListsCount(wordListsCount: number): void {
        this.accountSelectableWordListsCount = wordListsCount;
    }

    getModeReference(): VocabBuilderMode[] {
        if (this.featureService.isPwaV2Enabled()) {
            return getSupportedModes(
                get(this.vocabBuilderReference, "vocabBuilderModes", []),
                this.featureService.getFeature("PWAVocabularyPublicModes")
            );
        }
        return getSupportedModes(
            get(this.vocabBuilderReference, "vocabBuilderModes", []),
            this.featureService.getFeature("vocabBuilderPublicModes")
        );
    }

    getModeNumbers(): number[] {
        return map((this.getModeReference()), (mode) => {
            return mode.vocabBuilderModeId;
        });
    }

    getFilteredModesWithCurrentSettings(currentSetting: VocabBuilderSetting): number[] {
        if (isEmpty(currentSetting.vocabBuilderModeIds)) {
            return [MODE_DEFAULT];
        }
        if (currentSetting.vocabBuilderModeIds.length > 1) {
            return MIXED_MODE_STRICT;
        }
        return currentSetting.vocabBuilderModeIds;
    }

    getStyleReference(): VocabBuilderStyle[] {
        return get(this.vocabBuilderReference, "vocabBuilderStyles", []);
    }

    getMixedModeReference(): number[] {
        return get(this.vocabBuilderReference, "mixedModes", []);
    }

    setEventHandler(handler: VocabBuilderEventHandler): void {
        this.eventHandler = handler;
    }

    getEventHandler(): VocabBuilderEventHandler {
        return this.eventHandler;
    }

    setQuizDataSource(quizDataSource: QuizDataSourceAbstract): void {
        this.quizDataSource = quizDataSource;
    }

    getQuizDataSource(): QuizDataSourceAbstract {
        return this.quizDataSource;
    }

    setVocabBuilderSettings(settings: VocabBuilderSettings): void {
        this.vocabBuilderSettings = settings;
    }

    getSetting<T>(key: string, defaultValue?: T): T | undefined {
        if (isEmpty(this.currentSetting)) {
            return defaultValue;
        }

        return get(this.currentSetting, key, defaultValue);
    }

    getCurrentSetting(): VocabBuilderSetting {
        return this.currentSetting;
    }

    hasCurrentSetting(): boolean {
        return !isEmpty(this.getCurrentSetting()) && !isUndefined(this.getCurrentSetting());
    }

    getCurrentModeSetting(): number {
        let currentQuizWord = this.getCurrentQuizWord();
        if (currentQuizWord && currentQuizWord.modeId) {
            return currentQuizWord.modeId;
        }

        let currentModes = this.getSetting<number[]>("vocabBuilderModeIds");
        return modesToScalar(currentModes);
    }

    isCurrentModeMixed(): boolean {
        let currentModes = this.getSetting<number[]>("vocabBuilderModeIds");
        return modesToScalar(currentModes) == MODE_ALL;
    }

    private getDefaultStyleTypeId(): number | undefined {
        return get(head(this.getStyleReference()), "vocabBuilderStyleId");
    }

    getVocabBuilderStyleNameById(vocabBuilderStyleId: number): string {
        let currentStyle = find(this.getStyleReference(), style => {
            return style.vocabBuilderStyleId == vocabBuilderStyleId;
        });

        return get(currentStyle, "name", "");
    }

    getVocabBuilderStyleIdByName(vocabBuilderStyleName: string): number {
        const currentStyle = find(this.getStyleReference(), style => {
            return style.name == vocabBuilderStyleName;
        });

        return get(currentStyle, "vocabBuilderStyleId");
    }

    getCurrentStyleId(): number | undefined {
        return this.getSetting<number>("vocabBuilderStyleId", this.getDefaultStyleTypeId());
    }

    getLocalUserSetting<T>(settingsKey: string): T | undefined {
        return get(this.localUserSettings, settingsKey);
    }

    updateCurrentQuestionMode(mode: number): void {
        this.currentQuizWord.modeId = mode;
        this.replaceAllWordQueueModes(mode);
    }

    replaceAllWordQueueModes(mode): void {
        this.wordQueue.forEach(item => item.modeId = mode);
    }

    async generateLocalUserSettings(): Promise<void> {
        const LOCAL_USER_VOCABULARY_SETTINGS_FEATURE_MAPPING = {
            recycleSkippedWords: false,
            recycleMissedWords: false
        };

        const localStorage = new LocalForageGeneric<LocalUserVocabularySettings>(LOCAL_VOCABULARY_SETTINGS_KEY);
        const localStorageSettings = await localStorage.getItem(`${this.vocabBuilderProgressService.getAccountId()}_${LOCAL_VOCABULARY_SETTINGS_KEY}`) || {};

        this.localUserSettings = reduce(LOCAL_USER_VOCABULARY_SETTINGS_FEATURE_MAPPING, (acc, featureKey, settingKey) => {
            const localStorageSetting = get(localStorageSettings, settingKey);
            if (!isUndefined(localStorageSetting)) {
                acc[settingKey] = localStorageSetting;
                return acc;
            }

            acc[settingKey] = featureKey;
            return acc;

        }, assign({}, localStorageSettings));
        this.setCurrentSetting(this.localUserSettings);

        Promise.resolve(this.localUserSettings);
    }

    async setLocalUserSettings(settingKey: string, value: any): Promise<void> {
        let localStorage = new LocalForageGeneric<object>(LOCAL_VOCABULARY_SETTINGS_KEY);
        this.localUserSettings[settingKey] = value;
        localStorage.setItem(`${this.vocabBuilderProgressService.getAccountId()}_${LOCAL_VOCABULARY_SETTINGS_KEY}`, assign(this.localUserSettings))
            .then(() => {
                this.logger.log("Recycle behavior local setting is set to", this.localUserSettings);
                this.setCurrentSetting(this.localUserSettings);
            });
    }

    getNextWordListTypeId(wordListTypeId: number): number {
        if (this.vocabBuilderProgressService.getFinishedListId()) {
            const currentWordList = this.getCurrentVocabList();
            const nextWordListTypeId = this.findNextWordListId(currentWordList);
            this.vocabBuilderProgressService.setFinishedListId(undefined);
            this.logger.log("Next word list type id is", nextWordListTypeId);
            return nextWordListTypeId;
        }
        this.logger.log("Next word list type id is", wordListTypeId);
        return wordListTypeId;
    }

    getLatestSetting(): VocabBuilderSetting {
        return get(this.vocabBuilderSettings, "latestSetting");
    }

    setCurrentSetting(setting: object = {}): void {
        let filteredSetting: object = reduce(setting, (acc, value, key) => {
            if (!isArray(value) && (isBoolean(value) || value)) {
                acc[key] = value;
            } else if (isArray(value) && !isEmpty(value)) {
                acc[key] = value;
            }
            return acc;
        }, {});

        if (isEmpty(filteredSetting)) {
            return;
        }

        const currentSetting = assign(this.currentSetting, filteredSetting ?? {});
        this.currentSetting = assign(currentSetting, {vocabBuilderModeIds: this.getFilteredModesWithCurrentSettings(currentSetting)});

        this.logger.log("Set Current Setting: ", this.currentSetting);
    }

    setCurrentStyle(setting: object = {}): void {
        let filteredSetting = reduce(setting, (acc, value, key) => {
            if (value || !isEmpty(value)) {
                acc[key] = value;
            }
            return acc;
        }, {});

        if (isEmpty(setting)) {
            return;
        }

        let currentStyle = get(this.currentSetting, "styleSetting", {});
        this.setCurrentSetting({
            styleSetting: assign({}, currentStyle, filteredSetting)
        });
    }

    setReviewItemRatio(ratio: number): void {
        assign(this.currentSetting, {reviewItemRatio: ratio});
        this.logger.log("Set Current Setting: ", this.currentSetting);
    }

    loadSetting(wordListTypeId: number): void {
        const settings = get(this.vocabBuilderSettings, "wordListTypeIdToAccountSettings");
        if (settings) {
            return this.setCurrentSetting(settings ? settings[wordListTypeId] : undefined);
        }

        const activitySettings = get(this.vocabBuilderSettings, "vocabBuilderModeIds");
        if (activitySettings) {
            return this.setCurrentSetting(this.vocabBuilderSettings);
        }
    }

    getCurrentBand(): number | undefined {
        return get(this.currentQuiz, "band");
    }

    getCurrentRank(): number | undefined {
        return this.getCurrentQuizWordRank() || this.getCurrentQuizRank();
    }

    getCurrentWordListTypeId(): number | undefined {
        return this.getSetting<number>("wordListTypeId", this.getDefaultWordListTypeId()) ?? this.getWordLists()?.[0]?.wordListTypeId;
    }

    private getDefaultWordListTypeId(): number | undefined {
        return get(head(this.getWordListReference()), "wordListTypeId");
    }

    getCurrentVocabList(): WordList {
        return this.findVocabListByWordListTypeId(this.getCurrentWordListTypeId());
    }

    findVocabListByWordListTypeId(wordListTypeId: number): WordList {
        return find(this.getWordLists(), wordList => {
            return wordList.wordListTypeId === wordListTypeId;
        });
    }

    getCurrentVocabListWordListTypeId(): number {
        return get(this.getCurrentVocabList(), "wordListTypeId", 0);
    }

    getCurrentVocabListName(): string {
        return get(this.getCurrentVocabList(), "name", "");
    }

    getCurrentLevelTestDifficulty(): number {
        return get(this.getCurrentVocabList(), "levelUpList", 1);
    }

    getCurrentVocabListNameDescription(): string {
        return get(this.getCurrentVocabList(), "description", "");
    }

    getCurrentVocabListMaxWordRank(): number {
        return get(this.getCurrentVocabList(), "maxWordRank", 0);
    }

    getCurrentModeName(): string {
        const currentMode = find(this.getModeReference(), mode => {
            return mode.vocabBuilderModeId == this.getCurrentModeSetting();
        });

        return get(currentMode, "name", "");
    }

    getCurrentModeDescription(): string {
        let currentMode = find(this.getModeReference(), mode => {
            return mode.vocabBuilderModeId == this.getCurrentModeSetting();
        });

        return get(currentMode, "description", "");
    }

    getCurrentStyleName(): string {
        let currentStyle = find(this.getStyleReference(), style => {
            return style.vocabBuilderStyleId == this.getCurrentStyleId();
        });

        return get(currentStyle, "name", "");
    }

    generateNextQuizWord(): void {
        if (this.getQuizDataSource()?.isNextWordAdaptive()) {
            return this.generateNextAdaptiveQuizWord();
        }
        this.generateNextLocalQuizWord();
    }

    private generateNextLocalQuizWord(): void {
        this.currentQuizWord = head(this.wordQueue);

        if (!this.currentQuizWord && this.shouldRecycleWords()) {
            this.setWordsRecycled(true);
            this.vocabBuilderProgressService.setRecycleSessionStarted(true);
            this.wordQueue = cloneDeep(this.recycleWordQueue);
            this.currentIndex = 0;
            this.currentQuizWord = head(this.wordQueue);
            this.vocabBuilderProgressService.startTimer();
            this.recycleWordQueue = [];
            this.logger.log("next local word", this.currentQuizWord, this.wordQueue);
        }

        if (!this.currentQuizWord) {
            return this.publish(VocabBuilderStateService.EVENT_FETCH_STATE);
        }

        this.wordQueue = tail(this.wordQueue);
        if (!this.isRecycleEnabled()) {
            this.currentIndex += 1;
        } else {
            this.currentIndex = this.quizLength - (this.recycleWordQueue.length + this.wordQueue.length);
        }

        this.vocabBuilderProgressService.startTimer();
        this.logger.log("next local word", this.currentQuizWord, this.wordQueue);
    }

    private generateNextAdaptiveQuizWord(): void {
        this.setLoading(true);
        this.getQuizDataSource().getNextAdaptiveWord(
            this.identityService.getAccountId(),
            this.getCurrentSetting()
        ).pipe(
            finalize(() => {
                this.setLoading(false);
            })
        ).subscribe((adaptiveQuizWord) => {
            if (adaptiveQuizWord?.shouldStop || !adaptiveQuizWord?.quizWord || this.currentIndex == 15) {
                return this.publish(VocabBuilderStateService.EVENT_FETCH_STATE, adaptiveQuizWord);
            }
            this.currentIndex += 1;
            this.currentQuizWord = adaptiveQuizWord.quizWord;
            this.setLoading(false);
            this.vocabBuilderProgressService.startTimer();
            this.logger.log("next adaptive word", this.currentQuizWord, this.wordQueue);
        });
        this.currentQuizWord = undefined;
    }

    shouldRecycleWords(): boolean {
        const isRecycleEnabled = this.isRecycleEnabled();
        const isResultPerfect = this.vocabBuilderProgressService.isPerfect();
        const isAnyWordsToRecycle = !isUndefined(this.recycleWordQueue) && !isEmpty(this.recycleWordQueue);

        return isRecycleEnabled && !isResultPerfect && isAnyWordsToRecycle;
    }

    setMyWordsListsCounts(wordList: WordList, listCounts: MyWordStateV1): void {
        switch (wordList.name) {
            case MY_WORDS_WORD_LIST_NAMES.all:
                unionBy(this.wordLists, assign(wordList, {maxWordRank: listCounts.all}));
                return;
            case MY_WORDS_WORD_LIST_NAMES.favorites:
                unionBy(this.wordLists, assign(wordList, {maxWordRank: listCounts.favorites}));
                return;
            case MY_WORDS_WORD_LIST_NAMES.known:
                unionBy(this.wordLists, assign(wordList, {maxWordRank: listCounts.known}));
                return;
            case MY_WORDS_WORD_LIST_NAMES.mastered:
                unionBy(this.wordLists, assign(wordList, {maxWordRank: listCounts.mastered}));
                return;
            case MY_WORDS_WORD_LIST_NAMES.missed:
                unionBy(this.wordLists, assign(wordList, {maxWordRank: listCounts.missed}));
                return;
            default:
                throw "no count for this word list";
        }
    }

    getQuizLength(): number {
        return this.quizLength;
    }

    getCurrentQuizWord(): XQuizWord | undefined {
        return this.currentQuizWord;
    }

    private getCurrentQuizWordRank(): number | undefined {
        return get(this.currentQuizWord, "rank");
    }

    private getCurrentQuizRank(): number | undefined {
        return get(this.currentQuiz, "rank");
    }

    getCurrentQuizBand(): number | undefined {
        return get(this.currentQuiz, "band");
    }

    getCurrentIndex(): number {
        return this.currentIndex;
    }

    getWordsDetails(): Map<number, WordV1> {
        return this.wordDetails;
    }

    setWordsDetails(wordDetails: Map<number, WordV1>): void {
        this.wordDetails = wordDetails;
    }

    private findNextWordListId(currentWordList: WordList): number {
        const indexOfCurrentWordList = this.getWordLists().indexOf(currentWordList);
        const nextWordList = this.getWordLists().find((wordList, index) => {
            return index > indexOfCurrentWordList && wordList.maxWordRank;
        });
        return nextWordList.wordListTypeId;
    }

    isRecycleEnabled(): boolean {
        return this.getQuizDataSource().isRecycleEnabled() && (this.getCurrentSetting().recycleMissedWords || this.getCurrentSetting().recycleSkippedWords);
    }

    isMyWordList(wordListTypeId: number): boolean {
        return includes(values(MY_WORDS_WORD_LIST_COLLECTION), wordListTypeId);
    }

    isTestNotStarted(): boolean {
        let startTime = get(this.currentQuiz, "examStart");
        return startTime && isBefore(new Date(startTime), new Date(Date.now()));
    }

    isTestExpired(): boolean {
        let expiryTime = get(this.currentQuiz, "expiry");
        return expiryTime && isAfter(new Date(expiryTime), new Date(Date.now()));
    }

    isLastLevelTest(): boolean {
        return this.lastLevelTest;
    }

    setLastLevelTest(lastLevelTest: boolean): void {
        this.lastLevelTest = lastLevelTest;
    }

    start(): void {
        this.setLoading(false);
        this.setQuizLoading(false);

        if (this.started) {
            return;
        }

        if (this.vocabBuilderProgressService.getState() != MESSAGE_CODE_COMPLETE) {
            this.vocabBuilderProgressService.setState(undefined);
        }
        this.publish(VocabBuilderStateService.EVENT_START);
        this.stopwatch.start();
        this.paused = false;
        this.started = true;
        this.settingsDrawerEnabled.next(false);
        this.setCompleted(false);

        this.vocabBuilderProgressService.startSession();
        this.generateNextQuizWord();
    }

    setLoading(loading: boolean): void {
        this.loading = loading;
    }

    isLoading(): boolean {
        return this.loading;
    }

    setWordListsProgressLoading(loading: boolean): void {
        this.wordListsProgressLoading = loading;
    }

    isWordListsProgressLoading(): boolean {
        return this.wordListsProgressLoading;
    }

    setScoreCalculationLoading(loading: boolean): void {
        this.scoreCalculationLoading = loading;
    }

    isScoreCalculationLoading(): boolean {
        return this.scoreCalculationLoading;
    }

    setLevelUpdateProcessing(levelUpdating: boolean): void {
        this.levelUpdateProcessing = levelUpdating;
    }

    isLevelUpdateProcessing(): boolean {
        return this.levelUpdateProcessing;
    }

    setMyWordsListsCountsLoading(loading: boolean): void {
        this.myWordsListsCountsLoading = loading;
    }

    isMyWordsListsCountsLoading(): boolean {
        return this.myWordsListsCountsLoading;
    }

    setQuizLoading(loading: boolean): void {
        this.quizLoading = loading;
    }

    isQuizLoading(): boolean {
        return this.quizLoading;
    }

    isPaused(): boolean {
        return this.paused;
    }

    isStarted(): boolean {
        return this.started;
    }

    setCompleted(completed: boolean): void {
        this.completed = completed;
    }

    isCompleted(): boolean {
        return this.completed;
    }

    isLevelUpdated(): boolean {
        return this.levelUpdated;
    }

    setLevelUpdated(updated: boolean): void {
        this.levelUpdated = updated;
    }

    setErrorState(error: boolean): void {
        if (error) {
            this.setCompleted(true);
            this.setQuizLoading(false);
            this.setLoading(false);
            this.error = true;
        }
    }

    isErrorState(): boolean {
        return this.error;
    }

    isWordsRecycled(): boolean {
        return this.wordsRecycled;
    }

    isSettingsDrawerEnabled(): boolean {
        return this.settingsDrawerEnabled.getValue();
    }

    setWordsRecycled(recycled: boolean): void {
        this.wordsRecycled = recycled;
    }

    restart(): void {
        this.reset();
    }

    ready(): void {
        this.publish(VocabBuilderStateService.EVENT_ON_APP_LOAD);
    }

    end(): void {
        this.stopwatch.stop();
        this.loading = false;
        this.paused = false;
        this.setCompleted(true);
        this.publish(VocabBuilderStateService.EVENT_END);
    }

    pause(): void {
        this.paused = true;
        this.stopwatch.stop();
    }

    resume(): void {
        this.paused = false;
        this.stopwatch.start();
    }

    resetState(): void {
        this.started = false;
        this.error = false;
        this.loading = false;
        this.setCompleted(false);
        this.paused = false;
        this.currentQuizWord = undefined;
        this.stopwatch.reset();
        this.quizLength = undefined;
        this.setAccountSelectableWordLists([]);
        this.setAccountSelectableWordListsCount(0);
        this.setWordsRecycled(false);
        this.setLevelUpdated(false);
        this.setErrorKey(undefined);
        this.recycleWordQueue = [];
        this.wordListsProgress = new Map<number, WordListLearned>();
        this.settingsDrawerEnabled.next(false);
        this.vocabBuilderProgressService.reset();
    }

    reset(resetLists: boolean = false): void {
        this.logger.log("Resetting the quiz with resetLists=", resetLists);
        this.resetState();
        this.publish(VocabBuilderStateService.EVENT_RESET, resetLists);
    }

    resetCurrentSetting(): void {
        this.currentSetting = {};
    }

    resetReviewItemRatio(): void {
        this.setReviewItemRatio(undefined);
    }

    setSettingsDrawerEnabled(enabled: boolean): void {
        this.settingsDrawerEnabled.next(enabled);
    }

    close(): void {
        this.publish(VocabBuilderStateService.EVENT_ON_APP_CLOSE);
    }

    getObservable(eventName: string): Subject<any> {
        return this.emitter.getObservable(eventName);
    }

    subscribe(eventName: string, successFn: (data?) => void, errorFn?: (e?) => void): Subscription {
        return this.emitter.subscribe(eventName, successFn, errorFn);
    }

    publish(eventName: string, data?: any): void {
        this.emitter.publish(eventName, data);
    }

    destroy(): void {
        if (this.emitter) {
            this.emitter.destroy();
        }
        if (this.eventHandler) {
            this.eventHandler.destroy();
        }
    }
}
