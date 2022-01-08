import { Schema, model } from 'mongoose'

export interface UserTemplate {
    name: string
    password: string
    chats: Array<Schema.Types.ObjectId | Document>
}

const User = new Schema<UserTemplate>({
    name: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    chats: [{type: Schema.Types.ObjectId}]
});

User.index( { name: "text" } );

export default model<UserTemplate>('User', User);