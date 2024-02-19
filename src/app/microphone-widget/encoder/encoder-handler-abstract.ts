import { Observable, ReplaySubject, Subject, Subscription } from "rxjs";
import { NgZone } from "@angular/core";
import { MicrophoneAudioOutputStream } from "../microphone-audio-output-stream";
import { MicrophoneRecordingOptions } from "../microphone-handler";
import { RecordingMediaBlob } from "../../../types/encoder";
import { mean } from "lodash-es";
import { Emitter } from "../../common/emitter";
import { Logger } from "../../common/logger";
import { Browser } from "../../common/browser";
import { getStreamRecycleRequired } from "../../common/browser-navigator";

export const ANIMATION_FRAME_INTERVAL = 100;

export class EncoderHandlerAbstract {
    static EVENT_ON_PREPARE: string = "prepareComplete";
    static EVENT_ON_INIT: string = "initComplete";
    static EVENT_ON_RECORDING_COMPLETE: string = "flushComplete";
    static EVENT_ON_DISPOSE_COMPLETE: string = "disposeComplete";
    static EVENT_ON_ERROR: string = "onError";

    static readonly BUFFER_SIZE: number = 4096;
    static readonly DEFAULT_GAIN: number = 0.75;
    static readonly CHANNELS: number = 1;
    static readonly OUTPUT_BITRATE: number = 32000;

    protected maxSeconds: number = 60;

    protected emitter: Emitter = new Emitter(false, Emitter.TYPE_REPLAY, Infinity);
    protected logger = new Logger();

    protected format: string;
    protected audioContext?: AudioContext;
    protected audioRecorder?: ScriptProcessorNode;
    protected audioVolume?: GainNode;
    protected audioSource?: MediaStreamAudioSourceNode;
    protected audioAnalyser?: AnalyserNode;
    protected recordingHeartbeat: number;
    protected recordingDataArrayHeartbeat: number[];
    protected zone: NgZone = new NgZone({enableLongStackTrace: false});
    protected microphoneAudioOutputStream = new MicrophoneAudioOutputStream();
    protected buffer$?: ReplaySubject<Float32Array>;
    protected stopRecording$ = new Subject<boolean>();
    protected microphoneReady$ = new Subject<boolean>();

    constructor() {
    }

    initialize(): void {
    }

    isNativeEncoder(): boolean {
        return false;
    }

    getFormat(fileTransferMode?: string): string {
        return this.format;
    }

    subscribe(eventName: string, successFn: (data?) => void, errorFn?: (e?) => void): Subscription {
        return this.emitter.subscribe(eventName, successFn, errorFn);
    }

    publish(eventName: string, data?: any): void {
        this.emitter.publish(eventName, data);
    }

    destroy(): void {
        this.emitter.destroy();
    }

    startRecording(stream: MediaStream, targetGain: number, micRecordingOptions: MicrophoneRecordingOptions): Promise<RecordingMediaBlob | undefined> {
        return Promise.resolve(new RecordingMediaBlob());
    }

    stopRecording(stream?: MediaStream): void {
        this.stopRecording$.next(true);
        if (this.buffer$) {
            this.buffer$.complete();
            this.buffer$ = undefined;
        }
        this.cleanAudioInstances(stream);
        this.resetHeartBeat();
    }

    getStopRecording$(): Observable<boolean> {
        return this.stopRecording$.asObservable();
    }

    getAudioOutputStream(): MicrophoneAudioOutputStream {
        return this.microphoneAudioOutputStream;
    }

    getMaxSeconds(): number {
        return this.maxSeconds;
    }

    getSampleRate(): number {
        const SAMPLE_RATE = 44100;
        return SAMPLE_RATE;
    }

    getConstraints(): MediaStreamConstraints {
        return {
            audio: {
                echoCancellation: false,
                noiseSuppression: true,
                autoGainControl: false
            },
            video: false
        };
    }

    setMaxSeconds(maxSeconds: number): void {
        if (maxSeconds > 0) {
            this.maxSeconds = maxSeconds;
        }
    }

    isReadyToRecord(): boolean {
        return true;
    }

    cleanAudioInstances(stream?: MediaStream): void {
        if (!getStreamRecycleRequired() && stream) {
            let mediaStream;
            if (stream.getAudioTracks) {
                mediaStream = stream.getAudioTracks();
            } else if (stream.getTracks) {
                mediaStream = stream.getTracks();
            }

            mediaStream.forEach((track) => {
                track.stop();
                this.logger.log("stream track is destroyed.");
            });
        }

        if (this.audioRecorder) {
            this.audioRecorder.disconnect();
            this.audioRecorder = undefined;
        }

        if (this.audioAnalyser) {
            this.audioAnalyser.disconnect();
            this.audioAnalyser = undefined;
        }

        if (this.audioVolume) {
            this.audioVolume.disconnect();
            this.audioVolume = undefined;
        }

        if (this.audioSource) {
            this.audioSource.disconnect();
            this.audioSource = undefined;
        }

        if (this.audioContext) {
            if (typeof this.audioContext.close === "function") {
                this.audioContext.close();
            }
            this.audioContext = undefined;
        }
    }

