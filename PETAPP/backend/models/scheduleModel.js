// scheduleModel.js 
import db from '../config/db.js';

// Get List an appointment scheduled 
const getListScheduled = (callback) => {
    const sql = `SELECT 
            S.ScheduleID, 
            U.FullName AS DoctorName, 
            C.FullName AS CustomerName,  -- Lấy tên chủ thú cưng
            P.PetName, 
            PS.ServiceName, 
            S.AppointmentStart, 
            S.AppointmentEnd, 
            S.Status
        FROM Schedules S
        JOIN Doctors D ON S.DoctorID = D.DoctorID
        JOIN Users U ON D.UserID = U.UserID  -- Lấy tên bác sĩ
        JOIN Pets P ON S.PetID = P.PetID
        JOIN Users C ON P.UserID = C.UserID  -- Lấy tên chủ thú cưng
        JOIN PetCareServices PS ON S.ServiceID = PS.ServiceID
        WHERE S.Status = 'Scheduled';`
    db.query(sql, (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}


// Get List an appointment scheduled by User ID
const getListScheduledByUser = (userID, callback) => {
    const sql = `SELECT 
            S.ScheduleID, 
            UD.FullName AS DoctorName, 
            C.FullName AS CustomerName,  
            P.PetName, 
            PS.ServiceName, 
            S.AppointmentStart, 
            S.AppointmentEnd, 
            S.Status
        FROM Schedules S
        JOIN Doctors D ON S.DoctorID = D.DoctorID
        JOIN Users U ON S.CustomerID = U.UserID
        JOIN Users UD ON D.UserID = UD.UserID  
        JOIN Pets P ON S.PetID = P.PetID
        JOIN Users C ON P.UserID = C.UserID  
        JOIN PetCareServices PS ON S.ServiceID = PS.ServiceID
        WHERE U.UserID = ? AND S.Status = 'Scheduled';`
    db.query(sql, [userID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}


// Get List an appointment scheduled 
const getListScheduledByDoctor = (doctorID, callback) => {
    const sql = `SELECT 
            S.ScheduleID, 
            UD.FullName AS DoctorName, 
            C.FullName AS CustomerName,  
            P.PetName, 
            PS.ServiceName, 
            S.AppointmentStart, 
            S.AppointmentEnd, 
            S.Status
        FROM Schedules S
        JOIN Doctors D ON S.DoctorID = D.DoctorID
        JOIN Users U ON S.CustomerID = U.UserID
        JOIN Users UD ON D.UserID = UD.UserID  
        JOIN Pets P ON S.PetID = P.PetID
        JOIN Users C ON P.UserID = C.UserID  
        JOIN PetCareServices PS ON S.ServiceID = PS.ServiceID
        WHERE UD.UserID = ? AND S.Status = 'Scheduled';`
    db.query(sql, [doctorID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}


// Get List an appoinemtnt completed 
const getListCompleted = (callback) => {
    const sql = `SELECT 
            S.ScheduleID, 
            U.FullName AS DoctorName, 
            C.FullName AS CustomerName,  -- Lấy tên chủ thú cưng
            P.PetName, 
            PS.ServiceName, 
            S.AppointmentStart, 
            S.AppointmentEnd, 
            S.Status
        FROM Schedules S
        JOIN Doctors D ON S.DoctorID = D.DoctorID
        JOIN Users U ON D.UserID = U.UserID  -- Lấy tên bác sĩ
        JOIN Pets P ON S.PetID = P.PetID
        JOIN Users C ON P.UserID = C.UserID  -- Lấy tên chủ thú cưng
        JOIN PetCareServices PS ON S.ServiceID = PS.ServiceID
        WHERE S.Status = 'Completed';`
    db.query(sql, (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}


// Get List an appoinemtnt completed by user 
const getListCompletedByUser = (userID, callback) => {
    const sql = `SELECT 
            S.ScheduleID, 
            UD.FullName AS DoctorName, 
            C.FullName AS CustomerName,  
            P.PetName, 
            PS.ServiceName, 
            S.AppointmentStart, 
            S.AppointmentEnd, 
            S.Status
        FROM Schedules S
        JOIN Doctors D ON S.DoctorID = D.DoctorID
        JOIN Users U ON S.CustomerID = U.UserID
        JOIN Users UD ON D.UserID = UD.UserID  
        JOIN Pets P ON S.PetID = P.PetID
        JOIN Users C ON P.UserID = C.UserID  
        JOIN PetCareServices PS ON S.ServiceID = PS.ServiceID
        WHERE U.UserID = ? AND S.Status = 'Completed';`
    db.query(sql, [userID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}

// Get List an appoinemtnt completed by doctor 
const getListCompletedByDoctor = (doctorID, callback) => {
    const sql = `SELECT 
            S.ScheduleID, 
            UD.FullName AS DoctorName, 
            C.FullName AS CustomerName,  
            P.PetName, 
            PS.ServiceName, 
            S.AppointmentStart, 
            S.AppointmentEnd, 
            S.Status
        FROM Schedules S
        JOIN Doctors D ON S.DoctorID = D.DoctorID
        JOIN Users U ON S.CustomerID = U.UserID
        JOIN Users UD ON D.UserID = UD.UserID  
        JOIN Pets P ON S.PetID = P.PetID
        JOIN Users C ON P.UserID = C.UserID  
        JOIN PetCareServices PS ON S.ServiceID = PS.ServiceID
        WHERE UD.UserID = ? AND S.Status = 'Completed';`
    db.query(sql, [doctorID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}



// Get List an appoinemtnt Cancelled 
const getListCancelled = (callback) => {
    const sql = `SELECT 
            S.ScheduleID, 
            U.FullName AS DoctorName, 
            C.FullName AS CustomerName,  -- Lấy tên chủ thú cưng
            P.PetName, 
            PS.ServiceName, 
            S.AppointmentStart, 
            S.AppointmentEnd, 
            S.Status
        FROM Schedules S
        JOIN Doctors D ON S.DoctorID = D.DoctorID
        JOIN Users U ON D.UserID = U.UserID  -- Lấy tên bác sĩ
        JOIN Pets P ON S.PetID = P.PetID
        JOIN Users C ON P.UserID = C.UserID  -- Lấy tên chủ thú cưng
        JOIN PetCareServices PS ON S.ServiceID = PS.ServiceID
        WHERE S.Status = 'Cancelled';`
    db.query(sql, (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}


// Get List an appoinemtnt Cancelled by User ID
const getListCancelledByUser = (userID, callback) => {
    const sql = `SELECT 
            S.ScheduleID, 
            UD.FullName AS DoctorName, 
            C.FullName AS CustomerName,  
            P.PetName, 
            PS.ServiceName, 
            S.AppointmentStart, 
            S.AppointmentEnd, 
            S.Status
        FROM Schedules S
        JOIN Doctors D ON S.DoctorID = D.DoctorID
        JOIN Users U ON S.CustomerID = U.UserID
        JOIN Users UD ON D.UserID = UD.UserID  
        JOIN Pets P ON S.PetID = P.PetID
        JOIN Users C ON P.UserID = C.UserID  
        JOIN PetCareServices PS ON S.ServiceID = PS.ServiceID
        WHERE U.UserID = ? AND S.Status = 'Cancelled';`
    db.query(sql, [userID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
}

// Add a new scheduled appointment
const addAppointment = (doctorID, customerID, petID, serviceID, appointmentStart, appointmentEnd, callback) => {
    const sql = `INSERT INTO Schedules (DoctorID, CustomerID, PetID, ServiceID, AppointmentStart, AppointmentEnd, Status)
                 VALUES (?, ?, ?, ?, ?, ?, 'Scheduled')`;
    db.query(sql, [doctorID, customerID, petID, serviceID, appointmentStart, appointmentEnd], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};


// Update an existing appointment
const updateAppointment = (scheduleID, appointment, callback) => {
    const { doctorID, customerID, petID, serviceID, appointmentStart, appointmentEnd } = appointment;

    const sql = `UPDATE Schedules 
                 SET DoctorID = ?, CustomerID = ?, PetID = ?, ServiceID = ?, AppointmentStart = ?, AppointmentEnd = ?
                 WHERE ScheduleID = ?`;

    db.query(sql, [doctorID, customerID, petID, serviceID, appointmentStart, appointmentEnd, scheduleID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};


// Cancel an appointment (change status to 'Cancelled')
const cancelAppointment = (scheduleID, callback) => {
    const sql = `UPDATE Schedules 
                 SET Status = 'Cancelled' 
                 WHERE ScheduleID = ? AND Status = 'Scheduled'`;
    db.query(sql, [scheduleID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};

// Approve an appointment (Change status to 'Completed')
const approveAppointment = (scheduleID, callback) => {
    const sql = `UPDATE Schedules 
                 SET Status = 'Completed' 
                 WHERE ScheduleID = ? AND Status = 'Scheduled'`;
    db.query(sql, [scheduleID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};


// Delete an appointment by scheduleID
const deleteAppointment = (scheduleID, callback) => {
    const sql = `DELETE FROM Schedules WHERE ScheduleID = ?`;
    db.query(sql, [scheduleID], (err, results) => {
        if (err) {
            callback(err, null);
        } else {
            callback(null, results);
        }
    });
};


export { 
    getListScheduled, 
    getListCompleted, 
    getListCancelled, 
    addAppointment, 
    updateAppointment, 
    cancelAppointment, 
    approveAppointment,
    deleteAppointment,
    getListScheduledByUser,
    getListScheduledByDoctor,
    getListCancelledByUser,
    getListCompletedByDoctor,
    getListCompletedByUser
 };