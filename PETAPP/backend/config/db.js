// db.js
import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

db.connect(err => {
    if (err) {
        console.error("❌ MySQL Connection Error:", err);
        process.exit(1);
    }
    console.log("✅ MySQL Connected...");
});

export default db;
