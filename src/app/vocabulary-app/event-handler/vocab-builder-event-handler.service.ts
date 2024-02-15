import { Injectable, NgZone } from "@angular/core";
import { ProgressQueueService } from "../../../common-app/progress-app/progress-queue.service";
import { ActivityDataService } from "../../shared-activity/activity-data.service";
import { IdentityService } from "../../../core/identity.service";
import { ActivityModelService } from "../../../model/content/activity-model.service";
import { Browser } from "../../../core/browser";
import { VocabBuilderEventHandler } from "./vocab-builder-event-handler";
import { VocabBuilderAndroidEventHandler } from "./vocab-builder-android-event-handler";
import { VocabBuilderDefaultEventHandler } from "./vocab-builder-default-event-handler";
import { VocabBuilderIosEventHandler } from "./vocab-builder-ios-event-handler";

@Injectable({providedIn: "root"})
export class VocabBuilderEventHandlerService {
    constructor(private activityModelService: ActivityModelService,
                private progressQueue: ProgressQueueService,
                private activityData: ActivityDataService,
                private identityService: IdentityService,
                private zone: NgZone) {
    }

    getHandler(useDefaultHandler: boolean = false): VocabBuilderEventHandler {
        if (useDefaultHandler) {
            return this.createDefaultHandler();
        }

        if (Browser.isAndroid()) {
            return new VocabBuilderAndroidEventHandler(this.zone);
        }

        if (Browser.isIosMobileWebView()) {
            return new VocabBuilderIosEventHandler(this.zone);
        }

        return this.createDefaultHandler();
    }

    private createDefaultHandler(): VocabBuilderEventHandler {
        return new VocabBuilderDefaultEventHandler(
            this.zone,
            this.progressQueue
        );
    }
}
