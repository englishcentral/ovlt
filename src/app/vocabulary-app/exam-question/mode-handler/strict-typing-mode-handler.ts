import { ExamQuestionModeSettings } from "./mode-handler-abstract";
import { TypingModeHandler } from "./typing-mode-handler";

export class StrictTypingModeHandler extends TypingModeHandler {

    constructor(protected modeSettings: ExamQuestionModeSettings) {
        super(modeSettings);
    }

    isSpecial(currentIndex: number): boolean {
        const letterSet = this.getLetterSet();
        return letterSet[currentIndex].isSpecialChar;
    }

    isVirtualAdvancedKeyboardVisible(): boolean {
        return true;
    }

    isFullKeyboardEnabled(): boolean {
        return true;
    }

    shouldShowSkipButton(): boolean {
        return true;
    }

    showVirtualKeyboard(): boolean {
        return false;
    }

    showAutoCompleteFirstHint(): boolean {
        return true;
    }

    showAutoCompleteSecondHint(): boolean {
        return false;
    }

    showTyping(): boolean {
        return true;
    }
}
