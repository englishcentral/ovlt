import { Injectable } from "@angular/core";
import { ConnectionFactoryService } from "../../core/connection-factory.service";
import { Observable } from "rxjs";
import { StudyLevelOption } from "../types/studylevel-option";
import { StorageCache } from "../../core/storage-cache";

export const SORT_ASC = 1;

@Injectable()
export class StudyLevelModelService {
    private cacheLevelOptions = new StorageCache<StudyLevelOption[]>("StudyLevelOptionService");
    private cacheLevel = new StorageCache<number>("StudyLevelService");
    constructor(private connection: ConnectionFactoryService) {
    }

    getRawOptions(additionalOptions?: object): Observable<StudyLevelOption[]> {
        return this.connection
            .service("bridge")
            .setPath("/identity/studylevel/options")
            .get(additionalOptions);
    }

    getOptions(additionalOptions?: object, refresh: boolean = false, expiration: number = ConnectionFactoryService.CACHE_LIFETIME.identity): Observable<StudyLevelOption[]> {
        return this.cacheLevelOptions.getCache(additionalOptions, () => {
            return this.getRawOptions(additionalOptions);
        }, expiration, refresh);
    }

    getRawLevel(additionalOptions?: object): Observable<number> {
        return this.connection
            .service("bridge")
            .setPath("/identity/studylevel")
            .get(additionalOptions);
    }

    getLevel(additionalOptions?: object, refresh: boolean = false, expiration: number = ConnectionFactoryService.CACHE_LIFETIME.identity): Observable<number> {
        return this.cacheLevel.getCache(additionalOptions, () => {
            return this.getRawLevel(additionalOptions);
        }, expiration, refresh);
    }

    getLevelOriginal(accountId: number): Observable<number> {
        return this.connection
            .service("bridge")
            .setPath(`/identity/studylevel/${accountId}/original`)
            .get();
    }

    postLevel(additionalOptions?: object): Observable<number> {
        return this.connection
            .service("bridge")
            .setPath("/identity/studylevel")
            .post(additionalOptions);
    }

    putLevel(additionalOptions?: object): Observable<number> {
        return this.connection
            .service("bridge")
            .setPath("/identity/studylevel")
            .put(additionalOptions);
    }

    deleteLevelCache(): void {
        this.cacheLevel.destroy();
    }

    deleteLevelOptionCache(): void {
        this.deleteLevelOptionCache();
    }
}
