import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";
import { Emitter } from "./emitter";
import { Logger } from "./logger";

@Injectable({providedIn: "root"})
export class IdentityService {
    static readonly EVENT_IDENTITY_UPDATE: string = "onIdentityUpdate";
    static readonly EVENT_IDENTITY_REFRESH: string = "onIdentityRefresh";
    static readonly EVENT_AFFILIATION_UPDATE: string = "onAffiliationUpdate";
    static readonly EVENT_IDENTITY_NAME_UPDATED: string = "onIdentityNameUpdated";

    private emitter = new Emitter(true);
    private logger = new Logger();
    private initialized: boolean = false;
    private accountId: number;
    private arrivalId: string;
    private accountIdentity: {
        "accountID": 341240,
        "name": "EnglishCentral Test Student",
        "email": "jet.fontanilla@englishcentral.com",
        "siteLanguage": "en",
        "nativeLanguage": "fil",
        "userLanguage": "fil",
        "roleTypeIDs": [
            1,
            7,
            27,
            44,
            13
        ],
        "originalPartnerID": 2,
        "primaryPartnerID": 82,
        "partnerWhitelist": false,
        "datePremiumStart": "2017-04-26T20:37:34.000Z",
        "geolocatorCountry": "KR",
        "facebookID": 100002745040113,
        "googleID": "jet.fontanilla@englishcentral.com",
        "timezone": "America/Manaus",
        "studentClassIDs": [
            13890,
            13891,
            13892,
            13895,
            13896,
            13897,
            13898,
            13899,
            13201,
            9365,
            13846,
            13464,
            13595,
            144870,
            16167,
            13160,
            12974,
            13295,
            13679,
            16367,
            16437,
            9334,
            15415,
            12153,
            13497,
            13370,
            14461,
            14462
        ],
        "isTeacher": true,
        "isStudent": true,
        "country": "PH",
        "nickName": "EnglishCentralDev",
        "dateAdded": "2016-05-10T05:57:00.000Z",
        "dateSubscriptionExpiration": "2099-01-01T00:00:00.000Z",
        "isSubscriptionRenewing": false,
        "isInvisible": false,
        "playerSettings": 48,
        "userGoal": 2,
        "difficultyType": "ec",
        "difficultyLevel": 7,
        "gender": 1,
        "originalConsumerID": 100439,
        "hasUsedMobile": true,
        "substituteIfTutorNotAvailable": true,
        "nativeLanguageLabel": "Filipino",
        "useWebRtc": false,
        "latestStudyLanguage": "en"
    };

    constructor() {
        this.subscribe(IdentityService.EVENT_IDENTITY_REFRESH, () => {
            let accountId = this.getAccountId() || this.getRawAccountId();
            this.refreshIdentity(accountId).then(() => {
                this.logger.log("Identity Refreshed", accountId);
            });
        });
    }

    refreshIdentity(accountId?: number, shouldPublishIdentityRefresh: boolean = true): Promise<any> {
        return Promise.resolve(this.getIdentity());
    }

    setAccountId(accountId: number): void {
        this.accountId = accountId;
    }

    getRawAccountId(): number | undefined {
        return this.accountId;
    }

    setArrivalId(arrivalId: string): void {
        this.arrivalId = arrivalId;
    }

    getArrivalId(): string {
        return this.arrivalId || "";
    }

    getDifficultyLevel(): number {
        return this.accountIdentity?.difficultyLevel ?? 0;
    }

    hasIdentity(): boolean {
        if (!this.getAccountId()) {
            return false;
        }
        return !!this.accountIdentity;
    }

    isTeacher(): boolean {
        return this.hasIdentity() && this.accountIdentity.isTeacher;
    }

    getIdentity() {
        return this.accountIdentity;
    }

    getAccountId(): number | undefined {
        return this.initialized
            ? this.accountIdentity.accountID
            : undefined;
    }


    getSiteLanguage(): string | undefined {
        if (!this.initialized) {
            return undefined;
        }
        return this.accountIdentity?.siteLanguage;
    }

    subscribe(eventName: string, successFn: (data?) => void, errorFn?: (e?) => void): Subscription {
        return this.emitter.subscribe(eventName, successFn, errorFn);
    }

    publish(eventName: string, data?: any): void {
        this.emitter.publish(eventName, data);
    }

    getObservable(eventName: string) {
        return this.emitter.getObservable(eventName);
    }

    destroy(): void {
        this.emitter.destroy();
    }
}
