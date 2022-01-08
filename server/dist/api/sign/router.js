"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const controller_1 = __importDefault(require("./controller"));
const router = express_1.Router();
router.post('/sign-in', [
    express_validator_1.check('name', 'Please, enter name').notEmpty(),
    express_validator_1.check('password', 'Please, enter your password').notEmpty(),
], controller_1.default.signIn);
router.post('/sign-up', [
    express_validator_1.check('name', 'Please, enter name').notEmpty(),
    express_validator_1.check('password', 'Please, enter your password').notEmpty(),
    express_validator_1.check('password', 'Your password must be between 8 and 16 characters long').isLength({ min: 8, max: 16 }),
], controller_1.default.signUp);
exports.default = router;
