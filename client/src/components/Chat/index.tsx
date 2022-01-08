import React from 'react'

import ListOfChats from './ListOfChats'
import Chat from './Chat'
import DevTools from './DevTools'

const ChatMain: React.FC = () => {
    return (
        <div className='d-flex'>
            <ListOfChats />
            <Chat />
            <DevTools />
        </div>
    )
}

export default ChatMain
export { ListOfChats, Chat, DevTools }