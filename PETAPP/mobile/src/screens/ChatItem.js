// ChatItem.js
// npm install @react-native-async-storage/async-storage -- luu tru cuc bo 
import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, StyleSheet, Modal, Animated } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchMessages, sendMessage, deleteMessage } from '../services/api';
import { icons, colors } from '../constants';

const ChatItem = ({ route, navigation }) => {
    // const [messages, setMessages] = useState([
    //     { id: 1, sender: 'customer', text: 'Chào bác sĩ!', time: '10:00 AM', avatar: 'https://i.pinimg.com/236x/0c/86/ee/0c86ee432aa2d3202645d00ab07ab446.jpg' },
    //     { id: 2, sender: 'doctor', text: 'Chào bạn, bạn cần hỗ trợ gì?', time: '10:05 AM', avatar: 'https://i.pinimg.com/474x/f8/07/41/f807414de2cb9f00fc29fec69d5cf8e7.jpg' },
    // ]);
    const [userID, setUserID] = useState(null);
    const { chatId, doctorId, doctorName, doctorAvatar, userName, userAvatar, role } = route.params;
    const [messages, setMessages] = useState([]);
    //const [doctors, setDoctors] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isDoctorActive, setIsDoctorActive] = useState(true); // Trạng thái active/inactive của bác sĩ
    const [backgroundColor, setBackgroundColor] = useState('#ffffff'); // Màu nền mặc định
    const [isSettingsVisible, setIsSettingsVisible] = useState(false); // Modal cài đặt
    const scrollViewRef = React.useRef();
    const [selectedMessageID, setSelectedMessageID] = useState(null);

    const displayName = role === 'Doctor' ? userName : doctorName;
    const displayAvatar = role === 'Doctor' ? userAvatar : doctorAvatar;


    // Load userID from AsyncStorage
    useEffect(() => {
        const loadUserID = async () => {
            try {
                const storedUserID = await AsyncStorage.getItem('userID');
                if (storedUserID) {
                    setUserID(parseInt(storedUserID, 10)); // Convert userID to integer
                } else {
                    console.error('UserID not found in AsyncStorage');
                }
            } catch (error) {
                console.error('Failed to load user ID:', error);
            }
        };
        loadUserID();
    }, []);

    // Load màu nền đã lưu từ AsyncStorage khi mở app
    useEffect(() => {
        const loadBackgroundColor = async () => {
            try {
                const savedColor = await AsyncStorage.getItem('backgroundColor');
                if (savedColor) {
                    setBackgroundColor(savedColor);
                }
            } catch (error) {
                console.error('Lỗi khi tải màu nền:', error);
            }
        };
        loadBackgroundColor();
    }, []);

    // Load chat messages
    useEffect(() => {
        const loadChatMessages = async () => {
            try {
                const allMessages = await fetchMessages(chatId);
                setMessages(allMessages);
            } catch (error) {
                console.error('Failed to load messages:', error);
            }
        };
        loadChatMessages();

        // Poll for new messages every 5 seconds (optional)
        const interval = setInterval(loadChatMessages, 5000);
        return () => clearInterval(interval);
    }, [chatId]);

    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    // // Send new message 
    // const handleSendMessage = () => {
    //     if (newMessage.trim()) {
    //         setMessages([...messages, { id: messages.length + 1, sender: 'customer', text: newMessage, time: new Date().toLocaleTimeString(), avatar: 'https://i.pinimg.com/474x/f8/07/41/f807414de2cb9f00fc29fec69d5cf8e7.jpg' }]);
    //         setNewMessage('');
    //     }
    // };

    const localTime = moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");

    const handleSendMessage = async () => {
        if (newMessage.trim()) {
            const newMsg = {
                chatID: chatId,
                senderID: userID,
                messageText: newMessage
            };

            try {
                await sendMessage(newMsg);
                setMessages(prevMessages => [...prevMessages, newMsg]);
                setNewMessage('');
            } catch (error) {
                console.error('Failed to send message:', error.response ? error.response.data : error.message);
            }
        }
    };


    const handleDeleteMessage = async (messageId) => {
        try {
            const response = await deleteMessage(messageId, userID);
            if (response) {
                setMessages(messages.filter(msg => msg.MessageID !== messageId));
            }
        } catch (error) {
            console.error('Lỗi khi xóa tin nhắn:', error);
        }
    };

    // const handleDeleteMessage = async (messageId) => {
    //     try {
    //         const response = await deleteMessage(messageId, userID);
    //         if (response) {
    //             setMessages((prevMessages) =>
    //                 prevMessages.map((msg) =>
    //                     msg.MessageID === messageId
    //                         ? { ...msg, IsDeleted: true, DeletedAt: new Date().toISOString() }
    //                         : msg
    //                 )
    //             );
    //         }
    //     } catch (error) {
    //         console.error("Lỗi khi xóa tin nhắn:", error);
    //     }
    // };

    // Scroll to the latest message
    useEffect(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
    }, [messages]);

    // Lưu màu nền vào AsyncStorage
    const handleChangeBackground = async (color) => {
        try {
            await AsyncStorage.setItem('backgroundColor', color);
            setBackgroundColor(color);
            setIsSettingsVisible(false); // Đóng modal sau khi chọn màu
        } catch (error) {
            console.error('Lỗi khi lưu màu nền:', error);
        }
    };

    // Group messages by date
    const groupMessagesByDate = (messages) => {
        const groupedMessages = {};
        messages.forEach(msg => {
            const date = moment(msg.SentAt).format('YYYY-MM-DD');
            if (!groupedMessages[date]) {
                groupedMessages[date] = [];
            }
            groupedMessages[date].push(msg);
        });
        return groupedMessages;
    };

    const groupedMessages = groupMessagesByDate(messages);

    return (
        <View style={[styles.container, { backgroundColor: backgroundColor }]}>
            {/* <Text style={{ textAlign: 'center'}}>{chatId}</Text>
            <Text style={{ textAlign: 'center'}}>{userID}</Text> */}
            {/* Tiêu đề và trạng thái bác sĩ */}
            <View style={styles.header}>
                {/* Nút back */}
                <View style={{ paddingLeft: 5, paddingRight: 25, paddingVertical: 5, }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Image source={icons.back_button} style={styles.backIcon} />
                    </TouchableOpacity>
                </View>

                <Image source={{ uri: displayAvatar || 'https://your-default-avatar-url.jpg' }} style={styles.avatar} />
                <View style={styles.doctorInfo}>
                    <Text style={styles.doctorName}>{displayName}</Text>
                    <View style={styles.statusContainer}>
                        <View style={[styles.statusDot, isDoctorActive ? styles.activeDot : styles.inactiveDot]} />
                        <Text style={[styles.doctorStatus, isDoctorActive ? styles.active : styles.inactive]}>
                            {isDoctorActive ? 'Đang hoạt động' : 'Không hoạt động'}
                        </Text>
                    </View>
                </View>

                {/* Nút mở cài đặt */}
                <TouchableOpacity onPress={() => setIsSettingsVisible(true)} style={styles.settingsButton}>
                    <Image source={icons.settings} style={styles.settingsIcon} />
                </TouchableOpacity>
            </View>

            {/* Messages List */}
            {/* <ScrollView ref={scrollViewRef} style={styles.messageContainer}>
                {messages.map((msg, index) => {
                    const isUserMessage = msg.SenderID === userID;
                    return (
                        <View key={msg.MessageID || index} style={isUserMessage ? styles.userMessageContainer : styles.otherMessageContainer}>
                            {!isUserMessage && (
                                <Image
                                    source={{ uri: msg.DoctorAvatar || msg.Avatar || 'doctor-default-avatar-url' }}
                                    style={styles.messageAvatar}
                                />
                            )}
                            <View style={isUserMessage ? styles.userMessage : styles.otherMessage}>
                                <Text style={isUserMessage ? styles.userMessageText : styles.otherMessageText}>{msg.MessageText}</Text>
                                <Text style={styles.messageTime}>{new Date(msg.SentAt).toLocaleTimeString()}</Text>

                                {isUserMessage && (
                                    <View style={styles.rowBack}>
                                        <TouchableOpacity onPress={() => handleDeleteMessage(msg.MessageID)} style={styles.deleteButton}>
                                            <Image source={icons.delete} style={styles.deleteIcon} />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        </View>
                    );
                })}
            </ScrollView> */}



            <ScrollView ref={scrollViewRef} style={styles.messageContainer}>
                {Object.keys(groupedMessages).map(date => (
                    <View key={date}>
                        <Text style={styles.dateHeader}>{moment(date).format('MMM DD, YYYY')}</Text>
                        {groupedMessages[date].map(msg => {
                            const isUserMessage = msg.SenderID === userID;
                            const isSelected = selectedMessageID === msg.MessageID;
                            const IsDeleted = msg.IsDeleted === 0;
                            return (
                                <TouchableOpacity
                                    key={msg.MessageID || index}
                                    onLongPress={isUserMessage ? () => setSelectedMessageID(msg.MessageID) : undefined} // Chỉ áp dụng cho tin nhắn của user
                                    onPress={() => setSelectedMessageID(null)} // Nhấn lại để bỏ chọn
                                    style={isUserMessage ? styles.userMessageContainer : styles.otherMessageContainer}
                                >
                                    {!isUserMessage && (
                                        <Image
                                            source={{ uri: displayAvatar || 'doctor-default-avatar-url' }}
                                            style={styles.messageAvatar}
                                        />
                                    )}
                                    <View style={isUserMessage ? styles.userMessage : styles.otherMessage}>
                                        {msg.IsDeleted ? (
                                            <Text style={styles.unsentMessageText}>You unsent a message</Text>
                                        ) : (
                                            <Text style={isUserMessage ? styles.userMessageText : styles.otherMessageText}>
                                                {msg.MessageText}
                                            </Text>
                                        )}
                                        {/* <Text style={styles.messageTime}>{new Date(msg.SentAt).toLocaleTimeString()}</Text> */}
                                        {/* <Text style={styles.messageTime}>
                                            {msg.IsDeleted ? new Date(msg.DeleteAt).toLocaleTimeString() : new Date(msg.SentAt).toLocaleTimeString()}
                                        </Text> */}
                                        <Text style={styles.messageTime}>
                                            {msg.IsDeleted
                                                ? moment(msg.DeleteAt).format('MMM DD, YYYY [AT] HH:mm')
                                                : moment(msg.SentAt).format('HH:mm')}
                                        </Text>

                                        {/* Chỉ hiển thị deleteIcon nếu tin nhắn của user và đang được chọn */}
                                        {isUserMessage && isSelected && IsDeleted && (
                                            <TouchableOpacity
                                                onPress={() => handleDeleteMessage(msg.MessageID)}
                                                style={styles.deleteButton}
                                            >
                                                <Image source={icons.delete} style={styles.deleteIcon} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                    </View>
                ))
                }
            </ScrollView >


            {/* Input và nút gửi */}
            {/* Input Field */}
            <View style={styles.inputContainer} >
                <TextInput
                    style={styles.textInput}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Nhập tin nhắn..."
                />
                <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                    <Image source={icons.paper_plane} style={styles.sendIcon} />
                </TouchableOpacity>
            </View>

            {/* Modal chọn màu nền */}
            <Modal visible={isSettingsVisible} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Chọn màu nền</Text>
                        <View style={styles.colorOptions}>
                            <TouchableOpacity style={[styles.colorOption, { backgroundColor: colors.white }]} onPress={() => handleChangeBackground('#ffffff')} />
                            <TouchableOpacity style={[styles.colorOption, { backgroundColor: colors.blue_border }]} onPress={() => handleChangeBackground('#e1f5fe')} />
                            <TouchableOpacity style={[styles.colorOption, { backgroundColor: colors.pink_orange }]} onPress={() => handleChangeBackground('#ffccbc')} />
                            <TouchableOpacity style={[styles.colorOption, { backgroundColor: colors.purple_light }]} onPress={() => handleChangeBackground('#f3e5f5')} />
                        </View>
                        <TouchableOpacity onPress={() => setIsSettingsVisible(false)} style={styles.closeButton}>
                            <Text style={styles.closeButtonText}>Đóng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View >
    );
};

export default ChatItem;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: colors.login_color
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    doctorInfo: {
        flex: 1,
    },
    doctorName: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        marginRight: 5,
    },
    activeDot: {
        backgroundColor: 'green',
    },
    inactiveDot: {
        backgroundColor: 'gray',
    },
    doctorStatus: {
        fontSize: 14,
    },
    active: {
        color: 'green',
    },
    inactive: {
        color: 'gray',
    },
    messageContainer: {
        flex: 1,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    customerMessageContent: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    doctorMessageContent: {
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    messageAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    customerMessage: {
        width: '80%',
        alignSelf: 'flex-start',
        backgroundColor: colors.messageSender,
        // backgroundColor: '#e1f5fe',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
    doctorMessage: {
        width: '80%',
        alignSelf: 'flex-end',
        backgroundColor: colors.messageReceiver,
        // backgroundColor: '#ffccbc',
        borderRadius: 10,
        padding: 10,
        marginBottom: 20,
    },
    customerMessageText: {
        fontSize: 16,
    },
    doctorMessageText: {
        fontSize: 16,
        color: colors.white,
    },
    messageTime: {
        fontSize: 12,
        color: 'gray',
        marginTop: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        padding: 10,
    },
    textInput: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    sendButton: {
        backgroundColor: '#007aff',
        padding: 10,
        borderRadius: 50,
        marginLeft: 10,
    },
    sendIcon: {
        width: 20,
        height: 20,
        tintColor: colors.white,
    },
    backIcon: {
        width: 30,
        height: 30,
    },
    settingsIcon: {
        width: 30,
        height: 30,
    },
    // Modal Styles
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: 300,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    colorOptions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 20,
    },
    colorOption: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    closeButton: {
        marginTop: 10,
        backgroundColor: '#007aff',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },


    messageContainer: {
        padding: 10,
    },
    userMessageContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',  // Đưa tin nhắn của user sang bên phải
        marginVertical: 5,
    },
    otherMessageContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',  // Đưa tin nhắn của người khác sang bên trái
        marginVertical: 5,
    },
    messageAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
    },
    userMessage: {
        backgroundColor: '#007bff',  // Màu nền xanh cho user
        padding: 10,
        borderRadius: 10,
        maxWidth: '70%',
    },
    otherMessage: {
        backgroundColor: '#FFDAB9',  // Màu cam nhạt cho người khác
        padding: 10,
        borderRadius: 10,
        maxWidth: '70%',
    },
    userMessageText: {
        color: '#ffffff',  // Chữ màu trắng cho user
    },
    otherMessageText: {
        color: '#000000',  // Chữ màu đen cho người khác
    },
    unsentMessageText: {
        fontStyle: 'italic',
        color: 'gray',
        fontSize: 14,
        fontWeight: '600',
    },
    messageTime: {
        fontSize: 10,
        marginTop: 5,
        textAlign: 'right',
    },
    deleteButton: {
        backgroundColor: 'rgba(255, 0, 0, 0.8)', // Màu đỏ nhạt, không quá gắt
        borderRadius: 20, // Làm tròn góc để mềm mại hơn
        padding: 8, // Kích thước hợp lý
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000", // Tạo hiệu ứng bóng
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
        elevation: 4, // Hiệu ứng nâng cho Android
    },
    deleteIcon: { width: 16, height: 16, tintColor: colors.white },
    dateHeader: {
        textAlign: 'center',
        fontSize: 12,
        marginVertical: 10,
        color: colors.inactive,
    },
});


