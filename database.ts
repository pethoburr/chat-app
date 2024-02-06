import mysql from 'mysql2'
import dotenv from 'dotenv';
dotenv.config()

export const pool = mysql.createPool({
    user: process.env.USER,
    host: process.env.HOST,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
}).promise();

const check = async () => {
    const result = await pool.query("SELECT * FROM user")
    console.log(result)
}

check();