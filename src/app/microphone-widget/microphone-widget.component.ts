import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    NgZone,
    OnDestroy,
    OnInit,
    Output,
    TemplateRef
} from "@angular/core";
import { filter, take, takeUntil } from "rxjs/operators";
import {
    DEFAULT_MICROPHONE_RECORDING_TIME_SECONDS,
    ERROR_GENERIC,
    ERROR_GET_USER_MEDIA_DISABLED,
    ERROR_NO_DEVICE_FOUND,
    ERROR_NOT_READABLE,
    ERROR_NOT_SUPPORTED,
    ERROR_OVERCONSTRAINED,
    ERROR_PERMISSION_DENIED
} from "./microphone-constants";
import { toString } from "lodash-es";
import { MicrophoneWidgetStateService } from "./microphone-widget-state.service";
import { StopWatch } from "../common/stopwatch";
import { SubscriptionAbstract } from "../subscription.abstract";
import { Logger } from "../common/logger";
import { RecognizerSettingService } from "./recognizer-setting.service";
import { MicrophoneHandlerService } from "./microphone-handler.service";
import { HTTP_REQUEST_HANDLER, WEBSOCKET_REQUEST_HANDLER } from "../model/recognizer-model.service";
import { createAudioInstance } from "../common/html-audio-instance";
import { MicrophoneHandler } from "./microphone-handler";
import { Browser } from "../common/browser";
import { AudioInstance } from "../common/audio-instance";
import { BrowserMediaDeviceService } from "../common/browser-media-device.service";

export class MicrophoneWidgetRecording {
    audioBlob?: Blob;
    solution: string;
    format?: string;
    gain: string;
    microphone: string;
}

