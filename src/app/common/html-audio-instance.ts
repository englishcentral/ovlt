import { Subscription, timer } from "rxjs";
import { isUndefined } from "lodash-es";
import { AudioInstance } from "./audio-instance";
import { Emitter } from "./emitter";
import { getMediaErrorType, MEDIA_PERMISSION_DENIED } from "./browser-navigator";
import { Logger } from "./logger";

const AUDIO_TIMEOUT = 3000;

export class HtmlAudioInstance implements AudioInstance {
    audio?: HTMLMediaElement;
    isPlaying: boolean = false;
    error: boolean = false;
    isLoading: boolean = false;
    isSameThread: boolean = false;
    private stopTime: number | undefined;
    private onTimeUpdateSet: boolean = false;

    constructor(private url: string,
                private emitter: Emitter,
                private logger,
                preload: boolean = true) {
        if (!url) {
            return;
        }

        if (preload) {
            this.generateAudio(this.url);
        }
    }

    private generateAudio(url: string, preload: boolean = true): HTMLMediaElement | undefined {
        if (this.audio) {
            return this.audio;
        }

        if (!url) {
            this.logger.error("missing audio asset");
            this.error = true;
            return;
        }

        try {
            this.audio = new Audio(url);
            this.logger.log("AudioInstance created:", url);
            if (preload) {
                this.audio.preload = "auto";
            }

            this.addEventHandlers();
            return this.audio;
        } catch (error) {
            this.logger.error("AudioInstance error: audio generation");
            this.logger.log(error);
            this.error = true;
            this.audio = undefined;
        }
    }

    hasError(): boolean {
        return this.error;
    }

    play(): Promise<void> {
        if (this.isPlaying || this.error) {
            return Promise.resolve();
        }

        let audio = this.generateAudio(this.url, false);
        if (!audio) {
            this.logger.error("AudioInstance error: no audio generated");
            this.error = true;
            return Promise.resolve();
        }

        if (this.isSameThread) {
            this.audio?.play();
            this.emitter.publish("ON_PLAY", this);
            this.isPlaying = true;
            return;
        }

        this.isLoading = true;
        return this.getAudioPromise().then((audio) => {
            if (!audio) {
                this.logger.error("fromAudioInstance: unable to create audio");
                this.error = true;
                return Promise.reject();
            }

            try {
                let playPromise = audio.play();
                if (playPromise && playPromise.then) {
                    return playPromise
                        .then(() => {
                            this.isPlaying = true;
                            this.emitter.publish("ON_PLAY", this);
                            this.isLoading = false;
                        })
                        .catch((error) => {
                            this.error = true;
                            return Promise.reject(error);
                        });
                }

                // IE stuff here
                this.isPlaying = true;
                this.emitter.publish("ON_PLAY", this);
                this.isLoading = false;
                return Promise.resolve();
            } catch (error) {
                this.error = true;
                this.logger.error("AudioInstance - can't play", error);
                return Promise.reject(error);
            }

        }).catch((error) => {
            this.isPlaying = false;
            this.isLoading = false;
            this.logger.error("AudioInstance error: on play", error);
            if (getMediaErrorType(error) === MEDIA_PERMISSION_DENIED) {
                return;
            }
            this.error = true;
        });
    }

    pause(): void {
        if (!this.audio || !this.isPlaying) {
            return;
        }
        this.audio.pause();
        this.isPlaying = false;
    }

    stop(): void {
        if (!this.audio) {
            return;
        }
        this.stopTime = undefined;
        this.audio.currentTime = 0;
        this.audio.pause();
        this.isPlaying = false;
        this.emitter.publish("ON_STOP", this);
    }

    currentTime(time?: number): number {
        if (isUndefined(this.audio)) {
            return 0;
        }
        if (!isUndefined(time)) {
            this.audio.currentTime = time;
        }

        return this.audio.currentTime;
    }

    setStopTime(stopTime: number): void {
        this.stopTime = stopTime;
        if (!this.onTimeUpdateSet) {
            this.onTimeUpdateSet = true;
            this.onTimeUpdate(() => {
                if (this.stopTime && this.currentTime() >= (this.stopTime)) {
                    this.stop();
                }
            });
        }
    }

