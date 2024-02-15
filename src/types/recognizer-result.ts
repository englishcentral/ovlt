import { first, head, isEmpty, map, parseInt } from "lodash-es";
import { LineScoreUtility } from "./line-score-utility";
import { DialogLine } from "./dialog-line";
import { Logger } from "../app/common/logger";

export const RECOGNIZER_LEGACY = 0;
export const RECOGNIZER_KALDI = 1;
export const NATIVENESS_STATUS_SUCCESS = 0;
export const VALID_RECOGNIZERS = [RECOGNIZER_LEGACY, RECOGNIZER_KALDI];

export const findFirstValueFromNode = (tagName: string, node?: Element | Document): string => {
  if (!tagName || !node) {
    return "";
  }

  try {
    return node.getElementsByTagName(tagName)[0].childNodes[0].nodeValue || "";
  } catch (e) {
    return "";
  }
};

export const findNodes = (tagName: string, node?: Element | Document): HTMLCollectionBase | undefined => {
  if (!tagName || !node) {
    return undefined;
  }
  return node.getElementsByTagName(tagName);
};

export const findFirstValueFromNodes = (tagName: string, nodes?: HTMLCollectionBase): string => {
  if (!tagName || !nodes || isEmpty(nodes)) {
    return "";
  }

  try {
    return nodes[0].getElementsByTagName(tagName)[0].childNodes[0].nodeValue || "";
  } catch (e) {
    return "";
  }
};

export const REJECTION_NONE = 0;
export const REJECTION_AUDIO_TOO_LOUD = 1;
export const REJECTION_AUDIO_TOO_QUIET = 2;
export const REJECTION_POOR_SNR = 3;
export const REJECTION_JUNK = 4;
export const REJECTION_EMPTY_FILE = 5;
export const REJECTION_NO_VOICE = 6;
export const REJECTION_PAUSING = 7;
export const REJECTION_TOO_LONG = 8;
export const REJECTION_ERROR = 9;
export const REJECTION_NARROW_BAND = 10;
export const REJECTION_SHORT_SENTENCE = 11;
export const REJECTION_WRONG_LANGUAGE = 12;
export const REJECTION_MISMATCH_RECORDING = 13;

export const WARNING_AUDIO_TOO_QUIET = 2;
export const WARNING_NO_VOICE = 6;

export const ERRORCODE_THIRD_PARTY_APPLICATION = 7;
export const ERRORCODE_NONE = 0;


const STATUS_WORD_GOOD = "GOOD";
const STATUS_WORD_WEAK = "BAD";
const STATUS_WORD_IGNORED = "IGNORED";
const STATUS_WORD_BLACKLISTED = "BLACKLIST";

const EVALUATION_MATCH = "MATCH";
const EVALUATION_DELETION = "DELETION";
const EVALUATION_UNINTELLIGIBLE = "UNINTELLIGIBLE";
const EVALUATION_INSERTION = "INSERTION";
const EVALUATION_SUBSTITUTION = "SUBSTITUTION";
const EVALUATION_PAUSE = "PAUSE";

export const CLASSIFIER_STATUSWORD_GOOD = "GOOD";
const CLASSIFIER_STATUSWORD_WEAK = "BAD";
const CLASSIFIER_STATUSWORD_IGNORED = "IGNORED";

const PHONEME_GOOD = "GOOD";
const PHONEME_BAD = "BAD";
const PHONEME_IGNORED = "IGNORED";

const LABEL_SILENCE = "#SIL#";


interface WordJudge {
  isStatusGood(): boolean;

  isStatusAverage(): boolean;

  isStatusBad(): boolean;
}

interface JudgeResult {
  status: string;
  evaluation: string;
  classifierStatus: string;
}

export class LegacyJudge implements WordJudge {
  constructor(private judgeResult: JudgeResult) {
  }

  isStatusGood(): boolean {
    return this.judgeResult.status == STATUS_WORD_GOOD;
  }

