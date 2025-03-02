// authRoutes.js
import express from 'express';
import { register, login, getAlls, getUserByID, updateProfile, changePassword } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users', getAlls);
router.get('/user/:id', getUserByID);
// 📝 Cập nhật thông tin người dùng
router.put('/profile/:id', updateProfile);

// 🔐 Thay đổi mật khẩu
router.put('/change-password/:id', changePassword);

export default router;

