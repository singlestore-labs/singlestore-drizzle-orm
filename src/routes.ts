import express, {Request, Response} from "express"
import {StatusCodes} from "http-status-codes"
import { connect } from "./db"
import { post } from "./schema"

export const router = express.Router()

const [connection, db] = await connect()

router.put("/post", async (req : Request, res : Response) => {
	try {
		await db.insert(post).values({
			content: req.body.content
		}).execute();

		res.status(StatusCodes.OK).send();
	} catch (e) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
	}
})

router.get("/post", async (req : Request, res : Response) => {
	try {
		const posts = await db.select().from(post).execute();

		res.status(StatusCodes.OK).json(posts);
	} catch (e) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
	}
})