  isStatusAverage(): boolean {
    return this.judgeResult.status == STATUS_WORD_WEAK && this.judgeResult.evaluation != EVALUATION_DELETION;
  }

  isStatusBad(): boolean {
    return this.judgeResult.status == STATUS_WORD_WEAK && this.judgeResult.evaluation == EVALUATION_DELETION;
  }

  isStatusIgnored(): boolean {
    return false;
  }
}

export class KaldiJudge implements WordJudge {
  constructor(private judgeResult: JudgeResult) {
  }

  isStatusGood(): boolean {
    return this.judgeResult.classifierStatus == CLASSIFIER_STATUSWORD_GOOD;
  }

  isStatusAverage(): boolean {
    return !this.isStatusIgnored() && !this.isStatusGood() && !this.isEvaluationBad();
  }

  isStatusBad(): boolean {
    return !this.isStatusIgnored() && !this.isStatusGood() && this.isEvaluationBad();
  }

  private isEvaluationBad(): boolean {
    return this.judgeResult.evaluation == EVALUATION_DELETION
      || this.judgeResult.evaluation == EVALUATION_UNINTELLIGIBLE;
  }

  isStatusIgnored(): boolean {
    return this.judgeResult.classifierStatus == CLASSIFIER_STATUSWORD_IGNORED;
  }
}

export class WordResult {
  label: string;
  displayText: string;
  status: string;
  evaluation: string;
  classifierStatus: string;
  startTime: number;
  endTime: number;
  wordID: number;
  wordInstanceID: number;
  pronunciationID: number;
  ignoreWord: boolean;
  hidden: boolean;
  wordJudge: WordJudge;
  phonemes: PhonemeResult[];
  children?: WordResult[];
  sequence?: number;

  constructor(node: Element, recognizerType: number = RECOGNIZER_LEGACY) {
    this.label = findFirstValueFromNode("label", node);
    this.status = findFirstValueFromNode("status", node);
    this.evaluation = findFirstValueFromNode("evaluation", node);
    this.classifierStatus = findFirstValueFromNode("classifierStatus", node);
    this.startTime = parseInt(findFirstValueFromNode("startTime", node));
    this.endTime = parseInt(findFirstValueFromNode("endTime", node));
    this.wordID = parseInt(findFirstValueFromNode("wordID", node));
    this.wordInstanceID = parseInt(findFirstValueFromNode("wordInstanceID", node));
    this.pronunciationID = parseInt(findFirstValueFromNode("pronunciationID", node));
    this.ignoreWord = (findFirstValueFromNode("ignoreWord", node) == "true");
    this.hidden = (findFirstValueFromNode("hidden", node) == "true");

    let judgeResult = {
      status: this.status,
      evaluation: this.evaluation,
      classifierStatus: this.classifierStatus
    };
    this.wordJudge = recognizerType == RECOGNIZER_KALDI
      ? new KaldiJudge(judgeResult)
      : new LegacyJudge(judgeResult);

    let nodeToSearch = node.lastElementChild.tagName == "phonemes"
      ? node.lastElementChild
      : node;
    let phonemeNodes = findNodes("phoneme", nodeToSearch);
    this.phonemes = map(phonemeNodes, node => {
      return new PhonemeResult(node);
    });

    this.children = map(findNodes("recordingSessionWord", node), recordingSessionWordNode => {
      return new WordResult(recordingSessionWordNode);
    }).filter(wordResult => !wordResult.isSilence());
  }

  getOrthography(): string {
    return this.label;
  }

  hasChildren(): boolean {
    return this.getChildren().length > 0;
  }

  getChildren(): WordResult[] {
    return this.children || [];
  }

  isSilence(): boolean {
    return this.label == LABEL_SILENCE;
  }

  isMatch(): boolean {
    return this.evaluation == EVALUATION_MATCH;
  }

  isDeletion(): boolean {
    return this.evaluation == EVALUATION_DELETION;
  }

