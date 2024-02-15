import { VocabBuilderModelService } from "../../../../model/content/vocab-builder-model.service";
import { AccountVocabLevelTestDataSource } from "./account-vocab-level-test-data-source";
import { Observable } from "rxjs";
import { AdaptiveQuizWord } from "../../../../model/types/vocabulary-quiz";
import { VocabBuilderSetting } from "../../../../model/types/vocab-builder-settings";
import { QuizDataSourceAdapterSettings } from "../quiz-data-source-adapter-settings";

export class OvltAccountDataSource extends AccountVocabLevelTestDataSource {
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
