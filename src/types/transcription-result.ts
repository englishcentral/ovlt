import { concat, isEmpty, isUndefined, map, pick, sortBy, split, uniqBy } from "lodash-es";
import { SpeechFeedback, WordFeedbackList } from "./speech-feedback";
import { RecognizerStatus } from "./recognizer-result";

export class TranscriptionResultStream {
  continue?: boolean;
  throwable?: string;
  transcriptionResult?: TranscriptionResultResponse;
}

export const FEEDBACK_NATIVENESS = "nativenessScore";
export const FEEDBACK_FLUENCY = "fluencyFeedback";
export const FEEDBACK_GRAMMAR = "grammarFeedback";
export const FEEDBACK_VOCABULARY = "vocabularyFeedback";
export const FEEDBACK_WORDS_PER_MINUTE = "wordsPerMinute";
export const FEEDBACK_SYLLABLES_PER_SECOND = "syllablesPerSecond";

const THRESHOLD_SLOWER_THAN_NATIVE = 100;
const THRESHOLD_FASTER_THAN_NATIVE = 150;

export const FEEDBACK_KEYS = [
  FEEDBACK_NATIVENESS,
  FEEDBACK_FLUENCY,
  FEEDBACK_GRAMMAR,
  FEEDBACK_VOCABULARY,
  FEEDBACK_WORDS_PER_MINUTE,
  FEEDBACK_SYLLABLES_PER_SECOND
];
const MAX_VOCAB_LEVEL = 7;
export type Dictionary<T> = Record<any, T>;
export type NumericDictionary<T> = Record<number, T>;

export class TranscriptionResult {
  private transcriptionWords: TranscriptionDisplay[] = [];
  private possibleWordsSet: Dictionary<string[]> = {}; //Dictionary for IE purposes for now
  private originalTranscriptionText: string;
  private currentTranscriptionText: string;
  private feedback?: Partial<SpeechFeedback>;
  private audioUrl: string;
  private rawResult?: TranscriptionResultResponse;
  private recognizerStatus: RecognizerStatus;

  constructor(transcriptionResultStream?: TranscriptionResultStream) {
    const confusionNetwork = transcriptionResultStream?.transcriptionResult?.words ?? [];
    const words = split(transcriptionResultStream?.transcriptionResult?.transcribedText ?? "", " ");
    this.rawResult = transcriptionResultStream?.transcriptionResult;
    this.transcriptionWords = map(words, (word, index) => {
      const network = confusionNetwork[index];
      return new TranscriptionDisplay(word, network?.alt ?? []);
    });
    this.possibleWordsSet = this.transcriptionWords.reduce((acc, transcriptionDisplay) => {
      let currentWord = transcriptionDisplay.getDisplayText().toLowerCase();
      if (!acc[currentWord]) {
        acc[currentWord] = transcriptionDisplay.getPossibleWords();
        return acc;
      }

      acc[currentWord] = uniqBy(concat(acc[currentWord], transcriptionDisplay.getPossibleWords()), "word");
      return acc;
    }, this.possibleWordsSet);
    this.originalTranscriptionText = this.getCurrentTranscription();
    this.setCurrentTranscriptionText(this.originalTranscriptionText);

    this.audioUrl = transcriptionResultStream?.transcriptionResult?.audioUrl;

    this.recognizerStatus = new RecognizerStatus(this.rawResult?.rejectionCode, this.rawResult?.warningCode);
  }

  getRawResult(): TranscriptionResultResponse | undefined {
    return this.rawResult;
  }

  appendPossibleWordsSet(word: string, possibleWords: string[]): void {
    let normalizedKey = word.toLowerCase();
    if (this.possibleWordsSet[normalizedKey]) {
      return;
    }
    this.possibleWordsSet[normalizedKey] = possibleWords;
  }

  getAudioUrl(): string {
    return this.audioUrl;
  }

  setFeedback(rawFeedback: Partial<SpeechFeedback>): void {
    this.feedback = pick(rawFeedback, FEEDBACK_KEYS);
  }

