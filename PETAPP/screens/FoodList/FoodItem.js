import React, { useState, useEffect } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { images, icons, colors } from '../../constants';
import Icon from 'react-native-vector-icons/FontAwesome5';

function _getColorFromStatus(status) {
    if (status.toLowerCase().trim() == 'opening now') {
        return colors.success;
    } else if (status.toLowerCase().trim() == 'closing soon') {
        return colors.alert;
    } else if (status.toLowerCase().trim() == 'cooming soon') {
        return colors.warning;
    } else {
        return colors.success;
    }
}
const FoodItem = (props) => {
    let { name, price, socialNetwork, url, website, status } = props.food //destructuring an boject
    const { onPress } = props;
    return (
        <TouchableOpacity onPress={onPress} style={{ height: 150, paddingTop: 20, paddingLeft: 10, flexDirection: 'row' }}>
            <Image style={{ width: 100, height: 110, resizeMode: 'cover', borderRadius: 10, marginRight: 15 }}
                source={{ uri: url }} />
            <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={{ fontSize: 14, fontWeight: 'bold' }}>{name}</Text>
                <View style={{ borderBottomColor: 'black', borderBottomWidth: 1 }}></View>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 12, color: colors.inactive }}>Status: </Text>
                    <Text style={{ fontSize: 12, color: _getColorFromStatus(status) }}>{status.toUpperCase()}</Text>
                </View>
                <Text style={{ fontSize: 12, color: colors.inactive }}>Price: {price} $</Text>
                <Text style={{ fontSize: 12, color: colors.inactive }}>Food Type: Pizza</Text>
                <Text style={{ fontSize: 12, color: colors.inactive }}>Website: {website}</Text>
                <View style={{ flexDirection: 'row' }}>
                    {socialNetwork['facebook'] != undefined &&
                        <Icon style={{ paddingEnd: 5 }} name="facebook" size={15} color={colors.facebook} />}
                    {socialNetwork['twitter'] != undefined &&
                        <Icon style={{ paddingEnd: 5 }} name="twitter" size={15} />}
                    {socialNetwork['instagram'] != undefined &&
                        <Icon name="instagram" size={15} />}
                </View>
            </View>
        </TouchableOpacity>
    );
}

export default FoodItem;