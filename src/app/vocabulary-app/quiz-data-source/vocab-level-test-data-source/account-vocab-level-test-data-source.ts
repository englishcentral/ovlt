import { VocabBuilderModelService } from "../../../model/vocab-builder-model.service";
import { Observable, of } from "rxjs";
import { VocabBuilderSetting } from "../../../../types/vocab-builder-settings";
import { LevelTestDetail, XWordQuiz } from "../../../../types/vocabulary-quiz";
import { isEmpty } from "lodash-es";
import { VocabLevelTestDataSourceAbstract } from "./vocab-level-test-data-source-abstract";
import { VltQuizScore } from "../../../../types/vocab-level-test";
import { QuizDataSourceAdapterSettings } from "../quiz-data-source-adapter-settings";

export class AccountVocabLevelTestDataSource extends VocabLevelTestDataSourceAbstract {
    constructor(protected vocabBuilderModelService: VocabBuilderModelService,
                settings: QuizDataSourceAdapterSettings = {}) {
        super(vocabBuilderModelService, settings);
    }

    fetchBandScore(accountId: number, settings: VocabBuilderSetting): Observable<VltQuizScore> {
        return this.vocabBuilderModelService.getLevelTestScore(accountId, settings.levelTestSettingId, settings.curatedLevelTestId);
    }

    fetchLevelTestDetail(accountId: number, settings: VocabBuilderSetting): Observable<LevelTestDetail> {
        return this.vocabBuilderModelService.getLevelTestDetail(accountId, settings.curatedLevelTestId, settings.levelTestSettingId);
    }

    generateQuiz(accountId: number, currentSettings: VocabBuilderSetting): Observable<XWordQuiz | undefined> {
        const params = {
            accountId: currentSettings?.accountId,
            curatedLevelTestId: currentSettings?.curatedLevelTestId,
            levelTestSettingId: currentSettings?.levelTestSettingId,
            vocabBuilderModeIds: currentSettings?.vocabBuilderModeIds
        };

        return this.vocabBuilderModelService.generateLevelQuiz(params);
    }

    isAccountVlt(): boolean {
        return true;
    }

    isLevelUpdateEnabled(): boolean {
        return true;
    }

    shouldAutoAdvancedToNextQuiz(): boolean {
        return false;
    }

    shouldShowBand(): boolean {
        return false;
    }

    shouldShowListName(): boolean {
        return true;
    }
}
