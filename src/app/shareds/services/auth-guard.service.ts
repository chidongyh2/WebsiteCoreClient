import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from "@angular/router";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { selectIsAuthenticated } from "src/app/auth/auth.selector";
import { AppState } from "src/app/core/states/core.state";

@Injectable()
export class AuthGuardService implements CanActivate {
    isAuthenticated$: Observable<boolean>;
    constructor(public store: Store<AppState>,
        private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const url = state.url;
        this.isAuthenticated$ = this.store.pipe(select(selectIsAuthenticated));
        this.isAuthenticated$.subscribe(isLogged => {
            console.log('heheh', isLogged)
            if (!isLogged) {
                this.router.navigate([`auth/login`], { queryParams: { redirect: url } });
            }
        })
        return this.isAuthenticated$;
    }
}
