import { Observable, Subject } from "rxjs";
import { Component, OnDestroy } from "@angular/core";

@Component({
    template: ""
})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class SubscriptionAbstract implements OnDestroy {
    protected destroyInterceptor$: Subject<boolean> = new Subject();

    getDestroyInterceptor(): Observable<boolean> {
        // disallow mutation: getDestroyInterceptor().next() is not allowed
        return this.destroyInterceptor$.asObservable();
    }

    destroySubscriptions(): void {
        this.destroyInterceptor$.next(true);
    }

    ngOnDestroy(): void {
        this.destroySubscriptions();
    }
}
