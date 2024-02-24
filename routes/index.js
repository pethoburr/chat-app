import express from 'express';
var router = express.Router();
import { log_in, logout, sign_up, userProfile } from "../controllers/userController.js";
import { allUsers } from "../database.js";
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'wattup pussy' });
});
router.post('/sign-up', sign_up);
router.post('/log-in', log_in);
router.post('/log-out', logout);
router.post('/send', function (req, res, next) {
    res.render('index', { title: 'send message route' });
});
router.get('/profile/:id', userProfile);
router.get('/users', allUsers);
export default router;
