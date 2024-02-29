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
import { update_msg } from '../database.js';
export const update_msg_post = [
    body("content", "msg content required")
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
            const msg = {
                sender_id: req.body.senderId,
                receiver_id: req.body.receiver_id,
                content: req.body.content
            };
            console.log(`req body: ${req.body}`);
            const newRoom = yield update_msg(msg);
            res.status(200).json({ newRoom });
        }
    }))
];
