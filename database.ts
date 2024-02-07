import mysql from 'mysql2'
import dotenv from 'dotenv';
dotenv.config()

export const pool = mysql.createPool({
    user: process.env.USER,
    host: process.env.HOST,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
}).promise();

const allUsers = async () => {
    const result = await pool.query("SELECT * FROM user")
    console.log('all users:' + JSON.stringify(result))
}

export const matchUsername = async (username: string) => {
    const result: any[] = await pool.query("SELECT * FROM user WHERE username = ?",[username]);
    const unarrayed = result[0]
    const noarray = unarrayed[0];
    return noarray;
}

export const matchId = async (id: number) => {
    const result = await pool.query("SELECT * FROM user WHERE id = ?",[id]);
    return result;
}

export const register = async (first_name: string, last_name: string, username: string, password: string) => {
    const data = await pool.query(`INSERT INTO users (first_name, last_name, username, password) VALUES ('${first_name}', ${last_name}', ${username}', '${password}' ) `)
    console.log('data:' + JSON.stringify(data))
}

// matchUsername('pethoburr');

// matchId(1);

// allUsers();