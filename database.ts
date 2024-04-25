import mysql from 'mysql2'
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
    const data = await pool.query(`INSERT INTO user (first_name, last_name, username, password) VALUES (?, ?, ?, ?)`, [first_name, last_name, username, password])
}

export const make_room = async (title: string) => {
    const data = await pool.query(`INSERT INTO room (title) VALUES (?)`, [title])
    return data;
}

export const user_rooms = async (id: string) => {
    const result = await pool.query("SELECT * FROM user_conversation WHERE user_id = ?",[id])
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
    return room;
}

export const groupchat = async (userId: string, roomId: string) => {
    const newGroup = await pool.query(`INSERT INTO user_conversation (userId, roomId) VALUES (?, ?)`, [userId, roomId])
    return newGroup;
}


interface MsgData {
    user_id: number,
    content: string,
    room_id: number
}

interface Peeps {
    id: number,
    name: string
}

export const save_msg = async(msg: MsgData, ppl: Peeps[]) => {
    const saved_msg = await pool.query('INSERT INTO messages (content, room_id) VALUES (?, ?)', [msg.content, msg.room_id])
    const checker = await pool.query<RowDataPacket[]>('SELECT * FROM user_conversation WHERE room_id = ?', [msg.room_id]);
    console.log(`ppl: ${ppl}`)
    if (!ppl.length) {
        return;
    }
    await Promise.all(
        ppl.map(async (id: Peeps) => {
            console.log('hereyoo id:' + JSON.stringify(id))
            await pool.query<RowDataPacket[]>('SELECT * FROM user_conversation WHERE user_id = ?', [id.id])
        })
    )
    if (checker[0].length > 0) {
        return;
    } else {
        await Promise.all(
                ppl.map(async (id: Peeps) => {
                console.log('mapping')
                await pool.query('INSERT INTO user_conversation (user_id, room_id) VALUES (?, ?)', [id.id, msg.room_id])
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
    console.log(`saved room result: ${JSON.stringify(result)}`)
    return result;
}

export const add_user_convo = async (userId: string, roomId: string) => {
    const result = await pool.query('INSERT INTO user_conversation (user_id, room_id) VALUES (?, ?)', [userId, roomId]);
    return result;
}

interface Room {
    id: number,
    user_id: number,
    room_id: number
}

export const room_name = async (room: Room) => {
    const data = await pool.query<RowDataPacket[]>('SELECT * FROM room WHERE id = ?', [room.room_id])
    return data[0];
}

export const getId = async(name: string) => {
    const id = await pool.query<RowDataPacket[]>(`SELECT id FROM user WHERE username = ?`, [name])
    return id[0][0].id;
}

interface Peeps {
    id: number,
    name: string
}

export const get_convos = async (roomId: number) => {
    const result = await pool.query<RowDataPacket[]>('SELECT * FROM user_conversation WHERE room_id = ?', [roomId])
    console.log(`room id to convos: ${JSON.stringify(result[0])}`)
    return result[0];
}                                                                                          

export const check_room = async (ppl: Peeps[]) => {
    const convos: any[] = []
    await Promise.all(ppl.map(async (guy: Peeps) => {
        const convo = await pool.query<RowDataPacket[]>('SELECT * FROM user_conversation WHERE room_id = ?', [guy.id])
        convos.push(convo)
    }))
    return convos;
}

export const match_room = async (roomId: number) => {
    console.log(`ROOM ID: ${roomId}`)
    const room = await pool.query<RowDataPacket[]>(`SELECT * FROM room WHERE id = ?`, [roomId])
    console.log(`matched room: ${JSON.stringify(room[0])}`)
    if (room[0].length) {
        console.log('truey')
        return true;
    } else {
        console.log('nah nah nah')
        return false;
    }
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
    console.log(`goteee: ${JSON.stringify(msgs[0])}`)
    return msgs[0];
}

export const last_room = async () => {
    const result = await pool.query<RowDataPacket[]>('SELECT * FROM room ORDER BY id DESC LIMIT 1')
    console.log(`last room: ${JSON.stringify(result[0][0].id)}`)
    return result[0][0].id;
}

last_room()