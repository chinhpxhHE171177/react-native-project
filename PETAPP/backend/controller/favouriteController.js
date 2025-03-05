// favouriteController.js 
import {
    getFavouritesDoctorByUserID,
    getFavouritesPetByUserID,
    getFavouritesServiceByUserID,
    addFavouriteDoctorByUserID,
    addFavouritePetByUserID,
    addFavouriteServiceByUserID,
    getFavouriteIDByUserIDAndDoctorID,
    getFavouriteIDByUserIDAndPetID,
    getFavouriteIDByUserIDAndServiceID,
    unfavourite
} from '../models/favouriteModel.js';

// GET FAVOURITES DOCTOR BY USER ID
export const getFavouritesDoctor = (req, res) => {
    const UserID = req.params.UserID;
    getFavouritesDoctorByUserID(UserID, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error getting favourites doctor', error: err });
        }
        return res.status(200).json(results);
    });
}

// GET FAVOURITES PET BY USER ID
export const getFavouritesPet = (req, res) => {
    const UserID = req.params.UserID;
    getFavouritesPetByUserID(UserID, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error getting favourites pet', error: err });
        }
        return res.status(200).json(results);
    });
}

// GET FAVOURITES SERVICE BY USER ID
export const getFavouritesService = (req, res) => {
    const UserID = req.params.UserID;
    getFavouritesServiceByUserID(UserID, (err, results) => {
        if (err) {
            return res.status(500).json({ message: 'Error getting favourites service', error: err });
        }
        return res.status(200).json(results);
    });
}

// ADD FAVOURITE DOCTOR BY USER ID
export const addFavouriteDoctor = (req, res) => {
    const { UserID, DoctorID } = req.body;
    addFavouriteDoctorByUserID(UserID, DoctorID, (err, favouriteID) => {
        if (err) {
            return res.status(500).json({ message: 'Error adding favourite doctor', error: err });
        }
        return res.status(200).json({ message: 'Favourite doctor added successfully', favouriteID });
    });
}

// ADD FAVOURITE PET BY USER ID
export const addFavouritePet = (req, res) => {
    const { UserID, PetID } = req.body;
    addFavouritePetByUserID(UserID, PetID, (err, favouriteID) => {
        if (err) {
            return res.status(500).json({ message: 'Error adding favourite pet', error: err });
        }
        return res.status(200).json({ message: 'Favourite pet added successfully', favouriteID });
    });
}

// ADD FAVOURITE SERVICE BY USER ID
export const addFavouriteService = (req, res) => {
    const { UserID, ServiceID } = req.body;
    addFavouriteServiceByUserID(UserID, ServiceID, (err, favouriteID) => {
        if (err) {
            return res.status(500).json({ message: 'Error adding favourite service', error: err });
        }
        return res.status(200).json({ message: 'Favourite service added successfully', favouriteID });
    });
}


// GET FAVOURITEID BY USER ID AND DOCTOR ID
export const getFavIDByUIDAndDID = (req, res) => {
    const { UserID, DoctorID } = req.params;
    getFavouriteIDByUserIDAndDoctorID(UserID, DoctorID, (err, favouriteID) => {
        if (err) {
            return res.status(500).json({ message: 'Error getting favourite ID', error: err });
        }
        return res.status(200).json(favouriteID);
    });
}

// GET GET FAVOURITEID BY USER ID AND PET ID
export const getFavIDByUIDAndPID = (req, res) => {
    const { UserID, PetID } = req.params;
    getFavouriteIDByUserIDAndPetID(UserID, PetID, (err, favouriteID) => {
        if (err) {
            return res.status(500).json({ message: 'Error getting favourite ID', error: err });
        }
        return res.status(200).json(favouriteID);
    });
};


// GET GET FAVOURITEID BY USER ID AND SERVICE ID
export const getFavIDByUIDAndSID = (req, res) => {
    const { UserID, ServiceID } = req.params;
    getFavouriteIDByUserIDAndServiceID(UserID, ServiceID, (err, favouriteID) => {
        if (err) {
            return res.status(500).json({ message: 'Error getting favourite ID', error: err });
        }
        return res.status(200).json(favouriteID);
    });
};


// UNFAVOURITE
export const unfavouriteItem = (req, res) => {
    const { UserID, FavouriteID } = req.body; // Extract from body
    unfavourite(UserID, FavouriteID, (err, success) => {
        if (err) {
            return res.status(500).json({ message: 'Error unfavouriting item', error: err });
        }
        if (success) {
            return res.status(200).json({ message: 'Item unfavourited successfully' });
        } else {
            return res.status(400).json({ message: 'Failed to unfavourite item' });
        }
    });
};
