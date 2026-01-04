import React, { useState } from 'react';
import { Check, AlertCircle, Eye, EyeOff, Shield, ChevronLeft, ChevronRight, Mail, Phone, User, MapPin, Heart, Calendar, AlertTriangle, CheckCircle, FileText } from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Button, Card, AnimatedPulseIcon } from '../ui';
import { Header } from '../layout';

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
            <AnimatedPulseIcon size={40} color="white" />
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


export default CreateAccountPage;
