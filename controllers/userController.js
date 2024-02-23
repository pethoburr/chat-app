var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import { register } from '../database.js';
import { matchUsername, matchId } from '../database.js';
import bcrypt from 'bcryptjs';
import passport from 'passport';
export const sign_up = [
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
    asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('req:' + JSON.stringify(req.body));
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
            if (err) {
                console.log('ye here');
                return next(err);
            }
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                console.log('uhm here');
                res.status(400).json(errors.array());
                return;
            }
            else {
                const checker = yield matchUsername(req.body.username);
                if (checker) {
                    res.status(500).json({ message: 'Username already in use' });
                    return;
                }
                yield register(req.body.first_name, req.body.last_name, req.body.username, hashedPassword);
                res.status(200).json({ message: 'success' });
            }
        }));
    }))
];
export const log_in = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`server request: ${JSON.stringify(req.body)}`);
    passport.authenticate('local', function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            console.log(`info: ${JSON.stringify(info)}`);
            return res.status(400).json(info);
        }
        //   const userId = user._id.toString() 
        //   const token = jwt.sign({ id: userId}, process.env.SECRET as string, { expiresIn: 60 * 60 * 24 * 30})
        return res.status(200).json({ user });
    })(req, res, next);
}));
export const logout = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.headers['cookie'];
    if (authHeader) {
        res.clearCookie('token');
        res.end();
    }
}));
export const userProfile = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    const user = matchId(userId);
    console.log(user);
}));
