import { VocabBuilderModelService } from "../../../../model/vocab-builder-model.service";
import { Observable, of } from "rxjs";
import { VocabBuilderSetting } from "../../../../types/vocab-builder-settings";
import { LevelTestDetail, XWordQuiz } from "../../../../types/vocabulary-quiz";
import { isEmpty } from "lodash-es";
import { VocabLevelTestDataSourceAbstract } from "./vocab-level-test-data-source-abstract";
import { VltQuizScore } from "../../../../model/reportcard/vocab-level-test";
import { QuizDataSourceAdapterSettings } from "../quiz-data-source-adapter-settings";

export class ClassVocabLevelTestDataSource extends VocabLevelTestDataSourceAbstract {
    constructor(protected vocabBuilderModelService: VocabBuilderModelService,
                settings: QuizDataSourceAdapterSettings = {}) {
        super(vocabBuilderModelService, settings);
    }

    fetchBandScore(accountId: number, settings: VocabBuilderSetting): Observable<VltQuizScore> {
        return this.vocabBuilderModelService.getCachedLevelTestScore(accountId, settings.levelTestSettingId, settings.curatedLevelTestId);
    }

    fetchLevelTestDetail(accountId: number, settings: VocabBuilderSetting): Observable<LevelTestDetail> {
        return this.vocabBuilderModelService.getCachedLevelTestDetail(accountId, settings.curatedLevelTestId, settings.levelTestSettingId);
    }

    generateQuiz(accountId: number, currentSettings: VocabBuilderSetting): Observable<XWordQuiz | undefined> {
        if (!currentSettings || isEmpty(currentSettings)) {
            return of(undefined);
        }

        const params = {
            accountId: currentSettings.accountId,
            curatedLevelTestId: currentSettings.curatedLevelTestId,
            levelTestSettingId: currentSettings.levelTestSettingId
        };

        return this.vocabBuilderModelService.generateLevelQuiz(params);
    }

    shouldAutoAdvancedToNextQuiz(): boolean {
        return true;
    }
}
