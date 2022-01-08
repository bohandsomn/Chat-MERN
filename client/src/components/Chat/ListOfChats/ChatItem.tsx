import React, { useState } from 'react'
import { toast } from 'react-toastify'
import { connect, ConnectedProps } from 'react-redux'

import 'react-toastify/dist/ReactToastify.css'
import ChatsStyle from './Chats.module.css'

import { decodeTime, scrollToBottom } from '../../../functions'
import { setCurrentChat, setNewMessages, updateNewMessages } from '../../../redux'
import { RootState, AppDispatch } from '../../../redux/store'
import { reducerSetCurrentChatTemplate } from '../../../redux/currentChat/reducer'
import { reducerSetNewMessagesTemplate } from '../../../redux/newMessages/reducer'
import { 
    RequestGetMessages, ResponseGetMessages,
    RequestSubscribe  , ResponseSubscribe  ,
    RequestUnsubscribe,
    ChatPreview, MessageTemplate
} from '../../../../../server/src/interface'

toast.configure();

const ChatItem: React.FC<Props> = (props: Props) => {
    const {
        name,
        nameOfChat, 
        lastMessage, 
        previousNameOfChat,
        listOfUsers,
        setCurrentChat, 
        setNewMessages, 
        updateNewMessages
    } = props
    
    const [currentLastMessage, setCurrentLastMessage] = useState<MessageTemplate | undefined>(lastMessage)

    const lastTime = currentLastMessage === undefined ? Date.now() : currentLastMessage.time;

    const selectChat = async () => {
        const request: RequestGetMessages = { nameOfChat }
        await fetch('http://localhost:5000/api/message/get-messages', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(request)
        })
            .then(res => res.json())
            .then((res: ResponseGetMessages) => {
                const { isSuccess, message, messages } = res

                notify({ isSuccess, message })
                setCurrentChat({ 
                    nameOfChat, 
                    messages, 
                    previousNameOfChat: nameOfChat, 
                    listOfUsers 
                })
                updateNewMessages({ nameOfChat, messages: [] })
                setCurrentLastMessage( messages.at(-1) )
                
                scrollToBottom(document.getElementById("messages"))

                return res
            })
            .then(res => {
                unsubscribe()
                return res
            })
            .then(res => {
                subscribe()
                return res
            })
            .catch(err => console.log(err))
    }

    const notify = ({ message, isSuccess }: Notify): void => {
        !isSuccess && message && toast.error(message)
    }

    const subscribe = async (): Promise<void> => {
        const request: RequestSubscribe = { nameOfChat, senderName: name }
        await fetch('http://localhost:5000/api/message/subscribe', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(request)
        })
            .then(res => res.json())
            .then((res: ResponseSubscribe) => {
                if (res === null) {                    
                    return res
                }

                const { _id, senderName, content, time } = res;                     
                 
                setNewMessages({ 
                    messages: [ { _id, senderName, content, time } ] 
                })
                setCurrentLastMessage({ _id, senderName, content, time })

                return res
            })
            .then( res => {
                if (res !== null) {
                    subscribe()
                }
                return res
            } )
            .catch(() => setTimeout(() => {
                subscribe()
            }, 500))
    }    

    const unsubscribe = async (): Promise<void> => {  
        const request: RequestUnsubscribe = { nameOfChat: previousNameOfChat, senderName: name }  
        await fetch('http://localhost:5000/api/message/unsubscribe', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(request)
        })
    }
    
    return (
        <div 
            className={ChatsStyle['chat-item']}
            onClick={() => selectChat()}
        >
            <img alt=''/>
            <div className={ChatsStyle.content}>
                <div className={ChatsStyle['title-and-date']}>
                    <h5>{nameOfChat}</h5>
                    <time>{decodeTime(lastTime)}</time>
                </div>
                <p>{currentLastMessage === undefined ? '' : currentLastMessage.content}</p>
            </div>
        </div>
    )
}

const mapStateToProps = (state: RootState) => ({
    previousNameOfChat: state.currentChat.reducerSetCurrentChat.previousNameOfChat,
    name: state.dataUser.reducerSetData.name
});

const dispatchToProps = (dispatch: AppDispatch) => ({
    setCurrentChat: (currentChat: reducerSetCurrentChatTemplate) => dispatch( setCurrentChat(currentChat) ),
    setNewMessages: (newMessage: reducerSetNewMessagesTemplate) => dispatch( setNewMessages(newMessage) ),
    updateNewMessages: (newMessage: reducerSetNewMessagesTemplate) => dispatch( updateNewMessages(newMessage) )
});

const connector = connect(mapStateToProps, dispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

export default connector(ChatItem);

interface Props extends PropsFromRedux, ChatPreview { }

type Notify = Omit<ResponseGetMessages, 'messages'>