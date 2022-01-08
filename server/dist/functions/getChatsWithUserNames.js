"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatsWithUserNames = void 0;
const _1 = require("./");
exports.getChatsWithUserNames = async (chats) => {
    const promiseChats = (await Promise.all(chats.map(_1.decodeChat)))
        .filter((chat) => chat !== null)
        .map(async (chat) => {
        const { nameOfChat, listOfUsers, lastMessage } = chat;
        const listOfUserNames = (await Promise.all(listOfUsers.map(_1.decodeUserById)))
            .filter((user) => user !== null)
            .map((user) => user.name);
        return {
            nameOfChat,
            listOfUsers: listOfUserNames,
            lastMessage
        };
    });
    return await Promise.all(promiseChats);
};
