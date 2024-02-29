import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { make_room, user_rooms } from '../database.js';

export const create_room = [
    body("title", "title required")
            .trim()
            .isLength({ min: 1 })
            .escape(),
    asyncHandler(async (req: Request, res: Response, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
                console.log('uhm here')
                res.status(400).json(errors.array());
                return;
        } else {
                console.log(`req body: ${req.body}`)
                const newRoom = make_room(req.body.title)
                res.status(200).json({ newRoom })
        }
})]

export const get_rooms = asyncHandler(async (req: Request, res: Response, next) => {
        const userId = req.params.id;
        const rooms = user_rooms(userId)
        console.log(`all user rooms: ${rooms}`)
        res.status(200).json({ rooms })
})