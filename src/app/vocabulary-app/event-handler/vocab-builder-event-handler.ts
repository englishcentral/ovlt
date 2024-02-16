export interface VocabBuilderEventHandler {
    initialize();

    initializeActivity(activity: any);

    appendQuizData(activityId: number, quizData: string): void;

    setAccountId(accountId: number): void;

    destroy(): void;
}
