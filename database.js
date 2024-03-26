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
    const data = yield pool.query(`INSERT INTO user (first_name, last_name, username, password) VALUES ('${first_name}', '${last_name}', '${username}', '${password}' ) `);
    console.log('data:' + JSON.stringify(data));
});
export const make_room = (title) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield pool.query(`INSERT INTO room (title) VALUES ('${title}' ) `);
    console.log('data:' + JSON.stringify(data));
    return data;
});
export const user_rooms = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query("SELECT * FROM user_conversation WHERE user_id = ?", [id]);
    console.log(`rooms: ${JSON.stringify(result[0])}`);
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
    console.log(`specific room: ${room}`);
    return room;
});
export const groupchat = (userId, roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const newGroup = yield pool.query(`INSERT INTO user_conversation (userId, roomId) VALUES ('${userId}', '${roomId}')`);
    console.log(`new group: ${newGroup}`);
    return newGroup;
});
export const save_msg = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const saved_msg = yield pool.query('INSERT INTO messages (content, room_id) VALUES (?, ?)', [msg.content, msg.room_id]);
    const checker = yield pool.query('SELECT * FROM user_conversation WHERE room_id = ?', [msg.room_id]);
    if (checker[0][0].length > 0) {
        return;
    }
    else {
        const saved_convo = yield pool.query('INSERT INTO user_conversation (user_id, room_id) VALUES (?, ?)', [msg.user_id, msg.room_id]);
        return { saved_msg, saved_convo };
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
export const save_room = (roomName) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query('INSERT INTO room (title) VALUE (?)', [roomName]);
    console.log(`saved room: ${result}`);
    return result;
});
export const add_user_convo = (userId, roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query('INSERT INTO user_conversation (user_id, room_id) VALUES (?, ?)', [userId, roomId]);
    console.log(`room created result: ${result}`);
    return result;
});
export const room_name = (room) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield pool.query('SELECT * FROM room WHERE id = ?', [room.room_id]);
    console.log(`roomanme: ${JSON.stringify(data[0])}`);
    return data[0];
});
const getId = (name) => __awaiter(void 0, void 0, void 0, function* () {
    const id = yield pool.query(`SELECT id FROM user WHERE username = ?`, [name]);
    console.log(`name to id: ${JSON.stringify(id)}`);
    return id[0][0].id;
});
export const add_group = (ppl, roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const room_id = parseInt(roomId);
    const allIdz = [];
    yield Promise.all(ppl.map((name) => __awaiter(void 0, void 0, void 0, function* () {
        const id = yield getId(name);
        allIdz.push(id);
    })));
    console.log(`all ids: ${allIdz}`);
    yield Promise.all(allIdz.map((id) => __awaiter(void 0, void 0, void 0, function* () {
        const convo = yield pool.query('INSERT INTO user_conversation (user_id, room_id) VALUES (?, ?)', [id, room_id]);
        console.log(`convo: ${JSON.stringify(convo)}`);
    })));
});
export const checkId = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield pool.query('SELECT * FROM room WHERE id = ?', [id]);
    console.log(`is it thurr: ${JSON.stringify(result)}`);
    if (result[0][0].length) {
        return result[0][0];
    }
    else {
        return null;
    }
});
export const get_messages = (roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const msgs = yield pool.query('SELECT * FROM messages WHERE room_id = ?', [roomId]);
    console.log(`goteee ${JSON.stringify(msgs[0])}`);
    return msgs[0];
});
