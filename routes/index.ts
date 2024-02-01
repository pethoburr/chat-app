import express, { Express, Request, Response } from "express";
var router = express.Router();

/* GET home page. */
router.get('/', function(req: Request , res: Response, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