  isInsertion(): boolean {
    return this.evaluation == EVALUATION_INSERTION;
  }

  isSubstitution(): boolean {
    return this.evaluation == EVALUATION_SUBSTITUTION;
  }

  isPause(): boolean {
    return this.evaluation == EVALUATION_PAUSE;
  }

  isStatusGood(): boolean {
    return this.wordJudge.isStatusGood();
  }

  isStatusAverage(): boolean {
    return this.wordJudge.isStatusAverage();
  }

  isStatusBad(): boolean {
    return this.wordJudge.isStatusBad();
  }

  isStatusIgnored(): boolean {
    return this.status == STATUS_WORD_IGNORED;
  }

  isStatusBlacklisted(): boolean {
    return this.status == STATUS_WORD_BLACKLISTED;
  }

  isClassifierStatusGood(): boolean {
    return this.classifierStatus == CLASSIFIER_STATUSWORD_GOOD;
  }

  isClassifierStatusBad(): boolean {
    return this.classifierStatus == CLASSIFIER_STATUSWORD_WEAK;
  }

  isClassifierStatusIgnored(): boolean {
    return this.classifierStatus == CLASSIFIER_STATUSWORD_IGNORED;
  }

  isPhonemeGood(index: number): boolean {
    if (index >= 0 && index < this.phonemes.length) {
      return this.phonemes[index].status == PHONEME_GOOD;
    }
    return false;
  }

  isPhonemeBad(index: number): boolean {
    if (index >= 0 && index < this.phonemes.length) {
      return this.phonemes[index].status == PHONEME_BAD;
    }
    return false;
  }

  isPhonemeIgnored(index: number): boolean {
    if (index >= 0 && index < this.phonemes.length) {
      return this.phonemes[index].status == PHONEME_IGNORED;
    }
    return false;
  }

  getConfusionMatrix(): string[] {
    return ["test", "confusion", "matrix", "choices", "another", "one", "lorem"];
  }

  getDisplayText(): string {
    return this.displayText ?? this.label;
  }

  setDisplayTest(text: string) {
    this.displayText = text;
  }
}

export class NativenessResult {
  nativenessClass: number;
  nativenessStatus: number;

  constructor(node: Element) {
    this.nativenessClass = parseFloat(findFirstValueFromNode("nativenessClass", node)) || 0;
    this.nativenessStatus = parseInt(findFirstValueFromNode("status", node));
  }
}

export class DeductionResult {
  deletionWords: number;
  substitutionWords: number;
  insertionWords: number;

  constructor(node: Element) {
    this.deletionWords = parseFloat(findFirstValueFromNode("deletionWords", node)) || 0;
    this.substitutionWords = parseFloat(findFirstValueFromNode("substitutionWords", node)) || 0;
    this.insertionWords = parseFloat(findFirstValueFromNode("insertionWords", node)) || 0;
  }
}

export class PhonemeResult {
  label: string;
  status: string;
  evaluation: string;

  constructor(node: Element) {
    this.label = findFirstValueFromNode("label", node);
    this.status = findFirstValueFromNode("status", node);
    this.evaluation = findFirstValueFromNode("evaluation", node);
  }
}

export const STATUS_GOOD = "GOOD";
export const STATUS_WEAK = "WEAK";
export const STATUS_REJECTED = "REJECTED";

export class ComponentScore {
  pronunciationScore?: number;
  fluencyScore?: number;
  completenessScore?: number;
  stressScore?: number;
  rhythmScore?: number;
}

export class RecognizerResult {
  private accountId: number;
  private recognizerType: number = 0;
  private rejected: boolean = false;
  private linePoints: number = 0;
  private maxPoints: number = 0;
  private lineScore: number = 0;
  private allWordsGreen: boolean = false;
  private rejectionCode: number = 0;
  private warningCode: number = 0;
  private errorCode: number = 0;
  private allWords: WordResult[] = [];       //All the word results from the recognizer
  private newGain: number = 0;
  private audioLevelCount: number = 0;
  private averageVoiceLevel: number = 0;
  private streamName: string = "";
  private status: string = "";
  private componentScore: ComponentScore = {};
  private transcript: string = "";
  private nBestText: string = "";

