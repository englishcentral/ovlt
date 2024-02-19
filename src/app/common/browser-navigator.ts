import { MediaRecorder } from "../model/types/media-recorder";
import { Browser } from "./browser";
import { ERROR_GET_USER_MEDIA_DISABLED } from "../activity-app/shared-activity/microphone/microphone-constants";
import { get, toLower } from "lodash-es";

declare var navigator: any;

export class MediaRecorderFormat {
    container: string;
    codec?: string;
    streaming: boolean;
}

export const getStreamRecycleRequired = (): boolean => {
    return Browser.isFireFox();
};

export const generateAudioMimeType = (container: string, codec?: string): string => {
    if (!codec) {
        return `audio/${container}`;
    }
    return `audio/${container};codecs=${codec}`;
};

export const getSupportedMediaRecorderFormat = (isStreaming: boolean): MediaRecorderFormat | undefined => {
    let mediaRecorder: MediaRecorder = (<any>window).MediaRecorder;
    if (!mediaRecorder) {
        return undefined;
    }

    const FORMAT_MP4 = {container: "mp4", streaming: true};
    const RECOGNIZER_SUPPORTED_FORMATS: MediaRecorderFormat[] = [
        {container: "ogg", codec: "opus", streaming: true},
        {container: "webm", codec: "opus", streaming: true}
    ];

    if (!mediaRecorder.isTypeSupported) {
        return RECOGNIZER_SUPPORTED_FORMATS[0];
    }

    const match = RECOGNIZER_SUPPORTED_FORMATS.find(format => {
        const mimeType = generateAudioMimeType(format.container, format?.codec);
        return (!isStreaming || format.streaming) && mediaRecorder.isTypeSupported(mimeType);
    });

    if (match) {
        return match;
    }

    if (Browser.isSafari()) {
        return FORMAT_MP4;
    }

    return undefined;
};

export const isRtcPeerConnectionEnabled = (): boolean => {
    return (<any>window).RTCPeerConnection;
};

export const getUserMediaEnabled = (): boolean => {
    return navigator.getUserMedia
        || navigator.webkitGetUserMedia
        || navigator.mozGetUserMedia
        || navigator.mediaDevices?.getUserMedia;
};

export const getUserMedia = (constraints?: MediaStreamConstraints): Promise<MediaStream> => {
    if (!getUserMediaEnabled()) {
        return Promise.reject(ERROR_GET_USER_MEDIA_DISABLED);
    }

    if (navigator.mediaDevices?.getUserMedia) {
        return navigator.mediaDevices.getUserMedia(constraints);
    }

    return new Promise((resolve, reject) => {
        let successFn = (stream) => {
            resolve(stream);
        };
        let errorFn = (e) => {
            reject(e);
        };

        if (navigator.getUserMedia) {
            navigator.getUserMedia(constraints, successFn, errorFn);
            return;
        }

        if (navigator.webkitGetUserMedia) {
            navigator.webkitGetUserMedia(constraints, successFn, errorFn);
            return;
        }

        if (navigator.mozGetUserMedia) {
            navigator.mozGetUserMedia(constraints, successFn, errorFn);
            return;
        }

        reject(ERROR_GET_USER_MEDIA_DISABLED);
    });
};

export const getPlatform = (): string => {
    return navigator.platform || "unknown";
};

// function to abstract MediaStreamError types from different browsers
export const getMediaErrorType = (rawError: any): string => {
    if (!rawError) {
        return MEDIA_ERROR_UNKNOWN;
    }

    let error = toLower(get(rawError, "name", "") || rawError.toString());
    if (!error) {
        return MEDIA_ERROR_UNKNOWN;
    }
    if (error.indexOf(MEDIA_PERMISSION_DISMISSED) !== -1) {
        return MEDIA_PERMISSION_DISMISSED;
    }
    if (error == toLower(MEDIA_ERROR_TYPE_NOT_ALLOWED)
        || error.indexOf(MEDIA_PERMISSION_DENIED) !== -1) {
        return MEDIA_PERMISSION_DENIED;
    }
    if (error == toLower(MEDIA_ERROR_TYPE_NOT_FOUND)) {
        return MEDIA_NOT_FOUND;
    }
    if (error == toLower(MEDIA_ERROR_TYPE_NOT_READABLE)
        || error == toLower(MEDIA_ERROR_TYPE_ABORT)) {
        return MEDIA_NOT_READABLE;
    }
    if (error == toLower(MEDIA_ERROR_TYPE_OVERCONSTRAINED)) {
        return MEDIA_OVERCONSTRAINED;
    }
    return MEDIA_ERROR_UNKNOWN;
};

export const enumerateDevices = (): Promise<MediaDeviceInfo[]> => {
    if (!getUserMediaEnabled() || !navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        return Promise.resolve([]);
    }

    return navigator.mediaDevices.enumerateDevices();
};

export const MEDIA_PERMISSION_DENIED = "permission denied";
export const MEDIA_PERMISSION_DISMISSED = "permission dismissed";
export const MEDIA_NOT_FOUND = "media not found";
export const MEDIA_NOT_READABLE = "media not readable";
export const MEDIA_OVERCONSTRAINED = "media overconstrained";
export const MEDIA_ERROR_UNKNOWN = "unknown media error";

const MEDIA_ERROR_TYPE_NOT_ALLOWED = "NotAllowedError";
const MEDIA_ERROR_TYPE_NOT_READABLE = "NotReadableError";
const MEDIA_ERROR_TYPE_ABORT = "AbortError";
const MEDIA_ERROR_TYPE_NOT_FOUND = "NotFoundError";
const MEDIA_ERROR_TYPE_OVERCONSTRAINED = "OverconstrainedError";
