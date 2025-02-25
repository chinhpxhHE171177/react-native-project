// utils/auth.js
// GET USER ID FROM ASYNC STORAGE
// utils/auth.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getUserInfo = async () => {
    try {
        const userId = await AsyncStorage.getItem('userId');
        const avatar = await AsyncStorage.getItem('url');
        const fullName = await AsyncStorage.getItem('fullName');
        console.log("User ID:", userId, "Avatar URL:", avatar, "FullName:", fullName);
        
        return {
            userId: userId || null,
            avatar: avatar || null,
            fullName: fullName || null,
        };
    } catch (error) {
        console.error('Error retrieving user info:', error);
        return {
            userId: null,
            avatar: null,
            fullName: null,
        };
    }
};

