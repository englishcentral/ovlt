import { Subscription } from "rxjs";
import { NgZone } from "@angular/core";
import { Emitter } from "../../common/emitter";
import { Logger } from "../../common/logger";

export class DebugEventHandler {
    protected handlerType: string = "default";
    protected emitter = new Emitter();
    protected logger = new Logger();

    constructor(protected zone: NgZone) {

    }

    addExternalInterface(methodName: string) {
    }

    subscribe(eventName: string, callback: (data?) => void): Subscription {
        return this.emitter.subscribe(eventName, callback);
    }

    publish<T>(eventName: string, data?: T, toJson?: boolean): void {
        this.emitter.publish(eventName, data);
    }

    destroy(): void {
        this.emitter.destroy();
    }

    getType(): string {
        return this.handlerType;
    }

    isMobile(): boolean {
        return false;
    }

    isNull(): boolean {
        return false;
    }
}
