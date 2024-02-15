import { AddWordListComponent } from "./add-word-list.component";
import { LoadingRingModule } from "../../../../shared/loading-ring/loading-ring.module";
import { NgModule } from "@angular/core";
import { CoreModule } from "../../../../core/core.module";


@NgModule({
    imports: [
        CoreModule,
        LoadingRingModule
    ],
    declarations: [
        AddWordListComponent
    ],
    exports: [
        AddWordListComponent
    ]
})
export class AddWordListAppModule {
}
