import { AuthState } from "../core/auth/auth.model";
import { AuthActions, AuthActionTypes } from "./auth.actions";
export const initialState: AuthState = {
    isAuthenticated: false,
    loading: false,
    avatar: 'assets/images/user-default-icon.png',
    logo: null
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
                menu: null,
                avatar: 'assets/images/user-default-icon.png'
            };

        case AuthActionTypes.LOGOUT:
            return {
                isAuthenticated: false,
                loading: false,
                credentials: null,
                tabs: null,
                tab: null,
                avatar: 'assets/images/user-default-icon.png'
            };
        default:
            return { ...state };
    }
}