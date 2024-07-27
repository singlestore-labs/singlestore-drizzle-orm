import express, {Request, Response} from "express"
import {StatusCodes} from "http-status-codes"
import { connect } from "./db"
import { comment, post } from "./schema"
import { asc } from "drizzle-orm"
import { match } from "drizzle-orm/singlestore-core"

export const router = express.Router()

const [_, db] = await connect()

router.put("/post", async (req : Request, res : Response) => {
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
})

router.get("/post", async (_, res : Response) => {
	try {
		const posts = await db.query.post.findMany({
			orderBy: asc(post.createdOn),
			with: {
				comments: true,
			},
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
				const u = comment.id
				const v = comment.repliesToComment
				if (v !== null) {
					if (!adjT.has(v)) {
						adjT.set(v, [])
					}
					adjT.get(v).push(u)
				}
			}
		}

		for (const post of posts) {
			post.comments = post.comments.filter(comment => comment.repliesToComment === null)
		}

		const dfs = (u: string) => {
			const comment = allComments.get(u)
			if (!adjT.has(u)) {
				return comment
			}
			const replies = adjT.get(u).map((v: string) => dfs(v))
			replies.sort((a: any, b: any) => a.createdOn - b.createdOn)
			comment.comments = replies
			return comment
		}

		for (const post of posts) {
			post.comments.forEach(comment => dfs(comment.id))
		}

		const newPosts = posts.map(post => {
			const newPost = {
				...post,
				comments: post.comments.map(comment => {
					const newComment = allComments.get(comment.id)
					return newComment
				})
			}
			newPost.comments.sort((a, b) => a.createdOn - b.createdOn)
			return newPost
		})

		res.status(StatusCodes.OK).json(newPosts);
	} catch (e) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
		console.error(e);
	}
})

router.get("/post/search", async (req : Request, res : Response) => {
	const searchResultsLimits = req.query.limit ? parseInt(req.query.limit as string) : 100;

	try {
		const search = req.query.search as string

		const posts = await db.select().from(post).where(match(post, `content:${search}`)).limit(searchResultsLimits)

		res.status(StatusCodes.OK).json(posts);
	} catch (e) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
		console.error(e);
	}
})

router.put("/comment", async (req : Request, res : Response) => {
	try {
		await db.insert(comment).values({
			id: generateRandomID(16),
			postId: req.body.postId,
			repliesToComment: req.body.repliesToCommentId,
			content: req.body.content
		});

		res.status(StatusCodes.OK).send();
	} catch (e) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
		console.error(e);
	}
})

router.get("/comment/search", async (req : Request, res : Response) => {
	const searchResultsLimits = req.query.limit ? parseInt(req.query.limit as string) : 100;

	try {
		const search = req.query.search

		const comments = await db.select().from(comment).where(match(comment, `content:${search}`)).limit(searchResultsLimits)

		res.status(StatusCodes.OK).json(comments);
	} catch (e) {
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).send();
		console.error(e);
	}
})

function generateRandomID(length: number) {
	// generate random string with a certain length, containing only alphanumeric chars
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

	let res = "";
	for (let i = 0; i < length; i++) {
		res += charset.charAt(Math.floor(Math.random() * charset.length));
	}

	return res;
}
