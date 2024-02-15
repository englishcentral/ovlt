import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from "@angular/core";
import { OvltScoreAppComponent } from "./ovlt-score-app.component";
import { VocabBuilderModelService } from "../../../../model/content/vocab-builder-model.service";
import { vocabBuilderModelServiceStub } from "../../../../core/tests/stubs/content/vocab-builder-model-service.stub";
import { identityServiceStub } from "../../../../core/tests/stubs/common/identity-service.stub";
import { IdentityService } from "../../../../core/identity.service";
import { changeDetectorRefStub } from "../../../../core/tests/stubs/change-detector-ref.stub";
import { of } from "rxjs";
import { VocabBuilderProgressService } from "../../../../activity-app/vocab-builder-app/vocab-builder-progress.service";
import {
    vocabBuilderProgressServiceStub
} from "../../../../core/tests/stubs/vocab-builder-app/vocab-builder-progress-service.stub";
import { featureServiceStub } from "../../../../core/tests/stubs/common/feature-service.stub";
import { FeatureService } from "../../../../core/feature.service";


describe("VocabBuilderAppComponent", () => {
    let component: OvltScoreAppComponent;
    let fixture: ComponentFixture<OvltScoreAppComponent>;

    const setup = async () => {
        await TestBed.configureTestingModule({
            declarations: [OvltScoreAppComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                { provide: VocabBuilderModelService, useValue: vocabBuilderModelServiceStub },
                { provide: VocabBuilderProgressService, useValue: vocabBuilderProgressServiceStub },
                { provide: IdentityService, useValue: identityServiceStub },
                { provide: FeatureService, useValue: featureServiceStub },
                { provide: ChangeDetectorRef, useValue: changeDetectorRefStub }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(OvltScoreAppComponent);
        component = fixture.componentInstance;
    };

    beforeEach(async () => {
        await setup();
        component.settings = {
            "wordListTypeId": 9,
            "vocabBuilderModeIds": [
                4
            ],
            "activityTypeId": 51,
            "accountId": 3114733,
            "levelTestSettingId": 715,
            "listRank": 200,
            "styleSetting": {}
        };

        identityServiceStub.getAccountId.mockReturnValue(3114733);

        vocabBuilderModelServiceStub.getCachedLevelTestScore.mockReturnValue(of({
            "computedBand": 2,
            "score": 0.125,
            "siteLanguage": "en",
            "completed": 1679883714000,
            "microLevel": 1.6
        }));

        vocabBuilderModelServiceStub.getLevelTestHistory.mockReturnValue(of(
            {
                "levelTestSettingId": 715,
                "accountId": 3114733,
                "levelTestSteps": [
                    {
                        "quizStepId": 104141,
                        "band": 1,
                        "created": 1679883429000,
                        "completed": 1679883518000,
                        "modeIds": [
                            4
                        ],
                        "wordListTypeId": 39674,
                        "quizWords": [
                            {
                                "quizStepId": 104141,
                                "wordRootId": 80821,
                                "modeId": 4,
                                "correct": true,
                                "completed": 1679883476000,
                                "itemResponseTimeMs": 1976,
                                "siteLanguage": "en",
                                "sharedMeaningId": 24242,
                                "microLevel": 1.1
                            },
                            {
                                "quizStepId": 104141,
                                "wordRootId": 206906,
                                "modeId": 4,
                                "correct": true,
                                "completed": 1679883467000,
                                "itemResponseTimeMs": 4119,
                                "siteLanguage": "en",
                                "sharedMeaningId": 18890,
                                "microLevel": 1.5
                            },
                            {
                                "quizStepId": 104141,
                                "wordRootId": 400358,
                                "modeId": 4,
                                "correct": true,
                                "completed": 1679883447000,
                                "itemResponseTimeMs": 2049,
                                "siteLanguage": "en",
                                "sharedMeaningId": 13344,
                                "microLevel": 1.3
                            },
                            {
                                "quizStepId": 104141,
                                "wordRootId": 401922,
                                "modeId": 4,
                                "correct": true,
                                "completed": 1679883443000,
                                "itemResponseTimeMs": 1688,
                                "siteLanguage": "en",
                                "sharedMeaningId": 9704,
                                "microLevel": 1.3
                            },
                            {
                                "quizStepId": 104141,
                                "wordRootId": 404508,
                                "modeId": 4,
                                "correct": true,
                                "completed": 1679883439000,
                                "itemResponseTimeMs": 4555,
                                "siteLanguage": "en",
                                "sharedMeaningId": 2915
                            },
                            {
                                "quizStepId": 104141,
                                "wordRootId": 405403,
                                "modeId": 4,
                                "correct": true,
                                "completed": 1679883514000,
                                "itemResponseTimeMs": 6034,
                                "siteLanguage": "en",
                                "sharedMeaningId": 36477,
                                "microLevel": 1.6
                            },
                            {
                                "quizStepId": 104141,
                                "wordRootId": 405951,
                                "modeId": 4,
                                "correct": true,
                                "completed": 1679883458000,
                                "itemResponseTimeMs": 2011,
                                "siteLanguage": "en",
                                "sharedMeaningId": 18575,
                                "microLevel": 1.4
                            },
                            {
                                "quizStepId": 104141,
                                "wordRootId": 411233,
                                "modeId": 4,
                                "correct": true,
                                "completed": 1679883471000,
                                "itemResponseTimeMs": 4551,
                                "siteLanguage": "en",
                                "sharedMeaningId": 18995,
                                "microLevel": 1.4
                            },
                            {
                                "quizStepId": 104141,
                                "wordRootId": 411406,
                                "modeId": 4,
                                "correct": true,
                                "completed": 1679883442000,
                                "itemResponseTimeMs": 2241,
                                "siteLanguage": "en",
                                "sharedMeaningId": 8407,
                                "microLevel": 1.2
                            },
                            {
                                "quizStepId": 104141,
                                "wordRootId": 413663,
                                "modeId": 4,
                                "correct": true,
                                "completed": 1679883456000,
                                "itemResponseTimeMs": 5587,
                                "siteLanguage": "en",
                                "sharedMeaningId": 17706,
                                "microLevel": 1.4
                            },
                            {
                                "quizStepId": 104141,
                                "wordRootId": 414751,
                                "modeId": 4,
                                "correct": true,
                                "completed": 1679883449000,
                                "itemResponseTimeMs": 1576,
                                "siteLanguage": "en",
                                "sharedMeaningId": 17275,
                                "microLevel": 1
                            },
                            {
                                "quizStepId": 104141,
                                "wordRootId": 415020,
                                "modeId": 4,
                                "correct": true,
                                "completed": 1679883461000,
                                "itemResponseTimeMs": 3759,
                                "siteLanguage": "en",
                                "sharedMeaningId": 18751,
                                "microLevel": 1.2
                            },
                            {
                                "quizStepId": 104141,
                                "wordRootId": 415151,
                                "modeId": 4,
                                "correct": true,
                                "completed": 1679883507000,
                                "itemResponseTimeMs": 23787,
                                "siteLanguage": "en",
                                "sharedMeaningId": 35599,
                                "microLevel": 1.1
                            },
                            {
                                "quizStepId": 104141,
                                "wordRootId": 415631,
                                "modeId": 4,
                                "correct": true,
                                "completed": 1679883433000,
                                "itemResponseTimeMs": 2792,
                                "siteLanguage": "en",
                                "sharedMeaningId": 578,
                                "microLevel": 1.3
                            },
                            {
                                "quizStepId": 104141,
                                "wordRootId": 416996,
                                "modeId": 4,
                                "correct": true,
                                "completed": 1679883479000,
                                "itemResponseTimeMs": 2641,
                                "siteLanguage": "en",
                                "sharedMeaningId": 31071,
                                "microLevel": 1
                            },
                            {
                                "quizStepId": 104141,
                                "wordRootId": 417553,
                                "modeId": 4,
                                "correct": true,
                                "completed": 1679883475000,
                                "itemResponseTimeMs": 1552,
                                "siteLanguage": "en",
                                "sharedMeaningId": 19204,
                                "microLevel": 1.5
                            },
                            {
                                "quizStepId": 104141,
                                "wordRootId": 417765,
                                "modeId": 4,
                                "correct": true,
                                "completed": 1679883517000,
                                "itemResponseTimeMs": 2617,
                                "siteLanguage": "en",
                                "sharedMeaningId": 47425,
                                "microLevel": 1.1
                            },
                            {
                                "quizStepId": 104141,
                                "wordRootId": 419054,
                                "modeId": 4,
                                "correct": true,
                                "completed": 1679883483000,
                                "itemResponseTimeMs": 3277,
                                "siteLanguage": "en",
                                "sharedMeaningId": 34308,
                                "microLevel": 1.5
                            }
                        ]
                    },
                    {
                        "quizStepId": 104142,
                        "band": 2,
                        "created": 1679883519000,
                        "completed": 1679883562000,
                        "modeIds": [
                            4
                        ],
                        "wordListTypeId": 39674,
                        "quizWords": [
                            {
                                "quizStepId": 104142,
                                "wordRootId": 32447,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883555000,
                                "itemResponseTimeMs": 889,
                                "siteLanguage": "en",
                                "sharedMeaningId": 19744,
                                "microLevel": 1.7
                            },
                            {
                                "quizStepId": 104142,
                                "wordRootId": 216981,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883553000,
                                "itemResponseTimeMs": 520,
                                "siteLanguage": "en",
                                "sharedMeaningId": 12853,
                                "microLevel": 1.7
                            },
                            {
                                "quizStepId": 104142,
                                "wordRootId": 401473,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883551000,
                                "itemResponseTimeMs": 752,
                                "siteLanguage": "en",
                                "sharedMeaningId": 8092,
                                "microLevel": 2.1
                            },
                            {
                                "quizStepId": 104142,
                                "wordRootId": 401500,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883554000,
                                "itemResponseTimeMs": 521,
                                "siteLanguage": "en",
                                "sharedMeaningId": 18926,
                                "microLevel": 2
                            },
                            {
                                "quizStepId": 104142,
                                "wordRootId": 401847,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883557000,
                                "itemResponseTimeMs": 480,
                                "siteLanguage": "en",
                                "sharedMeaningId": 23227,
                                "microLevel": 1.9
                            },
                            {
                                "quizStepId": 104142,
                                "wordRootId": 402072,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883560000,
                                "itemResponseTimeMs": 480,
                                "siteLanguage": "en",
                                "sharedMeaningId": 30696,
                                "microLevel": 2.1
                            },
                            {
                                "quizStepId": 104142,
                                "wordRootId": 403945,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883559000,
                                "itemResponseTimeMs": 416,
                                "siteLanguage": "en",
                                "sharedMeaningId": 24302,
                                "microLevel": 1.7
                            },
                            {
                                "quizStepId": 104142,
                                "wordRootId": 405106,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883552000,
                                "itemResponseTimeMs": 798,
                                "siteLanguage": "en",
                                "sharedMeaningId": 10509,
                                "microLevel": 2.2
                            },
                            {
                                "quizStepId": 104142,
                                "wordRootId": 406336,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883556000,
                                "itemResponseTimeMs": 578,
                                "siteLanguage": "en",
                                "sharedMeaningId": 22857,
                                "microLevel": 2
                            },
                            {
                                "quizStepId": 104142,
                                "wordRootId": 407111,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883545000,
                                "itemResponseTimeMs": 3977,
                                "siteLanguage": "en",
                                "sharedMeaningId": 7679,
                                "microLevel": 1.9
                            },
                            {
                                "quizStepId": 104142,
                                "wordRootId": 407614,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883561000,
                                "itemResponseTimeMs": 512,
                                "siteLanguage": "en",
                                "sharedMeaningId": 35589,
                                "microLevel": 1.6
                            },
                            {
                                "quizStepId": 104142,
                                "wordRootId": 409510,
                                "modeId": 4,
                                "correct": true,
                                "completed": 1679883550000,
                                "itemResponseTimeMs": 3624,
                                "siteLanguage": "en",
                                "sharedMeaningId": 7841,
                                "microLevel": 2.1
                            },
                            {
                                "quizStepId": 104142,
                                "wordRootId": 409841,
                                "modeId": 4,
                                "correct": true,
                                "completed": 1679883525000,
                                "itemResponseTimeMs": 3756,
                                "siteLanguage": "en",
                                "sharedMeaningId": 370,
                                "microLevel": 1.8
                            },
                            {
                                "quizStepId": 104142,
                                "wordRootId": 410806,
                                "modeId": 4,
                                "correct": true,
                                "completed": 1679883531000,
                                "itemResponseTimeMs": 2072,
                                "siteLanguage": "en",
                                "sharedMeaningId": 1918,
                                "microLevel": 1.9
                            },
                            {
                                "quizStepId": 104142,
                                "wordRootId": 412646,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883559000,
                                "itemResponseTimeMs": 439,
                                "siteLanguage": "en",
                                "sharedMeaningId": 24259,
                                "microLevel": 1.6
                            },
                            {
                                "quizStepId": 104142,
                                "wordRootId": 416337,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883560000,
                                "itemResponseTimeMs": 592,
                                "siteLanguage": "en",
                                "sharedMeaningId": 31338,
                                "microLevel": 1.8
                            },
                            {
                                "quizStepId": 104142,
                                "wordRootId": 416535,
                                "modeId": 4,
                                "correct": true,
                                "completed": 1679883541000,
                                "itemResponseTimeMs": 6504,
                                "siteLanguage": "en",
                                "sharedMeaningId": 7314,
                                "microLevel": 2
                            },
                            {
                                "quizStepId": 104142,
                                "wordRootId": 416696,
                                "modeId": 4,
                                "correct": true,
                                "completed": 1679883534000,
                                "itemResponseTimeMs": 2475,
                                "siteLanguage": "en",
                                "sharedMeaningId": 6344,
                                "microLevel": 2.2
                            },
                            {
                                "quizStepId": 104142,
                                "wordRootId": 417106,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883555000,
                                "itemResponseTimeMs": 584,
                                "siteLanguage": "en",
                                "sharedMeaningId": 20639,
                                "microLevel": 1.8
                            },
                            {
                                "quizStepId": 104142,
                                "wordRootId": 418727,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883527000,
                                "itemResponseTimeMs": 2600,
                                "siteLanguage": "en",
                                "sharedMeaningId": 474,
                                "microLevel": 2.2
                            }
                        ]
                    },
                    {
                        "quizStepId": 104143,
                        "band": 3,
                        "created": 1679883564000,
                        "completed": 1679883582000,
                        "modeIds": [
                            4
                        ],
                        "wordListTypeId": 39674,
                        "quizWords": [
                            {
                                "quizStepId": 104143,
                                "wordRootId": 402977,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883576000,
                                "itemResponseTimeMs": 655,
                                "siteLanguage": "en",
                                "sharedMeaningId": 20600,
                                "microLevel": 2.7
                            },
                            {
                                "quizStepId": 104143,
                                "wordRootId": 403051,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883581000,
                                "itemResponseTimeMs": 484,
                                "siteLanguage": "en",
                                "sharedMeaningId": 35632,
                                "microLevel": 2.8
                            },
                            {
                                "quizStepId": 104143,
                                "wordRootId": 405121,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883577000,
                                "itemResponseTimeMs": 488,
                                "siteLanguage": "en",
                                "sharedMeaningId": 21748,
                                "microLevel": 2.5
                            },
                            {
                                "quizStepId": 104143,
                                "wordRootId": 406469,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883567000,
                                "itemResponseTimeMs": 1823,
                                "siteLanguage": "en",
                                "sharedMeaningId": 609,
                                "microLevel": 2.4
                            },
                            {
                                "quizStepId": 104143,
                                "wordRootId": 407832,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883581000,
                                "itemResponseTimeMs": 496,
                                "siteLanguage": "en",
                                "sharedMeaningId": 34998,
                                "microLevel": 2.3
                            },
                            {
                                "quizStepId": 104143,
                                "wordRootId": 408221,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883575000,
                                "itemResponseTimeMs": 511,
                                "siteLanguage": "en",
                                "sharedMeaningId": 19489,
                                "microLevel": 2.4
                            },
                            {
                                "quizStepId": 104143,
                                "wordRootId": 409091,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883579000,
                                "itemResponseTimeMs": 435,
                                "siteLanguage": "en",
                                "sharedMeaningId": 23592,
                                "microLevel": 2.8
                            },
                            {
                                "quizStepId": 104143,
                                "wordRootId": 409687,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883572000,
                                "itemResponseTimeMs": 544,
                                "siteLanguage": "en",
                                "sharedMeaningId": 8414,
                                "microLevel": 2.9
                            },
                            {
                                "quizStepId": 104143,
                                "wordRootId": 410958,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883577000,
                                "itemResponseTimeMs": 590,
                                "siteLanguage": "en",
                                "sharedMeaningId": 21424,
                                "microLevel": 2.5
                            },
                            {
                                "quizStepId": 104143,
                                "wordRootId": 412162,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883574000,
                                "itemResponseTimeMs": 560,
                                "siteLanguage": "en",
                                "sharedMeaningId": 16637,
                                "microLevel": 2.4
                            },
                            {
                                "quizStepId": 104143,
                                "wordRootId": 416100,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883571000,
                                "itemResponseTimeMs": 616,
                                "siteLanguage": "en",
                                "sharedMeaningId": 7681,
                                "microLevel": 2.8
                            },
                            {
                                "quizStepId": 104143,
                                "wordRootId": 417559,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883580000,
                                "itemResponseTimeMs": 471,
                                "siteLanguage": "en",
                                "sharedMeaningId": 27612,
                                "microLevel": 2.7
                            },
                            {
                                "quizStepId": 104143,
                                "wordRootId": 418318,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883569000,
                                "itemResponseTimeMs": 702,
                                "siteLanguage": "en",
                                "sharedMeaningId": 885,
                                "microLevel": 2.6
                            },
                            {
                                "quizStepId": 104143,
                                "wordRootId": 418392,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883570000,
                                "itemResponseTimeMs": 526,
                                "siteLanguage": "en",
                                "sharedMeaningId": 7028,
                                "microLevel": 2.9
                            },
                            {
                                "quizStepId": 104143,
                                "wordRootId": 418620,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883569000,
                                "itemResponseTimeMs": 479,
                                "siteLanguage": "en",
                                "sharedMeaningId": 6707,
                                "microLevel": 2.5
                            },
                            {
                                "quizStepId": 104143,
                                "wordRootId": 418735,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883578000,
                                "itemResponseTimeMs": 483,
                                "siteLanguage": "en",
                                "sharedMeaningId": 23572,
                                "microLevel": 2.7
                            },
                            {
                                "quizStepId": 104143,
                                "wordRootId": 418938,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883582000,
                                "itemResponseTimeMs": 464,
                                "siteLanguage": "en",
                                "sharedMeaningId": 56497,
                                "microLevel": 2.3
                            },
                            {
                                "quizStepId": 104143,
                                "wordRootId": 419113,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883582000,
                                "itemResponseTimeMs": 485,
                                "siteLanguage": "en",
                                "sharedMeaningId": 37990,
                                "microLevel": 2.6
                            },
                            {
                                "quizStepId": 104143,
                                "wordRootId": 462585,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883573000,
                                "itemResponseTimeMs": 609,
                                "siteLanguage": "en",
                                "sharedMeaningId": 13937,
                                "microLevel": 2.6
                            }
                        ]
                    },
                    {
                        "quizStepId": 104144,
                        "band": 4,
                        "created": 1679883584000,
                        "completed": 1679883602000,
                        "modeIds": [
                            4
                        ],
                        "wordListTypeId": 39674,
                        "quizWords": [
                            {
                                "quizStepId": 104144,
                                "wordRootId": 128000,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883593000,
                                "itemResponseTimeMs": 437,
                                "siteLanguage": "en",
                                "sharedMeaningId": 16754,
                                "microLevel": 3
                            },
                            {
                                "quizStepId": 104144,
                                "wordRootId": 135168,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883600000,
                                "itemResponseTimeMs": 448,
                                "siteLanguage": "en",
                                "sharedMeaningId": 35982,
                                "microLevel": 3.3
                            },
                            {
                                "quizStepId": 104144,
                                "wordRootId": 140704,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883592000,
                                "itemResponseTimeMs": 472,
                                "siteLanguage": "en",
                                "sharedMeaningId": 16680,
                                "microLevel": 3.5
                            },
                            {
                                "quizStepId": 104144,
                                "wordRootId": 150478,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883598000,
                                "itemResponseTimeMs": 534,
                                "siteLanguage": "en",
                                "sharedMeaningId": 24454,
                                "microLevel": 3.4
                            },
                            {
                                "quizStepId": 104144,
                                "wordRootId": 171681,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883599000,
                                "itemResponseTimeMs": 448,
                                "siteLanguage": "en",
                                "sharedMeaningId": 25031,
                                "microLevel": 3.3
                            },
                            {
                                "quizStepId": 104144,
                                "wordRootId": 316503,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883591000,
                                "itemResponseTimeMs": 569,
                                "siteLanguage": "en",
                                "sharedMeaningId": 13624,
                                "microLevel": 3.2
                            },
                            {
                                "quizStepId": 104144,
                                "wordRootId": 400911,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883601000,
                                "itemResponseTimeMs": 577,
                                "siteLanguage": "en",
                                "sharedMeaningId": 50146,
                                "microLevel": 3.1
                            },
                            {
                                "quizStepId": 104144,
                                "wordRootId": 401333,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883598000,
                                "itemResponseTimeMs": 497,
                                "siteLanguage": "en",
                                "sharedMeaningId": 23963,
                                "microLevel": 3
                            },
                            {
                                "quizStepId": 104144,
                                "wordRootId": 401584,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883600000,
                                "itemResponseTimeMs": 445,
                                "siteLanguage": "en",
                                "sharedMeaningId": 33315,
                                "microLevel": 2.9
                            },
                            {
                                "quizStepId": 104144,
                                "wordRootId": 401590,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883587000,
                                "itemResponseTimeMs": 1322,
                                "siteLanguage": "en",
                                "sharedMeaningId": 63,
                                "microLevel": 3.2
                            },
                            {
                                "quizStepId": 104144,
                                "wordRootId": 403182,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883596000,
                                "itemResponseTimeMs": 511,
                                "siteLanguage": "en",
                                "sharedMeaningId": 22512,
                                "microLevel": 3
                            },
                            {
                                "quizStepId": 104144,
                                "wordRootId": 403368,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883588000,
                                "itemResponseTimeMs": 495,
                                "siteLanguage": "en",
                                "sharedMeaningId": 962,
                                "microLevel": 3.2
                            },
                            {
                                "quizStepId": 104144,
                                "wordRootId": 404294,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883589000,
                                "itemResponseTimeMs": 480,
                                "siteLanguage": "en",
                                "sharedMeaningId": 6330,
                                "microLevel": 3.4
                            },
                            {
                                "quizStepId": 104144,
                                "wordRootId": 404918,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883589000,
                                "itemResponseTimeMs": 480,
                                "siteLanguage": "en",
                                "sharedMeaningId": 7907,
                                "microLevel": 3.5
                            },
                            {
                                "quizStepId": 104144,
                                "wordRootId": 407883,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883597000,
                                "itemResponseTimeMs": 472,
                                "siteLanguage": "en",
                                "sharedMeaningId": 22532,
                                "microLevel": 3.1
                            },
                            {
                                "quizStepId": 104144,
                                "wordRootId": 410084,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883595000,
                                "itemResponseTimeMs": 501,
                                "siteLanguage": "en",
                                "sharedMeaningId": 18769,
                                "microLevel": 3.1
                            },
                            {
                                "quizStepId": 104144,
                                "wordRootId": 412715,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883591000,
                                "itemResponseTimeMs": 520,
                                "siteLanguage": "en",
                                "sharedMeaningId": 14975,
                                "microLevel": 3.5
                            },
                            {
                                "quizStepId": 104144,
                                "wordRootId": 416415,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883595000,
                                "itemResponseTimeMs": 473,
                                "siteLanguage": "en",
                                "sharedMeaningId": 20523,
                                "microLevel": 3.3
                            },
                            {
                                "quizStepId": 104144,
                                "wordRootId": 419425,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883590000,
                                "itemResponseTimeMs": 511,
                                "siteLanguage": "en",
                                "sharedMeaningId": 9057,
                                "microLevel": 3.6
                            }
                        ]
                    },
                    {
                        "quizStepId": 104145,
                        "band": 5,
                        "created": 1679883603000,
                        "completed": 1679883620000,
                        "modeIds": [
                            4
                        ],
                        "wordListTypeId": 39674,
                        "quizWords": [
                            {
                                "quizStepId": 104145,
                                "wordRootId": 71462,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883618000,
                                "itemResponseTimeMs": 394,
                                "siteLanguage": "en",
                                "sharedMeaningId": 23442,
                                "microLevel": 4.1
                            },
                            {
                                "quizStepId": 104145,
                                "wordRootId": 112111,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883614000,
                                "itemResponseTimeMs": 480,
                                "siteLanguage": "en",
                                "sharedMeaningId": 21202,
                                "microLevel": 4.2
                            },
                            {
                                "quizStepId": 104145,
                                "wordRootId": 128195,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883619000,
                                "itemResponseTimeMs": 377,
                                "siteLanguage": "en",
                                "sharedMeaningId": 23927,
                                "microLevel": 4.2
                            },
                            {
                                "quizStepId": 104145,
                                "wordRootId": 400711,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883619000,
                                "itemResponseTimeMs": 472,
                                "siteLanguage": "en",
                                "sharedMeaningId": 31251,
                                "microLevel": 4
                            },
                            {
                                "quizStepId": 104145,
                                "wordRootId": 402799,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883612000,
                                "itemResponseTimeMs": 448,
                                "siteLanguage": "en",
                                "sharedMeaningId": 20858,
                                "microLevel": 3.8
                            },
                            {
                                "quizStepId": 104145,
                                "wordRootId": 402877,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883618000,
                                "itemResponseTimeMs": 391,
                                "siteLanguage": "en",
                                "sharedMeaningId": 23561,
                                "microLevel": 3.8
                            },
                            {
                                "quizStepId": 104145,
                                "wordRootId": 404769,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883610000,
                                "itemResponseTimeMs": 423,
                                "siteLanguage": "en",
                                "sharedMeaningId": 8270,
                                "microLevel": 3.7
                            },
                            {
                                "quizStepId": 104145,
                                "wordRootId": 405110,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883610000,
                                "itemResponseTimeMs": 505,
                                "siteLanguage": "en",
                                "sharedMeaningId": 15042,
                                "microLevel": 3.9
                            },
                            {
                                "quizStepId": 104145,
                                "wordRootId": 405744,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883616000,
                                "itemResponseTimeMs": 400,
                                "siteLanguage": "en",
                                "sharedMeaningId": 22014,
                                "microLevel": 4
                            },
                            {
                                "quizStepId": 104145,
                                "wordRootId": 405799,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883609000,
                                "itemResponseTimeMs": 383,
                                "siteLanguage": "en",
                                "sharedMeaningId": 7828,
                                "microLevel": 4.2
                            },
                            {
                                "quizStepId": 104145,
                                "wordRootId": 406510,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883611000,
                                "itemResponseTimeMs": 408,
                                "siteLanguage": "en",
                                "sharedMeaningId": 19747,
                                "microLevel": 3.7
                            },
                            {
                                "quizStepId": 104145,
                                "wordRootId": 407169,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883611000,
                                "itemResponseTimeMs": 386,
                                "siteLanguage": "en",
                                "sharedMeaningId": 19131,
                                "microLevel": 3.9
                            },
                            {
                                "quizStepId": 104145,
                                "wordRootId": 407749,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883612000,
                                "itemResponseTimeMs": 529,
                                "siteLanguage": "en",
                                "sharedMeaningId": 20380,
                                "microLevel": 4.1
                            },
                            {
                                "quizStepId": 104145,
                                "wordRootId": 409607,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883617000,
                                "itemResponseTimeMs": 450,
                                "siteLanguage": "en",
                                "sharedMeaningId": 23328,
                                "microLevel": 3.8
                            },
                            {
                                "quizStepId": 104145,
                                "wordRootId": 411159,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883608000,
                                "itemResponseTimeMs": 422,
                                "siteLanguage": "en",
                                "sharedMeaningId": 7713,
                                "microLevel": 4.1
                            },
                            {
                                "quizStepId": 104145,
                                "wordRootId": 414415,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883619000,
                                "itemResponseTimeMs": 392,
                                "siteLanguage": "en",
                                "sharedMeaningId": 24915,
                                "microLevel": 4
                            },
                            {
                                "quizStepId": 104145,
                                "wordRootId": 416268,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883610000,
                                "itemResponseTimeMs": 394,
                                "siteLanguage": "en",
                                "sharedMeaningId": 18925,
                                "microLevel": 3.7
                            },
                            {
                                "quizStepId": 104145,
                                "wordRootId": 417980,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883615000,
                                "itemResponseTimeMs": 538,
                                "siteLanguage": "en",
                                "sharedMeaningId": 21946,
                                "microLevel": 3.9
                            },
                            {
                                "quizStepId": 104145,
                                "wordRootId": 419244,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883606000,
                                "itemResponseTimeMs": 1156,
                                "siteLanguage": "en",
                                "sharedMeaningId": 65,
                                "microLevel": 3.6
                            },
                            {
                                "quizStepId": 104145,
                                "wordRootId": 428774,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883607000,
                                "itemResponseTimeMs": 525,
                                "siteLanguage": "en",
                                "sharedMeaningId": 6303,
                                "microLevel": 3.6
                            }
                        ]
                    },
                    {
                        "quizStepId": 104146,
                        "band": 6,
                        "created": 1679883621000,
                        "completed": 1679883636000,
                        "modeIds": [
                            4
                        ],
                        "wordListTypeId": 39674,
                        "quizWords": [
                            {
                                "quizStepId": 104146,
                                "wordRootId": 402622,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883635000,
                                "itemResponseTimeMs": 320,
                                "siteLanguage": "en",
                                "sharedMeaningId": 36885,
                                "microLevel": 4.4
                            },
                            {
                                "quizStepId": 104146,
                                "wordRootId": 403014,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883629000,
                                "itemResponseTimeMs": 401,
                                "siteLanguage": "en",
                                "sharedMeaningId": 16622,
                                "microLevel": 4.3
                            },
                            {
                                "quizStepId": 104146,
                                "wordRootId": 403764,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883626000,
                                "itemResponseTimeMs": 432,
                                "siteLanguage": "en",
                                "sharedMeaningId": 14946,
                                "microLevel": 4.5
                            },
                            {
                                "quizStepId": 104146,
                                "wordRootId": 404392,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883632000,
                                "itemResponseTimeMs": 376,
                                "siteLanguage": "en",
                                "sharedMeaningId": 24297,
                                "microLevel": 4.9
                            },
                            {
                                "quizStepId": 104146,
                                "wordRootId": 404925,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883633000,
                                "itemResponseTimeMs": 456,
                                "siteLanguage": "en",
                                "sharedMeaningId": 24992,
                                "microLevel": 4.3
                            },
                            {
                                "quizStepId": 104146,
                                "wordRootId": 405884,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883636000,
                                "itemResponseTimeMs": 377,
                                "siteLanguage": "en",
                                "sharedMeaningId": 47227,
                                "microLevel": 4.5
                            },
                            {
                                "quizStepId": 104146,
                                "wordRootId": 406133,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883630000,
                                "itemResponseTimeMs": 383,
                                "siteLanguage": "en",
                                "sharedMeaningId": 23014,
                                "microLevel": 4.5
                            },
                            {
                                "quizStepId": 104146,
                                "wordRootId": 406330,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883631000,
                                "itemResponseTimeMs": 384,
                                "siteLanguage": "en",
                                "sharedMeaningId": 23558,
                                "microLevel": 4.4
                            },
                            {
                                "quizStepId": 104146,
                                "wordRootId": 406909,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883630000,
                                "itemResponseTimeMs": 378,
                                "siteLanguage": "en",
                                "sharedMeaningId": 20787,
                                "microLevel": 4.9
                            },
                            {
                                "quizStepId": 104146,
                                "wordRootId": 407594,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883628000,
                                "itemResponseTimeMs": 354,
                                "siteLanguage": "en",
                                "sharedMeaningId": 19908,
                                "microLevel": 4.8
                            },
                            {
                                "quizStepId": 104146,
                                "wordRootId": 408521,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883623000,
                                "itemResponseTimeMs": 1156,
                                "siteLanguage": "en",
                                "sharedMeaningId": 4764,
                                "microLevel": 4.3
                            },
                            {
                                "quizStepId": 104146,
                                "wordRootId": 409058,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883631000,
                                "itemResponseTimeMs": 360,
                                "siteLanguage": "en",
                                "sharedMeaningId": 24107,
                                "microLevel": 4.6
                            },
                            {
                                "quizStepId": 104146,
                                "wordRootId": 409858,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883628000,
                                "itemResponseTimeMs": 398,
                                "siteLanguage": "en",
                                "sharedMeaningId": 20854,
                                "microLevel": 4.7
                            },
                            {
                                "quizStepId": 104146,
                                "wordRootId": 412729,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883629000,
                                "itemResponseTimeMs": 345,
                                "siteLanguage": "en",
                                "sharedMeaningId": 21675,
                                "microLevel": 4.7
                            },
                            {
                                "quizStepId": 104146,
                                "wordRootId": 413223,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883627000,
                                "itemResponseTimeMs": 383,
                                "siteLanguage": "en",
                                "sharedMeaningId": 4778,
                                "microLevel": 4.6
                            },
                            {
                                "quizStepId": 104146,
                                "wordRootId": 414008,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883630000,
                                "itemResponseTimeMs": 384,
                                "siteLanguage": "en",
                                "sharedMeaningId": 23390,
                                "microLevel": 4.6
                            },
                            {
                                "quizStepId": 104146,
                                "wordRootId": 415407,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883625000,
                                "itemResponseTimeMs": 425,
                                "siteLanguage": "en",
                                "sharedMeaningId": 6420,
                                "microLevel": 4.4
                            },
                            {
                                "quizStepId": 104146,
                                "wordRootId": 416704,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883628000,
                                "itemResponseTimeMs": 409,
                                "siteLanguage": "en",
                                "sharedMeaningId": 6476,
                                "microLevel": 4.8
                            },
                            {
                                "quizStepId": 104146,
                                "wordRootId": 417167,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883634000,
                                "itemResponseTimeMs": 391,
                                "siteLanguage": "en",
                                "sharedMeaningId": 25148,
                                "microLevel": 4.7
                            },
                            {
                                "quizStepId": 104146,
                                "wordRootId": 417901,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883629000,
                                "itemResponseTimeMs": 376,
                                "siteLanguage": "en",
                                "sharedMeaningId": 22248,
                                "microLevel": 4.8
                            }
                        ]
                    },
                    {
                        "quizStepId": 104147,
                        "band": 7,
                        "created": 1679883638000,
                        "completed": 1679883656000,
                        "modeIds": [
                            4
                        ],
                        "wordListTypeId": 39674,
                        "quizWords": [
                            {
                                "quizStepId": 104147,
                                "wordRootId": 128604,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883646000,
                                "itemResponseTimeMs": 441,
                                "siteLanguage": "en",
                                "sharedMeaningId": 22334,
                                "microLevel": 5.2
                            },
                            {
                                "quizStepId": 104147,
                                "wordRootId": 180706,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883654000,
                                "itemResponseTimeMs": 478,
                                "siteLanguage": "en",
                                "sharedMeaningId": 25124,
                                "microLevel": 5.3
                            },
                            {
                                "quizStepId": 104147,
                                "wordRootId": 400233,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883650000,
                                "itemResponseTimeMs": 462,
                                "siteLanguage": "en",
                                "sharedMeaningId": 23874,
                                "microLevel": 5.1
                            },
                            {
                                "quizStepId": 104147,
                                "wordRootId": 400612,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883643000,
                                "itemResponseTimeMs": 525,
                                "siteLanguage": "en",
                                "sharedMeaningId": 8597,
                                "microLevel": 4.9
                            },
                            {
                                "quizStepId": 104147,
                                "wordRootId": 400794,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883640000,
                                "itemResponseTimeMs": 824,
                                "siteLanguage": "en",
                                "sharedMeaningId": 34,
                                "microLevel": 5.4
                            },
                            {
                                "quizStepId": 104147,
                                "wordRootId": 401560,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883646000,
                                "itemResponseTimeMs": 383,
                                "siteLanguage": "en",
                                "sharedMeaningId": 17012,
                                "microLevel": 5.4
                            },
                            {
                                "quizStepId": 104147,
                                "wordRootId": 403521,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883655000,
                                "itemResponseTimeMs": 513,
                                "siteLanguage": "en",
                                "sharedMeaningId": 37820,
                                "microLevel": 5.3
                            },
                            {
                                "quizStepId": 104147,
                                "wordRootId": 404222,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883645000,
                                "itemResponseTimeMs": 375,
                                "siteLanguage": "en",
                                "sharedMeaningId": 13586,
                                "microLevel": 5.5
                            },
                            {
                                "quizStepId": 104147,
                                "wordRootId": 404647,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883652000,
                                "itemResponseTimeMs": 448,
                                "siteLanguage": "en",
                                "sharedMeaningId": 24686,
                                "microLevel": 5.5
                            },
                            {
                                "quizStepId": 104147,
                                "wordRootId": 405011,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883641000,
                                "itemResponseTimeMs": 374,
                                "siteLanguage": "en",
                                "sharedMeaningId": 1998,
                                "microLevel": 5.6
                            },
                            {
                                "quizStepId": 104147,
                                "wordRootId": 405140,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883654000,
                                "itemResponseTimeMs": 503,
                                "siteLanguage": "en",
                                "sharedMeaningId": 25265,
                                "microLevel": 5.3
                            },
                            {
                                "quizStepId": 104147,
                                "wordRootId": 405989,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883645000,
                                "itemResponseTimeMs": 480,
                                "siteLanguage": "en",
                                "sharedMeaningId": 12348,
                                "microLevel": 5
                            },
                            {
                                "quizStepId": 104147,
                                "wordRootId": 406473,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883653000,
                                "itemResponseTimeMs": 511,
                                "siteLanguage": "en",
                                "sharedMeaningId": 24951,
                                "microLevel": 5
                            },
                            {
                                "quizStepId": 104147,
                                "wordRootId": 406978,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883648000,
                                "itemResponseTimeMs": 505,
                                "siteLanguage": "en",
                                "sharedMeaningId": 23129,
                                "microLevel": 5.2
                            },
                            {
                                "quizStepId": 104147,
                                "wordRootId": 408392,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883644000,
                                "itemResponseTimeMs": 433,
                                "siteLanguage": "en",
                                "sharedMeaningId": 9272,
                                "microLevel": 5.5
                            },
                            {
                                "quizStepId": 104147,
                                "wordRootId": 411453,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883647000,
                                "itemResponseTimeMs": 442,
                                "siteLanguage": "en",
                                "sharedMeaningId": 22372,
                                "microLevel": 5.4
                            },
                            {
                                "quizStepId": 104147,
                                "wordRootId": 411496,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883651000,
                                "itemResponseTimeMs": 442,
                                "siteLanguage": "en",
                                "sharedMeaningId": 23951,
                                "microLevel": 5.1
                            },
                            {
                                "quizStepId": 104147,
                                "wordRootId": 415411,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883649000,
                                "itemResponseTimeMs": 455,
                                "siteLanguage": "en",
                                "sharedMeaningId": 23794,
                                "microLevel": 5.1
                            },
                            {
                                "quizStepId": 104147,
                                "wordRootId": 415908,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883648000,
                                "itemResponseTimeMs": 442,
                                "siteLanguage": "en",
                                "sharedMeaningId": 22653,
                                "microLevel": 5.2
                            },
                            {
                                "quizStepId": 104147,
                                "wordRootId": 416783,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883642000,
                                "itemResponseTimeMs": 399,
                                "siteLanguage": "en",
                                "sharedMeaningId": 5679,
                                "microLevel": 5
                            }
                        ]
                    },
                    {
                        "quizStepId": 104148,
                        "band": 8,
                        "created": 1679883657000,
                        "completed": 1679883675000,
                        "modeIds": [
                            4
                        ],
                        "wordListTypeId": 39674,
                        "quizWords": [
                            {
                                "quizStepId": 104148,
                                "wordRootId": 400088,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883674000,
                                "itemResponseTimeMs": 431,
                                "siteLanguage": "en",
                                "sharedMeaningId": 34925,
                                "microLevel": 6.2
                            },
                            {
                                "quizStepId": 104148,
                                "wordRootId": 400128,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883667000,
                                "itemResponseTimeMs": 495,
                                "siteLanguage": "en",
                                "sharedMeaningId": 21497,
                                "microLevel": 5.9
                            },
                            {
                                "quizStepId": 104148,
                                "wordRootId": 400132,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883663000,
                                "itemResponseTimeMs": 416,
                                "siteLanguage": "en",
                                "sharedMeaningId": 6598,
                                "microLevel": 5.8
                            },
                            {
                                "quizStepId": 104148,
                                "wordRootId": 401128,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883671000,
                                "itemResponseTimeMs": 437,
                                "siteLanguage": "en",
                                "sharedMeaningId": 22259,
                                "microLevel": 6.1
                            },
                            {
                                "quizStepId": 104148,
                                "wordRootId": 402068,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883667000,
                                "itemResponseTimeMs": 483,
                                "siteLanguage": "en",
                                "sharedMeaningId": 20531,
                                "microLevel": 5.9
                            },
                            {
                                "quizStepId": 104148,
                                "wordRootId": 402474,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883668000,
                                "itemResponseTimeMs": 467,
                                "siteLanguage": "en",
                                "sharedMeaningId": 21816,
                                "microLevel": 5.7
                            },
                            {
                                "quizStepId": 104148,
                                "wordRootId": 404106,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883662000,
                                "itemResponseTimeMs": 407,
                                "siteLanguage": "en",
                                "sharedMeaningId": 5682,
                                "microLevel": 5.7
                            },
                            {
                                "quizStepId": 104148,
                                "wordRootId": 404472,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883672000,
                                "itemResponseTimeMs": 477,
                                "siteLanguage": "en",
                                "sharedMeaningId": 22637,
                                "microLevel": 5.6
                            },
                            {
                                "quizStepId": 104148,
                                "wordRootId": 405918,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883660000,
                                "itemResponseTimeMs": 1096,
                                "siteLanguage": "en",
                                "sharedMeaningId": 3836,
                                "microLevel": 6
                            },
                            {
                                "quizStepId": 104148,
                                "wordRootId": 409721,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883673000,
                                "itemResponseTimeMs": 430,
                                "siteLanguage": "en",
                                "sharedMeaningId": 22715,
                                "microLevel": 6.1
                            },
                            {
                                "quizStepId": 104148,
                                "wordRootId": 411143,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883664000,
                                "itemResponseTimeMs": 399,
                                "siteLanguage": "en",
                                "sharedMeaningId": 10631,
                                "microLevel": 6
                            },
                            {
                                "quizStepId": 104148,
                                "wordRootId": 413017,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883669000,
                                "itemResponseTimeMs": 439,
                                "siteLanguage": "en",
                                "sharedMeaningId": 21883,
                                "microLevel": 5.7
                            },
                            {
                                "quizStepId": 104148,
                                "wordRootId": 413364,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883665000,
                                "itemResponseTimeMs": 440,
                                "siteLanguage": "en",
                                "sharedMeaningId": 11174,
                                "microLevel": 6.2
                            },
                            {
                                "quizStepId": 104148,
                                "wordRootId": 413946,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883661000,
                                "itemResponseTimeMs": 408,
                                "siteLanguage": "en",
                                "sharedMeaningId": 4867,
                                "microLevel": 6
                            },
                            {
                                "quizStepId": 104148,
                                "wordRootId": 414045,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883666000,
                                "itemResponseTimeMs": 464,
                                "siteLanguage": "en",
                                "sharedMeaningId": 17136,
                                "microLevel": 6.1
                            },
                            {
                                "quizStepId": 104148,
                                "wordRootId": 415752,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883674000,
                                "itemResponseTimeMs": 457,
                                "siteLanguage": "en",
                                "sharedMeaningId": 23759,
                                "microLevel": 5.8
                            },
                            {
                                "quizStepId": 104148,
                                "wordRootId": 416693,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883665000,
                                "itemResponseTimeMs": 425,
                                "siteLanguage": "en",
                                "sharedMeaningId": 16439,
                                "microLevel": 5.9
                            },
                            {
                                "quizStepId": 104148,
                                "wordRootId": 418135,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883670000,
                                "itemResponseTimeMs": 463,
                                "siteLanguage": "en",
                                "sharedMeaningId": 22168,
                                "microLevel": 5.6
                            },
                            {
                                "quizStepId": 104148,
                                "wordRootId": 418656,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883662000,
                                "itemResponseTimeMs": 346,
                                "siteLanguage": "en",
                                "sharedMeaningId": 6289,
                                "microLevel": 6.2
                            },
                            {
                                "quizStepId": 104148,
                                "wordRootId": 419238,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883666000,
                                "itemResponseTimeMs": 430,
                                "siteLanguage": "en",
                                "sharedMeaningId": 16607,
                                "microLevel": 5.8
                            }
                        ]
                    },
                    {
                        "quizStepId": 104149,
                        "band": 9,
                        "created": 1679883677000,
                        "completed": 1679883696000,
                        "modeIds": [
                            4
                        ],
                        "wordListTypeId": 39674,
                        "quizWords": [
                            {
                                "quizStepId": 104149,
                                "wordRootId": 462,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883687000,
                                "itemResponseTimeMs": 454,
                                "siteLanguage": "en",
                                "sharedMeaningId": 18247,
                                "microLevel": 6.6
                            },
                            {
                                "quizStepId": 104149,
                                "wordRootId": 41086,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883694000,
                                "itemResponseTimeMs": 415,
                                "siteLanguage": "en",
                                "sharedMeaningId": 34561,
                                "microLevel": 6.8
                            },
                            {
                                "quizStepId": 104149,
                                "wordRootId": 168512,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883686000,
                                "itemResponseTimeMs": 401,
                                "siteLanguage": "en",
                                "sharedMeaningId": 16854,
                                "microLevel": 6.3
                            },
                            {
                                "quizStepId": 104149,
                                "wordRootId": 168712,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883690000,
                                "itemResponseTimeMs": 455,
                                "siteLanguage": "en",
                                "sharedMeaningId": 22860,
                                "microLevel": 6.8
                            },
                            {
                                "quizStepId": 104149,
                                "wordRootId": 173385,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883680000,
                                "itemResponseTimeMs": 983,
                                "siteLanguage": "en",
                                "sharedMeaningId": 2820,
                                "microLevel": 6.5
                            },
                            {
                                "quizStepId": 104149,
                                "wordRootId": 400102,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883681000,
                                "itemResponseTimeMs": 393,
                                "siteLanguage": "en",
                                "sharedMeaningId": 5797,
                                "microLevel": 6.4
                            },
                            {
                                "quizStepId": 104149,
                                "wordRootId": 403624,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883691000,
                                "itemResponseTimeMs": 453,
                                "siteLanguage": "en",
                                "sharedMeaningId": 23641,
                                "microLevel": 6.5
                            },
                            {
                                "quizStepId": 104149,
                                "wordRootId": 405008,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883695000,
                                "itemResponseTimeMs": 392,
                                "siteLanguage": "en",
                                "sharedMeaningId": 36049,
                                "microLevel": 6.4
                            },
                            {
                                "quizStepId": 104149,
                                "wordRootId": 405588,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883681000,
                                "itemResponseTimeMs": 383,
                                "siteLanguage": "en",
                                "sharedMeaningId": 4359,
                                "microLevel": 6.3
                            },
                            {
                                "quizStepId": 104149,
                                "wordRootId": 405739,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883684000,
                                "itemResponseTimeMs": 863,
                                "siteLanguage": "en",
                                "sharedMeaningId": 10070,
                                "microLevel": 6.8
                            },
                            {
                                "quizStepId": 104149,
                                "wordRootId": 408426,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883689000,
                                "itemResponseTimeMs": 446,
                                "siteLanguage": "en",
                                "sharedMeaningId": 20454,
                                "microLevel": 6.9
                            },
                            {
                                "quizStepId": 104149,
                                "wordRootId": 408870,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883693000,
                                "itemResponseTimeMs": 397,
                                "siteLanguage": "en",
                                "sharedMeaningId": 24984,
                                "microLevel": 6.4
                            },
                            {
                                "quizStepId": 104149,
                                "wordRootId": 408917,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883686000,
                                "itemResponseTimeMs": 471,
                                "siteLanguage": "en",
                                "sharedMeaningId": 12993,
                                "microLevel": 6.7
                            },
                            {
                                "quizStepId": 104149,
                                "wordRootId": 412167,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883690000,
                                "itemResponseTimeMs": 415,
                                "siteLanguage": "en",
                                "sharedMeaningId": 22107,
                                "microLevel": 6.7
                            },
                            {
                                "quizStepId": 104149,
                                "wordRootId": 412463,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883683000,
                                "itemResponseTimeMs": 450,
                                "siteLanguage": "en",
                                "sharedMeaningId": 6314,
                                "microLevel": 6.9
                            },
                            {
                                "quizStepId": 104149,
                                "wordRootId": 412492,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883696000,
                                "itemResponseTimeMs": 496,
                                "siteLanguage": "en",
                                "sharedMeaningId": 36291,
                                "microLevel": 6.7
                            },
                            {
                                "quizStepId": 104149,
                                "wordRootId": 412929,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883683000,
                                "itemResponseTimeMs": 439,
                                "siteLanguage": "en",
                                "sharedMeaningId": 5980,
                                "microLevel": 6.3
                            },
                            {
                                "quizStepId": 104149,
                                "wordRootId": 415718,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883692000,
                                "itemResponseTimeMs": 432,
                                "siteLanguage": "en",
                                "sharedMeaningId": 24155,
                                "microLevel": 6.5
                            },
                            {
                                "quizStepId": 104149,
                                "wordRootId": 416104,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883693000,
                                "itemResponseTimeMs": 493,
                                "siteLanguage": "en",
                                "sharedMeaningId": 24577,
                                "microLevel": 6.6
                            },
                            {
                                "quizStepId": 104149,
                                "wordRootId": 419049,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883685000,
                                "itemResponseTimeMs": 398,
                                "siteLanguage": "en",
                                "sharedMeaningId": 12517,
                                "microLevel": 6.6
                            }
                        ]
                    },
                    {
                        "quizStepId": 104150,
                        "band": 10,
                        "created": 1679883698000,
                        "completed": 1679883715000,
                        "modeIds": [
                            4
                        ],
                        "wordListTypeId": 39674,
                        "quizWords": [
                            {
                                "quizStepId": 104150,
                                "wordRootId": 32197,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883703000,
                                "itemResponseTimeMs": 638,
                                "siteLanguage": "en",
                                "sharedMeaningId": 6597,
                                "microLevel": 7.2
                            },
                            {
                                "quizStepId": 104150,
                                "wordRootId": 33534,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883707000,
                                "itemResponseTimeMs": 398,
                                "siteLanguage": "en",
                                "sharedMeaningId": 18472,
                                "microLevel": 7
                            },
                            {
                                "quizStepId": 104150,
                                "wordRootId": 139374,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883714000,
                                "itemResponseTimeMs": 414,
                                "siteLanguage": "en",
                                "sharedMeaningId": 51062,
                                "microLevel": 7.3
                            },
                            {
                                "quizStepId": 104150,
                                "wordRootId": 198217,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883712000,
                                "itemResponseTimeMs": 439,
                                "siteLanguage": "en",
                                "sharedMeaningId": 25268,
                                "microLevel": 7
                            },
                            {
                                "quizStepId": 104150,
                                "wordRootId": 316156,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883701000,
                                "itemResponseTimeMs": 389,
                                "siteLanguage": "en",
                                "sharedMeaningId": 3783,
                                "microLevel": 6.9
                            },
                            {
                                "quizStepId": 104150,
                                "wordRootId": 401166,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883713000,
                                "itemResponseTimeMs": 528,
                                "siteLanguage": "en",
                                "sharedMeaningId": 36168,
                                "microLevel": 7.1
                            },
                            {
                                "quizStepId": 104150,
                                "wordRootId": 402226,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883703000,
                                "itemResponseTimeMs": 400,
                                "siteLanguage": "en",
                                "sharedMeaningId": 6035,
                                "microLevel": 7
                            },
                            {
                                "quizStepId": 104150,
                                "wordRootId": 404435,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883709000,
                                "itemResponseTimeMs": 431,
                                "siteLanguage": "en",
                                "sharedMeaningId": 22414,
                                "microLevel": 7.1
                            },
                            {
                                "quizStepId": 104150,
                                "wordRootId": 404976,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883712000,
                                "itemResponseTimeMs": 420,
                                "siteLanguage": "en",
                                "sharedMeaningId": 35166,
                                "microLevel": 7.5
                            },
                            {
                                "quizStepId": 104150,
                                "wordRootId": 407151,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883708000,
                                "itemResponseTimeMs": 383,
                                "siteLanguage": "en",
                                "sharedMeaningId": 22382,
                                "microLevel": 7.1
                            },
                            {
                                "quizStepId": 104150,
                                "wordRootId": 408862,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883710000,
                                "itemResponseTimeMs": 436,
                                "siteLanguage": "en",
                                "sharedMeaningId": 23443,
                                "microLevel": 7.2
                            },
                            {
                                "quizStepId": 104150,
                                "wordRootId": 410785,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883711000,
                                "itemResponseTimeMs": 432,
                                "siteLanguage": "en",
                                "sharedMeaningId": 23879,
                                "microLevel": 7.6
                            },
                            {
                                "quizStepId": 104150,
                                "wordRootId": 411792,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883705000,
                                "itemResponseTimeMs": 391,
                                "siteLanguage": "en",
                                "sharedMeaningId": 15322,
                                "microLevel": 7.4
                            },
                            {
                                "quizStepId": 104150,
                                "wordRootId": 414440,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883707000,
                                "itemResponseTimeMs": 529,
                                "siteLanguage": "en",
                                "sharedMeaningId": 19805,
                                "microLevel": 7.2
                            },
                            {
                                "quizStepId": 104150,
                                "wordRootId": 416467,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883701000,
                                "itemResponseTimeMs": 1027,
                                "siteLanguage": "en",
                                "sharedMeaningId": 1623,
                                "microLevel": 7.3
                            },
                            {
                                "quizStepId": 104150,
                                "wordRootId": 416992,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883713000,
                                "itemResponseTimeMs": 448,
                                "siteLanguage": "en",
                                "sharedMeaningId": 49522,
                                "microLevel": 7.4
                            },
                            {
                                "quizStepId": 104150,
                                "wordRootId": 417679,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883712000,
                                "itemResponseTimeMs": 429,
                                "siteLanguage": "en",
                                "sharedMeaningId": 24968,
                                "microLevel": 7.4
                            },
                            {
                                "quizStepId": 104150,
                                "wordRootId": 418905,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883704000,
                                "itemResponseTimeMs": 396,
                                "siteLanguage": "en",
                                "sharedMeaningId": 14590,
                                "microLevel": 7.5
                            },
                            {
                                "quizStepId": 104150,
                                "wordRootId": 436514,
                                "modeId": 4,
                                "correct": false,
                                "completed": 1679883704000,
                                "itemResponseTimeMs": 416,
                                "siteLanguage": "en",
                                "sharedMeaningId": 14115,
                                "microLevel": 7.3
                            }
                        ]
                    }
                ]
            }
        ));
    });

    test("should create the component", () => {
        expect(component).toBeDefined();
    });

    test("basic user use case", fakeAsync(() => {
        component.classTest = false;
        component.ngOnInit();
        expect(vocabBuilderModelServiceStub.getCachedLevelTestScore).toHaveBeenCalledWith(3114733, 715, undefined);
        expect(vocabBuilderModelServiceStub.getLevelTestHistory).toHaveBeenCalled();

        expect(component.getMicroLevel()).toBe(1.6);
        expect(component.isDifficultyBeginner()).toBe(true);
        expect(component.isDifficultyIntermediate()).toBe(false);
        expect(component.isDifficultyAdvanced()).toBe(false);
    }));

    test("class test use case", fakeAsync(() => {
        component.classTest = true;
        component.ngOnInit();
        expect(vocabBuilderModelServiceStub.getCachedLevelTestScore).toHaveBeenCalledWith(3114733, 715, undefined);
        expect(vocabBuilderModelServiceStub.getLevelTestHistory).toHaveBeenCalledWith(3114733, 715, undefined);

        expect(component.getMicroLevel()).toBe(1.6);
        expect(component.isDifficultyBeginner()).toBe(true);
        expect(component.isDifficultyIntermediate()).toBe(false);
        expect(component.isDifficultyAdvanced()).toBe(false);
        expect(component.getLevelTestSteps()).toEqual([
            {
                "band": 1,
                "completed": 1679883518000,
                "created": 1679883429000,
                "modeIds": [
                    4
                ],
                "quizStepId": 104141,
                "quizWords": [
                    {
                        "completed": 1679883476000,
                        "correct": true,
                        "itemResponseTimeMs": 1976,
                        "microLevel": 1.1,
                        "modeId": 4,
                        "quizStepId": 104141,
                        "sharedMeaningId": 24242,
                        "siteLanguage": "en",
                        "wordRootId": 80821
                    },
                    {
                        "completed": 1679883467000,
                        "correct": true,
                        "itemResponseTimeMs": 4119,
                        "microLevel": 1.5,
                        "modeId": 4,
                        "quizStepId": 104141,
                        "sharedMeaningId": 18890,
                        "siteLanguage": "en",
                        "wordRootId": 206906
                    },
                    {
                        "completed": 1679883447000,
                        "correct": true,
                        "itemResponseTimeMs": 2049,
                        "microLevel": 1.3,
                        "modeId": 4,
                        "quizStepId": 104141,
                        "sharedMeaningId": 13344,
                        "siteLanguage": "en",
                        "wordRootId": 400358
                    },
                    {
                        "completed": 1679883443000,
                        "correct": true,
                        "itemResponseTimeMs": 1688,
                        "microLevel": 1.3,
                        "modeId": 4,
                        "quizStepId": 104141,
                        "sharedMeaningId": 9704,
                        "siteLanguage": "en",
                        "wordRootId": 401922
                    },
                    {
                        "completed": 1679883439000,
                        "correct": true,
                        "itemResponseTimeMs": 4555,
                        "modeId": 4,
                        "quizStepId": 104141,
                        "sharedMeaningId": 2915,
                        "siteLanguage": "en",
                        "wordRootId": 404508
                    },
                    {
                        "completed": 1679883514000,
                        "correct": true,
                        "itemResponseTimeMs": 6034,
                        "microLevel": 1.6,
                        "modeId": 4,
                        "quizStepId": 104141,
                        "sharedMeaningId": 36477,
                        "siteLanguage": "en",
                        "wordRootId": 405403
                    },
                    {
                        "completed": 1679883458000,
                        "correct": true,
                        "itemResponseTimeMs": 2011,
                        "microLevel": 1.4,
                        "modeId": 4,
                        "quizStepId": 104141,
                        "sharedMeaningId": 18575,
                        "siteLanguage": "en",
                        "wordRootId": 405951
                    },
                    {
                        "completed": 1679883471000,
                        "correct": true,
                        "itemResponseTimeMs": 4551,
                        "microLevel": 1.4,
                        "modeId": 4,
                        "quizStepId": 104141,
                        "sharedMeaningId": 18995,
                        "siteLanguage": "en",
                        "wordRootId": 411233
                    },
                    {
                        "completed": 1679883442000,
                        "correct": true,
                        "itemResponseTimeMs": 2241,
                        "microLevel": 1.2,
                        "modeId": 4,
                        "quizStepId": 104141,
                        "sharedMeaningId": 8407,
                        "siteLanguage": "en",
                        "wordRootId": 411406
                    },
                    {
                        "completed": 1679883456000,
                        "correct": true,
                        "itemResponseTimeMs": 5587,
                        "microLevel": 1.4,
                        "modeId": 4,
                        "quizStepId": 104141,
                        "sharedMeaningId": 17706,
                        "siteLanguage": "en",
                        "wordRootId": 413663
                    },
                    {
                        "completed": 1679883449000,
                        "correct": true,
                        "itemResponseTimeMs": 1576,
                        "microLevel": 1,
                        "modeId": 4,
                        "quizStepId": 104141,
                        "sharedMeaningId": 17275,
                        "siteLanguage": "en",
                        "wordRootId": 414751
                    },
                    {
                        "completed": 1679883461000,
                        "correct": true,
                        "itemResponseTimeMs": 3759,
                        "microLevel": 1.2,
                        "modeId": 4,
                        "quizStepId": 104141,
                        "sharedMeaningId": 18751,
                        "siteLanguage": "en",
                        "wordRootId": 415020
                    },
                    {
                        "completed": 1679883507000,
                        "correct": true,
                        "itemResponseTimeMs": 23787,
                        "microLevel": 1.1,
                        "modeId": 4,
                        "quizStepId": 104141,
                        "sharedMeaningId": 35599,
                        "siteLanguage": "en",
                        "wordRootId": 415151
                    },
                    {
                        "completed": 1679883433000,
                        "correct": true,
                        "itemResponseTimeMs": 2792,
                        "microLevel": 1.3,
                        "modeId": 4,
                        "quizStepId": 104141,
                        "sharedMeaningId": 578,
                        "siteLanguage": "en",
                        "wordRootId": 415631
                    },
                    {
                        "completed": 1679883479000,
                        "correct": true,
                        "itemResponseTimeMs": 2641,
                        "microLevel": 1,
                        "modeId": 4,
                        "quizStepId": 104141,
                        "sharedMeaningId": 31071,
                        "siteLanguage": "en",
                        "wordRootId": 416996
                    },
                    {
                        "completed": 1679883475000,
                        "correct": true,
                        "itemResponseTimeMs": 1552,
                        "microLevel": 1.5,
                        "modeId": 4,
                        "quizStepId": 104141,
                        "sharedMeaningId": 19204,
                        "siteLanguage": "en",
                        "wordRootId": 417553
                    },
                    {
                        "completed": 1679883517000,
                        "correct": true,
                        "itemResponseTimeMs": 2617,
                        "microLevel": 1.1,
                        "modeId": 4,
                        "quizStepId": 104141,
                        "sharedMeaningId": 47425,
                        "siteLanguage": "en",
                        "wordRootId": 417765
                    },
                    {
                        "completed": 1679883483000,
                        "correct": true,
                        "itemResponseTimeMs": 3277,
                        "microLevel": 1.5,
                        "modeId": 4,
                        "quizStepId": 104141,
                        "sharedMeaningId": 34308,
                        "siteLanguage": "en",
                        "wordRootId": 419054
                    }
                ],
                "wordListTypeId": 39674
            },
            {
                "band": 2,
                "completed": 1679883562000,
                "created": 1679883519000,
                "modeIds": [
                    4
                ],
                "quizStepId": 104142,
                "quizWords": [
                    {
                        "completed": 1679883555000,
                        "correct": false,
                        "itemResponseTimeMs": 889,
                        "microLevel": 1.7,
                        "modeId": 4,
                        "quizStepId": 104142,
                        "sharedMeaningId": 19744,
                        "siteLanguage": "en",
                        "wordRootId": 32447
                    },
                    {
                        "completed": 1679883553000,
                        "correct": false,
                        "itemResponseTimeMs": 520,
                        "microLevel": 1.7,
                        "modeId": 4,
                        "quizStepId": 104142,
                        "sharedMeaningId": 12853,
                        "siteLanguage": "en",
                        "wordRootId": 216981
                    },
                    {
                        "completed": 1679883551000,
                        "correct": false,
                        "itemResponseTimeMs": 752,
                        "microLevel": 2.1,
                        "modeId": 4,
                        "quizStepId": 104142,
                        "sharedMeaningId": 8092,
                        "siteLanguage": "en",
                        "wordRootId": 401473
                    },
                    {
                        "completed": 1679883554000,
                        "correct": false,
                        "itemResponseTimeMs": 521,
                        "microLevel": 2,
                        "modeId": 4,
                        "quizStepId": 104142,
                        "sharedMeaningId": 18926,
                        "siteLanguage": "en",
                        "wordRootId": 401500
                    },
                    {
                        "completed": 1679883557000,
                        "correct": false,
                        "itemResponseTimeMs": 480,
                        "microLevel": 1.9,
                        "modeId": 4,
                        "quizStepId": 104142,
                        "sharedMeaningId": 23227,
                        "siteLanguage": "en",
                        "wordRootId": 401847
                    },
                    {
                        "completed": 1679883560000,
                        "correct": false,
                        "itemResponseTimeMs": 480,
                        "microLevel": 2.1,
                        "modeId": 4,
                        "quizStepId": 104142,
                        "sharedMeaningId": 30696,
                        "siteLanguage": "en",
                        "wordRootId": 402072
                    },
                    {
                        "completed": 1679883559000,
                        "correct": false,
                        "itemResponseTimeMs": 416,
                        "microLevel": 1.7,
                        "modeId": 4,
                        "quizStepId": 104142,
                        "sharedMeaningId": 24302,
                        "siteLanguage": "en",
                        "wordRootId": 403945
                    },
                    {
                        "completed": 1679883552000,
                        "correct": false,
                        "itemResponseTimeMs": 798,
                        "microLevel": 2.2,
                        "modeId": 4,
                        "quizStepId": 104142,
                        "sharedMeaningId": 10509,
                        "siteLanguage": "en",
                        "wordRootId": 405106
                    },
                    {
                        "completed": 1679883556000,
                        "correct": false,
                        "itemResponseTimeMs": 578,
                        "microLevel": 2,
                        "modeId": 4,
                        "quizStepId": 104142,
                        "sharedMeaningId": 22857,
                        "siteLanguage": "en",
                        "wordRootId": 406336
                    },
                    {
                        "completed": 1679883545000,
                        "correct": false,
                        "itemResponseTimeMs": 3977,
                        "microLevel": 1.9,
                        "modeId": 4,
                        "quizStepId": 104142,
                        "sharedMeaningId": 7679,
                        "siteLanguage": "en",
                        "wordRootId": 407111
                    },
                    {
                        "completed": 1679883561000,
                        "correct": false,
                        "itemResponseTimeMs": 512,
                        "microLevel": 1.6,
                        "modeId": 4,
                        "quizStepId": 104142,
                        "sharedMeaningId": 35589,
                        "siteLanguage": "en",
                        "wordRootId": 407614
                    },
                    {
                        "completed": 1679883550000,
                        "correct": true,
                        "itemResponseTimeMs": 3624,
                        "microLevel": 2.1,
                        "modeId": 4,
                        "quizStepId": 104142,
                        "sharedMeaningId": 7841,
                        "siteLanguage": "en",
                        "wordRootId": 409510
                    },
                    {
                        "completed": 1679883525000,
                        "correct": true,
                        "itemResponseTimeMs": 3756,
                        "microLevel": 1.8,
                        "modeId": 4,
                        "quizStepId": 104142,
                        "sharedMeaningId": 370,
                        "siteLanguage": "en",
                        "wordRootId": 409841
                    },
                    {
                        "completed": 1679883531000,
                        "correct": true,
                        "itemResponseTimeMs": 2072,
                        "microLevel": 1.9,
                        "modeId": 4,
                        "quizStepId": 104142,
                        "sharedMeaningId": 1918,
                        "siteLanguage": "en",
                        "wordRootId": 410806
                    },
                    {
                        "completed": 1679883559000,
                        "correct": false,
                        "itemResponseTimeMs": 439,
                        "microLevel": 1.6,
                        "modeId": 4,
                        "quizStepId": 104142,
                        "sharedMeaningId": 24259,
                        "siteLanguage": "en",
                        "wordRootId": 412646
                    },
                    {
                        "completed": 1679883560000,
                        "correct": false,
                        "itemResponseTimeMs": 592,
                        "microLevel": 1.8,
                        "modeId": 4,
                        "quizStepId": 104142,
                        "sharedMeaningId": 31338,
                        "siteLanguage": "en",
                        "wordRootId": 416337
                    },
                    {
                        "completed": 1679883541000,
                        "correct": true,
                        "itemResponseTimeMs": 6504,
                        "microLevel": 2,
                        "modeId": 4,
                        "quizStepId": 104142,
                        "sharedMeaningId": 7314,
                        "siteLanguage": "en",
                        "wordRootId": 416535
                    },
                    {
                        "completed": 1679883534000,
                        "correct": true,
                        "itemResponseTimeMs": 2475,
                        "microLevel": 2.2,
                        "modeId": 4,
                        "quizStepId": 104142,
                        "sharedMeaningId": 6344,
                        "siteLanguage": "en",
                        "wordRootId": 416696
                    },
                    {
                        "completed": 1679883555000,
                        "correct": false,
                        "itemResponseTimeMs": 584,
                        "microLevel": 1.8,
                        "modeId": 4,
                        "quizStepId": 104142,
                        "sharedMeaningId": 20639,
                        "siteLanguage": "en",
                        "wordRootId": 417106
                    },
                    {
                        "completed": 1679883527000,
                        "correct": false,
                        "itemResponseTimeMs": 2600,
                        "microLevel": 2.2,
                        "modeId": 4,
                        "quizStepId": 104142,
                        "sharedMeaningId": 474,
                        "siteLanguage": "en",
                        "wordRootId": 418727
                    }
                ],
                "wordListTypeId": 39674
            },
            {
                "band": 3,
                "completed": 1679883582000,
                "created": 1679883564000,
                "modeIds": [
                    4
                ],
                "quizStepId": 104143,
                "quizWords": [
                    {
                        "completed": 1679883576000,
                        "correct": false,
                        "itemResponseTimeMs": 655,
                        "microLevel": 2.7,
                        "modeId": 4,
                        "quizStepId": 104143,
                        "sharedMeaningId": 20600,
                        "siteLanguage": "en",
                        "wordRootId": 402977
                    },
                    {
                        "completed": 1679883581000,
                        "correct": false,
                        "itemResponseTimeMs": 484,
                        "microLevel": 2.8,
                        "modeId": 4,
                        "quizStepId": 104143,
                        "sharedMeaningId": 35632,
                        "siteLanguage": "en",
                        "wordRootId": 403051
                    },
                    {
                        "completed": 1679883577000,
                        "correct": false,
                        "itemResponseTimeMs": 488,
                        "microLevel": 2.5,
                        "modeId": 4,
                        "quizStepId": 104143,
                        "sharedMeaningId": 21748,
                        "siteLanguage": "en",
                        "wordRootId": 405121
                    },
                    {
                        "completed": 1679883567000,
                        "correct": false,
                        "itemResponseTimeMs": 1823,
                        "microLevel": 2.4,
                        "modeId": 4,
                        "quizStepId": 104143,
                        "sharedMeaningId": 609,
                        "siteLanguage": "en",
                        "wordRootId": 406469
                    },
                    {
                        "completed": 1679883581000,
                        "correct": false,
                        "itemResponseTimeMs": 496,
                        "microLevel": 2.3,
                        "modeId": 4,
                        "quizStepId": 104143,
                        "sharedMeaningId": 34998,
                        "siteLanguage": "en",
                        "wordRootId": 407832
                    },
                    {
                        "completed": 1679883575000,
                        "correct": false,
                        "itemResponseTimeMs": 511,
                        "microLevel": 2.4,
                        "modeId": 4,
                        "quizStepId": 104143,
                        "sharedMeaningId": 19489,
                        "siteLanguage": "en",
                        "wordRootId": 408221
                    },
                    {
                        "completed": 1679883579000,
                        "correct": false,
                        "itemResponseTimeMs": 435,
                        "microLevel": 2.8,
                        "modeId": 4,
                        "quizStepId": 104143,
                        "sharedMeaningId": 23592,
                        "siteLanguage": "en",
                        "wordRootId": 409091
                    },
                    {
                        "completed": 1679883572000,
                        "correct": false,
                        "itemResponseTimeMs": 544,
                        "microLevel": 2.9,
                        "modeId": 4,
                        "quizStepId": 104143,
                        "sharedMeaningId": 8414,
                        "siteLanguage": "en",
                        "wordRootId": 409687
                    },
                    {
                        "completed": 1679883577000,
                        "correct": false,
                        "itemResponseTimeMs": 590,
                        "microLevel": 2.5,
                        "modeId": 4,
                        "quizStepId": 104143,
                        "sharedMeaningId": 21424,
                        "siteLanguage": "en",
                        "wordRootId": 410958
                    },
                    {
                        "completed": 1679883574000,
                        "correct": false,
                        "itemResponseTimeMs": 560,
                        "microLevel": 2.4,
                        "modeId": 4,
                        "quizStepId": 104143,
                        "sharedMeaningId": 16637,
                        "siteLanguage": "en",
                        "wordRootId": 412162
                    },
                    {
                        "completed": 1679883571000,
                        "correct": false,
                        "itemResponseTimeMs": 616,
                        "microLevel": 2.8,
                        "modeId": 4,
                        "quizStepId": 104143,
                        "sharedMeaningId": 7681,
                        "siteLanguage": "en",
                        "wordRootId": 416100
                    },
                    {
                        "completed": 1679883580000,
                        "correct": false,
                        "itemResponseTimeMs": 471,
                        "microLevel": 2.7,
                        "modeId": 4,
                        "quizStepId": 104143,
                        "sharedMeaningId": 27612,
                        "siteLanguage": "en",
                        "wordRootId": 417559
                    },
                    {
                        "completed": 1679883569000,
                        "correct": false,
                        "itemResponseTimeMs": 702,
                        "microLevel": 2.6,
                        "modeId": 4,
                        "quizStepId": 104143,
                        "sharedMeaningId": 885,
                        "siteLanguage": "en",
                        "wordRootId": 418318
                    },
                    {
                        "completed": 1679883570000,
                        "correct": false,
                        "itemResponseTimeMs": 526,
                        "microLevel": 2.9,
                        "modeId": 4,
                        "quizStepId": 104143,
                        "sharedMeaningId": 7028,
                        "siteLanguage": "en",
                        "wordRootId": 418392
                    },
                    {
                        "completed": 1679883569000,
                        "correct": false,
                        "itemResponseTimeMs": 479,
                        "microLevel": 2.5,
                        "modeId": 4,
                        "quizStepId": 104143,
                        "sharedMeaningId": 6707,
                        "siteLanguage": "en",
                        "wordRootId": 418620
                    },
                    {
                        "completed": 1679883578000,
                        "correct": false,
                        "itemResponseTimeMs": 483,
                        "microLevel": 2.7,
                        "modeId": 4,
                        "quizStepId": 104143,
                        "sharedMeaningId": 23572,
                        "siteLanguage": "en",
                        "wordRootId": 418735
                    },
                    {
                        "completed": 1679883582000,
                        "correct": false,
                        "itemResponseTimeMs": 464,
                        "microLevel": 2.3,
                        "modeId": 4,
                        "quizStepId": 104143,
                        "sharedMeaningId": 56497,
                        "siteLanguage": "en",
                        "wordRootId": 418938
                    },
                    {
                        "completed": 1679883582000,
                        "correct": false,
                        "itemResponseTimeMs": 485,
                        "microLevel": 2.6,
                        "modeId": 4,
                        "quizStepId": 104143,
                        "sharedMeaningId": 37990,
                        "siteLanguage": "en",
                        "wordRootId": 419113
                    },
                    {
                        "completed": 1679883573000,
                        "correct": false,
                        "itemResponseTimeMs": 609,
                        "microLevel": 2.6,
                        "modeId": 4,
                        "quizStepId": 104143,
                        "sharedMeaningId": 13937,
                        "siteLanguage": "en",
                        "wordRootId": 462585
                    }
                ],
                "wordListTypeId": 39674
            },
            {
                "band": 4,
                "completed": 1679883602000,
                "created": 1679883584000,
                "modeIds": [
                    4
                ],
                "quizStepId": 104144,
                "quizWords": [
                    {
                        "completed": 1679883593000,
                        "correct": false,
                        "itemResponseTimeMs": 437,
                        "microLevel": 3,
                        "modeId": 4,
                        "quizStepId": 104144,
                        "sharedMeaningId": 16754,
                        "siteLanguage": "en",
                        "wordRootId": 128000
                    },
                    {
                        "completed": 1679883600000,
                        "correct": false,
                        "itemResponseTimeMs": 448,
                        "microLevel": 3.3,
                        "modeId": 4,
                        "quizStepId": 104144,
                        "sharedMeaningId": 35982,
                        "siteLanguage": "en",
                        "wordRootId": 135168
                    },
                    {
                        "completed": 1679883592000,
                        "correct": false,
                        "itemResponseTimeMs": 472,
                        "microLevel": 3.5,
                        "modeId": 4,
                        "quizStepId": 104144,
                        "sharedMeaningId": 16680,
                        "siteLanguage": "en",
                        "wordRootId": 140704
                    },
                    {
                        "completed": 1679883598000,
                        "correct": false,
                        "itemResponseTimeMs": 534,
                        "microLevel": 3.4,
                        "modeId": 4,
                        "quizStepId": 104144,
                        "sharedMeaningId": 24454,
                        "siteLanguage": "en",
                        "wordRootId": 150478
                    },
                    {
                        "completed": 1679883599000,
                        "correct": false,
                        "itemResponseTimeMs": 448,
                        "microLevel": 3.3,
                        "modeId": 4,
                        "quizStepId": 104144,
                        "sharedMeaningId": 25031,
                        "siteLanguage": "en",
                        "wordRootId": 171681
                    },
                    {
                        "completed": 1679883591000,
                        "correct": false,
                        "itemResponseTimeMs": 569,
                        "microLevel": 3.2,
                        "modeId": 4,
                        "quizStepId": 104144,
                        "sharedMeaningId": 13624,
                        "siteLanguage": "en",
                        "wordRootId": 316503
                    },
                    {
                        "completed": 1679883601000,
                        "correct": false,
                        "itemResponseTimeMs": 577,
                        "microLevel": 3.1,
                        "modeId": 4,
                        "quizStepId": 104144,
                        "sharedMeaningId": 50146,
                        "siteLanguage": "en",
                        "wordRootId": 400911
                    },
                    {
                        "completed": 1679883598000,
                        "correct": false,
                        "itemResponseTimeMs": 497,
                        "microLevel": 3,
                        "modeId": 4,
                        "quizStepId": 104144,
                        "sharedMeaningId": 23963,
                        "siteLanguage": "en",
                        "wordRootId": 401333
                    },
                    {
                        "completed": 1679883600000,
                        "correct": false,
                        "itemResponseTimeMs": 445,
                        "microLevel": 2.9,
                        "modeId": 4,
                        "quizStepId": 104144,
                        "sharedMeaningId": 33315,
                        "siteLanguage": "en",
                        "wordRootId": 401584
                    },
                    {
                        "completed": 1679883587000,
                        "correct": false,
                        "itemResponseTimeMs": 1322,
                        "microLevel": 3.2,
                        "modeId": 4,
                        "quizStepId": 104144,
                        "sharedMeaningId": 63,
                        "siteLanguage": "en",
                        "wordRootId": 401590
                    },
                    {
                        "completed": 1679883596000,
                        "correct": false,
                        "itemResponseTimeMs": 511,
                        "microLevel": 3,
                        "modeId": 4,
                        "quizStepId": 104144,
                        "sharedMeaningId": 22512,
                        "siteLanguage": "en",
                        "wordRootId": 403182
                    },
                    {
                        "completed": 1679883588000,
                        "correct": false,
                        "itemResponseTimeMs": 495,
                        "microLevel": 3.2,
                        "modeId": 4,
                        "quizStepId": 104144,
                        "sharedMeaningId": 962,
                        "siteLanguage": "en",
                        "wordRootId": 403368
                    },
                    {
                        "completed": 1679883589000,
                        "correct": false,
                        "itemResponseTimeMs": 480,
                        "microLevel": 3.4,
                        "modeId": 4,
                        "quizStepId": 104144,
                        "sharedMeaningId": 6330,
                        "siteLanguage": "en",
                        "wordRootId": 404294
                    },
                    {
                        "completed": 1679883589000,
                        "correct": false,
                        "itemResponseTimeMs": 480,
                        "microLevel": 3.5,
                        "modeId": 4,
                        "quizStepId": 104144,
                        "sharedMeaningId": 7907,
                        "siteLanguage": "en",
                        "wordRootId": 404918
                    },
                    {
                        "completed": 1679883597000,
                        "correct": false,
                        "itemResponseTimeMs": 472,
                        "microLevel": 3.1,
                        "modeId": 4,
                        "quizStepId": 104144,
                        "sharedMeaningId": 22532,
                        "siteLanguage": "en",
                        "wordRootId": 407883
                    },
                    {
                        "completed": 1679883595000,
                        "correct": false,
                        "itemResponseTimeMs": 501,
                        "microLevel": 3.1,
                        "modeId": 4,
                        "quizStepId": 104144,
                        "sharedMeaningId": 18769,
                        "siteLanguage": "en",
                        "wordRootId": 410084
                    },
                    {
                        "completed": 1679883591000,
                        "correct": false,
                        "itemResponseTimeMs": 520,
                        "microLevel": 3.5,
                        "modeId": 4,
                        "quizStepId": 104144,
                        "sharedMeaningId": 14975,
                        "siteLanguage": "en",
                        "wordRootId": 412715
                    },
                    {
                        "completed": 1679883595000,
                        "correct": false,
                        "itemResponseTimeMs": 473,
                        "microLevel": 3.3,
                        "modeId": 4,
                        "quizStepId": 104144,
                        "sharedMeaningId": 20523,
                        "siteLanguage": "en",
                        "wordRootId": 416415
                    },
                    {
                        "completed": 1679883590000,
                        "correct": false,
                        "itemResponseTimeMs": 511,
                        "microLevel": 3.6,
                        "modeId": 4,
                        "quizStepId": 104144,
                        "sharedMeaningId": 9057,
                        "siteLanguage": "en",
                        "wordRootId": 419425
                    }
                ],
                "wordListTypeId": 39674
            },
            {
                "band": 5,
                "completed": 1679883620000,
                "created": 1679883603000,
                "modeIds": [
                    4
                ],
                "quizStepId": 104145,
                "quizWords": [
                    {
                        "completed": 1679883618000,
                        "correct": false,
                        "itemResponseTimeMs": 394,
                        "microLevel": 4.1,
                        "modeId": 4,
                        "quizStepId": 104145,
                        "sharedMeaningId": 23442,
                        "siteLanguage": "en",
                        "wordRootId": 71462
                    },
                    {
                        "completed": 1679883614000,
                        "correct": false,
                        "itemResponseTimeMs": 480,
                        "microLevel": 4.2,
                        "modeId": 4,
                        "quizStepId": 104145,
                        "sharedMeaningId": 21202,
                        "siteLanguage": "en",
                        "wordRootId": 112111
                    },
                    {
                        "completed": 1679883619000,
                        "correct": false,
                        "itemResponseTimeMs": 377,
                        "microLevel": 4.2,
                        "modeId": 4,
                        "quizStepId": 104145,
                        "sharedMeaningId": 23927,
                        "siteLanguage": "en",
                        "wordRootId": 128195
                    },
                    {
                        "completed": 1679883619000,
                        "correct": false,
                        "itemResponseTimeMs": 472,
                        "microLevel": 4,
                        "modeId": 4,
                        "quizStepId": 104145,
                        "sharedMeaningId": 31251,
                        "siteLanguage": "en",
                        "wordRootId": 400711
                    },
                    {
                        "completed": 1679883612000,
                        "correct": false,
                        "itemResponseTimeMs": 448,
                        "microLevel": 3.8,
                        "modeId": 4,
                        "quizStepId": 104145,
                        "sharedMeaningId": 20858,
                        "siteLanguage": "en",
                        "wordRootId": 402799
                    },
                    {
                        "completed": 1679883618000,
                        "correct": false,
                        "itemResponseTimeMs": 391,
                        "microLevel": 3.8,
                        "modeId": 4,
                        "quizStepId": 104145,
                        "sharedMeaningId": 23561,
                        "siteLanguage": "en",
                        "wordRootId": 402877
                    },
                    {
                        "completed": 1679883610000,
                        "correct": false,
                        "itemResponseTimeMs": 423,
                        "microLevel": 3.7,
                        "modeId": 4,
                        "quizStepId": 104145,
                        "sharedMeaningId": 8270,
                        "siteLanguage": "en",
                        "wordRootId": 404769
                    },
                    {
                        "completed": 1679883610000,
                        "correct": false,
                        "itemResponseTimeMs": 505,
                        "microLevel": 3.9,
                        "modeId": 4,
                        "quizStepId": 104145,
                        "sharedMeaningId": 15042,
                        "siteLanguage": "en",
                        "wordRootId": 405110
                    },
                    {
                        "completed": 1679883616000,
                        "correct": false,
                        "itemResponseTimeMs": 400,
                        "microLevel": 4,
                        "modeId": 4,
                        "quizStepId": 104145,
                        "sharedMeaningId": 22014,
                        "siteLanguage": "en",
                        "wordRootId": 405744
                    },
                    {
                        "completed": 1679883609000,
                        "correct": false,
                        "itemResponseTimeMs": 383,
                        "microLevel": 4.2,
                        "modeId": 4,
                        "quizStepId": 104145,
                        "sharedMeaningId": 7828,
                        "siteLanguage": "en",
                        "wordRootId": 405799
                    },
                    {
                        "completed": 1679883611000,
                        "correct": false,
                        "itemResponseTimeMs": 408,
                        "microLevel": 3.7,
                        "modeId": 4,
                        "quizStepId": 104145,
                        "sharedMeaningId": 19747,
                        "siteLanguage": "en",
                        "wordRootId": 406510
                    },
                    {
                        "completed": 1679883611000,
                        "correct": false,
                        "itemResponseTimeMs": 386,
                        "microLevel": 3.9,
                        "modeId": 4,
                        "quizStepId": 104145,
                        "sharedMeaningId": 19131,
                        "siteLanguage": "en",
                        "wordRootId": 407169
                    },
                    {
                        "completed": 1679883612000,
                        "correct": false,
                        "itemResponseTimeMs": 529,
                        "microLevel": 4.1,
                        "modeId": 4,
                        "quizStepId": 104145,
                        "sharedMeaningId": 20380,
                        "siteLanguage": "en",
                        "wordRootId": 407749
                    },
                    {
                        "completed": 1679883617000,
                        "correct": false,
                        "itemResponseTimeMs": 450,
                        "microLevel": 3.8,
                        "modeId": 4,
                        "quizStepId": 104145,
                        "sharedMeaningId": 23328,
                        "siteLanguage": "en",
                        "wordRootId": 409607
                    },
                    {
                        "completed": 1679883608000,
                        "correct": false,
                        "itemResponseTimeMs": 422,
                        "microLevel": 4.1,
                        "modeId": 4,
                        "quizStepId": 104145,
                        "sharedMeaningId": 7713,
                        "siteLanguage": "en",
                        "wordRootId": 411159
                    },
                    {
                        "completed": 1679883619000,
                        "correct": false,
                        "itemResponseTimeMs": 392,
                        "microLevel": 4,
                        "modeId": 4,
                        "quizStepId": 104145,
                        "sharedMeaningId": 24915,
                        "siteLanguage": "en",
                        "wordRootId": 414415
                    },
                    {
                        "completed": 1679883610000,
                        "correct": false,
                        "itemResponseTimeMs": 394,
                        "microLevel": 3.7,
                        "modeId": 4,
                        "quizStepId": 104145,
                        "sharedMeaningId": 18925,
                        "siteLanguage": "en",
                        "wordRootId": 416268
                    },
                    {
                        "completed": 1679883615000,
                        "correct": false,
                        "itemResponseTimeMs": 538,
                        "microLevel": 3.9,
                        "modeId": 4,
                        "quizStepId": 104145,
                        "sharedMeaningId": 21946,
                        "siteLanguage": "en",
                        "wordRootId": 417980
                    },
                    {
                        "completed": 1679883606000,
                        "correct": false,
                        "itemResponseTimeMs": 1156,
                        "microLevel": 3.6,
                        "modeId": 4,
                        "quizStepId": 104145,
                        "sharedMeaningId": 65,
                        "siteLanguage": "en",
                        "wordRootId": 419244
                    },
                    {
                        "completed": 1679883607000,
                        "correct": false,
                        "itemResponseTimeMs": 525,
                        "microLevel": 3.6,
                        "modeId": 4,
                        "quizStepId": 104145,
                        "sharedMeaningId": 6303,
                        "siteLanguage": "en",
                        "wordRootId": 428774
                    }
                ],
                "wordListTypeId": 39674
            },
            {
                "band": 6,
                "completed": 1679883636000,
                "created": 1679883621000,
                "modeIds": [
                    4
                ],
                "quizStepId": 104146,
                "quizWords": [
                    {
                        "completed": 1679883635000,
                        "correct": false,
                        "itemResponseTimeMs": 320,
                        "microLevel": 4.4,
                        "modeId": 4,
                        "quizStepId": 104146,
                        "sharedMeaningId": 36885,
                        "siteLanguage": "en",
                        "wordRootId": 402622
                    },
                    {
                        "completed": 1679883629000,
                        "correct": false,
                        "itemResponseTimeMs": 401,
                        "microLevel": 4.3,
                        "modeId": 4,
                        "quizStepId": 104146,
                        "sharedMeaningId": 16622,
                        "siteLanguage": "en",
                        "wordRootId": 403014
                    },
                    {
                        "completed": 1679883626000,
                        "correct": false,
                        "itemResponseTimeMs": 432,
                        "microLevel": 4.5,
                        "modeId": 4,
                        "quizStepId": 104146,
                        "sharedMeaningId": 14946,
                        "siteLanguage": "en",
                        "wordRootId": 403764
                    },
                    {
                        "completed": 1679883632000,
                        "correct": false,
                        "itemResponseTimeMs": 376,
                        "microLevel": 4.9,
                        "modeId": 4,
                        "quizStepId": 104146,
                        "sharedMeaningId": 24297,
                        "siteLanguage": "en",
                        "wordRootId": 404392
                    },
                    {
                        "completed": 1679883633000,
                        "correct": false,
                        "itemResponseTimeMs": 456,
                        "microLevel": 4.3,
                        "modeId": 4,
                        "quizStepId": 104146,
                        "sharedMeaningId": 24992,
                        "siteLanguage": "en",
                        "wordRootId": 404925
                    },
                    {
                        "completed": 1679883636000,
                        "correct": false,
                        "itemResponseTimeMs": 377,
                        "microLevel": 4.5,
                        "modeId": 4,
                        "quizStepId": 104146,
                        "sharedMeaningId": 47227,
                        "siteLanguage": "en",
                        "wordRootId": 405884
                    },
                    {
                        "completed": 1679883630000,
                        "correct": false,
                        "itemResponseTimeMs": 383,
                        "microLevel": 4.5,
                        "modeId": 4,
                        "quizStepId": 104146,
                        "sharedMeaningId": 23014,
                        "siteLanguage": "en",
                        "wordRootId": 406133
                    },
                    {
                        "completed": 1679883631000,
                        "correct": false,
                        "itemResponseTimeMs": 384,
                        "microLevel": 4.4,
                        "modeId": 4,
                        "quizStepId": 104146,
                        "sharedMeaningId": 23558,
                        "siteLanguage": "en",
                        "wordRootId": 406330
                    },
                    {
                        "completed": 1679883630000,
                        "correct": false,
                        "itemResponseTimeMs": 378,
                        "microLevel": 4.9,
                        "modeId": 4,
                        "quizStepId": 104146,
                        "sharedMeaningId": 20787,
                        "siteLanguage": "en",
                        "wordRootId": 406909
                    },
                    {
                        "completed": 1679883628000,
                        "correct": false,
                        "itemResponseTimeMs": 354,
                        "microLevel": 4.8,
                        "modeId": 4,
                        "quizStepId": 104146,
                        "sharedMeaningId": 19908,
                        "siteLanguage": "en",
                        "wordRootId": 407594
                    },
                    {
                        "completed": 1679883623000,
                        "correct": false,
                        "itemResponseTimeMs": 1156,
                        "microLevel": 4.3,
                        "modeId": 4,
                        "quizStepId": 104146,
                        "sharedMeaningId": 4764,
                        "siteLanguage": "en",
                        "wordRootId": 408521
                    },
                    {
                        "completed": 1679883631000,
                        "correct": false,
                        "itemResponseTimeMs": 360,
                        "microLevel": 4.6,
                        "modeId": 4,
                        "quizStepId": 104146,
                        "sharedMeaningId": 24107,
                        "siteLanguage": "en",
                        "wordRootId": 409058
                    },
                    {
                        "completed": 1679883628000,
                        "correct": false,
                        "itemResponseTimeMs": 398,
                        "microLevel": 4.7,
                        "modeId": 4,
                        "quizStepId": 104146,
                        "sharedMeaningId": 20854,
                        "siteLanguage": "en",
                        "wordRootId": 409858
                    },
                    {
                        "completed": 1679883629000,
                        "correct": false,
                        "itemResponseTimeMs": 345,
                        "microLevel": 4.7,
                        "modeId": 4,
                        "quizStepId": 104146,
                        "sharedMeaningId": 21675,
                        "siteLanguage": "en",
                        "wordRootId": 412729
                    },
                    {
                        "completed": 1679883627000,
                        "correct": false,
                        "itemResponseTimeMs": 383,
                        "microLevel": 4.6,
                        "modeId": 4,
                        "quizStepId": 104146,
                        "sharedMeaningId": 4778,
                        "siteLanguage": "en",
                        "wordRootId": 413223
                    },
                    {
                        "completed": 1679883630000,
                        "correct": false,
                        "itemResponseTimeMs": 384,
                        "microLevel": 4.6,
                        "modeId": 4,
                        "quizStepId": 104146,
                        "sharedMeaningId": 23390,
                        "siteLanguage": "en",
                        "wordRootId": 414008
                    },
                    {
                        "completed": 1679883625000,
                        "correct": false,
                        "itemResponseTimeMs": 425,
                        "microLevel": 4.4,
                        "modeId": 4,
                        "quizStepId": 104146,
                        "sharedMeaningId": 6420,
                        "siteLanguage": "en",
                        "wordRootId": 415407
                    },
                    {
                        "completed": 1679883628000,
                        "correct": false,
                        "itemResponseTimeMs": 409,
                        "microLevel": 4.8,
                        "modeId": 4,
                        "quizStepId": 104146,
                        "sharedMeaningId": 6476,
                        "siteLanguage": "en",
                        "wordRootId": 416704
                    },
                    {
                        "completed": 1679883634000,
                        "correct": false,
                        "itemResponseTimeMs": 391,
                        "microLevel": 4.7,
                        "modeId": 4,
                        "quizStepId": 104146,
                        "sharedMeaningId": 25148,
                        "siteLanguage": "en",
                        "wordRootId": 417167
                    },
                    {
                        "completed": 1679883629000,
                        "correct": false,
                        "itemResponseTimeMs": 376,
                        "microLevel": 4.8,
                        "modeId": 4,
                        "quizStepId": 104146,
                        "sharedMeaningId": 22248,
                        "siteLanguage": "en",
                        "wordRootId": 417901
                    }
                ],
                "wordListTypeId": 39674
            },
            {
                "band": 7,
                "completed": 1679883656000,
                "created": 1679883638000,
                "modeIds": [
                    4
                ],
                "quizStepId": 104147,
                "quizWords": [
                    {
                        "completed": 1679883646000,
                        "correct": false,
                        "itemResponseTimeMs": 441,
                        "microLevel": 5.2,
                        "modeId": 4,
                        "quizStepId": 104147,
                        "sharedMeaningId": 22334,
                        "siteLanguage": "en",
                        "wordRootId": 128604
                    },
                    {
                        "completed": 1679883654000,
                        "correct": false,
                        "itemResponseTimeMs": 478,
                        "microLevel": 5.3,
                        "modeId": 4,
                        "quizStepId": 104147,
                        "sharedMeaningId": 25124,
                        "siteLanguage": "en",
                        "wordRootId": 180706
                    },
                    {
                        "completed": 1679883650000,
                        "correct": false,
                        "itemResponseTimeMs": 462,
                        "microLevel": 5.1,
                        "modeId": 4,
                        "quizStepId": 104147,
                        "sharedMeaningId": 23874,
                        "siteLanguage": "en",
                        "wordRootId": 400233
                    },
                    {
                        "completed": 1679883643000,
                        "correct": false,
                        "itemResponseTimeMs": 525,
                        "microLevel": 4.9,
                        "modeId": 4,
                        "quizStepId": 104147,
                        "sharedMeaningId": 8597,
                        "siteLanguage": "en",
                        "wordRootId": 400612
                    },
                    {
                        "completed": 1679883640000,
                        "correct": false,
                        "itemResponseTimeMs": 824,
                        "microLevel": 5.4,
                        "modeId": 4,
                        "quizStepId": 104147,
                        "sharedMeaningId": 34,
                        "siteLanguage": "en",
                        "wordRootId": 400794
                    },
                    {
                        "completed": 1679883646000,
                        "correct": false,
                        "itemResponseTimeMs": 383,
                        "microLevel": 5.4,
                        "modeId": 4,
                        "quizStepId": 104147,
                        "sharedMeaningId": 17012,
                        "siteLanguage": "en",
                        "wordRootId": 401560
                    },
                    {
                        "completed": 1679883655000,
                        "correct": false,
                        "itemResponseTimeMs": 513,
                        "microLevel": 5.3,
                        "modeId": 4,
                        "quizStepId": 104147,
                        "sharedMeaningId": 37820,
                        "siteLanguage": "en",
                        "wordRootId": 403521
                    },
                    {
                        "completed": 1679883645000,
                        "correct": false,
                        "itemResponseTimeMs": 375,
                        "microLevel": 5.5,
                        "modeId": 4,
                        "quizStepId": 104147,
                        "sharedMeaningId": 13586,
                        "siteLanguage": "en",
                        "wordRootId": 404222
                    },
                    {
                        "completed": 1679883652000,
                        "correct": false,
                        "itemResponseTimeMs": 448,
                        "microLevel": 5.5,
                        "modeId": 4,
                        "quizStepId": 104147,
                        "sharedMeaningId": 24686,
                        "siteLanguage": "en",
                        "wordRootId": 404647
                    },
                    {
                        "completed": 1679883641000,
                        "correct": false,
                        "itemResponseTimeMs": 374,
                        "microLevel": 5.6,
                        "modeId": 4,
                        "quizStepId": 104147,
                        "sharedMeaningId": 1998,
                        "siteLanguage": "en",
                        "wordRootId": 405011
                    },
                    {
                        "completed": 1679883654000,
                        "correct": false,
                        "itemResponseTimeMs": 503,
                        "microLevel": 5.3,
                        "modeId": 4,
                        "quizStepId": 104147,
                        "sharedMeaningId": 25265,
                        "siteLanguage": "en",
                        "wordRootId": 405140
                    },
                    {
                        "completed": 1679883645000,
                        "correct": false,
                        "itemResponseTimeMs": 480,
                        "microLevel": 5,
                        "modeId": 4,
                        "quizStepId": 104147,
                        "sharedMeaningId": 12348,
                        "siteLanguage": "en",
                        "wordRootId": 405989
                    },
                    {
                        "completed": 1679883653000,
                        "correct": false,
                        "itemResponseTimeMs": 511,
                        "microLevel": 5,
                        "modeId": 4,
                        "quizStepId": 104147,
                        "sharedMeaningId": 24951,
                        "siteLanguage": "en",
                        "wordRootId": 406473
                    },
                    {
                        "completed": 1679883648000,
                        "correct": false,
                        "itemResponseTimeMs": 505,
                        "microLevel": 5.2,
                        "modeId": 4,
                        "quizStepId": 104147,
                        "sharedMeaningId": 23129,
                        "siteLanguage": "en",
                        "wordRootId": 406978
                    },
                    {
                        "completed": 1679883644000,
                        "correct": false,
                        "itemResponseTimeMs": 433,
                        "microLevel": 5.5,
                        "modeId": 4,
                        "quizStepId": 104147,
                        "sharedMeaningId": 9272,
                        "siteLanguage": "en",
                        "wordRootId": 408392
                    },
                    {
                        "completed": 1679883647000,
                        "correct": false,
                        "itemResponseTimeMs": 442,
                        "microLevel": 5.4,
                        "modeId": 4,
                        "quizStepId": 104147,
                        "sharedMeaningId": 22372,
                        "siteLanguage": "en",
                        "wordRootId": 411453
                    },
                    {
                        "completed": 1679883651000,
                        "correct": false,
                        "itemResponseTimeMs": 442,
                        "microLevel": 5.1,
                        "modeId": 4,
                        "quizStepId": 104147,
                        "sharedMeaningId": 23951,
                        "siteLanguage": "en",
                        "wordRootId": 411496
                    },
                    {
                        "completed": 1679883649000,
                        "correct": false,
                        "itemResponseTimeMs": 455,
                        "microLevel": 5.1,
                        "modeId": 4,
                        "quizStepId": 104147,
                        "sharedMeaningId": 23794,
                        "siteLanguage": "en",
                        "wordRootId": 415411
                    },
                    {
                        "completed": 1679883648000,
                        "correct": false,
                        "itemResponseTimeMs": 442,
                        "microLevel": 5.2,
                        "modeId": 4,
                        "quizStepId": 104147,
                        "sharedMeaningId": 22653,
                        "siteLanguage": "en",
                        "wordRootId": 415908
                    },
                    {
                        "completed": 1679883642000,
                        "correct": false,
                        "itemResponseTimeMs": 399,
                        "microLevel": 5,
                        "modeId": 4,
                        "quizStepId": 104147,
                        "sharedMeaningId": 5679,
                        "siteLanguage": "en",
                        "wordRootId": 416783
                    }
                ],
                "wordListTypeId": 39674
            },
            {
                "band": 8,
                "completed": 1679883675000,
                "created": 1679883657000,
                "modeIds": [
                    4
                ],
                "quizStepId": 104148,
                "quizWords": [
                    {
                        "completed": 1679883674000,
                        "correct": false,
                        "itemResponseTimeMs": 431,
                        "microLevel": 6.2,
                        "modeId": 4,
                        "quizStepId": 104148,
                        "sharedMeaningId": 34925,
                        "siteLanguage": "en",
                        "wordRootId": 400088
                    },
                    {
                        "completed": 1679883667000,
                        "correct": false,
                        "itemResponseTimeMs": 495,
                        "microLevel": 5.9,
                        "modeId": 4,
                        "quizStepId": 104148,
                        "sharedMeaningId": 21497,
                        "siteLanguage": "en",
                        "wordRootId": 400128
                    },
                    {
                        "completed": 1679883663000,
                        "correct": false,
                        "itemResponseTimeMs": 416,
                        "microLevel": 5.8,
                        "modeId": 4,
                        "quizStepId": 104148,
                        "sharedMeaningId": 6598,
                        "siteLanguage": "en",
                        "wordRootId": 400132
                    },
                    {
                        "completed": 1679883671000,
                        "correct": false,
                        "itemResponseTimeMs": 437,
                        "microLevel": 6.1,
                        "modeId": 4,
                        "quizStepId": 104148,
                        "sharedMeaningId": 22259,
                        "siteLanguage": "en",
                        "wordRootId": 401128
                    },
                    {
                        "completed": 1679883667000,
                        "correct": false,
                        "itemResponseTimeMs": 483,
                        "microLevel": 5.9,
                        "modeId": 4,
                        "quizStepId": 104148,
                        "sharedMeaningId": 20531,
                        "siteLanguage": "en",
                        "wordRootId": 402068
                    },
                    {
                        "completed": 1679883668000,
                        "correct": false,
                        "itemResponseTimeMs": 467,
                        "microLevel": 5.7,
                        "modeId": 4,
                        "quizStepId": 104148,
                        "sharedMeaningId": 21816,
                        "siteLanguage": "en",
                        "wordRootId": 402474
                    },
                    {
                        "completed": 1679883662000,
                        "correct": false,
                        "itemResponseTimeMs": 407,
                        "microLevel": 5.7,
                        "modeId": 4,
                        "quizStepId": 104148,
                        "sharedMeaningId": 5682,
                        "siteLanguage": "en",
                        "wordRootId": 404106
                    },
                    {
                        "completed": 1679883672000,
                        "correct": false,
                        "itemResponseTimeMs": 477,
                        "microLevel": 5.6,
                        "modeId": 4,
                        "quizStepId": 104148,
                        "sharedMeaningId": 22637,
                        "siteLanguage": "en",
                        "wordRootId": 404472
                    },
                    {
                        "completed": 1679883660000,
                        "correct": false,
                        "itemResponseTimeMs": 1096,
                        "microLevel": 6,
                        "modeId": 4,
                        "quizStepId": 104148,
                        "sharedMeaningId": 3836,
                        "siteLanguage": "en",
                        "wordRootId": 405918
                    },
                    {
                        "completed": 1679883673000,
                        "correct": false,
                        "itemResponseTimeMs": 430,
                        "microLevel": 6.1,
                        "modeId": 4,
                        "quizStepId": 104148,
                        "sharedMeaningId": 22715,
                        "siteLanguage": "en",
                        "wordRootId": 409721
                    },
                    {
                        "completed": 1679883664000,
                        "correct": false,
                        "itemResponseTimeMs": 399,
                        "microLevel": 6,
                        "modeId": 4,
                        "quizStepId": 104148,
                        "sharedMeaningId": 10631,
                        "siteLanguage": "en",
                        "wordRootId": 411143
                    },
                    {
                        "completed": 1679883669000,
                        "correct": false,
                        "itemResponseTimeMs": 439,
                        "microLevel": 5.7,
                        "modeId": 4,
                        "quizStepId": 104148,
                        "sharedMeaningId": 21883,
                        "siteLanguage": "en",
                        "wordRootId": 413017
                    },
                    {
                        "completed": 1679883665000,
                        "correct": false,
                        "itemResponseTimeMs": 440,
                        "microLevel": 6.2,
                        "modeId": 4,
                        "quizStepId": 104148,
                        "sharedMeaningId": 11174,
                        "siteLanguage": "en",
                        "wordRootId": 413364
                    },
                    {
                        "completed": 1679883661000,
                        "correct": false,
                        "itemResponseTimeMs": 408,
                        "microLevel": 6,
                        "modeId": 4,
                        "quizStepId": 104148,
                        "sharedMeaningId": 4867,
                        "siteLanguage": "en",
                        "wordRootId": 413946
                    },
                    {
                        "completed": 1679883666000,
                        "correct": false,
                        "itemResponseTimeMs": 464,
                        "microLevel": 6.1,
                        "modeId": 4,
                        "quizStepId": 104148,
                        "sharedMeaningId": 17136,
                        "siteLanguage": "en",
                        "wordRootId": 414045
                    },
                    {
                        "completed": 1679883674000,
                        "correct": false,
                        "itemResponseTimeMs": 457,
                        "microLevel": 5.8,
                        "modeId": 4,
                        "quizStepId": 104148,
                        "sharedMeaningId": 23759,
                        "siteLanguage": "en",
                        "wordRootId": 415752
                    },
                    {
                        "completed": 1679883665000,
                        "correct": false,
                        "itemResponseTimeMs": 425,
                        "microLevel": 5.9,
                        "modeId": 4,
                        "quizStepId": 104148,
                        "sharedMeaningId": 16439,
                        "siteLanguage": "en",
                        "wordRootId": 416693
                    },
                    {
                        "completed": 1679883670000,
                        "correct": false,
                        "itemResponseTimeMs": 463,
                        "microLevel": 5.6,
                        "modeId": 4,
                        "quizStepId": 104148,
                        "sharedMeaningId": 22168,
                        "siteLanguage": "en",
                        "wordRootId": 418135
                    },
                    {
                        "completed": 1679883662000,
                        "correct": false,
                        "itemResponseTimeMs": 346,
                        "microLevel": 6.2,
                        "modeId": 4,
                        "quizStepId": 104148,
                        "sharedMeaningId": 6289,
                        "siteLanguage": "en",
                        "wordRootId": 418656
                    },
                    {
                        "completed": 1679883666000,
                        "correct": false,
                        "itemResponseTimeMs": 430,
                        "microLevel": 5.8,
                        "modeId": 4,
                        "quizStepId": 104148,
                        "sharedMeaningId": 16607,
                        "siteLanguage": "en",
                        "wordRootId": 419238
                    }
                ],
                "wordListTypeId": 39674
            },
            {
                "band": 9,
                "completed": 1679883696000,
                "created": 1679883677000,
                "modeIds": [
                    4
                ],
                "quizStepId": 104149,
                "quizWords": [
                    {
                        "completed": 1679883687000,
                        "correct": false,
                        "itemResponseTimeMs": 454,
                        "microLevel": 6.6,
                        "modeId": 4,
                        "quizStepId": 104149,
                        "sharedMeaningId": 18247,
                        "siteLanguage": "en",
                        "wordRootId": 462
                    },
                    {
                        "completed": 1679883694000,
                        "correct": false,
                        "itemResponseTimeMs": 415,
                        "microLevel": 6.8,
                        "modeId": 4,
                        "quizStepId": 104149,
                        "sharedMeaningId": 34561,
                        "siteLanguage": "en",
                        "wordRootId": 41086
                    },
                    {
                        "completed": 1679883686000,
                        "correct": false,
                        "itemResponseTimeMs": 401,
                        "microLevel": 6.3,
                        "modeId": 4,
                        "quizStepId": 104149,
                        "sharedMeaningId": 16854,
                        "siteLanguage": "en",
                        "wordRootId": 168512
                    },
                    {
                        "completed": 1679883690000,
                        "correct": false,
                        "itemResponseTimeMs": 455,
                        "microLevel": 6.8,
                        "modeId": 4,
                        "quizStepId": 104149,
                        "sharedMeaningId": 22860,
                        "siteLanguage": "en",
                        "wordRootId": 168712
                    },
                    {
                        "completed": 1679883680000,
                        "correct": false,
                        "itemResponseTimeMs": 983,
                        "microLevel": 6.5,
                        "modeId": 4,
                        "quizStepId": 104149,
                        "sharedMeaningId": 2820,
                        "siteLanguage": "en",
                        "wordRootId": 173385
                    },
                    {
                        "completed": 1679883681000,
                        "correct": false,
                        "itemResponseTimeMs": 393,
                        "microLevel": 6.4,
                        "modeId": 4,
                        "quizStepId": 104149,
                        "sharedMeaningId": 5797,
                        "siteLanguage": "en",
                        "wordRootId": 400102
                    },
                    {
                        "completed": 1679883691000,
                        "correct": false,
                        "itemResponseTimeMs": 453,
                        "microLevel": 6.5,
                        "modeId": 4,
                        "quizStepId": 104149,
                        "sharedMeaningId": 23641,
                        "siteLanguage": "en",
                        "wordRootId": 403624
                    },
                    {
                        "completed": 1679883695000,
                        "correct": false,
                        "itemResponseTimeMs": 392,
                        "microLevel": 6.4,
                        "modeId": 4,
                        "quizStepId": 104149,
                        "sharedMeaningId": 36049,
                        "siteLanguage": "en",
                        "wordRootId": 405008
                    },
                    {
                        "completed": 1679883681000,
                        "correct": false,
                        "itemResponseTimeMs": 383,
                        "microLevel": 6.3,
                        "modeId": 4,
                        "quizStepId": 104149,
                        "sharedMeaningId": 4359,
                        "siteLanguage": "en",
                        "wordRootId": 405588
                    },
                    {
                        "completed": 1679883684000,
                        "correct": false,
                        "itemResponseTimeMs": 863,
                        "microLevel": 6.8,
                        "modeId": 4,
                        "quizStepId": 104149,
                        "sharedMeaningId": 10070,
                        "siteLanguage": "en",
                        "wordRootId": 405739
                    },
                    {
                        "completed": 1679883689000,
                        "correct": false,
                        "itemResponseTimeMs": 446,
                        "microLevel": 6.9,
                        "modeId": 4,
                        "quizStepId": 104149,
                        "sharedMeaningId": 20454,
                        "siteLanguage": "en",
                        "wordRootId": 408426
                    },
                    {
                        "completed": 1679883693000,
                        "correct": false,
                        "itemResponseTimeMs": 397,
                        "microLevel": 6.4,
                        "modeId": 4,
                        "quizStepId": 104149,
                        "sharedMeaningId": 24984,
                        "siteLanguage": "en",
                        "wordRootId": 408870
                    },
                    {
                        "completed": 1679883686000,
                        "correct": false,
                        "itemResponseTimeMs": 471,
                        "microLevel": 6.7,
                        "modeId": 4,
                        "quizStepId": 104149,
                        "sharedMeaningId": 12993,
                        "siteLanguage": "en",
                        "wordRootId": 408917
                    },
                    {
                        "completed": 1679883690000,
                        "correct": false,
                        "itemResponseTimeMs": 415,
                        "microLevel": 6.7,
                        "modeId": 4,
                        "quizStepId": 104149,
                        "sharedMeaningId": 22107,
                        "siteLanguage": "en",
                        "wordRootId": 412167
                    },
                    {
                        "completed": 1679883683000,
                        "correct": false,
                        "itemResponseTimeMs": 450,
                        "microLevel": 6.9,
                        "modeId": 4,
                        "quizStepId": 104149,
                        "sharedMeaningId": 6314,
                        "siteLanguage": "en",
                        "wordRootId": 412463
                    },
                    {
                        "completed": 1679883696000,
                        "correct": false,
                        "itemResponseTimeMs": 496,
                        "microLevel": 6.7,
                        "modeId": 4,
                        "quizStepId": 104149,
                        "sharedMeaningId": 36291,
                        "siteLanguage": "en",
                        "wordRootId": 412492
                    },
                    {
                        "completed": 1679883683000,
                        "correct": false,
                        "itemResponseTimeMs": 439,
                        "microLevel": 6.3,
                        "modeId": 4,
                        "quizStepId": 104149,
                        "sharedMeaningId": 5980,
                        "siteLanguage": "en",
                        "wordRootId": 412929
                    },
                    {
                        "completed": 1679883692000,
                        "correct": false,
                        "itemResponseTimeMs": 432,
                        "microLevel": 6.5,
                        "modeId": 4,
                        "quizStepId": 104149,
                        "sharedMeaningId": 24155,
                        "siteLanguage": "en",
                        "wordRootId": 415718
                    },
                    {
                        "completed": 1679883693000,
                        "correct": false,
                        "itemResponseTimeMs": 493,
                        "microLevel": 6.6,
                        "modeId": 4,
                        "quizStepId": 104149,
                        "sharedMeaningId": 24577,
                        "siteLanguage": "en",
                        "wordRootId": 416104
                    },
                    {
                        "completed": 1679883685000,
                        "correct": false,
                        "itemResponseTimeMs": 398,
                        "microLevel": 6.6,
                        "modeId": 4,
                        "quizStepId": 104149,
                        "sharedMeaningId": 12517,
                        "siteLanguage": "en",
                        "wordRootId": 419049
                    }
                ],
                "wordListTypeId": 39674
            },
            {
                "band": 10,
                "completed": 1679883715000,
                "created": 1679883698000,
                "modeIds": [
                    4
                ],
                "quizStepId": 104150,
                "quizWords": [
                    {
                        "completed": 1679883703000,
                        "correct": false,
                        "itemResponseTimeMs": 638,
                        "microLevel": 7.2,
                        "modeId": 4,
                        "quizStepId": 104150,
                        "sharedMeaningId": 6597,
                        "siteLanguage": "en",
                        "wordRootId": 32197
                    },
                    {
                        "completed": 1679883707000,
                        "correct": false,
                        "itemResponseTimeMs": 398,
                        "microLevel": 7,
                        "modeId": 4,
                        "quizStepId": 104150,
                        "sharedMeaningId": 18472,
                        "siteLanguage": "en",
                        "wordRootId": 33534
                    },
                    {
                        "completed": 1679883714000,
                        "correct": false,
                        "itemResponseTimeMs": 414,
                        "microLevel": 7.3,
                        "modeId": 4,
                        "quizStepId": 104150,
                        "sharedMeaningId": 51062,
                        "siteLanguage": "en",
                        "wordRootId": 139374
                    },
                    {
                        "completed": 1679883712000,
                        "correct": false,
                        "itemResponseTimeMs": 439,
                        "microLevel": 7,
                        "modeId": 4,
                        "quizStepId": 104150,
                        "sharedMeaningId": 25268,
                        "siteLanguage": "en",
                        "wordRootId": 198217
                    },
                    {
                        "completed": 1679883701000,
                        "correct": false,
                        "itemResponseTimeMs": 389,
                        "microLevel": 6.9,
                        "modeId": 4,
                        "quizStepId": 104150,
                        "sharedMeaningId": 3783,
                        "siteLanguage": "en",
                        "wordRootId": 316156
                    },
                    {
                        "completed": 1679883713000,
                        "correct": false,
                        "itemResponseTimeMs": 528,
                        "microLevel": 7.1,
                        "modeId": 4,
                        "quizStepId": 104150,
                        "sharedMeaningId": 36168,
                        "siteLanguage": "en",
                        "wordRootId": 401166
                    },
                    {
                        "completed": 1679883703000,
                        "correct": false,
                        "itemResponseTimeMs": 400,
                        "microLevel": 7,
                        "modeId": 4,
                        "quizStepId": 104150,
                        "sharedMeaningId": 6035,
                        "siteLanguage": "en",
                        "wordRootId": 402226
                    },
                    {
                        "completed": 1679883709000,
                        "correct": false,
                        "itemResponseTimeMs": 431,
                        "microLevel": 7.1,
                        "modeId": 4,
                        "quizStepId": 104150,
                        "sharedMeaningId": 22414,
                        "siteLanguage": "en",
                        "wordRootId": 404435
                    },
                    {
                        "completed": 1679883712000,
                        "correct": false,
                        "itemResponseTimeMs": 420,
                        "microLevel": 7.5,
                        "modeId": 4,
                        "quizStepId": 104150,
                        "sharedMeaningId": 35166,
                        "siteLanguage": "en",
                        "wordRootId": 404976
                    },
                    {
                        "completed": 1679883708000,
                        "correct": false,
                        "itemResponseTimeMs": 383,
                        "microLevel": 7.1,
                        "modeId": 4,
                        "quizStepId": 104150,
                        "sharedMeaningId": 22382,
                        "siteLanguage": "en",
                        "wordRootId": 407151
                    },
                    {
                        "completed": 1679883710000,
                        "correct": false,
                        "itemResponseTimeMs": 436,
                        "microLevel": 7.2,
                        "modeId": 4,
                        "quizStepId": 104150,
                        "sharedMeaningId": 23443,
                        "siteLanguage": "en",
                        "wordRootId": 408862
                    },
                    {
                        "completed": 1679883711000,
                        "correct": false,
                        "itemResponseTimeMs": 432,
                        "microLevel": 7.6,
                        "modeId": 4,
                        "quizStepId": 104150,
                        "sharedMeaningId": 23879,
                        "siteLanguage": "en",
                        "wordRootId": 410785
                    },
                    {
                        "completed": 1679883705000,
                        "correct": false,
                        "itemResponseTimeMs": 391,
                        "microLevel": 7.4,
                        "modeId": 4,
                        "quizStepId": 104150,
                        "sharedMeaningId": 15322,
                        "siteLanguage": "en",
                        "wordRootId": 411792
                    },
                    {
                        "completed": 1679883707000,
                        "correct": false,
                        "itemResponseTimeMs": 529,
                        "microLevel": 7.2,
                        "modeId": 4,
                        "quizStepId": 104150,
                        "sharedMeaningId": 19805,
                        "siteLanguage": "en",
                        "wordRootId": 414440
                    },
                    {
                        "completed": 1679883701000,
                        "correct": false,
                        "itemResponseTimeMs": 1027,
                        "microLevel": 7.3,
                        "modeId": 4,
                        "quizStepId": 104150,
                        "sharedMeaningId": 1623,
                        "siteLanguage": "en",
                        "wordRootId": 416467
                    },
                    {
                        "completed": 1679883713000,
                        "correct": false,
                        "itemResponseTimeMs": 448,
                        "microLevel": 7.4,
                        "modeId": 4,
                        "quizStepId": 104150,
                        "sharedMeaningId": 49522,
                        "siteLanguage": "en",
                        "wordRootId": 416992
                    },
                    {
                        "completed": 1679883712000,
                        "correct": false,
                        "itemResponseTimeMs": 429,
                        "microLevel": 7.4,
                        "modeId": 4,
                        "quizStepId": 104150,
                        "sharedMeaningId": 24968,
                        "siteLanguage": "en",
                        "wordRootId": 417679
                    },
                    {
                        "completed": 1679883704000,
                        "correct": false,
                        "itemResponseTimeMs": 396,
                        "microLevel": 7.5,
                        "modeId": 4,
                        "quizStepId": 104150,
                        "sharedMeaningId": 14590,
                        "siteLanguage": "en",
                        "wordRootId": 418905
                    },
                    {
                        "completed": 1679883704000,
                        "correct": false,
                        "itemResponseTimeMs": 416,
                        "microLevel": 7.3,
                        "modeId": 4,
                        "quizStepId": 104150,
                        "sharedMeaningId": 14115,
                        "siteLanguage": "en",
                        "wordRootId": 436514
                    }
                ],
                "wordListTypeId": 39674
            }
        ]);
    }));

    describe("getPercentage and getResult", () => {
        let step = {
            "quizStepId": 104141,
            "band": 1,
            "created": 1679883429000,
            "completed": 1679883518000,
            "modeIds": [
                4
            ],
            "wordListTypeId": 39674,
            "quizWords": [
                {
                    "quizStepId": 104141,
                    "wordRootId": 80821,
                    "modeId": 4,
                    "correct": true,
                    "completed": 1679883476000,
                    "itemResponseTimeMs": 1976,
                    "siteLanguage": "en",
                    "sharedMeaningId": 24242,
                    "microLevel": 1.1
                },
                {
                    "quizStepId": 104141,
                    "wordRootId": 206906,
                    "modeId": 4,
                    "correct": true,
                    "completed": 1679883467000,
                    "itemResponseTimeMs": 4119,
                    "siteLanguage": "en",
                    "sharedMeaningId": 18890,
                    "microLevel": 1.5
                },
                {
                    "quizStepId": 104141,
                    "wordRootId": 400358,
                    "modeId": 4,
                    "correct": true,
                    "completed": 1679883447000,
                    "itemResponseTimeMs": 2049,
                    "siteLanguage": "en",
                    "sharedMeaningId": 13344,
                    "microLevel": 1.3
                },
                {
                    "quizStepId": 104141,
                    "wordRootId": 401922,
                    "modeId": 4,
                    "correct": true,
                    "completed": 1679883443000,
                    "itemResponseTimeMs": 1688,
                    "siteLanguage": "en",
                    "sharedMeaningId": 9704,
                    "microLevel": 1.3
                },
                {
                    "quizStepId": 104141,
                    "wordRootId": 404508,
                    "modeId": 4,
                    "correct": true,
                    "completed": 1679883439000,
                    "itemResponseTimeMs": 4555,
                    "siteLanguage": "en",
                    "sharedMeaningId": 2915
                },
                {
                    "quizStepId": 104141,
                    "wordRootId": 405403,
                    "modeId": 4,
                    "correct": true,
                    "completed": 1679883514000,
                    "itemResponseTimeMs": 6034,
                    "siteLanguage": "en",
                    "sharedMeaningId": 36477,
                    "microLevel": 1.6
                },
                {
                    "quizStepId": 104141,
                    "wordRootId": 405951,
                    "modeId": 4,
                    "correct": true,
                    "completed": 1679883458000,
                    "itemResponseTimeMs": 2011,
                    "siteLanguage": "en",
                    "sharedMeaningId": 18575,
                    "microLevel": 1.4
                },
                {
                    "quizStepId": 104141,
                    "wordRootId": 411233,
                    "modeId": 4,
                    "correct": true,
                    "completed": 1679883471000,
                    "itemResponseTimeMs": 4551,
                    "siteLanguage": "en",
                    "sharedMeaningId": 18995,
                    "microLevel": 1.4
                },
                {
                    "quizStepId": 104141,
                    "wordRootId": 411406,
                    "modeId": 4,
                    "correct": true,
                    "completed": 1679883442000,
                    "itemResponseTimeMs": 2241,
                    "siteLanguage": "en",
                    "sharedMeaningId": 8407,
                    "microLevel": 1.2
                },
                {
                    "quizStepId": 104141,
                    "wordRootId": 413663,
                    "modeId": 4,
                    "correct": true,
                    "completed": 1679883456000,
                    "itemResponseTimeMs": 5587,
                    "siteLanguage": "en",
                    "sharedMeaningId": 17706,
                    "microLevel": 1.4
                },
                {
                    "quizStepId": 104141,
                    "wordRootId": 414751,
                    "modeId": 4,
                    "correct": true,
                    "completed": 1679883449000,
                    "itemResponseTimeMs": 1576,
                    "siteLanguage": "en",
                    "sharedMeaningId": 17275,
                    "microLevel": 1
                },
                {
                    "quizStepId": 104141,
                    "wordRootId": 415020,
                    "modeId": 4,
                    "correct": true,
                    "completed": 1679883461000,
                    "itemResponseTimeMs": 3759,
                    "siteLanguage": "en",
                    "sharedMeaningId": 18751,
                    "microLevel": 1.2
                },
                {
                    "quizStepId": 104141,
                    "wordRootId": 415151,
                    "modeId": 4,
                    "correct": true,
                    "completed": 1679883507000,
                    "itemResponseTimeMs": 23787,
                    "siteLanguage": "en",
                    "sharedMeaningId": 35599,
                    "microLevel": 1.1
                },
                {
                    "quizStepId": 104141,
                    "wordRootId": 415631,
                    "modeId": 4,
                    "correct": true,
                    "completed": 1679883433000,
                    "itemResponseTimeMs": 2792,
                    "siteLanguage": "en",
                    "sharedMeaningId": 578,
                    "microLevel": 1.3
                },
                {
                    "quizStepId": 104141,
                    "wordRootId": 416996,
                    "modeId": 4,
                    "correct": true,
                    "completed": 1679883479000,
                    "itemResponseTimeMs": 2641,
                    "siteLanguage": "en",
                    "sharedMeaningId": 31071,
                    "microLevel": 1
                },
                {
                    "quizStepId": 104141,
                    "wordRootId": 417553,
                    "modeId": 4,
                    "correct": true,
                    "completed": 1679883475000,
                    "itemResponseTimeMs": 1552,
                    "siteLanguage": "en",
                    "sharedMeaningId": 19204,
                    "microLevel": 1.5
                },
                {
                    "quizStepId": 104141,
                    "wordRootId": 417765,
                    "modeId": 4,
                    "correct": false,
                    "completed": 1679883517000,
                    "itemResponseTimeMs": 2617,
                    "siteLanguage": "en",
                    "sharedMeaningId": 47425,
                    "microLevel": 1.1
                },
                {
                    "quizStepId": 104141,
                    "wordRootId": 419054,
                    "modeId": 4,
                    "correct": false,
                    "completed": 1679883483000,
                    "itemResponseTimeMs": 3277,
                    "siteLanguage": "en",
                    "sharedMeaningId": 34308,
                    "microLevel": 1.5
                }
            ]
        };

        test("sunny use case", () => {
            expect(component.getPercentage(step)).toBe(88.89);
            expect(component.getResult(step)).toBe("16/18");
        });

        test("empty quiz words", () => {
            step.quizWords = [];
            expect(component.getPercentage(step)).toBe(0);
            expect(component.getResult(step)).toBe("");
        });
    });
});
