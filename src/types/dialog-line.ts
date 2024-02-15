import { CmsWord, Word } from "./word";
import { isEmpty, isUndefined } from "lodash-es";
import { Character } from "./character";
import { DialogLineToken } from "./activity-progress";
import { XWordDetail } from "./x-word";
import { RatingCandidate } from "./rating-candidate";

export class DialogLine {
  cueStart: number;
  cueEnd: number;
  dialogID: number;
  dialogLineID: number;
  dialogTitle: string;
  pointsMax: number;
  sequence: number;
  slowSpeakEnd: number;
  slowSpeakStart: number;
  thumbnailURL: string;
  transcript: string;
  translation: string;
  videoURL: string;
  word?: Word;
  words?: Word[];
  channelOnly?: boolean;
  cliplistOnly?: boolean;
  recognitionResultXmlURL?: string;
  audioUrl?: string;
  sessionLineTimeKey?: number;
  character?: Character;
  token?: DialogLineToken;
  translationSourceId?: number;
}

export class XDialogLine {
  cueStart: number;
  cueEnd: number;
  dialogID: number;
  dialogLineID: number;
  dialogTitle: string;
  pointsMax: number;
  sequence: number;
  slowSpeakEnd: number;
  slowSpeakStart: number;
  thumbnailURL: string;
  transcript: string;
  translation: string;
  videoURL: string;
  wordDetails: XWordDetail[];
  wordDetail: XWordDetail;
  character?: Character;
  channelOnly?: boolean;
  cliplistOnly?: boolean;
  blacklist: boolean;
  canonical: boolean;
}

export class CmsLine {
  Sequence?: number;
  matches?: CmsWord[];
}

export class CmsLinePauseDetectParams {
  dialogLineID?: number;
  end?: number;
  start?: number;
  videoURL?: string;

  dialogLineId?: number;
  wordInstanceId?: number;
  sequence?: number;
  startTime?: number;
  endTime?: number;
}

export class DialogLineSeekBar extends DialogLine {
  style: object;
}

export class DialogLineTranscription extends DialogLine {
  accountID?: number = 0;
  accountPartnerID?: number = 0;
  audioUrl?: string;
  audioURL?: string;
  dialogLineTranscriptionID?: number;
  finalRating?: number = 0;
  firstRating?: number = 0;
  hint?: string;
  isPhonemeMarkingShown?: boolean;
  performance?: number = 0;
  played?: boolean = false;
  ratingShown?: boolean = false;
  state?: string;
  transcriptionValueID?: number;
  stress?: number = 0;
  comment?: string;
  playBack?: any;
  playBackRecording?: any;
  hidden?: boolean;
  sessionLineTimeKey?: number;
  showMoreRatings?: boolean = false;
  ratingCandidateId?: number;
  ratingValueId?: number;
  transcriptId?: number;

  static getAudioURL(line: DialogLineTranscription | RatingCandidate, type: string): string | undefined {
    if (isUndefined(line)) {
      return undefined;
    }

    if (isEmpty(line[type])) {
      return undefined;
    }

    return line[type];
  }

  static getRating(line, ratingType): number {
    if (isUndefined(line[ratingType])) {
      line[ratingType] = 0;
    }

    return line[ratingType];
  }

  static getRatingOptions(): number[] {
    return [5, 4, 3, 2, 1];
  }
}

export class DialogLineReview {
  accountID: number;
  audioURL: string;
  audioUrl: string;
  dateCreated: string;
  dateModified: string;
  dialogID: number;
  dialogLineID: number;
  dialogLineTranscriptionID: number;
  finalRating: number;
  firstRating: number;
  masterReviewed: boolean;
  partnerID: number;
  performance: number;
  stress: number;
  transcriptionValueID: number;
  tutorAccountID: number;
  wordCount: number;
  wordRating: number;
  wordTranscriptions?: any;
  sessionLineTimeKey?: number;
}

export class DialogLineRejected {
  accountID: number;
  dialogID: number;
  dialogLineID: number;
  xmlURL: string;
  audioURL: string;
  dateCreated: string;
}

export class DialogLineDisabled {
  partnerID: number;
  accountID: number;
  dialogID: number;
  dialogLineID: number;
  active: boolean;
  dateCreated: string;
  dateModified: string;
}
