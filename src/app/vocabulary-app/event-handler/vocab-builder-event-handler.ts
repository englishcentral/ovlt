import { EventHandler } from "../../event-handler/event-handler";

export interface VocabBuilderEventHandler extends EventHandler {
    initialize();
    initializeActivity(activity: any);
    appendQuizData(activityId: number, quizData: string): void;
    setAccountId(accountId: number): void;
}
