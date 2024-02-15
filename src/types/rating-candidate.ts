import { filter, find, findIndex, includes, isUndefined } from "lodash-es";
import { TranscriptionWord } from "./transcription";
import { Phoneme } from "./phoneme";
import { DialogLineToken } from "./activity-progress";
import { ReadAloudTranscript } from "./speaking-test-read-aloud";

export class RatingScore {
  ratingTypeId?: number;
  score?: number;
}

export class RatingValue {
  static readonly UNRATED = 0;
  static readonly GOOD = 1;
  static readonly BAD = 2;
  static readonly JUNK = 3;
  static readonly QUIET = 4;
  static readonly LOUD = 5;
  static readonly BAD_PRONUNCIATION = 6;
  static readonly BAD_PRONUNCIATION_WORD_STRESS = 16;
  static readonly BAD_PRONUNCIATION_SYLLABLE_STRESS = 17;
  static readonly BAD_PRONUNCIATION_WORD_SYLLABLE_STRESS = 18;
  static readonly INSERTION = 7;
  static readonly CUT_OFF = 8;
  static readonly DELETION = 9;
  static readonly NO_AUDIO = 12;
  static readonly NOISE = 10;
  static readonly SUBSTITUTION = 15;
  static readonly TRANSCRIPT_MISMATCH = 13;
  static readonly CHEAT = 19;

  static readonly ACTIVITY_TYPE_CHAT = 60;

  static readonly UNRATED_CLASS: string = "unreviewed";
  static readonly GOOD_CLASS: string = "studyable";
  static readonly BAD_CLASS: string = "word-bad-pronunciation";
  static readonly BAD_PRONUNCIATION_CLASS: string = "word-bad-unintelligible";
  static readonly JUNK_CLASS: string = "word-bad-unratable";
  static readonly CUT_OFF_CLASS: string = "word-bad-cutOff";
  static readonly DELETION_CLASS: string = "word-bad-deletion";
  static readonly UNDEFINED_CLASS: string = "undefined-class";
  static readonly SUBSTITUTION_CLASS: string = "word-bad-substitution";
  static readonly SPEAKING_TEST_WORD_CLASS: string = "speaking-writing-word-mark";

  static readonly UNRATED_TEXT: string = "unreviewed";
  static readonly GOOD_TEXT: string = "good";
  static readonly BAD_TEXT: string = "bad";
  static readonly JUNK_TEXT: string = "junk";
  static readonly QUIET_TEXT: string = "junk-quiet";
  static readonly LOUD_TEXT: string = "junk-loud";
  static readonly INSERTION_TEXT: string = "insertion";
  static readonly CUTOFF_TEXT: string = "cut-off";
  static readonly NO_AUDIO_TEXT: string = "no-audio";
  static readonly NOISE_TEXT: string = "noise";
  static readonly TRANSCRIPT_MISMATCH_TEXT: string = "transcript-mismatch";
  static readonly CHEAT_TEXT: string = "cheat";

  static readonly INSERTION_LABEL: string = "INSERTION";

  ratingValueId: number;
  state?: string;
  description: string;
  definition?: string;
  display?: string;
}

export class RatingType {
  name: string;
  field: string;
  ratingTypeId: number;
}

export class RatingTypeMatch {
  ratingId: number;
  ratingTypeId: number;
  score: number;
}

export class RatingWord {
  label?: string;
  oldRatingValueId?: number;
  ratingCandidateId?: number;
  ratingId?: number;
  ratingPhonemes?: Phoneme[];
  ratingValueId: number;
  wordInstanceId?: number;
  startIndex?: number;
  sequence?: number;
}

export class RatingCandidate {
  static readonly RATING_ACTIVITY_TYPE_ID = 11;
  static readonly RATING_TYPE_PRONUNCIATION = 1;
  static readonly RATING_TYPE_RHYTHM = 2;
  static readonly RATING_TYPE_INTONATION = 3;
  static readonly RATING_TYPE_FIRST_PASS = 4;
  static readonly RATING_TYPE_FINAL_RATING = 5;
  static readonly RATING_TYPE_LINE_TRANSCRIPT = 6;
  static readonly RATING_TYPE_TRANSCRIBE = 7;
  static readonly RATING_TYPE_MISTAKES = 8;
  static readonly RATING_TYPE_KEYWORDS = 9;
  static readonly RATING_TYPE_CRITERIA = 10;
  static readonly RATING_TYPE_RESULTS = 11;
  static readonly RATING_TYPE_NO_ANSWER = 12;

