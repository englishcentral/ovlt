import { ComponentFixture, fakeAsync, TestBed, tick } from "@angular/core/testing";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { MockDOMEvent, routerStub } from "../../../../core/tests/stubs/common/common";
import { VocabBuilderStateService } from "../../../../activity-app/vocab-builder-app/vocab-builder-state.service";
import { VocabBuilderProgressService } from "../../../../activity-app/vocab-builder-app/vocab-builder-progress.service";
import { IdentityService } from "../../../../core/identity.service";
import { VocabBuilderStartComponent } from "./vocab-builder-start.component";
import { VocabularyAppSharedService } from "../../vocabulary-app/vocabulary-app-shared.service";
import { Router } from "@angular/router";
import { By } from "@angular/platform-browser";
import {
    vocabBuilderStateServiceStub
} from "../../../../core/tests/stubs/vocab-builder-app/vocab-builder-state-service.stub";
import {
    vocabularyAppSharedServiceStub
} from "../../../../core/tests/stubs/vocab-builder-app/vocabulary-app-shared-service.stub";
import {
    vocabBuilderProgressServiceStub
} from "../../../../core/tests/stubs/vocab-builder-app/vocab-builder-progress-service.stub";
import { VocabBuilderMode, VocabBuilderStyle } from "../../../../model/types/vocab-builder-reference";
import {
    DEFAULT_QUIZ_ITEMS,
    MAX_QUIZ_ITEMS,
    MIN_QUIZ_ITEMS,
    MIN_RANK,
    MyWordsListTypeIds,
    WordList
} from "../../../../model/types/word-list-reference";
import { head, last } from "lodash-es";
import { MESSAGE_CODE_CHOOSE, MESSAGE_CODE_INCOMPLETE } from "../../../../model/types/vocabulary-quiz";
import { of } from "rxjs";
import { identityServiceStub } from "../../../../core/tests/stubs/common/identity-service.stub";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { ReferenceModelService } from "../../../../model/content/reference-model.service";
import { referenceModelServiceStub } from "../../../../core/tests/stubs/content/reference-model-service.stub";
import { FeatureService } from "../../../../core/feature.service";
import { featureServiceStub } from "../../../../core/tests/stubs/common/feature-service.stub";
import { GlobalSettingService } from "../../../../core/global-setting.service";
import { globalSettingServiceStub } from "../../../../core/tests/stubs/common/global-setting-service.stub";
import MockedFunction = jest.MockedFunction;

const setup = async () => {
    let component: VocabBuilderStartComponent;
    let fixture: ComponentFixture<VocabBuilderStartComponent>;

    await TestBed.configureTestingModule({
        declarations: [VocabBuilderStartComponent],
        schemas: [NO_ERRORS_SCHEMA],
        imports: [NgbModule],
        providers: [
            { provide: VocabBuilderStateService, useValue: vocabBuilderStateServiceStub },
            { provide: VocabBuilderProgressService, useValue: vocabBuilderProgressServiceStub },
            { provide: VocabularyAppSharedService, useValue: vocabularyAppSharedServiceStub },
            { provide: ReferenceModelService, useValue: referenceModelServiceStub },
            { provide: IdentityService, useValue: identityServiceStub },
            { provide: FeatureService, useValue: featureServiceStub },
            { provide: GlobalSettingService, useValue: globalSettingServiceStub },
            { provide: Router, useValue: routerStub }
        ]
    }).compileComponents();

    fixture = TestBed.createComponent(VocabBuilderStartComponent);
    component = fixture.componentInstance;

    return { component, fixture };
};

