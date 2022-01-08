import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { connect, ConnectedProps } from 'react-redux'

import DevToolsStyle from './DevTools.module.css'
import 'react-toastify/dist/ReactToastify.css'
import ListOfUsers from './ListOfUsers'
import { setData } from '../../../redux'
import { RootState, AppDispatch } from '../../../redux/store'
import { reducerSetDataTemplate } from '../../../redux/dataUser/reducer'
import { RequestCreate, ResponseCreate } from '../../../../../server/src/interface'

toast.configure();

const CreateChat: React.FC<Props> = ({ name, chats, setData }: Props) => {
    const initialStateNameOfChat: string = ''
        , initialStateListOfUsers: string[] = []

    const [nameOfChat, setNameOfChat] = useState(initialStateNameOfChat)
    const [listOfUsers, setListOfUsers] = useState(initialStateListOfUsers)

    const createChat = async () => {
        const request: RequestCreate = { nameOfChat, listOfUsers: [...listOfUsers, name] }
        await fetch('http://localhost:5000/api/chat/create-chat', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(request)
        })
            .then(response => response.json())
            .then((response: ResponseCreate) => {
                setNameOfChat(initialStateNameOfChat)
                setListOfUsers(initialStateListOfUsers)

                notify(response)
                return response
            })
            .catch(error => console.log(error))
    }

    const notify = ({ message, isSuccess, chat, errors }: ResponseCreate): void => {
        if(isSuccess && chat) {
            toast.success(message)
            setData({
                name,
                chats: [...chats, chat]
            })
        } else {
            toast.error(message)
            errors && errors.forEach( err => { toast.error(err) } )
        }
    }

    return (
        <div className={DevToolsStyle.indent}>
            <div className={DevToolsStyle.wrap}>
                <details>
                    <summary>
                        <h3>Create chat</h3>
                    </summary>
                    <input 
                        type="text" 
                        value={nameOfChat} 
                        placeholder='Enter name of chat'
                        onChange={e => setNameOfChat(e.target.value)}
                    />
                    <ListOfUsers 
                        listOfUsers={listOfUsers} 
                        setListOfUsers={setListOfUsers}
                    />
                    <input
                        onClick={() => createChat()}
                        type="button"
                        value="Create chat"
                    />
                </details>
            </div>
        </div>
    )
}

const mapStateToProps = (state: RootState) => ({
    name: state.dataUser.reducerSetData.name,
    chats: state.dataUser.reducerSetData.chats
})

const dispatchToProps = (dispatch: AppDispatch) => ({
    setData: (dataUser: reducerSetDataTemplate) => dispatch( setData(dataUser) )
})

const connector = connect(mapStateToProps, dispatchToProps)
type Props = ConnectedProps<typeof connector>

export default connector(CreateChat)