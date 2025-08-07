import React, { useState } from 'react';
import axios from 'axios';
import { Check, Upload, Plus, X, Smile } from 'lucide-react';

// This is a simplified version of the multi-step form.
// In a real app, each step would be its own component.

const AddIngredient = ({ navigateTo }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    sanskritName: '',
    description: '',
    imageUrl: '',
    // Step 2
    whyToUse: [''],
    prakritiImpact: { vata: 'Select', pitta: 'Select', kapha: 'Select', vataReason: '', pittaReason: '', kaphaReason: '' },
    benefits: [{ emoji: '', text: '' }],
    // Step 3
    ayurvedicProperties: { rasa: '', veerya: '', guna: '', vipaka: '' },
    importantFormulations: [{ name: '' }],
    therapeuticUses: [''],
    // Step 4
    plantParts: [{ part: 'Select', description: '' }],
    bestCombinedWith: '',
    geographicalLocations: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  const handleNestedChange = (e, section, field) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleDynamicListChange = (e, index, section, field) => {
     const { value } = e.target;
     const list = [...formData[section]];
     list[index][field] = value;
     setFormData({ ...formData, [section]: list });
  };
  
  const addDynamicListItem = (section, item) => {
    setFormData({ ...formData, [section]: [...formData[section], item] });
  };

  const removeDynamicListItem = (index, section) => {
    const list = formData[section].filter((_, i) => i !== index);
    setFormData({ ...formData, [section]: list });
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // In a real app, you would handle file uploads to a service like Cloudinary
      // and get back a URL to save in formData.imageUrl
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

  const renderStep = () => {
    switch (step) {
      case 1: // General Information
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">General Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input name="name" value={formData.name} onChange={handleInputChange} placeholder="Ingredient Name *" className="p-2 border rounded-md" />
              <input name="scientificName" value={formData.scientificName} onChange={handleInputChange} placeholder="Scientific Name *" className="p-2 border rounded-md" />
              <input name="sanskritName" value={formData.sanskritName} onChange={handleInputChange} placeholder="Sanskrit Name *" className="p-2 border rounded-md" />
            </div>
            <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Ingredient Name description *" className="w-full p-2 border rounded-md" rows="3"></textarea>
            <div className="w-full h-40 border-2 border-dashed rounded-lg flex flex-col items-center justify-center bg-gray-50">
              <Upload size={40} className="text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">Upload Image</p>
              {/* Actual file input would be hidden and triggered by this div */}
            </div>
          </div>
        );
      case 2: // Benefits
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Why To Use?</h3>
            {formData.whyToUse.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <input value={item} onChange={(e) => {
                        const list = [...formData.whyToUse];
                        list[index] = e.target.value;
                        setFormData({...formData, whyToUse: list});
                    }} placeholder="Enter reason" className="flex-grow p-2 border rounded-md" />
                    <button type="button" onClick={() => removeDynamicListItem(index, 'whyToUse')}><X size={16}/></button>
                </div>
            ))}
            <button type="button" onClick={() => addDynamicListItem('whyToUse', '')} className="text-sm text-green-600">Add Another Item</button>

            <h3 className="text-lg font-medium">Prakriti Impact</h3>
            {/* Prakriti form fields */}
            
            <h3 className="text-lg font-medium">Benefits</h3>
            {formData.benefits.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                    <button type="button" className="p-2 border rounded-md"><Smile size={16}/></button>
                    <input value={item.text} onChange={(e) => handleDynamicListChange(e, index, 'benefits', 'text')} placeholder="Lorem ipsum..." className="flex-grow p-2 border rounded-md" />
                    <button type="button" onClick={() => removeDynamicListItem(index, 'benefits')}><X size={16}/></button>
                </div>
            ))}
            <button type="button" onClick={() => addDynamicListItem('benefits', {emoji: '', text: ''})} className="text-sm text-green-600">Add Another Item</button>
          </div>
        );
      // Cases 3, 4, and 5 would be similarly structured
      default:
        return <div>Step {step} content goes here.</div>;
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

      {/* Stepper */}
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