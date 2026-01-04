import React from 'react';
import { Home, Heart, MapPin, FileText, User, Calendar, Pill, FlaskConical, Bell, Settings, X, MessageSquare, CreditCard, FileHeart, Users, Globe } from 'lucide-react';
import { useResponsive } from '../../hooks';
import { AnimatedPulseIcon } from '../ui';

const Sidebar = ({ activeTab, onNavigate, isOpen, onClose, user }) => {
  const { isMobile } = useResponsive();

  const navItems = [
    { id: 'home', icon: Home, label: 'Dashboard', screen: 'dashboard' },
    { id: 'care', icon: Heart, label: 'Get Care', screen: 'care' },
    { id: 'kiosks', icon: MapPin, label: 'Find Kiosks', screen: 'kiosks' },
    { id: 'records', icon: FileText, label: 'My Records', screen: 'records' },
    { id: 'profile', icon: User, label: 'Profile', screen: 'profile' },
  ];

  const secondaryItems = [
    { icon: Calendar, label: 'Appointments', screen: 'appointments' },
    { icon: Pill, label: 'Pharmacy', screen: 'pharmacy' },
    { icon: FlaskConical, label: 'Lab Results', screen: 'labResults' },
    { icon: MessageSquare, label: 'Messages', screen: 'messages' },
    { icon: Bell, label: 'Notifications', screen: 'notifications' },
    { icon: CreditCard, label: 'Billing', screen: 'billing' },
    { icon: FileHeart, label: 'Health Records', screen: 'healthRecords' },
    { icon: Users, label: 'Family Access', screen: 'familyAccess' },
    { icon: Globe, label: 'Share Records', screen: 'shareRecords' },
    { icon: Settings, label: 'Settings', screen: 'settings' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Logo & Close Button - Compact for mobile */}
      <div className={`${isMobile ? 'p-4' : 'p-6'} border-b border-gray-100 flex-shrink-0`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`${isMobile ? 'w-9 h-9' : 'w-10 h-10'} bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center`}>
              <AnimatedPulseIcon size={isMobile ? 20 : 24} color="white" />
            </div>
            <div>
              <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-base' : 'text-lg'}`}>ExtendiHealth</h1>
              <p className="text-xs text-gray-500">Patient Portal</p>
            </div>
          </div>
          {/* Close button for mobile */}
          {isMobile && (
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>
      </div>

      {/* Main Navigation - Scrollable */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Main Menu</p>
        {navItems.map(({ id, icon: Icon, label, screen }) => (
          <button
            key={id}
            onClick={() => {
              onNavigate(screen);
              if (isMobile) onClose();
            }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
              activeTab === id
                ? 'bg-cyan-50 text-cyan-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
          </button>
        ))}

        <div className="pt-4 mt-4 border-t border-gray-100">
          <p className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">Quick Access</p>
          {secondaryItems.map(({ icon: Icon, label, screen }) => (
            <button
              key={screen}
              onClick={() => {
                onNavigate(screen);
                if (isMobile) onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 transition-all"
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* User Info - Fixed at bottom */}
      {user && (
        <div className="p-4 border-t border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold overflow-hidden">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-10 h-10 object-cover" />
              ) : (
                user.name?.charAt(0) || 'U'
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  // Mobile: Overlay sidebar with slide animation
  if (isMobile) {
    return (
      <>
        {/* Backdrop overlay - only render when open */}
        <div 
          className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ${
            isOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
          }`}
          onClick={onClose}
        />
        {/* Sidebar drawer */}
        <aside
          className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl z-50 transition-transform duration-300 ease-in-out"
          style={{ 
            transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          }}
        >
          {sidebarContent}
        </aside>
      </>
    );
  }

  // Desktop: Fixed sidebar
  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-100 h-screen sticky top-0">
      {sidebarContent}
    </aside>
  );
};

export default Sidebar;
