var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();
export const pool = mysql.createPool({
    user: process.env.USER,
    host: process.env.HOST,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
}).promise();
export const allUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query("SELECT * FROM user");
    return result;
});
export const getUsername = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query('SELECT * FROM user WHERE id = ?', [id]);
    console.log(`get username ${JSON.stringify(result)}`);
    return result[0];
});
export const matchUsername = (username) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query("SELECT * FROM user WHERE username = ?", [username]);
    const unarrayed = result[0];
    const noarray = unarrayed[0];
    return noarray;
});
export const matchId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query("SELECT * FROM user WHERE id = ?", [id]);
    return result;
});
export const register = (first_name, last_name, username, password) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield pool.query(`INSERT INTO user (first_name, last_name, username, password) VALUES (?, ?, ?, ?)`, [first_name, last_name, username, password]);
});
export const make_room = (title) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield pool.query(`INSERT INTO room (title) VALUES (?)`, [title]);
    return data;
});
export const user_rooms = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query("SELECT * FROM user_conversation WHERE user_id = ?", [id]);
    if (!Array.isArray(result[0])) {
        throw new Error("unexpected result format from db query");
    }
    const rooms = result[0].map((row) => ({
        id: row.id,
        user_id: row.user_id,
        room_id: row.room_id
    }));
    return rooms;
});
export const getRoom = (roomName) => __awaiter(void 0, void 0, void 0, function* () {
    const room = yield pool.query('SELECT * FROM room WHERE title = ?', [roomName]);
    return room;
});
export const groupchat = (userId, roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const newGroup = yield pool.query(`INSERT INTO user_conversation (userId, roomId) VALUES (?, ?)`, [userId, roomId]);
    return newGroup;
});
export const save_msg = (msg, ppl) => __awaiter(void 0, void 0, void 0, function* () {
    const saved_msg = yield pool.query('INSERT INTO messages (content, room_id) VALUES (?, ?)', [msg.content, msg.room_id]);
    const checker = yield pool.query('SELECT * FROM user_conversation WHERE room_id = ?', [msg.room_id]);
    console.log(`ppl: ${ppl}`);
    if (!ppl.length) {
        return;
    }
    yield Promise.all(ppl.map((id) => __awaiter(void 0, void 0, void 0, function* () {
        console.log('hereyoo id:' + JSON.stringify(id));
        yield pool.query('SELECT * FROM user_conversation WHERE user_id = ?', [id.id]);
    })));
    if (checker[0].length > 0) {
        return;
    }
    else {
        yield Promise.all(ppl.map((id) => __awaiter(void 0, void 0, void 0, function* () {
            console.log('mapping');
            yield pool.query('INSERT INTO user_conversation (user_id, room_id) VALUES (?, ?)', [id.id, msg.room_id]);
        })));
        return saved_msg;
    }
});
export const updated_msg = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedMsg = yield pool.query("UPDATE messages SET content = ? WHERE id = ?", [msg.content]);
    return updatedMsg;
});
export const deleted_msg = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedMsg = yield pool.query("DELETE FROM messages WHERE id = ?", [id]);
    return deletedMsg;
});
export const leave_group = (userId, roomId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(userId, roomId);
    const deleted = yield pool.query('DELETE FROM user_conversation WHERE user_id = ? AND room_id = ?', [userId, roomId]);
    console.log('left group' + JSON.stringify(deleted));
});
export const join_group = (userId, roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query('INSERT INTO user_conversation (user_id, room_id)', [userId, roomId]);
    console.log(`user and room ids ${JSON.stringify(result)}`);
    return result[0];
});
export const save_room = (roomName) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query('INSERT INTO room (title) VALUE (?)', [roomName]);
    const last = yield pool.query('SELECT LAST_INSERT_ID() as id');
    console.log(`saved room result: ${JSON.stringify(last)}`);
    return result[0];
});
export const add_user_convo = (userId, roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query('INSERT INTO user_conversation (user_id, room_id) VALUES (?, ?)', [userId, roomId]);
    return result;
});
export const room_name = (room) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield pool.query('SELECT * FROM room WHERE id = ?', [room.room_id]);
    return data[0];
});
export const getId = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const id = yield pool.query(`SELECT id FROM user WHERE username = ?`, [name]);
    return id[0][0].id;
});
export const get_convos = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query('SELECT * FROM user_conversation WHERE room_id = ?', [roomId]);
    console.log(`room id to convos: ${JSON.stringify(result[0])}`);
    return result[0];
});
export const check_room = (ppl) => __awaiter(void 0, void 0, void 0, function* () {
    const convos = [];
    yield Promise.all(ppl.map((guy) => __awaiter(void 0, void 0, void 0, function* () {
        const convo = yield pool.query('SELECT * FROM user_conversation WHERE room_id = ?', [guy.id]);
        convos.push(convo);
    })));
    return convos;
});
export const match_room = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`ROOM ID: ${roomId}`);
    const room = yield pool.query(`SELECT * FROM room WHERE id = ?`, [roomId]);
    console.log(`matched room: ${JSON.stringify(room[0])}`);
    if (room[0].length) {
        console.log('truey');
        return true;
    }
    else {
        console.log('nah nah nah');
        return false;
    }
});
export const add_group = (ppl, roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const room_id = parseInt(roomId);
    yield Promise.all(ppl.map((guy) => __awaiter(void 0, void 0, void 0, function* () {
        const convo = yield pool.query('INSERT INTO user_conversation (user_id, room_id) VALUES (?, ?)', [guy.id, room_id]);
        console.log(`convo: ${JSON.stringify(convo)}`);
    })));
});
export const checkId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query('SELECT * FROM room WHERE id = ?', [id]);
    console.log(`is it thurr: ${JSON.stringify(result)}`);
    if (result[0][0].length) {
        console.log(`result: ${result[0][0]}`);
        return result[0][0];
    }
    else {
        console.log(`result: ${JSON.stringify(result)}`);
    }
});
export const get_messages = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const msgs = yield pool.query('SELECT * FROM messages WHERE room_id = ?', [roomId]);
    console.log(`goteee: ${JSON.stringify(msgs[0])}`);
    return msgs[0];
});
export const last_room = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query('SELECT * FROM room ORDER BY id DESC LIMIT 1');
    console.log(`last room: ${JSON.stringify(result[0][0].id)}`);
    return result[0][0].id;
});
