import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { VirtualLetterInputComponent } from "./virtual-letter-input.component";
import { DebounceClickDirective } from "./debounce-click.directive";

@NgModule({
    imports: [
        CommonModule,
        NgbModule
    ],
    exports: [
        VirtualLetterInputComponent
    ],
    declarations: [
        VirtualLetterInputComponent,
        DebounceClickDirective
    ]
})

export class VirtualLetterInputModule {

}
