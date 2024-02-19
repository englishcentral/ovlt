import { ANIMATION_FRAME_INTERVAL, EncoderHandlerAbstract } from "./encoder-handler-abstract";
import { MicrophoneRecordingOptions } from "../microphone-handler";
import { interval } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { RecordingMediaBlob } from "../../../types/encoder";
import { assign } from "lodash-es";
import { StopWatch } from "../../common/stopwatch";
import { Browser } from "../../common/browser";

declare let window: any;
declare let PCM_VERSION: string;

export class WorkerEncoder extends EncoderHandlerAbstract {

    static PCM_CODEC: string = "pcm_f32le";
    static PCM_FORMAT: string = "f32le";
    static OUTPUT_SAMPLERATE: number = 16000;

    protected encoder?: Worker;
    protected ready: boolean = false;
    protected currentPromise: Promise<any>;
    protected workerFilePromise: Promise<string>;
    protected workerFileName?: string;
    protected binaryFileName?: string;
    protected readyStopWatch: StopWatch = new StopWatch();
    protected recorderStopWatch: StopWatch = new StopWatch();
    protected maxRecordingSeconds: number = 30;
    protected format = "mp4";

    constructor() {
        super();
    }

    getCodec(): string {
        return "aac";
    }

    getMimeType(): string {
        return "audio/mp4";
    }

    protected onMessage(message: any) {
        if (!message || !message.data || !message.data.cmd) {
            return;
        }

        this.publish(message.data.cmd, message.data);
    }

    protected onError(error: any) {
        this.logger.error("Worker onError :: ", error);
        this.publish(WorkerEncoder.EVENT_ON_ERROR, error);
    }

    protected sendWorkerMessage(message: object, params?: any) {
        if (!this.encoder) {
            this.logger.error("can't send message worker is undefined");
            return;
        }

        try {
            this.logger.log("sending worker command: ", message["cmd"] || "");
            this.encoder.postMessage(message, params);
        } catch (e) {
            this.logger.error("worker-encoder.service.ts :: send message error", e);
        }
    }

    protected disposeWorker(): Promise<any> {
        return new Promise<void>((resolve, reject) => {
            if (!this.encoder) {
                return reject("encoder no longer available");
            }

            let subscription = this.subscribe(WorkerEncoder.EVENT_ON_DISPOSE_COMPLETE, () => {
                this.logger.log("dispose complete");
                subscription.unsubscribe();
                resolve();
            });

            this.sendWorkerMessage({cmd: "dispose"});
        });
    }

    protected killWorker() {
        if (this.encoder) {
            try {
                this.disposeWorker().then(() => {
                    if (this.encoder) {
                        this.encoder.terminate();
                    }
                });
            } catch (e) {
                this.logger.error("worker-encoder.service.ts :: terminate error", e);
            }

            this.ready = false;
            this.encoder = undefined;
        }
    }

    initialize() {
        this.lazyLoadWorkerFile()
            .then((pcmWorkerFile) => {
                return this.generateWorker(pcmWorkerFile);
            });

        this.subscribe(WorkerEncoder.EVENT_ON_ERROR, (e) => {
            this.cleanAudioInstances();
            this.logger.error("worker-encoder.service.ts :: global error handler triggered", e);
            this.killWorker();
        });
    }

    protected createWorkerFallback(workerUrl: string): Worker {
        let blob;
        try {
            blob = new Blob(["importScripts('" + workerUrl + "');"], {"type": "application/javascript"});
        } catch (e) {
            let blobBuilder = new (window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder)();
            blobBuilder.append("importScripts('" + workerUrl + "');");
            blob = blobBuilder.getBlob("application/javascript");
        }
        let url = window.URL || window.webkitURL;
        let blobUrl = url.createObjectURL(blob);
        return new Worker(blobUrl);
    }

    protected generateWorker(pcmWorkerFile: string): Promise<Worker> {
        let encoder: Worker;
        try {
            encoder = new Worker(pcmWorkerFile);
            encoder.onmessage = (e) => this.onMessage(e);
            encoder.onerror = (e) => {
                e.preventDefault();
                try {
                    this.encoder = this.createWorkerFallback(pcmWorkerFile);
                } catch (e) {
                    this.onError(e);
                }
            };
            this.encoder = encoder;
        } catch (e) {
            try {
                this.encoder = this.createWorkerFallback(pcmWorkerFile);
            } catch (e) {
                return Promise.reject("worker instantiation failure");
            }
        }

        return new Promise((resolve, reject) => {
            let success = this.subscribe(WorkerEncoder.EVENT_ON_PREPARE, () => {
                this.logger.log("prepare complete");
                if (success) {
                    success.unsubscribe();
                }
                resolve(encoder);
            });

            let fail = this.subscribe(WorkerEncoder.EVENT_ON_ERROR, (e) => {
                if (fail) {
                    fail.unsubscribe();
                }
                reject(e);
            });
        });
    }

    protected async lazyLoadWorkerFile(): Promise<string> {
        if (!this.workerFilePromise) {
            this.workerFilePromise = new Promise(resolve => {
                if (this.workerFileName) {
                    resolve(this.workerFileName);
                }

                if (Browser.isWebAssemblyEnabled()) {
                    // https://webpack.js.org/api/module-methods/#require-ensure
                    this.binaryFileName = "pcm-encoder/dist/pcm-encoder-wasm-" + PCM_VERSION + ".wasm";
                    this.workerFileName = "pcm-encoder/dist/pcm-encoder-wasm-" + PCM_VERSION + ".js";
                    this.logger.log("loading worker encoder webassembly");
                    resolve(this.workerFileName);
                }

                this.binaryFileName = "pcm-encoder/dist/pcm-encoder-asmjs-" + PCM_VERSION + ".js.mem";
                this.workerFileName = "pcm-encoder/dist/pcm-encoder-asmjs-" + PCM_VERSION + ".js";
                this.logger.log("loading worker encoder asmjs");
                resolve(this.workerFileName);
            });
        }

        return this.workerFilePromise;
    }

