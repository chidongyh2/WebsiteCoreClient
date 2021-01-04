import { PageService } from './../page.service';
import { PageSearchViewModel } from './../models/page-search.viewmodel';
import { Component, OnInit } from '@angular/core';
import { BaseListComponent } from 'src/app/core/components/base-list.component';
import { Observable } from 'rxjs';
import { SearchResultViewModel } from 'src/app/core/view-models/search-result.viewmodel';

@Component({
  selector: 'page-list',
  templateUrl: './page-list.component.html',
  styleUrls: ['./page-list.component.scss']
})
export class PageListComponent extends BaseListComponent<PageSearchViewModel> implements OnInit {
  isActive: boolean
  constructor(private pageService: PageService) {
    super();
  }
  fetch(): Observable<SearchResultViewModel<PageSearchViewModel>> {
    return this.pageService.search(this.keyword, this.sort, this.isActive)
  }

  ngOnInit(): void {
  }

  add() {
  }
  
  edit(id: number) {

  }
 
  deletePage(item: PageSearchViewModel) {

  }
}
