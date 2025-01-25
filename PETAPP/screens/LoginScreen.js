// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { images, colors, icons } from '../constants';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        axios.post('http://192.168.1.137:5000/login', { Email: email, PasswordHash: password })
            .then(response => {
                if (response.data.auth) {
                    Alert.alert("Login Successful", "Welcome back!");
                    navigation.navigate('Home');
                }
            })
            .catch(error => {
                Alert.alert("Login Failed", error.response.data);
            });
    };

    return (
        <View style={styles.container}>
            <Image source={images.login_logo} style={styles.image} />
            <Text style={styles.heading}>PETCARE</Text>
            <Text style={styles.subheading}>Welcome back! Glad to see you again</Text>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="envelope" size={15} style={styles.icon} />
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    style={styles.inputIcon} />
            </View>


            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Icon name="lock" size={15} style={styles.icon} />
                <TextInput
                    placeholder="Password"
                    secureTextEntry = {true}
                    value={password}
                    onChangeText={setPassword}
                    style={styles.inputIcon} />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>LOGIN</Text>
            </TouchableOpacity>
            <Text style={styles.registerText} onPress={() => navigation.navigate('Register')}>
                Don't have an account? Register
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
        alignItems: 'center'
    },
    image: {
        width: 300,
        height: 300,
        marginBottom: 20,
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        color: colors.purple_color,
        marginBottom: 5,
    },
    subheading: {
        fontSize: 18,
        color: colors.title,
        marginBottom: 20,
    },
    input: {
        width: '100%',
        height: 55,
        borderColor: colors.purple_color,
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 18,
        marginBottom: 18,
        backgroundColor: colors.white,
    },
    inputIcon: {
        flex: 1,
        backgroundColor: colors.white,
        borderColor: colors.purple_color,
        height: 55,
        marginEnd: 5,
        borderWidth: 1,
        borderRadius: 10,
        opacity: 0.8,
        paddingHorizontal: 25,
        marginBottom: 18,
        paddingStart: 40,
    },
    icon: {
        position: 'absolute',
        height: 33,
        paddingStart: 10,
        tintColor: colors.title,
        fontWeight: 'bold',

    },
    button: {
        backgroundColor: colors.purple_color,
        borderRadius: 25,
        height: 50,
        width: '70%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    registerText: {
        marginTop: 20,
        color: colors.title,
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;