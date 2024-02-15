import { Injectable } from "@angular/core";
import { ConnectionFactoryService } from "../../core/connection-factory.service";
import { Logger } from "../../core/logger/logger";
import { Observable, of } from "rxjs";
import { VocabBuilderClassSetting, VocabBuilderSetting, VocabBuilderSettings } from "../types/vocab-builder-settings";
import {
    AccountLevelTests,
    AdaptiveQuizWord,
    ClassTestData,
    LevelTestDetail,
    VocabBuilderQuiz,
    XWordQuiz
} from "../types/vocabulary-quiz";
import { StorageCache } from "../../core/storage-cache";
import { VbSettings } from "../../activity-app/vocab-builder-app/quiz-data-source/quiz-data-source-abstract";
import { Word } from "../types/word";
import { ClassLevelTestSettings } from "../types/level-test-setting";
import { forEach, isNull } from "lodash-es";
import { catchError } from "rxjs/operators";
import { LevelTestHistory, VltQuizScore } from "../reportcard/vocab-level-test";

@Injectable({providedIn: "root"})
export class VocabBuilderModelService {
    private logger = new Logger();
    private accountClassRankCache?: StorageCache<number> = new StorageCache<number>("accountClassRank");
    private vocabLevelTestScoreCache?: StorageCache<VltQuizScore> = new StorageCache<VltQuizScore>("vocabLevelTestScoreCache");
    private vocabLevelTestDetailCache?: StorageCache<LevelTestDetail> = new StorageCache<LevelTestDetail>("vocabLevelTestDetailCache");

    constructor(private connection: ConnectionFactoryService) {
    }

    getAccountVocabBuilderSetting(accountId: number, combinedParams: VbSettings = {useAccountWordLists: false}): Observable<VocabBuilderSettings> {
        if (!accountId) {
            this.logger.log("accountId is required param");
            return of(undefined);
        }

        return this.connection
            .service("bridge")
            .setPath(`/identity/account/${accountId}/vocabbuilder`)
            .get({useAccountWordLists: combinedParams.useAccountWordLists});
    }

    getDistractors(wordRootId: number): Observable<Word[]> {
        if (!wordRootId) {
            this.logger.log("wordRootId is required param");
            return of(undefined);
        }

        return this.connection
            .service("bridge")
            .setPath(`/content/quiz/root/distractor`)
            .get({wordRootId: wordRootId});
    }

    getVocabBuilderSettingByClassIdV2(classId: number): Observable<VocabBuilderClassSetting[]> {
        if (!classId) {
            this.logger.log("classId is required param");
            return of(undefined);
        }

        return this.connection
            .service("bridge")
            .setPath(`/identity/class/${classId}/vocabbuilder/setting`)
            .get(undefined, undefined, ConnectionFactoryService.SERVICE_VERSION.v2);
    }

    getAccountVocabBuilderSettingByClassId(classId: number, accountId: number, params?: object): Observable<VocabBuilderClassSetting> {
        if (!classId || !accountId) {
            this.logger.log("classId, accountId are required params");
            return of(undefined);
        }
        return this.connection
            .service("bridge")
            .setPath(`/identity/class/${classId}/vocabbuilder/setting/account/${accountId}`)
            .get(params, undefined, ConnectionFactoryService.SERVICE_VERSION.v1);
    }

    getAccountClassRank(classId: number, accountId: number, wordListTypeId: number): Observable<number> {
        if (!classId || !accountId || !wordListTypeId) {
            this.logger.log("classId, accountId, wordListTypeId are required params");
            return of(undefined);
        }
        return this.connection
            .service("bridge")
            .setPath(`/identity/class/${classId}/account/${accountId}/wordlist/${wordListTypeId}/rank`)
            .get();
    }

    getCachedAccountClassRank(accountId: number, classId: number, wordListTypeId: number): Observable<number> {
        if (!classId || !accountId || !wordListTypeId) {
            return of(undefined);
        }

        return this.accountClassRankCache.getCache({
            classId: classId,
            wordListTypeId: wordListTypeId,
            accountId: accountId
        }, () => {
            return this.getAccountClassRank(classId, accountId, wordListTypeId);
        }, ConnectionFactoryService.CACHE_LIFETIME.classdata);
    }

    clearAccountClassRank(accountId: number): void {
        if (!accountId) {
            this.logger.log("accountId is required param");
            return;
        }
        this.accountClassRankCache.destroy();
    }

    updateVocabBuilderSettingByClassId(classId: number, postBody: object = {}): Observable<VocabBuilderClassSetting> {
        if (!classId) {
            this.logger.log("classId is required param");
            return of(undefined);
        }

        return this.connection
            .service("bridge")
            .setPath(`/identity/class/${classId}/vocabbuilder/setting`)
            .put(undefined, postBody, ConnectionFactoryService.SERVICE_VERSION.v1);
    }

