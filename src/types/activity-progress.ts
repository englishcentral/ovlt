import { TranscriptionWord } from "./transcription";
import { SpeechFeedback } from "./speech-feedback";
import { TranscriptionResultResponse } from "./transcription-result";


export const LEVEL_QUIZ_FINAL_BAND_THRESHOLD = 0.90;
export const LEVEL_QUIZ_GOOD_THRESHOLD = 0.95;
export const LEVEL_QUIZ_AVERAGE_THRESHOLD = 0.85;

export class BaseProgress {
  started?: boolean;
  completed?: boolean;
  activityID: number;
  activityTypeID: number;
}

export class ActivityProgress extends BaseProgress {
  activityPoints: number;
  activityType?: string; //learnActivity, watchActivity, or speakActivity
  activityProgress?: number;
  grade?: string;
  score?: number;
  scoreIsConfident?: boolean;
  watchedDialogLines?: WatchedDialogLineProgressDetail[];
  learnedDialogLines?: LearnedDialogLineProgressDetailV1[];
  spokenDialogLines?: SpokenDialogLineProgressDetail[];
  watchedComprehensionQuestions?: ComprehensionDialogLineProgressDetail[];
  submittedQuestionIds?: number[];
}

export class WatchedDialogLineProgressDetail {
  dialogLineID: number;
}

export class LearnedDialogLineProgressDetail {
  dialogLineID: number;
  learnedDialogLineProgress: number;
  learnedWords: LearnWordProgress[];
}

export class LearnedDialogLineProgressDetailV1 {
  dialogLineID: number;
  learnedDialogLineProgress: number;
  dialogLineType: string;
  learnedWords: LearnWordProgressV1[];
}

export class LearnWordProgress {
  wordHeadID: number;
  wordRootID: number;
  wordInstanceID: number;
  dialogLineID: number;
  completed?: boolean;
  incorrect?: boolean;
  version?: string;
  sequence?: number;
}

export class LearnWordProgressV1 {
  wordId: number;
  sharedMeaningId: number;
  completed?: boolean;
  incorrect?: boolean;
  version?: string;
}

export class SpokenDialogLineProgressDetail {
  dialogLineID: number;
  grade: string;
  pointsScored: number;
  recognitionResultXmlURL: string;
  score: number;
  sequence?: number;
  transcript?: string;
  linePoints?: number;
  pointsMax?: number;
  token?: TranscriptionWord;
}

export class PunctuationToken {
  label: string;
  sequenceID: number;
  type: string;
}

export class DialogLineToken {
  blacklistedLine?: boolean;
  dialogLineID?: number;
  id?: number;
  pointsMax?: number;
  punctuations?: PunctuationToken[];
  punctuationTokens?: PunctuationToken[];
  tokens?: TranscriptionWord[];
  wordDetails?: TranscriptionWord[];
  transcript: string;
}

export class DialogLineTokens {
  dialogLines: DialogLineToken[];
}

export class ComprehensionDialogLineProgressDetail {
  correct: boolean;
  activityID: number;
  questionID: number;
  selectedAnswerID: number;
}

export class ChatModeProgress {
  activityId: number;
  activityTypeId?: number;
  accountId: number;
  dialogId: number;
  questionDetails: ChatModeQuestionDetail[];
}

class ChatModeQuestionDetail {
  questionId: number;
  audioUrl: string;
  machineTranscript: string;
  userCorrected: string;
  speechFeedback: Partial<SpeechFeedback>;
  transcriptionData?: TranscriptionResultResponse;
}

export class ModeProgressUpdate {
  activityTypeId: number;
  progress: number;
}

export class ModeGradeUpdate {
  activityTypeId: number;
  grade: string;
}

export class ModeProgress {
  progress: number;
  completed?: boolean;
  firstCompletion: boolean;
}
