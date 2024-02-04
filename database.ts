import mysql from 'mysql2'

const pool = mysql.createPool({
    user: 'root',
    host: 'localhost',
    password: 'Batista1!',
    database: 'chatter'
}).promise();