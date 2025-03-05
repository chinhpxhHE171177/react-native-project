// SetviceDetailScreen.js 
import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, icons } from '../constants';
import {
    fetchServiceByID,
    fetchReviewsByServiceID,
    checkChatExists,
    createChat,
    fetchGetFavouriteIDByUserIDAndServiceID,
    fetchAddFavouriteService,
    fetchUnfavourite
} from '../services/api';
import ReviewsSection from './ServiceReviewSection';

const DetailServiceScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const serviceID = route.params?.serviceID;
    const doctorID = route.params?.doctorID;

    const [userId, setUserId] = useState(null);
    const [service, setService] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('About');
    const [isFavourite, setIsFavourite] = useState(null);

    const handleTabPress = (tab) => {
        setActiveTab(tab);
    }

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const userId = await AsyncStorage.getItem('userID');
                if (userId) {
                    setUserId(userId);
                    console.log("User ID from AsyncStorage:", userId);
                }
            } catch (error) {
                console.error('Error retrieving user info:', error);
            }
        };

        getUserInfo();
    }, []);

    useEffect(() => {
        const getServiceDetail = async () => {
            if (!serviceID) {
                setError("Service ID is missing");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                console.log("Fetching service with serviceId:", serviceID);
                const response = await fetchServiceByID(serviceID);
                console.log("API Response:", response);
                if (response && response.length > 0) {
                    setService(response[0]); // Access the first element of the array
                } else {
                    setError("Service not found");
                }
            } catch (err) {
                console.error("API Error:", err);
                setError("Failed to load service details");
            } finally {
                setLoading(false);
            }
        };

        getServiceDetail();
    }, [serviceID]);

    useEffect(() => {
        const fectServiceReviews = async () => {
            if (!serviceID) {
                setError("Service ID is missing");
                setLoading(false);
                return;
            }
            try {
                const reviewsData = await fetchReviewsByServiceID(serviceID);
                setReviews(reviewsData);
            } catch (err) {
                console.error("Error loading reviews:", err);
            }
        };

        fectServiceReviews();
    }, [serviceID]);


    const goBack = () => navigation.goBack();

    const handlePress = async () => {
        if (!userId || !doctorID) {
            Alert.alert("Error", "User or Doctor information is missing.");
            return;
        }

        try {
            const chatExists = await checkChatExists(userId, doctorID);
            console.log("checkChatExists result:", chatExists);

            if (chatExists) {
                console.log("Navigating to ChatItem with:", chatExists.ChatID);
                navigation.navigate('ChatItem', {
                    chatId: chatExists.ChatID,
                    doctorId: service.DoctorID,
                    doctorName: service.DoctorName,
                    doctorAvatar: service.Avatar
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
            if (userId && serviceID) {
                const favourite = await fetchGetFavouriteIDByUserIDAndServiceID(userId, serviceID);
                setIsFavourite(favourite);
            }
        };
        checkFavouriteStatus();
    }, [userId, serviceID]);


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
                if (!userId || !serviceID) {
                    Alert.alert("Error", "User or Doctor information is missing.");
                    return;
                }
                const fav = await fetchAddFavouriteService(userId, serviceID);
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
                <Text>Loading pet's services, please wait...</Text>
            </View>
        );
    }

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

    if (!service) {
        return <Text style={styles.errorText}>No service data available.</Text>;
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
                    source={{ uri: service.Url }}
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
                    <Text style={styles.name}>{service.ServiceName}</Text>
                    {/* <Text style={{ backgroundColor: 'red' }}>{userId}</Text>
                    <Text style={{ backgroundColor: 'yellow' }}>{serviceID}</Text> */}
                    <View style={styles.ratingContainer}>
                        <Text style={styles.ratingText}>{service.AverageRating}</Text>
                        <Text style={styles.starIcon}>⭐</Text>
                    </View>
                </View>
                <View >
                    <Text style={{ color: colors.inactive, fontSize: 16, }}>{service.DoctorName}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ marginRight: 10, paddingVertical: 5 }}>
                        <Text style={styles.speciality}>Speciality: {service.Specialty}</Text>
                    </View>
                    <View style={{ marginLeft: 10, paddingVertical: 5 }}>
                        <Text style={styles.speciality}>Experience: {service.Experience} years</Text>
                    </View>
                </View>

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
                                {service.Description}
                            </Text>
                        </ScrollView>
                    </View>
                )}

                <View style={{ flex: 1 }}>
                    {activeTab === 'Reviews' && (
                        <ReviewsSection key={reviews.ReviewID} reviews={reviews} serviceID={serviceID} userID={userId} setReviews={setReviews} />
                    )}
                </View>

                {/* Schedule Section */}
                {
                    activeTab === 'Schedule' && (
                        <View style={{ flex: 1, height: 180 }}>
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

        </ScrollView >
    );
};

export default DetailServiceScreen;

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
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: '70%',
        justifyContent: 'center',
        alignSelf: 'center',
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 8,
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
    heartIcon: { position: 'absolute', right: 20, top: 20 },
});

