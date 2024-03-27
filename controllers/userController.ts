import { pool } from '../database.js';
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import { register } from '../database.js';
import { matchUsername, matchId, allUsers } from '../database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { match } from 'assert';

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
        asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
            console.log('req:' + JSON.stringify(req.body))
            bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
                if (err) {
                    return next(err)
                }
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                    res.status(400).json(errors.array());
                    return;
                } else {
                    const checker = await matchUsername(req.body.username);
                    if (checker) {
                        res.status(500).json({ message: 'Username already in use'});
                        return;
                    }
                    await register(req.body.first_name, req.body.last_name, req.body.username, hashedPassword)
                    res.status(200).json({ message: 'success'})
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

export const log_in = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        console.log(`server request: ${JSON.stringify(req.body)}`)
        passport.authenticate('local', function (err: any, user: User, info: User) {
          if (err) { 
            return next(err)
          }
          if (!user) {
            console.log(`info: ${JSON.stringify(info)}`);
            return res.status(400).json(info);
          }
          const userId = user._id.toString() 
          const token = jwt.sign({ id: userId}, process.env.SECRET as string, { expiresIn: 60 * 60 * 24 * 30})
        return res.status(200).json({ user, token })
        })(req, res, next)
})

export const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['cookie'];
    if (authHeader) {
        res.clearCookie('token');
        res.end();
    }
})

export const userProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const user = matchId(userId);
    console.log(user);
})

export const getChats = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.userId
    console.log(`id: ${id}`)
})

export const all_users = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await allUsers()
        res.json({ users })
    } catch (err) {
        next(err)
    }
})