  static readonly TOOL_TRANSCRIPTION = 0;
  static readonly TOOL_SESSION = 1;
  static readonly TOOL_TEACHER_TOOL = 2;
  static readonly TOOL_SPEAKING_TEST = 3;

  static readonly SCORE_LOWEST = 0.1;
  static readonly SCORE_HIGHEST = 1.0;

  static readonly SCORE_MAIN_LOWEST = 0.11;

  ratingCandidateId?: number;
  ratingCandidateSummaryId?: number;
  ratingValueId?: number;
  accountId?: number;
  accountID?: number;
  activityId?: number;
  activityTypeId?: number;
  dialogLineId?: number;
  dialogLineID?: number;
  insertions?: number[];
  masterRated?: boolean;
  ratingCount?: number;
  ratingList?: Rating[];
  ratingToolId?: number;
  reviewed?: boolean;
  sessionId?: number;
  sequence?: number;
  startIndex?: number;
  token?: DialogLineToken;
  transcript?: string;
  transcriptId?: number;
  transcriptID?: number;
  transcriptMachineGenerated?: string;
  transcriptUserCorrected?: string;
  transcriptWords?: TranscriptionWord[];
  videoURL?: string;
  wordInstanceId?: number;
  wordPronounceDetails?: TranscriptionWord[];
  words?: TranscriptionWord[];

  dateCreated?: string;
  dateModified?: string;

  activityID?: number;
  audioRecordingURL?: string;
  comment?: string;
  correctedText?: string;
  finalRating?: RatingScore;
  firstPass?: RatingScore;
  intonation?: RatingScore;
  rhythm?: RatingScore;
  recordingUrl?: string;
  state?: string;
  description?: string;
  ratingId?: number;
  ratingTypeId?: number;
  score?: number;

  // States (optional)
  played?: boolean;
  ratingShown?: boolean;
  showMoreRatings?: boolean;
  isLineRated?: boolean;
  isPhonemeMarkingShown?: boolean = false;
  playBackRecording?: HTMLAudioElement;
  playBack?: HTMLAudioElement;

  // To be deprecated
  transcriptionValueID?: number;

  static fields: RatingType[] = [
    {name: "firstPass", field: "first-pass", ratingTypeId: 4},
    {name: "intonation", field: "intonation", ratingTypeId: 3},
    {name: "rhythm", field: "rhythm", ratingTypeId: 2},
    {name: "finalRating", field: "final-rating", ratingTypeId: 5}
  ];

  static getLineStates(isChatWizard: boolean = false): RatingValue[] {
    let states = [
      {
        ratingValueId: RatingValue.UNRATED,
        state: RatingValue.UNRATED_TEXT,
        description: "Rate recording",
        display: undefined
      },
      {
        ratingValueId: RatingValue.NOISE,
        state: RatingValue.NOISE_TEXT,
        description: "Noise",
        display: "(Noise)"
      },
      {
        ratingValueId: RatingValue.QUIET,
        state: RatingValue.QUIET_TEXT,
        description: "Junk (Too Quiet)",
        display: "(Too Quiet)"
      },
      {
        ratingValueId: RatingValue.LOUD,
        state: RatingValue.LOUD_TEXT,
        description: "Junk (Too Loud)",
        display: "(Too Loud)"
      },
      {
        ratingValueId: RatingValue.NO_AUDIO,
        state: RatingValue.NO_AUDIO_TEXT,
        description: "No Audio",
        display: "(No Audio)"
      },
      {
        ratingValueId: RatingValue.CHEAT,
        state: RatingValue.CHEAT_TEXT,
        description: "Cheat",
        display: "(Cheat)"
      },
      {
        ratingValueId: RatingValue.JUNK,
        state: RatingValue.JUNK_TEXT,
        description: "Junk",
        display: "(Junk)"
      }
    ];

    if (isChatWizard) {
      states.push({
        ratingValueId: RatingValue.TRANSCRIPT_MISMATCH,
        state: RatingValue.TRANSCRIPT_MISMATCH_TEXT,
        description: "Transcript Mismatch",
        display: "(Transcript Mismatch)"
      });
    }

    return states;
  }

