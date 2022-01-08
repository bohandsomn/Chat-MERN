import { Request, Response } from "express";
import { EventEmitter } from 'events'

import User, { UserTemplate } from '../../entities/User';
import Chat, { MessageTemplate } from '../../entities/Chat'

import { decodeUserByName } from '../../functions'

import { 
    RequestGetMessages, ResponseGetMessages,
    RequestSubscribe  , ResponseSubscribe  ,
    RequestSetMessage , ResponseSetMessage ,
    RequestUnsubscribe, ResponseUnsubscribe,
} from '../../interface'

const emitter = new EventEmitter();
emitter.setMaxListeners(100)

class Controller {
    setMessage = async (req: Request, res: Response) => {
        try {            
            const { name, nameOfChat, message, listOfUsers }: RequestSetMessage = req.body;
            
            const candidate = await User.findOne({ name });
            
            if (!candidate) {
                const response: ResponseSetMessage = {
                    message: 'User is not found',
                    isSuccess: false
                }
                return res.json(response)
            }
            
            const chatCandidate = await Chat.findOne({ nameOfChat });
            if (!chatCandidate) {
                const response: ResponseSetMessage = {
                    message: 'Chat with this name does not exist',
                    isSuccess: false
                }
                return res.json(response)
            }
            
            const isMember = chatCandidate.listOfUsers.includes(candidate._id);
            if (!isMember) {
                const response: ResponseSetMessage = {
                    message: 'You are not a member of this group',
                    isSuccess: false
                }
                return res.json(response)
            }

            await chatCandidate.updateOne({
                messages: [...chatCandidate.messages, {senderName: name, content: message, time: Date.now()}]
            })            

            const users: Array<UserTemplate | null> = (await Promise.all( listOfUsers.map(decodeUserByName) ))

            const dateNow = Date.now()
            for await (const user of users) {                
                const newMessage: NewMessage = {
                    _id: dateNow.toString(), 
                    senderName: name, 
                    content: message,
                    time: dateNow,
                    sender: {
                        senderName: name,
                        nameOfChat,
                        isStop: false
                    }
                }
                
                user && emitter.emit('newMessage', newMessage)
            }

            const response: ResponseSetMessage = {
                isSuccess: true
            }            

            res.status(200).json(response)
        } catch (e) {
            console.log(e);
            const response: ResponseSetMessage = {
                message: 'Error sending message',
                isSuccess: false
            }

            res.json({response})
        }
    }
    getMessages = async (req: Request, res: Response) => {
        try {
            const { nameOfChat }: RequestGetMessages = req.body

            const candidate = await Chat.findOne({nameOfChat})
            if (!candidate) {
                const response: ResponseGetMessages = {
                    message: 'Chat was not found',
                    isSuccess: false,
                    messages: []
                }
                return res.json(response)
            }

            const { messages } = candidate

            const response: ResponseGetMessages = {
                isSuccess: true,
                messages
            }
            res.json(response)           
        } catch (error) {
            console.log(error);
            const response: ResponseGetMessages = {
                message: 'Get messages error',
                isSuccess: false,
                messages: []
            }
            return res.json(response)
        }
    }
    subscribe = async (req: Request, res: Response) => {        
        const { nameOfChat, senderName }: RequestSubscribe = req.body
        const subscriber = { nameOfChat, senderName }

        emitter.on('newMessage', async (message: NewMessage) => {
            try {
                const { sender } = message

                const isUnsubscribe = 
                    sender.nameOfChat === subscriber.nameOfChat && 
                    sender.senderName === subscriber.senderName && 
                    sender.isStop
                
                if (isUnsubscribe) {                
                    const response: ResponseSubscribe = null
                    return res.json(response)
                }

                const isSendNewMessage = 
                    sender.nameOfChat === subscriber.nameOfChat && 
                    !sender.isStop
                
                if (isSendNewMessage) {
                    const { _id, senderName, content, time }: MessageTemplate = message;

                    const response: ResponseSubscribe = { _id, senderName, content, time }
                    return res.json(response)
                }
            } catch (e) { }
        })
    }
    unsubscribe = async (req: Request, res: Response) => {
        try {
            const { nameOfChat, senderName }: RequestUnsubscribe = req.body
            
            const dateNow = Date.now()

            const newMessage: NewMessage = {
                _id: dateNow.toString(), 
                senderName, 
                content: '',
                time: dateNow,
                sender: {
                    senderName,
                    nameOfChat,
                    isStop: true
                }
            }
            
            emitter.emit('newMessage', newMessage)

            const response: ResponseUnsubscribe = null
            res.status(200).json(response)
        } catch (error) {
            console.log(error);

            const response: ResponseUnsubscribe = null
            res.status(200).json(response)
        }
    }
}

export default new Controller();

interface NewMessage extends MessageTemplate {
    sender: {
        senderName: string
        nameOfChat: string
        isStop: boolean
    }
}