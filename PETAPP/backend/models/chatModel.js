// chatModel.js

import db from '../config/db.js';



// 🔍 Kiểm tra xem cuộc trò chuyện giữa user và doctor đã tồn tại chưa
const checkChatExists = (userId, doctorId) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM chats WHERE UserID = ? AND DoctorID = ?',
            [userId, doctorId],
            (err, result) => {
                if (err) {
                    console.error("Database Error:", err);
                    reject(err);
                } else {
                    resolve(result.length > 0 ? result[0] : null); // Trả về chat nếu có
                }
            }
        );
    });
};


//Create a new chat if it doesn't exist
const createChat = (userId, doctorId) => {
    return new Promise((resolve, reject) => {
        db.query(
            'SELECT * FROM Chats WHERE UserID = ? AND DoctorID = ?',
            [userId, doctorId],
            (err, results) => {
                if (err) return reject(err);
                if (results.length > 0) return resolve(results[0]);

                db.query(
                    'INSERT INTO Chats (UserID, DoctorID) VALUES (?, ?)',
                    [userId, doctorId],
                    (err, result) => {
                        if (err) return reject(err);
                        resolve({ ChatID: result.insertId, UserID: userId, DoctorID: doctorId });
                    }
                );
            }
        );
    });
};

// const createChat = (userId, doctorId) => {
//     return new Promise((resolve, reject) => {
//         db.query(
//             'INSERT INTO chats (UserID, DoctorID, CreatedAt) VALUES (?, ?, NOW())',
//             [userId, doctorId],
//             (err, result) => {
//                 if (err) return reject(err);
//                 resolve({ ChatID: result.insertId, UserID: userId, DoctorID: doctorId });
//             }
//         );
//     });
// };

// Send a message
const sendMessage = (chatID, senderID, messageText) => {
    return new Promise((resolve, reject) => {
        db.query(
            "INSERT INTO Messages (ChatID, SenderID, MessageText, SentAt, IsRead) VALUES (?, ?, ?, NOW(), FALSE)",
            [chatID, senderID, messageText],
            (err, result) => {
                if (err) {
                    console.error("Database Error:", err);  // Log error for debugging
                    reject(err);
                } else {
                    resolve(result.insertId);
                }
            }
        );
    });
};


// Get messages for a chat
const getMessages = (chatId) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT m.*, u.FullName, u.Url AS UserAvatar, d.DoctorID, d.Avatar AS DoctorAvatar
        FROM messages m
        JOIN users u ON m.SenderID = u.UserID
        JOIN chats c ON m.ChatID = c.ChatID
        LEFT JOIN doctors d ON u.UserID = d.UserID
        WHERE c.ChatID = ?
            ORDER BY m.SentAt ASC`,
            [chatId],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });
};


// Get All Chats for User
const getAllChatsForUser = (userId) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT 
        c.*,
        d.DoctorID, 
        ud.FullName AS DoctorName, 
        d.Avatar,
        u.FullName AS UserName,
        u.Url AS UserAvatar,
        m.MessageID,
        m.MessageText, 
        m.SentAt, 
        m.IsRead,
        m.IsDeleted
    FROM Chats c
    JOIN Doctors d ON c.DoctorID = d.DoctorID
    JOIN Users ud ON d.UserID = ud.UserID
    JOIN Users u ON c.UserID = u.UserID
    LEFT JOIN Messages m ON c.ChatID = m.ChatID
    AND m.SentAt = (
        SELECT MAX(m2.SentAt) 
        FROM Messages m2 
        WHERE m2.ChatID = c.ChatID AND m2.IsDeleted = 0
    )
    WHERE u.UserID = ?
    ORDER BY m.SentAt DESC;`,
            [userId],
            (err, results) => {
                if (err) {
                    console.error("Error fetching chat data:", err);
                    return reject(err);
                }
                resolve(results);
            }
        );
    });
};


// Get All Chats for Doctor
const getAllChatsForDoctor = (doctorID) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT 
        c.*,
        d.DoctorID, 
        ud.FullName AS DoctorName, 
        d.Avatar,
        u.FullName AS UserName,
        u.Url AS UserAvatar,
        m.MessageID,
        m.MessageText, 
        m.SentAt, 
        m.IsRead,
        m.IsDeleted
    FROM Chats c
    JOIN Doctors d ON c.DoctorID = d.DoctorID
    JOIN Users ud ON d.UserID = ud.UserID
    JOIN Users u ON c.UserID = u.UserID
    LEFT JOIN Messages m ON c.ChatID = m.ChatID
    AND m.SentAt = (
        SELECT MAX(m2.SentAt) 
        FROM Messages m2 
        WHERE m2.ChatID = c.ChatID AND m2.IsDeleted = 0
    )
    WHERE d.DoctorID = ?
    ORDER BY m.SentAt DESC;`,
            [doctorID],
            (err, results) => {
                if (err) {
                    console.error("Error fetching chat data:", err);
                    return reject(err);
                }
                resolve(results);
            }
        );
    });
};

const getAllChats = () => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT 
        c.*,
        d.DoctorID, 
        ud.FullName AS DoctorName, 
        d.Avatar,
        u.FullName AS UserName,
        u.Url AS UserAvatar,
        m.MessageID,
        m.MessageText, 
        m.SentAt, 
        m.IsRead,
        m.IsDeleted
    FROM Chats c
    JOIN Doctors d ON c.DoctorID = d.DoctorID
    JOIN Users ud ON d.UserID = ud.UserID
    JOIN Users u ON c.UserID = u.UserID
    LEFT JOIN Messages m ON c.ChatID = m.ChatID
    AND m.SentAt = (
        SELECT MAX(m2.SentAt) 
        FROM Messages m2 
        WHERE m2.ChatID = c.ChatID AND m2.IsDeleted = 0
    )
    ORDER BY m.SentAt DESC; `,
            (err, results) => {
                if (err) {
                    console.error("Error fetching chat data:", err);
                    return reject(err);
                }
                resolve(results);
            }
        );
    });
};



//get Messages from ChatID 
const getMessagesFromChat = (chatId) => {
    return new Promise((resolve, reject) => {
        db.query(
            `SELECT m.*, u.FullName, u.Url AS UserAvatar, d.DoctorID, d.Avatar AS DoctorAvatar
        FROM messages m
        JOIN users u ON m.SenderID = u.UserID
        JOIN chats c ON m.ChatID = c.ChatID
        LEFT JOIN doctors d ON u.UserID = d.UserID
        WHERE c.ChatID = ? 
            ORDER BY m.SentAt ASC`,
            [chatId],
            (err, results) => {
                if (err) return reject(err);
                resolve(results);
            }
        );
    });
}

// Unsent message from userId
const unSentMessage = (messageId, userId) => {
    return new Promise((resolve, reject) => {
        db.query(
            `UPDATE Messages SET IsDeleted = TRUE, DeleteAt = NOW() WHERE MessageID = ? AND SenderID = ?`,
            [messageId, userId],
            (err, result) => {
                if (err) reject(err);
                else resolve(result.affectedRows > 0);
            }
        );
    });
}


// DELETE Chat by ChatID
const deleteChat = (chatId) => {
    return new Promise((resolve, reject) => {
        db.query(
            `DELETE FROM chats WHERE ChatID = ?`,
            [chatId],
            (err, result) => {
                if (err) reject(err);
                else resolve(result.affectedRows > 0);
            }
        )
    })
}

export {
    checkChatExists, createChat, sendMessage, getMessages,
    getAllChatsForUser, getAllChatsForDoctor, getAllChats, getMessagesFromChat,
    unSentMessage, deleteChat
};