import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { db } from "./db"
import { comment, Comment, Post, post } from './schema';
import { desc, eq, sql, or } from 'drizzle-orm';
import { match } from 'drizzle-orm/singlestore-core';

const postRouter = express.Router();

postRouter.put('/', async (req: Request, res: Response) => {
  if (!req.body.content) {
    res.status(StatusCodes.BAD_REQUEST).send("Content required");
    return;
  }
  try {
    await db.insert(post).values({
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

type PostWithComments = Post & {
  comments: Array<CommentWithComments>;
}

postRouter.get('/', async (_, res: Response) => {
  try {
    let posts = await db.query.post.findMany({
      orderBy: desc(post.createdOn),
      limit: 20
    });

    let cond = sql`false`;
    for (const post of posts) {
      cond = or(cond, eq(comment.postId, post.id));
    }

    const comments = await db.query.comment.findMany({
      where: cond,
    });

    const allComments = new Map<string, CommentWithComments>();
    comments.forEach((comment: Comment) => {
      allComments.set(comment.id, { ...comment, comments: [] });
    });

    const allPosts = new Map<string, PostWithComments>();
    posts.forEach((post: Post) => {
      allPosts.set(post.id, { ...post, comments: [] });
    });

    allComments.forEach((comment) => {
      if (comment.repliesToComment) {
        const repliesTo = allComments.get(comment.repliesToComment);
        repliesTo?.comments.push(comment)
      } else {
        const post = allPosts.get(comment.postId);
        post?.comments.push(comment);
      }
    });

    const newPosts = Array.from(allPosts.values()).sort((a, b) => b.createdOn - a.createdOn);

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
