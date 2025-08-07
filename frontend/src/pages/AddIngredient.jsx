import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Check, Upload, Plus, X, Smile, Image as ImageIcon } from 'lucide-react';

// Reusable component for the floating-label effect on inputs
const FloatingLabelInput = ({ name, value, onChange, placeholder, type = 'text' }) => (
  <div className="relative">
    <input
      type={type}
      id={name}
      name={name}
      value={value}
      onChange={onChange}
      className="block px-3.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
      placeholder=" " // This space is crucial for the floating label to work correctly
      required
    />
    <label
      htmlFor={name}
      className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
    >
      {placeholder}
    </label>
  </div>
);

// Reusable component for a list item that can be added or removed
const DynamicListItem = ({ item, index, section, onUpdate, onRemove, placeholder }) => (
  <div className="flex items-center space-x-2">
    <input
      value={item}
      onChange={(e) => onUpdate(index, e.target.value)}
      placeholder={placeholder}
      className="flex-grow p-3 border rounded-lg focus:ring-green-500 focus:border-green-500"
    />
    <button type="button" onClick={() => onRemove(index, section)} className="p-1 text-gray-500 hover:text-red-600">
      <X size={18} />
    </button>
  </div>
);

// Component for the final readable overview step
const ReviewDetail = ({ label, value, isImage = false }) => {
  // Don't render if the value is empty
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  
  return (
    <div className="py-3 sm:grid sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
        {isImage ? (
          <img src={value} alt="Preview" className="w-24 h-24 object-cover rounded-md shadow-sm" />
        ) : Array.isArray(value) ? (
          <ul className="list-disc pl-5 space-y-1">
            {value.map((item, index) => {
              if (typeof item === 'object') {
                const itemText = Object.values(item).filter(val => val && val !== 'Select').join(' - ');
                return itemText ? <li key={index}>{itemText}</li> : null;
              }
              return item ? <li key={index}>{item}</li> : null;
            })}
          </ul>
        ) : typeof value === 'object' ? (
           <ul className="list-disc pl-5 space-y-1">
            {Object.entries(value).map(([key, val]) => val && val !== 'Select' && !key.includes('Reason') && <li key={key}><span className="font-semibold capitalize">{key}:</span> {val} {value[`${key}Reason`] && `(${value[`${key}Reason`]})`}</li>)}
          </ul>
        ) : (
          value
        )}
      </dd>
    </div>
  );
};


