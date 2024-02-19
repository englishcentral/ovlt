import { NgModule } from "@angular/core";
import { MicrophoneWidgetModule } from "../../microphone-widget/microphone-widget.module";
import { ExamQuestionComponent } from "./exam-question.component";
import { CommonModule } from "@angular/common";
import { VocabularyAppSharedService } from "../vocabulary-app-shared.service";
import { VocabBuilderModelService } from "../../model/vocab-builder-model.service";
import { VideoAppModule } from "../../video-app/video-app.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TypingSharedService } from "../../common/typing-shared.service";

@NgModule({
    imports: [
        CommonModule,
        MicrophoneWidgetModule,
        VideoAppModule,
        NgbModule
    ],
    declarations: [
        ExamQuestionComponent
    ],
    exports: [
        ExamQuestionComponent
    ],
    providers: [
        VocabularyAppSharedService,
        VocabBuilderModelService,
        TypingSharedService
    ]
})
export class ExamQuestionModule {
}
