// slotRoutes.js
import express from 'express';
import { 
    getAvailableSlots, 
    createSlot, 
    updateExistingSlot, 
    cancelSlot, 
    removeSlotCompletely, 
    getAllSlots,
    availableSlot
} from '../controllers/SlotController.js';

const router = express.Router();

// Get available slots for a doctor
router.get('/doctor/:doctorID', getAvailableSlots);

// Get available slots for a doctor
router.get('/allForDoctor/:doctorID', getAllSlots);

// Add a new available slot for a doctor
router.post('/create', createSlot);

// Update an existing slot for a doctor
router.put('/update', updateExistingSlot);

// Cancel a slot (mark as unavailable)
router.put('/cancel/:slotID/:doctorID', cancelSlot);

// Active a slot (mark as available)
router.put('/active/:slotID/:doctorID', availableSlot);

// Remove a slot completely from the database
router.delete('/remove/:slotID/:doctorID', removeSlotCompletely);

export default router;
