import { WordV1 } from "./word-v1";
import { CharacterV1 } from "./character-v1";
import { PunctuationV1 } from "./punctuation-v1";

export class DialogLineV1 {
    id: number;
    dialogId: number;
    sequence: number;
    characterId: number;
    transcript: string;
    translation: string;
    videoURL: string;
    thumbnailURL: string;
    cueStart: number;
    cueEnd: number;
    slowSpeakStart: number;
    slowSpeakEnd: number;
    autoPause: boolean;
    pointsMax: number;
    wordDetails: WordV1[];
    wordDetail: WordV1;
    character: CharacterV1;
    dialogTitle: string;
    channelOnly: boolean;
    cliplistOnly: boolean;
    blacklist: boolean;
    punctuations: PunctuationV1[];
    canonical: boolean;
    translationSourceId?: number;
}

export class DialogLineSeekBarV1 extends DialogLineV1 {
    style: object;
}
