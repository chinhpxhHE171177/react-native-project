// PetServiceScreen.js
// RecommendScreen.js
import { React, useState, useEffect } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { GestureDetector, GestureHandlerRootView, Gesture } from 'react-native-gesture-handler';
import { images, colors, icons } from '../constants';
import { fetchPetCareServices } from '../services/api';

const { width } = Dimensions.get('window');

const PetServiceScreen = ({ navigation }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    const [doctors, setDoctors] = useState([]);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const itemsPerPage = 9;

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await fetchPetCareServices();
                setServices(data);
            } catch (error) {
                console.error("Error fetching pet services:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
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
    const filteredServices = services.filter(service =>
        service.ServiceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.DoctorName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

    // const doctorDetail = (id) => {
    //     navigation.navigate('DoctorDetail', { id });
    // };

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
    const currentItems = filteredServices.slice(indexOfFirstItem, indexOfLastItem);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <GestureDetector gesture={panGesture}>
                    <View style={styles.contentWrapper}>
                        {/* Header */}
                        <View style={styles.headerContainer}>
                            <TouchableOpacity onPress={goBack} style={styles.backButton}>
                                <Image source={icons.back_button} style={styles.profileIcon} />
                            </TouchableOpacity>
                            <Text style={styles.headerTitle}>Recommended Services</Text>
                        </View>

                        {/* Search Bar */}
                        <View style={styles.searchContainer}>
                            <Image source={icons.search} style={styles.searchIcon} />
                            <TextInput
                                placeholder="Search for..."
                                style={styles.searchBar}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                            />
                        </View>

                        {/* Services List */}
                        <View style={styles.cardContainer}>
                            {currentItems.length > 0 ? (
                                currentItems.map((service) => (
                                    <TouchableOpacity
                                        key={service.ServiceID}
                                        style={styles.card}
                                        onPress={() =>
                                            navigation.navigate("ServiceDetail", {
                                                serviceID: service.ServiceID,
                                                doctorID: service.DoctorID,
                                            })
                                        }>
                                        <Image source={{ uri: service.Url }} style={styles.profileImage} />
                                        <View style={styles.cardText}>
                                            <Text style={styles.cardTitle}>{service.ServiceName}</Text>
                                            <Text style={styles.reviewText}>{service.DoctorName}</Text>
                                            <Text style={styles.reviewText}>{service.Cost} $</Text>
                                            <View style={styles.reviewContainer}>
                                                <Text style={styles.cardRating}>{service.AverageRating} ⭐</Text>
                                                <Text style={styles.reviewText}>{service.TotalReviews} reviews</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))
                            ) : (
                                <View style={styles.emptyContainer}>
                                    <Image source={icons.sad_outline} style={styles.sadIcon} />
                                    <Text style={styles.emptyMessage}>No doctors found matching your search.</Text>
                                </View>
                            )}
                        </View>
                    </View>
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

export default PetServiceScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5F5F5",
    },
    contentWrapper: {
        paddingHorizontal: 15,
        paddingVertical: 10,
    },
    headerContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 10,
    },
    backButton: {
        padding: 8,
        borderRadius: 50,
        backgroundColor: "#ECECEC",
    },
    profileIcon: {
        width: 28,
        height: 28,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#2C3E50",
    },
    searchContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        paddingHorizontal: 15,
        height: 50,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    searchIcon: {
        width: 20,
        height: 20,
        marginRight: 10,
    },
    searchBar: {
        flex: 1,
        fontSize: 16,
        color: "#333",
    },
    cardContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "space-between",
        marginTop: 15,
    },
    card: {
        width: "47%",
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        alignItems: "center",
        marginBottom: 15,
    },
    profileImage: {
        width: "100%",
        height: 100,
        borderRadius: 10,
    },
    cardText: {
        marginTop: 8,
        alignItems: "center",
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#34495E",
    },
    cardRating: {
        fontSize: 12,
        color: "#FF9800",
        marginTop: 2,
        // marginRight: 15,
    },
    reviewText: {
        fontSize: 12,
        color: "#7F8C8D",
        marginTop: 2,
    },
    reviewContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 20,
    },
    sadIcon: {
        width: 60,
        height: 60,
    },
    emptyMessage: {
        fontSize: 16,
        color: "#7F8C8D",
        marginTop: 10,
        textAlign: "center",
    },
    paginationDots: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    activeDot: {
        backgroundColor: "#2980B9",
        width: 12,
        height: 12,
        borderRadius: 6,
        marginHorizontal: 5,
    },
    inactiveDot: {
        backgroundColor: "#BDC3C7",
        width: 10,
        height: 10,
        borderRadius: 5,
        marginHorizontal: 5,
    },
});
