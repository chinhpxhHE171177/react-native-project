// TeamScreen.js

import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const CareTeamScreen = () => {
    const teamMembers = [
        {
            name: 'Jenna Smith',
            rating: 4.8,
            bookings: 'New to your team!',
            photo: 'https://randomuser.me/api/portraits/women/10.jpg',
        },
        {
            name: 'Leslie Alexander',
            rating: 4.9,
            bookings: '4 previous bookings\nMost recent booking: 2 day sitting',
            photo: 'https://randomuser.me/api/portraits/men/20.jpg',
        },
        {
            name: 'Jacob Jones',
            rating: 4.7,
            bookings: '3 previous bookings\nMost recent booking: 30 min walk',
            photo: 'https://randomuser.me/api/portraits/men/11.jpg',
        },
    ];

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>My Care Team</Text>
            {teamMembers.map((member, index) => (
                <View key={index} style={styles.card}>
                    <Image source={{ uri: member.photo }} style={styles.profileImage} />
                    <View style={styles.info}>
                        <Text style={styles.name}>{member.name}</Text>
                        <Text style={styles.rating}>{member.rating} ★</Text>
                        <Text style={styles.bookings}>{member.bookings}</Text>
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity style={styles.messageButton}>
                                <Text style={styles.buttonText}>Message</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.bookButton}>
                                <Text style={styles.buttonText}>Book Again</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    card: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 15,
        marginBottom: 15,
        elevation: 5, // For shadow on Android
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    profileImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    info: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    rating: {
        fontSize: 16,
        color: '#f39c12',
    },
    bookings: {
        fontSize: 14,
        color: '#777',
        marginVertical: 5,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    messageButton: {
        backgroundColor: '#3498db',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    bookButton: {
        backgroundColor: '#2ecc71',
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
});

export default CareTeamScreen;
