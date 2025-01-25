import React, { useState, useEffect } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Keyboard, FlatList } from "react-native";
import { images, icons, colors } from '../../constants';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FiveStars from "./FiveStars";

const GridItem = (props) => {
    const { item, index, products, setProducts } = props;
    return (
        <View style={{
            flex: 1,
            //height: 200,
            marginLeft: index % 2 == 0 ? 10 : 0,
            marginTop: index == 0 && index == 1 ? 10 : 5,
            marginRight: 10,
            marginBottom: 5,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: colors.inactive
        }}>
            <View style={{
                flexDirection: 'row',
                marginTop: 10,
                marginHorizontal: 5
            }}>
                <Image style={{ width: 100, height: 110, resizeMode: 'cover', borderRadius: 10, marginRight: 15 }}
                    source={{ uri: item.url }} />
                <Text style={{ flex: 1, fontSize: 14, textAlign: 'right', color: 'black' }}>$ {item.price}</Text>
            </View>
            <Text style={{ fontSize: 12, fontWeight: 'bold', marginHorizontal: 10, marginTop: 5, color: colors.alert }}>{item.productName}</Text>
            {
                item.specifications.map((spec, index) => {
                    return (
                        <Text key={spec} style={{ fontSize: 11, marginHorizontal: 10, color: colors.inactive, marginBottom: 10, }}>* {spec}</Text>
                    )
                })
            }
            <View style={{ flexDirection: 'row', padding: 10 }}>
                <TouchableOpacity onPress={() => {
                    // nhan ban products -- > thay doi --> set product moi vao pro cu
                    let cloneProducts = products.map(eachProduct => {
                        if (item.productName == eachProduct.productName) {
                            //return { ...eachProduct, isSaved: true }
                            return {
                                ...eachProduct, isSaved: eachProduct.isSaved == false
                                    || eachProduct.isSaved == undefined ? true : false
                            }
                        }
                        return eachProduct;
                    });
                    setProducts(cloneProducts);

                }} style={{ flexDirection: 'row' }}>
                    <Icon name="heart" size={20} color={item.isSaved == undefined || item.isSaved == false ?
                        colors.inactive : colors.alert
                    } />
                    <Text style={{
                        fontSize: 11, width: 50, marginHorizontal: 10, color: item.isSaved == undefined || item.isSaved == false ?
                            colors.inactive : colors.alert
                    }}>Safe for later</Text>
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <FiveStars numberOfStars={item.stars} />
                    <Text style={{ color: 'blue', fontSize: 10, textAlign: 'left', paddingTop: 5 }}>${item.reviews} reviews</Text>
                </View>
            </View>
        </View>
    );
}

export default GridItem;