    protected createAudioContext(stream, bufferSize: number = EncoderHandlerAbstract.BUFFER_SIZE): AudioContext | undefined {
        this.buffer$ = new ReplaySubject();

        if (this.audioContext) {
            return this.audioContext;
        }

        this.audioContext = new ((<any>window).AudioContext || (<any>window).webkitAudioContext)();
        if (!this.audioContext) {
            return undefined;
        }
        this.audioSource = this.audioContext.createMediaStreamSource(stream);

        //http://www.smartjava.org/content/exploring-html5-web-audio-visualizing-sound
        this.audioAnalyser = this.audioContext.createAnalyser();
        this.audioAnalyser.smoothingTimeConstant = 0;
        this.audioAnalyser.fftSize = bufferSize;
        this.audioSource.connect(this.audioAnalyser);

        return this.audioContext;
    }

    protected createAudioVolume(targetGain: number): GainNode | undefined {
        if (!this.audioSource || !this.audioContext) {
            this.logger.log("gain - no audioSourceNode detected");
            return undefined;
        }

        this.audioVolume = this.audioContext.createGain();
        this.audioVolume.gain.value = targetGain;
        this.audioSource.connect(this.audioVolume);
        this.logger.log("gain - audioSourceNode volume set to", this.audioVolume?.gain?.value );

        return this.audioVolume;
    }

    protected setRecordingHeartBeat(array: Uint8Array): void {
        this.recordingHeartbeat = mean(array);
    }

    protected setRecordingDataArrayHeartbeat(array: Uint8Array): void {
        this.zone.run(() => {
            this.recordingDataArrayHeartbeat = Array.from(array);
        });
    }

    protected sendHeartBeat(): void {
        if (!this.audioAnalyser) {
            return;
        }

        let frequencyBinCount = new Uint8Array(this.audioAnalyser.frequencyBinCount);
        if (this.audioAnalyser) {
            this.audioAnalyser.getByteFrequencyData(frequencyBinCount);
            this.setRecordingHeartBeat(frequencyBinCount);
            this.setRecordingDataArrayHeartbeat(frequencyBinCount);
        }
    }

    // @FIXME: wait for official ES2017 typings for AudioWorklet
    protected generateAudioWorklet(context: AudioContext,
                                   bufferSize: number): Promise<any> {

        if (!context || context.state == "closed") {
            throw "Audio Context closed";
        }

        return this.zone.runOutsideAngular(() => {
            let workletFileName = "audio-worklet/port-worklet-processor.js";

            return (<any>context).audioWorklet.addModule(workletFileName).then(() => {
                if (!context || (<any>context).state == "closed") {
                    throw "Audio Context closed";
                }

                let node = new (<any>window).AudioWorkletNode(context, "port-processor");
                node.port.onmessage = (event) => {
                    if (!this.buffer$ || !event?.data?.inputBuffer) {
                        return;
                    }

                    this.buffer$.next(event.data.inputBuffer);
                };

                return node;
            }, (e) => this.logger.error(e));
        });

    }

    protected checkMicReady(buffer: Float32Array | Uint8Array): void {
        if (!buffer.some((value) => value != 0)) {
            // don't do anything for empty audio buffers
            return;
        }

        this.microphoneReady$.next(true);
    }

    protected resetHeartBeat(): void {
        this.setRecordingHeartBeat(new Uint8Array([0]));
        this.setRecordingDataArrayHeartbeat(new Uint8Array([0]));
    }

    protected generateScriptProcessor(context: AudioContext,
                                      bufferSize: number,
                                      useAudioWorklet: boolean = true): Promise<any> {
        this.resetHeartBeat();

        if (useAudioWorklet && Browser.isAudioWorkletEnabled()) {
            this.logger.log("SCRIPT PROCESSOR: AudioWorklet");
            return this.generateAudioWorklet(context, bufferSize);
        }

        let audioRecorder;
        if (!context.createScriptProcessor) {
            this.logger.log("SCRIPT PROCESSOR: JavaScriptNode");
            audioRecorder = (<any>context).createJavaScriptNode(bufferSize, 1, 1);
        } else {
            this.logger.log("SCRIPT PROCESSOR: ScriptProcessor");
            audioRecorder = context.createScriptProcessor(bufferSize, 1, 1);
        }

        this.zone.runOutsideAngular(() => {
            audioRecorder.onaudioprocess = (buffer) => {
                if (!this.buffer$ || !buffer?.inputBuffer) {
                    return;
                }
                //TODO: merge left and right channels?
                let audioBuffer = new Float32Array(buffer.inputBuffer.getChannelData(0));
                this.buffer$.next(audioBuffer);
            };
        });
        return Promise.resolve(audioRecorder);
    }

    getObservable(eventName: string) {
        return this.emitter.getObservable(eventName);
    }

    appendAdditionalStats(stats: object): object {
        return stats;
    }

    getRecordingHeartbeat(): number {
        return this.recordingHeartbeat;
    }

    getRecordingDataArrayHeartbeat(): number[] {
        return this.recordingDataArrayHeartbeat;
    }

    getMicrophoneReady$(): Observable<boolean> {
        return this.microphoneReady$.asObservable();
    }
}
