import { mockDateVal, TIMEZONE_US_LA } from "../../core/tests/stubs/common/common";
import { DateFnsConfig } from "../../core/date-fns-util";
import { VocabBuilderStateService } from "./vocab-builder-state.service";
import { assign, extend, map } from "lodash-es";
import { referenceModelServiceStub } from "../../core/tests/stubs/content/reference-model-service.stub";
import {
    vocabBuilderProgressServiceStub
} from "../../core/tests/stubs/vocab-builder-app/vocab-builder-progress-service.stub";
import { StudyLevelModelService } from "../../model/identity/study-level-model.service";
import { WordProgressModelService } from "../../model/reportcard/word-progress.model.service";
import { featureServiceStub } from "../../core/tests/stubs/common/feature-service.stub";
import { identityServiceStub } from "../../core/tests/stubs/common/identity-service.stub";
import { channelServiceStub } from "../../core/tests/stubs/common/channel-service.stub";
import { adaptiveQuizModelServiceStub } from "../../core/tests/stubs/content/adaptive-quiz-model-service.stub";
import { of, throwError } from "rxjs";
import { mergeMap } from "rxjs/operators";
import { WordListLearned } from "../../model/types/word-list-learned";

describe("VocabBuilderStateService", () => {
    let vocabBuilderStateService: VocabBuilderStateService;

    const vocabBuilderQuiz = {
        quizStepId: 0,
        quizStyleId: 0,
        quizType: "",
        quizWords: undefined,
        rank: 0,
        wordListTypeId: 0
    };

    const wordLists = [
        {
            wordListTypeId: 1,
            maxWordRank: 50,
            name: "wordList 1",
            description: "wordList 1"
        },
        {
            wordListTypeId: 2,
            maxWordRank: 52,
            name: "wordList 2",
            description: "wordList 2"
        }
    ];

    const wordListTypeIds = map(wordLists, (wordList) => wordList?.wordListTypeId);

    beforeEach(async () => {
        vocabBuilderStateService = new VocabBuilderStateService(
            vocabBuilderProgressServiceStub as any,
            adaptiveQuizModelServiceStub as any,
            {} as WordProgressModelService,
            referenceModelServiceStub as any,
            {} as StudyLevelModelService,
            identityServiceStub as any,
            channelServiceStub as any,
            featureServiceStub as any
        );

        DateFnsConfig.setTimezone(TIMEZONE_US_LA);
        global.Date.now = jest.fn().mockReturnValue(mockDateVal);
    });

    afterEach(() => {
        // @ts-ignore
        DateFnsConfig.setTimezone(undefined);
    });

    test("VocabBuilderStateService - isTestNotStarted", () => {
        let starTime = extend(vocabBuilderQuiz, { examStart: mockDateVal + 1 });

        // @ts-ignore
        vocabBuilderStateService.currentQuiz = starTime;
        expect(vocabBuilderStateService.isTestNotStarted()).toBe(false);

        starTime.examStart = mockDateVal - 1;
        // @ts-ignore
        vocabBuilderStateService.currentQuiz = starTime;
        expect(vocabBuilderStateService.isTestNotStarted()).toBe(true);
    });

    test("VocabBuilderStateService - isTestExpired", () => {
        let expiryTime = extend(vocabBuilderQuiz, { expiry: mockDateVal + 1 });

        // @ts-ignore
        vocabBuilderStateService.currentQuiz = expiryTime;
        expect(vocabBuilderStateService.isTestExpired()).toBe(true);

        expiryTime.expiry = mockDateVal - 1;
        // @ts-ignore
        vocabBuilderStateService.currentQuiz = expiryTime;
        expect(vocabBuilderStateService.isTestExpired()).toBe(false);
    });

    test("fetchWordListsProgress - should fetch wordListsProgress with the given wordListTypeIds", (done) => {
        identityServiceStub.getAccountId.mockReturnValue(45);
        adaptiveQuizModelServiceStub.getWordListsMasteriesContent.mockReturnValue(of([]));

        vocabBuilderStateService.fetchWordListsProgress(wordListTypeIds)
            .subscribe(() => {
                expect(adaptiveQuizModelServiceStub.getWordListsMasteriesContent).toBeCalled();
                expect(adaptiveQuizModelServiceStub.getWordListsMasteriesContent).toBeCalledWith({
                    accountId: 45,
                    wordListTypeIds: wordListTypeIds
                });
                expect(vocabBuilderStateService.isWordListsProgressLoading()).toEqual(false);
                adaptiveQuizModelServiceStub.getWordListsMasteriesContent.mockReset();
                done();
            });
    });

    test("fetchWordListsProgress - should return word lists progress if already fetched", (done) => {
        identityServiceStub.getAccountId.mockReturnValue(45);
        adaptiveQuizModelServiceStub.getWordListsMasteriesContent.mockReturnValue(of([new WordListLearned()]));

        vocabBuilderStateService.fetchWordListsProgress(wordListTypeIds)
            .pipe(
                mergeMap(() => vocabBuilderStateService.fetchWordListsProgress(wordListTypeIds))
            )
            .subscribe(() => {
                expect(adaptiveQuizModelServiceStub.getWordListsMasteriesContent).toBeCalledTimes(1);
                expect(adaptiveQuizModelServiceStub.getWordListsMasteriesContent).toBeCalledWith({
                    accountId: 45,
                    wordListTypeIds: wordListTypeIds
                });
                expect(vocabBuilderStateService.isWordListsProgressLoading()).toEqual(false);
                adaptiveQuizModelServiceStub.getWordListsMasteriesContent.mockReset();
                done();
            });
    });

    test("fetchWordListsProgress - should return default word list learned object when call fails", (done) => {
        identityServiceStub.getAccountId.mockReturnValue(45);
        adaptiveQuizModelServiceStub.getWordListsMasteriesContent.mockReturnValue(throwError("call failed"));
        vocabBuilderStateService.getWordLists = jest.fn().mockReturnValue(wordLists);

        let wordListsLearnedMap = new Map();
        map(wordLists, (wordList) => {
            wordListsLearnedMap.set(wordList?.wordListTypeId, assign({}, new WordListLearned(), {
                wordsLearned: 0,
                wordCount: vocabBuilderStateService.getWordLists()[wordList?.wordListTypeId]?.maxWordRank,
                wordListTypeId: wordList?.wordListTypeId
            }));
        });

        vocabBuilderStateService.fetchWordListsProgress(wordListTypeIds)
            .subscribe(() => {
                expect(vocabBuilderStateService.getWordListsProgress()).toEqual(wordListsLearnedMap);
                done();
            });
    });
});
