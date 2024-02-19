import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OvltScoreAppComponent } from "./ovlt-score-app.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { DifficultyIndicatorModule } from "../../difficulty-indicator/difficulty-indicator.module";

@NgModule({
    declarations: [
        OvltScoreAppComponent
    ],
    exports: [
        OvltScoreAppComponent
    ],
    imports: [
        CommonModule,
        NgbModule,
        DifficultyIndicatorModule
    ]
})
export class OvltScoreAppModule {
}
