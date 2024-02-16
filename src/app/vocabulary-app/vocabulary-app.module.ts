import { NgModule } from "@angular/core";
import { VocabBuilderStartComponent } from "./vocab-builder-start/vocab-builder-start.component";
import { VocabBuilderCompleteComponent } from "./vocab-builder-complete/vocab-builder-complete.component";
import { VocabBuilderAppComponent } from "./vocab-builder-app.component";
import { VocabularyAppSharedService } from "./vocabulary-app-shared.service";
import { StudyLevelModelService } from "../model/study-level-model.service";
import { ReferenceModelService } from "../model/reference-model.service";
import { AdaptiveQuizModelService } from "../model/adaptive-quiz-model.service";
import { VocabBuilderModelService } from "../model/vocab-builder-model.service";
import { VocabBuilderEventHandlerService } from "./event-handler/vocab-builder-event-handler.service";
import { VocabBuilderProgressService } from "./vocab-builder-progress.service";
import { VocabularyQuizModelService } from "../model/vocabulary-quiz-model.service";
import { VocabBuilderStateService } from "./vocab-builder-state.service";
import { WordProgressModelService } from "../model/word-progress.model.service";
import { OvltScoreAppModule } from "./ovlt-score-app/ovlt-score-app.module";
import { ExamQuestionModule } from "./exam-question/exam-question.module";
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [
        CommonModule,
        ExamQuestionModule,
        OvltScoreAppModule
    ],
    declarations: [
        VocabBuilderAppComponent,
        VocabBuilderStartComponent,
        VocabBuilderCompleteComponent
    ],
    providers: [
        WordProgressModelService,
        VocabBuilderStateService,
        VocabularyQuizModelService,
        VocabBuilderProgressService,
        VocabBuilderEventHandlerService,
        VocabBuilderModelService,
        AdaptiveQuizModelService,
        ReferenceModelService,
        VocabularyAppSharedService,
        StudyLevelModelService
    ],
    exports: [
        VocabBuilderAppComponent
    ]
})
export class VocabularyAppModule {
}
