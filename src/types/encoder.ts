export const SOLUTION_NATIVE = "native";
export const SOLUTION_AUTO = "auto";

export const ENCODER_NONE = "passthru";
export const ENCODER_NATIVE_MEDIARECORDER = "media";
export const ENCODER_WAV = "wav";
export const ENCODER_MP4 = "worker";
export const ENCODER_FLAC = "flac";

export const INPUT_TYPE_STREAM = "websocket";
export const INPUT_TYPE_FILE = "http";

export class RecordingMediaBlob {
    format: string;
    codec: string;
    sampleRate: number;
    channels: number;
    blob: Blob;
    streamable: boolean;
}
