"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const Chat_1 = __importDefault(require("../../entities/Chat"));
const User_1 = __importDefault(require("../../entities/User"));
const functions_1 = require("../../functions");
class Controller {
    constructor() {
        this.create = async (req, res) => {
            try {
                const errors = express_validator_1.validationResult(req);
                if (!errors.isEmpty()) {
                    const response = {
                        message: 'Validation error',
                        errors: errors.array().map((err) => err.msg),
                        isSuccess: false
                    };
                    return res.status(400).json(response);
                }
                const { nameOfChat, listOfUsers } = req.body;
                const candidate = await Chat_1.default.findOne({ nameOfChat });
                if (candidate !== null) {
                    const response = {
                        message: 'A chat with the same name already exists',
                        isSuccess: false
                    };
                    return res.json(response);
                }
                const chat = new Chat_1.default({
                    nameOfChat,
                    messages: [],
                    listOfUsers: await Promise.all(listOfUsers.map(functions_1.codeUser))
                });
                chat.save();
                await Promise.all(listOfUsers.map(user => functions_1.updateChatList(user, chat._id)));
                const chatPreview = {
                    nameOfChat,
                    listOfUsers,
                    lastMessage: {
                        _id: Date.now().toString(),
                        senderName: '',
                        content: '',
                        time: Date.now()
                    }
                };
                const response = {
                    message: 'Chat was successfully created',
                    isSuccess: true,
                    chat: chatPreview
                };
                res.status(200).json(response);
            }
            catch (e) {
                console.log(e);
                const response = {
                    message: 'Chat creation error',
                    isSuccess: false
                };
                res.status(500).json(response);
            }
        };
        this.getChats = async (req, res) => {
            try {
                const { name } = req.body;
                const candidate = await User_1.default.findOne({ name });
                if (!candidate) {
                    const response = {
                        message: 'You are not registred',
                        isSuccess: false,
                        chats: []
                    };
                    return res.json(response);
                }
                const [chats] = await Promise.all([functions_1.getChatsWithUserNames(candidate.chats)]);
                const response = {
                    isSuccess: true,
                    chats
                };
                res.json(response);
            }
            catch (e) {
                console.log(e);
                const response = {
                    message: 'Error receiving chats',
                    isSuccess: false,
                    chats: []
                };
                res.json(response);
            }
        };
        this.change = async (req, res) => {
            try {
                const { nameOfChat, newNameOfChat, newUsers, deletedUsers } = req.body;
                const chat = await Chat_1.default.findOne({ nameOfChat });
                if (chat === null) {
                    const response = {
                        message: 'Chat was not found',
                        isSuccess: false
                    };
                    return res.json(response);
                }
                const newUsersId = (await Promise.all(newUsers.map(async (newUser) => {
                    const user = await User_1.default.findOne({ name: newUser });
                    if (user === null) {
                        return null;
                    }
                    const isMember = user.chats.includes(chat._id);
                    if (isMember) {
                        return null;
                    }
                    const chats = [...user.chats, chat._id];
                    await user.updateOne({ chats });
                    return user._id;
                }))).filter((user) => user !== null);
                const noDeletedUsersId = chat.listOfUsers;
                await Promise.all(deletedUsers.map(async (deletedUser) => {
                    const user = await User_1.default.findOne({ name: deletedUser });
                    if (user === null) {
                        return user;
                    }
                    const indexOfDeletedUser = noDeletedUsersId.indexOf(user._id);
                    indexOfDeletedUser !== -1 && noDeletedUsersId.splice(indexOfDeletedUser, 1);
                    const indexOfDeletedUserInNewUsers = newUsersId.indexOf(user._id);
                    indexOfDeletedUserInNewUsers !== -1 && newUsersId.splice(indexOfDeletedUserInNewUsers, 1);
                    const chats = user.chats.filter((chatId) => chatId.toString() !== chat._id.toString());
                    await user.updateOne({ chats });
                    return user._id;
                }));
                const updatedListOfUsers = [...noDeletedUsersId, ...newUsersId];
                await chat.updateOne({
                    listOfUsers: updatedListOfUsers
                });
                if (newNameOfChat !== nameOfChat) {
                    await chat.updateOne({
                        nameOfChat: newNameOfChat
                    });
                }
                const updatedChat = await Chat_1.default.findOne({ _id: chat._id });
                if (updatedChat === null) {
                    const response = {
                        message: 'Chat data update error',
                        isSuccess: false
                    };
                    return res.json(response);
                }
                const listOfUsers = (await Promise.all(updatedChat.listOfUsers.map(functions_1.decodeUserById)))
                    .filter((user) => user !== null)
                    .map((user) => user.name);
                const lastMessage = updatedChat.messages.at(-1) || {
                    _id: Date.now().toString(),
                    senderName: '',
                    content: '',
                    time: Date.now()
                };
                const response = {
                    message: 'Chat updated successfully',
                    isSuccess: true,
                    chat: {
                        nameOfChat: updatedChat.nameOfChat,
                        lastMessage,
                        listOfUsers
                    }
                };
                res.json(response);
            }
            catch (error) {
                console.log(error);
                const response = {
                    message: 'Chat data update error',
                    isSuccess: false
                };
                res.json(response);
            }
        };
        this.getUsers = async (req, res) => {
            try {
                const { user } = req.body;
                const users = await User_1.default.find({ name: { $regex: user } })
                    .limit(6)
                    .then(users => users.map(user => user.name));
                const response = { users };
                res.json(response);
            }
            catch (e) {
                console.log(e);
                const response = { users: [] };
                res.json(response);
            }
        };
    }
}
exports.default = new Controller();
