import { Injectable } from "@angular/core";
import { ConnectionFactoryService } from "../../core/connection-factory.service";
import { forkJoin, Observable, of } from "rxjs";
import {
    AccountAdaptiveTest,
    AdaptiveQuiz,
    AdaptiveTest,
    ClassAdaptiveTest,
    ClassTest,
    ContentQuizWordsV1,
    MESSAGE_CODE_CHOOSE,
    MESSAGE_CODE_PROCESSING,
    VocabularyQuiz,
    XWordQuiz
} from "../types/vocabulary-quiz";
import { servicesRetryStrategy } from "../../core/retry-helper";
import { StorageCache } from "../../core/storage-cache";
import { catchError, map as rxJsMap, mergeMap, retryWhen } from "rxjs/operators";
import { Logger } from "../../core/logger/logger";
import {
    AccountWordListSetting,
    DEFAULT_WORD_LIST_TYPE_ID,
    DEFAULT_WORD_LIST_TYPE_NAME
} from "../types/word-list-reference";
import {
    VOCAB_BUILDER_MODE_ID_MULTIPLE_CHOICE,
    VocabBuilderSetting,
    VocabBuilderSettings
} from "../types/vocab-builder-settings";
import { assign, compact, difference, get, isEmpty, map, size } from "lodash-es";
import { IdentityService } from "../../core/identity.service";
import { GlobalSettingService } from "../../core/global-setting.service";

const QUIZ_CACHE_LIFETIME = 10800000;
const ASSET_SMALL = "SMALL";

@Injectable({
    providedIn: "root"
})
export class VocabularyQuizModelService {
    private logger = new Logger();
    private adaptiveQuizCache = new StorageCache<AdaptiveQuiz>("adaptiveQuiz");
    private adaptiveQuizStateCache = new StorageCache<AdaptiveQuiz>("adaptiveQuizState");
    private examSettingsCache = new StorageCache<VocabBuilderSetting[]>("examSettingsCache");

    constructor(private identityService: IdentityService,
                private connection: ConnectionFactoryService,
                private globalSettingService: GlobalSettingService) {

    }

    getQuizOptions(options: object,
                   courseId?: number,
                   additionalOptions: object = {}): object {
        const defaultOptions = {
            maxExamples: 1,
            maxDistractors: 3,
            includeMasteredAndDormant: true,
            personalize: true
        };

        let baseOptions = courseId ? assign({}, defaultOptions, {
            courseID: courseId,
            personalize: false
        }) : defaultOptions;

        return assign({}, baseOptions, options, additionalOptions);
    }

    private getVocabularyQuiz(baseOptions: object,
                              courseId?: number,
                              additionalOptions: object = {}): Observable<VocabularyQuiz | undefined> {
        return this.connection
            .service("bridge")
            .setPath("/content/vocabularyQuiz")
            .get(this.getQuizOptions(baseOptions, courseId, additionalOptions), undefined, ConnectionFactoryService.SERVICE_VERSION.v2)
            .pipe(
                retryWhen(servicesRetryStrategy())
            );
    }

    getByActivityId(activityId: number,
                    courseId?: number,
                    additionalOptions: object = {}): Observable<VocabularyQuiz | undefined> {
        const baseOptions = {
            activityID: activityId
        };

        return this.getVocabularyQuiz(baseOptions, courseId, additionalOptions);
    }

    getByWordHeadIds(wordHeadIds: number[],
                     courseId?: number,
                     additionalOptions: object = {}): Observable<VocabularyQuiz | undefined> {
        if (isEmpty(wordHeadIds)) {
            return of(undefined);
        }

        const baseOptions = {
            complete: true,
            wordHeadIDs: wordHeadIds.join(",")
        };

        return this.getVocabularyQuiz(baseOptions, courseId, additionalOptions);
    }

    getByActivityIdAndAccountId(activityId: number,
                                accountId: number, queryParams: object = {}): Observable<XWordQuiz | undefined> {

        if (!activityId || !accountId) {
            return of(undefined);
        }

        return this.connection
            .service("bridge")
            .setPath(`/content/quiz/activity/${activityId}/account/${accountId}`)
            .get(queryParams, undefined, ConnectionFactoryService.SERVICE_VERSION.v2);
    }

    getActivitySetting(activityId: number): Observable<VocabBuilderSettings> {
        if (!activityId) {
            return of(undefined);
        }

        return this.connection
            .service("bridge")
            .setPath(`/content/quiz/activity/${activityId}/setting`)
            .get();
    }

    getRawAdaptiveQuiz(accountId: number, wordListTypeId?: number, params: object = {}): Observable<AdaptiveQuiz | undefined> {
        if (!accountId) {
            return of(undefined);
        }
        return this.connection
            .service("bridge")
            .setPath(`/content/quiz/adaptive/account/${accountId}`)
            .get(assign({wordListTypeId: wordListTypeId}, params));
    }

