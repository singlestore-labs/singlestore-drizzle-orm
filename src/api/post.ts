import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { db } from "./db"
import { post } from './schema';
import { desc } from 'drizzle-orm';
import { match } from 'drizzle-orm/singlestore-core';
import { generateRandomID } from './common';

const postRouter = express.Router();

postRouter.put('/', async (req: Request, res: Response) => {
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

postRouter.get('/', async (_, res: Response) => {
  try {
    // @ts-ignore
    const posts = await db.query.post.findMany({
      orderBy: desc(post.createdOn),
      with: {
        comments: true,
      },
      limit: 20
    });

    const allComments = new Map();
    for (const post of posts) {
      for (const comment of post.comments) {
        const commentNew = {
          ...comment,
          comments: []
        }
        allComments.set(comment.id, commentNew)
      }
    }

    const adjT = new Map();
    for (const post of posts) {
      for (const comment of post.comments) {
        const u = comment.id;
        const v = comment.repliesToComment;
        if (v !== "") {
          if (!adjT.has(v)) {
            adjT.set(v, []);
          }
          adjT.get(v).push(u);
        }
      }
    }

    for (const post of posts) {
      // @ts-ignore
      post.comments = post.comments.filter(comment => comment.repliesToComment === "");
    }

    const dfs = (u: number) => {
      if (!u) {
        return;
      }

      const comment = allComments.get(u);
      if (!adjT.has(u)) {
        return comment;
      }

      const replies = adjT.get(u).map((v: number) => dfs(v));
      replies.sort((a: any, b: any) => a.createdOn - b.createdOn);
      comment.comments = replies;
      return comment;
    };

    for (const post of posts) {
      // @ts-ignore
      post.comments.forEach(comment => dfs(comment.id));
    }

    // @ts-ignore
    const newPosts = posts.map(post => {
      const newPost = {
        ...post,
        // @ts-ignore
        comments: post.comments.map(comment => {
          const newComment = allComments.get(comment.id);
          return newComment;
        })
      }
      // @ts-ignore
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
