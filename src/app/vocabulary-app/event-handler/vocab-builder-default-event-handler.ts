import { NgZone } from "@angular/core";
import { VocabBuilderProgressService } from "../vocab-builder-progress.service";
import { VocabBuilderStateService } from "../vocab-builder-state.service";
import { assign, map } from "lodash-es";
import { DebugEventHandler } from "src/app/vocabulary-app/event-handler/debug-event-handler";

declare var window: any;

export class VocabBuilderDefaultEventHandler extends DebugEventHandler {
    private initializedPublishers: boolean = false;

    constructor(protected override zone: NgZone) {
        super(zone);
    }

    override addExternalInterface(methodName: string) {
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
                this.logger.log(event);
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
