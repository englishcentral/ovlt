import { ANIMATION_FRAME_INTERVAL, EncoderHandlerAbstract } from "./encoder-handler-abstract";
import { MicrophoneRecordingOptions } from "../microphone-handler";
import { interval, Observable, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { RecordingMediaBlob } from "../../../../model/types/speech/encoder";

const SAMPLE_RATE = 16000;

export class FlacEncoder extends EncoderHandlerAbstract {
    static readonly BUFFER_SIZE: number = 1024;

    protected encodedChunks: ArrayBuffer[] = [];
    protected sampleRate: number;

    private encoder?: any;
    private encodedBuffer$?: Subject<Uint8Array>;
    private currentPromise?: Promise<any>;
    protected format = "flac";

    constructor() {
        super();
    }

    getCodec(): string {
        return "flac";
    }

    getMimeType(): string {
        return "audio/flac";
    }

    async startRecording(stream: MediaStream,
                         targetGain: number,
                         micRecordingOptions: MicrophoneRecordingOptions): Promise<RecordingMediaBlob> {
        if (!this.createAudioContext(stream, FlacEncoder.BUFFER_SIZE)) {
            return Promise.reject("empty audio context");
        }

        this.audioRecorder = await this.generateScriptProcessor(
            this.audioContext,
            FlacEncoder.BUFFER_SIZE
        );

        this.encodedBuffer$ = new Subject<Uint8Array>();
        this.encodedBuffer$.subscribe((originalEncodedChunk) => {
            let encodedChunk = new Uint8Array(originalEncodedChunk);
            this.encodedChunks.push(encodedChunk.buffer);

            let blob: Blob = new Blob(
                [encodedChunk],
                {type: this.getMimeType()}
            );

            let recodingMediaBlob = {
                format: this.getFormat(),
                codec: this.getCodec(),
                sampleRate: this.sampleRate,
                channels: FlacEncoder.CHANNELS,
                blob: blob,
                streamable: true
            };

            this.microphoneAudioOutputStream.emitChunk(recodingMediaBlob);
        });

        let chunks = [];
        let chunkLength = 0;

        this.buffer$
            .subscribe((buffer: Float32Array) => {
                if (!buffer) {
                    return;
                }
                chunks.push(buffer);
                chunkLength += buffer.length;

                if (chunkLength * 4 < FlacEncoder.BUFFER_SIZE) {
                    return;
                }

                this.emitChunk(chunks, chunkLength);
                chunks = [];
                chunkLength = 0;
            });

        this.sampleRate = this.audioContext.sampleRate;
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

        this.audioRecorder.connect(this.audioContext.destination);
        this.microphoneReady$.next(true);

        return new Promise((resolve, reject) => {
            this.stopRecording$
                .pipe(
                    takeUntil(this.microphoneAudioOutputStream.getFileObservable()),
                    takeUntil(this.getObservable(FlacEncoder.EVENT_ON_ERROR))
                )
                .subscribe(() => {
                    if (!this.encodedChunks.length) {
                        return reject("flac-encoder :: no data received");
                    }

                    let blob: Blob = new Blob(
                        this.encodedChunks,
                        {type: this.getMimeType()}
                    );
                    let recodingMediaBlob = {
                        format: this.getFormat(),
                        codec: this.getCodec(),
                        sampleRate: this.sampleRate,
                        channels: FlacEncoder.CHANNELS,
                        blob: blob,
                        streamable: false
                    };

                    this.microphoneAudioOutputStream.emitFile(recodingMediaBlob);
                    this.cleanup();

                    // uncomment me to debug on Edge Chakra engine
                    // downloadBlob(blob);

                    resolve(recodingMediaBlob);
                });

        });
    }

    private concatBuffer(chunks: Float32Array[], bufferLength: number): Float32Array {
        let pcmBuffer: Float32Array = new Float32Array(bufferLength);
        let offset: number = 0;
        chunks.forEach(chunk => {
            pcmBuffer.set(chunk, offset);
            offset += chunk.length;
        });

        return pcmBuffer;
    }

    private async loadEncoder(): Promise<any> {
        if (this.encoder) {
            await this.encoder.ready;
            return this.encoder;
        }

        if (this.currentPromise) {
            return this.currentPromise;
        }

        this.currentPromise = new Promise((resolve, reject) => {
            require.ensure([], async () => {
                try {
                    require("file-loader?name=[name].[ext]!./stream-encoder/flac/flac-stream-encoder.wasm");
                    const {FlacStreamEncoder} = require("./stream-encoder/flac/flac-stream-encoder.js");

                    this.encoder = new FlacStreamEncoder({
                        blockSize: FlacEncoder.BUFFER_SIZE,
                        sampleRate: this.sampleRate,
                        onEncode: (encodedChunk) => {
                            this.encodedBuffer$.next(encodedChunk);
                        }
                    });

                    await this.encoder.ready;
                    resolve(this.encoder);
                } catch (e) {
                    this.cleanup();
                    return reject(e);
                }
            });
        });

        return this.currentPromise;
    }

    private async encodeFlac(chunks: Float32Array[], bufferLength: number): Promise<void> {
        let mergedBuffer = this.concatBuffer(chunks, bufferLength);
        let encoder = await this.loadEncoder();
        encoder.encodeF32(mergedBuffer);
    }

    private emitChunk(buffer: Float32Array[],
                      bufferLength: number): Observable<void> {
        if (!buffer || bufferLength === 0) {
            return;
        }

        this.encodeFlac(buffer, bufferLength);
    }

    getSampleRate(): number {
        return SAMPLE_RATE;
    }

    private cleanup(): void {
        if (this.encoder) {
            this.encoder.free();
            this.encoder = undefined;
        }
        if (this.encodedBuffer$) {
            this.encodedBuffer$.complete();
            this.encodedBuffer$ = undefined;
        }
        if (this.currentPromise) {
            this.currentPromise = undefined;
        }
        this.encodedChunks = [];
        this.microphoneAudioOutputStream.completeAudioObservables();
    }
}
