import { NgModule } from "@angular/core";
import { VirtualLetterInputModule } from "../virtual-letter-input/virtual-letter-input.module";
import { TypingSharedService } from "../common/typing-shared.service";
import { VirtualKeyboardComponent } from "./virtual-keyboard.component";

@NgModule({
    imports: [
        VirtualLetterInputModule
    ],
    providers: [
        TypingSharedService
    ],
    exports: [
        VirtualKeyboardComponent
    ],
    declarations: [
        VirtualKeyboardComponent
    ]
})

export class VirtualKeyboardModule {
}
