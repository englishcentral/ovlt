import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { WordList } from "../../types/word-list-reference";
import { WordListLearned } from "../../types/word-list-learned";

export interface WordListsMasteriesParams {
    wordListTypeIds: number[];
    accountId: number;
}

@Injectable({providedIn: "root"})
export class AdaptiveQuizModelService {

    constructor() {
    }

    getActivityWordList(activityId: number, params: object = {}): Observable<WordList> {
        return of(undefined);
    }

    getWordListsMasteriesContent(params: WordListsMasteriesParams): Observable<WordListLearned[]> {
        return of([]);
    }
}
