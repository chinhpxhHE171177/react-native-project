// Notification.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Image, Alert } from 'react-native';
import { icons } from '../constants';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Lịch Hẹn Mới',
      message: 'Bạn có lịch hẹn mới với Dr. John Doe vào ngày 20/07/2024.',
      date: '2024-07-18',
      read: false,
    },
    {
      id: 2,
      title: 'Cập Nhật Lịch Hẹn',
      message: 'Lịch hẹn với Dr. Jane Roe đã được xác nhận.',
      date: '2024-07-19',
      read: true,
    },
  ]);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const deleteNotification = (id) => {
    Alert.alert('Xác nhận', 'Bạn có chắc muốn xóa thông báo này?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Xóa',
        style: 'destructive',
        onPress: () => setNotifications(notifications.filter((notif) => notif.id !== id)),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <ScrollView contentContainerStyle={styles.notificationList}>
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <View key={notif.id} style={[styles.card, notif.read && styles.readCard]}>
              <View style={styles.cardContent}>
                <View style={styles.textContent}>
                  <Text style={styles.title}>{notif.title}</Text>
                  <Text style={styles.message}>{notif.message}</Text>
                  <Text style={styles.date}>{notif.date}</Text>
                </View>
                <View style={styles.actions}>
                  {!notif.read && (
                    <TouchableOpacity onPress={() => markAsRead(notif.id)}>
                      <Image source={icons.check} style={styles.icon} />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={() => deleteNotification(notif.id)}>
                    <Image source={icons.delete} style={styles.icon} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.emptyMessage}>Không có thông báo nào.</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3F4F6',
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1E3A8A',
  },
  notificationList: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  readCard: {
    backgroundColor: '#E5E7EB',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContent: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1E3A8A',
    marginBottom: 5,
  },
  message: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  emptyMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#9CA3AF',
    marginTop: 50,
  },
});

export default Notifications;

