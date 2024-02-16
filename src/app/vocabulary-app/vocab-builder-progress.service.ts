import { Injectable } from "@angular/core";
import { Observable, Subscription } from "rxjs";

import { tap } from "rxjs/operators";
import { Logger } from "../common/logger";
import { Emitter } from "../common/emitter";
import { StopWatch } from "../common/stopwatch";
import { WordQuizProgress } from "../../types/word-quiz.progress";
import { VltQuizScore } from "../../types/vocab-level-test";
import { LevelTestDetail, XQuizWord } from "../../types/vocabulary-quiz";
import { assign, filter, isString, map, size } from "lodash-es";
import { IdentityService } from "../common/identity.service";
import { SORT_ASC, StudyLevelModelService } from "../model/study-level-model.service";
import { StudyLevelOption } from "../../types/studylevel-option";
import { Activity } from "../../types/activity";
import { XWordDetail } from "../../types/x-word";
import { ExamType } from "../../types/exam-type";
import { ExamQuestionCheckedEvent } from "./exam-question/mode-handler/mode-handler-abstract";

@Injectable({providedIn: "root"})
export class VocabBuilderProgressService {
    static EVENT_ON_WORD_ANSWER = "onVocabBuilderWordAnswer";
    static EVENT_ON_WORD_KNOWN = "onVocabBuilderWordKnown";
    static EVENT_ON_START_QUIZ = "StartQuiz";
    static EVENT_ON_COMPLETE_QUIZ = "CompleteQuiz";

    static PROGRESS_DATA_EVENTS = [
        VocabBuilderProgressService.EVENT_ON_WORD_ANSWER,
        VocabBuilderProgressService.EVENT_ON_WORD_KNOWN,
        VocabBuilderProgressService.EVENT_ON_START_QUIZ,
        VocabBuilderProgressService.EVENT_ON_COMPLETE_QUIZ
    ];

    private logger = new Logger();
    private arrivalId: string = "";
    private emitter = new Emitter();
    private sessionStopWatch = new StopWatch();
    private answerStopWatch = new StopWatch();
    private quizProgress: WordQuizProgress[] = [];
    private activity: Activity;
    private totalAnsweredQuestions: number = 0;
    private currentCorrect: number = 0;
    private currentTotal: number = 0;
    private currentIncorrect: number = 0;
    private incorrect: boolean = false;
    private messageCode?: number;
    private currentStepId?: number;
    private finishedListId?: number;
    private vltQuizScore: VltQuizScore = new VltQuizScore();
    private levelTestDetail: LevelTestDetail;
    private recycleSessionStarted: boolean = false;
    private attemptEvents = [];

    private difficultyLevels: StudyLevelOption[] = [];
    private difficultyType: string = ExamType.CEFR;

    constructor(private studyLevelService: StudyLevelModelService,
                private identityService: IdentityService) {
    }

    getActivity(): Activity {
        return this.activity;
    }

    setArrivalId(arrivalId: string): void {
        if (!arrivalId || !isString(arrivalId)) {
            return;
        }
        this.arrivalId = arrivalId;
    }

    setActivity(activity: Activity): void {
        this.activity = activity;
    }

    setCurrentCorrect(correct?: number): void {
        if (correct) {
            this.currentCorrect = correct;
        }
    }

    setCurrentIncorrect(incorrect?: number): void {
        if (incorrect) {
            this.currentIncorrect = incorrect;
        }
    }

    setCurrentTotal(total?: number): void {
        if (total) {
            this.currentTotal = total;
        }
    }

    setFinishedListId(finishedListId?: number): void {
        this.finishedListId = finishedListId;
    }

    setRecycleSessionStarted(started: boolean): void {
        this.recycleSessionStarted = started;
    }

    getFinishedListId(): number {
        return this.finishedListId;
    }

    getAccountId(): number {
        return this.identityService.getAccountId();
    }

    getArrivalId(): string {
        return this.arrivalId;
    }

