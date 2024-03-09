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
    const result = yield pool.query("SELECT * FROM user_conversation WHERE id = ?", [id]);
    console.log(`rooms: ${result}`);
    return result;
});
export const groupchat = (userId, roomId) => __awaiter(void 0, void 0, void 0, function* () {
    const newGroup = yield pool.query(`INSERT INTO user_conversation (userId, roomId) VALUES ('${userId}', '${roomId}')`);
    console.log(`new group: ${newGroup}`);
    return newGroup;
});
export const updated_msg = (msg) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedMsg = yield pool.query("UPDATE messages SET content = ? WHERE id = ?", [msg.content, msg.sender_id]);
    return updatedMsg;
});
export const deleted_msg = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedMsg = yield pool.query("DELETE FROM messages WHERE id = ?", [id]);
    return deletedMsg;
});
// matchUsername('pethoburr');
// matchId(1);
// allUsers();
