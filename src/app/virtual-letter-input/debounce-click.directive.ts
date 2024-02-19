import { Directive, EventEmitter, HostListener, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { Subject } from "rxjs";
import { debounceTime, takeUntil } from "rxjs/operators";

@Directive({
    selector: "[ecDebounceClick]"
})
export class DebounceClickDirective implements OnInit, OnDestroy {
    @Input() debounceTime = 100;
    @Output() debounceClick = new EventEmitter();

    private clicks = new Subject<Event>();

    private destroy$: Subject<boolean> = new Subject<boolean>();

    ngOnInit() {
        this.clicks
            .pipe(
                takeUntil(this.destroy$),
                debounceTime(this.debounceTime)
            )
            .subscribe(e => this.debounceClick.emit(e));
    }

    ngOnDestroy() {
        this.destroy$.next(true);
    }

    @HostListener("click", ["$event"])
    clickEvent(event) {
        event.preventDefault();
        event.stopPropagation();
        this.clicks.next(event);
    }
}
