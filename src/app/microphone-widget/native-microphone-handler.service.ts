import { Injectable, NgZone } from "@angular/core";
import { MicrophoneHandler, MicrophoneRecordingOptions } from "./microphone-handler";
import { EncoderHandlerAbstract } from "./encoder/encoder-handler-abstract";
import { Observable, of, Subscription, timer } from "rxjs";
import { mergeMap, takeUntil } from "rxjs/operators";
import {
    ENCODER_FLAC,
    ENCODER_MP4,
    ENCODER_NATIVE_MEDIARECORDER,
    ENCODER_NONE,
    ENCODER_WAV,
    SOLUTION_AUTO
} from "../../types/encoder";
import { assign, get } from "lodash-es";
import { Emitter } from "../common/emitter";
import { Logger } from "../common/logger";
import { BrowserMediaDeviceService } from "../common/browser-media-device.service";
import { getStreamRecycleRequired, getSupportedMediaRecorderFormat, getUserMedia } from "../common/browser-navigator";
import { MicrophoneAudioOutputStream } from "./microphone-audio-output-stream";
import { BrowserMediaDevice } from "../common/browser-media-device";


@Injectable({providedIn: "root"})
export class NativeMicrophoneHandlerService implements MicrophoneHandler {
    private type: string = "MicrophoneHTML5";

    private emitter = new Emitter();
    private logger = new Logger();
    private audioStream: MediaStream | undefined;
    private recording: boolean = false;
    private targetGain: number = 0.75;

    private handler?: EncoderHandlerAbstract;
    private currentConstraints?: MediaStreamConstraints;

    constructor(private browserMediaDeviceService: BrowserMediaDeviceService,
                private ngZone: NgZone) {
    }

    initialize(microphoneId): void {
        this.browserMediaDeviceService.subscribe(BrowserMediaDeviceService.EVENT_AUDIO_INPUT_SETTINGS_CHANGE, (deviceSetting) => {
            this.ngZone.run(() => {
                let handler = this.getHandler();
                if (handler) {
                    handler.cleanAudioInstances();
                }
                this.destroyAudioStream();
                this.setGain(deviceSetting?.gain || BrowserMediaDeviceService.DEFAULT_GAIN, false);
            });
        });
        this.browserMediaDeviceService.initialize().then(() => {
            let handler = this.getHandler();
            if (handler) {
                handler.initialize();
            }
        });
    }

    isInitialized(): boolean {
        return false;
    }

    getType(): string {
        return this.type;
    }

    getFormat(fileTransferMode?: string): string | undefined {
        return this.getHandler()?.getFormat(fileTransferMode);
    }

    isDebugEncoder(): boolean {
        return false;
    }

    getConstraints(): MediaStreamConstraints {
        return this.handler.getConstraints();
    }

    startRecording(micRecordingOptions: MicrophoneRecordingOptions): Promise<any> {
        this.recording = true;
        this.startTimeOut();

        return this.ngZone.runOutsideAngular(() => {
            return this.getAudioStream()
                .then((stream: MediaStream) => {
                    return this.startUserMediaRecording(stream, micRecordingOptions);
                });
        });
    }

    private getAudioStream(): Promise<MediaStream> {
        if (getStreamRecycleRequired() && this.audioStream && this.audioStream.active) {
            let audioStreamTracks = this.browserMediaDeviceService.getAudioTracks(this.audioStream);
            let streamActive = audioStreamTracks.some((track) => {
                return track.readyState !== "ended";
            });
            if (streamActive) {
                return Promise.resolve(this.audioStream);
            }
        }

        this.currentConstraints = this.browserMediaDeviceService.getDeviceConstraints(this.getConstraints());
        this.logger.log("browserMediaConstraints", this.currentConstraints);
        return getUserMedia(this.currentConstraints).then((stream) => {
            this.destroyAudioStream();
            this.audioStream = stream;
            return this.audioStream;
        });
    }

    setMuted(muted: boolean): void {
        this.audioStream?.getAudioTracks()?.map(track => track.enabled = !muted);
    }

    private startTimeOut(): void {
        let handler = this.getHandler();
        if (!handler) {
            return;
        }

        handler.getMicrophoneReady$()
            .pipe(
                mergeMap(() => {
                    let timeoutMs = handler.getMaxSeconds() * 1000;
                    return timer(timeoutMs)
                        .pipe(takeUntil(handler.getStopRecording$()));
                }),
                takeUntil(handler.getStopRecording$())
            )
            .subscribe(() => {
                if (this.recording) {
                    this.stopRecording("micTimeout");
                }
            });
    }

    getObservable(eventName: string) {
        return this.emitter.getObservable(eventName);
    }

    private async startUserMediaRecording(stream: MediaStream, micRecordingOptions: MicrophoneRecordingOptions) {
        let handler = this.getHandler();
        if (!handler) {
            throw "No valid handler detected";
        }

        try {
            this.logger.log("startRecording - current gain", this.targetGain);
            return await handler.startRecording(stream, this.targetGain, micRecordingOptions);
        } catch (e) {
            this.recording = false;
            throw e;
        }
    }

    stopRecording(from?: string): void {
        this.logger.log(`stopRecording from ${from}`);
        this.recording = false;

        const ENCODING_DELAY = this.getHandler()?.isNativeEncoder() ? 600 : 1200;
        timer(ENCODING_DELAY).subscribe(() => {
            let handler = this.getHandler();
            if (handler) {
                handler.stopRecording(this.audioStream);
            }
        });
    }

    getHandler(): EncoderHandlerAbstract | undefined {
        return this.handler;
    }

