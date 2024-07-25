import express, {Request, Response} from "express"
import {StatusCodes} from "http-status-codes"

export const router = express.Router()

router.put("/user", async (req : Request, res : Response) => {
	

    // try {
    //     return res.status(StatusCodes.OK).json({ message: "Hello World!" })
    // } catch (error) {
    //     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({error})
    // }
})
