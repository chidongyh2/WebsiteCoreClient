import { Action } from "@ngrx/store";
import { ICredentials } from "../core/models/credentials.model";

export enum AuthActionTypes {
    LOGIN = '[Auth] Login',
    LOGIN_SUCCESS = '[Auth] Login Sucess',
    LOGOUT = '[Auth] Logout',
    AUTHENTICATE = '[Login] Authenticate',
    AUTHENTICATE_SUCCESS = '[Login] Authenticate Success',
    AUTHENTICATE_REFRESH = '[Login] Authenticate Refresh Token',
    AUTHENTICATE_REFRESH_SUCCESS = '[Login] Authenticate Refresh Success',
    AUTHENTICATE_REFRESH_FAIL = '[Login] Authenticate Refresh Fail'
}


export class ActionAuthLogin implements Action {
    readonly type = AuthActionTypes.LOGIN;
  }
  
  export class ActionAuthLogout implements Action {
    readonly type = AuthActionTypes.LOGOUT;
  }
  
  export class ActionAuthenticate implements Action {
    readonly type = AuthActionTypes.AUTHENTICATE;
    constructor(readonly payload: { credentials: ICredentials, returnUrl: string }) { }
  }
  
  export class ActionAuthenticateSuccess implements Action {
    readonly type = AuthActionTypes.AUTHENTICATE_SUCCESS;
  
    constructor(readonly payload: { token: string, logo: any }) { }
  }

  export class ActionAuthenticateRefresh implements Action {
    readonly type = AuthActionTypes.AUTHENTICATE_REFRESH;
    constructor(readonly payload: { refreshToken: string }) { }
  }

  export class ActionAuthenticateRefreshSuccess implements Action {
    readonly type = AuthActionTypes.AUTHENTICATE_REFRESH_SUCCESS;
    constructor(readonly payload: { token: string }) { }
  }

  export class ActionAuthenticateRefreshFail implements Action {
    readonly type = AuthActionTypes.AUTHENTICATE_REFRESH_FAIL;
    constructor(readonly payload: { token: string }) { }
  }

  export type AuthActions = ActionAuthLogin
  | ActionAuthLogout
  | ActionAuthenticate
  | ActionAuthenticateSuccess
  