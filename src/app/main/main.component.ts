import { fakeMenu } from './../core/layout/fake-menu';
import { MenuItem } from './../core/interfaces/menu-item.model';
import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Observable, Subject } from 'rxjs';

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
  constructor() { }

  ngOnInit() {
    // this.tabMenu$ = this.store.pipe(select(selectTab));
    // this.activedTab$ = this.store.pipe(select(selectActivedTab));
    // setTimeout(() => {
    //   document.querySelector('#page-body > ngb-tabset > .tab-content').addEventListener('scroll', this.scroll, true);
    // }, 0);

    // this.tabMenu$.subscribe((data) => {
    //   if (data && data.length > 6) {
    //     const lstSelected = this.el.nativeElement.querySelectorAll('.nav-item');
    //     lstSelected.forEach((item) => {
    //       this.renderer.setStyle(item, 'max-width', `${(100 / data.length) - 1}%`);
    //     });
    //   }
    // });
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {
    this.subscription.next();
    this.subscription.complete();
  }

  scroll = ($event: Event) => {
    const scrollTop = ($event.target as HTMLElement).scrollTop;
    const fixedTop = document.querySelector('#page-body > ngb-tabset > .tab-content').clientHeight / 2 - 92;
    document.querySelectorAll('#page-body > ngb-tabset > .tab-content .modal-dialog .modal-dialog').forEach(el => {
      (el as HTMLElement).style.top = `${fixedTop - el.clientHeight / 2 + scrollTop}px`;
    });
  }

  beforeChange = $event => {
    // if ($event.nextId !== $event.active) {
    //   this.store.dispatch(new ActionActiveTab($event.nextId));
    // }
    $event.preventDefault();
  }

  public onReloadClick(tab: any, $event): void {
    console.log('onReloadClick', tab);
    $event.preventDefault();
  }

  public onCloseClick(tab: any, $event): void {
    $event.preventDefault();
    // this.eventManager.destroyObservables(tab.recordId);
    // if (tab.code === 'ATTR_INC_ADD') {
    //   this.storeAdmin.dispatch(new IncidentConfigCopyInfoSuccess({ data: null }));
    //   this.storeAdmin.dispatch(new ActionAddOrActiveTab({ tab: Object.assign({}, tab), args: { incident: null, isCreate: false } }));
    // }
    // this.store.dispatch(new ActionRemoveTab(Object.assign({}, tab)));
  }


}
