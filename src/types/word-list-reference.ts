import { includes } from "lodash-es";
import { MyWordStateV1 } from "./my-word-state-v1";
import { XWordDetail } from "./x-word";
import { DialogLine } from "./dialog-line";

export class WordListReference {
    wordLists: WordList[];
}

export class WordList {
    name: string;
    id?: number;
    wordListTypeId?: number;
    maxWordRank?: number;
    active?: boolean;
    description: string;
    organizationIds?: number[];
    levelUpList?: number;

    // [BC-71588] Stored here in a static way. Best practice is to take each wordListTypeId from services by level,
    static WORDLIST_TYPE_ID_BY_LEVEL: { [level: number]: number } = {
        1: 7,
        2: 8,
        3: 9,
        4: 10,
        5: 11,
        6: 12,
        7: 13
    };

    static getWordListTypeIdByLevel = (level: number): number => {
        return !level ? 0 : WordList.WORDLIST_TYPE_ID_BY_LEVEL[level];
    };

    static getLevelByWordListTypeId = (wordListTypeId: number): number | undefined => {
        let level;
        Object.keys(WordList.WORDLIST_TYPE_ID_BY_LEVEL).some((keyLevel) => {
            const valueWordListTypeId = WordList.WORDLIST_TYPE_ID_BY_LEVEL[keyLevel];
            const isMatchingId = valueWordListTypeId == wordListTypeId;
            if (isMatchingId) {
                level = keyLevel;
            }
            return isMatchingId;
        });
        return level;
    };

    static isLevelWordList = (wordListTypeId: number): boolean => {
        return includes(Object.values(WordList.WORDLIST_TYPE_ID_BY_LEVEL), wordListTypeId);
    };

    static getMyWordListNameByWordListTypeId(wordListTypeId: number): string {
        switch (wordListTypeId) {
            case MyWordsListTypeIds.All:
                return MyWordStateV1.ALL;
            case MyWordsListTypeIds.Known:
                return MyWordStateV1.KNOWN;
            case MyWordsListTypeIds.Favorite:
                return MyWordStateV1.FAVORITES;
            case MyWordsListTypeIds.Mastered:
                return MyWordStateV1.MASTERED;
            case MyWordsListTypeIds.Missed:
                return MyWordStateV1.MISSED;
            default:
                return MyWordStateV1.ALL;
        }
    }
}

export class WordListWord {
    wordListTypeId: number;
    wordFamilyId: number;
    word: XWordDetail;
    shortDefiniton?: string;
    longDefinition?: string;
    multiWord: boolean;
    levelOverride: boolean;
    label: string;
    rank: number;
    wordListDialogLineId: number;
    dialogLine: DialogLine;
    alternateCorrects: any[]; // should be XWordDefiniton Array
}

export class AccountWordListSetting {
    accountId: number;
    accountWordLists: WordListSetting[];
    latestWordList: WordListSetting;
}

export class ClassWordListSetting {
    classWordLists: ClassWordList[];
}

export class ClassWordList {
    classId: number;
    startingBand: number;
    wordListTypeId: number;
    created: number;
}

export class WordListSetting {
    wordListTypeId: number;
    band: number;
    name: string;
}

export class WordListOrganizationMatch {
    wordListTypeId: number;
    organizationId: number;
}

export const DEFAULT_WORD_LIST_TYPE_ID = 1;
export const DEFAULT_WORD_LIST_TYPE_CORE_VOCAB_ID = 2;
export const DEFAULT_WORD_LIST_TYPE_NAME = "All";
export const DEFAULT_WORD_LIST_BAND = 14;
export const DEFAULT_WORD_LIST_SETTING = {
    wordListTypeId: DEFAULT_WORD_LIST_TYPE_ID,
    band: DEFAULT_WORD_LIST_BAND
};
export const DEFAULT_WORD_LIST_TYPE_IDS = [1, 2, 3, 4];

export const DEFAULT_QUIZ_ITEMS = 10;
export const MAX_QUIZ_ITEMS = 50;
export const MIN_QUIZ_ITEMS = 1;
export const MIN_RANK = 1;

export enum MyWordsListTypeIds {
    All = 9999,
    Missed = 9998,
    Mastered = 9997,
    Favorite = 9996,
    Known = 9995,
}

export const LAST_LEVEL_LIST = "Post-Level-7 Wordlist";

export const MY_WORDS_WORD_LIST_COLLECTION: number[] = [
    MyWordsListTypeIds.All,
    MyWordsListTypeIds.Missed,
    MyWordsListTypeIds.Mastered,
    MyWordsListTypeIds.Favorite,
    MyWordsListTypeIds.Known
];

export const MY_WORDS_WORD_LIST_NAMES = {
    all: "My Words",
    missed: "Missed Words",
    mastered: "Mastered Words",
    favorites: "Favorite Words",
    known: "Known Words"
};

export const MY_WORDS_LISTS = {
    all: {
        name: MY_WORDS_WORD_LIST_NAMES.all,
        wordListTypeId: MyWordsListTypeIds.All,
        description: "All words with progress or favorited"
    },
    missed: {
        name: MY_WORDS_WORD_LIST_NAMES.missed,
        wordListTypeId: MyWordsListTypeIds.Missed,
        description: "Words last studied incorrectly"
    },
    mastered: {
        name: MY_WORDS_WORD_LIST_NAMES.mastered,
        wordListTypeId: MyWordsListTypeIds.Mastered,
        description: "Words you have learned correctly, multiple times, over at least a 90 day period"
    },
    favorites: {
        name: MY_WORDS_WORD_LIST_NAMES.favorites,
        wordListTypeId: MyWordsListTypeIds.Favorite,
        description: "Words marked as favorites"
    },
    known: {
        name: MY_WORDS_WORD_LIST_NAMES.known,
        wordListTypeId: MyWordsListTypeIds.Known,
        description: "Words marked as known"
    }
};

export const MY_WORDS_WORD_LIST: WordList[] = [
    MY_WORDS_LISTS.all,
    MY_WORDS_LISTS.missed,
    MY_WORDS_LISTS.mastered,
    MY_WORDS_LISTS.favorites,
    MY_WORDS_LISTS.known
];

export class ContentWordLists {
    wordLists: WordList[];
}

export class WordSharedMeaningParams {
    wordId?: number;
    wordListTypeId?: number;
    sharedMeaningId?: number;
    rank?: number;
    dialogLineId?: number;
}
