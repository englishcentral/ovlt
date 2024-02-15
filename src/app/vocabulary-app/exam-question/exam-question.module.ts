import { NgModule } from "@angular/core";
import { CoreModule } from "../../../../core/core.module";
import { VideoAppModule } from "../../../../common-app/video-app/video-app.module";
import { SharedModule } from "../../../../shared/shared.module";
import { AudioPlaybackModule } from "../../../helpers/directives/audio-playback-directive/audio-playback.module";
import { SharedActivityModule } from "../../../../activity-app/shared-activity/shared-activity.module";
import { VirtualLetterInputModule } from "../../virtual-letter-input/virtual-letter-input.module";
import { VocabularyAppSharedService } from "../../vocabulary-app/vocabulary-app-shared.service";
import { MicrophoneWidgetModule } from "../../microphone-widget/microphone-widget.module";
import { LoadingRingModule } from "../../../../shared/loading-ring/loading-ring.module";
import { VirtualKeyboardModule } from "../../../../shared/virtual-keyboard/virtual-keyboard.module";
import { ExamQuestionComponent } from "./exam-question.component";
import { SpeechMeterModule } from "../../speech-meter/speech-meter.module";
import { VocabBuilderModelService } from "../../../../model/content/vocab-builder-model.service";

@NgModule({
    imports: [
        CoreModule,
        VideoAppModule,
        SharedModule,
        SharedActivityModule,
        LoadingRingModule,
        VirtualKeyboardModule,
        SpeechMeterModule,
        AudioPlaybackModule,
        VirtualLetterInputModule,
        MicrophoneWidgetModule
    ],
    declarations: [
        ExamQuestionComponent
    ],
    exports: [
        ExamQuestionComponent
    ],
    providers: [
        VocabularyAppSharedService,
        VocabBuilderModelService
    ]
})
export class ExamQuestionModule {
}
