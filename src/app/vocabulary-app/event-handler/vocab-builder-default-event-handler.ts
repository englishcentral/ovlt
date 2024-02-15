import { ProgressQueueService } from "../../../common-app/progress-app/progress-queue.service";
import { NgZone } from "@angular/core";
import { DebugEventHandler } from "../../event-handler/debug-event-handler";
import { QuizEventHandler } from "../../quiz-app/event-handler/quiz-event-handler";
import { VocabBuilderProgressService } from "../vocab-builder-progress.service";
import { VocabBuilderStateService } from "../vocab-builder-state.service";
import { assign, map } from "lodash-es";

declare var window: any;

export class VocabBuilderDefaultEventHandler extends DebugEventHandler implements QuizEventHandler {
    private initializedPublishers: boolean = false;

    constructor(protected zone: NgZone,
                private progressQueue: ProgressQueueService) {
        super(zone);
    }

    addExternalInterface(methodName: string) {
        this.logger.log("Hooking interface for %s", methodName);

        if (!window.EcQuizApp) {
            window.EcQuizApp = {};
        }

        try {
            window.EcQuizApp[methodName] = (data) => {
                this.zone.run(() => {
                    this.emitter.publish(methodName, data);
                });
            };
        } catch (e) {
            this.logger.error("Could not add handler for " + methodName, e);
        }
    }

    initialize() {
        this.initializeProgressPublishers();
    }

    private initializeProgressPublishers(): void {
        if (this.initializedPublishers) {
            return;
        }

        this.initializedPublishers = true;
        map(VocabBuilderProgressService.PROGRESS_DATA_EVENTS, (eventName: string) => {
            this.subscribe(eventName, (event) => {
                this.progressQueue.sendEvent(event);
            });
        });
    }

    initializeActivity(activity: any): void {
        this.initializeProgressPublishers();
        if (activity.activityID) {
            this.publish(
                VocabBuilderStateService.EVENT_INITIALIZE,
                assign(activity, {quizData: {}}),
                true
            );
        }
    }

    initializeByActivityIds(activityIds: number[]): void {

    }

    appendQuizData(activityId: number, quizData: string) {
    }

    setAccountId(accountId: number): void {
        this.publish(VocabBuilderStateService.EVENT_SET_ACCOUNT_ID, accountId, true);
    }

}
