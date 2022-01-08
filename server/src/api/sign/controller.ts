import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { validationResult } from 'express-validator'

import { getChatsWithUserNames } from '../../functions'

import User from '../../entities/User';

import { RequestSign, ResponseSign } from '../../interface'

class Controller {
    signIn = async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: 'Validation error', 
                    errors: errors.array().map((err: {msg: string}) => err.msg),
                    isSuccess: false
                });
            }

            const {name, password}: RequestSign = req.body;

            const candidate = await User.findOne({name});
            if (!candidate) {
                const response: ResponseSign = {
                    message: 'User is not found',
                    isSuccess: false
                }
                return res.json(response)
            }
            const isValidPassword = bcrypt.compareSync(password, candidate.password);
            if (!isValidPassword) {
                const response: ResponseSign = {
                    message: 'Invalid password',
                    isSuccess: false
                }
                return res.json(response);
            } 

            const [ chats ] = await Promise.all( [getChatsWithUserNames(candidate.chats)] )

            const response: ResponseSign = {
                message: 'You have successfully logged in',
                isSuccess: true,
                data: {
                    name: candidate.name,
                    chats
                }
            }

            res.status(200).json(response)
        } catch (e) {
            console.log(e);
            const response: ResponseSign = {
                message: 'Server error',
                isSuccess: false
            }
            res.status(500).json(response)
        }
    }
    signUp = async (req: Request, res: Response) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    message: 'Validation error', 
                    errors: errors.array().map((err: {msg: string}) => err.msg),
                    isSuccess: false
                });
            }
            
            const {name, password}: RequestSign = req.body;
            const candidate = await User.findOne({name});
            if (candidate) {
                const response: ResponseSign = {
                    message: 'A user with the same name already exists',
                    isSuccess: false
                }
                return res.json(response)
            }

            const nashPassword = bcrypt.hashSync(password, 7);

            const user = new User({name, password: nashPassword});
            user.save();

            const response: ResponseSign = {
                message: 'You have successfully registered',
                isSuccess: true,
                data: {
                    name,
                    chats: []
                }
            }
            res.status(200).json(response)
        } catch (e) {
            console.log(e);
            const response: ResponseSign = {
                message: 'Server error',
                isSuccess: false
            }
            res.status(500).json(response)
        }
    }
}

export default new Controller();