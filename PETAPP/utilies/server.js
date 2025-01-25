// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mysql = require('mysql2');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
});

// Connect to MySQL
db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// Register User
// Register User
app.post('/register', (req, res) => {
    const { FullName, Email, PasswordHash, PhoneNumber, Address, Role = 'Customer' } = req.body;
    const hashedPassword = bcrypt.hashSync(PasswordHash, 8);

    // Check if email already exists
    const checkEmailQuery = 'SELECT * FROM Users WHERE Email = ?';
    db.query(checkEmailQuery, [Email], (err, results) => {
        if (err) {
            console.error("Error checking email:", err);
            return res.status(500).send("Error checking email.");
        }
        if (results.length > 0) {
            return res.status(400).send("Email already exists.");
        }

        // Proceed to insert the new user
        const sql = 'INSERT INTO Users (FullName, Email, PasswordHash, PhoneNumber, Address, Role) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(sql, [FullName, Email, hashedPassword, PhoneNumber, Address, Role], (err, result) => {
            if (err) {
                console.error("Database error:", err); // Log the error for debugging
                return res.status(500).send("There was a problem registering the user.");
            }
            res.status(200).send("User  registered successfully!");
        });
    });
});

// Login User
app.post('/login', (req, res) => {
    const { Email, PasswordHash } = req.body;

    const sql = 'SELECT * FROM Users WHERE Email = ?';
    db.query(sql, [Email], (err, results) => {
        if (err) return res.status(500).send("There was a problem logging in.");
        if (results.length === 0) return res.status(404).send("User not found.");

        const user = results[0];
        const passwordIsValid = bcrypt.compareSync(PasswordHash, user.PasswordHash);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

        const token = jwt.sign({ id: user.UserID }, 'secret', { expiresIn: 86400 }); // expires in 24 hours
        res.status(200).send({ auth: true, token });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
