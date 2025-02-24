// server.js
import './config/dotenv.js';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import db from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import doctorsRoutes from './routes/doctorRoutes.js';
import reviewsRoutes from './routes/reviewsRoutes.js';
import serviceReviewRoutes from './routes/serviceReviewsRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import petCareRoutes from './routes/petCareRoutes.js';
import petRoutes from './routes/petRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import slotRoutes from './routes/slotRoutes.js';
import favouriteRoutes from './routes/favouriteRoutes.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Use routes
app.use('/auth', authRoutes);
app.use('/api', doctorsRoutes);  // Handles all doctor-related routes
app.use('/api', reviewsRoutes);  
app.use('/api', petRoutes);  
app.use('/api', favouriteRoutes);  
app.use('/api/appointments', scheduleRoutes);  
app.use('/api/slots', slotRoutes);  
app.use('/api/service', serviceReviewRoutes);  
app.use('/api', petCareRoutes);  
app.use('/doctors', doctorsRoutes);  // Handles all review-related routes
app.use('/api/chat', chatRoutes);

// Root route
app.get('/', (req, res) => {
    res.send("✅ Server is running...");
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
