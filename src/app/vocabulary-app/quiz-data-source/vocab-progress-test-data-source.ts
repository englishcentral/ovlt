import { QuizDataSourceAbstract } from "./quiz-data-source-abstract";
import { VocabBuilderModelService } from "../../model/vocab-builder-model.service";
import { Observable, of } from "rxjs";
import { VocabBuilderSettings } from "../../../types/vocab-builder-settings";
import { XWordQuiz } from "../../../types/vocabulary-quiz";
import { Activity, DEFAULT_ADAPTIVE_TEST_ACTIVITY } from "../../../types/activity";
import { QuizType } from "./quiz-type";
import { QuizDataSourceAdapterSettings } from "./quiz-data-source-adapter-settings";

export class VocabProgressTestDataSource extends QuizDataSourceAbstract {
    constructor(private vocabBuilderModelService: VocabBuilderModelService,
                settings: QuizDataSourceAdapterSettings = {}) {
        super(settings);
    }

    fetchSettings(accountId: number): Observable<VocabBuilderSettings | undefined> {
        return of(undefined);
    }

    generateQuiz(accountId: number, currentSettings: QuizDataSourceAdapterSettings): Observable<XWordQuiz | undefined> {
        let classTestExamId = this.settings?.classTestExamId;

        return this.vocabBuilderModelService.getClassTestExam(accountId, classTestExamId);
    }

    getActivity(): Activity {
        return DEFAULT_ADAPTIVE_TEST_ACTIVITY;
    }

    getQuizType(): string {
        return QuizType.VocabProgressTest;
    }

    isPractice(): boolean {
        return false;
    }

    isFixedSetting(): boolean {
        return true;
    }

    isAutoStart(): boolean {
        return true;
    }

    isAddNewListEnabled(): boolean {
        return false;
    }

    isSkipBehaviorEnabled(): boolean {
        return false;
    }

    shouldAutoOpenPaywall(): boolean {
        return true;
    }
}
