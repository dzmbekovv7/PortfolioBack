import { Router } from 'express';
import { sendVerificationCode, verifyAndSendMessage } from '../controllers/mailController';

const router = Router();

router.post('/send-code', sendVerificationCode);
router.post('/verify-and-send', verifyAndSendMessage);

export default router;
