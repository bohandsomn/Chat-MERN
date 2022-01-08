import { Schema, model } from 'mongoose'

export interface MessageTemplate {
    _id: Schema.Types.ObjectId | string
    senderName: string
    content: string
    time: number
}

export interface ChatTemplate {
    nameOfChat: string
    messages: MessageTemplate[]
    listOfUsers: Array<Schema.Types.ObjectId>
}

export interface ChatPreviewUserId extends Omit<ChatTemplate, 'messages'> {
    lastMessage: MessageTemplate
}

export interface ChatPreview extends Omit<ChatPreviewUserId, 'listOfUsers'> {
    listOfUsers: string[]
}

export const Chat = new Schema<ChatTemplate>({
    nameOfChat: {type: String, required: true},
    messages: [{
        senderName: {type: String, required: true},
        content: {type: String, required: true},
        time: {type: Number, required: true}
    }],
    listOfUsers: [{type: Schema.Types.ObjectId}]
});

export default model<ChatTemplate>('Chat', Chat);