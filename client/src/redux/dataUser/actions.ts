import { SET_DATA } from "./types";

import { reducerSetDataTemplate } from './reducer'

export const setData = (dataUser: reducerSetDataTemplate): setDataReturn => ({
    type: SET_DATA,
    payload: dataUser
});

export type setDataType = ReturnType<typeof setData>;

interface setDataReturn {
    type: string;
    payload: reducerSetDataTemplate;
}