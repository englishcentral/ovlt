import { NgModule } from "@angular/core";
import { DifficultyIndicatorComponent } from "./difficulty-indicator.component";
import { CommonModule } from "@angular/common";

@NgModule({
    imports: [
        CommonModule
    ],
    providers: [],
    declarations: [
        DifficultyIndicatorComponent
    ],
    exports: [
        DifficultyIndicatorComponent
    ]
})
export class DifficultyIndicatorModule {
}
