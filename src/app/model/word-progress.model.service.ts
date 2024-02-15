import { Injectable } from "@angular/core";
import { ConnectionFactoryService } from "../../core/connection-factory.service";
import { Observable, of } from "rxjs";
import { AccountWordListProgressList } from "../../types/word-root-progress";
import { SharedWordHeadProgress, WordHeadProgress } from "../../types/word-head-progress";
import { MyWordStateV1 } from "../../types/my-word-state-v1";
import { MyWordState, MyWordStateV2 } from "../../types/my-word-state-v2";
import { assign, isEmpty } from "lodash-es";


@Injectable()
export class WordProgressModelService {
    constructor(private connection: ConnectionFactoryService) {
    }

    // can be removed after changing unit tests
    getWordListProgress(accountId: number, wordListTypeId: number): Observable<AccountWordListProgressList> {
        if (!accountId || !wordListTypeId) {
            return of(undefined);
        }

        return this.connection
            .service("reportcard")
            .setPath(`/report/quiz/account/${accountId}/wordlist/${wordListTypeId}`)
            .post(undefined, undefined, ConnectionFactoryService.SERVICE_VERSION.v1);
    }

    getWordListProgressContent(accountId: number, wordListTypeId: number, queryParams: object = {}) {
        if (!accountId || !wordListTypeId) {
            return of(undefined);
        }

        return this.connection
            .service("reportcard")
            .setPath(`/report/quiz/v1/account/${accountId}/wordlist/${wordListTypeId}/sharedMeaningId/progress`)
            .post(queryParams, [], ConnectionFactoryService.SERVICE_VERSION.v1);
    }

    getMyWordProgress(parameters: MyWordProgressParam): Observable<WordHeadProgress[]> {
        return this.connection
            .service("reportcard")
            .setPath("/report/word/my/progress")
            .get(parameters);
    }

    getMyWordProgressWithSharedMeaning(parameters): Observable<SharedWordHeadProgress[]> {
        return this.connection
            .service("reportcard")
            .setPath("/report/word/v1/my/sharedMeaning/progress")
            .get(parameters);
    }

    getProgressByWordHeadIds(wordHeadIds: number[], additionalParams?: MyWordProgressParam): Observable<WordHeadProgress[]> {
        if (isEmpty(wordHeadIds)) {
            return of([]);
        }
        let params = {wordHeadIDs: wordHeadIds.join(",")};
        if (additionalParams) {
            params = assign({}, params, additionalParams);
        }
        return this.getMyWordProgress(params);
    }

    getWordStateV1(): Observable<MyWordStateV1> {
        return this.connection
            .service("reportcard")
            .setPath("/report/word/my")
            .get(undefined, undefined, ConnectionFactoryService.SERVICE_VERSION.v1);
    }

    getWordStateV2(additionalParam: object = {}): Observable<MyWordStateV2> {
        return this.connection
            .service("reportcard")
            .setPath("/report/word/my")
            .get(additionalParam, undefined, ConnectionFactoryService.SERVICE_VERSION.v2);
    }

    getMyWordsCount(additionalParam: object = {}): Observable<MyWordState> {
        return this.connection
            .service("reportcard")
            .setPath("/report/word/v1/my/sharedMeaning")
            .get(additionalParam, undefined, ConnectionFactoryService.SERVICE_VERSION.v2);
    }

    postRecommendedWord(accountId: number, params: object): Observable<void> {
        return this.connection
            .service("reportcard")
            .setPath(`/report/word/recommended/v1/account/${accountId}`)
            .post(params);
    }

    deleteRecommendedWord(accountId: number, params: object): Observable<void> {
        return this.connection
            .service("reportcard")
            .setPath(`/report/word/recommended/v1/account/${accountId}`)
            .delete(params);
    }
}

// TODO: Add all params found in http://reportcard.devenglishcentral.com/documentation/resource_ReportWordREST.html#resource_ReportWordREST_getMyWordProgress_GET
export class MyWordProgressParam {
    wordHeadIDs?: string;
    courseID?: number;
    filters?: string;
    exclude?: string;
    includeMyWordsCourses?: boolean;
    page?: number;
    pageSize?: number;
    sort?: string;
    sortDesc?: boolean;
    unitID?: number;
}
