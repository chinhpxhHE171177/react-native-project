// serviceReviewsRoutes.js
import express from 'express';
import {getReviewBySID, addServiceReview, updateServiceReview, deleteServiceReview} from '../controllers/serviceReviewController.js';

const router = express.Router();

router.get('/reviews/:serviceID', getReviewBySID);
router.post('/reviews/add', addServiceReview);
router.put('/reviews/:reviewID/:userID', updateServiceReview);
router.delete('/reviews/:reviewID/:userID', deleteServiceReview);

export default router;