import React from "react";
import { Setting, ProductGridView, FoodList } from '../screens';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
    View, Text, Image, TextInput, TouchableOpacity, Alert,
    KeyboardAvoidingView, Platform, Keyboard, ScrollView, Switch
} from "react-native";
import { images, icons, colors } from '../constants';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { UIHeader } from "../components";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Welcome, Login, Register, Messenger } from '../screens'
import UITabs from "./UITab";
const Stack = createNativeStackNavigator();

const App = (props) => {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
                {/* <Stack.Navigator screenOptions={screenOptions}> */}
                <Stack.Screen name={"Welcome"} component={Welcome} />
                <Stack.Screen name={"Login"} component={Login} />
                <Stack.Screen name={"Register"} component={Register} />
                <Stack.Screen name={"UITabs"} component={UITabs} />
                <Stack.Screen name={"Messenger"} component={Messenger} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

export default App;