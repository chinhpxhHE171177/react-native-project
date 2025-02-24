// userModel.js
import db from '../config/db.js';

const createUser = (user, callback) => {
    const { FullName, Email, PasswordHash, PhoneNumber, Address, Role, Url } = user;
    const sql = `INSERT INTO Users (FullName, Email, PasswordHash, PhoneNumber, Address, Role, Url) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [FullName, Email, PasswordHash, PhoneNumber, Address, Role, Url], callback);
};

const findUserByEmail = (Email, callback) => {
    const sql = `SELECT * FROM Users WHERE Email = ?`;
    db.query(sql, [Email], callback);
};

const getAllUsers = (callback) => {
    const sql = `SELECT * FROM Users`;
    db.query(sql, callback);
};

const findUserById = (userId, callback) => {
    const sql = `SELECT * FROM Users WHERE UserID = ?`;
    db.query(sql, [userId], callback);
};

// UserID INT AUTO_INCREMENT PRIMARY KEY,
// FullName VARCHAR(100) NOT NULL,
// Email VARCHAR(100) UNIQUE NOT NULL,
// PasswordHash VARCHAR(255) NOT NULL,
// PhoneNumber VARCHAR(15),
// Address VARCHAR(255),
// Role ENUM('Admin', 'Customer', 'Doctor') DEFAULT 'Customer',
// CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
// Url VARCHAR(500)

// Update Profile 
const updateUserProfile = (user, callback) => {
    const { UserID, FullName, Email, PhoneNumber, Address, Url } = user;
    const sql = `UPDATE Users SET FullName = ?, Email = ?, PhoneNumber = ?, Address = ?, Url = ? WHERE UserID = ?`;
    db.query(sql, [FullName, Email, PhoneNumber, Address, Url, UserID], callback);
};

// Change Password
const changeUserPassword = (user, callback) => {
    const { UserID, PasswordHash } = user;
    const sql = `UPDATE Users SET PasswordHash = ? WHERE UserID = ?`;
    db.query(sql, [PasswordHash, UserID], callback);
};

export { createUser, findUserByEmail, getAllUsers, findUserById, updateUserProfile, changeUserPassword };


