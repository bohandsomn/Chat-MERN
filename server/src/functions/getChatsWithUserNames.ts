import { Schema } from "mongoose"

import { decodeChat, decodeUserById } from './'
import { ChatPreviewUserId, ChatPreview, UserTemplate } from '../interface'

export const getChatsWithUserNames = async (chats: (Schema.Types.ObjectId | Document)[]) => {
    const promiseChats = (await Promise.all( chats.map( decodeChat ) ))
        .filter( (chat: ChatPreviewUserId | null): chat is ChatPreviewUserId => chat !== null )
        .map( async (chat: ChatPreviewUserId): Promise<ChatPreview> => {
        const { nameOfChat, listOfUsers, lastMessage } = chat

        const listOfUserNames = (await Promise.all( listOfUsers.map( decodeUserById ) ))
            .filter( (user: UserTemplate | null): user is UserTemplate => user !== null )
            .map( (user: UserTemplate) => user.name )

        return { 
            nameOfChat, 
            listOfUsers: listOfUserNames, 
            lastMessage 
        }
    } )
    return await Promise.all( promiseChats )
}