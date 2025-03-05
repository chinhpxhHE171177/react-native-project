// favouriteModel.js
import db from '../config/db.js';

// Get All Favourites Doctor By UserID
const getFavouritesDoctorByUserID = (UserID, callback) => {
    const sql = `SELECT 
        f.FavoriteID,
        d.DoctorID,
        du.FullName AS DoctorName,
        d.Specialty,
        d.Experience,
        d.Avatar,
        ROUND(COALESCE(AVG(r.Rating), 0), 2) AS AverageRating,
        COUNT(r.ReviewID) AS TotalReviews,
        d.AvailableFor
    FROM Favorites f
    JOIN Users u ON f.UserID = u.UserID
    JOIN Doctors d ON f.DoctorID = d.DoctorID
    JOIN Users du ON d.UserID = du.UserID
    LEFT JOIN Reviews r ON d.DoctorID = r.DoctorID
    WHERE u.UserID = ? AND f.DoctorID IS NOT NULL
    GROUP BY f.FavoriteID, d.DoctorID, d.Avatar,
    du.FullName, d.Specialty, d.Experience`;
    db.query(sql, [UserID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}


// Get All Favourites PET By UserID

const getFavouritesPetByUserID = (UserID, callback) => {
    const sql = `SELECT 
        f.FavoriteID,
        u.FullName AS CustomerName,
        p.PetID,
        p.PetName,
        p.PetBreed,
        pc.CategoryName AS PetCategory,
        p.PetAge,
        P.PetImage,
        p.PetGender,
        p.PetWeight
    FROM Favorites f
    JOIN Users u ON f.UserID = u.UserID
    JOIN Pets p ON f.PetID = p.PetID
    JOIN PetCategories pc ON p.CategoryID = pc.CategoryID
    WHERE u.UserID = ? AND f.PetID IS NOT NULL`;
    db.query(sql, [UserID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}


// Get All Favourites Service By UserID

const getFavouritesServiceByUserID = (UserID, callback) => {
    const sql = `SELECT 
        f.FavoriteID,
        u.FullName AS CustomerName,
        s.ServiceID,
        s.ServiceName,
        s.Description,
        s.Cost,
        s.Url,
        c.CategoryName AS ServiceCategory,
        du.FullName AS DoctorName,
        ROUND(COALESCE(AVG(r.Rating), 0), 2) AS AverageRating,
        COUNT(r.ReviewID) AS TotalReviews
    FROM Favorites f
    JOIN Users u ON f.UserID = u.UserID
    JOIN PetCareServices s ON f.ServiceID = s.ServiceID
    JOIN PetCareCategories c ON s.CategoryID = c.CategoryID
    LEFT JOIN ServiceReviews r on s.ServiceID = r.ServiceID
    JOIN Doctors d ON s.DoctorID = d.DoctorID
    JOIN Users du ON d.UserID = du.UserID
    WHERE u.UserID = ? AND f.ServiceID IS NOT NULL
    GROUP BY f.FavoriteID,
        u.FullName,
        s.ServiceID,
        s.ServiceName,
        s.Description,
        s.Cost,
        s.Url,
        c.CategoryName,
        du.FullName`;
    db.query(sql, [UserID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}

// ADD FAVOURITE DOCTOR BY USER ID
const addFavouriteDoctorByUserID = (UserID, DoctorID, callback) => {
    const sql = `INSERT INTO Favorites (UserID, DoctorID) VALUES (?, ?)`;
    db.query(sql, [UserID, DoctorID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results.insertId);
        }
    });
};


// ADD FAVOURITE PET BY USER ID
const addFavouritePetByUserID = (UserID, PetID, callback) => {
    const sql = `INSERT INTO Favorites (UserID, PetID) VALUES (?, ?)`;
    db.query(sql, [UserID, PetID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results.insertId);
        }
    });
};


// ADD FAVOURITE SERVICE BY USER ID
const addFavouriteServiceByUserID = (UserID, ServiceID, callback) => {
    const sql = `INSERT INTO Favorites (UserID, ServiceID) VALUES (?, ?)`;
    db.query(sql, [UserID, ServiceID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results.insertId);
        }
    });
};

// GET FAVOURITEID BY USER ID AND DOCTOR ID
const getFavouriteIDByUserIDAndDoctorID = (UserID, DoctorID, callback) => {
    const sql = `SELECT FavoriteID FROM Favorites WHERE UserID = ? AND DoctorID = ?`;
    db.query(sql, [UserID, DoctorID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results[0]);
        }
    });
};

// GET FAVOURITEID BY USER ID AND PET ID
const getFavouriteIDByUserIDAndPetID = (UserID, PetID, callback) => {
    const sql = `SELECT FavoriteID FROM Favorites WHERE UserID = ? AND PetID = ?`;
    db.query(sql, [UserID, PetID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results[0]);
        }
    });
};

// GET FAVOURITEID BY USER ID AND SERVICE ID
const getFavouriteIDByUserIDAndServiceID = (UserID, ServiceID, callback) => {
    const sql = `SELECT FavoriteID FROM Favorites WHERE UserID = ? AND ServiceID = ?`;
    db.query(sql, [UserID, ServiceID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results[0]);
        }
    });
};


// UNFAVOURITE BY USER ID AND FAVOURITE ID
const unfavourite = (UserID, FavouriteID, callback) => {
    const sql = `DELETE FROM Favorites WHERE UserID = ? AND FavoriteID = ?`;
    db.query(sql, [UserID, FavouriteID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results.affectedRows > 0);
        }
    });
};

export {
    addFavouriteDoctorByUserID,
    addFavouritePetByUserID,
    addFavouriteServiceByUserID,
    getFavouritesDoctorByUserID,
    getFavouritesPetByUserID,
    getFavouritesServiceByUserID,
    getFavouriteIDByUserIDAndDoctorID,
    getFavouriteIDByUserIDAndPetID,
    getFavouriteIDByUserIDAndServiceID,
    unfavourite
};

