import { isDefined } from '../shareds/utils/common.util';
import { AuthState } from "../core/auth/auth.model";
import { MenuItemType } from "../core/interfaces/menu-item.model";
import { AuthActions, AuthActionTypes } from "./auth.actions";
import { AUTH_ALLOW_OPEN_TABS } from "./auth.constants";
export const initialState: AuthState = {
    isAuthenticated: false,
    loading: false,
    tabargs: null,
};
export function authReducer(
    state: AuthState = initialState,
    action: AuthActions): AuthState {
    let oldTab: any[];
    let index: number;
    let args: {};
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
                currUser: null,
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
        case AuthActionTypes.TAB_ADD_OR_ACTIVE:
            oldTab = Object.assign([], state.tabs);

            const addTab = Object.assign({}, action.payload.tab);
            index = oldTab.findIndex(t => t.type === MenuItemType.tab && t.id === addTab.id);

            if (index === -1) {
                if (!(oldTab.length < AUTH_ALLOW_OPEN_TABS)) { // only allow open AUTH_ALLOW_OPEN_TABS tabs
                    // notify fully allow open tab
                    return { ...state };
                }
                oldTab.push(addTab);
            }

            if (index >= 0) {
                oldTab[index] = addTab;
            }
            args = {};
            if (isDefined(state.tabargs)) {
                args = Object.assign(args, ...state.tabargs);
            }
            
            if (isDefined(action.payload.args) && action.payload.args instanceof Object) {
                args = Object.assign(args, action.payload.args);
            }
            return {
                ...state,
                tab: addTab.id,
                tabs: [...oldTab],
                tabargs: args
            };

        case AuthActionTypes.TAB_REPLACE:
            oldTab = Object.assign([], state.tabs);
            const needleTab = oldTab.find(t => t.id === action.payload.needle);
            if (isDefined(needleTab)) {
                const needleIndex = oldTab.indexOf(needleTab);
                if (needleIndex !== -1) {
                    oldTab.splice(needleIndex, 1, action.payload.haystack.tab);
                    args = {};
                    if (isDefined(state.tabargs)) {
                        args = Object.assign(args, ...state.tabargs);
                    }
                    if (isDefined(action.payload.haystack.args) && action.payload.haystack.args instanceof Object) {
                        args = Object.assign(args, action.payload.haystack.args);
                    }
                }
            }
            return {
                ...state,
                tab: action.payload.haystack.tab.id,
                tabs: [...oldTab],
                tabargs: args
            };

        case AuthActionTypes.TAB_REMOVE:
            oldTab = Object.assign([], state.tabs);
            index = oldTab.findIndex(t => t.type === MenuItemType.tab && t.id === action.payload.id);

            if (index !== -1) {
                oldTab.splice(index, 1);
            }

            const newActiveTab = oldTab.some(
                t => t.type === MenuItemType.tab
                    && t.id === state.tab
            ) ? state.tab : (oldTab.length > 1 ? oldTab[oldTab.length - 1].id : null);

            return {
                ...state,
                tab: newActiveTab,
                tabs: [...oldTab]
            };

        case AuthActionTypes.TAB_DESTROY_ARGS:
            args = new Object();
            if (isDefined(state.tabargs)) {
                args = Object.assign(args, ...state.tabargs);
            }
            if (isDefined(action.payload.args) && action.payload.args instanceof Object) {
                args = Object.assign(args, action.payload.args);
            }
            return {
                ...state,
                tabargs: args
            };

        case AuthActionTypes.TAB_ACTIVE:
            return {
                ...state,
                tab: action.payload
            };
        default:
            return { ...state };
    }
}