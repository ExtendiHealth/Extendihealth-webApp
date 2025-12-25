import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Heart, MapPin, Calendar, Clock, ChevronLeft, ChevronRight, Settings, Home, User, FileText, Bell, Globe, Eye, Check, AlertCircle, Navigation, Search, Pill, Activity, Phone, Mail, Shield, LogOut, RefreshCw, Trash2, Info, BookOpen, Video, Folder, FlaskConical, Users, Edit3, X, Download, ExternalLink, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Minus, Camera, Menu, ChevronDown, Printer, Keyboard, Command } from 'lucide-react';

// ============================================================================
// RESPONSIVE BREAKPOINTS & HOOKS
// ============================================================================

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, [matches, query]);

  return matches;
};

const useResponsive = () => {
  const isMobile = useMediaQuery('(max-width: 639px)');
  const isTablet = useMediaQuery('(min-width: 640px) and (max-width: 1023px)');
  const isDesktop = useMediaQuery('(min-width: 1024px)');
  const isLargeDesktop = useMediaQuery('(min-width: 1280px)');

  return { isMobile, isTablet, isDesktop, isLargeDesktop };
};

// Keyboard shortcuts hook
const useKeyboardShortcuts = (shortcuts, enabled = true) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;

      for (const shortcut of shortcuts) {
        const matchCtrl = shortcut.ctrl ? ctrl : !ctrl;
        const matchShift = shortcut.shift ? shift : !shift;
        const matchKey = shortcut.key.toLowerCase() === key;

        if (matchCtrl && matchShift && matchKey) {
          e.preventDefault();
          shortcut.action();
          break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
};

// ============================================================================
// ANIMATED MEDICAL PULSE ICON
// ============================================================================

const AnimatedPulseIcon = ({ size = 64, color = "white" }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className="overflow-visible">
      <path
        d="M 0 50 L 20 50 L 25 50 L 30 20 L 40 80 L 50 35 L 55 55 L 60 45 L 65 50 L 100 50"
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          strokeDasharray: 200,
          strokeDashoffset: 200,
          animation: 'pulse-draw 1.5s ease-in-out infinite',
        }}
      />
      <path
        d="M 0 50 L 20 50 L 25 50 L 30 20 L 40 80 L 50 35 L 55 55 L 60 45 L 65 50 L 100 50"
        fill="none"
        stroke={color}
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.3"
        style={{
          strokeDasharray: 200,
          strokeDashoffset: 200,
          animation: 'pulse-draw 1.5s ease-in-out infinite',
        }}
      />
      <circle r="6" fill={color} style={{ animation: 'pulse-dot 1.5s ease-in-out infinite' }}>
        <animateMotion
          dur="1.5s"
          repeatCount="indefinite"
          path="M 0 50 L 20 50 L 25 50 L 30 20 L 40 80 L 50 35 L 55 55 L 60 45 L 65 50 L 100 50"
        />
      </circle>
      <style>{`
        @keyframes pulse-draw {
          0% { stroke-dashoffset: 200; opacity: 0.5; }
          50% { stroke-dashoffset: 0; opacity: 1; }
          100% { stroke-dashoffset: -200; opacity: 0.5; }
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
      `}</style>
    </svg>
  );
};

// ============================================================================
// HIPAA COMPLIANCE SYSTEM
// ============================================================================

const createAuditLog = (action, details, userId, success = true) => {
  const auditEntry = {
    timestamp: new Date().toISOString(),
    action,
    userId: userId || 'anonymous',
    success,
    details,
    ipAddress: 'xxx.xxx.xxx.xxx',
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
    sessionId: `session_${Date.now()}`,
    complianceFramework: 'HIPAA',
    dataClassification: 'PHI',
  };
  
  console.log('[HIPAA AUDIT LOG]', JSON.stringify(auditEntry, null, 2));
  
  const existingLogs = JSON.parse(sessionStorage.getItem('hipaaAuditLogs') || '[]');
  existingLogs.push(auditEntry);
  sessionStorage.setItem('hipaaAuditLogs', JSON.stringify(existingLogs));
  
  return auditEntry;
};

const PHI_CATEGORIES = {
  labResults: { name: 'Lab Results', sensitivity: 'high', retentionYears: 7 },
  prescriptions: { name: 'Prescriptions', sensitivity: 'high', retentionYears: 7 },
  appointments: { name: 'Visit History', sensitivity: 'medium', retentionYears: 7 },
  documents: { name: 'Medical Documents', sensitivity: 'high', retentionYears: 7 },
  vitals: { name: 'Vitals History', sensitivity: 'medium', retentionYears: 7 },
  healthProfile: { name: 'Health Profile', sensitivity: 'high', retentionYears: 7 },
  records: { name: 'Medical Records', sensitivity: 'high', retentionYears: 7 },
};

const TWO_FA_CONFIG = {
  sessionDurationMs: 15 * 60 * 1000,
  maxAttempts: 3,
  lockoutDurationMs: 30 * 60 * 1000,
  codeLength: 6,
  codeExpiryMs: 5 * 60 * 1000,
};

