import { ANIMATION_FRAME_INTERVAL, EncoderHandlerAbstract } from "./encoder-handler-abstract";
import { Instrumentation } from "../../../../core/instrumentation/instrumentation";
import { first, takeUntil } from "rxjs/operators";
import { MicrophoneRecordingOptions } from "../microphone-handler";
import { interval } from "rxjs";
import { ENCODER_NONE, INPUT_TYPE_STREAM, RecordingMediaBlob } from "../../../../model/types/speech/encoder";
import { extractErrorString } from "../../../../core/instrumentation/instrumentation-utility";

declare let window: any;

/**
 * @see http://typedarray.org/from-microphone-to-wav-with-getusermedia-and-web-audio/
 * @see https://github.com/MicrosoftEdge/Demos/tree/master/microphone
 */
export class PassthruEncoder extends EncoderHandlerAbstract {

    static readonly BUFFER_SIZE: number = 4096;

    protected pcmChunks: Float32Array[] = [];
    protected recordingLength: number;
    protected sampleRate: number;

    protected currentPromise: Promise<any>;
    protected format = "pcm";

    constructor() {
        super();
    }

    getCodec(): string {
        return "pcm_f32le";
    }

    getMimeType(): string | undefined {
        return "octet/stream";
    }

    initialize(): void {
    }

    async startRecording(stream: MediaStream,
                         targetGain: number = EncoderHandlerAbstract.DEFAULT_GAIN,
                         micRecordingOptions: MicrophoneRecordingOptions = new MicrophoneRecordingOptions()): Promise<RecordingMediaBlob> {
        if (!this.createAudioContext(stream)) {
            return Promise.reject("empty audio context");
        }

        this.audioRecorder = await this.generateScriptProcessor(this.audioContext, PassthruEncoder.BUFFER_SIZE);
        this.buffer$.pipe(
            takeUntil(this.getObservable(PassthruEncoder.EVENT_ON_RECORDING_COMPLETE)),
            takeUntil(this.getObservable(PassthruEncoder.EVENT_ON_ERROR))
        ).subscribe((buffer: Float32Array) => {
            if (!buffer) {
                return;
            }
            this.pcmChunks.push(buffer);
            this.recordingLength += buffer.length;
        });
        this.pcmChunks = [];
        this.recordingLength = 0;
        this.sampleRate = this.audioContext.sampleRate;
        this.logger.log("sampleRate", this.sampleRate);

        let audioVolume = this.createAudioVolume(targetGain);
        if (audioVolume) {
            audioVolume.connect(this.audioRecorder);
        } else {
            this.audioSource.connect(this.audioRecorder);
        }

        interval(ANIMATION_FRAME_INTERVAL).pipe(
            takeUntil(this.stopRecording$)
        ).subscribe(() => {
            this.sendHeartBeat();
        });

        this.currentPromise = new Promise((resolve, reject) => {
            this.getObservable(PassthruEncoder.EVENT_ON_RECORDING_COMPLETE).pipe(
                first(),
                takeUntil(this.getObservable(PassthruEncoder.EVENT_ON_ERROR))
            ).subscribe((data) => {
                if (data) {
                    let recordingMediaBlob = this.generateRecordingMediaBlob(data, false);
                    if (micRecordingOptions.fileTransferMode != INPUT_TYPE_STREAM) {
                        this.microphoneAudioOutputStream.emitFile(recordingMediaBlob);
                    }

                    this.microphoneAudioOutputStream.completeAudioObservables();
                    return resolve(recordingMediaBlob);
                }

                this.microphoneAudioOutputStream.completeAudioObservables();
                reject("passthru-encoder.service.ts :: no data received");
            });

            if (micRecordingOptions.fileTransferMode == INPUT_TYPE_STREAM) {
                this.buffer$
                    .pipe(
                        takeUntil(this.getObservable(PassthruEncoder.EVENT_ON_RECORDING_COMPLETE))
                    )
                    .subscribe((data: Float32Array) => {
                        this.microphoneAudioOutputStream.emitChunk(this.generateRecordingMediaBlob([data], true));
                    });
            }

            this.subscribe(PassthruEncoder.EVENT_ON_ERROR, (e) => {
                Instrumentation.sendEvent("microphone", {
                    response: "clientError",
                    responseStatus: 0,
                    encoder: ENCODER_NONE,
                    errorMessage: extractErrorString(e)
                });

                this.microphoneAudioOutputStream.completeAudioObservables();
                reject(e);
            });
        });

        this.audioRecorder.connect(this.audioContext.destination);
        this.microphoneReady$.next(true);
        return this.currentPromise;
    }

    private generateRecordingMediaBlob(data: Float32Array[], streamable: boolean): RecordingMediaBlob {
        let blob: Blob = new Blob(
            data,
            {type: this.getMimeType()}
        );

        return {
            format: this.getFormat(),
            codec: this.getCodec(),
            sampleRate: this.sampleRate,
            channels: PassthruEncoder.CHANNELS,
            blob: blob,
            streamable: streamable
        };
    }

    stopRecording(stream?: MediaStream): void {
        super.stopRecording(stream);
        if (!this.pcmChunks) {
            return;
        }
        //this.logger.log("passthruEncoder this.pcmChunks", this.pcmChunks);

        //merge the recorded chunks into a single array of pcm data
        let pcmBuffer: Float32Array = new Float32Array(this.recordingLength);
        let offset: number = 0;
        let l: number = this.pcmChunks.length;
        for (let i: number = 0; i < l; i++) {
            let chunk: Float32Array = this.pcmChunks[i];
            pcmBuffer.set(chunk, offset);
            offset += chunk.length;
        }
        this.pcmChunks = [];
        this.recordingLength = 0;

        this.publish(PassthruEncoder.EVENT_ON_RECORDING_COMPLETE, [pcmBuffer]);
    }

}
