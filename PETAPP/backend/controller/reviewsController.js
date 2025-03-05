// reviewsController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getReviewsByDoctorID, addNew, deleteReview, updateReview } from '../models/reviewsModel.js';

// Get Reviews By DoctorID

export const getReviewsOfDoctor = (req, res) => {
    const { id } = req.params;
    console.log(`📢 Fetching reviews for doctor ID: ${id}`);  // Debug log

    getReviewsByDoctorID(id, (err, doctor) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ error: "Failed to fetch reviews by doctor ID" });
        }
        if (!doctor || doctor.length === 0) {
            console.warn("⚠️ No reviews found for doctor ID:", id);
            return res.status(404).json({ message: "Reviews not found" });
        }
        res.json(doctor);
    });
};

// Add New Review 

export const addNewReview = (req, res) => {
    const review = req.body;
    console.log("📢 Ading new review:", review); // Debug log

    addNew(review, (err, result) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ error: "Failed to add new review" });
        }
        res.json({ success: true, message: "Review added successfully", reviewID: result.insertId });
    });
}

// Delete Review By ReviewID and CustomerID

export const deleteReviewByReviewIDAndCustomerID = (req, res) => {
    const { reviewID, customerID } = req.params;

    deleteReview(reviewID, customerID, (err, result) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ error: "Failed to delete review" });
        }
        res.json({ success: true, message: "Review deleted successfully" });
    });
}

// Update Review By ReviewID and CustomerID

export const updateReviewByReviewIDAndCustomerID = (req, res) => {
    const { reviewID, customerID } = req.params;

    // Get the updated review data from the requesr body
    updateReview(reviewID, customerID, req.body, (err, result) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ error: "Failed to update review" });
        }
        res.json({ success: true, message: "Review updated successfully" });
    });
}

