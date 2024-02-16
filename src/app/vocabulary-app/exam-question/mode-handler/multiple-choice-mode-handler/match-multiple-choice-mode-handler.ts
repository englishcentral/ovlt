import { ExamQuestionModeSettings } from "../mode-handler-abstract";
import { MultipleChoiceModeHandlerAbstract } from "./multiple-choice-mode-handler-abstract";


export class MatchMultipleChoiceModeHandler extends MultipleChoiceModeHandlerAbstract {

    constructor(protected modeSettings: ExamQuestionModeSettings) {
        super(modeSettings);
    }
}
