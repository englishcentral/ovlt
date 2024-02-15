import { round } from "lodash-es";

export class WordListLearned {
    wordsLearned: number;
    wordListTypeId: number;
    wordCount: number;

    static getWordListProgressInPercentage(wordListTypeId: number, progress: WordListLearned): number {
        if (!progress) {
            return 0;
        }
        const wordsLearned = progress.wordsLearned;
        const wordCount = progress.wordCount;

        const PERCENTAGE_COMPLETE = 100;
        const PERCENTAGE_NEARLY_COMPLETE = 99;
        const PERCENTAGE_INITIAL_PROGRESS = 1;
        const PERCENTAGE_NONE = 0;

        const PERCENTAGE_PRECISION = 2;

        const percentage = wordsLearned * 100 / wordCount;
        if (PERCENTAGE_NONE < percentage && percentage < PERCENTAGE_INITIAL_PROGRESS) {
            return PERCENTAGE_INITIAL_PROGRESS;
        }
        if (PERCENTAGE_COMPLETE > percentage && percentage > PERCENTAGE_NEARLY_COMPLETE) {
            return PERCENTAGE_NEARLY_COMPLETE;
        }
        return (percentage >= PERCENTAGE_COMPLETE) ? PERCENTAGE_COMPLETE : round(percentage, PERCENTAGE_PRECISION);
    }
}
