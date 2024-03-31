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
    console.log(`rooms: ${JSON.stringify(result[0])}`)
    if (!Array.isArray(result[0])) {
        throw new Error("unexpected result format from db query")
    }
    const rooms: Room[] = result[0].map((row: any) => ({
        id: row.id,
        user_id: row.user_id,
        room_id: row.room_id
    }));
    return rooms;
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
    user_id: number,
    content: string,
    room_id: number
}

export const save_msg = async(msg: MsgData, ppl: number[]) => {
    const saved_msg = await pool.query('INSERT INTO messages (content, room_id) VALUES (?, ?)', [msg.content, msg.room_id])
    const checker = await pool.query<RowDataPacket[]>('SELECT * FROM user_conversation WHERE room_id = ?', [msg.room_id]);
    await Promise.all(
        ppl.map(async (id: number) => {
            const checker = await pool.query<RowDataPacket[]>('SELECT * FROM user_conversation WHERE user_id = ?', [id])
            console.log('checker:' + JSON.stringify(checker))
        })
    )
    if (checker[0][0].length > 0) {
        return;
    } else {

        await Promise.all(
                ppl.map(async (id: number) => {
                const saved_convo = await pool.query('INSERT INTO user_conversation (user_id, room_id) VALUES (?, ?)', [msg.user_id, msg.room_id])
                console.log(`saved convo: ${JSON.stringify(saved_convo)}`)
            })
        )
            return saved_msg;
    }
}

export const updated_msg = async (msg: MsgData) => {
    const updatedMsg = await pool.query("UPDATE messages SET content = ? WHERE id = ?", [msg.content])
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

interface Room {
    id: number,
    user_id: number,
    room_id: number
}

export const room_name = async (room: Room) => {
    const data = await pool.query<RowDataPacket[]>('SELECT * FROM room WHERE id = ?', [room.room_id])
    console.log(`roomanme: ${JSON.stringify(data[0])}`)
    return data[0];
}

const getId = async(name: string) => {
    const id = await pool.query<RowDataPacket[]>(`SELECT id FROM user WHERE username = ?`, [name])
    console.log(`name to id: ${JSON.stringify(id)}`)
    return id[0][0].id;
}

interface Peeps {
    id: number,
    name: string
}

export const check_room = async (ppl: Peeps[]) => {
    await Promise.all(ppl.map(async (guy: Peeps) => {
        const convo = await pool.query<RowDataPacket[]>('SELECT * FROM user_conversation WHERE room_id = ?', [guy.id])
        console.log(`user convo results: ${JSON.stringify(convo[0][0])}`)
    }))
    
}

export const add_group = async (ppl: Peeps[], roomId: string) => {
    const room_id = parseInt(roomId)
    await Promise.all(ppl.map(async (guy: Peeps) => {
        const convo = await pool.query<RowDataPacket[]>('INSERT INTO user_conversation (user_id, room_id) VALUES (?, ?)',[guy.id, room_id])
        console.log(`convo: ${JSON.stringify(convo)}`)
    }))
}

export const checkId = async (id: number) => {
    const result = await pool.query<RowDataPacket[]>('SELECT * FROM room WHERE id = ?', [id])
    console.log(`is it thurr: ${JSON.stringify(result)}`)
    if (result[0][0].length) {
        console.log(`result: ${result[0][0]}`)
        return result[0][0];
    } else {
        console.log(`result: ${JSON.stringify(result)}`);
    }
}

export const get_messages = async (roomId: string) => {
    const msgs = await pool.query('SELECT * FROM messages WHERE room_id = ?', [roomId])
    console.log(`goteee ${JSON.stringify(msgs[0])}`)
    return msgs[0];
}