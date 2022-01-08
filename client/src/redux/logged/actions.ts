import { TOGGLE_LOGGEDIN } from "./types";

export const toggleLoggedIn = (loggedIn: boolean): toggleLoggedInReturn => ({
    type: TOGGLE_LOGGEDIN,
    payload: loggedIn
});

export type toggleLoggedInType = ReturnType<typeof toggleLoggedIn>;

interface toggleLoggedInReturn {
    type: string;
    payload: boolean;
}