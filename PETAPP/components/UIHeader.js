import React, { Component } from "react";
import { TouchableOpacity, Text, View } from "react-native";
import { images, icons, colors } from '../constants';
import Icon from "react-native-vector-icons/FontAwesome";
//import Icon from 'react-native-vector-icons/MaterialIcons';

const UIHeader = (props) => {
    const {
        title,
        leftIconName,
        rightIconName,
        onPressLeftIcon,
        onPressRightIcon } = props;
    return (
        <View >
            <View style={{ height: 55, backgroundColor: colors.alert, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                {leftIconName != undefined ? <Icon name={leftIconName}
                    style={{ padding: 10 }}
                    size={20}
                    color={'white'}
                    onPress={onPressLeftIcon} /> : <View style={{ width: 50, height: 50}} />}
                <Text style={{
                    fontSize: 16,
                    alignSelf: 'center',
                    lineHeight: 45, color: 'white',
                }}>{title}</Text>
                {rightIconName != undefined ? <Icon name={rightIconName}
                    style={{ padding: 10 }}
                    size={20}
                    color={'white'}
                    onPress={onPressRightIcon} /> : <View style={{ width: 50, height: 50 }} />}
            </View>
        </View>
    );
}

export default UIHeader;