import {
    ExamQuestionCheckAnswer,
    ExamQuestionCheckedEvent,
    ExamQuestionModeSettings,
    ModeHandlerAbstract
} from "../mode-handler-abstract";
import { isEqual } from "lodash-es";

export class MultipleChoiceModeHandlerAbstract extends ModeHandlerAbstract {
    constructor(protected modeSettings: ExamQuestionModeSettings) {
        super(modeSettings);
    }

    // TODO make checking answer based on sharedMeaningId instead of wordHeadId
    checkAnswer(examQuestionCheckAnswer: ExamQuestionCheckAnswer): ExamQuestionCheckedEvent {
        const answerWordHeadId = examQuestionCheckAnswer?.selectedWord?.wordAdapter?.wordHeadId || 0;
        let isAnswerCorrect = false;
        if (answerWordHeadId) {
            isAnswerCorrect = isEqual(answerWordHeadId, examQuestionCheckAnswer?.correctWordHeadId)
                && !(examQuestionCheckAnswer.skipped || examQuestionCheckAnswer.timeout);
        }
        this.setAnswerCorrect(isAnswerCorrect);
        return {
            correct: this.isAnswerCorrect(),
            selectedWord: examQuestionCheckAnswer.selectedWord,
            timeout: examQuestionCheckAnswer.timeout ? 1 : undefined,
            skipped: examQuestionCheckAnswer.skipped,
            courseId: examQuestionCheckAnswer.courseId
        };
    }

    isWordPronunciationEnabled(): boolean {
        return true;
    }

    isAutoAdvanceEnabled(): boolean {
        return true;
    }

    shouldAudioPlay(): boolean {
        return true;
    }

    shouldVideoPlayBeforeAnswerChecked(): boolean {
        return true;
    }

    shouldShowVideoThumbnail(): boolean {
        return true;
    }

    shouldVideoAutoPlay(): boolean {
        return false;
    }

    showMultipleChoice(): boolean {
        return true;
    }

    showAudio(): boolean {
        return true;
    }

    showTranscript(): boolean {
        return false;
    }

    showTimer(): boolean {
        return true;
    }

    showWordPronunciation(): boolean {
        return true;
    }

    showControls(): boolean {
        return false;
    }
}
