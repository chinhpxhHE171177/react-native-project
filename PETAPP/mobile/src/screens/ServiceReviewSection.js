// ServiceReviewSection.js
import React, { useEffect, useState } from 'react';
import moment from 'moment-timezone';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, Text, Image, ScrollView, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { colors, icons } from '../constants';
import { submitServiceReview, updateServiceReview, deleteServiceReview } from '../services/api';

const ServiceReviewSection = ({ reviews, serviceID, setReviews }) => {
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);
    const [userID, setUserID] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [fullName, setFullName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);

    useEffect(() => {
        const getUserId = async () => {
            try {
                const userId = await AsyncStorage.getItem('userID');
                const avatar = await AsyncStorage.getItem('url');
                const fullName = await AsyncStorage.getItem('fullName');
                if (userId) {
                    setUserID(userId);
                    setAvatarUrl(avatar);
                    setFullName(fullName);
                }
            } catch (error) {
                console.error('Error retrieving user ID:', error);
            }
        };
        getUserId();
    }, []);

    const handleSubmitReview = async () => {
        if (!userID) {
            Alert.alert("Error", "You must be logged in to submit a review.");
            return;
        }

        if (!reviewText.trim()) {
            Alert.alert("Error", "Review content cannot be empty.");
            return;
        }

        const localTime = moment().tz("Asia/Bangkok").format("YYYY-MM-DD HH:mm:ss");

        if (selectedReview) {
            const updatedReview = { ...selectedReview, ReviewText: reviewText, Rating: rating, CreatedAt: localTime };
            try {
                setIsSubmitting(true);
                const response = await updateServiceReview(updatedReview.ReviewID, userID, updatedReview);
                if (response.success) {
                    setReviews(reviews.map(r => (r.ReviewID === updatedReview.ReviewID ? updatedReview : r)));
                    Alert.alert("Success", "Service Review updated successfully!");
                } else {
                    Alert.alert("Error", "Failed to update review.");
                }
            } catch (error) {
                console.error("Update Service Review Error:", error);
                Alert.alert("Error", "Something went wrong.");
            } finally {
                setIsSubmitting(false);
                setSelectedReview(null);
                setReviewText('');
                setRating(0);
            }
            return;
        }

        const newReview = {
            ServiceID: serviceID,
            UserID: userID,
            ReviewText: reviewText,
            Rating: rating || 0,
            CreatedAt: localTime,
            Url: avatarUrl,
            FullName: fullName,
        };

        try {
            setIsSubmitting(true);
            const response = await submitServiceReview(newReview);
            if (response.success) {
                setReviews([...reviews, { ...newReview, ReviewID: response.ReviewID }]);
                setReviewText('');
                setRating(5);
                Alert.alert("Success", "Service Review submitted successfully!");
            } else {
                Alert.alert("Error", "Failed to submit service review.");
            }
        } catch (error) {
            console.error("Submit Service Review Error:", error);
            Alert.alert("Error", "Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewID) => {
        try {
            const response = await deleteServiceReview(reviewID, userID);
            if (response.success) {
                setReviews(reviews.filter(review => review.ReviewID !== reviewID));
                Alert.alert("Success", "Service Review deleted successfully!");
            } else {
                Alert.alert("Error", "Failed to delete service review.");
            }
        } catch (error) {
            console.error("Delete Service Review Error:", error);
            Alert.alert("Error", "Something went wrong.");
        }
    };

    return (
        <View style={{ flex: 1, height: 160, backgroundColor: colors.blue_light }}>
            <ScrollView contentContainerStyle={styles.reviewsContainer}>
                {reviews.length > 0 ? (
                    reviews.map((review) => {
                        const formattedDate = moment(review.CreatedAt).format("DD/MM/YYYY HH:mm");
                        return (
                            <View key={review.ReviewID} style={styles.reviewItem}>
                                <Image source={{ uri: review.Url }} style={styles.reviewAvatar} />
                                <View style={styles.reviewContent}>
                                    <View style={styles.reviewHeader}>
                                        <Text style={styles.reviewerName}>{review.FullName}</Text>
                                        <Text style={styles.reviewDate}>{formattedDate}</Text>
                                        {parseInt(review.UserID) === parseInt(userID) && (
                                            <TouchableOpacity onPress={() => setSelectedReview(selectedReview?.ReviewID === review.ReviewID ? null : review)}>
                                                <Image source={icons.dots_three_vertical} style={{ width: 20, height: 20 }} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                    <Text style={styles.star}>{review.Rating} ⭐</Text>
                                    <Text style={styles.reviewText}>{review.ReviewText}</Text>
                                    {selectedReview?.ReviewID === review.ReviewID && (
                                        <View style={styles.actionButtons}>
                                            <Button title="🖊️" onPress={() => setReviewText(review.ReviewText)} />
                                            <Button title="🗑️" onPress={() => handleDeleteReview(review.ReviewID)} />
                                        </View>
                                    )}
                                </View>
                            </View>
                        );
                    })
                ) : (
                    <Text style={styles.noReviewText}>No reviews available</Text>
                )}

                <View style={styles.reviewInputContainer}>
                    <Text style={styles.inputLabel}>Your Review:</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Write your review..."
                        value={reviewText}
                        onChangeText={setReviewText}
                        multiline
                    />

                    <Text style={styles.inputLabel}>Rating:</Text>
                    <View style={styles.starsContainer}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity key={star} onPress={() => setRating(star)}>
                                <Text style={[styles.star, { fontSize: 20, color: star <= rating ? '#FFD700' : '#CCCCCC' }]}>
                                    ★
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <Button title="Submit Review" onPress={handleSubmitReview} disabled={isSubmitting} />
                </View>
            </ScrollView>
        </View>
    );
};


export default ServiceReviewSection;

const styles = StyleSheet.create({
    reviewsContainer: { padding: 10 },
    reviewItem: { flexDirection: 'row', marginBottom: 10, padding: 10, backgroundColor: '#fff', borderRadius: 8 },
    reviewAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
    reviewContent: { flex: 1 },
    reviewHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    reviewerName: { fontWeight: 'bold' },
    reviewDate: { color: '#666', fontSize: 12 },
    star: { color: '#f5a623', fontSize: 14 },
    reviewText: { marginTop: 5 },
    actionButtons: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 5 },
    noReviewText: { textAlign: 'center', color: '#666', marginTop: 20 },
    reviewInputContainer: { padding: 10, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#ddd' },
    inputLabel: { fontWeight: 'bold', marginBottom: 5 },
    textInput: { borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, marginBottom: 10 },
    starsContainer: { flexDirection: 'row', justifyContent: 'flex-start', marginBottom: 10, },
    dots: { width: 30, height: 30, }
});

