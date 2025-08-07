import Ingredient from '../models/ingredient.model.js';

// @desc    Create a new ingredient
// @route   POST /api/ingredients
// @access  Public
export const createIngredient = async (req, res) => {
    const ingredientData = req.body;
    const newIngredient = new Ingredient(ingredientData);

    try {
        await newIngredient.save();
        res.status(201).json(newIngredient);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// @desc    Get all ingredients
// @route   GET /api/ingredients
// @access  Public
export const getIngredients = async (req, res) => {
    try {
        const ingredients = await Ingredient.find();
        res.status(200).json(ingredients);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

// @desc    Get a single ingredient by ID
// @route   GET /api/ingredients/:id
// @access  Public
export const getIngredientById = async (req, res) => {
    const { id } = req.params;
    try {
        const ingredient = await Ingredient.findById(id);
        if (!ingredient) {
            return res.status(404).json({ message: "Ingredient not found" });
        }
        res.status(200).json(ingredient);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
