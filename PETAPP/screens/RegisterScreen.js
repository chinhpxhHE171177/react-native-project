import React, { useState } from 'react';
import { View, TextInput, Text, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { images, colors } from '../constants';

const RegisterScreen = ({ navigation }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [address, setAddress] = useState('');

    const handleRegister = async () => {
        try {
            const response = await axios.post('http://192.168.1.137:5000/register', {
                FullName: fullName,
                Email: email,
                PasswordHash: password,
                PhoneNumber: phoneNumber,
                Address: address,
                Role: 'Customer',
            });
            Alert.alert("Registration Successful", response.data);
            navigation.navigate('Login');
        } catch (error) {
            Alert.alert(
                "Registration Failed",
                error.response ? error.response.data : "An error occurred"
            );
        }
    };

    return (
        <View style={styles.container}>
            <Image source={images.login_logo} style={styles.image} />
            <Text style={styles.heading}>Welcome to PETCARE</Text>
            <Text style={styles.subheading}>Create your account to get started</Text>

            <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
            />
            <TextInput
                style={styles.input}
                placeholder="Address"
                value={address}
                onChangeText={setAddress}
            />
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Create Account</Text>
            </TouchableOpacity>
            <Text style={styles.loginText} onPress={() => navigation.navigate('Login')}>
                Already have an account? <Text style={styles.link}>Log in</Text>
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.login_color,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 200,
        height: 150,
        marginBottom: 30,
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.purple_color,
        marginBottom: 10,
        textAlign: 'center',
    },
    subheading: {
        fontSize: 16,
        color: colors.title,
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 55,
        borderColor: colors.purple_color,
        borderWidth: 1,
        borderRadius: 15,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: colors.white,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    button: {
        backgroundColor: colors.purple_color,
        borderRadius: 25,
        height: 50,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 3,
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginText: {
        marginTop: 20,
        color: colors.title,
        fontSize: 14,
    },
    link: {
        color: colors.purple_color,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});

export default RegisterScreen;
