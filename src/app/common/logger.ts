declare var window: any;

export class Logger {
    protected static debugMode: boolean = false;

    log(...args) {
    }

    error(...args) {
    }

    static setDebugMode(debugMode?: boolean): void {
        Logger.debugMode = debugMode ?? false;
        if (Logger.debugMode) {
            Logger.prototype.log = window.console.log.bind(window.console);
            Logger.prototype.error = window.console.error.bind(window.console);
        } else {
            Logger.prototype.log = (...args) => {
            };
            Logger.prototype.error = (...args) => {
            };
        }
    }
}
