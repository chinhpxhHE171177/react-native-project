// src/navigation/AppNavigation.js
import React from 'react';
//import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { 
    HomeScreen, 
    WelcomeScreen, 
    LoginScreen, 
    RegisterScreen, 
    DoctorDetailScreen, 
    RecommendScreen, 
    ChatItem, 
    PetDetailScreen, 
    ProfileScreen, 
    ChatScreen, 
    DoctorScheduleScreen, 
    ScheduleScreen
} from '../screens/index';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { UITabs } from '../components';
import PetServiceScreen from '../screens/PetServiceScreen';
import DetailServiceScreen from '../screens/DetailServiceScreen';
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                <Stack.Screen name="Welcome" component={WelcomeScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
                <Stack.Screen name="UITabs" component={UITabs} />
                <Stack.Screen name="DoctorDetail" component={DoctorDetailScreen} />
                <Stack.Screen name="ServiceDetail" component={DetailServiceScreen} />
                <Stack.Screen name="ChatScreen" component={ChatScreen} />
                <Stack.Screen name="Recommend" component={RecommendScreen} />
                <Stack.Screen name="PetServices" component={PetServiceScreen} />
                <Stack.Screen name="ChatItem" component={ChatItem} />
                <Stack.Screen name="PetDetail" component={PetDetailScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="DoctorSchedule" component={DoctorScheduleScreen} />
                <Stack.Screen name="ScheduleScreen" component={ScheduleScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;