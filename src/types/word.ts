import { get, isEmpty } from "lodash-es";
import { WordAdapter } from "./word-adapter";
import { BookContentWord } from "./book-content";
import { WordRootDefinition } from "./word-root-definition";
import { WordV1 } from "./word-v1";
import { XWord } from "./x-word";
import { WordHeadProgress } from "./word-head-progress";
import { Phoneme } from "./phoneme";
import { WordResult } from "./recognizer-result";
import { CanonicalDialogLine } from "./canonical-dialog-line";

export const ADJECTIVE = "adjective";
export const ADVERB = "adverb";
export const ARTICLE = "article";
export const CONJUNCTION = "conjunction";
export const INTERJECTION = "interjection";
export const NOUN = "noun";
export const PREPOSITION = "preposition";
export const PRONOUN = "pronoun";
export const VERB = "verb";

export class WordReference {
  wordHeadID: number;
  wordRootID?: number;
  wordRootDefinitionID?: number;
  wordInstanceID?: number;
  dialogLineID?: number;
}

export class Word extends WordReference {
  static VERSION2 = "v2";
  audioURL?: string;
  cliplistCount?: number;
  definition?: string;
  definitionEn?: string;
  difficultyLevel?: number;
  displayText?: WordDisplayText = undefined;
  example?: string;
  excluded?: boolean;
  featured?: boolean;
  isStudiable?: boolean;
  isLearnWord?: boolean;
  isCliplistKeyword?: boolean;
  orthography?: string;
  partOfSpeech?: string;
  pronunciation?: string;
  ratingPhonemes?: Phoneme[];
  sequence?: number;
  thumbnailURL?: string;
  wordRootOrthography?: string;
  wordInstanceOrthography?: string;
  wordResult?: WordResult = undefined;
  completed?: boolean;
  version?: string;
  usageCount?: number;
  transcriptionValueID?: number;
  recordingUrl?: string;
  state?: string;
  wordListName?: string;
  isSpoken?: boolean;
  spokenCount?: number;
  alternateKeywordID?: number;
  translated?: string;
  transcript?: string;
  synced?: boolean;
  canonicalDialogLineId?: number;
  startTime?: number;
  endTime?: number;
  words?: BookContentWord[];
  wordStartTime?: number;
  wordEndTime?: number;
  ratingValueId?: number;
  wordAdapter?: WordAdapter;

  static getOrthography(word: Word): string {
    return get(word, "orthography", get(word, "wordInstanceOrthography", ""));
  }

  static isAdjective(partOfSpeech: string): boolean {
    return partOfSpeech == ADJECTIVE;
  }

  static isAdverb(partOfSpeech: string): boolean {
    return partOfSpeech == ADVERB;
  }

  static isArticle(partOfSpeech: string): boolean {
    return partOfSpeech == ARTICLE;
  }

  static isConjunction(partOfSpeech: string): boolean {
    return partOfSpeech == CONJUNCTION;
  }

  static isInterjection(partOfSpeech: string): boolean {
    return partOfSpeech == INTERJECTION;
  }

  static isNoun(partOfSpeech: string): boolean {
    return partOfSpeech == NOUN;
  }

  static isPreposition(partOfSpeech: string): boolean {
    return partOfSpeech == PREPOSITION;
  }

  static isPronoun(partOfSpeech: string): boolean {
    return partOfSpeech == PRONOUN;
  }

  static isVerb(partOfSpeech: string): boolean {
    return partOfSpeech == VERB;
  }

  static getPartOfSpeechAbbreviated(partOfSpeech: string): string {
    let pos = "";
    switch (partOfSpeech) {
      case "adjective":
        pos = "adj";
        break;
      case "adverb":
        pos = "adv";
        break;
      case "article":
        pos = "art";
        break;
      case "conjunction":
        pos = "conj";
        break;
      case "interjection":
        pos = "int";
        break;
      case "noun":
        pos = "n";
        break;
      case "preposition":
        pos = "prep";
        break;
      case "pronoun":
        pos = "pron";
        break;
      case "verb":
        pos = "v";
        break;
    }

    return isEmpty(pos) ? partOfSpeech : pos + ".";
  }
}

export class WordSearch {
  id: number;
  label: string;
  adjectiveType?: number;
  audioURL?: string;
  cambridgeBand?: number;
  cliplistKeyword?: boolean;
  definition?: string;
  definitionEn?: string;
  translation?: string;
  difficultyLevel?: number;
  example?: string;
  excluded?: boolean;
  featured?: boolean;
  idiom?: boolean;
  nounType?: number;
  partOfSpeech?: string;
  phonemes?: string;
  pronunciationId?: number;
  properNoun?: boolean;
  sharedMeaningId?: number;
  studiable?: boolean;
  usageCount?: number;
  wordDefinitionId?: number;
  wordFamilyId?: number;
  wordInstanceId?: number;
  wordLanguage?: string;
  wordRootId?: number;
  wordRootLabel?: string;
  wordHeadID?: number;
  wordAdapter?: WordAdapter;
}

export class CmsWord {
  Sequence?: number;
  StartTime?: number;
  EndTime?: number;
}

class WordDisplayText {
  display: string;
  post: "";
  pre: "";
}

export class AvqWordListItem {
  canonicalDialogLine?: CanonicalDialogLine;
  difficultyOverride: boolean;
  label: string;
  longDefinition: string;
  multiWord: boolean;
  rank: number;
  shortDefinition: string;
  wordHeadId: number;
  word: WordV1;
  translated?: string;
  alternateCorrects?: WordRootDefinition[];
}

export type WordListTypeOfWordRoot = Record<number, number[]>;

export interface WordTileView extends WordView {
  label: string;
}

export interface WordView extends WordV1, WordHeadProgress {
  dismissed: boolean;
}

export interface WordSearchView extends XWord, WordHeadProgress {
  dismissed: boolean;
}

export class WordRootInformation {
  wordRootId: number;
  label: string;
  ecRank?: number;
  ecBand?: number;
  cocaRank?: number;
  partOfSpeech?: string;
  idiom?: boolean;
  multiWord?: boolean;
  wordHeadECRank?: boolean;
  definition: string;
  ngslRank?: number;
  level?: number;
}

export class ContentWordFilter {
  headPick?: boolean;
  instanceLabel?: string;
  language?: string;
  limit?: number;
  sharedMeaningId?: number;
  rootPick?: boolean;
  sortType?: number;
  start?: number;
  wordFamilyId?: number;
  wordHeadId?: number;
  wordId?: number;
  wordIds?: string;
  wordInstanceId?: number;
  wordRootId?: number;
  wordListTypeId?: number;
}

export class ContentPageInfo {
  start?: number;
  limit?: number;
  hasMore?: boolean;
}

export class ContentWordAdapterList {
  pagingInfo?: ContentPageInfo;
  wordAdapters?: WordAdapter[];
}

export class ContentWordListMatch {
  id?: number;
  wordListTypeId?: number;
  wordId?: number;
  rank?: number;
}

export class WordListParam {
  wordListTypeID?: number;
  wordRootID?: number;
  rank?: number;
  wordListDialogLineID?: number;
}

export class ContentWordListItem {
  wordListTypeID?: number;
  wordRootID?: number;
  rank?: number;
  dialogLineID?: number;
}