    deleteVocabBuilderSettingFromClass(classId: number, vocabBuilderClassSettingId: number): Observable<void> {
        if (!classId || !vocabBuilderClassSettingId) {
            this.logger.log("classId, vocabBuilderClassSettingId are required params");
            return of(undefined);
        }
        return this.connection
            .service("bridge")
            .setPath(`/identity/class/${classId}/vocabbuilder/setting/${vocabBuilderClassSettingId}`)
            .delete();
    }

    getAccountWordListById(accountId: number,
                           wordListTypeId: number): Observable<VocabBuilderSetting> {
        if (!accountId || !wordListTypeId) {
            return of(undefined);
        }

        return this.connection
            .service("bridge")
            .setPath(`/identity/account/${accountId}/vocabbuilder/wordlist/${wordListTypeId}`)
            .get();
    }

    generateQuiz(accountId: number, postBody: object = {}, query: object = {}): Observable<XWordQuiz> {
        if (!accountId) {
            this.logger.log("accountId is required param");
            return of(undefined);
        }

        return this.connection
            .service("bridge", false, false)
            .setPath(`/content/quiz/account/${accountId}`)
            .post(query, postBody, ConnectionFactoryService.SERVICE_VERSION.v1);
    }

    generateMyQuiz(accountId: number, postBody: object = {}, query: object = {}): Observable<XWordQuiz> {
        if (!accountId) {
            this.logger.log("accountId is required param");
            return of(undefined);
        }

        return this.connection
            .service("bridge")
            .setPath(`/content/quiz/my/account/${accountId}`)
            .post(query, postBody, ConnectionFactoryService.SERVICE_VERSION.v1);
    }

    generateLevelQuiz(params: VocabBuilderSetting): Observable<XWordQuiz> {
        if (!params.accountId || (!params.curatedLevelTestId && !params.levelTestSettingId)) {
            this.logger.log("accountId and curatedLevelTestId or levelTestSettingId are required params");
            return of(undefined);
        }

        return this.connection
            .service("bridge")
            .setPath(`/content/quiz/leveltest`)
            .get({
                "accountId": params.accountId,
                "curatedLevelTestId": params.curatedLevelTestId,
                "levelTestSettingId": params.levelTestSettingId,
                "modeIds": params.vocabBuilderModeIds,
                "useNewContentWords": true
            });
    }

    getNextLevelTestAdaptiveWord(accountId: number, levelTestSettingId: number): Observable<AdaptiveQuizWord> {
        return this.connection
            .service("bridge")
            .setPath(`/content/quiz/leveltest/adaptive/next`)
            .get({
                accountId: accountId,
                levelTestSettingId: levelTestSettingId,
                useNewContentWords: true,
                noStoppingRule: true // @FIXME remove this after calibration
            });
    }

    getLevelTestSetting(classId: number): Observable<ClassLevelTestSettings> {
        if (!classId) {
            this.logger.log("classId is required param");
            return of(undefined);
        }

        return this.connection
            .service("bridge")
            .setPath(`/identity/class/${classId}/leveltest/setting`)
            .get();
    }

    generatePronQuiz(accountId: number, postBody: object = {}, query: object = {}): Observable<VocabBuilderQuiz> {
        if (!accountId) {
            return of(undefined);
        }

        return this.connection
            .service("bridge")
            .setPath(`/content/quiz/pronunciation/account/${accountId}`)
            .post(query, postBody, ConnectionFactoryService.SERVICE_VERSION.v1);
    }

    generatePronQuizFromContent(postBody: object = {}, query: object = {}): Observable<XWordQuiz> {
        return this.connection
            .service("content")
            .setPath("/quiz/word/v1")
            .post(query, postBody, ConnectionFactoryService.SERVICE_VERSION.v1);
    }

    getClassTestExam(accountId: number, classTestExamId: number): Observable<any> {
        if (!accountId || !classTestExamId) {
            this.logger.log("accountId, classTestExamId are required params");
            return of(undefined);
        }

        return this.connection
            .service("bridge")
            .setPath(`/content/quiz/exam/${classTestExamId}/account/${accountId}`)
            .get({useNewContentWords: true});
    }

    getClassTestData(accountId: number, classTestExamId: number): Observable<ClassTestData> {
        if (!accountId) {
            return of(undefined);
        }

        return this.connection
            .service("bridge")
            .setPath(`/identity/class/account/${accountId}/tests`)
            .get({
                "classTestExamId": classTestExamId
            });
    }

