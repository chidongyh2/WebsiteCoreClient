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
