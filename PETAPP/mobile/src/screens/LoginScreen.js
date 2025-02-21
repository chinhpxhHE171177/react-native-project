import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { loginUser } from '../services/api';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { images, colors, icons } from '../constants';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    try {
      const response = await loginUser({ Email: email, Password: password });

      // Lưu token và userId vào AsyncStorage
      await AsyncStorage.setItem('userToken', response.token);
      await AsyncStorage.setItem('userID', response.userId.toString());
      await AsyncStorage.setItem('role', response.role);
      await AsyncStorage.setItem('fullName', response.fullName);
      await AsyncStorage.setItem('url', response.url);

      Alert.alert('Success', 'Login successful!');
      navigation.navigate('UITabs', { token: response.token });
    } catch (error) {
      Alert.alert('Error', error);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={images.login_logo} style={styles.image} />
      <Text style={styles.heading}>PETCARE</Text>
      <Text style={styles.subheading}>Welcome back! Glad to see you again</Text>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name="envelope" size={15} style={styles.icon} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Icon name="lock" size={15} style={styles.icon} />
        <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry={true} />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Don't have an account? Register</Text>
      </TouchableOpacity>
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
    marginBottom: 10,
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
  link: {
    color: colors.purple_color,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  }
});

export default LoginScreen;
