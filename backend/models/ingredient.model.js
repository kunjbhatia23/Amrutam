import mongoose from 'mongoose';

const ingredientSchema = mongoose.Schema({
    name: { type: String, required: true },
    scientificName: String,
    sanskritName: String,
    description: String,
    imageUrl: String,
    status: { type: String, default: 'Active' },

    // From Step 2
    whyToUse: [String],
    prakritiImpact: {
        vata: String,
        pitta: String,
        kapha: String,
        vataReason: String,
        pittaReason: String,
        kaphaReason: String,
    },
    benefits: [{
        emoji: String,
        text: String,
    }],

    // From Step 3
    ayurvedicProperties: {
        rasa: String,
        veerya: String,
        guna: String,
        vipaka: String,
    },
    importantFormulations: [{
        name: String,
        imageUrl: String, // Placeholder for icon upload
    }],
    therapeuticUses: [String],

    // From Step 4
    plantParts: [{
        part: String,
        description: String,
    }],
    bestCombinedWith: String,
    geographicalLocations: String,

}, { timestamps: true });

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

export default Ingredient;
