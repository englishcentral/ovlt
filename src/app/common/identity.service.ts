import { ElementRef, Injectable } from "@angular/core";
import { AccountModelService } from "../model/identity/account-model.service";
import { Logger } from "./logger/logger";
import { BehaviorSubject, Observable, Subscription } from "rxjs";
import { GlobalSettingService } from "./global-setting.service";
import { Identity } from "../model/types/identity";
import { Emitter } from "./emitters/emitter";
import { Instrumentation } from "./instrumentation/instrumentation";
import { GlobalObservableCache } from "./global-observable-cache";
import { StudentOrganizationData } from "../model/types/student-organization-data";
import { share, tap } from "rxjs/operators";
import { Partner } from "../model/types/partner";
import { isEqual, isUndefined } from "lodash-es";
import { DateFnsConfig, TIMEZONE_UTC } from "./date-fns-util";
import { UserType } from "../model/types/user-type";
import { Ldap } from "../model/types/ldap";

export interface AccountPlayerSettings {
    autoStart: boolean;
    helpActivated: boolean;
    hiddenChallenge: boolean;
    speakModeAutoAdvance: boolean;
    playerTranscript: boolean;
    playerTranslation: boolean;
    speakLite: boolean;
    autoPauseWatchMode: boolean;
    timezone?: string;
}

export class AccountIdentity extends Identity {
    static ROLE_TYPE_ID_WLS = 1;
    static ROLE_TYPE_ID_PREMIUM = 2;
    static ROLE_TYPE_ID_UNREGISTERED = 9;
    static ROLE_TYPE_ID_SUPPORT_TRIAL_PREMIUM = 12;
    static ROLE_TYPE_ID_ACADEMIC_PREMIUM = 20;
    static ROLE_TYPE_ID_PREMIUM_STUDENT = 20;
    static ROLE_TYPE_ID_PLATINUM = 21;
    static ROLE_TYPE_ID_PREMIUM_SEAT = 13;
    static ROLE_TYPE_ID_TUTOR = 29;
    static ROLE_TYPE_ID_TUTOR_OPS = 30;
    static ROLE_TYPE_ID_ROLE_STUDENT = 27;
    static ROLE_TYPE_ID_RTC_USER = 46;
    static ROLE_TYPE_ID_KID = 50;

    static LOCALE_ENGLISH: string = "en";
    static LOCALE_SPANISH: string = "es";
    static LOCALE_PORTUGUESE: string = "pt";
    static LOCALE_TURKISH: string = "tr";
    static LOCALE_VIETNAMESE: string = "vi";
    static LOCALE_KOREAN: string = "ko";
    static LOCALE_JAPANESE: string = "ja";
    static LOCALE_CHINESE: string = "zh";
    static LOCALE_CHINESE_SIMPLIFIED: string = "zh-cn";
    static LOCALE_RUSSIAN: string = "ru";

    playerSettings: AccountPlayerSettings;
}

@Injectable({providedIn: "root"})
export class IdentityService {
    static readonly EVENT_IDENTITY_UPDATE: string = "onIdentityUpdate";
    static readonly EVENT_IDENTITY_REFRESH: string = "onIdentityRefresh";
    static readonly EVENT_AFFILIATION_UPDATE: string = "onAffiliationUpdate";
    static readonly EVENT_IDENTITY_NAME_UPDATED: string = "onIdentityNameUpdated";
    public static DEFAULT_PLAYER_SETTINGS: AccountPlayerSettings = {
        autoStart: true,
        helpActivated: true,
        hiddenChallenge: false,
        speakModeAutoAdvance: true,
        playerTranscript: true,
        playerTranslation: true,
        speakLite: true,
        autoPauseWatchMode: false
    };

    //Bitwise AND values for boolean settings stored on server:
    public static readonly PLAYER_AUTO_START: number = 1;
    public static readonly PLAYER_HELP_ACTIVATED: number = 2;
    public static readonly PLAYER_HIDDEN_CHALLENGE: number = 4;
    public static readonly PLAYER_SPEAK_MODE_AUTO_ADVANCE: number = 8;
    public static readonly PLAYER_TRANSCRIPT: number = 16;
    public static readonly PLAYER_TRANSLATION: number = 32;
    public static readonly PLAYER_SPEAKLITE: number = 64;
    public static readonly PLAYER_AUTOPAUSE_WATCHMODE: number = 128;

