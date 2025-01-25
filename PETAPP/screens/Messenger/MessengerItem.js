import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';
import { colors } from "../../constants";
import { screenWidth } from "../../utilies/Device";

const MessengerItem = (props) => {
    const { onPress } = props;
    const { url, isSender, messengers, timeStamp, showUrl } = props.item;

    return (
        // isSend = true
        isSender == true ? <TouchableOpacity
            onPress={onPress}
            style={{ padding: 5, marginHorizontal: 10, flexDirection: 'row', alignItems: 'center' }}
        >
            {showUrl == true ? <Image
                style={{
                    width: 40,
                    height: 40,
                    resizeMode: 'cover',
                    borderRadius: 20,
                    marginRight: 15,
                }}
                source={{ uri: url }}
            /> : <View style={{ width: 40, height: 40, resizeMode: 'cover', borderRadius: 20, marginRight: 15 }} />}
            <View style={{ flex: 1, flexDirection: 'row', paddingEnd: 20 }}>
                <View>
                    <Text
                        style={{
                            paddingVertical: 6,
                            backgroundColor: colors.messageSender,
                            borderRadius: 10,
                            paddingHorizontal: 4,
                        }}
                    >
                        {messengers}
                    </Text>
                </View>
            </View>
        </TouchableOpacity> :
            // isSend = false
            <TouchableOpacity
                onPress={onPress}
                style={{ padding: 5, marginHorizontal: 10, flexDirection: 'row', alignItems: 'center' }}
            >

                <View style={{ flex: 1, flexDirection: 'row', paddingStart: 20, justifyContent: 'flex-end' }}>
                    <View>
                        <Text
                            style={{
                                paddingVertical: 6,
                                backgroundColor: colors.messageReceiver,
                                borderRadius: 10,
                                color: 'white',
                                paddingHorizontal: 4,
                                marginLeft: 47
                            }}
                        >
                            {messengers}
                        </Text>
                    </View>
                    <View style={{ width: 20 }}></View>
                </View>
                {showUrl == true ? <Image
                    style={{
                        width: 40,
                        height: 40,
                        resizeMode: 'cover',
                        borderRadius: 20,
                    }}
                    source={{ uri: url }}
                /> : <View style={{ width: 40, height: 40, resizeMode: 'cover', borderRadius: 20 }} />}
            </TouchableOpacity>
    )
};

export default MessengerItem;

// const MessengerItem = (props) => {
//     const { onPress } = props;
//     const { url, isSender, messengers, timeStamp, showUrl } = props.item;

//     return (
//         <TouchableOpacity
//             onPress={onPress}
//             style={{ padding: 5, marginHorizontal: 10, flexDirection: 'row', alignItems: 'center' }}
//         >
//             {showUrl && (
//                 <Image
//                     style={{
//                         width: 40,
//                         height: 40,
//                         resizeMode: 'cover',
//                         borderRadius: 20,
//                         marginRight: 15,
//                     }}
//                     source={{ uri: url }}
//                 />
//             )}
//             <View style={{ flex: 1, flexDirection: 'row', paddingEnd: 20 }}>
//                 <Text
//                     style={{
//                         paddingVertical: 6,
//                         backgroundColor: isSender ? colors.messageSender : colors.messageReceiver,
//                         borderRadius: 10,
//                         paddingHorizontal: 4,
//                         color: isSender ? 'black' : 'white',
//                     }}
//                 >
//                     {messengers}
//                 </Text>
//             </View>
//         </TouchableOpacity>
//     );
// };