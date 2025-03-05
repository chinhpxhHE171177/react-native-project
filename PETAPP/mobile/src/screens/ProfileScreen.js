import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, Modal, TextInput, ScrollView, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { fetchUserByID, fetchUpdateProfile, fetchChangePassword } from '../services/api';
import { colors, icons } from '../constants';

const ProfileScreen = ({ navigation }) => {
    const [user, setUser] = useState(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [formData, setFormData] = useState({ FullName: '', Email: '', PhoneNumber: '', Address: '', Url: '' });
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const userId = await AsyncStorage.getItem('userID');
                if (userId) {
                    const userData = await fetchUserByID(userId);
                    setUser(userData);
                    setFormData({
                        FullName: userData.FullName || '',
                        Email: userData.Email || '',
                        PhoneNumber: userData.PhoneNumber || '',
                        Address: userData.Address || '',
                        Url: userData.Url || '',
                    });
                }
            } catch (error) {
                Alert.alert('Error', 'Failed to load user profile.');
            }
        };
        loadUserProfile();
    }, []);

    const handleUpdateProfile = async () => {
        try {
            const userId = await AsyncStorage.getItem('userID');
            await fetchUpdateProfile(userId, formData);
            Alert.alert('Success', 'Profile updated successfully.');
            setShowProfileModal(false);
        } catch (error) {
            Alert.alert('Error', error);
        }
    };

    const handleImageUpload = () => {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
        };

        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User  cancelled image picker');
            } else if (response.error) {
                Alert.alert('Error', 'ImagePicker Error: ' + response.error);
            } else {
                const source = response.assets[0].uri; // Get the image URI
                setFormData({ ...formData, Url: source }); // Update the formData with the new image URL
            }
        });
    };

    // const handleChangePassword = async () => {
    //     if (passwordData.newPassword !== passwordData.confirmPassword) {
    //         Alert.alert('Error', 'New passwords do not match.');
    //         return;
    //     }
    //     try {
    //         const userId = await AsyncStorage.getItem('userID');
    //         await fetchChangePassword(userId, passwordData.oldPassword, passwordData.newPassword);
    //         Alert.alert('Success', 'Password changed successfully.');
    //         setShowPasswordModal(false);
    //         setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    //     } catch (error) {
    //         Alert.alert('Error', error);
    //     }
    // };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            Alert.alert('Error', 'New passwords do not match.');
            return;
        }
        try {
            const userId = await AsyncStorage.getItem('userID');
            await fetchChangePassword(userId, passwordData.oldPassword, passwordData.newPassword);
            setShowPasswordModal(false);
            setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });

            // Hiển thị thông báo với tùy chọn Yes/No
            Alert.alert(
                'Success',
                'Password changed successfully. Do you want to return to the login page to log in again?',
                [
                    { text: 'No', style: 'cancel' },
                    {
                        text: 'Yes',
                        onPress: async () => {
                            await AsyncStorage.removeItem('userID'); // Xóa thông tin đăng nhập (nếu cần)
                            navigation.navigate('Login'); // Điều hướng đến trang Login
                        },
                    },
                ]
            );
        } catch (error) {
            Alert.alert('Error', error);
        }
    };

    if (!user) {
        return (
            <View style={styles.container}>
                <Text>Loading user information...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Image source={icons.back_button} style={{ width: 30, height: 30 }} />
                </TouchableOpacity>
                <View style={styles.header}>
                    <Image source={{ uri: user.Url || icons.profile_icon }} style={styles.profileImage} />
                    <Text style={styles.name}>{user.FullName}</Text>
                    <Text style={styles.role}>{user.Role}</Text>
                </View>
                <TouchableOpacity style={styles.editButton} onPress={() => setShowProfileModal(true)}>
                    <Image source={icons.editButton} style={{ width: 30, height: 30 }} />
                </TouchableOpacity>
            </View>

            {/* Contact Info */}
            <View style={styles.contactInfo}>
                <View style={styles.contactRow}>
                    <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/phone.png' }} style={styles.icon} />
                    <Text style={styles.contactText}>{user.PhoneNumber}</Text>
                </View>
                <View style={styles.contactRow}>
                    <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/email.png' }} style={styles.icon} />
                    <Text style={styles.contactText}>{user.Email}</Text>
                </View>
                <View style={styles.contactRow}>
                    <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/address.png' }} style={styles.icon} />
                    <Text style={styles.contactText}>{user.Address}</Text>
                </View>
            </View>

            {/* Options */}
            {/* <TouchableOpacity style={styles.optionRow} onPress={() => setShowPasswordModal(true)}>
                <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/key.png' }} style={styles.optionIcon} />
                <Text style={styles.optionText}>Change Password</Text>
            </TouchableOpacity> */}

            {/* Wallet and Orders */}
            <View style={styles.walletOrdersContainer}>
                <View style={styles.walletOrdersBox}>
                    <Text style={styles.walletOrdersAmount}>$140.00</Text>
                    <Text style={styles.walletOrdersLabel}>Wallet</Text>
                </View>
                <View style={styles.walletOrdersBox}>
                    <Text style={styles.walletOrdersAmount}>12</Text>
                    <Text style={styles.walletOrdersLabel}>Orders</Text>
                </View>
            </View>

            {/* Options */}

            <TouchableOpacity style={styles.optionRow} onPress={() => setShowPasswordModal(true)}>
                <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/key.png' }} style={styles.optionIcon} />
                <Text style={styles.optionText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionRow} onPress={() => alert('Dark mode')}>
                <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/contrast.png' }} style={styles.optionIcon} />
                <Text style={styles.optionText}>Dark Mode</Text>
            </TouchableOpacity>

            <View style={styles.optionsContainer}>
                {[
                    { label: 'Your Favorites', icon: 'https://img.icons8.com/ios-filled/50/like.png' },
                    // { label: 'Tell Your Friend', icon: 'https://img.icons8.com/ios-filled/50/share.png' },
                    { label: 'Settings', icon: 'https://img.icons8.com/ios-filled/50/settings.png' }
                ].map((item, index) => (
                    <TouchableOpacity key={index} style={styles.optionRow}>
                        <Image source={{ uri: item.icon }} style={styles.optionIcon} />
                        <Text style={styles.optionText}>{item.label}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
                <Image source={{ uri: 'https://img.icons8.com/ios-filled/50/shutdown.png' }} style={styles.logoutIcon} />
                <Text style={styles.logoutText}>Log out</Text>
            </TouchableOpacity>

            {/* Modal Update Profile
            <Modal visible={showProfileModal} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Update Profile</Text>
                        {['FullName', 'Email', 'PhoneNumber', 'Address', 'Url'].map((field) => (
                            <TextInput
                                key={field}
                                style={styles.input}
                                placeholder={field}
                                value={formData[field]}
                                onChangeText={(text) => setFormData({ ...formData, [field]: text })}
                            />
                        ))}
                        <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowProfileModal(false)}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal> */}

            {/* Modal Update Profile */}
            <Modal visible={showProfileModal} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Update Profile</Text>
                        {/* <TouchableOpacity onPress={handleImageUpload} style={styles.uploadButton}>
                            <Text style={styles.uploadButtonText}>Upload Photo</Text>
                        </TouchableOpacity> */}
                        {['FullName', 'Email', 'PhoneNumber', 'Address'].map((field) => (
                            <TextInput
                                key={field}
                                style={styles.input}
                                placeholder={field}
                                value={formData[field]}
                                onChangeText={(text) => setFormData({ ...formData, [field]: text })}
                            />
                        ))}

                        <TouchableOpacity style={styles.imagePickerButton} onPress={handleImageUpload}>
                            <Text style={styles.imagePickerText}>Choose Image</Text>
                        </TouchableOpacity>
                        <Image source={{ uri: formData.Url }} style={styles.imagePreview} />

                        {/* <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile}>
                            <Text style={styles.saveButtonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowProfileModal(false)}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity> */}

                        {/* Buttons */}
                        <View style={styles.buttonContainer}>
                            <Button title="Update" onPress={handleUpdateProfile} color="#4CAF50" />
                            <Button title="Cancel" onPress={() => setShowProfileModal(false)} color="#f44336" />
                        </View>
                    </View>
                </View>
            </Modal>


            {/* Modal Change Password */}
            <Modal visible={showPasswordModal} animationType="slide" transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Change Password</Text>
                        {['oldPassword', 'newPassword', 'confirmPassword'].map((field) => (
                            <TextInput
                                key={field}
                                style={styles.input}
                                placeholder={field === 'oldPassword' ? 'Old Password' : field === 'newPassword' ? 'New Password' : 'Confirm Password'}
                                secureTextEntry={true}
                                value={passwordData[field]}
                                onChangeText={(text) => setPasswordData({ ...passwordData, [field]: text })}
                            />
                        ))}
                        <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword}>
                            <Text style={styles.saveButtonText}>Change</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setShowPasswordModal(false)}>
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
        padding: 20,
    },
    headerContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    editButton: {
        position: 'absolute',
        top: 20,
        right: 15,
        zIndex: 1,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: colors.purple_light,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    role: {
        color: 'gray',
        fontSize: 18,
    },
    contactInfo: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },
    contactRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    icon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    contactText: {
        fontSize: 16,
    },
    walletOrdersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#ddd',
        paddingVertical: 15,
    },
    walletOrdersBox: {
        alignItems: 'center',
    },
    walletOrdersAmount: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    walletOrdersLabel: {
        color: 'gray',
    },
    optionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: '#f0f0f0',
    },
    optionIcon: {
        width: 24,
        height: 24,
        marginRight: 20,
    },
    optionText: {
        fontSize: 16,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        backgroundColor: '#ff6b81',
        padding: 15,
        borderRadius: 10,
    },
    logoutIcon: {
        width: 24,
        height: 24,
        marginRight: 10,
    },
    logoutText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    saveButton: {
        backgroundColor: colors.purple_light,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    cancelText: {
        color: 'gray',
        textAlign: 'center',
        marginTop: 10,
    },
    uploadButton: {
        backgroundColor: colors.purple_light,
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginBottom: 15,
    },
    uploadButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    backButton: {
        position: 'absolute',
        top: 20,
        left: 10,
        zIndex: 1,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 10,
    },
    imagePickerButton: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        marginVertical: 10,
    },
    imagePickerText: {
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    imagePreview: {
        width: 100,
        height: 100,
        alignSelf: 'center',
        marginTop: 10,
        borderRadius: 5,
    },
});