  static getRatingValues(): RatingValue[] {
    let states = [
      {ratingValueId: RatingValue.GOOD, state: RatingValue.GOOD_CLASS, description: "No error", definition: ""},
      {ratingValueId: RatingValue.BAD, state: RatingValue.BAD_CLASS, description: "Bad Pron", definition: "word is understood but has defined pron mistake."},
      {ratingValueId: RatingValue.BAD_PRONUNCIATION, state: RatingValue.BAD_PRONUNCIATION_CLASS, description: "Unintelligible", definition: "user spoke a word but was unintelligible."},
      {ratingValueId: RatingValue.DELETION, state: RatingValue.DELETION_CLASS, description: "Deletion", definition: "word not spoken at all."},
      {ratingValueId: RatingValue.CUT_OFF, state: RatingValue.CUT_OFF_CLASS, description: "Cut-off", definition: "word is partially cut-off or clipped"},
      {ratingValueId: RatingValue.SUBSTITUTION, state: RatingValue.SUBSTITUTION_CLASS, description: "Substitution", definition: "different word is pronounced."},
      {ratingValueId: RatingValue.JUNK, state: RatingValue.JUNK_CLASS, description: "Junk", definition: "sounds not from the user."}
    ];

    return states;
  }

  static getBadState(): RatingValue {
    return find(RatingCandidate.getRatingValues(), {ratingValueId: RatingValue.BAD});
  }

  static getLineScoreValues(): RatingValue[] {
    let states = [
      {ratingValueId: 5, description: "Native speech, with no unintelligible words or unambiguous errors"},
      {ratingValueId: 4, description: "Non-native speech, but with no unintelligible words or unambiguous errors"},
      {ratingValueId: 3, description: "Has at least 1 unintelligible word or unambiguous error"},
      {ratingValueId: 2, description: "Multiple unintelligible words or unambiguous errors"},
      {ratingValueId: 1, description: "Mostly unintelligible"}
    ];

    return states;
  }

  static getNextWordState(ratingValueId: number): RatingValue {
    let states = RatingCandidate.getRatingValues();

    if (isUndefined(ratingValueId)) {
      ratingValueId = states[0].ratingValueId;
    }

    let currentIndex = findIndex(states, state => {
      return state.ratingValueId == ratingValueId;
    });

    if (currentIndex + 1 > states.length - 1) {
      currentIndex = 0;
    } else {
      currentIndex = currentIndex + 1;
    }

    return states[currentIndex];
  }

  static isWordJunk(ratingValueId: number): boolean {
    return ratingValueId == RatingValue.JUNK;
  }

  static isWordCutOff(ratingValueId: number): boolean {
    return ratingValueId == RatingValue.CUT_OFF;
  }

  static isWordDeletion(ratingValueId: number): boolean {
    return ratingValueId == RatingValue.DELETION;
  }

  static isStudyWordExcluded(ratingValueId: number): boolean {
    return includes([
      RatingValue.JUNK,
      RatingValue.CUT_OFF,
      RatingValue.DELETION
    ], ratingValueId);
  }

  static isStudyWordIncluded(ratingValueId: number): boolean {
    return includes([
      RatingValue.BAD,
      RatingValue.BAD_PRONUNCIATION
    ], ratingValueId);
  }

  static isStudyWordGood(ratingValueId: number): boolean {
    return !ratingValueId || ratingValueId == RatingValue.GOOD;
  }

  static isStudyWordBadPron(ratingValueId: number): boolean {
    return ratingValueId == RatingValue.BAD;
  }

  static isBadPronOrStressed(ratingValueId: number): boolean {
    return includes([
      RatingValue.BAD,
      RatingValue.BAD_PRONUNCIATION_WORD_STRESS,
      RatingValue.BAD_PRONUNCIATION_SYLLABLE_STRESS,
      RatingValue.BAD_PRONUNCIATION_WORD_SYLLABLE_STRESS
    ], ratingValueId);
  }

  static isStressed(ratingValueId: number): boolean {
    return includes([
      RatingValue.BAD_PRONUNCIATION_WORD_STRESS,
      RatingValue.BAD_PRONUNCIATION_SYLLABLE_STRESS,
      RatingValue.BAD_PRONUNCIATION_WORD_SYLLABLE_STRESS
    ], ratingValueId);
  }

  static isStudyWordBad(ratingValueId: number): boolean {
    return includes([
      RatingValue.GOOD,
      RatingValue.BAD,
      RatingValue.BAD_PRONUNCIATION
    ], ratingValueId);
  }

  static isLineNotGood(ratingValueId: number): boolean {
    return includes([
      RatingValue.JUNK,
      RatingValue.QUIET,
      RatingValue.LOUD,
      RatingValue.NO_AUDIO,
      RatingValue.NOISE,
      RatingValue.CHEAT
    ], ratingValueId);
  }

  static isLineGood(ratingValueId: number): boolean {
    return !ratingValueId || ratingValueId == RatingValue.GOOD;
  }

