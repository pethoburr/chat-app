import { pool } from '/Users/mpaha/chat-app/database.js';
import asyncHandler from 'express-async-handler';

export const login = asyncHandler(async (req, res, next) => {
    res.send('login not implemented');
})

export const logout = asyncHandler(async (req, res, next) => {
    res.send('logout not implemented');
})