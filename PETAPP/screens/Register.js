// import React, { useState, useEffect } from "react";
// import { View, Text, Image, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
// import { images, icons, colors } from '../constants';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import { isValidEmail, isValidPassword, isValidRePassword } from '../utilies/Validation';
// import { auth, onAuthStateChanged, firebaseRef, firebaseSet, firebaseDatabase, createUserWithEmailAndPassword, sendEmailVerification } from "../Firebase/firebase";
// /**
//  idUserA: idUserB : {
//     "message": "How are you",
//     "timestamp": 123454545
//     }
//  */

// const Register = (props) => {
//     const [keyboardIsShow, setKeyboardIsShow] = useState(false);
//     //state for validate form
//     const [errorEmail, setErrorEmail] = useState('');
//     const [errorPassword, setErrorPassword] = useState('');
//     const [errorRePassword, setErrorRePassword] = useState('');
//     //state store value of email and password
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [rePassword, setRePassword] = useState('');
//     const isValidationOK = () =>
//         email.length > 0 && password.length > 0 && rePassword.length > 0 && isValidEmail(email) == true
//         && isValidPassword(password) == true && isValidRePassword(password, rePassword) == true

//     useEffect(() => {
//         //componentDidMount
//         Keyboard.addListener('keyboardDidShow', () => {
//             setKeyboardIsShow(true);
//         })
//         Keyboard.addListener('keyboardDidHide', () => {
//             setKeyboardIsShow(false);
//         })
//         const xx = auth
//     })


//     //navigation
//     const { navigation, route } = props
//     //function of navigate to/back
//     const { navigate, goBack } = navigation

//     return (
//         <KeyboardAvoidingView
//             behavior={Platform.OS === "ios" ? "padding" : "height"}
//             style={{ flex: 100, backgroundColor: colors.primary }}>
//             <View style={{ flex: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' }}>
//                 <Text style={{ fontSize: 25, fontWeight: 'bold', width: '50%' }}>Already have an Account?</Text>
//                 <Image tintColor={colors.white} source={images.computer} style={{ width: 125, height: 125, alignSelf: 'center' }} />
//             </View>
//             <View style={{ flex: 45, backgroundColor: colors.white, padding: 10, margin: 10, borderRadius: 15 }}>
//                 <View style={{ marginHorizontal: 15 }}>
//                     <Text style={{ color: colors.primary, fontSize: 14 }}>Email:</Text>
//                     <TextInput onChangeText={(text) => {
//                         setErrorEmail(isValidEmail(text) == true ? '' : 'Email is not valid');
//                         setEmail(text)
//                     }}
//                         placeholder="example@gmail.com" />
//                     <View style={{ borderBottomColor: colors.primary, borderBottomWidth: 1, marginBottom: 10 }}></View>
//                     <Text style={{ color: 'red', marginBottom: 10 }}>{errorEmail}</Text>
//                 </View>
//                 <View style={{ marginHorizontal: 15 }}>
//                     {/* Password Field */}
//                     <Text style={{ color: colors.primary, fontSize: 14 }}>Password:</Text>
//                     <TextInput
//                         onChangeText={(text) => {
//                             setErrorPassword(isValidPassword(text) ? '' : 'Password must be at least 6 characters');
//                             setPassword(text);
//                         }}
//                         secureTextEntry={true}
//                         placeholder="Enter your password"
//                     />
//                     <View style={{ borderBottomColor: colors.primary, borderBottomWidth: 1, marginBottom: 10 }}></View>
//                     <Text style={{ color: 'red', marginBottom: 10 }}>{errorPassword}</Text>
//                 </View>

//                 <View style={{ marginHorizontal: 15 }}>
//                     {/* Re-Password Field */}
//                     <Text style={{ color: colors.primary, fontSize: 14 }}>Re-Password:</Text>
//                     <TextInput
//                         onChangeText={(text) => {
//                             setErrorRePassword(
//                                 isValidRePassword(password, text) ? '' : 'Re-Password must be the same as Password'
//                             );
//                             setRePassword(text);
//                         }}
//                         secureTextEntry={true}
//                         placeholder="Re-Enter your password"
//                     />
//                     <View style={{ borderBottomColor: colors.primary, borderBottomWidth: 1, marginBottom: 10 }}></View>
//                     <Text style={{ color: 'red', marginBottom: 10 }}>{errorRePassword}</Text>
//                 </View>

//                 {keyboardIsShow == false &&
//                     <View>
//                         <TouchableOpacity
//                             disabled={isValidationOK() == false}
//                             onPress={() => {
//                                 //Alert.alert(`Email: ${email}, Password: ${password}`)
//                                 createUserWithEmailAndPassword(auth, email, password)
//                                     .then((userCredential) => {
//                                         const user = userCredential.user

//                                         sendEmailVerification(user).then(() => {
//                                             console.log('Email verification sent!')
//                                         })
//                                         // firebaseSet(firebaseRef(firebaseDatabase, `users/${user.uid}`),
//                                         //     {
//                                         //         email: user.email,
//                                         //         //tokenKey: user.tokenKey
//                                         //         emailVerified: user.emailVerified,
//                                         //         accessToken: user.accessToken
//                                         //     })
//                                         navigate('UITabs')
//                                     }).catch((error) => {
//                                         alert(`Can't signin, error: ${error.message}`);
//                                     })
//                             }} style={{
//                                 backgroundColor: isValidationOK() == true ? colors.primary : colors.disabled, justifyContent: 'center', alignItems: 'center',
//                                 width: '60%', alignSelf: 'center', borderRadius: 15
//                             }}>
//                             <Text style={{ padding: 8, fontSize: 16, color: 'white' }}>Register</Text>
//                         </TouchableOpacity>
//                         <TouchableOpacity style={{ padding: 5 }} onPress={() => {
//                             Alert.alert('Register now');
//                         }}>
//                         </TouchableOpacity>
//                     </View>}
//             </View>
//             {keyboardIsShow == false &&
//                 <View style={{ flex: 20 }}>
//                     <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 30 }}>
//                         <View style={{ backgroundColor: 'black', height: 1, flex: 1 }}></View>
//                         <Text style={{ padding: 8, alignSelf: 'center', marginHorizontal: 8, color: 'white' }}>Use other method ?</Text>
//                         <View style={{ backgroundColor: 'black', height: 1, flex: 1 }}></View>
//                     </View>
//                     <View style={{
//                         flexDirection: 'row',
//                         justifyContent: 'center'
//                     }}>
//                         <Icon name="facebook" size={30} color={colors.facebook} />
//                         <View style={{ width: 20 }} />
//                         <Icon name="google" size={30} color={colors.google} />
//                     </View>
//                 </View>}
//         </KeyboardAvoidingView>
//     );
// }

// export default Register;


import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function Register({ navigation }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegister = async () => {
        try {
            const response = await fetch('http://192.168.1.137:9999/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });
            const data = await response.json();
            if (response.status === 201) {
                Alert.alert('Success', data.message);
                navigation.navigate('Login');
            } else {
                Alert.alert('Error', data.message);
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
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
            <Button title="Register" onPress={handleRegister} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 16 },
    title: { fontSize: 24, marginBottom: 16, textAlign: 'center' },
    input: { borderWidth: 1, padding: 8, marginBottom: 16, borderRadius: 4 },
});