    private emitter = new Emitter(true);
    private logger = new Logger();
    private initialized: boolean = false;
    private accountId: number;
    private identityId: string;
    private arrivalId: string;
    private authenticationId: string;
    private partnerId: number;
    private ldap: Ldap;
    private accountIdentity: AccountIdentity;
    private partnerUsername: string;
    private currentPromise: Promise<AccountIdentity> | undefined;
    private isPlayerSettingsSetByUser: boolean = false;
    private initialize$ = new BehaviorSubject<boolean>(false);

    constructor(private globalSettingService: GlobalSettingService,
                private accountModelService: AccountModelService) {
        this.subscribe(IdentityService.EVENT_IDENTITY_REFRESH, () => {
            let accountId = this.getAccountId() || this.getRawAccountId();
            this.refreshIdentity(accountId).then(() => {
                this.logger.log("Identity Refreshed", accountId);
            });
        });
    }

    initialize(rawAccountId?: number,
               rawIdentityId?: string,
               refreshIdentity: boolean = false): Promise<AccountIdentity> {
        let accountId = rawAccountId && rawAccountId > 0 ? rawAccountId : this.accountId;
        let identityId = rawIdentityId || this.identityId;

        if (this.initialized && this.getAccountId() && !refreshIdentity) {
            return Promise.resolve(this.accountIdentity);
        }

        if (this.accountId === accountId && this.currentPromise && !refreshIdentity) {
            return this.currentPromise;
        }

        this.currentPromise = new Promise((resolve) => {
            if (!accountId) {
                let accountIdentity = this.setAccountIdentity(undefined);

                this.initialized = true;
                this.initialize$.next(true);

                return resolve(accountIdentity);
            }

            GlobalObservableCache.getCache(this.generateNamespace(accountId), () => {
                return this.accountModelService
                    .getIdentity(accountId, identityId)
                    .pipe(
                        share()
                    );
            })
                .pipe(
                    tap(() => {
                        if (this.isPartner()) {
                            this.fetchPartnerUsername();
                        }
                    })
                )
                .subscribe((identity: Identity) => {
                    this.setPlayerSettingsModified(identity);

                    let accountIdentity = this.setAccountIdentity(identity);

                    this.initialized = true;
                    this.initialize$.next(true);

                    resolve(accountIdentity);
                });
        });

        return this.currentPromise;
    }

    getInitialize$(): Observable<boolean> {
        return this.initialize$.asObservable();
    }

    private generateNamespace(accountId?: number): string {
        return "identityService" + (accountId || 0).toString();
    }

    refreshIdentity(accountId?: number, shouldPublishIdentityRefresh: boolean = true): Promise<AccountIdentity> {
        return this.initialize(accountId, undefined, true);
    }

    isPremium(): boolean {
        if (!this.initialized) {
            return false;
        }
        return this.accountIdentity.roleTypeIDs.includes(AccountIdentity.ROLE_TYPE_ID_PREMIUM)
            || this.accountIdentity.roleTypeIDs.includes(AccountIdentity.ROLE_TYPE_ID_PREMIUM_STUDENT)
            || this.isPlatinum();
    }

    isAcademic(): boolean {
        if (!this.initialized) {
            return false;
        }
        return this.accountIdentity.roleTypeIDs.includes(AccountIdentity.ROLE_TYPE_ID_PREMIUM_SEAT)
            || this.accountIdentity.roleTypeIDs.includes(AccountIdentity.ROLE_TYPE_ID_PREMIUM_STUDENT);
    }

    isPlatinum(): boolean {
        if (!this.initialized) {
            return false;
        }
        return this.accountIdentity.roleTypeIDs.includes(AccountIdentity.ROLE_TYPE_ID_PLATINUM);
    }

    isAcademicOnly(): boolean {
        if (!this.initialized) {
            return false;
        }
        return (this.accountIdentity.roleTypeIDs.includes(AccountIdentity.ROLE_TYPE_ID_PREMIUM_SEAT) || this.accountIdentity.roleTypeIDs.includes(AccountIdentity.ROLE_TYPE_ID_PREMIUM_STUDENT))
            && !this.accountIdentity.roleTypeIDs.includes(AccountIdentity.ROLE_TYPE_ID_PLATINUM)
            && !this.accountIdentity.roleTypeIDs.includes(AccountIdentity.ROLE_TYPE_ID_PREMIUM);
    }

