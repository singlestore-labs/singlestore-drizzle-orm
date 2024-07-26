import express, {Request, Response} from "express"
import {StatusCodes} from "http-status-codes"
import { connect } from "./db"
import { comment, post } from "./schema"

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
		console.error(e);
	}
})

router.get("/post", async (req : Request, res : Response) => {
	try {
		const posts = await db.query.post.findMany({
			orderBy: (post, { asc }) => [asc(post.createdOn)],
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

		const dfs = (u: number) => {
			const comment = allComments.get(u)
			if (!adjT.has(u)) {
				return comment
			}
			const replies = adjT.get(u).map((v: number) => dfs(v))
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

router.put("/comment", async (req : Request, res : Response) => {
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
})
