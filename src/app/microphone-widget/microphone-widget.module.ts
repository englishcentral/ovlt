import { NgModule } from "@angular/core";
import { MicrophoneModule } from "../../../activity-app/shared-activity/microphone/microphone-module";
import { MicrophoneWidgetComponent } from "./microphone-widget.component";
import { ActivitySfxService } from "../../../activity-app/shared-activity/activity-sfx.service";
import { MicrophoneWidgetStateService } from "./microphone-widget-state.service";
import { BrowserMediaDeviceService } from "../../../core/browser-media-device.service";
import { MicrophoneHandlerService } from "../../../activity-app/shared-activity/microphone/microphone-handler.service";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TooltipToggleModule } from "../../helpers/directives/tooltip-toggle-directive/tooltip-toggle.module";
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [
        CommonModule,
        NgbModule,
        MicrophoneModule,
        TooltipToggleModule
    ],
    providers: [
        MicrophoneWidgetStateService,
        ActivitySfxService,
        BrowserMediaDeviceService,
        MicrophoneHandlerService
    ],
    declarations: [
        MicrophoneWidgetComponent
    ],
    exports: [
        MicrophoneModule,
        MicrophoneWidgetComponent
    ],
    bootstrap: [
        MicrophoneWidgetComponent
    ]
})
export class MicrophoneWidgetModule {

}