    isTutor(): boolean {
        if (!this.initialized) {
            return false;
        }
        return this.accountIdentity.roleTypeIDs.includes(AccountIdentity.ROLE_TYPE_ID_TUTOR) &&
            !this.accountIdentity.roleTypeIDs.includes(AccountIdentity.ROLE_TYPE_ID_TUTOR_OPS);
    }

    isTutorOperator(): boolean {
        if (!this.initialized) {
            return false;
        }
        return this.accountIdentity.roleTypeIDs.includes(AccountIdentity.ROLE_TYPE_ID_TUTOR_OPS);
    }

    isKidUser(): boolean {
        if (!this.initialized || this.isAnonymous()) {
            return false;
        }
        return this.accountIdentity.roleTypeIDs.includes(AccountIdentity.ROLE_TYPE_ID_KID);
    }

    initializeFromElement(elementRef: ElementRef, initIdentity: boolean = false): void {
        if (this.initialized || this.accountId > 0) {
            return;
        }

        const accountId = elementRef.nativeElement.getAttribute("account-id") || this.globalSettingService.getInitAccountId();
        const identityId = elementRef.nativeElement.getAttribute("identity-id");
        const partnerId = elementRef.nativeElement.getAttribute("partner-id");
        const arrivalId = elementRef.nativeElement.getAttribute("arrival-id");
        const authenticationId = elementRef.nativeElement.getAttribute("authentication-id");
        const ldap = elementRef.nativeElement.getAttribute("ldap");

        if (!isUndefined(accountId)) {
            const intAccountId = parseInt(accountId);
            if (!isNaN(intAccountId)) {
                this.setAccountId(intAccountId);
            }
        }
        if (!isUndefined(identityId)) {
            this.setIdentityId(identityId);
        }
        if (!isUndefined(arrivalId)) {
            this.setArrivalId(arrivalId);
        }
        if (!isUndefined(authenticationId)) {
            this.setAuthenticationId(authenticationId);
        }
        if (!isUndefined(partnerId)) {
            this.setPartnerId(parseInt(partnerId));
        }

        if (!isUndefined(ldap)) {
            this.setLdap(JSON.parse(ldap));
        }

        if (initIdentity) {
            this.initialize(accountId, identityId);
        }
    }

    setAccountId(accountId: number): void {
        this.accountId = accountId;
    }

    getRawAccountId(): number | undefined {
        return this.accountId;
    }

    setIdentityId(identityId: string): void {
        this.identityId = identityId;
    }

    setArrivalId(arrivalId: string): void {
        this.arrivalId = arrivalId;
    }

    setAuthenticationId(authenticationId: string): void {
        this.authenticationId = authenticationId;
    }

    setPartnerId(partnerId: number): void {
        this.partnerId = partnerId;
    }

    getArrivalId(): string {
        return this.arrivalId || "";
    }

    getAuthenticationId(): string {
        return this.authenticationId || "";
    }

    getIdentityId(): string {
        return this.identityId || "";
    }

    fetchPartnerUsername(): void {
        this.accountModelService.getPartnerUsername()
            .subscribe((data) => {
                this.setPartnerUsername(data.name);
                this.publish(IdentityService.EVENT_IDENTITY_NAME_UPDATED);
            });
    }

    setPartnerUsername(name): void {
        this.partnerUsername = name;
    }

    getPartnerUsername(): string {
        return this.partnerUsername;
    }

    getPartnerId(): number {
        if (this.hasIdentity()) {
            return this.accountIdentity?.primaryPartnerID || Partner.PARTNER_ID_ENGLISHCENTRAL;
        }
        return this.partnerId || Partner.PARTNER_ID_ENGLISHCENTRAL;
    }

    getDifficultyLevel(): number {
        return this.accountIdentity?.difficultyLevel ?? 0;
    }

    getTimezone(): string {
        const accountTimezone = this.accountIdentity.timezone;
        const browserTimezone = Intl?.DateTimeFormat().resolvedOptions().timeZone;
        return browserTimezone || accountTimezone || TIMEZONE_UTC;
    }

    getCountry(): string {
        return this.accountIdentity.country || this.accountIdentity.geolocatorCountry || this.getNativeLanguage() || this.getSiteLanguage() || this.globalSettingService.getLanguage();
    }

    getLastAddedCourseId(): string {
        return this.accountIdentity.lastAddedCourseId || "";
    }

