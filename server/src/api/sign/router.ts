import { Router } from 'express';
import { check } from 'express-validator';

import controller from './controller';

const router: Router = Router();

router.post('/sign-in', [
    check('name', 'Please, enter name').notEmpty(),
    check('password', 'Please, enter your password').notEmpty(),
], controller.signIn);
router.post('/sign-up', [
    check('name', 'Please, enter name').notEmpty(),
    check('password', 'Please, enter your password').notEmpty(),
    check('password', 'Your password must be between 8 and 16 characters long').isLength({min: 8, max: 16}),
], controller.signUp);

export default router