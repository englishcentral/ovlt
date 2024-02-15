import { isEqual } from "lodash-es";

export class MyWordStateV1 {
  static ALL = "all";
  static FAVORITES = "favorites";
  static SORT_FAVORITES = "favorited";
  static SORT_ALPHABETICAL = "alphabetical";
  static SORT_DIFFICULTY = "difficulty";
  static KNOWN = "known";
  static MASTERED = "mastered";
  static MISSED = "missed";
  static RECOMMENDED = "recommended";
  static PROGRESS = "progress";
  static QUIZZED = "quizzed";
  static READY = "ready";
  static APPLY_EXCLUSIONS = "all,ready";

  all?: number;
  favorites?: number;
  known?: number;
  mastered?: number;
  missed?: number;
  recommended?: number;
  progress?: number;
  quizzed?: number;
  ready?: number;


  static isAll(value): boolean {
    return isEqual(MyWordStateV1.ALL, value);
  }

  static isFavorites(value): boolean {
    return isEqual(MyWordStateV1.FAVORITES, value);
  }

  static isKnown(value): boolean {
    return isEqual(MyWordStateV1.KNOWN, value);
  }

  static isMastered(value): boolean {
    return isEqual(MyWordStateV1.MASTERED, value);
  }

  static isMissed(value): boolean {
    return isEqual(MyWordStateV1.MISSED, value);
  }

  static isRecommended(value): boolean {
    return isEqual(MyWordStateV1.RECOMMENDED, value);
  }

  static isProgress(value): boolean {
    return isEqual(MyWordStateV1.PROGRESS, value);
  }

  static isQuizzed(value): boolean {
    return isEqual(MyWordStateV1.QUIZZED, value);
  }

  static isReady(value): boolean {
    return isEqual(MyWordStateV1.READY, value);
  }
}
