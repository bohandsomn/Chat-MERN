"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const express_validator_1 = require("express-validator");
const functions_1 = require("../../functions");
const User_1 = __importDefault(require("../../entities/User"));
class Controller {
    constructor() {
        this.signIn = async (req, res) => {
            try {
                const errors = express_validator_1.validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        message: 'Validation error',
                        errors: errors.array().map((err) => err.msg),
                        isSuccess: false
                    });
                }
                const { name, password } = req.body;
                const candidate = await User_1.default.findOne({ name });
                if (!candidate) {
                    const response = {
                        message: 'User is not found',
                        isSuccess: false
                    };
                    return res.json(response);
                }
                const isValidPassword = bcrypt_1.default.compareSync(password, candidate.password);
                if (!isValidPassword) {
                    const response = {
                        message: 'Invalid password',
                        isSuccess: false
                    };
                    return res.json(response);
                }
                const [chats] = await Promise.all([functions_1.getChatsWithUserNames(candidate.chats)]);
                const response = {
                    message: 'You have successfully logged in',
                    isSuccess: true,
                    data: {
                        name: candidate.name,
                        chats
                    }
                };
                res.status(200).json(response);
            }
            catch (e) {
                console.log(e);
                const response = {
                    message: 'Server error',
                    isSuccess: false
                };
                res.status(500).json(response);
            }
        };
        this.signUp = async (req, res) => {
            try {
                const errors = express_validator_1.validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({
                        message: 'Validation error',
                        errors: errors.array().map((err) => err.msg),
                        isSuccess: false
                    });
                }
                const { name, password } = req.body;
                const candidate = await User_1.default.findOne({ name });
                if (candidate) {
                    const response = {
                        message: 'A user with the same name already exists',
                        isSuccess: false
                    };
                    return res.json(response);
                }
                const nashPassword = bcrypt_1.default.hashSync(password, 7);
                const user = new User_1.default({ name, password: nashPassword });
                user.save();
                const response = {
                    message: 'You have successfully registered',
                    isSuccess: true,
                    data: {
                        name,
                        chats: []
                    }
                };
                res.status(200).json(response);
            }
            catch (e) {
                console.log(e);
                const response = {
                    message: 'Server error',
                    isSuccess: false
                };
                res.status(500).json(response);
            }
        };
    }
}
exports.default = new Controller();
