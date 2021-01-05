import { Directive, OnInit } from "@angular/core";
import { Observable, Subject, Subscriber } from "rxjs";
import { switchMap } from "rxjs/operators";
import { BriefUser } from "../models/brief-user.model";
import { PermissionViewModel } from "../view-models/permission.viewmodel";
import { SearchResultViewModel } from "../view-models/search-result.viewmodel";

@Directive()
export abstract class BaseListComponent<T> implements OnInit {
    currentUser: BriefUser;
    isLoading: boolean;
    keyword: string;
    items: T[];
    currentPage = 1;
    pageSize = 20;
    params: { [key: string]: any }
    query: string
    sort: string
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

    ngOnInit() {
        this.subscribe()
    }
    protected abstract fetch(): Observable<SearchResultViewModel<T>>
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

}