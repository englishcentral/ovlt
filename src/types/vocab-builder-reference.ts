import { WordList } from "./word-list-reference";
import { compact, filter, head, includes, intersection, isEmpty, map, size, split, toInteger } from "lodash-es";

export class VocabBuilderReference {
    mixedModes: number[];
    type: string;
    wordLists: WordList[];
    vocabBuilderModes: VocabBuilderMode[];
    vocabBuilderStyles: VocabBuilderStyle[];
}

export class VocabBuilderMode {
    vocabBuilderModeId: number;
    name: string;
    active: boolean;
    description: string;

    constructor(name, vocabBuilderModeId, active = true) {
        this.name = name;
        this.vocabBuilderModeId = vocabBuilderModeId;
        this.active = active;
    }
}

export class VocabBuilderStyle {
    vocabBuilderStyleId: number;
    name: string;
    active: boolean;
    translatedName: string;
    description: string;
    internal: boolean;
}

export const MODE_ALL = -1;
export const MODE_TYPING = 1;
export const MODE_SPEAKING = 2;
export const MODE_MULTIPLE_CHOICE = 7;
export const MODE_STRICT_TYPING = 4;
export const MODE_REVERSE_MATCH_MULTIPLE_CHOICE = 5;
export const MODE_STRICT_SPEAKING_SECOND_LETTER_HINT = 6;
export const MODE_STRICT_TYPING_SECOND_LETTER_HINT = 8;
export const MODE_PRON_SPEAKING = 9999;
export const MODE_DEFAULT = MODE_TYPING;
export const SUPPORTED_MODES = [
    MODE_STRICT_TYPING,
    MODE_MULTIPLE_CHOICE,
    MODE_SPEAKING,
    MODE_TYPING
];

export const MIXED_MODE_EASY = [
    MODE_TYPING,
    MODE_MULTIPLE_CHOICE,
    MODE_SPEAKING
];

export const MIXED_MODE_STRICT = [
    MODE_STRICT_TYPING,
    MODE_SPEAKING,
    MODE_TYPING,
    MODE_STRICT_SPEAKING_SECOND_LETTER_HINT
];

export const QUIZ_TYPE_SEQUENTIAL = 2;
export const QUIZ_TYPE_REVIEW = 4;

export const modesToScalar = (currentModes: number[]): number => {
    if (isEmpty(currentModes)) {
        return MODE_DEFAULT;
    }
    if (size(currentModes) > 1) {
        return MODE_ALL;
    }
    return head(currentModes);
};

export const scalarToModes = (rawMode: string | number,
                              featureMixedModes: number[] = [],
                              mixedMode: number[] = []): number[] => {
    let mode = toInteger(rawMode);

    if (!mode) {
        return [MODE_DEFAULT];
    }
    if (mode == MODE_ALL) {
        return mixedMode?.length ? mixedMode : MIXED_MODE_EASY;
    }
    if (!featureMixedModes.length || featureMixedModes?.includes(mode)) {
        return [mode];
    }

    return [MODE_DEFAULT];
};

export const getSupportedModes = (modes: VocabBuilderMode[], featureValue: string = ""): VocabBuilderMode[] => {
    const featureEnabledModes = map(compact(split(featureValue, ",")), mode => toInteger(mode));
    const supportedModes = !isEmpty(featureEnabledModes)
        ? intersection(featureEnabledModes, SUPPORTED_MODES)
        : SUPPORTED_MODES;

    return filter(modes, mode => {
        return includes(supportedModes, mode.vocabBuilderModeId);
    });
};

export const ERROR_KEY_LIST_RANK_EXCEEDED = "LIST_RANK_EXCEEDED";
export const ERROR_KEY_NO_WORDS_AVAILABLE = "NO_WORDS_AVAILABLE";
export const ERROR_BAND_COMPLETE = "last band has been completed for this level test";
