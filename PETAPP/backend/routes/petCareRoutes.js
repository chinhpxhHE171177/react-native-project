// petCareRoutes.js
import express from 'express';
import { getAllCategory, getRecommendServices, getServices, getServicesByCID, getServicesByID } from '../controllers/petCareController.js';

const router = express.Router();

// API endpoints 
router.get('/categories', getAllCategory);
router.get('/services', getServices);
router.get('/services/recommended', getRecommendServices);
router.get('/serviceByCategory/:categoryID', getServicesByCID);
router.get('/getServiceByID/:serviceID', getServicesByID);

export default router;