import { QuizDataSourceAbstract, VbSettings } from "./quiz-data-source-abstract";
import { Observable } from "rxjs";
import { VocabBuilderSetting, VocabBuilderSettings } from "../../../model/types/vocab-builder-settings";
import { XWordQuiz } from "../../../model/types/vocabulary-quiz";
import {
    Activity,
    DEFAULT_QUIZ_WORD_ACTIVITY,
    DEFAULT_VOCAB_BUILDER_ACTIVITY
} from "../../../model/types/content/activity";
import { VocabBuilderModelService } from "../../../model/content/vocab-builder-model.service";
import { DEFAULT_WORD_LIST_TYPE_ID, MY_WORDS_WORD_LIST_COLLECTION } from "../../../model/types/word-list-reference";
import { includes, values } from "lodash-es";
import { QuizType } from "./quiz-type";
import { QuizDataSourceAdapterSettings } from "./quiz-data-source-adapter-settings";

export class WordQuizDataSource extends QuizDataSourceAbstract {
    constructor(private vocabBuilderModelService: VocabBuilderModelService,
                settings: QuizDataSourceAdapterSettings = {}) {
        super(settings);
    }

    fetchSettings(accountId: number, settingsExtras: VbSettings = {useCache: false}): Observable<VocabBuilderSettings | undefined> {
        return this.vocabBuilderModelService.getAccountVocabBuilderSetting(accountId, settingsExtras);
    }

    generateQuiz(accountId: number, currentSettings: VocabBuilderSetting = {}): Observable<XWordQuiz | undefined> {
        const settingsParam = this.getSettingsParam(currentSettings);
        settingsParam.numberOfQuizItems = settingsParam.styleSetting?.sharedMeaningIds.length || 0;
        return this.vocabBuilderModelService.generateMyQuiz(currentSettings.accountId, settingsParam, {useNewContentWords: true}
        );
    }

    getSettingsParam(settings: VocabBuilderSetting): VocabBuilderSetting {
        if (this.isMyWordList(settings.wordListTypeId)) {
            settings.wordListTypeId = DEFAULT_WORD_LIST_TYPE_ID;
            return settings;
        }
        return settings;
    }

    getActivity(activityId: number, wordListTypeId: number): Activity {
        if (!this.isMyWordList(wordListTypeId)) {
            return DEFAULT_VOCAB_BUILDER_ACTIVITY;
        }
        return DEFAULT_QUIZ_WORD_ACTIVITY;
    }

    getQuizType(): string {
        return QuizType.MyWords;
    }

    isMyWordList(wordListTypeId: number): boolean {
        return includes(values(MY_WORDS_WORD_LIST_COLLECTION), wordListTypeId);
    }

    isRecycleEnabled(): boolean {
        return true;
    }
    
    isMarkAsKnownButtonVisible(): boolean {
        return true;
    }

    shouldSendStartCompleteEvents(wordListTypeId: number): boolean {
        // return this.isMyWordList(wordListTypeId);
        return false;
    }

    shouldFetchMyWordsListsCounts(): boolean {
        return true;
    }

    restartQuizEnabled(): boolean {
        return true;
    }
}
