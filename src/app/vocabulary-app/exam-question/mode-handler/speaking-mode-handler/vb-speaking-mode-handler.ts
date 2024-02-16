import { ExamQuestionCheckAnswer, ExamQuestionCheckedEvent, ExamQuestionModeSettings } from "../mode-handler-abstract";
import { SpeakingModeHandlerAbstract } from "./speaking-mode-handler-abstract";
import { STATUS_GOOD, WordResult } from "../../../../../types/speech/recognizer-result";
import { fill, join, size, split } from "lodash-es";

export class VbSpeakingModeHandler extends SpeakingModeHandlerAbstract {
    private wordResult?: WordResult;

    constructor(protected modeSettings: ExamQuestionModeSettings) {
        super(modeSettings);
    }

    generateCheckedEvent(answerSet: string[], examQuestionCheckAnswer: ExamQuestionCheckAnswer): ExamQuestionCheckedEvent {
        return {
            correct: this.isAnswerCorrect(),
            answerSet: answerSet,
            spokenAnswer: join(answerSet, ""),
            wordResult: examQuestionCheckAnswer.wordResult,
            rejected: examQuestionCheckAnswer.rejected,
            skipped: examQuestionCheckAnswer.skipped,
            courseId: examQuestionCheckAnswer.courseId
        };
    }

    checkAnswer(examQuestionCheckAnswer: ExamQuestionCheckAnswer): ExamQuestionCheckedEvent {
        this.wordResult = examQuestionCheckAnswer.wordResult;
        if (!this.wordResult) {
            this.setAnswerCorrect(false);
            return this.returnJunk(examQuestionCheckAnswer);
        }

        this.setAnswerCorrect(this.wordResult.isMatch());
        if (this.isAnswerCorrect()) {
            let correctAnswerSet = split(examQuestionCheckAnswer.currentOrthography, "");
            return this.generateCheckedEvent(correctAnswerSet, examQuestionCheckAnswer);
        }

        return this.returnJunk(examQuestionCheckAnswer);
    }

    returnJunk(examQuestionCheckAnswer: ExamQuestionCheckAnswer): ExamQuestionCheckedEvent {
        if (examQuestionCheckAnswer.accepted) {
            let answerSet = this.padLetterSet("", "?", examQuestionCheckAnswer.accepted);
            return this.generateCheckedEvent(answerSet, examQuestionCheckAnswer);
        }

        return this.generateCheckedEvent(fill(Array(size(this.letterSet)), "?"), examQuestionCheckAnswer);
    }

    isCorrect(index: number, answerSet: string[] = []): boolean {
        let letterSet = this.getLetterSet();
        if (letterSet[index] && letterSet[index].isReadOnly) {
            return true;
        }

        if (!this.isChecked()) {
            return false;
        }

        return this.wordResult && this.wordResult.status == STATUS_GOOD;
    }
}
