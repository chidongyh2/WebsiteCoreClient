import { PageFormComponent } from './../page-form/page-form.component';
import { PAGE_ID, IPageId } from './../../../../../configs/page-id.interface';
import { PageService } from './../page.service';
import { PageSearchViewModel } from './../models/page-search.viewmodel';
import { Component, Inject, OnInit } from '@angular/core';
import { BaseListComponent } from 'src/app/core/components/base-list.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    this.currentPageId = pageId.CONFIG_PAGE
  }
  public fetch() {
    return this.pageService.search(this.keyword, this.sort, this.isActive)
  }

  add() {
    let modalRef = this.modalService.open(PageFormComponent, {
      backdrop: 'static',
      keyboard: false
    });
    modalRef.result.then(data => {
    });
  }
  
  edit(id: number) {
    let modalRef = this.modalService.open(PageFormComponent, {
      backdrop: 'static',
      keyboard: false
    });
    modalRef.result.then(data => {
    });
  }
 
  deletePage(item: PageSearchViewModel) {

  }
}
