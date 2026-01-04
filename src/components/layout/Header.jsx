import React from 'react';
import { ChevronLeft } from 'lucide-react';

const Header = ({ title, onBack, rightAction }) => (
  <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-10 px-4 lg:px-6 py-4 border-b border-gray-100 print:hidden">
    <div className="flex items-center justify-between max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        {onBack && (
          <button onClick={onBack} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
        )}
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
      </div>
      {rightAction}
    </div>
  </div>
);

export default Header;
