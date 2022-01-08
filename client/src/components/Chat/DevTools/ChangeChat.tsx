import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { connect, ConnectedProps } from 'react-redux'

import DevToolsStyle from './DevTools.module.css'
import 'react-toastify/dist/ReactToastify.css'
import { useDebounce } from '../../../hooks'
import { setCurrentChat, setData } from '../../../redux'
import { RootState, AppDispatch } from '../../../redux/store'
import { reducerSetCurrentChatTemplate } from '../../../redux/currentChat/reducer'
import { reducerSetDataTemplate } from '../../../redux/dataUser/reducer'
import { 
    RequestChange  , ResponseChange  ,
    RequestGetUsers, ResponseGetUsers 
} from '../../../../../server/src/interface'

toast.configure();

const ChangeChat: React.FC<Props> = ({ name, chats, nameOfChat, listOfUsers, messages, setCurrentChat, setData }: Props) => {
    const [newNameOfChat, setNewNameOfChat] = useState(nameOfChat)
    const [newUsers, setNewUsers] = useState<string[]>([])
    const [deletedUsers, setDeletedUsers] = useState<string[]>([])

    const [currentListOfUsert, setCurrentListOfUsert] = useState([...listOfUsers].filter( userName => userName !== name ))
    const [user, setUser] = useState<string>('')
    const [users, setUsers] = useState<string[]>([])

    useEffect( () => {
        setNewNameOfChat(nameOfChat)
        setCurrentListOfUsert([...listOfUsers].filter( userName => userName !== name ))
        setNewUsers([])
        setDeletedUsers([])
    }, [nameOfChat, listOfUsers, name] )
    
    const change = async () => {
        const request: RequestChange = {
            nameOfChat,
            newNameOfChat,
            newUsers,
            deletedUsers
        }
        await fetch('http://localhost:5000/api/chat/change-chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(request)
        })
            .then( response => response.json() )
            .then( (response: ResponseChange) => {
                const { message, isSuccess, chat } = response
                
                notify({ message, isSuccess, chat })

                return response
            } )
            .catch( error => console.log(error))
    }

    const notify = ({ message, isSuccess, chat }: ResponseChange): void => {
        if(isSuccess && chat) {
            toast.success(message)

            setCurrentChat({
                nameOfChat: chat.nameOfChat, 
                previousNameOfChat: chat.nameOfChat,
                messages,
                listOfUsers: chat.listOfUsers
            })
            setData({
                name,
                chats: [...chats.filter( chat => chat.nameOfChat !== nameOfChat ), chat]
            })

        } else {
            toast.error(message)
        }
    }

    const addUserToChat = (user: string) => 
        (event: React.SyntheticEvent): void => {
            event.preventDefault()

            const userInList = currentListOfUsert.includes(user)
            const notEmpty = user === ''

            if (userInList || notEmpty) {
                return
            }

            setCurrentListOfUsert([...currentListOfUsert, user])
            setDeletedUsers([...deletedUsers].filter( userInList => userInList !== user ))
            setNewUsers([...newUsers, user])
        }
    
    const removeUserFromChat = (user: string) => 
        (event: React.SyntheticEvent): void => {
            event.preventDefault()
            
            const userInList = currentListOfUsert.includes(user)
            const notEmpty = user === ''

            if (!userInList || notEmpty) {
                return
            }

            setCurrentListOfUsert([...currentListOfUsert].filter( userInList => userInList !== user ))
            setNewUsers([...newUsers].filter( userInList => userInList !== user ))
            setDeletedUsers([...deletedUsers, user])
        }

    const getUsersFromDB = useDebounce(
        async () => {
            const request: RequestGetUsers = { user }
            await fetch('http://localhost:5000/api/chat/get-users', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(request)
            })
                .then(response => response.json())
                .then((response: ResponseGetUsers) => {                
                    setUsers(response.users)
                    return response
                })
                .catch(error => console.log(error))
        }, 
        500
    )

    const changeInput = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setUser(event.target.value)
        getUsersFromDB()
    }

    return (
        <div className={[DevToolsStyle.wrap, DevToolsStyle.indent].join(' ')}>
            <details>
                <summary>
                    <h3>Change chat info</h3>
                </summary>
                <form onSubmit={change}>
                    <input 
                        type="text"
                        value={newNameOfChat}
                        onChange={event => setNewNameOfChat(event.target.value)}
                        placeholder="Enter new name of chat"
                    />
                    {currentListOfUsert.length !== 0 && <datalist className={DevToolsStyle.list}>
                        {currentListOfUsert.map( (user) => 
                            <option 
                                key={`${user}_listOfUsers`}
                                className={DevToolsStyle['list-item']}
                                onClick={removeUserFromChat(user)}
                            >
                                {user}
                            </option>
                        )}
                    </datalist>}
                    <input 
                        type="text" 
                        value={user}
                        onChange={changeInput}
                        placeholder={'Add user to chat'}
                    />
                    {users.length !== 0 && <datalist className={DevToolsStyle.list}>
                        {users.map( (user) => 
                            <option 
                                key={`${user}_users`}
                                className={DevToolsStyle['list-item']}
                                onClick={addUserToChat(user)}
                            >
                                {user}
                            </option>
                        )}
                    </datalist>}
                    <input 
                        type="button" 
                        value="Change" 
                        onClick={change}
                    />
                </form>
            </details>
        </div>
    )
}

const mapStateToProps = (state: RootState) => ({
    name: state.dataUser.reducerSetData.name,
    chats: state.dataUser.reducerSetData.chats,
    nameOfChat: state.currentChat.reducerSetCurrentChat.nameOfChat,
    listOfUsers: state.currentChat.reducerSetCurrentChat.listOfUsers,
    messages: state.currentChat.reducerSetCurrentChat.messages,
});

const dispatchToProps = (dispatch: AppDispatch) => ({
    setCurrentChat: (currentChat: reducerSetCurrentChatTemplate) => dispatch( setCurrentChat(currentChat) ),
    setData: (dataUser: reducerSetDataTemplate) => dispatch( setData(dataUser) )
});

const connector = connect(mapStateToProps, dispatchToProps);
type Props = ConnectedProps<typeof connector>

export default connector(ChangeChat);