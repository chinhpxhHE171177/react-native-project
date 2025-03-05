// petModel.js 
import db from '../config/db.js';


// Get all pets 

const getAlls = (callback) => {
    const sql = 'SELECT p.*, c.CategoryName FROM Pets p JOIN PetCategories c ON p.CategoryID = c.CategoryID';
    db.query(sql, (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}

// Get pets by id 

const getByID = (PetID, callback) => {
    const sql = `SELECT p.*, u.FullName FROM Pets p
    JOIN Users u ON p.UserID = u.UserID
    WHERE p.PetID = ?`;
    db.query(sql, [PetID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results[0]);
        }
    });
}


// Get pets by user id 

const getByUID = (UserID, callback) => {
    const sql = `SELECT p.*, u.FullName FROM Pets p
    JOIN Users u ON p.UserID = u.UserID
    WHERE u.UserID = ?`;
    db.query(sql, [UserID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}

// Get all pet categories 

const getCategories = (callback) => {
    const sql = 'SELECT * FROM PetCategories ORDER BY CategoryID ASC';
    db.query(sql, (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}


// Add new pet 

const addNew = (pet, callback) => {
    const { UserID, CategoryID, PetName, PetBreed, PetAge, PetGender, PetWeight, PetDescription, PetImage } = pet;

    if (!UserID || !CategoryID || !PetName || !PetBreed || !PetAge || !PetGender || !PetImage) {
        return callback({ success: false, message: 'Invalid data' });
    }

    const sql = `INSERT INTO Pets (UserID, CategoryID, PetName, PetBreed, PetAge, PetGender, PetWeight, PetDescription, PetImage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.query(sql, [UserID, CategoryID, PetName, PetBreed, PetAge, PetGender, PetWeight, PetDescription, PetImage], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, { success: true, petID: result.insertId });
        }
    });
}


// // Update pet information
// const updatePet = async (petID, userID, petData) => {
//     const { PetName, PetAge, PetWeight, PetBreed, PetGender, PetDescription, PetImage, CategoryID } = petData;

//     try {
//         const query = `
//         UPDATE pets
//         SET PetName = ?, PetAge = ?, PetWeight = ?, PetBreed = ?, PetGender = ?, PetDescription = ?, PetImage = ?, CategoryID = ?
//         WHERE PetID = ? AND UserID = ?
//       `;

//         const result = await db.query(query, [
//             PetName, PetAge, PetWeight, PetBreed, PetGender, PetDescription, PetImage, CategoryID, petID, userID
//         ]);

//         return result;
//     } catch (error) {
//         console.error("Error updating pet:", error);
//         throw error;
//     }
// };

const updatePet = (petID, userID, petData, callback) => {
    const { PetName, PetAge, PetWeight, PetBreed, PetGender, PetDescription, PetImage, CategoryID } = petData;

    try {
        const sql = `UPDATE pets
        SET PetName = ?, PetAge = ?, PetWeight = ?, PetBreed = ?, PetGender = ?, PetDescription = ?, PetImage = ?, CategoryID = ?
        WHERE PetID = ? AND UserID = ?`;
        db.query(sql, [PetName, PetAge, PetWeight, PetBreed, PetGender, PetDescription, PetImage, CategoryID, petID, userID], (err, result) => {
            if (err) {
                callback(err, null);
            } else if (result.affectedRows === 0) {
                callback(null, { success: false, message: 'No pet updated. Check PetID and CustomerID.' });
            } else {
                callback(null, { success: true, message: 'Pet updated successfully' });
            }
        });
    } catch (error) {
        console.error("❌ Error updating pet:", error);
        throw error;
    }
};



export { getAlls, getByID, getByUID, getCategories, addNew, updatePet };