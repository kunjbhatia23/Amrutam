import React from 'react';
import {
  LayoutDashboard,
  UserRound, // Changed from UserMd
  User,
  Calendar,
  Stethoscope,
  Beaker,
  Tag,
  MessageSquare,
  RefreshCw,
  Cog,
  Wallet,
  Undo
} from 'lucide-react';

const Sidebar = ({ navigateTo }) => {
  const menuItems = [
    { icon: LayoutDashboard, name: 'Dashboard' },
    { icon: UserRound, name: 'Doctors' }, // Changed from UserMd
    { icon: User, name: 'Patients' },
    { icon: Calendar, name: 'Appointments' },
    { icon: Stethoscope, name: 'Specialties' },
    { icon: Beaker, name: 'Ingredients', active: true, subItems: ['Ingredients List', 'Add Ingredients'] },
    { icon: Tag, name: 'Coupons' },
    { icon: MessageSquare, name: 'Concerns' },
    { icon: RefreshCw, name: 'Referral' },
    { icon: Cog, name: 'Customization' },
    { icon: Wallet, name: 'Wallet' },
    { icon: Undo, name: 'Refund' },
  ];

  // This function handles clicks on the main menu items
  const handleNavigation = (page) => {
    // A simple mapping from name to page route
    const pageMap = {
      'Ingredients': 'ingredients-list',
      'Add Ingredients': 'add-ingredient'
    };
    const targetPage = pageMap[page] || 'ingredients-list'; // Default to list
    navigateTo(targetPage);
  };

  return (
    <aside className="w-64 bg-white border-r flex flex-col">
      <div className="h-16 flex items-center justify-center border-b">
        <h1 className="text-xl font-bold text-gray-800 cursor-pointer" onClick={() => navigateTo('ingredients-list')}>
          AMRUTAM
        </h1>
      </div>
      <nav className="flex-1 px-4 py-4">
        <p className="px-4 text-xs text-gray-500 uppercase mb-2">Menu</p>
        <ul>
          {menuItems.map((item, index) => (
            <li key={index}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (item.name === 'Ingredients') {
                    handleNavigation('Ingredients');
                  }
                }}
                className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-lg ${item.active ? 'bg-green-100 text-green-800' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                <item.icon size={20} className="mr-3" />
                <span>{item.name}</span>
              </a>
              {item.active && item.subItems && (
                <ul className="pl-8 py-2">
                  {item.subItems.map((sub, i) => (
                    <li key={i}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigation(sub);
                        }}
                        className="block py-1.5 text-sm text-gray-600 hover:text-gray-900"
                      >
                        {sub}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;