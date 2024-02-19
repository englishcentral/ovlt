import { NgModule } from "@angular/core";
import { MicrophoneWidgetComponent } from "./microphone-widget.component";
import { MicrophoneWidgetStateService } from "./microphone-widget-state.service";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";
import { RecognizerModelService } from "../model/recognizer-model.service";
import { RecognizerSettingService } from "./recognizer-setting.service";
import { BrowserMediaDeviceService } from "../common/browser-media-device.service";
import { MicrophoneHandlerService } from "./microphone-handler.service";

@NgModule({
    imports: [
        CommonModule,
        NgbModule
    ],
    providers: [
        MicrophoneWidgetStateService,
        BrowserMediaDeviceService,
        MicrophoneHandlerService,
        RecognizerModelService,
        RecognizerSettingService,
    ],
    declarations: [
        MicrophoneWidgetComponent
    ],
    exports: [
        MicrophoneWidgetComponent
    ],
    bootstrap: [
        MicrophoneWidgetComponent
    ]
})
export class MicrophoneWidgetModule {

}
