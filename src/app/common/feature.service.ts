import { Injectable, NgZone } from "@angular/core";
import { BehaviorSubject, merge, Observable, of, Subscription } from "rxjs";
import { FeatureModelService } from "../model/identity/feature-model.service";
import { GlobalSettingService } from "./global-setting.service";
import { GlobalObservableCache } from "./global-observable-cache";
import { IdentityService } from "./identity.service";
import { Logger } from "./logger";
import { filter, mergeMap, share, tap, throttleTime } from "rxjs/operators";
import { Browser } from "./browser";
import { Instrumentation } from "./instrumentation/instrumentation";
import { isEqual } from "lodash-es";
import { AnalyticsService, TrackerName } from "./analytics";
import { ActiveFeature } from "../model/types/active-feature";
import { Emitter } from "./emitter";

@Injectable({providedIn: "root"})
export class FeatureService {
    static EVENT_FEATURES_INITIALIZED = "featuresInitialized";
    static SPEAKLITE_CONFIG = {
        TRUE: 1,
        FALSE: 3,
        USER_SETTING: 2
    };

    static readonly PRONUNCIATIONREPORTSOURCE_WEAKWORDS = 0;

    static PLAN_BASIC: string = "Basic";


    private emitter: Emitter = new Emitter(false, Emitter.TYPE_REPLAY);
    private initialize$ = new BehaviorSubject<boolean>(false);

    private features?: ActiveFeature;
    private logger = new Logger();
    private currentNameSpace?: string;

    constructor(private featureModelService: FeatureModelService,
                private globalSettingService: GlobalSettingService,
                private analyticsService: AnalyticsService,
                private identityService: IdentityService,
                private zone: NgZone) {
        const DELAY = 500;
        this.identityService.getInitialize$()
            .pipe(
                filter(initialized => initialized),
                mergeMap(() => merge(
                    this.globalSettingService.getObservable(GlobalSettingService.EVENT_SETTINGS_CHANGE),
                    this.identityService.getObservable(IdentityService.EVENT_IDENTITY_UPDATE),
                    this.identityService.getObservable(IdentityService.EVENT_IDENTITY_REFRESH)
                )),
                throttleTime(DELAY),
                mergeMap(() => this.generateFeatures(true)),
                share()
            )
            .subscribe(() => {
                Logger.setDebugMode((<any>window).EC_DEBUG_MODE ?? this.getFeature("debugMode"));
                Instrumentation.setCustomAttribute("isPwav2Enabled", this.isPwaV2Enabled() ? "true" : "false");
            });
    }

    getInitialize$(): Observable<boolean> {
        return this.initialize$.asObservable();
    }

    isInitialized(): boolean {
        return this.initialize$.getValue();
    }

    private generateNamespace(accountId?: number): string {
        return "featureService" + (accountId || 0).toString();
    }

    generateFeatures(refresh: boolean = false): Observable<ActiveFeature> {
        let nameSpace = this.generateNamespace(this.identityService.getRawAccountId());

        if (refresh) {
            this.initialize$.next(false);
            this.currentNameSpace = undefined;
            GlobalObservableCache.removeCache(nameSpace);
        }

        if (nameSpace === this.currentNameSpace) {
            return of(undefined);
        }

        return GlobalObservableCache
            .getCache(nameSpace, () => this.featureModelService.getFeatures())
            .pipe(
                tap((features) => {
                    this.zone.run(() => {
                        if (isEqual(this.features, features)) {
                            return;
                        }
                        this.logger.log("Assigning feature set:", features);
                        this.features = features;
                        this.currentNameSpace = nameSpace;
                        this.publish(FeatureService.EVENT_FEATURES_INITIALIZED, features);
                        this.initialize$.next(true);

                        this.updateAnalyticsCustomDimensions();
                    });
                })
            );
    }

    getFeatures(): ActiveFeature | undefined {
        return this.features;
    }

    getFeature<K extends keyof ActiveFeature>(featureKey: K, defaultValue?: ActiveFeature[K]): ActiveFeature[K] | undefined {
        if (!this.features) {
            return defaultValue ?? undefined;
        }
        return this.features[featureKey] ?? defaultValue ?? undefined;
    }

    isZoomMeetingSdkEnabled(): boolean {
        if (!this.getFeature("isZoomMeetingSdkEnabled", false)) {
            return false;
        }
        return !Browser.isSafari() || this.getFeature("isZoomMeetingSdkSafariEnabled", false);
    }

    isPwaV2Enabled(): boolean {
        return (!Browser.isMobile() && this.getFeature("isWebNewHomePageEnabled"))
            || (Browser.isMobile() && this.getFeature("isMobileWebNewHomePageEnabled"));
    }

    isDebugMode(): boolean {
        return this.getFeature("debugMode");
    }

    getFeaturesPromise(): Promise<ActiveFeature> {
        return this.generateFeatures().toPromise();
    }

    isCustomWebRtcEnabled(): boolean {
        return this.identityService.isUseWebrtc();
    }

    isLevelTestEnabled(): boolean {
        return !this.getFeature("isPartnerFreeLessonDisabled") && this.getFeature("isLevelTestEnabled");
    }

    isPayingUser(): boolean {
        return this.getFeature("isPayingUser");
    }

    isGoLiveEnabled(): boolean {
        return this.getFeature("isGoLiveEnabled");
    }

    isMyEnglishEnabled(): boolean {
        return !this.getFeature("hideMyEnglishLink") && this.getFeature("isPwaMyEnglishHeaderLinkEnabled");
    }

    getObservable<T>(eventName: string): Observable<T> {
        return this.emitter.getObservable(eventName);
    }

    updateAnalyticsCustomDimensions(): void {
        this.analyticsService.updateCustomDimensions(TrackerName.GA, {
            accountId: this.identityService.getAccountId(),
            userType: this.identityService.getUserType(),
            partnerId: this.identityService.getPartnerId(),
            planName: this.getFeature("planName")
        });
    }

    subscribe(eventName: string, successFn: (data?) => void, errorFn?: (e?) => void): Subscription {
        return this.emitter.subscribe(eventName, successFn, errorFn);
    }

    publish(eventName: string, data?: any): void {
        this.emitter.publish(eventName, data);
    }

    destroy(): void {
        this.emitter.destroy();
    }
}
