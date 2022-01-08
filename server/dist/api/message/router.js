"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = __importDefault(require("./controller"));
const router = express_1.Router();
router.post('/get-messages', controller_1.default.getMessages);
router.post('/set-message', controller_1.default.setMessage);
router.post('/subscribe', controller_1.default.subscribe);
router.post('/unsubscribe', controller_1.default.unsubscribe);
exports.default = router;
