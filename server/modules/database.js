//include module
const mysql = require('mysql');
require('dotenv').config();

//connect
const conn = mysql.createConnection({
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: process.env.DATABASE_PW,
    database: 'repme_db'
});

module.exports = conn;