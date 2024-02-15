import { NgZone } from "@angular/core";
import { VocabularyQuiz } from "../../../model/types/vocabulary-quiz";
import { IosEventHandler } from "../../event-handler/ios-event-handler";
import { QuizEventHandler } from "../../quiz-app/event-handler/quiz-event-handler";
import { VocabBuilderStateService } from "../vocab-builder-state.service";

export class VocabBuilderIosEventHandler extends IosEventHandler implements QuizEventHandler {

    constructor(protected zone: NgZone) {
        super(zone);
    }

    initialize() {
    }

    initializeActivity(activity: any) {
    }

    initializeByActivityIds(activityIds: number[]): void {

    }
    
    appendQuizData(activityId: number, quizData: string) {
        try {
            let vocabularyQuiz: VocabularyQuiz = JSON.parse(quizData);
            this.publish(VocabBuilderStateService.EVENT_APPEND_QUIZDATA, {
                activityId: activityId,
                vocabularyQuiz: vocabularyQuiz
            }, true);
        } catch (e) {
            this.logger.error("invalid quiz parameters on initialization", e, 0, {quizParameters: quizData});
        }
    }

    setAccountId(accountId: number): void {
        this.publish(VocabBuilderStateService.EVENT_SET_ACCOUNT_ID, accountId, true);
    }
}
