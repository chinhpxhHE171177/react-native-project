// PetDetailScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Modal, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { icons, colors } from '../constants';
import { useRoute } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import {
    fetchPetByID,
    fetchPetCategories,
    updatePet,
    fetchAddFavouritePet,
    fetchGetFavouriteIDByUserIDAndPetID,
    fetchUnfavourite
} from '../services/api';
// import { Heart, Phone } from 'lucide-react-native';

const PetDetailScreen = ({ navigation }) => {
    // const pet = {
    //     name: 'Cheero',
    //     location: 'Siem Reap, Cambodia',
    //     sex: 'Male',
    //     color: 'Brown',
    //     age: '5 Months',
    //     owner: 'Sangvaleap',
    //     description: 'Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content.',
    //     image: 'https://images.unsplash.com/photo-1558788353-f76d92427f16', // Placeholder image URL
    // };

    const route = useRoute();
    const petID = route.params?.petID;
    const [pet, setPet] = useState(null);
    const [userID, setUserID] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [updatedPetData, setUpdatedPetData] = useState({});
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isFavourite, setIsFavourite] = useState(null);

    // Gender options for the picker
    const genderOptions = ['Male', 'Female', 'Unknown'];


    useEffect(() => {
        const getUserId = async () => {
            try {
                const userId = await AsyncStorage.getItem('userID');
                if (userId) {
                    setUserID(userId);
                }
            } catch (error) {
                console.error('Error retrieving user ID:', error);
            }
        };
        getUserId();
    }, []);

    useEffect(() => {
        const getPetDetail = async () => {
            if (!petID) {
                setError("Pet ID is missing");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const response = await fetchPetByID(petID);
                if (response) {
                    setPet(response);
                    setUpdatedPetData({
                        PetID: petID,
                        UserID: userID,
                        PetName: response.PetName,
                        PetAge: response.PetAge,
                        PetWeight: response.PetWeight,
                        PetBreed: response.PetBreed,
                        PetGender: response.PetGender,
                        PetDescription: response.PetDescription,
                        PetImage: response.PetImage,
                        CategoryID: response.CategoryID
                    });
                    setSelectedCategory(response.CategoryID);
                } else {
                    setError("Pet not found");
                }
            } catch (err) {
                setError("Failed to load pet details");
            } finally {
                setLoading(false);
            }
        };

        getPetDetail();
    }, [petID]);


    useEffect(() => {
        if (pet) {
            setUpdatedPetData({
                PetID: petID,
                UserID: userID,
                PetName: pet.PetName,
                PetAge: pet.PetAge,
                PetWeight: pet.PetWeight,
                PetBreed: pet.PetBreed,
                PetGender: pet.PetGender,
                PetDescription: pet.PetDescription,
                PetImage: pet.PetImage,
                CategoryID: pet.CategoryID
            });
            setSelectedCategory(pet.CategoryID);
        }
    }, [pet]);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await fetchPetCategories();
                if (response) {
                    setCategories(response);
                }
            } catch (err) {
                console.error("Error fetching categories:", err);
            }
        };
        getCategories();
    }, []);

    const handleEditPet = () => {
        setIsModalVisible(true);
    };

    // const handleUpdatePet = async () => {
    //     try {
    //         console.log("Updated Pet Data:", updatedPetData); // Kiểm tra dữ liệu trước khi gửi

    //         const response = await updatePet(petID, userID, updatedPetData);
    //         console.log("API Response:", response); // Kiểm tra phản hồi từ API

    //         if (response && response.success) {
    //             setPet(updatedPetData);
    //             setIsModalVisible(false);
    //             alert('Pet updated successfully!');
    //         } else {
    //             setError("Failed to update pet details");
    //         }
    //     } catch (err) {
    //         console.error("Error updating pet:", err); // In lỗi ra console để debug
    //         setError("Failed to updated pet details: " + err.message);
    //     }
    // };


    const handleUpdatePet = async () => {
        try {
            console.log("Updated Pet Data:", updatedPetData);

            const response = await updatePet(petID, userID, updatedPetData);
            console.log("API Response:", response);

            if (response && response.success) {
                setPet(updatedPetData);
                setIsModalVisible(false);
                alert('Pet updated successfully!');
            } else {
                alert(response.message || "Failed to update pet details");
            }
        } catch (err) {
            console.error("Error updating pet:", err);
            alert("Failed to update pet details: " + (err.response?.data?.message || err.message));
        }
    };

    const handleChooseImage = () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorMessage) {
                console.log('Image Picker Error:', response.errorMessage);
            } else {
                const source = { uri: response.assets[0].uri };
                setUpdatedPetData({ ...updatedPetData, PetImage: source.uri });
            }
        });
    };

    useEffect(() => {
        const checkFavouriteStatus = async () => {
            if (userID && petID) {
                const favourite = await fetchGetFavouriteIDByUserIDAndPetID(userID, petID);
                setIsFavourite(favourite);
            }
        };
        checkFavouriteStatus();
    }, [userID, petID]);

    const toggleFavourite = async () => {
        try {
            if (isFavourite) {
                // Ensure isFavourite contains the correct data
                const unfav = await fetchUnfavourite(userID, isFavourite.FavoriteID);
                if (unfav) {
                    setIsFavourite(false);
                    Alert.alert("Removed from favourites");
                }
            } else {
                // Ensure userId and doctorID are not null
                if (!userID || !petID) {
                    Alert.alert("Error", "User or Pet information is missing.");
                    return;
                }
                const fav = await fetchAddFavouritePet(userID, petID);
                if (fav) {
                    setIsFavourite(true);
                    Alert.alert("Added to favourites");
                }
            }
        } catch (error) {
            console.error("Favourite Error:", error);
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text>Loading pet, please wait...</Text>
            </View>
        );
    }

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }


    return (
        <ScrollView style={styles.container}>
            {/* Pet Image */}
            <View style={styles.imageContainer}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    {/* <Heart color={'#FF6B81'} fill={'#FF6B81'} size={24} /> */}
                    <Image source={icons.back_button} style={{ width: 30, height: 30 }} />
                </TouchableOpacity>
                <Image source={{ uri: pet.PetImage }} style={styles.image} />
                <TouchableOpacity onPress={toggleFavourite} style={styles.heartIcon}>
                    <Image
                        source={isFavourite ? icons.heart : icons.heart_filled}
                        style={{ width: 30, height: 30, tintColor: isFavourite ? 'red' : 'black' }}
                    />
                </TouchableOpacity>
            </View>

            {/* Pet Name and Location */}
            <View style={styles.infoContainer}>
                <Text style={styles.petName}>{pet.PetName}</Text>
                <Text style={styles.petCode}>PetCode: {pet.PetID}</Text>
                {/* Edit Icon (Only show if user owns the pet) */}
                {pet.UserID == userID && (
                    <TouchableOpacity onPress={handleEditPet} style={styles.editButton}>
                        <Image source={icons.editButton} style={{ width: 24, height: 24 }} />
                    </TouchableOpacity>
                )}
                <Text style={styles.location}>{pet.PetWeight} kg</Text>
            </View>

            {/* Pet Details */}
            <View style={styles.detailContainer}>
                <View style={styles.detailBox}>
                    <Text style={styles.detailTitle}>Sex</Text>
                    <Text style={styles.detailValue}>{pet.PetGender}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailTitle}>Breed</Text>
                    <Text style={styles.detailValue}>{pet.PetBreed}</Text>
                </View>
                <View style={styles.detailBox}>
                    <Text style={styles.detailTitle}>Age</Text>
                    <Text style={styles.detailValue}>{pet.PetAge}</Text>
                </View>
            </View>

            {/* Owner Info */}
            <View style={styles.ownerContainer}>
                <View>
                    <Text style={styles.ownerName}>{pet.FullName}</Text>
                    <Text style={styles.ownerRole}>Pet's Owner</Text>
                </View>
                <TouchableOpacity style={styles.callButton}>
                    {/* <Phone color={'#fff'} size={20} /> */}
                    <Text style={styles.callButtonText}>Call</Text>
                </TouchableOpacity>
            </View>

            {/* Pet Description */}
            <Text style={styles.description}>{pet.PetDescription}</Text>

            {/* Modal for editing pet */}
            <Modal visible={isModalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Edit Pet</Text>

                    {/* Pet Name */}
                    <TextInput
                        value={updatedPetData.PetName}
                        onChangeText={(text) => setUpdatedPetData({ ...updatedPetData, PetName: text })}
                        placeholder="Pet Name"
                        style={styles.input}
                    />

                    {/* Category Picker */}
                    <View style={styles.inputPicker}>
                        <Picker
                            selectedValue={selectedCategory}
                            onValueChange={(itemValue) => {
                                setSelectedCategory(itemValue);
                                setUpdatedPetData({ ...updatedPetData, CategoryID: itemValue });
                            }}
                        // style={styles.inputPicker}
                        >
                            {categories.map((category) => (
                                <Picker.Item key={category.CategoryID} label={category.CategoryName} value={category.CategoryID} />
                            ))}
                        </Picker>
                    </View>

                    {/* Gender Picker */}
                    <View style={styles.inputPicker}>
                        <Picker
                            selectedValue={updatedPetData.PetGender}
                            onValueChange={(itemValue) => setUpdatedPetData({ ...updatedPetData, PetGender: itemValue })}
                        // style={styles.inputPicker}
                        >
                            {genderOptions.map((gender) => (
                                <Picker.Item key={gender} label={gender} value={gender} />
                            ))}
                        </Picker>
                    </View>

                    {/* Pet Age */}
                    <TextInput
                        value={updatedPetData.PetAge}
                        onChangeText={(text) => setUpdatedPetData({ ...updatedPetData, PetAge: text })}
                        placeholder="Pet Age"
                        keyboardType="numeric"
                        style={styles.input}
                    />

                    {/* Pet Weight */}
                    <TextInput
                        value={updatedPetData.PetWeight}
                        onChangeText={(text) => setUpdatedPetData({ ...updatedPetData, PetWeight: text })}
                        placeholder="Pet Weight (kg)"
                        keyboardType="numeric"
                        style={styles.input}
                    />

                    {/* Pet Breed */}
                    <TextInput
                        value={updatedPetData.PetBreed}
                        onChangeText={(text) => setUpdatedPetData({ ...updatedPetData, PetBreed: text })}
                        placeholder="Pet Breed"
                        style={styles.input}
                    />

                    <TouchableOpacity style={styles.imagePickerButton} onPress={handleChooseImage}>
                        <Text style={styles.imagePickerText}>Choose Image</Text>
                    </TouchableOpacity>
                    <Image source={{ uri: updatedPetData.PetImage }} style={styles.imagePreview} />

                    {/* Pet Description */}
                    <TextInput
                        value={updatedPetData.PetDescription}
                        onChangeText={(text) => setUpdatedPetData({ ...updatedPetData, PetDescription: text })}
                        placeholder="Pet Description"
                        style={styles.input}
                        multiline
                        numberOfLines={4}
                    />

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <Button title="Update Pet" onPress={handleUpdatePet} color="#4CAF50" />
                        <Button title="Cancel" onPress={() => setIsModalVisible(false)} color="#f44336" />
                    </View>
                </View>
            </Modal>
        </ScrollView>
    );
};

