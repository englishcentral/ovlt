import { Observable, of } from "rxjs";

import { QuizType } from "./quiz-type";
import { QuizDataSourceAdapterSettings } from "./quiz-data-source-adapter-settings";
import { VocabBuilderSetting, VocabBuilderSettings } from "../../../types/vocab-builder-settings";
import { VltQuizScore } from "../../../types/vocab-level-test";
import { AdaptiveQuizWord, LevelTestDetail, XQuizWord, XWordQuiz } from "../../../types/vocabulary-quiz";
import { Activity, DEFAULT_VOCAB_BUILDER_ACTIVITY } from "../../../types/activity";
import { WordV1 } from "../../../types/word-v1";
import { WordList } from "../../../types/word-list-reference";

export class VbSettings {
    useAccountWordLists?: boolean;
    activityId?: number;
    useCache?: boolean;
}

export abstract class QuizDataSourceAbstract {
    protected constructor(protected settings: QuizDataSourceAdapterSettings = {}) {
    }

    fetchLevelTestSetting(): void {
        return;
    }

    fetchSettings(accountId: number, settingsExtras: VbSettings = {}): Observable<VocabBuilderSettings | undefined> {
        return of(undefined);
    }

    fetchBandScore(accountId: number, settings: VocabBuilderSetting): Observable<VltQuizScore | undefined> {
        return of(undefined);
    }

    fetchLevelTestDetail(accountId: number, settings: VocabBuilderSetting): Observable<LevelTestDetail | undefined> {
        return of(undefined);
    }

    generateQuiz(accountId: number, currentSettings: QuizDataSourceAdapterSettings = {}): Observable<XWordQuiz | undefined> {
        return of(undefined);
    }

    getSettings(settings: VocabBuilderSettings): VocabBuilderSetting {
        return settings?.latestSetting;
    }

    getActivity(activityId?: number, wordListTypeId?: number): Activity {
        return DEFAULT_VOCAB_BUILDER_ACTIVITY;
    }

    getNavigateOnError(): string {
        //return ROUTE_MY_ENGLISH;
      return "";
    }

    getQuizIndex(currentIndex: number, previousIndex: number): number | undefined {
        return currentIndex + previousIndex;
    }

    getQuizLength(quizLength: number, previousIndex: number): number | undefined {
        return quizLength + previousIndex;
    }

    getWordInstanceId(quizWord: XQuizWord, wordDetails: Map<number, WordV1>): number {
        return quizWord.word.wordAdapter.wordInstanceId;
    }

    getQuizType(): string {
        return QuizType.VocabBuilder;
    }

    getQuizModeIds(): number[] {
        return undefined;
    }

    setWordList(wordList): WordList[] {
        return wordList;
    }

    isFixedSetting(): boolean {
        return false;
    }

    isAutoStart(): boolean {
        return false;
    }

    isItemsToStudyChangeable(): boolean {
        return true;
    }

    isBackButtonEnabled(): boolean {
        return false;
    }

    isLevelTest(): boolean {
        return false;
    }

    isPractice(): boolean {
        return true;
    }

    isPronunciation(): boolean {
        return false;
    }

    isActivityQuiz(): boolean {
        return false;
    }

    isSkipBehaviorEnabled(): boolean {
        return true;
    }

    isSkipEventEnabled(): boolean {
        return true;
    }

    isWordPronunciationEnabled(): boolean {
        return true;
    }

    isAddNewListEnabled(): boolean {
        return true;
    }

    isRecycleEnabled(): boolean {
        return false;
    }

    isAccountVlt(): boolean {
        return false;
    }

    shouldAutoOpenPaywall(): boolean {
        return false;
    }

    isLevelUpdateEnabled(): boolean {
        return false;
    }

    isPaywallEnabled(): boolean {
        return true;
    }

    shouldSendStartCompleteEvents(wordListTypeId?: number): boolean {
        return false;
    }

    shouldFetchClassTestExamName(): boolean {
        return false;
    }

    shouldFetchActivityWordList(): boolean {
        return false;
    }

    shouldShowEndScreenOnCompletedQuizReaccess(): boolean {
        return false;
    }

    shouldShowBandScore(): boolean {
        return false;
    }

    shouldFetchScoreDetail(totalRank: number, answeredCountForCurrentSession: number): boolean {
        return false;
    }

    shouldAutoAdvancedToNextQuiz(): boolean {
        return false;
    }

    shouldUseAccountSettings(): boolean {
        return true;
    }

    shouldUseRawSettings(): boolean {
        return true;
    }

    shouldFetchMyWordsListsCounts(): boolean {
        return false;
    }

    shouldInitializeFromRouter(): boolean {
        return true;
    }

    shouldShowPreviouslyEncounteredVisible(): boolean {
        return false;
    }

    shouldShowRank(): boolean {
        return false;
    }

    shouldShowBand(): boolean {
        return false;
    }

    shouldShowListName(): boolean {
        return false;
    }

    calculateTotalCorrectlyAnswered(detail: LevelTestDetail): number | undefined {
        return undefined;
    }

    isMarkAsKnownButtonVisible(): boolean {
        return false;
    }

    isAutoMarkAsKnownEnabled(): boolean {
        return false;
    }

    typingFallbackEnabled(): boolean {
        return true;
    }

    restartQuizEnabled(): boolean {
        return false;
    }

    isNextWordAdaptive(): boolean {
        return false;
    }

    shouldShowQuizPagination(): boolean {
        return true;
    }

    getNextAdaptiveWord(accountId: number, settings: VocabBuilderSetting): Observable<AdaptiveQuizWord | undefined> {
        return of(undefined);
    }
}

