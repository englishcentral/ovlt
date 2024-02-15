export class SpeechFeedback {
  accountId: number;
  questionId: number;
  answerTranscript: string;
  questionTranscript: string;
  nativenessScore: number;
  vocabularyFeedback: {
    vocabularyLevel: number;
    wordFeedbackList: WordFeedbackList[];
  };
  fluencyFeedback: {
    status: number;
    score: number;
    subScores: {
      pauses: SpeechSubScore;
      speechRate: SpeechSubScore;
      wordCount: SpeechSubScore;
      repetition: SpeechSubScore;
      fillerWords: SpeechSubScore;
      selfCorrection: SpeechSubScore;
    }
  };
  grammarFeedback: {
    errorRatio: number;
    score: number;
    correctedSentence: string;
  };
  wordsPerMinute: {
    wordsPerMinuteAccount: number,
    wordsPerMinuteNative: number,
  };
  syllablesPerSecond: {
    account: number,
    thresholdFirst: number,
    thresholdSecond: number
  };
}

class SpeechSubScore {
  status: number;
  score: number;
}

export class WordFeedbackList {
  label: string;
  level: number;
}
