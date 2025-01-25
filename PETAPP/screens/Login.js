
// import React, { useState, useEffect } from "react";
// import { View, Text, Image, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
// import { images, icons, colors } from '../constants';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import { isValidEmail, isValidPassword } from '../utilies/Validation';
// import { auth, onAuthStateChanged, firebaseRef, firebaseSet, firebaseDatabase, child, get, signInWithEmailAndPassword } from "../Firebase/firebase";

// const Login = (props) => {
//     const [keyboardIsShow, setKeyboardIsShow] = useState(false);
//     const [errorEmail, setErrorEmail] = useState('');
//     const [errorPassword, setErrorPassword] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');

//     const isValidationOK = () =>
//         email.length > 0 && password.length > 0 && isValidEmail(email) && isValidPassword(password);

//     useEffect(() => {
//         const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
//             setKeyboardIsShow(true);
//         });
//         const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
//             setKeyboardIsShow(false);
//         });

//         return () => {
//             keyboardDidShowListener.remove();
//             keyboardDidHideListener.remove();
//         };
//     }, []);

//     const { navigation } = props;
//     const { navigate } = navigation;

//     const handleLogin = () => {
//         if (isValidationOK()) {
//             signInWithEmailAndPassword(auth, email, password)
//                 .then((userCredential) => {
//                     const user = userCredential.user;
//                     navigate('UITabs');
//                 })
//                 .catch((error) => {
//                     alert(`Can't sign in, error: ${error.message}`);
//                 });
//         }
//     };

//     return (
//         <KeyboardAvoidingView
//             behavior={Platform.OS === "ios" ? "padding" : "height"}
//             style={{ flex: 1 }}>
//             <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
//                 <Text style={{ fontSize: 25, fontWeight: 'bold', width: '50%' }}>Already have an Account?</Text>
//                 <Image tintColor={colors.primary} source={images.computer} style={{ width: 125, height: 125, alignSelf: 'center' }} />
//             </View>
//             <View style={{ flex: 1 }}>
//                 <View style={{ marginHorizontal: 15 }}>
//                     <Text style={{ color: colors.primary, fontSize: 14 }}>Email:</Text>
//                     <TextInput
//                         onChangeText={(text) => {
//                             setErrorEmail(isValidEmail(text) ? '' : 'Email is not valid');
//                             setEmail(text);
//                         }}
//                         placeholder="example@gmail.com"
//                         value={email}
//                     />
//                     <View style={{ borderBottomColor: colors.primary, borderBottomWidth: 1, marginBottom: 10 }} />
//                     <Text style={{ color: 'red', marginBottom: 10 }}>{errorEmail}</Text>
//                 </View>
//                 <View style={{ marginHorizontal: 15 }}>
//                     <Text style={{ color: colors.primary, fontSize: 14 }}>Password:</Text>
//                     <TextInput
//                         onChangeText={(text) => {
//                             setErrorPassword(isValidPassword(text) ? '' : 'Password must be at least 6 characters');
//                             setPassword(text);
//                         }}
//                         secureTextEntry={true}
//                         placeholder="Enter your password"
//                         value={password}
//                     />
//                     <View style={{ borderBottomColor: colors.primary, borderBottomWidth: 1, marginBottom: 10 }} />
//                     <Text style={{ color: 'red', marginBottom: 10 }}>{errorPassword}</Text>
//                 </View>
//             </View>
//             {!keyboardIsShow && (
//                 <View style={{ flex: 1 }}>
//                     <TouchableOpacity
//                         disabled={!isValidationOK()}
//                         onPress={handleLogin}
//                         style={{
//                             backgroundColor: isValidationOK() ? colors.primary : colors.disabled,
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                             width: '60%',
//                             alignSelf: 'center',
//                             borderRadius: 15
//                         }}>
//                         <Text style={{ padding: 8, fontSize: 16, color: 'white' }}>Login</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity style={{ padding: 5 }} onPress={() => navigate('Register')}>
//                         <Text style={{ padding: 8, fontSize: 14, color: colors.primary, alignSelf: 'center' }}>New user? Register now</Text>
//                     </TouchableOpacity>
//                 </View>
//             )}
//             {!keyboardIsShow && (
//                 <View style={{ flex: 1 }}>
//                     <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 30 }}>
//                         <View style={{ backgroundColor: 'black', height: 1, flex: 1 }} />
//                         <Text style={{ padding: 8, alignSelf: 'center', marginHorizontal: 8 }}>Use other method?</Text>
//                         <View style={{ backgroundColor: 'black', height: 1, flex: 1 }} />
//                     </View>
//                     <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
//                         <Icon name="facebook" size={30} color={colors.facebook} />
//                         <View style={{ width: 20 }} />
//                         <Icon name="google" size={30} color={colors.google} />
//                     </View>
//                 </View>
//             )}
//         </KeyboardAvoidingView>
//     );
// }

// export default Login;

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function Login({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async () => {
        try {
            const response = await fetch('http://192.168.1.137:9999/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();
            if (response.status === 200) {
                Alert.alert('Success', data.message);
            } else {
                Alert.alert('Error', data.message);
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} />
            <Button title="Register" onPress={() => navigation.navigate('Register')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 16 },
    title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
    input: { borderWidth: 1, padding: 8, marginBottom: 16, borderRadius: 4 },
});
