import { VocabBuilderModelService } from "../../../model/vocab-builder-model.service";
import { AccountVocabLevelTestDataSource } from "./account-vocab-level-test-data-source";
import { Observable } from "rxjs";
import { AdaptiveQuizWord } from "../../../../types/vocabulary-quiz";
import { VocabBuilderSetting } from "../../../../types/vocab-builder-settings";
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
