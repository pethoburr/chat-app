import { Request, Response } from "express";
import express from 'express';
var router = express.Router();
import { getChats, log_in, logout, sign_up, userProfile } from "../controllers/userController.js";
import { create_room, get_rooms, recent_room } from "../controllers/roomController.js";
import { all_users } from "../controllers/userController.js";
import { delete_msg, get_message, update_msg } from "../controllers/messagesController.js";

/* GET home page. */
router.get('/', function(req: Request , res: Response, next) {
  res.render('index', { title: 'wattup pussy' });
});

router.post('/sign-up', sign_up);

router.post('/log-in', log_in);

router.post('/log-out', logout);

router.get('/profile/:id', userProfile);

router.get('/users', all_users)

router.get('/user/:id/chats', getChats)

router.post('/create-room', create_room)

router.get('/rooms/:id', get_rooms)

router.get('/get-messages/:roomId', get_message)

router.post('/update-message', update_msg)

router.post('/delete-message', delete_msg)

router.get('/last-room', recent_room)

export default router;