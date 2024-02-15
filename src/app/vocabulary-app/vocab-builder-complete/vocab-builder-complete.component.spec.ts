import { ComponentFixture, fakeAsync, TestBed } from "@angular/core/testing";
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from "@angular/core";
import { VocabBuilderCompleteComponent } from "./vocab-builder-complete.component";
import { VocabBuilderStateService } from "../../../../activity-app/vocab-builder-app/vocab-builder-state.service";
import { VocabBuilderProgressService } from "../../../../activity-app/vocab-builder-app/vocab-builder-progress.service";
import { AccountModelService } from "../../../../model/identity/account-model.service";
import { IdentityService } from "../../../../core/identity.service";
import { accountModelServiceStub } from "../../../../core/tests/stubs/identity/account-model-service.stub";
import {
    vocabBuilderStateServiceStub
} from "../../../../core/tests/stubs/vocab-builder-app/vocab-builder-state-service.stub";
import {
    vocabBuilderProgressServiceStub
} from "../../../../core/tests/stubs/vocab-builder-app/vocab-builder-progress-service.stub";
import { identityServiceStub } from "../../../../core/tests/stubs/common/identity-service.stub";
import { changeDetectorRefStub } from "../../../../core/tests/stubs/change-detector-ref.stub";
import { FeatureModelService } from "../../../../model/identity/feature-model.service";
import { featureModelServiceStub } from "../../../../core/tests/stubs/common/feature-model-service.stub";
import { modalLaunchServiceStub } from "../../../../core/tests/stubs/modal-launch-service.stub";
import { ModalLaunchService } from "../../../../core/modal-launch.service";

describe("VocabBuilderCompleteComponent", () => {
    // Setup vars
    let component: VocabBuilderCompleteComponent;
    let fixture: ComponentFixture<VocabBuilderCompleteComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [VocabBuilderCompleteComponent],
            schemas: [NO_ERRORS_SCHEMA],

            providers: [
                {provide: VocabBuilderStateService, useValue: vocabBuilderStateServiceStub},
                {provide: VocabBuilderProgressService, useValue: vocabBuilderProgressServiceStub},
                {provide: ModalLaunchService, useValue: modalLaunchServiceStub},
                {provide: IdentityService, useValue: identityServiceStub},
                {provide: ChangeDetectorRef, useValue: changeDetectorRefStub},
                {provide: FeatureModelService, useValue: featureModelServiceStub}
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(VocabBuilderCompleteComponent);
        component = fixture.componentInstance;
    });

    test("should create the component", () => {
        expect(component).toBeDefined();
    });

    test("startQuiz", fakeAsync(() => {
        component.eventStartQuiz.subscribe((value) => {
            expect(value).toBe(true);
        })
        component.startQuiz(true);
    }));

    test("closeApp", () => {
        component.closeApp();
        expect(vocabBuilderStateServiceStub.close).toHaveBeenCalled();
    });

    test("onOpenSettings", () => {
        component.onOpenSettings();
        expect(vocabBuilderStateServiceStub.setSettingsDrawerEnabled).toHaveBeenCalledWith(true);
    });

    test("getSettings", () => {
        vocabBuilderStateServiceStub.getCurrentSetting.mockReturnValue({foo: 123, bar: true})
        expect(component.getSettings()).toEqual({foo: 123, bar: true});
    });
});
