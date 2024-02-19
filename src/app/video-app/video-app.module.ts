import { NgModule } from "@angular/core";
import { CoreModule } from "../../core/core.module";
import { VideoComponent } from "./video.component";
import { VideoFactoryService } from "./video-factory.service";

@NgModule({
    imports: [
        CoreModule
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
