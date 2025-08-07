import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import ingredientRoutes from './routes/ingredient.routes.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));

// --- ADD THIS LINE ---
// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/ingredients', ingredientRoutes);

// MongoDB Connection
const CONNECTION_URL = process.env.MONGODB_URI;

if (!CONNECTION_URL) {
  console.error("Error: MONGODB_URI is not defined. Please check your .env file.");
  process.exit(1);
}

mongoose.connect(CONNECTION_URL)
  .then(() => app.listen(PORT, () => console.log(`✅ Server running on port: ${PORT}`)))
  .catch((error) => console.log(`❌ ${error} did not connect`));