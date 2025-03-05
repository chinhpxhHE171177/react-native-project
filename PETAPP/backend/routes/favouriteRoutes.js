// favouriteRoutes.js
import express from 'express';
import {
    getFavouritesDoctor,
    getFavouritesPet,
    getFavouritesService,
    getFavIDByUIDAndDID,
    getFavIDByUIDAndPID,
    getFavIDByUIDAndSID,
    addFavouriteDoctor,
    addFavouritePet,
    addFavouriteService,
    unfavouriteItem
} from '../controllers/favouriteController.js';

const router = express.Router();

// API endpoints
router.get('/favourites/doctor/:UserID', getFavouritesDoctor);
router.get('/favourites/pet/:UserID', getFavouritesPet);
router.get('/favourites/service/:UserID', getFavouritesService);
router.get('/favourites/doctorID/:UserID/:DoctorID', getFavIDByUIDAndDID);
router.get('/favourites/petID/:UserID/:PetID', getFavIDByUIDAndPID);
router.get('/favourites/serviceID/:UserID/:ServiceID', getFavIDByUIDAndSID);
router.post('/addFavDoctor', addFavouriteDoctor);
router.post('/addFavPet', addFavouritePet);
router.post('/addFavService', addFavouriteService);
router.delete('/unfavourite', unfavouriteItem);

export default router;
