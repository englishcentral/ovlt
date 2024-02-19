import { Injectable } from "@angular/core";
import { Observable, Subscription } from "rxjs";
import "video.js/dist/video-js.min.css";
import { Emitter } from "../../core/emitters/emitter";
import { Logger } from "../../core/logger/logger";
import { GlobalCache } from "../../core/global-cache";
import { has } from "lodash-es";
import { BrowserMediaDeviceService } from "../../core/browser-media-device.service";
import { FeatureService } from "../../core/feature.service";
import { first, takeUntil } from "rxjs/operators";

declare var videoJs;

@Injectable({
    providedIn: "root"
})
export class VideoFactoryService {
    static NS = "playerInstance";
    static EVENT_CREATE = "create";
    static EVENT_DESTROY = "destroy";

    private emitter = new Emitter(true);
    private logger = new Logger();

    constructor(private browserMediaDeviceService: BrowserMediaDeviceService,
                private featureService: FeatureService) {
    }

    private initLibrary(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            if (typeof (<any>window).videoJs !== "undefined") {
                return resolve(true);
            }
            require.ensure([], () => {
                (<any>window).videoJs = require("video.js").default;
                return resolve(true);
            });
        });
    }

    async create(videoId: string, videoOptions?: any, readyFn?: () => void): Promise<any> {
        if (!videoId || !this.getVideoElement(videoId)) {
            return Promise.reject("no video element container");
        }

        let namespace = this.generateNamespace(videoId);
        let videoElement = this.getVideoElement(videoId);

        await this.initLibrary();
        let player = videoJs(
            videoElement,
            videoOptions,
            readyFn
        );

        if (videoOptions && has(videoOptions, "controlBar") && !videoOptions.controlBar) {
            player.on("ended", () => {
                player.load();
            });
        }
        // @ts-ignore setSinkId missing from DOM typing
        if (this.isSpeakerSettingsEnabled() && videoElement.setSinkId) {
            this.browserMediaDeviceService.initialize().then(() => {
                this.setVideoSink(videoElement);

                this.browserMediaDeviceService
                    .getObservable(BrowserMediaDeviceService.EVENT_AUDIO_OUTPUT_SETTINGS_CHANGE)
                    .pipe(
                        takeUntil(
                            this.getObservable(VideoFactoryService.EVENT_DESTROY)
                                .pipe(
                                    first(destroyedVideoId => {
                                        return destroyedVideoId == videoId;
                                    })
                                )
                        )
                    )
                    .subscribe(() => {
                        this.setVideoSink(videoElement);
                    });
            });
        }

        this.logger.log("Publishing video creation", videoId);
        this.publish(VideoFactoryService.EVENT_CREATE, videoId);

        GlobalCache.setCache(namespace, player);

        return player;
    }

    private setVideoSink(videoElement: HTMLElement): void {
        const audioOutputDevice = this.browserMediaDeviceService.getCurrentAudioOutput();
        // @ts-ignore
        if (audioOutputDevice?.id && videoElement.setSinkId) {
            // @ts-ignore
            videoElement.setSinkId(audioOutputDevice.id);
        }
    }

    private getVideoElement(videoId: string): HTMLElement {
        return document.getElementById(videoId);
    }

    private generateNamespace(videoId: string): string {
        return `${VideoFactoryService.NS}_${videoId}`;
    }

    getInstance(videoId: string): any | undefined {
        if (!videoId) {
            return;
        }

        if (typeof videoJs !== "undefined" && this.getVideoElement(videoId)) {
            return videoJs(this.getVideoElement(videoId));
        }

        return undefined;
    }

    destroy(videoId: string): void {
        this.logger.log("Attempting to destroy video instance", videoId);
        if (!videoId) {
            return;
        }

        let instanceId = this.generateNamespace(videoId);
        let previousInstance = GlobalCache.getCache<any>(instanceId);

        try {
            if (previousInstance) {
                previousInstance?.dispose();
                GlobalCache.removeCache(instanceId);
                this.publish(VideoFactoryService.EVENT_DESTROY, videoId);
            }
            this.logger.log("video instance successfully destroyed");
        } catch (e) {
            this.logger.log("unable to destroy video instance", e);
        }
    }

    private isSpeakerSettingsEnabled(): boolean {
        return this.featureService.getFeature("isPlayerSpeakerSettingsEnabled");
    }

    subscribe(eventName: string, successFn: (data?) => void, errorFn?: (e?) => void): Subscription {
        return this.emitter.subscribe(eventName, successFn, errorFn);
    }

    publish(eventName: string, data?: any): void {
        this.emitter.publish(eventName, data);
    }

    getObservable<T>(eventName: string): Observable<T> {
        return this.emitter.getObservable(eventName);
    }
}
