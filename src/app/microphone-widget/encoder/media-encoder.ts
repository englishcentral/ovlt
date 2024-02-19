import { ANIMATION_FRAME_INTERVAL, EncoderHandlerAbstract } from "./encoder-handler-abstract";
import { Instrumentation } from "../../../../core/instrumentation/instrumentation";
import { generateAudioMimeType, getSupportedMediaRecorderFormat } from "../../../../core/browser-navigator";
import { first, takeUntil } from "rxjs/operators";
import { MicrophoneRecordingOptions } from "../microphone-handler";
import { interval } from "rxjs";
import {
    ENCODER_NATIVE_MEDIARECORDER,
    INPUT_TYPE_STREAM,
    RecordingMediaBlob
} from "../../../../model/types/speech/encoder";
import { extractErrorString } from "../../../../core/instrumentation/instrumentation-utility";

declare let window: any;
const AUDIO_FRAME_SIZE = 240;

/**
 * @see https://developers.google.com/web/updates/2016/01/mediarecorder
 */
export class MediaEncoder extends EncoderHandlerAbstract {
    static readonly OUTPUT_BITRATE: number = 44100;

    protected currentPromise: Promise<RecordingMediaBlob>;

    constructor() {
        super();
    }

    isNativeEncoder(): boolean {
        return true;
    }

    getFormat(fileTransferMode?: string): string {
        const isStreaming = fileTransferMode == INPUT_TYPE_STREAM;
        const mediaRecorderFormat = getSupportedMediaRecorderFormat(isStreaming);
        return mediaRecorderFormat.container;
    }

    async startRecording(stream: MediaStream, targetGain: number, micRecordingOptions: MicrophoneRecordingOptions): Promise<RecordingMediaBlob> {
        if (this.currentPromise) {
            return this.currentPromise;
        }

        this.createVolumeNode(stream, 0);

        const isStreaming = micRecordingOptions.fileTransferMode == INPUT_TYPE_STREAM;
        const mediaRecorderFormat = getSupportedMediaRecorderFormat(isStreaming);
        const mimeType = generateAudioMimeType(mediaRecorderFormat.container, mediaRecorderFormat.codec);
        const options = {
            mimeType: mimeType
        };

        this.logger.log("%cMediaEncoder inputType", "color:#939", micRecordingOptions);
        this.logger.log("%cMediaEncoder stream", "color:#939", stream, options);

        let mediaRecorder = new (<any>window).MediaRecorder(stream, options);

        this.stopRecording$
            .pipe(first())
            .subscribe(() => {
                if (mediaRecorder && mediaRecorder.state == "recording") {
                    mediaRecorder.stop();
                }
            });

        this.currentPromise = new Promise((resolve, reject) => {
            mediaRecorder.onerror = (error: ErrorEvent) => {
                this.logger.log("%cmediaRecorder.onerror", "color:#939;font-weight:bold", error);
                Instrumentation.sendEvent("microphone", {
                    response: "clientError",
                    responseStatus: 0,
                    encoder: ENCODER_NATIVE_MEDIARECORDER,
                    errorMessage: extractErrorString(error),
                    ...(micRecordingOptions?.trackingContext ?? {})
                });

                this.microphoneAudioOutputStream.completeAudioObservables();
                reject(error);
            };

            let streamChunks: Float32Array[] = [];
            mediaRecorder.ondataavailable = (messageEvent: MessageEvent) => {
                if (!messageEvent) {
                    return;
                }

                let blob: Blob = new Blob(
                    [messageEvent.data],
                    {type: mimeType}
                );

                let recordingMediaBlob = {
                    format: mediaRecorderFormat.container,
                    codec: mediaRecorderFormat.codec,
                    sampleRate: MediaEncoder.OUTPUT_BITRATE,
                    channels: MediaEncoder.CHANNELS,
                    blob: blob,
                    streamable: isStreaming
                };
                streamChunks.push(messageEvent.data);
                this.microphoneAudioOutputStream.emitChunk(recordingMediaBlob);
            };

            mediaRecorder.onstop = () => {
                const finalBlob = {
                    format: mediaRecorderFormat.container,
                    codec: mediaRecorderFormat.codec,
                    sampleRate: MediaEncoder.OUTPUT_BITRATE,
                    channels: MediaEncoder.CHANNELS,
                    blob: new Blob(
                        streamChunks,
                        {type: mimeType}
                    ),
                    streamable: false
                };
                this.microphoneAudioOutputStream.emitFile(finalBlob);
                this.microphoneAudioOutputStream.completeAudioObservables();
                this.currentPromise = undefined;
                streamChunks = [];
                resolve(finalBlob);
            };



            interval(ANIMATION_FRAME_INTERVAL).pipe(
                takeUntil(this.stopRecording$)
            ).subscribe(() => {
                this.sendHeartBeat();
            });

            mediaRecorder.start(isStreaming ? AUDIO_FRAME_SIZE : undefined);
            this.microphoneReady$.next(true);
        });

        return this.currentPromise;
    }

    private createVolumeNode(stream: MediaStream, targetGain: number): void {
        this.createAudioContext(stream);
        this.createAudioVolume(targetGain).connect(this.audioContext.destination);
    }

    stopRecording(stream?: MediaStream): void {
        super.stopRecording(stream);
    }
}