  getFeedback(): Partial<SpeechFeedback> | undefined {
    return this.feedback;
  }

  getNativenessScore(): number | undefined {
    return this.feedback[FEEDBACK_NATIVENESS];
  }

  getFluencyScore(): number | undefined {
    return this.feedback[FEEDBACK_FLUENCY]?.score;
  }

  getGrammarScore(): number | undefined {
    return this.feedback[FEEDBACK_GRAMMAR]?.score;
  }

  getVocabularyLevel(): number | undefined {
    return this.feedback[FEEDBACK_VOCABULARY]?.vocabularyLevel;
  }

  getVocabularyLevelScore(): number | undefined {
    return (this.getVocabularyLevel() ?? 0) / MAX_VOCAB_LEVEL;
  }

  getWordFeedbackList(): WordFeedbackList[] {
    return sortBy(this.feedback[FEEDBACK_VOCABULARY]?.wordFeedbackList, "level").reverse();
  }

  hasWordFeedbackList(): boolean {
    return !isUndefined(this.getWordFeedbackList()) && !isEmpty(this.getWordFeedbackList());
  }

  getWordCountFeatureScore(): number {
    return this.feedback[FEEDBACK_FLUENCY]?.subScores.wordCount?.score;
  }

  getWordCountFeatureStatus(): number {
    return this.feedback[FEEDBACK_FLUENCY]?.subScores.wordCount?.status;
  }

  getSpeechRateFeatureScore(): number {
    return this.feedback[FEEDBACK_FLUENCY]?.subScores.speechRate?.score;
  }

  getSpeechRateFeatureStatus(): number {
    return this.feedback[FEEDBACK_FLUENCY]?.subScores.speechRate?.status;
  }

  getPausingFeatureScore(): number {
    return this.feedback[FEEDBACK_FLUENCY]?.subScores.pauses?.score;
  }

  getPausingFeatureStatus(): number {
    return this.feedback[FEEDBACK_FLUENCY]?.subScores.pauses?.status;
  }

  getRepetitionFeatureScore(): number {
    return this.feedback[FEEDBACK_FLUENCY]?.subScores.repetition?.score;
  }

  getRepetitionFeatureStatus(): number {
    return this.feedback[FEEDBACK_FLUENCY]?.subScores.repetition?.status;
  }

  getSelfCorrectionFeatureScore(): number {
    return this.feedback[FEEDBACK_FLUENCY]?.subScores.selfCorrection?.score;
  }

  getSelfCorrectionFeatureStatus(): number {
    return this.feedback[FEEDBACK_FLUENCY]?.subScores.selfCorrection?.status;
  }

  getFillerWordFeatureScore(): number {
    return this.feedback[FEEDBACK_FLUENCY]?.subScores.fillerWords?.score;
  }

  getFillerWordFeatureStatus(): number {
    return this.feedback[FEEDBACK_FLUENCY]?.subScores.fillerWords?.status;
  }

  getWordsPerMinuteAccount(): number {
    return this.feedback[FEEDBACK_WORDS_PER_MINUTE]?.wordsPerMinuteAccount;
  }

  getWordsPerMinuteNative(): number {
    return this.feedback[FEEDBACK_WORDS_PER_MINUTE]?.wordsPerMinuteNative;
  }

  isWordCountExcessive(): boolean {
    return this.getWordCountFeatureStatus() === 0;
  }

  isWordCountEnough(): boolean {
    return this.getWordCountFeatureStatus() === 1;
  }

  isWordCountInsufficient(): boolean {
    return this.getWordCountFeatureStatus() === 2;
  }

  isSpeechRateVeryFast(): boolean {
    return this.getSpeechRateFeatureStatus() === 0;
  }

  isSpeechRateFast(): boolean {
    return this.getSpeechRateFeatureStatus() === 1;
  }

  isSpeechRateSlow(): boolean {
    return this.getSpeechRateFeatureStatus() === 2;
  }