    getPartnerWhitelist(): boolean {
        return this.accountIdentity.partnerWhitelist ?? false;
    }

    getDateAdded(): string {
        return this.accountIdentity.dateAdded || "";
    }

    getUserType(): UserType {
        if (this.isAnonymous()) {
            return UserType.ANONYMOUS;
        }
        if (this.isTeacher()) {
            return UserType.TEACHER;
        }
        if (this.isStudent()) {
            return UserType.STUDENT;
        }
        return UserType.LEARNER;
    }

    isUseWebrtc(): boolean {
        return (this.accountIdentity.useWebRtc ?? false) || this.accountIdentity.roleTypeIDs.includes(AccountIdentity.ROLE_TYPE_ID_RTC_USER);
    }

    setLdap(ldap: Ldap): void {
        this.ldap = ldap;
    }

    getLdap(): Ldap {
        return this.ldap;
    }

    getLdapRoles(): { [number: number]: string } {
        return this.getLdap()?.roles;
    }

    getLdapId(): string {
        return this.getLdap()?.ldapId;
    }

    setAccountIdentity(identity?: Identity, shouldPublishUpdate = true): AccountIdentity {
        let newIdentity = {
            ...new Identity(),
            ...(identity || {}),
            accountID: identity?.accountID ?? 0,
            primaryPartnerID: identity?.primaryPartnerID ?? Partner.PARTNER_ID_ENGLISHCENTRAL,
            skypeID: identity?.skypeID ?? "",
            siteLanguage: identity?.siteLanguage ?? this.globalSettingService.getLanguage(),
            nativeLanguage: identity?.nativeLanguage ?? "",
            userLanguage: identity?.userLanguage ?? this.globalSettingService.getLanguage(),
            playerSettings: this.playerSettingsToObject(identity?.playerSettings) ?? IdentityService.DEFAULT_PLAYER_SETTINGS
        };

        if (isEqual(newIdentity, this.accountIdentity)) {
            return this.accountIdentity;
        }

        this.accountIdentity = newIdentity;
        DateFnsConfig.setTimezone(this.getTimezone());
        Instrumentation.setAccountInfo(this.accountIdentity);
        if (shouldPublishUpdate) {
            this.publish(IdentityService.EVENT_IDENTITY_UPDATE, this.accountIdentity);
        }
        return this.accountIdentity;
    }

    isPlayerSettingsModified(): boolean {
        return this.isPlayerSettingsSetByUser;
    }

    setPlayerSettingsModified(identity: Identity): void {
        const playerSettings = identity?.playerSettings;
        if (playerSettings) {
            this.isPlayerSettingsSetByUser = true;
        }
    }

    isAnonymous(): boolean {
        return isUndefined(this.getAccountId()) || this.getAccountId() == 0;
    }

    hasIdentity(): boolean {
        if (!this.getAccountId()) {
            return false;
        }
        return !!this.accountIdentity;
    }

    isStudent(): boolean {
        return this.hasIdentity() && this.accountIdentity.isStudent;
    }

    isTeacher(): boolean {
        return this.hasIdentity() && this.accountIdentity.isTeacher;
    }

    /**
     * @deprecated use !Plan.isBasic(...) instead
     */
    isPaid(): boolean {
        return this.isPlatinum() || this.isPremium();
    }

    /*
     * @deprecated use feature knobs instead
     */
    isLangrich(): boolean {
        return this.getPartnerId() == Partner.PARTNER_ID_LANGRICH;
    }

    isYoelGeva(): boolean {
        return this.getPartnerId() == Partner.PARTNER_ID_YOELGEVA;
    }

    isPartner(): boolean {
        return this.getPartnerId() != Partner.PARTNER_ID_ENGLISHCENTRAL;
    }

    getIdentity(): AccountIdentity {
        return this.accountIdentity;
    }

    isInitialized(): boolean {
        return this.initialized;
    }

    getAccountId(): number | undefined {
        return this.initialized
            ? this.accountIdentity.accountID
            : undefined;
    }

    getProperty<T>(key: string): T | undefined {
        return this.accountIdentity?.[key];
    }

    getUsername(alternativeName: string = ""): string {
        if (this.getPartnerUsername()) {
            return this.getPartnerUsername();
        }
        return this.getName(alternativeName);
    }

    getName(alternativeName: string = ""): string {
        return this.accountIdentity.name || alternativeName;
    }

