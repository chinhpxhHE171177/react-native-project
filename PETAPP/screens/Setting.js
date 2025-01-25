import React, { useState, useEffect } from "react";
import {
    View, Text, Image, TextInput, TouchableOpacity, Alert,
    KeyboardAvoidingView, Platform, Keyboard, ScrollView, Switch
} from "react-native";
import { images, icons, colors } from '../constants';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { UIHeader } from "../components";
import { auth, firebaseDatabase, firebaseRef, firebaseSet } from "../Firebase/firebase";
import { StackActions } from '@react-navigation/native'
const Setting = (props) => {
    const [isEnabled, setIsEnabled] = useState(true);
    const [isEnabledFingerPrint, setIsEnabledFingerPrint] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);
    const toggleSwitchFingerPrint = () => setIsEnabledFingerPrint(previousState => !previousState);

    const { navigation, route } = props
    //function of navigate to/back
    const { navigate, goBack } = navigation

    return (
        <View style={{
            flex: 1,
            backgroundColor: colors.pink_ligth
        }}>
            <UIHeader title={"Settings"} />
            <ScrollView>
                <View style={{
                    height: 40,
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    justifyContent: 'center',
                }}>
                    <Text style={{
                        color: colors.alert,
                        paddingStart: 10, fontSize: 14
                    }}>Common</Text>
                </View>
                <View style={{ flexDirection: 'row', paddingVertical: 10, alignItems: 'center' }}>
                    <Icon
                        name={"globe"}
                        size={20}
                        style={{ marginStart: 10 }}
                        color="black"
                    />
                    <Text style={{
                        colors: 'black',
                        marginStart: 10, fontSize: 14
                    }}>Language</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={{
                        colors: 'black',
                        fontSize: 14,
                        paddingEnd: 10,
                        opacity: 0.5
                    }}>English</Text>
                    <Icon
                        name={"chevron-right"}
                        size={20} color="black"
                        style={{ paddingEnd: 10, opacity: 0.5 }}
                    />
                </View>
                <View style={{ flexDirection: 'row', paddingVertical: 10, alignItems: 'center' }}>
                    <Icon
                        name={"cloud"}
                        size={18}
                        style={{ marginStart: 10 }}
                        color="black"
                    />
                    <Text style={{
                        colors: 'black',
                        marginStart: 10, fontSize: 14
                    }}>Environment</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={{
                        colors: 'black',
                        fontSize: 14,
                        paddingEnd: 10,
                        opacity: 0.5
                    }}>Production</Text>
                    <Icon
                        name={"chevron-right"}
                        size={20} color="black"
                        style={{ paddingEnd: 10, opacity: 0.5 }}
                    />
                </View>
                <View style={{
                    height: 40,
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    justifyContent: 'center',
                }}>
                    <Text style={{
                        color: colors.alert,
                        paddingStart: 10, fontSize: 14
                    }}>Account</Text>
                </View>
                <View style={{ flexDirection: 'row', paddingVertical: 10, alignItems: 'center' }}>
                    <Icon
                        name={"phone"}
                        size={18}
                        style={{ marginStart: 10 }}
                        color="black"
                    />
                    <Text style={{
                        colors: 'black',
                        marginStart: 10, fontSize: 14
                    }}>Phone number</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={{
                        colors: 'black',
                        fontSize: 14,
                        paddingEnd: 10,
                        opacity: 0.5
                    }}></Text>
                    <Icon
                        name={"chevron-right"}
                        size={20} color="black"
                        style={{ paddingEnd: 10, opacity: 0.5 }}
                    />
                </View>
                <View style={{ flexDirection: 'row', paddingVertical: 10, alignItems: 'center' }}>
                    <Icon
                        name={"envelope"}
                        size={18}
                        style={{ marginStart: 10 }}
                        color="black"
                    />
                    <Text style={{
                        colors: 'black',
                        marginStart: 10, fontSize: 14
                    }}>Mail</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={{
                        colors: 'black',
                        fontSize: 14,
                        paddingEnd: 10,
                        opacity: 0.5
                    }}></Text>
                    <Icon
                        name={"chevron-right"}
                        size={20} color="black"
                        style={{ paddingEnd: 10, opacity: 0.5 }}
                    />
                </View>
                <TouchableOpacity style={{ flexDirection: 'row', paddingVertical: 10, alignItems: 'center' }}
                    onPress={() => {
                        auth.signOut()
                        navigation.dispatch(StackActions.popToTop())
                    }}>
                    <Icon
                        name={"sign-out-alt"}
                        size={18}
                        style={{ marginStart: 10 }}
                        color="black"
                    />
                    <Text style={{
                        colors: 'black',
                        marginStart: 10, fontSize: 14
                    }}>Sign out</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={{
                        colors: 'black',
                        fontSize: 14,
                        paddingEnd: 10,
                        opacity: 0.5
                    }}></Text>
                    <Icon
                        name={"chevron-right"}
                        size={20} color="black"
                        style={{ paddingEnd: 10, opacity: 0.5 }}
                    />
                </TouchableOpacity>
                <View style={{
                    height: 40,
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    justifyContent: 'center',
                }}>
                    <Text style={{
                        color: colors.alert,
                        paddingStart: 10, fontSize: 14
                    }}>Security</Text>
                </View>
                <View style={{ flexDirection: 'row', paddingVertical: 10, alignItems: 'center' }}>
                    <Icon
                        name={"lock"}
                        size={18}
                        style={{ marginStart: 10 }}
                        color="black"
                    />
                    <Text style={{
                        colors: 'black',
                        marginStart: 10, fontSize: 14
                    }}>Lock app in background</Text>
                    <View style={{ flex: 1 }} />
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>
                <View style={{ flexDirection: 'row', paddingVertical: 10, alignItems: 'center' }}>
                    <Icon
                        name={"fingerprint"}
                        size={18}
                        style={{ marginStart: 10 }}
                        color="black"
                    />
                    <Text style={{
                        colors: 'black',
                        marginStart: 10, fontSize: 14
                    }}>Use Fingerprint</Text>
                    <View style={{ flex: 1 }} />
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={isEnabledFingerPrint ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitchFingerPrint}
                        value={isEnabledFingerPrint}
                    />
                </View>
                <View style={{ flexDirection: 'row', paddingVertical: 10, alignItems: 'center' }}>
                    <Icon
                        name={"key"}
                        size={18}
                        style={{ marginStart: 10 }}
                        color="black"
                    />
                    <Text style={{
                        colors: 'black',
                        marginStart: 10, fontSize: 14
                    }}>Change password</Text>
                    <View style={{ flex: 1 }} />
                    <Switch
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                        thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={toggleSwitch}
                        value={isEnabled}
                    />
                </View>
                <View style={{
                    height: 40,
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    justifyContent: 'center',
                }}>
                    <Text style={{
                        color: colors.alert,
                        paddingStart: 10, fontSize: 14
                    }}>Misc</Text>
                </View>
                <View style={{ flexDirection: 'row', paddingVertical: 10, alignItems: 'center' }}>
                    <Icon
                        name={"file-alt"}
                        size={18}
                        style={{ marginStart: 10 }}
                        color="black"
                    />
                    <Text style={{
                        colors: 'black',
                        marginStart: 10, fontSize: 14
                    }}>Term of Service</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={{
                        colors: 'black',
                        fontSize: 14,
                        paddingEnd: 10,
                        opacity: 0.5
                    }}></Text>
                    <Icon
                        name={"chevron-right"}
                        size={20} color="black"
                        style={{ paddingEnd: 10, opacity: 0.5 }}
                    />
                </View>
                <View style={{ flexDirection: 'row', paddingVertical: 10, alignItems: 'center' }}>
                    <Icon
                        name={"file-upload"}
                        size={18}
                        style={{ marginStart: 10 }}
                        color="black"
                    />
                    <Text style={{
                        colors: 'black',
                        marginStart: 10, fontSize: 14
                    }}>Open source license</Text>
                    <View style={{ flex: 1 }} />
                    <Text style={{
                        colors: 'black',
                        fontSize: 14,
                        paddingEnd: 10,
                        opacity: 0.5
                    }}></Text>
                    <Icon
                        name={"chevron-right"}
                        size={20} color="black"
                        style={{ paddingEnd: 10, opacity: 0.5 }}
                    />
                </View>
            </ScrollView>
        </View>
    );
}

export default Setting;