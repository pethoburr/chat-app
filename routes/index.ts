import { Express, Request, Response } from "express";
import express from 'express';
var router = express.Router();

/* GET home page. */
router.get('/', function(req: Request , res: Response, next) {
  res.render('index', { title: 'wattup pussy' });
});

router.post('/sign-up', function(req: Request , res: Response, next) {
  res.render('index', { title: 'signup route' });
});

router.post('/log-in', function(req: Request , res: Response, next) {
  res.render('index', { title: 'login route' });
});

router.post('/log-out', function(req: Request , res: Response, next) {
  res.render('index', { title: 'wattup pussy' });
});

router.post('/send', function(req: Request , res: Response, next) {
  res.render('index', { title: 'send message route' });
});

router.get('/profile/:id', function(req: Request , res: Response, next) {
  res.render('index', { title: 'user profile' });
});

export default router;