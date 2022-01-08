"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.codeUser = void 0;
const User_1 = __importDefault(require("../entities/User"));
exports.codeUser = async (name) => await User_1.default.findOne({ name })
    .then((user) => {
    if (user === null) {
        return;
    }
    return user._id;
});
