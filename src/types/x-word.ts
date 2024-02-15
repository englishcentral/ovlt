import { Asset } from "./asset";
import { WordV1 } from "./word-v1";
import { WordAdapter } from "./word-adapter";
import { Word } from "./word";
import { WordListDetails } from "./word-list-details";
import { Phoneme } from "./phoneme";

export class XWordBase {
  id?: number;
  active?: boolean;
  isEditing?: boolean;
}

export class XWords {
  xWords: XWord[];
  wordsFieldsMissing?: boolean;
}

export class XWord extends XWordBase {
  asset?: Asset;
  audioUrl?: string;
  baseForm: boolean;
  baseFormComplete?: {
    id: number;
    active: boolean;
    baseForm: boolean;
    canonicalDialogLineId: number;
    dateModified: string;
    partOfSpeech: string;
  };
  canonicalDialogLineId: number;
  dateModified?: number;
  label?: string;
  links?: string;
  partOfSpeech?: string;
  partOfSpeechId?: number;
  transcript?: string;
  translation?: string;
  wordAdapter?: WordAdapter;
  xSharedMeaning?: XSharedMeaning;
  xWordAttributes?: XWordAttributes;
  xWordDefinition?: XWordDefinition;
  xWordExample?: XWordExample;
  xWordFamily?: XWordFamily;
  xWordInstance?: XWordInstance;
  xWordPronunciation?: XWordPronunciation;
  xWordRoot?: XWordRoot;
  id: number;

  // For CMS updates
  wordRootId?: number;
  wordInstanceId?: number;
  wordDefinitionId?: number;
  wordFamilyId?: number;
  pronunciationId?: number;
  sharedMeaningId?: number;
  wordExampleId?: number;
  translationsOpened?: boolean;
  translations?: ContentTranslationItem[];
}

export class XWordDetail extends XWordBase {
  id: number;
  wordInstanceId: number;
  wordRootId: number;
  sharedMeaningId: number;
  wordFamilyId: number;
  wordDefinitionId: number;
  definition: string;
  definitionEn: string;
  shortDefinition: string;
  translation: string;
  definitionTranslationSourceId: number;
  alternateCorrects: any[]; // will be array of XWordDefiniton
  label: string;
  wordRootLabel: string;
  example: string;
  partOfSpeech: string;
  properNoun: boolean;
  baseForm: boolean;
  studiable: boolean;
  featured: boolean;
  excluded: boolean;
  sequence: number;
  containPunctuation: boolean;
  idiom: boolean;
  adjectiveType: number;
  nounType: number;
  wordLanguage: string;
  difficultyLevel: number;
  cambridgeBand: number;
  usageCount: number;
  audioURL: string;
  wordAdapter: WordAdapter;
  childWords: XWordDetail[];
  blacklist: boolean;
  startTime: number;
  endTime: number;
  pronunciationId: number;
  phonemes: string;
  learnWord: boolean;
  cliplistKeyword: boolean;
  pronunciation: any; // will be XWordPronunciation
  canonicalDialogLineId: number;
  translationSourceId: number;
}

export class XWordAttributes extends XWordBase {
  abbreviation: boolean;
  acronym: boolean;
  attributePrivate: boolean;
  blacklist: boolean;
  contraction: boolean;
  dateModified: string;
  excluded: boolean;
  idiom: boolean;
  language: string;
  nounGerund: boolean;
  nounPlural: boolean;
  nounPossessive: boolean;
  nounProper: boolean;
  numberTypeId?: number;
  private?: boolean;
  slang: boolean;
  studiable: boolean;
  verbAuxiliary: boolean;
  verbIrregular: boolean;
  verbTenseTypeId?: number;
  wordId: number;
}

export class XWordDefinition extends XWordBase {
  language?: string;
  longForm: string;
  longFormTranslated: string;
  shortForm: string;
  verbTense?: string;
}

export class XSharedMeaning extends XWordBase {
  active?: boolean;
  attributeOnSite?: boolean;
  id: number;
  cefrId?: number;
  cocaRank?: number;
  ecRank?: number;
  label?: string;
  usageCount: number;
  vocabLevel: number;
  vocabLevelOverride?: number;
  difficultyLevel: number;
}

export class XWordExample extends XWordBase {
  example: string;
}

export class XWordFamily extends XWordBase {
  active: boolean;
  attributeMultiword: boolean;
  attributeOnSite: boolean;
  cambridgeBand: number;
  clipCount: number;
  dateCreated: string;
  dateModified: string;
  difficultyLevel: number;
  ecRank: number;
  id: number;
  vocabLevel: number;
  wordIds?: number[];
  wordRootId: number;
}

export class XWordFamilyParams {
  label?: string;
  limit?: number;
  start?: number;
  wordFamilyIds?: string;
}

export class XWordFamiliesResponse {
  xWordFamilies: XWordFamily[];
}

export class XWordInstance extends XWordBase {
  id?: number;
  label?: string;
  multiword?: boolean;
}

export class XWordPronunciation extends XWordBase {
  assetId?: number;
  label: string;
  phonemes: string;
  phones?: Phoneme[];
  syllableCount: number;
  active: boolean;
}

export class XWordRoot extends XWordBase {
  active: boolean;
  dateCreated: string;
  dateModified: string;
  id: number;
  label: string;
}

export class SharedMeaningDistractors {
  sharedMeaningId: number;
  distractorSharedMeaningId: number;
  locked: boolean;
  active: boolean;
}

