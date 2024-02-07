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
    console.log('match username:' + JSON.stringify(noarray));
    return noarray;
}

export const matchId = async (id: number) => {
    const result = await pool.query("SELECT * FROM user WHERE id = ?",[id]);
    console.log('match id:' + JSON.stringify(result));
    return result;
}

matchUsername('pethoburr');

matchId(1);

allUsers();