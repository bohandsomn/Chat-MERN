import { Router } from 'express';

import controller from './controller';

const router: Router = Router();

router.post('/get-messages', controller.getMessages);
router.post('/set-message', controller.setMessage);
router.post('/subscribe', controller.subscribe);
router.post('/unsubscribe', controller.unsubscribe);

export default router