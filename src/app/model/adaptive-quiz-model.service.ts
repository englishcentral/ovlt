import { assign } from "lodash-es";
import { Injectable } from "@angular/core";
import { ConnectionFactoryService } from "../../core/connection-factory.service";
import { Observable } from "rxjs";
import { AvqWordListItem, ContentWordAdapterList, ContentWordFilter, WordListTypeOfWordRoot } from "../types/word";
import { VocabBuilderReference } from "../types/vocab-builder-reference";
import { DialogLine } from "../types/dialog-line";
import { WordList, WordListOrganizationMatch, WordListWord } from "../types/word-list-reference";
import { MemoryCache } from "../../core/memory-cache";
import { WordListLearned } from "../types/word-list-learned";

export interface WordListMasteryBaseParams {
    accountID: number;
}

export interface WordListMasteryParams extends WordListMasteryBaseParams {
    wordListTypeID: number;
}

// TODO alter WordListMasteryBaseParams to fit this when content migration is done
export interface WordListsMasteriesParams {
    wordListTypeIds: number[];
    accountId: number;
}

@Injectable({providedIn: "root"})
export class AdaptiveQuizModelService {
    private filteredWordListsCache: MemoryCache<WordList[]> = new MemoryCache<WordList[]>();
    private wordListTypeCache: MemoryCache<WordList> = new MemoryCache<WordList>();

    constructor(private connection: ConnectionFactoryService) {
    }

    getListOfWords(params: object): Observable<AvqWordListItem[]> {
        return this.connection
            .service("bridge")
            .setPath("/content/wordlist")
            .get(params);
    }

    getListOfWordsContentService(wordListTypeId: number, params: object): Observable<{wordListWords: WordListWord[]}> {
        return this.connection
            .service("content")
            .setPath(`/wordlists/${wordListTypeId}/v1/sharedMeanings`)
            .get(params);
    }

    getWordListsByActivityId(activtyId: number, params: object): Observable<{wordListWords: WordListWord[]}> {
        return this.connection
            .service("content")
            .setPath(`/wordlists/v1/activityId/${activtyId}/sharedMeanings`)
            .get(params);
    }

    getFilteredWordLists(params: object = {}): Observable<WordList[]> {
        return this.filteredWordListsCache.getCache(params, () => {
            return this.connection
                .service("bridge")
                .setPath("/content/wordlist/lists")
                .get(params);
        });
    }

    getActivityWordList(activityId: number, params: object = {}): Observable<WordList> {
        return this.connection
            .service("bridge")
            .setPath(`/content/wordlist/activity/${activityId}`)
            .get(params);
    }

    // user level selector component should also be fixed.
    getWordListMastery(params: WordListMasteryParams): Observable<WordListLearned> {
        return this.connection
            .service("reportcard")
            .setPath("/report/word/list/mastery")
            .get(params);
    }

    // not used, can be removed after changing tests
    getWordListsMasteries(params: WordListsMasteriesParams): Observable<WordListLearned[]> {
        return this.connection
            .service("reportcard")
            .setPath("/report/word/list/masteries")
            .get(params);
    }

    getWordListsMasteriesContent(params: WordListsMasteriesParams): Observable<WordListLearned[]> {
        return this.connection
            .service("reportcard")
            .setPath("/report/word/v1/list/mastery")
            .get(params);
    }

    getWordListTypes(params: object): Observable<VocabBuilderReference[]> {
        return this.connection
            .service("bridge")
            .setPath("/reference")
            .get(params);
    }

    getCollectionSize(params: object): Observable<number> {
        return this.connection
            .service("bridge")
            .setPath("/content/wordlist/count")
            .get(params);
    }

    getDialogLinesWithGivenWordrootId(wordRootId: number, params: object): Observable<DialogLine[]> {
        return this.connection
            .service("bridge")
            .setPath(`/content/dialogLine/contains/wordroot/${wordRootId}`)
            .get(params);
    }

    getDialogLinesCountWithGivenWordrootId(wordRootId: number): Observable<number> {
        return this.connection
            .service("bridge")
            .setPath(`/content/dialogLine/contains/wordroot/${wordRootId}/count`)
            .get({toInt: 1});
    }

    getSizeOfDialogLinesWithGivenWordrootId(wordRootId: number): Observable<number> {
        return this.connection
            .service("bridge")
            .setPath(`/content/dialogLine/contains/wordroot/${wordRootId}/count`)
            .get({toInt: 1});
    }

    updateWord(params: object): Observable<void> {
        return this.connection
            .service("bridge")
            .setPath("/content/wordlist/word")
            .put(params);
    }

    createWord(params: object): Observable<void> {
        return this.connection
            .service("bridge")
            .setPath("/content/wordlist/word")
            .post(params);
    }

    deleteWord(params: object): Observable<void> {
        return this.connection
            .service("bridge")
            .setPath("/content/wordlist/word")
            .delete(params);
    }

    getContentWordFromEcWordRootId(ecWordRootId: number, options?: ContentWordFilter): Observable<ContentWordAdapterList> {
        let params: ContentWordFilter = { wordRootId: ecWordRootId };
        if (options) {
            params = assign(params, options);
        }
        return this.connection
            .service("content")
            .setPath("/word/adapter/editing/v1")
            .get(params, "", "", {}, { "Content-Type": "application/vnd.englishcentral-v1+json" });
    }

    getWordlistTypeOfWordroot(params: object): Observable<WordListTypeOfWordRoot> {
        return this.connection
            .service("bridge")
            .setPath("/content/wordlist/listsWithRoots")
            .get(params);
    }

    updateWordTranslation(params: object): Observable<void> {
        return this.connection
            .service("bridge")
            .setPath("/content/word/root/definition")
            .post(params);
    }

    updateWordDefinition(params: object): Observable<void> {
        return this.connection
            .service("bridge")
            .setPath("/content/word/root/definition")
            .put(params);
    }

    destroyFilteredWordListsCache(): void {
        this.filteredWordListsCache.destroy();
    }

    addWordListOrganizationMatch(params: object): Observable<WordListOrganizationMatch> {
        return this.connection
            .service("bridge")
            .setPath("/content/wordlist/organizations")
            .post(params);
    }

    deleteWordListOrganizationMatch(params: object): Observable<void> {
        return this.connection
            .service("bridge")
            .setPath("/content/wordlist/organizations")
            .delete(params);
    }

    getWordList(wordListTypeId: number, params: object = {}): Observable<WordList> {
        return this.wordListTypeCache.getCache(assign({}, {wordListTypeId: wordListTypeId}, params), () => {
            return this.connection
                .service("bridge")
                .setPath(`/content/wordlist/list/${wordListTypeId}`)
                .get(params);
        });
    }
}
