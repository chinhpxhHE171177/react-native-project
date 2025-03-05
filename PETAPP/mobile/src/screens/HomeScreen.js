// HomeScreen.js
import { React, useState, useEffect, useMemo } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { images, colors, icons } from '../constants';
import { fetchDoctors, getDoctorTopReviews, fetchPetCareServices, fetchRecommendedServices } from '../services/api';
import { getUserInfo } from '../utils/auth';

const products = [
    {
        id: "1",
        name: "Dog Body Belt",
        price: "$80",
        oldPrice: "$95",
        quantity: 2,
        status: "In Delivery",
        discount: "40% Off",
        image: "https://via.placeholder.com/80", // Thay bằng URL ảnh thật
    },
    {
        id: "2",
        name: "Pet Bed For Dog",
        price: "$80",
        oldPrice: "$95",
        quantity: 2,
        status: "In Delivery",
        discount: "40% Off",
        image: "https://via.placeholder.com/80",
    },
    {
        id: "3",
        name: "Dog Cloths",
        price: "$80",
        oldPrice: "$95",
        quantity: 2,
        status: "In Delivery",
        discount: "40% Off",
        image: "https://via.placeholder.com/80",
    },
    {
        id: "4",
        name: "Dog Chew Toys",
        price: "$80",
        oldPrice: "$95",
        quantity: 2,
        status: "In Delivery",
        discount: "40% Off",
        image: "https://via.placeholder.com/80",
    },
];

