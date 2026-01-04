import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { getBreadcrumbTrail, SCREEN_NAMES } from '../../data/constants';

const Breadcrumbs = ({ screen, bookingFlow, onNavigate }) => {
  const trail = getBreadcrumbTrail(screen, bookingFlow);
  const currentScreen = SCREEN_NAMES[screen] || screen;

  if (trail.length === 0) return null;

  return (
    <nav className="flex items-center gap-1 text-sm">
      <button 
        onClick={() => onNavigate('dashboard')}
        className="p-1 hover:bg-gray-100 rounded transition-colors"
      >
        <Home className="w-4 h-4 text-gray-400" />
      </button>
      
      {trail.map((crumb, index) => (
        <React.Fragment key={crumb.screen}>
          <ChevronRight className="w-4 h-4 text-gray-300" />
          <button
            onClick={() => onNavigate(crumb.screen)}
            className="text-gray-500 hover:text-gray-700 transition-colors px-1"
          >
            {crumb.name}
          </button>
        </React.Fragment>
      ))}
      
      <ChevronRight className="w-4 h-4 text-gray-300" />
      <span className="text-gray-900 font-medium px-1">{currentScreen}</span>
    </nav>
  );
};

export default Breadcrumbs;