const AddIngredient = ({ navigateTo }) => {
  const [step, setStep] = useState(1);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef(null);
  
  // Comprehensive state to hold all form data
  const [formData, setFormData] = useState({
    name: '',
    scientificName: '',
    sanskritName: '',
    description: '',
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };
  
  const handleInputChange = (e, section = null, field = null) => {
    const { name, value } = e.target;
    if (section && field) {
      setFormData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleDynamicListChange = (index, value, section) => {
    const list = [...formData[section]];
    list[index] = value;
    setFormData(prev => ({ ...prev, [section]: list }));
  };

  const addDynamicListItem = (section, newItem) => {
    setFormData(prev => ({ ...prev, [section]: [...prev[section], newItem] }));
  };

  const removeDynamicListItem = (index, section) => {
    const list = formData[section].filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, [section]: list }));
  };

  const handleComplexListChange = (index, field, value, section) => {
    const list = [...formData[section]];
    list[index] = { ...list[index], [field]: value };
    setFormData(prev => ({ ...prev, [section]: list }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const submissionData = new FormData();
    submissionData.append('image', imageFile);
    
    // Append all other form data, converting objects/arrays to JSON strings
    Object.keys(formData).forEach(key => {
        const value = formData[key];
        if (typeof value === 'object' && value !== null) {
            submissionData.append(key, JSON.stringify(value));
        } else {
            submissionData.append(key, value);
        }
    });

    try {
      const response = await axios.post('http://localhost:5001/api/ingredients', submissionData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Ingredient created successfully!');
      if (navigateTo) navigateTo('ingredients-list');
    } catch (error) {
      console.error('Failed to create ingredient', error);
      alert(`Error: ${error.response?.data?.message || 'Failed to create ingredient.'}`);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 5));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  // Renders the content for the current step
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-8">
            <h3 className="text-xl font-semibold text-gray-800">General Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FloatingLabelInput name="name" value={formData.name} onChange={handleInputChange} placeholder="Ingredient Name *" />
              <FloatingLabelInput name="scientificName" value={formData.scientificName} onChange={handleInputChange} placeholder="Scientific Name *" />
              <FloatingLabelInput name="sanskritName" value={formData.sanskritName} onChange={handleInputChange} placeholder="Sanskrit Name *" />
            </div>
            <div className="relative">
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="block px-3.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-green-600 peer"
                placeholder=" "
                rows="4"
                required
              ></textarea>
              <label htmlFor="description" className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-green-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-6 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1">
                Ingredient Description *
              </label>
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
            <div className="w-full h-48 border-2 border-dashed rounded-lg flex flex-col items-center justify-center bg-gray-50 text-gray-500 cursor-pointer hover:border-green-500 transition-colors" onClick={() => fileInputRef.current.click()}>
              {imagePreview ? (
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-md" />
              ) : (
                <>
                  <Upload size={40} />
                  <p className="mt-2 text-sm">Upload Image</p>
                  <p className="text-xs">PNG, JPG, SVG accepted</p>
                </>
              )}
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Why To Use?</h3>
              <div className="space-y-3">
                {formData.whyToUse.map((item, index) => (
                  <DynamicListItem key={index} item={item} index={index} section="whyToUse" onUpdate={(i, val) => handleDynamicListChange(i, val, 'whyToUse')} onRemove={removeDynamicListItem} placeholder="Enter reason" />
                ))}
              </div>
              <button type="button" onClick={() => addDynamicListItem('whyToUse', '')} className="mt-3 text-sm text-green-600 font-semibold hover:text-green-700 flex items-center"><Plus size={16} className="mr-1"/>Add Another Item</button>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Prakriti Impact</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {['vata', 'pitta', 'kapha'].map(type => (
                  <div key={type}>
                    <label className="block text-sm font-medium text-gray-600 capitalize mb-1">{type} *</label>
                    <select value={formData.prakritiImpact[type]} onChange={(e) => handleInputChange(e, 'prakritiImpact', type)} className="w-full p-3 border rounded-lg bg-white focus:ring-green-500 focus:border-green-500">
                      <option>Select</option><option>Balanced</option><option>Unbalanced</option>
                    </select>
                    <input value={formData.prakritiImpact[`${type}Reason`]} onChange={(e) => handleInputChange(e, 'prakritiImpact', `${type}Reason`)} placeholder={`${type} Reason`} className="mt-2 w-full p-3 border rounded-lg focus:ring-green-500 focus:border-green-500" />
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Benefits</h3>
              <div className="space-y-3">
                {formData.benefits.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <button type="button" className="p-3 border rounded-lg hover:bg-gray-100"><Smile size={18} /></button>
                    <input value={item.text} onChange={(e) => handleComplexListChange(index, 'text', e.target.value, 'benefits')} placeholder="Benefit description" className="flex-grow p-3 border rounded-lg focus:ring-green-500 focus:border-green-500" />
                    <button type="button" onClick={() => removeDynamicListItem(index, 'benefits')} className="p-1 text-gray-500 hover:text-red-600"><X size={18} /></button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => addDynamicListItem('benefits', { emoji: '', text: '' })} className="mt-3 text-sm text-green-600 font-semibold hover:text-green-700 flex items-center"><Plus size={16} className="mr-1"/>Add Another Item</button>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Ayurvedic Properties</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input value={formData.ayurvedicProperties.rasa} onChange={e => handleInputChange(e, 'ayurvedicProperties', 'rasa')} placeholder="Rasa *" className="p-3 border rounded-lg focus:ring-green-500 focus:border-green-500" />
                <input value={formData.ayurvedicProperties.veerya} onChange={e => handleInputChange(e, 'ayurvedicProperties', 'veerya')} placeholder="Veerya *" className="p-3 border rounded-lg focus:ring-green-500 focus:border-green-500" />
                <input value={formData.ayurvedicProperties.guna} onChange={e => handleInputChange(e, 'ayurvedicProperties', 'guna')} placeholder="Guna *" className="p-3 border rounded-lg focus:ring-green-500 focus:border-green-500" />
                <input value={formData.ayurvedicProperties.vipaka} onChange={e => handleInputChange(e, 'ayurvedicProperties', 'vipaka')} placeholder="Vipaka *" className="p-3 border rounded-lg focus:ring-green-500 focus:border-green-500" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Important Formulations</h3>
              <div className="space-y-3">
                {formData.importantFormulations.map((item, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="p-3 border rounded-lg bg-gray-100"><ImageIcon size={18} className="text-gray-500" /></div>
                    <input value={item.name} onChange={e => handleComplexListChange(index, 'name', e.target.value, 'importantFormulations')} placeholder="Formulation name" className="flex-grow p-3 border rounded-lg focus:ring-green-500 focus:border-green-500" />
                    <button type="button" onClick={() => removeDynamicListItem(index, 'importantFormulations')} className="p-1 text-gray-500 hover:text-red-600"><X size={18} /></button>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => addDynamicListItem('importantFormulations', { name: '' })} className="mt-3 text-sm text-green-600 font-semibold hover:text-green-700 flex items-center"><Plus size={16} className="mr-1"/>Add Another Item</button>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Therapeutic Uses</h3>
              <div className="space-y-3">
                {formData.therapeuticUses.map((item, index) => (
                  <DynamicListItem key={index} item={item} index={index} section="therapeuticUses" onUpdate={(i, val) => handleDynamicListChange(i, val, 'therapeuticUses')} onRemove={removeDynamicListItem} placeholder="Therapeutic use" />
                ))}
              </div>
              <button type="button" onClick={() => addDynamicListItem('therapeuticUses', '')} className="mt-3 text-sm text-green-600 font-semibold hover:text-green-700 flex items-center"><Plus size={16} className="mr-1"/>Add Another Item</button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Plant Parts And Its Purpose</h3>
              <div className="space-y-4">
                {formData.plantParts.map((item, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50/50 space-y-3 relative">
                    <button type="button" onClick={() => removeDynamicListItem(index, 'plantParts')} className="absolute top-2 right-2 p-1 text-gray-500 hover:text-red-600"><X size={18} /></button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                      <select value={item.part} onChange={e => handleComplexListChange(index, 'part', e.target.value, 'plantParts')} className="p-3 border rounded-lg bg-white focus:ring-green-500 focus:border-green-500">
                        <option>Select Plant Part *</option><option>Root</option><option>Stem</option><option>Leaf</option><option>Flower</option><option>Fruit</option><option>Seed</option>
                      </select>
                      <input value={item.description} onChange={e => handleComplexListChange(index, 'description', e.target.value, 'plantParts')} placeholder="Description *" className="p-3 border rounded-lg focus:ring-green-500 focus:border-green-500" />
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => addDynamicListItem('plantParts', { part: 'Select', description: '' })} className="mt-3 text-sm text-green-600 font-semibold hover:text-green-700 flex items-center"><Plus size={16} className="mr-1"/>Add Another Item</button>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Best Combined With *</h3>
              <input name="bestCombinedWith" value={formData.bestCombinedWith} onChange={handleInputChange} placeholder="Type here..." className="w-full p-3 border rounded-lg focus:ring-green-500 focus:border-green-500" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-3">Geographical Locations *</h3>
              <input name="geographicalLocations" value={formData.geographicalLocations} onChange={handleInputChange} placeholder="Type here..." className="w-full p-3 border rounded-lg focus:ring-green-500 focus:border-green-500" />
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-gray-800">Overview</h3>
            <p className="text-sm text-gray-600">Review all the information below before submitting.</p>
            <div className="border-t border-gray-200 divide-y divide-gray-200">
              <ReviewDetail label="Image" value={imagePreview} isImage={true} />
              <ReviewDetail label="Ingredient Name" value={formData.name} />
              <ReviewDetail label="Scientific Name" value={formData.scientificName} />
              <ReviewDetail label="Sanskrit Name" value={formData.sanskritName} />
              <ReviewDetail label="Description" value={formData.description} />
              <ReviewDetail label="Reasons to Use" value={formData.whyToUse.filter(item => item)} />
              <ReviewDetail label="Benefits" value={formData.benefits.filter(item => item.text)} />
              <ReviewDetail label="Prakriti Impact" value={formData.prakritiImpact} />
              <ReviewDetail label="Ayurvedic Properties" value={formData.ayurvedicProperties} />
              <ReviewDetail label="Important Formulations" value={formData.importantFormulations.filter(item => item.name)} />
              <ReviewDetail label="Therapeutic Uses" value={formData.therapeuticUses.filter(item => item)} />
              <ReviewDetail label="Plant Parts" value={formData.plantParts.filter(item => item.part !== 'Select')} />
              <ReviewDetail label="Best Combined With" value={formData.bestCombinedWith} />
              <ReviewDetail label="Geographical Locations" value={formData.geographicalLocations} />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add Ingredient</h2>
          <button type="button" onClick={() => navigateTo ? navigateTo('ingredients-list') : window.history.back()} className="p-2 text-gray-500 rounded-full hover:bg-gray-100">
            <X size={24} />
          </button>
        </div>
        <div className="flex items-center mb-10">
          {['General', 'Benefits', 'Properties', 'Other', 'Overview'].map((name, index) => (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${step >= index + 1 ? 'bg-green-600 border-green-600 text-white' : 'border-gray-300 bg-white text-gray-500'}`}>
                  {step > index + 1 ? <Check size={20} /> : index + 1}
                </div>
                <p className={`mt-2 text-xs sm:text-sm text-center font-medium ${step >= index + 1 ? 'text-green-600' : 'text-gray-500'}`}>{name}</p>
              </div>
              {index < 4 && <div className={`flex-1 mx-2 sm:mx-4 h-0.5 transition-all duration-300 ${step > index + 1 ? 'bg-green-600' : 'bg-gray-300'}`}></div>}
            </React.Fragment>
          ))}
        </div>
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-md">
          {renderStepContent()}
        </div>
        <div className="flex justify-end space-x-4 mt-8">
          {step > 1 && <button type="button" onClick={prevStep} className="px-6 py-2.5 font-semibold border rounded-lg hover:bg-gray-100 transition-colors">Back</button>}
          {step < 5 && <button type="button" onClick={nextStep} className="px-6 py-2.5 font-semibold bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">Next</button>}
          {step === 5 && <button type="button" onClick={handleSubmit} className="px-6 py-2.5 font-semibold bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">Save</button>}
        </div>
      </div>
    </div>
  );
};

export default AddIngredient;