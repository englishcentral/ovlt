import { ExamQuestionModeSettings } from "../mode-handler-abstract";
import { MultipleChoiceModeHandlerAbstract } from "./multiple-choice-mode-handler-abstract";

export class ReverseMatchMultipleChoiceModeHandler extends MultipleChoiceModeHandlerAbstract {

    constructor(protected modeSettings: ExamQuestionModeSettings) {
        super(modeSettings);
    }
}
