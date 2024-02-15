import { Injectable } from "@angular/core";
import { Subscription } from "rxjs";

import { ReferenceModelService } from "src/app/model/reference-model.service";
import { IdentityService } from "../common/identity.service";
import { Emitter } from "../common/emitter";

@Injectable()
export class VocabularyAppSharedService {
    private emitter = new Emitter();

    static EVENT_ON_HIDE_VOCABULARY_TABS = "onHideVocabularyTabs";

    private selectedWordHeadIds?: number[];
    private selectedSharedMeaningIds?: number[];
    private wordListTypeId?: number;
    private backButtonVisible: boolean = true;
    private numberOfWordItems: number = 0;

    constructor(private referenceModelService: ReferenceModelService,
                private identityService: IdentityService) {

    }

    getSelectedWordHeadIds(): number[] {
        return this.selectedWordHeadIds;
    }

    getSelectedSharedMeaningIds(): number[] {
        return this.selectedSharedMeaningIds;
    }

    getWordListTypeId(): number {
        return this.wordListTypeId;
    }

    getNumberOfWordItems(): number {
        return this.numberOfWordItems;
    }

    isBackButtonVisible(): boolean {
        return this.backButtonVisible;
    }

    setBackButtonVisible(backButtonVisible: boolean): void {
        this.backButtonVisible = backButtonVisible;
    }

    setWordListTypeId(wordListTypeId: number): void {
        this.wordListTypeId = wordListTypeId;
    }

    setSelectedWordIds(wordHeadIds: number[]): void {
        this.selectedWordHeadIds = wordHeadIds;
    }

    setSelectedWordSharedMeaningIds(sharedMeaningIds: number[]): void {
        this.selectedSharedMeaningIds = sharedMeaningIds;
    }

    setNumberOfWordItems(numberOfWordItems: number): void {
        this.numberOfWordItems = numberOfWordItems;
    }

    resetSelectedWordHeadIds(): void {
        this.selectedWordHeadIds = [];
    }

    subscribe(eventName: string, successFn: (data?) => void, errorFn?: (e?) => void): Subscription {
        return this.emitter.subscribe(eventName, successFn, errorFn);
    }

    publish(eventName: string, data?: any): void {
        this.emitter.publish(eventName, data);
    }

    reset(): void {
        this.numberOfWordItems = 0;
        this.resetSelectedWordHeadIds();
    }

    clearCaches(): void {
        const accountId = this.identityService.getAccountId();
        this.referenceModelService.clearAccountWordListsReference(accountId);
    }

    destroy(): void {
        this.wordListTypeId = undefined;
        this.reset();
        this.clearCaches();
    }
}
