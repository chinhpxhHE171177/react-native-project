// serviceReviewsModel.js 
import db from '../config/db.js';

// Get Reviews By Service ID
const getReviewsByServiceID = (serviceID, callback) => {
    const sql = `SELECT r.*, u.FullName, u.Url FROM ServiceReviews r 
        JOIN PetCareServices p ON r.ServiceID = p.ServiceID 
        JOIN Users u ON u.UserID = r.UserID
        WHERE r.ServiceID = ?`
    db.query(sql, [serviceID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);  
        }
    });
}

// Add New Review 
const addNew = (review, callback) => {
    const { ServiceID, UserID, ReviewText, Rating, CreatedAt } = review;

    if (!ServiceID || !UserID || !ReviewText || Rating < 1 || Rating > 5) {
        return callback(new Error('Invalid data'), null); // Pass the error to the callback
    }

    const sql = `INSERT INTO ServiceReviews (ServiceID, UserID, ReviewText, Rating, CreatedAt) VALUES (?, ?, ?, ?, ?)`;
    db.query(sql, [ServiceID, UserID, ReviewText, Rating, CreatedAt], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, { success: true, reviewID: result.insertId });
        }
    });
}

// Update Review By ReviewID and CustomerID
const updateReview = (reviewID, userID, review, callback) => {
    const { ReviewText, Rating, CreatedAt } = review;

    const sql = `UPDATE ServiceReviews SET ReviewText = ?, Rating = ?, CreatedAt = ? WHERE ReviewID = ? AND UserID = ?`;
    db.query(sql, [ReviewText, Rating, CreatedAt, reviewID, userID], (err, result) => {
        if (err) {
            callback(err, null);
        } else if (result.affectedRows === 0) {
            callback(null, { success: false, message: 'No service review updated. Check ReviewID and UserID.' });
        } else {
            callback(null, { success: true, message: 'Service review updated successfully' });
        }
    });
}

// DELETE Review By ReviewID and CustomerID
const deleteReview = (reviewID, userID, callback) => {
    const sql = `DELETE FROM ServiceReviews WHERE ReviewID = ? AND UserID = ?`;
    db.query(sql, [reviewID, userID], (err, result) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, { success: true, message: 'Service review deleted successfully' });
        }
    });
}


export { getReviewsByServiceID, addNew, updateReview, deleteReview };
