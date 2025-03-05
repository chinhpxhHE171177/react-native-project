// doctorModel.js
import db from '../config/db.js';

const Doctor = {
    getAllDoctors: (callback) => {
        const query = `
            SELECT d.DoctorID, u.UserID, u.FullName, d.Specialty, d.Experience, d.Rating, d.ReviewCount, d.AvailableFor, d.Avatar, d.About
            FROM Doctors d 
            JOIN Users u ON d.UserID = u.UserID
        `;
        db.query(query, (err, results) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, results);
            }
        });
    },

    // getDoctorByUserID
    getDoctorByUserID: (UserID, callback) => {
        const sql = `
            SELECT d.*, u.UserID, u.FullName 
            FROM Doctors d
            JOIN Users u ON d.UserID = u.UserID
            WHERE d.UserID = ?
        `;
        db.query(sql, [UserID], (err, results) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, results[0]);  // Trả về một kết quả duy nhất
            }
        });
    },

    // Get all doctors with total reviews and average rating 
    getallDoctorsWithTotalReviews: (callback) => {
        const sql = `SELECT 
        d.*,
        u.FullName AS DoctorName,
        ROUND(COALESCE(AVG(r.Rating), 0), 2) AS AverageRating,
        COUNT(r.ReviewID) AS TotalReviews
    FROM Doctors d
    JOIN Users u ON d.UserID = u.UserID
    LEFT JOIN Reviews r ON d.DoctorID = r.DoctorID
    GROUP BY d.DoctorID, d.UserID, d.Specialty, 
    d.Experience, d.Rating, d.ReviewCount, d.AvailableFor, 
    d.Address, d.Avatar, d.About, u.FullName `;
        db.query(sql, (err, results) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, results);
            }
        });
    },

    // Get doctor top reviews 
    getDoctorTopReviews: (callback) => {
        const sql = `SELECT 
        d.*,
        u.FullName AS DoctorName,
        ROUND(COALESCE(AVG(r.Rating), 0), 2) AS AverageRating,
        COUNT(r.ReviewID) AS TotalReviews
    FROM Doctors d
    JOIN Users u ON d.UserID = u.UserID
    LEFT JOIN Reviews r ON d.DoctorID = r.DoctorID
    GROUP BY d.DoctorID, d.UserID, d.Specialty, 
    d.Experience, d.Rating, d.ReviewCount, d.AvailableFor, 
    d.Address, d.Avatar, d.About, u.FullName
    ORDER BY AverageRating DESC, TotalReviews DESC
    LIMIT 5`;

        db.query(sql, (err, results) => {
            if (err) {
                callback(err, null);
            } else {
                callback(null, results);
            }
        });
    },

    updateDoctor: (doctorID, doctorData, callback) => {
        const { UserID, Specialty, Experience, AvailableFor, Address, Avatar, About} = doctorData;
        try {
            const sql = `UPDATE Doctors
            SET UserID = ?, Specialty = ?, Experience = ?, AvailableFor = ?, Address = ?, Avatar = ?, About = ?
            WHERE DoctorID = ?`;
            db.query(sql, [UserID, Specialty, Experience, AvailableFor, Address, Avatar, About, doctorID], (err, result) => {
                if (err) {
                    callback(err, null);
                } else if (result.affectedRows === 0) {
                    callback(null, { success: false, message: 'No doctor updated. Check DoctorID and UserID.' });
                } else {
                    callback(null, { success: true, message: 'Doctor updated successfully' });
                }
            });
        } catch (error) {
            console.error("❌ Error updating:", error);
            throw error;
        }
    }
};


export { Doctor };
