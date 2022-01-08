"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateChatList = exports.decodeUserByName = exports.decodeUserById = void 0;
const User_1 = __importDefault(require("../entities/User"));
exports.decodeUserById = async (userId) => await User_1.default.findOne({ _id: userId })
    .then((user) => {
    if (user === null) {
        return user;
    }
    const { name, password, chats } = user;
    return { name, password, chats };
});
exports.decodeUserByName = async (nameOfUser) => await User_1.default.findOne({ name: nameOfUser })
    .then((user) => {
    if (user === null) {
        return user;
    }
    const { name, password, chats } = user;
    return { name, password, chats };
});
exports.updateChatList = async (userName, newChat) => await User_1.default.findOne({ name: userName })
    .then(async (user) => {
    if (user === null) {
        return null;
    }
    await user.updateOne({
        chats: [...user.chats, newChat]
    });
    return user;
});
