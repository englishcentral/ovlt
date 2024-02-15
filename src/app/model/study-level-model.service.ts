import { Injectable } from "@angular/core";
import { ConnectionFactoryService } from "../../core/connection-factory.service";
import { Observable, of } from "rxjs";
import { StudyLevelOption } from "../types/studylevel-option";

export const SORT_ASC = 1;

@Injectable()
export class StudyLevelModelService {
    constructor() {
    }


    getOptions(additionalOptions?: object, refresh: boolean = false, expiration: number = ConnectionFactoryService.CACHE_LIFETIME.identity): Observable<StudyLevelOption[]> {
        return of([
            {
                "level": 1,
                "description": "Beginner",
                "testScores": [
                    {
                        "type": "ielts",
                        "score": "<2"
                    },
                    {
                        "type": "toefl",
                        "score": "0"
                    },
                    {
                        "type": "toefl_ibt",
                        "score": "<37"
                    },
                    {
                        "type": "toeic",
                        "score": "10 - 180"
                    },
                    {
                        "type": "cefr",
                        "score": "A0"
                    }
                ],
                "abilities": [
                    "say the letters of the alphabet",
                    "spell out one's name and address",
                    "tell the time",
                    "ask about hobbies and interests",
                    "talk about food",
                    "introduce yourself",
                    "give the price of something",
                    "talk about your home",
                    "describe everyday objects",
                    "talk about family and friends"
                ],
                "words": [
                    "go",
                    "eat"
                ]
            },
            {
                "level": 2,
                "description": "Beginner+",
                "testScores": [
                    {
                        "type": "ielts",
                        "score": "<3"
                    },
                    {
                        "type": "toefl",
                        "score": "8 - 31"
                    },
                    {
                        "type": "toefl_ibt",
                        "score": "37 - 44"
                    },
                    {
                        "type": "toeic",
                        "score": "185 - 220"
                    },
                    {
                        "type": "cefr",
                        "score": "A1"
                    }
                ],
                "abilities": [
                    "talk about feelings",
                    "talk about needs and wants",
                    "talk about future plans",
                    "ask for and give things",
                    "talk about likes and dislikes",
                    "talk about past activities",
                    "say what you can or cannot do",
                    "ask and answer simple questions about simple topics",
                    "name different forms of transportation",
                    "describe common weather conditions"
                ],
                "words": [
                    "draw",
                    "movie"
                ]
            },
            {
                "level": 3,
                "description": "Intermediate",
                "testScores": [
                    {
                        "type": "ielts",
                        "score": "<4"
                    },
                    {
                        "type": "toefl",
                        "score": "32 - 59"
                    },
                    {
                        "type": "toefl_ibt",
                        "score": "45 - 55"
                    },
                    {
                        "type": "toeic",
                        "score": "225 - 545"
                    },
                    {
                        "type": "cefr",
                        "score": "A2"
                    }
                ],
                "abilities": [
                    "describe people, places and experiences",
                    "describe people's personality",
                    "give explanations about their likes and dislikes",
                    "start and end a phone call",
                    "repeat and clarify information",
                    "make simple comparisons",
                    "check into a hotel",
                    "ask for and give directions",
                    "express strong emotions",
                    "make and accept an apology"
                ],
                "words": [
                    "dream",
                    "believe"
                ]
            },
            {
                "level": 4,
                "description": "Intermediate+",
                "testScores": [
                    {
                        "type": "ielts",
                        "score": "4 - 4.5"
                    },
                    {
                        "type": "toefl",
                        "score": "60 - 78"
                    },
                    {
                        "type": "toefl_ibt",
                        "score": "56 - 66"
                    },
                    {
                        "type": "toeic",
                        "score": "550 - 780"
                    },
                    {
                        "type": "cefr",
                        "score": "B1"
                    }
                ],
                "abilities": [
                    "tell a simple story",
                    "describe events",
                    "respond to and offer a suggestion",
                    "express opinions on music and movies",
                    "express agreement and disagreement",
                    "describe people's reactions to controversial issues",
                    "apologize using excuses and reasons",
                    "talk about symptoms and illnesses",
                    "ask for advice",
                    "express hopes and aspirations"
                ],
                "words": [
                    "recommend",
                    "allow"
                ]
            },
            {
                "level": 5,
                "description": "Advanced",
                "testScores": [
                    {
                        "type": "ielts",
                        "score": "5 - 6.5"
                    },
                    {
                        "type": "toefl",
                        "score": "79 - 93"
                    },
                    {
                        "type": "toefl_ibt",
                        "score": "67 - 88"
                    },
                    {
                        "type": "toeic",
                        "score": "785 - 900"
                    },
                    {
                        "type": "cefr",
                        "score": "B2"
                    }
                ],
                "abilities": [
                    "describe things in detail",
                    "describe a procedure",
                    "explain your opinions",
                    "compare and contrast situations",
                    "talk about the importance of an event",
                    "talk about cause and effect",
                    "describe a problem",
                    "request a solution to a problem",
                    "give recommendations",
                    "make announcements"
                ],
                "words": [
                    "obtain",
                    "crawl"
                ]
            },
            {
                "level": 6,
                "description": "Advanced+",
                "testScores": [
                    {
                        "type": "ielts",
                        "score": "7 - 8"
                    },
                    {
                        "type": "toefl",
                        "score": "94 - 114"
                    },
                    {
                        "type": "toefl_ibt",
                        "score": "89 - 104"
                    },
                    {
                        "type": "toeic",
                        "score": "905 - 945"
                    },
                    {
                        "type": "cefr",
                        "score": "C1"
                    }
                ],
                "abilities": [
                    "tell a story in detail",
                    "compare and evaluate ideas",
                    "present information about a product or service",
                    "summarize complex information",
                    "talk about the advantages and disadvantages of something",
                    "describe problem-solution relationships in detail",
                    "give supporting details to arguments",
                    "ask and answer interview questions",
                    "ask questions about complex topics",
                    "describe the progress of something"
                ],
                "words": [
                    "concede",
                    "apprehend"
                ]
            },
            {
                "level": 7,
                "description": "Expert",
                "testScores": [
                    {
                        "type": "ielts",
                        "score": "8.5 - 9"
                    },
                    {
                        "type": "toefl",
                        "score": "115 - 120"
                    },
                    {
                        "type": "toefl_ibt",
                        "score": "105 - 120"
                    },
                    {
                        "type": "toeic",
                        "score": "950 - 990"
                    },
                    {
                        "type": "cefr",
                        "score": "C2"
                    }
                ],
                "abilities": [
                    "talk about a product or service in detail",
                    "describe how something changes over time",
                    "ask and answer questions about controversial topics",
                    "talk about the impact of change",
                    "discuss the causes of an issue",
                    "justify a solution to a problem",
                    "talk about abstract ideas",
                    "conduct effective presentations"
                ],
                "words": [
                    "quench",
                    "debate"
                ]
            }
        ]);
    }

    getRawLevel(additionalOptions?: object): Observable<number> {
        return this.connection
            .service("bridge")
            .setPath("/identity/studylevel")
            .get(additionalOptions);
    }

    getLevel(additionalOptions?: object, refresh: boolean = false, expiration: number = ConnectionFactoryService.CACHE_LIFETIME.identity): Observable<number> {
    }

    postLevel(additionalOptions?: object): Observable<number> {
        return of(1);
    }

    putLevel(additionalOptions?: object): Observable<number> {
        return of(1);
    }
}
