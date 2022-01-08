import { Router } from 'express';
import { check } from 'express-validator';

import controller from './controller';

const router: Router = Router();

router.post('/create-chat', [
    check('nameOfChat', 'Please, enter name of chat').notEmpty(),
], controller.create);
router.post('/get-chats', controller.getChats);
router.post('/change-chat', controller.change);
router.post('/get-users', controller.getUsers);

export default router