const PIN_VERIFICATION_CONFIG = {
  maxAttempts: 3,
  lockoutDurationMs: 15 * 60 * 1000,
  pinLength: 4,
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
// DEMO DATA
// ============================================================================

// Initial Demo Data Generator Function (for reset capability)
const generateDemoData = () => {
  const DEMO_USER = {
    id: 'USR-001',
    firstName: 'Jide',
    lastName: 'Okonkwo',
    name: 'Jide Okonkwo',
    email: 'jide@gmail.com',
    phone: '+1 (416) 555-0123',
    alternatePhone: '+1 (416) 555-0456',
    dob: '1985-03-15',
    gender: 'Male',
    healthCard: '1234-567-890-AB',
    healthCardProvince: 'ON',
    address: {
      street: '123 Queen Street West',
      apartment: 'Unit 1205',
      city: 'Toronto',
      province: 'ON',
      postalCode: 'M5H 2M9',
      country: 'Canada',
    },
    emergencyContact: {
      name: 'Amara Okonkwo',
      relationship: 'Spouse',
      phone: '+1 (416) 555-0456',
      email: 'amara.o@gmail.com',
    },
    preferredLanguage: 'en',
    preferredPharmacy: 'Main Street Pharmacy',
    insuranceProvider: 'Sun Life Financial',
    policyNumber: 'SL-789456123',
    groupNumber: 'GRP-TECH-2024',
  };

  const DEMO_HEALTH_SUMMARY = {
    bloodType: 'A+',
    height: "5'10\"",
    weight: '175 lbs',
    bmi: '25.1',
    allergies: ['Penicillin', 'Shellfish', 'Latex'],
    conditions: ['Hypertension (controlled)', 'Hyperlipidemia', 'Seasonal Allergies'],
    surgeries: ['Appendectomy (2010)', 'Wisdom Teeth Extraction (2008)'],
    familyHistory: ['Father: Type 2 Diabetes', 'Mother: Hypertension', 'Grandfather: Heart Disease'],
    immunizations: [
      { name: 'COVID-19 Booster', date: '2024-10-15' },
      { name: 'Flu Shot', date: '2024-09-20' },
      { name: 'Tdap', date: '2022-03-10' },
    ],
    vitalHistory: [
      { date: '2025-12-10', bp: '128/82', hr: 72, temp: '98.4°F', weight: '175 lbs' },
      { date: '2025-11-15', bp: '132/85', hr: 75, temp: '98.6°F', weight: '177 lbs' },
      { date: '2025-10-20', bp: '130/84', hr: 70, temp: '98.2°F', weight: '176 lbs' },
    ],
  };

  const DEMO_APPOINTMENTS = [
    {
      id: 'APT-001',
      type: 'Cardiology Consultation',
      specialty: 'Cardiology',
      doctor: 'Dr. Emily Wang',
      doctorCredentials: 'MD, FRCPC',
      reason: 'Heart murmur follow-up evaluation',
      notes: 'Bring previous ECG results if available',
      status: 'Confirmed',
      date: '2025-12-28',
      time: '10:30 AM',
      duration: 30,
      location: 'ExtendiHealth Kiosk - Toronto General',
      address: '200 Elizabeth St, Toronto, ON',
      kioskId: 3,
      confirmationNumber: 'EH-CARD-2812',
      checkedIn: false,
      visitType: 'In-Person',
      prepInstructions: 'No caffeine 24 hours before appointment. Wear comfortable clothing.',
    },
    {
      id: 'APT-002',
      type: 'Dermatology',
      specialty: 'Dermatology',
      doctor: 'Dr. James Martinez',
      doctorCredentials: 'MD, FAAD',
      reason: 'Skin rash evaluation and treatment',
      notes: 'Persistent rash on forearms for 2 weeks',
      status: 'Scheduled',
      date: '2025-12-30',
      time: '2:00 PM',
      duration: 20,
      location: 'ExtendiHealth Kiosk - Main Street Pharmacy',
      address: '123 Main St, Toronto, ON',
      kioskId: 1,
      confirmationNumber: 'EH-DERM-3012',
      checkedIn: false,
      visitType: 'Virtual',
      prepInstructions: 'Take photos of the affected area before the visit.',
    },
    {
      id: 'APT-003',
      type: 'Lab Work',
      specialty: 'Laboratory',
      doctor: 'Dr. Michelle Chen',
      doctorCredentials: 'MD, CCFP',
      reason: 'Quarterly blood work - Lipid panel & HbA1c',
      notes: 'Fasting required',
      status: 'Scheduled',
      date: '2026-01-05',
      time: '8:00 AM',
      duration: 15,
      location: 'ExtendiHealth Kiosk - Toronto General',
      address: '200 Elizabeth St, Toronto, ON',
      kioskId: 3,
      confirmationNumber: 'EH-LAB-0501',
      checkedIn: false,
      visitType: 'In-Person',
      prepInstructions: 'Fast for 12 hours before appointment. Water is OK.',
    },
    {
      id: 'APT-004',
      type: 'General Checkup',
      specialty: 'Family Medicine',
      doctor: 'Dr. Michelle Chen',
      doctorCredentials: 'MD, CCFP',
      reason: 'Annual physical examination',
      status: 'Completed',
      date: '2025-12-01',
      time: '9:00 AM',
      duration: 45,
      location: 'ExtendiHealth Kiosk - College Health Center',
      address: '789 College St, Toronto, ON',
      kioskId: 4,
      confirmationNumber: 'EH-PHYS-0112',
      checkedIn: true,
      visitType: 'In-Person',
      visitNotes: 'Patient in good overall health. BP slightly elevated. Continue current medications. Follow up in 3 months.',
      diagnosis: ['Essential Hypertension (I10)', 'Hyperlipidemia (E78.5)'],
      prescriptionsIssued: ['Lisinopril 10mg', 'Atorvastatin 20mg'],
    },
    {
      id: 'APT-005',
      type: 'Follow-up',
      specialty: 'Internal Medicine',
      doctor: 'Dr. Robert Kim',
      doctorCredentials: 'MD, FRCPC',
      reason: 'Blood pressure monitoring',
      status: 'Completed',
      date: '2025-11-15',
      time: '11:00 AM',
      duration: 20,
      location: 'ExtendiHealth Kiosk - Community Clinic',
      address: '456 Yonge St, Toronto, ON',
      kioskId: 2,
      confirmationNumber: 'EH-FU-1511',
      checkedIn: true,
      visitType: 'Virtual',
      visitNotes: 'BP improved with medication. Continue current regimen.',
      diagnosis: ['Essential Hypertension (I10) - Controlled'],
    },
    {
      id: 'APT-006',
      type: 'Urgent Care',
      specialty: 'Urgent Care',
      doctor: 'Dr. Sarah Thompson',
      doctorCredentials: 'MD, CCFP-EM',
      reason: 'Upper respiratory infection',
      status: 'Completed',
      date: '2025-10-28',
      time: '3:30 PM',
      duration: 25,
      location: 'ExtendiHealth Kiosk - Main Street Pharmacy',
      address: '123 Main St, Toronto, ON',
      kioskId: 1,
      confirmationNumber: 'EH-UC-2810',
      checkedIn: true,
      visitType: 'Walk-In',
      visitNotes: 'Viral upper respiratory infection. Supportive care recommended. Rest and fluids.',
      diagnosis: ['Acute Upper Respiratory Infection (J06.9)'],
      prescriptionsIssued: ['Amoxicillin 500mg (if symptoms worsen)'],
    },
  ];

  const DEMO_LAB_RESULTS = [
    {
      id: 'LAB-001',
      name: 'Complete Blood Count (CBC)',
      orderDate: '2025-12-08',
      collectionDate: '2025-12-10',
      resultDate: '2025-12-10',
      status: 'Completed',
      orderedBy: 'Dr. Michelle Chen',
      facility: 'LifeLabs Toronto',
      priority: 'Routine',
      results: [
        { name: 'White Blood Cells', value: '7.2', unit: 'x10^9/L', range: '4.5-11.0', status: 'normal' },
        { name: 'Red Blood Cells', value: '4.8', unit: 'x10^12/L', range: '4.0-5.5', status: 'normal' },
        { name: 'Hemoglobin', value: '14.2', unit: 'g/dL', range: '12.0-16.0', status: 'normal' },
        { name: 'Hematocrit', value: '42', unit: '%', range: '36-46', status: 'normal' },
        { name: 'Platelets', value: '245', unit: 'x10^9/L', range: '150-400', status: 'normal' },
        { name: 'MCV', value: '88', unit: 'fL', range: '80-100', status: 'normal' },
        { name: 'MCH', value: '29.5', unit: 'pg', range: '27-33', status: 'normal' },
      ],
      interpretation: 'All values within normal limits. No concerns.',
    },
    {
      id: 'LAB-002',
      name: 'Lipid Panel',
      orderDate: '2025-12-08',
      collectionDate: '2025-12-10',
      resultDate: '2025-12-10',
      status: 'Completed',
      orderedBy: 'Dr. Michelle Chen',
      facility: 'LifeLabs Toronto',
      priority: 'Routine',
      results: [
        { name: 'Total Cholesterol', value: '215', unit: 'mg/dL', range: '<200', status: 'high' },
        { name: 'LDL Cholesterol', value: '138', unit: 'mg/dL', range: '<100', status: 'high' },
        { name: 'HDL Cholesterol', value: '52', unit: 'mg/dL', range: '>40', status: 'normal' },
        { name: 'Triglycerides', value: '125', unit: 'mg/dL', range: '<150', status: 'normal' },
        { name: 'VLDL', value: '25', unit: 'mg/dL', range: '<30', status: 'normal' },
      ],
      interpretation: 'LDL elevated. Continue statin therapy. Dietary modifications recommended.',
      doctorComments: 'Cholesterol improved from last visit but still elevated. Continue Atorvastatin 20mg.',
    },
    {
      id: 'LAB-003',
      name: 'Basic Metabolic Panel (BMP)',
      orderDate: '2025-12-08',
      collectionDate: '2025-12-10',
      resultDate: '2025-12-10',
      status: 'Completed',
      orderedBy: 'Dr. Michelle Chen',
      facility: 'LifeLabs Toronto',
      priority: 'Routine',
      results: [
        { name: 'Glucose (Fasting)', value: '98', unit: 'mg/dL', range: '70-100', status: 'normal' },
        { name: 'BUN', value: '15', unit: 'mg/dL', range: '7-20', status: 'normal' },
        { name: 'Creatinine', value: '0.9', unit: 'mg/dL', range: '0.6-1.2', status: 'normal' },
        { name: 'eGFR', value: '95', unit: 'mL/min', range: '>60', status: 'normal' },
        { name: 'Sodium', value: '140', unit: 'mEq/L', range: '136-145', status: 'normal' },
        { name: 'Potassium', value: '4.2', unit: 'mEq/L', range: '3.5-5.0', status: 'normal' },
        { name: 'Chloride', value: '102', unit: 'mEq/L', range: '98-106', status: 'normal' },
        { name: 'CO2', value: '24', unit: 'mEq/L', range: '23-29', status: 'normal' },
      ],
      interpretation: 'Kidney function normal. Electrolytes balanced.',
    },
    {
      id: 'LAB-004',
      name: 'HbA1c',
      orderDate: '2025-11-20',
      collectionDate: '2025-11-25',
      resultDate: '2025-11-25',
      status: 'Completed',
      orderedBy: 'Dr. Robert Kim',
      facility: 'LifeLabs Toronto',
      priority: 'Routine',
      results: [
        { name: 'Hemoglobin A1c', value: '5.6', unit: '%', range: '<5.7', status: 'normal' },
        { name: 'Estimated Avg Glucose', value: '114', unit: 'mg/dL', range: '-', status: 'normal' },
      ],
      interpretation: 'No diabetes. Continue healthy lifestyle.',
    },
    {
      id: 'LAB-005',
      name: 'Thyroid Panel',
      orderDate: '2025-11-20',
      collectionDate: '2025-11-25',
      resultDate: '2025-11-25',
      status: 'Completed',
      orderedBy: 'Dr. Robert Kim',
      facility: 'LifeLabs Toronto',
      priority: 'Routine',
      results: [
        { name: 'TSH', value: '2.1', unit: 'mIU/L', range: '0.4-4.0', status: 'normal' },
        { name: 'Free T4', value: '1.2', unit: 'ng/dL', range: '0.8-1.8', status: 'normal' },
        { name: 'Free T3', value: '3.1', unit: 'pg/mL', range: '2.3-4.2', status: 'normal' },
      ],
      interpretation: 'Thyroid function normal.',
    },
    {
      id: 'LAB-006',
      name: 'Urinalysis',
      orderDate: '2025-12-08',
      collectionDate: '2025-12-10',
      resultDate: '2025-12-10',
      status: 'Completed',
      orderedBy: 'Dr. Michelle Chen',
      facility: 'LifeLabs Toronto',
      priority: 'Routine',
      results: [
        { name: 'Color', value: 'Yellow', unit: '-', range: 'Yellow', status: 'normal' },
        { name: 'Clarity', value: 'Clear', unit: '-', range: 'Clear', status: 'normal' },
        { name: 'pH', value: '6.0', unit: '-', range: '4.5-8.0', status: 'normal' },
        { name: 'Specific Gravity', value: '1.015', unit: '-', range: '1.005-1.030', status: 'normal' },
        { name: 'Protein', value: 'Negative', unit: '-', range: 'Negative', status: 'normal' },
        { name: 'Glucose', value: 'Negative', unit: '-', range: 'Negative', status: 'normal' },
      ],
      interpretation: 'Normal urinalysis. No abnormalities detected.',
    },
    {
      id: 'LAB-007',
      name: 'Lipid Panel - Follow-up',
      orderDate: '2025-12-20',
      status: 'Pending Collection',
      orderedBy: 'Dr. Michelle Chen',
      facility: 'LifeLabs Toronto',
      priority: 'Routine',
      scheduledDate: '2026-01-05',
      prepInstructions: 'Fast for 12 hours before collection',
    },
  ];

  const DEMO_PRESCRIPTIONS = [
    {
      id: 'RX-001',
      name: 'Lisinopril',
      genericName: 'Lisinopril',
      brandName: 'Prinivil',
      dosage: '10mg',
      form: 'Tablet',
      frequency: 'Once daily in the morning',
      quantity: 30,
      daysSupply: 30,
      refillsRemaining: 5,
      refillsTotal: 6,
      prescribedBy: 'Dr. Robert Kim',
      prescribedDate: '2025-11-15',
      lastFilled: '2025-12-01',
      nextRefillDate: '2025-12-28',
      expiryDate: '2026-11-15',
      pharmacy: {
        name: 'Main Street Pharmacy',
        address: '123 Main St, Toronto, ON',
        phone: '+1 (416) 555-1234',
        fax: '+1 (416) 555-1235',
      },
      status: 'Active',
      din: '02242963',
      instructions: 'Take one tablet by mouth once daily in the morning with or without food. May cause dizziness - rise slowly from sitting/lying position.',
      warnings: ['May cause dizziness', 'Avoid potassium supplements', 'Report persistent cough'],
      forCondition: 'Hypertension',
      isControlled: false,
      autoRefill: true,
    },
    {
      id: 'RX-002',
      name: 'Atorvastatin',
      genericName: 'Atorvastatin Calcium',
      brandName: 'Lipitor',
      dosage: '20mg',
      form: 'Tablet',
      frequency: 'Once daily at bedtime',
      quantity: 30,
      daysSupply: 30,
      refillsRemaining: 5,
      refillsTotal: 6,
      prescribedBy: 'Dr. Michelle Chen',
      prescribedDate: '2025-12-10',
      lastFilled: '2025-12-10',
      nextRefillDate: '2026-01-07',
      expiryDate: '2026-12-10',
      pharmacy: {
        name: 'Main Street Pharmacy',
        address: '123 Main St, Toronto, ON',
        phone: '+1 (416) 555-1234',
      },
      status: 'Active',
      din: '02230711',
      instructions: 'Take one tablet by mouth at bedtime. Avoid grapefruit and grapefruit juice.',
      warnings: ['Avoid grapefruit', 'Report muscle pain or weakness', 'Avoid excessive alcohol'],
      forCondition: 'Hyperlipidemia',
      isControlled: false,
      autoRefill: true,
    },
    {
      id: 'RX-003',
      name: 'Amoxicillin',
      genericName: 'Amoxicillin',
      brandName: 'Amoxil',
      dosage: '500mg',
      form: 'Capsule',
      frequency: 'Three times daily',
      quantity: 21,
      daysSupply: 7,
      refillsRemaining: 0,
      refillsTotal: 0,
      prescribedBy: 'Dr. Sarah Thompson',
      prescribedDate: '2025-10-28',
      lastFilled: '2025-10-28',
      nextRefillDate: null,
      expiryDate: '2025-11-28',
      pharmacy: {
        name: 'Main Street Pharmacy',
        address: '123 Main St, Toronto, ON',
        phone: '+1 (416) 555-1234',
      },
      status: 'Completed',
      din: '00406716',
      instructions: 'Take one capsule by mouth three times daily with or without food. Complete the full 7-day course even if feeling better.',
      warnings: ['Complete full course', 'May cause diarrhea', 'Discontinue if rash develops'],
      forCondition: 'Upper Respiratory Infection',
      isControlled: false,
      autoRefill: false,
    },
    {
      id: 'RX-004',
      name: 'Cetirizine',
      genericName: 'Cetirizine Hydrochloride',
      brandName: 'Reactine',
      dosage: '10mg',
      form: 'Tablet',
      frequency: 'Once daily as needed',
      quantity: 30,
      daysSupply: 30,
      refillsRemaining: 11,
      refillsTotal: 12,
      prescribedBy: 'Dr. Michelle Chen',
      prescribedDate: '2025-04-15',
      lastFilled: '2025-11-01',
      nextRefillDate: '2025-12-01',
      expiryDate: '2026-04-15',
      pharmacy: {
        name: 'Main Street Pharmacy',
        address: '123 Main St, Toronto, ON',
        phone: '+1 (416) 555-1234',
      },
      status: 'Active',
      din: '02242076',
      instructions: 'Take one tablet by mouth once daily for allergy symptoms. May cause drowsiness.',
      warnings: ['May cause drowsiness', 'Avoid alcohol'],
      forCondition: 'Seasonal Allergies',
      isControlled: false,
      autoRefill: false,
    },
    {
      id: 'RX-005',
      name: 'Vitamin D3',
      genericName: 'Cholecalciferol',
      brandName: 'D-Drops',
      dosage: '1000 IU',
      form: 'Softgel',
      frequency: 'Once daily with food',
      quantity: 90,
      daysSupply: 90,
      refillsRemaining: 3,
      refillsTotal: 4,
      prescribedBy: 'Dr. Michelle Chen',
      prescribedDate: '2025-03-01',
      lastFilled: '2025-12-01',
      nextRefillDate: '2026-02-28',
      expiryDate: '2026-03-01',
      pharmacy: {
        name: 'Main Street Pharmacy',
        address: '123 Main St, Toronto, ON',
        phone: '+1 (416) 555-1234',
      },
      status: 'Active',
      din: '80012345',
      instructions: 'Take one softgel by mouth once daily with food.',
      warnings: [],
      forCondition: 'Vitamin D Deficiency Prevention',
      isControlled: false,
      autoRefill: true,
    },
  ];

  const DEMO_REFERRALS = [
    {
      id: 'REF-001',
      type: 'Specialist Referral',
      specialty: 'Cardiology',
      referredTo: 'Dr. Emily Wang',
      referredToCredentials: 'MD, FRCPC, Cardiologist',
      referredToFacility: 'Toronto Heart Clinic',
      referredToAddress: '200 Elizabeth St, Suite 400, Toronto, ON',
      referredToPhone: '+1 (416) 555-7890',
      referredBy: 'Dr. Michelle Chen',
      referralDate: '2025-12-01',
      reason: 'Heart murmur detected during annual physical. Requires echocardiogram and specialist evaluation.',
      priority: 'Routine',
      status: 'Appointment Scheduled',
      appointmentDate: '2025-12-28',
      appointmentTime: '10:30 AM',
      notes: 'Patient has no cardiac symptoms. Murmur noted as Grade II/VI systolic at left sternal border.',
      documents: ['Referral Letter', 'ECG Results', 'Physical Exam Notes'],
    },
    {
      id: 'REF-002',
      type: 'Specialist Referral',
      specialty: 'Dermatology',
      referredTo: 'Dr. James Martinez',
      referredToCredentials: 'MD, FAAD, Dermatologist',
      referredToFacility: 'Toronto Skin Care Centre',
      referredToAddress: '789 Bay St, Toronto, ON',
      referredToPhone: '+1 (416) 555-4567',
      referredBy: 'Dr. Michelle Chen',
      referralDate: '2025-12-15',
      reason: 'Persistent rash on forearms for 2 weeks. Not responding to OTC treatment.',
      priority: 'Urgent',
      status: 'Appointment Scheduled',
      appointmentDate: '2025-12-30',
      appointmentTime: '2:00 PM',
      notes: 'Possible contact dermatitis or eczema. Photos attached.',
      documents: ['Referral Letter', 'Clinical Photos'],
    },
    {
      id: 'REF-003',
      type: 'Imaging Referral',
      specialty: 'Diagnostic Imaging',
      referredTo: 'Ontario Diagnostic Imaging',
      referredToFacility: 'ODI - Downtown Location',
      referredToAddress: '500 University Ave, Toronto, ON',
      referredToPhone: '+1 (416) 555-2222',
      referredBy: 'Dr. Robert Kim',
      referralDate: '2025-11-10',
      reason: 'Chest X-ray for baseline imaging - patient with hypertension',
      priority: 'Routine',
      status: 'Completed',
      completedDate: '2025-11-18',
      results: 'Normal chest X-ray. No cardiopulmonary abnormalities.',
      documents: ['Referral Letter', 'Imaging Report'],
    },
    {
      id: 'REF-004',
      type: 'Specialist Referral',
      specialty: 'Ophthalmology',
      referredTo: 'Dr. Linda Park',
      referredToCredentials: 'MD, FRCSC, Ophthalmologist',
      referredToFacility: 'Clear Vision Eye Centre',
      referredToAddress: '100 Bloor St W, Toronto, ON',
      referredToPhone: '+1 (416) 555-3333',
      referredBy: 'Dr. Michelle Chen',
      referralDate: '2025-12-01',
      reason: 'Annual diabetic eye screening - patient with hypertension and hyperlipidemia',
      priority: 'Routine',
      status: 'Pending Appointment',
      notes: 'Routine screening recommended given cardiovascular risk factors.',
      documents: ['Referral Letter'],
    },
  ];

  const DEMO_WAITING_ROOM = {
    isActive: false,
    queuePosition: null,
    estimatedWait: null,
    kiosk: null,
    joinedAt: null,
    appointmentType: null,
    reason: null,
    notificationsSent: [],
  };

  const DEMO_VISIT_HISTORY = [
    {
      id: 'VISIT-001',
      date: '2025-12-01',
      type: 'Annual Physical',
      provider: 'Dr. Michelle Chen',
      facility: 'ExtendiHealth Kiosk - College Health Center',
      chiefComplaint: 'Annual wellness examination',
      vitals: { bp: '128/82', hr: 72, temp: '98.4°F', weight: '175 lbs', height: '5\'10"' },
      diagnosis: ['Essential Hypertension (I10)', 'Hyperlipidemia (E78.5)'],
      treatment: 'Continue current medications. Lifestyle modifications discussed.',
      prescriptions: ['Lisinopril 10mg', 'Atorvastatin 20mg'],
      labsOrdered: ['CBC', 'Lipid Panel', 'BMP', 'Urinalysis'],
      referrals: ['Cardiology - Heart murmur evaluation', 'Ophthalmology - Eye screening'],
      followUp: '3 months',
      notes: 'Patient in good overall health. BP slightly elevated but improved from last visit. Continue monitoring.',
    },
    {
      id: 'VISIT-002',
      date: '2025-11-15',
      type: 'Follow-up Visit',
      provider: 'Dr. Robert Kim',
      facility: 'ExtendiHealth Kiosk - Community Clinic (Virtual)',
      chiefComplaint: 'Blood pressure monitoring follow-up',
      vitals: { bp: '132/85', hr: 75 },
      diagnosis: ['Essential Hypertension (I10) - Controlled'],
      treatment: 'Continue Lisinopril 10mg daily. Maintain low sodium diet.',
      prescriptions: [],
      labsOrdered: ['HbA1c', 'Thyroid Panel'],
      referrals: [],
      followUp: '1 month',
      notes: 'BP improved with medication. Patient adhering to treatment plan.',
    },
    {
      id: 'VISIT-003',
      date: '2025-10-28',
      type: 'Urgent Care Visit',
      provider: 'Dr. Sarah Thompson',
      facility: 'ExtendiHealth Kiosk - Main Street Pharmacy',
      chiefComplaint: 'Cough, congestion, sore throat for 3 days',
      vitals: { bp: '125/80', hr: 78, temp: '99.8°F' },
      diagnosis: ['Acute Upper Respiratory Infection (J06.9)'],
      treatment: 'Supportive care. Rest, fluids, OTC medications for symptom relief.',
      prescriptions: ['Amoxicillin 500mg - if symptoms worsen'],
      labsOrdered: [],
      referrals: [],
      followUp: 'As needed',
      notes: 'Viral URI likely. Antibiotic prescribed as safety net if bacterial superinfection develops.',
    },
  ];

  const DEMO_DOCUMENTS = [
    {
      id: 'DOC-001',
      name: 'Annual Physical Report 2025',
      type: 'Visit Summary',
      date: '2025-12-01',
      provider: 'Dr. Michelle Chen',
      category: 'Visit Notes',
      size: '245 KB',
    },
    {
      id: 'DOC-002',
      name: 'Lab Results - December 2025',
      type: 'Lab Report',
      date: '2025-12-10',
      provider: 'LifeLabs Toronto',
      category: 'Lab Results',
      size: '180 KB',
    },
    {
      id: 'DOC-003',
      name: 'Cardiology Referral Letter',
      type: 'Referral',
      date: '2025-12-01',
      provider: 'Dr. Michelle Chen',
      category: 'Referrals',
      size: '95 KB',
    },
    {
      id: 'DOC-004',
      name: 'Prescription Summary - Active Medications',
      type: 'Prescription',
      date: '2025-12-15',
      provider: 'ExtendiHealth',
      category: 'Prescriptions',
      size: '120 KB',
    },
    {
      id: 'DOC-005',
      name: 'Immunization Record',
      type: 'Immunization',
      date: '2024-10-15',
      provider: 'Public Health Ontario',
      category: 'Immunizations',
      size: '85 KB',
    },
    {
      id: 'DOC-006',
      name: 'Chest X-ray Report',
      type: 'Imaging',
      date: '2025-11-18',
      provider: 'Ontario Diagnostic Imaging',
      category: 'Imaging',
      size: '1.2 MB',
    },
  ];

  const DEMO_NOTIFICATIONS = [
    {
      id: 'NOTIF-001',
      type: 'appointment_reminder',
      title: 'Upcoming Appointment',
      message: 'Your cardiology appointment with Dr. Emily Wang is in 3 days (Dec 28 at 10:30 AM)',
      date: '2025-12-25',
      read: false,
      actionable: true,
      action: 'View Appointment',
    },
    {
      id: 'NOTIF-002',
      type: 'prescription_refill',
      title: 'Prescription Ready for Refill',
      message: 'Your Lisinopril prescription is due for refill on Dec 28',
      date: '2025-12-23',
      read: false,
      actionable: true,
      action: 'Request Refill',
    },
    {
      id: 'NOTIF-003',
      type: 'lab_results',
      title: 'Lab Results Available',
      message: 'Your lab results from Dec 10 are now available to view',
      date: '2025-12-10',
      read: true,
      actionable: true,
      action: 'View Results',
    },
    {
      id: 'NOTIF-004',
      type: 'referral_update',
      title: 'Referral Appointment Confirmed',
      message: 'Your dermatology appointment with Dr. Martinez has been scheduled for Dec 30',
      date: '2025-12-16',
      read: true,
      actionable: true,
      action: 'View Details',
    },
    {
      id: 'NOTIF-005',
      type: 'health_reminder',
      title: 'Health Tip',
      message: 'Remember to take your medications at the same time each day for best results',
      date: '2025-12-20',
      read: true,
      actionable: false,
    },
  ];

  return {
    user: DEMO_USER,
    healthSummary: DEMO_HEALTH_SUMMARY,
    appointments: DEMO_APPOINTMENTS,
    labResults: DEMO_LAB_RESULTS,
    prescriptions: DEMO_PRESCRIPTIONS,
    referrals: DEMO_REFERRALS,
    waitingRoom: DEMO_WAITING_ROOM,
    visitHistory: DEMO_VISIT_HISTORY,
    documents: DEMO_DOCUMENTS,
    notifications: DEMO_NOTIFICATIONS,
  };
};

// Export static demo data for initial state
const INITIAL_DEMO_DATA = generateDemoData();
const DEMO_USER = INITIAL_DEMO_DATA.user;
const DEMO_APPOINTMENTS = INITIAL_DEMO_DATA.appointments;
const DEMO_LAB_RESULTS = INITIAL_DEMO_DATA.labResults;
const DEMO_PRESCRIPTIONS = INITIAL_DEMO_DATA.prescriptions;
const DEMO_HEALTH_SUMMARY = INITIAL_DEMO_DATA.healthSummary;
const DEMO_REFERRALS = INITIAL_DEMO_DATA.referrals;
const DEMO_WAITING_ROOM = INITIAL_DEMO_DATA.waitingRoom;
const DEMO_VISIT_HISTORY = INITIAL_DEMO_DATA.visitHistory;
const DEMO_DOCUMENTS = INITIAL_DEMO_DATA.documents;
const DEMO_NOTIFICATIONS = INITIAL_DEMO_DATA.notifications;

const KIOSKS = [
  { 
    id: 1, 
    name: 'ExtendiHealth Kiosk - Main Street Pharmacy', 
    address: '123 Main St, Toronto, ON',
    postalCode: 'M5V 2K1',
    distance: 0.4, 
    wait: 15,
    hours: '9:00 AM - 9:00 PM',
    isOpen: true,
    type: 'Pharmacy Kiosk',
    services: ['Vitals', 'Virtual Visit', 'e-Prescription'],
    walkInStatus: 'Moderate wait (10-20 min)',
    lat: 43.6532,
    lng: -79.3832,
    phone: '+1 (416) 555-1234',
    email: 'mainstreet@extendihealth.com',
    rating: 4.8,
    reviews: 127,
    amenities: ['Wheelchair Accessible', 'Free Parking', 'Private Booth'],
    nextAvailable: '10:30 AM Today',
    providers: ['Dr. Sarah Chen', 'Dr. Michael Park', 'NP Lisa Wong'],
    languages: ['English', 'French', 'Mandarin'],
  },
  { 
    id: 2, 
    name: 'ExtendiHealth Kiosk - Community Clinic', 
    address: '456 Yonge St, Toronto, ON',
    postalCode: 'M4Y 1X5',
    distance: 1.2, 
    wait: 8,
    hours: '8:00 AM - 5:00 PM',
    isOpen: true,
    type: 'Clinic Kiosk',
    services: ['Vitals', 'Referrals', 'Lab Work'],
    walkInStatus: 'Short wait (5-10 min)',
    lat: 43.6612,
    lng: -79.3842,
    phone: '+1 (416) 555-2345',
    email: 'community@extendihealth.com',
    rating: 4.6,
    reviews: 89,
    amenities: ['Wheelchair Accessible', 'Transit Nearby'],
    nextAvailable: '11:00 AM Today',
    providers: ['Dr. James Wilson', 'NP Rebecca Adams'],
    languages: ['English', 'Spanish'],
  },
  { 
    id: 3, 
    name: 'ExtendiHealth Kiosk - Toronto General', 
    address: '200 Elizabeth St, Toronto, ON',
    postalCode: 'M5G 2C4',
    distance: 2.1, 
    wait: 10,
    hours: '24 Hours',
    isOpen: true,
    type: 'Hospital Lobby Kiosk',
    services: ['Vitals', 'Virtual Visit', 'e-Prescription', 'Lab Work', 'Specialist Consult'],
    walkInStatus: 'Short wait (5-10 min)',
    lat: 43.6595,
    lng: -79.3882,
    phone: '+1 (416) 555-3456',
    email: 'tgh@extendihealth.com',
    rating: 4.9,
    reviews: 256,
    amenities: ['Wheelchair Accessible', 'Paid Parking', 'Private Booth', 'Interpreter Services'],
    nextAvailable: '9:45 AM Today',
    providers: ['Dr. Emily Wang', 'Dr. Robert Kim', 'Dr. Michelle Chen', 'NP David Brown'],
    languages: ['English', 'French', 'Mandarin', 'Cantonese', 'Tamil'],
  },
  { 
    id: 4, 
    name: 'ExtendiHealth Kiosk - College Health Center', 
    address: '789 College St, Toronto, ON',
    postalCode: 'M6G 1C5',
    distance: 1.8, 
    wait: 20,
    hours: '7:00 AM - 10:00 PM',
    isOpen: true,
    type: 'Clinic Kiosk',
    services: ['Vitals', 'Virtual Visit', 'Referrals'],
    walkInStatus: 'Moderate wait (10-20 min)',
    lat: 43.6542,
    lng: -79.4152,
    phone: '+1 (416) 555-4567',
    email: 'college@extendihealth.com',
    rating: 4.5,
    reviews: 73,
    amenities: ['Wheelchair Accessible', 'Street Parking'],
    nextAvailable: '2:00 PM Today',
    providers: ['Dr. Amanda Foster', 'NP Kevin Lee'],
    languages: ['English', 'Korean', 'Portuguese'],
  },
  { 
    id: 5, 
    name: 'ExtendiHealth Kiosk - Muskoka Rural Health', 
    address: '45 Pioneer Rd, Huntsville, ON',
    postalCode: 'P1H 1M1',
    distance: 180.0, 
    wait: 5,
    hours: '9:00 AM - 6:00 PM',
    isOpen: true,
    type: 'Rural Pop-up Kiosk',
    services: ['Vitals', 'Virtual Visit', 'e-Prescription', 'Specialist Consult'],
    walkInStatus: 'No wait',
    lat: 45.3271,
    lng: -79.2169,
    phone: '+1 (705) 555-5678',
    email: 'muskoka@extendihealth.com',
    rating: 4.7,
    reviews: 42,
    amenities: ['Wheelchair Accessible', 'Free Parking', 'Private Room'],
    nextAvailable: 'Now',
    providers: ['Dr. Thomas Green', 'NP Sandra White'],
    languages: ['English', 'French'],
  },
];

const VISIT_REASONS = [
  { id: 'general', title: 'General Assessment', subtitle: 'Health check, minor concerns', icon: Activity },
  { id: 'chronic', title: 'Chronic Urgent Review', subtitle: 'Diabetes, hypertension flare-up', icon: Clock },
  { id: 'prescription', title: 'Prescription Request/Refill', subtitle: 'Renew or request medications', icon: Pill },
  { id: 'specialist', title: 'Specialist Consult (Virtual)', subtitle: 'Remote specialist video visit', icon: Video },
];

const GET_CARE_REASONS = [
  { id: 'sick', title: 'I feel sick / have symptoms' },
  { id: 'chronic', title: 'I have a chronic condition flare-up' },
  { id: 'question', title: 'I have a question about my health' },
  { id: 'prescription', title: 'I need a prescription renewal' },
  { id: 'specialist', title: 'I need a specialist consultation' },
  { id: 'followup', title: 'I need a follow-up on a previous visit' },
];

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const generateAppointmentNumber = () => {
  const prefix = 'EH';
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${random}`;
};

const calculateLeaveTime = (appointmentTime, distance) => {
  const [time, period] = appointmentTime.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  let hour24 = hours;
  if (period === 'PM' && hours !== 12) hour24 += 12;
  if (period === 'AM' && hours === 12) hour24 = 0;
  
  const travelMinutes = Math.round((distance || 1) * 10) + 5;
  const totalMinutes = hour24 * 60 + minutes - travelMinutes;
  
  const leaveHour = Math.floor(totalMinutes / 60);
  const leaveMinute = totalMinutes % 60;
  const leavePeriod = leaveHour >= 12 ? 'PM' : 'AM';
  const displayHour = leaveHour > 12 ? leaveHour - 12 : (leaveHour === 0 ? 12 : leaveHour);
  
  return `${displayHour}:${leaveMinute.toString().padStart(2, '0')} ${leavePeriod}`;
};

// ============================================================================
// BASE UI COMPONENTS
// ============================================================================

const Button = ({ children, variant = 'primary', size = 'md', disabled, onClick, className = '', type = 'button' }) => {
  const baseStyles = 'font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer';
  const variants = {
    primary: 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-lg shadow-cyan-500/30 hover:shadow-cyan-500/50 active:scale-98',
    secondary: 'bg-white border-2 border-cyan-500 text-cyan-600 hover:bg-cyan-50',
    ghost: 'bg-transparent text-cyan-600 hover:bg-cyan-50',
    danger: 'bg-red-50 text-red-500 hover:bg-red-100',
    success: 'bg-green-500 text-white hover:bg-green-600',
  };
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '', onClick, hover = true }) => (
  <div
    onClick={onClick}
    className={`bg-white rounded-2xl shadow-sm border border-gray-100 ${onClick && hover ? 'cursor-pointer hover:shadow-md transition-shadow' : ''} ${className}`}
  >
    {children}
  </div>
);

const Toggle = ({ enabled, onChange }) => (
  <button
    onClick={() => onChange(!enabled)}
    className={`relative w-14 h-8 rounded-full transition-colors duration-200 ${enabled ? 'bg-cyan-500' : 'bg-gray-200'}`}
  >
    <span
      className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-transform duration-200 ${enabled ? 'translate-x-7' : 'translate-x-1'}`}
    />
  </button>
);