    getAdaptiveQuiz(accountId: number, wordListTypeId?: number): Observable<AdaptiveQuiz | undefined> {
        let rawValueObservable = this.getRawAdaptiveQuiz(accountId, wordListTypeId)
            .pipe(
                catchError(() => of(undefined))
            );
        let cacheKey = {accountId: accountId, wordListTypeId: wordListTypeId};

        return forkJoin([rawValueObservable, this.adaptiveQuizCache.getCache(cacheKey)])
            .pipe(
                rxJsMap((merged) => {
                    let [rawValue, cachedValue] = merged;
                    // fresh cache, use raw value
                    if (!cachedValue) {
                        this.logger.log("AVQ is fresh");
                        return [true, rawValue];
                    }

                    // messageCode = 3, use raw value
                    if (cachedValue.messageCode == MESSAGE_CODE_CHOOSE) {
                        this.logger.log("AVQ messageCode = 3");
                        return [true, rawValue];
                    }

                    // service returned a new band to test, use raw value
                    if (rawValue.adaptiveQuizStepId != cachedValue.adaptiveQuizStepId) {
                        this.logger.log("AVQ new band");
                        return [true, rawValue];
                    }

                    // let's check if raw is lagging compared to cached value
                    let rawValueWordRootIds = this.extractWordRootIds(rawValue);
                    let cachedValueWordRootIds = this.extractWordRootIds(cachedValue);

                    let differences = difference(rawValueWordRootIds, cachedValueWordRootIds);

                    // raw is lagging, use cached value for now
                    if (size(differences)) {
                        this.logger.log("AVQ service is lagging");
                        return [false, cachedValue];
                    }

                    // cached value is on par or ahead
                    this.logger.log("AVQ service is ahead");
                    return [true, rawValue];
                }),
                rxJsMap((merged: [boolean, AdaptiveQuiz]) => {
                    let [shouldSave, adaptiveQuiz] = merged;
                    if (shouldSave) {
                        this.deleteAdaptiveQuizStateCache();
                        this.adaptiveQuizCache.setValue(cacheKey, adaptiveQuiz, QUIZ_CACHE_LIFETIME);
                    } else {
                        this.setAdaptiveQuizProcessing(accountId);
                    }

                    return adaptiveQuiz as AdaptiveQuiz;
                })
            );
    }

    setAdaptiveQuizProcessing(accountId: number): void {
        let cacheKey = {accountId: accountId};
        this.adaptiveQuizCache
            .getCache(cacheKey)
            .subscribe((cachedValue) => {
                let newValue = assign(cachedValue, {messageCode: MESSAGE_CODE_PROCESSING});
                this.adaptiveQuizCache.setValue(cacheKey, newValue, QUIZ_CACHE_LIFETIME);
            });

        this.adaptiveQuizStateCache
            .getCache(cacheKey)
            .subscribe((cachedValue) => {
                let newValue = assign(cachedValue, {messageCode: MESSAGE_CODE_PROCESSING});
                this.adaptiveQuizCache.setValue(cacheKey, newValue, QUIZ_CACHE_LIFETIME);
            });
    }

    private extractWordRootIds(adaptiveQuiz: AdaptiveQuiz): number[] {
        return compact(map(adaptiveQuiz?.quizWords ?? [], quizWord => quizWord?.word?.wordRootID));
    }

    getAdaptiveQuizState(accountId: number): Observable<AdaptiveQuiz> {
        return this.getAccountWordListSetting(accountId)
            .pipe(
                mergeMap((accountWordListSetting) => {
                    let wordListTypeId = get(
                        accountWordListSetting,
                        "latestWordList.wordListTypeId",
                        DEFAULT_WORD_LIST_TYPE_ID
                    );
                    let wordListName = get(
                        accountWordListSetting,
                        "latestWordList.name",
                        DEFAULT_WORD_LIST_TYPE_NAME
                    );

                    return this.adaptiveQuizStateCache.getCache({
                        accountId: accountId,
                        wordListTypeId: wordListTypeId
                    }, () => {
                        return this.getRawAdaptiveQuiz(accountId, wordListTypeId, {includeAVQStateOnly: true}).pipe(
                            rxJsMap(adaptiveQuiz => assign({wordListName: wordListName}, adaptiveQuiz))
                        );
                    }, QUIZ_CACHE_LIFETIME);
                })
            );
    }

    adaptiveQuizLevelUp(accountId: number,
                        wordListTypeId: number = DEFAULT_WORD_LIST_TYPE_ID,
                        levelUp: boolean = false): Observable<string> {
        return this.connection
            .service("bridge")
            .setPath(`/content/quiz/adaptive/account/${accountId}`)
            .post({
                levelUp: levelUp,
                wordListTypeId: wordListTypeId
            })
            .pipe(
                retryWhen(servicesRetryStrategy())
            );
    }

    getAdaptiveTest(accountId: number,
                    classId: number,
                    testId: number,
                    examId: number): Observable<AdaptiveTest | undefined> {
        if (!accountId) {
            return of(undefined);
        }
        return this.connection
            .service("bridge")
            .setPath(`/identity/class/${classId}/test/exam/${examId}/account/${accountId}`)
            .get();
    }

