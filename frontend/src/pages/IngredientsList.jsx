import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Plus, Upload, Download, ArrowUpDown } from 'lucide-react';

const API_URL = 'http://localhost:5001/api/ingredients';

const IngredientsList = ({ navigateTo }) => {
  const [ingredients, setIngredients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        setLoading(true);
        const response = await axios.get(API_URL);
        setIngredients(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch ingredients. Is the backend server running?');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchIngredients();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Ingredients List</h2>
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input type="text" placeholder="Search here..." className="pl-10 pr-4 py-2 w-64 border rounded-lg focus:ring-green-500 focus:border-green-500" />
          </div>
          <button onClick={() => navigateTo('add-ingredient')} className="bg-green-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-green-800">
            <Plus size={20} />
            <span>Add</span>
          </button>
          <button className="p-2 border rounded-lg hover:bg-gray-100"><Download size={20} /></button>
          <button className="p-2 border rounded-lg hover:bg-gray-100"><Upload size={20} /></button>
        </div>
      </div>

      {loading && <p>Loading ingredients...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="p-4"><input type="checkbox" /></th>
                <th scope="col" className="px-6 py-3">Ingredients</th>
                <th scope="col" className="px-6 py-3">Description</th>
                <th scope="col" className="px-6 py-3 flex items-center">Status <ArrowUpDown size={14} className="ml-1" /></th>
              </tr>
            </thead>
            <tbody>
              {ingredients.map((item) => (
                <tr key={item._id} className="bg-white border-b hover:bg-gray-50 cursor-pointer" onClick={() => navigateTo('ingredient-detail', item._id)}>
                  <td className="w-4 p-4"><input type="checkbox" /></td>
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap flex items-center">
                    <img src={item.imageUrl || 'https://placehold.co/40x40/A7F3D0/14532D?text=I'} alt={item.name} className="w-10 h-10 rounded-full mr-3 object-cover" />
                    {item.name}
                  </th>
                  <td className="px-6 py-4">{item.description?.substring(0, 100) || 'No description available.'}...</td>
                  <td className="px-6 py-4">
                    <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded-full">{item.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination would go here */}
        </div>
      )}
    </div>
  );
};

export default IngredientsList;