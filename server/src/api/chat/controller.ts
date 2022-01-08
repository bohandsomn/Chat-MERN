import { Request, Response } from 'express'
import { Schema } from 'mongoose'
import { validationResult } from 'express-validator'

import Chat, { ChatPreview } from '../../entities/Chat'
import User, { UserTemplate } from "../../entities/User";

import { codeUser, updateChatList, getChatsWithUserNames, decodeUserById } from '../../functions'

import { 
    RequestCreate  , ResponseCreate  ,
    RequestGetChats, ResponseGetChats,
    RequestGetUsers, ResponseGetUsers,
    RequestChange  , ResponseChange
} from '../../interface'

class Controller {
    create = async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                const response = {
                    message: 'Validation error', 
                    errors: errors.array().map((err: {msg: string}) => err.msg),
                    isSuccess: false
                }
                return res.status(400).json(response)
            }

            const { nameOfChat, listOfUsers }: RequestCreate = req.body

            const candidate = await Chat.findOne({ nameOfChat })

            if (candidate !== null) {
                const response: ResponseCreate = {
                    message: 'A chat with the same name already exists',
                    isSuccess: false
                }
                return res.json(response)
            }

            const chat = new Chat({
                nameOfChat,
                messages: [],
                listOfUsers: await Promise.all(listOfUsers.map( codeUser ))
            })
            chat.save()

            await Promise.all(listOfUsers.map( user => updateChatList(user, chat._id) ))
            
            const chatPreview: ChatPreview = { 
                nameOfChat, 
                listOfUsers, 
                lastMessage: {
                    _id: Date.now().toString(),
                    senderName: '',
                    content: '',
                    time: Date.now()
                } 
            }

            const response: ResponseCreate = {
                message: 'Chat was successfully created',
                isSuccess: true,
                chat: chatPreview
            }
            res.status(200).json(response);
        } catch (e) {
            console.log(e);
            const response: ResponseCreate = {
                message: 'Chat creation error',
                isSuccess: false
            }
            res.status(500).json(response)
        }
    }
    getChats = async (req: Request, res: Response) => {
        try {
            const { name }: RequestGetChats = req.body;

            const candidate = await User.findOne({ name });
            if (!candidate) {
                const response: ResponseGetChats = {
                    message: 'You are not registred',
                    isSuccess: false,
                    chats: []
                }
                return res.json(response)
            }

            const [ chats ] = await Promise.all( [ getChatsWithUserNames(candidate.chats) ] )

            const response: ResponseGetChats = {
                isSuccess: true,
                chats
            }
            res.json(response)
        } catch (e) {
            console.log(e);
            const response: ResponseGetChats = {
                message: 'Error receiving chats',
                isSuccess: false,
                chats: []
            }
            res.json(response)
        }
    }
    change = async (req: Request, res: Response) => {
        try {
            const { nameOfChat, newNameOfChat, newUsers, deletedUsers }: RequestChange = req.body
            
            const chat = await Chat.findOne({ nameOfChat });
            if (chat === null) {
                const response: ResponseChange = {
                    message: 'Chat was not found',
                    isSuccess: false
                }
                return res.json(response)
            }

            const newUsersId: Schema.Types.ObjectId[] = (await Promise.all( 
                newUsers.map( async (newUser: string): Promise<Schema.Types.ObjectId | null> => {
                    const user = await User.findOne({ name: newUser });
                    if (user === null) {
                        return null
                    }

                    const isMember: boolean = user.chats.includes(chat._id)
                    if (isMember) {
                        return null
                    }
                    
                    const chats = [...user.chats, chat._id]
                    
                    await user.updateOne({ chats })
                    return user._id
                } ) 
            )).filter( (user: Schema.Types.ObjectId | null): user is Schema.Types.ObjectId => user !== null )

            const noDeletedUsersId: Schema.Types.ObjectId[] = chat.listOfUsers;
                        
            await Promise.all( deletedUsers.map( async (deletedUser): Promise<Schema.Types.ObjectId | null> => {
                const user = await User.findOne({name: deletedUser})                
                if (user === null) {
                    return user
                }                

                const indexOfDeletedUser = noDeletedUsersId.indexOf(user._id)                                
                indexOfDeletedUser !== -1 && noDeletedUsersId.splice(indexOfDeletedUser, 1)                
                
                const indexOfDeletedUserInNewUsers = newUsersId.indexOf(user._id)                
                indexOfDeletedUserInNewUsers !== -1 && newUsersId.splice(indexOfDeletedUserInNewUsers, 1)
                
                const chats = user.chats.filter( (chatId: Schema.Types.ObjectId | Document) => chatId.toString() !== chat._id.toString() )
                
                await user.updateOne({ chats })

                return user._id
            } )) 
            
            const updatedListOfUsers = [...noDeletedUsersId, ...newUsersId]
            
            await chat.updateOne({
                listOfUsers: updatedListOfUsers
            })

            if (newNameOfChat !== nameOfChat) {
                await chat.updateOne({
                    nameOfChat: newNameOfChat
                });
            }

            const updatedChat = await Chat.findOne({ _id: chat._id })            

            if (updatedChat === null) {
                const response: ResponseChange = {
                    message: 'Chat data update error',
                    isSuccess: false
                }
                return res.json(response)
            }

            const listOfUsers = (await Promise.all( updatedChat.listOfUsers.map( decodeUserById ) ))
                .filter( (user: UserTemplate | null): user is UserTemplate => user !== null )
                .map( (user: UserTemplate) => user.name )
            
            const lastMessage = updatedChat.messages.at(-1) || {
                _id: Date.now().toString(),
                senderName: '',
                content: '',
                time: Date.now()
            }

            const response: ResponseChange = {
                message: 'Chat updated successfully',
                isSuccess: true,
                chat: {
                    nameOfChat: updatedChat.nameOfChat,
                    lastMessage,
                    listOfUsers
                }
            }
            res.json(response)
            
        } catch (error) {
            console.log(error);
            const response: ResponseChange = {
                message: 'Chat data update error',
                isSuccess: false
            }
            res.json(response)
        }
    }
    getUsers = async (req: Request, res: Response) => {
        try {
            const { user }: RequestGetUsers = req.body;
            
            const users = await User.find({ name: { $regex: user } })
                .limit( 6 )
                .then( users => users.map( user => user.name ) );
                
            const response: ResponseGetUsers = { users }
            res.json(response);
        } catch (e) {
            console.log(e);
            const response: ResponseGetUsers = { users: [] }
            res.json(response)
        }
    }
}

export default new Controller();