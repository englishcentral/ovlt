import { Directive, ElementRef, Input, OnChanges } from "@angular/core";

@Directive({
    selector: "[ecFocusWhen]"
})
export class FocusWhenDirective implements OnChanges {
    @Input() ecFocusWhen: boolean;

    constructor(private elementRef: ElementRef) {
    }

    ngOnChanges() {
        if (this.ecFocusWhen) {
            this.elementRef.nativeElement.focus();
            if (this.elementRef.nativeElement.setSelectionRange) {
                this.elementRef.nativeElement.setSelectionRange(0, 0);
            }
        } else {
            this.elementRef.nativeElement.blur();
        }
    }
}
