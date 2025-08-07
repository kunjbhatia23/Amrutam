import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import ingredientRoutes from './routes/ingredient.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '30mb', extended: true }));
app.use(express.urlencoded({ limit: '30mb', extended: true }));

// Routes
app.use('/api/ingredients', ingredientRoutes);

// MongoDB Connection
const CONNECTION_URL = process.env.MONGODB_URI;

if (!CONNECTION_URL) {
  console.error("Error: MONGODB_URI is not defined. Please check your .env file.");
  process.exit(1);
}

// The deprecated options have been removed from here
mongoose.connect(CONNECTION_URL)
  .then(() => app.listen(PORT, () => console.log(`✅ Server running on port: ${PORT}`)))
  .catch((error) => console.log(`❌ ${error} did not connect`));