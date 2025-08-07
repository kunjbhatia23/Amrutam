import React from 'react';
import { Bell, ChevronDown } from 'lucide-react';

const Header = () => {
  return (
    <header className="flex items-center justify-between p-4 bg-white border-b">
      <div>
        {/* Breadcrumbs can be dynamic later */}
      </div>
      <div className="flex items-center space-x-4">
        <button className="p-2 rounded-full hover:bg-gray-100">
          <Bell size={20} />
        </button>
        <div className="flex items-center space-x-2">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src="https://placehold.co/40x40/E2E8F0/4A5568?text=LM"
            alt="User"
          />
          <div>
            <p className="font-semibold text-sm">Liam Michael</p>
            <p className="text-xs text-gray-500">Admin</p>
          </div>
          <ChevronDown size={16} className="text-gray-500" />
        </div>
      </div>
    </header>
  );
};

export default Header;