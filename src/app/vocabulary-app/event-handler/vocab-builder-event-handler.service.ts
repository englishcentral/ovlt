import { Injectable, NgZone } from "@angular/core";
import { VocabBuilderEventHandler } from "./vocab-builder-event-handler";
import { VocabBuilderDefaultEventHandler } from "./vocab-builder-default-event-handler";

@Injectable({providedIn: "root"})
export class VocabBuilderEventHandlerService {
    constructor(private zone: NgZone) {
    }

    getHandler(useDefaultHandler: boolean = false): VocabBuilderEventHandler {
        return new VocabBuilderDefaultEventHandler(
            this.zone
        );
    }
}
