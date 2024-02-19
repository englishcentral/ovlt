import { NgModule } from "@angular/core";
import { RecognizerSettingService } from "../../../model/recognizer/recognizer-setting.service";
import { RecognizerModelService } from "../../../model/recognizer/recognizer-model.service";
import {
    FileRequestHandlerAdapterService
} from "../../../shared/file-request-handler/file-request-handler-adapter.service";

@NgModule({
    providers: [
        RecognizerModelService,
        RecognizerSettingService,
        FileRequestHandlerAdapterService
    ]
})
export class MicrophoneModule {
}