  private xmlUrl: string = "";
  private audioUrl: string = "";
  private sourceUrl: string = "";

  private dialogId: number = 0;
  private dialogLineId: number = 0;

  private pronunciationScore: number = 0;
  private fluencyScore: number = 0;
  private completenessScore: number = 0;
  private stressScore: number = 0;
  private rhythmScore: number = 0;

  private nativeness: NativenessResult;

  private deduction: DeductionResult;

  private logger = new Logger();

  constructor(xml: string) {
    if (!xml) {
      this.logger.log("empty XML document");
      return;
    }

    let parser = new DOMParser();
    let xmlObj: Document;

    try {
      xmlObj = parser.parseFromString(xml, "text/xml");
    } catch (e) {
      this.logger.log("Invalid XML document");
      return;
    }

    let xmlResultObj;
    try {
      xmlResultObj = head(xmlObj.getElementsByTagName("result") || []);
    } catch (e) {
      this.logger.log("cannot get result element from XML");
      return;
    }

    let xmlRequestObj = head(xmlObj.getElementsByTagName("request") || []);
    this.accountId = parseInt(findFirstValueFromNode("accountID", xmlRequestObj));
    this.xmlUrl = findFirstValueFromNode("xmlURL", xmlObj);
    this.recognizerType = parseInt(findFirstValueFromNode("recognizerType", xmlObj)) || 0;
    this.streamName = findFirstValueFromNode("streamName", xmlObj);
    this.dialogId = parseInt(findFirstValueFromNode("dialogID", xmlObj));
    this.dialogLineId = parseInt(findFirstValueFromNode("dialogLineID", xmlObj));
    this.nBestText = findFirstValueFromNode("nbestText", xmlObj);

    let scoreNodes = findNodes("score", xmlResultObj);
    let audioNodes = findNodes("audio", xmlResultObj);
    const nativenessNodes = findNodes("nativeness", xmlResultObj);
    const deductionNodes = findNodes("deduction", xmlResultObj);
    if (scoreNodes) {
      this.status = findFirstValueFromNodes("status", scoreNodes);
      this.rejected = this.status != STATUS_GOOD;
      this.rejectionCode = parseFloat(findFirstValueFromNodes("rejectionCode", scoreNodes)) || 0;
      this.warningCode = parseFloat(findFirstValueFromNodes("warningCode", scoreNodes)) || 0;
      this.errorCode = parseFloat(findFirstValueFromNodes("errorCode", scoreNodes)) || 0;
      this.linePoints = parseInt(findFirstValueFromNodes("linePoints", scoreNodes)) || 0;
      this.maxPoints = parseInt(findFirstValueFromNodes("maxPoints", scoreNodes)) || 0;
      this.lineScore = parseFloat(findFirstValueFromNodes("lineScore", scoreNodes)) || 0;
      this.allWordsGreen = (findFirstValueFromNodes("allWordsGreen", scoreNodes) == "true");
      this.pronunciationScore = parseFloat(findFirstValueFromNodes("pronunciationScore", scoreNodes)) || 0;
      this.fluencyScore = parseFloat(findFirstValueFromNodes("fluencyScore", scoreNodes)) || 0;
      this.completenessScore = parseFloat(findFirstValueFromNodes("completenessScore", scoreNodes)) || 0;
      this.stressScore = parseFloat(findFirstValueFromNodes("stressScore", scoreNodes)) || 0;
      this.rhythmScore = parseFloat(findFirstValueFromNodes("rhythmScore", scoreNodes)) || 0;

      const nodeToSearch = xmlResultObj.lastElementChild.tagName == "score"
        ? xmlResultObj.lastElementChild
        : xmlResultObj;
      const nativenessNodes = findNodes("nativeness", nodeToSearch);
      if (nativenessNodes) {
        this.nativeness = new NativenessResult(first(nativenessNodes));
      }

      const deductionNodes = findNodes("deduction", nodeToSearch);
      if (deductionNodes) {
        this.deduction = new DeductionResult(first(deductionNodes));
      }
    }

    if (audioNodes) {
      this.newGain = parseFloat(findFirstValueFromNodes("newGain", audioNodes)) || 0;
      this.audioLevelCount = parseFloat(findFirstValueFromNodes("audioLevelCount", audioNodes)) || 0;
      this.averageVoiceLevel = parseFloat(findFirstValueFromNodes("averageVoiceLevel", audioNodes)) || 0;
      this.audioUrl = findFirstValueFromNodes("audioURL", audioNodes) || "";
      this.sourceUrl = findFirstValueFromNodes("sourceURL", audioNodes) || "";
    }
    this.generateWords(xmlResultObj);
  }

