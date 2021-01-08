import { TranslateService } from '@ngx-translate/core';
import { PageService } from './../page.service';
import { UtilService } from './../../../../../shareds/services/util.service';
import { Page } from './../models/page.model';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseFormComponent } from './../../../../../core/components/base-form.component';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs/operators';
import { IResponseResult } from 'src/app/core/view-models/iresponse.result';
import { TreeData } from 'src/app/core/models/tree-data.model';
import * as _ from 'lodash'
@Component({
  selector: 'page-form',
  templateUrl: './page-form.component.html',
  styleUrls: ['./page-form.component.scss']
})
export class PageFormComponent extends BaseFormComponent implements OnInit {
  page: Page = new Page()
  pageTree: TreeData[]
  constructor(private fb: FormBuilder,
    private utilService: UtilService,
    private activeModal: NgbActiveModal,
    private toastrSerivce: ToastrService,
    private translateService: TranslateService,
    private pageService: PageService) {
    super()
  }

  ngOnInit(): void {
    this.getPageTree();
    this.buildForm();
    console.log(this.page)
  }

  buildForm() {
    this.formErrors = this.utilService.renderFormError(['id', 'icon', 'name', 'description', 'url']);
    this.validationMessages = {
      id: {
        required: this.translateService.instant("validation.required",
          { "title": this.translateService.instant("pages.label.id") }),
      },
      icon: {
        maxlength: this.translateService.instant("validation.maxlength",
          { "title": this.translateService.instant("pages.label.icon"), "max": "200" }),
      },
      url: {
        maxlength: this.translateService.instant("validation.maxlength",
          { "title": this.translateService.instant("pages.label.url"), "max": "200" }),
      },
      name: {
        maxlength: this.translateService.instant("validation.maxlength",
          { "title": this.translateService.instant("pages.label.name"), "max": "200" }),
        required: this.translateService.instant("validation.required",
          { "title": this.translateService.instant("pages.label.name") }),
      },
      description: {
        maxlength: this.translateService.instant("validation.maxlength",
          { "title": this.translateService.instant("pages.label.description"), "max": "500" }),
      }
    };

    this.model = this.fb.group({
      id: [this.page.id, [
        Validators.required
      ]],
      isActive: [this.page.isActive],
      isShowSidebar: [this.page.isShowSidebar],
      url: [this.page.url, [
        Validators.maxLength(500)
      ]],
      icon: [this.page.icon, [
        Validators.maxLength(50)
      ]],
      order: [this.page.order],
      parentId: [this.page.parentId],
      name: [this.page.name, [
        Validators.maxLength(300),
        Validators.required
      ]],
      description: [this.page.description, [
        Validators.maxLength(500),
        Validators.required
      ]],
    });
    this.model.valueChanges.subscribe(data => this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages));
  }

  getPageTree() {
    this.pageService.getPageTree()
      .subscribe((result: TreeData[]) => {
        this.pageTree = result
      });
  }

  openClose() {
    this.activeModal.close()
  }

  onSaveAnContinue() {
    this.isCreateAnother = true;
  }

  onSave() {
    const isValid = this.utilService.onValueChanged(this.model, this.formErrors, this.validationMessages, true);
    if (isValid) {
      this.page = this.model.value;
      this.isSaving = true;
      if (this.isUpdate) {
        this.pageService
          .update(this.page)
          .pipe(finalize(() => this.isSaving = false))
          .subscribe((result: IResponseResult) => {
            this.isModified = true;
            this.activeModal.dismiss(true);
          });
      } else {
        this.pageService
          .insert(this.page)
          .pipe(finalize(() => this.isSaving = false))
          .subscribe((result: IResponseResult) => {
            this.utilService.focusElement('pageId');
            this.isModified = true;
            this.getPageTree();
            if (this.isCreateAnother) {
              this.isCreateAnother = false;
              this.model.reset();
            } else {
              this.activeModal.dismiss(true);
            }
          });
      }
    }
  }

}
