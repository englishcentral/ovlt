import { WordResult } from "../../../../model/types/speech/recognizer-result";
import { assign, head, isEmpty, map, reduce, split, tail, toLower } from "lodash-es";
import { XWordDetail } from "../../../../model/types/content/x-word";

export class LetterInput {
    isSpace: boolean;
    isSpecialChar: boolean;
    isReadOnly: boolean;
    isEnabled: boolean = true;
    value: string;

    constructor(value: string) {
        this.value = value;
    }
}

export class ExamQuestionModeSettings {
    autoCheck: boolean = false;
    autoCheckOnTyping: boolean = false;
    lockOnCheck: boolean = true;
    autoComplete: boolean = false;
    generateDistractors: boolean = true;
}

export class ExamQuestionCheckAnswer {
    correct?: boolean;
    currentOrthography: string;
    answerSet?: string[];
    typingCorrect?: boolean;
    wordResult?: WordResult;
    accepted: boolean = false;
    rejected?: boolean;
    selectedWord?: XWordDetail;
    timeout?: number;
    quizWord?: XWordDetail;
    skipped?: boolean;
    wordInstanceId?: number;
    wordId?: number;
    courseId?: number;
    correctWordHeadId?: number;
    accountPronunciationWordId?: number;
}

export class ExamQuestionCheckedEvent {
    correct: boolean;
    skipped?: boolean;
    answerSet?: string[];
    typedAnswer?: string;
    spokenAnswer?: string;
    wordResult?: WordResult;
    rejected?: boolean;
    mode?: number;
    audioUrl?: string;
    selectedWord?: XWordDetail;
    timeout?: number;
    phonemes?: string;
    courseId?: number;
    label?: string;
    wordInstanceId?: number;
    wordId?: number;
    accountPronunciationWordId?: number;
}

export class ModeHandlerAbstract {
    protected checked: boolean = false;
    protected skipped: boolean = false;
    protected completed: boolean = false;
    protected answerCorrect: boolean = false;

    protected letterSet: LetterInput[];

    constructor(protected modeSettings: ExamQuestionModeSettings) {

    }

    generateLetterSet(orthography: string = "",
                      hintLength: number = 0,
                      showFirstLetterHint: boolean = false,
                      showSecondLetterHint: boolean = false): LetterInput[] {
        this.letterSet = reduce(orthography.split(""), (acc, letter, index) => {
            let lowerLetter = toLower(letter);
            let isSpecialChar = /[^A-Za-z]/gi.test(lowerLetter);
            let isSpace = /\s+/.test(lowerLetter);
            acc[index] = {
                isSpace: isSpace,
                isSpecialChar: isSpecialChar,
                isReadOnly: this.isReadOnly(index, hintLength, showFirstLetterHint, showSecondLetterHint),
                value: lowerLetter,
                isEnabled: true
            };

            return acc;
        }, []);

        return this.letterSet;
    }

    private isReadOnly(index: number,
                       hintLength?: number,
                       showFirstLetterHint: boolean = false,
                       showSecondLetterHint: boolean = false): boolean {
        if (showFirstLetterHint) {
            if (!hintLength) {
                return false;
            }
            return index < hintLength;
        } else if (showSecondLetterHint) {
            const SECOND_HINT_INDEX= 1;
            return index === SECOND_HINT_INDEX;
        }
        return false;
    }


    padLetterSet(text: string = "", padString: string = "", ignoreReadOnly: boolean = false): string[] {
        let textLetters = split(text, "");
        let result = reduce(this.letterSet, (acc, letterSet) => {
            if (letterSet.isReadOnly && !ignoreReadOnly) {
                acc.letterSet.push(letterSet);
                return acc;
            }

            let headValue = head(acc.textLetters) || padString;
            acc.letterSet.push(assign(letterSet, {
                value: !letterSet.isSpecialChar ? headValue : letterSet.value,
                isReadOnly: false
            }));
            acc.textLetters = !isEmpty(acc.textLetters) ? tail(acc.textLetters) : [];

            return acc;
        }, {
            letterSet: [],
            textLetters: textLetters
        });

        this.letterSet = result.letterSet;

        return map(result.letterSet, "value");
    }

    updateLetterSet(index: number, options: object): LetterInput | undefined {
        if (!this.letterSet[index]) {
            return undefined;
        }
        this.letterSet[index] = assign({}, this.letterSet[index], options);

        return this.letterSet[index];
    }

    checkAnswer(examQuestionCheckAnswer: ExamQuestionCheckAnswer): ExamQuestionCheckedEvent {
        return new ExamQuestionCheckedEvent();
    }

    getLetterSet(): LetterInput[] {
        return this.letterSet;
    }

    setCompleted(completed: boolean): void {
        this.completed = completed;
    }

    setChecked(checked: boolean): void {
        this.checked = checked;
    }

    setAnswerCorrect(answerCorrect: boolean): void {
        this.answerCorrect = answerCorrect;
    }

    setSkipped(skipped: boolean): void {
        this.skipped = skipped;
    }

    isAutoAdvanceEnabled(): boolean {
        return false;
    }

    isChecked(): boolean {
        return this.checked;
    }

    isAnswerCorrect(): boolean {
        return this.answerCorrect;
    }

    isLocked(): boolean {
        return this.isChecked() && this.modeSettings.lockOnCheck;
    }

    isSelected(currentIndex: number, index?: number): boolean {
        return false;
    }

    isSpecial(currentIndex: number): boolean {
        return false;
    }

    isCorrect(index: number, answerSet: string[] = []): boolean {
        return false;
    }

    isUncertain(index: number, answerSet: string[] = []): boolean {
        return false;
    }

    isIncorrect(index: number, answerSet: string[] = [], isReadOnly: boolean = false): boolean {
        return false;
    }

    isSkipped(): boolean {
        return this.skipped;
    }

    isLetterInputReadOnly(): boolean {
        return false;
    }

    isWordPronunciationEnabled(): boolean {
        return false;
    }

    isVirtualAdvancedKeyboardVisible(): boolean {
        return false;
    }

    isFullKeyboardEnabled(): boolean {
        return true;
    }

    isTypingFallBackEnabled(): boolean {
        return true;
    }

    isBrowserUnsupported(): boolean {
        return false;
    }

    shouldVideoPlayBeforeAnswerChecked(): boolean {
        return false;
    }

    shouldVideoAutoPlay(): boolean {
        return true;
    }

    shouldShowSkipButton(): boolean {
        return true;
    }

    shouldAudioPlay(): boolean {
        return false;
    }

    shouldShowVideoThumbnail(): boolean {
        return false;
    }

    shouldShowExampleWord(): boolean {
        return false;
    }

    showVirtualKeyboard(): boolean {
        return false;
    }

    showScrambleHint(): boolean {
        return false;
    }

    showMicrophone(): boolean {
        return false;
    }

    showTranscript(): boolean {
        return true;
    }

    showMultipleChoice(): boolean {
        return false;
    }

    showTyping(): boolean {
        return false;
    }

    showControls(): boolean {
        return true;
    }

    showTimer(): boolean {
        return true;
    }

    showWordPronunciation(): boolean {
        return false;
    }

    showAudio(): boolean {
        return false;
    }

    showAutoCompleteFirstHint(): boolean {
        return false;
    }

    showAutoCompleteSecondHint(): boolean {
        return false;
    }

    allowLetterInput(): boolean {
        return false;
    }
}
