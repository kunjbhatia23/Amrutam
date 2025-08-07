import React, { useState } from 'react';
import axios from 'axios';
import { Check, Upload, Plus, X, Smile } from 'lucide-react';

const AddIngredient = ({ navigateTo }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    sanskritName: '',
    description: '',
    imageUrl: '',
    whyToUse: [''],
    prakritiImpact: { vata: 'Select', pitta: 'Select', kapha: 'Select', vataReason: '', pittaReason: '', kaphaReason: '' },
    benefits: [{ emoji: '', text: '' }],
    ayurvedicProperties: { rasa: '', veerya: '', guna: '', vipaka: '' },
    importantFormulations: [{ name: '' }],
    therapeuticUses: [''],
    plantParts: [{ part: 'Select', description: '' }],
    bestCombinedWith: '',
    geographicalLocations: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting:', formData);
      const response = await axios.post('http://localhost:5001/api/ingredients', formData);
      console.log('Ingredient created:', response.data);
      alert('Ingredient created successfully!');
      navigateTo('ingredients-list');
    } catch (error) {
      console.error('Failed to create ingredient', error);
      alert('Error: Failed to create ingredient.');
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  // Simplified renderStep for brevity. You can expand this with the full form.
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">General Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Ingredient Name *" className="p-2 border rounded-md" />
              <input name="scientificName" value={formData.scientificName} onChange={handleInputChange} placeholder="Scientific Name *" className="p-2 border rounded-md" />
              <input name="sanskritName" value={formData.sanskritName} onChange={handleInputChange} placeholder="Sanskrit Name *" className="p-2 border rounded-md" />
            </div>
            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Ingredient Description *" className="w-full p-2 border rounded-md" rows="3"></textarea>
            <div className="w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center bg-gray-50">
              <Upload size={40} className="text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Upload Image</p>
            </div>
          </div>
        );
      default:
        return <div>Step {step} content goes here. You can build out the forms for steps 2-5 based on the screenshots and the `formData` state.</div>;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Add Ingredient</h2>
        <button type="button" onClick={() => navigateTo('ingredients-list')} className="text-gray-500 hover:text-gray-800">
          <X size={24} />
        </button>
      </div>

      <div className="flex items-center justify-center">
        {[1, 2, 3, 4, 5].map((s) => (
          <React.Fragment key={s}>
            <div className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${step >= s ? 'bg-green-600 border-green-600 text-white' : 'border-gray-300 bg-white'}`}>
                {step > s ? <Check size={20} /> : s}
              </div>
              <p className={`mt-2 text-sm ${step >= s ? 'text-green-600' : 'text-gray-500'}`}>
                {['General', 'Benefits', 'Properties', 'Other', 'Overview'][s-1]}
              </p>
            </div>
            {s < 5 && <div className={`flex-1 h-0.5 ${step > s ? 'bg-green-600' : 'bg-gray-300'}`}></div>}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-white p-8 rounded-lg shadow-sm">
        {renderStep()}
      </div>

      <div className="flex justify-end space-x-4">
        {step > 1 && <button type="button" onClick={prevStep} className="px-6 py-2 border rounded-lg hover:bg-gray-100">Back</button>}
        {step < 5 && <button type="button" onClick={nextStep} className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800">Next</button>}
        {step === 5 && <button type="submit" className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800">Submit</button>}
      </div>
    </form>
  );
};

export default AddIngredient;