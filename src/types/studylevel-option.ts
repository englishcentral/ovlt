export class StudyLevelOption {
    abilities: string[];
    description: string;
    level: number;
    testScores: TestScore[];
    words: string[];
}

export class TestScore {
    type: string;
    score: string;
}
