import { MyWordsListTypeIds } from "./word-list-reference";

export class VocabBuilderSettings {
    accountId: number;
    latestSetting: VocabBuilderSetting;
    wordListTypeIdToAccountSettings: { [wordListTypeId: number]: VocabBuilderSetting };
}

export class VocabBuilderOverride {
    vocabBuilderModeIds?: number[];
    numberOfQuizItems?: number;
    vocabBuilderStyleId?: number;
    wordListTypeId?: number;
}

export class VocabBuilderSetting {
    type?: string;
    accountId?: number;
    activityId?: number;
    activityTypeId?: number;
    created?: string;
    numberOfQuizItems?: number;
    source?: string;
    souceId?: number;
    styleSetting?: VocabBuilderStyleSetting;
    vocabBuilderAccountSettingId?: number;
    vocabBuilderClassExamSettingId?: number;
    vocabBuilderModeIds?: number[];
    vocabBuilderStyleId?: number;
    wordListTypeId?: number;
    wordInstanceIds?: number[];
    wordIds?: number[];
    classExamId?: number;
    initialRank?: number;
    curatedLevelTestId?: number;
    levelTestSettingId?: number;
    listRank?: number;
    quizActivitySettingId?: number;
    recycleSkippedWords?: boolean;
    recycleMissedWords?: boolean;
    reviewItemRatio?: number;
}

export class LocalUserVocabularySettings {
    recycleSkippedWords?: boolean = false;
    recycleMissedWords?: boolean = false;
}

export class VocabBuilderStyleSetting {
    rank?: number;
    range?: number;
    settingType?: string;
    wordHeadIds?: number[];
    sharedMeaningIds?: number[];
}

export class VocabBuilderClassSetting {
    vocabBuilderModeIds?: number[];
    name?: string;
    vocabBuilderClassSettingId?: number;
    classId: number;
    created?: string;
    wordListTypeId?: number;
    startRank?: number;
    numberOfWordsPerWeek?: number;
    numberOfWeeks?: number;
    vocabBuilderStyleId: number;
    reviewItemRatio?: number;
}

export const DEFAULT_REVIEW_ITEM_RATIO = 0.5;

// Vocab Builder Modes
export const VOCAB_BUILDER_MODE_ID_TYPING: number = 1;
export const VOCAB_BUILDER_MODE_ID_SPEAKING: number = 2;
export const VOCAB_BUILDER_MODE_ID_MULTIPLE_CHOICE: number = 3;

// Vocab Builder Styles
export const VOCAB_BUILDER_STYLE_ID_ADAPTIVE: number = 1;
export const VOCAB_BUILDER_STYLE_ID_SEQUENTIAL: number = 2;
export const VOCAB_BUILDER_STYLE_ID_CLASS_EXAM: number = 3;
export const VOCAB_BUILDER_STYLE_ID_AUTOMATIC: number = 4;
export const VOCAB_BUILDER_STYLE_ID_MY_WORDS: number = 8;

export const MyWordsWordListSettings: VocabBuilderSettings = {
    accountId: 0,
    latestSetting: {},
    wordListTypeIdToAccountSettings: {
        [MyWordsListTypeIds.All]: {wordListTypeId: MyWordsListTypeIds.All},
        [MyWordsListTypeIds.Missed]: {wordListTypeId: MyWordsListTypeIds.Missed},
        [MyWordsListTypeIds.Mastered]: {wordListTypeId: MyWordsListTypeIds.Mastered},
        [MyWordsListTypeIds.Favorite]: {wordListTypeId: MyWordsListTypeIds.Favorite},
        [MyWordsListTypeIds.Known]: {wordListTypeId: MyWordsListTypeIds.Known}
    }
};
