import { VocabBuilderModelService } from "../../model/vocab-builder-model.service";
import { QuizDataSourceAbstract } from "./quiz-data-source-abstract";
import { ADAPTIVE_OVLT2_ACTIVITY, VOCAB_LEVEL_TEST_ACTIVITY } from "../../../types/activity";
import { VocabBuilderDataSource } from "./vocab-builder-data-source";
import { ClassVocabLevelTestDataSource } from "./vocab-level-test-data-source/class-vocab-level-test-data-source";
import { AccountVocabLevelTestDataSource } from "./vocab-level-test-data-source/account-vocab-level-test-data-source";
import { OvltClassDataSource } from "./vocab-level-test-data-source/ovlt-class-data-source";
import { OvltAccountDataSource } from "./vocab-level-test-data-source/ovlt-account-data-source";
import { QuizDataSourceAdapterSettings } from "./quiz-data-source-adapter-settings";

export class QuizDataSourceAdapter {
    static getAdapter(settings: QuizDataSourceAdapterSettings,
                      vocabBuilderModelService: VocabBuilderModelService): QuizDataSourceAbstract {
        if (settings.activityTypeId == VOCAB_LEVEL_TEST_ACTIVITY.activityTypeID) {
            if (settings.classId) {
                return new ClassVocabLevelTestDataSource(vocabBuilderModelService, settings);
            }
            return new AccountVocabLevelTestDataSource(vocabBuilderModelService, settings);
        }

        if (settings.activityTypeId == ADAPTIVE_OVLT2_ACTIVITY.activityTypeID) {
            if (settings.classId) {
                return new OvltClassDataSource(vocabBuilderModelService, settings);
            }
            return new OvltAccountDataSource(vocabBuilderModelService, settings);
        }

        return new VocabBuilderDataSource(vocabBuilderModelService, settings);
    }
}
