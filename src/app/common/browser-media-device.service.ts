import { Injectable } from "@angular/core";
import { enumerateDevices } from "./browser-navigator";
import { LocalForageGeneric } from "./local-forage-generic";
import { Emitter } from "./emitters/emitter";
import { Subscription } from "rxjs";
import { assign, filter, find, has, map } from "lodash-es";
import { Logger } from "./logger/logger";
import { Dictionary } from "../model/types/dictionary";
import { BrowserMediaDevice, BrowserMediaDeviceSettings } from "./browser-media-device";

type CurrentMediaSettings = Dictionary<{ selectedId: string, gain?: number }>;

@Injectable({
    providedIn: "root"
})
export class BrowserMediaDeviceService {
    static readonly DEFAULT_GAIN: number = 75;
    static readonly NS_SETTINGS: string = "mediasettings";

    static readonly KEY_AUDIO = "audio";
    static readonly KEY_VIDEO = "video";

    static readonly KIND_AUDIO_INPUT = "audioinput";
    static readonly KIND_AUDIO_OUTPUT = "audiooutput";
    static readonly KIND_VIDEO_INPUT = "videoinput";
    static readonly EVENT_AUDIO_INPUT_SETTINGS_CHANGE = "onAudioInputSettingsChange";
    static readonly EVENT_AUDIO_OUTPUT_SETTINGS_CHANGE = "onAudioOutputSettingsChange";

    static readonly DEFAULT_MEDIA_CONSTRAINTS: MediaStreamConstraints = {audio: true, video: false};

    private localStorage = new LocalForageGeneric<CurrentMediaSettings>("currentMediaSettings");
    private deviceList?: BrowserMediaDevice[];

    private emitter = new Emitter();
    private logger = new Logger();

    private initialized: boolean = false;

    constructor() {
    }

    async initialize(): Promise<void> {
        if (this.initialized) {
            return;
        }

        await this.getDeviceListPromise();
        const deviceSettings = await this.getDeviceSettings();

        map(deviceSettings, async (settings, kind) => {
            const devices = await this.getMediaDevicesByKind(kind);
            const selectedDevice = settings.selectedId
                ? find(devices, device => device.id == settings.selectedId) ?? devices[0]
                : devices[0];

            switch (kind) {
                case BrowserMediaDeviceService.KIND_AUDIO_INPUT:
                    this.setAudioInput(selectedDevice);
                    break;
                case BrowserMediaDeviceService.KIND_AUDIO_OUTPUT:
                    this.setAudioOutput(selectedDevice);
                    break;
                case BrowserMediaDeviceService.KIND_VIDEO_INPUT:
                    this.setVideoInput(selectedDevice);
                    break;
            }
        });

        await this.saveCurrentSettings();
        this.initialized = true;
    }

    reset(): void {
        this.deviceList = undefined;
    }

    private async getDeviceListPromise(): Promise<BrowserMediaDevice[]> {
        if (this.deviceList) {
            return this.deviceList;
        }

        try {
            const devices = await enumerateDevices();
            this.deviceList = map(devices, device => new BrowserMediaDevice(device.deviceId, device.label, device.kind));
            return this.deviceList;
        } catch (e) {
            this.logger.log("media device error: ", e);
            return [];
        }
    }

    private async getMediaDevicesByKind(kind: string): Promise<BrowserMediaDevice[]> {
        const devices = await this.getDeviceListPromise();
        return filter(devices, (device) => device.kind == kind && !!device.id);
    }

    getDeviceById(deviceId?: string): BrowserMediaDevice | undefined {
        if (!deviceId) {
            return;
        }
        return find(this.deviceList, device => device.id == deviceId);
    }

    getAudioInputList(): Promise<BrowserMediaDevice[]> {
        return this.getMediaDevicesByKind(BrowserMediaDeviceService.KIND_AUDIO_INPUT);
    }

    getAudioOutputList(): Promise<BrowserMediaDevice[]> {
        return this.getMediaDevicesByKind(BrowserMediaDeviceService.KIND_AUDIO_OUTPUT);
    }

    getVideoInputList(): Promise<BrowserMediaDevice[]> {
        return this.getMediaDevicesByKind(BrowserMediaDeviceService.KIND_VIDEO_INPUT);
    }

    getCurrentAudioInput(): BrowserMediaDevice | undefined {
        return BrowserMediaDeviceSettings.getCurrentAudioInput();
    }

    getCurrentAudioOutput(): BrowserMediaDevice | undefined {
        return BrowserMediaDeviceSettings.getCurrentAudioOutput();
    }

    getCurrentVideoInput(): BrowserMediaDevice | undefined {
        return BrowserMediaDeviceSettings.getCurrentVideoInput();
    }

