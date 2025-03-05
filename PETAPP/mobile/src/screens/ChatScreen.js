// ChatScreen.js 
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  deleteChat,
  fetchChatForUser,
  fetchChatForDoctor,
  fetchDoctorByUserID,
} from '../services/api';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { colors, icons } from '../constants';
import MessageItem from './MessageItem';

const ChatScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([]);
  const [doctor, setDoctor] = useState(null);
  const [userID, setUserID] = useState(null);
  const [role, setRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState(null);

  const groupMessagesByDoctor = (messages) => {
    const doctorChats = {};
    messages.forEach((msg) => {
      if (!doctorChats[msg.DoctorID] || new Date(msg.SentAt) > new Date(doctorChats[msg.DoctorID].SentAt)) {
        doctorChats[msg.DoctorID] = { ...msg };
      }
    });
    return Object.values(doctorChats);
  };

  const groupMessagesByUser = (messages) => {
    const userChats = {};
    messages.forEach((msg) => {
      if (!userChats[msg.UserID] || new Date(msg.SentAt) > new Date(userChats[msg.UserID].SentAt)) {
        userChats[msg.UserID] = { ...msg };
      }
    });
    return Object.values(userChats);
  };

  // 🔄 Load userID and role from AsyncStorage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const [storedUserID, storedRole] = await Promise.all([
          AsyncStorage.getItem('userID'),
          AsyncStorage.getItem('role'),
        ]);
        setUserID(storedUserID);
        setRole(storedRole);
      } catch (error) {
        console.error('Error retrieving user data:', error);
      }
    };
    loadUserData();
  }, []);

  // 🩺 Fetch Doctor Details for User (chỉ khi role là Doctor)
  useEffect(() => {
    const getDoctorDetails = async () => {
      if (role === 'Doctor' && userID) {
        try {
          const response = await fetchDoctorByUserID(userID);
          if (response) setDoctor(response);
          else setError('Doctor not found'); // 🔥 Hiện lỗi chỉ khi role là Doctor
        } catch (err) {
          console.error('API Error:', err);
          setError('Failed to load doctor details');
        }
      }
    };
    getDoctorDetails();
  }, [userID, role]);


  // 💬 Load chat data based on role & doctor info
  useEffect(() => {
    const loadChatData = async () => {
      try {
        if (role === 'Doctor' && userID) {
          const userData = await fetchChatForDoctor(doctor?.DoctorID);
          setMessages(groupMessagesByUser(userData));
        } else if (role != 'Doctor' && userID) {
          const userData = await fetchChatForUser(userID);
          setMessages(groupMessagesByDoctor(userData));
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load chat data.');
      }
    };

    loadChatData();
    const interval = setInterval(loadChatData, 5000);
    return () => clearInterval(interval);
  }, [userID, role, doctor?.DoctorID]);

  const filteredMessages = messages.filter((msg) =>
    [msg.DoctorName, msg.UserName, msg.MessageText].some(
      (field) => field && field.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handlePress = (item) => {
    const updatedMessages = messages.map((msg) =>
      msg.ChatID === item.ChatID ? { ...msg, IsRead: true } : msg
    );
    setMessages(updatedMessages);
    navigation.navigate('ChatItem', {
      chatId: item.ChatID,
      doctorId: item.DoctorID,
      doctorName: item.DoctorName,
      doctorAvatar: item.Avatar,
      userId: item.UserID,
      userName: item.UserName,
      userAvatar: item.UserAvatar,
      role: role,
    });
  };

  const handleDelete = async (chatID) => {
    try {
      const response = await deleteChat(chatID);
      if (response.success) {
        setMessages((prev) => prev.filter((msg) => msg.ChatID !== chatID));
        Alert.alert('Success', 'Chat deleted successfully!');
      } else {
        Alert.alert('Error', 'Failed to delete chat.');
      }
    } catch (error) {
      Alert.alert('Error', 'Something went wrong.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={icons.back_button} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Message</Text>
        <Text>{role}</Text>
      </View>

      <View style={styles.searchContainer}>
        <Image source={icons.search} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for message..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {filteredMessages.length === 0 ? (
        <View style={styles.noMessageContainer}>
          <Text style={styles.noMessageText}>No message</Text>
        </View>
      ) : (
        <FlatList
          data={filteredMessages}
          keyExtractor={(item) => item.ChatID.toString()}
          renderItem={({ item }) => (
            <MessageItem item={item} onPress={handlePress} onDelete={handleDelete} role={role} />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

export default ChatScreen;


const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.disabledLight },
  header: { flexDirection: 'row', alignItems: 'center', backgroundColor: colors.white, paddingVertical: 15, paddingHorizontal: 10, borderBottomWidth: 1, borderBottomColor: '#ddd' },
  backButton: { marginRight: 10 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', margin: 10, paddingHorizontal: 10, borderRadius: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  searchIcon: { width: 20, height: 20, marginRight: 5 },
  searchInput: { flex: 1, height: 40, fontSize: 16 },
  noMessageContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  noMessageText: { fontSize: 18, color: '#999' },
  listContent: { paddingBottom: 10 },
  messageItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 15, marginVertical: 6, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2 },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
  messageContent: { flex: 1 },
  sender: { fontSize: 16, color: '#333' },
  messageText: { fontSize: 14, color: '#666', marginTop: 3 },
  time: { fontSize: 12, color: '#999' },
  backIcon: { width: 30, height: 30 },
  unreadText: { fontWeight: 'bold', color: '#000' },  // Thêm style cho tin nhắn chưa đọc
  timeContainer: { alignItems: 'flex-end', justifyContent: 'center', },
  readStatus: { fontSize: 14, marginTop: 3, },
  read: { tintColor: colors.primary, },  // Màu xanh cho đã đọc
  unread: { color: colors.inactive, },    // Màu xám cho chưa đọc

});


