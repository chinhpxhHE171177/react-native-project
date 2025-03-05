// UITabs.js
// import React from 'react';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { createNativeStackNavigator } from '@react-navigation/native-stack';
// import { HomeScreen, ChatScreen, ChatItem, ScheduleScreen, PetsScreen, Notification } from '../screens';
// import Icon from 'react-native-vector-icons/FontAwesome5';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// //import { Icon } from 'react-native-elements';
// import { colors, icons } from '../constants';
// import { Image } from 'react-native';

// const Tab = createBottomTabNavigator();
// const Stack = createNativeStackNavigator();

// const HomeStack = () => (
//     <Stack.Navigator screenOptions={{ headerShown: false }}>
//         <Stack.Screen name="Home" component={HomeScreen} />
//     </Stack.Navigator>
// );

// const screenOptions = ({ route }) => ({
//     headerShown: false,
//     tabBarActiveTintColor: 'white',
//     tabBarInactiveTintColor: colors.inactive,
//     tabBarActiveBackgroundColor: colors.purple_color,

//     tabBarIcon: ({ focused, color, size }) => {
//         let screenName = route.name
//         let iconName = "facebook";
//         if (screenName == "Home") {
//             iconName = icons.home;
//         } else if (screenName == "Chat") {
//             iconName = icons.chat;
//         } else if (screenName == "Schedule") {
//             iconName = icons.schedule;
//         } else if (screenName == "Pets") {
//             iconName = icons.pets;
//         } else if (screenName == "Notifications") {
//             iconName = icons.notification;
//         }
//         return <Image source={iconName} style={{ width: 30, height: 30 }} color={focused ? 'white' : colors.inactive} />
//     },
// })


// const UITabs = () => {
//     return (
//         <Tab.Navigator screenOptions={screenOptions} >
//             <Tab.Screen name={"Home"} component={HomeStack} options={{ tabBarLabel: 'Home' }} />
//             <Tab.Screen name={"Chat"} component={ChatScreen} options={{ tabBarLabel: 'Chat' }} />
//             <Tab.Screen name={"Schedule"} component={ScheduleScreen} options={{ tabBarLabel: 'Schedule' }} />
//             <Tab.Screen name={"Pets"} component={PetsScreen} options={{ tabBarLabel: 'Pets' }} />
//             <Tab.Screen name={"Notifications"} component={Notification} options={{ tabBarLabel: 'Notification' }} />
//         </Tab.Navigator>
//     );
// };

// export default UITabs;


// UITabs.js
import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen, ChatScreen, ScheduleScreen, PetsScreen, Notification, DoctorScheduleScreen, FavouriteScreen } from '../screens';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'react-native';
import { colors, icons } from '../constants';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const HomeStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
    </Stack.Navigator>
);

const screenOptions = ({ route }) => ({
    headerShown: false,
    tabBarActiveTintColor: 'white',
    tabBarInactiveTintColor: colors.inactive,
    tabBarActiveBackgroundColor: colors.purple_color,
    tabBarIcon: ({ focused }) => {
        let iconName = icons[route.name.toLowerCase()] || icons.home;
        return <Image source={iconName} style={{ width: 30, height: 30, tintColor: focused ? 'white' : colors.inactive }} />;
    },
});

const UITabs = () => {
    const [role, setRole] = useState(null);

    useEffect(() => {
        const fetchRole = async () => {
            const userRole = await AsyncStorage.getItem('role');
            setRole(userRole);
        };
        fetchRole();
    }, []);

    return (
        <Tab.Navigator screenOptions={screenOptions}>
            <Tab.Screen name="Home" component={HomeStack} options={{ tabBarLabel: 'Home' }} />
            <Tab.Screen name="Chat" component={ChatScreen} options={{ tabBarLabel: 'Chat' }} />
            <Tab.Screen
                name="Schedule"
                component={role === 'Doctor' ? DoctorScheduleScreen : ScheduleScreen}
                options={{ tabBarLabel: 'Schedule' }}
            />
            <Tab.Screen name="Pets" component={PetsScreen} options={{ tabBarLabel: 'Pets' }} />
            <Tab.Screen name="Notification" component={Notification} options={{ tabBarLabel: 'Notification' }} />
            <Tab.Screen name="Heart" component={FavouriteScreen} options={{ tabBarLabel: 'FavouriteScreen' }} />
        </Tab.Navigator>
    );
};

export default UITabs;