  static isLineRated(line: ReadAloudTranscript): boolean {
    if (isUndefined(line.firstPass)) {
      return false;
    }

    if (this.isLineNotGood(line.ratingValueId)) {
      return true;
    }

    return line.firstPass.score > 0;
  }

  static isRatingComplete(line: RatingCandidate): boolean {
    if (line.ratingShown) {
      return true;
    }

    if (line.played && isUndefined(line.firstPass)) {
      return false;
    }

    if (line.played && line.firstPass.score <= 0) {
      return false;
    }

    if (
      RatingCandidate.isAudioPlayed(line) &&
      (
        isUndefined(line.firstPass) ||
        isUndefined(line.intonation) ||
        isUndefined(line.rhythm) ||
        isUndefined(line.finalRating)
      )
    ) {
      return false;
    }

    return RatingCandidate.allScoreEntered(line);
  }

  static isAudioPlayed(line: RatingCandidate): boolean {
    return isUndefined(line.played) ? false : line.played;
  }

  static allScoreEntered(line: RatingCandidate): boolean {
    return (
      line.firstPass &&
      line.firstPass.score > 0 &&
      line.intonation &&
      line.intonation.score > 0 &&
      line.rhythm &&
      line.rhythm.score > 0 &&
      line.finalRating &&
      line.finalRating.score > 0
    ) || RatingCandidate.isLineNotGood(line.ratingValueId);
  }

  static getRating(line: RatingCandidate, ratingType: string): number {
    if (isUndefined(line[ratingType])) {
      line[ratingType] = {score: 0};
    }

    return line[ratingType].score;
  }

  static isRatingIncomplete(line: RatingCandidate): boolean {
    return line.audioRecordingURL &&
      RatingCandidate.getRating(line, "firstPass") &&
      !RatingCandidate.isRatingComplete(line)
      ;
  }

  static areAllLinesRated(lines: RatingCandidate[]): boolean {
    let ratableLines = filter(lines, line => {
      return !isUndefined(line.transcriptId);
    });

    let inComplete = filter(ratableLines, line => {
      return !((
        line.firstPass &&
        line.firstPass.score > 0
      ) || RatingCandidate.isLineNotGood(line.ratingValueId));
    });

    return inComplete.length == 0;
  }
}

export class RatingCandidateFilter {
  activityId?: number;
  activityTypeId?: number;
  bucketThreshold?: number;
  maxRatingCount?: number;
  minRatingCount?: number;
  page: number;
  pageSize: number;
  rated?: boolean;
  ratingSetId?: number;
  accountId?: number;
  reviewed?: boolean;
  startTime?: string;
  endTime?: string;
  lowerScore?: number;
  upperScore: number = RatingCandidate.SCORE_HIGHEST;
  sortByScore?: boolean;
  transcriptId?: number;
  wordLabel?: string;
}

export class PhonemeRating {
  ratingValueId?: number;
  sequence?: number;
  startIndex?: number;
  static getValues(): RatingValue[] {
    return [
      {ratingValueId: RatingValue.GOOD, state: "phoneme-good", description: "Good", definition: ""},
      {ratingValueId: RatingValue.DELETION, state: "phoneme-dropped", description: "Deletion", definition: ""},
      {ratingValueId: RatingValue.BAD, state: "phoneme-substitution", description: "Substitution", definition: ""}
    ];
  }

  static getNextPhonemeState(ratingValueId: number): RatingValue {
    let states = PhonemeRating.getValues();

    if (isUndefined(ratingValueId)) {
      ratingValueId = states[0].ratingValueId;
    }

    let currentIndex = findIndex(states, state => {
      return state.ratingValueId == ratingValueId;
    });

    if (currentIndex + 1 > states.length - 1) {
      currentIndex = 0;
    } else {
      currentIndex = currentIndex + 1;
    }

    return states[currentIndex];
  }

  static isRatingGood(ratingValueId: number): boolean {
    return isUndefined(ratingValueId) || ratingValueId == RatingValue.GOOD;
  }

  static getRatingState(ratingValueId: number): RatingValue {
    let states = PhonemeRating.getValues();
    let state = find(states, { ratingValueId: ratingValueId });
    return state;
  }
}

export class Rating {
  ratingId: number;
  ratingActivityId: number;
  ratingCandidateId: number;
  sessionId?: number;
  comment?: string;
  correctedText?: string;
  ratingSetId?: number;
  ratingValueId?: number;
}

export class DialogRatingCandidate {
  dialogId: number;
  ratingCandidates?: RatingCandidate[];
}
