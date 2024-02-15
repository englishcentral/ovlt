import { filter, find, isEmpty, isUndefined, some } from "lodash-es";
import { WordV1 } from "./word-v1";
import { PhonemeRating, RatingCandidate, RatingValue } from "./rating-candidate";

export class TranscriptionWord extends WordV1 {
  isDeletion?: boolean;
  oldRatingValueId?: number;
  playBack?: any;
  playBackRecording?: any;
  played?: boolean;
  ratingId?: number;
  ratingCandidateId?: number;
  ratingShown?: boolean;
  recordingUrl?: string;
  startIndex?: number;
  state?: string;
  stressSyllable?: boolean;
  stressWord?: boolean;
  transcriptionValueID?: number;
  wordInstanceID?: number;
  wordStartTime?: number;
  wordEndTime?: number;
  wordSequence?: number;
  wordInstance?: TranscriptionWordInstance;
}

// This still uses Bridge Word Format
export class TranscriptionWordInstance {
  difficultyLevel: number;
  isMultiWord: boolean;
  language: string;
  orthography: string;
  partOfSpeech: string;
  pronunciation: string;
  wordInstanceID: number;
  state?: string;
}

export class TranscriptionViewType {
  label?: string;
  id?: number | string;
  value?: boolean | number | string;
}

export class Transcription {
  static readonly SEARCH_TYPE_DIALOGID = "DialogID";
  static readonly SEARCH_TYPE_LINEID = "LineID";
  static readonly SEARCH_TYPE_WORD = "Word Label";
  static readonly SEARCH_TYPE_ACCOUNTID = "AccountID";
  static readonly SEARCH_TYPE_SUBSCRIPTION_TYPE = "Subscription Type";
  static readonly SEARCH_TYPE_PARTNERID = "PartnerID";
  static readonly SEARCH_TYPE_CLASSID = "ClassID";
  static readonly SEARCH_TYPE_SET = "Set";
  static readonly SEARCH_TYPE_ALL = "All";
  static readonly STATUS_TYPE_UNRATED = "Unrated";
  static readonly STATUS_TYPE_RATED_ONCE = "Rated Once";
  static readonly STATUS_TYPE_RATED_TWICE = "Rated Twice";
  static readonly SUBSCRIPTION_TYPE_SELF_STUDY = 32;
  static readonly SUBSCRIPTION_TYPE_BASIC = 0;
  static readonly LINE_TYPE_UNRATED = "Unrated Lines";
  static readonly LINE_TYPE_RATED = "Rated (All)";
  static readonly LINE_TYPE_RATED_40 = "Rated (≤ 40%)";
  static readonly LINE_TYPE_RATED_50 = "Rated (≤ 50%)";
  static readonly BUCKET_TRESHHOLD_40 = 0.4;
  static readonly BUCKET_TRESHHOLD_50 = 0.5;
  static readonly RATING_REVIEWED = "reviewed";
  static readonly RATING_UNREVIEWED = "unreviewed";

  static lineType: TranscriptionViewType[] = [
    { label: "Unrated Lines", value: false },
    { label: "Rated Lines", value: true }
  ];

  static lineScoreType: TranscriptionViewType[] = [
    { label: "Show Line Scores 0-10", value: false },
    { label: "Hide Line Scores 0-10", value: true }
  ];

  static ratingTypes: TranscriptionViewType[] = [
    { label: "Speak Mode", value: undefined },
    { label: "Chat", value: RatingValue.ACTIVITY_TYPE_CHAT }
  ];

  static searchOptions: string[] = [
    Transcription.SEARCH_TYPE_ACCOUNTID,
    Transcription.SEARCH_TYPE_SUBSCRIPTION_TYPE,
    Transcription.SEARCH_TYPE_PARTNERID,
    Transcription.SEARCH_TYPE_CLASSID,
    Transcription.SEARCH_TYPE_SET
  ];

  static candidateSearchOptions: string[] = [
    Transcription.SEARCH_TYPE_WORD,
    Transcription.SEARCH_TYPE_DIALOGID,
    Transcription.SEARCH_TYPE_LINEID
  ];

  static statusOptions: string[] = [
    Transcription.STATUS_TYPE_UNRATED,
    Transcription.STATUS_TYPE_RATED_ONCE,
    Transcription.STATUS_TYPE_RATED_TWICE
  ];

  static subscriptionTypeOptions: TranscriptionViewType[] = [
    { id: Transcription.SUBSCRIPTION_TYPE_SELF_STUDY, value: "Self-Study" },
    { id: Transcription.SUBSCRIPTION_TYPE_BASIC, value: "Basic" }
  ];

  static lineRatingOptions: TranscriptionViewType[] = [
    { id: Transcription.LINE_TYPE_UNRATED, label: Transcription.LINE_TYPE_UNRATED },
    { id: Transcription.LINE_TYPE_RATED, label: Transcription.LINE_TYPE_RATED },
    { id: Transcription.LINE_TYPE_RATED_40, label: Transcription.LINE_TYPE_RATED_40, value: Transcription.BUCKET_TRESHHOLD_40 }
  ];

  static isMissingPhonemeOrStress(word: TranscriptionWord): boolean {
    let hasRating = isUndefined(word.ratingPhonemes) ? [] : filter(word.ratingPhonemes, token => {
      return !PhonemeRating.isRatingGood(token.ratingValueId);
    });

    return RatingCandidate.isStudyWordBadPron(word.ratingValueId) && isEmpty(hasRating);
  }

  static isMissingPhonemeOrStressWords(words: TranscriptionWord[]): boolean {
    let missingMarkings = false;

    some(words, word => {
      missingMarkings = Transcription.isMissingPhonemeOrStress(word);
      return missingMarkings;
    });

    return missingMarkings;
  }

  static getBucketThresholdNone(): TranscriptionViewType {
    return find(Transcription.lineRatingOptions, { id: Transcription.LINE_TYPE_RATED});
  }

  static getBucketThreshold40(): TranscriptionViewType {
    return find(Transcription.lineRatingOptions, { id: Transcription.LINE_TYPE_RATED_40});
  }
}
