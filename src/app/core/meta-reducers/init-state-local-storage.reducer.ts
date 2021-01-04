import { initialState } from './../../auth/auth.reducer';
import { LocalStorageService } from './../local-storage/local-storage.service';
import { ActionReducer, INIT, UPDATE } from "@ngrx/store";
import { AuthActionTypes } from "src/app/auth/auth.actions";
import { AppState } from "../states/core.state";

export function initStateFromLocalStorage(
    reducer: ActionReducer<AppState>
): ActionReducer<AppState> {
    return function (state, action) {
        if (action.type === AuthActionTypes.LOGOUT) {
            return reducer(undefined, action);
        }
        // get current reducer state
        const newState = reducer(state, action);
        if ([INIT.toString(), UPDATE.toString()].includes(action.type)) {
            console.log({...newState, ...LocalStorageService.loadInitialState()})
            return {...newState, ...LocalStorageService.loadInitialState() };
        }
        return newState;
    }
}