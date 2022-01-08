"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chat = void 0;
const mongoose_1 = require("mongoose");
exports.Chat = new mongoose_1.Schema({
    nameOfChat: { type: String, required: true },
    messages: [{
            senderName: { type: String, required: true },
            content: { type: String, required: true },
            time: { type: Number, required: true }
        }],
    listOfUsers: [{ type: mongoose_1.Schema.Types.ObjectId }]
});
exports.default = mongoose_1.model('Chat', exports.Chat);
