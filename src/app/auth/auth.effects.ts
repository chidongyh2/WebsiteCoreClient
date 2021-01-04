import { AUTH_ACCOUNT, AUTH_MENU, AUTH_REFRESH_TOKEN } from 'src/app/auth/auth.constants';
import {
  ActionAuthenticate,
  ActionAuthenticateError,
  ActionAuthenticateSuccess,
  ActionLoadAuthenticateSettings,
  AuthActionTypes,
  ActionLoadAuthenticateSettingsSuccess,
  ActionLoadAuthenticateSettingsFail,
  ActionLoginSuccess
} from './auth.actions';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { AuthService } from 'src/app/core/auth/auth.service';
import { LocalStorageService } from 'src/app/core/local-storage/local-storage.service';
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { Action } from '@ngrx/store';
import { exhaustMap, map, catchError, switchMap, tap } from 'rxjs/operators';
import { AUTH_CHANGE, AUTH_KEY, AUTH_TABS, AUTH_TOKEN } from './auth.constants';
import { of } from 'rxjs';
import { AppService } from '../shareds/services/app.service';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions<Action>,
    private localStorageService: LocalStorageService,
    private router: Router,
    private authService: AuthService,
    private appService: AppService
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
}