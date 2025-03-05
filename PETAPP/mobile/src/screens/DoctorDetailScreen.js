// DoctorDetailScreen.js 
import React, { useEffect, useId, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, Modal, Button, TextInput } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { launchImageLibrary } from 'react-native-image-picker';
import { colors, icons } from '../constants';
import {
    fetchDoctorByUserID,
    fetchReviewsByDoctorID,
    checkChatExists,
    createChat,
    fetchUpdatedDoctor,
    fetchAddFavouriteDoctor,
    fetchGetFavouriteIDByUserIDAndDoctorID,
    fetchUnfavourite
} from '../services/api';
import ReviewsSection from './ReviewsSection';

const DoctorDetailScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const userID = route.params?.userID;
    const doctorID = route.params?.doctorID;

    const [userId, setUserId] = useState(null);
    const [role, setRole] = useState(null);
    const [doctor, setDoctor] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [updatedDoctor, setUpdatedDoctor] = useState({});
    const [activeTab, setActiveTab] = useState('About');
    const [isFavourite, setIsFavourite] = useState(null);


    const handleTabPress = (tab) => {
        setActiveTab(tab);
    }

    const handleEditDoctor = () => {
        setIsModalVisible(true);
    };
    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const userId = await AsyncStorage.getItem('userID');
                const userRole = await AsyncStorage.getItem('role');
                if (userId) {
                    setUserId(userId);
                    setRole(userRole);
                    console.log("User ID from AsyncStorage:", userId);
                }
            } catch (error) {
                console.error('Error retrieving user info:', error);
            }
        };

        getUserInfo();
    }, []);

    useEffect(() => {
        const getDoctorDetails = async () => {
            if (!userID) {
                setError("User ID is missing");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                console.log("Fetching doctor with userId:", userID); // Kiểm tra userID
                const response = await fetchDoctorByUserID(userID);
                console.log("API Response:", response); // Kiểm tra response từ API
                if (response) {
                    setDoctor(response);
                    setUpdatedDoctor({
                        DoctorID: doctorID,
                        UserID: userId,
                        Specialty: response.Specialty,
                        Experience: response.Experience,
                        AvailableFor: response.AvailableFor,
                        Address: response.Address,
                        Avatar: response.Avatar,
                        About: response.About
                    })
                } else {
                    setError("Doctor not found");
                }
            } catch (err) {
                console.error("API Error:", err); // Xem chi tiết lỗi nếu có
                setError("Failed to load doctor details");
            } finally {
                setLoading(false);
            }
        };

        getDoctorDetails();
    }, [userID]);

    useEffect(() => {
        if (doctor) {
            setUpdatedDoctor({
                DoctorID: doctorID,
                UserID: userId,
                Specialty: doctor.Specialty,
                Experience: doctor.Experience ? doctor.Experience.toString() : '', // 🔧 Chuyển INT sang string
                AvailableFor: doctor.AvailableFor,
                Address: doctor.Address,
                Avatar: doctor.Avatar,
                About: doctor.About
            });
        }
    }, [doctor]);

    const handleUpdateDoctor = async () => {
        try {
            const updatedData = {
                ...updatedDoctor,
                Experience: parseInt(updatedDoctor.Experience, 10) || 0, // 🔄 Chuyển ngược lại thành số
            };
            console.log("Updated Doctor Data:", updatedData);

            const response = await fetchUpdatedDoctor(doctorID, updatedData);
            console.log("API Response:", response);

            if (response && response.success) {
                setDoctor(updatedData);
                setIsModalVisible(false);
                alert('Updated successfully!');
            } else {
                alert(response.message || "Failed to update details");
            }
        } catch (err) {
            console.error("Error updating:", err);
            alert("Failed to update details: " + (err.response?.data?.message || err.message));
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
                setUpdatedDoctor({ ...updatedDoctor, Avatar: source.uri });
            }
        });
    };

    useEffect(() => {
        const getDoctorReviews = async () => {
            if (!doctorID) {
                setError("Doctor ID is missing");
                setLoading(false);
                return;
            }
            try {
                const reviewsData = await fetchReviewsByDoctorID(doctorID);
                setReviews(reviewsData);
            } catch (err) {
                console.error("Error loading reviews:", err);
            }
        };

        getDoctorReviews();
    }, [doctorID]);


    const goBack = () => navigation.goBack();
    const handlePress = async () => {
        if (!userId || !doctorID) {
            Alert.alert("Error", "User or Doctor information is missing.");
            return;
        }

        try {
            const chatExists = await checkChatExists(userId, doctorID);
            console.log("checkChatExists result:", chatExists); // Debug

            if (chatExists) {
                // Alert.alert("ChatItem", `Chat ID: ${chatExists.ChatID}`);
                console.log("Navigating to ChatItem with:", chatExists.ChatID);
                navigation.navigate('ChatItem', {
                    chatId: chatExists.ChatID,
                    doctorId: doctor.DoctorID,
                    doctorName: doctor.FullName,
                    doctorAvatar: doctor.Avatar
                });
            } else {
                console.log("Creating new chat...");
                const newChat = await createChat(userId, doctorID);
                if (newChat) {
                    console.log("Navigating to ChatScreen with:", newChat.ChatID);
                    navigation.navigate('ChatScreen', { chatID: newChat.ChatID });
                } else {
                    Alert.alert("Error", "Failed to create a chat.");
                }
            }
        } catch (error) {
            console.error("Error in handlePress:", error);
            Alert.alert("Error", "Something went wrong.");
        }
    };

    useEffect(() => {
        const checkFavouriteStatus = async () => {
            if (userId && doctorID) {
                const favourite = await fetchGetFavouriteIDByUserIDAndDoctorID(userId, doctorID);
                setIsFavourite(favourite);
            }
        };
        checkFavouriteStatus();
    }, [userId, doctorID]);

   
    const toggleFavourite = async () => {
        try {
            if (isFavourite) {
                // Ensure isFavourite contains the correct data
                const unfav = await fetchUnfavourite(userId, isFavourite.FavoriteID);
                if (unfav) {
                    setIsFavourite(false);
                    Alert.alert("Removed from favourites");
                }
            } else {
                // Ensure userId and doctorID are not null
                if (!userId || !doctorID) {
                    Alert.alert("Error", "User or Doctor information is missing.");
                    return;
                }
                const fav = await fetchAddFavouriteDoctor(userId, doctorID);
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
                <Text>Loading doctors, please wait...</Text>
            </View>
        );
    }

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    if (!doctor) {
        return <Text style={styles.errorText}>No doctor data available.</Text>;
    }

    return (
        <ScrollView style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity onPress={goBack} style={styles.backButtonContainer}>
                <Image source={icons.left_arrow} style={styles.backButton} />
            </TouchableOpacity>

            {/* Profile Image */}
            <View>
                <Image
                    source={{ uri: doctor.Avatar }}
                    style={styles.profileImage}
                />
                <TouchableOpacity onPress={toggleFavourite} style={styles.heartIcon}>
                    <Image
                        source={isFavourite ? icons.heart : icons.heart_filled}
                        style={{ width: 30, height: 30, tintColor: isFavourite ? 'red' : 'black' }}
                    />
                </TouchableOpacity>
            </View>

            {/* Profile Details */}
            <View style={styles.profileDetailsContainer}>
                <View style={styles.nameRow}>
                    <Text style={styles.name}>{doctor.FullName}</Text>
                    {/* <Text style={{ backgroundColor: 'red'}}>{userId}</Text>
                    <Text  style={{ backgroundColor: 'yellow'}}>{doctorID}</Text>
                    <Text  style={{ backgroundColor: 'yellow'}}>{doctor.UserID}</Text> */}
                    <View style={styles.ratingContainer}>
                        <Text style={styles.ratingText}>{doctor.Rating}</Text>
                        <Text style={styles.starIcon}>⭐</Text>
                    </View>
                    {/* Edit Icon (Only show if user owns the pet) */}
                    {role === 'Doctor' && doctor.UserID === parseInt(userId) && (
                        <TouchableOpacity onPress={handleEditDoctor} style={styles.editButton}>
                            <Image source={icons.editButton} style={{ width: 24, height: 24 }} />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ marginRight: 10, paddingVertical: 10, width: '50%' }}>
                        <Text style={styles.speciality}>Speciality: {doctor.Specialty}</Text>
                    </View>
                    <View style={{ marginLeft: 10, paddingVertical: 10 }}>
                        <Text style={styles.speciality}>Experience: {doctor.Experience} years</Text>
                    </View>
                </View>
                {/* <Text style={styles.subDetails}>0.7 mi  •  6 yrs experience  •  $$-$$$</Text>
                <Text style={styles.recommendedText}>Recommended by two of your connections!</Text> */}

                {/* Icons Row */}
                <View style={styles.iconRow}>
                    <View style={styles.iconContainer}>
                        <Image source={icons.verified} style={styles.icon} />
                        <Text style={styles.iconLabel}>Verified</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <Image source={icons.local_fave} style={styles.icon} />
                        <Text style={styles.iconLabel}>Local Fave</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <Image source={icons.petite_pup} style={styles.icon} />
                        <Text style={styles.iconLabel}>Petite Pup Pro</Text>
                    </View>
                    <View style={styles.iconContainer}>
                        <Image source={icons.walks} style={styles.icon} />
                        <Text style={styles.iconLabel}>500+ Walks</Text>
                    </View>
                </View>

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity onPress={() => handleTabPress('About')} style={[styles.tab, activeTab === 'About' && styles.activeTab]}>
                        <Text style={[styles.tabText, activeTab === 'About' && styles.activeTabText]}>About</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleTabPress('Reviews')} style={[styles.tab, activeTab === 'Reviews' && styles.activeTab]}>
                        <Text style={[styles.tabText, activeTab === 'Reviews' && styles.activeTabText]}>Reviews</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleTabPress('Schedule')} style={[styles.tab, activeTab === 'Schedule' && styles.activeTab]}>
                        <Text style={[styles.tabText, activeTab === 'Schedule' && styles.activeTabText]}>Schedule</Text>
                    </TouchableOpacity>
                </View>

                {/* About Section */}
                {activeTab === 'About' && (
                    <View style={{ flex: 1, height: 180 }}>
                        <ScrollView>
                            <Text style={styles.aboutText}>
                                {/* Hey there – my name is Jenna, and I’ve taken care of dogs my whole life. I am an experienced
                        sitter who you can trust to take amazing care of your pup. I take any (and all) opportunities to
                        snuggle and go on fun adventures with dogs. Some people have told me I’m a dog whisperer at times. I
                        have yet to prove them wrong. */}
                                {doctor.About}
                            </Text>
                        </ScrollView>
                    </View>
                )}

                <View style={{ flex: 1 }}>
                    {/* Reviews Section */}
                    {/* {activeTab === 'Reviews' && (
                        <View style={{ flex: 1, height: 160, backgroundColor: colors.blue_light }}>
                            <ScrollView contentContainerStyle={styles.reviewsContainer}>
                                {reviews.length > 0 ? (
                                    reviews.map((review, index) => {
                                        // Định dạng ngày giờ
                                        const formattedDate = new Date(review.CreatedAt).toLocaleString('en-GB', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            hour12: false,
                                        });

                                        return (
                                            <View key={review.ReviewID} style={styles.reviewItem}>
                                                <Image
                                                    source={{ uri: review.Url }}
                                                    style={styles.reviewAvatar}
                                                />
                                                <View style={styles.reviewContent}>
                                                    <View style={styles.reviewHeader}>
                                                        <View>
                                                            <Text style={styles.reviewerName}>{review.FullName}</Text>
                                                            <Text style={styles.reviewDate}>{formattedDate}</Text>
                                                        </View>
                                                        <View style={styles.starContainer}>
                                                            <Text style={styles.star}>{review.Rating} ⭐</Text>
                                                            <Image source={{ uri: 'https://img.icons8.com/ios-filled/20/000000/star--v1.png' }} style={styles.starIcon} />
                                                        </View>
                                                    </View>
                                                    <Text style={styles.reviewText}>{review.ReviewText}</Text>
                                                </View>
                                            </View>
                                        );
                                    })
                                ) : (
                                    <Text style={styles.noReviewText}>No reviews available</Text>
                                )}
                            </ScrollView>
                        </View>
                    )} */}
                    {activeTab === 'Reviews' && (
                        <ReviewsSection reviews={reviews} doctorID={doctorID} userID={userID} setReviews={setReviews} />
                    )}
                </View>

                {/* Schedule Section */}
                {
                    activeTab === 'Schedule' && (
                        <View style={{ flex: 1, height: 120 }}>
                            <ScrollView>
                                <View style={styles.scheduleContainer}>
                                    <Text style={styles.scheduleTitle}>Available Slots</Text>
                                    {/* Danh sách các khung giờ */}
                                    {[
                                        { day: 'Monday', time: '9:00 AM - 11:00 AM' },
                                        { day: 'Tuesday', time: '1:00 PM - 3:00 PM' },
                                        { day: 'Wednesday', time: '10:00 AM - 12:00 PM' },
                                        { day: 'Thursday', time: '2:00 PM - 4:00 PM' },
                                        { day: 'Friday', time: '9:00 AM - 11:00 AM' },
                                    ].map((slot, index) => (
                                        <View key={index} style={styles.slotContainer}>
                                            <Text style={styles.slotText}>{`${slot.day}: ${slot.time}`}</Text>
                                            <TouchableOpacity
                                                style={styles.bookButton}
                                                onPress={() => Alert.alert('Booking Confirmed', `You booked an appointment on ${slot.day} at ${slot.time}`)}
                                            >
                                                <Text style={styles.bookButtonText}>Book</Text>
                                            </TouchableOpacity>
                                        </View>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>
                    )
                }

            </View >
            {/* Message Button - Cố định ở dưới cùng */}
            < TouchableOpacity style={styles.messageButton} onPress={handlePress} >
                <Text style={styles.messageButtonText}>Message to book</Text>
            </TouchableOpacity >

            {/* <TouchableOpacity
                style={styles.chatButton}
                onPress={() => navigation.navigate('ChatScreen', { doctorId: doctor.UserID })}
            >
                <Text style={styles.chatButtonText}>Chat with Doctor</Text>
            </TouchableOpacity> */}


            {/* Modal for editing doctor */}
            <Modal visible={isModalVisible} animationType="slide">
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Update Profile</Text>

                    {/* Specialty */}
                    <TextInput
                        value={updatedDoctor.Specialty}
                        onChangeText={(text) => setUpdatedDoctor({ ...updatedDoctor, Specialty: text })}
                        placeholder="Specialty"
                        style={styles.input}
                    />

                    {/* Experience */}
                    <TextInput
                        value={updatedDoctor.Experience}
                        onChangeText={(text) => setUpdatedDoctor({ ...updatedDoctor, Experience: text })}
                        placeholder="Experience (years)"
                        keyboardType="numeric"
                        style={styles.input}
                    />

                    {/* AvailableFor */}
                    <TextInput
                        value={updatedDoctor.AvailableFor}
                        onChangeText={(text) => setUpdatedDoctor({ ...updatedDoctor, AvailableFor: text })}
                        placeholder="AvailableFor (Ex: Dog, Cat, etc.)"
                        style={styles.input}
                    />

                    {/* Address */}
                    <TextInput
                        value={updatedDoctor.Address}
                        onChangeText={(text) => setUpdatedDoctor({ ...updatedDoctor, Address: text })}
                        placeholder="Address"
                        style={styles.input}
                    />

                    <TouchableOpacity style={styles.imagePickerButton} onPress={handleChooseImage}>
                        <Text style={styles.imagePickerText}>Choose Image</Text>
                    </TouchableOpacity>
                    <Image source={{ uri: updatedDoctor.Avatar }} style={styles.imagePreview} />

                    {/* About */}
                    <TextInput
                        value={updatedDoctor.About}
                        onChangeText={(text) => setUpdatedDoctor({ ...updatedDoctor, About: text })}
                        placeholder="About"
                        style={styles.input}
                        multiline
                        numberOfLines={4}
                    />

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <Button title="Update" onPress={handleUpdateDoctor} color="#4CAF50" />
                        <Button title="Cancel" onPress={() => setIsModalVisible(false)} color="#f44336" />
                    </View>
                </View>
            </Modal>

        </ScrollView >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    backButtonContainer: {
        position: 'absolute',
        top: 30,
        left: 20,
        zIndex: 1,
    },
    backButton: {
        width: 30,
        height: 30,
    },
    profileImage: {
        width: '100%',
        height: 250,
    },
    heartButtonContainer: {
        position: 'absolute',
        top: 30,
        right: 20,
        zIndex: 1,
    },
    heartButton: {
        width: 35,
        height: 35,
    },
    profileDetailsContainer: {
        padding: 20,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    ratingContainer: {
        flexDirection: 'row',
        backgroundColor: colors.blue_light,
        borderRadius: 10,
        marginLeft: 10,
        paddingHorizontal: 8,
        paddingVertical: 2,
        alignItems: 'center',
    },
    ratingText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    starIcon: {
        fontSize: 16,
        marginLeft: 4,
        color: colors.yellow,
    },
    // subDetails: {
    //     fontSize: 14,
    //     color: '#757575',
    //     marginTop: 5,
    // },
    // recommendedText: {
    //     fontSize: 14,
    //     color: '#757575',
    //     marginTop: 5,
    // },
    iconRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
    iconContainer: {
        alignItems: 'center',
    },
    icon: {
        width: 40,
        height: 40,
    },
    iconLabel: {
        marginTop: 5,
        fontSize: 12,
        color: colors.inactive,
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        borderBottomColor: colors.inactive,
        marginBottom: 10,
    },
    activeTab: {
        fontSize: 16,
        fontWeight: 'bold',
        borderBottomWidth: 2,
        borderBottomColor: colors.primary,
        paddingBottom: 5,
    },
    inactiveTab: {
        fontSize: 16,
        color: colors.inactive,
        paddingBottom: 5,
    },
    aboutText: {
        fontSize: 14,
        color: colors.inactive,
        marginTop: 10,
        lineHeight: 20,
    },
    messageButton: {
        backgroundColor: colors.facebook,
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: '70%',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    messageButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    chatButton: {
        backgroundColor: colors.facebook,
        paddingVertical: 12,
        paddingHorizontal: 20,
        width: '70%',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    chatButtonText: {
        color: colors.white,
        fontSize: 16,
        fontWeight: 'bold',
    },
    badgesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 20,
    },
    badge: {
        width: 40,
        height: 40,
    },
    tabsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderBottomWidth: 1,
        borderBottomColor: colors.inactive,
        marginTop: 20,
    },
    tab: {
        paddingVertical: 10,
    },
    activeTab: {
        borderBottomWidth: 3,
        borderBottomColor: colors.primary,
        paddingBottom: 8,
    },
    activeTabText: {
        color: colors.primary,
        fontWeight: 'bold',
    },
    tabText: {
        color: colors.inactive,
        fontSize: 16,
    },
    aboutText: {
        marginTop: 20,
        fontSize: 14,
        lineHeight: 20,
    },
    reviewsContainer: {
        marginTop: 20,
    },
    reviewItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.white,
        borderRadius: 15,
        padding: 12,
        marginHorizontal: 6,
        marginVertical: 10,
        shadowColor: colors.inactive,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4,
    },
    reviewAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    reviewContent: {
        flex: 1,
    },
    reviewHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    reviewerName: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    reviewText: {
        marginTop: 5,
        fontSize: 14,
        color: 'gray',
    },
    reviewDate: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    scheduleContainer: {
        marginTop: 20,
    },
    scheduleTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    slotContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: colors.blue_light,
        borderRadius: 10,
        marginBottom: 10,
    },
    slotText: {
        fontSize: 16,
        color: colors.dark,
    },
    bookButton: {
        backgroundColor: colors.primary,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    bookButtonText: {
        color: colors.white,
        fontWeight: 'bold',
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
        right: 1,
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

export default DoctorDetailScreen;
