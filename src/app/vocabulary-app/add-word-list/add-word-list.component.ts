import { Component, EventEmitter, Input, OnDestroy, Output } from "@angular/core";
import { SubscriptionAbstract } from "../../../../core/subscription.abstract";
import { WordList } from "../../../../model/types/word-list-reference";
import { catchError, takeUntil } from "rxjs/operators";
import { of } from "rxjs";
import { ReferenceModelService } from "../../../../model/content/reference-model.service";
import { IdentityService } from "../../../../core/identity.service";

@Component({
    selector: "ec-add-word-list",
    templateUrl: "add-word-list.component.html",
    styleUrls: ["add-word-list.component.scss"]
})
export class AddWordListComponent extends SubscriptionAbstract implements OnDestroy {
    @Input() wordList: WordList;
    @Input() wordListAdded: boolean;

    @Output() eventWordListTouched = new EventEmitter<void>();

    private listProcessing: boolean = false;

    constructor(private referenceModelService: ReferenceModelService,
                private identityService: IdentityService) {
        super();
    }

    toggleWordList(): void {
        if (this.isListProcessing()) {
            return;
        }

        this.eventWordListTouched.emit();
        this.setWordListAdded(!this.wordListAdded);

        if (this.isWordListAdded()) {
            this.addWordList();
        } else if (!this.isWordListAdded()) {
            this.removeWordList();
        }
    }

    addWordList(): void {
        this.setListProcessing(true);
        this.referenceModelService.addWordList(this.identityService.getAccountId(), this.getWordList().wordListTypeId.toString())
            .pipe(
                takeUntil(this.getDestroyInterceptor()),
                catchError(() => {
                    return of([]);
                })
            )
            .subscribe(() => {
                this.setListProcessing(false);
            });
    }

    removeWordList(): void {
        this.setListProcessing(true);
        this.referenceModelService.removeWordList(this.identityService.getAccountId(), this.getWordList().wordListTypeId)
            .pipe(
                takeUntil(this.getDestroyInterceptor()),
                catchError(() => {
                    return of([]);
                })
            )
            .subscribe(() => {
                this.setListProcessing(false);
            });
    }

    getWordList(): WordList {
        return this.wordList;
    }

    isListProcessing(): boolean {
        return this.listProcessing;
    }

    isWordListAdded(): boolean {
        return this.wordListAdded;
    }

    setWordListAdded(wordListAdded: boolean): void {
        this.wordListAdded = wordListAdded;
    }

    setListProcessing(listProcessing: boolean): void {
        this.listProcessing = listProcessing;
    }

}
