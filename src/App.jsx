import React, { useState } from 'react';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import IngredientsList from './pages/IngredientsList.jsx';
import AddIngredient from './pages/AddIngredient.jsx';
import IngredientDetail from './pages/IngredientDetail.jsx';

function App() {
  const [currentPage, setCurrentPage] = useState('ingredients-list');
  const [selectedIngredientId, setSelectedIngredientId] = useState(null);

  const navigateTo = (page, id = null) => {
    setCurrentPage(page);
    setSelectedIngredientId(id);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'add-ingredient':
        return <AddIngredient navigateTo={navigateTo} />;
      case 'ingredient-detail':
        return <IngredientDetail ingredientId={selectedIngredientId} navigateTo={navigateTo} />;
      case 'ingredients-list':
      default:
        return <IngredientsList navigateTo={navigateTo} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <Sidebar navigateTo={navigateTo} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;