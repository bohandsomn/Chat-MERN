import React, { useState } from 'react'
import { connect, ConnectedProps } from 'react-redux'

import ChatItem from './ChatItem'
import ChatsStyle from './Chats.module.css'
import { sortChats } from '../../../functions'
import { RootState, AppDispatch } from '../../../redux/store'

const ListOfChats: React.FC<Props> = ({ chats }: Props) => {
    const [currentListOfChats, setCurrentListOfChats] = useState(sortChats(chats))
    const [sought, setSought] = useState('')
    
    const changeChats = (sought: string): void => {        
        setSought(sought)
        setCurrentListOfChats(chats.filter( chat => chat.nameOfChat.search( new RegExp(sought, 'i') ) !== -1 ))
    }

    return (
        <div className={[ 'col', ChatsStyle.field ].join(' ')}>
            <form onSubmit={ event => event.preventDefault() }>
                <input 
                    type="text" 
                    placeholder="Search"
                    onChange={event => changeChats(event.target.value)}
                    value={sought}
                />
            </form>
            {currentListOfChats && currentListOfChats.map( 
                ({ nameOfChat, lastMessage, listOfUsers }) => 
                    < ChatItem 
                        key={nameOfChat}
                        nameOfChat={nameOfChat} 
                        lastMessage={lastMessage}
                        listOfUsers={listOfUsers}
                    /> 
            )}
        </div>
    )
}

const mapStateToProps = (state: RootState) => ({
    chats: state.dataUser.reducerSetData.chats
});

const dispatchToProps = (dispatch: AppDispatch) => ({
});

const connector = connect(mapStateToProps, dispatchToProps);
type Props = ConnectedProps<typeof connector>

export default connector(ListOfChats);
export { ChatItem }