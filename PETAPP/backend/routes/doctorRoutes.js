// doctorRoutes.js
import express from 'express';
import { getDoctors, getDoctorByUserID, getTopDoctors, getDoctorsWithTotalReviewsAndAverageRating, updateDoctorDetails } from '../controllers/doctorController.js';

const router = express.Router();

// API Endpoints
router.get('/doctors', getDoctors);  // Get all doctors
router.get('/doctors/:id', getDoctorByUserID);  // Get doctor by UserID
router.get('/recommended', getTopDoctors);  // Get top 2 doctors
router.get('/with-reviews', getDoctorsWithTotalReviewsAndAverageRating);
router.put('/update/:doctorID', updateDoctorDetails);

export default router;