export class ShareadMeaningDistractorMatches {
  xSharedMeaningDistractorMatches: SharedMeaningDistractors[];
}

export class ContentType {
  contentTypeId: number;
  label: string;
}

export class ContentTypes {
  key: string;
  value: ContentType[];
}

export class ContentReferences {
  activityRelatedTypes: ContentTypes[];
  assetTypes: ContentTypes[];
  contentTypes: ContentTypes[];
  courseRelatedTypes: ContentTypes[];
  dialogRelatedTypes: ContentTypes[];
  wordGrammaticalTypes: ContentTypes[];
}

export class ContentTranslationMatch {
  languageId?: number;
  translationSourceId?: number;
  text?: string;
  contentId?: number;
  contentTranslationTypeId?: number;
  translationId?: number;
}

export class ContentTranslationItem {
  contentId: number;
  contentTranslationTypeId: number;
  translationId?: number;
  contentTranslationMatchId?: number;
  text: string;
  language: string;
}

export class ContentTranlationType {
  id: number;
  name: string;
}

export class ContentTranlationReferences {
  languages: ContentTranlationType[];
  translationSources: ContentTranlationType[];
  translationTypes: ContentTranlationType[];
}

export class ContentTranslations {
  contentTranslationList: ContentTranslationItem[];
}

export class ContentLanguages {
  languagesByLocalizations: {string: string};
}

export class ContentWordList {
  wordToWordLists: {number: number[]};
}

export class ContentWordListDetails {
  wordLists: WordListDetails[];
}

export const xWordToWord = (xWord: XWord): Partial<Word> => {
  return {
    wordRootID: xWord.wordAdapter.wordRootId,
    wordHeadID: xWord.wordAdapter.wordHeadId,
    wordInstanceID: xWord.wordAdapter.wordInstanceId,
    orthography: xWord.xWordInstance.label,
    difficultyLevel: xWord.xWordFamily.difficultyLevel,
    audioURL: xWord.asset.assetUrl,
    partOfSpeech: xWord.partOfSpeech,
    definitionEn: xWord.xWordDefinition.longForm,
    definition: xWord.xWordDefinition.longForm,
    example: xWord.xWordExample.example,
    canonicalDialogLineId: xWord.canonicalDialogLineId,
    usageCount: xWord.xSharedMeaning.usageCount,
    pronunciation: xWord.xWordPronunciation.phonemes
  };
};

export const xWordToWordV1 = (xWord: XWord): Partial<WordV1> => {
  return {
    id: xWord.id,
    wordInstanceId: xWord.xWordInstance.id,
    wordRootId: xWord.xWordRoot.id,
    sharedMeaningId: xWord.xSharedMeaning.id,
    wordFamilyId: xWord.xWordFamily.id,
    wordDefinitionId: xWord.xWordDefinition.id,
    label: xWord.xWordInstance.label,
    wordRootLabel: xWord.xWordRoot.label,
    difficultyLevel: xWord.xSharedMeaning.difficultyLevel,
    audioURL: xWord.asset.assetUrl,
    partOfSpeech: xWord.partOfSpeech,
    definitionEn: xWord.xWordDefinition.longForm,
    definition: xWord.xWordDefinition.longFormTranslated,
    translation: xWord.translation,
    example: xWord.xWordExample.example,
    canonicalDialogLineId: xWord.canonicalDialogLineId,
    pronunciation: xWord.xWordPronunciation,
    usageCount: xWord.xSharedMeaning.usageCount,
    wordAdapter: xWord.wordAdapter
  };
};

// not required at all since all the properties exist directly
// it can be said that xWordDetail = WordV1 in terms of type conversion
export const xWordDetailToWordV1 = (wordDetail: XWordDetail): Partial<WordV1> => {
  return {
    id: wordDetail.id,
    wordInstanceId: wordDetail.wordInstanceId,
    wordRootId: wordDetail.wordRootId,
    sharedMeaningId: wordDetail.sharedMeaningId,
    wordFamilyId: wordDetail.wordFamilyId,
    wordDefinitionId: wordDetail.wordDefinitionId,
    label: wordDetail.label,
    wordRootLabel: wordDetail.wordRootLabel,
    difficultyLevel: wordDetail.difficultyLevel,
    audioURL: wordDetail.audioURL,
    partOfSpeech: wordDetail.partOfSpeech,
    definitionEn: wordDetail.definitionEn,
    definition: wordDetail.definition,
    example: wordDetail.example,
    canonicalDialogLineId: wordDetail.canonicalDialogLineId,
    pronunciation: wordDetail.pronunciation,
    usageCount: wordDetail.usageCount,
    wordAdapter: wordDetail.wordAdapter
  };
};

export const wordToWordV1 = (word: Word): Partial<WordV1> | undefined => {
  if (!word) {
    return undefined;
  }
  return {
    label: word.orthography,
    partOfSpeech: word.partOfSpeech,
    usageCount: word.usageCount,
    definition: word.definition || word.definitionEn,
    difficultyLevel: word.difficultyLevel,
    phonemes: word.pronunciation,
    wordAdapter: {
      audioURL: word.audioURL,
      wordInstanceId: word.wordInstanceID,
      wordHeadId: word.wordHeadID,
      wordRootId: word.wordRootID,
      wordRootDefinitionId: word.wordRootDefinitionID
    }
  };
};