export default PetDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    imageContainer: {
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 300,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    heartButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 50,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    infoContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
    },
    petName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    location: {
        fontSize: 16,
        color: '#777',
        marginTop: 5,
    },
    detailContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    detailBox: {
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#F9F9F9',
        borderRadius: 10,
        width: '30%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    detailTitle: {
        fontSize: 14,
        color: '#999',
    },
    detailValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 5,
    },
    ownerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#F5F5F5',
        borderRadius: 15,
        marginHorizontal: 20,
        marginBottom: 20,
    },
    ownerName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    ownerRole: {
        fontSize: 14,
        color: '#777',
    },
    callButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF6B81',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 10,
    },
    callButtonText: {
        color: '#fff',
        marginLeft: 8,
        fontSize: 16,
    },
    description: {
        paddingHorizontal: 20,
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
    },
    backButton: {
        position: 'absolute',
        top: 30,
        left: 20,
        zIndex: 1,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    errorText: {
        textAlign: 'center',
        fontSize: 16,
        color: 'red',
        marginTop: 20
    },
    editButton: {
        position: 'absolute',
        top: 20,
        right: 16,
    },
    modalContainer: {
        flex: 1,
        backgroundColor: colors.background_color,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
        color: colors.primary,
    },
    input: {
        width: '100%',
        padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        fontSize: 16,
    },
    inputPicker: {
        width: '100%',
        // padding: 10,
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        fontSize: 16,
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
    heartIcon: { position: 'absolute', right: 20, top: 20 },
});

