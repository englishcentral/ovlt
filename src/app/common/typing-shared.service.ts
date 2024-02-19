import { Injectable } from "@angular/core";
import { Subject, Subscription } from "rxjs";
import { Emitter } from "../../core/emitters/emitter";
import { LocalForageGeneric } from "../../core/local-forage-generic";
import { IdentityService } from "../../core/identity.service";
import { ClassWritingTestAnswer, ClassWritingTestQuestion } from "../../model/types/class-writing-test";
import { compact, size, split } from "lodash-es";

@Injectable()
export class TypingSharedService {
    private emitter = new Emitter();

    private localStorage = new LocalForageGeneric<string>("WritingTestService");

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

    constructor(private identityService: IdentityService) {
    }

    isKeyboardEnabled(): boolean {
        return this.keyboardEnabled;
    }

    enableKeyboard(keyboardEnabled: boolean): void {
        this.keyboardEnabled = keyboardEnabled;
    }

    getStoredAnswer(question: ClassWritingTestQuestion): Promise<string> {
        return this.localStorage.getItem(this.identityService.getAccountId().toString() + question.questionActivityID)
            .then((answer) => {
                if (answer) {
                    this.setAnswerSet(question, answer);
                    return this.getAnswer(question.sequence);
                }
                return "";
            });
    }

    getWritingTestAnswersLocalStorage(): LocalForageGeneric<string> {
        return this.localStorage;
    }

    getAnswer(questionSequence: number): string {
        return this.answersSets[questionSequence];
    }

    setAnswerSet(question: ClassWritingTestAnswer, answer: string): void {
        this.localStorage.setItem(this.identityService.getAccountId().toString() + question.questionActivityID, answer);

        this.answersSets[question.sequence] = answer;
        const answerSet = this.answersSets[question.sequence];
        this.wordCount[question.sequence] = this.calculateWordCount(answerSet);
    }

    getTextHeight(questionSequence: number): number {
        return this.answersTextsHeight[questionSequence];
    }

    setAnswerForVirtualInput(question: ClassWritingTestQuestion, answerLetter: string): void {
        const answer = this.getAnswer(question.sequence);
        const newAnswer = answer ? answer + answerLetter : answerLetter;

        this.localStorage.setItem(this.identityService.getAccountId().toString() + question.questionActivityID, newAnswer);

        this.answersSets[question.sequence] = newAnswer;
        const answerSet = this.answersSets[question.sequence];
        this.wordCount[question.sequence] = this.calculateWordCount(answerSet);
    }

    deleteLetter(question: ClassWritingTestQuestion): void {
        if (this.answersSets[question.sequence]) {
            if (this.answersSets[question.sequence].length == 1) {
                this.answersSets[question.sequence] = "";
                this.localStorage.setItem(this.identityService.getAccountId().toString() + question.questionActivityID, this.getAnswer(question.sequence));
                this.wordCount[question.sequence] = 0;
                return;
            }
            const answer = this.answersSets[question.sequence].slice(0, -1);
            this.wordCount[question.sequence] = this.calculateWordCount(answer);
            this.answersSets[question.sequence] = answer;
            this.localStorage.setItem(this.identityService.getAccountId().toString() + question.questionActivityID, this.getAnswer(question.sequence));
        }
    }

    calculateWordCount(words: string): number {
        return size(compact(split(words, /[ .:;?!~,()$&@`"|<>{}#%^*+=_€£¥•\[\]\r\n\s/\\]+/)));
    }

    getWordCount(questionSequence: number): number {
        return this.wordCount[questionSequence];
    }

    subscribe(eventName: string, successFn: (data?) => void, errorFn?: (e?) => void): Subscription {
        return this.emitter.subscribe(eventName, successFn, errorFn);
    }

    publish(eventName: string, data?: any): void {
        this.emitter.publish(eventName, data);
    }

    clearWordCount(): void {
        this.wordCount = {};
    }

    destroyAnswers(): void {
        this.answersSets = {};
        this.answersTextsHeight = {};
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
