import mysql from 'mysql2'
import dotenv from 'dotenv';
dotenv.config()

export const pool = mysql.createPool({
    user: process.env.USER,
    host: process.env.HOST,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
}).promise();

export const allUsers = async () => {
    const result = await pool.query("SELECT * FROM user")
    console.log('all users:' + JSON.stringify(result))
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
    const result = await pool.query("SELECT * FROM user_room WHERE id = ?",[id])
    console.log(`rooms: ${result}`)
    return result;
}



// matchUsername('pethoburr');

// matchId(1);

// allUsers();