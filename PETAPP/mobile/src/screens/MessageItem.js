// MessageItem.js
// npm install react-native-swipe-list-view

import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
// Fix typo in import
// import { deleteMessage, fetchChatForUser } from '../services/api';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { colors, icons } from '../constants';


const MessageItem = ({ item, onPress, onDelete, role }) => {
    // ✅ Determine which avatar and name to display based on role
    const displayName = role === 'Doctor' ? item.UserName : item.DoctorName;
    const displayAvatar = role === 'Doctor' ? item.UserAvatar : item.Avatar;

    return (
        <SwipeListView
            data={[item]}
            renderItem={({ item }) => (
                <TouchableOpacity style={styles.messageItem} onPress={() => onPress(item)}>
                    <Image source={{ uri: displayAvatar }} style={styles.avatar} />
                    <View style={styles.messageContent}>
                        <Text style={[styles.sender, !item.IsRead && styles.unreadText]}>
                            {displayName}
                        </Text>
                        <Text style={[styles.messageText, !item.IsRead && styles.unreadText]}>
                            {item.MessageText}
                        </Text>
                    </View>
                    <View style={styles.timeContainer}>
                        <Text style={styles.time}>
                            {new Date(item.SentAt).toLocaleTimeString()}
                        </Text>
                        <Text
                            style={[
                                styles.readStatus,
                                item.IsRead ? styles.read : styles.unread,
                            ]}
                        >
                            {item.IsRead ? '✔️✔️' : '✔️'}
                        </Text>
                    </View>
                </TouchableOpacity>
            )}
            renderHiddenItem={() => (
                <View style={styles.rowBack}>
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => onDelete(item.ChatID)}
                    >
                        <Image source={icons.delete} style={styles.deleteIcon} />
                    </TouchableOpacity>
                </View>
            )}
            rightOpenValue={-75}
            disableRightSwipe
            keyExtractor={(item) => item.MessageID}
        />
    );
};


export default MessageItem;

const styles = StyleSheet.create({
    messageItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 6,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2
    },
    avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 15 },
    messageContent: { flex: 1 },
    sender: { fontSize: 16, color: '#333' },
    messageText: { fontSize: 14, color: '#666', marginTop: 3 },
    unreadText: { fontWeight: 'bold', color: '#000' },
    timeContainer: { alignItems: 'flex-end', justifyContent: 'center' },
    time: { fontSize: 12, color: '#999' },
    readStatus: { fontSize: 14, marginTop: 3 },
    read: { tintColor: colors.primary },
    unread: { color: colors.inactive },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#FF3B30',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 15,
        marginVertical: 6,
        borderRadius: 12
    },
    deleteButton: { justifyContent: 'center', alignItems: 'center', width: 70 },
    deleteIcon: { width: 24, height: 24, tintColor: colors.white },
});
