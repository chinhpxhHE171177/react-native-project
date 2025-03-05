// petController.js 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getAlls, getByID, getCategories, addNew, updatePet, getByUID } from '../models/petModel.js';

// GET ALL DATA PETS

export const getAllPets = (req, res) => {
    getAlls((err, pets) => {
        if (err) {
            res.status(500).json({ error: "Failed to fetch pets" });
        } else {
            res.json(pets);
        }
    });
}


// GET PET BY ID

export const getPetByID = (req, res) => {
    const { petID } = req.params;
    getByID(petID, (err, pet) => {
        if (err) {
            res.status(500).json({ error: "Failed to fetch pet by ID" });
        } else if (!pet) {
            res.status(404).json({ message: "Pet not found" });
        } else {
            res.json(pet);
        }
    });
}


// GET PET BY USER ID

export const getPetByUserID = (req, res) => {
    const { userID } = req.params;
    getByUID(userID, (err, pet) => {
        if (err) {
            res.status(500).json({ error: "Failed to fetch pet by user ID" });
        } else if (!pet) {
            res.status(404).json({ message: "Pet not found" });
        } else {
            res.json(pet);
        }
    });
}


// GET ALL Categories PETS

export const getAllCategory = (req, res) => {
    getCategories((err, cates) => {
        if (err) {
            res.status(500).json({ error: "Failed to fetch categories" });
        } else {
            res.json(cates);
        }
    });
}


// ADD NEW PET

export const addNewPet = (req, res) => {
    const petData = req.body;
    addNew(petData, (err, result) => {
        if (err) {
            console.error('Error adding pet:', err); // Log the error details
            res.status(500).json({ success: false, message: 'Database error', error: err });
        } else {
            res.status(201).json({ success: true, message: 'Pet added successfully!', petID: result.petID });
        }
    });
};


// Update pet details
// export const updatePetDetails = async (req, res) => {
//     const { petID, userID } = req.params;  // Assuming petID and userID are passed as URL params
//     const petData = req.body; // Assuming the pet data is sent in the request body

//     try {
//         const result = await updatePet(petID, userID, petData);
//         if (result.affectedRows > 0) {
//             res.status(200).json({ success: true, message: 'Pet updated successfully' });
//         } else {
//             res.status(400).json({ success: false, message: 'Failed to update pet' });
//         }
//     } catch (error) {
//         res.status(500).json({ success: false, message: 'Internal Server Error' });
//     }
// };


export const updatePetDetails = async (req, res) => {
    const { petID, userID } = req.params;
    const petData = req.body;

    console.log("Received petID:", petID);
    console.log("Received userID:", userID);
    console.log("Received petData:", petData); // Log the incoming pet data

    try {
        updatePet(petID, userID, req.body, (err, result) => {
            if (err) {
                console.error("❌ Database error:", err);
                return res.status(500).json({ error: "Failed to update pet" });
            }
            res.json({ success: true, message: "Pet updated successfully" });
        });
    } catch (error) {
        console.error("Error updating pet:", error); // Log the error for debugging
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};