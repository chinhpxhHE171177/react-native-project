// reviewsModel.js 
import db from '../config/db.js';

// Get Reviews By Doctor ID
const getReviewsByDoctorID = (doctorID, callback) => {
    const sql = `SELECT r.*, u.UserID, u.FullName, u.Url FROM reviews r JOIN users u ON r.CustomerID = u.UserID WHERE r.doctorID = ?`
    db.query(sql, [doctorID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);  // Trả về toàn bộ danh sách review
        }
    });
}

// Add New Review 
const addNew = (review, callback) => {
    const { DoctorID, CustomerID, ReviewText, Rating, CreatedAt } = review;

    if (!DoctorID || !CustomerID || !Rating || Rating < 1 || Rating > 5) {
        return callback({ success: false, message: 'Invalid data' });
    }

    const sql = `INSERT INTO reviews (DoctorID, CustomerID, ReviewText, Rating, CreatedAt) VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [DoctorID, CustomerID, ReviewText, Rating, CreatedAt], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, { success: true, reviewID: result.insertId });
        }
    });
}

// Update Review By ReviewID and CustomerID
const updateReview = (reviewID, customerID, review, callback) => {
    const { ReviewText, Rating, CreatedAt } = review;

    const sql = `UPDATE reviews SET ReviewText = ?, Rating = ?, CreatedAt = ? WHERE ReviewID = ? AND CustomerID = ?`;
    db.query(sql, [ReviewText, Rating, CreatedAt, reviewID, customerID], (err, result) => {
        if (err) {
            callback(err, null);
        } else if (result.affectedRows === 0) {
            callback(null, { success: false, message: 'No review updated. Check ReviewID and CustomerID.' });
        } else {
            callback(null, { success: true, message: 'Review updated successfully' });
        }
    });
}

// DELETE Review By ReviewID and CustomerID
const deleteReview = (reviewID, customerID, callback) => {
    const sql = `DELETE FROM reviews WHERE ReviewID = ? AND CustomerID = ?`;
    db.query(sql, [reviewID, customerID], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, { success: true, message: 'Review deleted successfully' });
        }
    });
}


export { getReviewsByDoctorID, addNew, updateReview, deleteReview };