    reset(): void {
        this.incorrect = false;
        this.messageCode = undefined;
        this.totalAnsweredQuestions = 0;
        this.currentCorrect = 0;
        this.currentIncorrect = 0;
        this.currentTotal = 0;
        this.quizProgress = [];
        this.finishedListId = undefined;
        this.sessionStopWatch.reset();
        this.setRecycleSessionStarted(false);
    }

    startSession(): void {
        this.sessionStopWatch.start();
    }

    startTimer(): void {
        this.answerStopWatch.reset();
        this.answerStopWatch.start();
    }

    sendActivityQuizEvents(eventName: string, courseID?: number): void {
        const activityQuizEvent = assign({}, {
                activityID: this.activity.activityID,
                activityTypeID: this.activity.activityTypeID,
                type: eventName,
                courseID: courseID
            });
        this.publish(eventName, activityQuizEvent);
    }

    addAttempt(quizWord: XQuizWord,
               examQuestionCheckedEvent: ExamQuestionCheckedEvent): void {
        this.attemptEvents.push(this.generateEvent(
            quizWord,
            examQuestionCheckedEvent
        ));
    }

    flushAttempts(acceptedEvent): void {
        let filteredEvents = (this.attemptEvents || []).filter(event => event.eventTime != acceptedEvent.eventTime);
        this.publish(VocabBuilderProgressService.EVENT_ON_WORD_ANSWER, filteredEvents);

        this.attemptEvents = [];
    }

    private generateEvent(quizWord: XQuizWord,
                          examQuestionCheckedEvent: ExamQuestionCheckedEvent,
                          accepted: boolean = false) {
        return assign({}, {
            activityID: this.activity.activityID,
            activityTypeID: this.activity.activityTypeID,
            quizStepId: this.getStepId(),
            correct: examQuestionCheckedEvent.correct,
            word: this.createWordReference(quizWord.word),
            itemResponseTime: this.answerStopWatch.getTime(),
            arrivalID: this.getArrivalId(),
            modeId: examQuestionCheckedEvent.mode,
            previouslyEncountered: quizWord.previouslyEncountered
        }, this.generateEventTypeMetaData(examQuestionCheckedEvent, quizWord, accepted));
    }

    // TODO: change quizWord to type XQuizWord
    answerQuestion(quizWord: XQuizWord,
                   examQuestionCheckedEvent: ExamQuestionCheckedEvent,
                   isSkipEventEnabled: boolean = true) {
        //removing step id checking for pron quiz, add it again if it will cause a bug
        if (!quizWord) {
            return;
        }

        if (this.quizProgress.some(quizProgress => quizProgress.word.wordAdapter.wordRootId == quizWord.word.wordAdapter.wordRootId) && !this.recycleSessionStarted) {
            this.logger.log("Recycle by wordRootId triggered");
            return;
        }

        this.quizProgress.push({...quizWord, correct: examQuestionCheckedEvent.correct});
        this.totalAnsweredQuestions = size(this.quizProgress);

        if (!examQuestionCheckedEvent.correct) {
            this.incorrect = true;
        }

        this.answerStopWatch.stop();

        const event = this.generateEvent(quizWord, examQuestionCheckedEvent, true);

        //pron quiz doesn't send skip event, because it doesn't have quizStepId
        if (examQuestionCheckedEvent.skipped && !isSkipEventEnabled) {
            return event;
        }

        this.publish(VocabBuilderProgressService.EVENT_ON_WORD_ANSWER, event);

        return event;
    }

