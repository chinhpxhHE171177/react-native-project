import React, { Component } from "react";
import { TouchableOpacity, Text, View } from "react-native";
//import Icon from "react-native-vector-icons/FontAwesome";
import Icon from 'react-native-vector-icons/MaterialIcons';
function UIButton(props) {
    const { onPress, title, isSelected } = props;
    return (
        <TouchableOpacity onPress={props.onPress}
            style={{
                borderColor: 'white', borderWidth: 1, borderRadius: 5, marginHorizontal: 15,
                marginVertical: 10, height: 45, justifyContent: 'center', alignItems: 'center',
                backgroundColor: isSelected ? '#4CAF50' : 'transparent'
            }}>
            {isSelected == true &&
                <Icon name="check-circle" size={20} style={{ color: 'green', position: 'absolute', left: 10, top: 10 }} />
            }
            <Text style={{ color: isSelected ? 'black' : 'white', fontSize: 14 }}>{title}</Text>
        </TouchableOpacity>
    );
}

export default UIButton;