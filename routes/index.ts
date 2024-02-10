import { Express, Request, Response } from "express";
import express from 'express';
var router = express.Router();
import { login, logout, sign_up, userProfile } from "../controllers/userController.js";

/* GET home page. */
router.get('/', function(req: Request , res: Response, next) {
  res.render('index', { title: 'wattup pussy' });
});

router.post('/sign-up', sign_up);

router.post('/log-in', login);

router.post('/log-out', logout);

router.post('/send', function(req: Request , res: Response, next) {
  res.render('index', { title: 'send message route' });
});

router.get('/profile/:id', userProfile);

export default router;