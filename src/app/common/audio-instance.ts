import { Subscription } from "rxjs";

export interface AudioInstance {
    isPlaying: boolean;
    isLoading: boolean;
    audio?: HTMLAudioElement;

    play(): any;

    pause(): void;

    stop(): void;

    hasError(): boolean;

    setStopTime(stopTime: number): void;

    currentTime(time?: number): number;

    setGain(gain: number): void;

    canPlay(): boolean;

    onPlay(callback: () => void): Subscription;

    onStop(callback: () => void): Subscription;

    onEnd(callback: () => void): Subscription;

    getUrl(): string;

    destroy(): void;

    getAudioPromise(): Promise<any>;

    getAudioOnCanPlayPromise(): Promise<any>;

    getDuration(): number;

    setSameThread(sameThread: boolean): void;
}
