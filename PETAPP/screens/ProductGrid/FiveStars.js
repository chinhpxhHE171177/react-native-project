import React, { useState, useEffect } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Keyboard, FlatList } from "react-native";
import { images, icons, colors } from '../../constants';
import Icon from 'react-native-vector-icons/FontAwesome5';

const FiveStars = (props) => {
    const { numberOfStars } = props;
    return (
        <View style={{ flexDirection: "row" }}>
            {[0, 1, 2, 3, 4].map((item) => {
                const isRated = item < numberOfStars; // Xác định ngôi sao được tô màu
                const isFullStar = item < Math.floor(numberOfStars); // Fully filled stars
                const isHalfStar = item === Math.floor(numberOfStars) && numberOfStars % 1 !== 0; // Half-filled star
                return (
                    <View
                        key={item}
                        style={{
                            width: 12,
                            height: 12,
                            marginHorizontal: 1,
                            justifyContent: "center",
                            alignItems: "center",
                            backgroundColor: isRated ? colors.warning : colors.inactive, // Màu nền cho ngôi sao
                            borderRadius: 8, 
                        }}
                    >
                        <Icon
                            name={isFullStar ? "star" : isHalfStar ? "star-half-alt" : "star"}
                            size={10}
                            color="#fff" 
                        />
                    </View>
                );
            })}
        </View>
    );
};

export default FiveStars;


