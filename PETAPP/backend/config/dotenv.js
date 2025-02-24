// dotenv.js
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve('./.env') });

console.log("🔹 ENV Loaded:", process.env.PORT);