    init(encoderSettings): Promise<any> {
        this.readyStopWatch.reset();
        this.readyStopWatch.start();
        this.ready = false;

        return this.lazyLoadWorkerFile()
            .then((pcmWorkerFile) => {
                return this.generateWorker(pcmWorkerFile);
            })
            .then(() => {
                return new Promise((resolve, reject) => {
                    let init = this.subscribe(WorkerEncoder.EVENT_ON_INIT, (data) => {
                        this.readyStopWatch.stop();
                        this.ready = true;
                        if (init) {
                            init.unsubscribe();
                        }
                        resolve(data);
                    });

                    let fail = this.subscribe(WorkerEncoder.EVENT_ON_ERROR, (e) => {
                        if (fail) {
                            fail.unsubscribe();
                        }
                        reject(e);
                    });

                    let messagePayload = assign({
                        cmd: "init"
                    }, encoderSettings);
                    this.sendWorkerMessage(messagePayload);
                });
            });
    }

    isReadyToRecord(): boolean {
        return this.ready;
    }

    private getMaxRecordingSeconds(): number {
        return this.maxRecordingSeconds;
    }

    async startRecording(stream: MediaStream, targetGain: number, micRecordingOptions: MicrophoneRecordingOptions): Promise<RecordingMediaBlob> {
        this.recorderStopWatch.start();
        this.cleanAudioInstances();
        //this.logger.log("startRecording", stream, targetGain);

        if (!this.createAudioContext(stream)) {
            this.recorderStopWatch.stop();
            return Promise.reject("empty audio context");
        }
        this.audioRecorder = await this.generateScriptProcessor(this.audioContext, WorkerEncoder.BUFFER_SIZE);

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

        let audioSubscription = this.buffer$.subscribe((buffer: Float32Array) => {
            if (!buffer) {
                return;
            }
            this.sendWorkerMessage({
                cmd: "load",
                inputAudio: buffer.buffer
            }, [buffer.buffer]);
        });

        if (!this.audioRecorder) {
            this.recorderStopWatch.stop();
            return Promise.reject("no script processor detected");
        }

        let encoderSettings = {
            inputFormat: WorkerEncoder.PCM_FORMAT,
            inputCodec: WorkerEncoder.PCM_CODEC,
            inputSampleRate: this.audioContext.sampleRate,
            inputChannels: WorkerEncoder.CHANNELS,
            outputFormat: this.getFormat(),
            outputCodec: this.getCodec(),
            outputSampleRate: WorkerEncoder.OUTPUT_SAMPLERATE,
            outputChannels: WorkerEncoder.CHANNELS,
            outputBitRate: WorkerEncoder.OUTPUT_BITRATE,
            maxSeconds: this.getMaxRecordingSeconds()
        };

        this.currentPromise = new Promise((resolve, reject) => {
            let currentSubscription = this.subscribe(WorkerEncoder.EVENT_ON_RECORDING_COMPLETE, (data) => {
                this.logger.log("recordingComplete", data);
                if (currentSubscription) {
                    currentSubscription.unsubscribe();
                }
                if (audioSubscription) {
                    audioSubscription.unsubscribe();
                }

                if (data.outputAudio) {
                    let blob = new Blob(
                        [data.outputAudio],
                        {type: this.getMimeType()}
                    );
                    this.recorderStopWatch.stop();
                    let recodingMediaBlob = {
                        format: data.outputFormat,
                        codec: data.outputCodec,
                        sampleRate: data.outputSampleRate,
                        channels: data.outputChannels,
                        blob: blob,
                        streamable: false
                    };

                    this.microphoneAudioOutputStream.emitChunk(recodingMediaBlob);
                    this.microphoneAudioOutputStream.emitFile(recodingMediaBlob);
                    this.microphoneAudioOutputStream.completeAudioObservables();
                    resolve(recodingMediaBlob);

                } else {
                    this.recorderStopWatch.stop();
                    this.microphoneAudioOutputStream.completeAudioObservables();
                    reject("worker-encoder.service.ts :: no data received");
                }

                this.sendWorkerMessage({cmd: "clear"});
            });

            this.subscribe(WorkerEncoder.EVENT_ON_ERROR, (e) => {
                if (currentSubscription) {
                    currentSubscription.unsubscribe();
                }
                if (audioSubscription) {
                    audioSubscription.unsubscribe();
                }

                this.recorderStopWatch.stop();
                this.microphoneAudioOutputStream.completeAudioObservables();
                reject(e);
            });


            this.logger.log("initializing encoder settings", encoderSettings);
            this.init(encoderSettings)
                .then(() => {
                    if (this.audioRecorder) {
                        this.audioRecorder.connect(this.audioContext.destination);
                        this.microphoneReady$.next(true);
                    }
                })
                .catch((e) => {
                    this.recorderStopWatch.stop();
                    return reject(e);
                });
        });

        return this.currentPromise;
    }

    stopRecording(stream?: MediaStream): void {
        if (!this.ready) {
            this.logger.log("encoder not ready, do not stop");
            return;
        }
        this.logger.log("stopping recording");
        this.sendWorkerMessage({
            cmd: "load"
        });
        super.stopRecording(stream);
    }

    appendAdditionalStats(stats: object): object {
        return assign(stats, {
            workerTimeElapsed: this.recorderStopWatch.getTime()
        });
    }
}
