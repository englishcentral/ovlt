import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { Logger } from "../common/logger";
import { WordList, WordListReference } from "../../types/word-list-reference";
import { VocabBuilderReference } from "../../types/vocab-builder-reference";

class ReferenceParams {
    types: string;
    includeInactive?: boolean;
    includeInternal?: boolean;
    includePrivate?: boolean;
}

@Injectable()
export class ReferenceModelService {
    private logger = new Logger();

    constructor() {
    }

    getAccountWordListsReference(accountId: number, options: object = {}): Observable<WordListReference> {
        return of({
            "type": "WordListReference",
            "wordLists": [
                {
                    "wordListTypeId": 8,
                    "name": "Level 2 Wordlist",
                    "active": true,
                    "maxWordRank": 354,
                    "description": "The most important words to learn for Level 2",
                    "organizationIds": [],
                    "levelUpList": 2,
                    "accountSelectable": false,
                    "standAlone": true,
                    "autoInclude": false,
                    "private": false
                }
            ]
        });
    }

    getCachedAccountWordListsReference(accountId: number, siteLanguage: string): Observable<WordListReference> {
        return this.getAccountWordListsReference(accountId, {siteLanguage: siteLanguage});
    }

    getAccountSelectableWordLists(options: object = {}): Observable<WordList[]> {
        return of([]);
    }

    getCachedAccountSelectableWordListsCount(options: object = {}): Observable<number> {
        return this.getAccountSelectableWordListsCount(options);
    }

    getAccountSelectableWordListsCount(options: object = {}): Observable<number> {
        return of(0);
    }

    getCachedAccountSelectableWordLists(options: object = {}): Observable<WordList[]> {
        return this.getAccountSelectableWordLists(options);
    }

