import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { updated_msg, deleted_msg } from '../database.js';

export const update_msg = [
    body("content", "msg content required")
            .trim()
            .isLength({ min: 1 })
            .escape(),
    asyncHandler(async (req: Request, res: Response, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            console.log('uhm here')
            res.status(400).json(errors.array());
            return;
    } else {
            const msg = {
                sender_id: req.body.senderId,
                receiver_id: req.body.receiver_id,
                content: req.body.content
            }
            console.log(`req body: ${req.body}`)
            const newRoom = await updated_msg(msg)
            res.status(200).json({ newRoom })
    }
})]

export const delete_msg = asyncHandler(async (req: Request, res: Response, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.status(400).json(errors.array());
        return;
    } else {
        const deleted = await deleted_msg(req.params.id);
        res.status(200).json({ deleted })
    }
})