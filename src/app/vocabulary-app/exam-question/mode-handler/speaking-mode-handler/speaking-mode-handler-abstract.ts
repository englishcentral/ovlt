import {
    ExamQuestionCheckAnswer,
    ExamQuestionCheckedEvent,
    ExamQuestionModeSettings,
    ModeHandlerAbstract
} from "../mode-handler-abstract";
import { Browser } from "../../../../../core/browser";

export abstract class SpeakingModeHandlerAbstract extends ModeHandlerAbstract {

    constructor(protected modeSettings: ExamQuestionModeSettings) {
        super(modeSettings);
    }

    generateCheckedEvent(answerSet: string[], examQuestionCheckAnswer: ExamQuestionCheckAnswer): ExamQuestionCheckedEvent {
        return {correct: false};
    }

    returnJunk(examQuestionCheckAnswer: ExamQuestionCheckAnswer): ExamQuestionCheckedEvent {
        return {correct: false};
    }

    isUncertain(index: number, answerSet: string[] = []): boolean {
        return false;
    }

    isIncorrect(index: number, answerSet: string[] = []): boolean {
        if (!this.isChecked()) {
            return false;
        }

        return !this.isAnswerCorrect();
    }

    isLetterInputReadOnly(): boolean {
        return true;
    }

    isBrowserUnsupported(): boolean {
        return Browser.isIos() && !Browser.isSafari();
    }

    showMicrophone(): boolean {
        return true;
    }

    showScrambleHint(): boolean {
        return true;
    }

    showAutoCompleteFirstHint(): boolean {
        return true;
    }

    showAutoCompleteSecondHint(): boolean {
        return true;
    }
}