    private async saveCurrentSettings(): Promise<void> {
        let deviceSettings = {};

        let currentAudioInput = this.getCurrentAudioInput();
        deviceSettings[BrowserMediaDeviceService.KIND_AUDIO_INPUT] = {
            selectedId: currentAudioInput?.id,
            gain: currentAudioInput?.gain
        };

        let currentAudioOutput = this.getCurrentAudioOutput();
        deviceSettings[BrowserMediaDeviceService.KIND_AUDIO_OUTPUT] = {
            selectedId: currentAudioOutput?.id
        };

        let currentVideoInput = this.getCurrentVideoInput();
        deviceSettings[BrowserMediaDeviceService.KIND_VIDEO_INPUT] = {
            selectedId: currentVideoInput?.id
        };

        await this.localStorage.setItem(BrowserMediaDeviceService.NS_SETTINGS, deviceSettings);
    }

    setCurrentMicrophoneGain(gain: number): void {
        BrowserMediaDeviceSettings.setCurrentMicrophoneGain(gain);
        this.saveCurrentSettings();
        this.publish(BrowserMediaDeviceService.EVENT_AUDIO_INPUT_SETTINGS_CHANGE, this.getCurrentAudioInput());
    }

    getDeviceSettings(): Promise<CurrentMediaSettings> {
        return this.localStorage
            .getItem(BrowserMediaDeviceService.NS_SETTINGS)
            .catch(() => {
                return {};
            });
    }

    setAudioInput(device?: BrowserMediaDevice, save: boolean = false, publish: boolean = false): void {
        BrowserMediaDeviceSettings.setAudioInput(device);
        if (save) {
            this.saveCurrentSettings();
        }
        if (publish) {
            this.publish(BrowserMediaDeviceService.EVENT_AUDIO_INPUT_SETTINGS_CHANGE, this.getCurrentAudioInput());
        }
    }

    setAudioOutput(device: BrowserMediaDevice, save: boolean = false, publish: boolean = false): void {
        BrowserMediaDeviceSettings.setAudioOutput(device);
        if (save) {
            this.saveCurrentSettings();
        }
        if (publish) {
            this.publish(BrowserMediaDeviceService.EVENT_AUDIO_OUTPUT_SETTINGS_CHANGE, this.getCurrentAudioOutput());
        }
    }

    setVideoInput(device: BrowserMediaDevice, save: boolean = false, publish: boolean = false): void {
        BrowserMediaDeviceSettings.setVideoInput(device);
        if (save) {
            this.saveCurrentSettings();
        }
    }

    private createMediaTrackConstraint(device?: BrowserMediaDevice): MediaTrackConstraints | undefined {
        if (!device || !device?.id) {
            return undefined;
        }

        this.logger.log("createMediaTrackConstraint - device", device);

        return {
            deviceId: device.id
        };
    }

    private isConstraintDisabled(constraint: MediaStreamConstraints, key: string): boolean {
        return has(constraint, key) && constraint[key] === false;
    }

    private pickConstraint(key: string,
                           initialConstraints?: MediaStreamConstraints,
                           deviceConstraint?: MediaTrackConstraints): MediaTrackConstraints | boolean | undefined {
        if (!initialConstraints[key] || this.isConstraintDisabled(initialConstraints, key)) {
            return false;
        }

        return assign(initialConstraints[key] ?? {}, deviceConstraint) || BrowserMediaDeviceService.DEFAULT_MEDIA_CONSTRAINTS[key] || true;
    }

    getDeviceConstraints(initialConstraints?: MediaStreamConstraints): MediaStreamConstraints {
        let audioConstraint = this.createMediaTrackConstraint(this.getCurrentAudioInput());
        let videoConstraint = this.createMediaTrackConstraint(this.getCurrentVideoInput());

        this.logger.log("getCurrentAudioInput() - ", this.getCurrentAudioInput());
        this.logger.log("getDeviceConstraint - ", audioConstraint);

        if (!audioConstraint && !videoConstraint) {
            return initialConstraints || BrowserMediaDeviceService.DEFAULT_MEDIA_CONSTRAINTS;
        }

        return {
            audio: this.pickConstraint(BrowserMediaDeviceService.KEY_AUDIO, initialConstraints, audioConstraint),
            video: this.pickConstraint(BrowserMediaDeviceService.KEY_VIDEO, initialConstraints, videoConstraint)
        };
    }

    getAudioTracks(mediaStream: MediaStream): MediaStreamTrack[] {
        if (mediaStream.getAudioTracks) {
            return mediaStream.getAudioTracks();
        }
        if (mediaStream.getTracks) {
            return mediaStream.getTracks();
        }
    }

    subscribe(eventName: string, successFn: (data?) => void, errorFn?: (e?) => void): Subscription {
        return this.emitter.subscribe(eventName, successFn, errorFn);
    }

    publish(eventName: string, data?: any): void {
        this.emitter.publish(eventName, data);
    }

    getObservable(eventName: string) {
        return this.emitter.getObservable(eventName);
    }
}
