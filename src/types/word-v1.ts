import { WordResult } from "../speech/recognizer-result";
import { Phoneme } from "../phoneme";
import { WordAdapter } from "./word-adapter";
import { BookContentWord } from "../book-content";
import { ContentTranslationItem } from "./x-word";

export class WordV1 {
    id?: number;
    wordInstanceId?: number;
    wordRootId?: number;
    wordRootID?: number;
    sharedMeaningId?: number;
    wordFamilyId?: number;
    wordDefinitionId?: number;
    canonicalDialogLineId?: number;
    translation?: string;
    definition?: string;
    definitionEn?: string;
    alternateCorrects?: object;
    label?: string;
    wordRootLabel?: string;
    pronunciationId?: number;
    phonemes?: string;
    pronunciation?: {
        id?: number;
        assetId?: number;
        active: boolean;
        phonemes: string;
        phones?: Phoneme[];
        syllableCount: number;
    };
    example?: string;
    partOfSpeech?: string;
    properNoun?: boolean;
    baseForm?: boolean;
    studiable?: boolean;
    featured?: boolean;
    excluded?: boolean;
    sequence?: number;
    containPunctuation?: boolean;
    idiom?: boolean;
    adjectiveType?: number;
    nounType?: number;
    learnWord?: boolean;
    cliplistKeyword?: boolean;
    wordLanguage?: string;
    difficultyLevel?: number;
    cambridgeBand?: number;
    usageCount?: number;
    audioURL?: string;
    thumbnailURL?: string;
    wordAdapter?: WordAdapter;
    childWords?: WordV1[];
    blacklist?: boolean;
    startTime?: number;
    endTime?: number;

    // EC extended fields
    dialogLineId?: number;
    displayText?: {
        pre?: string;
        display?: string;
        post?: string;
    };
    wordResult?: WordResult;
    ratingPhonemes?: Phoneme[];
    dismissed?: boolean;
    wordListName?: string;
    translated?: string;
    ratingValueId?: number;
    definitionTranslationSourceId?: number;

    translationsOpened?: boolean;
    translations?: ContentTranslationItem[];
}

export class AeonWord extends WordV1 {
    orthography?: string;
    words?: BookContentWord[];
}

export const getPartOfSpeechAbbreviated = (partOfSpeech: string): string => {
    const ABBR_LOOKUP = {
        adjective: "adj.",
        adverb: "adv.",
        article: "art.",
        conjunction: "conj.",
        interjection: "int.",
        noun: "n.",
        preposition: "prep.",
        pronoun: "pron.",
        verb: "v."
    };
    return ABBR_LOOKUP[partOfSpeech] ?? partOfSpeech;
};

export const generateLegacyWordMetadata = (word: WordV1) => {
    if (!word) {
        return;
    }
    return {
        wordHeadID: word.wordAdapter?.wordHeadId,
        wordRootID: word.wordAdapter?.wordRootId,
        wordInstanceID: word.wordAdapter?.wordInstanceId,
        wordRootDefinitionID: word.wordAdapter?.wordRootDefinitionId,
        sharedMeaningID: word.sharedMeaningId,
        wordID: word.id,
        wordFamilyId: word.wordFamilyId
    };
};