  getAccountId(): number {
    return this.accountId;
  }

  generateWords(xmlResultObj?: Element): void {
    let wordNodes = findNodes("word", xmlResultObj);
    if (!wordNodes) {
      return;
    }

    this.allWords = map(wordNodes, wordNode => new WordResult(wordNode, this.recognizerType));
  }

  getWordResultList(): WordResult[] {
    return this.allWords;
  }

  findWordsByWordInstanceId(wordInstanceId: number, wordLabel: string): WordResult | undefined {
    return (this.allWords ?? []).find((wordResult) => {
      return wordResult.wordInstanceID === wordInstanceId || wordLabel.toLowerCase() === wordResult.label.toLowerCase();
    });
  }

  isLegacy(): boolean {
    return !this.recognizerType || this.recognizerType == RECOGNIZER_LEGACY;
  }

  isKaldi(): boolean {
    return this.recognizerType == RECOGNIZER_KALDI;
  }

  getLinePoints(): number {
    return this.linePoints;
  }

  getMaxPoints(): number {
    return this.maxPoints;
  }

  getLineScore(): number {
    return this.lineScore;
  }

  getRejectionCode(): number {
    return this.rejectionCode;
  }

  getWarningCode(): number {
    return this.warningCode;
  }

  getErrorCode(): number {
    return this.errorCode;
  }

  getRawLinePercentage(): number {
    return this.lineScore;
  }

  getLinePercentage(): string {
    return LineScoreUtility.toPercentageString(this.getRawLinePercentage());
  }

  getLinePercentageInt(): number {
    return LineScoreUtility.toPercentage(this.getRawLinePercentage());
  }

  getDeletionPercentageInt(): number {
    return LineScoreUtility.toPercentage(this.deduction?.deletionWords);
  }

  getInsertionPercentageInt(): number {
    return LineScoreUtility.toPercentage(this.deduction?.insertionWords);
  }

  getSubstitutionPercentageInt(): number {
    return LineScoreUtility.toPercentage(this.deduction?.substitutionWords);
  }

  getComponentScore(): object {
    return this.componentScore;
  }

  getStatus(): string {
    return this.status;
  }

  isAllWordsGreen(): boolean {
    return this.allWordsGreen;
  }

  isRecordingNotRejected(): boolean {
    return !this.isRecordingRejected();
  }

  isRecordingRejected(): boolean {
    return this.rejected;
  }

  isScorePerfect(): boolean {
    return this.isRecordingNotRejected() && LineScoreUtility.isScorePerfect(this.getRawLinePercentage());
  }

  isScoreGood(): boolean {
    return this.isRecordingNotRejected() && LineScoreUtility.isScoreGood(this.getRawLinePercentage());
  }

  isScoreAverage(): boolean {
    return this.isRecordingNotRejected() && LineScoreUtility.isScoreAverage(this.getRawLinePercentage());
  }

  isScoreWeak(): boolean {
    //BC-52488, display weak points even if rejected
    return LineScoreUtility.isScoreWeak(this.getRawLinePercentage());
  }

