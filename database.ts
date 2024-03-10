import mysql, { FieldPacket } from 'mysql2'
import { RowDataPacket } from 'mysql2';
import dotenv from 'dotenv';
dotenv.config()

export const pool = mysql.createPool({
    user: process.env.USER,
    host: process.env.HOST,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
}).promise();

export const allUsers = async () => {
    const result = await pool.query("SELECT * FROM user") as RowDataPacket[]
    return result;
}

export const matchUsername = async (username: string) => {
    const result: any[] = await pool.query("SELECT * FROM user WHERE username = ?",[username]);
    const unarrayed = result[0]
    const noarray = unarrayed[0];
    return noarray;
}

export const matchId = async (id: string) => {
    const result = await pool.query("SELECT * FROM user WHERE id = ?",[id]);
    return result;
}

export const register = async (first_name: string, last_name: string, username: string, password: string) => {
    const data = await pool.query(`INSERT INTO user (first_name, last_name, username, password) VALUES ('${first_name}', '${last_name}', '${username}', '${password}' ) `)
    console.log('data:' + JSON.stringify(data))
}

export const make_room = async (title: string) => {
    const data = await pool.query(`INSERT INTO room (title) VALUES ('${title}' ) `)
    console.log('data:' + JSON.stringify(data))
    return data;
}

export const user_rooms = async (id: string) => {
    const result = await pool.query("SELECT * FROM user_conversation WHERE user_id = ?",[id])
    console.log(`rooms: ${result}`)
    return result;
}

export const getRoom = async (roomName: string) => {
    const room = await pool.query('SELECT * FROM room WHERE title = ?', [roomName])
    console.log(`specific room: ${room}`)
    return room;
}

export const groupchat = async (userId: string, roomId: string) => {
    const newGroup = await pool.query(`INSERT INTO user_conversation (userId, roomId) VALUES ('${userId}', '${roomId}')`)
    console.log(`new group: ${newGroup}`)
    return newGroup;
}


interface MsgData {
    sender_id: string,
    receiver_id: string,
    content: string
}

export const updated_msg = async (msg: MsgData) => {
    const updatedMsg = await pool.query("UPDATE messages SET content = ? WHERE id = ?", [msg.content, msg.sender_id ])
    return updatedMsg;
}

export const deleted_msg = async (id: string) => {
    const deletedMsg = await pool.query("DELETE FROM messages WHERE id = ?", [id]);
    return deletedMsg;
}

export const save_room = async (roomName: string) => {
    const result = await pool.query('INSERT INTO room (title) VALUE (?)', [roomName]);
    console.log(`saved room: ${result}`);
    return result;
}

export const add_user_convo = async (userId: string, roomId: string) => {
    const result = await pool.query('INSERT INTO user_conversation (user_id, room_id) VALUES (?, ?)', [userId, roomId]);
    console.log(`room created result: ${result}`)
    return result;
}

export const room_name = async (roomId: string) => {
    const data = await pool.query<RowDataPacket[]>('SELECT * FROM room WHERE id = ?', [roomId])
    console.log(`roomanme: ${JSON.stringify(data[0])}`)
    return data[0];
}



// matchUsername('pethoburr');

// matchId(1);

// allUsers();