    private generateEventTypeMetaData(examQuestionCheckedEvent: ExamQuestionCheckedEvent,
                                      quizWord: XQuizWord,
                                      accepted: boolean): object {
        if (examQuestionCheckedEvent.selectedWord || examQuestionCheckedEvent.timeout) {
            return {
                type: "CHOSEN_DEFINITION",
                selectedWord: this.createWordReference(quizWord.word),
                distractors: map(quizWord.distractors || [], word => this.createWordReference(word)),
                timeout: examQuestionCheckedEvent.timeout,
                skipped: examQuestionCheckedEvent.skipped,
                courseID: examQuestionCheckedEvent.courseId,
                dialogLineId: quizWord.word.canonicalDialogLineId,
                selectedDefinition: {
                    wordRootID: quizWord.word.wordAdapter.wordRootId
                }
            };
        }

        if (examQuestionCheckedEvent.spokenAnswer) {
            return {
                type: "SPOKEN_QUIZ_WORD",
                accepted: accepted,
                spokenWord: examQuestionCheckedEvent.spokenAnswer,
                audioUrl: examQuestionCheckedEvent.audioUrl,
                rejected: examQuestionCheckedEvent.rejected,
                evaluation: examQuestionCheckedEvent.wordResult?.evaluation,
                status: examQuestionCheckedEvent.wordResult?.status,
                classifierStatus: examQuestionCheckedEvent.wordResult?.classifierStatus,
                phonemeDetails: examQuestionCheckedEvent.wordResult?.phonemes,
                skipped: examQuestionCheckedEvent.skipped,
                courseID: examQuestionCheckedEvent.courseId,
                dialogLineId: quizWord.word.canonicalDialogLineId
            };
        }

        if (examQuestionCheckedEvent.accountPronunciationWordId) {
            return {
                type: "SPOKEN_PRONUNCIATION_WORD",
                wordInstanceId: examQuestionCheckedEvent.wordInstanceId,
                wordId: examQuestionCheckedEvent.wordId,
                label: examQuestionCheckedEvent.label,
                accountPronunciationWordId: examQuestionCheckedEvent.accountPronunciationWordId,
                rejected: examQuestionCheckedEvent.rejected,
                evaluation: examQuestionCheckedEvent.wordResult?.evaluation,
                status: examQuestionCheckedEvent.wordResult?.status,
                classifierStatus: examQuestionCheckedEvent.wordResult?.classifierStatus,
                phonemeDetails: examQuestionCheckedEvent.wordResult?.phonemes,
                courseID: examQuestionCheckedEvent.courseId,
                dialogLineId: quizWord.word.canonicalDialogLineId
            };
        }

        if (examQuestionCheckedEvent.label) {
            return {
                type: "PRONUNCIATION_WORD",
                wordInstanceId: examQuestionCheckedEvent.wordInstanceId,
                wordId: examQuestionCheckedEvent.wordId,
                label: examQuestionCheckedEvent.label,
                rejected: examQuestionCheckedEvent.rejected,
                evaluation: examQuestionCheckedEvent.wordResult?.evaluation,
                status: examQuestionCheckedEvent.wordResult?.status,
                classifierStatus: examQuestionCheckedEvent.wordResult?.classifierStatus,
                phonemeDetails: examQuestionCheckedEvent.wordResult?.phonemes,
                courseID: examQuestionCheckedEvent.courseId,
                dialogLineId: quizWord.word.canonicalDialogLineId
            };
        }

        return {
            type: "TYPED_QUIZ_WORD",
            typedAnswer: examQuestionCheckedEvent.typedAnswer,
            skipped: examQuestionCheckedEvent.skipped,
            courseID: examQuestionCheckedEvent.courseId,
            dialogLineId: quizWord.word.canonicalDialogLineId
        };
    }

    markAsKnown(quizWord: XQuizWord, known: boolean, practice: boolean): void {
        if (!practice) {
            return;
        }

        this.publish(VocabBuilderProgressService.EVENT_ON_WORD_KNOWN, {
            type: "KNOWN_WORD",
            markAs: known,
            word: this.createWordReference(quizWord.word)
        });
    }

    setStepId(stepId?: number) {
        this.currentStepId = stepId;
    }

    getStepId(): number | undefined {
        return this.currentStepId;
    }

    getIncorrectAnswers(): XQuizWord[] {
        return filter(this.quizProgress, (progress => !progress.correct));
    }

    getCorrectAnswers(): XQuizWord[] {
        return filter(this.quizProgress, (progress => progress.correct));
    }

    getQuizProgress(): WordQuizProgress[] {
        return this.quizProgress;
    }

    hasIncorrect(): boolean {
        return this.incorrect || this.currentIncorrect > 0;
    }

    getCurrentCorrectCount(): number {
        return this.currentCorrect;
    }

