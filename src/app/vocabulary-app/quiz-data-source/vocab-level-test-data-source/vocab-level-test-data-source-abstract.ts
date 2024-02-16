import { QuizDataSourceAbstract } from "../quiz-data-source-abstract";
import { VocabBuilderModelService } from "../../../../model/vocab-builder-model.service";
import { LevelTestDetail } from "../../../../types/vocabulary-quiz";
import { Activity, VOCAB_LEVEL_TEST_ACTIVITY } from "../../../../types/activity";
import { filter, flatten, isEqual, map, size } from "lodash-es";
import { QuizType } from "../quiz-type";
import { QuizDataSourceAdapterSettings } from "../quiz-data-source-adapter-settings";


export abstract class VocabLevelTestDataSourceAbstract extends QuizDataSourceAbstract {
    constructor(protected vocabBuilderModelService: VocabBuilderModelService,
                settings: QuizDataSourceAdapterSettings = {}) {
        super(settings);
    }

    calculateTotalCorrectlyAnswered(detail: LevelTestDetail): number {
        if (!detail) {
            return 0;
        }
        const correctlyAnsweredWords = flatten(map(detail.steps, (step) => {
            return filter(step.words, (words) => {
                return words.correct;
            });
        }));

        return size(correctlyAnsweredWords);
    }

    getActivity(): Activity {
        return VOCAB_LEVEL_TEST_ACTIVITY;
    }

    getQuizType(): string {
        return QuizType.VocabLevelTest;
    }

    isPractice(): boolean {
        return false;
    }

    isLevelTest(): boolean {
        return true;
    }

    isFixedSetting(): boolean {
        return true;
    }

    isAutoStart(): boolean {
        return true;
    }

    isLevelUpdateEnabled(): boolean {
        return false;
    }

    shouldShowBandScore(): boolean {
        return true;
    }

    shouldFetchScoreDetail(totalRank: number, answeredCountForCurrentSession: number): boolean {
        return !isEqual(totalRank, answeredCountForCurrentSession);
    }

    shouldShowEndScreenOnCompletedQuizReaccess(): boolean {
        return true;
    }

    shouldShowRank(): boolean {
        return true;
    }

    shouldShowBand(): boolean {
        return false;
    }

    shouldShowQuizPagination(): boolean {
        return false;
    }

    shouldShowListName(): boolean {
        return false;
    }

    typingFallbackEnabled(): boolean {
        return true;
    }

    shouldAutoOpenPaywall(): boolean {
        return true;
    }
}
