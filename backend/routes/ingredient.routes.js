import express from 'express';
import { createIngredient, getIngredients, getIngredientById } from '../controllers/ingredient.controller.js';

const router = express.Router();

router.get('/', getIngredients);
router.post('/', createIngredient);
router.get('/:id', getIngredientById);

export default router;