"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeChat = void 0;
const Chat_1 = __importDefault(require("../entities/Chat"));
exports.decodeChat = async (chatId) => await Chat_1.default.findOne({ _id: chatId })
    .then((chat) => {
    if (chat === null) {
        return chat;
    }
    const { nameOfChat, messages, listOfUsers } = chat;
    const lastMessage = messages.at(-1) || {
        _id: Date.now().toString(),
        senderName: '',
        content: '',
        time: Date.now()
    };
    return {
        nameOfChat,
        lastMessage,
        listOfUsers
    };
});
