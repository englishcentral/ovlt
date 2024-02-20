import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    Output,
    SimpleChanges,
    ViewChild
} from "@angular/core";
import { VideoFactoryService } from "./video-factory.service";
import { assign } from "lodash-es";
import { Asset, AssetType } from "../../types/asset";
import { Logger } from "../common/logger";

export interface VideoTracking {
    category: string;
    action: string;
    label: string;
}

@Component({
    selector: "ec-video",
    templateUrl: "video.component.html",
    styleUrls: ["video.component.scss"]
})
export class VideoComponent implements AfterViewInit, OnChanges, OnDestroy {
    @Input() videoId: string;
    @Input() videoUrl: string;
    @Input() videoSources: Record<number, Asset>;
    @Input() preferredSource: number;
    @Input() poster: string;
    @Input() width: string;
    @Input() height: string;
    @Input() videoOptions: any;
    @Input() resetOnEnd: boolean = false;
    @Input() destroyOnEnd: boolean = false;
    @Input() isDefaultStyleEnabled: boolean = true;
    @Input() additionalClasses: string;

    @Output() eventEnded = new EventEmitter<boolean>();
    @Output() eventError = new EventEmitter<any>();

    @ViewChild("videoElement", {static: false}) videoElement: ElementRef;

    private player;
    private currentSrc: string;
    private error: boolean = false;
    private ready: boolean = false;
    private logger = new Logger();

    static DEFAULT_ATTRIBUTES = [
        "controls",
        "webkit-playsinline",
        "playsinline"
    ];

    constructor(private videoFactory: VideoFactoryService,
                private changeDetectorRef: ChangeDetectorRef) {
    }

    getVideoId(): string | undefined {
        return this.videoId;
    }

    private getVideoUrl(): string | undefined {
        if (this.videoSources) {
            return this.videoSources[this.preferredSource]?.assetUrl
                ?? this.videoSources[AssetType.DIALOG_THUMB_SIZE_360P]?.assetUrl
                ?? this.videoUrl;
        }
        return this.videoUrl;
    }

    getVideoOptions(): Record<any, any> {
        let baseVideoOptions = {
            poster: this.poster,
            width: this.width,
            height: this.height
        };
        return assign(baseVideoOptions, this.videoOptions);
    }

    isReady(): boolean {
        return this.ready;
    }

    hasError(): boolean {
        return this.error;
    }

    getPosterStyle(): object {
        return {
            width: `${this.getVideoOptions()?.width} px`,
            height: `${this.getVideoOptions()?.height} px`,
            "background-image": `url(${this.getVideoOptions()?.poster})`
        };
    }

    getVideoClass(): string | undefined {
        return this.additionalClasses;
    }

    getVideoStyle(): object {
        if (!this.isDefaultStyleEnabled) {
            return;
        }

        return {
            "object-fit": "cover",
            position: "unset",
            lineHeight: "0"
        };
    }

    private trackVideo(tracking: VideoTracking, currentTime?: string): void {
        if (!tracking) {
            return;
        }

        let label = tracking.label;
        if (currentTime) {
            label = label.replace("<duration>", currentTime);
        }
    }

    private setReady(isReady: boolean): void {
        if (this.ready === isReady) {
            return;
        }
        this.ready = isReady;
        this.changeDetectorRef.markForCheck();
    }

    private async renderVideo(): Promise<void> {
        if (!this.videoId || !document.getElementById(this.videoId)) {
            this.logger.log("video element not initialized", this.videoId, document.getElementById(this.videoId));
            return;
        }

        this.setReady(false);

        let blankPlaceholderVideo = "./assets/blank.mp4";
        let videoUrl = this.getVideoUrl();
        this.currentSrc = videoUrl;

        if (!videoUrl) {
            videoUrl = blankPlaceholderVideo;
            this.logger.log("No videoUrl detected for " + this.videoId);
        }

        let videoOptions = this.getVideoOptions();
        this.logger.log("Creating video for ", this.videoId);
        this.player = await this.videoFactory.create(this.videoId,
            videoOptions,
            () => {
                this.setReady(true);
            }
        );
        this.player.on("error", () => {
            this.eventError.emit(this.player.error);
            this.player.src(blankPlaceholderVideo);
        });

        if (videoOptions.trackOnPlay) {
            this.player.on("play", () => {
                this.trackVideo(videoOptions.trackOnPlay);
            });
        }

        if (videoOptions.trackOnPause) {
            this.player.on("pause", () => {
                this.trackVideo(videoOptions.trackOnPause, this.player.currentTime());
            });
        }

        this.player.on("ended", () => {
            this.eventEnded.emit(true);
        });

        if (this.resetOnEnd) {
            this.player.on("ended", () => {
                this.player.pause();
                this.player.currentTime(0);
                this.player.trigger("loadstart");
            });
        }

        if (this.destroyOnEnd) {
            this.player.on("ended", () => {
                this.videoFactory.destroy(this.videoId);
            });
        }

        this.player.src(videoUrl);
        if (videoOptions.poster) {
            this.player.poster(videoOptions.poster);
        }

        this.player.ready(() => {
            this.setReady(true);
        });
    }

    ngAfterViewInit(): void {
        this.renderVideo();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!this.videoId) {
            return;
        }

        const currentSource = this.currentSrc;
        const newSource = this.getVideoUrl();

        if (!newSource || currentSource == newSource) {
            return;
        }

        if (changes["videoSources"] || changes["videoUrl"]) {
            this.renderVideo();
            return;
        }

        if (changes["preferredSource"]?.currentValue) {
            if (this.player) {
                let currentTime = this.player.currentTime();
                let isPreviouslyPaused = this.player.paused();

                this.player.on("loadeddata", () => {
                    this.player.currentTime(currentTime);
                    if (!isPreviouslyPaused) {
                        this.player.play();
                    }
                });
                this.player.src(newSource);
                return;
            }

            this.renderVideo();
        }
    }

    ngOnDestroy(): void {
        this.videoFactory.destroy(this.videoId);
    }
}
