"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const controller_1 = __importDefault(require("./controller"));
const router = express_1.Router();
router.post('/create-chat', [
    express_validator_1.check('nameOfChat', 'Please, enter name of chat').notEmpty(),
], controller_1.default.create);
router.post('/get-chats', controller_1.default.getChats);
router.post('/change-chat', controller_1.default.change);
router.post('/get-users', controller_1.default.getUsers);
exports.default = router;