const Badge = ({ children, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-yellow-100 text-yellow-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-cyan-100 text-cyan-700',
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

// ============================================================================
// BREADCRUMB NAVIGATION
// ============================================================================

const SCREEN_NAMES = {
  landing: 'Welcome',
  login: 'Sign In',
  createAccount: 'Create Account',
  newPatientOnboarding: 'Patient Registration',
  dashboard: 'Dashboard',
  care: 'Get Care',
  getCareReason: 'Select Reason',
  describeSymptoms: 'Describe Symptoms',
  quickQuestions: 'Quick Questions',
  aiPreDiagnosis: 'AI Assessment',
  selectReason: 'Select Reason',
  selectKiosk: 'Select Kiosk',
  kiosks: 'Find Kiosks',
  kioskDetails: 'Kiosk Details',
  bookKioskVisit: 'Book Visit',
  kioskAppointmentConfirmed: 'Confirmed',
  kioskCheckIn: 'Kiosk Check-In',
  selectDateTime: 'Select Date & Time',
  reviewAppointment: 'Review',
  appointmentConfirmed: 'Confirmed',
  waitingRoom: 'Waiting Room',
  eWaitingRoom: 'e-Waiting Room',
  checkIn: 'Check In',
  virtualVisit: 'Virtual Visit',
  visitSummaryComplete: 'Visit Complete',
  appointments: 'Appointments',
  pharmacy: 'Pharmacy',
  labResults: 'Lab Results',
  profile: 'Profile',
  editProfile: 'Edit Profile',
  emergencyContacts: 'Emergency Contacts',
  settings: 'Settings',
  records: 'Records',
  documents: 'Documents',
  visitSummary: 'Visit Summary',
  visitHistory: 'Visit History',
  notifications: 'Notifications',
  walkIn: 'Walk-In',
  whatToExpect: 'What to Expect',
  prescriptionTracking: 'Prescription Status',
  referralTracking: 'Referral Status',
  referrals: 'My Referrals',
};

const getBreadcrumbTrail = (screen, bookingFlow) => {
  const trails = {
    landing: [],
    login: [{ screen: 'landing', name: 'Home' }],
    createAccount: [{ screen: 'landing', name: 'Home' }],
    newPatientOnboarding: [{ screen: 'landing', name: 'Home' }],
    dashboard: [],
    care: [{ screen: 'dashboard', name: 'Dashboard' }],
    getCareReason: [{ screen: 'dashboard', name: 'Dashboard' }],
    describeSymptoms: [{ screen: 'dashboard', name: 'Dashboard' }, { screen: 'getCareReason', name: 'Get Care' }],
    quickQuestions: [{ screen: 'dashboard', name: 'Dashboard' }, { screen: 'getCareReason', name: 'Get Care' }, { screen: 'describeSymptoms', name: 'Symptoms' }],
    aiPreDiagnosis: [{ screen: 'dashboard', name: 'Dashboard' }, { screen: 'getCareReason', name: 'Get Care' }],
    selectReason: [{ screen: 'dashboard', name: 'Dashboard' }],
    selectKiosk: [{ screen: 'dashboard', name: 'Dashboard' }, { screen: bookingFlow?.type === 'getCareNow' ? 'getCareReason' : 'selectReason', name: 'Select Reason' }],
    kiosks: [{ screen: 'dashboard', name: 'Dashboard' }],
    kioskDetails: [{ screen: 'dashboard', name: 'Dashboard' }, { screen: 'kiosks', name: 'Kiosks' }],
    bookKioskVisit: [{ screen: 'dashboard', name: 'Dashboard' }, { screen: 'selectKiosk', name: 'Select Kiosk' }],
    kioskAppointmentConfirmed: [{ screen: 'dashboard', name: 'Dashboard' }],
    waitingRoom: [{ screen: 'dashboard', name: 'Dashboard' }],
    checkIn: [{ screen: 'dashboard', name: 'Dashboard' }, { screen: 'waitingRoom', name: 'Waiting Room' }],
    appointments: [{ screen: 'dashboard', name: 'Dashboard' }],
    pharmacy: [{ screen: 'dashboard', name: 'Dashboard' }],
    labResults: [{ screen: 'dashboard', name: 'Dashboard' }],
    profile: [{ screen: 'dashboard', name: 'Dashboard' }],
    editProfile: [{ screen: 'dashboard', name: 'Dashboard' }, { screen: 'profile', name: 'Profile' }],
    emergencyContacts: [{ screen: 'dashboard', name: 'Dashboard' }, { screen: 'profile', name: 'Profile' }],
    settings: [{ screen: 'dashboard', name: 'Dashboard' }],
    records: [{ screen: 'dashboard', name: 'Dashboard' }],
    documents: [{ screen: 'dashboard', name: 'Dashboard' }, { screen: 'records', name: 'Records' }],
    notifications: [{ screen: 'dashboard', name: 'Dashboard' }],
  };
  
  return trails[screen] || [{ screen: 'dashboard', name: 'Dashboard' }];
};

const Breadcrumbs = ({ screen, bookingFlow, onNavigate }) => {
  const trail = getBreadcrumbTrail(screen, bookingFlow);
  const currentName = SCREEN_NAMES[screen] || screen;
  
  if (trail.length === 0 && screen === 'dashboard') return null;
  
  return (
    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-4 print:hidden">
      {trail.map((item, index) => (
        <React.Fragment key={item.screen}>
          <button
            onClick={() => onNavigate(item.screen)}
            className="hover:text-cyan-600 transition-colors"
          >
            {item.name}
          </button>
          <ChevronRight className="w-4 h-4" />
        </React.Fragment>
      ))}
      <span className="text-gray-900 font-medium">{currentName}</span>
    </nav>
  );
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

// ============================================================================
// SIDEBAR NAVIGATION (Desktop)
// ============================================================================

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
    { icon: Bell, label: 'Notifications', screen: 'notifications' },
    { icon: Settings, label: 'Settings', screen: 'settings' },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center">
            <AnimatedPulseIcon size={24} color="white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">ExtendiHealth</h1>
            <p className="text-xs text-gray-500">Patient Portal</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
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

      {/* User Info */}
      {user && (
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white font-bold">
              {user.name?.charAt(0) || 'U'}
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

  // Mobile: Overlay sidebar
  if (isMobile) {
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
        )}
        <aside
          className={`fixed inset-y-0 left-0 w-72 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
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

// ============================================================================
// TOP HEADER (Desktop)
// ============================================================================

const TopHeader = ({ 
  user, 
  onMenuClick, 
  onSearch, 
  onNotifications, 
  onSettings, 
  onSignOut,
  screen,
  bookingFlow,
  onNavigate,
  notificationCount = 2,
  twoFASession,
}) => {
  const { isMobile, isDesktop } = useResponsive();
  const [showUserMenu, setShowUserMenu] = useState(false);

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
          {twoFASession?.isVerified && twoFASession?.sessionExpiresAt && (
            <TwoFASessionBadge 
              sessionExpiresAt={twoFASession.sessionExpiresAt}
              onSessionExpired={() => {}}
            />
          )}

          {/* Search (desktop) */}
          {isDesktop && (
            <button
              onClick={onSearch}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Search className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-500">Search...</span>
              <kbd className="px-1.5 py-0.5 bg-white rounded text-xs text-gray-400">⌘K</kbd>
            </button>
          )}

          {/* Search (mobile) */}
          {isMobile && (
            <button onClick={onSearch} className="p-2 hover:bg-gray-100 rounded-lg">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
          )}

          {/* Notifications */}
          <button
            onClick={onNotifications}
            className="p-2 hover:bg-gray-100 rounded-lg relative"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {/* User Menu */}
          {user && (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.name?.charAt(0) || 'U'}
                </div>
                {isDesktop && (
                  <>
                    <span className="text-sm font-medium text-gray-700">{user.name?.split(' ')[0]}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </>
                )}
              </button>

              {showUserMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50 py-2">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <button
                      onClick={() => { onNavigate('profile'); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <User className="w-4 h-4" />
                      <span>Profile</span>
                    </button>
                    <button
                      onClick={() => { onSettings(); setShowUserMenu(false); }}
                      className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    <div className="border-t border-gray-100 mt-2 pt-2">
                      <button
                        onClick={() => { onSignOut(); setShowUserMenu(false); }}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Breadcrumbs */}
      {!isDesktop && screen !== 'dashboard' && screen !== 'landing' && (
        <div className="px-4 pb-3">
          <Breadcrumbs screen={screen} bookingFlow={bookingFlow} onNavigate={onNavigate} />
        </div>
      )}
    </header>
  );
};

// ============================================================================
// BOTTOM NAVIGATION (Mobile)
// ============================================================================

const BottomNav = ({ active, onNavigate }) => {
  const items = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'care', icon: Heart, label: 'Care' },
    { id: 'kiosks', icon: MapPin, label: 'Kiosks' },
    { id: 'records', icon: FileText, label: 'Records' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 z-20 lg:hidden print:hidden">
      <div className="flex justify-around items-center max-w-lg mx-auto">
        {items.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all ${
              active === id ? 'text-cyan-600 bg-cyan-50' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// 2FA SESSION BADGE
// ============================================================================

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
// HEADER COMPONENT (for non-shell pages)
// ============================================================================

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

// ============================================================================
// LANDING PAGE
// ============================================================================

const LandingPage = ({ onGetStarted, onSignIn, onFindKiosk, onCheckWaitingRoom }) => {
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useResponsive();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-cyan-500 to-teal-600 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-300/10 rounded-full blur-3xl" />
      </div>

      {/* Header - All Screen Sizes */}
      <header className="relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-white">ExtendiHealth</span>
          </div>
          
          {/* Desktop Nav */}
          {(isDesktop || isTablet) && (
            <nav className="flex items-center gap-2 sm:gap-4">
              <button onClick={onFindKiosk} className="px-3 py-2 text-white/90 hover:text-white font-medium transition-colors">
                Find Kiosks
              </button>
              <button onClick={onSignIn} className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-all">
                Sign In
              </button>
              <button 
                onClick={onGetStarted} 
                className="px-5 py-2.5 bg-white text-cyan-600 font-semibold rounded-xl hover:bg-white/90 hover:shadow-lg transition-all"
              >
                Get Started
              </button>
            </nav>
          )}

          {/* Mobile Nav */}
          {isMobile && (
            <div className="flex items-center gap-2">
              <button onClick={onSignIn} className="px-3 py-2 text-white font-medium text-sm">
                Sign In
              </button>
              <button 
                onClick={onGetStarted} 
                className="px-4 py-2 bg-white text-cyan-600 font-semibold rounded-xl text-sm"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`min-h-[calc(100vh-140px)] flex flex-col ${isDesktop ? 'lg:flex-row lg:items-center lg:gap-12' : 'items-center justify-center'}`}>
            
            {/* Hero Section */}
            <div className={`flex-1 ${isDesktop ? 'py-12' : 'py-8 text-center'}`}>
              {/* Animated Icon - Mobile/Tablet */}
              {!isDesktop && (
                <div className="w-28 h-28 sm:w-36 sm:h-36 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                  <AnimatedPulseIcon size={isMobile ? 70 : 90} color="white" />
                </div>
              )}

              {/* Animated Icon - Desktop (inline with text) */}
              {isDesktop && (
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                  <AnimatedPulseIcon size={50} color="white" />
                </div>
              )}
              
              <h1 className={`font-bold text-white leading-tight mb-4 ${
                isLargeDesktop ? 'text-6xl' : isDesktop ? 'text-5xl' : isTablet ? 'text-4xl' : 'text-3xl'
              }`}>
                Healthcare at Your{' '}
                <span className="text-cyan-100">Fingertips</span>
              </h1>
              
              <p className={`text-cyan-50 mb-6 max-w-xl ${
                isDesktop ? 'text-lg' : isTablet ? 'text-base mx-auto' : 'text-base mx-auto'
              }`}>
                Skip the ER. Get fast, accessible healthcare through our network of smart kiosks. 
                Book appointments, track prescriptions, and manage your health records — all in one place.
              </p>

              {/* CTA Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white font-medium text-sm">Skip the ER. Get care in minutes.</span>
              </div>

              {/* CTA Buttons - Desktop */}
              {isDesktop && (
                <div className="flex flex-wrap items-center gap-4">
                  <button 
                    onClick={onGetStarted} 
                    className="px-8 py-4 bg-white text-cyan-600 font-bold rounded-2xl hover:bg-white/90 hover:shadow-xl hover:shadow-cyan-500/30 transition-all text-lg"
                  >
                    Create Free Account
                  </button>
                  <button 
                    onClick={onSignIn} 
                    className="px-8 py-4 bg-transparent text-white font-semibold rounded-2xl border-2 border-white/50 hover:bg-white/10 hover:border-white transition-all text-lg"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Quick Stats - Desktop */}
              {isDesktop && (
                <div className="flex items-center gap-8 mt-10 pt-8 border-t border-white/20">
                  <div>
                    <div className="text-3xl font-bold text-white">24/7</div>
                    <div className="text-cyan-100 text-sm">Always Available</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">HIPAA</div>
                    <div className="text-cyan-100 text-sm">Compliant & Secure</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">Real-Time</div>
                    <div className="text-cyan-100 text-sm">Queue Updates</div>
                  </div>
                </div>
              )}
            </div>

            {/* Feature Cards Section */}
            <div className={`${isDesktop ? 'flex-1 max-w-xl' : 'w-full max-w-md'} ${!isDesktop ? 'pb-8' : ''}`}>
              <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-2 gap-4'}`}>
                {/* Card 1 - Find Nearby Kiosks */}
                <div 
                  onClick={onFindKiosk}
                  className={`bg-white rounded-2xl cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all ${
                    isMobile ? 'p-4' : 'p-6'
                  }`}
                >
                  <div className={`bg-cyan-50 rounded-xl flex items-center justify-center mb-3 ${
                    isMobile ? 'w-10 h-10' : 'w-12 h-12'
                  }`}>
                    <MapPin className={`text-cyan-600 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                  </div>
                  <h3 className={`font-bold text-gray-900 mb-1 ${isMobile ? 'text-sm' : 'text-base'}`}>Find Nearby Kiosks</h3>
                  <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    Multiple locations across the city. Find the closest kiosk with shortest wait.
                  </p>
                </div>

                {/* Card 2 - e-Waiting Room */}
                <div 
                  onClick={onGetStarted}
                  className={`bg-white rounded-2xl cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all ${
                    isMobile ? 'p-4' : 'p-6'
                  }`}
                >
                  <div className={`bg-cyan-50 rounded-xl flex items-center justify-center mb-3 ${
                    isMobile ? 'w-10 h-10' : 'w-12 h-12'
                  }`}>
                    <Clock className={`text-cyan-600 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                  </div>
                  <h3 className={`font-bold text-gray-900 mb-1 ${isMobile ? 'text-sm' : 'text-base'}`}>e-Waiting Room</h3>
                  <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    Wait from home, not the clinic. Get notified when it's your turn.
                  </p>
                </div>

                {/* Card 3 - Get Care in Minutes */}
                <div 
                  onClick={onGetStarted}
                  className={`bg-white rounded-2xl cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all ${
                    isMobile ? 'p-4' : 'p-6'
                  }`}
                >
                  <div className={`bg-cyan-50 rounded-xl flex items-center justify-center mb-3 ${
                    isMobile ? 'w-10 h-10' : 'w-12 h-12'
                  }`}>
                    <Heart className={`text-cyan-600 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                  </div>
                  <h3 className={`font-bold text-gray-900 mb-1 ${isMobile ? 'text-sm' : 'text-base'}`}>Get Care in Minutes</h3>
                  <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    Skip the ER. AI-powered triage gets you seen faster.
                  </p>
                </div>

                {/* Card 4 - Secure Health Records */}
                <div 
                  onClick={onGetStarted}
                  className={`bg-white rounded-2xl cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all ${
                    isMobile ? 'p-4' : 'p-6'
                  }`}
                >
                  <div className={`bg-cyan-50 rounded-xl flex items-center justify-center mb-3 ${
                    isMobile ? 'w-10 h-10' : 'w-12 h-12'
                  }`}>
                    <Shield className={`text-cyan-600 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                  </div>
                  <h3 className={`font-bold text-gray-900 mb-1 ${isMobile ? 'text-sm' : 'text-base'}`}>Secure Health Records</h3>
                  <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    Access prescriptions, lab results & visit history. HIPAA compliant.
                  </p>
                </div>
              </div>

              {/* Mobile CTA Buttons */}
              {!isDesktop && (
                <div className="mt-6 space-y-3">
                  <button 
                    onClick={onGetStarted} 
                    className="w-full px-6 py-4 bg-white text-cyan-600 font-bold rounded-2xl hover:bg-white/90 transition-all shadow-lg"
                  >
                    Get Started Free
                  </button>
                  <button 
                    onClick={onSignIn} 
                    className="w-full px-6 py-4 bg-white/20 text-white font-semibold rounded-2xl border-2 border-white/30 hover:bg-white/30 transition-all"
                  >
                    Already have an account? Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-white/60 text-xs sm:text-sm">
        <p>© 2025 ExtendiHealth Inc. • HIPAA Compliant • Privacy Policy • Terms of Service</p>
      </footer>
    </div>
  );
};

// ============================================================================
// LOGIN PAGE
// ============================================================================

const LoginPage = ({ onBack, onLogin, onForgotPin, onCreateAccount }) => {
  const { isDesktop } = useResponsive();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [step, setStep] = useState('email');
  const [loginMethod, setLoginMethod] = useState('password');

  const handleContinue = () => {
    if (step === 'email' && email) {
      setStep('auth');
    } else if (step === 'auth') {
      if (loginMethod === 'pin' && pin.length === 4) {
        onLogin({ email, pin });
      } else if (loginMethod === 'password' && password) {
        onLogin({ email, password });
      }
    }
  };

  const useTestAccount = () => {
    setEmail('jide@gmail.com');
  };

  const content = (
    <div className="space-y-6">
      {step === 'email' ? (
        <>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-500">Enter your email to continue</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-4">
            <p className="text-sm text-cyan-700 mb-2">
              <strong>Demo Account:</strong> Use <span className="font-mono">jide@gmail.com</span> with any 4-digit PIN or password
            </p>
            <button onClick={useTestAccount} className="text-cyan-600 font-medium text-sm underline">
              Use test account
            </button>
          </div>

          <Button size="lg" onClick={handleContinue} disabled={!email} className="w-full">
            Continue
          </Button>
          <p className="text-center text-gray-500">
            Don't have an account?{' '}
            <button onClick={onCreateAccount} className="text-cyan-600 font-medium">
              Create one
            </button>
          </p>
        </>
      ) : (
        <>
          <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
            <button
              onClick={() => setLoginMethod('password')}
              className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${
                loginMethod === 'password' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              Password
            </button>
            <button
              onClick={() => setLoginMethod('pin')}
              className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${
                loginMethod === 'pin' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              Use PIN instead
            </button>
          </div>

          {loginMethod === 'password' ? (
            <>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter your password</h2>
                <p className="text-gray-500">Password for {email}</p>
              </div>
              
              {email.toLowerCase() === 'jide@gmail.com' && (
                <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-3">
                  <p className="text-sm text-cyan-700 text-center">Demo mode: Enter any password</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                />
              </div>
              
              <Button size="lg" onClick={handleContinue} disabled={!password} className="w-full">
                Sign In
              </Button>
              <button onClick={onForgotPin} className="w-full text-center text-cyan-600 font-medium">
                Forgot Password?
              </button>
            </>
          ) : (
            <>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter your PIN</h2>
                <p className="text-gray-500">4-digit PIN for {email}</p>
              </div>
              
              {email.toLowerCase() === 'jide@gmail.com' && (
                <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-3">
                  <p className="text-sm text-cyan-700 text-center">Demo mode: Enter any 4-digit PIN (e.g., 1234)</p>
                </div>
              )}
              
              <div className="flex justify-center gap-4">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                      pin.length > i ? 'border-cyan-500 bg-cyan-50 text-cyan-600' : 'border-gray-200'
                    }`}
                  >
                    {pin.length > i ? '•' : ''}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((num, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (num === 'del') setPin(pin.slice(0, -1));
                      else if (num !== '' && pin.length < 4) setPin(pin + num);
                    }}
                    className={`h-14 rounded-xl font-semibold text-xl transition-all ${
                      num === '' ? 'invisible' : num === 'del' ? 'text-gray-500' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    {num === 'del' ? '⌫' : num}
                  </button>
                ))}
              </div>
              <Button size="lg" onClick={handleContinue} disabled={pin.length !== 4} className="w-full">
                Sign In
              </Button>
              <button onClick={onForgotPin} className="w-full text-center text-cyan-600 font-medium">
                Forgot PIN?
              </button>
            </>
          )}
        </>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-cyan-500 to-teal-600 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AnimatedPulseIcon size={40} color="white" />
            </div>
            <h1 className="text-2xl font-bold text-white">ExtendiHealth</h1>
          </div>
          <Card className="p-8">
            {step === 'auth' && (
              <button onClick={() => setStep('email')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4">
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            )}
            {content}
          </Card>
          <p className="text-center text-white/70 mt-6 text-sm">
            © 2025 ExtendiHealth Inc. • HIPAA Compliant
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Sign In" onBack={onBack} />
      <div className="p-6 max-w-md mx-auto">
        {content}
      </div>
    </div>
  );
};

// ============================================================================
// CREATE ACCOUNT PAGE - COMPREHENSIVE HIPAA-COMPLIANT ONBOARDING
// ============================================================================

// Password strength checker
const checkPasswordStrength = (password) => {
  let strength = 0;
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };
  strength = Object.values(checks).filter(Boolean).length;
  return { strength, checks };
};

// Form Input Component
const FormInput = ({ label, type = 'text', value, onChange, placeholder, required, error, hint, disabled, className = '' }) => (
  <div className={`space-y-1 ${className}`}>
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all ${
        error ? 'border-red-300 bg-red-50' : 'border-gray-200'
      } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
    />
    {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

// Form Select Component
const FormSelect = ({ label, value, onChange, options, required, placeholder }) => (
  <div className="space-y-1">
    <label className="text-sm font-medium text-gray-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none bg-white"
    >
      <option value="">{placeholder || 'Select...'}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

// Form Checkbox Component
const FormCheckbox = ({ checked, onChange, label, description }) => (
  <label className="flex items-start gap-3 cursor-pointer p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="w-5 h-5 mt-0.5 text-cyan-600 rounded focus:ring-cyan-500 accent-cyan-500"
    />
    <div>
      <p className="font-medium text-gray-900">{label}</p>
      {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
    </div>
  </label>
);

// Step Indicator Component
const StepIndicator = ({ currentStep, totalSteps, steps }) => (
  <div className="mb-8">
    <div className="flex gap-1">
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={`flex-1 h-1.5 rounded-full transition-all ${
            i < currentStep ? 'bg-cyan-500' : i === currentStep ? 'bg-cyan-300' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
    <div className="flex justify-between mt-2">
      <span className="text-xs text-gray-500">Step {currentStep + 1} of {totalSteps}</span>
      <span className="text-xs font-medium text-cyan-600">{steps[currentStep]}</span>
    </div>
  </div>
);

const CreateAccountPage = ({ onBack, onComplete }) => {
  const { isDesktop } = useResponsive();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Step names for indicator
  const stepNames = [
    'Create Account',
    'Verify Email',
    'Setup 2FA',
    'Personal Info',
    'Address',
    'Emergency Contact',
    'Medical History',
    'Insurance',
    'Consent & Privacy',
    'Complete'
  ];

  // Form state
  const [formData, setFormData] = useState({
    // Account
    email: '',
    password: '',
    confirmPassword: '',
    verificationCode: '',
    
    // 2FA
    twoFAMethod: 'sms',
    phoneFor2FA: '',
    twoFACode: '',
    
    // Personal Info
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    healthCardNumber: '',
    healthCardProvince: '',
    
    // Address
    streetAddress: '',
    apartment: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Canada',
    phoneNumber: '',
    alternatePhone: '',
    
    // Emergency Contact
    emergencyContactName: '',
    emergencyContactRelationship: '',
    emergencyContactPhone: '',
    emergencyContactEmail: '',
    
    // Medical History
    bloodType: '',
    allergies: [],
    allergyOther: '',
    currentMedications: '',
    medicalConditions: [],
    conditionOther: '',
    previousSurgeries: '',
    familyHistory: [],
    
    // Insurance
    hasInsurance: null,
    insuranceProvider: '',
    policyNumber: '',
    groupNumber: '',
    policyHolderName: '',
    policyHolderDOB: '',
    relationshipToPolicyHolder: '',
    
    // Consents
    consents: {
      termsOfService: false,
      privacyPolicy: false,
      hipaaAuthorization: false,
      consentToTreatment: false,
      electronicCommunications: false,
      dataSharing: false,
    },
    
    // Preferences
    preferredLanguage: 'en',
    communicationPreferences: {
      email: true,
      sms: true,
      push: true,
    },
    accessibilityNeeds: [],
  });

  const updateForm = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedForm = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const passwordStrength = checkPasswordStrength(formData.password);

  // Common allergy options
  const allergyOptions = [
    'Penicillin', 'Sulfa Drugs', 'Aspirin', 'Ibuprofen', 'Codeine',
    'Latex', 'Peanuts', 'Tree Nuts', 'Shellfish', 'Eggs', 'Milk', 'Soy', 'Wheat'
  ];

  // Common medical conditions
  const conditionOptions = [
    'Diabetes', 'Hypertension', 'Heart Disease', 'Asthma', 'COPD',
    'Arthritis', 'Cancer', 'Thyroid Disorder', 'Kidney Disease', 'Liver Disease',
    'Depression', 'Anxiety', 'Epilepsy', 'Stroke'
  ];

  // Province options
  const provinceOptions = [
    { value: 'ON', label: 'Ontario' },
    { value: 'BC', label: 'British Columbia' },
    { value: 'AB', label: 'Alberta' },
    { value: 'QC', label: 'Quebec' },
    { value: 'MB', label: 'Manitoba' },
    { value: 'SK', label: 'Saskatchewan' },
    { value: 'NS', label: 'Nova Scotia' },
    { value: 'NB', label: 'New Brunswick' },
    { value: 'NL', label: 'Newfoundland and Labrador' },
    { value: 'PE', label: 'Prince Edward Island' },
    { value: 'NT', label: 'Northwest Territories' },
    { value: 'YT', label: 'Yukon' },
    { value: 'NU', label: 'Nunavut' },
  ];

  const handleNext = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setStep(prev => prev + 1);
    }, 500);
  };

  const handleBack = () => {
    if (step === 0) {
      onBack();
    } else {
      setStep(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsLoading(true);
    // Create audit log for account creation
    createAuditLog('ACCOUNT_CREATED', {
      email: formData.email,
      consentsGiven: Object.keys(formData.consents).filter(k => formData.consents[k]),
      timestamp: new Date().toISOString(),
    }, formData.email);
    
    setTimeout(() => {
      setIsLoading(false);
      onComplete(formData);
    }, 1000);
  };

  const renderStep = () => {
    switch (step) {
      // ===== STEP 0: CREATE ACCOUNT =====
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h2>
              <p className="text-gray-500">Enter your email and create a secure password</p>
            </div>

            <FormInput
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={(v) => updateForm('email', v)}
              placeholder="you@example.com"
              required
            />

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Password <span className="text-red-500">*</span></label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => updateForm('password', e.target.value)}
                placeholder="Create a strong password"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              />
              
              {/* Password Strength Indicator */}
              <div className="mt-2">
                <div className="flex gap-1 mb-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className={`flex-1 h-1.5 rounded-full ${
                        passwordStrength.strength >= i
                          ? passwordStrength.strength <= 2 ? 'bg-red-500'
                            : passwordStrength.strength <= 3 ? 'bg-amber-500'
                            : 'bg-green-500'
                          : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <span className={passwordStrength.checks.length ? 'text-green-600' : 'text-gray-400'}>
                    {passwordStrength.checks.length ? '✓' : '○'} 8+ characters
                  </span>
                  <span className={passwordStrength.checks.uppercase ? 'text-green-600' : 'text-gray-400'}>
                    {passwordStrength.checks.uppercase ? '✓' : '○'} Uppercase letter
                  </span>
                  <span className={passwordStrength.checks.lowercase ? 'text-green-600' : 'text-gray-400'}>
                    {passwordStrength.checks.lowercase ? '✓' : '○'} Lowercase letter
                  </span>
                  <span className={passwordStrength.checks.number ? 'text-green-600' : 'text-gray-400'}>
                    {passwordStrength.checks.number ? '✓' : '○'} Number
                  </span>
                  <span className={passwordStrength.checks.special ? 'text-green-600' : 'text-gray-400'}>
                    {passwordStrength.checks.special ? '✓' : '○'} Special character
                  </span>
                </div>
              </div>
            </div>

            <FormInput
              label="Confirm Password"
              type="password"
              value={formData.confirmPassword}
              onChange={(v) => updateForm('confirmPassword', v)}
              placeholder="Confirm your password"
              required
              error={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Passwords do not match' : ''}
            />

            <Button
              size="lg"
              onClick={handleNext}
              disabled={!formData.email || passwordStrength.strength < 4 || formData.password !== formData.confirmPassword}
              className="w-full"
            >
              {isLoading ? 'Sending...' : 'Send Verification Code'}
            </Button>
          </div>
        );

      // ===== STEP 1: VERIFY EMAIL =====
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
              <p className="text-gray-500">Enter the 6-digit code sent to {formData.email}</p>
            </div>

            <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-cyan-600 mt-0.5" />
                <div>
                  <p className="text-sm text-cyan-800">Check your inbox and spam folder</p>
                  <p className="text-xs text-cyan-600 mt-1">Code expires in 10 minutes</p>
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-2">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <input
                  key={i}
                  type="text"
                  maxLength={1}
                  value={formData.verificationCode[i] || ''}
                  onChange={(e) => {
                    const newCode = formData.verificationCode.split('');
                    newCode[i] = e.target.value;
                    updateForm('verificationCode', newCode.join('').slice(0, 6));
                    if (e.target.value && e.target.nextSibling) {
                      e.target.nextSibling.focus();
                    }
                  }}
                  className="w-12 h-14 text-center text-2xl font-bold border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                />
              ))}
            </div>

            <Button
              size="lg"
              onClick={handleNext}
              disabled={formData.verificationCode.length !== 6}
              className="w-full"
            >
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </Button>

            <p className="text-center text-gray-500 text-sm">
              Didn't receive code?{' '}
              <button className="text-cyan-600 font-medium hover:underline">Resend Code</button>
            </p>
          </div>
        );

      // ===== STEP 2: SETUP 2FA (HIPAA REQUIREMENT) =====
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Setup Two-Factor Authentication</h2>
              <p className="text-gray-500">Required for secure access to your health records</p>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">HIPAA Security Requirement</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Two-factor authentication is mandatory to protect your personal health information.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Choose verification method:</p>
              {[
                { value: 'sms', label: 'SMS Text Message', icon: Phone, desc: 'Receive codes via text' },
                { value: 'email', label: 'Email', icon: Mail, desc: 'Receive codes via email' },
                { value: 'authenticator', label: 'Authenticator App', icon: Shield, desc: 'Use Google/Microsoft Authenticator' },
              ].map((method) => (
                <label
                  key={method.value}
                  className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.twoFAMethod === method.value
                      ? 'border-cyan-500 bg-cyan-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="2fa"
                    value={method.value}
                    checked={formData.twoFAMethod === method.value}
                    onChange={(e) => updateForm('twoFAMethod', e.target.value)}
                    className="w-5 h-5 text-cyan-600"
                  />
                  <method.icon className={`w-6 h-6 ${formData.twoFAMethod === method.value ? 'text-cyan-600' : 'text-gray-400'}`} />
                  <div>
                    <p className="font-medium text-gray-900">{method.label}</p>
                    <p className="text-sm text-gray-500">{method.desc}</p>
                  </div>
                </label>
              ))}
            </div>

            {formData.twoFAMethod === 'sms' && (
              <FormInput
                label="Phone Number for 2FA"
                type="tel"
                value={formData.phoneFor2FA}
                onChange={(v) => updateForm('phoneFor2FA', v)}
                placeholder="+1 (555) 000-0000"
                required
              />
            )}

            <Button
              size="lg"
              onClick={handleNext}
              disabled={formData.twoFAMethod === 'sms' && !formData.phoneFor2FA}
              className="w-full"
            >
              {isLoading ? 'Setting up...' : 'Setup 2FA'}
            </Button>
          </div>
        );

      // ===== STEP 3: PERSONAL INFORMATION =====
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
              <p className="text-gray-500">Enter your legal name as it appears on your health card</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="First Name"
                value={formData.firstName}
                onChange={(v) => updateForm('firstName', v)}
                placeholder="John"
                required
              />
              <FormInput
                label="Last Name"
                value={formData.lastName}
                onChange={(v) => updateForm('lastName', v)}
                placeholder="Doe"
                required
              />
            </div>

            <FormInput
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(v) => updateForm('dateOfBirth', v)}
              required
            />

            <FormSelect
              label="Gender"
              value={formData.gender}
              onChange={(v) => updateForm('gender', v)}
              options={[
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' },
                { value: 'prefer-not-to-say', label: 'Prefer not to say' },
              ]}
              required
              placeholder="Select gender"
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Health Card Number"
                value={formData.healthCardNumber}
                onChange={(v) => updateForm('healthCardNumber', v)}
                placeholder="1234-567-890"
                hint="Provincial health card number"
              />
              <FormSelect
                label="Province"
                value={formData.healthCardProvince}
                onChange={(v) => updateForm('healthCardProvince', v)}
                options={provinceOptions}
                placeholder="Select province"
              />
            </div>

            <Button
              size="lg"
              onClick={handleNext}
              disabled={!formData.firstName || !formData.lastName || !formData.dateOfBirth}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        );

      // ===== STEP 4: ADDRESS & CONTACT =====
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Address & Contact</h2>
              <p className="text-gray-500">Your contact information for appointments and notifications</p>
            </div>

            <FormInput
              label="Street Address"
              value={formData.streetAddress}
              onChange={(v) => updateForm('streetAddress', v)}
              placeholder="123 Main Street"
              required
            />

            <FormInput
              label="Apartment/Unit"
              value={formData.apartment}
              onChange={(v) => updateForm('apartment', v)}
              placeholder="Apt 4B (optional)"
            />

            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="City"
                value={formData.city}
                onChange={(v) => updateForm('city', v)}
                placeholder="Toronto"
                required
              />
              <FormSelect
                label="Province"
                value={formData.province}
                onChange={(v) => updateForm('province', v)}
                options={provinceOptions}
                required
                placeholder="Select"
              />
            </div>

            <FormInput
              label="Postal Code"
              value={formData.postalCode}
              onChange={(v) => updateForm('postalCode', v.toUpperCase())}
              placeholder="A1A 1A1"
              required
            />

            <FormInput
              label="Phone Number"
              type="tel"
              value={formData.phoneNumber}
              onChange={(v) => updateForm('phoneNumber', v)}
              placeholder="+1 (555) 000-0000"
              required
            />

            <FormInput
              label="Alternate Phone"
              type="tel"
              value={formData.alternatePhone}
              onChange={(v) => updateForm('alternatePhone', v)}
              placeholder="+1 (555) 000-0000 (optional)"
            />

            <Button
              size="lg"
              onClick={handleNext}
              disabled={!formData.streetAddress || !formData.city || !formData.province || !formData.postalCode || !formData.phoneNumber}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        );

      // ===== STEP 5: EMERGENCY CONTACT =====
      case 5:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Emergency Contact</h2>
              <p className="text-gray-500">Someone we can contact in case of emergency</p>
            </div>

            <div className="bg-red-50 border border-red-100 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                <div>
                  <p className="font-medium text-red-800">Important</p>
                  <p className="text-sm text-red-700 mt-1">
                    This person may be contacted if you require emergency medical care and are unable to communicate.
                  </p>
                </div>
              </div>
            </div>

            <FormInput
              label="Contact Name"
              value={formData.emergencyContactName}
              onChange={(v) => updateForm('emergencyContactName', v)}
              placeholder="Jane Doe"
              required
            />

            <FormSelect
              label="Relationship"
              value={formData.emergencyContactRelationship}
              onChange={(v) => updateForm('emergencyContactRelationship', v)}
              options={[
                { value: 'spouse', label: 'Spouse/Partner' },
                { value: 'parent', label: 'Parent' },
                { value: 'child', label: 'Child' },
                { value: 'sibling', label: 'Sibling' },
                { value: 'friend', label: 'Friend' },
                { value: 'other', label: 'Other' },
              ]}
              required
              placeholder="Select relationship"
            />

            <FormInput
              label="Phone Number"
              type="tel"
              value={formData.emergencyContactPhone}
              onChange={(v) => updateForm('emergencyContactPhone', v)}
              placeholder="+1 (555) 000-0000"
              required
            />

            <FormInput
              label="Email Address"
              type="email"
              value={formData.emergencyContactEmail}
              onChange={(v) => updateForm('emergencyContactEmail', v)}
              placeholder="jane@example.com (optional)"
            />

            <Button
              size="lg"
              onClick={handleNext}
              disabled={!formData.emergencyContactName || !formData.emergencyContactRelationship || !formData.emergencyContactPhone}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        );

      // ===== STEP 6: MEDICAL HISTORY =====
      case 6:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Medical History</h2>
              <p className="text-gray-500">Help us provide better care by sharing your medical background</p>
            </div>

            <FormSelect
              label="Blood Type"
              value={formData.bloodType}
              onChange={(v) => updateForm('bloodType', v)}
              options={[
                { value: 'A+', label: 'A+' },
                { value: 'A-', label: 'A-' },
                { value: 'B+', label: 'B+' },
                { value: 'B-', label: 'B-' },
                { value: 'AB+', label: 'AB+' },
                { value: 'AB-', label: 'AB-' },
                { value: 'O+', label: 'O+' },
                { value: 'O-', label: 'O-' },
                { value: 'unknown', label: 'Unknown' },
              ]}
              placeholder="Select blood type"
            />

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Allergies</label>
              <div className="grid grid-cols-2 gap-2">
                {allergyOptions.map((allergy) => (
                  <label key={allergy} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={formData.allergies.includes(allergy)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateForm('allergies', [...formData.allergies, allergy]);
                        } else {
                          updateForm('allergies', formData.allergies.filter(a => a !== allergy));
                        }
                      }}
                      className="w-4 h-4 text-cyan-600 rounded"
                    />
                    <span className="text-sm text-gray-700">{allergy}</span>
                  </label>
                ))}
              </div>
              <FormInput
                label=""
                value={formData.allergyOther}
                onChange={(v) => updateForm('allergyOther', v)}
                placeholder="Other allergies (comma separated)"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Current Medications</label>
              <textarea
                value={formData.currentMedications}
                onChange={(e) => updateForm('currentMedications', e.target.value)}
                placeholder="List any medications you are currently taking..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Medical Conditions</label>
              <div className="grid grid-cols-2 gap-2">
                {conditionOptions.map((condition) => (
                  <label key={condition} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input
                      type="checkbox"
                      checked={formData.medicalConditions.includes(condition)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          updateForm('medicalConditions', [...formData.medicalConditions, condition]);
                        } else {
                          updateForm('medicalConditions', formData.medicalConditions.filter(c => c !== condition));
                        }
                      }}
                      className="w-4 h-4 text-cyan-600 rounded"
                    />
                    <span className="text-sm text-gray-700">{condition}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Previous Surgeries</label>
              <textarea
                value={formData.previousSurgeries}
                onChange={(e) => updateForm('previousSurgeries', e.target.value)}
                placeholder="List any previous surgeries with approximate dates..."
                rows={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            <Button size="lg" onClick={handleNext} className="w-full">
              Continue
            </Button>
          </div>
        );

      // ===== STEP 7: INSURANCE INFORMATION =====
      case 7:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Insurance Information</h2>
              <p className="text-gray-500">Add your health insurance details (optional)</p>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-gray-700">Do you have additional health insurance?</p>
              <div className="flex gap-4">
                <label className={`flex-1 p-4 border-2 rounded-xl cursor-pointer text-center transition-all ${
                  formData.hasInsurance === true ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="hasInsurance"
                    checked={formData.hasInsurance === true}
                    onChange={() => updateForm('hasInsurance', true)}
                    className="sr-only"
                  />
                  <span className="font-medium">Yes</span>
                </label>
                <label className={`flex-1 p-4 border-2 rounded-xl cursor-pointer text-center transition-all ${
                  formData.hasInsurance === false ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200'
                }`}>
                  <input
                    type="radio"
                    name="hasInsurance"
                    checked={formData.hasInsurance === false}
                    onChange={() => updateForm('hasInsurance', false)}
                    className="sr-only"
                  />
                  <span className="font-medium">No</span>
                </label>
              </div>
            </div>

            {formData.hasInsurance && (
              <>
                <FormInput
                  label="Insurance Provider"
                  value={formData.insuranceProvider}
                  onChange={(v) => updateForm('insuranceProvider', v)}
                  placeholder="e.g., Sun Life, Manulife, Blue Cross"
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormInput
                    label="Policy Number"
                    value={formData.policyNumber}
                    onChange={(v) => updateForm('policyNumber', v)}
                    placeholder="ABC123456"
                    required
                  />
                  <FormInput
                    label="Group Number"
                    value={formData.groupNumber}
                    onChange={(v) => updateForm('groupNumber', v)}
                    placeholder="GRP789"
                  />
                </div>

                <FormInput
                  label="Policy Holder Name"
                  value={formData.policyHolderName}
                  onChange={(v) => updateForm('policyHolderName', v)}
                  placeholder="If different from your name"
                />

                <FormSelect
                  label="Relationship to Policy Holder"
                  value={formData.relationshipToPolicyHolder}
                  onChange={(v) => updateForm('relationshipToPolicyHolder', v)}
                  options={[
                    { value: 'self', label: 'Self' },
                    { value: 'spouse', label: 'Spouse/Partner' },
                    { value: 'child', label: 'Child' },
                    { value: 'other', label: 'Other' },
                  ]}
                  placeholder="Select relationship"
                />
              </>
            )}

            <Button size="lg" onClick={handleNext} className="w-full">
              Continue
            </Button>
          </div>
        );

      // ===== STEP 8: CONSENT & PRIVACY (HIPAA) =====
      case 8:
        const allConsentsGiven = Object.values(formData.consents).slice(0, 4).every(Boolean);
        
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Consent & Privacy</h2>
              <p className="text-gray-500">Please review and accept our policies to continue</p>
            </div>

            <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Shield className="w-6 h-6 text-cyan-600 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-cyan-800">HIPAA & PHIPA Compliance</h3>
                  <p className="text-sm text-cyan-700 mt-1">
                    ExtendiHealth is committed to protecting your personal health information (PHI) 
                    in accordance with HIPAA (U.S.) and PHIPA (Ontario) regulations.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <FormCheckbox
                checked={formData.consents.termsOfService}
                onChange={(v) => updateNestedForm('consents', 'termsOfService', v)}
                label="Terms of Service"
                description="I agree to the Terms of Service and User Agreement"
              />

              <FormCheckbox
                checked={formData.consents.privacyPolicy}
                onChange={(v) => updateNestedForm('consents', 'privacyPolicy', v)}
                label="Privacy Policy"
                description="I have read and understand the Privacy Policy"
              />

              <FormCheckbox
                checked={formData.consents.hipaaAuthorization}
                onChange={(v) => updateNestedForm('consents', 'hipaaAuthorization', v)}
                label="HIPAA Authorization"
                description="I authorize the use and disclosure of my protected health information (PHI) for treatment, payment, and healthcare operations"
              />

              <FormCheckbox
                checked={formData.consents.consentToTreatment}
                onChange={(v) => updateNestedForm('consents', 'consentToTreatment', v)}
                label="Consent to Treatment"
                description="I consent to receive medical treatment and care through ExtendiHealth's network of providers"
              />

              <div className="border-t pt-4 mt-4">
                <p className="text-sm font-medium text-gray-600 mb-3">Optional Preferences:</p>
                
                <FormCheckbox
                  checked={formData.consents.electronicCommunications}
                  onChange={(v) => updateNestedForm('consents', 'electronicCommunications', v)}
                  label="Electronic Communications"
                  description="I consent to receive appointment reminders, health tips, and updates via email and SMS"
                />

                <div className="mt-3">
                  <FormCheckbox
                    checked={formData.consents.dataSharing}
                    onChange={(v) => updateNestedForm('consents', 'dataSharing', v)}
                    label="Anonymous Data Sharing"
                    description="I allow my de-identified health data to be used for research and quality improvement"
                  />
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
              <p className="font-medium mb-2">Your Rights:</p>
              <ul className="space-y-1 text-xs">
                <li>• Access and receive copies of your health records</li>
                <li>• Request corrections to your health information</li>
                <li>• Request restrictions on certain uses of your PHI</li>
                <li>• Receive confidential communications</li>
                <li>• File a complaint if you believe your rights have been violated</li>
              </ul>
            </div>

            <Button
              size="lg"
              onClick={handleNext}
              disabled={!allConsentsGiven}
              className="w-full"
            >
              Accept & Continue
            </Button>
          </div>
        );

      // ===== STEP 9: COMPLETE =====
      case 9:
        return (
          <div className="space-y-6 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to ExtendiHealth!</h2>
              <p className="text-gray-500">Your account has been created successfully</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 text-left space-y-3">
              <h3 className="font-semibold text-gray-900">What's Next?</h3>
              <div className="space-y-2">
                {[
                  { icon: MapPin, text: 'Find a kiosk near you' },
                  { icon: Calendar, text: 'Book your first appointment' },
                  { icon: Heart, text: 'Get care when you need it' },
                  { icon: FileText, text: 'Access your health records anytime' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-cyan-600" />
                    </div>
                    <span className="text-gray-700">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button size="lg" onClick={handleComplete} className="w-full">
              {isLoading ? 'Setting up...' : 'Go to Dashboard'}
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  // Mobile Layout
  if (!isDesktop) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
          <div className="flex items-center gap-4">
            <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-xl">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <span className="font-semibold text-gray-900">Create Account</span>
          </div>
        </header>
        <div className="p-4 max-w-lg mx-auto">
          <StepIndicator currentStep={step} totalSteps={10} steps={stepNames} />
          {renderStep()}
        </div>
      </div>
    );
  }

  // Desktop Layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-cyan-500 to-teal-600 flex items-center justify-center p-8">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">ExtendiHealth</h1>
        </div>
        <Card className="p-8 max-h-[80vh] overflow-y-auto">
          {step > 0 && step < 9 && (
            <button onClick={handleBack} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4">
              <ChevronLeft className="w-5 h-5" />
              Back
            </button>
          )}
          <StepIndicator currentStep={step} totalSteps={10} steps={stepNames} />
          {renderStep()}
        </Card>
      </div>
    </div>
  );
};

// ============================================================================
// DASHBOARD
// ============================================================================

const Dashboard = ({ user, appointments, prescriptions, labResults, onNavigate, onGetCareNow, onBookAppointment, onSettings, onJoinWaitingRoom, onFindKiosk, onNotifications, onWalkIn }) => {
  const { isDesktop, isLargeDesktop } = useResponsive();
  const upcomingAppointments = appointments.filter(a => a.status !== 'Completed').slice(0, 2);
  const nextAppointment = upcomingAppointments[0];
  const activePrescriptions = prescriptions.filter(p => p.status === 'Active');
  const recentLabResults = labResults.length;

  return (
    <div className={`${isDesktop ? 'p-6 lg:p-8' : 'pb-24'}`}>
      <div className={`${isDesktop ? 'max-w-7xl mx-auto' : ''}`}>
        {/* Welcome Header */}
        <div className={`${isDesktop ? 'mb-8' : 'bg-gradient-to-r from-cyan-500 to-teal-500 px-5 pt-6 pb-6'}`}>
          {isDesktop ? (
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Welcome back, {user?.name?.split(' ')[0] || 'User'}
                </h1>
                <p className="text-gray-500 mt-1">How can we help you today?</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={onGetCareNow} size="lg">
                  <Heart className="w-5 h-5" />
                  Get Care Now
                </Button>
                <Button onClick={onBookAppointment} variant="secondary" size="lg">
                  <Calendar className="w-5 h-5" />
                  Book Appointment
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-5">
                <div>
                  <p className="text-cyan-100 text-sm">Hello, {user?.name?.split(' ')[0] || 'User'}</p>
                  <h1 className="text-white text-2xl font-bold">How can we help you today?</h1>
                </div>
                <div className="flex gap-2">
                  <button onClick={onNotifications} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors relative">
                    <Bell className="w-5 h-5 text-white" />
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-orange-400 rounded-full border-2 border-cyan-500" />
                  </button>
                  <button onClick={onSettings} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                    <Settings className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="bg-cyan-400/50 rounded-2xl p-1">
                <button onClick={onGetCareNow} className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-colors">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Get care now</span>
                </button>
                <div className="border-t border-cyan-300/30 mx-4" />
                <button onClick={onBookAppointment} className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-colors">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">Book Kiosk Appointment</span>
                </button>
                <div className="border-t border-cyan-300/30 mx-4" />
                <button onClick={onFindKiosk} className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-colors">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">Find Nearby Kiosk</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Desktop Grid Layout */}
        {isDesktop ? (
          <div className={`grid gap-6 ${isLargeDesktop ? 'grid-cols-3' : 'grid-cols-2'}`}>
            {/* Upcoming Appointment */}
            {nextAppointment && (
              <Card className="p-6 col-span-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Next Appointment</h3>
                  <Badge variant={nextAppointment.status === 'Pending' ? 'warning' : 'info'}>
                    {nextAppointment.status}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-900">{nextAppointment.type}</p>
                    <p className="text-sm text-gray-500">{nextAppointment.doctor}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(nextAppointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {nextAppointment.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{nextAppointment.location}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Button size="sm" onClick={onJoinWaitingRoom} className="flex-1">Join Waiting Room</Button>
                  <Button size="sm" variant="secondary" onClick={() => onNavigate('appointments')}>Details</Button>
                </div>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Clock, label: 'e-Waiting Room', action: () => onNavigate('eWaitingRoom'), color: 'text-cyan-500 bg-cyan-50' },
                  { icon: Pill, label: 'Pharmacy', action: () => onNavigate('pharmacy'), color: 'text-green-500 bg-green-50' },
                  { icon: FlaskConical, label: 'Lab Results', action: () => onNavigate('labResults'), color: 'text-purple-500 bg-purple-50' },
                  { icon: FileText, label: 'Referrals', action: () => onNavigate('referrals'), color: 'text-amber-500 bg-amber-50' },
                  { icon: BookOpen, label: 'Visit History', action: () => onNavigate('visitHistory'), color: 'text-blue-500 bg-blue-50' },
                  { icon: Calendar, label: 'Appointments', action: () => onNavigate('appointments'), color: 'text-teal-500 bg-teal-50' },
                ].map(({ icon: Icon, label, action, color }) => (
                  <button
                    key={label}
                    onClick={action}
                    className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{label}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Active Prescriptions */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Active Prescriptions</h3>
                <button onClick={() => onNavigate('pharmacy')} className="text-cyan-600 text-sm font-medium">View All</button>
              </div>
              {activePrescriptions.length > 0 ? (
                <div className="space-y-3">
                  {activePrescriptions.slice(0, 3).map((rx) => (
                    <div key={rx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">{rx.name}</p>
                        <p className="text-sm text-gray-500">{rx.dosage} • {rx.frequency}</p>
                      </div>
                      <Badge variant="success">{rx.refillsRemaining} refills</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No active prescriptions</p>
              )}
            </Card>

            {/* Lab Results Summary */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Recent Lab Results</h3>
                <button onClick={() => onNavigate('labResults')} className="text-cyan-600 text-sm font-medium">View All</button>
              </div>
              {labResults.length > 0 ? (
                <div className="space-y-3">
                  {labResults.slice(0, 3).map((lab) => {
                    const abnormalCount = lab.results.filter(r => r.status !== 'normal').length;
                    return (
                      <div key={lab.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <div>
                          <p className="font-medium text-gray-900">{lab.name}</p>
                          <p className="text-sm text-gray-500">{new Date(lab.date).toLocaleDateString()}</p>
                        </div>
                        <Badge variant={abnormalCount > 0 ? 'warning' : 'success'}>
                          {abnormalCount > 0 ? `${abnormalCount} flagged` : 'Normal'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No lab results</p>
              )}
            </Card>

            {/* Health Summary */}
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Health Overview</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Upcoming Appointments</span>
                  <span className="font-bold text-gray-900">{upcomingAppointments.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Active Prescriptions</span>
                  <span className="font-bold text-gray-900">{activePrescriptions.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Lab Results</span>
                  <span className="font-bold text-gray-900">{recentLabResults}</span>
                </div>
              </div>
              <Button variant="secondary" size="sm" onClick={() => onNavigate('profile')} className="w-full mt-4">
                View Health Profile
              </Button>
            </Card>

            {/* Find Kiosk Card */}
            <Card className="p-6 bg-gradient-to-br from-cyan-500 to-teal-600 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute right-8 bottom-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2" />
              <div className="relative">
                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-4">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <h3 className="font-bold text-xl mb-2">Find a Kiosk</h3>
                <p className="text-cyan-100 text-sm mb-4">
                  Locate nearby health kiosks with real-time wait times and available services.
                </p>
                <div className="flex items-center gap-2 text-sm text-cyan-100 mb-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full" />
                    <span>{KIOSKS.filter(k => k.isOpen).length} Open Now</span>
                  </div>
                  <span>•</span>
                  <span>{KIOSKS.length} Locations</span>
                </div>
                <button 
                  onClick={onFindKiosk}
                  className="w-full py-3 bg-white text-cyan-600 font-semibold rounded-xl hover:bg-cyan-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Navigation className="w-5 h-5" />
                  Find Nearest Kiosk
                </button>
              </div>
            </Card>
          </div>
        ) : (
          /* Mobile Layout */
          <div className="px-4 pt-4">
            {/* Join e-Waiting Room Banner */}
            {nextAppointment && (
              <div 
                onClick={onJoinWaitingRoom}
                className="bg-gradient-to-r from-orange-400 via-orange-500 to-pink-500 rounded-2xl p-5 mb-6 cursor-pointer hover:shadow-lg transition-shadow relative overflow-hidden"
              >
                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-white text-xl font-bold mb-1">Join e-Waiting Room</h2>
                <p className="text-white/90 text-sm mb-1">Your appointment is coming up!</p>
                <p className="text-white/80 text-sm mb-4">
                  {new Date(nextAppointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {nextAppointment.time}
                </p>
                <div className="bg-white/20 rounded-xl py-2.5 px-4 inline-flex items-center gap-2">
                  <span className="text-white font-medium text-sm">Tap to check queue status</span>
                  <ChevronRight className="w-4 h-4 text-white" />
                </div>
              </div>
            )}

            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Your Health Journey</h2>

            {/* Appointment Card */}
            {nextAppointment && (
              <Card className="mb-4 p-4">
                <h3 className="font-bold text-gray-900 mb-1">Upcoming Appointment</h3>
                <p className="text-gray-500 text-sm mb-4">{nextAppointment.reason || nextAppointment.type}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Date, Time</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(nextAppointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {nextAppointment.time}
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">Reschedule</Button>
                </div>
                
                <button onClick={() => onNavigate('appointments')} className="text-cyan-600 font-medium text-sm">
                  View Details
                </button>
              </Card>
            )}

            {/* Prescriptions Card */}
            {activePrescriptions.length > 0 && (
              <Card className="mb-4 p-4">
                <h3 className="font-bold text-gray-900 mb-1">Your Prescriptions</h3>
                <p className="text-gray-500 text-sm mb-4">{activePrescriptions.length} active prescriptions</p>
                
                <div className="space-y-3">
                  {activePrescriptions.slice(0, 2).map((rx) => (
                    <div key={rx.id} className="bg-gray-50 rounded-xl p-3">
                      <h4 className="font-semibold text-gray-900">{rx.name}</h4>
                      <p className="text-sm text-gray-500">{rx.dosage} - {rx.frequency}</p>
                      <p className="text-xs text-gray-400">{rx.refillsRemaining} refills remaining</p>
                    </div>
                  ))}
                </div>
                
                <button onClick={() => onNavigate('pharmacy')} className="text-cyan-600 font-medium text-sm mt-3">
                  View Details
                </button>
              </Card>
            )}

            {/* Lab Results Card */}
            {recentLabResults > 0 && (
              <Card className="mb-4 p-4">
                <h3 className="font-bold text-gray-900 mb-1">Lab Results</h3>
                <p className="text-gray-500 text-sm mb-3">{recentLabResults} results available</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-purple-500" />
                    <span className="text-sm text-gray-600">Latest: {labResults[0]?.name}</span>
                  </div>
                  <button onClick={() => onNavigate('labResults')} className="text-cyan-600 font-medium text-sm">
                    View All
                  </button>
                </div>
              </Card>
            )}

            {/* Find Kiosk Card - Mobile */}
            <Card className="mb-4 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-teal-600 p-4 text-white relative">
                <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">Find a Kiosk</h3>
                    <p className="text-cyan-100 text-sm">{KIOSKS.filter(k => k.isOpen).length} kiosks open nearby</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/70" />
                </div>
              </div>
              <button 
                onClick={onFindKiosk}
                className="w-full p-3 flex items-center justify-center gap-2 text-cyan-600 font-semibold hover:bg-cyan-50 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                Find Nearest Kiosk
              </button>
            </Card>

            {/* Quick Actions */}
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 mt-6">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { icon: Pill, label: 'My Pharmacy', action: () => onNavigate('pharmacy') },
                { icon: Calendar, label: 'My Appointments', action: () => onNavigate('appointments') },
                { icon: Heart, label: 'My Records', action: () => onNavigate('records') },
                { icon: FlaskConical, label: 'Lab Results', action: () => onNavigate('labResults') },
              ].map(({ icon: Icon, label, action }) => (
                <Card key={label} onClick={action}>
                  <div className="flex items-center gap-4 p-4">
                    <Icon className="w-5 h-5 text-cyan-600" />
                    <span className="font-medium text-gray-800 flex-1">{label}</span>
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// CARE SCREEN
// ============================================================================

const CareScreen = ({ onGetCareNow, onBookAppointment }) => {
  const { isDesktop } = useResponsive();

  return (
    <div className={`${isDesktop ? 'p-6 lg:p-8' : 'pb-24'}`}>
      <div className={`${isDesktop ? 'max-w-4xl mx-auto' : ''}`}>
        {!isDesktop && (
          <div className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-teal-500 px-6 pt-6 pb-8">
            <h1 className="text-white text-2xl font-bold">Get Care</h1>
            <p className="text-cyan-100">Choose how you'd like to receive care</p>
          </div>
        )}

        {isDesktop && (
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Get Care</h1>
            <p className="text-gray-500 mt-1">Choose how you'd like to receive care today</p>
          </div>
        )}

        <div className={`${isDesktop ? 'grid grid-cols-2 gap-6' : 'px-4 -mt-4 space-y-4'}`}>
          <Card onClick={onGetCareNow} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
            <div className="bg-gradient-to-r from-cyan-500 to-teal-500 p-6 text-white">
              <Clock className="w-10 h-10 mb-3" />
              <h2 className="text-xl font-bold mb-1">Get Care Now</h2>
              <p className="text-cyan-100 text-sm">Join the virtual queue and get seen today</p>
            </div>
            {isDesktop && (
              <div className="p-4 bg-gray-50">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-500" />
                    AI-powered symptom assessment
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-500" />
                    Real-time queue updates
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-500" />
                    Same-day appointments
                  </li>
                </ul>
              </div>
            )}
          </Card>

          <Card onClick={onBookAppointment} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
            <div className="p-6">
              <Calendar className="w-10 h-10 text-cyan-600 mb-3" />
              <h2 className="text-xl font-bold text-gray-900 mb-1">Book Appointment</h2>
              <p className="text-gray-500 text-sm">Schedule a visit for a later date and time</p>
            </div>
            {isDesktop && (
              <div className="p-4 bg-gray-50">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-500" />
                    Choose your preferred kiosk
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-500" />
                    Select date and time
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-500" />
                    Calendar reminders
                  </li>
                </ul>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// GET CARE REASON PAGE
// ============================================================================

const GetCareReasonPage = ({ onBack, onSelect }) => {
  const { isDesktop } = useResponsive();
  const [selected, setSelected] = useState(null);

  return (
    <div className={`${isDesktop ? 'p-6 lg:p-8' : 'min-h-screen bg-gray-50'}`}>
      <div className={`${isDesktop ? 'max-w-2xl mx-auto' : ''}`}>
        {!isDesktop && <Header title="Get Care Now" onBack={onBack} />}
        
        <div className={`${isDesktop ? '' : 'p-6'}`}>
          <h2 className="text-xl font-bold text-gray-900 text-center mb-2">Get Care Now</h2>
          <p className="text-gray-500 text-center mb-6">What would you like help with today?</p>
          
          <div className="space-y-3 mb-8">
            {GET_CARE_REASONS.map((reason) => (
              <button
                key={reason.id}
                onClick={() => setSelected(reason.id)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                  selected === reason.id
                    ? 'border-cyan-500 bg-cyan-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <span className="font-medium text-gray-900">{reason.title}</span>
              </button>
            ))}
          </div>

          <Button size="lg" onClick={() => onSelect(selected)} disabled={!selected} className="w-full">
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// DESCRIBE SYMPTOMS PAGE
// ============================================================================

const DescribeSymptomsPage = ({ onBack, onContinue }) => {
  const { isDesktop } = useResponsive();
  const [symptoms, setSymptoms] = useState('');
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState('');

  const durations = [
    'Less than 24 hours',
    '1-3 days',
    '4-7 days',
    'More than a week',
    'More than a month',
  ];

  return (
    <div className={`${isDesktop ? 'p-6 lg:p-8' : 'min-h-screen bg-gray-50'}`}>
      <div className={`${isDesktop ? 'max-w-2xl mx-auto' : ''}`}>
        {!isDesktop && <Header title="Describe Symptoms" onBack={onBack} />}
        
        <div className={`${isDesktop ? '' : 'p-6'}`}>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Describe Your Symptoms</h2>
          <p className="text-gray-500 mb-6">Please tell us what's going on:</p>

          <div className="space-y-6">
            <div>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe your symptoms here..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                How long has this been going on?
              </label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none bg-white"
              >
                <option value="">Select duration</option>
                {durations.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">Severity:</label>
              <div className="flex gap-4">
                {['Mild', 'Moderate', 'Severe'].map((level) => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="severity"
                      value={level}
                      checked={severity === level}
                      onChange={(e) => setSeverity(e.target.value)}
                      className="w-4 h-4 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="text-gray-700">{level}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button 
              size="lg" 
              onClick={() => onContinue({ symptoms, duration, severity })}
              disabled={!symptoms || !duration || !severity}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// QUICK QUESTIONS PAGE
// ============================================================================

const QuickQuestionsPage = ({ onBack, onContinue }) => {
  const { isDesktop } = useResponsive();
  const [answers, setAnswers] = useState({
    chestPain: null,
    fever: null,
    travel: null,
  });

  const questions = [
    { id: 'chestPain', text: 'Any chest pain or trouble breathing?' },
    { id: 'fever', text: 'High fever (over 38.5°C)?' },
    { id: 'travel', text: 'Recent travel or known exposure?' },
  ];

  const handleAnswer = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const allAnswered = Object.values(answers).every(a => a !== null);

  return (
    <div className={`${isDesktop ? 'p-6 lg:p-8' : 'min-h-screen bg-gray-50'}`}>
      <div className={`${isDesktop ? 'max-w-2xl mx-auto' : ''}`}>
        {!isDesktop && <Header title="Quick Questions" onBack={onBack} />}
        
        <div className={`${isDesktop ? '' : 'p-6'}`}>
          <h2 className="text-xl font-bold text-gray-900 mb-6">A Few Quick Questions</h2>

          <div className="space-y-6">
            {questions.map((q) => (
              <div key={q.id} className="space-y-3">
                <p className="font-medium text-gray-900">• {q.text}</p>
                <div className="flex gap-6 pl-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={q.id}
                      checked={answers[q.id] === true}
                      onChange={() => handleAnswer(q.id, true)}
                      className="w-4 h-4 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="text-gray-700">Yes</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name={q.id}
                      checked={answers[q.id] === false}
                      onChange={() => handleAnswer(q.id, false)}
                      className="w-4 h-4 text-cyan-500 focus:ring-cyan-500"
                    />
                    <span className="text-gray-700">No</span>
                  </label>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <Button 
              size="lg" 
              onClick={() => onContinue(answers)}
              disabled={!allAnswered}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// AI PRE-DIAGNOSIS PAGE
// ============================================================================

const AIPreDiagnosisPage = ({ symptomsData, answers, onContinue, onBack }) => {
  const { isDesktop } = useResponsive();
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnalyzing(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const getDiagnosis = () => {
    const severity = symptomsData?.severity || 'Moderate';
    const hasChestPain = answers?.chestPain;
    const hasFever = answers?.fever;

    if (hasChestPain) {
      return {
        priority: 'High Priority',
        priorityColor: 'red',
        title: 'Urgent Attention Recommended',
        summary: 'Based on your reported chest pain or breathing difficulty, we recommend immediate medical attention.',
        conditions: ['Possible cardiac concern', 'Respiratory distress', 'Anxiety-related symptoms'],
        recommendation: 'Please visit your nearest ExtendiHealth Kiosk immediately for vital signs assessment and virtual clinician consultation.',
        tips: [
          'Stay calm and avoid physical exertion',
          'If symptoms worsen, call 911 immediately',
          'Have someone accompany you if possible',
        ],
      };
    }

    if (hasFever && severity === 'Severe') {
      return {
        priority: 'Moderate Priority',
        priorityColor: 'yellow',
        title: 'Medical Consultation Recommended',
        summary: 'Your symptoms suggest a possible infection that may require treatment.',
        conditions: ['Viral infection (flu, COVID-19)', 'Bacterial infection', 'Upper respiratory infection'],
        recommendation: 'We recommend visiting an ExtendiHealth Kiosk for a thorough assessment and potential prescription.',
        tips: [
          'Stay hydrated with water and clear fluids',
          'Rest as much as possible',
          'Take over-the-counter fever reducers if needed',
          'Monitor your temperature regularly',
        ],
      };
    }

    return {
      priority: 'Low Priority',
      priorityColor: 'green',
      title: 'Routine Care Suggested',
      summary: `Based on your symptoms of ${symptomsData?.symptoms || 'general discomfort'}, you are likely experiencing a minor illness that can be managed with proper care.`,
      conditions: ['Common cold (viral upper respiratory infection)', 'Seasonal allergies', 'Mild viral illness'],
      recommendation: 'Visit an ExtendiHealth Kiosk at your convenience for a check-up and personalized care recommendations.',
      tips: [
        'Stay well hydrated with water and warm fluids',
        'Get plenty of rest',
        'Use over-the-counter remedies for symptom relief',
        'Avoid close contact with others to prevent spreading',
      ],
    };
  };

  const diagnosis = getDiagnosis();

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mb-6" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Analyzing Your Symptoms</h2>
        <p className="text-gray-500 text-center">Our AI is reviewing your information to provide personalized recommendations...</p>
      </div>
    );
  }

  const priorityStyles = {
    red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', icon: 'text-red-500' },
    yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200', icon: 'text-yellow-500' },
    green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200', icon: 'text-green-500' },
  };

  const styles = priorityStyles[diagnosis.priorityColor];

  return (
    <div className={`${isDesktop ? 'p-6 lg:p-8' : 'min-h-screen bg-gray-50 pb-8'}`}>
      <div className={`${isDesktop ? 'max-w-2xl mx-auto' : ''}`}>
        {!isDesktop && <Header title="AI Assessment" onBack={onBack} />}
        
        <div className={`${isDesktop ? '' : 'p-4'}`}>
          {/* Priority Badge */}
          <div className={`${styles.bg} ${styles.border} border rounded-2xl p-4 mb-4`}>
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className={`w-6 h-6 ${styles.icon}`} />
              <span className={`font-bold ${styles.text}`}>{diagnosis.priority}</span>
            </div>
            <h2 className="text-lg font-bold text-gray-900 mb-2">{diagnosis.title}</h2>
            <p className="text-gray-600 text-sm">{diagnosis.summary}</p>
          </div>

          {/* Possible Conditions */}
          <Card className="p-4 mb-4">
            <h3 className="font-bold text-gray-900 mb-3">Possible Conditions</h3>
            <ul className="space-y-2">
              {diagnosis.conditions.map((condition, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="text-cyan-500 mt-0.5">•</span>
                  {condition}
                </li>
              ))}
            </ul>
          </Card>

          {/* Recommendation */}
          <Card className="p-4 mb-4 bg-cyan-50 border-cyan-100">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-cyan-600 mt-0.5" />
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Our Recommendation</h3>
                <p className="text-sm text-gray-600">{diagnosis.recommendation}</p>
              </div>
            </div>
          </Card>

          {/* While You Wait Tips */}
          <Card className="p-4 mb-6">
            <h3 className="font-bold text-gray-900 mb-3">While You Wait</h3>
            <ul className="space-y-2">
              {diagnosis.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {tip}
                </li>
              ))}
            </ul>
          </Card>

          {/* Disclaimer */}
          <p className="text-xs text-gray-400 text-center mb-6 italic">
            This is an AI-powered pre-assessment and not a medical diagnosis. 
            A healthcare professional at the kiosk will provide a proper evaluation.
          </p>

          <Button size="lg" onClick={onContinue} className="w-full">
            Find a Nearby Kiosk
          </Button>
        </div>
      </div>
    </div>
  );
};

// Placeholder for remaining screens - will be added in next part
// ============================================================================
// SETTINGS PAGE WITH DEMO DATA RESET
// ============================================================================

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

const EWaitingRoomPage = ({ waitingRoom, onUpdateWaitingRoom, appointments, onBack, onLeaveQueue }) => {
  const { isDesktop } = useResponsive();
  const [activeWaiting, setActiveWaiting] = useState(waitingRoom?.isActive || false);

  // Simulate queue updates
  useEffect(() => {
    if (activeWaiting && waitingRoom?.queuePosition > 1) {
      const interval = setInterval(() => {
        onUpdateWaitingRoom(prev => ({
          ...prev,
          queuePosition: Math.max(1, (prev?.queuePosition || 5) - 1),
          estimatedWait: Math.max(5, (prev?.estimatedWait || 30) - 5),
        }));
      }, 30000); // Update every 30 seconds for demo
      return () => clearInterval(interval);
    }
  }, [activeWaiting, waitingRoom?.queuePosition]);

  const upcomingAppointments = appointments.filter(a => 
    a.status === 'Confirmed' || a.status === 'Scheduled'
  );

  const handleJoinQueue = (appointment) => {
    const kiosk = KIOSKS.find(k => k.name === appointment.location) || KIOSKS[0];
    onUpdateWaitingRoom({
      isActive: true,
      queuePosition: Math.floor(Math.random() * 5) + 2,
      estimatedWait: Math.floor(Math.random() * 20) + 10,
      kiosk: kiosk,
      joinedAt: new Date().toISOString(),
      appointmentType: appointment.type,
      appointmentId: appointment.id,
      reason: appointment.reason,
      notificationsSent: [],
    });
    setActiveWaiting(true);
  };

  const handleLeaveQueue = () => {
    onUpdateWaitingRoom({
      isActive: false,
      queuePosition: null,
      estimatedWait: null,
      kiosk: null,
      joinedAt: null,
    });
    setActiveWaiting(false);
    if (onLeaveQueue) onLeaveQueue();
  };

  const content = (
    <div className="space-y-6">
      {/* Active Queue Status */}
      {activeWaiting && waitingRoom?.isActive && (
        <Card className="overflow-hidden border-2 border-cyan-500">
          <div className="bg-gradient-to-r from-cyan-500 to-teal-500 p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cyan-100 text-sm">You're in the queue!</p>
                <h2 className="text-2xl font-bold">Position #{waitingRoom.queuePosition}</h2>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <Clock className="w-8 h-8" />
              </div>
            </div>
          </div>
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-cyan-600">{waitingRoom.estimatedWait}</p>
                <p className="text-sm text-gray-500">minutes wait</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-3xl font-bold text-cyan-600">{waitingRoom.queuePosition - 1}</p>
                <p className="text-sm text-gray-500">people ahead</p>
              </div>
            </div>

            <div className="bg-cyan-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-cyan-600 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">{waitingRoom.kiosk?.name}</p>
                  <p className="text-sm text-gray-500">{waitingRoom.kiosk?.address}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="font-medium text-green-800">Notifications Active</p>
                  <p className="text-sm text-green-600">We'll notify you when it's almost your turn</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1" onClick={handleLeaveQueue}>
                Leave Queue
              </Button>
              <Button className="flex-1">
                <Navigation className="w-5 h-5" />
                Get Directions
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Queue Tips */}
      {activeWaiting && (
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-cyan-600" />
            While You Wait
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-500 mt-0.5" />
              Stay within 15 minutes of the kiosk
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-500 mt-0.5" />
              Have your health card ready
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-500 mt-0.5" />
              Keep your phone nearby for notifications
            </li>
            <li className="flex items-start gap-2">
              <Check className="w-4 h-4 text-green-500 mt-0.5" />
              Arrive when notified to secure your spot
            </li>
          </ul>
        </Card>
      )}

      {/* Available Appointments to Join */}
      {!activeWaiting && (
        <>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Join e-Waiting Room</h2>
            <p className="text-gray-500 mb-4">
              Select an upcoming appointment to join the virtual queue. Wait from home and get notified when it's your turn.
            </p>
          </div>

          {upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <Card key={apt.id} className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{apt.type}</h3>
                      <p className="text-sm text-gray-500">{apt.doctor}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        {apt.date} at {apt.time}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{apt.location}</p>
                    </div>
                    <Button size="sm" onClick={() => handleJoinQueue(apt)}>
                      Join Queue
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">No Upcoming Appointments</h3>
              <p className="text-gray-500 text-sm">
                Book an appointment first, then you can join the e-Waiting Room.
              </p>
            </Card>
          )}

          {/* How It Works */}
          <Card className="p-4 bg-cyan-50 border-cyan-100">
            <h3 className="font-semibold text-cyan-800 mb-3">How e-Waiting Room Works</h3>
            <div className="space-y-3">
              {[
                { step: 1, text: 'Join the queue from anywhere' },
                { step: 2, text: 'Get real-time position updates' },
                { step: 3, text: 'Receive notification when it\'s almost your turn' },
                { step: 4, text: 'Arrive at kiosk and check in' },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-cyan-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                  <span className="text-sm text-cyan-800">{item.text}</span>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">e-Waiting Room</h1>
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="e-Waiting Room" onBack={onBack} />
      <div className="p-4 pb-24">
        {content}
      </div>
    </div>
  );
};

// ============================================================================
// REFERRALS PAGE
// ============================================================================

const ReferralsPage = ({ referrals, onBack }) => {
  const { isDesktop } = useResponsive();
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [filter, setFilter] = useState('all');

  const statusColors = {
    'Pending Appointment': 'bg-amber-100 text-amber-800',
    'Appointment Scheduled': 'bg-cyan-100 text-cyan-800',
    'Completed': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
  };

  const filteredReferrals = filter === 'all' 
    ? referrals 
    : referrals.filter(r => r.status.toLowerCase().includes(filter));

  const content = (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'pending', 'scheduled', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f 
                ? 'bg-cyan-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Referrals List */}
      {filteredReferrals.length > 0 ? (
        <div className="space-y-3">
          {filteredReferrals.map((referral) => (
            <Card 
              key={referral.id} 
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedReferral(referral)}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{referral.specialty}</h3>
                  <p className="text-sm text-gray-600">{referral.referredTo}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[referral.status] || 'bg-gray-100 text-gray-800'}`}>
                  {referral.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">{referral.reason}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>Referred: {referral.referralDate}</span>
                <span>By: {referral.referredBy}</span>
              </div>
              {referral.appointmentDate && (
                <div className="mt-2 bg-cyan-50 rounded-lg p-2">
                  <p className="text-sm text-cyan-800 font-medium">
                    📅 Appointment: {referral.appointmentDate} at {referral.appointmentTime}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No Referrals</h3>
          <p className="text-gray-500 text-sm">
            You don't have any {filter !== 'all' ? filter : ''} referrals.
          </p>
        </Card>
      )}

      {/* Referral Detail Modal */}
      {selectedReferral && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Referral Details</h2>
              <button onClick={() => setSelectedReferral(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedReferral.status]}`}>
                  {selectedReferral.status}
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Specialty</label>
                  <p className="font-medium text-gray-900">{selectedReferral.specialty}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Referred To</label>
                  <p className="font-medium text-gray-900">{selectedReferral.referredTo}</p>
                  <p className="text-sm text-gray-600">{selectedReferral.referredToCredentials}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Facility</label>
                  <p className="font-medium text-gray-900">{selectedReferral.referredToFacility}</p>
                  <p className="text-sm text-gray-500">{selectedReferral.referredToAddress}</p>
                  <p className="text-sm text-cyan-600">{selectedReferral.referredToPhone}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Reason for Referral</label>
                  <p className="text-gray-700">{selectedReferral.reason}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Referred By</label>
                  <p className="font-medium text-gray-900">{selectedReferral.referredBy}</p>
                  <p className="text-sm text-gray-500">Date: {selectedReferral.referralDate}</p>
                </div>
                {selectedReferral.notes && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider">Notes</label>
                    <p className="text-gray-700">{selectedReferral.notes}</p>
                  </div>
                )}
                {selectedReferral.appointmentDate && (
                  <div className="bg-cyan-50 rounded-xl p-4">
                    <label className="text-xs text-cyan-600 uppercase tracking-wider">Scheduled Appointment</label>
                    <p className="font-semibold text-cyan-800 mt-1">
                      {selectedReferral.appointmentDate} at {selectedReferral.appointmentTime}
                    </p>
                  </div>
                )}
                {selectedReferral.results && (
                  <div className="bg-green-50 rounded-xl p-4">
                    <label className="text-xs text-green-600 uppercase tracking-wider">Results</label>
                    <p className="text-green-800 mt-1">{selectedReferral.results}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="secondary" className="flex-1" onClick={() => setSelectedReferral(null)}>
                  Close
                </Button>
                {selectedReferral.status === 'Pending Appointment' && (
                  <Button className="flex-1">
                    <Phone className="w-4 h-4" />
                    Call to Book
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Referrals</h1>
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="My Referrals" onBack={onBack} />
      <div className="p-4 pb-24">
        {content}
      </div>
    </div>
  );
};

// ============================================================================
// VISIT HISTORY PAGE
// ============================================================================

const VisitHistoryPage = ({ visits, onBack }) => {
  const { isDesktop } = useResponsive();
  const [selectedVisit, setSelectedVisit] = useState(null);

  const content = (
    <div className="space-y-4">
      {visits.length > 0 ? (
        visits.map((visit) => (
          <Card 
            key={visit.id} 
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedVisit(visit)}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">{visit.type}</h3>
                <p className="text-sm text-gray-600">{visit.provider}</p>
              </div>
              <span className="text-sm text-gray-500">{visit.date}</span>
            </div>
            <p className="text-sm text-gray-500 mb-2">{visit.chiefComplaint}</p>
            {visit.diagnosis && visit.diagnosis.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {visit.diagnosis.slice(0, 2).map((dx, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                    {dx.split('(')[0].trim()}
                  </span>
                ))}
                {visit.diagnosis.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                    +{visit.diagnosis.length - 2} more
                  </span>
                )}
              </div>
            )}
          </Card>
        ))
      ) : (
        <Card className="p-8 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No Visit History</h3>
          <p className="text-gray-500 text-sm">Your visit history will appear here.</p>
        </Card>
      )}

      {/* Visit Detail Modal */}
      {selectedVisit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-lg font-bold text-gray-900">Visit Summary</h2>
              <button onClick={() => setSelectedVisit(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedVisit.type}</h3>
                  <p className="text-sm text-gray-500">{selectedVisit.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase">Provider</label>
                  <p className="font-medium">{selectedVisit.provider}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Facility</label>
                  <p className="text-sm">{selectedVisit.facility}</p>
                </div>
              </div>

              {selectedVisit.vitals && (
                <div className="bg-cyan-50 rounded-xl p-4">
                  <label className="text-xs text-cyan-600 uppercase tracking-wider mb-2 block">Vitals</label>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {selectedVisit.vitals.bp && <p>BP: <strong>{selectedVisit.vitals.bp}</strong></p>}
                    {selectedVisit.vitals.hr && <p>HR: <strong>{selectedVisit.vitals.hr} bpm</strong></p>}
                    {selectedVisit.vitals.temp && <p>Temp: <strong>{selectedVisit.vitals.temp}</strong></p>}
                    {selectedVisit.vitals.weight && <p>Weight: <strong>{selectedVisit.vitals.weight}</strong></p>}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs text-gray-500 uppercase">Chief Complaint</label>
                <p className="text-gray-700">{selectedVisit.chiefComplaint}</p>
              </div>

              {selectedVisit.diagnosis && selectedVisit.diagnosis.length > 0 && (
                <div>
                  <label className="text-xs text-gray-500 uppercase">Diagnosis</label>
                  <ul className="mt-1 space-y-1">
                    {selectedVisit.diagnosis.map((dx, i) => (
                      <li key={i} className="text-sm text-gray-700">• {dx}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedVisit.treatment && (
                <div>
                  <label className="text-xs text-gray-500 uppercase">Treatment Plan</label>
                  <p className="text-gray-700">{selectedVisit.treatment}</p>
                </div>
              )}

              {selectedVisit.prescriptions && selectedVisit.prescriptions.length > 0 && (
                <div>
                  <label className="text-xs text-gray-500 uppercase">Prescriptions</label>
                  <ul className="mt-1 space-y-1">
                    {selectedVisit.prescriptions.map((rx, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                        <Pill className="w-4 h-4 text-cyan-600" /> {rx}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedVisit.notes && (
                <div>
                  <label className="text-xs text-gray-500 uppercase">Notes</label>
                  <p className="text-gray-700 text-sm">{selectedVisit.notes}</p>
                </div>
              )}

              {selectedVisit.followUp && (
                <div className="bg-amber-50 rounded-xl p-4">
                  <label className="text-xs text-amber-600 uppercase">Follow-up</label>
                  <p className="text-amber-800 font-medium">{selectedVisit.followUp}</p>
                </div>
              )}

              <Button variant="secondary" className="w-full" onClick={() => setSelectedVisit(null)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Visit History</h1>
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Visit History" onBack={onBack} />
      <div className="p-4 pb-24">
        {content}
      </div>
    </div>
  );
};

// ============================================================================
// KIOSKS LIST PAGE
// ============================================================================

const KiosksListPage = ({ onBack, onSelectKiosk, onBookSlot, selectedFilter = 'all' }) => {
  const { isDesktop } = useResponsive();
  const [filter, setFilter] = useState(selectedFilter);
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');

  const filterOptions = [
    { id: 'all', label: 'All Types' },
    { id: 'pharmacy', label: 'Pharmacy Kiosk' },
    { id: 'clinic', label: 'Clinic Kiosk' },
    { id: 'hospital', label: 'Hospital Lobby' },
    { id: 'rural', label: 'Rural Pop-up' },
  ];

  const filteredKiosks = KIOSKS.filter(kiosk => {
    const matchesFilter = filter === 'all' || kiosk.type.toLowerCase().includes(filter);
    const matchesSearch = !searchQuery || 
      kiosk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kiosk.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTypeColor = (type) => {
    if (type.includes('Pharmacy')) return 'bg-green-100 text-green-700';
    if (type.includes('Clinic')) return 'bg-cyan-100 text-cyan-700';
    if (type.includes('Hospital')) return 'bg-purple-100 text-purple-700';
    if (type.includes('Rural')) return 'bg-amber-100 text-amber-700';
    return 'bg-gray-100 text-gray-700';
  };

  const KioskCard = ({ kiosk }) => (
    <Card className="p-5 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-lg">{kiosk.name}</h3>
        {kiosk.rating && (
          <div className="flex items-center gap-1 text-sm">
            <span className="text-amber-500">★</span>
            <span className="font-medium">{kiosk.rating}</span>
          </div>
        )}
      </div>
      
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${getTypeColor(kiosk.type)}`}>
        {kiosk.type}
      </span>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{kiosk.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{kiosk.distance} km • {kiosk.isOpen ? <span className="text-green-600">Open</span> : <span className="text-red-600">Closed</span>} • {kiosk.hours}</span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-500" />
          <span className="text-cyan-600 font-medium">{kiosk.walkInStatus}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {kiosk.services.slice(0, 3).map((service, i) => (
          <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
            {service}
          </span>
        ))}
        {kiosk.services.length > 3 && (
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
            +{kiosk.services.length - 3} more
          </span>
        )}
      </div>

      <div className="flex gap-3">
        <button 
          onClick={() => onSelectKiosk(kiosk)}
          className="flex-1 px-4 py-2.5 border-2 border-cyan-500 text-cyan-600 font-semibold rounded-xl hover:bg-cyan-50 transition-colors text-sm"
        >
          View Details
        </button>
        <button 
          onClick={() => onBookSlot(kiosk)}
          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm"
        >
          Book Slot
        </button>
      </div>
    </Card>
  );

  const content = (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search kiosks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none bg-white"
        />
      </div>

      {/* View Toggle & Count */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {filteredKiosks.length} kiosks found
        </div>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              viewMode === 'map' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Map View
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            List View
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setFilter(opt.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              filter === opt.id 
                ? 'bg-cyan-500 text-white shadow-md' 
                : 'bg-white border border-gray-200 text-gray-600 hover:border-cyan-300 hover:text-cyan-600'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Map View Placeholder */}
      {viewMode === 'map' && (
        <Card className="h-80 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border border-gray-200">
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
              <MapPin className="w-8 h-8 text-cyan-500" />
            </div>
            <p className="font-semibold text-gray-700">Map View</p>
            <p className="text-sm">Interactive map coming soon</p>
          </div>
        </Card>
      )}

      {/* Kiosks Grid/List */}
      {viewMode === 'list' && (
        <div className={isDesktop ? "grid grid-cols-2 gap-4" : "space-y-4"}>
          {filteredKiosks.map((kiosk) => (
            <KioskCard key={kiosk.id} kiosk={kiosk} />
          ))}
        </div>
      )}

      {filteredKiosks.length === 0 && (
        <Card className="p-12 text-center border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">No Kiosks Found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your filters or search.</p>
        </Card>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kiosks Near You</h1>
            <p className="text-gray-500 mt-1">Find and book appointments at nearby health kiosks</p>
          </div>
        </div>
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Kiosks Near You" onBack={onBack} />
      <div className="p-4 pb-24">
        {content}
      </div>
    </div>
  );
};

// ============================================================================
// KIOSK DETAILS PAGE
// ============================================================================

const KioskDetailsPage = ({ kiosk, onBack, onBookSlot, onWalkIn, onGetDirections }) => {
  const { isDesktop } = useResponsive();
  
  if (!kiosk) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Kiosk not found</p>
      </div>
    );
  }

  const getTypeColor = (type) => {
    if (type.includes('Pharmacy')) return 'bg-green-100 text-green-700';
    if (type.includes('Clinic')) return 'bg-cyan-100 text-cyan-700';
    if (type.includes('Hospital')) return 'bg-purple-100 text-purple-700';
    if (type.includes('Rural')) return 'bg-amber-100 text-amber-700';
    return 'bg-gray-100 text-gray-700';
  };

  const content = (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center">
          <MapPin className="w-16 h-16 text-white/50" />
        </div>
        <div className="p-4">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${getTypeColor(kiosk.type)}`}>
            {kiosk.type}
          </span>
          <h1 className="text-xl font-bold text-gray-900 mb-1">{kiosk.name}</h1>
          <p className="text-gray-500">{kiosk.address}</p>
          
          {kiosk.rating && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <span className="text-amber-500">★</span>
                <span className="font-semibold">{kiosk.rating}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-500">{kiosk.reviews} reviews</span>
            </div>
          )}
        </div>
      </Card>

      {/* Quick Info */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <Clock className="w-6 h-6 text-cyan-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">{kiosk.wait} min</p>
          <p className="text-xs text-gray-500">Wait Time</p>
        </Card>
        <Card className="p-4 text-center">
          <Navigation className="w-6 h-6 text-cyan-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">{kiosk.distance} km</p>
          <p className="text-xs text-gray-500">Distance</p>
        </Card>
        <Card className="p-4 text-center">
          <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${kiosk.isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
          <p className="text-lg font-bold text-gray-900">{kiosk.isOpen ? 'Open' : 'Closed'}</p>
          <p className="text-xs text-gray-500">Status</p>
        </Card>
      </div>

      {/* Hours & Contact */}
      <Card className="p-4 space-y-4">
        <h3 className="font-semibold text-gray-900">Hours & Contact</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">{kiosk.hours}</p>
              <p className="text-sm text-cyan-600">Next available: {kiosk.nextAvailable}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <p className="text-gray-700">{kiosk.phone}</p>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <p className="text-gray-700">{kiosk.email}</p>
          </div>
        </div>
      </Card>

      {/* Services */}
      <Card className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Services Available</h3>
        <div className="flex flex-wrap gap-2">
          {kiosk.services.map((service, i) => (
            <span key={i} className="px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-sm font-medium">
              {service}
            </span>
          ))}
        </div>
      </Card>

      {/* Providers */}
      {kiosk.providers && (
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Healthcare Providers</h3>
          <div className="space-y-2">
            {kiosk.providers.map((provider, i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-cyan-600" />
                </div>
                <span className="font-medium text-gray-700">{provider}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Amenities */}
      {kiosk.amenities && (
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {kiosk.amenities.map((amenity, i) => (
              <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm">
                {amenity}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Languages */}
      {kiosk.languages && (
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Languages</h3>
          <div className="flex flex-wrap gap-2">
            {kiosk.languages.map((lang, i) => (
              <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {lang}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button size="lg" className="w-full" onClick={() => onBookSlot(kiosk)}>
          <Calendar className="w-5 h-5" />
          Book Appointment
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" size="lg" onClick={() => onWalkIn(kiosk)}>
            <Clock className="w-5 h-5" />
            Walk-In Now
          </Button>
          <Button variant="secondary" size="lg" onClick={onGetDirections}>
            <Navigation className="w-5 h-5" />
            Directions
          </Button>
        </div>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ChevronLeft className="w-5 h-5" />
          Back to Kiosks
        </button>
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Kiosk Details" onBack={onBack} />
      <div className="p-4 pb-24">
        {content}
      </div>
    </div>
  );
};

// ============================================================================
// BOOK KIOSK SLOT PAGE
// ============================================================================

const BookKioskSlotPage = ({ kiosk, user, bookingFlow, onBack, onConfirm, onUpdateBooking }) => {
  const { isDesktop } = useResponsive();
  const [step, setStep] = useState(1); // 1: Reason, 2: Date/Time, 3: Review
  const [selectedReason, setSelectedReason] = useState(bookingFlow?.reason || null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [notes, setNotes] = useState('');
  const [visitType, setVisitType] = useState('in-person');

  const visitReasons = [
    { id: 'general', title: 'General Assessment', subtitle: 'Health check, minor concerns', icon: Activity, duration: '15-20 min' },
    { id: 'chronic', title: 'Chronic Condition Review', subtitle: 'Diabetes, hypertension, etc.', icon: Heart, duration: '20-30 min' },
    { id: 'prescription', title: 'Prescription Refill', subtitle: 'Renew medications', icon: Pill, duration: '10-15 min' },
    { id: 'labwork', title: 'Lab Work / Tests', subtitle: 'Blood work, vitals check', icon: FlaskConical, duration: '15-20 min' },
    { id: 'followup', title: 'Follow-up Visit', subtitle: 'Previous appointment follow-up', icon: Calendar, duration: '15-20 min' },
    { id: 'virtual', title: 'Virtual Consultation', subtitle: 'Video call with provider', icon: Video, duration: '15-30 min' },
  ];

  // Generate available dates (next 7 days)
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      date: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      isToday: i === 0,
    };
  });

  // Generate time slots
  const timeSlots = [
    { time: '9:00 AM', available: true },
    { time: '9:30 AM', available: false },
    { time: '10:00 AM', available: true },
    { time: '10:30 AM', available: true },
    { time: '11:00 AM', available: true },
    { time: '11:30 AM', available: false },
    { time: '1:00 PM', available: true },
    { time: '1:30 PM', available: true },
    { time: '2:00 PM', available: true },
    { time: '2:30 PM', available: false },
    { time: '3:00 PM', available: true },
    { time: '3:30 PM', available: true },
    { time: '4:00 PM', available: true },
    { time: '4:30 PM', available: true },
  ];

  const handleContinue = () => {
    if (step === 1 && selectedReason) {
      setStep(2);
    } else if (step === 2 && selectedDate && selectedTime) {
      setStep(3);
    } else if (step === 3) {
      const appointmentNumber = `EH-${Date.now().toString(36).toUpperCase()}`;
      onConfirm({
        kiosk,
        reason: visitReasons.find(r => r.id === selectedReason),
        date: selectedDate,
        time: selectedTime,
        notes,
        visitType,
        appointmentNumber,
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">What brings you in?</h2>
              <p className="text-gray-500">Select the reason for your visit</p>
            </div>

            <div className="space-y-3">
              {visitReasons.map((reason) => (
                <button
                  key={reason.id}
                  onClick={() => setSelectedReason(reason.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    selectedReason === reason.id
                      ? 'border-cyan-500 bg-cyan-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      selectedReason === reason.id ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <reason.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{reason.title}</h3>
                      <p className="text-sm text-gray-500">{reason.subtitle}</p>
                      <p className="text-xs text-cyan-600 mt-1">{reason.duration}</p>
                    </div>
                    {selectedReason === reason.id && (
                      <Check className="w-5 h-5 text-cyan-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Visit Type */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-700 mb-3">Visit Type</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setVisitType('in-person')}
                  className={`flex-1 p-3 rounded-xl border-2 text-center transition-all ${
                    visitType === 'in-person' ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200'
                  }`}
                >
                  <MapPin className={`w-5 h-5 mx-auto mb-1 ${visitType === 'in-person' ? 'text-cyan-500' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium">In-Person</span>
                </button>
                <button
                  onClick={() => setVisitType('virtual')}
                  className={`flex-1 p-3 rounded-xl border-2 text-center transition-all ${
                    visitType === 'virtual' ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200'
                  }`}
                >
                  <Video className={`w-5 h-5 mx-auto mb-1 ${visitType === 'virtual' ? 'text-cyan-500' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium">Virtual</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Select Date & Time</h2>
              <p className="text-gray-500">Choose your preferred appointment slot</p>
            </div>

            {/* Date Selection */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Select Date</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {availableDates.map((d) => (
                  <button
                    key={d.date}
                    onClick={() => setSelectedDate(d)}
                    className={`flex-shrink-0 w-16 py-3 rounded-xl text-center transition-all ${
                      selectedDate?.date === d.date
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <p className="text-xs font-medium">{d.isToday ? 'Today' : d.dayName}</p>
                    <p className="text-xl font-bold">{d.dayNum}</p>
                    <p className="text-xs">{d.month}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Select Time</p>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${
                        selectedTime === slot.time
                          ? 'bg-cyan-500 text-white'
                          : slot.available
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          : 'bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Additional Notes (Optional)</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional information for your provider..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none"
              />
            </div>
          </div>
        );

      case 3:
        const reason = visitReasons.find(r => r.id === selectedReason);
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Review & Confirm</h2>
              <p className="text-gray-500">Please review your appointment details</p>
            </div>

            <Card className="p-4 space-y-4">
              {/* Kiosk Info */}
              <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{kiosk.name}</h3>
                  <p className="text-sm text-gray-500">{kiosk.address}</p>
                </div>
              </div>

              {/* Visit Details */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Visit Type</span>
                  <span className="font-medium flex items-center gap-2">
                    {visitType === 'virtual' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                    {visitType === 'virtual' ? 'Virtual' : 'In-Person'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reason</span>
                  <span className="font-medium">{reason?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium">{selectedDate?.month} {selectedDate?.dayNum}, {new Date().getFullYear()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium">{reason?.duration}</span>
                </div>
              </div>

              {notes && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Notes</p>
                  <p className="text-gray-700">{notes}</p>
                </div>
              )}
            </Card>

            {/* Patient Info */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Patient Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium">{user?.name || user?.firstName + ' ' + user?.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Health Card</span>
                  <span className="font-medium">{user?.healthCard || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium">{user?.phone}</span>
                </div>
              </div>
            </Card>

            {/* Confirmation Notice */}
            <div className="bg-cyan-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-cyan-600 mt-0.5" />
                <div>
                  <p className="font-medium text-cyan-800">Confirmation & Reminders</p>
                  <p className="text-sm text-cyan-600 mt-1">
                    You'll receive a confirmation email and SMS reminder 1 hour before your appointment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const content = (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              s < step ? 'bg-cyan-500 text-white' :
              s === step ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {s < step ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 3 && <div className={`flex-1 h-1 rounded ${s < step ? 'bg-cyan-500' : 'bg-gray-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      {renderStep()}

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-4">
        {step > 1 && (
          <Button variant="secondary" size="lg" onClick={() => setStep(step - 1)} className="flex-1">
            Back
          </Button>
        )}
        <Button 
          size="lg" 
          onClick={handleContinue}
          disabled={
            (step === 1 && !selectedReason) ||
            (step === 2 && (!selectedDate || !selectedTime))
          }
          className="flex-1"
        >
          {step === 3 ? 'Confirm Booking' : 'Continue'}
        </Button>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <Card className="p-6">
          {content}
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Book Appointment" onBack={onBack} />
      <div className="p-4 pb-24">
        {content}
      </div>
    </div>
  );
};

// ============================================================================
// APPOINTMENT CONFIRMED PAGE
// ============================================================================

const AppointmentConfirmedPage = ({ appointment, onDone, onJoinWaitingRoom, onViewAppointments }) => {
  const { isDesktop } = useResponsive();

  const content = (
    <div className="space-y-6 text-center">
      {/* Success Icon */}
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h1>
        <p className="text-gray-500">Your appointment has been successfully booked</p>
      </div>

      {/* Confirmation Number */}
      <Card className="p-4 bg-cyan-50 border-cyan-100">
        <p className="text-sm text-cyan-600 mb-1">Confirmation Number</p>
        <p className="text-2xl font-bold text-cyan-800 font-mono">{appointment?.appointmentNumber}</p>
      </Card>

      {/* Appointment Details */}
      <Card className="p-4 text-left">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">{appointment?.kiosk?.name}</p>
              <p className="text-sm text-gray-500">{appointment?.kiosk?.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-400" />
            <p className="text-gray-700">
              {appointment?.date?.month} {appointment?.date?.dayNum} at {appointment?.time}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-gray-400" />
            <p className="text-gray-700">{appointment?.reason?.title}</p>
          </div>
          <div className="flex items-center gap-3">
            {appointment?.visitType === 'virtual' ? (
              <Video className="w-5 h-5 text-gray-400" />
            ) : (
              <MapPin className="w-5 h-5 text-gray-400" />
            )}
            <p className="text-gray-700">{appointment?.visitType === 'virtual' ? 'Virtual Visit' : 'In-Person Visit'}</p>
          </div>
        </div>
      </Card>

      {/* Next Steps */}
      <Card className="p-4 text-left">
        <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-500 mt-0.5" />
            Confirmation sent to your email and phone
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-500 mt-0.5" />
            Reminder 1 hour before appointment
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-500 mt-0.5" />
            Join e-Waiting Room to skip the line
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-500 mt-0.5" />
            Bring your health card and ID
          </li>
        </ul>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <Button size="lg" className="w-full" onClick={onJoinWaitingRoom}>
          <Clock className="w-5 h-5" />
          Join e-Waiting Room
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" size="lg" onClick={onViewAppointments}>
            View Appointments
          </Button>
          <Button variant="secondary" size="lg" onClick={onDone}>
            Done
          </Button>
        </div>
      </div>

      {/* Add to Calendar */}
      <button className="flex items-center justify-center gap-2 text-cyan-600 font-medium mx-auto">
        <Calendar className="w-5 h-5" />
        Add to Calendar
      </button>
    </div>
  );

  if (isDesktop) {
    return (
      <div className="max-w-lg mx-auto py-8">
        <Card className="p-8">
          {content}
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      {content}
    </div>
  );
};

// ============================================================================
// KIOSK CHECK-IN PAGE
// ============================================================================

const KioskCheckInPage = ({ appointment, kiosk, user, onBack, onCheckInComplete, onStartVisit }) => {
  const { isDesktop } = useResponsive();
  const [step, setStep] = useState(1); // 1: Verify, 2: Vitals, 3: Ready
  const [vitals, setVitals] = useState({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    oxygenLevel: '',
    weight: '',
  });
  const [isCapturing, setIsCapturing] = useState(false);

  const simulateVitalCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setVitals({
        bloodPressure: '128/82',
        heartRate: '72',
        temperature: '98.4',
        oxygenLevel: '98',
        weight: '175',
      });
      setIsCapturing(false);
      setStep(3);
    }, 3000);
  };

  const content = (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {['Verify', 'Vitals', 'Ready'].map((label, i) => (
          <div key={label} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
              i + 1 < step ? 'bg-green-500 text-white' :
              i + 1 === step ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {i + 1 < step ? <Check className="w-5 h-5" /> : i + 1}
            </div>
            {i < 2 && <div className={`w-16 h-1 mx-2 ${i + 1 < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <>
          <div className="text-center">
            <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-cyan-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Verify Your Identity</h2>
            <p className="text-gray-500">Please confirm your information to check in</p>
          </div>

          <Card className="p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Name</span>
              <span className="font-medium">{user?.name || `${user?.firstName} ${user?.lastName}`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date of Birth</span>
              <span className="font-medium">{user?.dob}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Health Card</span>
              <span className="font-medium">{user?.healthCard}</span>
            </div>
          </Card>

          <Card className="p-4 bg-amber-50 border-amber-100">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Health Card Required</p>
                <p className="text-sm text-amber-600 mt-1">
                  Please have your health card ready to scan at the kiosk.
                </p>
              </div>
            </div>
          </Card>

          <Button size="lg" className="w-full" onClick={() => setStep(2)}>
            Confirm & Continue
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="text-center">
            <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-10 h-10 text-cyan-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Capture Vitals</h2>
            <p className="text-gray-500">The kiosk will measure your vitals automatically</p>
          </div>

          {isCapturing ? (
            <Card className="p-8 text-center">
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-cyan-600 animate-pulse" />
                </div>
                <p className="font-medium text-gray-900">Measuring vitals...</p>
                <p className="text-sm text-gray-500 mt-1">Please remain still</p>
              </div>
              <div className="mt-6 space-y-2">
                {['Blood Pressure', 'Heart Rate', 'Temperature', 'Oxygen Level'].map((vital, i) => (
                  <div key={vital} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${i < 2 ? 'bg-green-500' : 'bg-gray-300 animate-pulse'}`} />
                    <span className="text-sm text-gray-600">{vital}</span>
                    {i < 2 && <Check className="w-4 h-4 text-green-500 ml-auto" />}
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <>
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Instructions</h3>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    Sit comfortably in front of the kiosk
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    Place your arm in the blood pressure cuff
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    Place your finger on the pulse oximeter
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    Remain still during measurement
                  </li>
                </ol>
              </Card>

              <Button size="lg" className="w-full" onClick={simulateVitalCapture}>
                <Activity className="w-5 h-5" />
                Start Vital Capture
              </Button>
            </>
          )}
        </>
      )}

      {step === 3 && (
        <>
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Check-In Complete!</h2>
            <p className="text-gray-500">Your vitals have been recorded</p>
          </div>

          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Your Vitals</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-gray-900">{vitals.bloodPressure}</p>
                <p className="text-xs text-gray-500">Blood Pressure</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-gray-900">{vitals.heartRate} <span className="text-sm font-normal">bpm</span></p>
                <p className="text-xs text-gray-500">Heart Rate</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-gray-900">{vitals.temperature}°F</p>
                <p className="text-xs text-gray-500">Temperature</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-gray-900">{vitals.oxygenLevel}%</p>
                <p className="text-xs text-gray-500">Oxygen Level</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-cyan-50 border-cyan-100">
            <div className="flex items-start gap-3">
              <Video className="w-5 h-5 text-cyan-600 mt-0.5" />
              <div>
                <p className="font-medium text-cyan-800">Provider Ready</p>
                <p className="text-sm text-cyan-600 mt-1">
                  Dr. Michelle Chen is ready to see you. Click below to start your visit.
                </p>
              </div>
            </div>
          </Card>

          <Button size="lg" className="w-full" onClick={onStartVisit}>
            <Video className="w-5 h-5" />
            Start Virtual Visit
          </Button>

          <Button variant="secondary" size="lg" className="w-full" onClick={onCheckInComplete}>
            I'll Wait for In-Person
          </Button>
        </>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <div className="max-w-lg mx-auto py-8">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <Card className="p-6">
          {content}
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Kiosk Check-In" onBack={onBack} />
      <div className="p-4 pb-24">
        {content}
      </div>
    </div>
  );
};

// ============================================================================
// VIRTUAL VISIT PAGE
// ============================================================================

const VirtualVisitPage = ({ appointment, user, onBack, onEndVisit }) => {
  const { isDesktop } = useResponsive();
  const [isConnecting, setIsConnecting] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [visitDuration, setVisitDuration] = useState(0);

  useEffect(() => {
    // Simulate connection
    const connectTimer = setTimeout(() => setIsConnecting(false), 2000);
    return () => clearTimeout(connectTimer);
  }, []);

  useEffect(() => {
    if (!isConnecting) {
      const timer = setInterval(() => {
        setVisitDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isConnecting]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Video className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold mb-2">Connecting...</h2>
          <p className="text-gray-400">Please wait while we connect you to your provider</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Main Video (Provider) */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-16 h-16 text-white" />
            </div>
            <p className="text-white text-xl font-semibold">Dr. Michelle Chen</p>
            <p className="text-gray-400">Family Medicine</p>
          </div>
        </div>

        {/* Self Video (Small) */}
        <div className="absolute top-4 right-4 w-32 h-40 bg-gray-700 rounded-xl overflow-hidden shadow-lg">
          {isVideoOff ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <User className="w-8 h-8 text-gray-500" />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Visit Info Overlay */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
          <div className="flex items-center gap-2 text-white">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">{formatDuration(visitDuration)}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-6">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              isMuted ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            {isMuted ? <Phone className="w-6 h-6 rotate-135" /> : <Phone className="w-6 h-6" />}
          </button>
          
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              isVideoOff ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            <Video className="w-6 h-6" />
          </button>

          <button
            onClick={onEndVisit}
            className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <button className="w-14 h-14 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600 transition-colors">
            <FileText className="w-6 h-6" />
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-4">
          Tap the red button to end the visit
        </p>
      </div>
    </div>
  );
};

const PlaceholderScreen = ({ title, onBack }) => (
  <div className="min-h-screen bg-gray-50">
    <Header title={title} onBack={onBack} />
    <div className="p-6 text-center text-gray-500">
      <p>Screen content for {title}</p>
    </div>
  </div>
);

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
    appointmentNumber: null 
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
    setBookingFlow({ type, reason: null, kiosk: null, dateTime: null, getCareData: null });
    if (type === 'getCareNow') {
      setScreen('getCareReason');
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
                setScreen('waitingRoom');
              }
            }}
            onFindKiosk={() => handleNavigate('kiosks')}
            onNotifications={() => handleNavigate('notifications')}
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
            onBack={() => setScreen('dashboard')}
            onSelect={(reason) => {
              setBookingFlow(prev => ({ ...prev, getCareData: { reason } }));
              if (reason === 'sick') {
                setScreen('describeSymptoms');
              } else {
                setBookingFlow(prev => ({ 
                  ...prev, 
                  getCareData: { reason, symptoms: 'General consultation', severity: 'Mild', answers: {} } 
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
            onBack={() => setScreen('dashboard')}
            onLeaveQueue={() => setScreen('dashboard')}
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
            onBack={() => setScreen('dashboard')}
            onLeaveQueue={() => setScreen('dashboard')}
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