import express from 'express';
import multer from 'multer';
import path from 'path';
import { createIngredient, getIngredients, getIngredientById } from '../controllers/ingredient.controller.js';

const router = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage: storage });

router.get('/', getIngredients);
// --- UPDATE THIS LINE ---
// The 'upload.single('image')' middleware will process the file upload
router.post('/', upload.single('image'), createIngredient);
router.get('/:id', getIngredientById);

export default router;