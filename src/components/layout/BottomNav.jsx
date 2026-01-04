import React from 'react';
import { Home, Heart, MapPin, FileText, User } from 'lucide-react';

const BottomNav = ({ active, onNavigate }) => {
  const items = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'care', icon: Heart, label: 'Care' },
    { id: 'kiosks', icon: MapPin, label: 'Kiosks' },
    { id: 'records', icon: FileText, label: 'Records' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50 safe-area-pb print:hidden">
      <div className="flex justify-around py-2">
        {items.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex flex-col items-center gap-1 px-3 py-2 min-w-[64px] transition-colors ${
              active === id ? 'text-cyan-600' : 'text-gray-400'
            }`}
          >
            <Icon className="w-6 h-6" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