    getAccountVocabLevelTestProgress(accountId: number, level: number): Observable<boolean> {
        if (!accountId || !level) {
            this.logger.log("accountId and level are required params");
            return of(undefined);
        }

        return this.connection
            .service("reportcard")
            .setPath(`/report/quiz/leveltest/completed/level/${level}/account/${accountId}`)
            .get();
    }

    getLevelTestDetail(accountId: number, curatedLevelTestId: number, levelTestSettingId: number): Observable<LevelTestDetail> {
        if (!accountId || (!curatedLevelTestId && !levelTestSettingId)) {
            this.logger.log("accountId and curatedLevelTestId or levelTestSettingId are required params");
            return of(undefined);
        }

        return this.connection
            .service("reportcard")
            .setPath(`/report/quiz/leveltest/account/${accountId}/detail`)
            .get({
                curatedLevelTestId: curatedLevelTestId,
                levelTestSettingId: levelTestSettingId
            });
    }

    getCachedLevelTestDetail(accountId: number, curatedLevelTestId: number, levelTestSettingId: number): Observable<LevelTestDetail> {
        if (!accountId || (!curatedLevelTestId && !levelTestSettingId)) {
            this.logger.log("accountId and curatedLevelTestId or levelTestSettingId are required params");
            return of(undefined);
        }

        const params = {
            accountId: accountId,
            levelTestSettingId: levelTestSettingId,
            curatedLevelTestId: curatedLevelTestId
        };

        // Eliminate null attribute
        const filteredParams = forEach(params, (value, key) => {
            if (isNull(value)) {
                delete params[key];
            }
        });

        return this.vocabLevelTestDetailCache.getCache(filteredParams, () => {
            return this.getLevelTestDetail(accountId, curatedLevelTestId, levelTestSettingId);
        }, ConnectionFactoryService.CACHE_LIFETIME.reportcard);
    }

    getLevelTestScore(accountId: number, levelTestSettingId: number, curatedLevelTestId?: number): Observable<VltQuizScore> {
        if (!accountId || (!curatedLevelTestId && !levelTestSettingId)) {
            this.logger.log("accountId and curatedLevelTestId or levelTestSettingId are required params");
            return of(undefined);
        }

        return this.connection
            .service("reportcard")
            .setPath(`/report/quiz/leveltest/account/${accountId}/score`)
            .get({
                curatedLevelTestId: curatedLevelTestId,
                levelTestSettingId: levelTestSettingId
            });
    }

    getLevelTestHistory(accountId: number, levelTestSettingId: number, curatedLevelTestId?: number): Observable<LevelTestHistory> {
        if (!accountId || (!curatedLevelTestId && !levelTestSettingId)) {
            this.logger.log("accountId and curatedLevelTestId or levelTestSettingId are required params");
            return of(undefined);
        }

        return this.connection
            .service("reportcard")
            .setPath("/report/quiz/leveltest/history")
            .get({
                accountId: accountId,
                curatedLevelTestId: curatedLevelTestId,
                levelTestSettingId: levelTestSettingId
            }, undefined, ConnectionFactoryService.SERVICE_VERSION.v1);
    }

    getCachedLevelTestScore(accountId: number, levelTestSettingId: number, curatedLevelTestId?: number): Observable<VltQuizScore> {
        if (!accountId || (!curatedLevelTestId && !levelTestSettingId)) {
            this.logger.log("accountId and curatedLevelTestId or levelTestSettingId are required params");
            return of(undefined);
        }

        const params = {
            accountId: accountId,
            levelTestSettingId: levelTestSettingId,
            curatedLevelTestId: curatedLevelTestId
        };

        return this.vocabLevelTestScoreCache.getCache(params, () => {
            return this.getLevelTestScore(accountId, levelTestSettingId, curatedLevelTestId).pipe(catchError(() => of(undefined)));
        }, ConnectionFactoryService.CACHE_LIFETIME.reportcard);
    }

    getInProgressLevelTests(accountId: number): Observable<AccountLevelTests> {
        if (!accountId) {
            this.logger.log("accountId is a required param");
            return of(undefined);
        }

        return this.connection
            .service("bridge")
            .setPath(`/identity/account/${accountId}/leveltest`)
            .get();
    }

    fetchAccessedWordCount(): Observable<number> {
        return this.connection
            .service("reportcard")
            .setPath(`/report/quiz/answercount/monthly`)
            .get()
            .pipe(catchError(() => of(0)));
    }

    completeQuiz(accountId: number,
                 quizStepId: number,
                 params: object = {}) {

        if (!accountId || !quizStepId) {
            return of(undefined);
        }

        return this.connection
            .service("reportcard")
            .setPath(`/report/quiz/${quizStepId}/complete`)
            .post(params, undefined, ConnectionFactoryService.SERVICE_VERSION.v1);
    }
}
