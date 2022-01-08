import { combineReducers, AnyAction } from 'redux'

import { SET_CHAT } from './types'
import { ChatTemplate } from '../../../../server/src/interface'

const initialSetCurrentChatState: reducerSetCurrentChatTemplate = {
    nameOfChat: '',
    previousNameOfChat: '',
    messages: [],
    listOfUsers: []
}

export const reducerSetCurrentChat = (state = initialSetCurrentChatState, action: AnyAction): reducerSetCurrentChatTemplate => {
    switch (action.type) {
        case SET_CHAT:
            return {
                ...state,
                ...action.payload
            }
    
        default:
            return state;
    }
}

export interface reducerSetCurrentChatTemplate extends Omit<ChatTemplate, 'listOfUsers'> {
    listOfUsers: string[]
    previousNameOfChat: string
}

export default combineReducers( { reducerSetCurrentChat } )