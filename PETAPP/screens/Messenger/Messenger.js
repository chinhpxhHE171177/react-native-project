// import React, { useState, useEffect } from "react";
// import {
//     View, Text, FlatList,
//     TextInput,
//     TouchableOpacity,
//     Keyboard
// } from "react-native";
// import { UIHeader } from "../../components";
// import MessengerItem from "./MessengerItem";
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import { colors } from "../../constants";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { auth, onAuthStateChanged, firebaseRef, firebaseSet, firebaseDatabase, onValue } from "../../Firebase/firebase";

// const Messenger = (props) => {
//     const [typedText, setTypedText] = useState('');
//     const [chatHistory, setChatHistory] = useState([
//         {
//             id: 1,
//             url: 'https://ts2.mm.bing.net/th?q=Tantan%20evan',
//             showUrl: true,
//             isSender: true,
//             messengers: "Hi, how are you?",
//             timeStamp: 1641654208000,
//         },
//         {
//             id: 2,
//             url: 'https://ts2.mm.bing.net/th?q=Tantan%20evan',
//             showUrl: false,
//             isSender: true,
//             messengers: "I miss you!",
//             timeStamp: 1641654238000,
//         },
//         {
//             id: 3,
//             url: 'https://ts2.mm.bing.net/th?q=Tantan%20evan',
//             showUrl: false,
//             isSender: true,
//             messengers: "I want next to you",
//             timeStamp: 1641654298000,
//         },
//         {
//             id: 4,
//             url: 'https://ts2.mm.bing.net/th?q=Tantan%20evan',
//             showUrl: false,
//             isSender: true,
//             messengers: "We can meet in the night",
//             timeStamp: 1641654538000,
//         },
//         {
//             id: 5,
//             url: 'https://randomuser.me/api/portraits/men/10.jpg',
//             showUrl: true,
//             isSender: false,
//             messengers: "I'm great! Thanks",
//             timeStamp: 1641654598000,
//         },
//         {
//             id: 6,
//             url: 'https://randomuser.me/api/portraits/men/10.jpg',
//             showUrl: false,
//             isSender: false,
//             messengers: "I don't think that we can meet in the night",
//             timeStamp: 1641654698000,
//         },
//         {
//             id: 7,
//             url: 'https://ts2.mm.bing.net/th?q=Tantan%20evan',
//             showUrl: true,
//             isSender: true,
//             messengers: "Why we can't meet in the nigth?",
//             timeStamp: 1641654599000,
//         },
//         {
//             id: 8,
//             url: 'https://ts2.mm.bing.net/th?q=Tantan%20evan',
//             showUrl: false,
//             isSender: true,
//             messengers: "Please let me know",
//             timeStamp: 1641654600000,
//         },

//     ]);

//     useEffect(() => {
//         onValue(firebaseRef(firebaseDatabase, 'chats'), async (snapshot) => {
//             if (snapshot.exists()) {
//                 const snapShotObject = snapshot.val();
//                 let updatedChatHistory = Object.keys(snapShotObject)
//                     .filter(eachKey => eachKey.includes(myUserId))
//                     .map(eachKey => {
//                         return {
//                             ...snapShotObject[eachKey],
//                             isSender: eachKey.split('-')[0] === myUserId,
//                             url: 'https://randomuser.me/api/portraits/men/07.jpg', // Update this to the correct user image
//                         };
//                     })
//                     .sort((item1, item2) => item1.timeStamp - item2.timeStamp);

//                 for (let i = 0; i < updatedChatHistory.length; i++) {
//                     const item = updatedChatHistory[i];
//                     item.showUrl = (i === 0) ? true : item.isSender !== updatedChatHistory[i - 1].isSender;
//                 }
//                 setChatHistory(updatedChatHistory);
//             } else {
//                 console.log('No data available');
//             }
//         }, (error) => {
//             console.error("Error fetching users: ", error);
//         });
//     }, []);

//     const { url, name, userId } = props.route.params.user
//     const { navigate, goBack } = props.navigation

//     return (
//         <View style={{ flex: 1 }}>
//             <UIHeader title={name}
//                 leftIconName={"arrow-left"}
//                 rightIconName={"ellipsis-v"}
//                 onPressLeftIcon={() =>
//                     goBack()
//                 }
//                 onPressRightIcon={() => alert('Press right icon')}
//             />
//             {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingTop: 14 }}>
//                 <Text style={{ padding: 15, fontSize: 12 }}>6 unread messages</Text>
//                 <Icon name={"trash"}
//                     style={{ padding: 15 }}
//                     size={13}
//                     color={'black'}
//                     onPress={() => alert('Press trash icon')} />
//             </View> */}
//             <FlatList
//                 style={{ flex: 1 }}
//                 data={chatHistory}
//                 renderItem={({ item }) => (
//                     <MessengerItem key={item.id.toString()} item={item} onPress={() => alert(`You pressed item's name: ${item.name}`)} />
//                 )}
//                 keyExtractor={(item) => item.id.toString()}
//             />
//             <View style={{
//                 height: 50,
//                 position: 'absolute',
//                 bottom: 0,
//                 left: 0,
//                 right: 0,
//                 flexDirection: 'row',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//             }}>
//                 <TextInput
//                     onChangeText={(text) => setTypedText(text)}
//                     style={{ color: 'black', paddingStart: 10 }}
//                     placeholder="Enter your message here"
//                     value={typedText}
//                     placeholderTextColor={colors.placeholder}
//                 />