    getAudioOutputStream(): MicrophoneAudioOutputStream {
        return this.handler.getAudioOutputStream();
    }

    async setHandler(solution?: string): Promise<string> {
        if (!solution || solution === SOLUTION_AUTO) {
            solution = this.detectHandler();
        }

        this.logger.log("setting native mic to " + solution);

        switch (solution) {
            case ENCODER_NONE:
                const {PassthruEncoder} = await import("./encoder/passthru-encoder");
                this.handler = new PassthruEncoder();
                return solution;
            case ENCODER_NATIVE_MEDIARECORDER:
                const {MediaEncoder} = await import("./encoder/media-encoder");
                this.handler = new MediaEncoder();
                return solution;
            case ENCODER_MP4:
                const {WorkerEncoder} = await import("./encoder/worker-encoder");
                this.handler = new WorkerEncoder();
                return solution;
            case ENCODER_WAV:
            default:
                this.logger.log("Fallback to WAV");
                const {WavEncoder} = await import("./encoder/wav-encoder");
                this.handler = new WavEncoder();
                return ENCODER_WAV;
        }
    }

    protected detectHandler(): string | undefined {
        let nativeEncoderFeature = SOLUTION_AUTO;
        if (nativeEncoderFeature && nativeEncoderFeature !== SOLUTION_AUTO) {
            this.logger.log(`http - feature knob encoder - ${nativeEncoderFeature}`);
            return nativeEncoderFeature;
        }

        let supportedFormat = getSupportedMediaRecorderFormat(false);
        if (supportedFormat) {
            this.logger.log("http - native mic MediaEncoder auto-detected: ", supportedFormat);
            return ENCODER_NATIVE_MEDIARECORDER;
        }

        this.logger.log("http - fallback to use WAV encoder");
        return ENCODER_WAV;
    }

    isRecording(): boolean {
        return this.recording;
    }

    isReadyToRecord(): boolean {
        let handler = this.getHandler();
        return handler ? handler.isReadyToRecord() : false;
    }

    subscribe(eventName: string, successFn: (data?) => void, errorFn?: (e?) => void): Subscription {
        return this.emitter.subscribe(eventName, successFn, errorFn);
    }

    publish(eventName: string, data?: any): void {
        this.emitter.publish(eventName, data);
    }

    isAutoAdjust(): boolean {
        return true;
    }

    setMaxSeconds(maxSeconds: number): void {
        let handler = this.getHandler();
        this.logger.log("setting mic timeout to", maxSeconds);
        handler.setMaxSeconds(maxSeconds);
    }

    async getAvailableMicrophoneSelections(refreshList: boolean = false): Promise<BrowserMediaDevice[]> {
        const stream = await getUserMedia({audio: true});
        if (refreshList) {
            this.browserMediaDeviceService.reset();
        }
        return this.browserMediaDeviceService.getAudioInputList();
    }

    getCurrentMicrophoneSelection(): BrowserMediaDevice | undefined {
        return this.browserMediaDeviceService.getCurrentAudioInput();
    }

    setCurrentMicrophoneSelection(device: BrowserMediaDevice): void {
        this.browserMediaDeviceService.setAudioInput(device, true);
    }

    getGain(): number {
        return Math.trunc(this.targetGain * 100);
    }

    setGain(value: number, publishUpdate: boolean = true): void {
        this.targetGain = value / 100;
        this.logger.log("gain - setting new gain", this.targetGain);
        if (publishUpdate) {
            this.browserMediaDeviceService.setCurrentMicrophoneGain(value);
        }
    }

    processAutoAdjustGain(gain: number): void {
        const autoAdjust = true;
        if (autoAdjust && gain > 0) {
            this.setGain(gain);
        }
    }

    private destroyAudioStream(): void {
        this.ngZone.run(() => {
            if (!this.audioStream) {
                return;
            }

            let audioStreamTracks = this.browserMediaDeviceService.getAudioTracks(this.audioStream);
            audioStreamTracks.forEach((track) => {
                track.stop();
                this.logger.log("stream track is destroyed.");
            });

            this.audioStream = undefined;
        });
    }

    private appendMicrophoneInfo(stats: object): object {
        let microphoneId = get(this.currentConstraints, "audio.deviceId.exact", "");
        if (!microphoneId) {
            return stats;
        }
        let microphone = this.browserMediaDeviceService.getDeviceById(microphoneId);
        if (!microphone) {
            return stats;
        }
        return assign({microphone: microphone.name}, stats);
    }

    appendAdditionalStats(rawStats: object): object {
        let stats = this.appendMicrophoneInfo(rawStats);
        let handler = this.getHandler();
        if (!handler) {
            return stats;
        }

        return handler.appendAdditionalStats(stats);
    }

    destroy(): void {
        let handler = this.getHandler();
        if (handler) {
            handler.cleanAudioInstances();
        }
        this.emitter.destroy();
        this.destroyAudioStream();

        this.logger.log("AudioStream deconstructor invoked");
    }

    getRecordingHeartbeat(): number {
        let handler = this.getHandler();
        if (!handler) {
            return 0;
        }

        return handler.getRecordingHeartbeat();
    }

    getRecordingDataArrayHeartbeat(): number[] {
        let handler = this.getHandler();
        if (!handler) {
            return [];
        }

        return handler.getRecordingDataArrayHeartbeat();
    }

    getMicrophoneReadyObservable(): Observable<boolean> {
        let handler = this.getHandler();
        if (!handler) {
            return of(false);
        }

        return handler.getMicrophoneReady$();
    }

}
