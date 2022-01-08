import { Schema } from 'mongoose';

import User, { UserTemplate } from '../entities/User';

export const decodeUserById = async (userId: Document | Schema.Types.ObjectId): Promise<UserTemplate | null> => 
    await User.findOne({_id: userId})
        .then( (user): UserTemplate | null => {
            if (user === null) {
                return user
            }

            const { name, password, chats }: UserTemplate = user

            return { name, password, chats }
        } );

export const decodeUserByName = async (nameOfUser: string): Promise<UserTemplate | null> => 
    await User.findOne({name: nameOfUser})
        .then( (user): UserTemplate | null => {
            if (user === null) {
                return user
            }

            const { name, password, chats }: UserTemplate = user

            return { name, password, chats }
        } );

export const updateChatList = async (userName: string, newChat: Schema.Types.ObjectId): Promise<UserTemplate | null> => 
    await User.findOne({name: userName})
        .then( async (user) => {
            if (user === null) {
                return null
            }
            
            await user.updateOne({
                chats: [...user.chats, newChat]
            })
            
            return user
        } );