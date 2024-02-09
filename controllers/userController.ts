import { pool } from '../database.js';
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import { register } from '../database.js';
import { matchUsername } from '../database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import passport from 'passport';

export const sign_up = 
[   
    body("first_name", "Must enter name")
            .trim()
            .isLength({ min: 1 })
            .escape(),
        body("last_name", "Enter last name")
            .trim()
            .isLength({ min: 1 })
            .escape(),
        body("username", "Username required")
            .trim()
            .isLength({ min: 1 })
            .escape(),
        body("password", "enter password")
            .trim()
            .isLength({ min: 1 })
            .escape(),
        asyncHandler(async (req: Request, res: Response, next) => {
            console.log('req:' + JSON.stringify(req.body))
            bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
                if (err) {
                    console.log('ye here') 
                    return next(err)
                }
                const errors = validationResult(req);
                const user = await register(req.body.first_name, req.body.last_name, req.body.username, hashedPassword)
                if (!errors.isEmpty()) {
                    console.log('uhm here')
                    res.status(400).json(errors.array());
                    return;
                } else {
                    const checker = await matchUsername(req.body.username);
                    if (checker) {
                        res.status(500).json({ message: 'Username already in use'});
                        return;
                    }
                    res.status(200).json(user)
                }
            })
        })
]

interface User {
    _id: string,
    first_name: string,
    last_name: string,
    username: string,
    password: string
}

export const login = asyncHandler(async (req: Request, res: Response, next) => {
        passport.authenticate('local', function (err: any, user: User, info: User) {
          if (err) { 
            return next(err)
          }
          const userId = user._id.toString() 
          const token = jwt.sign({ id: userId}, process.env.SECRET as string, { expiresIn: 60 * 60 * 24 * 30})
          return res
            .cookie('token', token, { httpOnly: true, secure: false, path: '/', sameSite: 'lax'})
            .status(200)
            .json({ user, token })
        })(req, res, next)
      })

export const logout = asyncHandler(async (req, res, next) => {
    res.send('logout not implemented');
})