import express from 'express';
const router = express.Router();

import { getAllChats, getAllMessages, sendMessage } from '../controllers/messageController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';


router.post('/send-message', isAuthenticated, sendMessage)
router.get('/get-all-messages/:id', isAuthenticated, getAllMessages)
router.get('/chats', isAuthenticated, getAllChats)


export default router;