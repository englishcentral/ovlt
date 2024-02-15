import { Injectable } from "@angular/core";
import { NgbModal, NgbModalOptions, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { get, isEmpty, isUndefined, keys, map } from "lodash-es";
import { Emitter } from "./emitter";

export const DEFAULT_MODAL_OPTIONS = {
  container: ".ec-pwa-v2-landing-app",
  centered: true
};

export class BodyElScroll {
  static readonly disableClass: string = "scroll-disabled";

  static disable(): void {
    const classList = get(document, "body.classList") as DOMTokenList;
    if (!classList || classList.contains(BodyElScroll.disableClass)) {
      return;
    }
    classList.add(BodyElScroll.disableClass);
  }

  static enable(): void {
    const classList = get(document, "body.classList") as DOMTokenList;
    if (!classList) {
      return;
    }
    classList.remove(BodyElScroll.disableClass);
  }
}

@Injectable({providedIn: "root"})
export class ModalService {
  private modalRef: NgbModalRef;
  private emitter = new Emitter();

  constructor(private modalService: NgbModal) {
  }

  /*
  * @param {Object} component - Entry component of the modal
  *
  * @param {NgbModalOptions} modalOptions - Modal options from NgbBootstrap
  *
  * @param {componentInputs} componentInputs - Angular @Input fields for the entry component.
  * By using this argument, input fields of the modal component can be changed easily.
  * Ex: { isAuthenticated: true, shouldRegisterField: false }
  * */
  open(component: object,
       modalOptions?: NgbModalOptions,
       componentInputs?: { [key: string]: any }): NgbModalRef {
    if (isUndefined(component)) {
      return;
    }
    if (this.modalRef) {
      this.close();
    }
    const backdrop = get(modalOptions, "backdrop", true);
    this.modalRef = this.modalService.open(component, {
      ...DEFAULT_MODAL_OPTIONS,
      ...{beforeDismiss: this.beforeDismissHandle(backdrop)},
      ...modalOptions
    });

    if (!isEmpty(componentInputs)) {
      map(keys(componentInputs), (key) => {
        this.modalRef.componentInstance[key] = componentInputs[key];
      });
    }

    // BodyElScroll.disable();
    return this.modalRef;
  }

  close(): void {
    // BodyElScroll.enable();
    if (this.modalRef) {
      this.modalRef.close();
      this.modalRef = undefined;
    }
  }

  private beforeDismissHandle(backdrop: string | boolean): () => boolean | Promise<boolean> {
    return () => {
      this.close();
      return backdrop === "static";
    };
  }

  dismissAll(): void {
    this.modalService.dismissAll();
  }

  getObservable(eventName: string) {
    return this.emitter.getObservable(eventName);
  }
}
