import { ChatPreview, ChatTemplate, MessageTemplate, ChatPreviewUserId } from '../entities/Chat'
import { UserTemplate } from '../entities/User'

type UserName = string
type ListOfUsers = UserName[]
type NameOfChat = string

export type RequestSign = {
    name: UserName
    password: string
}
export type ResponseSign = {
    message: string
    isSuccess: boolean
    data?: {
        name: UserName
        chats: Array<ChatPreview | null>
    };
    errors?: string[]
}

export type RequestGetMessages = {
    nameOfChat: NameOfChat
}
export type ResponseGetMessages = {
    isSuccess: boolean
    message?: string
    messages: MessageTemplate[]
}

export type RequestSubscribe = {
    nameOfChat: NameOfChat
    senderName: UserName
}
export type ResponseSubscribe = MessageTemplate | null

export type RequestSetMessage = {
    name: UserName
    nameOfChat: NameOfChat
    message: string
    listOfUsers: ListOfUsers
}
export type ResponseSetMessage = {
    isSuccess: boolean
    message?: string
}

export type RequestUnsubscribe = {
    nameOfChat: NameOfChat
    senderName: UserName
} 
export type ResponseUnsubscribe = null

export type RequestCreate = {
    nameOfChat: NameOfChat
    listOfUsers: ListOfUsers
}
export type ResponseCreate = {
    message: string
    isSuccess: boolean
    errors?: string[]
    chat?: ChatPreview
}

export type RequestGetChats = {
    name: UserName
}
export type ResponseGetChats = {
    message?: string
    isSuccess: boolean
    chats: Array<ChatPreview | null>
}

export type RequestGetUsers = {
    user: UserName
}
export type ResponseGetUsers = {
    users: ListOfUsers
}

export interface RequestChange {
    nameOfChat: NameOfChat;
    newNameOfChat: NameOfChat;
    newUsers: ListOfUsers;
    deletedUsers: ListOfUsers;
}
export interface ResponseChange {
    message: string;
    isSuccess: boolean;
    chat?: ChatPreview;
}


export type { ChatPreview, ChatTemplate, MessageTemplate, ChatPreviewUserId, UserTemplate }