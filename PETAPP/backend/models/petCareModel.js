// petCareModel.js
import db from '../config/db.js';


// Get All pet care category 
const getAllCates = (callback) => {
    const sql = `SELECT * FROM PetCareCategories`
    db.query(sql, (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}


// GET ALL PET CARE SERVICES 
const getAllServices = (callback) => {
    const sql = `SELECT 
            pcs.*, 
            pcc.CategoryName, 
            u.FullName AS DoctorName, 
            d.Avatar,
            ROUND(COALESCE(AVG(r.Rating), 0), 2) AS AverageRating,
            COUNT(r.ReviewID) AS TotalReviews
            FROM PetCareServices pcs
        JOIN PetCareCategories pcc ON pcs.CategoryID = pcc.CategoryID
        JOIN Doctors d ON pcs.DoctorID = d.DoctorID
        LEFT JOIN Users u ON d.UserID = u.UserID
        LEFT JOIN ServiceReviews r on pcs.ServiceID = r.ServiceID
        GROUP BY pcs.ServiceID, pcs.DoctorID, pcs.CategoryID, pcs.ServiceName,
        pcs.Description, pcs.Cost, pcs.Url, pcc.CategoryName, u.FullName, d.Avatar`
    db.query(sql, (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}

// GET TOP Services
const getTopServices = (callback) => {
    const sql = `SELECT 
            pcs.*, 
            pcc.CategoryName, 
            u.FullName AS DoctorName, 
            d.Avatar,
            ROUND(COALESCE(AVG(r.Rating), 0), 2) AS AverageRating,
            COUNT(r.ReviewID) AS TotalReviews
            FROM PetCareServices pcs
        JOIN PetCareCategories pcc ON pcs.CategoryID = pcc.CategoryID
        JOIN Doctors d ON pcs.DoctorID = d.DoctorID
        LEFT JOIN Users u ON d.UserID = u.UserID
        LEFT JOIN ServiceReviews r on pcs.ServiceID = r.ServiceID
        GROUP BY pcs.ServiceID, pcs.DoctorID, pcs.CategoryID, pcs.ServiceName,
        pcs.Description, pcs.Cost, pcs.Url, pcc.CategoryName, u.FullName, d.Avatar
        ORDER BY AverageRating DESC, TotalReviews DESC
    LIMIT 5`
    db.query(sql, (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}

// GET SERVICES BY CATEGORY
const getServiceByCateID = (categoryID, callback) => {
    const sql = `SELECT 
            pcs.*, 
            pcc.CategoryName, 
            u.FullName AS DoctorName, 
            d.Avatar,
            ROUND(COALESCE(AVG(r.Rating), 0), 2) AS AverageRating,
            COUNT(r.ReviewID) AS TotalReviews
            FROM PetCareServices pcs
        JOIN PetCareCategories pcc ON pcs.CategoryID = pcc.CategoryID
        JOIN Doctors d ON pcs.DoctorID = d.DoctorID
        LEFT JOIN Users u ON d.UserID = u.UserID
        LEFT JOIN ServiceReviews r on pcs.ServiceID = r.ServiceID
        WHERE pcc.CategoryID = ?
        GROUP BY pcs.ServiceID, pcs.DoctorID, pcs.CategoryID, pcs.ServiceName,
        pcs.Description, pcs.Cost, pcs.Url, pcc.CategoryName, u.FullName, d.Avatar`
    db.query(sql, [categoryID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}

// GET Service BY ID
const getServiceByID = (serviceID, callback) => {
    const sql = `SELECT 
            pcs.*, 
            pcc.CategoryName, 
            u.FullName AS DoctorName, 
            d.Avatar,
            d.Specialty,
            d.Experience,
            ROUND(COALESCE(AVG(r.Rating), 0), 2) AS AverageRating,
            COUNT(r.ReviewID) AS TotalReviews
            FROM PetCareServices pcs
        JOIN PetCareCategories pcc ON pcs.CategoryID = pcc.CategoryID
        JOIN Doctors d ON pcs.DoctorID = d.DoctorID
        LEFT JOIN Users u ON d.UserID = u.UserID
        LEFT JOIN ServiceReviews r on pcs.ServiceID = r.ServiceID
        WHERE pcs.ServiceID = ?
        GROUP BY pcs.ServiceID, pcs.DoctorID, pcs.CategoryID, pcs.ServiceName,
        pcs.Description, pcs.Cost, pcs.Url, pcc.CategoryName, u.FullName, d.Avatar,d.Specialty, d.Experience`
    db.query(sql, [serviceID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}

export { getAllCates, getAllServices, getTopServices, getServiceByCateID, getServiceByID };