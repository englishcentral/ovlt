import { isUndefined, map } from "lodash-es";
import { WordV1 } from "./word-v1";

export const PHONEME_CHARACTERS = {
  AA: "ɑ",
  AE: "æ",
  AH: "ə",
  AO: "ɔ",
  AW: "aʊ",
  AY: "aɪ",
  B: "b",
  CH: "tʃ",
  D: "d",
  DH: "ð",
  EH: "ɛ",
  ER: "ɝ",
  EY: "eɪ",
  F: "f",
  G: "g",
  HH: "h",
  IH: "ɪ",
  IY: "i",
  JH: "dʒ",
  K: "k",
  L: "l",
  M: "m",
  N: "n",
  NG: "ŋ",
  OW: "oʊ",
  OY: "ɔɪ",
  P: "p",
  R: "ɹ",
  S: "s",
  SH: "ʃ",
  T: "t",
  TH: "θ",
  UH: "ʊ",
  UW: "u",
  V: "v",
  W: "w",
  Y: "j",
  Z: "z",
  ZH: "ʒ",
  SIL: "SIL"
};

export class Phoneme {
  index?: number;
  id?: string | number;
  ipa?: string;
  audio?: string;
  isGood?: boolean;
  isBad?: boolean;
  isSilence?: boolean;
  isActive?: boolean;
  label?: string;
  ratingValueId?: number;
  startIndex?: number;
  sequence?: number;
  constructor(phoneme: string, index: number) {
    this.isSilence = phoneme === PHONEME_CHARACTERS.SIL;
    this.index = index;
    this.sequence = index + 1;
    this.id = phoneme;
    this.ipa = Phoneme.getPhonemeSymbol(phoneme);
    this.audio = this.isSilence ? "" : Phoneme.getPhonemeSrc(phoneme);
    this.label = this.isSilence ? "" : this.ipa;
  }

  public static getPhonemeSymbol(phoneme: string): string {
    if (isUndefined(PHONEME_CHARACTERS[phoneme])) {
      return phoneme;
    }
    return PHONEME_CHARACTERS[phoneme];
  }

  public static buildPhonemes(word: WordV1): Phoneme[] {
    const pronunciation = word?.phonemes ?? word?.pronunciation?.phonemes;
    if (!pronunciation) {
      return [];
    }
    const phonemes = pronunciation.split(" ");
    return map(phonemes, (phoneme, index: number) => new Phoneme(phoneme, index));
  }

  public static getPhonemeSrc(phoneme: string): string {
    return "assets/phonemes/" + phoneme + ".mp3";
  }
}
