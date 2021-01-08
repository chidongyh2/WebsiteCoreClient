import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "../core/auth/auth.model";
import { AppState } from "../core/states/core.state";

export const selectAuthState = createFeatureSelector<AppState, AuthState>(
    'auth'
);

export const selectAuth = createSelector(
    selectAuthState,
    (state: AuthState) => state
);

export const selectIsAuthenticated = createSelector(
    selectAuthState,
    (state: AuthState) => state.isAuthenticated
);

export const selectLoading = createSelector(
    selectAuthState,
    (state: AuthState) => state.loading
);
export const selectMenuItems = createSelector(
    selectAuthState,
    (state: AuthState) => state.menus
);
export const selectError = createSelector(
    selectAuthState,
    (state: AuthState) => state.error
);

export const selectCurrentUser = createSelector(
    selectAuthState,
    (state: AuthState) => state.currUser
);

export const selectTab = createSelector(
    selectAuthState,
    (state: AuthState) => state.tabs
);

export const selectActivedTab = createSelector(
    selectAuthState,
    (state: AuthState) => state.tab && state.tab.toString()
);

export const selectPermission = createSelector(
    selectAuthState,
    (state: AuthState) => state.permissions
);