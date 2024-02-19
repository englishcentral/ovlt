import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    NgZone,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges
} from "@angular/core";
import { CHARACTERS_SET, KeyboardSet, LetterInput, LETTERS_SET, NUMBERS_SET } from "../../types/virtual-keyboard";
import { includes, isEqual, reduce } from "lodash-es";
import { SubscriptionAbstract } from "../subscription.abstract";
import { TypingSharedService } from "../common/typing-shared.service";

@Component({
    selector: "ec-virtual-keyboard",
    templateUrl: "virtual-keyboard.component.html",
    styleUrls: ["virtual-keyboard.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class VirtualKeyboardComponent extends SubscriptionAbstract implements OnInit, OnChanges, OnDestroy {

    @Input() availableLetters: string[] = Array.from("qwertyuiopasdfghjklzxcvbnm1234567890-/:;()$&@\".,?!'[]{}#%^*+=_\\|~<>€£¥•");
    @Input() showSpaceBar: boolean = false;
    @Input() showNumbersButton: boolean = false;
    @Input() showArrowButton: boolean = false;
    @Input() showLettersButton: boolean = false;
    @Input() showLittleBackSpaceButton: boolean = false;
    @Input() showBigBackSpaceButton: boolean = false;
    @Input() activateBottomCharsClass: boolean = false;
    @Input() showCharsButton: boolean = false;
    @Input() checkButtonDisabled: boolean = false;
    @Input() showHideKeyboardButton: boolean = true;
    @Input() checkButtonVisible: boolean = true;
    @Input() returnButtonVisible: boolean = false;
    @Input() pwaEnabled: boolean = false;

    @Output() eventClickCheckButton = new EventEmitter<void>();
    @Output() eventClickReturnButton = new EventEmitter<void>();
    @Output() eventClickDelete = new EventEmitter<void>();
    @Output() eventClickSpace = new EventEmitter<void>();
    @Output() eventHideKeyboard = new EventEmitter<void>();
    @Output() eventNewInput = new EventEmitter<string>();

    private upperCaseActive: boolean = false;
    private lettersSet: KeyboardSet;
    private numbersSet: KeyboardSet;
    private charactersSet: KeyboardSet;
    private currentKeyboardSet: string = LETTERS_SET;
    private lastVirtualInput: string = "";
    private adjustedReadonlyIndex: number;

    constructor(private typingSharedService: TypingSharedService,
                private zone: NgZone,
                private cdr: ChangeDetectorRef) {
        super();
    }

    ngOnInit(): void {
        this.initialize();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.availableLetters) {
            if (!isEqual(changes.availableLetters.previousValue, changes.availableLetters.currentValue)) {
                this.initializeLetters();
                this.cdr.detectChanges();
            }
        }
    }

    private initialize(): void {
        this.initializeLetters();
    }

    private initializeLetters(): void {
        const LETTERS_ON_TOP = "qwertyuiop";
        const LETTERS_ON_MIDDLE = "asdfghjkl";
        const LETTERS_ON_BOTTOM = "zxcvbnm";

        const CHARACTERS_ON_TOP = "1234567890";
        const CHARACTERS_ON_MIDDLE = "-/:;()$&@\"";
        const CHARACTERS_ON_BOTTOM = ".,?!'";

        const SECOND_CHARACTERS_ON_TOP = "[]{}#%^*+=";
        const SECOND_CHARACTERS_ON_MIDDLE = "_\\|~<>€£¥•";

        let topLetters = this.generateSet(LETTERS_ON_TOP);
        let middleLetters = this.generateSet(LETTERS_ON_MIDDLE);
        let bottomLetters = this.generateSet(LETTERS_ON_BOTTOM);

        this.lettersSet = {
            topSet: topLetters,
            bottomSet: bottomLetters,
            middleSet: middleLetters
        };

        let topNumbers = this.generateSet(CHARACTERS_ON_TOP);
        let middleNumbers = this.generateSet(CHARACTERS_ON_MIDDLE);
        let bottomCharacters = this.generateSet(CHARACTERS_ON_BOTTOM);

        this.numbersSet = {
            topSet: topNumbers,
            bottomSet: bottomCharacters,
            middleSet: middleNumbers
        };

        let secondTopCharacters = this.generateSet(SECOND_CHARACTERS_ON_TOP);
        let secondMiddleCharacters = this.generateSet(SECOND_CHARACTERS_ON_MIDDLE);

        this.charactersSet = {
            topSet: secondTopCharacters,
            bottomSet: bottomCharacters,
            middleSet: secondMiddleCharacters
        };
    }

    getLastVirtualInput(): string {
        return this.lastVirtualInput;
    }

    isPwaEnabled(): boolean {
        return this.pwaEnabled;
    }

    isLettersSetActive(): boolean {
        return this.getCurrentKeyboardSet() == LETTERS_SET;
    }

    isNumbersSetActive(): boolean {
        return this.getCurrentKeyboardSet() == NUMBERS_SET;
    }

    isCharactersSetActive(): boolean {
        return this.getCurrentKeyboardSet() == CHARACTERS_SET;
    }

    getCurrentKeyboardSet(): string {
        return this.currentKeyboardSet;
    }

    setCurrentKeyboardSet(currentKeyboardSet: string): void {
        this.currentKeyboardSet = currentKeyboardSet;
    }

    getTopVirtualSet(): LetterInput[] {
        if (!this.lettersSet || !this.numbersSet || !this.charactersSet) {
            return;
        }
        if (this.isLettersSetActive()) {
            return this.lettersSet.topSet;
        } else if (this.isNumbersSetActive()) {
            return this.numbersSet.topSet;
        }
        return this.charactersSet.topSet;
    }

    getMiddleVirtualSet(): LetterInput[] {
        if (!this.lettersSet || !this.numbersSet || !this.charactersSet) {
            return;
        }
        if (this.isLettersSetActive()) {
            return this.lettersSet.middleSet;
        } else if (this.isNumbersSetActive()) {
            return this.numbersSet.middleSet;
        }
        return this.charactersSet.middleSet;
    }

    getBottomVirtualSet(): LetterInput[] {
        if (!this.lettersSet && !this.numbersSet && !this.charactersSet) {
            return;
        }
        if (this.isLettersSetActive()) {
            return this.lettersSet.bottomSet;
        } else if (this.isNumbersSetActive()) {
            return this.numbersSet.bottomSet;
        }
        return this.charactersSet.bottomSet;
    }

    generateSet(letters: string): LetterInput[] {
        this.adjustedReadonlyIndex = 0;
        return reduce(letters.split(""), (acc, letter, index) => {
            let isSpecialChar = /[^A-Za-z]/gi.test(letter);
            let isSpace = /\s+/.test(letter);
            if (this.isUpperCaseActive()) {
                letter = letter.toUpperCase();
            } else {
                letter = letter.toLowerCase();
            }

            acc[index] = {
                isSpace: isSpace,
                isSpecialChar: isSpecialChar,
                isReadOnly: index <= this.adjustedReadonlyIndex,
                isEnabled: this.isLetterEnabled(letter),
                value: letter
            };
            return acc;
        }, []);
    }

    changeKeyboardSet(keyboardSet: string): void {
        if (keyboardSet == NUMBERS_SET) {
            this.setCurrentKeyboardSet(NUMBERS_SET);
            return;
        } else if (keyboardSet == LETTERS_SET) {
            this.setCurrentKeyboardSet(LETTERS_SET);
            return;
        }
        this.setCurrentKeyboardSet(CHARACTERS_SET);
    }

    convertCase(): void {
        this.upperCaseActive ? this.upperCaseActive = false : this.upperCaseActive = true;
    }

    isUpperCaseActive(): boolean {
        return this.upperCaseActive;
    }

    onVirtualInput(letter: string): void {
        letter = this.isUpperCaseActive() ? letter.toUpperCase() : letter.toLowerCase();
        this.eventNewInput.emit(letter);
        this.onInput(letter);
        this.lastVirtualInput = letter;
    }

    private onInput(letter: string): void {
        this.typingSharedService.publish(TypingSharedService.UPDATE_ANSWER_TEXT, letter);
        this.typingSharedService.publish(TypingSharedService.UPDATE_SCROLLBAR_POSITION);
    }

    onDelete(): void {
        this.eventClickDelete.emit();
        this.typingSharedService.publish(TypingSharedService.DELETE_LETTER);
        this.typingSharedService.publish(TypingSharedService.UPDATE_SCROLLBAR_POSITION);
    }

    onClickCheck(): void {
        this.eventClickCheckButton.emit();
        let returnLetter = "\x0a";
        this.typingSharedService.publish(TypingSharedService.RETURN);
        this.typingSharedService.publish(TypingSharedService.UPDATE_ANSWER_TEXT, returnLetter);
        this.typingSharedService.publish(TypingSharedService.UPDATE_SCROLLBAR_POSITION);
    }

    onClickReturn(): void {
        this.eventClickReturnButton.emit();
        let returnLetter = "\x0a";
        this.typingSharedService.publish(TypingSharedService.RETURN);
        this.typingSharedService.publish(TypingSharedService.UPDATE_ANSWER_TEXT, returnLetter);
        this.typingSharedService.publish(TypingSharedService.UPDATE_SCROLLBAR_POSITION);
    }

    onSpacePressed(): void {
        this.eventClickSpace.emit();
        let spaceLetter = "\xa0";
        this.typingSharedService.publish(TypingSharedService.UPDATE_ANSWER_TEXT, spaceLetter);
        this.typingSharedService.publish(TypingSharedService.UPDATE_SCROLLBAR_POSITION);
    }

    onBackSpace(): void {
        this.onDelete();
    }

    onHideKeyboardPressed(): void {
        this.eventHideKeyboard.emit();
    }

    isLetterEnabled(letter: string): boolean {
        return includes(this.availableLetters, letter);
    }

    isVisible(): boolean {
        return this.lettersSet.bottomSet.length > 0;
    }

    isCheckButtonDisabled(): boolean {
        return this.checkButtonDisabled;
    }

    isCheckButtonVisible(): boolean {
        return this.checkButtonVisible;
    }

    isReturnButtonVisible(): boolean {
        return this.returnButtonVisible;
    }

    shouldShowNumbersButton(): boolean {
        return this.showNumbersButton;
    }

    shouldShowSpaceBar(): boolean {
        return this.showSpaceBar;
    }

    shouldShowLettersButton(): boolean {
        return this.showLettersButton;
    }

    shouldShowCharsButton(): boolean {
        return this.showCharsButton;
    }

    shouldShowArrowButton(): boolean {
        return this.showArrowButton;
    }

    shouldShowHideKeyboardButton(): boolean {
        return this.showHideKeyboardButton;
    }

    shouldShowLittleBackSpaceButton(): boolean {
        return this.showLittleBackSpaceButton;
    }
}
