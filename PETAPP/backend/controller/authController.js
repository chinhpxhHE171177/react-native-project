// authController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, getAllUsers, findUserById, updateUserProfile, changeUserPassword } from '../models/userModel.js';

const register = (req, res) => {
    const { FullName, Email, Password, PhoneNumber, Address, Role = 'User', Url = 'https://static-00.iconduck.com/assets.00/avatar-default-icon-1975x2048-2mpk4u9k.png' } = req.body;
    const hashedPassword = bcrypt.hashSync(Password, 8);

    findUserByEmail(Email, (err, results) => {
        if (err) return res.status(500).send("Server error.");
        if (results.length > 0) return res.status(400).send("Email already exists.");

        createUser({ FullName, Email, PasswordHash: hashedPassword, PhoneNumber, Address, Role, Url }, (err) => {
            if (err) return res.status(500).send("Database error.");
            res.status(201).send("User registered successfully!");
        });
    });
};

const login = (req, res) => {
    const { Email, Password } = req.body;

    findUserByEmail(Email, (err, results) => {
        if (err) return res.status(500).send("Server error.");
        if (results.length === 0) return res.status(404).send("User not found.");

        const user = results[0];
        if (!user.PasswordHash) return res.status(500).send("Server error. Please contact support.");

        const passwordIsValid = bcrypt.compareSync(Password, user.PasswordHash);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

        const token = jwt.sign({ id: user.UserID, role: user.Role }, process.env.JWT_SECRET, { expiresIn: '24h' });
        res.status(200).send({ auth: true, token, userId: user.UserID, role: user.Role, fullName: user.FullName, url: user.Url });
    });
};

const getAlls = (req, res) => {
    getAllUsers((err, results) => {
        if (err) return res.status(500).send("Server error.");
        res.status(200).send(results);
    });
};


const getUserByID = (req, res) => {
    const userId = req.params.id;

    findUserById(userId, (err, results) => {
        if (err) return res.status(500).send("Server error.");
        if (results.length === 0) return res.status(404).send("User not found.");

        res.status(200).send(results[0]);
    });
};

/// 📝 Cập nhật hồ sơ người dùng
const updateProfile = async (req, res) => {
    const userId = req.params.id;
    const { FullName, Email, PhoneNumber, Address, Url } = req.body;

    try {
        findUserById(userId, (err, userResults) => {
            if (err) return res.status(500).send("Server error.");
            if (userResults.length === 0) return res.status(404).send("User not found.");

            const user = userResults[0];

            // 🔄 Kiểm tra email đã tồn tại
            if (Email && Email !== user.Email) {
                findUserByEmail(Email, (err, emailCheck) => {
                    if (err) return res.status(500).send("Server error.");
                    if (emailCheck.length > 0) return res.status(400).send("Email already in use.");

                    const updatedUser = { ...user, FullName, Email, PhoneNumber, Address, Url };
                    updateUserProfile(updatedUser, (err) => {
                        if (err) return res.status(500).send("Database error.");
                        res.status(200).send("User updated successfully!");
                    });
                });
            } else {
                const updatedUser = { ...user, FullName, Email, PhoneNumber, Address, Url };
                updateUserProfile(updatedUser, (err) => {
                    if (err) return res.status(500).send("Database error.");
                    res.status(200).send("User updated successfully!");
                });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error while updating profile.");
    }
};

// 🔑 Thay đổi mật khẩu
const changePassword = async (req, res) => {
    const userId = req.params.id;
    const { oldPassword, newPassword } = req.body;

    try {
        findUserById(userId, async (err, userResults) => {
            if (err) return res.status(500).send("Server error.");
            if (userResults.length === 0) return res.status(404).send("User not found.");

            const user = userResults[0];
            const isMatch = await bcrypt.compare(oldPassword, user.PasswordHash);
            if (!isMatch) return res.status(400).send("Old password is incorrect.");

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            changeUserPassword({ UserID: userId, PasswordHash: hashedPassword }, (err) => {
                if (err) return res.status(500).send("Database error.");
                res.status(200).send("Password changed successfully!");
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error while changing password.");
    }
};

export { register, login, getAlls, getUserByID, updateProfile, changePassword };
