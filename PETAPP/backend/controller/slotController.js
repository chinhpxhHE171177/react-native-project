// slotController.js

import { getSlotByID, addSlot, updateSlot, deleteSlot, deleteSlotCompletely, getAllSlotByID, activeSlot } from '../models/slotsModel.js';

// Get available slots for a specific doctor
export const getAvailableSlots = (req, res) => {
    const { doctorID } = req.params;
    getSlotByID(doctorID, (err, slots) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve available slots' });
        }
        res.status(200).json(slots);
    });
};


// Get available slots for a specific doctor
export const getAllSlots = (req, res) => {
    const { doctorID } = req.params;
    getAllSlotByID(doctorID, (err, slots) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to retrieve all slots' });
        }
        res.status(200).json(slots);
    });
};

// Add a new available slot for a doctor
export const createSlot = (req, res) => {
    const { doctorID, slotStart, slotEnd } = req.body;
    addSlot(doctorID, slotStart, slotEnd, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to add slot' });
        }
        res.status(201).json({ message: 'Slot added successfully', slotID: results.insertId });
    });
};

// Update an existing slot for a doctor
export const updateExistingSlot = (req, res) => {
    const { slotID, doctorID, slotStart, slotEnd } = req.body;
    updateSlot(slotID, doctorID, slotStart, slotEnd, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to update slot' });
        }
        res.status(200).json({ message: 'Slot updated successfully' });
    });
};

// Delete a slot (mark as unavailable) for a doctor
export const cancelSlot = (req, res) => {
    const { slotID, doctorID } = req.params;
    deleteSlot(slotID, doctorID, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to cancel slot' });
        }
        res.status(200).json({ message: 'Slot cancelled successfully' });
    });
};

// Active a slot (mark as available) for a doctor
export const availableSlot = (req, res) => {
    const { slotID, doctorID } = req.params;
    activeSlot(slotID, doctorID, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to make a available slot' });
        }
        res.status(200).json({ message: 'Slot available successfully' });
    });
};

// Delete a slot completely from the database
export const removeSlotCompletely = (req, res) => {
    const { slotID, doctorID } = req.params;
    deleteSlotCompletely(slotID, doctorID, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to remove slot completely' });
        }
        res.status(200).json({ message: 'Slot removed successfully' });
    });
};
