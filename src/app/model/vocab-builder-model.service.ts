import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { VocabBuilderSetting, VocabBuilderSettings } from "../../types/vocab-builder-settings";
import { AdaptiveQuizWord, LevelTestDetail, XWordQuiz } from "../../types/vocabulary-quiz";
import { forEach, isNull } from "lodash-es";
import { LevelTestHistory, VltQuizScore } from "../../types/vocab-level-test";
import { Logger } from "../common/logger";
import { VbSettings } from "../vocabulary-app/quiz-data-source/quiz-data-source-abstract";
import { Word } from "../../types/word";

@Injectable({providedIn: "root"})
export class VocabBuilderModelService {
    private logger = new Logger();

    constructor() {
    }

    getAccountVocabBuilderSetting(accountId: number, combinedParams: VbSettings = {useAccountWordLists: false}): Observable<VocabBuilderSettings> {
        if (!accountId) {
            this.logger.log("accountId is required param");
            return of(undefined);
        }

        return of(undefined);
    }

    getDistractors(wordRootId: number): Observable<Word[]> {
        if (!wordRootId) {
            this.logger.log("wordRootId is required param");
            return of(undefined);
        }

        return of(undefined);
    }


    getAccountClassRank(classId: number, accountId: number, wordListTypeId: number): Observable<number> {
        if (!classId || !accountId || !wordListTypeId) {
            this.logger.log("classId, accountId, wordListTypeId are required params");
            return of(undefined);
        }

        return of(undefined);
    }

    clearAccountClassRank(accountId: number): void {
        if (!accountId) {
            this.logger.log("accountId is required param");
            return;
        }
    }


    generateQuiz(accountId: number, postBody: object = {}, query: object = {}): Observable<XWordQuiz> {
        if (!accountId) {
            this.logger.log("accountId is required param");
            return of(undefined);
        }

        return of(undefined);
    }

    generateMyQuiz(accountId: number, postBody: object = {}, query: object = {}): Observable<XWordQuiz> {
        if (!accountId) {
            this.logger.log("accountId is required param");
            return of(undefined);
        }

        return of(undefined);
    }

