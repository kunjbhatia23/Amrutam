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
// IMPORTANT: Replace <YOUR_MONGODB_CONNECTION_STRING> with your actual MongoDB connection string.
const CONNECTION_URL = process.env.MONGODB_URI || 'mongodb://localhost:27017/DocDash';

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));