    canPlay(): boolean {
        return this.audio && !this.error;
    }

    onPlay(callback: () => void): Subscription {
        return this.emitter.subscribe("ON_PLAY", callback);
    }

    onDurationChange(callback: () => void): Subscription {
        return this.emitter.subscribe("ON_DURATION_CHANGE", callback);
    }

    onStop(callback: () => void): Subscription {
        return this.emitter.subscribe("ON_STOP", callback);
    }

    onEnd(callback: () => void): Subscription {
        return this.emitter.subscribe("ON_END", callback);
    }

    onTimeUpdate(callback: () => void): Subscription {
        return this.emitter.subscribe("ON_TIME_UPDATE", callback);
    }

    setGain(gain: number) {
        this.audio.volume = gain;
    }

    destroy(): void {
        if (this.isPlaying) {
            this.stop();
            this.onEnd(() => {
                this.removeEventHandlers();
            });
        } else {
            this.removeEventHandlers();
        }

        if (!isUndefined(this.audio)) {
            this.audio.onerror = () => {
            };
            this.audio.src = "";
            this.audio.load();
            this.audio = undefined;
        }
    }

    private addEventHandlers() {
        if (isUndefined(this.audio)) {
            return;
        }
        this.audio.onended = () => {
            this.isPlaying = false;
            this.emitter.publish("ON_END", this);
        };

        this.audio.ontimeupdate = () => {
            this.emitter.publish("ON_TIME_UPDATE", this);
        };

        this.audio.onerror = (error) => {
            this.logger.error("AudioInstance error: on error handler", error);
            this.error = true;
        };

        this.audio.ondurationchange = (a) => {
            this.emitter.publish("ON_DURATION_CHANGE", this);
        };
    }

    private removeEventHandlers() {
        this.emitter.destroy();
    }

    getUrl(): string {
        return this.url;
    }

    getAudioOnCanPlayPromise(): Promise<HTMLMediaElement | undefined> {
        if (!this.audio) {
            throw "no audio detected";
        }

        if (this.audio.readyState >= 4) {
            return Promise.resolve(this.audio);
        }

        return this.getAudioOnCanPlay();
    }

    getAudioPromise(): Promise<HTMLMediaElement | undefined> {
        if (!this.audio) {
            return Promise.reject("no audio detected");
        }

        if (this.audio.readyState > 0) {
            return Promise.resolve(this.audio);
        }

        return this.getAudioOnLoadedMetaData();
    }

    private getAudioOnLoadedMetaData(): Promise<HTMLMediaElement | undefined> {
        return new Promise((resolve, reject) => {
            timer(AUDIO_TIMEOUT).subscribe(() => resolve(this.audio));

            this.audio.onloadedmetadata = () => {
                this.logger.log("AudioInstance onloadedmetadata", this.url);
                return resolve(this.audio);
            };

            this.audio.onerror = (error) => {
                reject(error);
            };
        });
    }

    private getAudioOnCanPlay(): Promise<HTMLMediaElement | undefined> {
        return new Promise((resolve, reject) => {
            timer(AUDIO_TIMEOUT).subscribe(() => resolve(this.audio));

            this.audio.oncanplay = () => {
                this.logger.log("AudioInstance oncanplay", this.url);
                return resolve(this.audio);
            };

            this.audio.onerror = (error) => {
                this.logger.error("AudioInstance onerror", error);
                reject(error);
            };
        });
    }

    isPaused(): boolean {
        return !!this.audio?.paused;
    }

    getDuration(): number {
        if (!this.audio) {
            return 0;
        }
        if (!Number.isFinite(this.audio.duration)) {
            return 0;
        }

        return this.audio?.duration ?? 0;
    }

    setSameThread(sameThread: boolean): void {
        this.isSameThread = sameThread;
    }
}

export const createAudioInstance = (url: string, preload: boolean = true, emitter: Emitter = new Emitter()) => {
    return new HtmlAudioInstance(url, emitter, new Logger(), preload);
};
