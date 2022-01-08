import { combineReducers, AnyAction } from 'redux';

import { TOGGLE_LOGGEDIN } from "./types";

const initialToggleLoggedInState = {
    loggedIn: false
}

export const reducerToggleLoggedIn = (state = initialToggleLoggedInState, action: AnyAction): reducerToggleLoggedInTemplate => {
    switch (action.type) {
        case TOGGLE_LOGGEDIN:
            return {
                loggedIn: action.payload
            }
    
        default:
            return state;
    }
}

export interface reducerToggleLoggedInTemplate {
    loggedIn: boolean;
}

export default combineReducers( { reducerToggleLoggedIn } )