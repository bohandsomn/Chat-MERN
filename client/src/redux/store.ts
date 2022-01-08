import { configureStore } from '@reduxjs/toolkit'

import rootReducerLogged from './logged/reducer'
import rootReducerDataUser from './dataUser/reducer'
import rootReducerCurrentChat from './currentChat/reducer'
import rootReducerNewMessages from './newMessages/reducer'

const store = configureStore({
    reducer: {
        loggedIn   : rootReducerLogged     ,
        dataUser   : rootReducerDataUser   ,
        currentChat: rootReducerCurrentChat,
        newMessages: rootReducerNewMessages
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store