import express from 'express';
const router = express.Router();


import { isAuthenticated } from '../middlewares/authMiddleware.js';
import { commentOnPost, createPost, deleteComment, deletePost, getAllPosts, likeUnlikePost, updatePost } from '../controllers/postController.js';
import uploadFile from '../middlewares/multer.js';



router.post('/create', uploadFile, isAuthenticated, createPost);
router.delete('/post/:id', isAuthenticated, deletePost);
router.put('/update/:id', isAuthenticated, updatePost);
router.get('/get-all-posts', isAuthenticated, getAllPosts);
router.get('/liked/:id', isAuthenticated, likeUnlikePost);
router.post('/comment/:id', isAuthenticated, commentOnPost);
router.delete('/comment/:id', isAuthenticated, deleteComment);

export default router;