@Component({
    selector: "ec-microphone-widget",
    templateUrl: "microphone-widget.component.html",
    styleUrls: ["microphone-widget.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class MicrophoneWidgetComponent extends SubscriptionAbstract implements OnInit, OnDestroy {
    private logger = new Logger();
    private currentAudio?: AudioInstance;

    @Input() maxRecordingTimeSeconds: number = DEFAULT_MICROPHONE_RECORDING_TIME_SECONDS;
    @Input() micReadyTooltipTemplate?: TemplateRef<any>;
    @Input() stopRecordingTooltipTemplate?: TemplateRef<any>;
    @Input() recordingRejectionTooltipTemplate?: TemplateRef<any>;
    @Input() trackingContext?: Record<string, string>;
    @Input() showLocalRecording: boolean = false;
    @Input() recognizerType?: number;
    @Input() fileTransferMode?: string;
    @Input() tooltipPlacement: string = "right";
    @Input() autoCloseTooltipEnabled: boolean = true;
    @Input() isMicPulseAnimationEnabled: boolean = true;

    @Output() eventMicReady = new EventEmitter<void>();
    @Output() eventStop = new EventEmitter<void>();
    @Output() eventRecord = new EventEmitter<MicrophoneWidgetRecording>();
    @Output() eventOpenMicrophoneSettings = new EventEmitter<void>();

    constructor(private microphoneWidgetStateService: MicrophoneWidgetStateService,
                private browserMediaDeviceService: BrowserMediaDeviceService,
                private recognizerSettingService: RecognizerSettingService,
                private microphoneHandlerService: MicrophoneHandlerService,
                private changeDetectorRef: ChangeDetectorRef,
                private zone: NgZone) {
        super();
        this.initializeSubscriptions();
    }

    ngOnInit(): void {
        this.initializeComponent();
    }

    private initializeComponent(): void {
        this.microphoneHandlerService.initialize();
        this.microphoneWidgetStateService.resetErrorState();
        this.microphoneWidgetStateService.setMicReady();
    }

    private initializeSubscriptions(): void {
        this.microphoneWidgetStateService.getChange$()
            .pipe(
                takeUntil(this.getDestroyInterceptor())
            ).subscribe(() => {
                this.zone.run(() => {
                    this.changeDetectorRef.detectChanges();
                });
            });

        this.microphoneWidgetStateService.getStartRecording$()
            .pipe(
                takeUntil(this.getDestroyInterceptor())
            ).subscribe(() => {
                if (!this.isMicReady()) {
                    return;
                }
                this.changeDetectorRef.detectChanges();
                this.onClickStartRecording();
            });
    }

    getMicReadyTooltip(defaultTooltip: TemplateRef<any>): TemplateRef<any> {
        return this.micReadyTooltipTemplate || defaultTooltip;
    }

    getMicRecordingTooltip(defaultTooltip: TemplateRef<any>): TemplateRef<any> {
        return this.stopRecordingTooltipTemplate || defaultTooltip;
    }

    getRecordingRejectionTooltip(defaultTooltip: TemplateRef<any>): TemplateRef<any> {
        return this.recordingRejectionTooltipTemplate || defaultTooltip;
    }

    getAudioErrorTooltip(audioErrorTooltip: TemplateRef<any>): TemplateRef<any> | undefined {
        if (this.isAudioError()) {
            return audioErrorTooltip;
        }
        return undefined;
    }

    getTooltipPlacement(): string {
        return this.tooltipPlacement;
    }

    getCurrentAudio(): AudioInstance | undefined {
        return this.currentAudio;
    }

    getState(): MicrophoneWidgetStateService {
        return this.microphoneWidgetStateService;
    }

    setMicrophoneError(error: string): void {
        if (error == ERROR_GET_USER_MEDIA_DISABLED) {
            return this.microphoneWidgetStateService.setMicrophoneError(ERROR_NOT_SUPPORTED, error);
        }

        if (this.microphoneWidgetStateService.isErrorPermissionDenied(error)) {
            return this.microphoneWidgetStateService.setMicrophoneError(ERROR_PERMISSION_DENIED, error);
        }

        if (this.microphoneWidgetStateService.isErrorNotReadable(error)) {
            return this.microphoneWidgetStateService.setMicrophoneError(ERROR_NOT_READABLE, error);
        }

        if (this.microphoneWidgetStateService.isErrorNotFound(error)) {
            return this.microphoneWidgetStateService.setMicrophoneError(ERROR_NO_DEVICE_FOUND, error);
        }

        if (this.microphoneWidgetStateService.isErrorOverconstrained(error)) {
            // current mic got unplugged, selected mic is no longer valid
            this.browserMediaDeviceService.setAudioInput(undefined, true);
            return this.microphoneWidgetStateService.setMicrophoneError(ERROR_OVERCONSTRAINED, error);
        }
    }

    setAudioInstanceCallbacks(): void {
        this.currentAudio.onPlay(() => this.changeDetectorRef.detectChanges());
        this.currentAudio.onStop(() => this.changeDetectorRef.detectChanges());
        this.currentAudio.onEnd(() => this.changeDetectorRef.detectChanges());
    }

    isMicReadyToRecord(): boolean {
        let handler = this.microphoneHandlerService.getHandler();
        if (!handler) {
            return false;
        }
        return handler.isReadyToRecord();
    }

    isAutoCloseTooltipEnabled(): boolean {
        return this.autoCloseTooltipEnabled;
    }

    isMicPreparing(): boolean {
        return this.microphoneWidgetStateService.isMicPreparing();
    }

    isMicReady(): boolean {
        return this.microphoneWidgetStateService.isMicReady();
    }

    isMicRecording(): boolean {
        return this.microphoneWidgetStateService.isMicRecording();
    }

    isMicProcessing(): boolean {
        return this.microphoneWidgetStateService.isMicProcessing();
    }

    isMicIdle(): boolean {
        return !(this.microphoneWidgetStateService.isMicPreparing()
            || this.microphoneWidgetStateService.isMicRecording()
            || this.microphoneWidgetStateService.isMicProcessing());
    }

    isAudioError(): boolean {
        if (!this.getCurrentAudio()) {
            return false;
        }
        return !this.getCurrentAudio().canPlay();
    }

    isHttps(): boolean {
        return window.location.protocol == "https:";
    }

    isRejectionTooLoud(): boolean {
        return this.microphoneWidgetStateService.getRecognizerStatus()?.isRejectionTooLoud();
    }

    isRejectionTooQuiet(): boolean {
        return this.microphoneWidgetStateService.getRecognizerStatus()?.isRejectionTooQuiet();
    }

    isRejectionPoorSnr(): boolean {
        return this.microphoneWidgetStateService.getRecognizerStatus()?.isRejectionPoorSnr();
    }

    isRejectionJunk(): boolean {
        return this.microphoneWidgetStateService.getRecognizerStatus()?.isRejectionJunk();
    }

    isRejectionNoVoice(): boolean {
        return this.microphoneWidgetStateService.getRecognizerStatus()?.isRejectionNoVoice();
    }

    isRejectionPausing(): boolean {
        return this.microphoneWidgetStateService.getRecognizerStatus()?.isRejectionPausing();
    }

    isRejectionNarrowBand(): boolean {
        return this.microphoneWidgetStateService.getRecognizerStatus()?.isRejectionNarrowBand();
    }

    isRejectionShortSentence(): boolean {
        return this.microphoneWidgetStateService.getRecognizerStatus()?.isRejectionShortSentence();
    }

    isRejectionWrongLanguage(): boolean {
        return this.microphoneWidgetStateService.getRecognizerStatus()?.isRejectionWrongLanguage();
    }

    isRejectionMismatchRecording(): boolean {
        return this.microphoneWidgetStateService.getRecognizerStatus()?.isRejectionMismatchRecording();
    }

    isAudioControlButtonsEnabled(): boolean {
        return this.getCurrentAudio() && this.shouldShowLocalRecording();
    }

    isCmsMode(): boolean {
        return false;
    }

    isMobile(): boolean {
        return Browser.isMobile();
    }

    isTwaEnabled(): boolean {
        return false;
    }

    hasError(): boolean {
        return this.microphoneWidgetStateService.hasError();
    }

    shouldShowLocalRecording(): boolean {
        return this.showLocalRecording;
    }

    openMicrophoneSettings(): void {
        this.eventOpenMicrophoneSettings.emit();
    }

    onClickStartRecording(): void {
        this.logger.log("recording started");
        this.startRecording()
            .catch((error) => {
                this.logger.error("recording error", error);
                this.microphoneWidgetStateService.setMicrophoneError(ERROR_GENERIC, error);
            });
    }

    async startRecording(): Promise<void> {
        if (!this.isMicIdle()) {
            return Promise.reject("Mic is not available");
        }

        this.reset();

        const microphoneHandler = await this.microphoneHandlerService.initializeHandler(this.fileTransferMode === WEBSOCKET_REQUEST_HANDLER);
        if (!microphoneHandler) {
            this.microphoneWidgetStateService.setMicrophoneError(ERROR_NOT_SUPPORTED, "No handler detected for platform");
            return Promise.reject("No handler detected for platform");
        }

        this.prepareMicrophoneForRecording(microphoneHandler);

        const currentAudioInput = microphoneHandler ? microphoneHandler.getCurrentMicrophoneSelection() : undefined;
        const fileTransferMode = this.recognizerSettingService.getFileTransferMode(this.recognizerType, this.fileTransferMode);

        this.eventMicReady.emit(undefined);

        if (fileTransferMode == HTTP_REQUEST_HANDLER) {
            const outputStream = microphoneHandler.getAudioOutputStream();
            outputStream.generateAudioObservables();
        }

        return microphoneHandler
            .startRecording({
                fileTransferMode: fileTransferMode,
                wavWorkerEncoderEnabled: true,
                recognizerType: this.recognizerType,
                trackingContext: this.trackingContext
            })
            .then((micResult) => {
                if (!micResult) {
                    this.logger.log("no mic result");
                    return this.microphoneWidgetStateService.setMicReady();
                }
                this.microphoneWidgetStateService.setMicProcessing();
                this.logger.log("MicrophoneResults", micResult);

                if (this.showLocalRecording) {
                    let currentAudioUrl = URL.createObjectURL(micResult.blob); // place IE handler here
                    this.logger.log("RecordingAudioBlobURL:", currentAudioUrl);
                    this.currentAudio = createAudioInstance(currentAudioUrl);
                    if (this.currentAudio) {
                        this.setAudioInstanceCallbacks();
                    }
                }

                this.eventRecord.emit({
                    audioBlob: micResult.blob,
                    solution: this.microphoneHandlerService.getSolution(),
                    format: micResult.format,
                    gain: microphoneHandler.getGain() ? toString(microphoneHandler.getGain()) : "",
                    microphone: currentAudioInput ? currentAudioInput.name : ""
                });

                this.changeDetectorRef.markForCheck();
            })
            .catch((error) => {
                this.logger.log("error on recording", error);
                this.microphoneWidgetStateService.setMicReady();
                this.changeDetectorRef.markForCheck();
                this.setMicrophoneError(error);
            });
    }

    stopRecording(): void {
        let handler = this.microphoneHandlerService.getHandler();
        if (!handler) {
            return this.microphoneWidgetStateService.setMicReady();
        }
        this.eventStop.emit();
        this.microphoneWidgetStateService.setMicProcessing();
        handler.stopRecording("microphoneWidget stop");
    }

    private prepareMicrophoneForRecording(microphoneHandler: MicrophoneHandler): void {
        let micReadyTimer = new StopWatch(true);

        this.microphoneWidgetStateService.setMicPreparing();
        microphoneHandler.setMaxSeconds(this.maxRecordingTimeSeconds);
        microphoneHandler.getMicrophoneReadyObservable()
            .pipe(
                filter(isReady => isReady),
                take(1)
            )
            .subscribe(() => {
                micReadyTimer.stop();
                microphoneHandler.setMuted(false);
                this.microphoneWidgetStateService.setMicRecording();
            });
    }

    private reset(): void {
        this.microphoneWidgetStateService.resetErrorState();
        if (this.currentAudio) {
            this.currentAudio.destroy();
            this.currentAudio = undefined;
        }
    }

    ngOnDestroy(): void {
        this.stopRecording();
        const microphoneHandler = this.microphoneHandlerService.getHandler();
        if (microphoneHandler) {
            microphoneHandler.destroy();
        }
        if (this.currentAudio) {
            this.currentAudio.destroy();
        }
        super.ngOnDestroy();
    }
}
