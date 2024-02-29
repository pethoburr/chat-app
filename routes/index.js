import express from 'express';
var router = express.Router();
import { getChats, log_in, logout, sign_up, userProfile } from "../controllers/userController.js";
import { create_room, get_rooms } from "../controllers/roomController.js";
import { allUsers } from "../database.js";
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'wattup pussy' });
});
router.post('/sign-up', sign_up);
router.post('/log-in', log_in);
router.post('/log-out', logout);
router.get('/profile/:id', userProfile);
router.get('/users', allUsers);
router.get('/user/:id/chats', getChats);
router.post('/create-room', create_room);
router.get('/rooms', get_rooms);
export default router;
