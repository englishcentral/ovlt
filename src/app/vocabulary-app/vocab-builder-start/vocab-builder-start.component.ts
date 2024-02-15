import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, TemplateRef, ViewChild } from "@angular/core";
import { Location } from "@angular/common";
import { VocabBuilderProgressService } from "../../../../activity-app/vocab-builder-app/vocab-builder-progress.service";
import { FeatureService } from "../../../../core/feature.service";
import { GlobalSettingService } from "../../../../core/global-setting.service";
import { NgbModal, NgbModalOptions, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import {
    DEFAULT_QUIZ_ITEMS,
    MAX_QUIZ_ITEMS,
    MIN_QUIZ_ITEMS,
    MIN_RANK,
    MyWordsListTypeIds,
    WordList
} from "../../../../model/types/word-list-reference";
import { Browser } from "../../../../core/browser";
import {
    MODE_ALL,
    QUIZ_TYPE_SEQUENTIAL,
    scalarToModes,
    VocabBuilderMode,
    VocabBuilderStyle
} from "../../../../model/types/vocab-builder-reference";
import { MESSAGE_CODE_INCOMPLETE } from "../../../../model/types/vocabulary-quiz";
import { VocabularyAppSharedService } from "../../vocabulary-app/vocabulary-app-shared.service";
import { VocabBuilderStateService } from "../../../../activity-app/vocab-builder-app/vocab-builder-state.service";
import { takeUntil, tap } from "rxjs/operators";
import { forkJoin } from "rxjs";
import { SubscriptionAbstract } from "../../../../core/subscription.abstract";
import { assign, get, isEmpty, isEqual, lowerCase, size } from "lodash-es";
import { WordListLearned } from "../../../../model/types/word-list-learned";

@Component({
    selector: "ec-vocab-builder-start",
    templateUrl: "vocab-builder-start.component.html",
    styleUrls: ["vocab-builder-start.component.scss"]
})
export class VocabBuilderStartComponent extends SubscriptionAbstract implements OnDestroy {
    @ViewChild("addWordListPopup", {static: false}) addWordListPopup: TemplateRef<any>;

    @Input() practice: boolean = false;
    @Input() autoStart: boolean = false;
    @Input() recycleEnabled: boolean = false;

    @Output() eventStartQuiz = new EventEmitter<boolean>();
    @Output() eventWordListUpdated = new EventEmitter<void>();
    @Output() eventWordListSelected = new EventEmitter<number>();

    private settingsDrawerOpen: boolean = false;
    private mobileWordListRendererOpen: boolean = false;
    private mobileQuestionTypeRendererOpen: boolean = false;

    private wordListsLoading: boolean = false;
    private moreLoading: boolean = false;
    private loadMoreEnabled: boolean = true;
    private wordListTouched: boolean = false;

    private modalReference: NgbModalRef;

    constructor(private elementRef: ElementRef,
                private vocabBuilderStateService: VocabBuilderStateService,
                private vocabBuilderProgressService: VocabBuilderProgressService,
                private vocabularyAppSharedService: VocabularyAppSharedService,
                private featureService: FeatureService,
                private globalSettingService: GlobalSettingService,
                private modalService: NgbModal,
                private location: Location) {
        super();
        this.globalSettingService.initializeFromElement(this.elementRef);
    }

    initializeAddWordList(): void {
        this.openModal(this.addWordListPopup);

        this.setWordListsLoading(true);

        forkJoin([
            this.vocabBuilderStateService.fetchAccountSelectableWordLists(),
            this.vocabBuilderStateService.fetchAccountSelectableWordListsCount()])
            .pipe(
                takeUntil(this.getDestroyInterceptor()),
                tap(() => {
                    const wordListsCount = this.vocabBuilderStateService.getAccountSelectableWordListsCount();
                    if (!wordListsCount || wordListsCount <= VocabBuilderStateService.ADD_WORD_LIST_PAGE_SIZE) {
                        this.setLoadMoreEnabled(false);
                    }
                    this.setWordListsLoading(false);
                })
            )
            .subscribe();
    }

    getCorrectedId(name: string | number, prefix: string): string {
        return `vb-${prefix}-${name.toString().toLowerCase().replace(/\s/g, "-")}`;
    }

    getWordListReference(): WordList[] {
        return this.vocabBuilderStateService.getWordListReference();
    }

    getWordLists(): WordList[] {
        return this.vocabBuilderStateService.getWordLists();
    }

    getWordListProgressInPercentage(wordListTypeId: number): number {
        const progress = this.vocabBuilderStateService.getWordListsProgress().get(wordListTypeId);
        return WordListLearned.getWordListProgressInPercentage(wordListTypeId, progress);
    }

    getCurrentWordListDescription(): string {
        return this.vocabBuilderStateService.getCurrentVocabListNameDescription();
    }

    getModeReference(): VocabBuilderMode[] {
        return this.vocabBuilderStateService.getModeReference();
    }

    getStyleReference(): VocabBuilderStyle[] {
        return this.vocabBuilderStateService.getStyleReference();
    }

    getCurrentVocabListName(): string {
        return this.vocabBuilderStateService.getCurrentVocabListName();
    }

    getCurrentVocabListMaxWordRank(): number {
        let maxWordRank = this.vocabBuilderStateService.getCurrentVocabListMaxWordRank();
        return maxWordRank ? maxWordRank : 0;
    }

    getCurrentVocabListMinWordRank(): number {
        return MIN_RANK;
    }

    getCurrentModeName(): string {
        return this.vocabBuilderStateService.getCurrentModeName();
    }

    getCurrentModeDescription(): string {
        return this.vocabBuilderStateService.getCurrentModeDescription();
    }

    getAccountSelectableWordLists(): WordList[] {
        return this.vocabBuilderStateService.getAccountSelectableWordLists();
    }

    getLocalUserSetting(key: string): any {
        return this.vocabBuilderStateService.getLocalUserSetting(key);
    }

    getCurrentNumberOfQuizItems(): number {
        return get(this.vocabBuilderStateService.getCurrentSetting(), "numberOfQuizItems", DEFAULT_QUIZ_ITEMS);
    }

    getMaxQuizItems(): number {
        return MAX_QUIZ_ITEMS;
    }

    getMinQuizItems(): number {
        return MIN_QUIZ_ITEMS;
    }

    getCurrentWordRank(): number {
        return get(this.vocabBuilderStateService.getCurrentSetting(), "styleSetting.rank", MIN_RANK);
    }

    getRemainingLength(): number {
        return this.vocabBuilderStateService.getQuizLength();
    }

    getCurrentStyleId(): number {
        return this.vocabBuilderStateService.getCurrentStyleId();
    }

    getCurrentWordListTypeId(): number {
        return this.vocabBuilderStateService.getCurrentWordListTypeId();
    }

    setWordListTouched(wordListTouched: boolean): void {
        this.wordListTouched = wordListTouched;
    }

    setLoadMoreEnabled(loadMoreEnabled: boolean): void {
        this.loadMoreEnabled = loadMoreEnabled;
    }

    setWordListsLoading(wordListsLoading: boolean): void {
        this.wordListsLoading = wordListsLoading;
    }

    setMoreLoading(moreLoading: boolean): void {
        this.moreLoading = moreLoading;
    }

    setMobileWordListRendererOpen(mobileWordListRendererOpen: boolean): void {
        this.mobileWordListRendererOpen = mobileWordListRendererOpen;
    }

    setMobileQuestionTypeRendererOpen(mobileQuestionTypeRendererOpen: boolean): void {
        this.mobileQuestionTypeRendererOpen = mobileQuestionTypeRendererOpen;
    }

    isMobile(): boolean {
        return Browser.isMobile();
    }

    isWordListAdded(wordListTypeId: number): boolean {
        return this.vocabBuilderStateService.isWordListAdded(wordListTypeId);
    }

    isActiveWordListTypeId(wordListTypeId: number): boolean {
        return isEqual(this.vocabBuilderStateService.getCurrentWordListTypeId(), wordListTypeId);
    }

    isActiveModeId(modeId: number): boolean {
        return isEqual(this.vocabBuilderStateService.getCurrentModeSetting(), modeId);
    }

    isAutoStart(): boolean {
        return this.autoStart;
    }

    isWordListsProgressLoading(): boolean {
        return this.vocabBuilderStateService.isWordListsProgressLoading();
    }

    isAddNewListEnabled(): boolean {
        return this.vocabBuilderStateService.getQuizDataSource().isAddNewListEnabled();
    }

    isMobileWordListRendererOpen(): boolean {
        return this.mobileWordListRendererOpen;
    }

    isMobileQuestionTypeRendererOpen(): boolean {
        return this.mobileQuestionTypeRendererOpen;
    }

    isIncomplete(): boolean {
        return this.vocabBuilderProgressService.getState() == MESSAGE_CODE_INCOMPLETE;
    }

    isFixedSetting(): boolean {
        return this.vocabBuilderStateService.getQuizDataSource().isFixedSetting();
    }

    isFixedStyle(): boolean {
        const isFixedStyle = this.isIncomplete() || this.isFixedSetting();

        return this.isMyWordsList(this.vocabBuilderStateService.getCurrentWordListTypeId()) || isFixedStyle;
    }

    isMyWordsList(wordListTypeId: number): boolean {
        return this.vocabBuilderStateService.isMyWordList(wordListTypeId);
    }

    isSettingsChangeDisabled(): boolean | undefined {
        if (this.isIncomplete() || this.isFixedSetting()) {
            return true;
        }
        return undefined;
    }

    isItemsToStudyChangeable(): boolean {
        return this.vocabBuilderStateService.getQuizDataSource().isItemsToStudyChangeable();
    }

    isVbLoading(): boolean {
        return this.vocabBuilderStateService.isLoading();
    }

    isQuizLoading(): boolean {
        return this.vocabBuilderStateService.isQuizLoading();
    }

    isWordListsLoading(): boolean {
        return this.wordListsLoading;
    }

    isMoreLoading(): boolean {
        return this.moreLoading;
    }

    isMyWordsListsCountsLoading(): boolean {
        return this.vocabBuilderStateService.isMyWordsListsCountsLoading();
    }

    isLoadMoreEnabled(): boolean {
        return this.loadMoreEnabled;
    }

    isWordListTouched(): boolean {
        return this.wordListTouched;
    }

    isAllWordList(wordListTypeId: number): boolean {
        return wordListTypeId == MyWordsListTypeIds.All;
    }

    isMissedWordList(wordListTypeId: number): boolean {
        return wordListTypeId == MyWordsListTypeIds.Missed;
    }

    isFavoriteWordList(wordListTypeId: number): boolean {
        return wordListTypeId == MyWordsListTypeIds.Favorite;
    }

    isKnownWordList(wordListTypeId: number): boolean {
        return wordListTypeId == MyWordsListTypeIds.Known;
    }

    isMasteredWordList(wordListTypeId: number): boolean {
        return wordListTypeId == MyWordsListTypeIds.Mastered;
    }

    isRecycleEnabled(): boolean {
        return this.recycleEnabled;
    }

    isSettingsDrawerOpen(): boolean {
        if (this.isVbLoading() || this.isWordListsLoading() || this.isQuizLoading()) {
            return false;
        }
        return this.settingsDrawerOpen || this.vocabBuilderStateService.isSettingsDrawerEnabled();
    }

    isPractice(): boolean {
        return this.practice;
    }

    shouldShowWordList(wordList: WordList): boolean {
        return !isEqual(wordList.maxWordRank, 0);
    }

    onClickLoadMore(): void {
        if (!this.isLoadMoreEnabled() || this.isMoreLoading()) {
            return;
        }
        this.setMoreLoading(true);

        const newPage = this.vocabBuilderStateService.getAddWordListPage() + 1;
        this.vocabBuilderStateService.setAddWordListPage(newPage);
        this.vocabBuilderStateService.fetchAccountSelectableWordLists()
            .pipe(takeUntil(this.getDestroyInterceptor()))
            .subscribe(() => {
                const wordListsSize = size(this.vocabBuilderStateService.getAccountSelectableWordLists());
                const wordListsCount = this.vocabBuilderStateService.getAccountSelectableWordListsCount();
                if (wordListsSize >= wordListsCount) {
                    this.setLoadMoreEnabled(false);
                }
                this.setMoreLoading(false);
            });
    }

    onClickWordList(wordListTypeId: number): void {
        this.setMobileWordListRendererOpen(false);
        this.eventWordListSelected.emit(wordListTypeId);
    }

    onClickQuestionMode(modeId: number): void {
        this.setMobileQuestionTypeRendererOpen(false);
        this.updateMode(modeId);
    }

    updateCurrentSetting(setting: object = {}): void {
        this.vocabBuilderStateService.setCurrentSetting(setting);
    }

    updateMode(mode: number): void {
        this.vocabBuilderStateService.setCurrentSetting({
            vocabBuilderModeIds: scalarToModes(
                mode,
                this.vocabBuilderStateService.getModeNumbers(),
                this.featureService.getFeature("isStrictMixedMode", "").split(",").map(parseInt)
            )
        });
    }

    updateModeMixed(): void {
        this.updateMode(MODE_ALL);
    }

    updateWordRank(rank: number): void {
        this.vocabBuilderStateService.setCurrentStyle({
            rank: rank
        });
    }

    updateNumberOfQuizItems(count: number): void {
        this.vocabularyAppSharedService.setNumberOfWordItems(count);

        this.updateCurrentSetting({
            numberOfQuizItems: count
        });
    }

    updateCurrentStyle(vocabBuilderStyleId: number, name: string): void {
        this.vocabBuilderStateService.setCurrentSetting({
            vocabBuilderStyleId: vocabBuilderStyleId
        });

        this.vocabBuilderStateService.setCurrentStyle({
            settingType: lowerCase(name)
        });
    }

    startQuiz(newQuiz: boolean = false): void {
        this.eventStartQuiz.emit(newQuiz);
    }

    launchModal(content, modalOptions?: NgbModalOptions): void {
        this.modalService.open(content, assign({
            size: "lg",
            windowClass: "d-flex",
            container: "#vocab-builder-app"
        }, modalOptions));
    }

    toggleLocalUserSetting(key: string): void {
        this.vocabBuilderStateService.setLocalUserSettings(key, !this.getLocalUserSetting(key));
    }

    showMixedMode(): boolean {
        return !isEmpty(this.vocabBuilderStateService.getMixedModeReference());
    }

    showStartingWord(): boolean {
        return this.getCurrentStyleId() == QUIZ_TYPE_SEQUENTIAL;
    }

    navigateBack(): void {
        this.location.back();
    }

    openModal(modalEl: TemplateRef<any>): void {
        this.modalReference = this.modalService.open(modalEl, {
            size: "lg",
            centered: true
        });
    }

    openSettingsDrawer(): void {
        if (this.isFixedStyle()) {
            return;
        }
        this.settingsDrawerOpen = true;
        this.vocabularyAppSharedService.setBackButtonVisible(false);
        this.vocabBuilderStateService.setSettingsDrawerEnabled(true);
    }

    closeSettingsDrawer(): void {
        this.settingsDrawerOpen = false;
        this.vocabularyAppSharedService.setBackButtonVisible(true);
        this.vocabBuilderStateService.setSettingsDrawerEnabled(false);
    }

    closeModal(): void {
        if (this.modalReference) {
            this.modalReference.close();
        }
    }

    onWordlistChange(): void {
        this.closeModal();
        this.setMobileWordListRendererOpen(false);
        if (this.isWordListTouched()) {
            this.setWordListTouched(false);
            this.eventWordListUpdated.emit();
        }
    }

    ngOnDestroy(): void {
        this.destroySubscriptions();
    }
}
