import { ChatPreview } from '../../../server/src/interface'

export const sortChats = (listOfChats: ChatPreview[]) => listOfChats.sort( (first, second) => second.lastMessage.time - first.lastMessage.time )