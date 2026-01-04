import React, { useState } from 'react';
import { Menu, Search, Bell, Settings, LogOut, ChevronDown, User } from 'lucide-react';
import { useResponsive } from '../../hooks';
import { AnimatedPulseIcon } from '../ui';
import Breadcrumbs from './Breadcrumbs';

const TopHeader = ({ 
  user, 
  onMenuClick, 
  onSearch, 
  onNotifications, 
  onSettings,
  onProfile,
  onSignOut,
  screen,
  bookingFlow,
  onNavigate,
  notificationCount = 2,
  twoFASession,
  TwoFASessionBadge,
}) => {
  const { isMobile, isDesktop } = useResponsive();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleProfileClick = () => {
    if (onProfile) {
      onProfile();
    } else if (onNavigate) {
      onNavigate('profile');
    }
    setShowUserMenu(false);
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100 print:hidden">
      <div className="flex items-center justify-between px-4 lg:px-6 py-3">
        {/* Left: Menu button (mobile) or Breadcrumbs (desktop) */}
        <div className="flex items-center gap-4">
          {!isDesktop && (
            <button
              onClick={onMenuClick}
              className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
          )}
          
          {isDesktop && (
            <Breadcrumbs screen={screen} bookingFlow={bookingFlow} onNavigate={onNavigate} />
          )}
        </div>

        {/* Center: Logo (mobile only) */}
        {isMobile && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center">
              <AnimatedPulseIcon size={20} color="white" />
            </div>
            <span className="font-bold text-gray-900">ExtendiHealth</span>
          </div>
        )}

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* 2FA Session Badge */}
          {twoFASession?.isVerified && twoFASession?.sessionExpiresAt && TwoFASessionBadge && (
            <TwoFASessionBadge 
              sessionExpiresAt={twoFASession.sessionExpiresAt}
              onSessionExpired={() => {}}
            />
          )}

          {/* Search (desktop) */}
          {isDesktop && (
            <button
              onClick={onSearch}
              className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              <span className="text-sm text-gray-400">⌘K</span>
            </button>
          )}

          {/* Notifications */}
          <button
            onClick={onNotifications}
            className="p-2 hover:bg-gray-100 rounded-lg relative"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {/* User Menu (desktop) */}
          {isDesktop && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 object-cover" />
                  ) : (
                    user?.name?.charAt(0) || 'U'
                  )}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    {/* Clickable Profile Header */}
                    <button
                      onClick={handleProfileClick}
                      className="w-full px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors text-left"
                    >
                      <p className="font-semibold text-gray-900">{user?.name}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <p className="text-xs text-teal-600 mt-1 font-medium">View Profile →</p>
                    </button>
                    <button
                      onClick={handleProfileClick}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4" />
                      My Profile
                    </button>
                    <button
                      onClick={() => { onSettings(); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4" />
                      Settings
                    </button>
                    <div className="border-t border-gray-100 mt-1 pt-1">
                      <button
                        onClick={() => { onSignOut(); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-gray-50"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
