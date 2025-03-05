// chatController.js 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
    checkChatExists,
    createChat,
    sendMessage,
    getMessages,
    getAllChatsForUser,
    getAllChatsForDoctor,
    getAllChats,
    getMessagesFromChat,
    unSentMessage,
    deleteChat
} from '../models/chatModel.js';


// Kiểm tra xem cuộc trò chuyện đã tồn tại chưa
export const checkChat = async (req, res) => {
    const { userId, doctorId } = req.params;
    try {
        let chat = await checkChatExists(userId, doctorId);
        // if (!chat) {
        //     chat = await createChat(userId, doctorId); // Tạo mới nếu chưa tồn tại
        // }
        res.status(200).json(chat);
    } catch (error) {
        res.status(500).json({ message: 'Lỗi khi kiểm tra cuộc trò chuyện', error });
    }
};


export const createNewChat = async (req, res) => {
    const { userId, doctorId } = req.body;

    if (!userId || !doctorId) {
        return res.status(400).json({ message: "Thiếu userId hoặc doctorId" });
    }

    try {
        const chat = await createChat(userId, doctorId);
        res.status(201).json(chat);
    } catch (error) {
        console.error("Lỗi khi tạo cuộc trò chuyện:", error);
        res.status(500).json({ message: 'Lỗi khi tạo cuộc trò chuyện', error });
    }
};

// Delete Chat by ChatID
export const deleteChatByChatID = async (req, res) => {
    const { chatId } = req.params;  // Dùng req.params thay vì req.body

    // Validate required fields
    if (!chatId) {
        return res.status(400).json({ message: "Missing required fields", receivedData: req.body });
    }

    try {
        const success = await deleteChat(chatId);
        if (success) {
            res.json({ message: 'The chat are deleted!' });
        } else {
            res.status(403).json({ error: 'Cannot delete the chat!' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error when delete the chat' });
    }

}

export const sendMessages = async (req, res) => {
    const { chatID, senderID, messageText } = req.body;

    // Validate required fields
    if (!chatID || !senderID || !messageText) {
        return res.status(400).json({ message: "Missing required fields", receivedData: req.body });
    }

    try {
        const messageId = await sendMessage(chatID, senderID, messageText);
        res.status(201).json({ message: "Message sent successfully", messageId });
    } catch (error) {
        console.error("Error sending message:", error);
        res.status(500).json({ message: "Error sending message", error: error.sqlMessage || error.message });
    }
};

export const deleteMessage = async (req, res) => {
    try {
        const { messageId, userId } = req.body;
        const success = await unSentMessage(messageId, userId);
        if (success) {
            res.json({ message: 'Tin nhắn đã bị xóa' });
        } else {
            res.status(403).json({ error: 'Không thể xóa tin nhắn này' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Lỗi khi xóa tin nhắn' });
    }
};

export const getAllMessages = async (req, res) => {
    const { chatId } = req.params;
    try {
        const messages = await getMessages(chatId);
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving messages', error });
    }
};


export const getChatForUser = async (req, res) => {
    const { userId } = req.params;
    try {
        const messages = await getAllChatsForUser(userId);
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving messages', error });
    }
}


export const getChatForDoctor = async (req, res) => {
    const { doctorId } = req.params;
    try {
        const messages = await getAllChatsForDoctor(doctorId);
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving messages', error });
    }
}


export const getChats = async (req, res) => {
    try {
        const messages = await getAllChats();
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving messages', error });
    }
}


export const getMessagesForChat = async (req, res) => {
    const { chatId } = req.params;
    try {
        const messages = await getMessagesFromChat(chatId);
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving messages', error });
    }
}




