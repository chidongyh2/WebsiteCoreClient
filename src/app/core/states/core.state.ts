import { routerReducer, RouterReducerState } from "@ngrx/router-store";
import { ActionReducerMap, MetaReducer } from "@ngrx/store";
import { storeFreeze } from "ngrx-store-freeze";
import { authReducer } from "src/app/auth/auth.reducer";
import { environment } from "src/environments/environment";
import { AuthState } from "../auth/auth.model";
import { debug } from "../meta-reducers/debug.reducer";
import { initStateFromLocalStorage } from "../meta-reducers/init-state-local-storage.reducer";
import { RouterStateUrl } from "../router/router.state";

export const reducers: ActionReducerMap<AppState> = {
    auth: authReducer,
    router: routerReducer
}

export const metaReducers: MetaReducer<AppState>[] = [
    initStateFromLocalStorage
];

if (!environment.production) {
    // process meta reducer with prduct env
    metaReducers.unshift(storeFreeze);
    // turn on console action debug with dev env
    metaReducers.unshift(debug);
}

export interface AppState {
    auth: AuthState;
    router: RouterReducerState<RouterStateUrl>;
}