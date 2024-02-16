import { ExamQuestionModeSettings } from "./mode-handler-abstract";
import { StrictTypingModeHandler } from "./strict-typing-mode-handler";

export class StrictTypingModeSecondLetterHintHandler extends StrictTypingModeHandler {

    constructor(protected modeSettings: ExamQuestionModeSettings) {
        super(modeSettings);
    }

    showAutoCompleteFirstHint(): boolean {
        return false;
    }

    showAutoCompleteSecondHint(): boolean {
        return true;
    }
}
