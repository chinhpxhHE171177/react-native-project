// petRoutes.js
import express from 'express';
import { addNewPet, getAllCategory, getAllPets, getPetByID, updatePetDetails, getPetByUserID } from '../controllers/petController.js';

const router = express.Router();

// API Endpoints
router.get('/pets', getAllPets);
router.get('/pets/categories', getAllCategory);
router.get('/pet/:petID', getPetByID);
router.get('/ownerPet/:userID', getPetByUserID);
router.post('/pets/add', addNewPet);
router.put('/pet/update/:petID/:userID', updatePetDetails);


export default router;