  isSpeechRateVerySlow(): boolean {
    return this.getSpeechRateFeatureStatus() === 3;
  }

  isNoPauseDetected(): boolean {
    return this.getPausingFeatureStatus() === 0;
  }

  isFewPauseDetected(): boolean {
    return this.getPausingFeatureStatus() === 1;
  }

  isManyPauseDetected(): boolean {
    return this.getPausingFeatureStatus() === 2;
  }

  isNoRepetitionDetected(): boolean {
    return this.getRepetitionFeatureStatus() === 0;
  }

  isRepetitionDetected(): boolean {
    return this.getRepetitionFeatureStatus() === 1;
  }

  isNoSelfCorrectionDetected(): boolean {
    return this.getSelfCorrectionFeatureStatus() === 0;
  }

  isSelfCorrectionDetected(): boolean {
    return this.getSelfCorrectionFeatureStatus() === 1;
  }

  isNoFillerWordsDetected(): boolean {
    return this.getFillerWordFeatureStatus() === 0;
  }

  isFillerWordsDetected(): boolean {
    return this.getFillerWordFeatureStatus() === 1;
  }

  isSignificantlySlowerThanNative(): boolean {
    return this.getWordsPerMinuteAccount() <= THRESHOLD_SLOWER_THAN_NATIVE;
  }

  isSlightlySlowerThanNative(): boolean {
    return this.getWordsPerMinuteAccount() > THRESHOLD_SLOWER_THAN_NATIVE && !this.isSimilarToNative();
  }

  isSimilarToNative(): boolean {
    return this.getWordsPerMinuteAccount() > THRESHOLD_FASTER_THAN_NATIVE;
  }

  getWords(): TranscriptionDisplay[] {
    return this.transcriptionWords;
  }

  resetTranscriptionText(): void {
    this.setCurrentTranscriptionText(this.originalTranscriptionText);
  }

  // 1:1 mode
  getCurrentTranscription(): string {
    return this.transcriptionWords.map(transcriptionWord => transcriptionWord.getDisplayText()).join(" ");
  }

  // freeform mode
  setCurrentTranscriptionText(transcript: string): void {
    this.currentTranscriptionText = transcript;
  }

  getCurrentTranscriptionText(): string {
    return this.currentTranscriptionText;
  }

  getPossibleWordsByOrthography(word: string): string[] {
    let possibleWords = this.possibleWordsSet[word.toLowerCase()];
    if (!possibleWords || !possibleWords.length) {
      return [word];
    }
    return possibleWords;
  }

  getOriginalTranscriptionText(): string {
    return this.originalTranscriptionText;
  }

  // speech related section below
  getAudioLevelCount(): number | undefined {
    return this.rawResult?.audioLevelCount;
  }

  getAverageVoiceLevel(): number | undefined {
    return this.rawResult?.averageVoiceLevel;
  }

  getNewGain(): number | undefined {
    return this.rawResult?.newGain;
  }

  isRejected(): boolean {
    return this.rawResult?.rejected ?? false;
  }

  getRecognizerStatus(): RecognizerStatus {
    return this.recognizerStatus;
  }
}

export class TranscriptionDisplay {
  constructor(private displayText: string,
              private possibleWords: string[]) {

  }

  getDisplayText(): string {
    return this.displayText;
  }

  setDisplayText(text: string): void {
    this.displayText = text;
  }

  getPossibleWords(): string[] {
    return this.possibleWords;
  }
}

export class TranscriptionResultResponse {
  audioUrl: string;
  transcribedText: string;
  newGain?: number;
  rejected?: boolean;
  rejectionCode?: number;
  status?: number;
  warningCode?: number;
  audioLevelCount?: number;
  averageVoiceLevel?: number;
  accountId?: number;
  activityId?: number;
  activityTypeId?: number;
  questionId?: number;
  words: PossibleWord[];
}

export class PossibleWord {
  start: number;
  end: number;
  label: string;
  alt: string[];
  prob: number;
  silence: boolean;
  nativeness: number;
  phones: any; //TBD
}
