const mysql = require('mysql2');
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.connect(err => {
    if (err) {
        console.error('❌ Database connection error:', err);
        process.exit(1);
    }
    console.log('✅ Connected to MySQL Database');
});

module.exports = connection;
