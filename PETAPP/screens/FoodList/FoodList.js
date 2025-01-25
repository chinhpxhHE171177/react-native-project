import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, FlatList, Image, TouchableOpacity, TextInput } from "react-native";
import { images, icons, colors } from '../../constants';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FoodItem from "./FoodItem";

const FoodList = (props) => {
    const [foods, setFoods] = useState([
        {
            id: 1,
            name: 'Pizza',
            url: 'https://timtour.vn/files/images/AnGiNgon/pizza-italy-1.jpg',
            status: 'Opening Now',
            price: 20,
            website: 'https://edition.cnn.com',
            socialNetwork:
            {
                facebook: 'https://www.facebook.com',
                twitter: 'https://www.tiwtter.com',
                instagram: 'https://www.instagram.com'
            }
        },
        {
            id: 2,
            name: 'Gazpacho',
            url: 'https://bellyfull.net/wp-content/uploads/2021/07/Gazpacho-blog-4.jpg',
            status: 'Opening Soon',
            price: 15,
            website: 'https://edition.cnn.com',
            socialNetwork:
            {
                facebook: 'https://www.facebook.com',
                twitter: 'https://www.tiwtter.com',
            }
        },
        {
            id: 3,
            name: 'Pimientos de Padron',
            url: 'https://santanagourmet.com/cdn/shop/articles/Pimientos-padron.jpg?v=1693633668',
            status: 'Closing soon',
            price: 30,
            website: 'https://edition.cnn.com',
            socialNetwork:
            {
                facebook: 'https://www.facebook.com',
                instagram: 'https://www.instagram.com'
            }
        },
        {
            id: 4,
            name: 'Paella Valenciana, with rabbit and chicken; and seafood paella',
            url: 'https://www.eatingwell.com/thmb/_3v2uUXiz-NF1Qcc5qTZ4v7_9jY=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/chicken-paella-ck-1803-8031252-2000-861c7b8a86d54f0184c5204830c8994b.jpg',
            status: 'Opening Now',
            price: 75,
            website: 'https://edition.cnn.com',
            socialNetwork:
            {
                twitter: 'https://www.tiwtter.com',
                instagram: 'https://www.instagram.com'
            }
        },
        {
            id: 5,
            name: 'Albondigas',
            url: 'https://www.allrecipes.com/thmb/Oe5xbwc55J_8zHzbvis_r20XTP4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/62642-albondigas-DDMFS-4x3-b82436562afb4e1587841a5cb5cb2d53.jpg',
            status: 'Cooming soon',
            price: 20,
            website: 'https://edition.cnn.com',
            socialNetwork:
            {
                facebook: 'https://www.facebook.com',
                twitter: 'https://www.tiwtter.com',
                instagram: 'https://www.instagram.com'
            }
        },
        {
            id: 6,
            name: 'Sandwich de Pollo',
            url: 'https://www.tqma.com.ec/images/com_yoorecipe/banner_superior/16308_1.jpg',
            status: 'Cooming soon',
            price: 23,
            website: 'https://edition.cnn.com',
            socialNetwork:
            {
                facebook: 'https://www.facebook.com',
                instagram: 'https://www.instagram.com'
            }
        }
    ]);

    const [categories, setCategories] = useState([
        {
            name: 'BBQ',
            url: 'https://giaydantuong.giabaonhieu1m2.com/wp-content/uploads/2023/05/dat-tiec-BBQ-tai-nha.jpg'
        },
        {
            name: 'Breakfast',
            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/75/Breakfast_at_the_Black_Bear_Diner.jpg/800px-Breakfast_at_the_Black_Bear_Diner.jpg'
        },
        {
            name: 'Coffee',
            url: 'https://www.allrecipes.com/thmb/SUs7po94w7k2OwqYDjC3H_ZW3JQ=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/96629-cafe-latte-ddmfs-hero-4x3-0288359d9c37485fa69afe5369dbcf2e.jpg'
        },
        {
            name: 'Hotdogs',
            url: 'https://simplehomeedit.com/wp-content/uploads/2024/10/Loaded-Scandi-Hotdogs-1.webp'
        },
        {
            name: 'Noodles',
            url: 'https://takestwoeggs.com/wp-content/uploads/2023/11/Soy-Sauce-Pan-Fried-Noodles-Takestwoeggs-sq.jpg'
        },
        {
            name: 'Breads',
            url: 'https://hips.hearstapps.com/hmg-prod/images/types-of-bread-1666723473.jpg'
        },
        {
            name: 'Pizzas',
            url: 'https://content.jdmagicbox.com/comp/lucknow/g1/0522px522.x522.220806152847.z3g1/catalogue/redbox-pizza-khadra-lucknow-pizza-outlets-nugzroaq4e.jpg'
        },
        {
            name: 'Desserts',
            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Desserts.jpg/1200px-Desserts.jpg'
        },
        {
            name: 'Drinks',
            url: 'https://artex.com.br/emcasa/wp-content/uploads/2023/01/AdobeStock_193672039-1024x683.jpeg'
        }
    ]);

    const [search, setSearch] = useState('');
    const filteredFoods = () => {
        return (
            foods.filter(eachFood => eachFood.name.toLowerCase().includes(search.toLowerCase()))
        );
    }
    return (
        <View style={{ flex: 1 }}>
            <View>
                <View style={{ height: 51, marginHorizontal: 10, marginVertical: 5, flexDirection: 'row', alignItems: 'center' }}>
                    <Icon name="search" size={15} style={{ position: 'absolute', left: 10 }} />
                    <TextInput autoCorrect={false} onChangeText={(text) => {
                        setSearch(text)
                    }} style={{
                        flex: 1, backgroundColor: colors.disabled, height: 35,
                        marginEnd: 5, borderRadius: 6, opacity: 0.8, paddingStart: 30
                    }}></TextInput>
                    <Icon name="bars" size={30} colors={'black'} />
                </View>
                <View style={{ height: 100 }}>
                    <View style={{ height: 1, backgroundColor: colors.inactive }} />
                    <FlatList
                        horizontal={true}
                        keyExtractor={(item) => item.name}
                        data={categories} renderItem={({ item }) => {
                            return (
                                <TouchableOpacity onPress={() => {
                                    alert(`You press item's name: ${item.name}`)
                                }} style={{ justifyContent: 'center', alignItems: 'center' }}>
                                    <Image style={{ width: 50, height: 50, resizeMode: 'cover', borderRadius: 25, marginRight: 15 }}
                                        source={{ uri: item.url }} />
                                    <Text style={{ fontSize: 12, padding: 5, textAlign: 'center' }}>{item.name}</Text>
                                </TouchableOpacity>
                            )
                        }}
                        style={{ flex: 1 }} >
                    </FlatList>
                    <View style={{ height: 1, backgroundColor: colors.inactive }} />
                </View>
                {/* <ScrollView>
                    {foods.map((eachFood) => (
                        <FoodItem key={eachFood.id} food={eachFood} />
                    ))}
                </ScrollView> */}
            </View >
            {filteredFoods().length > 0 ? <FlatList
                data={filteredFoods()}
                renderItem={({ item }) => {
                    return (
                        <FoodItem key={item.id} food={item} onPress={() => {
                            alert(`You press item's name: ${item.name}`)
                        }} />
                    );
                }}
                keyExtractor={(item) => item.id}
            /> : <View style={{ flex: 1, textAlign: 'center', alignItems: 'center', margin: 30 }} >
                <Text>Not found the foods!</Text>
            </View>}
        </View>
    );
}

export default FoodList;