import { Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { Emitter } from "./emitter";

@Injectable()
export class TypingSharedService {
    private emitter = new Emitter();

    static readonly UPDATE_ANSWER_TEXT: string = "onUpdateAnnouncements";
    static readonly DELETE_LETTER: string = "onDeleteLetter";
    static readonly UPDATE_SCROLLBAR_POSITION: string = "updateScrollbarPosition";
    static readonly UPDATE_CURRENT_ANSWER: string = "updateCurrentAnswer";
    static readonly ENABLE_KEYBOARD: string = "onEnableKeyboard";

    static readonly WORD_COUNT_BELOW_LIMIT: number = 20;
    static readonly WORD_COUNT_NORMAL: number = 70;

    static readonly RETURN = "\x0a";
    static readonly SPACE = "\xa0";

    private keyboardEnabled: boolean = false;
    private answersSets: object = {};
    private wordCount: object = {};
    private answersTextsHeight: object = {};

    constructor() {
    }

    enableKeyboard(keyboardEnabled: boolean): void {
        this.keyboardEnabled = keyboardEnabled;
    }

    subscribe(eventName: string, successFn: (data?) => void, errorFn?: (e?) => void): Subscription {
        return this.emitter.subscribe(eventName, successFn, errorFn);
    }

    publish(eventName: string, data?: any): void {
        this.emitter.publish(eventName, data);
    }

    getObservable(eventName: string): Subject<any> {
        return this.emitter.getObservable(eventName);
    }

    destroy(): void {
        if (this.emitter) {
            this.emitter.destroy();
        }
    }
}
