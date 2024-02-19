import { Observable, Subject, Subscription } from "rxjs";
import { Injectable } from "@angular/core";
import { Emitter } from "../common/emitter";
import {
    getMediaErrorType,
    MEDIA_NOT_FOUND,
    MEDIA_NOT_READABLE,
    MEDIA_OVERCONSTRAINED,
    MEDIA_PERMISSION_DENIED
} from "../common/browser-navigator";
import {
    ERROR_AUDIOCONVERTIONFAILED,
    ERROR_GENERIC,
    ERROR_NO_DEVICE_FOUND,
    ERROR_NOT_READABLE,
    ERROR_NOT_SUPPORTED,
    ERROR_OVERCONSTRAINED,
    ERROR_PERMISSION_DENIED,
    ERROR_RECOGNIZERDOWN,
    ERROR_RECORDING,
    ERROR_REJECTED,
    ERROR_SECUREORIGIN,
    ERRORTEXT_FAILEDCONVERTINGAUDIO,
    ERRORTEXT_MICROPHONE_SWF_MISSING,
    ERRORTEXT_NO_MICROPHONES_FOUND,
    ERRORTEXT_SECUREORIGIN
} from "./microphone-constants";
import { includes, isEmpty, isString } from "lodash-es";
import { RecognizerStatus } from "../../types/recognizer-result";
import { Logger } from "../common/logger";

const STATUS_MIC_PREPARING: string = "micPreparing";
const STATUS_MIC_READY: string = "micReady";
const STATUS_MIC_PROCESSING: string = "micProcessing";
const STATUS_MIC_RECORDING: string = "micRecording";

@Injectable({providedIn: "root"})
export class MicrophoneWidgetStateService {

    private status: string;
    private errorState: string;
    private recognizerStatus?: RecognizerStatus;

    private logger = new Logger();
    private emitter = new Emitter();
    private change$ = new Subject<void>();
    private startRecording$ = new Subject<void>();

    constructor() {
    }

    getChange$(): Observable<void> {
        return this.change$.asObservable();
    }

    getStartRecording$(): Observable<void> {
        return this.startRecording$.asObservable();
    }

    startRecording(): void {
        this.startRecording$.next();
    }

    isMicPreparing(): boolean {
        return this.status == STATUS_MIC_PREPARING;
    }

    isMicReady(): boolean {
        return this.status == STATUS_MIC_READY;
    }

    isMicRecording() {
        return this.status == STATUS_MIC_RECORDING;
    }

    isMicProcessing(): boolean {
        return this.status == STATUS_MIC_PROCESSING;
    }

    setStatus(micStatus: string): void {
        this.status = micStatus;
        this.change$.next();
    }

    setMicReady(): void {
        this.setStatus(STATUS_MIC_READY);
    }

    setMicPreparing(): void {
        this.setStatus(STATUS_MIC_PREPARING);
    }

    setMicRecording(): void {
        this.setStatus(STATUS_MIC_RECORDING);
    }

    setMicProcessing(): void {
        this.setStatus(STATUS_MIC_PROCESSING);
    }

    setMicrophoneError(errorState: string, error): void {
        this.logger.log("Microphone Error Detected", errorState, error);
        this.errorState = errorState;
        this.change$.next();
    }

    getRecognizerStatus(): RecognizerStatus | undefined {
        return this.recognizerStatus;
    }

    setRejectionCode(rejectionCode: number): void {
        this.recognizerStatus = new RecognizerStatus(rejectionCode);
        this.change$.next();
    }

    isErrorSecureOrigin(error: DOMException | string): boolean {
        return isString(error) ? error == ERRORTEXT_SECUREORIGIN
            : error.message.indexOf(ERRORTEXT_SECUREORIGIN) !== -1;
    }

    isErrorAudioConversionFailed(error: string): boolean {
        return isString(error) ? includes(error, ERRORTEXT_FAILEDCONVERTINGAUDIO) : false;
    }

    isErrorPermissionDenied(error): boolean {
        return getMediaErrorType(error) == MEDIA_PERMISSION_DENIED;
    }

    isErrorNotReadable(error): boolean {
        return getMediaErrorType(error) == MEDIA_NOT_READABLE;
    }

    isErrorNotFound(error): boolean {
        if (this.isErrorMicrophoneSwfMissing(error) || this.isErrorNoMicrophoneFound(error)) {
            return true;
        }
        return getMediaErrorType(error) == MEDIA_NOT_FOUND;
    }

    isErrorMicrophoneSwfMissing(error): boolean {
        return isString(error) ? includes(error, ERRORTEXT_MICROPHONE_SWF_MISSING) : false;
    }

    isErrorNoMicrophoneFound(error): boolean {
        return isString(error) ? includes(error, ERRORTEXT_NO_MICROPHONES_FOUND) : false;
    }

    isErrorOverconstrained(error): boolean {
        return getMediaErrorType(error) == MEDIA_OVERCONSTRAINED;
    }

    isRecordingRejected(): boolean {
        return this.errorState == ERROR_REJECTED;
    }

    isRecordingError(): boolean {
        return this.errorState == ERROR_RECORDING;
    }

    isRecognizerDown(): boolean {
        return this.errorState == ERROR_RECOGNIZERDOWN;
    }

    isSecureOriginError(): boolean {
        return this.errorState == ERROR_SECUREORIGIN;
    }

    isAudioConversionFailed(): boolean {
        return this.errorState == ERROR_AUDIOCONVERTIONFAILED;
    }

    isMicrophonePermissionDenied(): boolean {
        return this.errorState == ERROR_PERMISSION_DENIED;
    }

    isPlatformNotSupported(): boolean {
        return this.errorState == ERROR_NOT_SUPPORTED;
    }

    isDeviceNotReadable(): boolean {
        return this.errorState == ERROR_NOT_READABLE;
    }

    isDeviceNotFound(): boolean {
        return this.errorState == ERROR_NO_DEVICE_FOUND;
    }

    isOverconstrained(): boolean {
        return this.errorState == ERROR_OVERCONSTRAINED;
    }

    isGenericError(): boolean {
        return this.errorState == ERROR_GENERIC;
    }

    hasError(): boolean {
        return !isEmpty(this.errorState);
    }

    getError(): string | undefined {
        return this.errorState;
    }

    resetErrorState(): void {
        this.errorState = undefined;
    }

    resetRecognizerStatus(): void {
        this.recognizerStatus = undefined;
    }

    subscribe(eventName: string, successFn: (data?) => void, errorFn?: (e?) => void): Subscription {
        return this.emitter.subscribe(eventName, successFn, errorFn);
    }

    publish(eventName: string, data?: any): void {
        this.emitter.publish(eventName, data);
    }

    destroy(): void {
        if (this.emitter) {
            this.emitter.destroy();
        }
    }
}
