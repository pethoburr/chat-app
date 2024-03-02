var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import { make_room, user_rooms } from '../database.js';
export const create_room = [
    body("title", "title required")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            console.log('uhm here');
            res.status(400).json(errors.array());
            return;
        }
        else {
            console.log(`req body: ${req.body}`);
            const newRoom = yield make_room(req.body.title);
            res.status(200).json({ newRoom });
        }
    }))
];
export const get_rooms = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    console.log(`userId: ${userId}`);
    const rooms = yield user_rooms(userId);
    console.log(`all user rooms: ${rooms}`);
    if (!rooms.length) {
        res.json({ message: 'You have no conversations' });
    }
    else {
        res.status(200).json({ rooms });
    }
}));
