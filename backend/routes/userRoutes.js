import express from 'express';
const router = express.Router();


import { followUnFollowUser, getAllUsers, meProfile, updatePassword, updateProfile, userById, userFollowerandFollowingData } from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';
import uploadFile from '../middlewares/multer.js';



router.get('/me', isAuthenticated, meProfile);
router.get('/user/:id', isAuthenticated, userById);
router.get('/follow/:id', isAuthenticated, followUnFollowUser);
router.get('/follow-data/:id', isAuthenticated, userFollowerandFollowingData);
router.put('/update-profile', isAuthenticated, uploadFile, updateProfile);
router.post('/update-password', isAuthenticated, updatePassword);
router.get('/all-users', isAuthenticated, getAllUsers);


export default router;
