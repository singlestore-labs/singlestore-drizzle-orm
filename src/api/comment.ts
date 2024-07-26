import express, { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { connect } from "./db"
import { comment } from './schema';
import { match } from 'drizzle-orm/singlestore-core';

const commentRouter = express.Router();

const [_, db] = await connect()

commentRouter.put('/', async (req: Request, res: Response) => {
  try {
    await db.insert(comment).values({
      postId: req.body.postId,
      repliesToComment: req.body.repliesToCommentId,
      content: req.body.content
    });

    res.status(StatusCodes.OK).send();
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    console.error(e);
  }
});

commentRouter.get('/search', async (req: Request, res: Response) => {
  const searchResultsLimits = req.query.limit ? parseInt(req.query.limit as string) : 100;

  try {
    const search = req.query.search;

    const comments = await db.select().from(comment).where(match(comment, `content:${search}`)).limit(searchResultsLimits);

    res.status(StatusCodes.OK).json(comments);
  } catch (e) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
    console.error(e);
  }
});

export default commentRouter;
