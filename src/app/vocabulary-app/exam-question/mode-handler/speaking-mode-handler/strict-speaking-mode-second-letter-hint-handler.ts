import { ExamQuestionModeSettings } from "../mode-handler-abstract";
import { VbSpeakingModeHandler } from "./vb-speaking-mode-handler";

export class StrictSpeakingModeSecondLetterHintHandler extends VbSpeakingModeHandler {

    constructor(protected modeSettings: ExamQuestionModeSettings) {
        super(modeSettings);
    }

    showScrambleHint(): boolean {
        return false;
    }

    showAutoCompleteFirstHint(): boolean {
        return false;
    }

    showAutoCompleteSecondHint(): boolean {
        return true;
    }
}
