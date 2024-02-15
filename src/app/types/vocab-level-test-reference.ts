export class AccountVocabLevelTestReference {
    activityId: number;
    difficultyLevel: number;
    levelTestSettingId: number;
    name: string;
}

export const LAST_LEVEL_TEST_DIFFICULTY = 10;

export enum ExtraLevelTestDifficulty {
    LEVEL_8 = 8,
    LEVEL_9 = 9,
    LEVEL_10 = 10
}

export const isLevelTestPassed = (level: number, score: number): boolean => {
    const PASS_THRESHOLD = 93;
    return score >= PASS_THRESHOLD;
};

export const isLevelTestScoreUnderDowngradeThreshold = (level: number, score: number): boolean => {
    const FAIL_THRESHOLD = 78;
    return score < FAIL_THRESHOLD;
};
