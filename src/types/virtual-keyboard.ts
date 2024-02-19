export const LETTERS_SET = "lettersSet";
export const NUMBERS_SET = "numbersSet";
export const CHARACTERS_SET = "charactersSet";

export class LetterInput {
    isSpace: boolean;
    isSpecialChar: boolean;
    isReadOnly: boolean;
    isEnabled: boolean = true;
    value: string;
}

export class KeyboardSet {
    topSet: LetterInput[];
    bottomSet: LetterInput[];
    middleSet: LetterInput[];
}
