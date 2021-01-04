import { Directive, EventEmitter, OnDestroy, Output } from "@angular/core";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { Subscriber } from "rxjs";
import { IPageId, PAGE_ID } from "src/app/configs/page-id.interface";
import { AppInjector } from "src/app/shareds/helpers/app-injector";
import { AppService } from "src/app/shareds/services/app.service";
import { PermissionViewModel } from "../view-models/permission.viewmodel";

@Directive()
export class BaseFormComponent implements OnDestroy {
    @Output() saveSuccessful = new EventEmitter();
    appService: AppService;
    formBuilder: FormBuilder;
    model: FormGroup;
    isSubmitted = false;
    isSaving = false;
    isUpdate = false;
    formErrors: any = {};
    validationMessages: any = {};
    translationFormErrors = {};
    translationValidationMessage = [];
    subscribers: any = {};
    isModified = false;
    isCreateAnother = false;
    pageId: IPageId;
    // Permission.
    permission: PermissionViewModel = {
        view: false,
        add: false,
        edit: false,
        delete: false,
        export: false,
        print: false,
        approve: false,
        report: false
    };

    private _message: { type: string, content: string } = {
        type: '',
        content: ''
    };

    constructor() {
        this.appService = AppInjector.get(AppService);
        this.pageId = AppInjector.get(PAGE_ID);
        setTimeout(() => {
            // this.permission = this.appService.getPermissionByPageId();
        });
        this.formBuilder = AppInjector.get(FormBuilder);
    }

    ngOnDestroy() {
        for (const subscriberKey in this.subscribers) {
            if (this.subscribers.hasOwnProperty(subscriberKey)) {
                const subscriber = this.subscribers[subscriberKey];
                if (subscriber instanceof Subscriber) {
                    subscriber.unsubscribe();
                }
            }
        }
    }
    setMessage(type: string, content: string) {
        this._message.type = type;
        this._message.content = content;
    }

    resetMessage() {
        this._message.type = '';
        this._message.content = '';
    }

    renderFormError(args: (string | Object)[]): any {
        const object = {};
        args.forEach((item: string | Object) => {
            if (item instanceof Object) {
                object[Object.keys(item)[0]] = this.renderFormError(
                    Object.values(item)[0]
                );
            } else {
                object[item as string] = '';
            }
        });
        return object;
    }

    renderFormErrorMessage(args: (string | Object)[]): any {
        const object = {};
        args.forEach((item: string | Object) => {
            if (item instanceof Object) {
                object[Object.keys(item)[0]] = this.renderFormErrorMessage(
                    Object.values(item)[0]
                );
            } else {
                object[item as string] = item;
            }
        });
        return object;
    }

    validateModel<T>(isSubmit: boolean = true) {
        return this.validateFormGroup(this.model, this.formErrors, this.validationMessages, isSubmit);
    }

    validateFormGroup<T>(formGroup: T, formErrors: any, validationMessages: any, isSubmit?: boolean,
        elements?: any, data?: any): boolean {
        if (!formGroup) {
            return;
        }
        const form = <any>formGroup as FormGroup;
        return this.checkFormValid(form, formErrors, validationMessages, isSubmit);
    }

    clearFormError(formErrors: any) {
        for (const field in formErrors) {
            if (typeof (formErrors[field]) === 'object' && field != null) {
                this.clearFormError(formErrors[field]);
            } else {
                formErrors[field] = '';
            }
        }
    }
    
    clearFormArray = (formArray: FormArray) => {
        while (formArray.length !== 0) {
            formArray.removeAt(0);
        }
    }

    private checkFormValid(form: FormGroup, formErrors: any, validationMessages: any, isSubmit?: boolean): boolean {
        let inValidCount = 0;
        let isValid = true;
        for (const field in formErrors) {
            if (typeof (formErrors[field]) === 'object' && field != null && form != null) {
                const newFormGroup = <any>form.get(field) as FormGroup;
                if (newFormGroup instanceof FormArray) {
                    newFormGroup.controls.forEach((control: FormGroup, index: number) => {
                        isValid = this.checkFormValid(control, formErrors[field], validationMessages[field], isSubmit);
                    });
                } else {
                    isValid = this.checkFormValid(newFormGroup, formErrors[field], validationMessages[field], isSubmit);
                }
            } else {
                if (field != null && form != null) {
                    formErrors[field] = '';
                    const control = form.get(field);
                    if (control && isSubmit) {
                        control.markAsDirty();
                    }
                    if (control && control.dirty && !control.valid) {
                        const messages = validationMessages[field];
                        for (const key in control.errors) {
                            if (control.errors.hasOwnProperty(key)) {
                                formErrors[field] += messages[key];
                                inValidCount++;
                            }
                        }
                    }
                }
            }
        }
        return inValidCount === 0 && isValid;
    }
}