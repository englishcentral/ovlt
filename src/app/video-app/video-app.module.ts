import { NgModule } from "@angular/core";
import { VideoComponent } from "./video.component";
import { VideoFactoryService } from "./video-factory.service";
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        VideoFactoryService
    ],
    declarations: [
        VideoComponent
    ],
    exports: [
        VideoComponent
    ],
    bootstrap: [
        VideoComponent
    ]
})
export class VideoAppModule {
}
