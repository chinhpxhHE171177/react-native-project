// serviceController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getReviewsByServiceID, addNew, updateReview, deleteReview } from '../models/serviceReviewsModel.js';

// GET ALL DATA REVIEWS BY SERVICEID

export const getReviewBySID = (req, res) => {
    const {serviceID} = req.params;

    getReviewsByServiceID(serviceID, (err, reviews) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ error: "Failed to fetch reviews by service ID" });
        }
        if (!reviews || reviews.length === 0) {
            console.warn("⚠️ No reviews found for service ID:", serviceID);
            return res.status(404).json({ message: "Reviews not found" });
        }
        res.json(reviews);
    });
}

// ADD NEW SERVICE REVIEW

export const addServiceReview = (req, res) => {
    const review = req.body;
    console.log("📢 Adding new service review:", review); 

    // Validate the review data here
    if (!review.ServiceID || !review.UserID || !review.ReviewText || review.Rating < 1 || review.Rating > 5) {
        return res.status(400).json({ success: false, message: 'Invalid data' });
    }

    addNew(review, (err, result) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ error: "Failed to add new service review" });
        }
        res.json({ success: true, message: "Service review added successfully", reviewID: result.reviewID });
    });
}


// UPDATE SERVICE REVIEW BY REVIEWID AND USERID

export const updateServiceReview = (req, res) => {
    const { reviewID, userID } = req.params;

    // Get the updated review data from the requesr body
    updateReview(reviewID, userID, req.body, (err, result) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ error: "Failed to update service review" });
        }
        res.json({ success: true, message: "Service review updated successfully" });
    });
}

// DELETE SERVICE REVIEW BY REVIEW ID AND USERID

export const deleteServiceReview = (req, res) => {
    const { reviewID, userID } = req.params;

    deleteReview(reviewID, userID, (err, result) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ error: "Failed to delete service review" });
        }
        res.json({ success: true, message: "Service review deleted successfully" });
    });
}

