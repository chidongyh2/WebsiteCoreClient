import { PageFormComponent } from './../page-form/page-form.component';
import { PAGE_ID, IPageId } from './../../../../../configs/page-id.interface';
import { PageService } from './../page.service';
import { PageSearchViewModel } from './../models/page-search.viewmodel';
import { Component, Inject, OnInit } from '@angular/core';
import { BaseListComponent } from 'src/app/core/components/base-list.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Page } from '../models/page.model';
import { PageListMetadata } from './page-list.metadata';

@Component({
  selector: 'page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.scss']
})
export class PageListComponent extends BaseListComponent<PageSearchViewModel> implements OnInit {
  isActive: boolean
  constructor(@Inject(PAGE_ID) public pageId: IPageId,
    private modalService: NgbModal,
    private pageService: PageService) {
    super();
    this.metadata = PageListMetadata;
    this.currentPageId = pageId.CONFIG_PAGE
  }
  public fetch() {
    return this.pageService.search(this.keyword, this.sort, this.isActive)
  }

  add() {
    let modalRef = this.modalService.open(PageFormComponent, {
      backdrop: 'static',
      keyboard: false,
      container: '.tab-page-list',
      windowClass: 'modal-tabs'
    });
    modalRef.result.then(res => {
      if (res) {
        this.refresh();
      }
    });
  }
  
  edit(page: Page) {
    let modalRef = this.modalService.open(PageFormComponent, {
      backdrop: 'static',
      keyboard: false,
      container: '.tab-page-list',
      windowClass: 'modal-tabs'
    });
    modalRef.componentInstance.page = page;
    modalRef.componentInstance.isUpdate = true;
    modalRef.result.then(res => {
      if (res) {
        this.refresh();
      }
    });
  }
 
  deletePage(item: PageSearchViewModel) {

  }
}
