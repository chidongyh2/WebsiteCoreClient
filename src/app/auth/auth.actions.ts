import { BriefUserViewmodel } from './../shareds/view-model/brief-user.viewmodel';
import { MenuItem } from './../core/interfaces/menu-item.model';
import { UserSettingViewModel } from './../shareds/view-model/user-setting.viewmodel';
import { HttpErrorResponse } from "@angular/common/http";
import { Action } from "@ngrx/store";
import { ICredentials } from "../core/models/credentials.model";
import { RolePageViewModel } from "../shareds/view-model/role-page.viewmodel";

export enum AuthActionTypes {
  LOGIN = '[Auth] Login',
  LOGIN_SUCCESS = '[Auth] Login Sucess',
  LOGOUT = '[Auth] Logout',
  AUTHENTICATE = '[Login] Authenticate',
  AUTHENTICATE_SUCCESS = '[Login] Authenticate Success',
  AUTHENTICATE_ERROR = '[Login] Authenticate Error',
  AUTHENTICATE_REFRESH = '[Login] Authenticate Refresh Token',
  AUTHENTICATE_REFRESH_SUCCESS = '[Login] Authenticate Refresh Success',
  AUTHENTICATE_REFRESH_FAIL = '[Login] Authenticate Refresh Fail',
  LOAD_AUTH_SETTINGS = '[Auth] Authentication Load Settings',
  LOAD_AUTH_SETTINGS_SUCCESS = '[Auth] Authentication Load Settings Success',
  LOAD_AUTH_SETTINGS_FAIL = '[Auth] Authentication Load Settings Fail',
  // for user's tab
  TAB_ADD_OR_ACTIVE = '[Tab] Add or active tab',
  TAB_REPLACE = '[Tab] Replace tab',
  TAB_REMOVE = '[Tab] remove tab',
  TAB_ACTIVE = '[Tab] Active tab',
  TAB_DESTROY_ARGS = '[Tab] Destroy tab args',
}


export class ActionAuthLogin implements Action {
  readonly type = AuthActionTypes.LOGIN;
}

export class ActionLoginSuccess implements Action {
  readonly type = AuthActionTypes.LOGIN_SUCCESS;
  constructor(readonly payload: { returnUrl: string }) { }
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

  constructor(readonly payload: { token: string, refreshToken: string }) { }
}

export class ActionLoadAuthenticateSettings implements Action {
  readonly type = AuthActionTypes.LOAD_AUTH_SETTINGS;
  constructor(readonly payload: { returnUrl: string }) { }
}
export class ActionLoadAuthenticateSettingsSuccess implements Action {
  readonly type = AuthActionTypes.LOAD_AUTH_SETTINGS_SUCCESS;
  constructor(readonly payload: {
    pages: MenuItem[],
    userSettings: UserSettingViewModel, permissions: RolePageViewModel[],
    currentUser: BriefUserViewmodel
  }) { }
}

export class ActionLoadAuthenticateSettingsFail implements Action {
  readonly type = AuthActionTypes.LOAD_AUTH_SETTINGS_FAIL;
}

export class ActionAuthenticateError implements Action {
  readonly type = AuthActionTypes.AUTHENTICATE_ERROR;

  constructor(readonly payload: { error: HttpErrorResponse }) { }
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

// for handle open tab by user;
export class ActionAddOrActiveTab implements Action {
  readonly type = AuthActionTypes.TAB_ADD_OR_ACTIVE;
  constructor(readonly payload: { tab: any; args?: any }) { }
}

export class ActionReplaceTab implements Action {
  readonly type = AuthActionTypes.TAB_REPLACE;
  constructor(readonly payload: {
    needle: number,
    haystack: {
      tab: { id: number; type?: string }; args?: any
    }
  }) { }
}

export class ActionRemoveTab implements Action {
  readonly type = AuthActionTypes.TAB_REMOVE;
  constructor(readonly payload: { id: number; type?: string }) { }
}

export class ActionActiveTab implements Action {
  readonly type = AuthActionTypes.TAB_ACTIVE;
  constructor(readonly payload: number) { }
}

export class ActionDestroyTabArgs implements Action {
  readonly type = AuthActionTypes.TAB_DESTROY_ARGS;
  constructor(readonly payload: { args: any }) { }
}

export type AuthActions = ActionAuthLogin
  | ActionAuthLogout
  | ActionAuthenticate
  | ActionAuthenticateSuccess
  | ActionAuthenticate
  | ActionAuthenticateError
  | ActionLoadAuthenticateSettings
  | ActionLoadAuthenticateSettingsSuccess
  | ActionLoadAuthenticateSettingsFail
  // for tab
  | ActionAddOrActiveTab
  | ActionRemoveTab
  | ActionReplaceTab
  | ActionActiveTab
  | ActionDestroyTabArgs