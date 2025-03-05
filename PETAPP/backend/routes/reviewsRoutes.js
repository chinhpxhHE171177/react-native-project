// reviewsRoute.js 
import express from 'express';
import { getReviewsOfDoctor, addNewReview, updateReviewByReviewIDAndCustomerID, deleteReviewByReviewIDAndCustomerID } from '../controllers/reviewsController.js';

const router = express.Router();

router.get('/reviews/:id', getReviewsOfDoctor);
router.post('/reviews/add', addNewReview);
router.put('/reviews/:reviewID/:customerID', updateReviewByReviewIDAndCustomerID);
router.delete('/reviews/:reviewID/:customerID', deleteReviewByReviewIDAndCustomerID);

export default router;