import { QuizDataSourceAbstract } from "./quiz-data-source-abstract";
import { VocabBuilderModelService } from "../../../model/content/vocab-builder-model.service";
import { Observable, of } from "rxjs";
import { VocabBuilderSetting } from "../../../model/types/vocab-builder-settings";
import { XQuizWord, XWordQuiz } from "../../../model/types/vocabulary-quiz";
import { Activity, PRON_QUIZ_ACTIVITY } from "../../../model/types/content/activity";
import { MODE_SPEAKING } from "../../../model/types/vocab-builder-reference";
import { find, isEmpty, isEqual } from "lodash-es";
import { WordV1 } from "../../../model/types/content/word-v1";
import { QuizType } from "./quiz-type";
import { QuizDataSourceAdapterSettings } from "./quiz-data-source-adapter-settings";

export class PronQuizDataSource extends QuizDataSourceAbstract {
    constructor(private vocabBuilderModelService: VocabBuilderModelService,
                settings: QuizDataSourceAdapterSettings = {}) {
        super(settings);
    }

    generateQuiz(accountId: number, currentSettings: VocabBuilderSetting = {}): Observable<XWordQuiz | undefined> {
        if (!currentSettings.vocabBuilderModeIds || !currentSettings.wordInstanceIds || isEmpty(currentSettings.wordInstanceIds)) {
            return of(undefined);
        }

        return this.vocabBuilderModelService.generatePronQuizFromContent({
            quizWordSources:[{
                wordIds: currentSettings.wordIds
            }],
            applyModeId: currentSettings.vocabBuilderModeIds.toString(),
            modeIds: [MODE_SPEAKING]
        });
    }

    getActivity(activityId: number, wordListTypeId: number): Activity {
        return PRON_QUIZ_ACTIVITY;
    }

    getQuizModeIds(): number[] {
        return [MODE_SPEAKING];
    }

    getWordInstanceId(quizWord: XQuizWord, wordDetails: Map<number, WordV1>): number {
        const word: WordV1 = find(Array.from(wordDetails.values()), (word: WordV1) => {
            return isEqual(quizWord.word.wordAdapter.wordRootId, word.wordAdapter.wordRootId);
        });

        return word?.wordAdapter?.wordInstanceId;
    }

    getQuizType(): string {
        return QuizType.PronQuiz;
    }

    getNavigateOnError(): string {
        return "";
    }

    isPronunciation(): boolean {
        return true;
    }

    isPractice(): boolean {
        return false;
    }

    isAutoStart(): boolean {
        return true;
    }

    isSkipEventEnabled(): boolean {
        return false;
    }

    isBackButtonEnabled(): boolean {
        return true;
    }

    shouldUseAccountSettings(): boolean {
        return false;
    }

    shouldUseRawSettings(): boolean {
        return false;
    }

    shouldInitializeFromRouter(): boolean {
        return false;
    }

    shouldAutoOpenPaywall(): boolean {
        return true;
    }

    restartQuizEnabled(): boolean {
        return true;
    }

    typingFallbackEnabled(): boolean {
        return false;
    }
}
