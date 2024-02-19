import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { SharedWordHeadProgress } from "../../types/word-head-progress";
import { MyWordState, MyWordStateV2 } from "../../types/my-word-state-v2";


@Injectable()
export class WordProgressModelService {
    constructor() {
    }

    getMyWordProgressWithSharedMeaning(parameters): Observable<SharedWordHeadProgress[]> {
        return of(undefined);
    }

    getWordStateV2(additionalParam: object = {}): Observable<MyWordStateV2> {
        return of(undefined);
    }

    getMyWordsCount(additionalParam: object = {}): Observable<MyWordState> {
        return of(undefined);
    }
}
