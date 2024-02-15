import { QuizDataSourceAbstract, VbSettings } from "./quiz-data-source-abstract";
import { VocabBuilderModelService } from "../../../model/content/vocab-builder-model.service";
import { Observable, of } from "rxjs";
import { VocabBuilderSetting, VocabBuilderSettings } from "../../../model/types/vocab-builder-settings";
import { XWordQuiz } from "../../../model/types/vocabulary-quiz";
import { isEmpty } from "lodash-es";
import { QuizType } from "./quiz-type";
import { QuizDataSourceAdapterSettings } from "./quiz-data-source-adapter-settings";

export class VocabBuilderDataSource extends QuizDataSourceAbstract {
    constructor(private vocabBuilderModelService: VocabBuilderModelService,
                settings: QuizDataSourceAdapterSettings = {}) {
        super(settings);
    }

    fetchSettings(accountId: number, settingsExtras: VbSettings = {
        useAccountWordLists: false,
        useCache: false
    }): Observable<VocabBuilderSettings | undefined> {
        return this.vocabBuilderModelService.getAccountVocabBuilderSetting(accountId, settingsExtras);
    }

    generateQuiz(accountId: number, currentSettings: VocabBuilderSetting): Observable<XWordQuiz | undefined> {
        if (!currentSettings || isEmpty(currentSettings)) {
            return of(undefined);
        }
        return this.vocabBuilderModelService.generateQuiz(currentSettings.accountId, currentSettings, {useNewContentWords: true});
    }

    getQuizType(): string {
        return QuizType.VocabBuilder;
    }

    isPractice(): boolean {
        return true;
    }

    isRecycleEnabled(): boolean {
        return true;
    }

    shouldFetchMyWordsListsCounts(): boolean {
        return true;
    }

    isAutoMarkAsKnownEnabled(): boolean {
        return true;
    }

    isMarkAsKnownButtonVisible(): boolean {
        return true;
    }

    restartQuizEnabled(): boolean {
        return true;
    }

    shouldShowRank(): boolean {
        return true;
    }

    shouldShowPreviouslyEncounteredVisible(): boolean {
        return true;
    }
}
