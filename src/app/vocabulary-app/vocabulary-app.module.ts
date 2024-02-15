import { NgModule } from "@angular/core";
import { CoreModule } from "../../../core/core.module";
import { VocabularyAppComponent } from "./vocabulary-app.component";
import { RouterModule } from "@angular/router";
import { ViewWordsModule } from "../view-words/view-words.module";
import { VocabBuilderAppModule } from "../vocab-builder-app/vocab-builder-app.module";

@NgModule({
    imports: [
        CoreModule,
        RouterModule,
        VocabularyAppSharedModule,
        VocabBuilderAppModule,
        ViewWordsModule
    ],
    declarations: [
        VocabularyAppComponent
    ],
    exports: [
        VocabularyAppComponent
    ]
})
export class VocabularyAppModule {
}
