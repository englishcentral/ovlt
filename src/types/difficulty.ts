import { intersection, reduce, sortBy, split } from "lodash-es";

export enum Difficulties {
    BEGINNER = "beginner",
    INTERMEDIATE = "intermediate",
    ADVANCED = "advanced"
}

export class DifficultyItem {
    difficulty?: number;
    level?: number;
    value?: string;
}

export class Difficulty {

    static readonly LEVEL_0 = 0;
    static readonly LEVEL_1 = 1;
    static readonly LEVEL_2 = 2;
    static readonly LEVEL_3 = 3;
    static readonly LEVEL_4 = 4;
    static readonly LEVEL_5 = 5;
    static readonly LEVEL_6 = 6;
    static readonly LEVEL_7 = 7;

    static readonly DIFFICULTY_NORMALIZED_RANGE_MAX = 1.0;
    static readonly DIFFICULTY_NORMALIZED_RANGE_7 = 0.857;
    static readonly DIFFICULTY_NORMALIZED_RANGE_6 = 0.714;
    static readonly DIFFICULTY_NORMALIZED_RANGE_5 = 0.571;
    static readonly DIFFICULTY_NORMALIZED_RANGE_4 = 0.428;
    static readonly DIFFICULTY_NORMALIZED_RANGE_3 = 0.285;
    static readonly DIFFICULTY_NORMALIZED_RANGE_2 = 0.142;
    static readonly DIFFICULTY_NORMALIZED_RANGE_1 = 0.0;

    static DIFFICULTY_NORMALIZED_MAP = [
        { difficulty: 0, value: Difficulty.DIFFICULTY_NORMALIZED_RANGE_1 },
        { difficulty: 1, value: Difficulty.DIFFICULTY_NORMALIZED_RANGE_2 },
        { difficulty: 2, value: Difficulty.DIFFICULTY_NORMALIZED_RANGE_3 },
        { difficulty: 3, value: Difficulty.DIFFICULTY_NORMALIZED_RANGE_4 },
        { difficulty: 4, value: Difficulty.DIFFICULTY_NORMALIZED_RANGE_5 },
        { difficulty: 5, value: Difficulty.DIFFICULTY_NORMALIZED_RANGE_6 },
        { difficulty: 6, value: Difficulty.DIFFICULTY_NORMALIZED_RANGE_7 },
        { difficulty: 7, value: Difficulty.DIFFICULTY_NORMALIZED_RANGE_MAX }
    ];

    static DIFFICULTY_ORDER_MAP = [
        {difficulty: "1", difficultyOrder: "1,2"},
        {difficulty: "2", difficultyOrder: "2,1"},
        {difficulty: "3", difficultyOrder: "3,4"},
        {difficulty: "4", difficultyOrder: "4,3"},
        {difficulty: "5", difficultyOrder: "5,7,6"},
        {difficulty: "6", difficultyOrder: "6,7,5"},
        {difficulty: "7", difficultyOrder: "7,6,5"}
    ];

    static DIFFICULTY_BEGINNER = [1, 2];
    static DIFFICULTY_INTERMEDIATE = [3, 4];
    static DIFFICULTY_ADVANCED = [5, 6, 7];

    static CEFR = [
        { level: 0, value: undefined },
        { level: 1, value: "A0" },
        { level: 2, value: "A1" },
        { level: 3, value: "A2" },
        { level: 4, value: "B1" },
        { level: 5, value: "B2" },
        { level: 6, value: "C1" },
        { level: 7, value: "C2" }
    ];

    static isBeginner(level: number): boolean {
        return Difficulty.isDifficulty([level], Difficulty.DIFFICULTY_BEGINNER);
    }

    static isIntermediate(level: number): boolean {
        return Difficulty.isDifficulty([level], Difficulty.DIFFICULTY_INTERMEDIATE);
    }

    static isAdvanced(level: number): boolean {
        return Difficulty.isDifficulty([level], Difficulty.DIFFICULTY_ADVANCED);
    }

    static isDifficulty(level: number[], threshold: number[]): boolean {
        return intersection(level, threshold).length > 0;
    }

    static getDifficultyRange(difficulty?: (string | number)): string {
        if (!difficulty) {
            return "";
        }
        return reduce(Difficulty.DIFFICULTY_ORDER_MAP, (acc, item) => {
            if (acc) {
                return acc;
            }

            if (difficulty == item.difficulty) {
                return item.difficultyOrder;
            }

            return "";
        }, "");
    }

    static getDifficultyOrderRange(difficulty: (string | number | undefined), selectedDifficulty: string | undefined): string {
        if (!difficulty || !selectedDifficulty) {
            return "";
        }

        const selectedDifficultyNumbers = split(selectedDifficulty, ",");

        const sortedDifficulty = sortBy(selectedDifficultyNumbers, (number) => {
            return Math.abs(+difficulty - +number);
        });

        return sortedDifficulty.join(",");
    }

    static getDifficultyRangeByDifficultyText(difficulties?: Difficulties): number[] | undefined {
        if (!difficulties) {
            return undefined;
        }
        switch (difficulties) {
            case Difficulties.BEGINNER:
                return Difficulty.DIFFICULTY_BEGINNER;
            case Difficulties.INTERMEDIATE:
                return Difficulty.DIFFICULTY_INTERMEDIATE;
            case Difficulties.ADVANCED:
                return Difficulty.DIFFICULTY_ADVANCED;
            default:
                return undefined;
        }
    }

    static getDifficultyTextByDifficultyLevel(difficultyLevel?: number): Difficulties | undefined {
        if (!difficultyLevel) {
            return undefined;
        }

        if (Difficulty.isBeginner(difficultyLevel)) {
            return Difficulties.BEGINNER;
        }

        if (Difficulty.isIntermediate(difficultyLevel)) {
            return Difficulties.INTERMEDIATE;
        }

        if (Difficulty.isAdvanced(difficultyLevel)) {
            return Difficulties.ADVANCED;
        }

        return undefined;
    }


    static isDifficultyTextBeginner(difficulties: string): boolean {
        return difficulties === Difficulties.BEGINNER;
    }

    static isDifficultyTextIntermediate(difficulties: string): boolean {
        return difficulties === Difficulties.INTERMEDIATE;
    }

    static isDifficultyTextAdvanced(difficulties: string): boolean {
        return difficulties === Difficulties.ADVANCED;
    }

    static isLevel1(level: number): boolean {
        return level == Difficulty.LEVEL_1;
    }

    static isLevel2(level: number): boolean {
        return level == Difficulty.LEVEL_2;
    }

    static isLevel3(level: number): boolean {
        return level == Difficulty.LEVEL_3;
    }

    static isLevel4(level: number): boolean {
        return level == Difficulty.LEVEL_4;
    }

    static isLevel5(level: number): boolean {
        return level == Difficulty.LEVEL_5;
    }

    static isLevel6(level: number): boolean {
        return level == Difficulty.LEVEL_6;
    }

    static isLevel7(level: number): boolean {
        return level == Difficulty.LEVEL_7;
    }
}