describe("VocabBuilderStartComponent", () => {
    const wordLists: WordList[] = [
        {
            description: "New General Service List is the 2800 most frequent words used in the English language.",
            maxWordRank: 2797,
            name: "NGSL Vocab",
            wordListTypeId: 2
        },
        {
            description: "The 960 most common words in academic texts and lectures.",
            maxWordRank: 952,
            name: "Academic Vocab",
            wordListTypeId: 3
        },
        {
            description: "Academic Vocab MaxWordRank 0",
            name: "Academic Vocab MaxWordRank 0",
            wordListTypeId: 999999
        }
    ];

    const currentWordList = head(wordLists);

    const accountSelectableWordLists: WordList[] = [
        {
            description: "New General Service List is the 2800 most frequent words used in the English language.",
            maxWordRank: 2797,
            name: "NGSL Vocab",
            wordListTypeId: 2
        },
        {
            description: "The 960 most common words in academic texts and lectures.",
            maxWordRank: 952,
            name: "Academic Vocab",
            wordListTypeId: 3
        },
        {
            description: "Fitness",
            maxWordRank: 10,
            name: "Fitness",
            wordListTypeId: 5
        }
    ];

    const modeReference: VocabBuilderMode[] = [
        {
            active: true,
            description: "Type the missing words",
            name: "Typing with hints",
            vocabBuilderModeId: 1
        },
        {
            active: true,
            description: "Type the missing words",
            name: "Typing without hints",
            vocabBuilderModeId: 4
        },
        {
            active: true,
            description: "Speak the missing words",
            name: "Speaking with hints",
            vocabBuilderModeId: 1
        },
        {
            active: true,
            description: "Select the correct definition of each word",
            name: "Typing with hints",
            vocabBuilderModeId: 1
        }
    ];

    const currentMode = head(modeReference);

    const vocabBuilderStyles: VocabBuilderStyle[] = [
        {
            active: true,
            description: "Quiz includes 20% new words and 80% review words, based on our time interval learning algorithm.",
            internal: false,
            name: "Review",
            translatedName: "Review",
            vocabBuilderStyleId: 4
        },
        {
            active: true,
            description: "Builds a quiz with the words based on a set of words from the course you are studying.",
            internal: true,
            name: "Activity",
            translatedName: "Activity",
            vocabBuilderStyleId: 7
        },
        {
            active: true,
            description: "Builds a quiz with selected words from my words lists.",
            internal: true,
            name: "MyWords",
            translatedName: "MyWords",
            vocabBuilderStyleId: 8
        },
        {
            active: true,
            description: "Quiz includes new and review words starting with the rank you set.",
            internal: false,
            name: "Sequential",
            translatedName: "Sequential",
            vocabBuilderStyleId: 2
        }
    ];

    let component: VocabBuilderStartComponent;
    let fixture: ComponentFixture<VocabBuilderStartComponent>;

    beforeEach(async () => {
        const { component: awaitedComponent, fixture: awaitedFixture } = await setup();
        component = awaitedComponent;
        fixture = awaitedFixture;
    });


    test("should create the component", () => {
        expect(component).toBeDefined();
    });

    test("initializeAddWordList - should call initializeAddWordList when add-word-list button is clicked", () => {
        vocabBuilderStateServiceStub.getWordListReference.mockReturnValue(wordLists);
        vocabBuilderStateServiceStub.getQuizDataSource().isFixedSetting.mockReturnValue(false);
        vocabBuilderStateServiceStub.getQuizDataSource().isAddNewListEnabled.mockReturnValue(true);

        const initializeAddWordListFn = jest.spyOn(component, "initializeAddWordList");
        fixture.detectChanges();

        const addWordListButton = fixture.debugElement.query(By.css("#add-word-list"));
        addWordListButton.triggerEventHandler("click", MockDOMEvent);
        expect(initializeAddWordListFn.mock.calls.length).toEqual(1);
    });

    test("initializeAddWordList - should call openModal", () => {
        const openModal = jest.spyOn(component, "openModal");
        component.initializeAddWordList();
        expect(openModal.mock.calls.length).toEqual(1);
    });

    test("initializeAddWordList - should set setWordListsLoading to false, and setLoadMoreEnabled to false when wordListCount is less than ADD_WORD_LIST_PAGE_SIZE", fakeAsync(() => {
        const vocabBuilderStateService = fixture.debugElement.injector.get(VocabBuilderStateService);
        const fetchAccountSelectableWordListsFn = vocabBuilderStateService.fetchAccountSelectableWordLists as MockedFunction<any>;
        const fetchAccountSelectableWordListsCountFn = vocabBuilderStateService.fetchAccountSelectableWordLists as MockedFunction<any>;

        vocabBuilderStateServiceStub.fetchAccountSelectableWordLists.mockReturnValue(of({ accountSelectableWordLists }));
        vocabBuilderStateServiceStub.fetchAccountSelectableWordListsCount.mockReturnValue(of(accountSelectableWordLists.length));
        vocabBuilderStateServiceStub.getAccountSelectableWordListsCount.mockReturnValue(accountSelectableWordLists.length);
        component.initializeAddWordList();

        tick(10);

        expect(fetchAccountSelectableWordListsFn).toHaveBeenCalled();
        expect(fetchAccountSelectableWordListsCountFn).toHaveBeenCalled();
        expect(component.isWordListsLoading()).toEqual(false);
        expect(component.isLoadMoreEnabled()).toEqual(false);
    }));

    test("initializeAddWordList - should set setWordListsLoading to false, and setLoadMoreEnabled to true when wordListCount is more than ADD_WORD_LIST_PAGE_SIZE", fakeAsync(() => {
        const vocabBuilderStateService = fixture.debugElement.injector.get(VocabBuilderStateService);
        const fetchAccountSelectableWordListsFn = vocabBuilderStateService.fetchAccountSelectableWordLists as MockedFunction<any>;
        const fetchAccountSelectableWordListsCountFn = vocabBuilderStateService.fetchAccountSelectableWordLists as MockedFunction<any>;

        vocabBuilderStateServiceStub.fetchAccountSelectableWordLists.mockReturnValue(of({ accountSelectableWordLists }));
        vocabBuilderStateServiceStub.fetchAccountSelectableWordListsCount.mockReturnValue(of(VocabBuilderStateService.ADD_WORD_LIST_PAGE_SIZE + 1));
        vocabBuilderStateServiceStub.getAccountSelectableWordListsCount.mockReturnValue(VocabBuilderStateService.ADD_WORD_LIST_PAGE_SIZE + 1);
        component.initializeAddWordList();

        tick(10);

        expect(fetchAccountSelectableWordListsFn).toHaveBeenCalled();
        expect(fetchAccountSelectableWordListsCountFn).toHaveBeenCalled();
        expect(component.isWordListsLoading()).toEqual(false);
        expect(component.isLoadMoreEnabled()).toEqual(true);
    }));

    test("getWordListReference - should return wordListReference", () => {
        vocabBuilderStateServiceStub.getWordListReference.mockReturnValue(wordLists);
        expect(component.getWordListReference()).toEqual(wordLists);
    });

    test("getWordLists - should return wordLists", () => {
        vocabBuilderStateServiceStub.getWordLists.mockReturnValue(wordLists);
        expect(component.getWordLists()).toEqual(wordLists);
    });

    test("getCurrentWordListDescription - should return current word list description", () => {
        vocabBuilderStateServiceStub.getCurrentVocabListNameDescription.mockReturnValue(currentWordList.description);
        expect(component.getCurrentWordListDescription()).toEqual(currentWordList.description);
    });

    test("getModeReference - should return mode reference", () => {
        vocabBuilderStateServiceStub.getModeReference.mockReturnValue(modeReference);
        expect(component.getModeReference()).toEqual(modeReference);
    });

    test("getStyleReference - should return study mode reference", () => {
        vocabBuilderStateServiceStub.getStyleReference.mockReturnValue(vocabBuilderStyles);
        expect(component.getStyleReference()).toEqual(vocabBuilderStyles);
    });

    test("getCurrentVocabListName - should return current vocab list name", () => {
        vocabBuilderStateServiceStub.getCurrentVocabListName.mockReturnValue(currentWordList.name);
        expect(component.getCurrentVocabListName()).toEqual(currentWordList.name);
    });

    test("getCurrentVocabListMaxWordRank - should return current vocab list maximum word rank", () => {
        vocabBuilderStateServiceStub.getCurrentVocabListMaxWordRank.mockReturnValue(currentWordList.maxWordRank);
        expect(component.getCurrentVocabListMaxWordRank()).toEqual(currentWordList.maxWordRank);

        const listHasNoWordRank = last(wordLists);
        vocabBuilderStateServiceStub.getCurrentVocabListMaxWordRank.mockReturnValue(listHasNoWordRank.maxWordRank);
        expect(component.getCurrentVocabListMaxWordRank()).toEqual(0);
    });

    test("getCurrentVocabListMinWordRank - should return minimum word rank for list", () => {
        expect(component.getCurrentVocabListMinWordRank()).toEqual(MIN_RANK);
    });

    test("getCurrentModeName - should return current mode name", () => {
        vocabBuilderStateServiceStub.getCurrentModeName.mockReturnValue(currentMode.name);
        expect(component.getCurrentModeName()).toEqual(currentMode.name);
    });

    test("getCurrentModeDescription - should return current mode description", () => {
        vocabBuilderStateServiceStub.getCurrentModeDescription.mockReturnValue(currentMode.description);
        expect(component.getCurrentModeDescription()).toEqual(currentMode.description);
    });

    test("getAccountSelectableWordLists - should return accountSelectableWordLists", () => {
        vocabBuilderStateServiceStub.getAccountSelectableWordLists.mockReturnValue(accountSelectableWordLists);
        expect(component.getAccountSelectableWordLists()).toEqual(accountSelectableWordLists);
    });

    test("getLocalUserSetting - should return local user setting value for a given key", () => {
        expect(component.getLocalUserSetting("recycleSkippedWords")).toEqual(undefined);
        expect(component.getLocalUserSetting("recycleMissedWords")).toEqual(undefined);

        vocabBuilderStateServiceStub.getLocalUserSetting.mockReturnValue(true);

        expect(component.getLocalUserSetting("recycleSkippedWords")).toEqual(true);
        expect(component.getLocalUserSetting("recycleMissedWords")).toEqual(true);
    });

    test("getCurrentNumberOfQuizItems - should return current number of quiz items", () => {
        expect(component.getCurrentNumberOfQuizItems()).toEqual(DEFAULT_QUIZ_ITEMS);
        vocabBuilderStateServiceStub.getCurrentSetting.mockReturnValue({
            numberOfQuizItems: 10
        });
        expect(component.getCurrentNumberOfQuizItems()).toEqual(10);
    });

    test("getMaxQuizItems - should return max quiz items", () => {
        expect(component.getMaxQuizItems()).toEqual(MAX_QUIZ_ITEMS);
    });

    test("getMinQuizItems - should return min quiz items", () => {
        expect(component.getMinQuizItems()).toEqual(MIN_QUIZ_ITEMS);
    });

    test("getCurrentWordRank - should return current word rank", () => {
        expect(component.getCurrentWordRank()).toEqual(MIN_RANK);

        vocabBuilderStateServiceStub.getCurrentSetting.mockReturnValue({ styleSetting: { rank: 3 } });
        expect(component.getCurrentWordRank()).toEqual(3);
    });

    test("getRemainingLength - should return remaining quiz words queue length", () => {
        vocabBuilderStateServiceStub.getQuizLength.mockReturnValue(2);
        expect(component.getRemainingLength()).toEqual(2);
    });

    test("getCurrentStyleId - should return current styleId", () => {
        vocabBuilderStateServiceStub.getCurrentStyleId.mockReturnValue(last(vocabBuilderStyles).vocabBuilderStyleId);
        expect(component.getCurrentStyleId()).toEqual(last(vocabBuilderStyles).vocabBuilderStyleId);
    });

    test("isWordListAdded - should return true if wordList is added", () => {
        vocabBuilderStateServiceStub.isWordListAdded.mockReturnValue(true);
        expect(component.isWordListAdded(2)).toEqual(true);

        vocabBuilderStateServiceStub.isWordListAdded.mockReturnValue(false);
        expect(component.isWordListAdded(-10)).toEqual(false);
    });

    test("isActiveWordListTypeId - should return true if wordListTypeId param equals to current wordListTypeId", () => {
        const currentWordListTypeId = head(wordLists).wordListTypeId;
        vocabBuilderStateServiceStub.getCurrentWordListTypeId.mockReturnValue(currentWordListTypeId);

        expect(component.isActiveWordListTypeId(currentWordListTypeId)).toEqual(true);
        expect(component.isActiveWordListTypeId(-10)).toEqual(false);
    });

    test("isActiveModeId - should return true if modeId param equals to current modeId", () => {
        const currentModeId = head(modeReference).vocabBuilderModeId;
        vocabBuilderStateServiceStub.getCurrentModeSetting.mockReturnValue(currentModeId);

        expect(component.isActiveModeId(currentModeId)).toEqual(true);
        expect(component.isActiveModeId(-10)).toEqual(false);
    });

    test("isAddNewListEnabled - should return true if add new list enabled", () => {
        vocabBuilderStateServiceStub.getQuizDataSource().isAddNewListEnabled.mockReturnValue(true);
        expect(component.isAddNewListEnabled()).toEqual(true);

        vocabBuilderStateServiceStub.getQuizDataSource().isAddNewListEnabled.mockReturnValue(false);
        expect(component.isAddNewListEnabled()).toEqual(false);
    });

    test("isIncomplete - should return true if state is incomplete", () => {
        vocabBuilderProgressServiceStub.getState.mockReturnValue(MESSAGE_CODE_INCOMPLETE);
        expect(component.isIncomplete()).toEqual(true);

        vocabBuilderProgressServiceStub.getState.mockReturnValue(MESSAGE_CODE_CHOOSE);
        expect(component.isIncomplete()).toEqual(false);
    });

    test("isFixedStyle - should return true if state is incomplete", () => {
        vocabBuilderStateServiceStub.isMyWordList.mockReturnValue(true);
        expect(component.isFixedStyle()).toEqual(true);

        vocabBuilderStateServiceStub.getQuizDataSource().isFixedSetting.mockReturnValue(true);
        expect(component.isFixedStyle()).toEqual(true);

        vocabBuilderProgressServiceStub.getState.mockReturnValue(MESSAGE_CODE_INCOMPLETE);
        expect(component.isFixedStyle()).toEqual(true);

        vocabBuilderStateServiceStub.isMyWordList.mockReturnValue(false);
        vocabBuilderStateServiceStub.getQuizDataSource().isFixedSetting.mockReturnValue(false);
        vocabBuilderProgressServiceStub.getState.mockReturnValue(MESSAGE_CODE_CHOOSE);
        expect(component.isFixedStyle()).toEqual(false);
    });

    test("isSettingsChangeDisabled - should return true if state is incomplete, and it is fixed settings", () => {
        vocabBuilderStateServiceStub.getQuizDataSource().isFixedSetting.mockReturnValue(false);
        vocabBuilderProgressServiceStub.getState.mockReturnValue(MESSAGE_CODE_INCOMPLETE);
        expect(component.isSettingsChangeDisabled()).toEqual(true);

        vocabBuilderStateServiceStub.getQuizDataSource().isFixedSetting.mockReturnValue(true);
        vocabBuilderProgressServiceStub.getState.mockReturnValue(MESSAGE_CODE_CHOOSE);
        expect(component.isSettingsChangeDisabled()).toEqual(true);

        vocabBuilderStateServiceStub.getQuizDataSource().isFixedSetting.mockReturnValue(false);
        vocabBuilderProgressServiceStub.getState.mockReturnValue(MESSAGE_CODE_CHOOSE);
        expect(component.isSettingsChangeDisabled()).toEqual(undefined);
    });

    test("isItemsToStudyChangeable - should return true if quiz data source isItemsToStudyChangeable returns true", () => {
        vocabBuilderStateServiceStub.getQuizDataSource().isItemsToStudyChangeable.mockReturnValue(true);
        expect(component.isItemsToStudyChangeable()).toEqual(true);
    });

    test("isVbLoading - should return true if vb is in loading state", () => {
        vocabBuilderStateServiceStub.isLoading.mockReturnValue(true);
        expect(component.isVbLoading()).toEqual(true);
    });

    test("isQuizLoading - should return true if quiz is in loading state", () => {
        vocabBuilderStateServiceStub.isQuizLoading.mockReturnValue(true);
        expect(component.isQuizLoading()).toEqual(true);
    });

    test("isAllWordList - should return true if wordListTypeId param equals to all words list type id", () => {
        expect(component.isAllWordList(-1)).toEqual(false);
        expect(component.isAllWordList(MyWordsListTypeIds.All)).toEqual(true);
    });

    test("isMissedWordList - should return true if wordListTypeId param equals to missed words list type id", () => {
        expect(component.isMissedWordList(-1)).toEqual(false);
        expect(component.isMissedWordList(MyWordsListTypeIds.Missed)).toEqual(true);
    });

    test("isFavoriteWordList - should return true if wordListTypeId param equals to favorite words list type id", () => {
        expect(component.isFavoriteWordList(-1)).toEqual(false);
        expect(component.isFavoriteWordList(MyWordsListTypeIds.Favorite)).toEqual(true);
    });

    test("isKnownWordList - should return true if wordListTypeId param equals to known words list type id", () => {
        expect(component.isKnownWordList(-1)).toEqual(false);
        expect(component.isKnownWordList(MyWordsListTypeIds.Known)).toEqual(true);
    });

    test("isMasteredWordList - should return true if wordListTypeId param equals to mastered words list type id", () => {
        expect(component.isMasteredWordList(-1)).toEqual(false);
        expect(component.isMasteredWordList(MyWordsListTypeIds.Mastered)).toEqual(true);
    });

    test("onClickWordList - should close mobile word list renderer, and emit eventWordListChanged", () => {
        component.setMobileWordListRendererOpen(true);
        component.onClickWordList(currentWordList.wordListTypeId);
        fixture.detectChanges();

        expect(component.isMobileWordListRendererOpen()).toEqual(false);
        component.eventWordListSelected.subscribe((wordListTypeId) => {
            expect(wordListTypeId).toEqual(currentWordList.wordListTypeId);
        });
    });

    test("onClickQuestionMode - should close mobile question type renderer, and call updateMode", () => {
        featureServiceStub.getFeature.mockReturnValue("4,2,1,6");
        const updateModeFn = jest.spyOn(component, "updateMode");
        component.setMobileQuestionTypeRendererOpen(true);

        const selectedModeId = last(modeReference).vocabBuilderModeId;
        component.onClickQuestionMode(selectedModeId);

        expect(component.isMobileQuestionTypeRendererOpen()).toEqual(false);
        expect(updateModeFn).toHaveBeenCalledWith(selectedModeId);
    });

    test("onClickLoadMore - should not call setMoreLoading if load more is not enabled", () => {
        const setMoreLoadingFn = jest.spyOn(component, "setMoreLoading");
        vocabBuilderStateServiceStub.fetchAccountSelectableWordLists.mockReturnValue(of({ accountSelectableWordLists }));
        vocabBuilderStateServiceStub.getAccountSelectableWordListsCount.mockReturnValue(VocabBuilderStateService.ADD_WORD_LIST_PAGE_SIZE - 1);

        component.initializeAddWordList();
        component.onClickLoadMore();
        expect(setMoreLoadingFn).not.toHaveBeenCalled();
    });

    test("onClickLoadMore - should not call setMoreLoading if more is loading", () => {
        component.isMoreLoading = jest.fn().mockReturnValue(true);
        const setMoreLoadingFn = jest.spyOn(component, "setMoreLoading");
        component.onClickLoadMore();
        expect(setMoreLoadingFn).not.toHaveBeenCalled();
    });

    test("onClickLoadMore - should call fetchAccountSelectableWordLists when more is not loading, and load more is not enabled", () => {
        const vocabBuilderStateService = fixture.debugElement.injector.get(VocabBuilderStateService);
        const fetchAccountSelectableWordListsFn = vocabBuilderStateService.fetchAccountSelectableWordLists as MockedFunction<any>;

        vocabBuilderStateServiceStub.fetchAccountSelectableWordLists.mockReturnValue(of(accountSelectableWordLists));
        vocabBuilderStateServiceStub.getAccountSelectableWordLists.mockReturnValue(accountSelectableWordLists);
        vocabBuilderStateServiceStub.getAccountSelectableWordListsCount.mockReturnValue(accountSelectableWordLists.length - 1);

        component.isMoreLoading = jest.fn().mockReturnValue(false);
        component.isLoadMoreEnabled = jest.fn().mockReturnValue(true);
        component.onClickLoadMore();

        expect(fetchAccountSelectableWordListsFn).toHaveBeenCalled();
    });

    test("onClickLoadMore - should set loadMoreEnabled to false when word list size is less than, or equal to accountSelectableWordListsCount", () => {
        vocabBuilderStateServiceStub.fetchAccountSelectableWordLists.mockReturnValue(of(accountSelectableWordLists));
        vocabBuilderStateServiceStub.getAccountSelectableWordLists.mockReturnValue(accountSelectableWordLists);
        vocabBuilderStateServiceStub.getAccountSelectableWordListsCount.mockReturnValue(accountSelectableWordLists.length + 1);

        expect(component.isLoadMoreEnabled()).toEqual(true);
        component.onClickLoadMore();

        expect(component.isLoadMoreEnabled()).toEqual(true);
        expect(component.isMoreLoading()).toEqual(false);
    });

    test("onClickLoadMore - should set loadMoreEnabled to false when word list size is greater than, or equal to accountSelectableWordListsCount", () => {
        vocabBuilderStateServiceStub.fetchAccountSelectableWordLists.mockReturnValue(of(accountSelectableWordLists));
        vocabBuilderStateServiceStub.getAccountSelectableWordLists.mockReturnValue(accountSelectableWordLists);
        vocabBuilderStateServiceStub.getAccountSelectableWordListsCount.mockReturnValue(accountSelectableWordLists.length - 1);

        expect(component.isLoadMoreEnabled()).toEqual(true);
        component.onClickLoadMore();

        expect(component.isLoadMoreEnabled()).toEqual(false);
        expect(component.isMoreLoading()).toEqual(false);
    });

    test("openSettingsDrawer - should open settings drawer if it is  not fixed style", () => {
        vocabBuilderStateServiceStub.isLoading.mockReturnValue(false);
        vocabBuilderStateServiceStub.isQuizLoading.mockReturnValue(false);
        vocabBuilderStateServiceStub.isSettingsDrawerEnabled.mockReturnValue(false);

        vocabBuilderStateServiceStub.isMyWordList.mockReturnValue(true);
        component.openSettingsDrawer();
        expect(component.isSettingsDrawerOpen()).toEqual(false);

        const vocabularyAppSharedService = fixture.debugElement.injector.get(VocabularyAppSharedService);
        const setBackButtonVisibleFn = vocabularyAppSharedService.setBackButtonVisible as MockedFunction<any>;
        vocabBuilderStateServiceStub.isMyWordList.mockReturnValue(false);
        component.openSettingsDrawer();

        expect(component.isSettingsDrawerOpen()).toEqual(true);
        expect(setBackButtonVisibleFn).toBeCalledWith(false);
    });

    test("closeAddList - should close add word list pop up", () => {
        const eventHydrateComponentFn = jest.spyOn(component.eventWordListUpdated, "emit");
        const closeModalFn = jest.spyOn(component, "closeModal");
        component.setWordListTouched(true);
        component.onWordlistChange();

        expect(closeModalFn).toHaveBeenCalled();
        expect(component.isWordListTouched()).toEqual(false);
        expect(eventHydrateComponentFn).toHaveBeenCalled();
    });

    test("should render vocab-builder-settings if there is wordListReference", () => {
        vocabBuilderStateServiceStub.getAccountSelectableWordLists.mockReturnValue(accountSelectableWordLists);
        vocabBuilderStateServiceStub.getWordListReference.mockReturnValue(wordLists);
        vocabBuilderStateServiceStub.getQuizDataSource().isFixedSetting.mockReturnValue(false);
        vocabBuilderStateServiceStub.getQuizDataSource().isAddNewListEnabled.mockReturnValue(false);
        vocabBuilderStateServiceStub.getModeReference.mockReturnValue(modeReference);

        fixture.detectChanges();
        const vocabBuilderSettingsElement = fixture.debugElement.query(By.css(".vocab-builder-settings"));
        expect(vocabBuilderSettingsElement).toBeTruthy();
    });

    test("should select wordLists on click word list dropdown", () => {
        vocabBuilderStateServiceStub.getAccountSelectableWordLists.mockReturnValue(accountSelectableWordLists);
        vocabBuilderStateServiceStub.getWordListReference.mockReturnValue(wordLists);
        vocabBuilderStateServiceStub.getQuizDataSource().isFixedSetting.mockReturnValue(false);
        vocabBuilderStateServiceStub.getQuizDataSource().isAddNewListEnabled.mockReturnValue(false);
        vocabBuilderStateServiceStub.getModeReference.mockReturnValue(modeReference);
        vocabBuilderStateServiceStub.getWordLists.mockReturnValue(wordLists);

        fixture.detectChanges();
        let settingsBlockElement = fixture.debugElement.query(By.css(".settings-block.btn.dropdown-toggle"));
        expect(settingsBlockElement.nativeElement).toBeTruthy();
        settingsBlockElement.triggerEventHandler("click", MockDOMEvent);

        const wordListItemTextElement = fixture.debugElement.queryAll(By.css(".word-list-item"))[1];
        expect(wordListItemTextElement.nativeElement.innerHTML).toContain(wordLists[1].name);
    });
});
