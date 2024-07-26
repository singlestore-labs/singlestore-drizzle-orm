import express from 'express';
import postRouter from './post';
import commentRouter from './comment';

export const router = express.Router();

// Use the post router
router.use('/post', postRouter);

// Use the comment router
router.use('/comment', commentRouter);