//                 <TouchableOpacity
//                     onPress={async () => {
//                         try {
//                             if (!typedText || typedText.trim().length === 0) {
//                                 return; // Don't send an empty message
//                             }
//                             let stringUser = await AsyncStorage.getItem('user');
//                             if (!stringUser) {
//                                 alert('User  data not found');
//                                 return;
//                             }
//                             let myUserId = JSON.parse(stringUser).userId;
//                             let userIdOther = props.route.params.user.userId;
//                             let newChatHistory = {
//                                 id: Date.now(), // Use a unique ID
//                                 url: 'https://randomuser.me/api/portraits/men/10.jpg', // Update this to the sender's image
//                                 showUrl: false,
//                                 isSender: true, // Set to true for the sender
//                                 messengers: typedText,
//                                 timeStamp: new Date().getTime(),
//                             };
//                             Keyboard.dismiss(); // hide keyboard
//                             // Save to FirebaseDb
//                             await firebaseSet(firebaseRef(firebaseDatabase, `chats/${myUserId}-${userIdOther} `), newChatHistory);
//                             setTypedText(''); // Clear input
//                         } catch (error) {
//                             console.error("Error sending message: ", error);
//                             alert('Failed to send message');
//                         }
//                     }}
//                     style={{ padding: 10, backgroundColor: colors.alert }} // Add padding for touch area
//                 >
//                     <Icon name="paper-plane" size={25} color={colors.facebook} />
//                 </TouchableOpacity>
//             </View>
//         </View>
//     );
// }

// export default Messenger;



import React, { useState, useEffect } from "react";
import {
    View, Text, FlatList,
    TextInput,
    TouchableOpacity,
    Keyboard
} from "react-native";
import { UIHeader } from "../../components";
import MessengerItem from "./MessengerItem";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { colors } from "../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { firebaseRef, firebaseSet, firebaseDatabase, onValue } from "../../Firebase/firebase";

const Messenger = (props) => {
    const [typedText, setTypedText] = useState('');
    const [chatHistory, setChatHistory] = useState([]);

    useEffect(() => {
        const fetchChatHistory = async () => {
            const stringUser = await AsyncStorage.getItem('user');
            const myUserId = JSON.parse(stringUser).userId;
            const userIdOther = props.route.params.user.userId;

            // Create a unique chat key
            const chatKey = myUserId < userIdOther ? `${myUserId}-${userIdOther}` : `${userIdOther}-${myUserId}`;

            onValue(firebaseRef(firebaseDatabase, `chats/${chatKey}`), (snapshot) => {
                if (snapshot.exists()) {
                    const snapShotObject = snapshot.val();
                    const updatedChatHistory = Object.keys(snapShotObject)
                        .map(key => ({
                            ...snapShotObject[key],
                            isSender: snapShotObject[key].senderId === myUserId,
                            url: 'https://randomuser.me/api/portraits/men/10.jpg', // Update this to the correct user image
                        }))
                        .sort((item1, item2) => item1.timeStamp - item2.timeStamp);

                    setChatHistory(updatedChatHistory);
                } else {
                    console.log('No data available');
                }
            }, (error) => {
                console.error("Error fetching chat history: ", error);
            });
        };

        fetchChatHistory();
    }, []);

    const { name } = props.route.params.user;
    const { goBack } = props.navigation;

    return (
        <View style={{ flex: 1 }}>
            <UIHeader title={name}
                leftIconName={"arrow-left"}
                rightIconName={"ellipsis-v"}
                onPressLeftIcon={() => goBack()}
                onPressRightIcon={() => alert('Press right icon')}
            />
            <FlatList
                style={{ flex: 1 }}
                data={chatHistory}
                renderItem={({ item }) => (
                    <MessengerItem key={item.id.toString()} item={item} />
                )}
                keyExtractor={(item) => item.id.toString()}
            />
            <View style={{
                height: 50,
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <TextInput
                    onChangeText={(text) => setTypedText(text)}
                    style={{ color: 'black', paddingStart: 10 }}
                    placeholder="Enter your message here"
                    value={typedText}
                    placeholderTextColor={colors.placeholder}
                />
                <TouchableOpacity
                    onPress={async () => {
                        if (!typedText || typedText.trim().length === 0) return; // Don't send an empty message
                        const stringUser = await AsyncStorage.getItem('user');
                        const myUserId = JSON.parse(stringUser).userId;
                        const userIdOther = props.route.params.user.userId;

                        // Create a unique chat key
                        const chatKey = myUserId < userIdOther ? `${myUserId}-${userIdOther}` : `${userIdOther}-${myUserId}`;

                        const newMessage = {
                            id: Date.now(),
                            senderId: myUserId,
                            messengers: typedText,
                            timeStamp: new Date().getTime(),
                        };

                        // Save to FirebaseDb
                        await firebaseSet(firebaseRef(firebaseDatabase, `chats/${chatKey}/${newMessage.id}`), newMessage);
                        setTypedText(''); // Clear input
                        Keyboard.dismiss(); // hide keyboard
                    }}
                    style={{ padding: 10, backgroundColor: colors.alert }} // Add padding for touch area
                >
                    <Icon name="paper-plane" size={25} color={colors.facebook} />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Messenger;