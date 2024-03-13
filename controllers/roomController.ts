import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { make_room, room_name, user_rooms } from '../database.js';
import { RowDataPacket } from 'mysql2';

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
        const roomNames: string[] = [];
        const userId = req.params.id;
        console.log(`userId: ${userId}`)
        const rooms = await user_rooms(userId)
        console.log(`all user rooms: ${JSON.stringify(rooms[0])}`)
        const arr: RowDataPacket[] = rooms[0] as RowDataPacket[]
        if (Array.isArray(arr)) {
                await Promise.all(arr.map(async (convo) => {
                        const name = await room_name(convo.room_id)
                        console.log(`name: ${JSON.stringify(name[0].title)}`)
                        roomNames.push(name[0].title)
                }))
                
        }
        console.log(`room names: ${roomNames}`)
        res.status(200).json({ roomNames })
})

