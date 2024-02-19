import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OvltScoreAppComponent } from "./ovlt-score-app.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

@NgModule({
    declarations: [
        OvltScoreAppComponent
    ],
    exports: [
        OvltScoreAppComponent
    ],
    imports: [
        CommonModule,
        NgbModule
    ]
})
export class OvltScoreAppModule {
}
