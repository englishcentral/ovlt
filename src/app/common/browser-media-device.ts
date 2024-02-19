import { Logger } from "./logger";


export class BrowserMediaDevice {
    gain?: number;

    constructor(public id: string, public name: string, public kind: string) {
    }
}

export class BrowserMediaDeviceSettings {
    private static currentAudioInput?: BrowserMediaDevice;
    private static currentVideoInput?: BrowserMediaDevice;
    private static currentAudioOutput?: BrowserMediaDevice;
    private static logger = new Logger();

    static getCurrentAudioInput(): BrowserMediaDevice | undefined {
        return BrowserMediaDeviceSettings.currentAudioInput;
    }

    static getCurrentAudioOutput(): BrowserMediaDevice | undefined {
        return BrowserMediaDeviceSettings.currentAudioOutput;
    }

    static getCurrentVideoInput(): BrowserMediaDevice | undefined {
        return BrowserMediaDeviceSettings.currentVideoInput;
    }

    static setCurrentMicrophoneGain(gain: number): void {
        if (!BrowserMediaDeviceSettings.currentAudioInput) {
            return;
        }

        BrowserMediaDeviceSettings.currentAudioInput.gain = gain;
    }

    static setAudioInput(device?: BrowserMediaDevice): void {
        BrowserMediaDeviceSettings.logger.log("Setting Audio Input", device);
        BrowserMediaDeviceSettings.currentAudioInput = device;
    }

    static setAudioOutput(device?: BrowserMediaDevice): void {
        BrowserMediaDeviceSettings.currentAudioOutput = device;
    }

    static setVideoInput(device?: BrowserMediaDevice): void {
        BrowserMediaDeviceSettings.currentVideoInput = device;
    }
}
