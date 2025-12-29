import React, { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Monitor, Activity, Thermometer, Heart, CheckCircle, 
  User, Calendar, QrCode, Mic, Video, PhoneOff, 
  ArrowRight, ShieldCheck, ChevronRight, Stethoscope, AlertCircle,
  CreditCard, UserCheck, ArrowLeft, Fingerprint, Waves, Sparkles,
  Clock, MapPin, Pill, FileText, Volume2, VolumeX,
  Scale, Zap, Droplets, Wind, Globe, Eye, Phone,
  PlayCircle, MessageSquare, ClipboardList, Beaker, 
  Building2, Syringe, RefreshCw, Languages, Type, HelpCircle,
  AlertTriangle, SprayCan, X, Check, ChevronDown, Volume1, Volume
} from 'lucide-react';

// ============================================================================
// DESIGN SYSTEM & CONSTANTS
// ============================================================================

const STEPS = {
  WELCOME: 1,
  IDENTITY: 2,
  CONFIRMATION: 3,
  TUTORIAL: 4,        // Welcome tutorial step
  ACCESSIBILITY: 5,   // Accessibility settings step
  AI_TRIAGE: 6,       // AI triage intake step
  AI_PREDIAGNOSIS: 7, // AI pre-diagnosis step
  VITALS: 8,
  VIDEO_CALL: 9,
  SANITIZATION: 10,   // Sanitization prompt step
  SUMMARY: 11
};

const CHECK_IN_METHODS = {
  QR: 'qr',
  APPOINTMENT: 'appt',
  DOB: 'dob',
  NEW: 'new'
};

const SERVICE_TYPES = {
  GENERAL: 'general',
  CHRONIC: 'chronic',
  PRESCRIPTION: 'prescription',
  SPECIALIST: 'specialist'
};

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
];

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

const useTimer = (duration, onComplete) => {
  const [progress, setProgress] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    if (!isRunning) return;
    
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setIsRunning(false);
          onComplete?.();
          return 100;
        }
        return prev + (100 / (duration / 50));
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isRunning, duration, onComplete]);

  const start = useCallback(() => {
    setProgress(0);
    setIsRunning(true);
  }, []);

  const reset = useCallback(() => {
    setProgress(0);
    setIsRunning(false);
  }, []);

  return { progress, isRunning, start, reset };
};

// Speech synthesis hook for voice guidance
const useSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voices, setVoices] = useState([]);
  const synthRef = useRef(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      synthRef.current = window.speechSynthesis;
      
      // Load voices
      const loadVoices = () => {
        const availableVoices = synthRef.current.getVoices();
        setVoices(availableVoices);
      };
      
      loadVoices();
      synthRef.current.onvoiceschanged = loadVoices;
    }
    
    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Process text to fix pronunciation of KIOSK as "kee-osk"
  const processText = (text) => {
    // Replace KIOSK/Kiosk/kiosk with phonetic pronunciation
    return text
      .replace(/ExtendiKIOSK/gi, 'Extendi Kee-osk')
      .replace(/KIOSK/gi, 'Kee-osk')
      .replace(/Kiosk/gi, 'Kee-osk')
      .replace(/kiosk/gi, 'kee-osk');
  };

  // Find the best female voice for the given language
  const getFemaleVoice = (lang, availableVoices) => {
    const langCode = lang?.split('-')[0] || 'en';
    
    // Common female voice names/identifiers across different browsers and systems
    const femaleIndicators = [
      'female', 'woman', 'samantha', 'victoria', 'karen', 'moira', 'tessa',
      'fiona', 'veena', 'alex', 'allison', 'ava', 'susan', 'zira', 'hazel',
      'heather', 'helena', 'catherine', 'linda', 'elizabeth', 'google us english',
      'microsoft zira', 'microsoft hazel', 'google uk english female'
    ];
    
    // Filter voices for the target language
    const langVoices = availableVoices.filter(v => 
      v.lang.toLowerCase().startsWith(langCode.toLowerCase())
    );
    
    // Try to find a female voice
    const femaleVoice = langVoices.find(v => {
      const nameLower = v.name.toLowerCase();
      return femaleIndicators.some(indicator => nameLower.includes(indicator));
    });
    
    if (femaleVoice) return femaleVoice;
    
    // If no explicit female voice found, prefer voices that are NOT male
    const maleIndicators = ['male', 'man', 'david', 'daniel', 'james', 'mark', 'thomas', 'george'];
    const nonMaleVoice = langVoices.find(v => {
      const nameLower = v.name.toLowerCase();
      return !maleIndicators.some(indicator => nameLower.includes(indicator));
    });
    
    if (nonMaleVoice) return nonMaleVoice;
    
    // Fallback to any voice in the language
    return langVoices[0] || availableVoices[0];
  };

  const speak = useCallback((text, options = {}) => {
    if (!synthRef.current) return;
    
    // Cancel any ongoing speech
    synthRef.current.cancel();
    
    // Process text for correct pronunciation
    const processedText = processText(text);
    
    const utterance = new SpeechSynthesisUtterance(processedText);
    utterance.volume = options.volume ?? 0.8;
    utterance.rate = options.rate ?? 1.0;
    utterance.pitch = options.pitch ?? 1.1; // Slightly higher pitch for female voice
    utterance.lang = options.lang ?? 'en-US';
    
    // Get preferred female voice
    const femaleVoice = getFemaleVoice(options.lang, voices);
    if (femaleVoice) {
      utterance.voice = femaleVoice;
    }
    
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    synthRef.current.speak(utterance);
  }, [voices]);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  return { speak, stop, isSpeaking, voices };
};

// Helper function for quick announcements with female voice and correct pronunciation
const quickSpeak = (text, volume = 0.8, rate = 1.0) => {
  if (!window.speechSynthesis) return;
  
  // Process text for correct KIOSK pronunciation
  const processedText = text
    .replace(/ExtendiKIOSK/gi, 'Extendi Kee-osk')
    .replace(/KIOSK/gi, 'Kee-osk')
    .replace(/Kiosk/gi, 'Kee-osk')
    .replace(/kiosk/gi, 'kee-osk');
  
  const utterance = new SpeechSynthesisUtterance(processedText);
  utterance.volume = volume;
  utterance.rate = rate;
  utterance.pitch = 1.1;
  utterance.lang = 'en-US';
  
  // Try to find a female voice
  const voices = window.speechSynthesis.getVoices();
  const femaleIndicators = [
    'female', 'woman', 'samantha', 'victoria', 'karen', 'moira', 'tessa',
    'fiona', 'veena', 'allison', 'ava', 'susan', 'zira', 'hazel',
    'heather', 'helena', 'catherine', 'linda', 'elizabeth', 'google us english',
    'microsoft zira', 'microsoft hazel'
  ];
  
  const femaleVoice = voices.find(v => {
    const nameLower = v.name.toLowerCase();
    return v.lang.startsWith('en') && femaleIndicators.some(ind => nameLower.includes(ind));
  });
  
  if (femaleVoice) {
    utterance.voice = femaleVoice;
  }
  
  window.speechSynthesis.speak(utterance);
};

// ============================================================================
// ANIMATED BACKGROUND COMPONENT
// ============================================================================

const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    {/* Base gradient */}
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/20" />
    
    {/* Floating orbs */}
    <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl animate-pulse" 
         style={{ animationDuration: '8s' }} />
    <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-pulse" 
         style={{ animationDuration: '10s', animationDelay: '2s' }} />
    <div className="absolute top-3/4 left-1/3 w-64 h-64 bg-violet-200/10 rounded-full blur-3xl animate-pulse" 
         style={{ animationDuration: '12s', animationDelay: '4s' }} />
    
    {/* Subtle grid pattern */}
    <div className="absolute inset-0 opacity-[0.015]"
         style={{
           backgroundImage: `
             linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
             linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)
           `,
           backgroundSize: '60px 60px'
         }} />
  </div>
);

// ============================================================================
// SHARED COMPONENTS
// ============================================================================

const ActionButton = ({ onClick, title, subtitle, icon: Icon, variant = 'blue', disabled = false }) => {
  const variants = {
    blue: {
      border: 'border-blue-100 hover:border-blue-400',
      shadow: 'hover:shadow-blue-100/50',
      icon: 'bg-gradient-to-br from-blue-500 to-blue-600 text-white',
      iconHover: 'group-hover:scale-110 group-hover:rotate-3'
    },
    emerald: {
      border: 'border-emerald-100 hover:border-emerald-400',
      shadow: 'hover:shadow-emerald-100/50',
      icon: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white',
      iconHover: 'group-hover:scale-110 group-hover:-rotate-3'
    },
    violet: {
      border: 'border-violet-100 hover:border-violet-400',
      shadow: 'hover:shadow-violet-100/50',
      icon: 'bg-gradient-to-br from-violet-500 to-purple-600 text-white',
      iconHover: 'group-hover:scale-110 group-hover:rotate-3'
    },
    amber: {
      border: 'border-amber-100 hover:border-amber-400',
      shadow: 'hover:shadow-amber-100/50',
      icon: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white',
      iconHover: 'group-hover:scale-110 group-hover:-rotate-3'
    },
    rose: {
      border: 'border-rose-100 hover:border-rose-400',
      shadow: 'hover:shadow-rose-100/50',
      icon: 'bg-gradient-to-br from-rose-500 to-pink-600 text-white',
      iconHover: 'group-hover:scale-110 group-hover:rotate-3'
    },
    cyan: {
      border: 'border-cyan-100 hover:border-cyan-400',
      shadow: 'hover:shadow-cyan-100/50',
      icon: 'bg-gradient-to-br from-cyan-500 to-teal-600 text-white',
      iconHover: 'group-hover:scale-110 group-hover:-rotate-3'
    }
  };

  const v = variants[variant];

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`
        group relative flex items-center p-5 rounded-2xl border-2 bg-white/80 backdrop-blur-sm
        shadow-sm transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-xl w-full text-left
        ${v.border} ${v.shadow}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
      `}
      aria-label={`${title}: ${subtitle}`}
    >
      <div className={`
        p-4 rounded-xl mr-5 transition-all duration-300 shadow-lg
        ${v.icon} ${v.iconHover}
      `}>
        <Icon className="w-7 h-7" strokeWidth={1.5} />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold text-slate-800 mb-0.5 tracking-tight">{title}</h3>
        <p className="text-sm text-slate-500 truncate">{subtitle}</p>
      </div>
      <div className="ml-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
        <ChevronRight className="w-5 h-5 text-slate-400" />
      </div>
    </button>
  );
};

