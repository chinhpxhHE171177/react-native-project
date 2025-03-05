// scheduleController.js
import {
    getListScheduled,
    getListCompleted,
    getListCancelled,
    addAppointment,
    updateAppointment,
    cancelAppointment,
    approveAppointment,
    deleteAppointment,
    getListCompletedByDoctor,
    getListScheduledByDoctor,
    getListScheduledByUser,
    getListCompletedByUser,
    getListCancelledByUser
} from '../models/scheduleModel.js';

// Get list of scheduled appointments
export const getScheduledAppointments = (req, res) => {
    getListScheduled((err, appointments) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve scheduled appointments' });
        }
        res.status(200).json(appointments);
    });
};


// Get list of scheduled appointments for user 
export const getScheduledAppointmentsForUser = (req, res) => {
    const { userID } = req.params;
    getListScheduledByUser(userID, (err, appointments) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve scheduled appointments' });
        } else if (!appointments) {
            res.status(404).json({ message: "Appointment not found" });
        } else {
            res.status(200).json(appointments);
        }
    });
};


// Get list of scheduled appointments for doctor 
export const getScheduledAppointmentsForDoctor = (req, res) => {
    const { doctorID } = req.params;
    getListScheduledByDoctor(doctorID, (err, appointments) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve scheduled appointments' });
        } else if (!appointments) {
            res.status(404).json({ message: "Appointment not found" });
        } else {
            res.status(200).json(appointments);
        }
    });
};

// Get list of completed appointments
export const getCompletedAppointments = (req, res) => {
    getListCompleted((err, appointments) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve completed appointments' });
        }
        res.status(200).json(appointments);
    });
};


// Get list of completed appointments for user 
export const getCompletedAppointmentsForUser = (req, res) => {
    const { userID } = req.params;
    getListCompletedByUser(userID, (err, appointments) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve scheduled appointments' });
        } else if (!appointments) {
            res.status(404).json({ message: "Appointment not found" });
        } else {
            res.status(200).json(appointments);
        }
    });
};


// Get list of completed appointments for doctor 
export const getCompletedAppointmentsForDoctor = (req, res) => {
    const { doctorID } = req.params;
    getListCompletedByDoctor(doctorID, (err, appointments) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve scheduled appointments' });
        } else if (!appointments) {
            res.status(404).json({ message: "Appointment not found" });
        } else {
            res.status(200).json(appointments);
        }
    });
};


// Get list of canceled appointments
export const getCancelledAppointments = (req, res) => {
    getListCancelled((err, appointments) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve canceled appointments' });
        }
        res.status(200).json(appointments);
    });
};


// Get list of cancelled appointments for user 
export const getCancelledAppointmentsForUser = (req, res) => {
    const { userID } = req.params;
    getListCancelledByUser(userID, (err, appointments) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve scheduled appointments' });
        } else if (!appointments) {
            res.status(404).json({ message: "Appointment not found" });
        } else {
            res.status(200).json(appointments);
        }
    });
};

// Add a new appointment
export const createAppointment = (req, res) => {
    const { doctorID, customerID, petID, serviceID, appointmentStart, appointmentEnd } = req.body;
    addAppointment(doctorID, customerID, petID, serviceID, appointmentStart, appointmentEnd, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to add appointment' });
        }
        res.status(201).json({ message: 'Appointment scheduled successfully', appointmentID: results.insertId });
    });
};

// Controller function to handle update request
export const updateExistingAppointment = (req, res) => {
    const { scheduleID } = req.params; // Lấy ScheduleID từ params
    const { doctorID, customerID, petID, serviceID, appointmentStart, appointmentEnd } = req.body;

    if (!scheduleID || !doctorID || !customerID || !petID || !serviceID || !appointmentStart || !appointmentEnd) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const updatedAppointment = { doctorID, customerID, petID, serviceID, appointmentStart, appointmentEnd };

    updateAppointment(scheduleID, updatedAppointment, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update appointment', details: err.message });
        }
        res.status(200).json({ message: 'Appointment updated successfully' });
    });
};

// Cancel an appointment (mark as cancelled)
export const cancelExistingAppointment = (req, res) => {
    const { scheduleID } = req.params;
    cancelAppointment(scheduleID, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to cancel appointment' });
        }
        res.status(200).json({ message: 'Appointment cancelled successfully' });
    });
};

// Approve an appointment (mark as completed)
export const approveExistingAppointment = (req, res) => {
    const { scheduleID } = req.params;
    approveAppointment(scheduleID, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to approve appointment' });
        }
        res.status(200).json({ message: 'Appointment approved successfully' });
    });
};

// Delete an appointment (remove from database)
export const deleteAnAppointment = (req, res) => {
    const { scheduleID } = req.params;
    deleteAppointment(scheduleID, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to delete appointment' });
        }
        res.status(200).json({ message: 'Appointment deleted successfully' });
    });
};