const HomeScreen = ({ navigation }) => {
    // const [search, setSearch] = useState('');
    // const filteredFoods = () => {
    //     return (
    //         foods.filter(eachFood => eachFood.name.toLowerCase().includes(search.toLowerCase()))
    //     );
    // }

    const [doctors, setDoctors] = useState([]);
    const [role, setRole] = useState(null);
    const [services, setServices] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({ avatar: null, fullName: '' });

    useEffect(() => {
        const fetchUserData = async () => {
            const userData = await getUserInfo();
            setUserInfo(userData);
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        const getUserInfo = async () => {
            try {
                const userRole = await AsyncStorage.getItem('role');
                setRole(userRole);
            } catch (error) {
                console.error('Error retrieving user info:', error);
            }
        };

        getUserInfo();
    }, []);

    // const doctorDetail = (id) => {
    //     navigation.navigate('DoctorDetail', { id: id });
    // }

    const goRecommendedScreen = () => {
        navigation.navigate('Recommend');
    }

    const goServiceScreen = () => {
        navigation.navigate('PetServices');
    }

    const scheduleDetail = () => {
        if (role === 'Doctor') {
            navigation.navigate('DoctorSchedule');
        } else {
            navigation.navigate('ScheduleScreen');
        }
    }

    const filteredDoctors = useMemo(() => {
        return doctors.filter(doctor =>
            doctor.DoctorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.Specialization?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, doctors]);


    const filteredServices = useMemo(() => {
        return services.filter(service =>
            service.ServiceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.DoctorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            service.CategoryName?.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [searchQuery, services]);

    useEffect(() => {
        const getDoctorsData = async () => {
            try {
                const data = await getDoctorTopReviews();
                setDoctors(data);
            } catch (error) {
                console.error("Error fetching doctors:", error);
            } finally {
                setLoading(false);
            }
        };
        getDoctorsData();
    }, []);

    useEffect(() => {
        const fetchServiceData = async () => {
            try {
                const data = await fetchRecommendedServices();
                setServices(data);
            } catch (error) {
                console.error("Error fetching pet care services:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchServiceData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text>Loading doctors, please wait...</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={styles.container}>
                <View style={styles.headerContainer}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.welcomeText}>Welcome, {userInfo.fullName || 'Guest'}!</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <Image
                            source={userInfo.avatar ? { uri: userInfo.avatar } : icons.profile_icon}
                            style={styles.profileIcon}
                        />
                    </TouchableOpacity>
                </View>

                {/* Notification Card */}
                <View style={styles.notificationCard}>
                    <View style={styles.notificationTextContainer}>
                        <Text style={styles.notificationText}>
                            Your pet has a vaccination tomorrow at 7:00 AM!
                        </Text>
                        <TouchableOpacity onPress={() => scheduleDetail()} style={styles.button}>
                            <Text style={styles.buttonText}>See Detail</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.notificationImageContainer}>
                        <Image source={images.puppy} style={styles.notificationImgage} />
                    </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    {/* <Icon name="search" size={15} style={{ position: 'absolute', left: 10 }} /> */}
                    <Image source={icons.search} style={styles.searchIcon} />
                    <TextInput
                        placeholder='Search for ...'
                        style={styles.searchBar}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
                        <Text style={styles.sectionTitle}>Recommended for Your Pup</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => goRecommendedScreen()}>
                            <Image source={icons.right_arrow} style={styles.rightArrow} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                    <View style={styles.horizontalScrollContainer}>
                        {filteredDoctors.length === 0 ? (
                            <Text style={styles.emptyMessage}>No doctors found matching your search.</Text>
                        ) : (
                            filteredDoctors.map(doctor => (
                                <TouchableOpacity key={doctor.UserID} onPress={() => navigation.navigate('DoctorDetail', { userID: doctor.UserID, doctorID: doctor.DoctorID })}>
                                    <View style={styles.card}>
                                        <View style={styles.profileCard}>
                                            <Image source={{ uri: doctor.Avatar || 'https://static-00.iconduck.com/assets.00/avatar-default-icon-1975x2048-2mpk4u9k.png' }} style={styles.profileImage} />
                                            <View style={styles.cardText}>
                                                <Text style={styles.cardTextDetail}>{doctor.DoctorName || 'Unknown Doctor'}</Text>
                                                <Text style={styles.cardTextDetail}>{doctor.AverageRating ? `${doctor.AverageRating}⭐` : 'No Rating'}</Text>
                                            </View>
                                            <Text style={{ fontSize: 10, color: colors.inactive, textAlign: 'right', paddingRight: 10 }}>
                                                {doctor.TotalReviews} reviews
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            ))
                        )}

                        {/* <TouchableOpacity onPress={() => doctorDetail()}>
                            <View style={styles.card}>
                                <View style={styles.profileCard}>
                                    <Image source={images.caregiver2} style={styles.profileImage} />
                                    <View style={styles.cardText}>
                                        <Text style={styles.cardTextDetail}>Jenna Smith</Text>
                                        <Text style={styles.cardTextDetail}>4.9⭐</Text>
                                    </View>
                                    <Text style={{ fontSize: 10, color: colors.inactive, textAlign: 'right', paddingRight: 10 }}>1,235 reviews</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => doctorDetail()}>
                            <View style={styles.card}>
                                <View style={styles.profileCard}>
                                    <Image source={images.caregiver1} style={styles.profileImage} />
                                    <View style={styles.cardText}>
                                        <Text style={styles.cardTextDetail}>Jenna Smith</Text>
                                        <Text style={styles.cardTextDetail}>4.7⭐</Text>
                                    </View>
                                    <Text style={{ fontSize: 10, color: colors.inactive, textAlign: 'right', paddingRight: 10 }}>1,235 reviews</Text>
                                </View>
                            </View>
                        </TouchableOpacity> */}
                    </View>
                </ScrollView>

                {/* <ScrollView>
                    <View style={styles.cardServices}>
                        <Image source={{ uri: 'https://iccawardsshow.com/wp-content/uploads/2025/02/LEGRAND-WOLF-1.jpg' }} style={styles.imageServices} />
                        <View style={styles.info}>
                            <Text style={styles.nameServices}>{products.name}</Text>
                            <View style={styles.priceContainer}>
                                <Text style={styles.priceServices}>{products.price}</Text>
                                <Text style={styles.oldPrice}>{products.oldPrice}</Text>
                                <Text style={styles.quantity}>Qty: {products.quantity}</Text>
                            </View>
                            <Text style={styles.status}>{products.status}</Text>
                            <Text style={styles.discount}>{products.discount}</Text>
                        </View>
                        <TouchableOpacity style={styles.button}>
                            <Text style={styles.buttonText}>Track Order</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView> */}

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                    <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
                        <Text style={styles.sectionTitle}>Recommended for Your Services</Text>
                    </View>
                    <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                        <TouchableOpacity onPress={() => goServiceScreen()}>
                            <Image source={icons.right_arrow} style={styles.rightArrow} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView>
                    {filteredServices.length === 0 ? (
                        <Text style={styles.emptyMessage}>No services found matching your search.</Text>
                    ) : (
                        filteredServices.map(service => (
                            <TouchableOpacity key={service.ServiceID} onPress={() => navigation.navigate('ServiceDetail', { serviceID: service.ServiceID, doctorID: service.DoctorID })}>
                                <View key={service.ServiceID} style={styles.cardContainer}>
                                    <View style={styles.cardServices}>
                                        <Image source={{ uri: service.Url }} style={styles.imageServices} />
                                        <View style={styles.info}>
                                            <Text style={styles.nameServices}>{service.ServiceName}</Text>
                                            <Text style={{ fontSize: 12, color: colors.inactive }}>{service.DoctorName}</Text>
                                            <View style={styles.priceContainer}>
                                                <Text style={styles.priceServices}>{service.Cost} $</Text>
                                            </View>
                                        </View>

                                        {/* Button và Review được đặt trong cùng một container */}
                                        <View style={styles.actionContainer}>
                                            {/* <TouchableOpacity style={styles.buttonSevices}>
                                                <Text style={styles.buttonSevicesText}>➡️</Text>
                                            </TouchableOpacity> */}

                                            {/* Di chuyển phần đánh giá xuống dưới button */}
                                            <View style={styles.reviewsContainer}>
                                                <View style={styles.ratingService}>
                                                    <Text style={styles.cardServiceTextDetail}>{service.AverageRating}⭐</Text>
                                                </View>
                                                <View style={styles.reviewService}>
                                                    <Text style={styles.cardServiceTextDetail}>{service.TotalReviews} reviews</Text>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))
                    )}
                </ScrollView>


                <Text style={styles.sectionTitle}>Popular Caregivers</Text>
                {doctors.map((doctor) => {
                    // Chuyển đổi chuỗi AvailableFor thành mảng để dễ xử lý
                    const availablePets = doctor.AvailableFor.split(',').map(pet => pet.trim().toLowerCase());

                    return (
                        <TouchableOpacity key={doctor.UserID} onPress={() => navigation.navigate('DoctorDetail', { userID: doctor.UserID, doctorID: doctor.DoctorID })}>
                            <View style={styles.cardLarge}>
                                <Image source={{ uri: doctor.Avatar }} style={styles.cardLargeImage} />
                                <View style={styles.cardLargeTextContainer}>
                                    <Text style={styles.cardLargeTitle}>{doctor.DoctorName}</Text>
                                    <Text style={styles.cardLargeService}>Service: {doctor.Specialty}</Text>
                                    <View style={styles.cardLargeLocation}>
                                        <Image source={icons.location} style={styles.cardLargeDistanceIcon} />
                                        <Text>{doctor.Address ? doctor.Address : "Address not available"}</Text>
                                    </View>
                                    <View style={styles.cardLargeAvailableContainer}>
                                        <Text style={styles.cardLargeAvailableText}>Available for</Text>
                                        <View style={styles.petIconsContainer}>
                                            {/* Kiểm tra từng loại thú cưng */}
                                            {availablePets.includes('dog') && (
                                                <Image source={icons.dog} style={styles.petIcon} />
                                            )}
                                            {availablePets.includes('cat') && (
                                                <Image source={icons.cat} style={styles.petIcon} />
                                            )}
                                            {availablePets.includes('reptiles') && (
                                                <Image source={icons.reptile} style={styles.petIcon} />
                                            )}
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    );
                })}

                {/* <ScrollView style={styles.container}>
                    <TouchableOpacity onPress={() => doctorDetail()}>
                        <View style={styles.cardLarge}>
                            <Image source={images.caregiver1} style={styles.cardLargeImage} />
                            <View style={styles.cardLargeTextContainer}>
                                <Text style={styles.cardLargeTitle}>Dr. Stone</Text>
                                <Text style={styles.cardLargeService}>Service: Vaccine, Surgery</Text>
                                <View style={styles.cardLargeLocation}>
                                    <Image source={icons.location} style={styles.cardLargeDistanceIcon} />
                                    <Text>Cau giay, Ha Noi</Text>
                                </View>
                                <View style={styles.cardLargeAvailableContainer}>
                                    <Text style={styles.cardLargeAvailableText}>Available for</Text>
                                    <View style={styles.petIconsContainer}>
                                        <Image source={icons.dog} style={styles.petIcon} />
                                        <Image source={icons.cat} style={styles.petIcon} />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                </ScrollView> */}
            </ScrollView >
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    welcomeText: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    profileIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    notificationCard: {
        flexDirection: 'row', // Đảm bảo layout theo chiều ngang
        padding: 16,
        backgroundColor: colors.background_color,
        borderRadius: 10,
        marginBottom: 10,
    },
    notificationTextContainer: {
        flex: 1, // chiếm 50% chiều rộng
        justifyContent: 'center',
        paddingRight: 8,
    },
    notificationImageContainer: {
        flex: 1, // chiếm 50% chiều rộng
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationText: {
        fontSize: 18,
        color: colors.white,
    },
    notificationImgage: {
        width: 150,
        height: 150,
        borderRadius: 10,
    },
    button: {
        backgroundColor: colors.login_color,
        padding: 10,
        borderRadius: 10,
        marginTop: 5,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
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
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    horizontalScrollContainer: {
        flexDirection: 'row',
        paddingHorizontal: 5,
    },
    card: {
        width: 160,
        marginRight: 10,
        height: 160,
        backgroundColor: colors.blue_light,
        borderRadius: 10
    },
    profileImage: {
        width: '100%',
        height: 90,
        marginBottom: 5,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    cardText: {
        backgroundColor: colors.blue_light,
        flexDirection: 'row',
        height: 36,
        borderBottomRightRadius: 10,
        borderBottomLeftRadius: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 5,
    },
    cardTextDetail: {
        fontWeight: 'bold',
        fontSize: 12,
    },
    cardLarge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 12,
        marginHorizontal: 6,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 4, // Shadow for Android
    },
    cardLargeImage: {
        width: 90,
        height: 150,
        borderRadius: 12,
        marginRight: 12,
    },
    cardLargeTextContainer: {
        flex: 1,
        justifyContent: 'center',
    },
    cardLargeTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    cardLargeService: {
        fontSize: 14,
        color: '#666',
        marginTop: 3,
    },
    cardLargeLocation: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    cardLargeDistanceIcon: {
        width: 18,
        height: 18,
        marginRight: 6,
        tintColor: '#888',
    },
    cardLargeAvailableContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
    },
    cardLargeAvailableText: {
        color: 'green',
        fontWeight: 'bold',
    },
    petIconsContainer: {
        flexDirection: 'row',
        gap: 6,
    },
    petIcon: {
        width: 18,
        height: 18,
    },
    searchIcon: {
        position: 'absolute',
        left: 8,
        width: 20,
        height: 20,
        fontWeight: 'bold',
    },
    rightArrow: {
        width: 26,
        height: 26,
        fontWeight: 'bold'
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyMessage: {
        textAlign: 'center',
        color: '#6B7280',
        fontSize: 18,
        marginTop: 10,
    },
    // ----------- Services Card -----------------
    cardContainer: {
        marginBottom: 10,
    },
    cardServices: {
        backgroundColor: "white",
        borderRadius: 10,
        padding: 15,
        flexDirection: "row",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    imageServices: {
        width: 80,
        height: 80,
        borderWidth: 1,
        borderRadius: 10,
    },
    info: {
        flex: 1,
        marginLeft: 15,
    },
    nameServices: {
        fontSize: 16,
        fontWeight: "bold",
    },
    priceContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: 5,
    },
    priceServices: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },
    buttonSevices: {
        backgroundColor: "#000",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 5,
        alignSelf: "center",
    },
    buttonSevicesText: {
        color: "#fff",
        fontWeight: "bold",
    },
    actionContainer: {
        flexDirection: "column", // Sắp xếp theo cột
        alignItems: "center", // Căn giữa button và review
    },
    reviewsContainer: {
        marginTop: 8, // Thêm khoảng cách giữa button và review
        alignItems: "center",
    },
    ratingService: {
        width: 90,
        backgroundColor: "#f8f8f8",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginTop: 5, // Khoảng cách giữa các rating items
    },
    reviewService: {
        width: 90,
        backgroundColor: "#f8f8f8",
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 5,
        marginTop: 5, // Khoảng cách giữa các rating items
    },
    cardServiceTextDetail: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#333",
    },
});

export default HomeScreen;
