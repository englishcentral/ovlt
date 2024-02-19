import { ExamQuestionCheckAnswer, ExamQuestionCheckedEvent, ExamQuestionModeSettings } from "../mode-handler-abstract";
import { SpeakingModeHandlerAbstract } from "./speaking-mode-handler-abstract";
import { CLASSIFIER_STATUSWORD_GOOD, WordResult } from "../../../../../types/recognizer-result";
import { split } from "lodash-es";

export class PronunciationSpeakingModeHandler extends SpeakingModeHandlerAbstract {
    private wordResult?: WordResult;

    constructor(protected modeSettings: ExamQuestionModeSettings) {
        super(modeSettings);
    }

    generateCheckedEvent(answerSet: string[], examQuestionCheckAnswer: ExamQuestionCheckAnswer): ExamQuestionCheckedEvent {
        return {
            correct: this.isAnswerCorrect(),
            answerSet: answerSet,
            label: examQuestionCheckAnswer.currentOrthography,
            wordInstanceId: examQuestionCheckAnswer.wordInstanceId,
            wordId: examQuestionCheckAnswer.wordId,
            wordResult: examQuestionCheckAnswer.wordResult,
            rejected: examQuestionCheckAnswer.rejected,
            skipped: examQuestionCheckAnswer.skipped,
            accountPronunciationWordId: examQuestionCheckAnswer.accountPronunciationWordId
        };
    }

    checkAnswer(examQuestionCheckAnswer: ExamQuestionCheckAnswer): ExamQuestionCheckedEvent {
        this.wordResult = examQuestionCheckAnswer.wordResult;
        if (!this.wordResult) {
            this.setAnswerCorrect(false);
            return this.returnJunk(examQuestionCheckAnswer);
        }

        const isCorrect = this.wordResult.isClassifierStatusGood() && this.wordResult.isMatch();
        this.setAnswerCorrect(isCorrect);
        if (this.isAnswerCorrect()) {
            let correctAnswerSet = split(examQuestionCheckAnswer.currentOrthography, "");
            return this.generateCheckedEvent(correctAnswerSet, examQuestionCheckAnswer);
        }

        return this.returnJunk(examQuestionCheckAnswer);
    }

    returnJunk(examQuestionCheckAnswer: ExamQuestionCheckAnswer): ExamQuestionCheckedEvent {
        const answerSet = split(examQuestionCheckAnswer.currentOrthography, "");
        return this.generateCheckedEvent(answerSet, examQuestionCheckAnswer);
    }

    isCorrect(index: number, answerSet: string[] = []): boolean {
        let letterSet = this.getLetterSet();
        if (letterSet[index] && letterSet[index].isReadOnly) {
            return true;
        }

        if (!this.isChecked()) {
            return false;
        }

        return this.wordResult && this.wordResult.classifierStatus == CLASSIFIER_STATUSWORD_GOOD;
    }

    isTypingFallBackEnabled(): boolean {
        return false;
    }

    showScrambleHint(): boolean {
        return false;
    }

    shouldShowExampleWord(): boolean {
        return true;
    }
}
