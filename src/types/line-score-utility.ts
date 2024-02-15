import { find } from "lodash-es";

export class LineScoreUtility {
  static THRESHOLD_GOOD = 0.8;
  static THRESHOLD_AVERAGE = 0.3;
  static THRESHOLD_PERFECT = 1;

  static readonly LETTER_GRADE_GOOD = ["A+", "A"];
  static readonly LETTER_GRADE_AVERAGE = ["B+", "B", "C+", "C"];

  static readonly LETTER_GRADE_THRESHOLD = [
    {grade: "A+", lowerLimit: 0.9},
    {grade: "A", lowerLimit: 0.93},
    {grade: "B+", lowerLimit: 0.85},
    {grade: "B", lowerLimit: 0.77},
    {grade: "C+", lowerLimit: 0.67},
    {grade: "C", lowerLimit: 0.56},
    {grade: "D", lowerLimit: 0.54},
    {grade: "F", lowerLimit: 0}
  ];

  static isScorePerfect(score: number): boolean {
    return score >= LineScoreUtility.THRESHOLD_PERFECT;
  }

  static isScoreGood(score: number): boolean {
    return score >= LineScoreUtility.THRESHOLD_GOOD;
  }

  static isScoreAverage(score: number): boolean {
    return score < LineScoreUtility.THRESHOLD_GOOD
      && score >= LineScoreUtility.THRESHOLD_AVERAGE;
  }

  static isScoreWeak(score: number): boolean {
    return score < LineScoreUtility.THRESHOLD_AVERAGE;
  }

  static toPercentageString(percentage: number): string {
    return LineScoreUtility.toPercentage(percentage).toString() + "%";
  }

  static toPercentage(percentage: number): number {
    return Math.round(percentage * 100);
  }

  static isLetterGradeGood(grade: string): boolean {
    return LineScoreUtility.LETTER_GRADE_GOOD.indexOf(grade) > -1;
  }

  static isLetterGradeAverage(grade: string): boolean {
    return LineScoreUtility.LETTER_GRADE_AVERAGE.indexOf(grade) > -1;
  }

  static isLetterGradeWeak(grade: string): boolean {
    return !LineScoreUtility.isLetterGradeGood(grade) && !LineScoreUtility.isLetterGradeAverage(grade);
  }

  static getLetterGradeFromLinePoints(score: number): string {
    let grade = find(LineScoreUtility.LETTER_GRADE_THRESHOLD, (grade) => {
      return score > grade.lowerLimit;
    });
    return grade.grade;
  }

}
