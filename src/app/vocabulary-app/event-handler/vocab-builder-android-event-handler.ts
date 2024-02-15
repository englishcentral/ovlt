import { NgZone } from "@angular/core";
import { VocabularyQuiz } from "../../../model/types/vocabulary-quiz";
import { AndroidEventHandler } from "../../event-handler/android-event-handler";
import { VocabBuilderEventHandler } from "./vocab-builder-event-handler";
import { VocabBuilderStateService } from "../vocab-builder-state.service";

export class VocabBuilderAndroidEventHandler extends AndroidEventHandler implements VocabBuilderEventHandler {
    constructor(protected zone: NgZone) {
        super(zone);
    }

    initialize() {
    }

    initializeActivity(activity: any) {
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
