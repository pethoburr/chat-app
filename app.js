var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import indexRouter from './routes/index.js';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import passportJWT from 'passport-jwt';
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
import dotenv from 'dotenv';
import { matchId, matchUsername } from './database.js';
dotenv.config();
import { Server } from 'socket.io';
const app = express();
const io = new Server(3000, {
    cors: {
        origin: ['https://localhost:5173']
    }
});
io.on('connection', (socket) => {
    console.log(socket.id);
    socket.on('send-message', (message, room) => {
        console.log(message);
        if (room === '') {
            socket.broadcast.emit('receive-mssage', message);
        }
        else {
            socket.to(room).emit('receive-message', message);
        }
    });
    socket.on('join-room', (room) => {
        socket.join(room);
    });
});
passport.use(new LocalStrategy((username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield matchUsername(username);
        console.log('user:' + user);
        if (!user) {
            return done(null, false, { message: "Incorrect username" });
        }
        const match = yield bcrypt.compare(password, user.password);
        if (!match) {
            // passwords do not match!
            return done(null, false, { message: "Incorrect password" });
        }
        return done(null, user);
    }
    catch (err) {
        return done(err);
    }
})));
const opt = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET
};
passport.use(new JWTStrategy(opt, function (jwtPayload, done) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield matchId(jwtPayload.id);
            return done(null, user);
        }
        catch (err) {
            return done(err);
        }
    });
}));
// view engine setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(cors());
app.use(cookieParser());
app.use(passport.initialize());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
export default app;
