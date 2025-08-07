import Ingredient from '../models/ingredient.model.js';

export const createIngredient = async (req, res) => {
    // req.body contains the text fields from the form
    const ingredientData = req.body;

    // --- ADD THIS LOGIC ---
    // If a file was uploaded, req.file will be available
    if (req.file) {
        // Construct the URL to the uploaded file
        ingredientData.imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
    }

    const newIngredient = new Ingredient(ingredientData);

    try {
        await newIngredient.save();
        res.status(201).json(newIngredient);
    } catch (error) {
        res.status(409).json({ message: error.message });
    }
};

// ... (getIngredients and getIngredientById remain the same)
export const getIngredients = async (req, res) => {
    try {
        const ingredients = await Ingredient.find().sort({ createdAt: -1 });
        res.status(200).json(ingredients);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getIngredientById = async (req, res) => {
    const { id } = req.params;
    try {
        const ingredient = await Ingredient.findById(id);
        if (!ingredient) {
            return res.status(404).json({ message: "Ingredient not found" });
        }
        res.status(200).json(ingredient);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving ingredient", error: error.message });
    }
};