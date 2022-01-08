import { Schema } from 'mongoose';

import Chat, { ChatTemplate, ChatPreviewUserId } from '../entities/Chat'

export const decodeChat = async (chatId: Document | Schema.Types.ObjectId): Promise<ChatPreviewUserId | null> => 
    await Chat.findOne({_id: chatId})
        .then( (chat): ChatPreviewUserId | null => {
            if (chat === null) {
                return chat;
            }
            
            const { nameOfChat, messages, listOfUsers }: ChatTemplate = chat

            const lastMessage = messages.at(-1) || {
                _id: Date.now().toString(),
                senderName: '',
                content: '',
                time: Date.now()
            }

            return { 
                nameOfChat, 
                lastMessage, 
                listOfUsers
            }
        } );