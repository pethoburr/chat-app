import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { last_room, make_room, room_name, user_rooms } from '../database.js';
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

interface Room {
        id: number,
        title: string,
}

export const get_rooms = asyncHandler(async (req: Request, res: Response, next) => {
        const room: Room[] = [];
        const userId = req.params.id;
        const rooms = await user_rooms(userId)
        console.log(`rooms yabisshh: ${JSON.stringify(rooms)}`)
        if (Array.isArray(rooms)) {
                await Promise.all(rooms.map(async (convo) => {
                        const name = await room_name(convo)
                        room.push({ id: name[0].id, title: name[0].title})
                }))
                
        }
        res.status(200).json({ room })
})

export const recent_room = asyncHandler(async (req: Request, res: Response, next) => {
        const roomId = await last_room();
        res.status(200).json(roomId)
})
