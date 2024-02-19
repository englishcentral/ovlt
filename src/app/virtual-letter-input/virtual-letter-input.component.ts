import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import { LetterInput } from "../vocabulary-app/exam-question/mode-handler/mode-handler-abstract";

@Component({
    selector: "ec-virtual-letter-input",
    templateUrl: "virtual-letter-input.component.html",
    styleUrls: ["virtual-letter-input.component.scss"],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})

export class VirtualLetterInputComponent {
    @Input() virtualLetterSet: LetterInput[];
    @Input() upperCaseActive: boolean;
    @Input() lettersSetActive: boolean;
    @Input() numbersSetActive: boolean;
    @Input() charactersSetActive: boolean;
    @Input() showSpaceBar: boolean = false;
    @Input() showNumbersButton: boolean = false;
    @Input() showArrowButton: boolean = false;
    @Input() showLettersButton: boolean = false;
    @Input() showLittleBackSpaceButton: boolean = false;
    @Input() showBigBackSpaceButton: boolean = false;
    @Input() activateBottomCharsClass: boolean = false;
    @Input() showCharsButton: boolean = false;
    @Input() letterSetInWlsLearnMode: boolean = false;
    @Input() checkButtonDisabled: boolean = false;
    @Input() checkButtonVisible: boolean = false;
    @Input() returnButtonVisible: boolean = false;
    @Input() showHideKeyboardButton: boolean = false;

    @Output() eventVirtualInput = new EventEmitter<string>();
    @Output() eventBackSpace = new EventEmitter();
    @Output() eventSpace = new EventEmitter();
    @Output() eventClickCheck = new EventEmitter();
    @Output() eventClickReturn = new EventEmitter();
    @Output() eventConvertCase = new EventEmitter();
    @Output() eventHideKeyboard = new EventEmitter<void>();
    @Output() eventChangeKeyboardSet = new EventEmitter<string>();

    @ViewChild("letterset", {static: false}) letterset: ElementRef;

    private lastVirtualInput: string;

    static readonly TOOLTIP_TIMEOUT: number = 100;

    constructor(private cdr: ChangeDetectorRef) {
    }

    getTooltipTimeout(): number {
        return VirtualLetterInputComponent.TOOLTIP_TIMEOUT;
    }

    getVirtualLetterSet(): LetterInput[] {
        return this.virtualLetterSet;
    }

    getLastVirtualInput(): string {
        return this.lastVirtualInput;
    }

    setLastVirtualInput(letter: string): void {
        this.lastVirtualInput = letter;
    }

    isUpperCaseActive(): boolean {
        return this.upperCaseActive;
    }

    isLettersSetActive(): boolean {
        return this.lettersSetActive;
    }

    isNumbersSetActive(): boolean {
        return this.numbersSetActive;
    }

    isCharactersSetActive(): boolean {
        return this.charactersSetActive;
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

    isLetterSetInWlsLearnMode(): boolean {
        return this.letterSetInWlsLearnMode;
    }

    isLetterDisabled(virtualLetter: LetterInput): boolean {
        return !virtualLetter.isEnabled;
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

    shouldActivateBottomCharsClass(): boolean {
        return this.activateBottomCharsClass;
    }

    shouldShowLittleBackSpaceButton(): boolean {
        return this.showLittleBackSpaceButton;
    }

    shouldShowBigBackSpaceButton(): boolean {
        return this.showBigBackSpaceButton;
    }

    shouldShowArrowButton(): boolean {
        return this.showArrowButton;
    }

    shouldShowHideKeyboardButton(): boolean {
        return this.showHideKeyboardButton;
    }

    onBackSpacePressed(): void {
        this.eventBackSpace.emit();
    }

    onSpacePressed(): void {
        this.eventSpace.emit();
    }

    onClickReturnButton(): void {
        this.eventClickReturn.emit();
    }

    onClickCheckButton(): void {
        this.eventClickCheck.emit();
    }

    onHideKeyboardPressed(): void {
        this.eventHideKeyboard.emit();
    }

    onNewVirtualInput(letter: string): void {
        this.eventVirtualInput.emit(letter);
        this.setLastVirtualInput(letter);
    }

    changeKeyboardSet(keyboardSet: string): void {
        this.eventChangeKeyboardSet.emit(keyboardSet);
    }

    convertCase(): void {
        this.eventConvertCase.emit();
    }
}
