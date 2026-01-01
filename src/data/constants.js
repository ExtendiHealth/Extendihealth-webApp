export const STEPS = {
  WELCOME: 1,
  IDENTITY: 2,
  CONFIRMATION: 3,
  TUTORIAL: 4,
  ACCESSIBILITY: 5,
  AI_TRIAGE: 6,
  AI_PREDIAGNOSIS: 7,
  VITALS: 8,
  VIDEO_CALL: 9,
  SANITIZATION: 10,
  SUMMARY: 11,
};

export const CHECK_IN_METHODS = {
  QR: 'qr',
  APPOINTMENT: 'appt',
  DOB: 'dob',
  NEW: 'new'
};

export const SERVICE_TYPES = {
  GENERAL: 'general',
  CHRONIC: 'chronic',
  PRESCRIPTION: 'prescription',
  SPECIALIST: 'specialist'
};

export const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
];
