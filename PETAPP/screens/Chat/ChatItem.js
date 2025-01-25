import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome5';

const ChatItem = (props) => {
    const { name, url, message, time, numOfMessages, userId } = props.user;
    const { onPress } = props;

    return (
        <TouchableOpacity onPress={onPress} style={{ height: 80, padding: 10, flexDirection: 'row', alignItems: 'center' }}>
            <View>
                <Image
                    style={{ width: 50, height: 50, resizeMode: 'cover', borderRadius: 25, marginRight: 15 }}
                    source={{ uri: url }}
                />
                {numOfMessages > 0 && <Text style={{
                    backgroundColor: 'red', position: 'absolute', color: 'white',
                    right: 10, fontSize: 10, borderRadius: 10, paddingHorizontal: numOfMessages > 9 ? 3 : 4,
                }}>{numOfMessages}</Text>}
            </View>
            <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold' }}>{name}</Text>
                <Text>{message}</Text>
                {/* <Text style={{ fontSize: 12, color: 'gray' }}>{time}</Text> */}
            </View>
            {/* <Icon name="chevron-right" size={20} color="gray" /> */}
            <View>
                <Text style={{ fontSize: 12, color: 'gray'}}>{time}</Text>
            </View>
        </TouchableOpacity>
    );
}

export default ChatItem
