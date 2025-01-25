import React, { useEffect, useState } from "react";
import {
    View, Text, FlatList
} from "react-native";
import { UIHeader } from "../../components";
import ChatItem from "./ChatItem";
import Icon from 'react-native-vector-icons/FontAwesome5';
import {
    auth, onAuthStateChanged, firebaseRef, firebaseSet,
    firebaseDatabase, createUser, WithEmailAndPassword, sendEmailVerification, get, child, onValue
} from "../../Firebase/firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Chat = (props) => {
    const [users, setUsers] = useState([
        // {
        //     url: 'https://ts2.mm.bing.net/th?q=Tantan%20evan',
        //     name: 'Tantan evan',
        //     message: 'Hi, how are you?',
        //     time: '10:00 AM'
        // },
        // {
        //     url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1KsfPMG1VwKWzJ3wQ1wcOPD_ukolWNO6wpg&s',
        //     name: 'Oki Shutto',
        //     message: 'I miss you!',
        //     time: '13:10 PM'
        // },
        // {
        //     url: 'https://pbs.twimg.com/media/GCG-0lcW4AATQwi.jpg',
        //     name: 'Hiroto',
        //     message: 'Are you free tonight?',
        //     time: '09:12 AM'
        // },
        // {
        //     url: 'https://64.media.tumblr.com/c823728a85c52341ede6f7a3a986649d/686f03700bd48811-a6/s1280x1920/b1da25d36a004d9277f65ae2593227dcca84d69b.jpg',
        //     name: 'Kai Young',
        //     message: 'Do you want to play with me?',
        //     time: '11:00 PM'
        // },
        // {
        //     url: 'https://pbs.twimg.com/media/GDzcLfWakAA3xwe.jpg',
        //     name: 'Itto',
        //     message: 'Why you don’t answer me?',
        //     time: '10:00 AM'
        // }
    ]);

    const { navigation } = props;
    const { navigate } = navigation;

    useEffect(() => {
        onValue(firebaseRef(firebaseDatabase, 'users') // Reference to 'users' in the database
            , async (snapshot) => {
                if (snapshot.exists()) {
                    const snapShotObject = snapshot.val();
                    const stringUser = await AsyncStorage.getItem('user');
                    const myUserId = JSON.parse(stringUser).userId

                    setUsers(Object.keys(snapShotObject)
                        .filter(eachKey => eachKey != myUserId).map(eachKey => {
                            let eachObject = snapShotObject[eachKey]
                            return {
                                url: 'https://energyintel.brightspotcdn.com/dims4/default/3de8921/2147483647/strip/true/crop/661x661+70+0/resize/240x240!/quality/90/?url=http://energy-intelligence-brightspot.s3.us-east-2.amazonaws.com/31/48/8a3f6715429fbb60f027d8f05f31/management-icon.png',
                                name: eachObject.email,
                                email: eachObject.email,
                                accessToken: eachObject.accessToken,
                                numOrUnreadMessages: 0,
                                userId: eachKey,
                            }
                        }))
                } else {
                    console.log('No data available');
                }
            }, (error) => {
                console.error("Error fetching users: ", error);
            });
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <UIHeader title={"Notifications"}
                leftIconName={"arrow-left"}
                rightIconName={"search"}
                onPressLeftIcon={() => alert('Press left icon')}
                onPressRightIcon={() => alert('Press right icon')}
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 14 }}>
                <Text style={{ padding: 15, fontSize: 12 }}>6 unread messages</Text>
                <Icon name={"trash"}
                    style={{ padding: 15 }}
                    size={13}
                    color={'black'}
                    onPress={() => alert('Press trash icon')} />
            </View>
            <FlatList
                style={{ flex: 1 }}
                data={users}
                renderItem={({ item }) => (
                    <ChatItem key={item.url} user={item} onPress={() => navigate('Messenger', { user: item })} />
                )}
                keyExtractor={(item) => item.url}
            />
        </View>
    );
}

export default Chat;


