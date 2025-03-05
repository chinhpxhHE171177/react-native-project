// chatRoutes.js 
import express from 'express';
import {
    createNewChat,
    sendMessages,
    getAllMessages,
    getChatForUser,
    deleteMessage,
    checkChat,
    getChats,
    deleteChatByChatID,
    getChatForDoctor
} from '../controllers/chatController.js';

const router = express.Router();

router.get('/checkChat/:userId/:doctorId', checkChat);
router.post('/createChat', createNewChat);
router.post('/sendMessage', sendMessages);
router.post('/unsentMessage', deleteMessage);
router.get('/getMessages/:chatId', getAllMessages);
router.get('/getChats/:userId', getChatForUser);
router.get('/getChatsForDoctor/:doctorId', getChatForDoctor);
router.get('/getChats', getChats);
router.delete('/deleteChat/:chatId', deleteChatByChatID);

export default router;

