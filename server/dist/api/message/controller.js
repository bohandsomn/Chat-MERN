"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const User_1 = __importDefault(require("../../entities/User"));
const Chat_1 = __importDefault(require("../../entities/Chat"));
const functions_1 = require("../../functions");
const emitter = new events_1.EventEmitter();
emitter.setMaxListeners(100);
class Controller {
    constructor() {
        this.setMessage = async (req, res) => {
            try {
                const { name, nameOfChat, message, listOfUsers } = req.body;
                const candidate = await User_1.default.findOne({ name });
                if (!candidate) {
                    const response = {
                        message: 'User is not found',
                        isSuccess: false
                    };
                    return res.json(response);
                }
                const chatCandidate = await Chat_1.default.findOne({ nameOfChat });
                if (!chatCandidate) {
                    const response = {
                        message: 'Chat with this name does not exist',
                        isSuccess: false
                    };
                    return res.json(response);
                }
                const isMember = chatCandidate.listOfUsers.includes(candidate._id);
                if (!isMember) {
                    const response = {
                        message: 'You are not a member of this group',
                        isSuccess: false
                    };
                    return res.json(response);
                }
                await chatCandidate.updateOne({
                    messages: [...chatCandidate.messages, { senderName: name, content: message, time: Date.now() }]
                });
                const users = (await Promise.all(listOfUsers.map(functions_1.decodeUserByName)));
                const dateNow = Date.now();
                for await (const user of users) {
                    const newMessage = {
                        _id: dateNow.toString(),
                        senderName: name,
                        content: message,
                        time: dateNow,
                        sender: {
                            senderName: name,
                            nameOfChat,
                            isStop: false
                        }
                    };
                    user && emitter.emit('newMessage', newMessage);
                }
                const response = {
                    isSuccess: true
                };
                res.status(200).json(response);
            }
            catch (e) {
                console.log(e);
                const response = {
                    message: 'Error sending message',
                    isSuccess: false
                };
                res.json({ response });
            }
        };
        this.getMessages = async (req, res) => {
            try {
                const { nameOfChat } = req.body;
                const candidate = await Chat_1.default.findOne({ nameOfChat });
                if (!candidate) {
                    const response = {
                        message: 'Chat was not found',
                        isSuccess: false,
                        messages: []
                    };
                    return res.json(response);
                }
                const { messages } = candidate;
                const response = {
                    isSuccess: true,
                    messages
                };
                res.json(response);
            }
            catch (error) {
                console.log(error);
                const response = {
                    message: 'Get messages error',
                    isSuccess: false,
                    messages: []
                };
                return res.json(response);
            }
        };
        this.subscribe = async (req, res) => {
            const { nameOfChat, senderName } = req.body;
            const subscriber = { nameOfChat, senderName };
            emitter.on('newMessage', async (message) => {
                try {
                    const { sender } = message;
                    const isUnsubscribe = sender.nameOfChat === subscriber.nameOfChat &&
                        sender.senderName === subscriber.senderName &&
                        sender.isStop;
                    if (isUnsubscribe) {
                        const response = null;
                        return res.json(response);
                    }
                    const isSendNewMessage = sender.nameOfChat === subscriber.nameOfChat &&
                        !sender.isStop;
                    if (isSendNewMessage) {
                        const { _id, senderName, content, time } = message;
                        const response = { _id, senderName, content, time };
                        return res.json(response);
                    }
                }
                catch (e) { }
            });
        };
        this.unsubscribe = async (req, res) => {
            try {
                const { nameOfChat, senderName } = req.body;
                const dateNow = Date.now();
                const newMessage = {
                    _id: dateNow.toString(),
                    senderName,
                    content: '',
                    time: dateNow,
                    sender: {
                        senderName,
                        nameOfChat,
                        isStop: true
                    }
                };
                emitter.emit('newMessage', newMessage);
                const response = null;
                res.status(200).json(response);
            }
            catch (error) {
                console.log(error);
                const response = null;
                res.status(200).json(response);
            }
        };
    }
}
exports.default = new Controller();
