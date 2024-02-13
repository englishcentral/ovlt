import { Component, OnDestroy, OnInit } from "@angular/core";
import { AppRoutingStateService } from "../../routes/app-routing-state.service";
import { ROUTE_VIEW_WORDS, ROUTE_VOCAB_QUIZ } from "../../views/vocabulary-view/vocabulary-view.routes";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { DEFAULT_WORD_LIST_TYPE_ID } from "../../../model/types/word-list-reference";
import { VocabularyAppSharedService } from "./vocabulary-app-shared.service";
import { assign } from "lodash-es";
import { ROUTE_VOCABULARY } from "../../routes/routes";

@Component({
    selector: "ec-vocabulary-app",
    templateUrl: "vocabulary-app.component.html",
    styleUrls: ["vocabulary-app.component.scss"]
})
export class VocabularyAppComponent implements OnInit, OnDestroy {
    private tabSectionVisible: boolean = true;

    constructor(
        private appRoutingStateService: AppRoutingStateService,
        private vocabularyAppSharedService: VocabularyAppSharedService,
        private route: ActivatedRoute,
        private router: Router) {
    }

    ngOnInit(): void {
        this.vocabularyAppSharedService.subscribe(VocabularyAppSharedService.EVENT_ON_HIDE_VOCABULARY_TABS, (hide) => {
            this.tabSectionVisible = !hide;
        });

        const classId = this.route.snapshot.paramMap.get("classId");
        if (classId) {
            this.tabSectionVisible = false;
        }
    }

    getNavigationExtras(): NavigationExtras {
        return {
            preserveQueryParams: false
        } as NavigationExtras;
    }

    getQueryParams(): object {
        const queryParams: { [queryParam: string]: any } = {};
        const itemCount = this.vocabularyAppSharedService.getNumberOfWordItems()
            ? this.vocabularyAppSharedService.getNumberOfWordItems()
            : undefined;
        if (itemCount) {
            queryParams.itemCount = itemCount;
        }
        return {queryParams};
    }

    isTabSectionVisible(): boolean {
        return this.tabSectionVisible;
    }

    navigateToViewWords(): void {
        if (this.isViewWordsRouteActive()) {
            return;
        }
        const wordListTypeId = this.vocabularyAppSharedService.getWordListTypeId() || DEFAULT_WORD_LIST_TYPE_ID;
        this.router.navigate(
            [ROUTE_VOCABULARY, ROUTE_VIEW_WORDS, wordListTypeId],
            assign(this.getNavigationExtras(), this.getQueryParams())
        );
    }

    navigateToVocabQuiz(): void {
        if (this.isVocabQuizRouteActive()) {
            return;
        }
        const wordListTypeId = this.vocabularyAppSharedService.getWordListTypeId() || DEFAULT_WORD_LIST_TYPE_ID;
        this.router.navigate(
            [ROUTE_VOCABULARY, ROUTE_VOCAB_QUIZ, wordListTypeId],
            assign(this.getNavigationExtras(), this.getQueryParams())
        );
    }

    isViewWordsRouteActive(): boolean {
        return this.appRoutingStateService.isActiveRoute(`${ROUTE_VOCABULARY}/${ROUTE_VIEW_WORDS}`);
    }

    isVocabQuizRouteActive(): boolean {
        return this.appRoutingStateService.isActiveRoute(`${ROUTE_VOCABULARY}/${ROUTE_VOCAB_QUIZ}`);
    }

    ngOnDestroy(): void {
        this.vocabularyAppSharedService.destroy();
    }
}
