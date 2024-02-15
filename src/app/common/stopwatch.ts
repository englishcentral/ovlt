export class StopWatch {
    private startDate: Date;
    private endDate: Date;
    private started: boolean = false;

    constructor(autoStart: boolean = false) {
        if (autoStart) {
            this.start();
        }
    }

    start(): void {
        if (!this.started) {
            this.startDate = new Date();
            this.started = true;
            this.endDate = undefined;
        }
    }

    stop(): number {
        if (this.started) {
            this.endDate = new Date();
        }
        return this.getTime();
    }

    getTime(): number {
        if (this.started) {
            if (this.endDate) {
                return this.endDate.getTime() - this.startDate.getTime();
            }
            return new Date().getTime() - this.startDate.getTime();
        }

        return 0;
    }

    reset() {
        this.started = false;
    }
}
