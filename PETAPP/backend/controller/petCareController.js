// petCare.controller.js
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getAllCates, getAllServices, getServiceByCateID, getTopServices, getServiceByID } from '../models/petCareModel.js';

// Get All List Category 
export const getAllCategory = (req, res) => {
    getAllCates((err, category) => {
        if (err) {
            res.status(500).json({ error: "Failed to fetch data pet care services categories." });
        } else {
            res.json(category);
        }
    });
}

// GET ALL PET CARE SERVICES 

export const getServices = (req, res) => {
    getAllServices((err, services) => {
        if (err) {
            res.status(500).json({ error: "Failed to fetch data services." });
        } else {
            res.json(services);
        }
    });
}

// GET TOP SERVICES

export const getRecommendServices = (req, res) => {
    getTopServices((err, services) => {
        if (err) {
            res.status(500).json({ error: "Failed to fetch data top services." });
        } else {
            res.json(services);
        }
    });
}

// GET DATA SERVICES BY CATEGORY

export const getServicesByCID = (req, res) => {
    const {categoryID} = req.params;
    getServiceByCateID(categoryID, (err, services) => {
        if (err) {
            res.status(500).json({ error: "Failed to fetch service by category ID" });
        } else if (!services || services.length === 0) {
            res.status(404).json({ message: "Service not found" });
        } else {
            res.json(services);
        }
    });
}


// GET DATA SERVICE BY ID

export const getServicesByID = (req, res) => {
    const {serviceID} = req.params;
    getServiceByID(serviceID, (err, services) => {
        if (err) {
            res.status(500).json({ error: "Failed to fetch service by ID" });
        } else if (!services || services.length === 0) {
            res.status(404).json({ message: "Service not found" });
        } else {
            res.json(services);
        }
    });
}