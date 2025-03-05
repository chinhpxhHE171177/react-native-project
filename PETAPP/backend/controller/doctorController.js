// doctorController.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Doctor } from '../models/doctorModel.js';

// Lấy danh sách tất cả bác sĩ
export const getDoctors = (req, res) => {
    Doctor.getAllDoctors((err, doctors) => {
        if (err) {
            res.status(500).json({ error: "Failed to fetch doctors" });
        } else {
            res.json(doctors);
        }
    });
};

// Lấy thông tin bác sĩ theo UserID
export const getDoctorByUserID = (req, res) => {
    const { id } = req.params;  // Lấy ID từ URL
    Doctor.getDoctorByUserID(id, (err, doctor) => {
        if (err) {
            res.status(500).json({ error: "Failed to fetch doctor by user ID" });
        } else if (!doctor) {
            res.status(404).json({ message: "Doctor not found" });
        } else {
            res.json(doctor);
        }
    });
};

// Get Doctors with total reviews and average rating 
export const getDoctorsWithTotalReviewsAndAverageRating = (req, res) => {
    Doctor.getallDoctorsWithTotalReviews((err, doctors) => {
        if (err) {
            res.status(500).json({ error: "Failed to fetch doctors with total reviews and average rating" });
        } else {
            res.json(doctors);
        }
    });
};

// Get Top Doctors 
export const getTopDoctors = (req, res) => {
    Doctor.getDoctorTopReviews((err, doctors) => {
        if (err) {
            res.status(500).json({ error: "Failed to fetch top doctors" });
        } else {
            res.json(doctors);
        }
    });
}

// Update Doctor Profile

export const updateDoctorDetails = async (req, res) => {
    const { doctorID } = req.params;
    const doctorData = req.body;

    console.log("Received doctorID:", doctorID);
    console.log("Received doctorData:", doctorData); 

    try {
        Doctor.updateDoctor(doctorID, req.body, (err, result) => {
            if (err) {
                console.error("❌ Database error:", err);
                return res.status(500).json({ error: "Failed to update doctor" });
            }
            res.json({ success: true, message: "Doctor updated successfully" });
        });
    } catch (error) {
        console.error("Error updating:", error); 
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