const PrimaryButton = ({ onClick, disabled, children, variant = 'blue', className = '' }) => {
  const variants = {
    blue: 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-blue-500/25',
    emerald: 'bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 shadow-emerald-500/25',
    red: 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 shadow-red-500/25',
    slate: 'bg-gradient-to-r from-slate-800 to-slate-900 hover:from-slate-900 hover:to-black shadow-slate-500/25',
    violet: 'bg-gradient-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 shadow-violet-500/25',
    amber: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-amber-500/25'
  };

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        text-white font-semibold py-4 px-8 rounded-xl
        shadow-lg transition-all duration-200
        transform active:scale-[0.98]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        flex items-center justify-center gap-2
        ${className}
      `}
    >
      {children}
    </button>
  );
};

const SecondaryButton = ({ onClick, children, className = '' }) => (
  <button 
    onClick={onClick}
    className={`
      px-6 py-4 rounded-xl border-2 border-slate-200 
      text-slate-600 font-semibold
      hover:bg-slate-50 hover:border-slate-300
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400
      flex items-center gap-2
      ${className}
    `}
  >
    {children}
  </button>
);

const Card = ({ children, className = '', padding = 'p-8' }) => (
  <div className={`
    bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl 
    border border-slate-200/50
    ${padding} ${className}
  `}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'blue' }) => {
  const variants = {
    blue: 'bg-blue-100 text-blue-700 border-blue-200',
    emerald: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-100 text-amber-700 border-amber-200',
    slate: 'bg-slate-100 text-slate-700 border-slate-200',
    violet: 'bg-violet-100 text-violet-700 border-violet-200',
    rose: 'bg-rose-100 text-rose-700 border-rose-200'
  };

  return (
    <span className={`
      inline-flex items-center px-3 py-1 rounded-full 
      text-xs font-bold uppercase tracking-wider border
      ${variants[variant]}
    `}>
      {children}
    </span>
  );
};

// Toggle Switch Component
const ToggleSwitch = ({ enabled, onChange, label }) => (
  <button
    onClick={() => onChange(!enabled)}
    className="flex items-center gap-3 group toggle-switch"
    role="switch"
    aria-checked={enabled}
  >
    <div className={`
      relative w-14 h-8 rounded-full transition-colors duration-200
      ${enabled ? 'bg-blue-600 toggle-enabled' : 'bg-slate-300 toggle-disabled'}
    `}>
      <div className={`
        absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-200 toggle-knob
        ${enabled ? 'translate-x-7' : 'translate-x-1'}
      `} />
    </div>
    <span className="text-slate-700 font-medium group-hover:text-slate-900">{label}</span>
  </button>
);

// Progress indicator
const StepIndicator = ({ currentStep, totalSteps = 10, highContrast = false }) => (
  <div className="flex items-center gap-2">
    {Array.from({ length: totalSteps }, (_, i) => {
      const stepNum = i + 1;
      const isActive = currentStep === stepNum;
      const isComplete = currentStep > stepNum;
      
      return (
        <div
          key={stepNum}
          className={`
            h-2 rounded-full transition-all duration-500 ease-out
            ${highContrast 
              ? (isActive ? 'w-8 bg-yellow-400' : isComplete ? 'w-2 bg-green-400' : 'w-2 bg-gray-600')
              : (isActive ? 'w-8 bg-blue-600' : isComplete ? 'w-2 bg-emerald-500' : 'w-2 bg-slate-300')
            }
          `}
          role="progressbar"
          aria-valuenow={isActive ? 1 : 0}
          aria-label={`Step ${stepNum}`}
        />
      );
    })}
  </div>
);

// Emergency Call Modal
const EmergencyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl animate-in zoom-in-95 duration-300">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Phone className="w-10 h-10 text-red-600 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Emergency Assistance</h2>
          <p className="text-slate-600 mb-6">
            If you are experiencing a medical emergency, please call 911 immediately or press the button below.
          </p>
          
          <div className="space-y-3">
            <button className="w-full py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
              <Phone className="w-5 h-5" />
              Call 911 Now
            </button>
            <button className="w-full py-4 bg-amber-500 text-white font-bold rounded-xl hover:bg-amber-600 transition-colors">
              Call On-Site Staff
            </button>
            <button 
              onClick={onClose}
              className="w-full py-3 text-slate-600 font-medium hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// SCREEN COMPONENTS
// ============================================================================

const WelcomeScreen = ({ onSelect, voiceSettings, onEnableVoice, onOpenAccessibility }) => {
  const { speak, stop } = useSpeech();

  // Speak welcome message on mount if voice is enabled
  useEffect(() => {
    if (voiceSettings?.voiceGuidance) {
      setTimeout(() => {
        speak("Welcome to ExtendiKIOSK. Skip the ER and get care in minutes. Please select how you'd like to check in today. You can scan your QR code, enter your appointment number, search by date of birth, or use manual lookup. For accessibility options including voice guidance, language selection, and high contrast mode, tap the Accessibility Options button at the bottom of the screen.", {
          volume: voiceSettings.voiceVolume,
          rate: voiceSettings.voiceRate,
          lang: voiceSettings.language?.code === 'en' ? 'en-US' : voiceSettings.language?.code
        });
      }, 500);
    }
    return () => stop();
  }, [voiceSettings?.voiceGuidance]);

  // Quick enable voice function
  const handleQuickEnableVoice = () => {
    if (onEnableVoice) {
      onEnableVoice();
      // Announce with female voice and correct pronunciation
      quickSpeak("Voice guidance is now enabled. Welcome to ExtendiKIOSK. Please select a check-in method to begin.");
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full mb-6 border border-blue-100">
          <ShieldCheck className="w-4 h-4" />
          <span className="font-semibold text-sm tracking-wide">PHIPA/HIPAA Secure • End-to-End Encrypted</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
          Welcome to ExtendiKIOSK
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed">
          Skip the ER. Get care in minutes. Select how you'd like to check in today.
        </p>
      </div>

      {/* Check-in Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto w-full">
        <ActionButton 
          title="Scan QR Code" 
          subtitle="Use your appointment confirmation" 
          icon={QrCode} 
          onClick={() => onSelect(CHECK_IN_METHODS.QR)} 
          variant="blue"
        />
        <ActionButton 
          title="Appointment Number" 
          subtitle="Enter your confirmation code" 
          icon={Calendar} 
          onClick={() => onSelect(CHECK_IN_METHODS.APPOINTMENT)} 
          variant="violet"
        />
        <ActionButton 
          title="Date of Birth" 
          subtitle="Search using your DOB" 
          icon={Fingerprint} 
          onClick={() => onSelect(CHECK_IN_METHODS.DOB)} 
          variant="emerald"
        />
        <ActionButton 
          title="Phone Dead? Manual Lookup" 
          subtitle="Use on-screen search" 
          icon={CreditCard} 
          onClick={() => onSelect(CHECK_IN_METHODS.NEW)} 
          variant="amber"
        />
      </div>

      {/* Accessibility Options Section */}
      <div className="mt-auto pt-8">
        {/* Quick accessibility bar */}
        <div className="max-w-4xl mx-auto w-full">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-violet-100 text-violet-600 rounded-xl flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <div className="text-center sm:text-left">
                  <p className="font-semibold text-slate-800">Need Accessibility Options?</p>
                  <p className="text-sm text-slate-500">Voice guidance, large text, high contrast & more</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                {/* Quick Voice Enable Button */}
                {!voiceSettings?.voiceGuidance && (
                  <button
                    onClick={handleQuickEnableVoice}
                    className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
                    aria-label="Enable voice guidance"
                  >
                    <Volume2 className="w-5 h-5" />
                    <span>Enable Voice</span>
                  </button>
                )}
                
                {/* All Accessibility Options Button */}
                <button
                  onClick={onOpenAccessibility}
                  className="flex items-center gap-2 px-4 py-2.5 bg-violet-600 text-white rounded-xl font-semibold hover:bg-violet-700 transition-all shadow-md hover:shadow-lg"
                  aria-label="Open accessibility settings"
                >
                  <Globe className="w-5 h-5" />
                  <span>Accessibility Options</span>
                </button>
              </div>
            </div>
          </div>

          {/* Help text */}
          <p className="text-sm text-slate-400 text-center">
            Need assistance? Press the <kbd className="px-2 py-1 bg-slate-100 rounded text-slate-600 font-mono text-xs">Help</kbd> button or use the <kbd className="px-2 py-1 bg-red-100 rounded text-red-600 font-mono text-xs">Emergency</kbd> button above
          </p>
        </div>
      </div>
    </div>
  );
};

const IdentityScreen = ({ method, onVerify, onCancel, voiceSettings }) => {
  const [inputValue, setInputValue] = useState('');
  const [isScanning, setIsScanning] = useState(method === CHECK_IN_METHODS.QR);
  const [scanComplete, setScanComplete] = useState(false);
  const [formData, setFormData] = useState({ firstName: '', lastName: '', dob: '' });
  const [dobFormData, setDobFormData] = useState({ firstName: '', lastName: '', dob: '' });
  const { speak, stop } = useSpeech();

  // Voice guidance for identity verification
  useEffect(() => {
    if (voiceSettings?.voiceGuidance) {
      const messages = {
        [CHECK_IN_METHODS.QR]: "QR Code Verification. Please position your appointment QR code in front of the camera. The scanner is now active.",
        [CHECK_IN_METHODS.APPOINTMENT]: "Appointment Number Verification. Please enter your appointment confirmation number using the keypad below.",
        [CHECK_IN_METHODS.DOB]: "Date of Birth Verification. Please enter your first name, last name, and date of birth to locate your medical records.",
        [CHECK_IN_METHODS.NEW]: "Manual Lookup. Please enter your first name, last name, and date of birth to create or find your profile."
      };
      
      setTimeout(() => {
        speak(messages[method] || "Identity Verification. Please complete the form below.", {
          volume: voiceSettings.voiceVolume,
          rate: voiceSettings.voiceRate,
          lang: voiceSettings.language?.code === 'en' ? 'en-US' : voiceSettings.language?.code
        });
      }, 500);
    }
    return () => stop();
  }, [method, voiceSettings?.voiceGuidance]);

  // Announce scan completion
  useEffect(() => {
    if (scanComplete && voiceSettings?.voiceGuidance) {
      speak("QR code scanned successfully! Your identity has been verified. Tap Continue to proceed.", {
        volume: voiceSettings.voiceVolume,
        rate: voiceSettings.voiceRate,
        lang: voiceSettings.language?.code === 'en' ? 'en-US' : voiceSettings.language?.code
      });
    }
  }, [scanComplete, voiceSettings?.voiceGuidance]);

  // Simulate QR scanning
  useEffect(() => {
    if (method === CHECK_IN_METHODS.QR && isScanning) {
      const timer = setTimeout(() => {
        setIsScanning(false);
        setScanComplete(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [method, isScanning]);

  const handleVerify = () => {
    const profiles = {
      [CHECK_IN_METHODS.QR]: { name: "John Doe", dob: "01/12/1985", id: "P-99281", appointmentNo: "APT-88291", method: "QR Code Verified" },
      [CHECK_IN_METHODS.APPOINTMENT]: { name: "Sarah Connor", dob: "05/20/1990", id: "P-11202", appointmentNo: `APT-${inputValue || '88291'}`, method: "Appointment Number" },
      [CHECK_IN_METHODS.DOB]: { 
        name: `${dobFormData.firstName || 'Unknown'} ${dobFormData.lastName || 'Patient'}`, 
        dob: dobFormData.dob || "N/A", 
        id: "P-33211", 
        appointmentNo: "APT-" + Math.floor(10000 + Math.random() * 90000),
        method: "Profile Match (DOB Verification)" 
      },
      [CHECK_IN_METHODS.NEW]: { 
        name: `${formData.firstName || 'New'} ${formData.lastName || 'Patient'}`, 
        dob: formData.dob || "Pending", 
        id: "TEMP-" + Math.floor(Math.random() * 1000), 
        appointmentNo: "APT-" + Math.floor(10000 + Math.random() * 90000),
        method: "Manual Lookup" 
      }
    };
    onVerify(profiles[method]);
  };

  const canProceed = () => {
    if (method === CHECK_IN_METHODS.QR) return scanComplete;
    if (method === CHECK_IN_METHODS.NEW) return formData.firstName && formData.lastName;
    if (method === CHECK_IN_METHODS.DOB) return dobFormData.firstName && dobFormData.lastName && dobFormData.dob;
    return true;
  };

  const titles = {
    [CHECK_IN_METHODS.QR]: { title: "Scan Your QR Code", desc: "Position the code from your confirmation email in front of the scanner" },
    [CHECK_IN_METHODS.APPOINTMENT]: { title: "Enter Appointment Number", desc: "Type the confirmation code sent to your phone or email" },
    [CHECK_IN_METHODS.DOB]: { title: "Date of Birth Verification", desc: "Enter your name and date of birth to locate your medical records" },
    [CHECK_IN_METHODS.NEW]: { title: "Manual Profile Lookup", desc: "Enter your details to find your appointment" }
  };

  return (
    <div className="flex flex-col h-full items-center justify-center animate-in fade-in slide-in-from-right-4 duration-500 max-w-xl mx-auto w-full">
      <h2 className="text-3xl font-bold text-slate-900 mb-2 text-center">{titles[method].title}</h2>
      <p className="text-slate-500 mb-8 text-center">{titles[method].desc}</p>

      <Card className="w-full mb-8">
        {/* QR Scanner */}
        {method === CHECK_IN_METHODS.QR && (
          <div className="flex flex-col items-center py-6">
            <div className="relative w-56 h-56 bg-slate-900 rounded-2xl overflow-hidden mb-6 ring-4 ring-slate-200">
              {!scanComplete ? (
                <>
                  <QrCode className="absolute inset-0 m-auto w-24 h-24 text-slate-700 opacity-30" />
                  {/* Scanning line animation */}
                  <div 
                    className="absolute left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-lg shadow-emerald-500/50"
                    style={{
                      animation: 'scan 2s ease-in-out infinite'
                    }}
                  />
                  {/* Corner brackets */}
                  <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-emerald-500" />
                  <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-emerald-500" />
                  <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-emerald-500" />
                  <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-emerald-500" />
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-emerald-600">
                  <CheckCircle className="w-20 h-20 text-white animate-in zoom-in duration-300" />
                </div>
              )}
            </div>
            <p className="text-lg font-semibold text-slate-700">
              {scanComplete ? "Code Verified!" : "Scanning..."}
            </p>
            {!scanComplete && (
              <p className="text-sm text-slate-400 mt-1">Hold your device steady</p>
            )}
          </div>
        )}

        {/* Appointment ID Input */}
        {method === CHECK_IN_METHODS.APPOINTMENT && (
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-slate-600 uppercase tracking-wider">
              Confirmation Number
            </label>
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value.replace(/\D/g, '').slice(0, 8))}
              placeholder="00000000"
              className="
                w-full text-4xl md:text-5xl p-6 text-center tracking-[0.3em]
                border-2 border-slate-200 rounded-xl
                focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                outline-none transition-all font-mono text-slate-800 
                placeholder:text-slate-200
              "
              autoFocus
              maxLength={8}
              inputMode="numeric"
              aria-label="Enter your 8-digit appointment confirmation number"
            />
          </div>
        )}

        {/* DOB Verification Form */}
        {method === CHECK_IN_METHODS.DOB && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">First Name</label>
                <input 
                  type="text"
                  value={dobFormData.firstName}
                  onChange={(e) => setDobFormData(f => ({ ...f, firstName: e.target.value }))}
                  className="
                    w-full text-lg p-4 border-2 border-slate-200 rounded-xl
                    focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                    outline-none transition-all
                  "
                  placeholder="John"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Last Name</label>
                <input 
                  type="text"
                  value={dobFormData.lastName}
                  onChange={(e) => setDobFormData(f => ({ ...f, lastName: e.target.value }))}
                  className="
                    w-full text-lg p-4 border-2 border-slate-200 rounded-xl
                    focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                    outline-none transition-all
                  "
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Date of Birth</label>
              <input 
                type="date"
                value={dobFormData.dob}
                onChange={(e) => setDobFormData(f => ({ ...f, dob: e.target.value }))}
                className="
                  w-full text-lg p-4 border-2 border-slate-200 rounded-xl
                  focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                  outline-none transition-all text-slate-800
                "
                aria-label="Enter your date of birth"
              />
            </div>
          </div>
        )}

        {/* Manual Lookup Form */}
        {method === CHECK_IN_METHODS.NEW && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">First Name</label>
                <input 
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData(f => ({ ...f, firstName: e.target.value }))}
                  className="
                    w-full text-lg p-4 border-2 border-slate-200 rounded-xl
                    focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                    outline-none transition-all
                  "
                  placeholder="Jane"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 mb-2">Last Name</label>
                <input 
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData(f => ({ ...f, lastName: e.target.value }))}
                  className="
                    w-full text-lg p-4 border-2 border-slate-200 rounded-xl
                    focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                    outline-none transition-all
                  "
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 mb-2">Date of Birth</label>
              <input 
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData(f => ({ ...f, dob: e.target.value }))}
                className="
                  w-full text-lg p-4 border-2 border-slate-200 rounded-xl
                  focus:border-blue-500 focus:ring-4 focus:ring-blue-100
                  outline-none transition-all
                "
              />
            </div>
          </div>
        )}
      </Card>

      <div className="w-full flex gap-4">
        <SecondaryButton onClick={onCancel}>
          Cancel
        </SecondaryButton>
        <PrimaryButton 
          onClick={handleVerify}
          disabled={!canProceed()}
          className="flex-1"
        >
          {method === CHECK_IN_METHODS.QR && !scanComplete ? "Waiting for Code..." : "Verify Identity"}
          {canProceed() && <ArrowRight className="w-5 h-5" />}
        </PrimaryButton>
      </div>

      {/* CSS for scan animation */}
      <style>{`
        @keyframes scan {
          0%, 100% { top: 10%; }
          50% { top: 85%; }
        }
      `}</style>
    </div>
  );
};

const ConfirmationScreen = ({ profile, onConfirm, onBack, voiceSettings }) => {
  const { speak, stop } = useSpeech();

  // Voice guidance for profile confirmation
  useEffect(() => {
    if (voiceSettings?.voiceGuidance) {
      setTimeout(() => {
        speak(`Profile found! We found your record. Your name is ${profile?.name || 'Guest'}. Date of birth: ${profile?.dob || 'Not available'}. Appointment number: ${profile?.appointmentNo || 'Not available'}. Please confirm this information matches your identity. Tap Confirm and Continue if correct, or tap Not Me to go back.`, {
          volume: voiceSettings.voiceVolume,
          rate: voiceSettings.voiceRate,
          lang: voiceSettings.language?.code === 'en' ? 'en-US' : voiceSettings.language?.code
        });
      }, 500);
    }
    return () => stop();
  }, [voiceSettings?.voiceGuidance, profile]);

  return (
    <div className="flex flex-col h-full items-center justify-center animate-in fade-in slide-in-from-right-4 duration-500 max-w-xl mx-auto w-full">
      {/* Success indicator */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-xl animate-pulse" />
        <div className="relative bg-gradient-to-br from-emerald-500 to-teal-600 p-5 rounded-full text-white shadow-lg">
          <UserCheck className="w-12 h-12" />
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-slate-900 mb-2">Profile Found</h2>
      <p className="text-slate-500 mb-8 text-center">Please confirm this information matches your identity</p>

      <Card className="w-full mb-8 overflow-hidden" padding="p-0">
        {/* Card Header */}
        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
          <span className="font-semibold text-slate-500 text-sm uppercase tracking-wider">Patient Record</span>
          <div className="flex items-center gap-2">
            <Badge variant="blue">{profile?.id || 'N/A'}</Badge>
          </div>
        </div>
        
        {/* Card Body */}
        <div className="p-6">
          <div className="flex items-center gap-5 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center text-slate-500 shadow-inner">
              <User className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{profile?.name || 'Guest'}</h3>
              <p className="text-slate-500">DOB: {profile?.dob || 'N/A'}</p>
            </div>
          </div>

          {/* Appointment Number */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 mb-4">
            <Calendar className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-800 font-semibold text-sm">Appointment Number</p>
              <p className="text-blue-700 text-sm font-mono">{profile?.appointmentNo || 'N/A'}</p>
            </div>
          </div>
          
          {/* Verification badge */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800 font-semibold text-sm">Verification Method</p>
              <p className="text-amber-700 text-sm">{profile?.method || 'Manual Entry'}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="w-full flex gap-4">
        <SecondaryButton onClick={onBack}>
          <ArrowLeft className="w-4 h-4" /> Not Me
        </SecondaryButton>
        <PrimaryButton onClick={onConfirm} variant="emerald" className="flex-1">
          Confirm & Continue <ArrowRight className="w-5 h-5" />
        </PrimaryButton>
      </div>
    </div>
  );
};

// NEW: Welcome Tutorial Screen
const TutorialScreen = ({ profile, onComplete, voiceSettings }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { speak, stop } = useSpeech();
  
  const slides = [
    {
      icon: Stethoscope,
      title: "Welcome to Your Virtual Visit",
      description: "You'll be connected with a licensed physician who will assess your symptoms, provide diagnosis, and prescribe medication if needed.",
      voiceText: "Welcome to Your Virtual Visit at ExtendiKIOSK. You'll be connected with a licensed physician who will assess your symptoms, provide diagnosis, and prescribe medication if needed.",
      color: "blue"
    },
    {
      icon: Activity,
      title: "Vitals Collection",
      description: "Our sensors will measure your blood pressure, heart rate, oxygen saturation, temperature, and weight. Simply follow the on-screen instructions.",
      voiceText: "Step 2: Vitals Collection. Our sensors will measure your blood pressure, heart rate, oxygen saturation, temperature, and weight. Simply follow the on-screen instructions.",
      color: "emerald"
    },
    {
      icon: Video,
      title: "Telemedicine Session",
      description: "You'll have a private video consultation in this soundproof booth with HD camera and medical-grade audio.",
      voiceText: "Step 3: Telemedicine Session. You'll have a private video consultation in this soundproof booth with HD camera and medical-grade audio.",
      color: "violet"
    },
    {
      icon: Pill,
      title: "Prescription & Follow-up",
      description: "After your visit, prescriptions are sent directly to your pharmacy. Lab requisitions and specialist referrals are handled electronically.",
      voiceText: "Step 4: Prescription and Follow-up. After your visit, prescriptions are sent directly to your pharmacy. Lab requisitions and specialist referrals are handled electronically. Tap Start Session to begin, or tap Skip Tutorial to continue.",
      color: "amber"
    }
  ];

  // Voice guidance for each slide
  useEffect(() => {
    if (voiceSettings?.voiceGuidance) {
      setTimeout(() => {
        speak(slides[currentSlide].voiceText, {
          volume: voiceSettings.voiceVolume,
          rate: voiceSettings.voiceRate,
          lang: voiceSettings.language?.code === 'en' ? 'en-US' : voiceSettings.language?.code
        });
      }, 300);
    }
    return () => stop();
  }, [currentSlide, voiceSettings?.voiceGuidance]);

  const slide = slides[currentSlide];
  const Icon = slide.icon;

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    emerald: 'bg-emerald-100 text-emerald-600',
    violet: 'bg-violet-100 text-violet-600',
    amber: 'bg-amber-100 text-amber-600'
  };

  return (
    <div className="flex flex-col h-full items-center justify-center animate-in fade-in duration-500 max-w-2xl mx-auto w-full">
      <Card className="w-full text-center" padding="p-10">
        {/* Slide indicator */}
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentSlide ? 'bg-blue-600 w-8' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>

        {/* Icon */}
        <div className={`w-24 h-24 ${colorClasses[slide.color]} rounded-2xl flex items-center justify-center mx-auto mb-6 transition-all duration-300`}>
          <Icon className="w-12 h-12" />
        </div>

        {/* Content */}
        <h2 className="text-2xl font-bold text-slate-900 mb-4">{slide.title}</h2>
        <p className="text-slate-600 mb-8 leading-relaxed">{slide.description}</p>

        {/* Navigation */}
        <div className="flex gap-4">
          {currentSlide > 0 && (
            <SecondaryButton onClick={() => setCurrentSlide(c => c - 1)} className="flex-1">
              <ArrowLeft className="w-4 h-4" /> Previous
            </SecondaryButton>
          )}
          
          {currentSlide < slides.length - 1 ? (
            <PrimaryButton onClick={() => setCurrentSlide(c => c + 1)} className="flex-1">
              Next <ArrowRight className="w-5 h-5" />
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={onComplete} variant="emerald" className="flex-1">
              Start Session <PlayCircle className="w-5 h-5" />
            </PrimaryButton>
          )}
        </div>
      </Card>

      <button 
        onClick={onComplete}
        className="mt-6 text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
      >
        Skip Tutorial
      </button>
    </div>
  );
};

// NEW: Accessibility Settings Screen
const AccessibilityScreen = ({ settings, setSettings, onContinue, onBack }) => {
  const [showLanguages, setShowLanguages] = useState(false);
  const { speak, stop, isSpeaking } = useSpeech();

  // Speak welcome message when voice is enabled
  const handleVoiceToggle = (enabled) => {
    setSettings(s => ({ ...s, voiceGuidance: enabled }));
    if (enabled) {
      setTimeout(() => {
        speak("Voice guidance is now enabled. You will hear audio instructions throughout your visit.", {
          volume: settings.voiceVolume,
          rate: settings.voiceRate,
          lang: settings.language.code === 'en' ? 'en-US' : settings.language.code
        });
      }, 100);
    } else {
      stop();
    }
  };

  // Test voice with current settings
  const testVoice = () => {
    speak("This is a test of the ExtendiKIOSK voice guidance system. The volume and speed are set to your preferences. I am your virtual assistant and will guide you through your visit.", {
      volume: settings.voiceVolume,
      rate: settings.voiceRate,
      lang: settings.language.code === 'en' ? 'en-US' : settings.language.code
    });
  };

  // Get volume icon based on level
  const getVolumeIcon = () => {
    if (settings.voiceVolume === 0) return VolumeX;
    if (settings.voiceVolume < 0.5) return Volume1;
    return Volume2;
  };

  const VolumeIcon = getVolumeIcon();

  return (
    <div className="flex flex-col h-full w-full max-w-xl mx-auto animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto pb-4">
        <div className="text-center mb-6 pt-2">
          <div className="w-14 h-14 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Eye className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Accessibility Settings</h2>
          <p className="text-slate-500 text-sm">Customize your experience for comfort and ease of use</p>
        </div>

        <Card className="w-full" padding="p-5">
          <div className="space-y-4">
          {/* Language Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">
              <Globe className="w-3 h-3 inline mr-1" />
              Language
            </label>
            <div className="relative">
              <button
                onClick={() => setShowLanguages(!showLanguages)}
                className="w-full p-3 border-2 border-slate-200 rounded-xl flex items-center justify-between hover:border-blue-300 transition-colors"
              >
                <span className="flex items-center gap-2 text-base">
                  <span className="text-xl">{settings.language.flag}</span>
                  <span className="font-medium">{settings.language.name}</span>
                </span>
                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${showLanguages ? 'rotate-180' : ''}`} />
              </button>
              
              {showLanguages && (
                <div className="absolute z-10 w-full mt-2 bg-white border-2 border-slate-200 rounded-xl shadow-xl overflow-hidden max-h-48 overflow-y-auto">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSettings(s => ({ ...s, language: lang }));
                        setShowLanguages(false);
                      }}
                      className={`w-full p-3 flex items-center gap-3 hover:bg-blue-50 transition-colors ${
                        settings.language.code === lang.code ? 'bg-blue-50' : ''
                      }`}
                    >
                      <span className="text-xl">{lang.flag}</span>
                      <span className="font-medium text-sm">{lang.name}</span>
                      {settings.language.code === lang.code && (
                        <Check className="w-4 h-4 text-blue-600 ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="h-px bg-slate-200" />

          {/* Voice Guidance */}
          <div>
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  settings.voiceGuidance ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'
                }`}>
                  <Volume2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Voice Guidance</p>
                  <p className="text-xs text-slate-500">Audio instructions throughout</p>
                </div>
              </div>
              <ToggleSwitch 
                enabled={settings.voiceGuidance}
                onChange={handleVoiceToggle}
                label=""
              />
            </div>

            {/* Volume Controls - shown when voice is enabled */}
            {settings.voiceGuidance && (
              <div className="mt-3 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                {/* Volume Slider */}
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <VolumeIcon className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">Volume</span>
                    </div>
                    <span className="text-sm font-bold text-blue-600">{Math.round(settings.voiceVolume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={settings.voiceVolume * 100}
                    onChange={(e) => setSettings(s => ({ ...s, voiceVolume: parseInt(e.target.value) / 100 }))}
                    className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                    style={{
                      background: `linear-gradient(to right, #2563eb ${settings.voiceVolume * 100}%, #e2e8f0 ${settings.voiceVolume * 100}%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Mute</span>
                    <span>Max</span>
                  </div>
                </div>

                {/* Speech Rate Slider */}
                <div className="bg-slate-50 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <PlayCircle className="w-4 h-4 text-slate-600" />
                      <span className="text-sm font-medium text-slate-700">Speech Speed</span>
                    </div>
                    <span className="text-sm font-bold text-blue-600">
                      {settings.voiceRate === 1 ? 'Normal' : settings.voiceRate < 1 ? 'Slow' : 'Fast'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={settings.voiceRate * 100}
                    onChange={(e) => setSettings(s => ({ ...s, voiceRate: parseInt(e.target.value) / 100 }))}
                    className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer accent-blue-600"
                    style={{
                      background: `linear-gradient(to right, #2563eb ${(settings.voiceRate - 0.5) * 100}%, #e2e8f0 ${(settings.voiceRate - 0.5) * 100}%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>Slower</span>
                    <span>Normal</span>
                    <span>Faster</span>
                  </div>
                </div>

                {/* Test Voice Button */}
                <button
                  onClick={testVoice}
                  disabled={isSpeaking}
                  className={`w-full py-2.5 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all ${
                    isSpeaking 
                      ? 'bg-blue-100 text-blue-600 cursor-not-allowed' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      <Waves className="w-4 h-4 animate-pulse" />
                      Speaking...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4" />
                      Test Voice
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className="h-px bg-slate-200" />

          {/* Large Text */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                settings.largeText ? 'bg-emerald-600 text-white' : 'bg-emerald-100 text-emerald-600'
              }`}>
                <Type className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">Large Text</p>
                <p className="text-xs text-slate-500">Increase text size for readability</p>
              </div>
            </div>
            <ToggleSwitch 
              enabled={settings.largeText}
              onChange={(val) => setSettings(s => ({ ...s, largeText: val }))}
              label=""
            />
          </div>

          {/* High Contrast */}
          <div className="flex items-center justify-between py-1">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                settings.highContrast ? 'bg-yellow-400 text-black' : 'bg-slate-800 text-white'
              }`}>
                <Eye className="w-4 h-4" />
              </div>
              <div>
                <p className="font-semibold text-slate-800 text-sm">High Contrast</p>
                <p className="text-xs text-slate-500">Enhanced visibility mode</p>
              </div>
            </div>
            <ToggleSwitch 
              enabled={settings.highContrast}
              onChange={(val) => setSettings(s => ({ ...s, highContrast: val }))}
              label=""
            />
          </div>
        </div>
      </Card>
      </div>

      {/* Sticky button footer */}
      <div className="flex-shrink-0 pt-3 pb-2">
        <div className="flex gap-4">
          {onBack && (
            <SecondaryButton onClick={onBack}>
              <ArrowLeft className="w-4 h-4" /> Back
            </SecondaryButton>
          )}
          <PrimaryButton onClick={onContinue} className="flex-1">
            {onBack ? 'Save & Return' : 'Continue to Health Assessment'} <ArrowRight className="w-5 h-5" />
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

// NEW: AI Triage Intake Screen
const AITriageScreen = ({ triageData, setTriageData, onComplete, voiceSettings }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { speak, stop } = useSpeech();

  const questions = [
    {
      id: 'serviceType',
      question: "What brings you in today?",
      voiceText: "What brings you in today? Please select from the following options: General Health Assessment for routine check-ups or new symptoms. Chronic Condition Review for ongoing condition management. Prescription Request or Refill for medication renewal. Or Specialist Consultation for virtual specialist appointments.",
      type: 'select',
      options: [
        { value: SERVICE_TYPES.GENERAL, label: 'General Health Assessment', icon: Stethoscope, desc: 'Routine check-up or new symptoms' },
        { value: SERVICE_TYPES.CHRONIC, label: 'Chronic Condition Review', icon: RefreshCw, desc: 'Ongoing condition management' },
        { value: SERVICE_TYPES.PRESCRIPTION, label: 'Prescription Request/Refill', icon: Pill, desc: 'Medication renewal or new prescription' },
        { value: SERVICE_TYPES.SPECIALIST, label: 'Specialist Consultation', icon: Building2, desc: 'Virtual specialist appointment' }
      ]
    },
    {
      id: 'primarySymptom',
      question: "What is your primary concern or symptom?",
      voiceText: "What is your primary concern or symptom? Please describe your main symptom or reason for your visit using the text field.",
      type: 'text',
      placeholder: "Describe your main symptom or reason for visit..."
    },
    {
      id: 'duration',
      question: "How long have you been experiencing this?",
      voiceText: "How long have you been experiencing this? Select from: Started Today, 1 to 3 Days, About a Week, 2 to 4 Weeks, Over a Month, or Ongoing Chronic.",
      type: 'select',
      options: [
        { value: 'today', label: 'Started Today' },
        { value: 'days', label: '1-3 Days' },
        { value: 'week', label: 'About a Week' },
        { value: 'weeks', label: '2-4 Weeks' },
        { value: 'month', label: 'Over a Month' },
        { value: 'chronic', label: 'Ongoing/Chronic' }
      ]
    },
    {
      id: 'severity',
      question: "How would you rate your discomfort level?",
      voiceText: "How would you rate your discomfort level? Please select a number from 1 to 10, where 1 is minimal discomfort and 10 is severe.",
      type: 'scale',
      min: 1,
      max: 10
    },
    {
      id: 'additionalInfo',
      question: "Any additional information for the physician?",
      voiceText: "Do you have any additional information for the physician? This is optional. You may include allergies, current medications, or recent changes.",
      type: 'text',
      placeholder: "Allergies, current medications, recent changes...",
      optional: true
    }
  ];

  const q = questions[currentQuestion];

  // Speak question when it changes
  useEffect(() => {
    if (voiceSettings?.voiceGuidance && q && !isProcessing) {
      const timer = setTimeout(() => {
        speak(q.voiceText || q.question, {
          volume: voiceSettings.voiceVolume,
          rate: voiceSettings.voiceRate,
          lang: voiceSettings.language?.code === 'en' ? 'en-US' : voiceSettings.language?.code
        });
      }, 500);
      return () => {
        clearTimeout(timer);
        stop();
      };
    }
  }, [currentQuestion, voiceSettings?.voiceGuidance, isProcessing]);

  // Speak processing message
  useEffect(() => {
    if (isProcessing && voiceSettings?.voiceGuidance) {
      speak("Processing your information. Our AI is analyzing your responses to prepare for your visit.", {
        volume: voiceSettings.voiceVolume,
        rate: voiceSettings.voiceRate,
        lang: voiceSettings.language?.code === 'en' ? 'en-US' : voiceSettings.language?.code
      });
    }
  }, [isProcessing, voiceSettings?.voiceGuidance]);

  const handleAnswer = (answer) => {
    stop(); // Stop any ongoing speech
    setTriageData(prev => ({ ...prev, [q.id]: answer }));
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(c => c + 1);
    } else {
      setIsProcessing(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  const canProceed = () => {
    if (q.optional) return true;
    return triageData[q.id] !== undefined && triageData[q.id] !== '';
  };

  if (isProcessing) {
    return (
      <div className="flex flex-col h-full items-center justify-center animate-in fade-in duration-500">
        <Card className="max-w-md w-full text-center" padding="p-10">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="w-10 h-10 text-blue-600 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Processing Your Information</h2>
          <p className="text-slate-600 mb-6">Our AI is analyzing your responses to prepare for your visit...</p>
          <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-blue-600 rounded-full animate-pulse" style={{ width: '70%' }} />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full items-center justify-center animate-in fade-in slide-in-from-right-4 duration-500 max-w-2xl mx-auto w-full">
      {/* Progress */}
      <div className="w-full mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-semibold text-slate-600">AI Triage Assessment</span>
          <span className="text-sm text-slate-400">{currentQuestion + 1} of {questions.length}</span>
        </div>
        <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <Card className="w-full mb-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">{q.question}</h2>
            {q.optional && <span className="text-sm text-slate-400">(Optional)</span>}
          </div>
        </div>

        {/* Service Type Selection */}
        {q.type === 'select' && q.id === 'serviceType' && (
          <div className="grid grid-cols-1 gap-3">
            {q.options.map(opt => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(opt.value)}
                  className={`p-4 rounded-xl border-2 text-left flex items-center gap-4 transition-all hover:border-blue-400 ${
                    triageData[q.id] === opt.value ? 'border-blue-500 bg-blue-50' : 'border-slate-200'
                  }`}
                >
                  <div className="w-12 h-12 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">{opt.label}</p>
                    <p className="text-sm text-slate-500">{opt.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Simple Select */}
        {q.type === 'select' && q.id !== 'serviceType' && (
          <div className="grid grid-cols-2 gap-3">
            {q.options.map(opt => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                className={`p-4 rounded-xl border-2 text-center font-medium transition-all hover:border-blue-400 ${
                  triageData[q.id] === opt.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* Text Input */}
        {q.type === 'text' && (
          <div>
            <textarea
              value={triageData[q.id] || ''}
              onChange={(e) => setTriageData(prev => ({ ...prev, [q.id]: e.target.value }))}
              placeholder={q.placeholder}
              rows={4}
              className="w-full p-4 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none resize-none transition-all text-lg"
            />
          </div>
        )}

        {/* Pain Scale */}
        {q.type === 'scale' && (
          <div>
            <div className="flex justify-between mb-4">
              {Array.from({ length: 10 }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setTriageData(prev => ({ ...prev, [q.id]: n }))}
                  className={`w-10 h-10 rounded-full font-bold transition-all ${
                    triageData[q.id] === n 
                      ? n <= 3 ? 'bg-emerald-500 text-white' : n <= 6 ? 'bg-amber-500 text-white' : 'bg-red-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-sm text-slate-500">
              <span>Minimal</span>
              <span>Moderate</span>
              <span>Severe</span>
            </div>
          </div>
        )}
      </Card>

      <div className="w-full flex gap-4">
        {currentQuestion > 0 && (
          <SecondaryButton onClick={() => setCurrentQuestion(c => c - 1)}>
            <ArrowLeft className="w-4 h-4" /> Back
          </SecondaryButton>
        )}
        
        {(q.type === 'text' || q.type === 'scale') && (
          <PrimaryButton 
            onClick={() => handleAnswer(triageData[q.id])}
            disabled={!canProceed()}
            className="flex-1"
          >
            {currentQuestion < questions.length - 1 ? 'Continue' : 'Complete Assessment'}
            <ArrowRight className="w-5 h-5" />
          </PrimaryButton>
        )}
      </div>
    </div>
  );
};

// AI Pre-Diagnosis Screen
const AIPreDiagnosisScreen = ({ triageData, onComplete, onBack, voiceSettings }) => {
  const [analyzing, setAnalyzing] = useState(true);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const { speak, stop } = useSpeech();

  // Simulate AI analysis
  useEffect(() => {
    if (analyzing) {
      // Speak analyzing message
      if (voiceSettings?.voiceGuidance) {
        speak("AI Analysis in progress. Our AI is reviewing your symptoms and medical history. Please wait.", {
          volume: voiceSettings.voiceVolume,
          rate: voiceSettings.voiceRate,
          lang: voiceSettings.language?.code === 'en' ? 'en-US' : voiceSettings.language?.code
        });
      }
      
      const interval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setAnalyzing(false);
              setShowResults(true);
            }, 500);
            return 100;
          }
          return prev + 2;
        });
      }, 50);
      return () => clearInterval(interval);
    }
  }, [analyzing]);

  // Speak results when shown
  useEffect(() => {
    if (showResults && voiceSettings?.voiceGuidance) {
      const diagnosis = generateDiagnosis();
      const topCondition = diagnosis.conditions[0];
      const urgencyText = diagnosis.urgency === 'high' ? 'priority attention recommended' : 
                         diagnosis.urgency === 'moderate' ? 'moderate priority' : 'low urgency';
      
      setTimeout(() => {
        speak(`Preliminary assessment complete. Based on your reported symptoms, the most likely condition is ${topCondition?.name} with a ${topCondition?.probability} percent match. This is marked as ${urgencyText}. Please review the results on screen and tap Proceed to Vitals Capture when ready.`, {
          volume: voiceSettings.voiceVolume,
          rate: voiceSettings.voiceRate,
          lang: voiceSettings.language?.code === 'en' ? 'en-US' : voiceSettings.language?.code
        });
      }, 500);
    }
    return () => stop();
  }, [showResults, voiceSettings?.voiceGuidance]);

  // Generate pre-diagnosis based on triage data
  const generateDiagnosis = () => {
    const symptom = (triageData.primarySymptom || '').toLowerCase();
    const severity = triageData.severity || 5;
    const duration = triageData.duration || 'days';

    // Simple symptom matching for demo
    let conditions = [];
    let urgency = 'low';
    let urgencyColor = 'emerald';
    let recommendations = [];

    if (symptom.includes('headache') || symptom.includes('head')) {
      conditions = [
        { name: 'Tension Headache', probability: 72, description: 'Common headache caused by muscle tension or stress' },
        { name: 'Migraine', probability: 18, description: 'Recurring headache with moderate to severe pain' },
        { name: 'Sinus Headache', probability: 10, description: 'Headache related to sinus inflammation' }
      ];
      recommendations = [
        'Rest in a quiet, dark room',
        'Stay hydrated',
        'Over-the-counter pain relief may help',
        'Track headache triggers'
      ];
      urgency = severity > 7 ? 'moderate' : 'low';
    } else if (symptom.includes('cough') || symptom.includes('cold') || symptom.includes('throat')) {
      conditions = [
        { name: 'Upper Respiratory Infection', probability: 65, description: 'Common cold or viral infection' },
        { name: 'Acute Bronchitis', probability: 20, description: 'Inflammation of the bronchial tubes' },
        { name: 'Allergic Rhinitis', probability: 15, description: 'Allergic reaction affecting nasal passages' }
      ];
      recommendations = [
        'Rest and stay hydrated',
        'Use honey for sore throat (if over 1 year old)',
        'Monitor for fever',
        'Consider humidifier use'
      ];
      urgency = 'low';
    } else if (symptom.includes('stomach') || symptom.includes('nausea') || symptom.includes('vomit')) {
      conditions = [
        { name: 'Gastroenteritis', probability: 55, description: 'Stomach flu or intestinal infection' },
        { name: 'Food Poisoning', probability: 25, description: 'Illness from contaminated food' },
        { name: 'Acid Reflux', probability: 20, description: 'Stomach acid flowing back into esophagus' }
      ];
      recommendations = [
        'Stay hydrated with clear fluids',
        'BRAT diet (bananas, rice, applesauce, toast)',
        'Avoid dairy and fatty foods',
        'Monitor for dehydration signs'
      ];
      urgency = severity > 6 ? 'moderate' : 'low';
    } else if (symptom.includes('chest') || symptom.includes('heart') || symptom.includes('breath')) {
      conditions = [
        { name: 'Anxiety/Panic Attack', probability: 40, description: 'Stress-related chest tightness' },
        { name: 'Costochondritis', probability: 30, description: 'Inflammation of chest cartilage' },
        { name: 'Respiratory Infection', probability: 30, description: 'Infection affecting breathing' }
      ];
      recommendations = [
        'Sit upright and take slow, deep breaths',
        'Loosen any tight clothing',
        'Monitor symptoms closely',
        'Seek immediate care if pain worsens'
      ];
      urgency = 'high';
      urgencyColor = 'red';
    } else if (symptom.includes('back') || symptom.includes('pain')) {
      conditions = [
        { name: 'Muscle Strain', probability: 60, description: 'Stretched or torn muscle fibers' },
        { name: 'Poor Posture', probability: 25, description: 'Pain from sustained poor positioning' },
        { name: 'Disc Issue', probability: 15, description: 'Spinal disc-related discomfort' }
      ];
      recommendations = [
        'Apply ice for first 48 hours, then heat',
        'Gentle stretching exercises',
        'Maintain good posture',
        'Avoid heavy lifting'
      ];
      urgency = severity > 7 ? 'moderate' : 'low';
    } else {
      conditions = [
        { name: 'General Health Concern', probability: 70, description: 'Requires physician evaluation' },
        { name: 'Stress-Related Symptoms', probability: 20, description: 'Physical manifestation of stress' },
        { name: 'Other Condition', probability: 10, description: 'Further assessment needed' }
      ];
      recommendations = [
        'Document all symptoms',
        'Note any recent changes in routine',
        'Prepare questions for the physician',
        'Bring list of current medications'
      ];
      urgency = 'low';
    }

    if (severity > 7) urgency = urgency === 'low' ? 'moderate' : urgency;
    if (duration === 'chronic' || duration === 'month') {
      recommendations.push('Discuss long-term management options');
    }

    urgencyColor = urgency === 'high' ? 'red' : urgency === 'moderate' ? 'amber' : 'emerald';

    return { conditions, urgency, urgencyColor, recommendations };
  };

  const diagnosis = generateDiagnosis();

  // Analyzing State
  if (analyzing) {
    return (
      <div className="flex flex-col h-full items-center justify-center animate-in fade-in duration-500 max-w-lg mx-auto w-full">
        <Card className="w-full text-center" padding="p-10">
          {/* AI Brain Animation */}
          <div className="relative mb-8">
            <div className="w-24 h-24 bg-gradient-to-br from-violet-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto text-white shadow-xl">
              <Sparkles className="w-12 h-12 animate-pulse" />
            </div>
            {/* Orbiting dots */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 border-2 border-dashed border-violet-300 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-2">AI Analysis in Progress</h2>
          <p className="text-slate-600 mb-6">Our AI is reviewing your symptoms and medical history...</p>

          {/* Analysis steps */}
          <div className="space-y-3 text-left mb-6">
            <div className={`flex items-center gap-3 ${analysisProgress > 20 ? 'text-emerald-600' : 'text-slate-400'}`}>
              {analysisProgress > 20 ? <CheckCircle className="w-5 h-5" /> : <div className="w-5 h-5 border-2 border-current rounded-full" />}
              <span className="text-sm font-medium">Analyzing reported symptoms</span>
            </div>
            <div className={`flex items-center gap-3 ${analysisProgress > 45 ? 'text-emerald-600' : 'text-slate-400'}`}>
              {analysisProgress > 45 ? <CheckCircle className="w-5 h-5" /> : <div className="w-5 h-5 border-2 border-current rounded-full" />}
              <span className="text-sm font-medium">Cross-referencing medical database</span>
            </div>
            <div className={`flex items-center gap-3 ${analysisProgress > 70 ? 'text-emerald-600' : 'text-slate-400'}`}>
              {analysisProgress > 70 ? <CheckCircle className="w-5 h-5" /> : <div className="w-5 h-5 border-2 border-current rounded-full" />}
              <span className="text-sm font-medium">Generating preliminary assessment</span>
            </div>
            <div className={`flex items-center gap-3 ${analysisProgress > 90 ? 'text-emerald-600' : 'text-slate-400'}`}>
              {analysisProgress > 90 ? <CheckCircle className="w-5 h-5" /> : <div className="w-5 h-5 border-2 border-current rounded-full" />}
              <span className="text-sm font-medium">Preparing recommendations</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-purple-600 rounded-full transition-all duration-100"
              style={{ width: `${analysisProgress}%` }}
            />
          </div>
          <p className="text-sm text-slate-500 mt-2">{analysisProgress}% complete</p>
        </Card>
      </div>
    );
  }

  // Results State
  return (
    <div className="flex flex-col h-full items-center animate-in fade-in duration-500 max-w-3xl mx-auto w-full overflow-hidden">
      <div className="flex-1 w-full overflow-y-auto pb-4">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-100 text-violet-700 rounded-full mb-4 border border-violet-200">
            <Sparkles className="w-4 h-4" />
            <span className="font-semibold text-sm">AI Pre-Diagnosis Complete</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">Preliminary Assessment</h2>
          <p className="text-slate-500">Based on your reported symptoms: <span className="font-medium text-slate-700">{triageData.primarySymptom || 'Not specified'}</span></p>
        </div>

        {/* Urgency Banner */}
        <div className={`mb-6 p-4 rounded-xl border-2 flex items-center gap-4 ${
          diagnosis.urgency === 'high' 
            ? 'bg-red-50 border-red-200' 
            : diagnosis.urgency === 'moderate' 
              ? 'bg-amber-50 border-amber-200'
              : 'bg-emerald-50 border-emerald-200'
        }`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
            diagnosis.urgency === 'high' 
              ? 'bg-red-100 text-red-600' 
              : diagnosis.urgency === 'moderate' 
                ? 'bg-amber-100 text-amber-600'
                : 'bg-emerald-100 text-emerald-600'
          }`}>
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className={`font-bold ${
              diagnosis.urgency === 'high' 
                ? 'text-red-800' 
                : diagnosis.urgency === 'moderate' 
                  ? 'text-amber-800'
                  : 'text-emerald-800'
            }`}>
              {diagnosis.urgency === 'high' ? 'Priority Attention Recommended' : diagnosis.urgency === 'moderate' ? 'Moderate Priority' : 'Low Urgency'}
            </p>
            <p className={`text-sm ${
              diagnosis.urgency === 'high' 
                ? 'text-red-700' 
                : diagnosis.urgency === 'moderate' 
                  ? 'text-amber-700'
                  : 'text-emerald-700'
            }`}>
              {diagnosis.urgency === 'high' 
                ? 'Please proceed to vitals capture promptly' 
                : diagnosis.urgency === 'moderate'
                  ? 'Standard consultation recommended'
                  : 'Routine consultation appropriate'}
            </p>
          </div>
        </div>

        {/* Possible Conditions */}
        <Card className="mb-6" padding="p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Stethoscope className="w-5 h-5 text-violet-600" />
            Possible Conditions
          </h3>
          <div className="space-y-4">
            {diagnosis.conditions.map((condition, idx) => (
              <div key={idx} className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  idx === 0 ? 'bg-violet-100 text-violet-600' : 'bg-slate-100 text-slate-500'
                }`}>
                  <span className="font-bold text-sm">{idx + 1}</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-semibold text-slate-800">{condition.name}</p>
                    <Badge variant={idx === 0 ? 'violet' : 'slate'}>{condition.probability}% match</Badge>
                  </div>
                  <p className="text-sm text-slate-500">{condition.description}</p>
                  {/* Probability bar */}
                  <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${idx === 0 ? 'bg-violet-500' : 'bg-slate-300'}`}
                      style={{ width: `${condition.probability}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recommendations */}
        <Card className="mb-6" padding="p-6">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <ClipboardList className="w-5 h-5 text-blue-600" />
            Pre-Visit Recommendations
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {diagnosis.recommendations.map((rec, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <span className="text-sm text-slate-700">{rec}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-800 text-sm">Important Disclaimer</p>
              <p className="text-amber-700 text-sm">
                This AI assessment is for informational purposes only and does not constitute medical advice. 
                A licensed physician will review your case and provide an official diagnosis during your consultation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Actions */}
      <div className="w-full pt-4 border-t border-slate-200 bg-white/95 backdrop-blur-sm shrink-0">
        <div className="flex gap-4">
          <SecondaryButton onClick={onBack}>
            <ArrowLeft className="w-4 h-4" /> Edit Symptoms
          </SecondaryButton>
          <PrimaryButton onClick={onComplete} variant="violet" className="flex-1">
            Proceed to Vitals Capture <ArrowRight className="w-5 h-5" />
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

// Updated Vitals Screen with Weight and Heart Rate
const VitalsScreen = ({ vitals, setVitals, onComplete, voiceSettings }) => {
  const [currentVital, setCurrentVital] = useState(0);
  const [measuring, setMeasuring] = useState(false);
  const [showOptionalAddons, setShowOptionalAddons] = useState(false);
  const { speak, stop } = useSpeech();
  const { progress, start, reset } = useTimer(2500, () => {
    // Set the vital value when measurement completes
    const values = ['118/78', '72', '99%', '98.4°F', '165 lbs'];
    const keys = ['bp', 'hr', 'spo2', 'temp', 'weight'];
    setVitals(v => ({ ...v, [keys[currentVital]]: values[currentVital] }));
    setMeasuring(false);
    
    // Speak completion
    if (voiceSettings?.voiceGuidance) {
      speak(`${vitalConfigs[currentVital].label} measurement complete. Result: ${values[currentVital]}.`, {
        volume: voiceSettings.voiceVolume,
        rate: voiceSettings.voiceRate,
        lang: voiceSettings.language?.code === 'en' ? 'en-US' : voiceSettings.language?.code
      });
    }
  });

  const vitalConfigs = [
    { 
      key: 'bp', 
      label: 'Blood Pressure', 
      icon: Activity, 
      instruction: 'Place your arm in the cuff and relax. Avoid talking.',
      color: 'blue',
      unit: 'mmHg'
    },
    { 
      key: 'hr', 
      label: 'Heart Rate', 
      icon: Heart, 
      instruction: 'Keep your arm still while we measure your pulse.',
      color: 'rose',
      unit: 'BPM'
    },
    { 
      key: 'spo2', 
      label: 'Oxygen Saturation', 
      icon: Droplets, 
      instruction: 'Place your index finger on the red light sensor.',
      color: 'cyan',
      unit: '%'
    },
    { 
      key: 'temp', 
      label: 'Temperature', 
      icon: Thermometer, 
      instruction: 'Look directly at the thermal camera above.',
      color: 'amber',
      unit: '°F'
    },
    { 
      key: 'weight', 
      label: 'Weight', 
      icon: Scale, 
      instruction: 'Step onto the platform and stand still.',
      color: 'violet',
      unit: 'lbs'
    }
  ];

  const optionalAddons = [
    { key: 'ecg', label: 'ECG', icon: Zap, description: '12-lead electrocardiogram' },
    { key: 'glucose', label: 'Blood Glucose', icon: Droplets, description: 'Finger-prick glucose test' },
    { key: 'respiratory', label: 'Respiratory Analysis', icon: Wind, description: 'Breathing pattern assessment' }
  ];

  // Speak vital instructions when current vital changes
  useEffect(() => {
    if (voiceSettings?.voiceGuidance && !showOptionalAddons) {
      const config = vitalConfigs[currentVital];
      if (config) {
        setTimeout(() => {
          speak(`Now measuring ${config.label}. ${config.instruction} Tap Start Measurement when ready.`, {
            volume: voiceSettings.voiceVolume,
            rate: voiceSettings.voiceRate,
            lang: voiceSettings.language?.code === 'en' ? 'en-US' : voiceSettings.language?.code
          });
        }, 500);
      }
    }
    return () => stop();
  }, [currentVital, showOptionalAddons, voiceSettings?.voiceGuidance]);

  // Speak optional addons screen
  useEffect(() => {
    if (showOptionalAddons && voiceSettings?.voiceGuidance) {
      setTimeout(() => {
        speak("Core vitals complete. Would you like any additional measurements? You can select optional add-ons like ECG, Blood Glucose, or Respiratory Analysis. Tap Skip to Video Call to continue without additional tests.", {
          volume: voiceSettings.voiceVolume,
          rate: voiceSettings.voiceRate,
          lang: voiceSettings.language?.code === 'en' ? 'en-US' : voiceSettings.language?.code
        });
      }, 500);
    }
  }, [showOptionalAddons, voiceSettings?.voiceGuidance]);

  const startMeasurement = () => {
    stop(); // Stop any speech
    setMeasuring(true);
    start();
    
    // Announce measurement started
    if (voiceSettings?.voiceGuidance) {
      speak(`Measuring ${vitalConfigs[currentVital].label}. Please hold still.`, {
        volume: voiceSettings.voiceVolume,
        rate: voiceSettings.voiceRate,
        lang: voiceSettings.language?.code === 'en' ? 'en-US' : voiceSettings.language?.code
      });
    }
  };

  const nextVital = () => {
    if (currentVital < vitalConfigs.length - 1) {
      setCurrentVital(c => c + 1);
      reset();
    } else {
      setShowOptionalAddons(true);
    }
  };

  const allComplete = currentVital >= vitalConfigs.length - 1 && vitals.weight;
  const currentConfig = vitalConfigs[currentVital];
  const Icon = currentConfig?.icon || Activity;

  // Optional Add-ons Screen
  if (showOptionalAddons) {
    return (
      <div className="h-full flex flex-col max-w-3xl mx-auto w-full animate-in fade-in duration-500">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Core Vitals Complete</h2>
          <p className="text-slate-500">Would you like any additional measurements?</p>
        </div>

        <Card className="mb-6">
          <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <Beaker className="w-5 h-5 text-violet-600" />
            Optional Add-ons
          </h3>
          <div className="space-y-3">
            {optionalAddons.map(addon => {
              const AddonIcon = addon.icon;
              return (
                <button
                  key={addon.key}
                  onClick={() => setVitals(v => ({ ...v, [addon.key]: v[addon.key] ? null : 'Requested' }))}
                  className={`w-full p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                    vitals[addon.key] 
                      ? 'border-violet-400 bg-violet-50' 
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    vitals[addon.key] ? 'bg-violet-100 text-violet-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                    <AddonIcon className="w-6 h-6" />
                  </div>
                  <div className="text-left flex-1">
                    <p className="font-semibold text-slate-800">{addon.label}</p>
                    <p className="text-sm text-slate-500">{addon.description}</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    vitals[addon.key] ? 'border-violet-500 bg-violet-500 text-white' : 'border-slate-300'
                  }`}>
                    {vitals[addon.key] && <Check className="w-4 h-4" />}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        <PrimaryButton onClick={onComplete} variant="emerald" className="w-full py-5 text-lg">
          Connect to Provider <ArrowRight className="w-5 h-5" />
        </PrimaryButton>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2">Vitals Collection</h2>
        <p className="text-slate-500">Follow the on-screen instructions to capture your health metrics</p>
      </div>

      {/* Vital Cards */}
      <div className="grid grid-cols-5 gap-3 mb-6">
        {vitalConfigs.map((config, index) => {
          const isActive = currentVital === index;
          const isDone = vitals[config.key] !== null;
          const VIcon = config.icon;
          
          return (
            <div 
              key={config.key}
              className={`
                relative rounded-2xl p-4 border-2 transition-all duration-300
                ${isActive 
                  ? 'border-blue-400 bg-white shadow-xl scale-105 z-10' 
                  : isDone 
                    ? 'border-emerald-200 bg-emerald-50/50' 
                    : 'border-slate-100 bg-slate-50/50 opacity-60'
                }
              `}
            >
              <div className="flex justify-between items-start mb-3">
                <div className={`
                  p-2 rounded-lg transition-colors
                  ${isActive ? 'bg-blue-100 text-blue-600' : isDone ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}
                `}>
                  <VIcon className="w-4 h-4" />
                </div>
                {isDone && <CheckCircle className="text-emerald-500 w-4 h-4" />}
              </div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                {config.label}
              </div>
              <div className="text-lg font-bold text-slate-800">
                {isDone ? vitals[config.key] : isActive && measuring ? '...' : '--'}
              </div>
              
              {/* Progress bar for active measurement */}
              {isActive && measuring && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-slate-100 rounded-b-2xl overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-75 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Instruction Panel */}
      <Card className="flex-1 flex flex-col items-center justify-center text-center mb-6">
        {!allComplete ? (
          <>
            <div className={`
              w-20 h-20 rounded-2xl flex items-center justify-center mb-6
              ${measuring 
                ? 'bg-blue-100 text-blue-600 animate-pulse' 
                : 'bg-slate-100 text-slate-400'
              }
            `}>
              <Icon className="w-10 h-10" />
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 mb-2">
              {measuring ? `Measuring ${currentConfig.label}...` : currentConfig.label}
            </h3>
            <p className="text-slate-500 max-w-md">
              {currentConfig.instruction}
            </p>
            
            {measuring && (
              <div className="mt-6 flex items-center gap-2 text-blue-600">
                <Waves className="w-5 h-5 animate-pulse" />
                <span className="font-medium">Sensor Active</span>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
              <Sparkles className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">All Core Vitals Captured</h3>
            <p className="text-slate-500">Your data has been securely recorded and synced.</p>
          </>
        )}
      </Card>

      {/* Action Button */}
      <PrimaryButton
        onClick={vitals[vitalConfigs[currentVital]?.key] ? nextVital : startMeasurement}
        disabled={measuring}
        className="w-full py-5 text-lg"
        variant={allComplete ? 'emerald' : 'blue'}
      >
        {measuring 
          ? 'Measuring...' 
          : allComplete 
            ? 'Continue to Add-ons' 
            : vitals[vitalConfigs[currentVital]?.key]
              ? 'Next Measurement'
              : `Start ${currentConfig.label} Check`
        }
        {!measuring && <ArrowRight className="w-5 h-5" />}
      </PrimaryButton>
    </div>
  );
};

const VideoCallScreen = ({ vitals, onEnd, voiceSettings }) => {
  const [callTime, setCallTime] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const { speak, stop } = useSpeech();

  useEffect(() => {
    const timer = setInterval(() => setCallTime(t => t + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  // Announce video call start
  useEffect(() => {
    if (voiceSettings?.voiceGuidance) {
      setTimeout(() => {
        speak("You are now connected to your telemedicine consultation. Doctor Sarah Chen will be with you shortly. You can use the controls at the bottom to toggle your microphone and camera, or end the call when finished.", {
          volume: voiceSettings.voiceVolume,
          rate: voiceSettings.voiceRate,
          lang: voiceSettings.language?.code === 'en' ? 'en-US' : voiceSettings.language?.code
        });
      }, 1000);
    }
    return () => stop();
  }, [voiceSettings?.voiceGuidance]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    stop();
    if (voiceSettings?.voiceGuidance) {
      speak("Ending call. Thank you for your consultation.", {
        volume: voiceSettings.voiceVolume,
        rate: voiceSettings.voiceRate,
        lang: voiceSettings.language?.code === 'en' ? 'en-US' : voiceSettings.language?.code
      });
    }
    setTimeout(onEnd, 1000);
  };

  return (
    <div className="w-full max-w-6xl h-[80vh] flex flex-col bg-slate-900 rounded-3xl overflow-hidden shadow-2xl animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-slate-800/90 backdrop-blur px-6 py-4 flex justify-between items-center border-b border-slate-700/50">
        <div className="flex items-center gap-4">
          {/* Live indicator */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 rounded-full border border-red-500/20">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-red-400 font-mono text-sm font-bold">{formatTime(callTime)}</span>
          </div>
          
          <div className="h-6 w-px bg-slate-700" />
          
          {/* Provider info */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              SB
            </div>
            <div>
              <div className="text-white font-semibold">Dr. Sarah Bennett</div>
              <div className="text-slate-400 text-xs">Internal Medicine • License #44291</div>
            </div>
          </div>
        </div>

        {/* Vitals summary */}
        <div className="hidden md:flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 text-slate-400">
            <Activity className="w-4 h-4" />
            <span className="text-white font-mono">{vitals.bp || '--'}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Heart className="w-4 h-4" />
            <span className="text-white font-mono">{vitals.hr || '--'} BPM</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Droplets className="w-4 h-4" />
            <span className="text-white font-mono">{vitals.spo2 || '--'}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Thermometer className="w-4 h-4" />
            <span className="text-white font-mono">{vitals.temp || '--'}</span>
          </div>
        </div>
      </div>

      {/* Main video area */}
      <div className="flex-1 relative bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
        {/* Provider placeholder */}
        <div className="text-center opacity-30">
          <div className="w-32 h-32 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-16 h-16 text-slate-500" />
          </div>
          <p className="text-slate-500 text-lg">Connecting secure video feed...</p>
        </div>

        {/* Self-view */}
        <div className="absolute bottom-6 right-6 w-56 aspect-video bg-slate-800 rounded-xl border border-slate-700 shadow-2xl flex items-center justify-center overflow-hidden">
          <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/50 rounded text-xs text-white/70 backdrop-blur-sm">
            You
          </div>
          {videoEnabled ? (
            <div className="w-12 h-12 bg-slate-700 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-slate-500" />
            </div>
          ) : (
            <div className="text-slate-600 text-sm">Camera Off</div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-slate-900 px-8 py-6 border-t border-slate-800">
        <div className="max-w-xl mx-auto flex justify-center items-center gap-4">
          <button 
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`
              p-4 rounded-xl transition-all shadow-lg
              ${audioEnabled 
                ? 'bg-slate-800 text-white hover:bg-slate-700' 
                : 'bg-red-600 text-white hover:bg-red-700'
              }
            `}
            aria-label={audioEnabled ? 'Mute microphone' : 'Unmute microphone'}
          >
            {audioEnabled ? <Mic className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </button>
          
          <button 
            onClick={() => setVideoEnabled(!videoEnabled)}
            className={`
              p-4 rounded-xl transition-all shadow-lg
              ${videoEnabled 
                ? 'bg-slate-800 text-white hover:bg-slate-700' 
                : 'bg-red-600 text-white hover:bg-red-700'
              }
            `}
            aria-label={videoEnabled ? 'Turn off camera' : 'Turn on camera'}
          >
            <Video className="w-6 h-6" />
          </button>

          <div className="w-px h-10 bg-slate-800 mx-2" />

          <button 
            onClick={handleEndCall}
            className="
              px-8 py-4 rounded-xl bg-red-600 text-white font-semibold
              hover:bg-red-700 transition-all shadow-lg
              flex items-center gap-3
            "
          >
            <PhoneOff className="w-5 h-5" />
            End Session
          </button>
        </div>
      </div>
    </div>
  );
};

// NEW: Sanitization Prompt Screen
const SanitizationScreen = ({ onComplete, voiceSettings }) => {
  const [isWiping, setIsWiping] = useState(false);
  const [wipingComplete, setWipingComplete] = useState(false);
  const { speak, stop } = useSpeech();

  // Announce sanitization screen
  useEffect(() => {
    if (voiceSettings?.voiceGuidance) {
      setTimeout(() => {
        speak("Sanitization required. For your safety, please wipe down the touchscreen and sensors with the provided sanitizing wipe. Tap the button when done, or skip this step.", {
          volume: voiceSettings.voiceVolume,
          rate: voiceSettings.voiceRate,
          lang: voiceSettings.language?.code === 'en' ? 'en-US' : voiceSettings.language?.code
        });
      }, 500);
    }
    return () => stop();
  }, [voiceSettings?.voiceGuidance]);

  // Announce wiping progress
  useEffect(() => {
    if (isWiping && voiceSettings?.voiceGuidance) {
      speak("Sanitizing surfaces. Please wait.", {
        volume: voiceSettings.voiceVolume,
        rate: voiceSettings.voiceRate,
        lang: voiceSettings.language?.code === 'en' ? 'en-US' : voiceSettings.language?.code
      });
    }
  }, [isWiping]);

  // Announce completion
  useEffect(() => {
    if (wipingComplete && voiceSettings?.voiceGuidance) {
      speak("Sanitization complete. Thank you for helping keep the kiosk clean and safe. Tap Continue to Summary to proceed.", {
        volume: voiceSettings.voiceVolume,
        rate: voiceSettings.voiceRate,
        lang: voiceSettings.language?.code === 'en' ? 'en-US' : voiceSettings.language?.code
      });
    }
  }, [wipingComplete]);

  const handleWipe = () => {
    stop();
    setIsWiping(true);
    setTimeout(() => {
      setIsWiping(false);
      setWipingComplete(true);
    }, 3000);
  };

  return (
    <div className="flex flex-col h-full items-center justify-center animate-in fade-in duration-500 max-w-lg mx-auto w-full">
      <Card className="w-full text-center" padding="p-10">
        {!wipingComplete ? (
          <>
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              isWiping ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-amber-100 text-amber-600'
            }`}>
              <SprayCan className="w-12 h-12" />
            </div>
            
            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              {isWiping ? 'Sanitizing Surfaces...' : 'Sanitization Required'}
            </h2>
            <p className="text-slate-600 mb-8">
              {isWiping 
                ? 'Please wait while UV sanitization is in progress.'
                : 'For your safety, please wipe down the touchscreen and sensors with the provided sanitizing wipe.'
              }
            </p>

            {isWiping ? (
              <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full animate-pulse"
                  style={{ width: '60%', animation: 'grow 3s linear' }}
                />
              </div>
            ) : (
              <div className="space-y-3">
                <PrimaryButton onClick={handleWipe} className="w-full" variant="amber">
                  <SprayCan className="w-5 h-5" />
                  I've Wiped the Surfaces
                </PrimaryButton>
                <button 
                  onClick={onComplete}
                  className="text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
                >
                  Skip this step
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">Sanitization Complete</h2>
            <p className="text-slate-600 mb-8">Thank you for helping keep the kiosk clean and safe.</p>
            <PrimaryButton onClick={onComplete} variant="emerald" className="w-full">
              Continue to Summary <ArrowRight className="w-5 h-5" />
            </PrimaryButton>
          </>
        )}
      </Card>

      <style>{`
        @keyframes grow {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </div>
  );
};

// Enhanced Summary Screen - Responsive with sticky button
const SummaryScreen = ({ profile, triageData, vitals, onFinish, voiceSettings }) => {
  const { speak, stop } = useSpeech();

  // Announce summary on mount
  useEffect(() => {
    if (voiceSettings?.voiceGuidance) {
      setTimeout(() => {
        speak("Visit complete! Doctor Bennett has completed your consultation. Your diagnosis is Upper Respiratory Infection, commonly known as the Common Cold. Your e-prescription has been sent to Shoppers Drug Mart and will be ready in 2 hours. A visit summary has been emailed to you. Tap Finish and Log Out when you're ready to end your session.", {
          volume: voiceSettings.voiceVolume,
          rate: voiceSettings.voiceRate,
          lang: voiceSettings.language?.code === 'en' ? 'en-US' : voiceSettings.language?.code
        });
      }, 500);
    }
    return () => stop();
  }, [voiceSettings?.voiceGuidance]);

  const handleFinish = () => {
    stop();
    if (voiceSettings?.voiceGuidance) {
      speak("Thank you for using ExtendiKIOSK. Have a great day and feel better soon!", {
        volume: voiceSettings.voiceVolume,
        rate: voiceSettings.voiceRate,
        lang: voiceSettings.language?.code === 'en' ? 'en-US' : voiceSettings.language?.code
      });
    }
    setTimeout(onFinish, 2000);
  };

  return (
    <div className="h-full w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
      <div className="max-w-2xl w-full flex flex-col h-full max-h-full">
        <Card className="flex-1 flex flex-col min-h-0 overflow-hidden" padding="p-0">
          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
            {/* Success animation */}
            <div className="relative mb-6 md:mb-8 text-center">
              <div className="absolute inset-0 bg-emerald-400/20 rounded-full blur-2xl animate-pulse" />
              <div className="relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto text-white shadow-xl">
                <CheckCircle className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" />
              </div>
            </div>
            
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2 md:mb-3 text-center">Visit Complete!</h2>
            <p className="text-slate-500 mb-6 md:mb-8 leading-relaxed text-center text-sm md:text-base">
              Dr. Bennett has completed your consultation. Here's a summary of your visit.
            </p>

            {/* Diagnosis Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-5 mb-4 md:mb-6">
              <h3 className="font-bold text-blue-800 mb-1 md:mb-2 flex items-center gap-2 text-sm md:text-base">
                <Stethoscope className="w-4 h-4 md:w-5 md:h-5" />
                Diagnosis
              </h3>
              <p className="text-blue-700 text-sm md:text-base">Upper Respiratory Infection (Common Cold)</p>
            </div>

            {/* Summary details */}
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-slate-50 rounded-xl">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center shrink-0">
                  <Pill className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm md:text-base">E-Prescription Sent</p>
                  <p className="text-xs md:text-sm text-slate-600 truncate">Sent to Shoppers Drug Mart • Ready in 2 hours</p>
                </div>
                <Badge variant="emerald">Sent</Badge>
              </div>

              <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-slate-50 rounded-xl">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-violet-100 text-violet-600 rounded-lg flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm md:text-base">Visit Summary</p>
                  <p className="text-xs md:text-sm text-slate-600 truncate">Emailed to {profile?.name || 'you'}</p>
                </div>
                <Badge variant="blue">Sent</Badge>
              </div>

              <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-slate-50 rounded-xl">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center shrink-0">
                  <Beaker className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm md:text-base">Lab Requisition</p>
                  <p className="text-xs md:text-sm text-slate-600 truncate">Blood work ordered • LifeLabs - Any location</p>
                </div>
                <Badge variant="amber">Optional</Badge>
              </div>

              <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-slate-50 rounded-xl">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm md:text-base">Specialist Referral</p>
                  <p className="text-xs md:text-sm text-slate-600 truncate">ENT Specialist if symptoms persist beyond 2 weeks</p>
                </div>
                <Badge variant="slate">Conditional</Badge>
              </div>

              <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-slate-50 rounded-xl">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center shrink-0">
                  <RefreshCw className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm md:text-base">EMR Sync</p>
                  <p className="text-xs md:text-sm text-slate-600 truncate">Visit data synced to ExtendiHealth record</p>
                </div>
                <Badge variant="emerald">Complete</Badge>
              </div>

              <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 bg-slate-50 rounded-xl">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-cyan-100 text-cyan-600 rounded-lg flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm md:text-base">Follow-up</p>
                  <p className="text-xs md:text-sm text-slate-600 truncate">Schedule in 2 weeks if symptoms persist</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky button at bottom */}
          <div className="shrink-0 p-4 md:p-6 border-t border-slate-200 bg-white/95 backdrop-blur-sm">
            <PrimaryButton onClick={handleFinish} variant="slate" className="w-full py-3 md:py-4 text-sm md:text-base">
              Finish & Log Out
            </PrimaryButton>
          </div>
        </Card>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APPLICATION
// ============================================================================

export default function ExtendiKiosk() {
  const [step, setStep] = useState(STEPS.WELCOME);
  const [checkInMethod, setCheckInMethod] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [vitals, setVitals] = useState({ 
    bp: null, 
    hr: null,      // Heart rate
    spo2: null, 
    temp: null, 
    weight: null,  // Weight
    // Optional add-ons
    ecg: null,
    glucose: null,
    respiratory: null
  });
  const [triageData, setTriageData] = useState({});
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    language: LANGUAGES[0],
    voiceGuidance: false,
    voiceVolume: 0.8,  // Volume from 0 to 1
    voiceRate: 1.0,    // Speech rate
    largeText: false,
    highContrast: false
  });
  const [showEmergency, setShowEmergency] = useState(false);

  // Default accessibility settings
  const defaultAccessibilitySettings = {
    language: LANGUAGES[0],
    voiceGuidance: false,
    voiceVolume: 0.8,
    voiceRate: 1.0,
    largeText: false,
    highContrast: false
  };

  // Track if user accessed accessibility from welcome screen
  const [accessedFromWelcome, setAccessedFromWelcome] = useState(false);

  const reset = () => {
    setStep(STEPS.WELCOME);
    setCheckInMethod(null);
    setUserProfile(null);
    setVitals({ bp: null, hr: null, spo2: null, temp: null, weight: null, ecg: null, glucose: null, respiratory: null });
    setTriageData({});
    setAccessedFromWelcome(false);
    // Reset accessibility settings back to defaults
    setAccessibilitySettings(defaultAccessibilitySettings);
  };

  const handleMethodSelect = (method) => {
    setCheckInMethod(method);
    setStep(STEPS.IDENTITY);
  };

  const handleVerify = (profile) => {
    setUserProfile(profile);
    setStep(STEPS.CONFIRMATION);
  };

  // Handle opening accessibility from welcome screen
  const handleOpenAccessibilityFromWelcome = () => {
    setAccessedFromWelcome(true);
    setStep(STEPS.ACCESSIBILITY);
  };

  // Handle returning from accessibility to welcome
  const handleReturnToWelcome = () => {
    setAccessedFromWelcome(false);
    setStep(STEPS.WELCOME);
  };

  return (
    <div className={`
      h-screen w-screen overflow-hidden transition-colors duration-300
      ${accessibilitySettings.highContrast 
        ? 'bg-black text-white high-contrast-mode' 
        : 'bg-slate-50 text-slate-900'
      }
      ${accessibilitySettings.largeText ? 'large-text-mode' : ''}
    `}>
      {!accessibilitySettings.highContrast && <AnimatedBackground />}
      <EmergencyModal isOpen={showEmergency} onClose={() => setShowEmergency(false)} />

      {/* Header */}
      <header className={`
        fixed top-0 left-0 w-full h-16 z-50 px-6 flex justify-between items-center
        transition-colors duration-300
        ${accessibilitySettings.highContrast 
          ? 'bg-black border-b-2 border-yellow-400' 
          : 'bg-white/80 backdrop-blur-md border-b border-slate-200/50'
        }
      `}>
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg shadow-sm ${
            accessibilitySettings.highContrast 
              ? 'bg-yellow-400 text-black' 
              : 'bg-gradient-to-br from-blue-600 to-blue-700'
          }`}>
            <Monitor className={`w-5 h-5 ${accessibilitySettings.highContrast ? '' : 'text-white'}`} />
          </div>
          <div>
            <h1 className={`font-bold leading-none ${
              accessibilitySettings.largeText ? 'text-base' : 'text-sm'
            } ${accessibilitySettings.highContrast ? 'text-yellow-400' : 'text-slate-800'}`}>
              ExtendiKIOSK
            </h1>
            <span className={`font-mono ${
              accessibilitySettings.largeText ? 'text-sm' : 'text-xs'
            } ${accessibilitySettings.highContrast ? 'text-white' : 'text-slate-400'}`}>
              STATION-04
            </span>
          </div>
        </div>

        <StepIndicator currentStep={step} totalSteps={11} highContrast={accessibilitySettings.highContrast} />

        <div className="flex items-center gap-3">
          {/* Language indicator */}
          <div className={`hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg ${
            accessibilitySettings.largeText ? 'text-base' : 'text-sm'
          } ${accessibilitySettings.highContrast 
            ? 'bg-yellow-400/20 border border-yellow-400' 
            : 'bg-slate-100'
          }`}>
            <span className={accessibilitySettings.largeText ? 'text-xl' : 'text-lg'}>
              {accessibilitySettings.language.flag}
            </span>
            <span className={`font-medium ${accessibilitySettings.highContrast ? 'text-yellow-400' : 'text-slate-600'}`}>
              {accessibilitySettings.language.code.toUpperCase()}
            </span>
          </div>

          {/* Voice guidance toggle button - always visible */}
          <button
            onClick={() => {
              const newValue = !accessibilitySettings.voiceGuidance;
              setAccessibilitySettings(s => ({ ...s, voiceGuidance: newValue }));
              // Announce the change with female voice
              if (newValue) {
                quickSpeak("Voice guidance enabled", accessibilitySettings.voiceVolume, accessibilitySettings.voiceRate);
              } else if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
              }
            }}
            className={`
              px-3 py-2 rounded-lg font-semibold transition-all flex items-center gap-2
              ${accessibilitySettings.largeText ? 'text-base' : 'text-sm'}
              ${accessibilitySettings.voiceGuidance
                ? accessibilitySettings.highContrast 
                  ? 'bg-green-500 text-white hover:bg-green-400 border-2 border-green-300' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                : accessibilitySettings.highContrast
                  ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 border-2 border-yellow-400'
                  : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
              }
            `}
            aria-label={accessibilitySettings.voiceGuidance ? 'Turn off voice guidance' : 'Turn on voice guidance'}
            title={accessibilitySettings.voiceGuidance ? 'Voice On - Click to mute' : 'Voice Off - Click to enable'}
          >
            {accessibilitySettings.voiceGuidance ? (
              <>
                <Volume2 className="w-4 h-4" />
                <span className="hidden sm:inline">Voice On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4" />
                <span className="hidden sm:inline">Voice Off</span>
              </>
            )}
          </button>

          {/* High Contrast indicator */}
          {accessibilitySettings.highContrast && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-400/20 border border-yellow-400 text-yellow-400">
              <Eye className="w-4 h-4" />
              <span className="font-medium text-sm">High Contrast</span>
            </div>
          )}

          {/* Help Button */}
          <button className={`
            px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2
            ${accessibilitySettings.largeText ? 'text-base' : 'text-sm'}
            ${accessibilitySettings.highContrast 
              ? 'bg-yellow-400 text-black hover:bg-yellow-300' 
              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }
          `}>
            <HelpCircle className="w-4 h-4" />
            Help
          </button>

          {/* Emergency Button */}
          <button 
            onClick={() => setShowEmergency(true)}
            className={`
              px-4 py-2 rounded-lg font-semibold transition-colors flex items-center gap-2
              ${accessibilitySettings.largeText ? 'text-base' : 'text-sm'}
              ${accessibilitySettings.highContrast 
                ? 'bg-red-600 text-white hover:bg-red-500 border-2 border-red-400' 
                : 'bg-red-600 hover:bg-red-700 text-white'
              }
            `}
          >
            <AlertTriangle className="w-4 h-4" />
            Emergency
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className={`pt-20 pb-6 px-6 h-full flex ${step === STEPS.ACCESSIBILITY ? 'items-stretch' : 'items-center'} justify-center overflow-hidden`}>
        {step === STEPS.WELCOME && (
          <WelcomeScreen 
            onSelect={handleMethodSelect} 
            highContrast={accessibilitySettings.highContrast} 
            largeText={accessibilitySettings.largeText}
            voiceSettings={accessibilitySettings}
            onEnableVoice={() => setAccessibilitySettings(s => ({ ...s, voiceGuidance: true }))}
            onOpenAccessibility={handleOpenAccessibilityFromWelcome}
          />
        )}
        {step === STEPS.IDENTITY && (
          <IdentityScreen 
            method={checkInMethod} 
            onVerify={handleVerify} 
            onCancel={reset}
            highContrast={accessibilitySettings.highContrast}
            largeText={accessibilitySettings.largeText}
            voiceSettings={accessibilitySettings}
          />
        )}
        {step === STEPS.CONFIRMATION && (
          <ConfirmationScreen 
            profile={userProfile}
            onConfirm={() => setStep(STEPS.TUTORIAL)}
            onBack={() => setStep(STEPS.IDENTITY)}
            highContrast={accessibilitySettings.highContrast}
            largeText={accessibilitySettings.largeText}
            voiceSettings={accessibilitySettings}
          />
        )}
        {step === STEPS.TUTORIAL && (
          <TutorialScreen 
            profile={userProfile}
            onComplete={() => setStep(STEPS.ACCESSIBILITY)}
            highContrast={accessibilitySettings.highContrast}
            largeText={accessibilitySettings.largeText}
            voiceSettings={accessibilitySettings}
          />
        )}
        {step === STEPS.ACCESSIBILITY && (
          <AccessibilityScreen 
            settings={accessibilitySettings}
            setSettings={setAccessibilitySettings}
            onContinue={() => {
              if (accessedFromWelcome) {
                handleReturnToWelcome();
              } else {
                setStep(STEPS.AI_TRIAGE);
              }
            }}
            onBack={accessedFromWelcome ? handleReturnToWelcome : null}
          />
        )}
        {step === STEPS.AI_TRIAGE && (
          <AITriageScreen 
            triageData={triageData}
            setTriageData={setTriageData}
            onComplete={() => setStep(STEPS.AI_PREDIAGNOSIS)}
            highContrast={accessibilitySettings.highContrast}
            largeText={accessibilitySettings.largeText}
            voiceSettings={accessibilitySettings}
          />
        )}
        {step === STEPS.AI_PREDIAGNOSIS && (
          <AIPreDiagnosisScreen 
            triageData={triageData}
            onComplete={() => setStep(STEPS.VITALS)}
            onBack={() => setStep(STEPS.AI_TRIAGE)}
            highContrast={accessibilitySettings.highContrast}
            largeText={accessibilitySettings.largeText}
            voiceSettings={accessibilitySettings}
          />
        )}
        {step === STEPS.VITALS && (
          <VitalsScreen 
            vitals={vitals}
            setVitals={setVitals}
            onComplete={() => setStep(STEPS.VIDEO_CALL)}
            highContrast={accessibilitySettings.highContrast}
            largeText={accessibilitySettings.largeText}
            voiceSettings={accessibilitySettings}
          />
        )}
        {step === STEPS.VIDEO_CALL && (
          <VideoCallScreen 
            vitals={vitals}
            onEnd={() => setStep(STEPS.SANITIZATION)}
            highContrast={accessibilitySettings.highContrast}
            largeText={accessibilitySettings.largeText}
            voiceSettings={accessibilitySettings}
          />
        )}
        {step === STEPS.SANITIZATION && (
          <SanitizationScreen 
            onComplete={() => setStep(STEPS.SUMMARY)}
            highContrast={accessibilitySettings.highContrast}
            largeText={accessibilitySettings.largeText}
            voiceSettings={accessibilitySettings}
          />
        )}
        {step === STEPS.SUMMARY && (
          <SummaryScreen 
            profile={userProfile}
            triageData={triageData}
            vitals={vitals}
            onFinish={reset}
            highContrast={accessibilitySettings.highContrast}
            largeText={accessibilitySettings.largeText}
            voiceSettings={accessibilitySettings}
          />
        )}
      </main>

      {/* Tailwind animation utilities and theme styles */}
      <style>{`
        @keyframes in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-in {
          animation: in 0.5s ease-out forwards;
        }
        .fade-in {
          --tw-enter-opacity: 0;
        }
        .zoom-in-95 {
          --tw-enter-scale: 0.95;
        }
        .slide-in-from-bottom-4 {
          --tw-enter-translate-y: 1rem;
        }
        .slide-in-from-right-4 {
          --tw-enter-translate-x: 1rem;
        }
        
        /* Large Text Mode */
        .large-text-mode {
          font-size: 1.125rem;
        }
        .large-text-mode h1 { font-size: 2.5rem; }
        .large-text-mode h2 { font-size: 2rem; }
        .large-text-mode h3 { font-size: 1.5rem; }
        .large-text-mode p, .large-text-mode span, .large-text-mode label { font-size: 1.125rem; }
        .large-text-mode button { font-size: 1.125rem; }
        .large-text-mode input { font-size: 1.25rem; }
        
        /* High Contrast Mode */
        .high-contrast-mode {
          --hc-bg: #000000;
          --hc-text: #ffffff;
          --hc-accent: #facc15;
          --hc-border: #facc15;
        }
        
        /* Background overrides */
        .high-contrast-mode .bg-white,
        .high-contrast-mode .bg-white\\/80,
        .high-contrast-mode .bg-white\\/90,
        .high-contrast-mode .bg-white\\/95,
        .high-contrast-mode .bg-slate-50,
        .high-contrast-mode .bg-slate-100,
        .high-contrast-mode .bg-slate-50\\/50 {
          background-color: #1a1a1a !important;
        }
        
        /* Card and container backgrounds */
        .high-contrast-mode .bg-gradient-to-br {
          background: #262626 !important;
        }
        
        /* Text color overrides */
        .high-contrast-mode .text-slate-900,
        .high-contrast-mode .text-slate-800,
        .high-contrast-mode .text-slate-700,
        .high-contrast-mode .text-slate-600 {
          color: #ffffff !important;
        }
        .high-contrast-mode .text-slate-500,
        .high-contrast-mode .text-slate-400 {
          color: #d1d5db !important;
        }
        
        /* Border overrides */
        .high-contrast-mode .border-slate-200,
        .high-contrast-mode .border-slate-200\\/50,
        .high-contrast-mode .border-slate-100,
        .high-contrast-mode .border {
          border-color: #facc15 !important;
        }
        
        /* Colored background overrides */
        .high-contrast-mode .bg-blue-50,
        .high-contrast-mode .bg-blue-100,
        .high-contrast-mode .bg-emerald-50,
        .high-contrast-mode .bg-emerald-100,
        .high-contrast-mode .bg-amber-50,
        .high-contrast-mode .bg-amber-100,
        .high-contrast-mode .bg-violet-50,
        .high-contrast-mode .bg-violet-100,
        .high-contrast-mode .bg-rose-50,
        .high-contrast-mode .bg-rose-100,
        .high-contrast-mode .bg-cyan-50,
        .high-contrast-mode .bg-cyan-100 {
          background-color: #262626 !important;
          border: 2px solid #facc15 !important;
        }
        
        /* Colored text overrides */
        .high-contrast-mode .text-blue-700,
        .high-contrast-mode .text-blue-800,
        .high-contrast-mode .text-blue-600,
        .high-contrast-mode .text-emerald-700,
        .high-contrast-mode .text-emerald-600,
        .high-contrast-mode .text-amber-700,
        .high-contrast-mode .text-amber-800,
        .high-contrast-mode .text-amber-600,
        .high-contrast-mode .text-violet-700,
        .high-contrast-mode .text-violet-600,
        .high-contrast-mode .text-rose-700,
        .high-contrast-mode .text-rose-600,
        .high-contrast-mode .text-cyan-700,
        .high-contrast-mode .text-cyan-600 {
          color: #facc15 !important;
        }
        
        /* Colored border overrides */
        .high-contrast-mode .border-blue-200,
        .high-contrast-mode .border-blue-100,
        .high-contrast-mode .border-emerald-200,
        .high-contrast-mode .border-amber-200,
        .high-contrast-mode .border-violet-200,
        .high-contrast-mode .border-rose-200,
        .high-contrast-mode .border-cyan-200 {
          border-color: #facc15 !important;
        }
        
        /* Input and form elements */
        .high-contrast-mode input,
        .high-contrast-mode textarea,
        .high-contrast-mode select {
          background-color: #1a1a1a !important;
          color: #ffffff !important;
          border: 2px solid #facc15 !important;
        }
        .high-contrast-mode input::placeholder,
        .high-contrast-mode textarea::placeholder {
          color: #9ca3af !important;
        }
        .high-contrast-mode input:focus,
        .high-contrast-mode textarea:focus,
        .high-contrast-mode select:focus {
          border-color: #facc15 !important;
          box-shadow: 0 0 0 4px rgba(250, 204, 21, 0.3) !important;
          outline: none !important;
        }
        
        /* Button overrides */
        .high-contrast-mode button {
          border: 2px solid #facc15 !important;
        }
        .high-contrast-mode .bg-gradient-to-r {
          background: #facc15 !important;
          color: #000000 !important;
        }
        .high-contrast-mode .bg-gradient-to-r:hover {
          background: #fde047 !important;
        }
        
        /* Secondary button */
        .high-contrast-mode .border-slate-200.text-slate-600 {
          background-color: transparent !important;
          color: #facc15 !important;
          border-color: #facc15 !important;
        }
        .high-contrast-mode .border-slate-200.text-slate-600:hover {
          background-color: #facc15 !important;
          color: #000000 !important;
        }
        
        /* Badge overrides */
        .high-contrast-mode .bg-blue-100.text-blue-700,
        .high-contrast-mode .bg-emerald-100.text-emerald-700,
        .high-contrast-mode .bg-amber-100.text-amber-700,
        .high-contrast-mode .bg-violet-100.text-violet-700,
        .high-contrast-mode .bg-rose-100.text-rose-700,
        .high-contrast-mode .bg-slate-100.text-slate-700 {
          background-color: #facc15 !important;
          color: #000000 !important;
          border-color: #facc15 !important;
        }
        
        /* Shadow removal in high contrast */
        .high-contrast-mode .shadow-xl,
        .high-contrast-mode .shadow-lg,
        .high-contrast-mode .shadow-md,
        .high-contrast-mode .shadow-sm,
        .high-contrast-mode .shadow {
          box-shadow: none !important;
        }
        
        /* Icon backgrounds */
        .high-contrast-mode .rounded-xl.bg-gradient-to-br,
        .high-contrast-mode .rounded-lg.bg-gradient-to-br,
        .high-contrast-mode .rounded-full.bg-gradient-to-br {
          background: #facc15 !important;
        }
        .high-contrast-mode .rounded-xl.bg-gradient-to-br svg,
        .high-contrast-mode .rounded-lg.bg-gradient-to-br svg,
        .high-contrast-mode .rounded-full.bg-gradient-to-br svg {
          color: #000000 !important;
        }
        
        /* Action button cards */
        .high-contrast-mode .border-blue-100,
        .high-contrast-mode .border-emerald-100,
        .high-contrast-mode .border-violet-100,
        .high-contrast-mode .border-amber-100,
        .high-contrast-mode .border-rose-100,
        .high-contrast-mode .border-cyan-100 {
          border-color: #facc15 !important;
        }
        
        /* Hover states */
        .high-contrast-mode .hover\\:border-blue-400:hover,
        .high-contrast-mode .hover\\:border-emerald-400:hover,
        .high-contrast-mode .hover\\:border-violet-400:hover,
        .high-contrast-mode .hover\\:border-amber-400:hover {
          border-color: #fde047 !important;
          background-color: #262626 !important;
        }
        
        /* Toggle Switch High Contrast */
        .high-contrast-mode .toggle-switch .toggle-enabled {
          background-color: #22c55e !important;
          border: 2px solid #22c55e !important;
        }
        .high-contrast-mode .toggle-switch .toggle-disabled {
          background-color: #374151 !important;
          border: 2px solid #facc15 !important;
        }
        .high-contrast-mode .toggle-switch .toggle-knob {
          background-color: #ffffff !important;
        }
        
        /* Language dropdown high contrast */
        .high-contrast-mode .hover\\:bg-blue-50:hover {
          background-color: #facc15 !important;
          color: #000000 !important;
        }
        
        /* Custom Range Slider Styles */
        input[type="range"] {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          border-radius: 9999px;
          outline: none;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 4px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
          transition: all 0.15s ease;
        }
        
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
        }
        
        input[type="range"]::-webkit-slider-thumb:active {
          transform: scale(0.95);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: 4px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        }
        
        /* High contrast slider styles */
        .high-contrast-mode input[type="range"] {
          background: linear-gradient(to right, #facc15 50%, #374151 50%) !important;
        }
        
        .high-contrast-mode input[type="range"]::-webkit-slider-thumb {
          background: #facc15 !important;
          border-color: #000000 !important;
        }
        
        .high-contrast-mode input[type="range"]::-moz-range-thumb {
          background: #facc15 !important;
          border-color: #000000 !important;
        }
      `}</style>
    </div>
  );
}