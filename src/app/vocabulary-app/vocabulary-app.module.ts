import { NgModule } from "@angular/core";
import { CoreModule } from "../../../core/core.module";
import { VocabularyAppComponent } from "./vocabulary-app.component";
import { RouterModule } from "@angular/router";
import { VocabBuilderStartComponent } from "./vocab-builder-start/vocab-builder-start.component";
import { VocabBuilderCompleteComponent } from "./vocab-builder-complete/vocab-builder-complete.component";

@NgModule({
    imports: [
        CoreModule,
        RouterModule,
        VocabularyAppSharedModule,
    ],
    declarations: [
        VocabularyAppComponent,
        VocabBuilderStartComponent,
        VocabBuilderCompleteComponent
    ],
    exports: [
        VocabularyAppComponent
    ]
})
export class VocabularyAppModule {
}
