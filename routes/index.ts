import { Request, Response } from "express";
import express from 'express';
var router = express.Router();
import { getChats, log_in, logout, sign_up, userProfile } from "../controllers/userController.js";
import { create_room, get_rooms, recent_room } from "../controllers/roomController.js";
import { all_users } from "../controllers/userController.js";
import { delete_msg, get_message, update_msg } from "../controllers/messagesController.js";
import passport from "passport";

router.post('/sign-up', sign_up);

router.post('/log-in', log_in);

router.post('/log-out', passport.authenticate('jwt', {session: false}), logout);

router.get('/profile/:id', passport.authenticate('jwt', {session: false}), userProfile);

router.get('/users', passport.authenticate('jwt', {session: false}), all_users)

router.get('/user/:id/chats', passport.authenticate('jwt', {session: false}), getChats)

router.post('/create-room', passport.authenticate('jwt', {session: false}), create_room)

router.get('/rooms/:id', passport.authenticate('jwt', {session: false}), get_rooms)

router.get('/get-messages/:roomId', passport.authenticate('jwt', {session: false}), get_message)

router.post('/update-message', passport.authenticate('jwt', {session: false}), update_msg)

router.post('/delete-message', passport.authenticate('jwt', {session: false}), delete_msg)

router.get('/last-room', passport.authenticate('jwt', {session: false}), recent_room)

export default router;