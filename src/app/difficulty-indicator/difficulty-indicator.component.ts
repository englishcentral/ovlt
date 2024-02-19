import { Component, Input, OnChanges } from "@angular/core";
import { head, isNumber } from "lodash-es";
import { Difficulty } from "../../types/difficulty";
import { Browser } from "../common/browser";

@Component({
    selector: "ec-difficulty-indicator",
    templateUrl: "difficulty-indicator.component.html",
    styleUrls: ["difficulty-indicator.component.scss"]
})
export class DifficultyIndicatorComponent implements OnChanges {

    @Input() lightDisplay: boolean = false;
    @Input() difficultyLevel: number | string = 0;
    @Input() difficultyLevelDescription: string = "";
    @Input() showIcon: boolean = true;
    @Input() showLabel: boolean = true;
    @Input() showSpecificLabel: boolean = false;
    @Input() size: number;
    @Input() showDisabled: boolean = false;
    @Input() showNumber: boolean = true;
    @Input() difficultyLevelDisplay: string;

    constructor() {
        this.initialize();
    }

    private initialize(): void {
    }

    ngOnChanges() {
        this.initialize();
    }

    isIconVisible(): boolean {
        return this.showIcon || false;
    }

    isLabelVisible(): boolean {
        return this.showLabel || false;
    }

    isNumberVisible(): boolean {
        return this.showNumber || false;
    }

    getSize(): string | undefined {
        if (!this.size) {
            return undefined;
        }
        return this.size + "px";
    }

    showSpecificLabelDisplay(): boolean {
        return this.showSpecificLabel;
    }

    getComputedDifficulty(): number {
        if (!this.difficultyLevel) {
            return 0;
        }

        if (isNumber(this.difficultyLevel)) {
            return this.difficultyLevel;
        }

        let levels = this.difficultyLevel.split(",");
        return head(levels) ? parseInt(head(levels)) : 0;
    }

    getDifficultyLevel(): string {
        let difficulty = this.getComputedDifficulty();
        return difficulty ? difficulty.toString() : "";
    }

    getDifficultyLabel(): string {
        return this.difficultyLevelDescription ? this.difficultyLevelDescription : "";
    }

    isShowDisabled(): boolean {
        return this.showDisabled;
    }

    isLightDisplay(): boolean {
        return this.lightDisplay;
    }

    isDifficultyBeginner(): boolean {
        let difficulty = this.getComputedDifficulty();
        return difficulty
            ? Difficulty.isBeginner(difficulty)
            : false;
    }

    isDifficultyIntermediate(): boolean {
        let difficulty = this.getComputedDifficulty();
        return difficulty
            ? Difficulty.isIntermediate(difficulty)
            : false;
    }

    isDifficultyAdvanced(): boolean {
        let difficulty = this.getComputedDifficulty();
        return difficulty
            ? Difficulty.isAdvanced(difficulty)
            : false;
    }

    isBeginnerDifficultyTextVisible(): boolean {
        return this.isDifficultyBeginner() && !this.isLightDisplay();
    }

    isIntermediateDifficultyTextVisible(): boolean {
        return this.isDifficultyIntermediate() && !this.isLightDisplay();
    }

    isAdvancedDifficultyTextVisible(): boolean {
        return this.isDifficultyAdvanced() && !this.isLightDisplay();
    }

    isInternetExplorer(): boolean {
        return Browser.isInternetExplorer();
    }
    
    getDifficultyLevelDisplay(): string {
        return this.difficultyLevelDisplay;
    }
}
