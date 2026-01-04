import React, { useState } from 'react';
import { Shield, Bell, Eye, Globe, RefreshCw, LogOut, ChevronRight, Check, AlertTriangle, FileText, Info, Settings, User } from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Card, Toggle, Button } from '../ui';
import { Header } from '../layout';

const SettingsPage = ({ settings, onUpdateSettings, onResetDemoData, onSignOut, onBack }) => {
  const { isDesktop } = useResponsive();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const settingsSections = [
    {
      title: 'Notifications',
      icon: Bell,
      items: [
        { key: 'allNotifications', label: 'All Notifications', desc: 'Enable all app notifications' },
        { key: 'appointmentReminders', label: 'Appointment Reminders', desc: 'Get reminded before appointments' },
        { key: 'queueUpdates', label: 'Queue Updates', desc: 'Real-time e-Waiting Room updates' },
        { key: 'travelReminders', label: 'Travel Reminders', desc: 'When to leave for appointments' },
      ],
    },
    {
      title: 'Accessibility',
      icon: Eye,
      items: [
        { key: 'accessibilityMode', label: 'Accessibility Mode', desc: 'Enhanced contrast and larger touch targets' },
        { key: 'largeText', label: 'Large Text', desc: 'Increase text size throughout the app' },
      ],
    },
    {
      title: 'Convenience',
      icon: Settings,
      items: [
        { key: 'autoCheckIn', label: 'Auto Check-In', desc: 'Automatically check in when you arrive at a kiosk' },
      ],
    },
  ];

  const content = (
    <div className="space-y-6">
      {/* Settings Sections */}
      {settingsSections.map((section) => (
        <Card key={section.title} className="overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
            <section.icon className="w-5 h-5 text-cyan-600" />
            <h3 className="font-semibold text-gray-900">{section.title}</h3>
          </div>
          <div className="divide-y divide-gray-100">
            {section.items.map((item) => (
              <div key={item.key} className="px-4 py-4 flex items-center justify-between">
                <div className="flex-1 mr-4">
                  <p className="font-medium text-gray-900">{item.label}</p>
                  <p className="text-sm text-gray-500">{item.desc}</p>
                </div>
                <Toggle
                  enabled={settings[item.key]}
                  onChange={(val) => onUpdateSettings({ ...settings, [item.key]: val })}
                />
              </div>
            ))}
          </div>
        </Card>
      ))}

      {/* Demo Data Section */}
      <Card className="overflow-hidden">
        <div className="px-4 py-3 bg-amber-50 border-b border-amber-100 flex items-center gap-3">
          <RefreshCw className="w-5 h-5 text-amber-600" />
          <h3 className="font-semibold text-amber-900">Demo Mode</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-sm text-gray-700">
                You are currently using demo data. This includes sample appointments, prescriptions, 
                lab results, referrals, and medical history for testing purposes.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full px-4 py-3 bg-amber-100 text-amber-800 font-medium rounded-xl hover:bg-amber-200 transition-colors flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Reset Demo Data
          </button>
        </div>
      </Card>

      {/* Account Actions */}
      <Card className="overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-3">
          <User className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Account</h3>
        </div>
        <div className="p-4 space-y-3">
          <button
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <Shield className="w-5 h-5" />
            Privacy & Security
          </button>
          <button
            className="w-full px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
          >
            <FileText className="w-5 h-5" />
            Terms & Privacy Policy
          </button>
          <button
            onClick={onSignOut}
            className="w-full px-4 py-3 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </Card>

      {/* App Info */}
      <div className="text-center text-sm text-gray-400 py-4">
        <p>ExtendiHealth v1.0.0</p>
        <p className="mt-1">© 2025 ExtendiHealth Inc.</p>
        <p className="mt-1">HIPAA & PHIPA Compliant</p>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm p-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Reset Demo Data?</h3>
              <p className="text-gray-500 mb-6">
                This will reset all appointments, prescriptions, lab results, and other data to the original demo state.
              </p>
              <div className="space-y-3">
                <Button
                  size="lg"
                  onClick={() => {
                    onResetDemoData();
                    setShowResetConfirm(false);
                  }}
                  className="w-full bg-amber-500 hover:bg-amber-600"
                >
                  Yes, Reset Data
                </Button>
                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => setShowResetConfirm(false)}
                  className="w-full"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Settings" onBack={onBack} />
      <div className="p-4 pb-24">
        {content}
      </div>
    </div>
  );
};

// ============================================================================
// E-WAITING ROOM PAGE
// ============================================================================


export default SettingsPage;
