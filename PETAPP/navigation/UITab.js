/*
 * Install dependencies:
 * yarn add react-navigation
 * yarn add react-native-safe-area-context
 * yarn add @react-navigation/bottom-tabs
 * yarn add @react-navigation/native
 * yarn add @react-navigation/native-stack
 */

import React from "react";
import { Setting, ProductGridView, FoodList, Profile, Chat } from '../screens';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
    View, Text, Image, TextInput, TouchableOpacity, Alert,
    KeyboardAvoidingView, Platform, Keyboard, ScrollView, Switch
} from "react-native";
import { images, icons, colors } from '../constants';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { UIHeader } from "../components";

const Tab = createBottomTabNavigator();
const screenOptions = ({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: 'white',
    tabBarInactiveTintColor: colors.inactive,
    tabBarActiveBackgroundColor: 'red',

    tabBarIcon: ({ focused, color, size }) => {
        let screenName = route.name
        let iconName = "facebook";
        if (screenName == "ProductGridView") {
            iconName = "align-justify";
        } else if (screenName == "FoodList") {
            iconName = "list";
        } else if (screenName == "Setting") {
            iconName = "cogs";
        } else if (screenName == "Profile") {
            iconName = "user";
        } else if (screenName == "Chat") {
            iconName = "comments";
        }
        return <Icon name={iconName} size={22} color={focused ? 'white' : colors.inactive} />
    },
})


const UITabs = () => {
    return (
        <Tab.Navigator screenOptions={screenOptions} >
            <Tab.Screen name={"ProductGridView"} component={ProductGridView} options={{ tabBarLabel: 'Products' }} />
            <Tab.Screen name={"Chat"} component={Chat} options={{ tabBarLabel: 'CHat' }} />
            <Tab.Screen name={"FoodList"} component={FoodList} options={{ tabBarLabel: 'Foods' }} />
            <Tab.Screen name={"Setting"} component={Setting} options={{ tabBarLabel: 'Settings' }} />
            <Tab.Screen name={"Profile"} component={Profile} options={{ tabBarLabel: 'Profile' }} />
        </Tab.Navigator>
    );
};

export default UITabs;