    getReference(options: ReferenceParams): Observable<any> {
        if (options.types == "vocabBuilder") {
            return of([
                {
                    "type": "VocabBuilderReference",
                    "wordLists": [
                        {
                            "wordListTypeId": 2,
                            "name": "NGSL Vocab",
                            "active": true,
                            "maxWordRank": 2797,
                            "description": "New General Service List is the 2800 most frequent words used in the English language.",
                            "organizationIds": [],
                            "levelUpList": null,
                            "accountSelectable": true,
                            "standAlone": true,
                            "autoInclude": true,
                            "private": false
                        },
                        {
                            "wordListTypeId": 3,
                            "name": "Academic Vocab",
                            "active": true,
                            "maxWordRank": 952,
                            "description": "The 960 most common words in academic texts and lectures.",
                            "organizationIds": [],
                            "levelUpList": null,
                            "accountSelectable": true,
                            "standAlone": true,
                            "autoInclude": true,
                            "private": false
                        },
                        {
                            "wordListTypeId": 4,
                            "name": "TOEIC Vocab",
                            "active": true,
                            "maxWordRank": 1255,
                            "description": "The 1200 most common words that appear on the TOEIC exam.",
                            "organizationIds": [],
                            "levelUpList": null,
                            "accountSelectable": true,
                            "standAlone": true,
                            "autoInclude": true,
                            "private": false
                        },
                        {
                            "wordListTypeId": 5,
                            "name": "Business Vocab",
                            "active": true,
                            "maxWordRank": 1678,
                            "description": "The 1700 most common words for learners looking to master general business English situations",
                            "organizationIds": [],
                            "levelUpList": null,
                            "accountSelectable": true,
                            "standAlone": true,
                            "autoInclude": true,
                            "private": false
                        },
                        {
                            "wordListTypeId": 7,
                            "name": "Level 1 Wordlist",
                            "active": true,
                            "maxWordRank": 381,
                            "description": "The most important words to learn for Level 1",
                            "organizationIds": [],
                            "levelUpList": 1,
                            "accountSelectable": false,
                            "standAlone": true,
                            "autoInclude": false,
                            "private": false
                        },
                        {
                            "wordListTypeId": 8,
                            "name": "Level 2 Wordlist",
                            "active": true,
                            "maxWordRank": 354,
                            "description": "The most important words to learn for Level 2",
                            "organizationIds": [],
                            "levelUpList": 2,
                            "accountSelectable": false,
                            "standAlone": true,
                            "autoInclude": false,
                            "private": false
                        },
                        {
                            "wordListTypeId": 9,
                            "name": "Level 3 Wordlist",
                            "active": true,
                            "maxWordRank": 1042,
                            "description": "The most important words to learn for Level 3",
                            "organizationIds": [],
                            "levelUpList": 3,
                            "accountSelectable": false,
                            "standAlone": true,
                            "autoInclude": false,
                            "private": false
                        },
                        {
                            "wordListTypeId": 10,
                            "name": "Level 4 Wordlist",
                            "active": true,
                            "maxWordRank": 1682,
                            "description": "The most important words to learn for Level 4",
                            "organizationIds": [],
                            "levelUpList": 4,
                            "accountSelectable": false,
                            "standAlone": true,
                            "autoInclude": false,
                            "private": false
                        },
                        {
                            "wordListTypeId": 11,
                            "name": "Level 5 Wordlist",
                            "active": true,
                            "maxWordRank": 1616,
                            "description": "The most important words to learn for Level 5",
                            "organizationIds": [],
                            "levelUpList": 5,
                            "accountSelectable": false,
                            "standAlone": true,
                            "autoInclude": false,
                            "private": false
                        },
                        {
                            "wordListTypeId": 12,
                            "name": "Level 6 Wordlist",
                            "active": true,
                            "maxWordRank": 1556,
                            "description": "The most important words to learn for Level 6",
                            "organizationIds": [],
                            "levelUpList": 6,
                            "accountSelectable": false,
                            "standAlone": true,
                            "autoInclude": false,
                            "private": false
                        },
                        {
                            "wordListTypeId": 13,
                            "name": "Level 7 Wordlist",
                            "active": true,
                            "maxWordRank": 1914,
                            "description": "The most important words to learn for Level 7",
                            "organizationIds": [],
                            "levelUpList": 7,
                            "accountSelectable": false,
                            "standAlone": true,
                            "autoInclude": false,
                            "private": false
                        },
                        {
                            "wordListTypeId": 34998,
                            "name": "Level 10 Wordlist",
                            "active": true,
                            "maxWordRank": 1568,
                            "description": "The most important words to learn for Level 10",
                            "organizationIds": [],
                            "levelUpList": 10,
                            "accountSelectable": false,
                            "standAlone": true,
                            "autoInclude": false,
                            "private": false
                        },
                        {
                            "wordListTypeId": 34999,
                            "name": "Level 9 Wordlist",
                            "active": true,
                            "maxWordRank": 2000,
                            "description": "The most important words to learn for Level 9",
                            "organizationIds": [],
                            "levelUpList": 9,
                            "accountSelectable": false,
                            "standAlone": true,
                            "autoInclude": false,
                            "private": false
                        },
                        {
                            "wordListTypeId": 35000,
                            "name": "Level 8 Wordlist",
                            "active": true,
                            "maxWordRank": 2000,
                            "description": "The most important words to learn for Level 8",
                            "organizationIds": [],
                            "levelUpList": 8,
                            "accountSelectable": false,
                            "standAlone": true,
                            "autoInclude": false,
                            "private": false
                        }
                    ],
                    "vocabBuilderModes": [
                        {
                            "vocabBuilderModeId": 1,
                            "name": "Typing with hints",
                            "active": true,
                            "description": "Type the missing words"
                        },
                        {
                            "vocabBuilderModeId": 4,
                            "name": "Typing without hints",
                            "active": true,
                            "description": "Type the missing words"
                        },
                        {
                            "vocabBuilderModeId": 2,
                            "name": "Speaking with hints",
                            "active": true,
                            "description": "Speak the missing words"
                        },
                        {
                            "vocabBuilderModeId": 6,
                            "name": "Speaking without hints",
                            "active": true,
                            "description": "Speak the missing words"
                        },
                        {
                            "vocabBuilderModeId": 7,
                            "name": "Multiple Choice",
                            "active": true,
                            "description": "Select the correct definition of each word"
                        }
                    ],
                    "vocabBuilderStyles": [
                        {
                            "vocabBuilderStyleId": 2,
                            "name": "Sequential",
                            "translatedName": "Sequential",
                            "active": true,
                            "description": "Quiz includes new and review words starting with the rank you set.",
                            "internal": false
                        },
                        {
                            "vocabBuilderStyleId": 3,
                            "name": "ClassExam",
                            "translatedName": "ClassExam",
                            "active": true,
                            "internal": true
                        },
                        {
                            "vocabBuilderStyleId": 4,
                            "name": "Review",
                            "translatedName": "Review",
                            "active": true,
                            "description": "Quiz includes 20% new words and 80% review words, based on our time interval learning algorithm.",
                            "internal": false
                        },
                        {
                            "vocabBuilderStyleId": 5,
                            "name": "LevelTest",
                            "translatedName": "LevelTest",
                            "active": true,
                            "internal": true
                        },
                        {
                            "vocabBuilderStyleId": 6,
                            "name": "CuratedLevelTest",
                            "translatedName": "CuratedLevelTest",
                            "active": true,
                            "internal": true
                        },
                        {
                            "vocabBuilderStyleId": 7,
                            "name": "Activity",
                            "translatedName": "Activity",
                            "active": true,
                            "description": "Builds a quiz with the words based on a set of words from the course you are studying.",
                            "internal": true
                        },
                        {
                            "vocabBuilderStyleId": 8,
                            "name": "MyWords",
                            "translatedName": "MyWords",
                            "active": true,
                            "description": "Builds a quiz with selected words from my words lists.",
                            "internal": true
                        },
                        {
                            "vocabBuilderStyleId": 9,
                            "name": "ComputerizedAdaptiveLevelTest",
                            "translatedName": "ComputerizedAdaptiveLevelTest",
                            "active": true,
                            "description": "Builds a quiz based on the user responses, by using CAT methodology",
                            "internal": true
                        }
                    ],
                    "mixedModes": [
                        1,
                        7,
                        2
                    ]
                }
            ]);
        }

    }

    getCachedReference(params: ReferenceParams): Observable<any> {
        return this.getReference(params);
    }

    getVocabBuilderReference(includeInternal: boolean = false, useCache: boolean = false): Observable<VocabBuilderReference[]> {
        if (useCache) {
            return this.getCachedReference({types: "vocabBuilder", includeInternal: includeInternal});
        }
        return this.getReference({types: "vocabBuilder", includeInternal: includeInternal});
    }

    clearAccountWordListsReference(accountId: number): void {
        if (!accountId) {
            return;
        }
    }

    clearReferenceCache(types: string): void {
    }
}
