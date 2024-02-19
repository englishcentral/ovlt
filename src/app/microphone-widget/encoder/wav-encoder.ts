import { ANIMATION_FRAME_INTERVAL, EncoderHandlerAbstract } from "./encoder-handler-abstract";
import { finalize, takeUntil } from "rxjs/operators";
import { interval } from "rxjs";
import { MicrophoneRecordingOptions } from "../microphone-handler";
import { ENCODER_WAV, RecordingMediaBlob } from "../../../types/encoder";
import { Browser } from "../../common/browser";

const WAV_HEADER_LENGTH = 44;

export class WavEncoder extends EncoderHandlerAbstract {

    private encoderWorker?: Worker;

    protected encodedChunks: ArrayBuffer[] = [];
    protected sampleRate: number;

    protected format = "wav";

    constructor() {
        super();
    }

    getCodec(): string {
        return "pcm_f32le";
    }

    getMimeType(): string | undefined {
        return "audio/wav";
    }

    initialize(): void {
    }

    async startRecording(stream: MediaStream,
                         targetGain: number,
                         micRecordingOptions: MicrophoneRecordingOptions): Promise<RecordingMediaBlob | undefined> {
        if (!this.createAudioContext(stream)) {
            return Promise.reject("empty audio context");
        }

        this.audioRecorder = await this.generateScriptProcessor(
            this.audioContext,
            WavEncoder.BUFFER_SIZE,
            true
        );

        let isFirstChunk = true;

        this.encodedChunks = [];

        let chunks = [];
        let chunkLength = 0;

        let currentPromise: Promise<RecordingMediaBlob | undefined> = new Promise((resolve, reject) => {
            this.buffer$
                .pipe(
                    takeUntil(this.getObservable(WavEncoder.EVENT_ON_ERROR)),
                    takeUntil(this.microphoneAudioOutputStream.getFileObservable()),
                    takeUntil(this.stopRecording$),
                    finalize(() => {
                        this.emitChunk(chunks, chunkLength, isFirstChunk, micRecordingOptions);
                        let fileBuffer = this.concatArrayBuffer(this.encodedChunks);

                        if (!fileBuffer.byteLength || fileBuffer.byteLength == WAV_HEADER_LENGTH) {
                            return resolve(undefined);
                        }

                        this.logger.log("wav file size", fileBuffer.byteLength);
                        let dataView = new DataView(fileBuffer);
                        dataView.setUint32(4, fileBuffer.byteLength, true);
                        dataView.setUint32(40, fileBuffer.byteLength - WAV_HEADER_LENGTH, true);

                        let blob: Blob = new Blob(
                            [dataView],
                            {type: this.getMimeType()}
                        );
                        let recodingMediaBlob = {
                            format: this.getFormat(),
                            codec: this.getCodec(),
                            sampleRate: this.sampleRate,
                            channels: WavEncoder.CHANNELS,
                            blob: blob,
                            streamable: false
                        };

                        this.microphoneAudioOutputStream.emitFile(recodingMediaBlob);
                        this.cleanup();

                        // uncomment me to debug on Edge Chakra engine
                        // downloadBlob(blob);

                        resolve(recodingMediaBlob);
                    })
                )
                .subscribe((buffer: Float32Array) => {
                    if (!buffer) {
                        return;
                    }
                    chunks.push(buffer);
                    chunkLength += buffer.length;

                    if (chunkLength < WavEncoder.BUFFER_SIZE) {
                        return;
                    }
                    this.emitChunk(chunks, chunkLength, isFirstChunk, micRecordingOptions);

                    isFirstChunk = false;
                    chunks = [];
                    chunkLength = 0;
                });

            this.getObservable(WavEncoder.EVENT_ON_ERROR)
                .pipe(
                    takeUntil(this.stopRecording$)
                )
                .subscribe((e) => {
                    this.cleanup();
                    reject(e);
                });
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

        return currentPromise;
    }

    private getWavPromise(chunks: Float32Array[], recordingLength: number, isFirstChunk: boolean, micRecordingOptions: MicrophoneRecordingOptions): Promise<DataView> {
        return Browser.isWorkerEnabled()
            ? this.encodeWavHandler(chunks, recordingLength, isFirstChunk)
            : this.encodeToWav(chunks, recordingLength, isFirstChunk);
    }

    private emitChunk(buffer: Float32Array[],
                      bufferLength: number,
                      isFirstChunk: boolean,
                      micRecordingOptions: MicrophoneRecordingOptions): void {
        if (!buffer || bufferLength === 0) {
            return;
        }

        this.getWavPromise(buffer, bufferLength, isFirstChunk, micRecordingOptions)
            .then((encodedChunk) => {
                this.encodedChunks.push(encodedChunk.buffer);
                let blob: Blob = new Blob(
                    [encodedChunk],
                    {type: this.getMimeType()}
                );
                let recodingMediaBlob = {
                    format: this.getFormat(),
                    codec: this.getCodec(),
                    sampleRate: this.sampleRate,
                    channels: WavEncoder.CHANNELS,
                    blob: blob,
                    streamable: true
                };

                this.microphoneAudioOutputStream.emitChunk(recodingMediaBlob);
            }, (error) => {
                this.cleanup();
                this.logger.log(error);
            });
    }

    private encodeWavHandler(chunks: Float32Array[], bufferLength: number, firstChunk: boolean = true): Promise<DataView> {
        return this.encodeWavWorker(chunks, bufferLength, firstChunk)
            .catch((e) => {
                this.logger.log("Error while encoding with worker, switching to main thread", e);
                Browser.setWorkerEnabledFlag(false);
                return this.encodeToWav(chunks, bufferLength, firstChunk);
            });
    }

    private concatArrayBuffer(buffers: ArrayBuffer[]): ArrayBuffer {
        let length = 0;
        buffers.forEach(buffer => length += buffer.byteLength);

        let uint8Buffer: Uint8Array = new Uint8Array(new ArrayBuffer(length));
        let offset: number = 0;
        buffers.forEach(dataView => {
            uint8Buffer.set(new Uint8Array(dataView), offset);
            offset += dataView.byteLength;
        });

        return uint8Buffer.buffer;
    }

    private encodeToWav(chunks: Float32Array[], bufferLength: number, firstChunk: boolean = true): Promise<DataView> {
        this.logger.log("WAV encoder - main thread");
        let pcmBuffer: Float32Array = this.concatBuffer(chunks, bufferLength);

        // create the wavBuffer and view to create the .WAV file
        let wavBuffer: ArrayBuffer = firstChunk ? new ArrayBuffer(WAV_HEADER_LENGTH + pcmBuffer.length * 2) : new ArrayBuffer(pcmBuffer.length * 2);
        let wavView: DataView = new DataView(wavBuffer);
        let index: number = firstChunk ? WAV_HEADER_LENGTH : 0;

        if (firstChunk) {
            // write the WAV container, check spec at: https://ccrma.stanford.edu/courses/422/projects/WaveFormat/
            this.writeUtfBytes(wavView, 0, "RIFF");
            wavView.setUint32(4, WAV_HEADER_LENGTH + pcmBuffer.length * 2, true);
            this.writeUtfBytes(wavView, 8, "WAVE");
            this.writeUtfBytes(wavView, 12, "fmt ");
            wavView.setUint32(16, 16, true);
            wavView.setUint16(20, 1, true);
            wavView.setUint16(22, 1, true);
            wavView.setUint32(24, this.sampleRate, true);
            wavView.setUint32(28, this.sampleRate * 4, true);
            wavView.setUint16(32, 4, true);
            wavView.setUint16(34, 16, true);
            this.writeUtfBytes(wavView, 36, "data");
            wavView.setUint32(40, pcmBuffer.length * 2, true);
        }

        // write the PCM samples converting from float32 to uint16
        let lng: number = pcmBuffer.length;
        for (let i: number = 0; i < lng; i++) {
            let s: number = Math.max(-1, Math.min(1, pcmBuffer[i]));
            wavView.setInt16(index, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
            //wavView.setInt16(index, pcmBuffer[i] * 0x7FFF, true);
            index += 2;
        }

        return Promise.resolve(wavView);
    }

    private generateWorker(): Worker {
        if (!this.encoderWorker) {
            this.logger.log("WAV encoder - web worker");
            let workerFileName = "worker/wav-encoder-worker.js";

            try {
                this.encoderWorker = new Worker(workerFileName);
            } catch (creatingWorkerError) {
                this.logger.log("web worker failed, trying to initialize from Blob");
                try {
                    let blob;
                    try {
                        blob = new Blob(["importScripts('" + workerFileName + "');"], {"type": "application/javascript"});
                    } catch (blobCreatingError) {
                        let blobBuilder = new ((<any>window).BlobBuilder || (<any>window).WebKitBlobBuilder || (<any>window).MozBlobBuilder)();
                        blobBuilder.append("importScripts('" + workerFileName + "');");
                        blob = blobBuilder.getBlob("application/javascript");
                    }
                    let url = (<any>window).URL || (<any>window).webkitURL;
                    let blobUrl = url.createObjectURL(blob);
                    this.encoderWorker = new Worker(blobUrl);
                } catch (blobWorkerError) {
                    this.logger.log("web worker fallback failed", blobWorkerError);
                    throw blobWorkerError;
                }
            }
        }
        return this.encoderWorker;
    }

    private encodeWavWorker(chunks: Float32Array[], bufferLength: number, firstChunk: boolean = true): Promise<DataView> {
        try {
            let worker = this.generateWorker();
            if (!worker) {
                return Promise.reject("no worker generated");
            }

            return new Promise<DataView>((resolve, reject) => {
                worker.onerror = (e) => {
                    this.logger.log("worker.onerror", e);
                    reject(e);
                };
                worker.onmessage = (message) => {
                    let bytes = new Uint8Array(message.data);
                    let wavView = new DataView(bytes.buffer);
                    resolve(wavView);
                };
                worker.postMessage({
                    chunks: chunks,
                    bufferLength: bufferLength,
                    firstChunk: firstChunk,
                    sampleRate: this.sampleRate
                });
            });
        } catch (e) {
            return Promise.reject(e);
        }
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

    private writeUtfBytes(view: DataView, offset: number, s: string): void {
        let l = s.length;
        for (let i: number = 0; i < l; i++) {
            view.setUint8(offset + i, s.charCodeAt(i));
        }
    }

    private cleanup(): void {
        this.encodedChunks = [];
        this.microphoneAudioOutputStream.completeAudioObservables();
        if (this.encoderWorker) {
            this.encoderWorker.terminate();
            this.encoderWorker = undefined;
        }
    }
}
