import { fakeMenu } from './../core/layout/fake-menu';
import { MenuItem } from './../core/interfaces/menu-item.model';
import { Component, Inject, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { IPageId, PAGE_ID } from '../configs/page-id.interface';
import { select, Store } from '@ngrx/store';
import { AppState } from '../core/states/core.state';
import { selectActivedTab, selectTab } from '../auth/auth.selector';
import { ActionActiveTab, ActionRemoveTab } from '../auth/auth.actions';

@Component({
  selector: 'main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnChanges, OnDestroy {
  private idCounter: number = 0;
  tabMenu$: Observable<MenuItem[]>;
  activedTab$: Observable<string>;
  subscription: Subject<void> = new Subject();
  constructor(@Inject(PAGE_ID) public pageId: IPageId, public store: Store<AppState>) { }

  ngOnInit() {
    this.tabMenu$ = this.store.pipe(select(selectTab));
    this.activedTab$ = this.store.pipe(select(selectActivedTab));
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {
    this.subscription.next();
    this.subscription.complete();
  }

  beforeChange = $event => {
    if ($event.nextId !== $event.active) {
      this.store.dispatch(new ActionActiveTab(Number($event.nextId)));
    }
    $event.preventDefault();
  }

  public onReloadClick(tab: any, $event): void {
    console.log('onReloadClick', tab);
    $event.preventDefault();
  }

  public onCloseClick(tab: any, $event): void {
    $event.preventDefault();
    this.store.dispatch(new ActionRemoveTab(Object.assign({}, tab)));
  }


}
