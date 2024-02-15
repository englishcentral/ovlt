import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, NavigationExtras, Router } from "@angular/router";
import { VocabularyAppSharedService } from "./vocabulary-app-shared.service";

@Component({
    selector: "ec-vocabulary-app",
    templateUrl: "vocabulary-app.component.html",
    styleUrls: ["vocabulary-app.component.scss"]
})
export class VocabularyAppComponent implements OnInit, OnDestroy {
    private tabSectionVisible: boolean = true;

    constructor(
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

    ngOnDestroy(): void {
        this.vocabularyAppSharedService.destroy();
    }
}
