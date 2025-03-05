// scheduleRoutes.js 
import express from 'express';
import { 
    getScheduledAppointments, 
    getCompletedAppointments, 
    getCancelledAppointments, 
    createAppointment, 
    updateExistingAppointment, 
    cancelExistingAppointment, 
    deleteAnAppointment,
    getScheduledAppointmentsForUser,
    getScheduledAppointmentsForDoctor,
    getCompletedAppointmentsForUser,
    getCompletedAppointmentsForDoctor,
    getCancelledAppointmentsForUser,
    approveExistingAppointment
} from '../controllers/ScheduleController.js';

const router = express.Router();

// Get all scheduled appointments
router.get('/scheduled', getScheduledAppointments);

// Get all scheduled appointments for a user 
router.get('/scheduled/forUser/:userID', getScheduledAppointmentsForUser);

// Get all scheduled appointments for a doctor 
router.get('/scheduled/forDoctor/:doctorID', getScheduledAppointmentsForDoctor);

// Get all completed appointments
router.get('/completed', getCompletedAppointments);

// Get all completed appointments for a user 
router.get('/completed/forUser/:userID', getCompletedAppointmentsForUser);

// Get all completed appointments for a doctor 
router.get('/completed/forDoctor/:doctorID', getCompletedAppointmentsForDoctor);

// Get all cancelled appointments
router.get('/cancelled', getCancelledAppointments);

// Get all cancelled appointments for a user 
router.get('/cancelled/forUser/:userID', getCancelledAppointmentsForUser);

// Create a new appointment
router.post('/add', createAppointment);

// Update an existing appointment
router.put('/update/:scheduleID', updateExistingAppointment);

// Cancel an appointment
router.put('/cancelled/:scheduleID', cancelExistingAppointment);

// Approve an appointment 
router.put('/approve/:scheduleID', approveExistingAppointment);

// Delete an appointment 
router.delete('/delete/:scheduleID', deleteAnAppointment);

// 

export default router;
