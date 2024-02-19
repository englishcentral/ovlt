import { Browser } from "../../core/browser";
import { FeatureService } from "../../core/feature.service";
import { VALID_RECOGNIZERS } from "../types/speech/recognizer-result";
import { Injectable } from "@angular/core";
import { ENCODER_FLAC, ENCODER_NATIVE_MEDIARECORDER, ENCODER_WAV } from "../types/speech/encoder";
import { Logger } from "../../core/logger/logger";
import { find, isUndefined } from "lodash-es";
import { getSupportedMediaRecorderFormat } from "../../core/browser-navigator";
import { HTTP_REQUEST_HANDLER, WEBSOCKET_REQUEST_HANDLER } from "../types/speech/transport";

@Injectable({providedIn: "root"})
export class RecognizerSettingService {
    private logger = new Logger();

    constructor(private featureService: FeatureService) {
    }

    getFileTransferMode(recognizerType?: number, fileTransferMode?: string): string | undefined {
        const LAST_NONCHROMIUM_EDGE_VERSION = 44;
        // BC-70393
        // BC-75616
        if (Browser.isInternetExplorer()
            || (Browser.isEdge() && parseInt(Browser.getVersion()) <= LAST_NONCHROMIUM_EDGE_VERSION)
        ) {
            return HTTP_REQUEST_HANDLER;
        }

        const ANDROID_VERSION_LOCAL_FILE_ENABLED = 10;
        // BC-76878
        // BC-77802
        if (Browser.isChromeOs()
            || (Browser.isAndroid() && parseInt(Browser.getAndroidVersion()) < ANDROID_VERSION_LOCAL_FILE_ENABLED)
            || Browser.isIos()
        ) {
            return WEBSOCKET_REQUEST_HANDLER;
        }

        return fileTransferMode || this.featureService.getFeature("recognizerFileTransferMode");
    }

    getWavWorkerEncoderSetting(playerOverrideSetting?: boolean): boolean {
        return playerOverrideSetting ?? this.featureService.getFeature("wavWorkerEncoderEnabled") ?? false;
    }

    getRecognizerType(recognizerType?: number): number | undefined {
        if (recognizerType && VALID_RECOGNIZERS.includes(recognizerType)) {
            return recognizerType;
        }

        return this.featureService.getFeature("recognizerType");
    }

    isDefaultModeStreaming(): boolean {
        return this.getFileTransferMode() == WEBSOCKET_REQUEST_HANDLER;
    }

    getStreamingEncoderType(): string {
        let speechEncodersFeature = this.featureService.getFeature("speechEncoders");
        if (speechEncodersFeature) {
            let encoders = speechEncodersFeature.split(",");
            const firstSupportedEncoder = find(encoders, encoder => {
                if (encoder === ENCODER_NATIVE_MEDIARECORDER) {
                    return !isUndefined(getSupportedMediaRecorderFormat(true));
                }
                if (encoder === ENCODER_FLAC) {
                    return Browser.isWorkerEnabled();
                }
                if (encoder === ENCODER_WAV) {
                    return true;
                }
            });
            const streamingEncoder =  firstSupportedEncoder ?? ENCODER_WAV;
            this.logger.log(`streaming encoder - ${streamingEncoder}`);

            return streamingEncoder;
        }

        this.logger.log(`streaming encoder - wav fallback`);
        return ENCODER_WAV;
    }
}
