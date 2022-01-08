import { combineReducers, AnyAction } from 'redux';

import { SET_NEW_MESSAGES, UPDATE_NEW_MESSAGES } from "./types";

import { MessageTemplate } from '../../../../server/src/entities/Chat'

const initialNewMessagesState: reducerSetNewMessagesTemplate = {
    nameOfChat: '',
    messages: []
}

export const reducerSetNewMessages = (state = initialNewMessagesState, action: AnyAction): reducerSetNewMessagesTemplate => {    
    switch (action.type) {
        case SET_NEW_MESSAGES:
            return {
                ...state,
                messages: [...state.messages, ...action.payload.messages]
            }
        case UPDATE_NEW_MESSAGES:
            return {
                ...state,
                messages: action.payload.messages
            }
    
        default:
            return state;
    }
}

export interface reducerSetNewMessagesTemplate {
    nameOfChat?: string;
    messages: MessageTemplate[]
}

export default combineReducers( { reducerSetNewMessages } )