import { Injectable } from "@angular/core";
import { ConnectionFactoryService } from "../../core/connection-factory.service";
import { Observable, of } from "rxjs";
import { LanguageName } from "../types/language-name";
import { WordList, WordListReference } from "../types/word-list-reference";
import { VocabBuilderReference } from "../types/vocab-builder-reference";
import { StorageCache } from "../../core/storage-cache";
import { Track } from "../types/track";
import { Logger } from "../../core/logger/logger";
import { Partner } from "../types/partner";
import { StudyLanguageReference } from "../types/study-language-reference";

class ReferenceParams {
    types: string;
    includeInactive?: boolean;
    includeInternal?: boolean;
    includePrivate?: boolean;
}

@Injectable()
export class ReferenceModelService {
    private accountWordListsReference?: StorageCache<WordListReference> = new StorageCache<WordListReference>("accountWordListsReference");
    private accountSelectableWordLists?: StorageCache<WordList[]> = new StorageCache<WordList[]>("accountSelectableWordLists");
    private accountSelectableWordListsCount?: StorageCache<number> = new StorageCache<number>("accountSelectableWordListsCount");
    private partnerTracks?: StorageCache<Track[]> = new StorageCache<Track[]>("partnerTracks");
    private reference?: StorageCache<any> = new StorageCache<any>("reference");
    private logger = new Logger();
    private languageNamesCache = new StorageCache<LanguageName>("ReferenceModelService");
    private trackCache = new StorageCache<Track[]>("ReferenceModelService");

    constructor(private connection: ConnectionFactoryService) {
    }

    getLanguageNames(options: object = {}): Observable<LanguageName> {
        return this.connection
            .service("bridge")
            .setPath("/reference/languageNames")
            .get(options);
    }

    getLanguageNamesCached(options: object = {}): Observable<LanguageName> {
        return this.languageNamesCache.getCache({languageNamesList: "languageNamesList"}, () => {
            return this.connection
                .service("bridge")
                .setPath("/reference/languageNames")
                .get(options);
        }, ConnectionFactoryService.CACHE_LIFETIME.identity);
    }

    getAccountWordListsReference(accountId: number, options: object = {}): Observable<WordListReference> {
        return this.connection
            .service("bridge")
            .setPath(`/content/wordlist/reference/account/${accountId}`)
            .get(options);
    }

    getCachedAccountWordListsReference(accountId: number, siteLanguage: string): Observable<WordListReference> {
        if (!accountId) {
            return of(undefined);
        }

        return this.accountWordListsReference.getCache({accountId: accountId, siteLanguage: siteLanguage}, () => {
            return this.getAccountWordListsReference(accountId, {siteLanguage: siteLanguage});
        }, ConnectionFactoryService.CACHE_LIFETIME.bridge);
    }

    getAccountSelectableWordLists(options: object = {}): Observable<WordList[]> {
        return this.connection
            .service("bridge")
            .setPath(`/content/wordlist/lists`)
            .get(options);
    }

    getCachedAccountSelectableWordListsCount(options: object = {}): Observable<number> {
        return this.accountSelectableWordListsCount.getCache(options, () => {
            return this.getAccountSelectableWordListsCount(options);
        }, ConnectionFactoryService.CACHE_LIFETIME.bridge);
    }

    getAccountSelectableWordListsCount(options: object = {}): Observable<number> {
        return this.connection
            .service("bridge")
            .setPath(`/content/wordlist/lists/count`)
            .get(options);
    }

    getCachedAccountSelectableWordLists(options: object = {}): Observable<WordList[]> {
        return this.accountSelectableWordLists.getCache(options, () => {
            return this.getAccountSelectableWordLists(options);
        }, ConnectionFactoryService.CACHE_LIFETIME.bridge);
    }

    getPartnerTracks(partnerId: number = Partner.PARTNER_ID_ENGLISHCENTRAL, options?: { includeInactive: boolean }): Observable<Track[]> {
        return this.connection
            .service("bridge")
            .setPath(`/content/track/partner/${partnerId}`)
            .get(options);
    }

    getCachedPartnerTracks(partnerId: number = Partner.PARTNER_ID_ENGLISHCENTRAL, options?: { includeInactive: boolean }): Observable<Track[]> {
        return this.partnerTracks.getCache(options, () => {
            return this.getPartnerTracks(partnerId, options);
        }, ConnectionFactoryService.CACHE_LIFETIME.bridge);
    }

    getReference(options: ReferenceParams): Observable<any> {
        return this.connection
            .service("bridge")
            .setPath("/reference")
            .get(options);
    }

    getCachedReference(params: ReferenceParams): Observable<any> {
        const key = params.types;
        return this.reference.getCache({key}, () => {
            return this.getReference(params);
        }, ConnectionFactoryService.CACHE_LIFETIME.bridge);
    }

    getStudyLanguageReference(useCache: boolean = false): Observable<StudyLanguageReference[]> {
        if (useCache) {
            return this.getCachedReference({types: "studyLanguages"});
        }
        return this.getReference({types: "studyLanguages"});
    }

    getWordListReference(useCache: boolean = false): Observable<WordListReference[]> {
        if (useCache) {
            return this.getCachedReference({types: "wordLists"});
        }
        return this.getReference({types: "wordLists"});
    }

    getVocabBuilderReference(includeInternal: boolean = false, useCache: boolean = false): Observable<VocabBuilderReference[]> {
        if (useCache) {
            return this.getCachedReference({types: "vocabBuilder", includeInternal: includeInternal});
        }
        return this.getReference({types: "vocabBuilder", includeInternal: includeInternal});
    }

    addWordList(accountId: number, wordListTypeIds: string): Observable<void> {
        if (!accountId || !wordListTypeIds) {
            this.logger.log("account Id and word list type Id are required");
            return;
        }

        return this.connection
            .service("bridge")
            .setPath(`/content/wordlist/account/${accountId}`)
            .post({wordListTypeIDs: wordListTypeIds});
    }

    removeWordList(accountId: number, wordListTypeId: number): Observable<void> {
        if (!accountId || !wordListTypeId) {
            this.logger.log("account Id and word list type Id are required");
            return;
        }

        return this.connection
            .service("bridge")
            .setPath(`/content/wordlist/account/${accountId}`)
            .delete({wordListTypeID: wordListTypeId});
    }

    clearAccountWordListsReference(accountId: number): void {
        if (!accountId) {
            return;
        }
        this.accountWordListsReference.destroy();
    }

    clearPartnersTrackCache(): void {
        this.partnerTracks.destroy();
    }

    clearReferenceCache(types: string): void {
        this.reference.deleteCache({key: types});
    }

    getTracks(params: object = {}): Observable<Track[]> {
        return this.connection
            .service("bridge")
            .setPath("/content/goal/tracks")
            .get(params);
    }

    getTracksCached(params: object = {}): Observable<Track[]> {
        return this.trackCache.getCache({trackList: "trackList"}, () => {
            return this.connection
                .service("bridge")
                .setPath("/content/goal/tracks")
                .get(params);
        }, ConnectionFactoryService.CACHE_LIFETIME.identity);
    }
}
