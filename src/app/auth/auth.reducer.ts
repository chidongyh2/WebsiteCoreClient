import { AuthState } from "../core/auth/auth.model";
import { AuthActions, AuthActionTypes } from "./auth.actions";
export const initialState: AuthState = {
    isAuthenticated: false,
    loading: false
};
export function authReducer(
    state: AuthState = initialState,
    action: AuthActions): AuthState {
    switch (action.type) {
        case AuthActionTypes.LOGIN:
            return {
                isAuthenticated: false,
                loading: false,
                credentials: null,
                menus: null
            };
        case AuthActionTypes.AUTHENTICATE:
            return {
                ...state,
                loading: true,
                error: null
            };
        case AuthActionTypes.AUTHENTICATE_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                loading: false,
                token: action.payload.token,
                error: null
            };
        case AuthActionTypes.AUTHENTICATE_ERROR:
            return {
                ...state,
                isAuthenticated: false,
                loading: false,
                token: null,
                error: action.payload.error
            };
        case AuthActionTypes.LOAD_AUTH_SETTINGS:
            return {
                ...state,
                loading: true
            };

        case AuthActionTypes.LOAD_AUTH_SETTINGS_SUCCESS:
            return {
                ...state,
                loading: false,
                currUser: action.payload.currentUser,
                menus: action.payload.pages,
                permissions: action.payload.permissions
            };
        case AuthActionTypes.LOAD_AUTH_SETTINGS_FAIL:
        return {
            ...state,
            loading: false,
            currUser:  null,
            menus: null,
            permissions: null,
            token: null,
            isAuthenticated: false
        };
        case AuthActionTypes.LOGOUT:
            return {
                isAuthenticated: false,
                loading: false,
                credentials: null,
                tabs: null,
                tab: null
            };
        default:
            return { ...state };
    }
}