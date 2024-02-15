import { VocabBuilderModelService } from "../../../../model/content/vocab-builder-model.service";
import { Observable } from "rxjs";
import { AdaptiveQuizWord } from "../../../../model/types/vocabulary-quiz";
import { VocabBuilderSetting } from "../../../../model/types/vocab-builder-settings";
import { ClassVocabLevelTestDataSource } from "./class-vocab-level-test-data-source";
import { QuizDataSourceAdapterSettings } from "../quiz-data-source-adapter-settings";

export class OvltClassDataSource extends ClassVocabLevelTestDataSource {
    constructor(protected vocabBuilderModelService: VocabBuilderModelService,
                settings: QuizDataSourceAdapterSettings = {}) {
        super(vocabBuilderModelService, settings);
    }

    isNextWordAdaptive(): boolean {
        return true;
    }

    getNextAdaptiveWord(accountId: number, settings: VocabBuilderSetting): Observable<AdaptiveQuizWord> {
        return this.vocabBuilderModelService.getNextLevelTestAdaptiveWord(accountId, settings?.levelTestSettingId);
    }
}
