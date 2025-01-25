import React, { useState, useEffect } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform, Keyboard, FlatList } from "react-native";
import { images, icons, colors } from '../../constants';
import Icon from 'react-native-vector-icons/FontAwesome5';
import FiveStars from "./FiveStars";
import GridItem from "./GridItem";

const ProductGridView = (props) => {
    const [products, setProducts] = useState([
        {
            id: 1,
            productName: 'iPhone 13',
            price: 1000,
            url: 'https://cdn.tgdd.vn/Products/Images/42/223602/iphone-13-midnight-2-600x600.jpg',
            specifications: [
                'Dry clean',
                'cyclone filter',
                'convenience cord storage'
            ],
            reviews: 21,
            stars: 5
        },
        {
            id: 2,
            productName: 'Apple iPhone 15 Pro Max 256GB',
            price: 1250,
            url: 'https://cdn.tgdd.vn/Products/Images/42/305658/iphone-15-pro-max-blue-thumbnew-600x600.jpg',
            specifications: [
                'Dry clean',
                'cyclone filter',
                'convenience cord storage'
            ],
            reviews: 19,
            stars: 5
        },
        {
            id: 3,
            productName: 'Samsung Galaxy Z Fold6',
            price: 2000,
            url: 'https://www.didongmy.com/vnt_upload/product/07_2023/thumbs/(600x600)_galaxy_z_fold5_blue_didongmy_thumb_1.jpg',
            specifications: [
                'Apparence dry clean',
                'cyclone filter',
                'convenience cord storage'
            ],
            reviews: 17,
            stars: 5
        },
        {
            id: 4,
            productName: 'Samsung Galaxy S24 Plus',
            price: 900,
            url: 'https://cdn.tgdd.vn/Products/Images/42/307172/samsung-galaxy-s24-plus-violet-thumbnew-600x600.jpg',
            specifications: [
                'Slim design',
                'Easy to use',
                'convenience cord storage'
            ],
            reviews: 120,
            stars: 4.7
        },
        {
            id: 5,
            productName: 'OPPO Find N3',
            price: 1230,
            url: 'https://cdn.tgdd.vn/Products/Images/42/302953/oppo-find-n3-vang-dong-thumb-600x600.jpg',
            specifications: [
                'Smart design',
                'Slim design',
                'Fashionable, conveninence cord storage'
            ],
            reviews: 117,
            stars: 4
        },
        {
            id: 6,
            productName: 'OPPO Reno13 F',
            price: 850,
            url: 'https://cdn.tgdd.vn/Products/Images/42/332935/oppo-reno13-f-purple-thumb-600x600.jpg',
            specifications: [
                'Flexible, Slim design',
                'Costumizable'
            ],
            reviews: 621,
            stars: 5
        },
        {
            id: 7,
            productName: 'Xiaomii 14 Lite',
            price: 350,
            url: 'https://cdn2.cellphones.com.vn/x/media/catalog/product/x/i/xiaomi-14-lite-8gb-256gb_2_.png',
            specifications: [
                'New, fully functional',
                'Costumizable'
            ],
            reviews: 310,
            stars: 4.9
        },
        {
            id: 8,
            productName: 'Xiaomi 14T',
            price: 510,
            url: 'https://cdn.tgdd.vn/Products/Images/42/329938/xiaomi-14t-grey-thumb-600x600.jpg',
            specifications: [
                'Functional and new',
                'Screen 144Hz AMOLED for color accuracy'
            ],
            reviews: 137,
            stars: 5
        },
        {
            id: 9,
            productName: 'vivo V40 Lite',
            price: 120,
            url: 'https://cdn.tgdd.vn/Products/Images/42/329959/vivo-v40-lite-bac-thumb-600x600.jpg',
            specifications: [
                'Pin 5000 mAh battery',
                'Screen full HD+ (1080 x 2400 Pixels'
            ],
            reviews: 1700,
            stars: 5
        },
        {
            id: 10,
            productName: 'vivo V40 Lite',
            price: 220,
            url: 'https://cdn.tgdd.vn/Products/Images/42/329959/vivo-v40-lite-bac-thumb-600x600.jpg',
            specifications: [
                'Pin 5000 mAh battery',
                'Screen full HD+ (1080 x 2400 Pixels'
            ],
            reviews: 1650,
            stars: 5
        },
        {
            id: 11,
            productName: 'Google Pixel 9',
            price: 860,
            url: 'https://www.didongmy.com/vnt_upload/product/08_2024/thumbs/(600x600)_google_pixel_9_pro_5g_hazel_didongmy_thumb_600x600_1.jpg',
            specifications: [
                'Apparence new - Enhanced protection',
                'Change about design'
            ],
            reviews: 2010,
            stars: 5
        },
        {
            id: 12,
            productName: 'Huawei Y9s',
            price: 195,
            url: 'https://cdn.tgdd.vn/Products/Images/42/214648/huawei-y9sb-blue-600x600.jpg',
            specifications: [
                'Screen: TFT LCD6.59" Full HD+',
                'System: Android 11'
            ],
            reviews: 760,
            stars: 3
        },
        {
            id: 13,
            productName: 'Ulefore Armor 22',
            price: 350,
            url: 'https://queenmobile.net/wp-content/uploads/2024/03/dien-thoai-ulefone-armor-22-ben-bi-phien-ban-toan-cau-6-58-inch-8gb256gb-camera-64mp-pin-6600mah-nfc-android-13-4g-image.jpg',
            specifications: [
                'Screen: TFT LCD6.59" Full HD+',
                'System: Android 11'
            ],
            reviews: 371,
            stars: 5
        },
        {
            id: 14,
            productName: 'Sony Xperia 1V',
            price: 750,
            url: 'https://product.hstatic.net/1000370129/product/sony-xperia-1-iv-black-digiphone_06f8b4d1e80748d585a089006f09ffad.jpg',
            specifications: [
                '120Hz display and technology OLED',
                'System camera after 3 with ability to zoom'
            ],
            reviews: 271,
            stars: 5
        }
    ])
    return (
        <View style={{ flex: 1 }}>
            <FlatList style={{ marginTop: 5 }} data={products}
                numColumns={2}
                keyExtractor={item => item.id}
                renderItem={({ item, index }) => <GridItem item={item} index={index} products={products} setProducts={setProducts} />} />
        </View >
    );
}

export default ProductGridView;