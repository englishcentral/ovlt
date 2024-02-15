export class TranscriptionValue {
  transcriptionValueID: number;
  name: string;

  static readonly REVIEW_UNRATED: number = 0;
  static readonly REVIEW_GOOD: number = 1;
  static readonly REVIEW_BAD: number = 2;
  static readonly REVIEW_JUNK: number = 3;
  static readonly REVIEW_JUNK_QUIET: number = 4;
  static readonly REVIEW_JUNK_LOUD: number = 5;
  static readonly REVIEW_INSERTION: number = 7;
  static readonly REVIEW_CUTOFF: number = 8;
  static readonly REVIEW_WORD_INSERTION: number = 9;
  static readonly REVIEW_UNRATED_TEXT: string = "unreviewed";
  static readonly REVIEW_GOOD_TEXT: string = "good";
  static readonly REVIEW_BAD_TEXT: string = "bad";
  static readonly REVIEW_JUNK_TEXT: string = "junk";
  static readonly REVIEW_JUNK_TEXT_QUIET: string = "junk-quiet";
  static readonly REVIEW_JUNK_TEXT_LOUD: string = "junk-loud";
  static readonly REVIEW_TEXT_INSERTION: string = "insertion";
  static readonly REVIEW_TEXT_CUTOFF: string = "cut-off";

  static readonly KIRIHARA_REVIEW_UNRATED: number = 0;
  static readonly KIRIHARA_REVIEW_GOOD: number = 1;
  static readonly KIRIHARA_REVIEW_BAD: number = 2;
  static readonly KIRIHARA_REVIEW_BAD_UNINTELLIGIBLE: number = 3;
  static readonly KIRIHARA_JUNK: number = 4;
  static readonly KIRIHARA_CUT_OFF: number = 5;
  static readonly KIRIHARA_NOISE: number = 6;
  static readonly KIRIHARA_NOISE_QUIET: number = 7;
  static readonly KIRIHARA_NOISE_LOUD: number = 8;

  static readonly KIRIHARA_REVIEW_UNRATED_CLASS: string = "unreviewed";
  static readonly KIRIHARA_REVIEW_GOOD_CLASS: string = "studyable";
  static readonly KIRIHARA_REVIEW_BAD_CLASS: string = "word-bad-pronunciation";
  static readonly KIRIHARA_REVIEW_BAD_UNINTELLIGIBLE_CLASS: string = "word-bad-unintelligible";
  static readonly KIRIHARA_JUNK_CLASS: string = "word-bad-unratable";
  static readonly KIRIHARA_CUT_OFF_CLASS: string = "word-bad-cutOff";

  static readonly KIRIHARA_LINE_RATING: KiriharaTranscriptionRatingValues[] = [
    { id: TranscriptionValue.KIRIHARA_REVIEW_GOOD, class: TranscriptionValue.REVIEW_GOOD_TEXT },
    { id: TranscriptionValue.KIRIHARA_NOISE, class: TranscriptionValue.REVIEW_JUNK_TEXT },
    { id: TranscriptionValue.KIRIHARA_NOISE_QUIET, class: TranscriptionValue.REVIEW_JUNK_TEXT_QUIET },
    { id: TranscriptionValue.KIRIHARA_NOISE_LOUD, class: TranscriptionValue.REVIEW_JUNK_TEXT_LOUD }
  ];

  static getKiriharaLineStatesReadAloud(): TranscriptionRating[] {
    return [
      {
        transcriptionValueID: TranscriptionValue.REVIEW_UNRATED,
        state: TranscriptionValue.REVIEW_UNRATED_TEXT,
        hint: "Rate recording"
      },
      {
        transcriptionValueID: TranscriptionValue.KIRIHARA_NOISE,
        state: TranscriptionValue.REVIEW_JUNK_TEXT,
        hint: "Junk (Noise)"
      },
      {
        transcriptionValueID: TranscriptionValue.KIRIHARA_NOISE_QUIET,
        state: TranscriptionValue.REVIEW_JUNK_TEXT_QUIET,
        hint: "Junk (Too Quiet)"
      },
      {
        transcriptionValueID: TranscriptionValue.KIRIHARA_NOISE_LOUD,
        state: TranscriptionValue.REVIEW_JUNK_TEXT_LOUD,
        hint: "Junk (Too Loud)"
      }
    ];
  }
}

export class TranscriptionRating {
  transcriptionValueID: number;
  state: string;
  hint: string;
}

export class KiriharaTranscriptionRatingValues {
  id: number;
  class: string;
}