    getEmail(): string {
        return this.accountIdentity.email || "";
    }

    getNickName(): string {
        return this.accountIdentity.nickName || "";
    }

    getStudentOrganizationData(): StudentOrganizationData {
        return this.accountIdentity.studentOrganizationData;
    }

    getPhone(): string {
        return this.accountIdentity.phone || "";
    }

    getSiteLanguage(): string | undefined {
        if (!this.initialized) {
            return undefined;
        }
        return this.accountIdentity?.siteLanguage;
    }

    getNativeLanguage(): string | undefined {
        if (!this.initialized) {
            return undefined;
        }
        return this.accountIdentity?.nativeLanguage;
    }

    getUserLanguage(): string | undefined {

        if (!this.initialized) {
            return undefined;
        }
        return this.accountIdentity?.userLanguage;
    }

    getStudyLanguage(): string | undefined {

        if (!this.initialized) {
            return undefined;
        }
        return this.accountIdentity?.latestStudyLanguage;
    }

    hasUsedMobile(): boolean {
        return this.accountIdentity?.hasUsedMobile || false;
    }

    private playerSettingsToObject(playerSettings: number): AccountPlayerSettings {
        if (isUndefined(playerSettings)) {
            return IdentityService.DEFAULT_PLAYER_SETTINGS;
        }

        return {
            autoStart: IdentityService.getFlag(IdentityService.PLAYER_AUTO_START, playerSettings),
            helpActivated: IdentityService.getFlag(IdentityService.PLAYER_HELP_ACTIVATED, playerSettings),
            hiddenChallenge: IdentityService.getFlag(IdentityService.PLAYER_HIDDEN_CHALLENGE, playerSettings),
            speakModeAutoAdvance: IdentityService.getFlag(IdentityService.PLAYER_HELP_ACTIVATED, playerSettings),
            playerTranscript: IdentityService.getFlag(IdentityService.PLAYER_TRANSCRIPT, playerSettings),
            playerTranslation: IdentityService.getFlag(IdentityService.PLAYER_TRANSLATION, playerSettings),
            speakLite: IdentityService.getFlag(IdentityService.PLAYER_SPEAKLITE, playerSettings),
            autoPauseWatchMode: IdentityService.getFlag(IdentityService.PLAYER_AUTOPAUSE_WATCHMODE, playerSettings)
        };
    }

    // NOTE: Bitwise operation here (single & )
    static getFlag(flagMask: number, playerSettings: number): boolean {
        return (playerSettings & flagMask) > 0;
    }

    private playerSettingsToInt(): number {
        let playerSettings = this.accountIdentity.playerSettings;

        return (playerSettings.autoStart ? IdentityService.PLAYER_AUTO_START : 0) +
            (playerSettings.helpActivated ? IdentityService.PLAYER_HELP_ACTIVATED : 0) +
            (playerSettings.hiddenChallenge ? IdentityService.PLAYER_HIDDEN_CHALLENGE : 0) +
            (playerSettings.speakModeAutoAdvance ? IdentityService.PLAYER_SPEAK_MODE_AUTO_ADVANCE : 0) +
            (playerSettings.playerTranscript ? IdentityService.PLAYER_TRANSCRIPT : 0) +
            (playerSettings.playerTranslation ? IdentityService.PLAYER_TRANSLATION : 0) +
            (playerSettings.speakLite ? IdentityService.PLAYER_SPEAKLITE : 0) +
            (playerSettings.autoPauseWatchMode ? IdentityService.PLAYER_AUTOPAUSE_WATCHMODE : 0);
    }

    private updatePlayerSettings(): AccountIdentity | undefined {
        if (!this.initialized) {
            throw new Error("Cannot change settings before settings are initialized");
        }
        if (this.accountIdentity.accountID) {
            this.accountModelService.setAccountSettings(this.playerSettingsToInt()).subscribe(() => {
                this.logger.log("Account settings updated");
            });
        }
        this.publish(IdentityService.EVENT_IDENTITY_UPDATE, this.accountIdentity);

        return this.accountIdentity;
    }

    setPlayerSetting(key: string, val: boolean): void {
        if (this.accountIdentity.playerSettings[key] != val) {
            this.accountIdentity.playerSettings[key] = val;
            this.updatePlayerSettings();
        }
    }

    setTimezone(tz: string): void {
        if (!isUndefined(tz)) {
            this.accountIdentity.timezone = tz;
        }
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
