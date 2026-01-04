import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, MapPin, Calendar, Clock, ChevronLeft, ChevronRight, Settings, Home, User, FileText, Bell, Globe, Eye, Check, AlertCircle, Navigation, Search, Pill, Activity, Phone, Mail, Shield, LogOut, RefreshCw, Trash2, Info, BookOpen, Video, Folder, FlaskConical, Users, Edit3, X, Download, ExternalLink, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Minus, Camera, Menu, ChevronDown, Printer, Keyboard, Command } from 'lucide-react';

// ============================================================================
// IMPORTS FROM MODULAR FILES
// ============================================================================

// Custom hooks
import { useResponsive, useKeyboardShortcuts } from './hooks';

// UI Components  
import { Button, Card, Badge, Toggle, AnimatedPulseIcon } from './components/ui';

// Layout Components
import { Sidebar, TopHeader, BottomNav, Header, Breadcrumbs } from './components/layout';

// Page Components
import {
  LandingPage,
  LoginPage,
  CreateAccountPage,
  Dashboard,
  CareScreen,
  GetCareReasonPage,
  DescribeSymptomsPage,
  QuickQuestionsPage,
  AIPreDiagnosisPage,
  SettingsPage,
  EWaitingRoomPage,
  ReferralsPage,
  VisitHistoryPage,
  KiosksListPage,
  KioskDetailsPage,
  BookKioskSlotPage,
  AppointmentConfirmedPage,
  KioskCheckInPage,
  VirtualVisitPage,
  PlaceholderScreen,
  // HIPAA-Compliant Intake Flow
  HIPAAConsentPage,
  MedicalHistoryPage,
  CurrentMedicationsPage,
  EnhancedSymptomsPage,
  EnhancedAIPreDiagnosisPage,
} from './components/pages';

// Data & Constants
import { KIOSKS, SCREEN_NAMES, VISIT_REASONS, GET_CARE_REASONS, getBreadcrumbTrail } from './data/constants';
import { TWO_FA_CONFIG, PIN_VERIFICATION_CONFIG } from './data/config';
import { 
  generateDemoData, 
  DEMO_USER, 
  DEMO_APPOINTMENTS, 
  DEMO_LAB_RESULTS, 
  DEMO_PRESCRIPTIONS, 
  DEMO_HEALTH_SUMMARY, 
  DEMO_REFERRALS, 
  DEMO_WAITING_ROOM, 
  DEMO_VISIT_HISTORY, 
  DEMO_DOCUMENTS, 
  DEMO_NOTIFICATIONS 
} from './data/demoData';

// Utility functions
import { createAuditLog, generateAppointmentNumber, calculateLeaveTime } from './utils/helpers';

// ============================================================================
// ADDITIONAL CONSTANTS (kept here for now)
// ============================================================================

const PHI_CATEGORIES = {
  labResults: { name: 'Lab Results', sensitivity: 'high', retentionYears: 7 },
  prescriptions: { name: 'Prescriptions', sensitivity: 'high', retentionYears: 7 },
  appointments: { name: 'Visit History', sensitivity: 'medium', retentionYears: 7 },
  documents: { name: 'Medical Documents', sensitivity: 'high', retentionYears: 7 },
  vitals: { name: 'Vitals History', sensitivity: 'medium', retentionYears: 7 },
  healthProfile: { name: 'Health Profile', sensitivity: 'high', retentionYears: 7 },
  records: { name: 'Medical Records', sensitivity: 'high', retentionYears: 7 },
};

const PROTECTED_DOCUMENT_TYPES = {
  labResult: { name: 'Lab Result', icon: 'FlaskConical', sensitivity: 'high' },
  prescription: { name: 'Prescription', icon: 'Pill', sensitivity: 'high' },
  visitSummary: { name: 'Visit Summary', icon: 'FileText', sensitivity: 'high' },
  medicalRecord: { name: 'Medical Record', icon: 'Folder', sensitivity: 'high' },
  referral: { name: 'Referral Letter', icon: 'FileText', sensitivity: 'medium' },
  immunization: { name: 'Immunization Record', icon: 'Shield', sensitivity: 'medium' },
  imaging: { name: 'Imaging Report', icon: 'Activity', sensitivity: 'high' },
  discharge: { name: 'Discharge Summary', icon: 'FileText', sensitivity: 'high' },
};

// ============================================================================
// KEYBOARD SHORTCUTS HELP MODAL
// ============================================================================

const KeyboardShortcutsModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const shortcuts = [
    { keys: ['Esc'], description: 'Go back / Close modal' },
    { keys: ['Ctrl', 'K'], description: 'Quick search' },
    { keys: ['Ctrl', '1'], description: 'Go to Dashboard' },
    { keys: ['Ctrl', '2'], description: 'Go to Care' },
    { keys: ['Ctrl', '3'], description: 'Go to Kiosks' },
    { keys: ['Ctrl', '4'], description: 'Go to Records' },
    { keys: ['Ctrl', '5'], description: 'Go to Profile' },
    { keys: ['Ctrl', 'P'], description: 'Print current view' },
    { keys: ['?'], description: 'Show keyboard shortcuts' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Keyboard className="w-6 h-6 text-cyan-600" />
              <h2 className="text-xl font-bold text-gray-900">Keyboard Shortcuts</h2>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>
        <div className="p-6 space-y-3">
          {shortcuts.map((shortcut, i) => (
            <div key={i} className="flex items-center justify-between">
              <span className="text-gray-600">{shortcut.description}</span>
              <div className="flex items-center gap-1">
                {shortcut.keys.map((key, j) => (
                  <React.Fragment key={j}>
                    <kbd className="px-2 py-1 bg-gray-100 rounded text-sm font-mono text-gray-700">
                      {key}
                    </kbd>
                    {j < shortcut.keys.length - 1 && <span className="text-gray-400">+</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// QUICK SEARCH MODAL
// ============================================================================

const QuickSearchModal = ({ isOpen, onClose, onNavigate }) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const searchItems = [
    { name: 'Dashboard', screen: 'dashboard', icon: Home },
    { name: 'Get Care Now', screen: 'getCareReason', icon: Heart },
    { name: 'Book Appointment', screen: 'selectReason', icon: Calendar },
    { name: 'Find Kiosks', screen: 'kiosks', icon: MapPin },
    { name: 'My Appointments', screen: 'appointments', icon: Calendar },
    { name: 'My Prescriptions', screen: 'pharmacy', icon: Pill },
    { name: 'Lab Results', screen: 'labResults', icon: FlaskConical },
    { name: 'Medical Records', screen: 'records', icon: FileText },
    { name: 'Profile', screen: 'profile', icon: User },
    { name: 'Settings', screen: 'settings', icon: Settings },
    { name: 'Notifications', screen: 'notifications', icon: Bell },
  ];

  const filteredItems = query
    ? searchItems.filter(item => item.name.toLowerCase().includes(query.toLowerCase()))
    : searchItems;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-start justify-center pt-[20vh]" onClick={onClose}>
      <div className="bg-white rounded-2xl max-w-lg w-full mx-4 shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for anything..."
              className="flex-1 text-lg outline-none"
            />
            <kbd className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-500">Esc</kbd>
          </div>
        </div>
        <div className="max-h-80 overflow-y-auto">
          {filteredItems.map((item) => (
            <button
              key={item.screen}
              onClick={() => {
                onNavigate(item.screen);
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
            >
              <item.icon className="w-5 h-5 text-gray-400" />
              <span className="text-gray-700">{item.name}</span>
            </button>
          ))}
          {filteredItems.length === 0 && (
            <div className="px-4 py-8 text-center text-gray-500">
              No results found for "{query}"
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PRINT STYLES
// ============================================================================

const PrintStyles = () => (
  <style>{`
    @media print {
      body * {
        visibility: hidden;
      }
      .print-area, .print-area * {
        visibility: visible;
      }
      .print-area {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
      }
      .print\\:hidden {
        display: none !important;
      }
      .print\\:block {
        display: block !important;
      }
      @page {
        margin: 1cm;
      }
    }
  `}</style>
);

const TwoFASessionBadge = ({ sessionExpiresAt, onSessionExpired }) => {
  const [timeRemaining, setTimeRemaining] = useState(0);

  useEffect(() => {
    const updateTime = () => {
      const remaining = Math.max(0, sessionExpiresAt - Date.now());
      setTimeRemaining(remaining);
      if (remaining === 0) {
        onSessionExpired();
      }
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [sessionExpiresAt, onSessionExpired]);

  const minutes = Math.floor(timeRemaining / 60000);
  const seconds = Math.floor((timeRemaining % 60000) / 1000);

  if (timeRemaining <= 0) return null;

  return (
    <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
      timeRemaining < 120000 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
    }`}>
      <Shield className="w-3 h-3" />
      <span>2FA: {minutes}:{seconds.toString().padStart(2, '0')}</span>
    </div>
  );
};

// ============================================================================
// TWO-FACTOR AUTH MODAL
// ============================================================================

const TwoFactorAuthModal = ({ 
  isOpen, 
  onClose, 
  onVerify, 
  user, 
  targetScreen,
  verificationMethod,
  setVerificationMethod,
  attemptsRemaining,
  isLocked,
  lockoutEndTime,
}) => {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = [
    useRef(null), useRef(null), useRef(null),
    useRef(null), useRef(null), useRef(null),
  ];

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  useEffect(() => {
    if (isLocked && lockoutEndTime) {
      const updateLockout = () => {
        const remaining = Math.max(0, lockoutEndTime - Date.now());
        setLockoutRemaining(remaining);
      };
      updateLockout();
      const interval = setInterval(updateLockout, 1000);
      return () => clearInterval(interval);
    }
  }, [isLocked, lockoutEndTime]);

  const handleCodeChange = (index, value) => {
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split('');
      const newCode = [...code];
      pastedCode.forEach((char, i) => {
        if (index + i < 6) newCode[index + i] = char;
      });
      setCode(newCode);
      const nextIndex = Math.min(index + pastedCode.length, 5);
      inputRefs[nextIndex]?.current?.focus();
    } else {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      if (value && index < 5) {
        inputRefs[index + 1]?.current?.focus();
      }
    }
    setError('');
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    }
  };

  const sendVerificationCode = () => {
    createAuditLog('2FA_CODE_REQUESTED', {
      method: verificationMethod,
      targetScreen,
      maskedContact: verificationMethod === 'sms' 
        ? `***-***-${user?.phone?.slice(-4) || '0123'}`
        : `***@${user?.email?.split('@')[1] || 'email.com'}`,
    }, user?.email);
    
    setCodeSent(true);
    setCountdown(60);
    setError('');
  };

  const handleVerify = async () => {
    const enteredCode = code.join('');
    if (enteredCode.length !== 6) {
      setError('Please enter the complete 6-digit code');
      return;
    }

    setIsVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const isValid = enteredCode === '123456' || enteredCode.length === 6;
    
    if (isValid) {
      createAuditLog('2FA_VERIFICATION_SUCCESS', {
        method: verificationMethod,
        targetScreen,
        phiCategory: PHI_CATEGORIES[targetScreen]?.name || 'Unknown',
      }, user?.email, true);
      
      onVerify(true);
    } else {
      createAuditLog('2FA_VERIFICATION_FAILED', {
        method: verificationMethod,
        targetScreen,
        attemptsRemaining: attemptsRemaining - 1,
      }, user?.email, false);
      
      setError(`Invalid code. ${attemptsRemaining - 1} attempts remaining.`);
      setCode(['', '', '', '', '', '']);
      inputRefs[0]?.current?.focus();
      onVerify(false);
    }
    
    setIsVerifying(false);
  };

  if (!isOpen) return null;

  const phiCategory = PHI_CATEGORIES[targetScreen];
  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-teal-500 p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Verify Your Identity</h2>
              <p className="text-cyan-100 text-sm">HIPAA-Compliant 2FA</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          {/* Security Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <div className="flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-amber-800">Protected Health Information</p>
                <p className="text-xs text-amber-700 mt-1">
                  You're accessing <strong>{phiCategory?.name || 'sensitive records'}</strong>. 
                  Additional verification is required per HIPAA Security Rule §164.312(d).
                </p>
              </div>
            </div>
          </div>

          {isLocked ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Account Temporarily Locked</h3>
              <p className="text-gray-600 mb-4">
                Too many failed attempts. Please try again in:
              </p>
              <div className="text-3xl font-bold text-red-600 mb-6">
                {formatTime(lockoutRemaining)}
              </div>
              <p className="text-xs text-gray-500">
                This security measure protects your health information.
              </p>
            </div>
          ) : !codeSent ? (
            <div>
              <p className="text-gray-700 mb-4">
                Choose how you'd like to receive your verification code:
              </p>
              
              <div className="space-y-3 mb-6">
                {[
                  { id: 'sms', icon: Phone, label: 'Text Message (SMS)', detail: `***-***-${user?.phone?.slice(-4) || '0123'}` },
                  { id: 'email', icon: Mail, label: 'Email', detail: user?.email?.replace(/(.{2})(.*)(@.*)/, '$1***$3') || '***@email.com' },
                  { id: 'authenticator', icon: Shield, label: 'Authenticator App', detail: 'Use Google/Microsoft Authenticator' },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setVerificationMethod(method.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${
                      verificationMethod === method.id 
                        ? 'border-cyan-500 bg-cyan-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      verificationMethod === method.id ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <method.icon className="w-5 h-5" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium text-gray-900">{method.label}</p>
                      <p className="text-sm text-gray-500">{method.detail}</p>
                    </div>
                    {verificationMethod === method.id && (
                      <Check className="w-5 h-5 text-cyan-500" />
                    )}
                  </button>
                ))}
              </div>

              <Button size="lg" onClick={sendVerificationCode} className="w-full">
                Send Verification Code
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-gray-700 mb-2">
                Enter the 6-digit code sent to your {verificationMethod === 'sms' ? 'phone' : verificationMethod === 'email' ? 'email' : 'authenticator app'}:
              </p>

              <div className="flex gap-2 justify-center mb-4">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                      error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                ))}
              </div>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm mb-4 justify-center">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <p className="text-xs text-gray-400 text-center mb-4">
                Demo: Enter "123456" or any 6 digits
              </p>

              <Button
                size="lg"
                onClick={handleVerify}
                disabled={isVerifying || code.join('').length !== 6}
                className="w-full"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Shield className="w-5 h-5" />
                    Verify & Access Records
                  </>
                )}
              </Button>

              <div className="text-center mt-4">
                {countdown > 0 ? (
                  <p className="text-sm text-gray-500">Resend code in {countdown}s</p>
                ) : (
                  <button onClick={sendVerificationCode} className="text-sm text-cyan-600 hover:text-cyan-700 font-medium">
                    Resend verification code
                  </button>
                )}
              </div>

              <button
                onClick={() => {
                  setCodeSent(false);
                  setCode(['', '', '', '', '', '']);
                  setError('');
                }}
                className="w-full text-sm text-gray-500 hover:text-gray-700 mt-3"
              >
                Try a different verification method
              </button>
            </div>
          )}

          <button onClick={onClose} className="w-full mt-4 py-2 text-gray-500 hover:text-gray-700 text-sm">
            Cancel and go back
          </button>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <Shield className="w-3 h-3" />
              <span>HIPAA Compliant • 256-bit Encryption • Audit Logged</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// PIN VERIFICATION MODAL
// ============================================================================

const PinVerificationModal = ({
  isOpen,
  onClose,
  onVerify,
  documentName,
  documentType,
  attemptsRemaining,
  isLocked,
  lockoutEndTime,
  user,
}) => {
  const [pin, setPin] = useState(['', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [showPin, setShowPin] = useState(false);
  const inputRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  useEffect(() => {
    if (isOpen) {
      setPin(['', '', '', '']);
      setError('');
      setShowPin(false);
      setTimeout(() => inputRefs[0]?.current?.focus(), 100);
    }
  }, [isOpen]);

  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  useEffect(() => {
    if (isLocked && lockoutEndTime) {
      const updateLockout = () => {
        const remaining = Math.max(0, lockoutEndTime - Date.now());
        setLockoutRemaining(remaining);
      };
      updateLockout();
      const interval = setInterval(updateLockout, 1000);
      return () => clearInterval(interval);
    }
  }, [isLocked, lockoutEndTime]);

  const handlePinChange = (index, value) => {
    if (value.length > 1) {
      const pastedPin = value.slice(0, 4).split('');
      const newPin = [...pin];
      pastedPin.forEach((char, i) => {
        if (index + i < 4) newPin[index + i] = char;
      });
      setPin(newPin);
      const nextIndex = Math.min(index + pastedPin.length, 3);
      inputRefs[nextIndex]?.current?.focus();
    } else {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);
      if (value && index < 3) {
        inputRefs[index + 1]?.current?.focus();
      }
    }
    setError('');
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      inputRefs[index - 1]?.current?.focus();
    }
  };

  const handleVerify = async () => {
    const enteredPin = pin.join('');
    if (enteredPin.length !== 4) {
      setError('Please enter your complete 4-digit PIN');
      return;
    }

    setIsVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const isValid = enteredPin.length === 4;
    
    if (isValid) {
      createAuditLog('DOCUMENT_DOWNLOAD_AUTHORIZED', {
        documentName,
        documentType,
        action: 'PIN_VERIFIED',
        timestamp: new Date().toISOString(),
      }, user?.email, true);
      
      onVerify(true, enteredPin);
    } else {
      createAuditLog('DOCUMENT_DOWNLOAD_DENIED', {
        documentName,
        documentType,
        action: 'PIN_FAILED',
        attemptsRemaining: attemptsRemaining - 1,
      }, user?.email, false);
      
      setError(`Invalid PIN. ${attemptsRemaining - 1} attempts remaining.`);
      setPin(['', '', '', '']);
      inputRefs[0]?.current?.focus();
      onVerify(false);
    }
    
    setIsVerifying(false);
  };

  if (!isOpen) return null;

  const docInfo = PROTECTED_DOCUMENT_TYPES[documentType] || { name: 'Document', sensitivity: 'medium' };
  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-sm w-full shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500 to-teal-500 p-5 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Confirm Download</h2>
              <p className="text-cyan-100 text-sm">PIN Required</p>
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-cyan-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{documentName || 'Document'}</p>
                <p className="text-xs text-gray-500">{docInfo.name} • {docInfo.sensitivity === 'high' ? 'Highly Sensitive' : 'Sensitive'}</p>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5">
            <div className="flex gap-2">
              <Shield className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                HIPAA requires identity verification before downloading Protected Health Information (PHI).
              </p>
            </div>
          </div>

          {isLocked ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertCircle className="w-7 h-7 text-red-600" />
              </div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">Temporarily Locked</h3>
              <p className="text-sm text-gray-600 mb-3">
                Too many failed attempts. Try again in:
              </p>
              <div className="text-2xl font-bold text-red-600 mb-4">
                {formatTime(lockoutRemaining)}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-700 text-center mb-4">
                Enter your 4-digit PIN to download
              </p>

              <div className="flex gap-3 justify-center mb-4">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    ref={inputRefs[index]}
                    type={showPin ? 'text' : 'password'}
                    inputMode="numeric"
                    maxLength={4}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-14 h-16 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all ${
                      error ? 'border-red-300 bg-red-50' : 'border-gray-300'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => setShowPin(!showPin)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mx-auto mb-3"
              >
                <Eye className="w-4 h-4" />
                {showPin ? 'Hide PIN' : 'Show PIN'}
              </button>

              {error && (
                <div className="flex items-center gap-2 text-red-600 text-sm mb-4 justify-center">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}

              <p className="text-xs text-gray-400 text-center mb-4">
                Demo: Enter any 4-digit PIN
              </p>

              <Button
                size="lg"
                onClick={handleVerify}
                disabled={isVerifying || pin.join('').length !== 4}
                className="w-full"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    Confirm & Download
                  </>
                )}
              </Button>
            </div>
          )}

          <button onClick={onClose} className="w-full mt-3 py-2 text-gray-500 hover:text-gray-700 text-sm">
            Cancel
          </button>

          <div className="mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
              <Shield className="w-3 h-3" />
              <span>All downloads are logged per HIPAA §164.312</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// LEAFLET MAP COMPONENT
// ============================================================================

const KioskMap = ({ kiosks, selectedKiosk, onSelectKiosk, height = "400px" }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);

  useEffect(() => {
    // Load Leaflet CSS
    if (!document.getElementById('leaflet-css')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    if (!window.L) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.body.appendChild(script);
    } else {
      initMap();
    }

    function initMap() {
      if (!mapRef.current || mapInstanceRef.current) return;

      const L = window.L;
      
      // Center on Toronto
      const map = L.map(mapRef.current).setView([43.6532, -79.3832], 12);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(map);

      mapInstanceRef.current = map;

      // Add markers
      updateMarkers();
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const updateMarkers = useCallback(() => {
    if (!mapInstanceRef.current || !window.L) return;

    const L = window.L;
    const map = mapInstanceRef.current;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    kiosks.forEach(kiosk => {
      if (!kiosk.lat || !kiosk.lng) return;

      const isSelected = selectedKiosk?.id === kiosk.id;
      
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `
          <div style="
            width: 32px;
            height: 32px;
            background: ${isSelected ? '#0891b2' : '#06b6d4'};
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3" fill="currentColor"/>
            </svg>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      const marker = L.marker([kiosk.lat, kiosk.lng], { icon })
        .addTo(map)
        .bindPopup(`
          <div style="min-width: 200px;">
            <strong style="font-size: 14px;">${kiosk.name.replace('ExtendiHealth Kiosk - ', '')}</strong>
            <p style="margin: 4px 0; color: #666; font-size: 12px;">${kiosk.address}</p>
            <p style="margin: 4px 0; color: #0891b2; font-size: 12px;">${kiosk.walkInStatus}</p>
          </div>
        `)
        .on('click', () => onSelectKiosk(kiosk));

      markersRef.current.push(marker);
    });
  }, [kiosks, selectedKiosk, onSelectKiosk]);

  useEffect(() => {
    updateMarkers();
  }, [updateMarkers]);

  useEffect(() => {
    if (selectedKiosk && mapInstanceRef.current && selectedKiosk.lat && selectedKiosk.lng) {
      mapInstanceRef.current.setView([selectedKiosk.lat, selectedKiosk.lng], 14);
    }
  }, [selectedKiosk]);

  return (
    <div 
      ref={mapRef} 
      style={{ height, width: '100%' }} 
      className="rounded-xl overflow-hidden border border-gray-200"
    />
  );
};

// ============================================================================
// APP SHELL / LAYOUT
// ============================================================================

const AppShell = ({ 
  children, 
  user, 
  activeTab, 
  screen,
  bookingFlow,
  onNavigate,
  onSignOut,
  showNav = true,
  twoFASession,
}) => {
  const { isMobile, isDesktop } = useResponsive();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Close sidebar when switching to desktop
  useEffect(() => {
    if (isDesktop) {
      setSidebarOpen(false);
    }
  }, [isDesktop]);

  // Close sidebar when navigating on mobile
  useEffect(() => {
    if (isMobile) {
      setSidebarOpen(false);
    }
  }, [screen, isMobile]);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    { key: 'Escape', action: () => { setShowSearch(false); setShowShortcuts(false); } },
    { key: 'k', ctrl: true, action: () => setShowSearch(true) },
    { key: '1', ctrl: true, action: () => onNavigate('dashboard') },
    { key: '2', ctrl: true, action: () => onNavigate('care') },
    { key: '3', ctrl: true, action: () => onNavigate('kiosks') },
    { key: '4', ctrl: true, action: () => onNavigate('records') },
    { key: '5', ctrl: true, action: () => onNavigate('profile') },
    { key: 'p', ctrl: true, action: () => window.print() },
    { key: '?', action: () => setShowShortcuts(true) },
  ], showNav && user);

  if (!showNav) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <Sidebar
        activeTab={activeTab}
        onNavigate={onNavigate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        user={user}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
        {/* Top Header */}
        <TopHeader
          user={user}
          onMenuClick={() => setSidebarOpen(true)}
          onSearch={() => setShowSearch(true)}
          onNotifications={() => onNavigate('notifications')}
          onSettings={() => onNavigate('settings')}
          onSignOut={onSignOut}
          screen={screen}
          bookingFlow={bookingFlow}
          onNavigate={onNavigate}
          twoFASession={twoFASession}
        />

        {/* Page Content */}
        <main className="flex-1 pb-20 lg:pb-8">
          {children}
        </main>

        {/* Bottom Nav (Mobile) */}
        {isMobile && (
          <BottomNav active={activeTab} onNavigate={(tab) => {
            if (tab === 'home') onNavigate('dashboard');
            else if (tab === 'care') onNavigate('care');
            else if (tab === 'kiosks') onNavigate('kiosks');
            else if (tab === 'records') onNavigate('records');
            else if (tab === 'profile') onNavigate('profile');
          }} />
        )}
      </div>

      {/* Modals */}
      <QuickSearchModal
        isOpen={showSearch}
        onClose={() => setShowSearch(false)}
        onNavigate={onNavigate}
      />

      <KeyboardShortcutsModal
        isOpen={showShortcuts}
        onClose={() => setShowShortcuts(false)}
      />

      {/* Print Styles */}
      <PrintStyles />
    </div>
  );
};

// ============================================================================
// PLACEHOLDER FOR SCREENS (to be continued in Part 2)
// ============================================================================

// Export for continuation
export {
  useResponsive,
  useKeyboardShortcuts,
  Button,
  Card,
  Badge,
  Toggle,
  AppShell,
  Sidebar,
  TopHeader,
  BottomNav,
  Breadcrumbs,
  TwoFactorAuthModal,
  PinVerificationModal,
  TwoFASessionBadge,
  KioskMap,
  AnimatedPulseIcon,
  createAuditLog,
  generateAppointmentNumber,
  calculateLeaveTime,
  DEMO_USER,
  DEMO_APPOINTMENTS,
  DEMO_LAB_RESULTS,
  DEMO_PRESCRIPTIONS,
  DEMO_HEALTH_SUMMARY,
  KIOSKS,
  VISIT_REASONS,
  GET_CARE_REASONS,
  PHI_CATEGORIES,
  TWO_FA_CONFIG,
  PIN_VERIFICATION_CONFIG,
  PROTECTED_DOCUMENT_TYPES,
  SCREEN_NAMES,
};

// ============================================================================
// LANDING PAGE
// ============================================================================

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function ExtendiHealthApp() {
  const { isMobile, isDesktop } = useResponsive();
  const [screen, setScreen] = useState('landing');
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [labResults, setLabResults] = useState([]);
  const [healthSummary, setHealthSummary] = useState(null);
  const [referrals, setReferrals] = useState([]);
  const [waitingRoom, setWaitingRoom] = useState(null);
  const [visitHistory, setVisitHistory] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [activeTab, setActiveTab] = useState('home');
  const [bookingFlow, setBookingFlow] = useState({ 
    type: null, 
    reason: null, 
    kiosk: null, 
    dateTime: null, 
    getCareData: null, 
    visitData: null, 
    appointmentNumber: null,
    // HIPAA-Compliant Medical Intake Data
    hipaaConsent: null,
    medicalHistory: null,
    medications: null,
    symptomsData: null,
    aiAssessment: null,
  });
  
  // Medical Intake Progress
  const [intakeProgress, setIntakeProgress] = useState({
    consentCompleted: false,
    historyCompleted: false,
    medicationsCompleted: false,
    symptomsCompleted: false,
  });
  
  const [settings, setSettings] = useState({
    accessibilityMode: true,
    largeText: true,
    allNotifications: true,
    appointmentReminders: true,
    queueUpdates: true,
    travelReminders: true,
    autoCheckIn: true,
    demoMode: true,
  });

  // 2FA State
  const [twoFactorAuth, setTwoFactorAuth] = useState({
    isVerified: false,
    sessionExpiresAt: null,
    verificationMethod: 'sms',
    attemptsRemaining: TWO_FA_CONFIG.maxAttempts,
    isLocked: false,
    lockoutEndTime: null,
    pendingScreen: null,
  });
  const [show2FAModal, setShow2FAModal] = useState(false);

  // PIN Verification State
  const [pinVerification, setPinVerification] = useState({
    showModal: false,
    documentName: null,
    documentType: null,
    downloadCallback: null,
    attemptsRemaining: PIN_VERIFICATION_CONFIG.maxAttempts,
    isLocked: false,
    lockoutEndTime: null,
  });

  const PROTECTED_SCREENS = ['records', 'labResults', 'pharmacy', 'appointments', 'documents', 'healthProfile'];

  const is2FASessionValid = useCallback(() => {
    if (!twoFactorAuth.isVerified) return false;
    if (!twoFactorAuth.sessionExpiresAt) return false;
    return Date.now() < twoFactorAuth.sessionExpiresAt;
  }, [twoFactorAuth.isVerified, twoFactorAuth.sessionExpiresAt]);

  const handle2FAVerification = (success) => {
    if (success) {
      const expiresAt = Date.now() + TWO_FA_CONFIG.sessionDurationMs;
      setTwoFactorAuth(prev => ({
        ...prev,
        isVerified: true,
        sessionExpiresAt: expiresAt,
        attemptsRemaining: TWO_FA_CONFIG.maxAttempts,
        isLocked: false,
        lockoutEndTime: null,
      }));
      setShow2FAModal(false);
      
      if (twoFactorAuth.pendingScreen) {
        setScreen(twoFactorAuth.pendingScreen);
        setTwoFactorAuth(prev => ({ ...prev, pendingScreen: null }));
      }
    } else {
      const newAttempts = twoFactorAuth.attemptsRemaining - 1;
      if (newAttempts <= 0) {
        const lockoutEnd = Date.now() + TWO_FA_CONFIG.lockoutDurationMs;
        setTwoFactorAuth(prev => ({
          ...prev,
          attemptsRemaining: 0,
          isLocked: true,
          lockoutEndTime: lockoutEnd,
        }));
        createAuditLog('2FA_LOCKOUT', { reason: 'Max attempts exceeded' }, user?.email, false);
      } else {
        setTwoFactorAuth(prev => ({ ...prev, attemptsRemaining: newAttempts }));
      }
    }
  };

  const handle2FASessionExpired = useCallback(() => {
    setTwoFactorAuth(prev => ({
      ...prev,
      isVerified: false,
      sessionExpiresAt: null,
    }));
    createAuditLog('2FA_SESSION_EXPIRED', { reason: 'Session timeout' }, user?.email);
  }, [user?.email]);

  const navigateToProtectedScreen = (targetScreen) => {
    if (PROTECTED_SCREENS.includes(targetScreen)) {
      if (is2FASessionValid()) {
        createAuditLog('PHI_ACCESS_GRANTED', {
          screen: targetScreen,
          phiCategory: PHI_CATEGORIES[targetScreen]?.name || 'Unknown',
        }, user?.email);
        setScreen(targetScreen);
      } else {
        createAuditLog('PHI_ACCESS_REQUESTED', {
          screen: targetScreen,
          phiCategory: PHI_CATEGORIES[targetScreen]?.name || 'Unknown',
          requires2FA: true,
        }, user?.email);
        setTwoFactorAuth(prev => ({ ...prev, pendingScreen: targetScreen }));
        setShow2FAModal(true);
      }
    } else {
      setScreen(targetScreen);
    }
  };

  const reset2FAState = () => {
    setTwoFactorAuth({
      isVerified: false,
      sessionExpiresAt: null,
      verificationMethod: 'sms',
      attemptsRemaining: TWO_FA_CONFIG.maxAttempts,
      isLocked: false,
      lockoutEndTime: null,
      pendingScreen: null,
    });
    setShow2FAModal(false);
  };

  const requestDownloadWithPin = (documentName, documentType, downloadCallback) => {
    createAuditLog('DOCUMENT_DOWNLOAD_ATTEMPTED', { documentName, documentType }, user?.email);
    setPinVerification(prev => ({
      ...prev,
      showModal: true,
      documentName,
      documentType,
      downloadCallback,
    }));
  };

  const handlePinVerification = (success, enteredPin) => {
    if (success) {
      if (pinVerification.downloadCallback) {
        pinVerification.downloadCallback();
      }
      setPinVerification(prev => ({
        ...prev,
        showModal: false,
        documentName: null,
        documentType: null,
        downloadCallback: null,
        attemptsRemaining: PIN_VERIFICATION_CONFIG.maxAttempts,
      }));
    } else {
      const newAttempts = pinVerification.attemptsRemaining - 1;
      if (newAttempts <= 0) {
        const lockoutEnd = Date.now() + PIN_VERIFICATION_CONFIG.lockoutDurationMs;
        setPinVerification(prev => ({
          ...prev,
          attemptsRemaining: 0,
          isLocked: true,
          lockoutEndTime: lockoutEnd,
        }));
      } else {
        setPinVerification(prev => ({ ...prev, attemptsRemaining: newAttempts }));
      }
    }
  };

  const closePinModal = () => {
    setPinVerification(prev => ({
      ...prev,
      showModal: false,
      documentName: null,
      documentType: null,
      downloadCallback: null,
    }));
  };

  const loadDemoData = () => {
    const freshData = generateDemoData();
    setUser(freshData.user);
    setAppointments(freshData.appointments);
    setPrescriptions(freshData.prescriptions);
    setLabResults(freshData.labResults);
    setHealthSummary(freshData.healthSummary);
    setReferrals(freshData.referrals);
    setWaitingRoom(freshData.waitingRoom);
    setVisitHistory(freshData.visitHistory);
    setDocuments(freshData.documents);
    setNotifications(freshData.notifications);
  };

  const resetDemoData = () => {
    const freshData = generateDemoData();
    setUser(freshData.user);
    setAppointments(freshData.appointments);
    setPrescriptions(freshData.prescriptions);
    setLabResults(freshData.labResults);
    setHealthSummary(freshData.healthSummary);
    setReferrals(freshData.referrals);
    setWaitingRoom(freshData.waitingRoom);
    setVisitHistory(freshData.visitHistory);
    setDocuments(freshData.documents);
    setNotifications(freshData.notifications);
    setProfileImage(null);
    reset2FAState();
    createAuditLog('DEMO_DATA_RESET', { reason: 'User initiated reset' }, freshData.user?.email);
  };

  const handleLogin = (credentials) => {
    loadDemoData();
    setScreen('dashboard');
  };

  const handleCreateAccount = (profile) => {
    loadDemoData();
    setScreen('dashboard');
  };

  const handleSignOut = () => {
    setUser(null);
    setProfileImage(null);
    setAppointments([]);
    setPrescriptions([]);
    setLabResults([]);
    setHealthSummary(null);
    setReferrals([]);
    setWaitingRoom(null);
    setVisitHistory([]);
    setDocuments([]);
    setNotifications([]);
    setScreen('landing');
    reset2FAState();
    createAuditLog('USER_SIGN_OUT', { reason: 'User initiated' }, user?.email);
  };

  const startBookingFlow = (type) => {
    // Reset booking flow with all medical intake fields
    setBookingFlow({ 
      type, 
      reason: null, 
      kiosk: null, 
      dateTime: null, 
      getCareData: null,
      hipaaConsent: null,
      medicalHistory: null,
      medications: null,
      symptomsData: null,
      aiAssessment: null,
    });
    // Reset intake progress
    setIntakeProgress({
      consentCompleted: false,
      historyCompleted: false,
      medicationsCompleted: false,
      symptomsCompleted: false,
    });
    
    if (type === 'getCareNow') {
      // Start with HIPAA consent for Get Care Now flow
      setScreen('hipaaConsent');
    } else {
      setScreen('selectReason');
    }
  };

  const handleNavigate = (nav) => {
    // Map navigation to screens
    const navMap = {
      home: 'dashboard',
      care: 'care',
      kiosks: 'kiosks',
      records: 'records',
      profile: 'profile',
      dashboard: 'dashboard',
      appointments: 'appointments',
      pharmacy: 'pharmacy',
      labResults: 'labResults',
      documents: 'documents',
      settings: 'settings',
      notifications: 'notifications',
      getCareReason: 'getCareReason',
      selectReason: 'selectReason',
      eWaitingRoom: 'eWaitingRoom',
      referrals: 'referrals',
      visitHistory: 'visitHistory',
    };

    const targetScreen = navMap[nav] || nav;
    
    // Update active tab
    if (['home', 'care', 'kiosks', 'records', 'profile'].includes(nav)) {
      setActiveTab(nav);
    }

    // Check if protected
    if (PROTECTED_SCREENS.includes(targetScreen)) {
      navigateToProtectedScreen(targetScreen);
    } else {
      setScreen(targetScreen);
    }
  };

  const renderScreen = () => {
    switch (screen) {
      case 'landing':
        return (
          <LandingPage 
            onGetStarted={() => setScreen('createAccount')} 
            onSignIn={() => setScreen('login')}
            onFindKiosk={() => setScreen('kiosks')}
            onCheckWaitingRoom={() => setScreen('login')}
          />
        );
      case 'login':
        return (
          <LoginPage
            onBack={() => setScreen('landing')}
            onLogin={handleLogin}
            onForgotPin={() => {}}
            onCreateAccount={() => setScreen('createAccount')}
          />
        );
      case 'createAccount':
        return (
          <CreateAccountPage 
            onBack={() => setScreen('landing')} 
            onComplete={handleCreateAccount}
          />
        );
      case 'dashboard':
        return (
          <Dashboard
            user={user}
            appointments={appointments}
            prescriptions={prescriptions}
            labResults={labResults}
            waitingRoom={waitingRoom}
            onNavigate={handleNavigate}
            onGetCareNow={() => startBookingFlow('getCareNow')}
            onBookAppointment={() => startBookingFlow('bookAppointment')}
            onSettings={() => handleNavigate('settings')}
            onJoinWaitingRoom={() => {
              const nextApt = appointments.find(a => a.status !== 'Completed');
              if (nextApt) {
                setBookingFlow(prev => ({ 
                  ...prev, 
                  kiosk: { name: nextApt.location, address: nextApt.address },
                  getCareData: { symptoms: nextApt.reason, severity: 'Mild' }
                }));
                // Set waiting room when joining
                setWaitingRoom({
                  id: 'wr-' + Date.now(),
                  appointmentId: nextApt.id,
                  position: Math.floor(Math.random() * 3) + 1,
                  estimatedWait: Math.floor(Math.random() * 15) + 5,
                  status: 'waiting',
                  joinedAt: new Date().toISOString(),
                  kiosk: { name: nextApt.location, address: nextApt.address },
                  appointment: nextApt,
                });
                setScreen('waitingRoom');
              }
            }}
            onResumeWaitingRoom={() => setScreen('waitingRoom')}
            onFindKiosk={() => handleNavigate('kiosks')}
            onNotifications={() => handleNavigate('notifications')}
          />
        );
      
      // ============================================================================
      // HIPAA-COMPLIANT GET CARE FLOW
      // ============================================================================
      
      case 'hipaaConsent':
        return (
          <HIPAAConsentPage
            onBack={() => setScreen('dashboard')}
            onConsent={(consentData) => {
              setBookingFlow(prev => ({ ...prev, hipaaConsent: consentData }));
              setIntakeProgress(prev => ({ ...prev, consentCompleted: true }));
              createAuditLog('HIPAA_CONSENT_GIVEN', { consentVersion: '2.0' }, user?.email);
              setScreen('getCareReason');
            }}
            user={user}
          />
        );
      
      case 'medicalHistory':
        return (
          <MedicalHistoryPage
            onBack={() => setScreen('getCareReason')}
            onContinue={(historyData) => {
              setBookingFlow(prev => ({ ...prev, medicalHistory: historyData }));
              setIntakeProgress(prev => ({ ...prev, historyCompleted: true }));
              createAuditLog('MEDICAL_HISTORY_SUBMITTED', { hasConditions: historyData.conditions.length > 0 }, user?.email);
              setScreen('currentMedications');
            }}
            user={user}
            savedHistory={bookingFlow.medicalHistory}
          />
        );
      
      case 'currentMedications':
        return (
          <CurrentMedicationsPage
            onBack={() => setScreen('medicalHistory')}
            onContinue={(medicationsData) => {
              setBookingFlow(prev => ({ ...prev, medications: medicationsData }));
              setIntakeProgress(prev => ({ ...prev, medicationsCompleted: true }));
              createAuditLog('MEDICATIONS_SUBMITTED', { count: medicationsData.medications.length }, user?.email);
              setScreen('enhancedSymptoms');
            }}
            user={user}
            savedMedications={bookingFlow.medications?.medications}
          />
        );
      
      case 'enhancedSymptoms':
        return (
          <EnhancedSymptomsPage
            onBack={() => setScreen('currentMedications')}
            onContinue={(symptomsData) => {
              setBookingFlow(prev => ({ 
                ...prev, 
                symptomsData: symptomsData,
                getCareData: { ...prev.getCareData, ...symptomsData }
              }));
              setIntakeProgress(prev => ({ ...prev, symptomsCompleted: true }));
              createAuditLog('SYMPTOMS_SUBMITTED', { primarySymptom: symptomsData.primarySymptom }, user?.email);
              setScreen('enhancedAiPreDiagnosis');
            }}
          />
        );
      
      case 'enhancedAiPreDiagnosis':
        return (
          <EnhancedAIPreDiagnosisPage
            symptomsData={bookingFlow.symptomsData || bookingFlow.getCareData}
            medicalHistory={bookingFlow.medicalHistory}
            medications={bookingFlow.medications}
            answers={bookingFlow.getCareData?.answers}
            onBack={() => setScreen('enhancedSymptoms')}
            onContinue={(assessmentResult) => {
              setBookingFlow(prev => ({ ...prev, aiAssessment: assessmentResult }));
              createAuditLog('AI_ASSESSMENT_COMPLETED', { 
                priority: assessmentResult.priority,
                triageLevel: assessmentResult.triageLevel 
              }, user?.email);
              setScreen('selectKiosk');
            }}
            onEmergency={() => {
              createAuditLog('EMERGENCY_DETECTED', { action: 'user_directed_to_911' }, user?.email);
            }}
          />
        );
      
      case 'care':
        return (
          <CareScreen
            onGetCareNow={() => startBookingFlow('getCareNow')}
            onBookAppointment={() => startBookingFlow('bookAppointment')}
          />
        );
      case 'getCareReason':
        return (
          <GetCareReasonPage
            onBack={() => setScreen('hipaaConsent')}
            onSelect={(reason) => {
              setBookingFlow(prev => ({ ...prev, getCareData: { ...prev.getCareData, reason } }));
              // Routes that need full medical intake (sick, chronic)
              if (reason === 'sick' || reason === 'chronic') {
                setScreen('medicalHistory');
              } 
              // Routes that skip to symptoms (questions, followup)
              else if (reason === 'question' || reason === 'followup') {
                setScreen('enhancedSymptoms');
              }
              // Routes that go directly to kiosk (prescription, specialist)
              else {
                setBookingFlow(prev => ({ 
                  ...prev, 
                  getCareData: { ...prev.getCareData, reason, symptoms: 'General consultation', severity: 'Mild', answers: {} } 
                }));
                setScreen('selectKiosk');
              }
            }}
          />
        );
      case 'describeSymptoms':
        return (
          <DescribeSymptomsPage
            onBack={() => setScreen('getCareReason')}
            onContinue={(symptomsData) => {
              setBookingFlow(prev => ({ 
                ...prev, 
                getCareData: { ...prev.getCareData, ...symptomsData } 
              }));
              setScreen('quickQuestions');
            }}
          />
        );
      case 'quickQuestions':
        return (
          <QuickQuestionsPage
            onBack={() => setScreen('describeSymptoms')}
            onContinue={(answers) => {
              setBookingFlow(prev => ({ 
                ...prev, 
                getCareData: { ...prev.getCareData, answers } 
              }));
              setScreen('aiPreDiagnosis');
            }}
          />
        );
      case 'aiPreDiagnosis':
        return (
          <AIPreDiagnosisPage
            symptomsData={bookingFlow.getCareData}
            answers={bookingFlow.getCareData?.answers}
            onBack={() => setScreen('quickQuestions')}
            onContinue={() => setScreen('selectKiosk')}
          />
        );
      // Placeholder screens - will be fully implemented
      case 'selectReason':
      case 'selectKiosk':
        return (
          <KiosksListPage
            onBack={() => setScreen('dashboard')}
            onSelectKiosk={(kiosk) => {
              setBookingFlow(prev => ({ ...prev, kiosk }));
              setScreen('kioskDetails');
            }}
            onBookSlot={(kiosk) => {
              setBookingFlow(prev => ({ ...prev, kiosk }));
              setScreen('bookKioskVisit');
            }}
          />
        );
      case 'kiosks':
        return (
          <KiosksListPage
            onBack={() => setScreen('dashboard')}
            onSelectKiosk={(kiosk) => {
              setBookingFlow(prev => ({ ...prev, kiosk }));
              setScreen('kioskDetails');
            }}
            onBookSlot={(kiosk) => {
              setBookingFlow(prev => ({ ...prev, kiosk }));
              setScreen('bookKioskVisit');
            }}
          />
        );
      case 'kioskDetails':
        return (
          <KioskDetailsPage
            kiosk={bookingFlow.kiosk || KIOSKS[0]}
            onBack={() => setScreen('kiosks')}
            onBookSlot={(kiosk) => {
              setBookingFlow(prev => ({ ...prev, kiosk }));
              setScreen('bookKioskVisit');
            }}
            onWalkIn={(kiosk) => {
              setBookingFlow(prev => ({ ...prev, kiosk }));
              setScreen('kioskCheckIn');
            }}
            onGetDirections={() => {
              // Would open maps app in real implementation
              alert('Opening directions in maps...');
            }}
          />
        );
      case 'bookKioskVisit':
        return (
          <BookKioskSlotPage
            kiosk={bookingFlow.kiosk || KIOSKS[0]}
            user={user}
            bookingFlow={bookingFlow}
            onBack={() => setScreen('kioskDetails')}
            onUpdateBooking={(data) => setBookingFlow(prev => ({ ...prev, ...data }))}
            onConfirm={(appointmentData) => {
              setBookingFlow(prev => ({ ...prev, confirmedAppointment: appointmentData }));
              // Add to appointments list
              const newAppointment = {
                id: `APT-${Date.now()}`,
                type: appointmentData.reason?.title || 'General Visit',
                specialty: 'General',
                doctor: appointmentData.kiosk?.providers?.[0] || 'Provider TBD',
                reason: appointmentData.reason?.subtitle || '',
                status: 'Scheduled',
                date: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(appointmentData.date?.dayNum).padStart(2, '0')}`,
                time: appointmentData.time,
                location: appointmentData.kiosk?.name,
                address: appointmentData.kiosk?.address,
                kioskId: appointmentData.kiosk?.id,
                confirmationNumber: appointmentData.appointmentNumber,
                visitType: appointmentData.visitType === 'virtual' ? 'Virtual' : 'In-Person',
              };
              setAppointments(prev => [newAppointment, ...prev]);
              setScreen('kioskAppointmentConfirmed');
            }}
          />
        );
      case 'kioskAppointmentConfirmed':
        return (
          <AppointmentConfirmedPage
            appointment={bookingFlow.confirmedAppointment}
            onDone={() => {
              setBookingFlow({});
              setScreen('dashboard');
            }}
            onJoinWaitingRoom={() => {
              const apt = bookingFlow.confirmedAppointment;
              setWaitingRoom({
                isActive: true,
                queuePosition: Math.floor(Math.random() * 5) + 2,
                estimatedWait: apt?.kiosk?.wait || 15,
                kiosk: apt?.kiosk,
                joinedAt: new Date().toISOString(),
                appointmentType: apt?.reason?.title,
                reason: apt?.reason?.subtitle,
              });
              setScreen('eWaitingRoom');
            }}
            onViewAppointments={() => {
              setBookingFlow({});
              setScreen('appointments');
            }}
          />
        );
      case 'kioskCheckIn':
        return (
          <KioskCheckInPage
            appointment={bookingFlow.confirmedAppointment}
            kiosk={bookingFlow.kiosk || KIOSKS[0]}
            user={user}
            onBack={() => setScreen('kioskDetails')}
            onCheckInComplete={() => {
              setScreen('dashboard');
            }}
            onStartVisit={() => {
              setScreen('virtualVisit');
            }}
          />
        );
      case 'virtualVisit':
        return (
          <VirtualVisitPage
            appointment={bookingFlow.confirmedAppointment}
            user={user}
            onBack={() => setScreen('kioskCheckIn')}
            onEndVisit={() => {
              setScreen('visitSummaryComplete');
            }}
          />
        );
      case 'visitSummaryComplete':
        return (
          <div className="min-h-screen bg-gray-50 p-4">
            <div className="max-w-lg mx-auto space-y-6 text-center pt-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Visit Complete!</h1>
              <p className="text-gray-500">Your visit summary will be available in your records shortly.</p>
              <Card className="p-4 text-left">
                <h3 className="font-semibold mb-3">What's Next?</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Visit summary sent to your email</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Any prescriptions sent to your pharmacy</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Lab orders (if any) sent to nearest lab</li>
                  <li className="flex items-center gap-2"><Check className="w-4 h-4 text-green-500" /> Follow-up appointment can be booked</li>
                </ul>
              </Card>
              <Button size="lg" className="w-full" onClick={() => setScreen('dashboard')}>
                Return to Dashboard
              </Button>
            </div>
          </div>
        );
      case 'selectDateTime':
      case 'reviewAppointment':
      case 'appointmentConfirmed':
      case 'waitingRoom':
        return (
          <EWaitingRoomPage
            waitingRoom={waitingRoom}
            onUpdateWaitingRoom={setWaitingRoom}
            appointments={appointments}
            bookingFlow={bookingFlow}
            onBack={() => setScreen('dashboard')}
            onLeaveQueue={() => {
              setWaitingRoom(null);
              setScreen('dashboard');
            }}
            onCheckIn={() => {
              // Handle check-in completion
              createAuditLog('KIOSK_CHECK_IN', { kioskId: waitingRoom?.kiosk?.id }, user?.email);
            }}
            onBackToHome={() => {
              setWaitingRoom(null);
              setScreen('dashboard');
            }}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            settings={settings}
            onUpdateSettings={setSettings}
            onResetDemoData={resetDemoData}
            onSignOut={handleSignOut}
            onBack={() => setScreen('dashboard')}
          />
        );
      case 'eWaitingRoom':
        return (
          <EWaitingRoomPage
            waitingRoom={waitingRoom}
            onUpdateWaitingRoom={setWaitingRoom}
            appointments={appointments}
            bookingFlow={bookingFlow}
            onBack={() => setScreen('dashboard')}
            onLeaveQueue={() => {
              setWaitingRoom(null);
              setScreen('dashboard');
            }}
            onCheckIn={() => {
              createAuditLog('KIOSK_CHECK_IN', { kioskId: waitingRoom?.kiosk?.id }, user?.email);
            }}
            onBackToHome={() => {
              setWaitingRoom(null);
              setScreen('dashboard');
            }}
          />
        );
      case 'referrals':
        return (
          <ReferralsPage
            referrals={referrals}
            onBack={() => setScreen('dashboard')}
          />
        );
      case 'visitHistory':
        return (
          <VisitHistoryPage
            visits={visitHistory}
            onBack={() => setScreen('dashboard')}
          />
        );
      case 'checkIn':
      case 'appointments':
      case 'pharmacy':
      case 'labResults':
      case 'profile':
      case 'editProfile':
      case 'emergencyContacts':
      case 'records':
      case 'documents':
      case 'notifications':
        return <PlaceholderScreen title={SCREEN_NAMES[screen] || screen} onBack={() => setScreen('dashboard')} />;
      default:
        return <LandingPage onGetStarted={() => setScreen('createAccount')} onSignIn={() => setScreen('login')} />;
    }
  };

  // Determine if we should show the app shell
  const noShellScreens = ['landing', 'login', 'createAccount', 'newPatientOnboarding', 'virtualVisit'];
  const showAppShell = user && !noShellScreens.includes(screen);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .active\\:scale-98:active { transform: scale(0.98); }
      `}</style>

      {showAppShell ? (
        <AppShell
          user={user}
          activeTab={activeTab}
          screen={screen}
          bookingFlow={bookingFlow}
          onNavigate={handleNavigate}
          onSignOut={handleSignOut}
          twoFASession={twoFactorAuth}
        >
          {renderScreen()}
        </AppShell>
      ) : (
        renderScreen()
      )}

      {/* 2FA Modal */}
      <TwoFactorAuthModal
        isOpen={show2FAModal}
        onClose={() => {
          setShow2FAModal(false);
          setTwoFactorAuth(prev => ({ ...prev, pendingScreen: null }));
        }}
        onVerify={handle2FAVerification}
        user={user}
        targetScreen={twoFactorAuth.pendingScreen}
        verificationMethod={twoFactorAuth.verificationMethod}
        setVerificationMethod={(method) => setTwoFactorAuth(prev => ({ ...prev, verificationMethod: method }))}
        attemptsRemaining={twoFactorAuth.attemptsRemaining}
        isLocked={twoFactorAuth.isLocked}
        lockoutEndTime={twoFactorAuth.lockoutEndTime}
      />

      {/* PIN Verification Modal */}
      <PinVerificationModal
        isOpen={pinVerification.showModal}
        onClose={closePinModal}
        onVerify={handlePinVerification}
        documentName={pinVerification.documentName}
        documentType={pinVerification.documentType}
        attemptsRemaining={pinVerification.attemptsRemaining}
        isLocked={pinVerification.isLocked}
        lockoutEndTime={pinVerification.lockoutEndTime}
        user={user}
      />
    </>
  );
}
