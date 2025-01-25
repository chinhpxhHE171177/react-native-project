import React, { useState, useEffect } from "react";
import { Text, View, Image, ImageBackground, TouchableOpacity, Alert } from "react-native";
import { images, icons } from '../constants'; // duoc hieu la constants/index 
import Icon from "react-native-vector-icons/FontAwesome";
import { UIButton } from '../components'
import { auth, onAuthStateChanged, firebaseRef, firebaseSet, firebaseDatabase } from "../Firebase/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
function Welcome(props) {
    //state => when a state is changed => UI is loaded
    //like getter/setter
    const [types, setTypes] = useState([
        {
            name: 'Influencer',
            isSelected: true,
        },
        {
            name: 'Business',
            isSelected: false,

        },
        {
            name: 'Individual',
            isSelected: false,
        }
    ]);

    //navigation
    const { navigation, route } = props
    //function of navigate to/back
    const { navigate, goBack } = navigation
    useEffect(() => {
        onAuthStateChanged(auth, (resUser) => {
            if (resUser) {
                //signin
               // const userId = resUser.uid
                //save data to firebase
                let user = {
                    userId: resUser.uid,
                    email: resUser.email,
                    //tokenKey: user.tokenKey
                    emailVerified: resUser.emailVerified,
                    accessToken: resUser.accessToken
                }
                firebaseSet(firebaseRef
                    (firebaseDatabase, `users/${resUser.uid}`),user)
                //save user in local storage 
                // install library yarn add @react-native-async-storage/async-storage
                AsyncStorage.setItem('user', JSON.stringify(user))
                navigate('UITab')
            }
        })
    })
    return (
        <View style={{ backgroundColor: '#0190FF', flex: 100 }}>
            <ImageBackground source={images.background} resizeMode="cover" style={{ flex: 100 }}>
                <View style={{ flex: 20, height: 50 }}>
                    <View style={{ flexDirection: 'row', height: 50, justifyContent: 'flex-start', alignItems: 'center' }}>
                        <Image source={icons.icon_fire} style={{ width: 30, height: 30, marginStart: 10, marginEnd: 5 }} />
                        <Text style={{ color: 'white', fontSize: 18, paddingTop: 10 }}>MYAPP.CO</Text>
                        <View style={{ flex: 1 }} />
                        <Image source={icons.icon_question} style={{ width: 20, height: 20, tintColor: 'white', marginRight: 10 }} />
                    </View>
                </View>
                <View style={{ flex: 20, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={{ marginBottom: 8, color: 'white', fontSize: 12 }}>Welcome to</Text>
                    <Text style={{ marginBottom: 8, color: 'white', fontWeight: 'bold' }}>MYAPP.CO</Text>
                    <Text style={{ marginBottom: 8, color: 'white', fontSize: 12 }}>Please select your account type</Text>
                </View>
                <View style={{ flex: 40 }}>
                    {/* C1: anh xa Component */}
                    {types.map((eachType, index) => (
                        <UIButton
                            key={index}
                            onPress={() => {
                                let newTypes = types.map(eachNewType => ({
                                    ...eachNewType,
                                    isSelected: eachNewType.name === eachType.name,
                                }));
                                setTypes(newTypes);
                            }}
                            title={eachType.name}
                            isSelected={eachType.isSelected}
                        />
                    ))}

                    {/* C2: cach thu cong */}
                    {/* <UIButton onPress={() => {
                        //Alert.alert('You press this button');
                    }} title="Influencer" isSelected={true} />
                    <UIButton onPress={() => {
                        //Alert.alert('You press this button');
                    }} title="Business" isSelected={false} />
                    <UIButton onPress={() => {
                        //Alert.alert('You press this button');
                    }} title="Individual" isSelected={false} /> */}
                </View>
                <View style={{ flex: 20 }}>
                    <UIButton onPress={() => {
                        navigate('Login')
                    }} title="LOGIN" isSelected={false} />
                    <Text style={{
                        color: 'white',
                        fontSize: 14,
                        alignSelf: 'center'
                    }}>Want to register new Account ?</Text>
                    <TouchableOpacity style={{ padding: 5 }}
                        onPress={() => {
                            //Alert.alert('You press this button');
                            navigate('Register')
                        }}>
                        <Text style={{
                            color: 'blue',
                            fontWeight: 'bold',
                            fontSize: 14,
                            alignSelf: 'center',
                            textDecorationLine: 'underline'
                        }}>Register</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground >
        </View >
    );
}

export default Welcome;