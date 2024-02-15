import { QuizDataSourceAbstract, VbSettings } from "./quiz-data-source-abstract";
import { VocabularyQuizModelService } from "../../../model/content/vocabulary-quiz-model.service";
import { VocabBuilderSetting, VocabBuilderSettings } from "../../../model/types/vocab-builder-settings";
import { Observable } from "rxjs";
import { XWordQuiz } from "../../../model/types/vocabulary-quiz";
import { Activity } from "../../../model/types/content/activity";
import { WordList } from "../../../model/types/word-list-reference";
import { assign } from "lodash-es";
import { QuizType } from "./quiz-type";
import { QuizDataSourceAdapterSettings } from "./quiz-data-source-adapter-settings";

export class CourseQuizDataSource extends QuizDataSourceAbstract {
    constructor(private vocabularyQuizModelService: VocabularyQuizModelService,
                settings: QuizDataSourceAdapterSettings = {}) {
        super(settings);
    }

    fetchSettings(accountId: number, settingsExtras: VbSettings): Observable<VocabBuilderSettings | undefined> {
        return this.vocabularyQuizModelService.getActivitySetting(settingsExtras.activityId);
    }

    generateQuiz(accountId: number, currentSettings: VocabBuilderSetting = {}): Observable<XWordQuiz | undefined> {
        return this.vocabularyQuizModelService.getByActivityIdAndAccountId(currentSettings.activityId, accountId, {useNewContentWords: true});
    }

    getActivity(activityId?: number): Activity {
        return assign({activityTypeID: this.settings["activityTypeId"]}, {activityID: activityId});
    }

    getNavigateOnError(): string {
        return "";
    }

    getSettings(settings: VocabBuilderSettings): VocabBuilderSetting {
        return settings;
    }

    getQuizIndex(currentIndex: number, previousIndex: number): number | undefined {
        return currentIndex;
    }

    getQuizLength(quizLength: number, previousIndex: number): number | undefined {
        return quizLength;
    }

    getQuizType(): string {
        return QuizType.CourseQuiz;
    }

    setWordList(wordList): WordList[] {
        return [wordList];
    }

    isActivityQuiz(): boolean {
        return true;
    }

    isFixedSetting(): boolean {
        return true;
    }

    isItemsToStudyChangeable(): boolean {
        return false;
    }

    isAddNewListEnabled(): boolean {
        return false;
    }

    isBackButtonEnabled(): boolean {
        return true;
    }

    isPaywallEnabled(): boolean {
        return false;
    }

    shouldSendStartCompleteEvents(wordListTypeId?: number): boolean {
        // Change to false for BC-90754
        return false;
    }

    shouldFetchActivityWordList(): boolean {
        return true;
    }

    shouldShowEndScreenOnCompletedQuizReaccess(): boolean {
        return true;
    }

    shouldUseAccountSettings(): boolean {
        return false;
    }

    shouldInitializeFromRouter(): boolean {
        return false;
    }
}
