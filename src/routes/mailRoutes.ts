import { Router } from 'express';
import { sendEmail } from '../controllers/mailController';

const router = Router();
router.post('/contact', sendEmail);
export default router;
