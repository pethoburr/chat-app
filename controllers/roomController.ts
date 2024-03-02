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
                const newRoom = await make_room(req.body.title)
                res.status(200).json({ newRoom })
        }
})]

export const get_rooms = asyncHandler(async (req: Request, res: Response, next) => {
        const userId = req.params.id;
        console.log(`userId: ${userId}`)
        const rooms = await user_rooms(userId)
        console.log(`all user rooms: ${rooms}`)
        if (!rooms.length) {
                res.json({ message: 'You have no conversations'});
        } else {
                res.status(200).json({ rooms })
        }
})