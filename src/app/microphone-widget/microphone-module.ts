import { NgModule } from "@angular/core";
import { RecognizerModelService } from "../model/recognizer-model.service";
import { RecognizerSettingService } from "./recognizer-setting.service";

@NgModule({
    providers: [
        RecognizerModelService,
        RecognizerSettingService
    ]
})
export class MicrophoneModule {
}
