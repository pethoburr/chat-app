import createError from 'http-errors';
import express from 'express';
import { Express, Request, Response } from 'express';
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
dotenv.config()
import { Server, Socket } from 'socket.io';

const app: Express = express();

const io = new Server(5174, {
  cors: {
    origin: ['https://localhost:5173']
  }
});

io.on('connection', (socket: Socket) => {
    console.log(socket.id);
    socket.on('send-message', (message: string, room: string) => {
      console.log(message)
      if (room === '') {
        socket.broadcast.emit('receive-mssage', message)
      } else {
        socket.to(room).emit('receive-message', message)
      }
    })
    socket.on('join-room', (room: string) => {
      socket.join(room);
    })
});

passport.use(
  new LocalStrategy(async (username: string, password: string, done) => {
    try {
      const user = await matchUsername(username);
      console.log('user:' + JSON.stringify(user))
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
      // passwords do not match!
      return done(null, false, { message: "Incorrect password" })
      }
      console.log('idk man shit worked')
      return done(null, user);
    } catch(err) {
      return done(err);
    }
  })
);

const opt = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET as string
}

passport.use(new JWTStrategy(opt, async function (jwtPayload, done) {
  try {
    const user = await matchId(jwtPayload.id);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}))

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
app.use(function(req: Request, res: Response, next) {
  next(createError(404));
});

// error handler
app.use(function(err: any, req: Request, res: Response, next: any) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

export default app;
