import {
    ExamQuestionCheckAnswer,
    ExamQuestionCheckedEvent,
    ExamQuestionModeSettings,
    ModeHandlerAbstract
} from "./mode-handler-abstract";
import { join } from "lodash-es";

export class TypingModeHandler extends ModeHandlerAbstract {

    constructor(protected modeSettings: ExamQuestionModeSettings) {
        super(modeSettings);
    }

    checkAnswer(examQuestionCheckAnswer: ExamQuestionCheckAnswer): ExamQuestionCheckedEvent {
        this.setAnswerCorrect(examQuestionCheckAnswer.typingCorrect);

        return {
            correct: this.isAnswerCorrect(),
            answerSet: examQuestionCheckAnswer.answerSet,
            typedAnswer: join(examQuestionCheckAnswer.answerSet, ""),
            skipped: examQuestionCheckAnswer.skipped,
            courseId: examQuestionCheckAnswer.courseId
        };
    }

    isSelected(currentIndex: number, index?: number): boolean {
        return currentIndex === index;
    }

    isSpecial(currentIndex: number): boolean {
        const letterSet = this.getLetterSet();
        return letterSet[currentIndex].isSpecialChar;
    }

    isCorrect(index: number, answerSet: string[] = []): boolean {
        if (this.completed) {
            return true;
        }

        let letterSet = this.getLetterSet();
        if (letterSet[index] && letterSet[index].isReadOnly) {
            return true;
        }

        if (!this.modeSettings.autoCheckOnTyping && !this.isChecked()) {
            return false;
        }

        if (!answerSet[index] || !letterSet[index]) {
            return false;
        }

        return letterSet[index] && letterSet[index].value == answerSet[index];
    }

    isIncorrect(index: number, answerSet: string[] = [], isReadOnly: boolean = false): boolean {
        if (isReadOnly) {
            return false;
        }
        let letterSet = this.getLetterSet();
        if (!this.modeSettings.autoCheckOnTyping && !this.isChecked()) {
            return false;
        }

        if ((!answerSet[index] && !this.isChecked()) || !letterSet[index]) {
            return false;
        }

        return letterSet[index].value != answerSet[index];
    }

    isVirtualAdvancedKeyboardVisible(): boolean {
        return true;
    }

    isFullKeyboardEnabled(): boolean {
        return false;
    }

    showVirtualKeyboard(): boolean {
        return true;
    }

    showAutoCompleteFirstHint(): boolean {
        return true;
    }

    showAutoCompleteSecondHint(): boolean {
        return true;
    }

    showTyping(): boolean {
        return true;
    }

    allowLetterInput(): boolean {
        return true;
    }
}
