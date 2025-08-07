import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit } from 'lucide-react';

const IngredientDetail = ({ ingredientId, navigateTo }) => {
    const [ingredient, setIngredient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!ingredientId) {
            setError("No ingredient ID provided.");
            setLoading(false);
            return;
        }

        const fetchIngredient = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`http://localhost:5001/api/ingredients/${ingredientId}`);
                setIngredient(response.data);
                setError(null);
            } catch (err) {
                setError("Failed to fetch ingredient details.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchIngredient();
    }, [ingredientId]);

    if (loading) return <p>Loading details...</p>;
    if (error) return <p className="text-red-500">{error}</p>;
    if (!ingredient) return <p>No ingredient data found.</p>;

    const DetailSection = ({ title, children }) => (
        <div className="mb-6 bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                <button className="text-gray-400 hover:text-gray-600"><Edit size={16} /></button>
            </div>
            {children}
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={() => navigateTo('ingredients-list')} className="mb-4 text-sm text-green-600">&larr; Back to list</button>
            
            <DetailSection title="General Information">
                <div className="flex flex-col items-center">
                    <img src={ingredient.imageUrl || 'https://placehold.co/150x150/A7F3D0/14532D?text=Image'} alt={ingredient.name} className="w-40 h-40 rounded-lg object-cover mb-4" />
                    <h2 className="text-2xl font-bold">{ingredient.name} - {ingredient.sanskritName}</h2>
                    <p className="text-gray-500 italic">{ingredient.scientificName}</p>
                </div>
            </DetailSection>

            <DetailSection title="Description">
                <p className="text-gray-600 leading-relaxed">{ingredient.description}</p>
            </DetailSection>

            <DetailSection title="Why Chitrak?">
                 <ul className="list-disc list-inside text-gray-600 space-y-2">
                    {ingredient.whyToUse?.map((item, i) => <li key={i}>{item}</li>)}
                 </ul>
            </DetailSection>

            {/* Add more detail sections for all other properties... */}

        </div>
    );
};

export default IngredientDetail;