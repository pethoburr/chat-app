import { Express, Request, Response } from "express";
import express from 'express';
var router = express.Router();

/* GET home page. */
router.get('/', function(req: Request , res: Response, next) {
  res.render('index', { title: 'wattup pussy' });
});

export default router;