    getClassAdaptiveTest(classId: number, accountId?: number): Observable<ClassAdaptiveTest | undefined> {
        if (!classId) {
            return of(undefined);
        }
        return this.connection
            .service("bridge")
            .setPath(`/identity/class/${classId}/test`)
            .get({accountId: accountId}, undefined, ConnectionFactoryService.SERVICE_VERSION.v1);
    }

    getAccountAdaptiveTest(accountId: number, recommendedFilter: boolean = true): Observable<AccountAdaptiveTest | undefined> {
        if (!accountId) {
            return of(undefined);
        }
        return this.connection
            .service("bridge")
            .setPath(`/identity/class/account/${accountId}/tests`)
            .get({recommendedWidgetFiltered: recommendedFilter});
    }

    getMultipleTestExamSettings(classId: number, params: object): Observable<VocabBuilderSetting[]> {
        return this.examSettingsCache.getCache(
            params,
            () => {
                return this.connection
                    .service("bridge")
                    .setPath(`/identity/class/${classId}/test/exam/settings`)
                    .get(params, undefined, ConnectionFactoryService.SERVICE_VERSION.v1);
            }
        );
    }

    getTestExamSettings(classId: number, classTestExamId: number): Observable<VocabBuilderSetting> {
        return this.connection
            .service("bridge")
            .setPath(`/identity/class/${classId}/test/exam/${classTestExamId}/settings`)
            .get(undefined, undefined, ConnectionFactoryService.SERVICE_VERSION.v1);
    }

    addClassAdaptiveTest(classId: number, params: object): Observable<ClassTest | undefined> {
        if (!classId) {
            return of(undefined);
        }
        return this.connection
            .service("bridge")
            .setPath(`/identity/class/${classId}/test`)
            .put(undefined, params, ConnectionFactoryService.SERVICE_VERSION.v1);
    }

    addTestExam(classId: number, classTestId: number, params: object): Observable<AdaptiveTest> {
        if (!classId || !classTestId) {
            return of(undefined);
        }
        return this.connection
            .service("bridge")
            .setPath(`/identity/class/${classId}/test/${classTestId}/exam`)
            .put(undefined, params, ConnectionFactoryService.SERVICE_VERSION.v1);
    }

    addRecurringTestExam(classId: number, classTestId: number, params: object, body: object): Observable<ClassTest> {
        if (!classId || !classTestId) {
            return of(undefined);
        }
        return this.connection
            .service("bridge", false, false)
            .setPath(`/identity/class/${classId}/test/${classTestId}/exam/schedule`)
            .post(params, body, ConnectionFactoryService.SERVICE_VERSION.v1);
    }

    removeClassAdaptiveTest(classId: number, classTestId: number): Observable<void> {
        if (!classId) {
            return of(undefined);
        }
        return this.connection
            .service("bridge")
            .setPath(`/identity/class/${classId}/test/${classTestId}`)
            .delete();
    }

    removeClassAdaptiveExam(classId: number, classTestExamId: number): Observable<void> {
        if (!classId || !classTestExamId) {
            return of(undefined);
        }
        return this.connection
            .service("bridge")
            .setPath(`/identity/class/${classId}/test/exam/${classTestExamId}`)
            .delete();
    }

    removeClassAdaptiveExamsAfter(classId: number, classTestId: number, params: object = {}): Observable<ClassTest> {
        if (!classId || !classTestId) {
            return of(undefined);
        }
        return this.connection
            .service("bridge")
            .setPath(`/identity/class/${classId}/test/${classTestId}/exams/after`)
            .delete(params, undefined, ConnectionFactoryService.SERVICE_VERSION.v1);
    }

    updateAccountAdaptiveQuizSettings(accountId: number,
                                      wordListTypeId: number,
                                      band: number): Observable<void> {
        if (!accountId || !wordListTypeId || !band) {
            return of(undefined);
        }
        return this.connection
            .service("bridge")
            .setPath(`/content/quiz/adaptive/account/${accountId}/wordlist/${wordListTypeId}/band/${band}`)
            .post();
    }

    getAccountWordListSetting(accountId: number): Observable<AccountWordListSetting> {
        if (!accountId) {
            return of(undefined);
        }
        return this.connection
            .service("bridge")
            .setPath(`/content/quiz/adaptive/account/${accountId}/wordlist`)
            .get();
    }

    getQuizWordsV1(activityId: number, wordIds: number[]): Observable<ContentQuizWordsV1 | undefined> {
        const MODE_DISTRACTOR = 2;
        return this.connection
            .service("content")
            .setPath("/quiz/word/v1")
            .post(undefined, {
                quizWordSources: [{
                    activityId: activityId,
                    wordIds: wordIds
                }],
                applyModeId: MODE_DISTRACTOR,
                modeIds: [VOCAB_BUILDER_MODE_ID_MULTIPLE_CHOICE],
                siteLanguage: this.globalSettingService.getLanguage()
            }, ConnectionFactoryService.SERVICE_VERSION.v1);
    }

    deleteExamSettingsCache(): void {
        this.examSettingsCache.destroy();
    }

    deleteAdaptiveQuizStateCache(): void {
        this.adaptiveQuizCache.destroy();
        this.adaptiveQuizStateCache.destroy();
    }
}
