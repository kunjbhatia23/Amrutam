import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Edit, Leaf, FlaskConical, MapPin, Package, Stethoscope, Heart, Sun } from 'lucide-react';

// A reusable component for sections in the detail view
const DetailSection = ({ title, icon: Icon, children }) => (
  <div className="mb-6 bg-white p-6 rounded-lg shadow-sm">
    <div className="flex justify-between items-center mb-4 pb-3 border-b">
      <div className="flex items-center">
        {Icon && <Icon className="mr-3 text-green-600" size={20} />}
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <button className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100">
        <Edit size={16} />
      </button>
    </div>
    <div className="text-gray-600 leading-relaxed">
        {children}
    </div>
  </div>
);

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

    if (loading) return <div className="text-center p-10">Loading details...</div>;
    if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
    if (!ingredient) return <div className="text-center p-10">No ingredient data found.</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={() => navigateTo('ingredients-list')} className="mb-4 text-sm font-semibold text-green-600 hover:underline">
                &larr; Back to list
            </button>
            
            <DetailSection title="General Information">
                <div className="flex flex-col items-center text-center">
                    <img src={ingredient.imageUrl || 'https://placehold.co/150x150/A7F3D0/14532D?text=Image'} alt={ingredient.name} className="w-40 h-40 rounded-lg object-cover mb-4 shadow-md" />
                    <h2 className="text-2xl font-bold text-gray-900">{ingredient.name}</h2>
                    <p className="text-gray-500 italic mt-1">{ingredient.sanskritName} ({ingredient.scientificName})</p>
                </div>
            </DetailSection>

            <DetailSection title="Description">
                <p>{ingredient.description}</p>
            </DetailSection>

            <DetailSection title="Why To Use?" icon={Heart}>
                 <ul className="list-disc list-inside space-y-2">
                    {ingredient.whyToUse?.map((item, i) => <li key={i}>{item}</li>)}
                 </ul>
            </DetailSection>
            
            <DetailSection title="Prakriti Impact" icon={Sun}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><strong>Vata:</strong> {ingredient.prakritiImpact?.vata}</div>
                    <div><strong>Pitta:</strong> {ingredient.prakritiImpact?.pitta}</div>
                    <div><strong>Kapha:</strong> {ingredient.prakritiImpact?.kapha}</div>
                </div>
            </DetailSection>

            <DetailSection title="Benefits" icon={Heart}>
                 <ul className="list-disc list-inside space-y-2">
                    {ingredient.benefits?.map((item, i) => <li key={i}>{item.text}</li>)}
                 </ul>
            </DetailSection>

            <DetailSection title="Ayurvedic Properties" icon={FlaskConical}>
                <div className="grid grid-cols-2 gap-4">
                    <div><strong>Rasa:</strong> {ingredient.ayurvedicProperties?.rasa}</div>
                    <div><strong>Veerya:</strong> {ingredient.ayurvedicProperties?.veerya}</div>
                    <div><strong>Guna:</strong> {ingredient.ayurvedicProperties?.guna}</div>
                    <div><strong>Vipaka:</strong> {ingredient.ayurvedicProperties?.vipaka}</div>
                </div>
            </DetailSection>

            <DetailSection title="Important Formulations" icon={Package}>
                <ul className="list-disc list-inside space-y-2">
                    {ingredient.importantFormulations?.map((item, i) => <li key={i}>{item.name}</li>)}
                 </ul>
            </DetailSection>

            <DetailSection title="Therapeutic Uses" icon={Stethoscope}>
                <ul className="list-disc list-inside space-y-2">
                    {ingredient.therapeuticUses?.map((item, i) => <li key={i}>{item}</li>)}
                 </ul>
            </DetailSection>

            <DetailSection title="Plant Parts & Purpose" icon={Leaf}>
                <ul className="space-y-3">
                    {ingredient.plantParts?.map((item, i) => (
                        <li key={i}><strong>{item.part}:</strong> {item.description}</li>
                    ))}
                 </ul>
            </DetailSection>

            <DetailSection title="Best Combined With">
                <p>{ingredient.bestCombinedWith}</p>
            </DetailSection>

            <DetailSection title="Geographical Locations" icon={MapPin}>
                <p>{ingredient.geographicalLocations}</p>
            </DetailSection>
        </div>
    );
};

export default IngredientDetail;