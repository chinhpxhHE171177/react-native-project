// RecommendScreen.js
import { React, useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { GestureDetector, GestureHandlerRootView, Gesture } from 'react-native-gesture-handler';
import { images, colors, icons } from '../constants';
import { getDoctorsWithTotalReviewsAndAverageRating } from '../services/api';

const { width } = Dimensions.get('window');

const RecommendScreen = ({ navigation }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 12;

    // const caregivers = [
    //     { id: 1, name: 'Jenna Smith', rating: '4.8⭐', reviews: '1,235 reviews', image: images.caregiver1 },
    //     { id: 2, name: 'Alex Johnson', rating: '4.9⭐', reviews: '1,145 reviews', image: images.caregiver2 },
    //     { id: 3, name: 'Emily Davis', rating: '4.7⭐', reviews: '1,320 reviews', image: images.caregiver1 },
    //     { id: 4, name: 'Michael Brown', rating: '4.6⭐', reviews: '1,100 reviews', image: images.caregiver2 },
    //     { id: 5, name: 'Sarah Wilson', rating: '4.9⭐', reviews: '1,450 reviews', image: images.caregiver1 },
    //     { id: 6, name: 'David Lee', rating: '4.8⭐', reviews: '1,210 reviews', image: images.caregiver2 },
    //     { id: 7, name: 'Laura White', rating: '4.7⭐', reviews: '1,320 reviews', image: images.caregiver1 },
    //     { id: 8, name: 'James Hall', rating: '4.5⭐', reviews: '1,000 reviews', image: images.caregiver2 },
    //     { id: 9, name: 'Emma King', rating: '4.9⭐', reviews: '1,500 reviews', image: images.caregiver1 },
    //     { id: 10, name: 'Daniel Young', rating: '4.8⭐', reviews: '1,230 reviews', image: images.caregiver2 },
    //     { id: 11, name: 'Sophia Adams', rating: '4.6⭐', reviews: '1,140 reviews', image: images.caregiver1 },
    //     { id: 12, name: 'Oliver Scott', rating: '4.7⭐', reviews: '1,310 reviews', image: images.caregiver2 },
    //     { id: 13, name: 'Jenna Smith', rating: '4.8⭐', reviews: '1,235 reviews', image: images.caregiver1 },
    //     { id: 14, name: 'Alex Johnson', rating: '4.9⭐', reviews: '1,145 reviews', image: images.caregiver2 },
    //     { id: 15, name: 'Emily Davis', rating: '4.7⭐', reviews: '1,320 reviews', image: images.caregiver1 },
    //     { id: 16, name: 'Michael Brown', rating: '4.6⭐', reviews: '1,100 reviews', image: images.caregiver2 },
    //     { id: 17, name: 'Sarah Wilson', rating: '4.9⭐', reviews: '1,450 reviews', image: images.caregiver1 },
    //     { id: 18, name: 'David Lee', rating: '4.8⭐', reviews: '1,210 reviews', image: images.caregiver2 },
    //     { id: 19, name: 'Laura White', rating: '4.7⭐', reviews: '1,320 reviews', image: images.caregiver1 },
    //     { id: 20, name: 'James Hall', rating: '4.5⭐', reviews: '1,000 reviews', image: images.caregiver2 },
    //     { id: 21, name: 'Emma King', rating: '4.9⭐', reviews: '1,500 reviews', image: images.caregiver1 },
    //     { id: 22, name: 'Daniel Young', rating: '4.8⭐', reviews: '1,230 reviews', image: images.caregiver2 },
    //     { id: 23, name: 'Sophia Adams', rating: '4.6⭐', reviews: '1,140 reviews', image: images.caregiver1 },
    //     { id: 24, name: 'Oliver Scott', rating: '4.7⭐', reviews: '1,310 reviews', image: images.caregiver2 },
    // ];

    // const totalPages = Math.ceil(caregivers.length / itemsPerPage);

    useEffect(() => {
        const getDoctorsData = async () => {
            try {
                const data = await getDoctorsWithTotalReviewsAndAverageRating();
                setDoctors(data);
            } catch (error) {
                console.error("Error fetching doctors:", error);
            } finally {
                setLoading(false);
            }
        };
        getDoctorsData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    const handleSearch = (query) => {
        setSearchQuery(query);
    };

    // const filteredDoctors = doctors.filter(doctor =>
    //     doctor.FullName.toLowerCase().includes(searchQuery.toLowerCase())
    // );
    const filteredDoctors = doctors.filter(doctor =>
        doctor.DoctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doctor.Specialization?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage);

    const doctorDetail = (id) => {
        navigation.navigate('DoctorDetail', { id });
    };

    const goBack = () => {
        navigation.goBack();
    };

    const panGesture = Gesture.Pan()
        .onUpdate((event) => {
            const { translationX } = event;
            if (translationX < -50 && currentPage < totalPages) {
                setCurrentPage(currentPage + 1); // Swipe left to next page
            } else if (translationX > 50 && currentPage > 1) {
                setCurrentPage(currentPage - 1); // Swipe right to previous page
            }
        });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredDoctors.slice(indexOfFirstItem, indexOfLastItem);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <GestureDetector gesture={panGesture}>
                    <ScrollView style={styles.container}>
                        <View style={styles.headerContainer}>
                            <TouchableOpacity onPress={goBack}>
                                <Image source={icons.back_button} style={styles.profileIcon} />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.sectionTitle}>Recommended for Your Pup</Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={icons.search} style={styles.searchIcon} />
                            <TextInput
                                placeholder='Search for ...'
                                style={styles.searchBar}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>

                        <View style={styles.cardContainer}>
                            {currentItems.length > 0 ? (
                                currentItems.map((doctor) => (
                                    <TouchableOpacity
                                        key={doctor.DoctorID}
                                        style={styles.card}
                                        onPress={() => navigation.navigate('DoctorDetail', { userID: doctor.UserID, doctorID: doctor.DoctorID })}>
                                        <Image
                                            source={{ uri: doctor.Avatar }}
                                            style={styles.profileImage}
                                        />
                                        <View style={styles.cardText}>
                                            <Text style={styles.cardTextDetail}>{doctor.DoctorName}</Text>
                                            <Text style={styles.cardTextDetail}>{doctor.AverageRating} ⭐</Text>
                                        </View>
                                        <Text style={styles.reviewText}>{doctor.TotalReviews} reviews</Text>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <View style={styles.emptyContainer}>
                                    {/* <Ionicons name="sad-outline" size={80} color="#ccc" /> */}
                                    <Image source={icons.sad_outline} style={{ width: 50, height: 50 }} />
                                    <Text style={styles.emptyMessage}>No doctors found matching your search.</Text>
                                </View>
                            )}
                        </View>
                    </ScrollView>
                </GestureDetector>

                {/* Pagination Dots */}
                <View style={styles.paginationDots}>
                    {Array.from({ length: totalPages }, (_, index) => (
                        <TouchableOpacity
                            key={index + 1}
                            onPress={() => setCurrentPage(index + 1)}
                            style={[
                                styles.dot,
                                currentPage === index + 1 ? styles.activeDot : styles.inactiveDot,
                            ]}
                        />
                    ))}
                </View>
            </GestureHandlerRootView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: colors.blue_light,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    profileIcon: {
        width: 30,
        height: 30,
    },
    searchBar: {
        flex: 1,
        backgroundColor: colors.disabledLight,
        height: 48,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#ccc',
        opacity: 0.8,
        paddingStart: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
    },
    searchIcon: {
        position: 'absolute',
        left: 8,
        width: 20,
        height: 20,
    },
    cardContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '30%',
        backgroundColor: colors.pink_ligth,
        borderRadius: 10,
        alignItems: 'center',
        padding: 5,
        marginBottom: 10,
    },
    profileImage: {
        width: '100%',
        height: 90,
        borderRadius: 10,
    },
    cardText: {
        alignItems: 'center',
        marginTop: 5,
    },
    cardTextDetail: {
        fontSize: 11,
        fontWeight: 'bold',
    },
    reviewText: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    paginationDots: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: 20, // Positioning at the bottom
        left: 0,
        right: 0,
    },
    activeDot: {
        backgroundColor: colors.purple_color,
        width: 12,
        height: 12,
        borderRadius: 6,
        marginHorizontal: 5,
    },
    inactiveDot: {
        backgroundColor: colors.inactive,
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyMessage: {
        textAlign: 'center',
        color: '#6B7280',
        fontSize: 18,
        marginTop: 10,
    },
});

export default RecommendScreen;