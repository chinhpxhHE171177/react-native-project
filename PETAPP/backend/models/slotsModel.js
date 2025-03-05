import db from '../config/db.js';

// Get available slots for a doctor
const getSlotByID = (doctorID, callback) => {
    const sql = `SELECT SlotID, SlotStart, SlotEnd 
        FROM DoctorSlots
        WHERE DoctorID = ?
        AND IsAvailable = TRUE;`
    db.query(sql, [doctorID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results); 
        }
    });
}

// Get available slots for a doctor
const getAllSlotByID = (doctorID, callback) => {
    const sql = `SELECT SlotID, SlotStart, SlotEnd, IsAvailable
        FROM DoctorSlots
        WHERE DoctorID = ?`
    db.query(sql, [doctorID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results); 
        }
    });
}

// Add a new available slot for a doctor
const addSlot = (doctorID, slotStart, slotEnd, callback) => {
    const sql = `INSERT INTO DoctorSlots (DoctorID, SlotStart, SlotEnd, IsAvailable)
                 VALUES (?, ?, ?, TRUE)`;
    db.query(sql, [doctorID, slotStart, slotEnd], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);  
        }
    });
};

// Update an existing slot for a doctor
const updateSlot = (slotID, doctorID, slotStart, slotEnd, callback) => {
    const sql = `UPDATE DoctorSlots
                 SET SlotStart = ?, SlotEnd = ?
                 WHERE SlotID = ? AND DoctorID = ?`;
    db.query(sql, [slotStart, slotEnd, slotID, doctorID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);  
        }
    });
};

// Delete a slot (mark as unavailable) for a doctor
const deleteSlot = (slotID, doctorID, callback) => {
    const sql = `UPDATE DoctorSlots 
                 SET IsAvailable = FALSE 
                 WHERE SlotID = ? AND DoctorID = ? AND IsAvailable = TRUE`;
    db.query(sql, [slotID, doctorID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);  
        }
    });
};

// Active a slot (mark as available) for a doctor
const activeSlot = (slotID, doctorID, callback) => {
    const sql = `UPDATE DoctorSlots 
                 SET IsAvailable = TRUE 
                 WHERE SlotID = ? AND DoctorID = ? AND IsAvailable = FALSE`;
    db.query(sql, [slotID, doctorID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);  
        }
    });
};

// Delete a slot completely from the database
const deleteSlotCompletely = (slotID, doctorID, callback) => {
    const sql = `DELETE FROM DoctorSlots 
                 WHERE SlotID = ? AND DoctorID = ?`;
    db.query(sql, [slotID, doctorID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);  
        }
    });
};

export { 
    getSlotByID, 
    addSlot, 
    updateSlot, 
    deleteSlot, 
    activeSlot, 
    deleteSlotCompletely, 
    getAllSlotByID 
};
