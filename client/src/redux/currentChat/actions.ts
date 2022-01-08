import { SET_CHAT } from "./types";

import { reducerSetCurrentChatTemplate } from './reducer'

export const setCurrentChat = (currentChat: reducerSetCurrentChatTemplate): setCurrentChatReturn => ({
    type: SET_CHAT,
    payload: currentChat
});

export type setCurrentChatType = ReturnType<typeof setCurrentChat>;

interface setCurrentChatReturn {
    type: string;
    payload: reducerSetCurrentChatTemplate;
}