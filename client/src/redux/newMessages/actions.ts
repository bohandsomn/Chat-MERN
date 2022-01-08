import { SET_NEW_MESSAGES, UPDATE_NEW_MESSAGES } from "./types";

import { reducerSetNewMessagesTemplate } from './reducer'

export const setNewMessages = (newMessages: reducerSetNewMessagesTemplate): setNewMessagesReturn => ({
    type: SET_NEW_MESSAGES,
    payload: newMessages
})

export const updateNewMessages = (newMessages: reducerSetNewMessagesTemplate): setNewMessagesReturn => ({
    type: UPDATE_NEW_MESSAGES,
    payload: newMessages
})

export type setCurrentChatType = ReturnType<typeof setNewMessages>;

interface setNewMessagesReturn {
    type: string;
    payload: reducerSetNewMessagesTemplate;
}