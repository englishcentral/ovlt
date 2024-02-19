import { Observable, Subject, Subscription } from "rxjs";
import { MicrophoneAudioOutputStream } from "./microphone-audio-output-stream";
import { INPUT_TYPE_FILE, RecordingMediaBlob } from "../../types/encoder";
import { BrowserMediaDevice } from "../common/browser-media-device";

export class MicrophoneRecordingOptions {
    fileTransferMode: string = INPUT_TYPE_FILE;
    wavWorkerEncoderEnabled?: boolean = false;
    recognizerType?: number;
    trackingContext?: Record<string, string>;
}

export interface MicrophoneHandler {
    initialize(settings);

    destroy();

    isInitialized();

    startRecording(micRecordingOptions: MicrophoneRecordingOptions): Promise<RecordingMediaBlob>;

    stopRecording(from?: string);

    getAudioOutputStream(): MicrophoneAudioOutputStream;

    getFormat(fileTransferMode?: string): string;

    isRecording();

    isReadyToRecord();

    isAutoAdjust();

    getType(): string;

    getAvailableMicrophoneSelections(refreshList?: boolean): Promise<BrowserMediaDevice[]>;

    getCurrentMicrophoneSelection(): BrowserMediaDevice | undefined;

    setCurrentMicrophoneSelection(device: BrowserMediaDevice): void;

    getGain(): number;

    setGain(value: number);

    setMuted(muted: boolean);

    setMaxSeconds(maxSeconds: number);

    setHandler(solution?: string);

    subscribe(eventName: string, successFn: (data?) => void, errorFn?: (e?) => void): Subscription;

    getObservable(eventName: string): Subject<any>;

    processAutoAdjustGain(value: number);

    isDebugEncoder(): boolean;

    appendAdditionalStats(stats: object): object;

    getRecordingDataArrayHeartbeat(): number[];

    getMicrophoneReadyObservable(): Observable<boolean>;
}
