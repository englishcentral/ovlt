import { LevelTestSetting } from "./level-test-setting";

export class VltQuizScore {
    score: number;
    computedBand: number;
    microLevel?: number;
    completed?: number;
}

export class LevelTestQuizWords {
    completed: number;
    correct: boolean;
    itemReponseTimeMs?: number;
    microLevel?: number;
    modeId: number;
    quizStepId: number;
    sharedMeaningId: number;
    siteLanguage: string;
    wordRootId: number;
}

export class LevelTestStep {
    band: number;
    completed: number;
    created: number;
    modeIds: number[];
    quizStepId: number;
    quizWords: LevelTestQuizWords[];
    wordListTypeId: number;
}

export class LevelTestHistory {
    accountId: number;
    levelTestSettingId: number;
    levelTestSteps: LevelTestStep[];
}

export const OVLT_LOOKUP = {
    1: { levelTestSettingId: 801, wordListTypeId: 100101 },
    2: { levelTestSettingId: 802, wordListTypeId: 100102 },
    3: { levelTestSettingId: 803, wordListTypeId: 100103 },
    4: { levelTestSettingId: 804, wordListTypeId: 100104 },
    5: { levelTestSettingId: 805, wordListTypeId: 100105 },
    6: { levelTestSettingId: 806, wordListTypeId: 100106 },
    7: { levelTestSettingId: 807, wordListTypeId: 100107 }
};

export class OvltBaseSetting {
    levelTestSettingId: number;
    wordListTypeId: number;
}

export const getOvltSettings = (difficultyLevel?: number): OvltBaseSetting => {
    const DIFFICULTY_DEFAULT = 3;
    return OVLT_LOOKUP[difficultyLevel] ?? OVLT_LOOKUP[DIFFICULTY_DEFAULT];
};

export const ADAPTIVE_OVLT2_SETTINGS: LevelTestSetting = {
    levelTestSettingId: 99,
    wordListTypeId: 33333,
    levelTestScoreLogicTypeId: 2
};
