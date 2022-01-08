import { combineReducers, AnyAction } from 'redux';

import { SET_DATA } from "./types";

import { ChatPreview } from '../../../../server/src/entities/Chat'

const initialSetDataState: reducerSetDataTemplate = {
    name: '',
    chats: []
}

export const reducerSetData = (state = initialSetDataState, action: AnyAction): reducerSetDataTemplate => {
    switch (action.type) {
        case SET_DATA:
            return {
                ...state,
                ...action.payload
            }
    
        default:
            return state;
    }
}

export interface reducerSetDataTemplate {
    name: string;
    chats: ChatPreview[]
}

export default combineReducers( { reducerSetData } )