import { Injectable } from "@angular/core";
import { Logger } from "../common/logger";
import { Browser } from "../common/browser";
import { HTTP_REQUEST_HANDLER, WEBSOCKET_REQUEST_HANDLER } from "../model/recognizer-model.service";
import { ENCODER_NATIVE_MEDIARECORDER } from "../../types/encoder";

@Injectable({providedIn: "root"})
export class RecognizerSettingService {
    private logger = new Logger();

    constructor() {
    }

    getFileTransferMode(recognizerType?: number, fileTransferMode?: string): string | undefined {
        const LAST_NONCHROMIUM_EDGE_VERSION = 44;
        if (Browser.isInternetExplorer()
            || (Browser.isEdge() && parseInt(Browser.getVersion()) <= LAST_NONCHROMIUM_EDGE_VERSION)
        ) {
            return HTTP_REQUEST_HANDLER;
        }

        const ANDROID_VERSION_LOCAL_FILE_ENABLED = 10;
        if (Browser.isChromeOs()
            || (Browser.isAndroid() && parseInt(Browser.getAndroidVersion()) < ANDROID_VERSION_LOCAL_FILE_ENABLED)
            || Browser.isIos()
        ) {
            return WEBSOCKET_REQUEST_HANDLER;
        }

        return fileTransferMode;
    }

    getWavWorkerEncoderSetting(playerOverrideSetting?: boolean): boolean {
        return playerOverrideSetting ?? false;
    }

    getRecognizerType(recognizerType?: number): number | undefined {
        return recognizerType;
    }

    isDefaultModeStreaming(): boolean {
        return this.getFileTransferMode() == WEBSOCKET_REQUEST_HANDLER;
    }

    getStreamingEncoderType(): string {
        return ENCODER_NATIVE_MEDIARECORDER;
    }
}
