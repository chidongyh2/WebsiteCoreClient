import { EventConst } from './../constants/event.const';
import { SystemManager } from './../services/system-manager.service';
import { Directive, OnDestroy, OnInit } from "@angular/core";
import { Observable, Subject, Subscriber } from "rxjs";
import { switchMap } from "rxjs/operators";
import { BriefUser } from "../models/brief-user.model";
import { PermissionViewModel } from "../view-models/permission.viewmodel";
import { SearchResultViewModel } from "../view-models/search-result.viewmodel";
import { AppInjector } from 'src/app/shareds/helpers/app-injector';

@Directive()
export abstract class BaseListComponent<T> implements OnInit, OnDestroy {
    currentUser: BriefUser;
    systemManager: SystemManager;
    isLoading: boolean;
    keyword: string;
    items: T[];
    currentPage = 1;
    pageSize = 20;
    params: { [key: string]: any }
    query: string
    sort: string
    currentPageId: number
    totalRows: number
    subscribers: any = {};
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
    protected refreshTrigger = new Subject()

    constructor() {

    }

    ngOnInit() {
        this.systemManager = AppInjector.get(SystemManager);
        this.subscribe()
        this.subscribers = this.systemManager.subscribe(EventConst.ReloadPage, (evt) => {
            if (evt?.content?.id && evt?.content?.id === this.currentPageId) {
                this.refresh();
            }
        })
    }
    public abstract fetch(): Observable<SearchResultViewModel<T>>
    protected subscribe() {
        const next = result => {
            this.isLoading = false
            this.handleResult(result)
        }

        const error = reason => {
            this.isLoading = false
            this.handleError(reason)
        }

        this.refreshTrigger.pipe(
            switchMap(() => {
                this.isLoading = true
                return this.fetch()
            })
        ).subscribe(next, error)
        this.refreshTrigger.next()
    }

    protected handleResult(result: SearchResultViewModel<T>) {
        this.totalRows = result.totalRows
        this.items = result.items
    }

    protected handleError(reason: any) {
    }

    ngOnDestroy(): void {
        for (const subscriberKey in this.subscribers) {
            if (this.subscribers.hasOwnProperty(subscriberKey)) {
                const subscriber = this.subscribers[subscriberKey];
                if (subscriber instanceof Subscriber) {
                    subscriber.unsubscribe();
                }
            }
        }
    }

    loadPage() {
        this.refreshTrigger.next()
    }

    refresh() {
        this.refreshTrigger.next()
      }
}