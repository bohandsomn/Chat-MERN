import { Schema } from 'mongoose'

import User from '../entities/User'

export const codeUser = async (name: string): Promise<Schema.Types.ObjectId | undefined> => 
    await User.findOne({name})
        .then( (user): Schema.Types.ObjectId | undefined => {
            if (user === null) {
                return
            }
            
            return user._id
        } )