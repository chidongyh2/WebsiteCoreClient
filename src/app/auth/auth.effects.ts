import { MenuItem, MenuItemType } from './../core/interfaces/menu-item.model';
import { AUTH_ACCOUNT, AUTH_ALLOW_OPEN_TABS, AUTH_MENU, AUTH_REFRESH_TOKEN, AUTH_TAB, AUTH_TABARGS } from 'src/app/auth/auth.constants';
import {
  ActionAuthenticate,
  ActionAuthenticateError,
  ActionAuthenticateSuccess,
  ActionLoadAuthenticateSettings,
  AuthActionTypes,
  ActionLoadAuthenticateSettingsSuccess,
  ActionLoadAuthenticateSettingsFail,
  ActionLoginSuccess,
  ActionRemoveTab,
  ActionReplaceTab,
  ActionAddOrActiveTab,
  ActionActiveTab
} from './auth.actions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AuthService } from 'src/app/core/auth/auth.service';
import { LocalStorageService } from 'src/app/core/local-storage/local-storage.service';
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { Action, Store } from '@ngrx/store';
import { exhaustMap, catchError, switchMap, tap, withLatestFrom } from 'rxjs/operators';
import { AUTH_CHANGE, AUTH_KEY, AUTH_TABS, AUTH_TOKEN } from './auth.constants';
import { of } from 'rxjs';
import { AppService } from '../shareds/services/app.service';
import { AppState } from '../core/states/core.state';
import { isDefined } from '../shareds/utils/common.util';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions<Action>,
    private localStorageService: LocalStorageService,
    private router: Router,
    private authService: AuthService,
    private appService: AppService,
    public store: Store<AppState>
  ) { }

  @Effect()
  authenticate = () =>
    this.actions$.pipe(
      ofType<ActionAuthenticate>(AuthActionTypes.AUTHENTICATE),
      exhaustMap((action: ActionAuthenticate) => {
        this.localStorageService.removeItem(AUTH_CHANGE);
        this.localStorageService.removeItem(AUTH_TABS);
        return this.authService.login(action.payload.credentials.username, action.payload.credentials.password)
          .pipe(switchMap((res: any) => {
            this.localStorageService.setItem(AUTH_KEY, { isAuthenticated: true });
            this.localStorageService.setItem(AUTH_TOKEN, res.access_token);
            this.localStorageService.setItem(AUTH_REFRESH_TOKEN, res.refresh_token);
            return [
              new ActionAuthenticateSuccess({ token: res.access_token, refreshToken: res.refresh_token }),
              new ActionLoadAuthenticateSettings({ returnUrl: action.payload.returnUrl }),
            ];
          }),
            catchError(error => {
              this.localStorageService.removeItem(AUTH_KEY);
              this.localStorageService.removeItem(AUTH_TOKEN);
              this.localStorageService.removeItem(AUTH_REFRESH_TOKEN);
              return of(new ActionAuthenticateError({ error }))
            })
          )
      })
    )

  @Effect()
  fetchAuthSettings = () =>
    this.actions$.pipe(
      ofType<ActionLoadAuthenticateSettings>(AuthActionTypes.LOAD_AUTH_SETTINGS),
      switchMap((action: ActionLoadAuthenticateSettings) =>
        this.appService.fetchAuthSettings().pipe(
          switchMap((res: any) => {
            this.localStorageService.setItem(AUTH_MENU, res.pages);
            this.localStorageService.setItem(AUTH_ACCOUNT, res.currentUser);
            return [
              new ActionLoadAuthenticateSettingsSuccess({
                pages: res.pages, permissions: res.permissions,
                currentUser: res.currentUser,
                userSettings: res.userSettings
              }),
              new ActionLoginSuccess({
                returnUrl: action.payload.returnUrl
              })
            ]
          }),
          catchError(error => {
            this.localStorageService.removeItem(AUTH_KEY);
            this.localStorageService.removeItem(AUTH_TOKEN);
            this.localStorageService.removeItem(AUTH_REFRESH_TOKEN);
            return of(new ActionLoadAuthenticateSettingsFail())
          })
        )
      )
    );

  @Effect({ dispatch: false })
  loginSuccess = this.actions$.pipe(
    ofType<ActionLoginSuccess>(AuthActionTypes.LOGIN_SUCCESS),
    tap((action) => {
      if (action.payload.returnUrl) {
        this.router.navigateByUrl(action.payload.returnUrl);
      } else {
        this.router.navigate(['']);
      }
    })
  );

  @Effect({ dispatch: false })
  addOrActiveTab = () =>
    this.actions$.pipe(
      ofType<ActionAddOrActiveTab>(
        AuthActionTypes.TAB_ADD_OR_ACTIVE
      ),
      withLatestFrom(this.store.select(state => state.auth.tabargs)),
      tap(([action, tabArgs]) => {
        const tabs: any[] = Object.assign([], this.localStorageService.getItem(AUTH_TABS));
        if (tabs.length < AUTH_ALLOW_OPEN_TABS) { // only allow open AUTH_ALLOW_OPEN_TABS tabs
          const addTab = Object.assign({}, action.payload.tab);
          const index = tabs.findIndex(t => t.type === MenuItemType.tab && t.id === addTab.id);
          if (index === -1) {
            tabs.push(addTab);
            this.localStorageService.setItem(AUTH_TABS, tabs);
          }
          if (action.payload.args) {
            this.localStorageService.setItem(AUTH_TABARGS, tabArgs);
          }
          this.localStorageService.setItem(AUTH_TAB, addTab.id);
        }
      })
    );

  @Effect({ dispatch: false })
  activeTab = () =>
    this.actions$.pipe(
      ofType<ActionActiveTab>(
        AuthActionTypes.TAB_ACTIVE
      ),
      tap((action) => {
        this.localStorageService.setItem(AUTH_TAB, action.payload);
      }
      )
    );

  @Effect({ dispatch: false })
  replaceTab = () =>
    this.actions$.pipe(
      ofType<ActionReplaceTab>(
        AuthActionTypes.TAB_REPLACE
      ),
      withLatestFrom(this.store.select(state => state.auth.tabargs)),
      tap(([action, tabArgs]) => {
        const tabs: any[] = Object.assign([], this.localStorageService.getItem(AUTH_TABS));
        if (tabs.length < AUTH_ALLOW_OPEN_TABS) { // only allow open AUTH_ALLOW_OPEN_TABS tabs
          const needleTab = tabs.filter(t => t.code === action.payload.needle);
          if (isDefined(needleTab)) {
            const needleIndex = tabs.indexOf(needleTab);
            tabs.splice(needleIndex, 1, action.payload.haystack.tab);
            this.localStorageService.setItem(AUTH_TABS, tabs);
            if (action.payload.haystack.args) {
              this.localStorageService.setItem(AUTH_TABARGS, tabArgs);
            }
          }
        }
      })
    );

  @Effect({ dispatch: false })
  removeTab = () =>
    this.actions$.pipe(
      ofType<ActionRemoveTab>(
        AuthActionTypes.TAB_REMOVE
      ),
      tap(action => {
        const tabs: MenuItem[] = Object.assign([], this.localStorageService.getItem(AUTH_TABS));
        const index = tabs.findIndex(t => t.type === MenuItemType.tab && t.id === action.payload.id);
        if (index !== -1) {
          tabs.splice(index, 1);
          this.localStorageService.setItem(AUTH_TABS, tabs);
        }
      })
    );
}