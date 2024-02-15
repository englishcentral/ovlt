// directly maps to services response
// http://reportcard.devenglishcentral.com/documentation/json_WordHeadProgress.html
export class WordHeadProgress {
  wordHeadID: number;
  word: string;
  progress: number;
  difficulty: number;
  isKnown: boolean;
  isFavorite: boolean;
  isReady: boolean;
  missed: boolean;
  readyTimestamp: number;
}

export class SharedWordHeadProgress {
  favorite: boolean;
  known: boolean;
  missed: boolean;
  progress: number;
  ready: boolean;
  recommended: boolean;
  sharedMeaningId: number;
  readyAt: number;
}
