import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { db } from "./db"
import { Comment, post } from './schema';
import { desc } from 'drizzle-orm';
import { match } from 'drizzle-orm/singlestore-core';
import { generateRandomID } from './common';

const postRouter = express.Router();

postRouter.put('/', async (req: Request, res: Response) => {
  if (!req.body.content) {
    res.status(StatusCodes.BAD_REQUEST).send("Content required");
    return;
  }
  try {
    await db.insert(post).values({
      id: generateRandomID(16),
      content: req.body.content
    }).execute();

    res.status(StatusCodes.OK).send();
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    console.error(e);
  }
});

type CommentWithComments = Comment & {
  comments: Array<CommentWithComments>;
}

postRouter.get('/', async (_, res: Response) => {
  try {
    const posts = await db.query.post.findMany({
      orderBy: desc(post.createdOn),
      with: {
        comments: true,
      },
      limit: 20
    });

    const newPosts = posts.map((post) => {
      const allComments = new Map<string, CommentWithComments>();
      post.comments.forEach((comment) => {
          allComments.set(comment.id, { ...comment, comments: [] });
      });

      const newPost: typeof post = {
        ...post,
        comments: []
      }

      allComments.forEach((comment) => {
          if (comment.repliesToComment) {
              const repliesTo = allComments.get(comment.repliesToComment);
              repliesTo?.comments.push(comment)
          } else {
            newPost.comments.push(comment)
          }
      });

      return newPost;
    });

    res.status(StatusCodes.OK).json(newPosts);
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    console.error(e);
  }
});

postRouter.get('/search', async (req: Request, res: Response) => {
  const searchResultsLimits = req.query.limit ? parseInt(req.query.limit as string) : 100;

  try {
    const search = req.query.search as string;

    const posts = await db.select().from(post).where(match(post, `content:${search}`)).limit(searchResultsLimits);

    res.status(StatusCodes.OK).json(posts);
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    console.error(e);
  }
});

export default postRouter;