  getAudioUrl(): string {
    return this.audioUrl;
  }

  getStreamName(): string {
    return this.streamName;
  }

  getNBestText(): string {
    return this.nBestText;
  }

  getXmlUrl(): string {
    return this.xmlUrl;
  }

  getDialogId(): number {
    return this.dialogId;
  }

  getDialogLineId(): number {
    return this.dialogLineId;
  }

  getNewGain(): number {
    return this.newGain;
  }

  getAudioLevelCount(): number {
    return this.audioLevelCount;
  }

  getAverageVoiceLevel(): number {
    return this.averageVoiceLevel;
  }

  getTranscript(): string {
    return this.transcript;
  }

  getNativenessClass(): number {
    return this.nativeness?.nativenessClass;
  }

  getNativenessStatus(): number {
    return this.nativeness?.nativenessStatus;
  }

  isNativenessStatusSuccess(): boolean {
    return this.getNativenessStatus() === NATIVENESS_STATUS_SUCCESS;
  }

  setTranscript(transcript: string): void {
    this.transcript = transcript || "";
  }

  setLinePoints(linePoints: number): void {
    this.linePoints = linePoints || 0;
  }

  setMaxPoints(maxPoints: number): void {
    this.maxPoints = maxPoints || 0;
  }

  setLineScore(lineScore: number): void {
    this.lineScore = lineScore || 0;
  }

  isErrorCodeThirdPartyApplication(): boolean {
    return this.errorCode == ERRORCODE_THIRD_PARTY_APPLICATION;
  }
}

export class RecognizerResultRecordings {
  dialogLineID?: number;
  activities?: RecognizerResultRecordingsActivities[];
  sessionLineTimeKey?: number;
}

export class RecognizerResultRecordingsActivities {
  spokenDialogLines?: DialogLine[];
}

export class RecognizerStatus {
  constructor(private rejectionCode?: number,
              private warningCode?: number,
              private errorCode?: number) {
  }

  getRejectionCode(): number | undefined {
    return this.rejectionCode;
  }

  getWarningCode(): number | undefined {
    return this.warningCode;
  }

  isRejectionTooLoud(): boolean {
    return this.rejectionCode == REJECTION_AUDIO_TOO_LOUD;
  }

  isRejectionTooQuiet(): boolean {
    return this.rejectionCode == REJECTION_AUDIO_TOO_QUIET;
  }

  isRejectionPoorSnr(): boolean {
    return this.rejectionCode == REJECTION_POOR_SNR;
  }

  isRejectionJunk(): boolean {
    return this.rejectionCode == REJECTION_JUNK;
  }

  isRejectionNoVoice(): boolean {
    return this.rejectionCode == REJECTION_NO_VOICE;
  }

  isRejectionEmptyFile(): boolean {
    return this.rejectionCode == REJECTION_EMPTY_FILE;
  }

  isRejectionError(): boolean {
    return this.rejectionCode == REJECTION_ERROR;
  }

  isRejectionTooLong(): boolean {
    return this.rejectionCode == REJECTION_TOO_LONG;
  }

  isRejectionPausing(): boolean {
    return this.rejectionCode == REJECTION_PAUSING;
  }

  isRejectionNarrowBand(): boolean {
    return this.rejectionCode == REJECTION_NARROW_BAND;
  }

  isRejectionShortSentence(): boolean {
    return this.rejectionCode == REJECTION_SHORT_SENTENCE;
  }

  isRejectionWrongLanguage(): boolean {
    return this.rejectionCode == REJECTION_WRONG_LANGUAGE;
  }

  isRejectionMismatchRecording(): boolean {
    return this.rejectionCode == REJECTION_MISMATCH_RECORDING;
  }

  isWarningNoVoice(): boolean {
    return this.warningCode == WARNING_NO_VOICE;
  }

  isWarningTooQuiet(): boolean {
    return this.warningCode == WARNING_AUDIO_TOO_QUIET;
  }
}