    getCorrectAnswerCount(isActivityQuiz: boolean = false, isLevel: boolean = false): number {
        if (isLevel) {
            return this.getCurrentCorrectCount();
        }
        if (isActivityQuiz) {
            return size(this.getCorrectAnswers());
        }
        return size(this.getCorrectAnswers()) + this.getCurrentCorrectCount();
    }

    getSessionCorrectAnswerCount(): number {
        return size(this.getCorrectAnswers());
    }

    getTotalAnsweredLength(): number {
        return this.totalAnsweredQuestions + this.getPreviousIndex();
    }

    getTotalAnsweredQuestionsLength(): number {
        return this.totalAnsweredQuestions;
    }

    getPreviousIndex(): number {
        return this.currentCorrect + this.currentIncorrect;
    }

    getCurrentTotal(): number {
        return this.currentTotal;
    }

    getState(): number | undefined {
        return this.messageCode;
    }

    getVltQuizScore(): VltQuizScore {
        return this.vltQuizScore;
    }

    isPerfect(isActivityQuiz: boolean = false): boolean {
        if (isActivityQuiz) {
            return this.getSessionCorrectAnswerCount() == this.getTotalAnsweredQuestionsLength();
        }
        return this.getCorrectAnswerCount() == this.getTotalAnsweredLength();
    }

    setState(messageCode?: number) {
        this.messageCode = messageCode;
    }

    setVltQuizScore(score: VltQuizScore): void {
        this.vltQuizScore = score;
    }

    setLevelTestDetail(detail: LevelTestDetail): void {
        this.levelTestDetail = detail;
    }

    getLevelTestDetail(): LevelTestDetail {
        return this.levelTestDetail;
    }

    private createWordReference(word: XWordDetail) {
        return {
            wordHeadID: word.wordAdapter?.wordHeadId || 0,
            wordRootID: word.wordAdapter?.wordRootId,
            wordRootDefinitionID: word.wordDefinitionId,
            wordInstanceID: word.wordAdapter?.wordInstanceId,
            wordID: word.wordAdapter?.wordId,
            sharedMeaningID: word.sharedMeaningId,
            wordFamilyID: word.wordFamilyId
        };
    }

    generateDifficultyLevels(): Observable<StudyLevelOption[]> {
        return this.studyLevelService.getOptions({
            siteLanguage: this.identityService.getSiteLanguage(),
            sortBy: SORT_ASC
        }).pipe(
            tap((difficultyLevels) => {
                this.difficultyLevels = difficultyLevels;
            })
        );
    }

    getDifficultyTypes(): string[] {
        return this.difficultyLevels?.[0]?.testScores.map(testScore => testScore.type);
    }

    getDifficultyType(): string | undefined {
        return this.difficultyType;
    }

    setDifficultyType(difficultyType?: string): void {
        this.difficultyType = difficultyType;
    }

    getDifficultyLevelName(difficultyLevel: number, showMicroLevel: boolean = true): string | undefined {
        if (!this.getDifficultyType()) {
            return undefined;
        }
        const MIN_DIFFICULTY = 1;
        const diffFloor = difficultyLevel > MIN_DIFFICULTY ? Math.floor(difficultyLevel) : MIN_DIFFICULTY;
        const microlevel = difficultyLevel > MIN_DIFFICULTY ? difficultyLevel - diffFloor : 0;
        const mainDifficulty = this.difficultyLevels
            .find(studyDifficultyLevel => studyDifficultyLevel.level == diffFloor)?.testScores
            .find(testScore => testScore.type == this.getDifficultyType())?.score;

        if (microlevel && showMicroLevel) {
            return `${mainDifficulty}.${(microlevel).toFixed(1).replace("0.", "")}`;
        }
        return mainDifficulty;
    }

    getDifficultyTypeName(type: string): string {
        return type.replace("_", " ");
    }

    subscribe(eventName: string, successFn: (data?) => void, errorFn?: (e?) => void): Subscription {
        return this.emitter.subscribe(eventName, successFn, errorFn);
    }

    publish(eventName: string, data?: any): void {
        this.emitter.publish(eventName, data);
    }

    destroy(): void {
        this.emitter.destroy();
    }

}
