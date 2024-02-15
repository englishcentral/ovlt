import { BehaviorSubject, ReplaySubject, Subject, Subscription } from "rxjs";
import { NgZone } from "@angular/core";
import { map } from "lodash-es";
import { Dictionary } from "../../types/transcription-result";

declare var window: any;

export class Emitter {
    static readonly TYPE_EMITTER = "emitter";
    static readonly TYPE_REPLAY = "replay";
    static readonly TYPE_BEHAVIOR = "behavior";

    protected observables: Dictionary<Subject<any>> = {};
    private zone: NgZone = new NgZone({enableLongStackTrace: false});

    constructor(private global: boolean = false,
                private type = Emitter.TYPE_EMITTER,
                private replayLength = 1) {
    }

    subscribe(eventName: string, successFn: (data?) => void, errorFn?: (e?) => void): Subscription {
        if (!successFn) {
            throw "No callback provided for subscription. Subscription cancelled.";
        }

        if (!this.global) {
            return this.zone.run(() => {
                return this.getObservable(eventName).subscribe(successFn, errorFn);
            });
        }

        return this.getObservable(eventName).subscribe((data) => {
            return this.zone.run(() => {
                successFn(data);
            });
        }, () => {
            return this.zone.run((error) => {
                errorFn(error);
            });
        });
    }

    getObservable(eventName: string): Subject<any> {
        if (!this.global) {
            if (!this.observables[eventName]) {
                this.observables[eventName] = this.generateSubject();
            }
            return this.observables[eventName];
        }

        if (!window.ECObservablesCache) {
            window.ECObservablesCache = {};
        }

        if (!window.ECObservablesCache[eventName]) {
            window.ECObservablesCache[eventName] = this.generateSubject();
        }
        return window.ECObservablesCache[eventName];
    }

    generateSubject(): Subject<any> {
        switch (this.type) {
            case Emitter.TYPE_BEHAVIOR:
                return new BehaviorSubject(undefined);
            case Emitter.TYPE_REPLAY:
                return new ReplaySubject(this.replayLength);
            default:
                return new Subject();
        }
    }

    error(eventName: string, error?: any): void {
        if (!this.getObservable(eventName)) {
            return;
        }

        // make sure this triggers after the event lifecycle
        return this.zone.run(() => {
            return this.getObservable(eventName).error(error);
        });
    }

    publish(eventName: string, data?: any): void {
        if (!this.getObservable(eventName)) {
            return;
        }

        // make sure this triggers after the event lifecycle
        setTimeout(() => {
            this.getObservable(eventName).next(data);
        });
    }

    generateInterceptor(eventName: string): Subject<void> {
        let subject = new Subject<void>();

        this.subscribe(eventName, () => {
            subject.next();
        });
        return subject;
    }

    destroy(): void {
        if (this.global) {
            return;
        }

        map(this.observables, (observable) => {
            observable.unsubscribe();
        });

        this.observables = {};
    }
}
