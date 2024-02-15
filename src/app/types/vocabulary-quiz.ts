import { Word } from "./word";
import { DialogLine, XDialogLine } from "./dialog-line";
import { has } from "lodash-es";
import { WordV1 } from "./content/word-v1";
import { XWordDetail } from "./content/x-word";
import { DialogLineV1 } from "./content/dialog-line-v1";

export class VocabularyQuiz {
    sessionTitle: string;
    quizWords: VocabularyQuizWord[];
    mastered?: VocabularyQuizWord[];
    dormant?: VocabularyQuizWord[];
    fallback?: boolean;

    static getCourseQuizUrl(activityId: number): string {
        return "/course/quiz/" + activityId;
    }

    static getMobileCourseQuizUrl(options: object = {}): string {
        let params = new URLSearchParams();

        for (let key in options) {
            if (has(options, key)) {
                params.set(key, options[key]);
            }
        }
        return "mobile/quiz/course/?" + params.toString();
    }
}

export class VocabularyQuizWord {
    word: Word;
    distractors: Word[];
    examples: DialogLine[];
    modeId?: number;
    previouslyEncountered?: boolean;
    rank?: number;
    recycleCount?: number = 0;
}

export class XQuizWord {
    examples: XDialogLine[];
    modeId?: number;
    previouslyEncountered?: boolean;
    word: XWordDetail;
    distractors: XWordDetail[];
    rank?: number;
    recycleCount?: number = 0;
}

export class AdaptiveQuizBandInfo {
    band: number;
    levelRange: string;
    currentLevel: number;
    messageCode: number;
    currentCorrect?: number;
    currentIncorrect?: number;
    currentTotal?: number;
    wordListTypeId?: number;
    wordListName?: string;
}

export class AdaptiveQuiz extends AdaptiveQuizBandInfo {
    adaptiveQuizStepId: number;
    quizWords: VocabularyQuizWord[];
    autoStart?: boolean;
}

export class VocabBuilderQuiz {
    quizStepId: number;
    quizStyleId: number;
    quizType: string;
    quizWords: VocabularyQuizWord[];
    rank: number;
    wordListTypeId: number;
    currentCorrect?: number;
    currentIncorrect?: number;
    currentTotal?: number;
    vocabBuilderModeIds?: number[];
    vocabBuilderStyleId?: number;
    examStart?: number;
    expiry?: string;
    key?: string;
    startRank?: number;
    endRank?: number;
}

export class XWordQuiz {
    quizStepId: number;
    quizStyleId: number;
    quizType: string;
    currentCorrect?: number;
    currentIncorrect?: number;
    currentTotal?: number;
    quizWords: XQuizWord[];
    wordListTypeId: number;
    key?: string; // does not exist
}

export class AdaptiveTestStudent {
    accountId: number;
    absent: boolean;

    constructor(accountId: number, absent) {
        this.accountId = accountId;
        this.absent = absent;
    }
}

export interface AdaptiveTestThumb extends AdaptiveTest {
    itemGoal?: number;
    classTestName?: string;
    className?: string;
    isCompleted?: boolean;
    isOngoing?: boolean;
    isFuture?: boolean;
    isNextFuture?: boolean;
    isEnded?: boolean;
}

export class AdaptiveTest {
    classId?: number;
    classTestExamId: number;
    classTestId: number;
    expiry: string;
    dateCreated: string;
    accountId?: number;
    examStart?: string;
    ratioComplete?: number;
    percentageCorrect?: number;
    absent?: boolean;
    completed?: boolean;
    exam?: {
        adaptiveQuizTestStepId: number;
        quizWords: VocabularyQuizWord[];
        currentCorrect?: number;
        currentIncorrect?: number;
        currentTotal?: number;
        examType: string;
    };
    students?: AdaptiveTestStudent[];
    wordListTypeId?: number;
}

export class AdaptiveTestView extends AdaptiveTest {
    prevExam?: AdaptiveTest;
    nextExam?: AdaptiveTest;
}

export class ClassAdaptiveTest {
    classTests: ClassTest[];
}

export class ClassTest {
    active: boolean;
    classExams: AdaptiveTest[];
    classId: number;
    classTestId: number;
    classTestTypeId: number;
    classTestName?: string;
    itemGoal: number;
    testEnd: string;
    testStart: string;
}

export class AccountAdaptiveTest {
    accountId: number;
    classTestInfos: AdaptiveTest[];
}

export class ClassTestData {
    accountId: number;
    classTestInfos: ClassTestInfo[];
}

export class ClassTestInfo {
    classId: number;
    examStart: number;
    className: string;
    classTestName: string;
    completed: boolean;
    itemGoal: number;
    currentCorrect: number;
    classTestId: number;
    ratioComplete: number;
    classTestExamId: number;
    classTestTypeId: number;
    currentIncorrect: number;
    expiry: string;
    currentTotal: number;
    absent: boolean;
}

export class LevelTestDetail {
    steps: LevelTestStepDetail[];
}

export class LevelTestStepDetail {
    words: LevelTestWordDetail[];
}

export class LevelTestWordDetail {
    label: string;
    wordRootId: number;
    completed: number;
    correct: boolean;
    modeId: number;
}

export class AccountLevelTests {
    accountLevelTests: AccountLevelTest[];
}

export class AccountLevelTest {
    levelTestSettingId: number;
    curatedLevelTestId: number;
}

export const MESSAGE_CODE_PROCESSING = -1;
export const MESSAGE_CODE_LEVEL_DOWN = 1;
export const MESSAGE_CODE_LEVEL_UP = 2;
export const MESSAGE_CODE_CHOOSE = 3;
export const MESSAGE_CODE_COMPLETE = 4;
export const MESSAGE_CODE_INCOMPLETE = 5;
export const MESSAGE_CODE_NEW_STEP = 6;
export const MESSAGE_CODE_NEW_QUIZ = 7;

export class ContentQuizWordV1 {
    distractors: WordV1[];
    examples: DialogLineV1[];
    modeId: number;
    word: WordV1;
}

export class ContentQuizWordsV1 {
    quizWords: ContentQuizWordV1[];
}

export class AdaptiveQuizWord {
    shouldStop: boolean;
    quizStepId: number;
    theta: number;
    standardError: number;
    quizWord?: XQuizWord;
}
