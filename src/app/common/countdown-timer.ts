import { interval, never, Observable, Subject, Subscription, timer } from "rxjs";
import { finalize, map, startWith, switchMap, takeUntil, takeWhile, tap } from "rxjs/operators";
import { format, parseISO } from "date-fns";

export const TIMER_MODE_REAL_END_TIME: string = "real-end-time";
export const TIMER_MODE_TOTAL_REMAINING_TIME: string = "total-remaining-time";

export class CountdownTimerTick {
    time: number;
    timeString: string;
    isExpired: boolean;
    percent: number;
}

export class CountdownTimer {
    private remainingTime: string = "";
    private remainingTimeMs: number = 0;
    private totalIntervalMs: number = 0;
    private realEndTime: number;

    private onCompleteFn: () => void;
    private expired: boolean = false;

    private onDestroy$ = new Subject<void>();
    private timer$: Observable<CountdownTimerTick>;
    private active$ = new Subject<boolean>();

    constructor(private endDate: string = "",
                private durationMs: number = 0,
                private intervalMs: number = 1000,
                private format: string = "mm:ss",
                private mode: string = TIMER_MODE_REAL_END_TIME) {

        this.totalIntervalMs = this.computeTargetTimeMs(this.endDate, this.durationMs);
        this.remainingTimeMs = this.totalIntervalMs;
        this.realEndTime = Date.now() + this.totalIntervalMs;

        this.tick(true);
        if (this.isExpired()) {
            this.timer$ = never();
            return;
        }

        let baseTimer$ = this.generateTimerObservable(this.intervalMs);
        this.timer$ = this.active$.pipe(
            startWith(true),
            switchMap(isActive => isActive ? baseTimer$ : never()),
            tap(() => this.tick()),
            takeUntil(this.onDestroy$),
            takeWhile(timerTick => timerTick.time >= 0),
            finalize(() => this.complete())
        );
    }

    private generateTimerObservable(intervalMs: number): Observable<CountdownTimerTick> {
        return interval(intervalMs)
            .pipe(
                takeUntil(this.onDestroy$),
                map(() => {
                    let remainingTimeMs = this.getRemainingTimeMs();
                    return {
                        time: remainingTimeMs,
                        timeString: this.getRemainingTime(),
                        isExpired: remainingTimeMs <= 0 || this.isExpired(),
                        percent: this.totalIntervalMs > 0 ? remainingTimeMs / this.totalIntervalMs : 0
                    };
                })
            );
    }

    private tick(check: boolean = false): void {
        if (!check) {
            this.remainingTimeMs -= this.intervalMs;
        }

        if (this.checkCompletion()) {
            this.complete();
        }
        this.remainingTime = this.computeRemainingTimeString(this.remainingTimeMs);
    }

    private checkCompletion(): boolean {
        if (this.mode == TIMER_MODE_REAL_END_TIME) {
            return Date.now() > this.realEndTime;
        }
        if (this.mode == TIMER_MODE_TOTAL_REMAINING_TIME) {
            return this.remainingTimeMs < this.intervalMs;
        }
        return false;
    }

    complete(): void {
        if (this.expired) {
            return;
        }
        if (this.onCompleteFn) {
            this.onCompleteFn();
        }
        this.setExpired();
    }

    private computeTargetTimeMs(targetDate: string, durationMs: number): number {
        if (!targetDate && !durationMs) {
            return 0;
        }

        if (targetDate) {
            return parseISO(targetDate).getTime() - Date.now() + durationMs;
        }

        return durationMs;
    }

    private computeRemainingTimeString(remainingTimeMs: number): string {
        if (remainingTimeMs <= 0) {
            return "";
        }

        if (this.mode == TIMER_MODE_REAL_END_TIME) {
            this.remainingTimeMs = this.realEndTime - Date.now();
        }

        return format(remainingTimeMs, this.format);
    }

    private setExpired(): void {
        this.remainingTime = "";
        this.expired = true;
    }

    pause(): void {
        if (this.isExpired()) {
            return;
        }
        this.active$.next(false);
    }

    resume(): void {
        if (this.isExpired()) {
            return;
        }
        this.active$.next(true);
    }

    onReady(onReadyFn: () => void): void {
        timer(this.intervalMs)
            .pipe(
                takeUntil(this.onDestroy$)
            )
            .subscribe(() => {
                onReadyFn();
            });
    }

    onComplete(onCompleteFn: () => void): void {
        this.onCompleteFn = onCompleteFn;
    }

    getEndDate(): string {
        return this.endDate;
    }

    getRemainingTime(): string {
        return this.remainingTime;
    }

    getRemainingTimeMs(): number {
        return this.remainingTimeMs;
    }

    isExpired(): boolean {
        return this.expired;
    }

    getObservable(): Observable<CountdownTimerTick> {
        return this.timer$;
    }

    subscribe(next?: (value: CountdownTimerTick) => void,
              error?: (error: any) => void,
              complete?: () => void): Subscription {
        return this.getObservable().subscribe(next, error, complete);
    }

    destroy(): void {
        this.onDestroy$.next();
    }

}
