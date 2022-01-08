import React, { useState, useRef } from 'react'
import { toast } from 'react-toastify'
import { connect, ConnectedProps } from 'react-redux'

import Message from './Message'
import 'react-toastify/dist/ReactToastify.css'
import ChatStyle from './Chat.module.css'
import { scrollToBottom } from '../../../functions'
import { RootState, AppDispatch } from '../../../redux/store'
import { RequestSetMessage, ResponseSetMessage } from '../../../../../server/src/interface'

toast.configure();

const Chat: React.FC<Props> = ({ currentChat, name, newMessages, listOfUsers }: Props) => {
    const initialStateMessage: string = ''

    const [message, setMessage] = useState<string>(initialStateMessage)
    const messagesNode = useRef(null)

    const isChatSelected: boolean = currentChat.nameOfChat !== ''

    const submit = async (e: React.FormEvent<HTMLFormElement>) => {        
        e.preventDefault()

        const isMessageBlank: boolean = message === ''

        if (isMessageBlank) {
            return
        }

        const request: RequestSetMessage = {
            name,
            nameOfChat: currentChat.nameOfChat,
            message,
            listOfUsers
        }
        await fetch('http://localhost:5000/api/message/set-message', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(request)
        })
            .then<ResponseSetMessage>(response => response.json())
            .then(response => {
                setMessage(initialStateMessage)

                notify(response)
                scrollToBottom(messagesNode.current)
                
                return response
            })
            .catch(error => console.log(error))
    }
    
    const notify = ({ message, isSuccess }: ResponseSetMessage): void => {
        !isSuccess && message && toast.error(message)
    }   

    if (!isChatSelected) {
        return (
            <div className={[ 'col', ChatStyle.field, ChatStyle['main-color' ]].join(' ')}></div>
        )
    }
    
    return (
        <div className={[ 'col', ChatStyle.field ].join(' ')}>
            <div className={ChatStyle['nav-bar']}>
                <img alt=''/>
                <h1>{isChatSelected ? currentChat.nameOfChat : 'Select chat'}</h1>
            </div>
            <div className={ChatStyle.window} id='messages' ref={messagesNode}>
                {
                    currentChat.messages && currentChat.messages.map( message => 
                        <Message  
                            key={message._id.toString()}
                            message={message}
                        />
                    )
                }
                {
                    newMessages.messages && newMessages.messages.map( message => 
                        <Message  
                            key={message._id.toString()}
                            message={message}
                        />
                    )
                }
            </div>
            <form 
                className={ChatStyle['message-send-field']}
                onSubmit={submit}
            >
                <input 
                    type="text" 
                    placeholder='Enter your message'
                    value={message}
                    onChange={event => setMessage(event.target.value)}
                />
                <input type="submit" value=""/>
            </form>
        </div>
    )
}

const mapStateToProps = (state: RootState) => ({
    currentChat: state.currentChat.reducerSetCurrentChat,
    name: state.dataUser.reducerSetData.name,
    listOfUsers: state.currentChat.reducerSetCurrentChat.listOfUsers,
    newMessages: state.newMessages.reducerSetNewMessages
});

const dispatchToProps = (dispatch: AppDispatch) => ({
});

const connector = connect(mapStateToProps, dispatchToProps);
type Props = ConnectedProps<typeof connector>

export default connector(Chat);
export { Message }