    generateLevelQuiz(params: VocabBuilderSetting): Observable<any> {
        return of({
            "quizType": "levelTest",
            "wordListTypeId": 101232,
            "quizStepId": 133583,
            "quizStyleId": 5,
            "quizWords": [
                {
                    "type": "XQuizWord",
                    "modeId": 1,
                    "previouslyEncountered": false,
                    "word": {
                        "id": 2660,
                        "wordInstanceId": 4717,
                        "wordRootId": 4710,
                        "sharedMeaningId": 1190,
                        "wordFamilyId": 771,
                        "wordDefinitionId": 1115,
                        "definition": "to put on clothes, jewelry or makeup",
                        "definitionEn": "to put on clothes, jewelry or makeup",
                        "label": "WEAR",
                        "wordRootLabel": "WEAR",
                        "pronunciationId": 2007,
                        "phonemes": "W EH R",
                        "example": "What should I wear today?",
                        "partOfSpeech": "verb",
                        "baseForm": true,
                        "featured": false,
                        "excluded": false,
                        "adjectiveType": 0,
                        "nounType": 3,
                        "wordLanguage": "en",
                        "difficultyLevel": 2,
                        "cambridgeBand": 11,
                        "usageCount": 1337,
                        "audioURL": "https://cdna.qaenglishcentral.com/words/W/WARE_123826_105309.mp3",
                        "wordAdapter": {
                            "id": 4717,
                            "wordId": 2660,
                            "wordHeadId": 320,
                            "wordRootId": 418727,
                            "wordInstanceId": 57856,
                            "wordUsageCount": 0,
                            "headUsageCount": 1384,
                            "rootUsageCount": 1313,
                            "instanceUsageCount": 602,
                            "sharedMeaningId": 1190,
                            "wordFamilyId": null,
                            "headPick": true,
                            "rootPick": true
                        },
                        "canonicalDialogLineId": 298370,
                        "pronunciation": {
                            "id": 2007,
                            "phonemes": "W EH R",
                            "assetId": 105309,
                            "syllableCount": 1,
                            "phones": [
                                {
                                    "id": 4,
                                    "label": "W"
                                },
                                {
                                    "id": 18,
                                    "label": "EH"
                                },
                                {
                                    "id": 19,
                                    "label": "R"
                                }
                            ],
                            "active": true,
                            "dateAdded": 1684739172000,
                            "dateModified": 1684739172000
                        },
                        "properNoun": false,
                        "cliplistKeyword": false,
                        "studiable": true,
                        "idiom": false
                    },
                    "distractors": [
                        {
                            "id": 384,
                            "wordInstanceId": 523,
                            "wordRootId": 523,
                            "sharedMeaningId": 223,
                            "wordFamilyId": 169,
                            "wordDefinitionId": 220,
                            "definition": "to give someone or something a name",
                            "definitionEn": "to give a name",
                            "label": "CALL",
                            "wordRootLabel": "CALL",
                            "pronunciationId": 316,
                            "phonemes": "K AO L",
                            "example": "My friends call me by my nickname.",
                            "partOfSpeech": "verb",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 4,
                            "cambridgeBand": 3,
                            "usageCount": 2555,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/c/call_16463_20230106061346.mp3",
                            "wordAdapter": {
                                "id": 524,
                                "wordId": 384,
                                "wordHeadId": 40,
                                "wordRootId": 402371,
                                "wordInstanceId": 46068,
                                "wordUsageCount": 0,
                                "headUsageCount": 3698,
                                "rootUsageCount": 2487,
                                "instanceUsageCount": 637,
                                "sharedMeaningId": 223,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": false
                            },
                            "canonicalDialogLineId": 24389,
                            "pronunciation": {
                                "id": 316,
                                "phonemes": "K AO L",
                                "assetId": 5672984,
                                "syllableCount": 1,
                                "phones": [
                                    {
                                        "id": 30,
                                        "label": "K"
                                    },
                                    {
                                        "id": 40,
                                        "label": "AO"
                                    },
                                    {
                                        "id": 12,
                                        "label": "L"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739137000,
                                "dateModified": 1684739137000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 40261,
                            "wordInstanceId": 10512,
                            "wordRootId": 58,
                            "sharedMeaningId": 20164,
                            "wordFamilyId": 7125,
                            "wordDefinitionId": 18477,
                            "definition": "to not be able to",
                            "definitionEn": "to not be able to",
                            "label": "CANNOT",
                            "wordRootLabel": "CAN",
                            "pronunciationId": 4810,
                            "phonemes": "K AE N AA T",
                            "example": "She cannot ride the bicycle because of her broken ankle.",
                            "partOfSpeech": "verb",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 2,
                            "cambridgeBand": 1,
                            "usageCount": 498,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/c/cannot_16923_2994.mp3",
                            "wordAdapter": {
                                "id": 62650,
                                "wordId": 40261,
                                "wordHeadId": 29998,
                                "wordRootId": 207721,
                                "wordInstanceId": 42552,
                                "wordUsageCount": 0,
                                "headUsageCount": 19065,
                                "rootUsageCount": 491,
                                "instanceUsageCount": 484,
                                "sharedMeaningId": 20164,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 310931,
                            "pronunciation": {
                                "id": 4810,
                                "phonemes": "K AE N AA T",
                                "assetId": 2994,
                                "syllableCount": 2,
                                "phones": [
                                    {
                                        "id": 30,
                                        "label": "K"
                                    },
                                    {
                                        "id": 34,
                                        "label": "AE"
                                    },
                                    {
                                        "id": 9,
                                        "label": "N"
                                    },
                                    {
                                        "id": 5,
                                        "label": "AA"
                                    },
                                    {
                                        "id": 38,
                                        "label": "T"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739235000,
                                "dateModified": 1684739235000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 2907,
                            "wordInstanceId": 5109,
                            "wordRootId": 5106,
                            "sharedMeaningId": 1287,
                            "wordFamilyId": 828,
                            "wordDefinitionId": 1203,
                            "definition": "to understand a situation",
                            "definitionEn": "to understand a situation",
                            "label": "REALIZE",
                            "wordRootLabel": "REALIZE",
                            "pronunciationId": 2186,
                            "phonemes": "R IY AH L AY Z",
                            "example": "I now only realize the mistake I just made.",
                            "partOfSpeech": "verb",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 4,
                            "cambridgeBand": 12,
                            "usageCount": 574,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/r/realize_94280_8764.mp3",
                            "wordAdapter": {
                                "id": 5109,
                                "wordId": 2907,
                                "wordHeadId": 670,
                                "wordRootId": 413914,
                                "wordInstanceId": 311465,
                                "wordUsageCount": 0,
                                "headUsageCount": 587,
                                "rootUsageCount": 566,
                                "instanceUsageCount": 251,
                                "sharedMeaningId": 1287,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": false
                            },
                            "canonicalDialogLineId": 207956,
                            "pronunciation": {
                                "id": 2186,
                                "phonemes": "R IY AH L AY Z",
                                "assetId": 8764,
                                "syllableCount": 3,
                                "phones": [
                                    {
                                        "id": 19,
                                        "label": "R"
                                    },
                                    {
                                        "id": 1,
                                        "label": "IY"
                                    },
                                    {
                                        "id": 29,
                                        "label": "AH"
                                    },
                                    {
                                        "id": 12,
                                        "label": "L"
                                    },
                                    {
                                        "id": 35,
                                        "label": "AY"
                                    },
                                    {
                                        "id": 13,
                                        "label": "Z"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739177000,
                                "dateModified": 1684739177000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        }
                    ],
                    "examples": [
                        {
                            "id": 298370,
                            "dialogId": 24769,
                            "sequence": 4,
                            "transcript": "Will you wear this dress on Tuesday?",
                            "videoURL": "https://cdna.qaenglishcentral.com/dialogs/24769/lineclip_24769_298370_14444_20210818074604.mp4",
                            "thumbnailURL": "https://cdna.qaenglishcentral.com/dialogs/24769/linethumb_24769_298370_14444_20210818074604.jpg",
                            "cueStart": 14444,
                            "cueEnd": 16307,
                            "slowSpeakStart": 21816,
                            "slowSpeakEnd": 24686,
                            "autoPause": false,
                            "pointsMax": 10,
                            "wordDetails": [
                                {
                                    "id": 2660,
                                    "wordInstanceId": 4717,
                                    "wordRootId": 4710,
                                    "sharedMeaningId": 1190,
                                    "wordFamilyId": 771,
                                    "wordDefinitionId": 1115,
                                    "definition": "to put on clothes, jewelry or makeup",
                                    "definitionEn": "to put on clothes, jewelry or makeup",
                                    "label": "WEAR",
                                    "wordRootLabel": "WEAR",
                                    "pronunciationId": 2007,
                                    "phonemes": "W EH R",
                                    "example": "What should I wear today?",
                                    "partOfSpeech": "verb",
                                    "baseForm": true,
                                    "featured": false,
                                    "excluded": false,
                                    "sequence": 3,
                                    "adjectiveType": 0,
                                    "nounType": 3,
                                    "wordLanguage": "en",
                                    "difficultyLevel": 2,
                                    "cambridgeBand": 11,
                                    "usageCount": 1337,
                                    "audioURL": "https://cdna.qaenglishcentral.com/words/W/WARE_123826_105309.mp3",
                                    "wordAdapter": {
                                        "id": 4717,
                                        "wordId": 2660,
                                        "wordHeadId": 320,
                                        "wordRootId": 418727,
                                        "wordInstanceId": 57856,
                                        "wordUsageCount": 0,
                                        "headUsageCount": 1384,
                                        "rootUsageCount": 1313,
                                        "instanceUsageCount": 602,
                                        "sharedMeaningId": 1190,
                                        "wordFamilyId": null,
                                        "headPick": true,
                                        "rootPick": true
                                    },
                                    "canonicalDialogLineId": 298370,
                                    "pronunciation": {
                                        "id": 2007,
                                        "phonemes": "W EH R",
                                        "assetId": 105309,
                                        "syllableCount": 1,
                                        "phones": [
                                            {
                                                "id": 4,
                                                "label": "W"
                                            },
                                            {
                                                "id": 18,
                                                "label": "EH"
                                            },
                                            {
                                                "id": 19,
                                                "label": "R"
                                            }
                                        ],
                                        "active": true,
                                        "dateAdded": 1684739172000,
                                        "dateModified": 1684739172000
                                    },
                                    "properNoun": false,
                                    "cliplistKeyword": false,
                                    "studiable": true,
                                    "idiom": false
                                }
                            ],
                            "dialogTitle": "I Will Do Many Things"
                        }
                    ]
                },
                {
                    "type": "XQuizWord",
                    "modeId": 1,
                    "previouslyEncountered": false,
                    "word": {
                        "id": 16098,
                        "wordInstanceId": 21609,
                        "wordRootId": 21609,
                        "sharedMeaningId": 6996,
                        "wordFamilyId": 3323,
                        "wordDefinitionId": 6403,
                        "definition": "a substance that sweetens food and drinks",
                        "definitionEn": "a sweet substance",
                        "label": "SUGAR",
                        "wordRootLabel": "SUGAR",
                        "pronunciationId": 9872,
                        "phonemes": "SH UH G ER",
                        "example": "I always add two teaspoons of sugar in my coffee.",
                        "partOfSpeech": "noun",
                        "baseForm": true,
                        "featured": false,
                        "excluded": false,
                        "adjectiveType": 0,
                        "nounType": 3,
                        "wordLanguage": "en",
                        "difficultyLevel": 2,
                        "cambridgeBand": 47,
                        "usageCount": 221,
                        "audioURL": "https://cdna.qaenglishcentral.com/words/s/sugar_112350_3391.mp3",
                        "wordAdapter": {
                            "id": 26035,
                            "wordId": 16098,
                            "wordHeadId": 551,
                            "wordRootId": 416696,
                            "wordInstanceId": 50460,
                            "wordUsageCount": 0,
                            "headUsageCount": 256,
                            "rootUsageCount": 217,
                            "instanceUsageCount": 200,
                            "sharedMeaningId": 6996,
                            "wordFamilyId": null,
                            "headPick": true,
                            "rootPick": true
                        },
                        "canonicalDialogLineId": 567626,
                        "pronunciation": {
                            "id": 9872,
                            "phonemes": "SH UH G ER",
                            "assetId": 3391,
                            "syllableCount": 2,
                            "phones": [
                                {
                                    "id": 20,
                                    "label": "SH"
                                },
                                {
                                    "id": 15,
                                    "label": "UH"
                                },
                                {
                                    "id": 25,
                                    "label": "G"
                                },
                                {
                                    "id": 11,
                                    "label": "ER"
                                }
                            ],
                            "active": true,
                            "dateAdded": 1684739364000,
                            "dateModified": 1684739364000
                        },
                        "properNoun": false,
                        "cliplistKeyword": false,
                        "studiable": true,
                        "idiom": false
                    },
                    "distractors": [
                        {
                            "id": 18848,
                            "wordInstanceId": 30492,
                            "wordRootId": 30492,
                            "sharedMeaningId": 8351,
                            "wordFamilyId": 4680,
                            "wordDefinitionId": 7608,
                            "definition": "a place where planes arrive and leave",
                            "definitionEn": "a place where planes arrive and leave",
                            "label": "AIRPORT",
                            "wordRootLabel": "AIRPORT",
                            "pronunciationId": 13791,
                            "phonemes": "EH R P AO R T",
                            "example": "The planes couldn't leave the airport because there was bad weather. ",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 3,
                            "usageCount": 451,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/a/airport_1934_7537.mp3",
                            "wordAdapter": {
                                "id": 30492,
                                "wordId": 18848,
                                "wordHeadId": 509,
                                "wordRootId": 400436,
                                "wordInstanceId": 54680,
                                "wordUsageCount": 0,
                                "headUsageCount": 448,
                                "rootUsageCount": 447,
                                "instanceUsageCount": 402,
                                "sharedMeaningId": 8351,
                                "wordFamilyId": null,
                                "headPick": true,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 243507,
                            "pronunciation": {
                                "id": 13791,
                                "phonemes": "EH R P AO R T",
                                "assetId": 7537,
                                "syllableCount": 2,
                                "phones": [
                                    {
                                        "id": 18,
                                        "label": "EH"
                                    },
                                    {
                                        "id": 19,
                                        "label": "R"
                                    },
                                    {
                                        "id": 23,
                                        "label": "P"
                                    },
                                    {
                                        "id": 40,
                                        "label": "AO"
                                    },
                                    {
                                        "id": 19,
                                        "label": "R"
                                    },
                                    {
                                        "id": 38,
                                        "label": "T"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739477000,
                                "dateModified": 1684739477000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 16034,
                            "wordInstanceId": 25897,
                            "wordRootId": 25897,
                            "sharedMeaningId": 6970,
                            "wordFamilyId": 4062,
                            "wordDefinitionId": 6377,
                            "definition": "a seed of the coffee tree",
                            "definitionEn": "a seed of the coffee tree",
                            "label": "COFFEE",
                            "wordRootLabel": "COFFEE",
                            "pronunciationId": 11833,
                            "phonemes": "K AA F IY",
                            "example": "I bought a pound of coffee from the store.",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 2,
                            "cambridgeBand": 29,
                            "usageCount": 28,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/c/coffee_21498_2123.mp3",
                            "wordAdapter": {
                                "id": 25897,
                                "wordId": 16034,
                                "wordHeadId": 565,
                                "wordRootId": 34411,
                                "wordInstanceId": 170782,
                                "wordUsageCount": 0,
                                "headUsageCount": 562,
                                "rootUsageCount": 28,
                                "instanceUsageCount": 28,
                                "sharedMeaningId": 6970,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 454541,
                            "pronunciation": {
                                "id": 11833,
                                "phonemes": "K AA F IY",
                                "assetId": 2123,
                                "syllableCount": 2,
                                "phones": [
                                    {
                                        "id": 30,
                                        "label": "K"
                                    },
                                    {
                                        "id": 5,
                                        "label": "AA"
                                    },
                                    {
                                        "id": 3,
                                        "label": "F"
                                    },
                                    {
                                        "id": 1,
                                        "label": "IY"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739421000,
                                "dateModified": 1684739421000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 24110,
                            "wordInstanceId": 37549,
                            "wordRootId": 37549,
                            "sharedMeaningId": 11474,
                            "wordFamilyId": 6032,
                            "wordDefinitionId": 10333,
                            "definition": "a place on the internet that shows information",
                            "definitionEn": "a page online that shows information",
                            "label": "WEBSITE",
                            "wordRootLabel": "WEBSITE",
                            "pronunciationId": 17683,
                            "phonemes": "W EH B S AY T",
                            "example": "This website is about sports and can be accessed anywhere that is connected to the Internet.",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 2,
                            "usageCount": 361,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/w/website_124317_3930.mp3",
                            "wordAdapter": {
                                "id": 37549,
                                "wordId": 24110,
                                "wordHeadId": 3384,
                                "wordRootId": 418750,
                                "wordInstanceId": 61590,
                                "wordUsageCount": 0,
                                "headUsageCount": 350,
                                "rootUsageCount": 350,
                                "instanceUsageCount": 268,
                                "sharedMeaningId": 11474,
                                "wordFamilyId": null,
                                "headPick": true,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 244432,
                            "pronunciation": {
                                "id": 17683,
                                "phonemes": "W EH B S AY T",
                                "assetId": 3930,
                                "syllableCount": 2,
                                "phones": [
                                    {
                                        "id": 4,
                                        "label": "W"
                                    },
                                    {
                                        "id": 18,
                                        "label": "EH"
                                    },
                                    {
                                        "id": 8,
                                        "label": "B"
                                    },
                                    {
                                        "id": 27,
                                        "label": "S"
                                    },
                                    {
                                        "id": 35,
                                        "label": "AY"
                                    },
                                    {
                                        "id": 38,
                                        "label": "T"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739585000,
                                "dateModified": 1684739585000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        }
                    ],
                    "examples": [
                        {
                            "id": 567626,
                            "dialogId": 40400,
                            "sequence": 3,
                            "characterId": 1030,
                            "transcript": "A black coffee with two sugars, please.",
                            "videoURL": "https://cdna.qaenglishcentral.com/dialogs/40400/lineclip_40400_567626_4105_20220801065227.mp4",
                            "thumbnailURL": "https://cdna.qaenglishcentral.com/dialogs/40400/linethumb_40400_567626_4105_20220801065227.jpg",
                            "cueStart": 4105,
                            "cueEnd": 6129,
                            "slowSpeakStart": 6307,
                            "slowSpeakEnd": 9419,
                            "autoPause": false,
                            "pointsMax": 9,
                            "wordDetails": [
                                {
                                    "id": 16099,
                                    "wordInstanceId": 21611,
                                    "wordRootId": 21609,
                                    "sharedMeaningId": 6996,
                                    "wordFamilyId": 3323,
                                    "wordDefinitionId": 6403,
                                    "definition": "a substance that sweetens food and drinks",
                                    "definitionEn": "a substance that sweetens food and drinks",
                                    "label": "SUGARS",
                                    "wordRootLabel": "SUGAR",
                                    "pronunciationId": 9873,
                                    "phonemes": "SH UH G ER Z",
                                    "example": "Chocolate bars have sugars in them.",
                                    "partOfSpeech": "noun",
                                    "baseForm": false,
                                    "featured": false,
                                    "excluded": false,
                                    "sequence": 6,
                                    "adjectiveType": 0,
                                    "nounType": 3,
                                    "wordLanguage": "en",
                                    "difficultyLevel": 2,
                                    "cambridgeBand": 47,
                                    "usageCount": 221,
                                    "audioURL": "https://cdna.qaenglishcentral.com/words/s/sugars_112354_2617.mp3",
                                    "wordAdapter": {
                                        "id": 26037,
                                        "wordId": 16099,
                                        "wordHeadId": 551,
                                        "wordRootId": 416696,
                                        "wordInstanceId": 40083,
                                        "wordUsageCount": 0,
                                        "headUsageCount": 256,
                                        "rootUsageCount": 217,
                                        "instanceUsageCount": 15,
                                        "sharedMeaningId": 6996,
                                        "wordFamilyId": null,
                                        "headPick": false,
                                        "rootPick": false
                                    },
                                    "canonicalDialogLineId": 567626,
                                    "pronunciation": {
                                        "id": 9873,
                                        "phonemes": "SH UH G ER Z",
                                        "assetId": 2617,
                                        "syllableCount": 2,
                                        "phones": [
                                            {
                                                "id": 20,
                                                "label": "SH"
                                            },
                                            {
                                                "id": 15,
                                                "label": "UH"
                                            },
                                            {
                                                "id": 25,
                                                "label": "G"
                                            },
                                            {
                                                "id": 11,
                                                "label": "ER"
                                            },
                                            {
                                                "id": 13,
                                                "label": "Z"
                                            }
                                        ],
                                        "active": true,
                                        "dateAdded": 1684739364000,
                                        "dateModified": 1684739364000
                                    },
                                    "properNoun": false,
                                    "cliplistKeyword": false,
                                    "studiable": true,
                                    "idiom": false
                                }
                            ],
                            "dialogTitle": "Ordering Drinks"
                        }
                    ]
                },
                {
                    "type": "XQuizWord",
                    "modeId": 1,
                    "previouslyEncountered": false,
                    "word": {
                        "id": 20026,
                        "wordInstanceId": 32176,
                        "wordRootId": 30249,
                        "sharedMeaningId": 9048,
                        "wordFamilyId": 4651,
                        "wordDefinitionId": 8235,
                        "definition": "a quantity or amount",
                        "definitionEn": "a quantity or amount",
                        "label": "NUMBER",
                        "wordRootLabel": "NUMBER",
                        "pronunciationId": 14696,
                        "phonemes": "N AH M B ER",
                        "example": "he had a number of chores to do ",
                        "partOfSpeech": "noun",
                        "baseForm": true,
                        "featured": false,
                        "excluded": false,
                        "adjectiveType": 0,
                        "nounType": 3,
                        "wordLanguage": "en",
                        "difficultyLevel": 1,
                        "cambridgeBand": 3,
                        "usageCount": 924,
                        "audioURL": "https://cdna.qaenglishcentral.com/words/n/number_81749_5103.mp3",
                        "wordAdapter": {
                            "id": 32180,
                            "wordId": 20026,
                            "wordHeadId": 92,
                            "wordRootId": 411406,
                            "wordInstanceId": 55522,
                            "wordUsageCount": 0,
                            "headUsageCount": 1829,
                            "rootUsageCount": 899,
                            "instanceUsageCount": 691,
                            "sharedMeaningId": 9048,
                            "wordFamilyId": null,
                            "headPick": false,
                            "rootPick": true
                        },
                        "canonicalDialogLineId": 299281,
                        "pronunciation": {
                            "id": 14696,
                            "phonemes": "N AH M B ER",
                            "assetId": 5103,
                            "syllableCount": 2,
                            "phones": [
                                {
                                    "id": 9,
                                    "label": "N"
                                },
                                {
                                    "id": 29,
                                    "label": "AH"
                                },
                                {
                                    "id": 31,
                                    "label": "M"
                                },
                                {
                                    "id": 8,
                                    "label": "B"
                                },
                                {
                                    "id": 11,
                                    "label": "ER"
                                }
                            ],
                            "active": true,
                            "dateAdded": 1684739501000,
                            "dateModified": 1684739501000
                        },
                        "properNoun": false,
                        "cliplistKeyword": false,
                        "studiable": true,
                        "idiom": false
                    },
                    "distractors": [
                        {
                            "id": 35116,
                            "wordInstanceId": 53235,
                            "wordRootId": 53235,
                            "sharedMeaningId": 17415,
                            "wordFamilyId": 8373,
                            "wordDefinitionId": 15892,
                            "definition": "a road in a town or city that is lined with buildings",
                            "definitionEn": "a road",
                            "label": "STREET",
                            "wordRootLabel": "STREET",
                            "pronunciationId": 24040,
                            "phonemes": "S T R IY T",
                            "example": "the whole street protested the absence of street lights",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 1,
                            "cambridgeBand": 13,
                            "usageCount": 786,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/S/STREET_109638_109567.mp3",
                            "wordAdapter": {
                                "id": 54014,
                                "wordId": 35116,
                                "wordHeadId": 348,
                                "wordRootId": 172957,
                                "wordInstanceId": 40605,
                                "wordUsageCount": 0,
                                "headUsageCount": 781,
                                "rootUsageCount": 767,
                                "instanceUsageCount": 411,
                                "sharedMeaningId": 17415,
                                "wordFamilyId": null,
                                "headPick": true,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 563299,
                            "pronunciation": {
                                "id": 24040,
                                "phonemes": "S T R IY T",
                                "assetId": 109567,
                                "syllableCount": 1,
                                "phones": [
                                    {
                                        "id": 27,
                                        "label": "S"
                                    },
                                    {
                                        "id": 38,
                                        "label": "T"
                                    },
                                    {
                                        "id": 19,
                                        "label": "R"
                                    },
                                    {
                                        "id": 1,
                                        "label": "IY"
                                    },
                                    {
                                        "id": 38,
                                        "label": "T"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739838000,
                                "dateModified": 1684739838000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 25734,
                            "wordInstanceId": 39779,
                            "wordRootId": 39779,
                            "sharedMeaningId": 12332,
                            "wordFamilyId": 6425,
                            "wordDefinitionId": 11130,
                            "definition": "the language spoken in Portugal and Brazil",
                            "definitionEn": "the language spoken in Portugal and Brazil",
                            "label": "PORTUGUESE",
                            "wordRootLabel": "PORTUGUESE",
                            "pronunciationId": 18779,
                            "phonemes": "P AO R CH AH G IY Z",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 1,
                            "usageCount": 7,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/P/PORTUGUESE_89884_235891.mp3",
                            "wordAdapter": {
                                "id": 39779,
                                "wordId": 25734,
                                "wordHeadId": 50010,
                                "wordRootId": 455167,
                                "wordInstanceId": 377256,
                                "wordUsageCount": 0,
                                "headUsageCount": 6,
                                "rootUsageCount": 6,
                                "instanceUsageCount": 6,
                                "sharedMeaningId": 12332,
                                "wordFamilyId": null,
                                "headPick": true,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 547369,
                            "pronunciation": {
                                "id": 18779,
                                "phonemes": "P AO R CH AH G IY Z",
                                "assetId": 235891,
                                "syllableCount": 3,
                                "phones": [
                                    {
                                        "id": 23,
                                        "label": "P"
                                    },
                                    {
                                        "id": 40,
                                        "label": "AO"
                                    },
                                    {
                                        "id": 19,
                                        "label": "R"
                                    },
                                    {
                                        "id": 2,
                                        "label": "CH"
                                    },
                                    {
                                        "id": 29,
                                        "label": "AH"
                                    },
                                    {
                                        "id": 25,
                                        "label": "G"
                                    },
                                    {
                                        "id": 1,
                                        "label": "IY"
                                    },
                                    {
                                        "id": 13,
                                        "label": "Z"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739619000,
                                "dateModified": 1684739619000
                            },
                            "properNoun": true,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 5929,
                            "wordInstanceId": 9951,
                            "wordRootId": 9951,
                            "sharedMeaningId": 2432,
                            "wordFamilyId": 1500,
                            "wordDefinitionId": 2250,
                            "definition": "a period when something is expected to happen",
                            "definitionEn": "a time when something happens",
                            "label": "DAY",
                            "wordRootLabel": "DAY",
                            "pronunciationId": 4453,
                            "phonemes": "D EY",
                            "example": "he deserves his day in court ",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 3,
                            "cambridgeBand": 2,
                            "usageCount": 681,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/d/day_27348_2154.mp3",
                            "wordAdapter": {
                                "id": 9951,
                                "wordId": 5929,
                                "wordHeadId": 23,
                                "wordRootId": 45472,
                                "wordInstanceId": 2330,
                                "wordUsageCount": 0,
                                "headUsageCount": 5464,
                                "rootUsageCount": 661,
                                "instanceUsageCount": 636,
                                "sharedMeaningId": 2432,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 519626,
                            "pronunciation": {
                                "id": 4453,
                                "phonemes": "D EY",
                                "assetId": 2154,
                                "syllableCount": 1,
                                "phones": [
                                    {
                                        "id": 39,
                                        "label": "D"
                                    },
                                    {
                                        "id": 26,
                                        "label": "EY"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739230000,
                                "dateModified": 1684739230000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        }
                    ],
                    "examples": [
                        {
                            "id": 299281,
                            "dialogId": 24816,
                            "sequence": 17,
                            "characterId": 2354,
                            "transcript": "There are a number of points to discuss.",
                            "videoURL": "https://cdna.qaenglishcentral.com/dialogs/24816/lineclip_24816_299281_43379_20150910082448.mp4",
                            "thumbnailURL": "https://cdna.qaenglishcentral.com/dialogs/24816/linethumb_24816_299281_43379_20150910082448.jpg",
                            "cueStart": 43455,
                            "cueEnd": 45097,
                            "slowSpeakStart": 65333,
                            "slowSpeakEnd": 67870,
                            "autoPause": false,
                            "pointsMax": 14,
                            "wordDetails": [
                                {
                                    "id": 20026,
                                    "wordInstanceId": 32176,
                                    "wordRootId": 30249,
                                    "sharedMeaningId": 9048,
                                    "wordFamilyId": 4651,
                                    "wordDefinitionId": 8235,
                                    "definition": "a quantity or amount",
                                    "definitionEn": "a quantity or amount",
                                    "label": "NUMBER",
                                    "wordRootLabel": "NUMBER",
                                    "pronunciationId": 14696,
                                    "phonemes": "N AH M B ER",
                                    "example": "he had a number of chores to do ",
                                    "partOfSpeech": "noun",
                                    "baseForm": true,
                                    "featured": false,
                                    "excluded": false,
                                    "sequence": 4,
                                    "adjectiveType": 0,
                                    "nounType": 3,
                                    "wordLanguage": "en",
                                    "difficultyLevel": 1,
                                    "cambridgeBand": 3,
                                    "usageCount": 924,
                                    "audioURL": "https://cdna.qaenglishcentral.com/words/n/number_81749_5103.mp3",
                                    "wordAdapter": {
                                        "id": 32180,
                                        "wordId": 20026,
                                        "wordHeadId": 92,
                                        "wordRootId": 411406,
                                        "wordInstanceId": 55522,
                                        "wordUsageCount": 0,
                                        "headUsageCount": 1829,
                                        "rootUsageCount": 899,
                                        "instanceUsageCount": 691,
                                        "sharedMeaningId": 9048,
                                        "wordFamilyId": null,
                                        "headPick": false,
                                        "rootPick": true
                                    },
                                    "canonicalDialogLineId": 299281,
                                    "pronunciation": {
                                        "id": 14696,
                                        "phonemes": "N AH M B ER",
                                        "assetId": 5103,
                                        "syllableCount": 2,
                                        "phones": [
                                            {
                                                "id": 9,
                                                "label": "N"
                                            },
                                            {
                                                "id": 29,
                                                "label": "AH"
                                            },
                                            {
                                                "id": 31,
                                                "label": "M"
                                            },
                                            {
                                                "id": 8,
                                                "label": "B"
                                            },
                                            {
                                                "id": 11,
                                                "label": "ER"
                                            }
                                        ],
                                        "active": true,
                                        "dateAdded": 1684739501000,
                                        "dateModified": 1684739501000
                                    },
                                    "properNoun": false,
                                    "cliplistKeyword": false,
                                    "studiable": true,
                                    "idiom": false
                                }
                            ],
                            "dialogTitle": "Describing Roles"
                        }
                    ]
                },
                {
                    "type": "XQuizWord",
                    "modeId": 1,
                    "previouslyEncountered": false,
                    "word": {
                        "id": 28758,
                        "wordInstanceId": 44105,
                        "wordRootId": 15825,
                        "sharedMeaningId": 13959,
                        "wordFamilyId": 7078,
                        "wordDefinitionId": 12683,
                        "definition": "at a time following something",
                        "definitionEn": "at a time following something",
                        "label": "AFTER",
                        "wordRootLabel": "AFTER",
                        "pronunciationId": 20607,
                        "phonemes": "AE F T ER",
                        "example": "I exercise each day after work.",
                        "partOfSpeech": "preposition",
                        "baseForm": true,
                        "featured": false,
                        "excluded": false,
                        "adjectiveType": 0,
                        "nounType": 3,
                        "wordLanguage": "en",
                        "difficultyLevel": 1,
                        "cambridgeBand": 2,
                        "usageCount": 4470,
                        "audioURL": "https://cdna.qaenglishcentral.com/words/a/after_236296_20230314035022.mp3",
                        "wordAdapter": {
                            "id": 44105,
                            "wordId": 28758,
                            "wordHeadId": 36562,
                            "wordRootId": 400358,
                            "wordInstanceId": 349556,
                            "wordUsageCount": 0,
                            "headUsageCount": 4587,
                            "rootUsageCount": 4389,
                            "instanceUsageCount": 4389,
                            "sharedMeaningId": 13959,
                            "wordFamilyId": null,
                            "headPick": true,
                            "rootPick": true
                        },
                        "canonicalDialogLineId": 95676,
                        "pronunciation": {
                            "id": 20607,
                            "phonemes": "AE F T ER",
                            "assetId": 5727813,
                            "syllableCount": 2,
                            "phones": [
                                {
                                    "id": 34,
                                    "label": "AE"
                                },
                                {
                                    "id": 3,
                                    "label": "F"
                                },
                                {
                                    "id": 38,
                                    "label": "T"
                                },
                                {
                                    "id": 11,
                                    "label": "ER"
                                }
                            ],
                            "active": true,
                            "dateAdded": 1684739687000,
                            "dateModified": 1684739687000
                        },
                        "properNoun": false,
                        "cliplistKeyword": false,
                        "studiable": true,
                        "idiom": false
                    },
                    "distractors": [
                        {
                            "id": 32043,
                            "wordInstanceId": 812,
                            "wordRootId": 812,
                            "sharedMeaningId": 15766,
                            "wordFamilyId": 221,
                            "wordDefinitionId": 14337,
                            "definition": "in the direction of somebody or something",
                            "definitionEn": "in the direction of somebody or something",
                            "label": "AT",
                            "wordRootLabel": "AT",
                            "pronunciationId": 438,
                            "phonemes": "AE T",
                            "example": "The girl is pointing at the doll.",
                            "partOfSpeech": "preposition",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 2,
                            "cambridgeBand": 1,
                            "usageCount": 9,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/a/at_5906_2046.mp3",
                            "wordAdapter": {
                                "id": 49055,
                                "wordId": 32043,
                                "wordHeadId": 36634,
                                "wordRootId": 401096,
                                "wordInstanceId": 325366,
                                "wordUsageCount": 0,
                                "headUsageCount": 11853,
                                "rootUsageCount": 8,
                                "instanceUsageCount": 8,
                                "sharedMeaningId": 15766,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 198979,
                            "pronunciation": {
                                "id": 438,
                                "phonemes": "AE T",
                                "label": "at",
                                "assetId": 2046,
                                "syllableCount": 1,
                                "phones": [
                                    {
                                        "id": 34,
                                        "label": "AE"
                                    },
                                    {
                                        "id": 38,
                                        "label": "T"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739140000,
                                "dateModified": 1684739140000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 37920,
                            "wordInstanceId": 45085,
                            "wordRootId": 45085,
                            "sharedMeaningId": 18864,
                            "wordFamilyId": 7232,
                            "wordDefinitionId": 17279,
                            "definition": "shows a starting or central point of a movement",
                            "definitionEn": "shows a starting or central point of a movement",
                            "label": "FROM",
                            "wordRootLabel": "FROM",
                            "pronunciationId": 81515,
                            "phonemes": "F R AH M",
                            "example": "He boarded a train running west from Chicago.",
                            "partOfSpeech": "preposition",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 1,
                            "cambridgeBand": 1,
                            "usageCount": 225,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/f/from_43157_20230718123515.mp3",
                            "wordAdapter": {
                                "id": 155424,
                                "wordId": 37920,
                                "wordHeadId": 36515,
                                "wordRootId": 407092,
                                "wordInstanceId": 42014,
                                "wordUsageCount": 0,
                                "headUsageCount": 12721,
                                "rootUsageCount": 189,
                                "instanceUsageCount": 158,
                                "sharedMeaningId": 18864,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 258334,
                            "pronunciation": {
                                "id": 81515,
                                "phonemes": "F R AH M",
                                "label": "FROM",
                                "assetId": 5842718,
                                "syllableCount": 1,
                                "phones": [
                                    {
                                        "id": 3,
                                        "label": "F"
                                    },
                                    {
                                        "id": 19,
                                        "label": "R"
                                    },
                                    {
                                        "id": 29,
                                        "label": "AH"
                                    },
                                    {
                                        "id": 31,
                                        "label": "M"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1688994325000,
                                "dateModified": 1689683716000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 40475,
                            "wordInstanceId": 10461,
                            "wordRootId": 25207,
                            "sharedMeaningId": 20276,
                            "wordFamilyId": 3955,
                            "wordDefinitionId": 18580,
                            "definition": "toward a place or condition",
                            "definitionEn": "toward a place or condition",
                            "label": "INTO",
                            "wordRootLabel": "INTO",
                            "pronunciationId": 4789,
                            "phonemes": "IH N T UW",
                            "example": "Let's get into the house before it rains.",
                            "partOfSpeech": "preposition",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 1,
                            "cambridgeBand": 2,
                            "usageCount": 0,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/i/into_58049_2342.mp3",
                            "wordAdapter": {
                                "id": 63027,
                                "wordId": 40475,
                                "wordHeadId": 36517,
                                "wordRootId": 409014,
                                "wordInstanceId": 317950,
                                "wordUsageCount": 0,
                                "headUsageCount": 4038,
                                "rootUsageCount": 0,
                                "instanceUsageCount": 0,
                                "sharedMeaningId": 20276,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": true
                            },
                            "pronunciation": {
                                "id": 4789,
                                "phonemes": "IH N T UW",
                                "assetId": 2342,
                                "syllableCount": 2,
                                "phones": [
                                    {
                                        "id": 36,
                                        "label": "IH"
                                    },
                                    {
                                        "id": 9,
                                        "label": "N"
                                    },
                                    {
                                        "id": 38,
                                        "label": "T"
                                    },
                                    {
                                        "id": 24,
                                        "label": "UW"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739235000,
                                "dateModified": 1684739235000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        }
                    ],
                    "examples": [
                        {
                            "id": 95676,
                            "dialogId": 10702,
                            "sequence": 26,
                            "characterId": 885,
                            "transcript": "Please repeat after me.",
                            "videoURL": "https://cdna.qaenglishcentral.com/dialogs/10702/lineclip_10702_95676_122550_20130109161449.mp4",
                            "thumbnailURL": "https://cdna.qaenglishcentral.com/dialogs/10702/linethumb_10702_95676_122550_20130109161449.jpg",
                            "cueStart": 122550,
                            "cueEnd": 123900,
                            "slowSpeakStart": 184100,
                            "slowSpeakEnd": 186100,
                            "autoPause": false,
                            "pointsMax": 19,
                            "wordDetails": [
                                {
                                    "id": 28758,
                                    "wordInstanceId": 44105,
                                    "wordRootId": 15825,
                                    "sharedMeaningId": 13959,
                                    "wordFamilyId": 7078,
                                    "wordDefinitionId": 12683,
                                    "definition": "at a time following something",
                                    "definitionEn": "at a time following something",
                                    "label": "AFTER",
                                    "wordRootLabel": "AFTER",
                                    "pronunciationId": 20607,
                                    "phonemes": "AE F T ER",
                                    "example": "I exercise each day after work.",
                                    "partOfSpeech": "preposition",
                                    "baseForm": true,
                                    "featured": false,
                                    "excluded": false,
                                    "sequence": 3,
                                    "adjectiveType": 0,
                                    "nounType": 3,
                                    "wordLanguage": "en",
                                    "difficultyLevel": 1,
                                    "cambridgeBand": 2,
                                    "usageCount": 4470,
                                    "audioURL": "https://cdna.qaenglishcentral.com/words/a/after_236296_20230314035022.mp3",
                                    "wordAdapter": {
                                        "id": 44105,
                                        "wordId": 28758,
                                        "wordHeadId": 36562,
                                        "wordRootId": 400358,
                                        "wordInstanceId": 349556,
                                        "wordUsageCount": 0,
                                        "headUsageCount": 4587,
                                        "rootUsageCount": 4389,
                                        "instanceUsageCount": 4389,
                                        "sharedMeaningId": 13959,
                                        "wordFamilyId": null,
                                        "headPick": true,
                                        "rootPick": true
                                    },
                                    "canonicalDialogLineId": 95676,
                                    "pronunciation": {
                                        "id": 20607,
                                        "phonemes": "AE F T ER",
                                        "assetId": 5727813,
                                        "syllableCount": 2,
                                        "phones": [
                                            {
                                                "id": 34,
                                                "label": "AE"
                                            },
                                            {
                                                "id": 3,
                                                "label": "F"
                                            },
                                            {
                                                "id": 38,
                                                "label": "T"
                                            },
                                            {
                                                "id": 11,
                                                "label": "ER"
                                            }
                                        ],
                                        "active": true,
                                        "dateAdded": 1684739687000,
                                        "dateModified": 1684739687000
                                    },
                                    "properNoun": false,
                                    "cliplistKeyword": false,
                                    "studiable": true,
                                    "idiom": false
                                }
                            ],
                            "dialogTitle": "Don't Sound Too Jealous"
                        }
                    ]
                },
                {
                    "type": "XQuizWord",
                    "modeId": 1,
                    "previouslyEncountered": false,
                    "word": {
                        "id": 38741,
                        "wordInstanceId": 60176,
                        "wordRootId": 37797,
                        "sharedMeaningId": 19345,
                        "wordFamilyId": 6063,
                        "wordDefinitionId": 17721,
                        "definition": "a device that uses power to work",
                        "definitionEn": "a device that uses power to work",
                        "label": "MACHINE",
                        "wordRootLabel": "MACHINE",
                        "pronunciationId": 25875,
                        "phonemes": "M AH SH IY N",
                        "example": "Machines can usually complete tasks much more efficiently than humans. ",
                        "partOfSpeech": "noun",
                        "baseForm": true,
                        "featured": false,
                        "excluded": false,
                        "adjectiveType": 0,
                        "nounType": 3,
                        "wordLanguage": "en",
                        "difficultyLevel": 3,
                        "cambridgeBand": 17,
                        "usageCount": 532,
                        "audioURL": "https://cdna.qaenglishcentral.com/words/m/machine_69994_2409.mp3",
                        "wordAdapter": {
                            "id": 60176,
                            "wordId": 38741,
                            "wordHeadId": 885,
                            "wordRootId": 410084,
                            "wordInstanceId": 40909,
                            "wordUsageCount": 0,
                            "headUsageCount": 624,
                            "rootUsageCount": 512,
                            "instanceUsageCount": 295,
                            "sharedMeaningId": 19345,
                            "wordFamilyId": null,
                            "headPick": true,
                            "rootPick": true
                        },
                        "canonicalDialogLineId": 208711,
                        "pronunciation": {
                            "id": 25875,
                            "phonemes": "M AH SH IY N",
                            "assetId": 2409,
                            "syllableCount": 2,
                            "phones": [
                                {
                                    "id": 31,
                                    "label": "M"
                                },
                                {
                                    "id": 29,
                                    "label": "AH"
                                },
                                {
                                    "id": 20,
                                    "label": "SH"
                                },
                                {
                                    "id": 1,
                                    "label": "IY"
                                },
                                {
                                    "id": 9,
                                    "label": "N"
                                }
                            ],
                            "active": true,
                            "dateAdded": 1684739960000,
                            "dateModified": 1684739960000
                        },
                        "properNoun": false,
                        "cliplistKeyword": false,
                        "studiable": true,
                        "idiom": false
                    },
                    "distractors": [
                        {
                            "id": 3237,
                            "wordInstanceId": 5775,
                            "wordRootId": 5775,
                            "sharedMeaningId": 1398,
                            "wordFamilyId": 907,
                            "wordDefinitionId": 1312,
                            "definition": "information or skill from experience or education",
                            "definitionEn": "information or skill from experience or education",
                            "label": "KNOWLEDGE",
                            "wordRootLabel": "KNOWLEDGE",
                            "pronunciationId": 2407,
                            "phonemes": "N AA L AH JH",
                            "example": "The professor had gained his knowledge through years of schooling. ",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 4,
                            "cambridgeBand": 13,
                            "usageCount": 249,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/k/knowledge_62984_9106.mp3",
                            "wordAdapter": {
                                "id": 5776,
                                "wordId": 3237,
                                "wordHeadId": 792,
                                "wordRootId": 409399,
                                "wordInstanceId": 60735,
                                "wordUsageCount": 0,
                                "headUsageCount": 271,
                                "rootUsageCount": 245,
                                "instanceUsageCount": 243,
                                "sharedMeaningId": 1398,
                                "wordFamilyId": null,
                                "headPick": true,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 100378,
                            "pronunciation": {
                                "id": 2407,
                                "phonemes": "N AA L AH JH",
                                "assetId": 9106,
                                "syllableCount": 2,
                                "phones": [
                                    {
                                        "id": 9,
                                        "label": "N"
                                    },
                                    {
                                        "id": 5,
                                        "label": "AA"
                                    },
                                    {
                                        "id": 12,
                                        "label": "L"
                                    },
                                    {
                                        "id": 29,
                                        "label": "AH"
                                    },
                                    {
                                        "id": 22,
                                        "label": "JH"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739183000,
                                "dateModified": 1684739183000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 16174,
                            "wordInstanceId": 26190,
                            "wordRootId": 26190,
                            "sharedMeaningId": 7027,
                            "wordFamilyId": 4090,
                            "wordDefinitionId": 6430,
                            "definition": "to meet people who might be useful to know",
                            "definitionEn": "to meet people who are useful to know",
                            "label": "NETWORK",
                            "wordRootLabel": "NETWORK",
                            "pronunciationId": 11929,
                            "phonemes": "N EH T W ER K",
                            "example": "You have to network if you want to get a good job",
                            "partOfSpeech": "verb",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 6,
                            "cambridgeBand": 17,
                            "usageCount": 41,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/n/network_80107_5081.mp3",
                            "wordAdapter": {
                                "id": 26190,
                                "wordId": 16174,
                                "wordHeadId": 809,
                                "wordRootId": 411177,
                                "wordInstanceId": 288978,
                                "wordUsageCount": 0,
                                "headUsageCount": 335,
                                "rootUsageCount": 41,
                                "instanceUsageCount": 6,
                                "sharedMeaningId": 7027,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": false
                            },
                            "canonicalDialogLineId": 27656,
                            "pronunciation": {
                                "id": 11929,
                                "phonemes": "N EH T W ER K",
                                "assetId": 5081,
                                "syllableCount": 2,
                                "phones": [
                                    {
                                        "id": 9,
                                        "label": "N"
                                    },
                                    {
                                        "id": 18,
                                        "label": "EH"
                                    },
                                    {
                                        "id": 38,
                                        "label": "T"
                                    },
                                    {
                                        "id": 4,
                                        "label": "W"
                                    },
                                    {
                                        "id": 11,
                                        "label": "ER"
                                    },
                                    {
                                        "id": 30,
                                        "label": "K"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739424000,
                                "dateModified": 1684739424000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 32712,
                            "wordInstanceId": 50054,
                            "wordRootId": 50054,
                            "sharedMeaningId": 16126,
                            "wordFamilyId": 7975,
                            "wordDefinitionId": 14660,
                            "definition": "a period of time",
                            "definitionEn": "a period of time",
                            "label": "WHILE",
                            "wordRootLabel": "WHILE",
                            "pronunciationId": 23015,
                            "phonemes": "W AY L",
                            "example": "he was here for a little while",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 4,
                            "cambridgeBand": 4,
                            "usageCount": 122,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/w/while_125291_3937.mp3",
                            "wordAdapter": {
                                "id": 50055,
                                "wordId": 32712,
                                "wordHeadId": 57,
                                "wordRootId": 418855,
                                "wordInstanceId": 40931,
                                "wordUsageCount": 0,
                                "headUsageCount": 1949,
                                "rootUsageCount": 121,
                                "instanceUsageCount": 120,
                                "sharedMeaningId": 16126,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 176903,
                            "pronunciation": {
                                "id": 23015,
                                "phonemes": "W AY L",
                                "assetId": 3937,
                                "syllableCount": 1,
                                "phones": [
                                    {
                                        "id": 4,
                                        "label": "W"
                                    },
                                    {
                                        "id": 35,
                                        "label": "AY"
                                    },
                                    {
                                        "id": 12,
                                        "label": "L"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739783000,
                                "dateModified": 1684739783000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        }
                    ],
                    "examples": [
                        {
                            "id": 208711,
                            "dialogId": 20345,
                            "sequence": 5,
                            "transcript": "It's a machine like an iron, but better.",
                            "videoURL": "https://cdna.qaenglishcentral.com/dialogs/20345/lineclip_20345_208711_14182_20130528111813.mp4",
                            "thumbnailURL": "https://cdna.qaenglishcentral.com/dialogs/20345/linethumb_20345_208711_14182_20130528111813.jpg",
                            "cueStart": 14182,
                            "cueEnd": 17311,
                            "slowSpeakStart": 21423,
                            "slowSpeakEnd": 26191,
                            "autoPause": false,
                            "pointsMax": 33,
                            "wordDetails": [
                                {
                                    "id": 38741,
                                    "wordInstanceId": 60176,
                                    "wordRootId": 37797,
                                    "sharedMeaningId": 19345,
                                    "wordFamilyId": 6063,
                                    "wordDefinitionId": 17721,
                                    "definition": "a device that uses power to work",
                                    "definitionEn": "a device that uses power to work",
                                    "label": "MACHINE",
                                    "wordRootLabel": "MACHINE",
                                    "pronunciationId": 25875,
                                    "phonemes": "M AH SH IY N",
                                    "example": "Machines can usually complete tasks much more efficiently than humans. ",
                                    "partOfSpeech": "noun",
                                    "baseForm": true,
                                    "featured": false,
                                    "excluded": false,
                                    "sequence": 3,
                                    "adjectiveType": 0,
                                    "nounType": 3,
                                    "wordLanguage": "en",
                                    "difficultyLevel": 3,
                                    "cambridgeBand": 17,
                                    "usageCount": 532,
                                    "audioURL": "https://cdna.qaenglishcentral.com/words/m/machine_69994_2409.mp3",
                                    "wordAdapter": {
                                        "id": 60176,
                                        "wordId": 38741,
                                        "wordHeadId": 885,
                                        "wordRootId": 410084,
                                        "wordInstanceId": 40909,
                                        "wordUsageCount": 0,
                                        "headUsageCount": 624,
                                        "rootUsageCount": 512,
                                        "instanceUsageCount": 295,
                                        "sharedMeaningId": 19345,
                                        "wordFamilyId": null,
                                        "headPick": true,
                                        "rootPick": true
                                    },
                                    "canonicalDialogLineId": 208711,
                                    "pronunciation": {
                                        "id": 25875,
                                        "phonemes": "M AH SH IY N",
                                        "assetId": 2409,
                                        "syllableCount": 2,
                                        "phones": [
                                            {
                                                "id": 31,
                                                "label": "M"
                                            },
                                            {
                                                "id": 29,
                                                "label": "AH"
                                            },
                                            {
                                                "id": 20,
                                                "label": "SH"
                                            },
                                            {
                                                "id": 1,
                                                "label": "IY"
                                            },
                                            {
                                                "id": 9,
                                                "label": "N"
                                            }
                                        ],
                                        "active": true,
                                        "dateAdded": 1684739960000,
                                        "dateModified": 1684739960000
                                    },
                                    "properNoun": false,
                                    "cliplistKeyword": false,
                                    "studiable": true,
                                    "idiom": false
                                }
                            ],
                            "dialogTitle": "A Promotional Campaign"
                        }
                    ]
                },
                {
                    "type": "XQuizWord",
                    "modeId": 1,
                    "previouslyEncountered": false,
                    "word": {
                        "id": 39059,
                        "wordInstanceId": 60714,
                        "wordRootId": 60714,
                        "sharedMeaningId": 19501,
                        "wordFamilyId": 9144,
                        "wordDefinitionId": 17867,
                        "definition": "an area of sand beside the sea",
                        "definitionEn": "an area of sand beside the sea",
                        "label": "BEACH",
                        "wordRootLabel": "BEACH",
                        "pronunciationId": 22876,
                        "phonemes": "B IY CH",
                        "example": "We can go play in the sand on the beach.",
                        "partOfSpeech": "noun",
                        "baseForm": true,
                        "featured": false,
                        "excluded": false,
                        "adjectiveType": 0,
                        "nounType": 3,
                        "wordLanguage": "en",
                        "difficultyLevel": 2,
                        "cambridgeBand": 26,
                        "usageCount": 481,
                        "audioURL": "https://cdna.qaenglishcentral.com/words/b/beach_8802_12054.mp3",
                        "wordAdapter": {
                            "id": 60714,
                            "wordId": 39059,
                            "wordHeadId": 641,
                            "wordRootId": 401500,
                            "wordInstanceId": 107230,
                            "wordUsageCount": 0,
                            "headUsageCount": 476,
                            "rootUsageCount": 468,
                            "instanceUsageCount": 352,
                            "sharedMeaningId": 19501,
                            "wordFamilyId": null,
                            "headPick": true,
                            "rootPick": true
                        },
                        "canonicalDialogLineId": 423299,
                        "pronunciation": {
                            "id": 22876,
                            "phonemes": "B IY CH",
                            "assetId": 12054,
                            "syllableCount": 1,
                            "phones": [
                                {
                                    "id": 8,
                                    "label": "B"
                                },
                                {
                                    "id": 1,
                                    "label": "IY"
                                },
                                {
                                    "id": 2,
                                    "label": "CH"
                                }
                            ],
                            "active": true,
                            "dateAdded": 1684739778000,
                            "dateModified": 1684739778000
                        },
                        "properNoun": false,
                        "cliplistKeyword": false,
                        "studiable": true,
                        "idiom": false
                    },
                    "distractors": [
                        {
                            "id": 56985,
                            "wordInstanceId": 410,
                            "wordRootId": 410,
                            "sharedMeaningId": 28684,
                            "wordFamilyId": 137,
                            "wordDefinitionId": 26403,
                            "definition": "the act of restricting your food intake",
                            "definitionEn": "the act of limiting food intake",
                            "label": "DIET",
                            "wordRootLabel": "DIET",
                            "pronunciationId": 254,
                            "phonemes": "D AY AH T",
                            "example": "I'm on a strict diet so that I can lose 10 pounds.",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 6,
                            "cambridgeBand": 40,
                            "usageCount": 44,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/d/diet_30285_6413.mp3",
                            "wordAdapter": {
                                "id": 93580,
                                "wordId": 56985,
                                "wordHeadId": 1922,
                                "wordRootId": 49994,
                                "wordInstanceId": 42219,
                                "wordUsageCount": 0,
                                "headUsageCount": 199,
                                "rootUsageCount": 44,
                                "instanceUsageCount": 35,
                                "sharedMeaningId": 28684,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 1237,
                            "pronunciation": {
                                "id": 254,
                                "phonemes": "D AY AH T",
                                "assetId": 6413,
                                "syllableCount": 2,
                                "phones": [
                                    {
                                        "id": 39,
                                        "label": "D"
                                    },
                                    {
                                        "id": 35,
                                        "label": "AY"
                                    },
                                    {
                                        "id": 29,
                                        "label": "AH"
                                    },
                                    {
                                        "id": 38,
                                        "label": "T"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739135000,
                                "dateModified": 1684739135000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 44594,
                            "wordInstanceId": 21307,
                            "wordRootId": 4235,
                            "sharedMeaningId": 22389,
                            "wordFamilyId": 706,
                            "wordDefinitionId": 20564,
                            "definition": "a fund of money put by as a reserve",
                            "definitionEn": "a fund of money put by as a reserve",
                            "label": "SAVINGS",
                            "wordRootLabel": "SAVE",
                            "pronunciationId": 9753,
                            "phonemes": "S EY V IH NG Z",
                            "example": "I used all my savings to buy a new car.",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 5,
                            "cambridgeBand": 13,
                            "usageCount": 49,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/s/savings_101547_5370.mp3",
                            "wordAdapter": {
                                "id": 70251,
                                "wordId": 44594,
                                "wordHeadId": 731,
                                "wordRootId": 154098,
                                "wordInstanceId": 51512,
                                "wordUsageCount": 0,
                                "headUsageCount": 977,
                                "rootUsageCount": 47,
                                "instanceUsageCount": 46,
                                "sharedMeaningId": 22389,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 1283,
                            "pronunciation": {
                                "id": 9753,
                                "phonemes": "S EY V IH NG Z",
                                "assetId": 5370,
                                "syllableCount": 2,
                                "phones": [
                                    {
                                        "id": 27,
                                        "label": "S"
                                    },
                                    {
                                        "id": 26,
                                        "label": "EY"
                                    },
                                    {
                                        "id": 21,
                                        "label": "V"
                                    },
                                    {
                                        "id": 36,
                                        "label": "IH"
                                    },
                                    {
                                        "id": 14,
                                        "label": "NG"
                                    },
                                    {
                                        "id": 13,
                                        "label": "Z"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739360000,
                                "dateModified": 1684739360000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 42257,
                            "wordInstanceId": 66226,
                            "wordRootId": 17675,
                            "sharedMeaningId": 21192,
                            "wordFamilyId": 2819,
                            "wordDefinitionId": 19447,
                            "definition": "a person in charge of a project or department",
                            "definitionEn": "a person in charge of a project or department",
                            "label": "MANAGER",
                            "wordRootLabel": "MANAGE",
                            "pronunciationId": 27798,
                            "phonemes": "M AE N AH JH ER",
                            "example": "He is the manager of the marketing staff. ",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 3,
                            "cambridgeBand": 14,
                            "usageCount": 412,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/m/manager_70930_7737.mp3",
                            "wordAdapter": {
                                "id": 66232,
                                "wordId": 42257,
                                "wordHeadId": 842,
                                "wordRootId": 316168,
                                "wordInstanceId": 283798,
                                "wordUsageCount": 0,
                                "headUsageCount": 897,
                                "rootUsageCount": 408,
                                "instanceUsageCount": 292,
                                "sharedMeaningId": 21192,
                                "wordFamilyId": null,
                                "headPick": true,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 6362,
                            "pronunciation": {
                                "id": 27798,
                                "phonemes": "M AE N AH JH ER",
                                "assetId": 7737,
                                "syllableCount": 3,
                                "phones": [
                                    {
                                        "id": 31,
                                        "label": "M"
                                    },
                                    {
                                        "id": 34,
                                        "label": "AE"
                                    },
                                    {
                                        "id": 9,
                                        "label": "N"
                                    },
                                    {
                                        "id": 29,
                                        "label": "AH"
                                    },
                                    {
                                        "id": 22,
                                        "label": "JH"
                                    },
                                    {
                                        "id": 11,
                                        "label": "ER"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684740074000,
                                "dateModified": 1684740074000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        }
                    ],
                    "examples": [
                        {
                            "id": 423299,
                            "dialogId": 30916,
                            "sequence": 0,
                            "transcript": "It's a sunny day at the beach.",
                            "videoURL": "https://cdna.qaenglishcentral.com/dialogs/30916/lineclip_30916_423299_10344_20180510093114.mp4",
                            "thumbnailURL": "https://cdna.qaenglishcentral.com/dialogs/30916/linethumb_30916_423299_10344_20180510093114.jpg",
                            "cueStart": 10344,
                            "cueEnd": 12205,
                            "slowSpeakStart": 15666,
                            "slowSpeakEnd": 18533,
                            "autoPause": false,
                            "pointsMax": 8,
                            "wordDetails": [
                                {
                                    "id": 39059,
                                    "wordInstanceId": 60714,
                                    "wordRootId": 60714,
                                    "sharedMeaningId": 19501,
                                    "wordFamilyId": 9144,
                                    "wordDefinitionId": 17867,
                                    "definition": "an area of sand beside the sea",
                                    "definitionEn": "an area of sand beside the sea",
                                    "label": "BEACH",
                                    "wordRootLabel": "BEACH",
                                    "pronunciationId": 22876,
                                    "phonemes": "B IY CH",
                                    "example": "We can go play in the sand on the beach.",
                                    "partOfSpeech": "noun",
                                    "baseForm": true,
                                    "featured": false,
                                    "excluded": false,
                                    "sequence": 7,
                                    "adjectiveType": 0,
                                    "nounType": 3,
                                    "wordLanguage": "en",
                                    "difficultyLevel": 2,
                                    "cambridgeBand": 26,
                                    "usageCount": 481,
                                    "audioURL": "https://cdna.qaenglishcentral.com/words/b/beach_8802_12054.mp3",
                                    "wordAdapter": {
                                        "id": 60714,
                                        "wordId": 39059,
                                        "wordHeadId": 641,
                                        "wordRootId": 401500,
                                        "wordInstanceId": 107230,
                                        "wordUsageCount": 0,
                                        "headUsageCount": 476,
                                        "rootUsageCount": 468,
                                        "instanceUsageCount": 352,
                                        "sharedMeaningId": 19501,
                                        "wordFamilyId": null,
                                        "headPick": true,
                                        "rootPick": true
                                    },
                                    "canonicalDialogLineId": 423299,
                                    "pronunciation": {
                                        "id": 22876,
                                        "phonemes": "B IY CH",
                                        "assetId": 12054,
                                        "syllableCount": 1,
                                        "phones": [
                                            {
                                                "id": 8,
                                                "label": "B"
                                            },
                                            {
                                                "id": 1,
                                                "label": "IY"
                                            },
                                            {
                                                "id": 2,
                                                "label": "CH"
                                            }
                                        ],
                                        "active": true,
                                        "dateAdded": 1684739778000,
                                        "dateModified": 1684739778000
                                    },
                                    "properNoun": false,
                                    "cliplistKeyword": false,
                                    "studiable": true,
                                    "idiom": false
                                }
                            ],
                            "dialogTitle": "Unit 3 Part 1"
                        }
                    ]
                },
                {
                    "type": "XQuizWord",
                    "modeId": 1,
                    "previouslyEncountered": false,
                    "word": {
                        "id": 40076,
                        "wordInstanceId": 62356,
                        "wordRootId": 62354,
                        "sharedMeaningId": 20050,
                        "wordFamilyId": 9349,
                        "wordDefinitionId": 18368,
                        "definition": "a large animal used for carrying things or riding",
                        "definitionEn": "a large animal used for riding",
                        "label": "HORSE",
                        "wordRootLabel": "HORSE",
                        "pronunciationId": 26523,
                        "phonemes": "HH AO R S",
                        "example": "Before machines, many farms used horses for work.",
                        "partOfSpeech": "noun",
                        "baseForm": true,
                        "featured": false,
                        "excluded": false,
                        "adjectiveType": 0,
                        "nounType": 3,
                        "wordLanguage": "en",
                        "difficultyLevel": 2,
                        "cambridgeBand": 24,
                        "usageCount": 362,
                        "audioURL": "https://cdna.qaenglishcentral.com/words/H/HOARSE_53184_500947.mp3",
                        "wordAdapter": {
                            "id": 62358,
                            "wordId": 40076,
                            "wordHeadId": 431,
                            "wordRootId": 408221,
                            "wordInstanceId": 82668,
                            "wordUsageCount": 0,
                            "headUsageCount": 363,
                            "rootUsageCount": 361,
                            "instanceUsageCount": 238,
                            "sharedMeaningId": 20050,
                            "wordFamilyId": null,
                            "headPick": true,
                            "rootPick": true
                        },
                        "canonicalDialogLineId": 431846,
                        "pronunciation": {
                            "id": 26523,
                            "phonemes": "HH AO R S",
                            "assetId": 500947,
                            "syllableCount": 1,
                            "phones": [
                                {
                                    "id": 6,
                                    "label": "HH"
                                },
                                {
                                    "id": 40,
                                    "label": "AO"
                                },
                                {
                                    "id": 19,
                                    "label": "R"
                                },
                                {
                                    "id": 27,
                                    "label": "S"
                                }
                            ],
                            "active": true,
                            "dateAdded": 1684739999000,
                            "dateModified": 1684739999000
                        },
                        "properNoun": false,
                        "cliplistKeyword": false,
                        "studiable": true,
                        "idiom": false
                    },
                    "distractors": [
                        {
                            "id": 16976,
                            "wordInstanceId": 27811,
                            "wordRootId": 27810,
                            "sharedMeaningId": 7358,
                            "wordFamilyId": 4240,
                            "wordDefinitionId": 6720,
                            "definition": "a country located in North America",
                            "definitionEn": "a country located in North America",
                            "label": "CANADA",
                            "wordRootLabel": "CANADA",
                            "pronunciationId": 12407,
                            "phonemes": "K AE N AH D AH",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 2,
                            "usageCount": 292,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/c/canada_16753_20837.mp3",
                            "wordAdapter": {
                                "id": 27811,
                                "wordId": 16976,
                                "wordHeadId": 39183,
                                "wordRootId": 281760,
                                "wordInstanceId": 116591,
                                "wordUsageCount": 0,
                                "headUsageCount": 363,
                                "rootUsageCount": 286,
                                "instanceUsageCount": 271,
                                "sharedMeaningId": 7358,
                                "wordFamilyId": null,
                                "headPick": true,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 49541,
                            "pronunciation": {
                                "id": 12407,
                                "phonemes": "K AE N AH D AH",
                                "assetId": 20837,
                                "syllableCount": 3,
                                "phones": [
                                    {
                                        "id": 30,
                                        "label": "K"
                                    },
                                    {
                                        "id": 34,
                                        "label": "AE"
                                    },
                                    {
                                        "id": 9,
                                        "label": "N"
                                    },
                                    {
                                        "id": 29,
                                        "label": "AH"
                                    },
                                    {
                                        "id": 39,
                                        "label": "D"
                                    },
                                    {
                                        "id": 29,
                                        "label": "AH"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739441000,
                                "dateModified": 1684739441000
                            },
                            "properNoun": true,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 69663,
                            "wordInstanceId": 28196,
                            "wordRootId": 3052,
                            "sharedMeaningId": 36234,
                            "wordFamilyId": 559,
                            "wordDefinitionId": 33054,
                            "definition": "a relationship between things, people or events",
                            "definitionEn": "a relationship between things",
                            "label": "CONNECTION",
                            "wordRootLabel": "CONNECT",
                            "pronunciationId": 12566,
                            "phonemes": "K AH N EH K SH AH N",
                            "example": "there was a connection between eating that pickle and having that nightmare",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 4,
                            "cambridgeBand": 28,
                            "usageCount": 149,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/c/connection_23035_10155.mp3",
                            "wordAdapter": {
                                "id": 111448,
                                "wordId": 69663,
                                "wordHeadId": 1451,
                                "wordRootId": 38234,
                                "wordInstanceId": 123633,
                                "wordUsageCount": 0,
                                "headUsageCount": 785,
                                "rootUsageCount": 145,
                                "instanceUsageCount": 102,
                                "sharedMeaningId": 36234,
                                "wordFamilyId": null,
                                "headPick": true,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 12429,
                            "pronunciation": {
                                "id": 12566,
                                "phonemes": "K AH N EH K SH AH N",
                                "assetId": 10155,
                                "syllableCount": 3,
                                "phones": [
                                    {
                                        "id": 30,
                                        "label": "K"
                                    },
                                    {
                                        "id": 29,
                                        "label": "AH"
                                    },
                                    {
                                        "id": 9,
                                        "label": "N"
                                    },
                                    {
                                        "id": 18,
                                        "label": "EH"
                                    },
                                    {
                                        "id": 30,
                                        "label": "K"
                                    },
                                    {
                                        "id": 20,
                                        "label": "SH"
                                    },
                                    {
                                        "id": 29,
                                        "label": "AH"
                                    },
                                    {
                                        "id": 9,
                                        "label": "N"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739445000,
                                "dateModified": 1684739445000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 31936,
                            "wordInstanceId": 33194,
                            "wordRootId": 33194,
                            "sharedMeaningId": 15708,
                            "wordFamilyId": 5249,
                            "wordDefinitionId": 14286,
                            "definition": "a place where alcoholic drinks are sold",
                            "definitionEn": "a place where alcoholic drinks are sold",
                            "label": "BAR",
                            "wordRootLabel": "BAR",
                            "pronunciationId": 15285,
                            "phonemes": "B AA R",
                            "example": "he drowned his sorrows in whiskey at the bar",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 3,
                            "cambridgeBand": 18,
                            "usageCount": 183,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/b/bar_7823_9406.mp3",
                            "wordAdapter": {
                                "id": 48892,
                                "wordId": 31936,
                                "wordHeadId": 545,
                                "wordRootId": 401396,
                                "wordInstanceId": 61688,
                                "wordUsageCount": 0,
                                "headUsageCount": 311,
                                "rootUsageCount": 176,
                                "instanceUsageCount": 134,
                                "sharedMeaningId": 15708,
                                "wordFamilyId": null,
                                "headPick": true,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 136456,
                            "pronunciation": {
                                "id": 15285,
                                "phonemes": "B AA R",
                                "assetId": 9406,
                                "syllableCount": 1,
                                "phones": [
                                    {
                                        "id": 8,
                                        "label": "B"
                                    },
                                    {
                                        "id": 5,
                                        "label": "AA"
                                    },
                                    {
                                        "id": 19,
                                        "label": "R"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739518000,
                                "dateModified": 1684739518000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        }
                    ],
                    "examples": [
                        {
                            "id": 431846,
                            "dialogId": 31357,
                            "sequence": 0,
                            "transcript": "The horse runs fast.",
                            "videoURL": "https://cdna.qaenglishcentral.com/dialogs/31357/lineclip_31357_431846_5135_20180830092634.mp4",
                            "thumbnailURL": "https://cdna.qaenglishcentral.com/dialogs/31357/linethumb_31357_431846_5135_20180830092634.jpg",
                            "cueStart": 5135,
                            "cueEnd": 6987,
                            "slowSpeakStart": 7852,
                            "slowSpeakEnd": 10705,
                            "autoPause": false,
                            "pointsMax": 4,
                            "wordDetails": [
                                {
                                    "id": 40076,
                                    "wordInstanceId": 62356,
                                    "wordRootId": 62354,
                                    "sharedMeaningId": 20050,
                                    "wordFamilyId": 9349,
                                    "wordDefinitionId": 18368,
                                    "definition": "a large animal used for carrying things or riding",
                                    "definitionEn": "a large animal used for carrying things or riding",
                                    "label": "HORSE",
                                    "wordRootLabel": "HORSE",
                                    "pronunciationId": 26523,
                                    "phonemes": "HH AO R S",
                                    "example": "Before machines, many farms used horses for work.",
                                    "partOfSpeech": "noun",
                                    "baseForm": true,
                                    "featured": false,
                                    "excluded": false,
                                    "sequence": 2,
                                    "adjectiveType": 0,
                                    "nounType": 3,
                                    "wordLanguage": "en",
                                    "difficultyLevel": 2,
                                    "cambridgeBand": 24,
                                    "usageCount": 362,
                                    "audioURL": "https://cdna.qaenglishcentral.com/words/H/HOARSE_53184_500947.mp3",
                                    "wordAdapter": {
                                        "id": 62358,
                                        "wordId": 40076,
                                        "wordHeadId": 431,
                                        "wordRootId": 408221,
                                        "wordInstanceId": 82668,
                                        "wordUsageCount": 0,
                                        "headUsageCount": 363,
                                        "rootUsageCount": 361,
                                        "instanceUsageCount": 238,
                                        "sharedMeaningId": 20050,
                                        "wordFamilyId": null,
                                        "headPick": true,
                                        "rootPick": true
                                    },
                                    "canonicalDialogLineId": 431846,
                                    "pronunciation": {
                                        "id": 26523,
                                        "phonemes": "HH AO R S",
                                        "assetId": 500947,
                                        "syllableCount": 1,
                                        "phones": [
                                            {
                                                "id": 6,
                                                "label": "HH"
                                            },
                                            {
                                                "id": 40,
                                                "label": "AO"
                                            },
                                            {
                                                "id": 19,
                                                "label": "R"
                                            },
                                            {
                                                "id": 27,
                                                "label": "S"
                                            }
                                        ],
                                        "active": true,
                                        "dateAdded": 1684739999000,
                                        "dateModified": 1684739999000
                                    },
                                    "properNoun": false,
                                    "cliplistKeyword": false,
                                    "studiable": true,
                                    "idiom": false
                                }
                            ],
                            "dialogTitle": "More Adverbs"
                        }
                    ]
                },
                {
                    "type": "XQuizWord",
                    "modeId": 1,
                    "previouslyEncountered": false,
                    "word": {
                        "id": 40527,
                        "wordInstanceId": 21837,
                        "wordRootId": 14320,
                        "sharedMeaningId": 20301,
                        "wordFamilyId": 2246,
                        "wordDefinitionId": 18604,
                        "definition": "a series of meetings where students are taught a subject",
                        "definitionEn": "a series of meetings to teach a subject",
                        "label": "CLASS",
                        "wordRootLabel": "CLASS",
                        "pronunciationId": 9979,
                        "phonemes": "K L AE S",
                        "example": "My teacher asked me to open a frog's body during Science class. ",
                        "partOfSpeech": "noun",
                        "baseForm": true,
                        "featured": false,
                        "excluded": false,
                        "adjectiveType": 0,
                        "nounType": 3,
                        "wordLanguage": "en",
                        "difficultyLevel": 1,
                        "cambridgeBand": 8,
                        "usageCount": 512,
                        "audioURL": "https://cdna.qaenglishcentral.com/words/c/class_20704_2116.mp3",
                        "wordAdapter": {
                            "id": 63106,
                            "wordId": 40527,
                            "wordHeadId": 258,
                            "wordRootId": 32447,
                            "wordInstanceId": 139584,
                            "wordUsageCount": 0,
                            "headUsageCount": 1126,
                            "rootUsageCount": 502,
                            "instanceUsageCount": 292,
                            "sharedMeaningId": 20301,
                            "wordFamilyId": null,
                            "headPick": false,
                            "rootPick": true
                        },
                        "canonicalDialogLineId": 54523,
                        "pronunciation": {
                            "id": 9979,
                            "phonemes": "K L AE S",
                            "assetId": 2116,
                            "syllableCount": 1,
                            "phones": [
                                {
                                    "id": 30,
                                    "label": "K"
                                },
                                {
                                    "id": 12,
                                    "label": "L"
                                },
                                {
                                    "id": 34,
                                    "label": "AE"
                                },
                                {
                                    "id": 27,
                                    "label": "S"
                                }
                            ],
                            "active": true,
                            "dateAdded": 1684739367000,
                            "dateModified": 1684739367000
                        },
                        "properNoun": false,
                        "cliplistKeyword": false,
                        "studiable": true,
                        "idiom": false
                    },
                    "distractors": [
                        {
                            "id": 29448,
                            "wordInstanceId": 45217,
                            "wordRootId": 45217,
                            "sharedMeaningId": 14340,
                            "wordFamilyId": 7253,
                            "wordDefinitionId": 13037,
                            "definition": "a period of ten years",
                            "definitionEn": "a period of ten years",
                            "label": "DECADE",
                            "wordRootLabel": "DECADE",
                            "pronunciationId": 21018,
                            "phonemes": "D EH K EY D",
                            "example": "The couple dated for a decade before they were married.",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 5,
                            "cambridgeBand": 23,
                            "usageCount": 397,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/d/decade_27636_14948.mp3",
                            "wordAdapter": {
                                "id": 45217,
                                "wordId": 29448,
                                "wordHeadId": 727,
                                "wordRootId": 404371,
                                "wordInstanceId": 64290,
                                "wordUsageCount": 0,
                                "headUsageCount": 388,
                                "rootUsageCount": 381,
                                "instanceUsageCount": 156,
                                "sharedMeaningId": 14340,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": false
                            },
                            "canonicalDialogLineId": 419076,
                            "pronunciation": {
                                "id": 21018,
                                "phonemes": "D EH K EY D",
                                "assetId": 14948,
                                "syllableCount": 2,
                                "phones": [
                                    {
                                        "id": 39,
                                        "label": "D"
                                    },
                                    {
                                        "id": 18,
                                        "label": "EH"
                                    },
                                    {
                                        "id": 30,
                                        "label": "K"
                                    },
                                    {
                                        "id": 26,
                                        "label": "EY"
                                    },
                                    {
                                        "id": 39,
                                        "label": "D"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739705000,
                                "dateModified": 1684739705000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 42136,
                            "wordInstanceId": 65914,
                            "wordRootId": 33284,
                            "sharedMeaningId": 21137,
                            "wordFamilyId": 5277,
                            "wordDefinitionId": 4359,
                            "definition": "a building where products are made",
                            "definitionEn": "a building where products are made",
                            "label": "FACTORY",
                            "wordRootLabel": "FACTORY",
                            "pronunciationId": 27755,
                            "phonemes": "F AE K T ER IY",
                            "example": "The shoe factory can produce 2,000 pairs per day. ",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 1,
                            "cambridgeBand": 33,
                            "usageCount": 241,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/f/factory_38726_3038.mp3",
                            "wordAdapter": {
                                "id": 65914,
                                "wordId": 42136,
                                "wordHeadId": 1033,
                                "wordRootId": 406271,
                                "wordInstanceId": 50950,
                                "wordUsageCount": 0,
                                "headUsageCount": 238,
                                "rootUsageCount": 236,
                                "instanceUsageCount": 172,
                                "sharedMeaningId": 21137,
                                "wordFamilyId": null,
                                "headPick": true,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 312617,
                            "pronunciation": {
                                "id": 27755,
                                "phonemes": "F AE K T ER IY",
                                "assetId": 3038,
                                "syllableCount": 3,
                                "phones": [
                                    {
                                        "id": 3,
                                        "label": "F"
                                    },
                                    {
                                        "id": 34,
                                        "label": "AE"
                                    },
                                    {
                                        "id": 30,
                                        "label": "K"
                                    },
                                    {
                                        "id": 38,
                                        "label": "T"
                                    },
                                    {
                                        "id": 11,
                                        "label": "ER"
                                    },
                                    {
                                        "id": 1,
                                        "label": "IY"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684740068000,
                                "dateModified": 1684740068000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 19471,
                            "wordInstanceId": 31398,
                            "wordRootId": 31397,
                            "sharedMeaningId": 8736,
                            "wordFamilyId": 4897,
                            "wordDefinitionId": 7958,
                            "definition": "a room with a sink, toilet and shower",
                            "definitionEn": "a room with a sink, toilet and shower",
                            "label": "BATHROOM",
                            "wordRootLabel": "BATHROOM",
                            "pronunciationId": 14271,
                            "phonemes": "B AE TH R UW M",
                            "example": "If you want to take a shower or wash your hands, go to the bathroom.",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 2,
                            "usageCount": 122,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/b/bathroom_8534_7559.mp3",
                            "wordAdapter": {
                                "id": 31398,
                                "wordId": 19471,
                                "wordHeadId": 2023,
                                "wordRootId": 401473,
                                "wordInstanceId": 54283,
                                "wordUsageCount": 0,
                                "headUsageCount": 118,
                                "rootUsageCount": 118,
                                "instanceUsageCount": 102,
                                "sharedMeaningId": 8736,
                                "wordFamilyId": null,
                                "headPick": true,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 322030,
                            "pronunciation": {
                                "id": 14271,
                                "phonemes": "B AE TH R UW M",
                                "assetId": 7559,
                                "syllableCount": 2,
                                "phones": [
                                    {
                                        "id": 8,
                                        "label": "B"
                                    },
                                    {
                                        "id": 34,
                                        "label": "AE"
                                    },
                                    {
                                        "id": 33,
                                        "label": "TH"
                                    },
                                    {
                                        "id": 19,
                                        "label": "R"
                                    },
                                    {
                                        "id": 24,
                                        "label": "UW"
                                    },
                                    {
                                        "id": 31,
                                        "label": "M"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739490000,
                                "dateModified": 1684739490000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        }
                    ],
                    "examples": [
                        {
                            "id": 54523,
                            "dialogId": 12686,
                            "sequence": 5,
                            "characterId": 1030,
                            "transcript": "I have an early class tomorrow morning.",
                            "videoURL": "https://cdna.qaenglishcentral.com/dialogs/12686/lineclip_12686_54523_10205_20140903135736.mp4",
                            "thumbnailURL": "https://cdna.qaenglishcentral.com/dialogs/12686/linethumb_12686_54523_10205_20140903135736.jpg",
                            "cueStart": 10205,
                            "cueEnd": 11793,
                            "slowSpeakStart": 15457,
                            "slowSpeakEnd": 17915,
                            "autoPause": false,
                            "pointsMax": 30,
                            "wordDetails": [
                                {
                                    "id": 40527,
                                    "wordInstanceId": 21837,
                                    "wordRootId": 14320,
                                    "sharedMeaningId": 20301,
                                    "wordFamilyId": 2246,
                                    "wordDefinitionId": 18604,
                                    "definition": "a series of meetings where students are taught a subject",
                                    "definitionEn": "a series of meetings where students are taught a subject",
                                    "label": "CLASS",
                                    "wordRootLabel": "CLASS",
                                    "pronunciationId": 9979,
                                    "phonemes": "K L AE S",
                                    "example": "My teacher asked me to open a frog's body during Science class. ",
                                    "partOfSpeech": "noun",
                                    "baseForm": true,
                                    "featured": false,
                                    "excluded": false,
                                    "sequence": 5,
                                    "adjectiveType": 0,
                                    "nounType": 3,
                                    "wordLanguage": "en",
                                    "difficultyLevel": 1,
                                    "cambridgeBand": 8,
                                    "usageCount": 512,
                                    "audioURL": "https://cdna.qaenglishcentral.com/words/c/class_20704_2116.mp3",
                                    "wordAdapter": {
                                        "id": 63106,
                                        "wordId": 40527,
                                        "wordHeadId": 258,
                                        "wordRootId": 32447,
                                        "wordInstanceId": 139584,
                                        "wordUsageCount": 0,
                                        "headUsageCount": 1126,
                                        "rootUsageCount": 502,
                                        "instanceUsageCount": 292,
                                        "sharedMeaningId": 20301,
                                        "wordFamilyId": null,
                                        "headPick": false,
                                        "rootPick": true
                                    },
                                    "canonicalDialogLineId": 54523,
                                    "pronunciation": {
                                        "id": 9979,
                                        "phonemes": "K L AE S",
                                        "assetId": 2116,
                                        "syllableCount": 1,
                                        "phones": [
                                            {
                                                "id": 30,
                                                "label": "K"
                                            },
                                            {
                                                "id": 12,
                                                "label": "L"
                                            },
                                            {
                                                "id": 34,
                                                "label": "AE"
                                            },
                                            {
                                                "id": 27,
                                                "label": "S"
                                            }
                                        ],
                                        "active": true,
                                        "dateAdded": 1684739367000,
                                        "dateModified": 1684739367000
                                    },
                                    "properNoun": false,
                                    "cliplistKeyword": false,
                                    "studiable": true,
                                    "idiom": false
                                }
                            ],
                            "dialogTitle": "My Bedtime"
                        }
                    ]
                },
                {
                    "type": "XQuizWord",
                    "modeId": 1,
                    "previouslyEncountered": false,
                    "word": {
                        "id": 42181,
                        "wordInstanceId": 12154,
                        "wordRootId": 8460,
                        "sharedMeaningId": 21155,
                        "wordFamilyId": 1265,
                        "wordDefinitionId": 19411,
                        "definition": "not dirty",
                        "definitionEn": "not dirty",
                        "label": "CLEAN",
                        "wordRootLabel": "CLEAN",
                        "pronunciationId": 5885,
                        "phonemes": "K L IY N",
                        "example": "After being washed, the old car looked nice and clean.",
                        "partOfSpeech": "adjective",
                        "baseForm": true,
                        "featured": false,
                        "excluded": false,
                        "adjectiveType": 0,
                        "nounType": 3,
                        "wordLanguage": "en",
                        "difficultyLevel": 2,
                        "cambridgeBand": 18,
                        "usageCount": 292,
                        "audioURL": "https://cdna.qaenglishcentral.com/words/c/clean_20797_2117.mp3",
                        "wordAdapter": {
                            "id": 66022,
                            "wordId": 42181,
                            "wordHeadId": 386,
                            "wordRootId": 402977,
                            "wordInstanceId": 58126,
                            "wordUsageCount": 0,
                            "headUsageCount": 839,
                            "rootUsageCount": 288,
                            "instanceUsageCount": 288,
                            "sharedMeaningId": 21155,
                            "wordFamilyId": null,
                            "headPick": true,
                            "rootPick": true
                        },
                        "canonicalDialogLineId": 532724,
                        "pronunciation": {
                            "id": 5885,
                            "phonemes": "K L IY N",
                            "assetId": 2117,
                            "syllableCount": 1,
                            "phones": [
                                {
                                    "id": 30,
                                    "label": "K"
                                },
                                {
                                    "id": 12,
                                    "label": "L"
                                },
                                {
                                    "id": 1,
                                    "label": "IY"
                                },
                                {
                                    "id": 9,
                                    "label": "N"
                                }
                            ],
                            "active": true,
                            "dateAdded": 1684739249000,
                            "dateModified": 1684739249000
                        },
                        "properNoun": false,
                        "cliplistKeyword": false,
                        "studiable": true,
                        "idiom": false
                    },
                    "distractors": [
                        {
                            "id": 33188,
                            "wordInstanceId": 50711,
                            "wordRootId": 17088,
                            "sharedMeaningId": 16408,
                            "wordFamilyId": 2733,
                            "wordDefinitionId": 14924,
                            "definition": "relating to the main parts of something",
                            "definitionEn": "relating to the main parts of something",
                            "label": "BROADEST",
                            "wordRootLabel": "BROAD",
                            "pronunciationId": 23320,
                            "phonemes": "B R AO D IH S T",
                            "example": "This chapter only gives a broad outline of the subject.",
                            "partOfSpeech": "adjective",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 5,
                            "cambridgeBand": 28,
                            "usageCount": 4,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/b/broadest_14315_14657.mp3",
                            "wordAdapter": {
                                "id": 50711,
                                "wordId": 33188,
                                "wordHeadId": 1369,
                                "wordRootId": 438530,
                                "wordInstanceId": 350911,
                                "wordUsageCount": 0,
                                "headUsageCount": 111,
                                "rootUsageCount": 3,
                                "instanceUsageCount": 3,
                                "sharedMeaningId": 16408,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": true
                            },
                            "pronunciation": {
                                "id": 23320,
                                "phonemes": "B R AO D IH S T",
                                "assetId": 14657,
                                "syllableCount": 2,
                                "phones": [
                                    {
                                        "id": 8,
                                        "label": "B"
                                    },
                                    {
                                        "id": 19,
                                        "label": "R"
                                    },
                                    {
                                        "id": 40,
                                        "label": "AO"
                                    },
                                    {
                                        "id": 39,
                                        "label": "D"
                                    },
                                    {
                                        "id": 36,
                                        "label": "IH"
                                    },
                                    {
                                        "id": 27,
                                        "label": "S"
                                    },
                                    {
                                        "id": 38,
                                        "label": "T"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739795000,
                                "dateModified": 1684739795000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 14309,
                            "wordInstanceId": 23064,
                            "wordRootId": 23064,
                            "sharedMeaningId": 6146,
                            "wordFamilyId": 3633,
                            "wordDefinitionId": 5625,
                            "definition": "not common or not happening often",
                            "definitionEn": "not common or not happening often",
                            "label": "RARE",
                            "wordRootLabel": "RARE",
                            "pronunciationId": 10629,
                            "phonemes": "R EH R",
                            "example": "rare herbs ",
                            "partOfSpeech": "adjective",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 4,
                            "cambridgeBand": 38,
                            "usageCount": 141,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/r/rare_93834_2524.mp3",
                            "wordAdapter": {
                                "id": 23064,
                                "wordId": 14309,
                                "wordHeadId": 29734,
                                "wordRootId": 413828,
                                "wordInstanceId": 1328,
                                "wordUsageCount": 0,
                                "headUsageCount": 234,
                                "rootUsageCount": 139,
                                "instanceUsageCount": 132,
                                "sharedMeaningId": 6146,
                                "wordFamilyId": null,
                                "headPick": true,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 426556,
                            "pronunciation": {
                                "id": 10629,
                                "phonemes": "R EH R",
                                "assetId": 2524,
                                "syllableCount": 1,
                                "phones": [
                                    {
                                        "id": 19,
                                        "label": "R"
                                    },
                                    {
                                        "id": 18,
                                        "label": "EH"
                                    },
                                    {
                                        "id": 19,
                                        "label": "R"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739385000,
                                "dateModified": 1684739385000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 25607,
                            "wordInstanceId": 39578,
                            "wordRootId": 39578,
                            "sharedMeaningId": 12274,
                            "wordFamilyId": 6404,
                            "wordDefinitionId": 11074,
                            "definition": "moving or doing something fast",
                            "definitionEn": "moving or doing something fast",
                            "label": "QUICK",
                            "wordRootLabel": "QUICK",
                            "pronunciationId": 18700,
                            "phonemes": "K W IH K",
                            "example": "a quick inspection",
                            "partOfSpeech": "adjective",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 7,
                            "cambridgeBand": 26,
                            "usageCount": 1,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/q/quick_92873_5263.mp3",
                            "wordAdapter": {
                                "id": 39578,
                                "wordId": 25607,
                                "wordHeadId": 609,
                                "wordRootId": 413664,
                                "wordInstanceId": 30136,
                                "wordUsageCount": 0,
                                "headUsageCount": 875,
                                "rootUsageCount": 1,
                                "instanceUsageCount": 1,
                                "sharedMeaningId": 12274,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": true
                            },
                            "pronunciation": {
                                "id": 18700,
                                "phonemes": "K W IH K",
                                "assetId": 5263,
                                "syllableCount": 1,
                                "phones": [
                                    {
                                        "id": 30,
                                        "label": "K"
                                    },
                                    {
                                        "id": 4,
                                        "label": "W"
                                    },
                                    {
                                        "id": 36,
                                        "label": "IH"
                                    },
                                    {
                                        "id": 30,
                                        "label": "K"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739616000,
                                "dateModified": 1684739616000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        }
                    ],
                    "examples": [
                        {
                            "id": 532724,
                            "dialogId": 38701,
                            "sequence": 16,
                            "transcript": "Clean water is important in our day-to-day lives.",
                            "videoURL": "https://cdna.qaenglishcentral.com/dialogs/38701/lineclip_38701_532724_71739_20210614122919.mp4",
                            "thumbnailURL": "https://cdna.qaenglishcentral.com/dialogs/38701/linethumb_38701_532724_71739_20210614122919.jpg",
                            "cueStart": 71739,
                            "cueEnd": 74712,
                            "slowSpeakStart": 107759,
                            "slowSpeakEnd": 112293,
                            "autoPause": false,
                            "pointsMax": 20,
                            "wordDetails": [
                                {
                                    "id": 42181,
                                    "wordInstanceId": 12154,
                                    "wordRootId": 8460,
                                    "sharedMeaningId": 21155,
                                    "wordFamilyId": 1265,
                                    "wordDefinitionId": 19411,
                                    "definition": "not dirty",
                                    "definitionEn": "not dirty",
                                    "label": "CLEAN",
                                    "wordRootLabel": "CLEAN",
                                    "pronunciationId": 5885,
                                    "phonemes": "K L IY N",
                                    "example": "After being washed, the old car looked nice and clean.",
                                    "partOfSpeech": "adjective",
                                    "baseForm": true,
                                    "featured": false,
                                    "excluded": false,
                                    "sequence": 1,
                                    "adjectiveType": 0,
                                    "nounType": 3,
                                    "wordLanguage": "en",
                                    "difficultyLevel": 2,
                                    "cambridgeBand": 18,
                                    "usageCount": 292,
                                    "audioURL": "https://cdna.qaenglishcentral.com/words/c/clean_20797_2117.mp3",
                                    "wordAdapter": {
                                        "id": 66022,
                                        "wordId": 42181,
                                        "wordHeadId": 386,
                                        "wordRootId": 402977,
                                        "wordInstanceId": 58126,
                                        "wordUsageCount": 0,
                                        "headUsageCount": 839,
                                        "rootUsageCount": 288,
                                        "instanceUsageCount": 288,
                                        "sharedMeaningId": 21155,
                                        "wordFamilyId": null,
                                        "headPick": true,
                                        "rootPick": true
                                    },
                                    "canonicalDialogLineId": 532724,
                                    "pronunciation": {
                                        "id": 5885,
                                        "phonemes": "K L IY N",
                                        "assetId": 2117,
                                        "syllableCount": 1,
                                        "phones": [
                                            {
                                                "id": 30,
                                                "label": "K"
                                            },
                                            {
                                                "id": 12,
                                                "label": "L"
                                            },
                                            {
                                                "id": 1,
                                                "label": "IY"
                                            },
                                            {
                                                "id": 9,
                                                "label": "N"
                                            }
                                        ],
                                        "active": true,
                                        "dateAdded": 1684739249000,
                                        "dateModified": 1684739249000
                                    },
                                    "properNoun": false,
                                    "cliplistKeyword": false,
                                    "studiable": true,
                                    "idiom": false
                                }
                            ],
                            "dialogTitle": "Aeon GIF for Transform Book 6"
                        }
                    ]
                },
                {
                    "type": "XQuizWord",
                    "modeId": 1,
                    "previouslyEncountered": false,
                    "word": {
                        "id": 46144,
                        "wordInstanceId": 24055,
                        "wordRootId": 24055,
                        "sharedMeaningId": 23060,
                        "wordFamilyId": 3795,
                        "wordDefinitionId": 21198,
                        "definition": "an institution of higher education",
                        "definitionEn": "an institution of higher education",
                        "label": "COLLEGE",
                        "wordRootLabel": "COLLEGE",
                        "pronunciationId": 11073,
                        "phonemes": "K AA L IH JH",
                        "example": "I went to college to become a scientist.",
                        "partOfSpeech": "noun",
                        "baseForm": true,
                        "featured": false,
                        "excluded": false,
                        "adjectiveType": 0,
                        "nounType": 3,
                        "wordLanguage": "en",
                        "difficultyLevel": 3,
                        "cambridgeBand": 16,
                        "usageCount": 453,
                        "audioURL": "https://cdna.qaenglishcentral.com/words/c/college_21788_2127.mp3",
                        "wordAdapter": {
                            "id": 73417,
                            "wordId": 46144,
                            "wordHeadId": 247,
                            "wordRootId": 403182,
                            "wordInstanceId": 45976,
                            "wordUsageCount": 0,
                            "headUsageCount": 453,
                            "rootUsageCount": 453,
                            "instanceUsageCount": 430,
                            "sharedMeaningId": 23060,
                            "wordFamilyId": null,
                            "headPick": true,
                            "rootPick": true
                        },
                        "canonicalDialogLineId": 257133,
                        "pronunciation": {
                            "id": 11073,
                            "phonemes": "K AA L IH JH",
                            "assetId": 2127,
                            "syllableCount": 2,
                            "phones": [
                                {
                                    "id": 30,
                                    "label": "K"
                                },
                                {
                                    "id": 5,
                                    "label": "AA"
                                },
                                {
                                    "id": 12,
                                    "label": "L"
                                },
                                {
                                    "id": 36,
                                    "label": "IH"
                                },
                                {
                                    "id": 22,
                                    "label": "JH"
                                }
                            ],
                            "active": true,
                            "dateAdded": 1684739399000,
                            "dateModified": 1684739399000
                        },
                        "properNoun": false,
                        "cliplistKeyword": false,
                        "studiable": true,
                        "idiom": false
                    },
                    "distractors": [
                        {
                            "id": 54868,
                            "wordInstanceId": 301,
                            "wordRootId": 301,
                            "sharedMeaningId": 27524,
                            "wordFamilyId": 7423,
                            "wordDefinitionId": 25389,
                            "definition": "something that is long, thin and flexible",
                            "definitionEn": "something that is long, thin and flexible",
                            "label": "LINE",
                            "wordRootLabel": "LINE",
                            "pronunciationId": 185,
                            "phonemes": "L AY N",
                            "example": "a washing line",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 7,
                            "cambridgeBand": 6,
                            "usageCount": 22,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/l/line_67791_20230314035957.mp3",
                            "wordAdapter": {
                                "id": 90389,
                                "wordId": 54868,
                                "wordHeadId": 143,
                                "wordRootId": 102617,
                                "wordInstanceId": 105323,
                                "wordUsageCount": 0,
                                "headUsageCount": 86,
                                "rootUsageCount": 22,
                                "instanceUsageCount": 20,
                                "sharedMeaningId": 27524,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 143495,
                            "pronunciation": {
                                "id": 185,
                                "phonemes": "L AY N",
                                "assetId": 5727816,
                                "syllableCount": 1,
                                "phones": [
                                    {
                                        "id": 12,
                                        "label": "L"
                                    },
                                    {
                                        "id": 35,
                                        "label": "AY"
                                    },
                                    {
                                        "id": 9,
                                        "label": "N"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739134000,
                                "dateModified": 1684739134000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 33171,
                            "wordInstanceId": 13111,
                            "wordRootId": 13109,
                            "sharedMeaningId": 16393,
                            "wordFamilyId": 2029,
                            "wordDefinitionId": 14909,
                            "definition": "a job in an organization",
                            "definitionEn": "a job in an organization",
                            "label": "PLACE",
                            "wordRootLabel": "PLACE",
                            "pronunciationId": 6315,
                            "phonemes": "P L EY S",
                            "example": "The talented player got a place in the basketball team.",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 4,
                            "cambridgeBand": 3,
                            "usageCount": 9,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/p/place_88598_2498.mp3",
                            "wordAdapter": {
                                "id": 50690,
                                "wordId": 33171,
                                "wordHeadId": 77,
                                "wordRootId": 131988,
                                "wordInstanceId": 41988,
                                "wordUsageCount": 0,
                                "headUsageCount": 610,
                                "rootUsageCount": 9,
                                "instanceUsageCount": 9,
                                "sharedMeaningId": 16393,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 10019,
                            "pronunciation": {
                                "id": 6315,
                                "phonemes": "P L EY S",
                                "assetId": 2498,
                                "syllableCount": 1,
                                "phones": [
                                    {
                                        "id": 23,
                                        "label": "P"
                                    },
                                    {
                                        "id": 12,
                                        "label": "L"
                                    },
                                    {
                                        "id": 26,
                                        "label": "EY"
                                    },
                                    {
                                        "id": 27,
                                        "label": "S"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739260000,
                                "dateModified": 1684739260000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 16251,
                            "wordInstanceId": 26312,
                            "wordRootId": 26312,
                            "sharedMeaningId": 7064,
                            "wordFamilyId": 4109,
                            "wordDefinitionId": 6458,
                            "definition": "the government of a country",
                            "definitionEn": "the government of a country",
                            "label": "ADMINISTRATION",
                            "wordRootLabel": "ADMINISTRATION",
                            "pronunciationId": 11989,
                            "phonemes": "AE D M IH N IH S T R EY SH AH N",
                            "example": "things were quiet during the Eisenhower administration",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 7,
                            "cambridgeBand": 21,
                            "usageCount": 114,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/a/administration_1089_4224.mp3",
                            "wordAdapter": {
                                "id": 26312,
                                "wordId": 16251,
                                "wordHeadId": 681,
                                "wordRootId": 2604,
                                "wordInstanceId": 42983,
                                "wordUsageCount": 0,
                                "headUsageCount": 146,
                                "rootUsageCount": 113,
                                "instanceUsageCount": 92,
                                "sharedMeaningId": 7064,
                                "wordFamilyId": null,
                                "headPick": true,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 249012,
                            "pronunciation": {
                                "id": 11989,
                                "phonemes": "AE D M IH N IH S T R EY SH AH N",
                                "assetId": 4224,
                                "syllableCount": 5,
                                "phones": [
                                    {
                                        "id": 34,
                                        "label": "AE"
                                    },
                                    {
                                        "id": 39,
                                        "label": "D"
                                    },
                                    {
                                        "id": 31,
                                        "label": "M"
                                    },
                                    {
                                        "id": 36,
                                        "label": "IH"
                                    },
                                    {
                                        "id": 9,
                                        "label": "N"
                                    },
                                    {
                                        "id": 36,
                                        "label": "IH"
                                    },
                                    {
                                        "id": 27,
                                        "label": "S"
                                    },
                                    {
                                        "id": 38,
                                        "label": "T"
                                    },
                                    {
                                        "id": 19,
                                        "label": "R"
                                    },
                                    {
                                        "id": 26,
                                        "label": "EY"
                                    },
                                    {
                                        "id": 20,
                                        "label": "SH"
                                    },
                                    {
                                        "id": 29,
                                        "label": "AH"
                                    },
                                    {
                                        "id": 9,
                                        "label": "N"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739426000,
                                "dateModified": 1684739426000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        }
                    ],
                    "examples": [
                        {
                            "id": 257133,
                            "dialogId": 22624,
                            "sequence": 2,
                            "transcript": "I'm working, I'm not going to college.",
                            "videoURL": "https://cdna.qaenglishcentral.com/dialogs/22624/lineclip_22624_257133_5815_20140508120851.mp4",
                            "thumbnailURL": "https://cdna.qaenglishcentral.com/dialogs/22624/linethumb_22624_257133_5815_20140508120851.jpg",
                            "cueStart": 5815,
                            "cueEnd": 7699,
                            "slowSpeakStart": 8873,
                            "slowSpeakEnd": 11774,
                            "autoPause": false,
                            "pointsMax": 14,
                            "wordDetails": [
                                {
                                    "id": 46144,
                                    "wordInstanceId": 24055,
                                    "wordRootId": 24055,
                                    "sharedMeaningId": 23060,
                                    "wordFamilyId": 3795,
                                    "wordDefinitionId": 21198,
                                    "definition": "an institution of higher education",
                                    "definitionEn": "an institution of higher education",
                                    "label": "COLLEGE",
                                    "wordRootLabel": "COLLEGE",
                                    "pronunciationId": 11073,
                                    "phonemes": "K AA L IH JH",
                                    "example": "I went to college to become a scientist.",
                                    "partOfSpeech": "noun",
                                    "baseForm": true,
                                    "featured": false,
                                    "excluded": false,
                                    "sequence": 6,
                                    "adjectiveType": 0,
                                    "nounType": 3,
                                    "wordLanguage": "en",
                                    "difficultyLevel": 3,
                                    "cambridgeBand": 16,
                                    "usageCount": 453,
                                    "audioURL": "https://cdna.qaenglishcentral.com/words/c/college_21788_2127.mp3",
                                    "wordAdapter": {
                                        "id": 73417,
                                        "wordId": 46144,
                                        "wordHeadId": 247,
                                        "wordRootId": 403182,
                                        "wordInstanceId": 45976,
                                        "wordUsageCount": 0,
                                        "headUsageCount": 453,
                                        "rootUsageCount": 453,
                                        "instanceUsageCount": 430,
                                        "sharedMeaningId": 23060,
                                        "wordFamilyId": null,
                                        "headPick": true,
                                        "rootPick": true
                                    },
                                    "canonicalDialogLineId": 257133,
                                    "pronunciation": {
                                        "id": 11073,
                                        "phonemes": "K AA L IH JH",
                                        "assetId": 2127,
                                        "syllableCount": 2,
                                        "phones": [
                                            {
                                                "id": 30,
                                                "label": "K"
                                            },
                                            {
                                                "id": 5,
                                                "label": "AA"
                                            },
                                            {
                                                "id": 12,
                                                "label": "L"
                                            },
                                            {
                                                "id": 36,
                                                "label": "IH"
                                            },
                                            {
                                                "id": 22,
                                                "label": "JH"
                                            }
                                        ],
                                        "active": true,
                                        "dateAdded": 1684739399000,
                                        "dateModified": 1684739399000
                                    },
                                    "properNoun": false,
                                    "cliplistKeyword": false,
                                    "studiable": true,
                                    "idiom": false
                                }
                            ],
                            "dialogTitle": "Fashion Is a Cool Thing"
                        }
                    ]
                },
                {
                    "type": "XQuizWord",
                    "modeId": 1,
                    "previouslyEncountered": false,
                    "word": {
                        "id": 49755,
                        "wordInstanceId": 80897,
                        "wordRootId": 80897,
                        "sharedMeaningId": 24779,
                        "wordFamilyId": 11049,
                        "wordDefinitionId": 22832,
                        "definition": "a thread-like strand on the skin",
                        "definitionEn": "a thread-like strand on the skin",
                        "label": "HAIR",
                        "wordRootLabel": "HAIR",
                        "pronunciationId": 7968,
                        "phonemes": "HH EH R",
                        "example": "there is a hair in my soup",
                        "partOfSpeech": "noun",
                        "baseForm": true,
                        "featured": false,
                        "excluded": false,
                        "adjectiveType": 0,
                        "nounType": 3,
                        "wordLanguage": "en",
                        "difficultyLevel": 1,
                        "cambridgeBand": 17,
                        "usageCount": 614,
                        "audioURL": "https://cdna.qaenglishcentral.com/words/h/hair_49553_8237.mp3",
                        "wordAdapter": {
                            "id": 80899,
                            "wordId": 49755,
                            "wordHeadId": 387,
                            "wordRootId": 80821,
                            "wordInstanceId": 78520,
                            "wordUsageCount": 0,
                            "headUsageCount": 622,
                            "rootUsageCount": 597,
                            "instanceUsageCount": 570,
                            "sharedMeaningId": 24779,
                            "wordFamilyId": null,
                            "headPick": true,
                            "rootPick": true
                        },
                        "canonicalDialogLineId": 126530,
                        "pronunciation": {
                            "id": 7968,
                            "phonemes": "HH EH R",
                            "assetId": 8237,
                            "syllableCount": 1,
                            "phones": [
                                {
                                    "id": 6,
                                    "label": "HH"
                                },
                                {
                                    "id": 18,
                                    "label": "EH"
                                },
                                {
                                    "id": 19,
                                    "label": "R"
                                }
                            ],
                            "active": true,
                            "dateAdded": 1684739302000,
                            "dateModified": 1684739302000
                        },
                        "properNoun": false,
                        "cliplistKeyword": false,
                        "studiable": true,
                        "idiom": false
                    },
                    "distractors": [
                        {
                            "id": 38768,
                            "wordInstanceId": 7990,
                            "wordRootId": 7990,
                            "sharedMeaningId": 19354,
                            "wordFamilyId": 1207,
                            "wordDefinitionId": 17729,
                            "definition": "the number 1",
                            "definitionEn": "1",
                            "label": "ONE",
                            "wordRootLabel": "ONE",
                            "pronunciationId": 3487,
                            "phonemes": "W AH N",
                            "example": "Three minus two is one.",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 1,
                            "cambridgeBand": 1,
                            "usageCount": 750,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/o/one_82992_3096.mp3",
                            "wordAdapter": {
                                "id": 60212,
                                "wordId": 38768,
                                "wordHeadId": 976,
                                "wordRootId": 411640,
                                "wordInstanceId": 40063,
                                "wordUsageCount": 0,
                                "headUsageCount": 10831,
                                "rootUsageCount": 744,
                                "instanceUsageCount": 686,
                                "sharedMeaningId": 19354,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 20828,
                            "pronunciation": {
                                "id": 3487,
                                "phonemes": "W AH N",
                                "label": "ONE",
                                "assetId": 3096,
                                "syllableCount": 1,
                                "phones": [
                                    {
                                        "id": 4,
                                        "label": "W"
                                    },
                                    {
                                        "id": 29,
                                        "label": "AH"
                                    },
                                    {
                                        "id": 9,
                                        "label": "N"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739208000,
                                "dateModified": 1686142438000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 20525,
                            "wordInstanceId": 16266,
                            "wordRootId": 16266,
                            "sharedMeaningId": 9335,
                            "wordFamilyId": 2590,
                            "wordDefinitionId": 8482,
                            "definition": "a way of living",
                            "definitionEn": "a way of living",
                            "label": "LIFE",
                            "wordRootLabel": "LIFE",
                            "pronunciationId": 7781,
                            "phonemes": "L AY F",
                            "example": "social life ",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 4,
                            "cambridgeBand": 3,
                            "usageCount": 591,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/l/life_67473_3751.mp3",
                            "wordAdapter": {
                                "id": 32842,
                                "wordId": 20525,
                                "wordHeadId": 37,
                                "wordRootId": 101801,
                                "wordInstanceId": 110192,
                                "wordUsageCount": 0,
                                "headUsageCount": 3673,
                                "rootUsageCount": 586,
                                "instanceUsageCount": 457,
                                "sharedMeaningId": 9335,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 399104,
                            "pronunciation": {
                                "id": 7781,
                                "phonemes": "L AY F",
                                "assetId": 3751,
                                "syllableCount": 1,
                                "phones": [
                                    {
                                        "id": 12,
                                        "label": "L"
                                    },
                                    {
                                        "id": 35,
                                        "label": "AY"
                                    },
                                    {
                                        "id": 3,
                                        "label": "F"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739296000,
                                "dateModified": 1684739296000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 10075,
                            "wordInstanceId": 15797,
                            "wordRootId": 15797,
                            "sharedMeaningId": 4050,
                            "wordFamilyId": 2504,
                            "wordDefinitionId": 3713,
                            "definition": "the making or study of paintings and drawings",
                            "definitionEn": "the making or study of paintings and drawings",
                            "label": "ART",
                            "wordRootLabel": "ART",
                            "pronunciationId": 7582,
                            "phonemes": "AA R T",
                            "example": "This painting is my favorite work of art.",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 3,
                            "cambridgeBand": 14,
                            "usageCount": 564,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/a/art_5358_4270.mp3",
                            "wordAdapter": {
                                "id": 15802,
                                "wordId": 10075,
                                "wordHeadId": 196,
                                "wordRootId": 400953,
                                "wordInstanceId": 51872,
                                "wordUsageCount": 0,
                                "headUsageCount": 1058,
                                "rootUsageCount": 548,
                                "instanceUsageCount": 464,
                                "sharedMeaningId": 4050,
                                "wordFamilyId": null,
                                "headPick": true,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 307018,
                            "pronunciation": {
                                "id": 7582,
                                "phonemes": "AA R T",
                                "assetId": 4270,
                                "syllableCount": 1,
                                "phones": [
                                    {
                                        "id": 5,
                                        "label": "AA"
                                    },
                                    {
                                        "id": 19,
                                        "label": "R"
                                    },
                                    {
                                        "id": 38,
                                        "label": "T"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739291000,
                                "dateModified": 1684739291000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        }
                    ],
                    "examples": [
                        {
                            "id": 126530,
                            "dialogId": 16829,
                            "sequence": 12,
                            "transcript": "But you loved your long hair!",
                            "videoURL": "https://cdna.qaenglishcentral.com/dialogs/16829/lineclip_16829_126530_32238_20120323105906.mp4",
                            "thumbnailURL": "https://cdna.qaenglishcentral.com/dialogs/16829/linethumb_16829_126530_32238_20120323105906.jpg",
                            "cueStart": 32238,
                            "cueEnd": 33719,
                            "slowSpeakStart": 48507,
                            "slowSpeakEnd": 50804,
                            "autoPause": false,
                            "pointsMax": 20,
                            "wordDetails": [
                                {
                                    "id": 49755,
                                    "wordInstanceId": 80897,
                                    "wordRootId": 80897,
                                    "sharedMeaningId": 24779,
                                    "wordFamilyId": 11049,
                                    "wordDefinitionId": 22832,
                                    "definition": "a thread-like strand on the skin",
                                    "definitionEn": "a thread-like strand on the skin",
                                    "label": "HAIR",
                                    "wordRootLabel": "HAIR",
                                    "pronunciationId": 7968,
                                    "phonemes": "HH EH R",
                                    "example": "there is a hair in my soup",
                                    "partOfSpeech": "noun",
                                    "baseForm": true,
                                    "featured": false,
                                    "excluded": false,
                                    "sequence": 6,
                                    "adjectiveType": 0,
                                    "nounType": 3,
                                    "wordLanguage": "en",
                                    "difficultyLevel": 1,
                                    "cambridgeBand": 17,
                                    "usageCount": 614,
                                    "audioURL": "https://cdna.qaenglishcentral.com/words/h/hair_49553_8237.mp3",
                                    "wordAdapter": {
                                        "id": 80899,
                                        "wordId": 49755,
                                        "wordHeadId": 387,
                                        "wordRootId": 80821,
                                        "wordInstanceId": 78520,
                                        "wordUsageCount": 0,
                                        "headUsageCount": 622,
                                        "rootUsageCount": 597,
                                        "instanceUsageCount": 570,
                                        "sharedMeaningId": 24779,
                                        "wordFamilyId": null,
                                        "headPick": true,
                                        "rootPick": true
                                    },
                                    "canonicalDialogLineId": 126530,
                                    "pronunciation": {
                                        "id": 7968,
                                        "phonemes": "HH EH R",
                                        "assetId": 8237,
                                        "syllableCount": 1,
                                        "phones": [
                                            {
                                                "id": 6,
                                                "label": "HH"
                                            },
                                            {
                                                "id": 18,
                                                "label": "EH"
                                            },
                                            {
                                                "id": 19,
                                                "label": "R"
                                            }
                                        ],
                                        "active": true,
                                        "dateAdded": 1684739302000,
                                        "dateModified": 1684739302000
                                    },
                                    "properNoun": false,
                                    "cliplistKeyword": false,
                                    "studiable": true,
                                    "idiom": false
                                }
                            ],
                            "dialogTitle": "A Set of Combs 3"
                        }
                    ]
                },
                {
                    "type": "XQuizWord",
                    "modeId": 1,
                    "previouslyEncountered": false,
                    "word": {
                        "id": 49793,
                        "wordInstanceId": 13111,
                        "wordRootId": 13109,
                        "sharedMeaningId": 24796,
                        "wordFamilyId": 3107,
                        "wordDefinitionId": 22845,
                        "definition": "an area, such as a building or town",
                        "definitionEn": "an area",
                        "label": "PLACE",
                        "wordRootLabel": "PLACE",
                        "pronunciationId": 6315,
                        "phonemes": "P L EY S",
                        "example": "There is a place in the woods where we go camping.",
                        "partOfSpeech": "noun",
                        "baseForm": true,
                        "featured": false,
                        "excluded": false,
                        "adjectiveType": 0,
                        "nounType": 3,
                        "wordLanguage": "en",
                        "difficultyLevel": 1,
                        "usageCount": 2075,
                        "audioURL": "https://cdna.qaenglishcentral.com/words/p/place_88598_2498.mp3",
                        "wordAdapter": {
                            "id": 81005,
                            "wordId": 49793,
                            "wordHeadId": 51259,
                            "wordRootId": 412646,
                            "wordInstanceId": 41028,
                            "wordUsageCount": 0,
                            "headUsageCount": 2076,
                            "rootUsageCount": 2020,
                            "instanceUsageCount": 1374,
                            "sharedMeaningId": 24796,
                            "wordFamilyId": null,
                            "headPick": true,
                            "rootPick": true
                        },
                        "canonicalDialogLineId": 46448,
                        "pronunciation": {
                            "id": 6315,
                            "phonemes": "P L EY S",
                            "assetId": 2498,
                            "syllableCount": 1,
                            "phones": [
                                {
                                    "id": 23,
                                    "label": "P"
                                },
                                {
                                    "id": 12,
                                    "label": "L"
                                },
                                {
                                    "id": 26,
                                    "label": "EY"
                                },
                                {
                                    "id": 27,
                                    "label": "S"
                                }
                            ],
                            "active": true,
                            "dateAdded": 1684739260000,
                            "dateModified": 1684739260000
                        },
                        "properNoun": false,
                        "cliplistKeyword": false,
                        "studiable": true,
                        "idiom": false
                    },
                    "distractors": [
                        {
                            "id": 14626,
                            "wordInstanceId": 23555,
                            "wordRootId": 23555,
                            "sharedMeaningId": 6308,
                            "wordFamilyId": 3731,
                            "wordDefinitionId": 5781,
                            "definition": "a device that allows someone to fly",
                            "definitionEn": "a device that allows someone to fly",
                            "label": "JETPACK",
                            "wordRootLabel": "JETPACK",
                            "pronunciationId": 10849,
                            "phonemes": "JH EH T P AE K",
                            "example": "A jetpack is commonly used by an astronaut in space.",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 7,
                            "usageCount": 13,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/j/jetpack_134625_30936.mp3",
                            "wordAdapter": {
                                "id": 23555,
                                "wordId": 14626,
                                "wordHeadId": 48706,
                                "wordRootId": 316591,
                                "wordInstanceId": 284397,
                                "wordUsageCount": 0,
                                "headUsageCount": 13,
                                "rootUsageCount": 13,
                                "instanceUsageCount": 11,
                                "sharedMeaningId": 6308,
                                "wordFamilyId": null,
                                "headPick": true,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 116604,
                            "pronunciation": {
                                "id": 10849,
                                "phonemes": "JH EH T P AE K",
                                "assetId": 30936,
                                "syllableCount": 2,
                                "phones": [
                                    {
                                        "id": 22,
                                        "label": "JH"
                                    },
                                    {
                                        "id": 18,
                                        "label": "EH"
                                    },
                                    {
                                        "id": 38,
                                        "label": "T"
                                    },
                                    {
                                        "id": 23,
                                        "label": "P"
                                    },
                                    {
                                        "id": 34,
                                        "label": "AE"
                                    },
                                    {
                                        "id": 30,
                                        "label": "K"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739393000,
                                "dateModified": 1684739393000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 32885,
                            "wordInstanceId": 16709,
                            "wordRootId": 16709,
                            "sharedMeaningId": 16223,
                            "wordFamilyId": 8019,
                            "wordDefinitionId": 14749,
                            "definition": "to indicate the position or direction of",
                            "definitionEn": "to indicate the direction of",
                            "label": "POINT",
                            "wordRootLabel": "POINT",
                            "pronunciationId": 7977,
                            "phonemes": "P OY N T",
                            "example": "The teacher asked the student to point the US on the map.",
                            "partOfSpeech": "verb",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 4,
                            "cambridgeBand": 4,
                            "usageCount": 51,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/p/point_89219_2503.mp3",
                            "wordAdapter": {
                                "id": 50290,
                                "wordId": 32885,
                                "wordHeadId": 29785,
                                "wordRootId": 412787,
                                "wordInstanceId": 67640,
                                "wordUsageCount": 0,
                                "headUsageCount": 116,
                                "rootUsageCount": 48,
                                "instanceUsageCount": 18,
                                "sharedMeaningId": 16223,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": false
                            },
                            "canonicalDialogLineId": 40622,
                            "pronunciation": {
                                "id": 7977,
                                "phonemes": "P OY N T",
                                "assetId": 2503,
                                "syllableCount": 1,
                                "phones": [
                                    {
                                        "id": 23,
                                        "label": "P"
                                    },
                                    {
                                        "id": 32,
                                        "label": "OY"
                                    },
                                    {
                                        "id": 9,
                                        "label": "N"
                                    },
                                    {
                                        "id": 38,
                                        "label": "T"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739302000,
                                "dateModified": 1684739302000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 5929,
                            "wordInstanceId": 9951,
                            "wordRootId": 9951,
                            "sharedMeaningId": 2432,
                            "wordFamilyId": 1500,
                            "wordDefinitionId": 2250,
                            "definition": "a period when something is expected to happen",
                            "definitionEn": "a time when something happens",
                            "label": "DAY",
                            "wordRootLabel": "DAY",
                            "pronunciationId": 4453,
                            "phonemes": "D EY",
                            "example": "he deserves his day in court ",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 3,
                            "cambridgeBand": 2,
                            "usageCount": 681,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/d/day_27348_2154.mp3",
                            "wordAdapter": {
                                "id": 9951,
                                "wordId": 5929,
                                "wordHeadId": 23,
                                "wordRootId": 45472,
                                "wordInstanceId": 2330,
                                "wordUsageCount": 0,
                                "headUsageCount": 5464,
                                "rootUsageCount": 661,
                                "instanceUsageCount": 636,
                                "sharedMeaningId": 2432,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 519626,
                            "pronunciation": {
                                "id": 4453,
                                "phonemes": "D EY",
                                "assetId": 2154,
                                "syllableCount": 1,
                                "phones": [
                                    {
                                        "id": 39,
                                        "label": "D"
                                    },
                                    {
                                        "id": 26,
                                        "label": "EY"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739230000,
                                "dateModified": 1684739230000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        }
                    ],
                    "examples": [
                        {
                            "id": 46448,
                            "dialogId": 12013,
                            "sequence": 4,
                            "characterId": 956,
                            "transcript": "It is a dangerous and rough place.",
                            "videoURL": "https://cdna.qaenglishcentral.com/dialogs/12013/lineclip_12013_46448_25268.mp4",
                            "thumbnailURL": "https://cdna.qaenglishcentral.com/dialogs/12013/linethumb_409754_20120926114140.jpg",
                            "cueStart": 25268,
                            "cueEnd": 27467,
                            "slowSpeakStart": 38052,
                            "slowSpeakEnd": 41426,
                            "autoPause": false,
                            "pointsMax": 33,
                            "wordDetails": [
                                {
                                    "id": 49793,
                                    "wordInstanceId": 13111,
                                    "wordRootId": 13109,
                                    "sharedMeaningId": 24796,
                                    "wordFamilyId": 3107,
                                    "wordDefinitionId": 22845,
                                    "definition": "an area, such as a building or town",
                                    "definitionEn": "an area, such as a building or town",
                                    "label": "PLACE",
                                    "wordRootLabel": "PLACE",
                                    "pronunciationId": 6315,
                                    "phonemes": "P L EY S",
                                    "example": "There is a place in the woods where we go camping.",
                                    "partOfSpeech": "noun",
                                    "baseForm": true,
                                    "featured": false,
                                    "excluded": false,
                                    "sequence": 7,
                                    "adjectiveType": 0,
                                    "nounType": 3,
                                    "wordLanguage": "en",
                                    "difficultyLevel": 1,
                                    "usageCount": 2075,
                                    "audioURL": "https://cdna.qaenglishcentral.com/words/p/place_88598_2498.mp3",
                                    "wordAdapter": {
                                        "id": 81005,
                                        "wordId": 49793,
                                        "wordHeadId": 51259,
                                        "wordRootId": 412646,
                                        "wordInstanceId": 41028,
                                        "wordUsageCount": 0,
                                        "headUsageCount": 2076,
                                        "rootUsageCount": 2020,
                                        "instanceUsageCount": 1374,
                                        "sharedMeaningId": 24796,
                                        "wordFamilyId": null,
                                        "headPick": true,
                                        "rootPick": true
                                    },
                                    "canonicalDialogLineId": 46448,
                                    "pronunciation": {
                                        "id": 6315,
                                        "phonemes": "P L EY S",
                                        "assetId": 2498,
                                        "syllableCount": 1,
                                        "phones": [
                                            {
                                                "id": 23,
                                                "label": "P"
                                            },
                                            {
                                                "id": 12,
                                                "label": "L"
                                            },
                                            {
                                                "id": 26,
                                                "label": "EY"
                                            },
                                            {
                                                "id": 27,
                                                "label": "S"
                                            }
                                        ],
                                        "active": true,
                                        "dateAdded": 1684739260000,
                                        "dateModified": 1684739260000
                                    },
                                    "properNoun": false,
                                    "cliplistKeyword": false,
                                    "studiable": true,
                                    "idiom": false
                                }
                            ],
                            "dialogTitle": "Could You Survive on Your Own?"
                        }
                    ]
                },
                {
                    "type": "XQuizWord",
                    "modeId": 1,
                    "previouslyEncountered": false,
                    "word": {
                        "id": 61393,
                        "wordInstanceId": 100022,
                        "wordRootId": 43520,
                        "sharedMeaningId": 31207,
                        "wordFamilyId": 7007,
                        "wordDefinitionId": 28601,
                        "definition": "the first meal in the morning",
                        "definitionEn": "the first meal in the morning",
                        "label": "BREAKFAST",
                        "wordRootLabel": "BREAKFAST",
                        "pronunciationId": 38642,
                        "phonemes": "B R EH K F AH S T",
                        "example": "Jane always ate breakfast before going to work. ",
                        "partOfSpeech": "noun",
                        "baseForm": true,
                        "featured": false,
                        "excluded": false,
                        "adjectiveType": 0,
                        "nounType": 3,
                        "wordLanguage": "en",
                        "difficultyLevel": 2,
                        "cambridgeBand": 38,
                        "usageCount": 406,
                        "audioURL": "https://cdna.qaenglishcentral.com/words/b/breakfast_13765_3327.mp3",
                        "wordAdapter": {
                            "id": 100022,
                            "wordId": 61393,
                            "wordHeadId": 618,
                            "wordRootId": 402072,
                            "wordInstanceId": 50464,
                            "wordUsageCount": 0,
                            "headUsageCount": 367,
                            "rootUsageCount": 366,
                            "instanceUsageCount": 365,
                            "sharedMeaningId": 31207,
                            "wordFamilyId": null,
                            "headPick": true,
                            "rootPick": true
                        },
                        "canonicalDialogLineId": 575623,
                        "pronunciation": {
                            "id": 38642,
                            "phonemes": "B R EH K F AH S T",
                            "assetId": 3327,
                            "syllableCount": 2,
                            "phones": [
                                {
                                    "id": 8,
                                    "label": "B"
                                },
                                {
                                    "id": 19,
                                    "label": "R"
                                },
                                {
                                    "id": 18,
                                    "label": "EH"
                                },
                                {
                                    "id": 30,
                                    "label": "K"
                                },
                                {
                                    "id": 3,
                                    "label": "F"
                                },
                                {
                                    "id": 29,
                                    "label": "AH"
                                },
                                {
                                    "id": 27,
                                    "label": "S"
                                },
                                {
                                    "id": 38,
                                    "label": "T"
                                }
                            ],
                            "active": true,
                            "dateAdded": 1684740762000,
                            "dateModified": 1684740762000
                        },
                        "properNoun": false,
                        "cliplistKeyword": false,
                        "studiable": true,
                        "idiom": false
                    },
                    "distractors": [
                        {
                            "id": 50953,
                            "wordInstanceId": 54940,
                            "wordRootId": 54938,
                            "sharedMeaningId": 25332,
                            "wordFamilyId": 8524,
                            "wordDefinitionId": 23348,
                            "definition": "referring to girls or women",
                            "definitionEn": "referring to girls or women",
                            "label": "FEMALE",
                            "wordRootLabel": "FEMALE",
                            "pronunciationId": 24467,
                            "phonemes": "F IY M EY L",
                            "example": "female sensitiveness ",
                            "partOfSpeech": "adjective",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 4,
                            "cambridgeBand": 20,
                            "usageCount": 160,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/f/female_39811_11159.mp3",
                            "wordAdapter": {
                                "id": 83353,
                                "wordId": 50953,
                                "wordHeadId": 1112,
                                "wordRootId": 65951,
                                "wordInstanceId": 134034,
                                "wordUsageCount": 0,
                                "headUsageCount": 235,
                                "rootUsageCount": 158,
                                "instanceUsageCount": 158,
                                "sharedMeaningId": 25332,
                                "wordFamilyId": null,
                                "headPick": true,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 21453,
                            "pronunciation": {
                                "id": 24467,
                                "phonemes": "F IY M EY L",
                                "assetId": 11159,
                                "syllableCount": 2,
                                "phones": [
                                    {
                                        "id": 3,
                                        "label": "F"
                                    },
                                    {
                                        "id": 1,
                                        "label": "IY"
                                    },
                                    {
                                        "id": 31,
                                        "label": "M"
                                    },
                                    {
                                        "id": 26,
                                        "label": "EY"
                                    },
                                    {
                                        "id": 12,
                                        "label": "L"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739866000,
                                "dateModified": 1684739866000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 15352,
                            "wordInstanceId": 21415,
                            "wordRootId": 21415,
                            "sharedMeaningId": 6663,
                            "wordFamilyId": 3289,
                            "wordDefinitionId": 6102,
                            "definition": "with or in a close or intimate relationship",
                            "definitionEn": "with or in a close relationship",
                            "label": "GOOD",
                            "wordRootLabel": "GOOD",
                            "pronunciationId": 11358,
                            "phonemes": "G UH D",
                            "example": "She and I have been good friends since high school.",
                            "partOfSpeech": "adjective",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 6,
                            "cambridgeBand": 2,
                            "usageCount": 38,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/g/good_46877_2279.mp3",
                            "wordAdapter": {
                                "id": 24708,
                                "wordId": 15352,
                                "wordHeadId": 35,
                                "wordRootId": 77623,
                                "wordInstanceId": 54824,
                                "wordUsageCount": 0,
                                "headUsageCount": 5443,
                                "rootUsageCount": 38,
                                "instanceUsageCount": 38,
                                "sharedMeaningId": 6663,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 14679,
                            "pronunciation": {
                                "id": 11358,
                                "phonemes": "G UH D",
                                "assetId": 2279,
                                "syllableCount": 1,
                                "phones": [
                                    {
                                        "id": 25,
                                        "label": "G"
                                    },
                                    {
                                        "id": 15,
                                        "label": "UH"
                                    },
                                    {
                                        "id": 39,
                                        "label": "D"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739407000,
                                "dateModified": 1684739407000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 31744,
                            "wordInstanceId": 21222,
                            "wordRootId": 21222,
                            "sharedMeaningId": 15604,
                            "wordFamilyId": 3257,
                            "wordDefinitionId": 14186,
                            "definition": "to a complete degree",
                            "definitionEn": "to a complete degree",
                            "label": "WHOLE",
                            "wordRootLabel": "WHOLE",
                            "pronunciationId": 9725,
                            "phonemes": "HH OW L",
                            "example": "They presented a whole new idea for their project. ",
                            "partOfSpeech": "adverb",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 7,
                            "cambridgeBand": 7,
                            "usageCount": 62,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/h/hole_53514_6474.mp3",
                            "wordAdapter": {
                                "id": 48539,
                                "wordId": 31744,
                                "wordHeadId": 283,
                                "wordRootId": 200864,
                                "wordInstanceId": 44359,
                                "wordUsageCount": 0,
                                "headUsageCount": 885,
                                "rootUsageCount": 61,
                                "instanceUsageCount": 56,
                                "sharedMeaningId": 15604,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 329740,
                            "pronunciation": {
                                "id": 9725,
                                "phonemes": "HH OW L",
                                "assetId": 6474,
                                "syllableCount": 1,
                                "phones": [
                                    {
                                        "id": 6,
                                        "label": "HH"
                                    },
                                    {
                                        "id": 17,
                                        "label": "OW"
                                    },
                                    {
                                        "id": 12,
                                        "label": "L"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739359000,
                                "dateModified": 1684739359000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        }
                    ],
                    "examples": [
                        {
                            "id": 575623,
                            "dialogId": 40532,
                            "sequence": 56,
                            "characterId": 3164,
                            "transcript": "We'll check with you again after breakfast.",
                            "videoURL": "https://cdna.qaenglishcentral.com/dialogs/40532/lineclip_40532_575623_136826_20230609055314.mp4",
                            "thumbnailURL": "https://cdna.qaenglishcentral.com/dialogs/40532/linethumb_40532_575623_136826_20230609055314.jpg",
                            "cueStart": 136995,
                            "cueEnd": 139080,
                            "slowSpeakStart": 205642,
                            "slowSpeakEnd": 208845,
                            "autoPause": false,
                            "pointsMax": 11,
                            "wordDetails": [
                                {
                                    "id": 61393,
                                    "wordInstanceId": 100022,
                                    "wordRootId": 43520,
                                    "sharedMeaningId": 31207,
                                    "wordFamilyId": 7007,
                                    "wordDefinitionId": 28601,
                                    "definition": "the first meal in the morning",
                                    "definitionEn": "the first meal in the morning",
                                    "label": "BREAKFAST",
                                    "wordRootLabel": "BREAKFAST",
                                    "pronunciationId": 38642,
                                    "phonemes": "B R EH K F AH S T",
                                    "example": "Jane always ate breakfast before going to work. ",
                                    "partOfSpeech": "noun",
                                    "baseForm": true,
                                    "featured": false,
                                    "excluded": false,
                                    "sequence": 7,
                                    "adjectiveType": 0,
                                    "nounType": 3,
                                    "wordLanguage": "en",
                                    "difficultyLevel": 2,
                                    "cambridgeBand": 38,
                                    "usageCount": 406,
                                    "audioURL": "https://cdna.qaenglishcentral.com/words/b/breakfast_13765_3327.mp3",
                                    "wordAdapter": {
                                        "id": 100022,
                                        "wordId": 61393,
                                        "wordHeadId": 618,
                                        "wordRootId": 402072,
                                        "wordInstanceId": 50464,
                                        "wordUsageCount": 0,
                                        "headUsageCount": 367,
                                        "rootUsageCount": 366,
                                        "instanceUsageCount": 365,
                                        "sharedMeaningId": 31207,
                                        "wordFamilyId": null,
                                        "headPick": true,
                                        "rootPick": true
                                    },
                                    "canonicalDialogLineId": 575623,
                                    "pronunciation": {
                                        "id": 38642,
                                        "phonemes": "B R EH K F AH S T",
                                        "assetId": 3327,
                                        "syllableCount": 2,
                                        "phones": [
                                            {
                                                "id": 8,
                                                "label": "B"
                                            },
                                            {
                                                "id": 19,
                                                "label": "R"
                                            },
                                            {
                                                "id": 18,
                                                "label": "EH"
                                            },
                                            {
                                                "id": 30,
                                                "label": "K"
                                            },
                                            {
                                                "id": 3,
                                                "label": "F"
                                            },
                                            {
                                                "id": 29,
                                                "label": "AH"
                                            },
                                            {
                                                "id": 27,
                                                "label": "S"
                                            },
                                            {
                                                "id": 38,
                                                "label": "T"
                                            }
                                        ],
                                        "active": true,
                                        "dateAdded": 1684740762000,
                                        "dateModified": 1684740762000
                                    },
                                    "properNoun": false,
                                    "cliplistKeyword": false,
                                    "studiable": true,
                                    "idiom": false
                                }
                            ],
                            "dialogTitle": "Morning Rounds Before the Surgery"
                        }
                    ]
                },
                {
                    "type": "XQuizWord",
                    "modeId": 1,
                    "previouslyEncountered": false,
                    "word": {
                        "id": 62060,
                        "wordInstanceId": 58863,
                        "wordRootId": 34597,
                        "sharedMeaningId": 31580,
                        "wordFamilyId": 5503,
                        "wordDefinitionId": 28920,
                        "definition": "a piece of furniture with a flat top and legs",
                        "definitionEn": "a piece of furniture with a flat top",
                        "label": "TABLE",
                        "wordRootLabel": "TABLE",
                        "pronunciationId": 25484,
                        "phonemes": "T EY B AH L",
                        "example": "I reserved a table at my favorite restaurant",
                        "partOfSpeech": "noun",
                        "baseForm": true,
                        "featured": false,
                        "excluded": false,
                        "adjectiveType": 0,
                        "nounType": 3,
                        "wordLanguage": "en",
                        "difficultyLevel": 1,
                        "cambridgeBand": 10,
                        "usageCount": 574,
                        "audioURL": "https://cdna.qaenglishcentral.com/words/t/table_113810_2623.mp3",
                        "wordAdapter": {
                            "id": 101008,
                            "wordId": 62060,
                            "wordHeadId": 337,
                            "wordRootId": 416996,
                            "wordInstanceId": 39913,
                            "wordUsageCount": 0,
                            "headUsageCount": 607,
                            "rootUsageCount": 545,
                            "instanceUsageCount": 469,
                            "sharedMeaningId": 31580,
                            "wordFamilyId": null,
                            "headPick": true,
                            "rootPick": true
                        },
                        "canonicalDialogLineId": 562358,
                        "pronunciation": {
                            "id": 25484,
                            "phonemes": "T EY B AH L",
                            "assetId": 2623,
                            "syllableCount": 2,
                            "phones": [
                                {
                                    "id": 38,
                                    "label": "T"
                                },
                                {
                                    "id": 26,
                                    "label": "EY"
                                },
                                {
                                    "id": 8,
                                    "label": "B"
                                },
                                {
                                    "id": 29,
                                    "label": "AH"
                                },
                                {
                                    "id": 12,
                                    "label": "L"
                                }
                            ],
                            "active": true,
                            "dateAdded": 1684739936000,
                            "dateModified": 1684739936000
                        },
                        "properNoun": false,
                        "cliplistKeyword": false,
                        "studiable": true,
                        "idiom": false
                    },
                    "distractors": [
                        {
                            "id": 50333,
                            "wordInstanceId": 65979,
                            "wordRootId": 61164,
                            "sharedMeaningId": 25032,
                            "wordFamilyId": 9188,
                            "wordDefinitionId": 23063,
                            "definition": "a group of things that are developed from an earlier type",
                            "definitionEn": "a group of things developed from an earlier type",
                            "label": "GENERATION",
                            "wordRootLabel": "GENERATION",
                            "pronunciationId": 27767,
                            "phonemes": "JH EH N ER EY SH AH N",
                            "example": "the third generation of computers",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 5,
                            "cambridgeBand": 21,
                            "usageCount": 35,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/g/generation_44987_4774.mp3",
                            "wordAdapter": {
                                "id": 82188,
                                "wordId": 50333,
                                "wordHeadId": 888,
                                "wordRootId": 74841,
                                "wordInstanceId": 46107,
                                "wordUsageCount": 0,
                                "headUsageCount": 375,
                                "rootUsageCount": 33,
                                "instanceUsageCount": 29,
                                "sharedMeaningId": 25032,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 36075,
                            "pronunciation": {
                                "id": 27767,
                                "phonemes": "JH EH N ER EY SH AH N",
                                "assetId": 4774,
                                "syllableCount": 4,
                                "phones": [
                                    {
                                        "id": 22,
                                        "label": "JH"
                                    },
                                    {
                                        "id": 18,
                                        "label": "EH"
                                    },
                                    {
                                        "id": 9,
                                        "label": "N"
                                    },
                                    {
                                        "id": 11,
                                        "label": "ER"
                                    },
                                    {
                                        "id": 26,
                                        "label": "EY"
                                    },
                                    {
                                        "id": 20,
                                        "label": "SH"
                                    },
                                    {
                                        "id": 29,
                                        "label": "AH"
                                    },
                                    {
                                        "id": 9,
                                        "label": "N"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684740069000,
                                "dateModified": 1684740069000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 24478,
                            "wordInstanceId": 8902,
                            "wordRootId": 8902,
                            "sharedMeaningId": 11681,
                            "wordFamilyId": 1321,
                            "wordDefinitionId": 10520,
                            "definition": "a decorative or artistic work",
                            "definitionEn": "a decorative or artistic work",
                            "label": "DESIGN",
                            "wordRootLabel": "DESIGN",
                            "pronunciationId": 3869,
                            "phonemes": "D IH Z AY N",
                            "example": "the coach had a design on the doors",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 6,
                            "cambridgeBand": 10,
                            "usageCount": 98,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/d/design_29444_6744.mp3",
                            "wordAdapter": {
                                "id": 38055,
                                "wordId": 24478,
                                "wordHeadId": 789,
                                "wordRootId": 48666,
                                "wordInstanceId": 62757,
                                "wordUsageCount": 0,
                                "headUsageCount": 1214,
                                "rootUsageCount": 95,
                                "instanceUsageCount": 38,
                                "sharedMeaningId": 11681,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": false
                            },
                            "canonicalDialogLineId": 194079,
                            "pronunciation": {
                                "id": 3869,
                                "phonemes": "D IH Z AY N",
                                "assetId": 6744,
                                "syllableCount": 2,
                                "phones": [
                                    {
                                        "id": 39,
                                        "label": "D"
                                    },
                                    {
                                        "id": 36,
                                        "label": "IH"
                                    },
                                    {
                                        "id": 13,
                                        "label": "Z"
                                    },
                                    {
                                        "id": 35,
                                        "label": "AY"
                                    },
                                    {
                                        "id": 9,
                                        "label": "N"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739219000,
                                "dateModified": 1684739219000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 47419,
                            "wordInstanceId": 19345,
                            "wordRootId": 19345,
                            "sharedMeaningId": 23690,
                            "wordFamilyId": 10682,
                            "wordDefinitionId": 21785,
                            "definition": "an instance of a disease",
                            "definitionEn": "an instance of a disease",
                            "label": "CASE",
                            "wordRootLabel": "CASE",
                            "pronunciationId": 9047,
                            "phonemes": "K EY S",
                            "example": "it was a case of bad judgment",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 4,
                            "usageCount": 98,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/c/case_17836_2103.mp3",
                            "wordAdapter": {
                                "id": 75973,
                                "wordId": 47419,
                                "wordHeadId": 51195,
                                "wordRootId": 27731,
                                "wordInstanceId": 73716,
                                "wordUsageCount": 0,
                                "headUsageCount": 98,
                                "rootUsageCount": 98,
                                "instanceUsageCount": 13,
                                "sharedMeaningId": 23690,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": false
                            },
                            "canonicalDialogLineId": 205762,
                            "pronunciation": {
                                "id": 9047,
                                "phonemes": "K EY S",
                                "assetId": 2103,
                                "syllableCount": 1,
                                "phones": [
                                    {
                                        "id": 30,
                                        "label": "K"
                                    },
                                    {
                                        "id": 26,
                                        "label": "EY"
                                    },
                                    {
                                        "id": 27,
                                        "label": "S"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739337000,
                                "dateModified": 1684739337000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        }
                    ],
                    "examples": [
                        {
                            "id": 562358,
                            "dialogId": 40196,
                            "sequence": 3,
                            "transcript": "The table is under the lights.",
                            "videoURL": "https://cdna.qaenglishcentral.com/dialogs/40196/lineclip_40196_562358_6671_20220608052702.mp4",
                            "thumbnailURL": "https://cdna.qaenglishcentral.com/dialogs/40196/linethumb_40196_562358_6671_20220608052702.jpg",
                            "cueStart": 6671,
                            "cueEnd": 8489,
                            "slowSpeakStart": 10157,
                            "slowSpeakEnd": 12958,
                            "autoPause": false,
                            "pointsMax": 11,
                            "wordDetails": [
                                {
                                    "id": 62060,
                                    "wordInstanceId": 58863,
                                    "wordRootId": 34597,
                                    "sharedMeaningId": 31580,
                                    "wordFamilyId": 5503,
                                    "wordDefinitionId": 28920,
                                    "definition": "a piece of furniture with a flat top and legs",
                                    "definitionEn": "a piece of furniture with a flat top and legs",
                                    "label": "TABLE",
                                    "wordRootLabel": "TABLE",
                                    "pronunciationId": 25484,
                                    "phonemes": "T EY B AH L",
                                    "example": "I reserved a table at my favorite restaurant",
                                    "partOfSpeech": "noun",
                                    "baseForm": true,
                                    "featured": false,
                                    "excluded": false,
                                    "sequence": 2,
                                    "adjectiveType": 0,
                                    "nounType": 3,
                                    "wordLanguage": "en",
                                    "difficultyLevel": 1,
                                    "cambridgeBand": 10,
                                    "usageCount": 574,
                                    "audioURL": "https://cdna.qaenglishcentral.com/words/t/table_113810_2623.mp3",
                                    "wordAdapter": {
                                        "id": 101008,
                                        "wordId": 62060,
                                        "wordHeadId": 337,
                                        "wordRootId": 416996,
                                        "wordInstanceId": 39913,
                                        "wordUsageCount": 0,
                                        "headUsageCount": 607,
                                        "rootUsageCount": 545,
                                        "instanceUsageCount": 469,
                                        "sharedMeaningId": 31580,
                                        "wordFamilyId": null,
                                        "headPick": true,
                                        "rootPick": true
                                    },
                                    "canonicalDialogLineId": 562358,
                                    "pronunciation": {
                                        "id": 25484,
                                        "phonemes": "T EY B AH L",
                                        "assetId": 2623,
                                        "syllableCount": 2,
                                        "phones": [
                                            {
                                                "id": 38,
                                                "label": "T"
                                            },
                                            {
                                                "id": 26,
                                                "label": "EY"
                                            },
                                            {
                                                "id": 8,
                                                "label": "B"
                                            },
                                            {
                                                "id": 29,
                                                "label": "AH"
                                            },
                                            {
                                                "id": 12,
                                                "label": "L"
                                            }
                                        ],
                                        "active": true,
                                        "dateAdded": 1684739936000,
                                        "dateModified": 1684739936000
                                    },
                                    "properNoun": false,
                                    "cliplistKeyword": false,
                                    "studiable": true,
                                    "idiom": false
                                }
                            ],
                            "dialogTitle": "Above and Under"
                        }
                    ]
                },
                {
                    "type": "XQuizWord",
                    "modeId": 1,
                    "previouslyEncountered": false,
                    "word": {
                        "id": 62537,
                        "wordInstanceId": 29758,
                        "wordRootId": 29697,
                        "sharedMeaningId": 31845,
                        "wordFamilyId": 4541,
                        "wordDefinitionId": 29142,
                        "definition": "a physical activity in which teams compete",
                        "definitionEn": "a contest using physical skills",
                        "label": "SPORT",
                        "wordRootLabel": "SPORT",
                        "pronunciationId": 13368,
                        "phonemes": "S P AO R T",
                        "example": "Basketball is my favorite sport to play and watch.",
                        "partOfSpeech": "noun",
                        "baseForm": true,
                        "featured": false,
                        "excluded": false,
                        "adjectiveType": 0,
                        "nounType": 3,
                        "wordLanguage": "en",
                        "difficultyLevel": 1,
                        "cambridgeBand": 12,
                        "usageCount": 849,
                        "audioURL": "https://cdna.qaenglishcentral.com/words/s/sport_109314_6032.mp3",
                        "wordAdapter": {
                            "id": 101728,
                            "wordId": 62537,
                            "wordHeadId": 437,
                            "wordRootId": 416337,
                            "wordInstanceId": 47458,
                            "wordUsageCount": 0,
                            "headUsageCount": 922,
                            "rootUsageCount": 832,
                            "instanceUsageCount": 305,
                            "sharedMeaningId": 31845,
                            "wordFamilyId": null,
                            "headPick": false,
                            "rootPick": false
                        },
                        "canonicalDialogLineId": 145948,
                        "pronunciation": {
                            "id": 13368,
                            "phonemes": "S P AO R T",
                            "assetId": 6032,
                            "syllableCount": 1,
                            "phones": [
                                {
                                    "id": 27,
                                    "label": "S"
                                },
                                {
                                    "id": 23,
                                    "label": "P"
                                },
                                {
                                    "id": 40,
                                    "label": "AO"
                                },
                                {
                                    "id": 19,
                                    "label": "R"
                                },
                                {
                                    "id": 38,
                                    "label": "T"
                                }
                            ],
                            "active": true,
                            "dateAdded": 1684739466000,
                            "dateModified": 1684739466000
                        },
                        "properNoun": false,
                        "cliplistKeyword": false,
                        "studiable": true,
                        "idiom": false
                    },
                    "distractors": [
                        {
                            "id": 45702,
                            "wordInstanceId": 1597,
                            "wordRootId": 1597,
                            "sharedMeaningId": 22874,
                            "wordFamilyId": 10447,
                            "wordDefinitionId": 21018,
                            "definition": "a belief about what is important or acceptable",
                            "definitionEn": "a belief about what is important",
                            "label": "VALUE",
                            "wordRootLabel": "VALUE",
                            "pronunciationId": 812,
                            "phonemes": "V AE L Y UW",
                            "example": "Honesty is my most important value.",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 5,
                            "cambridgeBand": 7,
                            "usageCount": 144,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/v/value_121187_5619.mp3",
                            "wordAdapter": {
                                "id": 72469,
                                "wordId": 45702,
                                "wordHeadId": 36286,
                                "wordRootId": 194744,
                                "wordInstanceId": 256975,
                                "wordUsageCount": 0,
                                "headUsageCount": 143,
                                "rootUsageCount": 143,
                                "instanceUsageCount": 5,
                                "sharedMeaningId": 22874,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": false
                            },
                            "canonicalDialogLineId": 330760,
                            "pronunciation": {
                                "id": 812,
                                "phonemes": "V AE L Y UW",
                                "assetId": 5619,
                                "syllableCount": 2,
                                "phones": [
                                    {
                                        "id": 21,
                                        "label": "V"
                                    },
                                    {
                                        "id": 34,
                                        "label": "AE"
                                    },
                                    {
                                        "id": 12,
                                        "label": "L"
                                    },
                                    {
                                        "id": 28,
                                        "label": "Y"
                                    },
                                    {
                                        "id": 24,
                                        "label": "UW"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739148000,
                                "dateModified": 1684739148000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 44784,
                            "wordInstanceId": 70652,
                            "wordRootId": 70652,
                            "sharedMeaningId": 22475,
                            "wordFamilyId": 10327,
                            "wordDefinitionId": 20646,
                            "definition": "the ability to make quick choices",
                            "definitionEn": "the ability to make choices",
                            "label": "DECISION",
                            "wordRootLabel": "DECISION",
                            "pronunciationId": 29216,
                            "phonemes": "D IH S IH ZH AH N",
                            "example": "I have to make a decision on which major I will take in college.",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 4,
                            "cambridgeBand": 10,
                            "usageCount": 2,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/d/decision_27748_6743.mp3",
                            "wordAdapter": {
                                "id": 70652,
                                "wordId": 44784,
                                "wordHeadId": 292,
                                "wordRootId": 404391,
                                "wordInstanceId": 297295,
                                "wordUsageCount": 0,
                                "headUsageCount": 530,
                                "rootUsageCount": 2,
                                "instanceUsageCount": 2,
                                "sharedMeaningId": 22475,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": true
                            },
                            "pronunciation": {
                                "id": 29216,
                                "phonemes": "D IH S IH ZH AH N",
                                "assetId": 6743,
                                "syllableCount": 3,
                                "phones": [
                                    {
                                        "id": 39,
                                        "label": "D"
                                    },
                                    {
                                        "id": 36,
                                        "label": "IH"
                                    },
                                    {
                                        "id": 27,
                                        "label": "S"
                                    },
                                    {
                                        "id": 36,
                                        "label": "IH"
                                    },
                                    {
                                        "id": 7,
                                        "label": "ZH"
                                    },
                                    {
                                        "id": 29,
                                        "label": "AH"
                                    },
                                    {
                                        "id": 9,
                                        "label": "N"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684740158000,
                                "dateModified": 1684740158000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 44708,
                            "wordInstanceId": 70482,
                            "wordRootId": 70482,
                            "sharedMeaningId": 22442,
                            "wordFamilyId": 10318,
                            "wordDefinitionId": 20615,
                            "definition": "a job that is done for a long time",
                            "definitionEn": "a job that is done for a long time",
                            "label": "CAREER",
                            "wordRootLabel": "CAREER",
                            "pronunciationId": 29179,
                            "phonemes": "K ER R IH R",
                            "example": "THE BUSINESSMAN HAS BEEN SUCCESSFUL WITH HIS CAREER ALL THESE YEARS.",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 4,
                            "cambridgeBand": 19,
                            "usageCount": 448,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/c/career_207387_70693.mp3",
                            "wordAdapter": {
                                "id": 70482,
                                "wordId": 44708,
                                "wordHeadId": 734,
                                "wordRootId": 402498,
                                "wordInstanceId": 64558,
                                "wordUsageCount": 0,
                                "headUsageCount": 438,
                                "rootUsageCount": 436,
                                "instanceUsageCount": 384,
                                "sharedMeaningId": 22442,
                                "wordFamilyId": null,
                                "headPick": true,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 95874,
                            "pronunciation": {
                                "id": 29179,
                                "phonemes": "K ER R IH R",
                                "assetId": 70693,
                                "syllableCount": 2,
                                "phones": [
                                    {
                                        "id": 30,
                                        "label": "K"
                                    },
                                    {
                                        "id": 11,
                                        "label": "ER"
                                    },
                                    {
                                        "id": 19,
                                        "label": "R"
                                    },
                                    {
                                        "id": 36,
                                        "label": "IH"
                                    },
                                    {
                                        "id": 19,
                                        "label": "R"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684740154000,
                                "dateModified": 1684740154000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        }
                    ],
                    "examples": [
                        {
                            "id": 145948,
                            "dialogId": 17564,
                            "sequence": 15,
                            "transcript": "Baseball is a team sport.",
                            "videoURL": "https://cdna.qaenglishcentral.com/dialogs/17564/lineclip_17564_145948_53511_20170306072411.mp4",
                            "thumbnailURL": "https://cdna.qaenglishcentral.com/dialogs/17564/linethumb_17564_145948_53511_20170306072411.jpg",
                            "cueStart": 53511,
                            "cueEnd": 55550,
                            "slowSpeakStart": 80416,
                            "slowSpeakEnd": 83550,
                            "autoPause": false,
                            "pointsMax": 21,
                            "wordDetails": [
                                {
                                    "id": 62537,
                                    "wordInstanceId": 29758,
                                    "wordRootId": 29697,
                                    "sharedMeaningId": 31845,
                                    "wordFamilyId": 4541,
                                    "wordDefinitionId": 29142,
                                    "definition": "a physical activity in which teams compete",
                                    "definitionEn": "a physical activity in which teams compete",
                                    "label": "SPORT",
                                    "wordRootLabel": "SPORT",
                                    "pronunciationId": 13368,
                                    "phonemes": "S P AO R T",
                                    "example": "Basketball is my favorite sport to play and watch.",
                                    "partOfSpeech": "noun",
                                    "baseForm": true,
                                    "featured": false,
                                    "excluded": false,
                                    "sequence": 5,
                                    "adjectiveType": 0,
                                    "nounType": 3,
                                    "wordLanguage": "en",
                                    "difficultyLevel": 1,
                                    "cambridgeBand": 12,
                                    "usageCount": 849,
                                    "audioURL": "https://cdna.qaenglishcentral.com/words/s/sport_109314_6032.mp3",
                                    "wordAdapter": {
                                        "id": 101728,
                                        "wordId": 62537,
                                        "wordHeadId": 437,
                                        "wordRootId": 416337,
                                        "wordInstanceId": 47458,
                                        "wordUsageCount": 0,
                                        "headUsageCount": 922,
                                        "rootUsageCount": 832,
                                        "instanceUsageCount": 305,
                                        "sharedMeaningId": 31845,
                                        "wordFamilyId": null,
                                        "headPick": false,
                                        "rootPick": false
                                    },
                                    "canonicalDialogLineId": 145948,
                                    "pronunciation": {
                                        "id": 13368,
                                        "phonemes": "S P AO R T",
                                        "assetId": 6032,
                                        "syllableCount": 1,
                                        "phones": [
                                            {
                                                "id": 27,
                                                "label": "S"
                                            },
                                            {
                                                "id": 23,
                                                "label": "P"
                                            },
                                            {
                                                "id": 40,
                                                "label": "AO"
                                            },
                                            {
                                                "id": 19,
                                                "label": "R"
                                            },
                                            {
                                                "id": 38,
                                                "label": "T"
                                            }
                                        ],
                                        "active": true,
                                        "dateAdded": 1684739466000,
                                        "dateModified": 1684739466000
                                    },
                                    "properNoun": false,
                                    "cliplistKeyword": false,
                                    "studiable": true,
                                    "idiom": false
                                }
                            ],
                            "dialogTitle": "Baseball is a Team Sport"
                        }
                    ]
                },
                {
                    "type": "XQuizWord",
                    "modeId": 1,
                    "previouslyEncountered": false,
                    "word": {
                        "id": 69402,
                        "wordInstanceId": 111031,
                        "wordRootId": 111031,
                        "sharedMeaningId": 36083,
                        "wordFamilyId": 15682,
                        "wordDefinitionId": 32929,
                        "definition": "a unit of people or things",
                        "definitionEn": "a unit of people or things",
                        "label": "GROUP",
                        "wordRootLabel": "GROUP",
                        "pronunciationId": 43429,
                        "phonemes": "G R UW P",
                        "example": "Group A will be on the right, Group B will be in the middle and Group C will be on the left.",
                        "partOfSpeech": "noun",
                        "baseForm": true,
                        "featured": false,
                        "excluded": false,
                        "adjectiveType": 0,
                        "nounType": 3,
                        "wordLanguage": "en",
                        "difficultyLevel": 1,
                        "cambridgeBand": 4,
                        "usageCount": 1318,
                        "audioURL": "https://cdna.qaenglishcentral.com/words/g/group_48405_2285.mp3",
                        "wordAdapter": {
                            "id": 111033,
                            "wordId": 69402,
                            "wordHeadId": 65,
                            "wordRootId": 407614,
                            "wordInstanceId": 40803,
                            "wordUsageCount": 0,
                            "headUsageCount": 1333,
                            "rootUsageCount": 1301,
                            "instanceUsageCount": 883,
                            "sharedMeaningId": 36083,
                            "wordFamilyId": null,
                            "headPick": true,
                            "rootPick": true
                        },
                        "canonicalDialogLineId": 10789,
                        "pronunciation": {
                            "id": 43429,
                            "phonemes": "G R UW P",
                            "assetId": 2285,
                            "syllableCount": 1,
                            "phones": [
                                {
                                    "id": 25,
                                    "label": "G"
                                },
                                {
                                    "id": 19,
                                    "label": "R"
                                },
                                {
                                    "id": 24,
                                    "label": "UW"
                                },
                                {
                                    "id": 23,
                                    "label": "P"
                                }
                            ],
                            "active": true,
                            "dateAdded": 1684741065000,
                            "dateModified": 1684741065000
                        },
                        "properNoun": false,
                        "cliplistKeyword": false,
                        "studiable": true,
                        "idiom": false
                    },
                    "distractors": [
                        {
                            "id": 99972,
                            "wordInstanceId": 39563,
                            "wordRootId": 16132,
                            "sharedMeaningId": 56010,
                            "wordFamilyId": 2552,
                            "wordDefinitionId": 50302,
                            "definition": "a place where battles and other military activities happen",
                            "definitionEn": "a place where military activities happen",
                            "label": "FIELD",
                            "wordRootLabel": "FIELD",
                            "pronunciationId": 26036,
                            "phonemes": "F IY L D",
                            "example": "Soldiers put a lot of mines in that field.",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 7,
                            "cambridgeBand": 12,
                            "usageCount": 10,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/f/field_40289_11160.mp3",
                            "wordAdapter": {
                                "id": 151951,
                                "wordId": 99972,
                                "wordHeadId": 265,
                                "wordRootId": 66558,
                                "wordInstanceId": 284167,
                                "wordUsageCount": 0,
                                "headUsageCount": 494,
                                "rootUsageCount": 10,
                                "instanceUsageCount": 8,
                                "sharedMeaningId": 56010,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 394218,
                            "pronunciation": {
                                "id": 26036,
                                "phonemes": "F IY L D",
                                "assetId": 11160,
                                "syllableCount": 1,
                                "phones": [
                                    {
                                        "id": 3,
                                        "label": "F"
                                    },
                                    {
                                        "id": 1,
                                        "label": "IY"
                                    },
                                    {
                                        "id": 12,
                                        "label": "L"
                                    },
                                    {
                                        "id": 39,
                                        "label": "D"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739972000,
                                "dateModified": 1684739972000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 41918,
                            "wordInstanceId": 3298,
                            "wordRootId": 3298,
                            "sharedMeaningId": 21034,
                            "wordFamilyId": 589,
                            "wordDefinitionId": 19293,
                            "definition": "an action done to achieve something",
                            "definitionEn": "an action done to achieve something",
                            "label": "STEP",
                            "wordRootLabel": "STEP",
                            "pronunciationId": 1461,
                            "phonemes": "S T EH P",
                            "example": "The new law is a step towards improving the city.",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 5,
                            "cambridgeBand": 11,
                            "usageCount": 133,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/s/step_110601_5484.mp3",
                            "wordAdapter": {
                                "id": 65479,
                                "wordId": 41918,
                                "wordHeadId": 657,
                                "wordRootId": 171232,
                                "wordInstanceId": 102525,
                                "wordUsageCount": 0,
                                "headUsageCount": 1165,
                                "rootUsageCount": 131,
                                "instanceUsageCount": 69,
                                "sharedMeaningId": 21034,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 306192,
                            "pronunciation": {
                                "id": 1461,
                                "phonemes": "S T EH P",
                                "assetId": 5484,
                                "syllableCount": 1,
                                "phones": [
                                    {
                                        "id": 27,
                                        "label": "S"
                                    },
                                    {
                                        "id": 38,
                                        "label": "T"
                                    },
                                    {
                                        "id": 18,
                                        "label": "EH"
                                    },
                                    {
                                        "id": 23,
                                        "label": "P"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739162000,
                                "dateModified": 1684739162000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 62929,
                            "wordInstanceId": 36016,
                            "wordRootId": 34778,
                            "sharedMeaningId": 32086,
                            "wordFamilyId": 5529,
                            "wordDefinitionId": 29337,
                            "definition": "the second base that must be touched",
                            "definitionEn": "the second base that must be touched",
                            "label": "SECOND",
                            "wordRootLabel": "SECOND",
                            "pronunciationId": 16947,
                            "phonemes": "S EH K AH N D",
                            "example": "There's a runner on second so keep an eye on him.",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 7,
                            "cambridgeBand": 6,
                            "usageCount": 1,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/s/second_103376_3387.mp3",
                            "wordAdapter": {
                                "id": 102297,
                                "wordId": 62929,
                                "wordHeadId": 221,
                                "wordRootId": 156190,
                                "wordInstanceId": 88069,
                                "wordUsageCount": 0,
                                "headUsageCount": 1543,
                                "rootUsageCount": 1,
                                "instanceUsageCount": 1,
                                "sharedMeaningId": 32086,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 11872,
                            "pronunciation": {
                                "id": 16947,
                                "phonemes": "S EH K AH N D",
                                "label": "SECOND",
                                "assetId": 3387,
                                "syllableCount": 2,
                                "phones": [
                                    {
                                        "id": 27,
                                        "label": "S"
                                    },
                                    {
                                        "id": 18,
                                        "label": "EH"
                                    },
                                    {
                                        "id": 30,
                                        "label": "K"
                                    },
                                    {
                                        "id": 29,
                                        "label": "AH"
                                    },
                                    {
                                        "id": 9,
                                        "label": "N"
                                    },
                                    {
                                        "id": 39,
                                        "label": "D"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739563000,
                                "dateModified": 1687218583000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        }
                    ],
                    "examples": [
                        {
                            "id": 10789,
                            "dialogId": 10585,
                            "sequence": 11,
                            "characterId": 823,
                            "transcript": "It's just a small group of friends.",
                            "videoURL": "https://cdna.qaenglishcentral.com/dialogs/10585/lineclip_10585_10789_31565.mp4",
                            "thumbnailURL": "https://cdna.qaenglishcentral.com/dialogs/10585/linethumb_381193_20120925171111.jpg",
                            "cueStart": 31565,
                            "cueEnd": 33765,
                            "slowSpeakStart": 47405,
                            "slowSpeakEnd": 50665,
                            "autoPause": false,
                            "pointsMax": 26,
                            "wordDetails": [
                                {
                                    "id": 69402,
                                    "wordInstanceId": 111031,
                                    "wordRootId": 111031,
                                    "sharedMeaningId": 36083,
                                    "wordFamilyId": 15682,
                                    "wordDefinitionId": 32929,
                                    "definition": "a unit of people or things",
                                    "definitionEn": "a unit of people or things",
                                    "label": "GROUP",
                                    "wordRootLabel": "GROUP",
                                    "pronunciationId": 43429,
                                    "phonemes": "G R UW P",
                                    "example": "Group A will be on the right, Group B will be in the middle and Group C will be on the left.",
                                    "partOfSpeech": "noun",
                                    "baseForm": true,
                                    "featured": false,
                                    "excluded": false,
                                    "sequence": 5,
                                    "adjectiveType": 0,
                                    "nounType": 3,
                                    "wordLanguage": "en",
                                    "difficultyLevel": 1,
                                    "cambridgeBand": 4,
                                    "usageCount": 1318,
                                    "audioURL": "https://cdna.qaenglishcentral.com/words/g/group_48405_2285.mp3",
                                    "wordAdapter": {
                                        "id": 111033,
                                        "wordId": 69402,
                                        "wordHeadId": 65,
                                        "wordRootId": 407614,
                                        "wordInstanceId": 40803,
                                        "wordUsageCount": 0,
                                        "headUsageCount": 1333,
                                        "rootUsageCount": 1301,
                                        "instanceUsageCount": 883,
                                        "sharedMeaningId": 36083,
                                        "wordFamilyId": null,
                                        "headPick": true,
                                        "rootPick": true
                                    },
                                    "canonicalDialogLineId": 10789,
                                    "pronunciation": {
                                        "id": 43429,
                                        "phonemes": "G R UW P",
                                        "assetId": 2285,
                                        "syllableCount": 1,
                                        "phones": [
                                            {
                                                "id": 25,
                                                "label": "G"
                                            },
                                            {
                                                "id": 19,
                                                "label": "R"
                                            },
                                            {
                                                "id": 24,
                                                "label": "UW"
                                            },
                                            {
                                                "id": 23,
                                                "label": "P"
                                            }
                                        ],
                                        "active": true,
                                        "dateAdded": 1684741065000,
                                        "dateModified": 1684741065000
                                    },
                                    "properNoun": false,
                                    "cliplistKeyword": false,
                                    "studiable": true,
                                    "idiom": false
                                }
                            ],
                            "dialogTitle": "Eddie and Linh: Friday Night plans?"
                        }
                    ]
                },
                {
                    "type": "XQuizWord",
                    "modeId": 1,
                    "previouslyEncountered": false,
                    "word": {
                        "id": 69419,
                        "wordInstanceId": 91474,
                        "wordRootId": 8121,
                        "sharedMeaningId": 36092,
                        "wordFamilyId": 1227,
                        "wordDefinitionId": 32938,
                        "definition": "a place where people go to learn",
                        "definitionEn": "a place where people go to learn",
                        "label": "SCHOOL",
                        "wordRootLabel": "SCHOOL",
                        "pronunciationId": 34798,
                        "phonemes": "S K UW L",
                        "example": "the school was built in 1932 ",
                        "partOfSpeech": "noun",
                        "baseForm": true,
                        "featured": false,
                        "excluded": false,
                        "adjectiveType": 0,
                        "nounType": 3,
                        "wordLanguage": "en",
                        "difficultyLevel": 1,
                        "cambridgeBand": 4,
                        "usageCount": 2003,
                        "audioURL": "https://cdna.qaenglishcentral.com/words/s/school_102453_2560.mp3",
                        "wordAdapter": {
                            "id": 111068,
                            "wordId": 69419,
                            "wordHeadId": 42,
                            "wordRootId": 415151,
                            "wordInstanceId": 53719,
                            "wordUsageCount": 0,
                            "headUsageCount": 2078,
                            "rootUsageCount": 1953,
                            "instanceUsageCount": 1666,
                            "sharedMeaningId": 36092,
                            "wordFamilyId": null,
                            "headPick": true,
                            "rootPick": true
                        },
                        "canonicalDialogLineId": 140492,
                        "pronunciation": {
                            "id": 34798,
                            "phonemes": "S K UW L",
                            "assetId": 2560,
                            "syllableCount": 1,
                            "phones": [
                                {
                                    "id": 27,
                                    "label": "S"
                                },
                                {
                                    "id": 30,
                                    "label": "K"
                                },
                                {
                                    "id": 24,
                                    "label": "UW"
                                },
                                {
                                    "id": 12,
                                    "label": "L"
                                }
                            ],
                            "active": true,
                            "dateAdded": 1684740572000,
                            "dateModified": 1684740572000
                        },
                        "properNoun": false,
                        "cliplistKeyword": false,
                        "studiable": true,
                        "idiom": false
                    },
                    "distractors": [
                        {
                            "id": 94868,
                            "wordInstanceId": 26700,
                            "wordRootId": 26700,
                            "sharedMeaningId": 52495,
                            "wordFamilyId": 4143,
                            "wordDefinitionId": 47393,
                            "definition": "an opportunity to do something or a possibility",
                            "definitionEn": "an opportunity or a possibility",
                            "label": "DOOR",
                            "wordRootLabel": "DOOR",
                            "pronunciationId": 12091,
                            "phonemes": "D AO R",
                            "example": "we closed the door to Haitian immigrants ",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 6,
                            "cambridgeBand": 10,
                            "usageCount": 25,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/d/door_32338_5912.mp3",
                            "wordAdapter": {
                                "id": 144870,
                                "wordId": 94868,
                                "wordHeadId": 193,
                                "wordRootId": 53656,
                                "wordInstanceId": 60360,
                                "wordUsageCount": 0,
                                "headUsageCount": 596,
                                "rootUsageCount": 25,
                                "instanceUsageCount": 9,
                                "sharedMeaningId": 52495,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": false
                            },
                            "canonicalDialogLineId": 8831,
                            "pronunciation": {
                                "id": 12091,
                                "phonemes": "D AO R",
                                "assetId": 5912,
                                "syllableCount": 1,
                                "phones": [
                                    {
                                        "id": 39,
                                        "label": "D"
                                    },
                                    {
                                        "id": 40,
                                        "label": "AO"
                                    },
                                    {
                                        "id": 19,
                                        "label": "R"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739430000,
                                "dateModified": 1684739430000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 33171,
                            "wordInstanceId": 13111,
                            "wordRootId": 13109,
                            "sharedMeaningId": 16393,
                            "wordFamilyId": 2029,
                            "wordDefinitionId": 14909,
                            "definition": "a job in an organization",
                            "definitionEn": "a job in an organization",
                            "label": "PLACE",
                            "wordRootLabel": "PLACE",
                            "pronunciationId": 6315,
                            "phonemes": "P L EY S",
                            "example": "The talented player got a place in the basketball team.",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 4,
                            "cambridgeBand": 3,
                            "usageCount": 9,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/p/place_88598_2498.mp3",
                            "wordAdapter": {
                                "id": 50690,
                                "wordId": 33171,
                                "wordHeadId": 77,
                                "wordRootId": 131988,
                                "wordInstanceId": 41988,
                                "wordUsageCount": 0,
                                "headUsageCount": 610,
                                "rootUsageCount": 9,
                                "instanceUsageCount": 9,
                                "sharedMeaningId": 16393,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 10019,
                            "pronunciation": {
                                "id": 6315,
                                "phonemes": "P L EY S",
                                "assetId": 2498,
                                "syllableCount": 1,
                                "phones": [
                                    {
                                        "id": 23,
                                        "label": "P"
                                    },
                                    {
                                        "id": 12,
                                        "label": "L"
                                    },
                                    {
                                        "id": 26,
                                        "label": "EY"
                                    },
                                    {
                                        "id": 27,
                                        "label": "S"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739260000,
                                "dateModified": 1684739260000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 49823,
                            "wordInstanceId": 31926,
                            "wordRootId": 31923,
                            "sharedMeaningId": 24808,
                            "wordFamilyId": 7818,
                            "wordDefinitionId": 22857,
                            "definition": "the event of something burning",
                            "definitionEn": "the event of something burning",
                            "label": "FIRE",
                            "wordRootLabel": "FIRE",
                            "pronunciationId": 23692,
                            "phonemes": "F AY ER",
                            "example": "Several families lost their houses and things in the fire.",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 3,
                            "cambridgeBand": 14,
                            "usageCount": 280,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/f/fire_40725_2238.mp3",
                            "wordAdapter": {
                                "id": 81057,
                                "wordId": 49823,
                                "wordHeadId": 427,
                                "wordRootId": 67527,
                                "wordInstanceId": 131638,
                                "wordUsageCount": 0,
                                "headUsageCount": 603,
                                "rootUsageCount": 274,
                                "instanceUsageCount": 1,
                                "sharedMeaningId": 24808,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": false
                            },
                            "canonicalDialogLineId": 56231,
                            "pronunciation": {
                                "id": 23692,
                                "phonemes": "F AY ER",
                                "assetId": 2238,
                                "syllableCount": 2,
                                "phones": [
                                    {
                                        "id": 3,
                                        "label": "F"
                                    },
                                    {
                                        "id": 35,
                                        "label": "AY"
                                    },
                                    {
                                        "id": 11,
                                        "label": "ER"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739815000,
                                "dateModified": 1684739815000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        }
                    ],
                    "examples": [
                        {
                            "id": 140492,
                            "dialogId": 17311,
                            "sequence": 22,
                            "transcript": "I got to save money for school next year.",
                            "videoURL": "https://cdna.qaenglishcentral.com/dialogs/17311/lineclip_17311_140492_41653_20120522073606.mp4",
                            "thumbnailURL": "https://cdna.qaenglishcentral.com/dialogs/17311/linethumb_17311_140492_41653_20120522073606.jpg",
                            "cueStart": 41653,
                            "cueEnd": 43113,
                            "slowSpeakStart": 62630,
                            "slowSpeakEnd": 64894,
                            "autoPause": false,
                            "pointsMax": 32,
                            "wordDetails": [
                                {
                                    "id": 69419,
                                    "wordInstanceId": 91474,
                                    "wordRootId": 8121,
                                    "sharedMeaningId": 36092,
                                    "wordFamilyId": 1227,
                                    "wordDefinitionId": 32938,
                                    "definition": "a place where people go to learn",
                                    "definitionEn": "a place where people go to learn",
                                    "label": "SCHOOL",
                                    "wordRootLabel": "SCHOOL",
                                    "pronunciationId": 34798,
                                    "phonemes": "S K UW L",
                                    "example": "the school was built in 1932 ",
                                    "partOfSpeech": "noun",
                                    "baseForm": true,
                                    "featured": false,
                                    "excluded": false,
                                    "sequence": 6,
                                    "adjectiveType": 0,
                                    "nounType": 3,
                                    "wordLanguage": "en",
                                    "difficultyLevel": 1,
                                    "cambridgeBand": 4,
                                    "usageCount": 2003,
                                    "audioURL": "https://cdna.qaenglishcentral.com/words/s/school_102453_2560.mp3",
                                    "wordAdapter": {
                                        "id": 111068,
                                        "wordId": 69419,
                                        "wordHeadId": 42,
                                        "wordRootId": 415151,
                                        "wordInstanceId": 53719,
                                        "wordUsageCount": 0,
                                        "headUsageCount": 2078,
                                        "rootUsageCount": 1953,
                                        "instanceUsageCount": 1666,
                                        "sharedMeaningId": 36092,
                                        "wordFamilyId": null,
                                        "headPick": true,
                                        "rootPick": true
                                    },
                                    "canonicalDialogLineId": 140492,
                                    "pronunciation": {
                                        "id": 34798,
                                        "phonemes": "S K UW L",
                                        "assetId": 2560,
                                        "syllableCount": 1,
                                        "phones": [
                                            {
                                                "id": 27,
                                                "label": "S"
                                            },
                                            {
                                                "id": 30,
                                                "label": "K"
                                            },
                                            {
                                                "id": 24,
                                                "label": "UW"
                                            },
                                            {
                                                "id": 12,
                                                "label": "L"
                                            }
                                        ],
                                        "active": true,
                                        "dateAdded": 1684740572000,
                                        "dateModified": 1684740572000
                                    },
                                    "properNoun": false,
                                    "cliplistKeyword": false,
                                    "studiable": true,
                                    "idiom": false
                                }
                            ],
                            "dialogTitle": "Talking about Vacation Plans"
                        }
                    ]
                },
                {
                    "type": "XQuizWord",
                    "modeId": 1,
                    "previouslyEncountered": false,
                    "word": {
                        "id": 88053,
                        "wordInstanceId": 136016,
                        "wordRootId": 136016,
                        "sharedMeaningId": 47884,
                        "wordFamilyId": 20571,
                        "wordDefinitionId": 43408,
                        "definition": "a tall woody plant with branches and leaves",
                        "definitionEn": "a tall woody plant",
                        "label": "TREE",
                        "wordRootLabel": "TREE",
                        "pronunciationId": 54477,
                        "phonemes": "T R IY",
                        "example": "There is a tall tree in the garden.",
                        "partOfSpeech": "noun",
                        "baseForm": true,
                        "featured": false,
                        "excluded": false,
                        "adjectiveType": 0,
                        "nounType": 3,
                        "wordLanguage": "en",
                        "difficultyLevel": 1,
                        "cambridgeBand": 16,
                        "usageCount": 893,
                        "audioURL": "https://cdna.qaenglishcentral.com/words/t/tree_117948_11866.mp3",
                        "wordAdapter": {
                            "id": 136016,
                            "wordId": 88053,
                            "wordHeadId": 382,
                            "wordRootId": 417765,
                            "wordInstanceId": 69173,
                            "wordUsageCount": 0,
                            "headUsageCount": 886,
                            "rootUsageCount": 880,
                            "instanceUsageCount": 450,
                            "sharedMeaningId": 47884,
                            "wordFamilyId": null,
                            "headPick": true,
                            "rootPick": true
                        },
                        "canonicalDialogLineId": 127448,
                        "pronunciation": {
                            "id": 54477,
                            "phonemes": "T R IY",
                            "assetId": 11866,
                            "syllableCount": 1,
                            "phones": [
                                {
                                    "id": 38,
                                    "label": "T"
                                },
                                {
                                    "id": 19,
                                    "label": "R"
                                },
                                {
                                    "id": 1,
                                    "label": "IY"
                                }
                            ],
                            "active": true,
                            "dateAdded": 1684741803000,
                            "dateModified": 1684741803000
                        },
                        "properNoun": false,
                        "cliplistKeyword": false,
                        "studiable": true,
                        "idiom": false
                    },
                    "distractors": [
                        {
                            "id": 52107,
                            "wordInstanceId": 27960,
                            "wordRootId": 1118,
                            "sharedMeaningId": 25828,
                            "wordFamilyId": 304,
                            "wordDefinitionId": 23810,
                            "definition": "the business of buying and selling a particular thing",
                            "definitionEn": "the business of buying and selling",
                            "label": "MARKET",
                            "wordRootLabel": "MARKET",
                            "pronunciationId": 12475,
                            "phonemes": "M AA R K AH T",
                            "example": "without competition there would be no market ",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 6,
                            "cambridgeBand": 5,
                            "usageCount": 411,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/m/market_71689_5017.mp3",
                            "wordAdapter": {
                                "id": 85723,
                                "wordId": 52107,
                                "wordHeadId": 236,
                                "wordRootId": 107993,
                                "wordInstanceId": 46715,
                                "wordUsageCount": 0,
                                "headUsageCount": 1159,
                                "rootUsageCount": 404,
                                "instanceUsageCount": 354,
                                "sharedMeaningId": 25828,
                                "wordFamilyId": null,
                                "headPick": true,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 7230,
                            "pronunciation": {
                                "id": 12475,
                                "phonemes": "M AA R K AH T",
                                "assetId": 5017,
                                "syllableCount": 2,
                                "phones": [
                                    {
                                        "id": 31,
                                        "label": "M"
                                    },
                                    {
                                        "id": 5,
                                        "label": "AA"
                                    },
                                    {
                                        "id": 19,
                                        "label": "R"
                                    },
                                    {
                                        "id": 30,
                                        "label": "K"
                                    },
                                    {
                                        "id": 29,
                                        "label": "AH"
                                    },
                                    {
                                        "id": 38,
                                        "label": "T"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739443000,
                                "dateModified": 1684739443000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 72558,
                            "wordInstanceId": 66207,
                            "wordRootId": 66207,
                            "sharedMeaningId": 37916,
                            "wordFamilyId": 16463,
                            "wordDefinitionId": 34583,
                            "definition": "used to show how well or badly something has been done ",
                            "definitionEn": "used to say how well something was done",
                            "label": "JOB",
                            "wordRootLabel": "JOB",
                            "pronunciationId": 27793,
                            "phonemes": "JH AA B",
                            "example": "she did an outstanding job as Ophelia ",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 6,
                            "cambridgeBand": 5,
                            "usageCount": 42,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/j/job_59752_2354.mp3",
                            "wordAdapter": {
                                "id": 115507,
                                "wordId": 72558,
                                "wordHeadId": 36274,
                                "wordRootId": 96050,
                                "wordInstanceId": 51808,
                                "wordUsageCount": 0,
                                "headUsageCount": 42,
                                "rootUsageCount": 42,
                                "instanceUsageCount": 40,
                                "sharedMeaningId": 37916,
                                "wordFamilyId": null,
                                "headPick": true,
                                "rootPick": true
                            },
                            "canonicalDialogLineId": 23933,
                            "pronunciation": {
                                "id": 27793,
                                "phonemes": "JH AA B",
                                "assetId": 2354,
                                "syllableCount": 1,
                                "phones": [
                                    {
                                        "id": 22,
                                        "label": "JH"
                                    },
                                    {
                                        "id": 5,
                                        "label": "AA"
                                    },
                                    {
                                        "id": 8,
                                        "label": "B"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684740074000,
                                "dateModified": 1684740074000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        },
                        {
                            "id": 47419,
                            "wordInstanceId": 19345,
                            "wordRootId": 19345,
                            "sharedMeaningId": 23690,
                            "wordFamilyId": 10682,
                            "wordDefinitionId": 21785,
                            "definition": "an instance of a disease",
                            "definitionEn": "an instance of a disease",
                            "label": "CASE",
                            "wordRootLabel": "CASE",
                            "pronunciationId": 9047,
                            "phonemes": "K EY S",
                            "example": "it was a case of bad judgment",
                            "partOfSpeech": "noun",
                            "baseForm": true,
                            "featured": false,
                            "excluded": false,
                            "adjectiveType": 0,
                            "nounType": 3,
                            "wordLanguage": "en",
                            "difficultyLevel": 4,
                            "usageCount": 98,
                            "audioURL": "https://cdna.qaenglishcentral.com/words/c/case_17836_2103.mp3",
                            "wordAdapter": {
                                "id": 75973,
                                "wordId": 47419,
                                "wordHeadId": 51195,
                                "wordRootId": 27731,
                                "wordInstanceId": 73716,
                                "wordUsageCount": 0,
                                "headUsageCount": 98,
                                "rootUsageCount": 98,
                                "instanceUsageCount": 13,
                                "sharedMeaningId": 23690,
                                "wordFamilyId": null,
                                "headPick": false,
                                "rootPick": false
                            },
                            "canonicalDialogLineId": 205762,
                            "pronunciation": {
                                "id": 9047,
                                "phonemes": "K EY S",
                                "assetId": 2103,
                                "syllableCount": 1,
                                "phones": [
                                    {
                                        "id": 30,
                                        "label": "K"
                                    },
                                    {
                                        "id": 26,
                                        "label": "EY"
                                    },
                                    {
                                        "id": 27,
                                        "label": "S"
                                    }
                                ],
                                "active": true,
                                "dateAdded": 1684739337000,
                                "dateModified": 1684739337000
                            },
                            "properNoun": false,
                            "cliplistKeyword": false,
                            "idiom": false
                        }
                    ],
                    "examples": [
                        {
                            "id": 127448,
                            "dialogId": 16858,
                            "sequence": 10,
                            "transcript": "He sat under a tree.",
                            "videoURL": "https://cdna.qaenglishcentral.com/dialogs/16858/lineclip_16858_127448_48319_20120815155316.mp4",
                            "thumbnailURL": "https://cdna.qaenglishcentral.com/dialogs/16858/linethumb_16858_127448_48319_20120815155316.jpg",
                            "cueStart": 48319,
                            "cueEnd": 50063,
                            "slowSpeakStart": 72628,
                            "slowSpeakEnd": 75320,
                            "autoPause": false,
                            "pointsMax": 14,
                            "wordDetails": [
                                {
                                    "id": 88053,
                                    "wordInstanceId": 136016,
                                    "wordRootId": 136016,
                                    "sharedMeaningId": 47884,
                                    "wordFamilyId": 20571,
                                    "wordDefinitionId": 43408,
                                    "definition": "a tall woody plant with branches and leaves",
                                    "definitionEn": "a tall woody plant with branches and leaves",
                                    "label": "TREE",
                                    "wordRootLabel": "TREE",
                                    "pronunciationId": 54477,
                                    "phonemes": "T R IY",
                                    "example": "There is a tall tree in the garden.",
                                    "partOfSpeech": "noun",
                                    "baseForm": true,
                                    "featured": false,
                                    "excluded": false,
                                    "sequence": 5,
                                    "adjectiveType": 0,
                                    "nounType": 3,
                                    "wordLanguage": "en",
                                    "difficultyLevel": 1,
                                    "cambridgeBand": 16,
                                    "usageCount": 893,
                                    "audioURL": "https://cdna.qaenglishcentral.com/words/t/tree_117948_11866.mp3",
                                    "wordAdapter": {
                                        "id": 136016,
                                        "wordId": 88053,
                                        "wordHeadId": 382,
                                        "wordRootId": 417765,
                                        "wordInstanceId": 69173,
                                        "wordUsageCount": 0,
                                        "headUsageCount": 886,
                                        "rootUsageCount": 880,
                                        "instanceUsageCount": 450,
                                        "sharedMeaningId": 47884,
                                        "wordFamilyId": null,
                                        "headPick": true,
                                        "rootPick": true
                                    },
                                    "canonicalDialogLineId": 127448,
                                    "pronunciation": {
                                        "id": 54477,
                                        "phonemes": "T R IY",
                                        "assetId": 11866,
                                        "syllableCount": 1,
                                        "phones": [
                                            {
                                                "id": 38,
                                                "label": "T"
                                            },
                                            {
                                                "id": 19,
                                                "label": "R"
                                            },
                                            {
                                                "id": 1,
                                                "label": "IY"
                                            }
                                        ],
                                        "active": true,
                                        "dateAdded": 1684741803000,
                                        "dateModified": 1684741803000
                                    },
                                    "properNoun": false,
                                    "cliplistKeyword": false,
                                    "studiable": true,
                                    "idiom": false
                                }
                            ],
                            "dialogTitle": "A Donkey and a Dog Head to Bremen 1"
                        }
                    ]
                }
            ],
            "currentTotal": 19,
            "currentCorrect": 0,
            "currentIncorrect": 1,
            "levelTestSettingId": 802,
            "startRank": 1,
            "endRank": 101,
            "band": 1
        });
    }

    getNextLevelTestAdaptiveWord(accountId: number, levelTestSettingId: number): Observable<AdaptiveQuizWord> {
        return of(undefined);
    }

    getClassTestExam(accountId: number, classTestExamId: number): Observable<any> {
        if (!accountId || !classTestExamId) {
            this.logger.log("accountId, classTestExamId are required params");
            return of(undefined);
        }

        return of(undefined);
    }

    getLevelTestDetail(accountId: number, curatedLevelTestId: number, levelTestSettingId: number): Observable<LevelTestDetail> {
        if (!accountId || (!curatedLevelTestId && !levelTestSettingId)) {
            this.logger.log("accountId and curatedLevelTestId or levelTestSettingId are required params");
            return of(undefined);
        }

        return of(undefined);
    }

    getCachedLevelTestDetail(accountId: number, curatedLevelTestId: number, levelTestSettingId: number): Observable<LevelTestDetail> {
        if (!accountId || (!curatedLevelTestId && !levelTestSettingId)) {
            this.logger.log("accountId and curatedLevelTestId or levelTestSettingId are required params");
            return of(undefined);
        }

        const params = {
            accountId: accountId,
            levelTestSettingId: levelTestSettingId,
            curatedLevelTestId: curatedLevelTestId
        };

        // Eliminate null attribute
        const filteredParams = forEach(params, (value, key) => {
            if (isNull(value)) {
                delete params[key];
            }
        });

        return of(undefined);
    }

    getLevelTestScore(accountId: number, levelTestSettingId: number, curatedLevelTestId?: number): Observable<VltQuizScore> {
        if (!accountId || (!curatedLevelTestId && !levelTestSettingId)) {
            this.logger.log("accountId and curatedLevelTestId or levelTestSettingId are required params");
            return of(undefined);
        }

        return of(undefined);
    }

    getLevelTestHistory(accountId: number, levelTestSettingId: number, curatedLevelTestId?: number): Observable<LevelTestHistory> {
        if (!accountId || (!curatedLevelTestId && !levelTestSettingId)) {
            this.logger.log("accountId and curatedLevelTestId or levelTestSettingId are required params");
            return of(undefined);
        }

        return of(undefined);
    }

    getCachedLevelTestScore(accountId: number, levelTestSettingId: number, curatedLevelTestId?: number): Observable<VltQuizScore> {
        if (!accountId || (!curatedLevelTestId && !levelTestSettingId)) {
            this.logger.log("accountId and curatedLevelTestId or levelTestSettingId are required params");
            return of(undefined);
        }

        const params = {
            accountId: accountId,
            levelTestSettingId: levelTestSettingId,
            curatedLevelTestId: curatedLevelTestId
        };

        return of(undefined);
    }

    completeQuiz(accountId: number,
                 quizStepId: number,
                 params: object = {}) {

        if (!accountId || !quizStepId) {
            return of(undefined);
        }

        return of(undefined);
    }
}
