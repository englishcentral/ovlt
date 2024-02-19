import { NgModule } from "@angular/core";
import { MicrophoneWidgetComponent } from "./microphone-widget.component";
import { MicrophoneWidgetStateService } from "./microphone-widget-state.service";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { CommonModule } from "@angular/common";
import { BrowserMediaDeviceService } from "../common/browser-media-device.service";
import { MicrophoneHandlerService } from "./microphone-handler.service";
import { MicrophoneModule } from "./microphone-module";

@NgModule({
    imports: [
        CommonModule,
        NgbModule
    ],
    providers: [
        MicrophoneWidgetStateService,
        BrowserMediaDeviceService,
        MicrophoneHandlerService,
        MicrophoneModule
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
