import { TypingModeHandler } from "./typing-mode-handler";
import {
    MODE_MULTIPLE_CHOICE,
    MODE_PRON_SPEAKING,
    MODE_REVERSE_MATCH_MULTIPLE_CHOICE,
    MODE_SPEAKING,
    MODE_STRICT_SPEAKING_SECOND_LETTER_HINT,
    MODE_STRICT_TYPING,
    MODE_STRICT_TYPING_SECOND_LETTER_HINT,
    MODE_TYPING
} from "../../../../model/types/vocab-builder-reference";
import { StrictTypingModeHandler } from "./strict-typing-mode-handler";
import {
    ReverseMatchMultipleChoiceModeHandler
} from "./multiple-choice-mode-handler/reverse-match-multiple-choice-mode-handler";
import { ExamQuestionModeSettings, ModeHandlerAbstract } from "./mode-handler-abstract";
import { MatchMultipleChoiceModeHandler } from "./multiple-choice-mode-handler/match-multiple-choice-mode-handler";
import { PronunciationSpeakingModeHandler } from "./speaking-mode-handler/pronunciation-speaking-mode-handler";
import { VbSpeakingModeHandler } from "./speaking-mode-handler/vb-speaking-mode-handler";
import { StrictTypingModeSecondLetterHintHandler } from "./strict-typing-mode-second-letter-hint-handler";
import {
    StrictSpeakingModeSecondLetterHintHandler
} from "./speaking-mode-handler/strict-speaking-mode-second-letter-hint-handler";


export class ModeHandlerAdapter {
    static getAdapter(mode: number,
                      modeSettings: ExamQuestionModeSettings = new ExamQuestionModeSettings()): ModeHandlerAbstract {

        switch (mode) {
            case MODE_SPEAKING:
                return new VbSpeakingModeHandler(modeSettings);
            case MODE_PRON_SPEAKING:
                return new PronunciationSpeakingModeHandler(modeSettings);
            case MODE_STRICT_TYPING:
                return new StrictTypingModeHandler(modeSettings);
            case MODE_STRICT_TYPING_SECOND_LETTER_HINT:
                return new StrictTypingModeSecondLetterHintHandler(modeSettings);
            case MODE_STRICT_SPEAKING_SECOND_LETTER_HINT:
                return new StrictSpeakingModeSecondLetterHintHandler(modeSettings);
            case MODE_MULTIPLE_CHOICE:
                return new MatchMultipleChoiceModeHandler(modeSettings);
            case MODE_REVERSE_MATCH_MULTIPLE_CHOICE:
                return new ReverseMatchMultipleChoiceModeHandler(modeSettings);
            case MODE_TYPING:
                return new TypingModeHandler(modeSettings);
            default:
                return new TypingModeHandler(modeSettings);
        }
    }
}
