"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const User = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    chats: [{ type: mongoose_1.Schema.Types.ObjectId }]
});
User.index({ name: "text" });
exports.default = mongoose_1.model('User', User);
