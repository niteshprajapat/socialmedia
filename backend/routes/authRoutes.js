import express from 'express';
const router = express.Router();

import { login, logout, register } from '../controllers/authController.js';
import uploadFile from '../middlewares/multer.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';



// API Routes

router.post('/register', uploadFile, register);
router.post('/login', login);
router.get('/logout', isAuthenticated, logout);


export default router;