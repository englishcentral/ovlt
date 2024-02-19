import { Injectable } from "@angular/core";
import { MicrophoneHandler } from "./microphone-handler";
import { getUserMediaEnabled } from "../../../core/browser-navigator";
import { NativeMicrophoneHandlerService } from "./native-microphone-handler.service";

import { Browser } from "../../../core/browser";
import { GlobalSettingService } from "../../../core/global-setting.service";
import { Logger } from "../../../core/logger/logger";
import { FeatureService } from "../../../core/feature.service";
import { SOLUTION_AUTO, SOLUTION_NATIVE } from "../../../model/types/speech/encoder";
import { RecognizerSettingService } from "../../../model/recognizer/recognizer-setting.service";

@Injectable({providedIn: "root"})
export class MicrophoneHandlerService {
    static NS_MICROPHONE: string = "ns-microphone-";
    private handler?: MicrophoneHandler;
    private logger = new Logger();
    private solution?: string;
    private initialized: boolean = false;
    private elementNameSpace: string = "";

    constructor(private nativeMicrophoneHandlerService: NativeMicrophoneHandlerService,
                private recognizerSettingService: RecognizerSettingService,
                private featureService: FeatureService,
                private globalSettingService: GlobalSettingService) {
    }

    getMicrophoneElementId(): string {
        return MicrophoneHandlerService.NS_MICROPHONE + this.elementNameSpace;
    }

    async initializeHandler(isStreamingEnabled: boolean = false): Promise<MicrophoneHandler | undefined> {
        this.initialized = true;

        if (isStreamingEnabled) {
            return await this.setNativeMode(this.recognizerSettingService.getStreamingEncoderType());
        }

        let [safariHandler, useAutoDetect] = this.detectSafariQuirks();
        if (!useAutoDetect) {
            return safariHandler;
        }

        if (Browser.isMobile()) {
            return await this.setNativeMode();
        }

        let overrideHandler = await this.checkHandlerOverrides();
        if (overrideHandler) {
            return overrideHandler;
        }

        let autoDetectedHandler = await this.autoDetectHandler();
        if (autoDetectedHandler) {
            return autoDetectedHandler;
        }
    }

    getHandler(): MicrophoneHandler | undefined {
        if (this.initialized) {
            return this.handler;
        }
        return undefined;
    }

    getSolution(): string {
        return this.solution || "";
    }

    private detectSafariQuirks(): [MicrophoneHandler | undefined, boolean] {
        if (!Browser.isSafari()) {
            return [undefined, true];
        }

        // safari prevents getUserMedia from crossdomain sources like iframes
        if (Browser.isMobile() && Browser.isSafari11() && Browser.inIframe()) {
            return [undefined, false];
        }

        return [undefined, true];
    }

    private checkHandlerOverrides(): Promise<MicrophoneHandler | undefined> {
        if (Browser.isChrome()) {
            return this.implementStrategy(this.globalSettingService.get("microphone.chromeSolution"));
        }

        if (Browser.isFireFox()) {
            return this.implementStrategy(this.globalSettingService.get("microphone.firefoxSolution"));
        }

        if (Browser.isEdge()) {
            return this.implementStrategy(this.globalSettingService.get("microphone.edgeSolution"));
        }

        if (Browser.isSafari()) {
            return this.implementStrategy(this.globalSettingService.get("microphone.safariSolution"));
        }

        return Promise.resolve(undefined);
    }

    private async autoDetectHandler(): Promise<MicrophoneHandler | undefined> {
        if (getUserMediaEnabled()) {
            let nativeHandler = await this.setNativeMode();
            // check if a native microhpone handler is available
            if (nativeHandler) {
                this.logger.log("Native Mic auto-detected");
                return nativeHandler;
            }
        }

        // no valid solution found in the end
        this.logger.log("No valid microphone solution found");
    }

    private async implementStrategy(solution?: string): Promise<MicrophoneHandler | undefined> {
        if (!solution || solution == SOLUTION_AUTO) {
            return undefined;
        }

        if (solution == SOLUTION_NATIVE) {
            return await this.setNativeMode();
        }

        return await this.setNativeMode(solution);
    }

    async setNativeMode(solution?: string): Promise<MicrophoneHandler | undefined> {
        this.solution = await this.nativeMicrophoneHandlerService.setHandler(solution);
        this.handler = this.nativeMicrophoneHandlerService;

        return this.handler;
    }

    isInitialized(): boolean {
        return this.initialized;
    }

    async initialize(elementNameSpace: string = ""): Promise<void> {
        let handler = await this.initializeHandler(this.recognizerSettingService.isDefaultModeStreaming());
        if (!handler) {
            return;
        }
        this.elementNameSpace = elementNameSpace;
        handler.initialize(this.getMicrophoneElementId());
    }
}
