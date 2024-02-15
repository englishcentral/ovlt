import { VocabBuilderModelService } from "../../../../model/content/vocab-builder-model.service";
import { Observable, of } from "rxjs";
import { VocabBuilderSetting } from "../../../../model/types/vocab-builder-settings";
import { LevelTestDetail, XWordQuiz } from "../../../../model/types/vocabulary-quiz";
import { isEmpty } from "lodash-es";
import { VocabLevelTestDataSourceAbstract } from "./vocab-level-test-data-source-abstract";
import { VltQuizScore } from "../../../../model/reportcard/vocab-level-test";
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
        if (!currentSettings || isEmpty(currentSettings)) {
            return of(undefined);
        }

        const params = {
            accountId: currentSettings.accountId,
            curatedLevelTestId: currentSettings.curatedLevelTestId,
            levelTestSettingId: currentSettings.levelTestSettingId,
            vocabBuilderModeIds: currentSettings.vocabBuilderModeIds
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
        return true;
    }

    shouldShowBand(): boolean {
        return false;
    }

    shouldShowListName(): boolean {
        return true;
    }
}
