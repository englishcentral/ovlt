import { Injectable, NgZone } from "@angular/core";
import { Observable, ReplaySubject, Subject } from "rxjs";
import { INPUT_TYPE_FILE, INPUT_TYPE_STREAM, RecordingMediaBlob } from "../../../model/types/speech/encoder";

@Injectable({providedIn: "root"})
export class MicrophoneAudioOutputStream {
    private audioFileObservable: Subject<RecordingMediaBlob>;
    private audioStreamObservable: Subject<RecordingMediaBlob>;
    protected zone: NgZone = new NgZone({enableLongStackTrace: false});

    constructor() {
    }

    emitFile(recordingMediaBlob: RecordingMediaBlob): void {
        if (!this.audioFileObservable || this.audioFileObservable.closed) {
            this.generateAudioObservables();
        }
        this.audioFileObservable.next(recordingMediaBlob);
    }

    emitChunk(recordingMediaBlob: RecordingMediaBlob): void {
        if (!this.audioStreamObservable || this.audioStreamObservable.closed) {
            this.generateAudioObservables();
        }
        this.audioStreamObservable.next(recordingMediaBlob);
    }

    getObservable(inputType: string = INPUT_TYPE_FILE): Observable<RecordingMediaBlob> {
        if (!this.audioFileObservable || this.audioFileObservable.closed) {
            this.generateAudioObservables();
        }
        return inputType == INPUT_TYPE_STREAM ? this.audioStreamObservable : this.audioFileObservable;
    }

    getFileObservable(): Observable<RecordingMediaBlob> {
        return this.audioFileObservable;
    }

    getStreamObservable(): Observable<RecordingMediaBlob> {
        return this.audioStreamObservable;
    }

    generateAudioObservables(): [Subject<RecordingMediaBlob>, Subject<RecordingMediaBlob>] {
        // close previous streams if they're still open
        this.zone.run(() => {
            this.completeAudioObservables();
            this.audioFileObservable = new ReplaySubject<RecordingMediaBlob>();
            this.audioStreamObservable = new ReplaySubject<RecordingMediaBlob>();
        });


        return [this.audioFileObservable, this.audioStreamObservable];
    }

    completeAudioObservables(): void {
        this.zone.run(() => {
            if (this.audioFileObservable) {
                this.audioFileObservable.complete();
            }
            if (this.audioStreamObservable) {
                this.audioStreamObservable.complete();
            }
        });

    }
}
