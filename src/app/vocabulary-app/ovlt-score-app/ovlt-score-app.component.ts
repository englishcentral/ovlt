import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnInit } from "@angular/core";
import { SubscriptionAbstract } from "../../../../core/subscription.abstract";
import { IdentityService } from "../../../../core/identity.service";
import { Logger } from "../../../../core/logger/logger";
import { VocabBuilderModelService } from "../../../../model/content/vocab-builder-model.service";
import { VocabBuilderSetting } from "../../../../model/types/vocab-builder-settings";
import { takeUntil } from "rxjs/operators";
import {
    ADAPTIVE_OVLT2_SETTINGS,
    LevelTestHistory,
    LevelTestStep,
    VltQuizScore
} from "../../../../model/reportcard/vocab-level-test";
import { Difficulty } from "../../../../model/types/difficulty";
import { VocabBuilderProgressService } from "../../../../activity-app/vocab-builder-app/vocab-builder-progress.service";
import { forkJoin } from "rxjs";
import { FeatureService } from "../../../../core/feature.service";

@Component({
    selector: "ec-ovlt-score",
    templateUrl: "ovlt-score-app.component.html",
    styleUrls: ["ovlt-score-app.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class OvltScoreAppComponent extends SubscriptionAbstract implements OnInit {
    @Input() settings?: VocabBuilderSetting;
    @Input() classTest: boolean = false;

    private logger = new Logger();
    private loading: boolean = true;
    private score?: VltQuizScore;
    private history?: LevelTestHistory;

    constructor(private vocabBuilderModelService: VocabBuilderModelService,
                private vocabBuilderProgressService: VocabBuilderProgressService,
                private identityService: IdentityService,
                private featureService: FeatureService,
                private changeDetectorRef: ChangeDetectorRef) {
        super();
    }

    ngOnInit(): void {
        forkJoin([
            this.vocabBuilderModelService.getCachedLevelTestScore(
                this.identityService.getAccountId(),
                this.settings?.levelTestSettingId,
                this.settings?.curatedLevelTestId
            ),
            this.vocabBuilderModelService.getLevelTestHistory(
                this.identityService.getAccountId(),
                this.settings?.levelTestSettingId,
                this.settings?.curatedLevelTestId
            )
        ]).pipe(
            takeUntil(this.getDestroyInterceptor())
        ).subscribe(([score, history]) => {
            this.score = score;
            this.history = history;

            this.loading = false;
            this.changeDetectorRef.markForCheck();
        });
    }

    getDifficultyTypes(): string[] {
        return this.vocabBuilderProgressService.getDifficultyTypes();
    }

    getDifficultyTypeName(type: string): string {
        return this.vocabBuilderProgressService.getDifficultyTypeName(type);
    }

    getDifficultyType(): string | undefined {
        return this.vocabBuilderProgressService.getDifficultyType();
    }

    setDifficultyType(difficultyType?: string): void {
        this.vocabBuilderProgressService.setDifficultyType(difficultyType);
        this.changeDetectorRef.markForCheck();
    }

    getDifficultyLevelName(difficultyLevel: number, showMicroLevel: boolean = true): string | undefined {
        return this.vocabBuilderProgressService.getDifficultyLevelName(difficultyLevel, showMicroLevel);
    }

    getBandLevel(levelTestStep: LevelTestStep): number {
        const firstMicrolevel = levelTestStep.quizWords.find(word => word?.microLevel > 1)?.microLevel;
        return firstMicrolevel ? Math.floor(firstMicrolevel) : levelTestStep.band;
    }

    isClassTest(): boolean {
        return this.classTest;
    }

    isLoading(): boolean {
        return this.loading;
    }

    isDebugMode(): boolean {
        return this.featureService.isDebugMode();
    }

    getMicroLevel(): number {
        return this.score?.microLevel;
    }

    isDifficultyBeginner(): boolean {
        return !!this.score?.microLevel && Difficulty.isBeginner(Math.floor(this.score?.microLevel));
    }

    isDifficultyIntermediate(): boolean {
        return !!this.score?.microLevel && Difficulty.isIntermediate(Math.floor(this.score?.microLevel));
    }

    isDifficultyAdvanced(): boolean {
        return !!this.score?.microLevel && Difficulty.isAdvanced(Math.floor(this.score?.microLevel));
    }

    getLevelTestSteps(): LevelTestStep[] | undefined {
        return this.history?.levelTestSteps;
    }

    isOvlt2(): boolean {
        return this.settings.levelTestSettingId == ADAPTIVE_OVLT2_SETTINGS.levelTestSettingId;
    }

    getWordProgressByDifficulty(): { difficultyLevel: number, correct: number, total: number }[] {
        let quizProgress = this.vocabBuilderProgressService.getQuizProgress();
        if (!quizProgress) {
            return [];
        }
        return quizProgress.reduce((acc, wordProgress) => {
            if (!acc[wordProgress.word.difficultyLevel]) {
                acc[wordProgress.word.difficultyLevel] = {
                    difficultyLevel: wordProgress.word.difficultyLevel,
                    correct: 0,
                    total: 0
                };
            }
            if (wordProgress.correct) {
                acc[wordProgress.word.difficultyLevel].correct += 1;
            }
            acc[wordProgress.word.difficultyLevel].total += 1;

            return acc;
        }, []);
    }

    getDifficultyPercent(difficultyResult: { correct: number, total: number }): number {
        return (difficultyResult.total ? difficultyResult.correct / difficultyResult.total : 0) * 100;
    }

    isDifficultyFailed(difficultyResult: { correct: number, total: number }): boolean {
        return this.getDifficultyPercent(difficultyResult) <= 90;
    }

    isFirstFail(difficultyResult: { difficultyLevel: number, correct: number, total: number }): boolean {
        const firstFail = this.getWordProgressByDifficulty().find(result => {
            result?.total && this.isDifficultyFailed(result);
        });
        return firstFail?.difficultyLevel == difficultyResult.difficultyLevel;
    }

    getPercentage(step: LevelTestStep): number {
        const quizWords = step?.quizWords ?? [];
        const total = quizWords.length;
        if (!total) {
            return 0;
        }

        const correct = quizWords.filter(quizWord => quizWord.correct).length;
        return Number((correct / total * 100).toFixed(2));
    }

    getResult(step: LevelTestStep): string {
        const quizWords = step?.quizWords ?? [];
        const total = quizWords.length;
        if (!total) {
            return "";
        }

        const correct = quizWords.filter(quizWord => quizWord.correct).length;
        return `${correct}/${total}`;
    }

    isStepCompleted(step: LevelTestStep): boolean {
        const quizWords = step?.quizWords ?? [];
        return quizWords.length > 0;
    }

    isFailedBand(step: LevelTestStep): boolean {
        if (!this.score?.microLevel) {
            return false;
        }
        return Math.ceil(this.score?.microLevel) == step.band;
    }

}
