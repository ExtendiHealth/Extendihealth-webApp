import React, { useState, useRef } from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, Edit, Camera, Check, X,
  AlertCircle, ChevronRight, Shield, Heart, Droplet, Scale, Ruler,
  Users, FileText, Bell, Lock, CreditCard, LogOut, Save, Plus,
  AlertTriangle, CheckCircle, Clock, Building, Briefcase, Globe, Upload
} from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Button, Card } from '../ui';

// ============================================================================
// FORM COMPONENTS - Defined outside to prevent re-creation on each render
// ============================================================================

// View mode field display
const ProfileField = ({ label, value, icon: Icon, missing = false }) => (
  <div className="py-3 border-b border-gray-100 last:border-0">
    <div className="flex items-start gap-3">
      {Icon && (
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${missing ? 'bg-amber-50' : 'bg-gray-50'}`}>
          <Icon className={`w-4 h-4 ${missing ? 'text-amber-500' : 'text-gray-400'}`} />
        </div>
      )}
      <div className="flex-1">
        <p className="text-xs text-gray-500 uppercase tracking-wider">{label}</p>
        {missing ? (
          <p className="text-amber-600 font-medium flex items-center gap-1 mt-0.5">
            <Plus className="w-3 h-3" /> Add {label}
          </p>
        ) : (
          <p className="text-gray-900 font-medium mt-0.5">{value}</p>
        )}
      </div>
    </div>
  </div>
);

// Edit mode input - using standard controlled input pattern
const ProfileInput = ({ label, value, onChange, type = 'text', placeholder, required }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
    />
  </div>
);

// Edit mode select
const ProfileSelect = ({ label, value, onChange, options, required }) => (
  <div className="mb-4">
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <select
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
    >
      <option value="">Select...</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const ProfilePage = ({ user = {}, onBack, onSave, onSignOut }) => {
  const { isDesktop } = useResponsive();
  const [isEditing, setIsEditing] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const fileInputRef = useRef(null);
  
  // Calculate profile completion
  const calculateCompletion = (profile) => {
    const fields = [
      profile.firstName, profile.lastName, profile.email, profile.phone,
      profile.dateOfBirth, profile.gender, profile.address?.street,
      profile.address?.city, profile.address?.state, profile.address?.zip,
      profile.emergencyContact?.name, profile.emergencyContact?.phone,
      profile.insurance?.provider, profile.bloodType, profile.height, profile.weight
    ];
    const filled = fields.filter(f => f && f.toString().trim() !== '').length;
    return Math.round((filled / fields.length) * 100);
  };

  // Demo user data
  const [profile, setProfile] = useState({
    firstName: user.firstName || 'Jide',
    lastName: user.lastName || 'Adeyemo',
    email: user.email || 'jide.adeyemo@email.com',
    phone: user.phone || '+1 (416) 555-0123',
    dateOfBirth: user.dateOfBirth || '1985-03-15',
    gender: user.gender || 'Male',
    preferredLanguage: user.preferredLanguage || 'English',
    address: user.address || {
      street: '123 Queen Street West',
      unit: 'Suite 456',
      city: 'Toronto',
      state: 'Ontario',
      zip: 'M5H 2N2',
      country: 'Canada'
    },
    emergencyContact: user.emergencyContact || {
      name: 'Sarah Chen',
      relationship: 'Spouse',
      phone: '+1 (416) 555-0456',
      email: 'sarah.chen@email.com'
    },
    insurance: user.insurance || {
      provider: 'Blue Cross',
      memberId: 'BC-123456789',
      groupNumber: 'GRP-98765',
      planType: 'PPO'
    },
    bloodType: user.bloodType || 'O+',
    height: user.height || '5ft 10in',
    weight: user.weight || '175 lbs',
    allergies: user.allergies || ['Penicillin', 'Shellfish'],
    conditions: user.conditions || ['Hypertension'],
    primaryCareProvider: user.primaryCareProvider || 'Dr. Emily Wang',
    preferredPharmacy: user.preferredPharmacy || 'Shoppers Drug Mart - Queen St',
    avatar: user.avatar || null,
  });

  const [editForm, setEditForm] = useState({ ...profile });
  const completion = calculateCompletion(profile);
  const isIncomplete = completion < 100;

  const handleSave = () => {
    setProfile({ ...editForm });
    setIsEditing(false);
    setShowSuccessToast(true);
    setTimeout(() => setShowSuccessToast(false), 3000);
    if (onSave) onSave(editForm);
  };

  const handleCancel = () => {
    setEditForm({ ...profile });
    setIsEditing(false);
  };

  // Handle profile image upload
  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Create a FileReader to convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageData = reader.result;
      // Update local profile state
      setProfile(prev => ({ ...prev, avatar: imageData }));
      setEditForm(prev => ({ ...prev, avatar: imageData }));
      
      // Update parent user state so avatar shows across app
      if (onSave) {
        onSave({ avatar: imageData });
      }
      
      // Show success feedback
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
    };
    reader.readAsDataURL(file);
  };

  const triggerImageUpload = () => {
    fileInputRef.current?.click();
  };

  const updateField = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const updateNestedField = (parent, field, value) => {
    setEditForm(prev => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value }
    }));
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'long', day: 'numeric', year: 'numeric' 
    });
  };

  const getAge = (dateStr) => {
    if (!dateStr) return '';
    const today = new Date();
    const birth = new Date(dateStr);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
    return age;
  };

  // Profile completion banner
  const CompletionBanner = () => {
    if (completion >= 100) return null;
    
    return (
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <AlertCircle className="w-5 h-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-amber-900">Complete Your Profile</h3>
            <p className="text-sm text-amber-700 mt-1">
              Your profile is {completion}% complete. Add missing information to help us serve you better.
            </p>
            <div className="mt-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-amber-700 font-medium">{completion}% Complete</span>
                <span className="text-amber-600">{100 - completion}% remaining</span>
              </div>
              <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all duration-500"
                  style={{ width: `${completion}%` }}
                />
              </div>
            </div>
            <button 
              onClick={() => setIsEditing(true)}
              className="mt-3 text-sm font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1"
            >
              Complete Now <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Section tabs
  const sections = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'contact', label: 'Contact', icon: Phone },
    { id: 'emergency', label: 'Emergency', icon: AlertTriangle },
    { id: 'medical', label: 'Medical', icon: Heart },
    { id: 'insurance', label: 'Insurance', icon: Shield },
  ];

  // Personal Info Section
  const PersonalSection = () => (
    <Card className="p-5">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <User className="w-5 h-5 text-teal-500" />
        Personal Information
      </h3>
      
      {isEditing ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <ProfileInput 
              label="First Name" 
              value={editForm.firstName} 
              onChange={(v) => updateField('firstName', v)}
              required
            />
            <ProfileInput 
              label="Last Name" 
              value={editForm.lastName} 
              onChange={(v) => updateField('lastName', v)}
              required
            />
          </div>
          <ProfileInput 
            label="Date of Birth" 
            value={editForm.dateOfBirth} 
            onChange={(v) => updateField('dateOfBirth', v)}
            type="date"
            required
          />
          <ProfileSelect 
            label="Gender" 
            value={editForm.gender} 
            onChange={(v) => updateField('gender', v)}
            options={[
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
              { value: 'Non-binary', label: 'Non-binary' },
              { value: 'Prefer not to say', label: 'Prefer not to say' },
            ]}
          />
          <ProfileSelect 
            label="Preferred Language" 
            value={editForm.preferredLanguage} 
            onChange={(v) => updateField('preferredLanguage', v)}
            options={[
              { value: 'English', label: 'English' },
              { value: 'French', label: 'French' },
              { value: 'Spanish', label: 'Spanish' },
              { value: 'Mandarin', label: 'Mandarin' },
              { value: 'Cantonese', label: 'Cantonese' },
              { value: 'Punjabi', label: 'Punjabi' },
              { value: 'Other', label: 'Other' },
            ]}
          />
        </div>
      ) : (
        <div>
          <ProfileField label="Full Name" value={`${profile.firstName} ${profile.lastName}`} icon={User} />
          <ProfileField label="Date of Birth" value={`${formatDate(profile.dateOfBirth)} (${getAge(profile.dateOfBirth)} years old)`} icon={Calendar} />
          <ProfileField label="Gender" value={profile.gender} icon={User} missing={!profile.gender} />
          <ProfileField label="Preferred Language" value={profile.preferredLanguage} icon={Globe} />
        </div>
      )}
    </Card>
  );

  // Contact Info Section
  const ContactSection = () => (
    <Card className="p-5">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Phone className="w-5 h-5 text-teal-500" />
        Contact Information
      </h3>
      
      {isEditing ? (
        <div className="space-y-4">
          <ProfileInput 
            label="Email" 
            value={editForm.email} 
            onChange={(v) => updateField('email', v)}
            type="email"
            required
          />
          <ProfileInput 
            label="Phone" 
            value={editForm.phone} 
            onChange={(v) => updateField('phone', v)}
            type="tel"
            required
          />
          <div className="border-t pt-4 mt-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Address</p>
            <ProfileInput 
              label="Street Address" 
              value={editForm.address?.street} 
              onChange={(v) => updateNestedField('address', 'street', v)}
            />
            <ProfileInput 
              label="Unit/Apt (Optional)" 
              value={editForm.address?.unit} 
              onChange={(v) => updateNestedField('address', 'unit', v)}
            />
            <div className="grid grid-cols-2 gap-4">
              <ProfileInput 
                label="City" 
                value={editForm.address?.city} 
                onChange={(v) => updateNestedField('address', 'city', v)}
              />
              <ProfileInput 
                label="Province/State" 
                value={editForm.address?.state} 
                onChange={(v) => updateNestedField('address', 'state', v)}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <ProfileInput 
                label="Postal Code" 
                value={editForm.address?.zip} 
                onChange={(v) => updateNestedField('address', 'zip', v)}
              />
              <ProfileInput 
                label="Country" 
                value={editForm.address?.country} 
                onChange={(v) => updateNestedField('address', 'country', v)}
              />
            </div>
          </div>
        </div>
      ) : (
        <div>
          <ProfileField label="Email" value={profile.email} icon={Mail} />
          <ProfileField label="Phone" value={profile.phone} icon={Phone} />
          <ProfileField 
            label="Address" 
            value={profile.address?.street ? 
              `${profile.address.street}${profile.address.unit ? `, ${profile.address.unit}` : ''}, ${profile.address.city}, ${profile.address.state} ${profile.address.zip}` 
              : null
            } 
            icon={MapPin}
            missing={!profile.address?.street}
          />
        </div>
      )}
    </Card>
  );

  // Emergency Contact Section
  const EmergencySection = () => (
    <Card className="p-5">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        Emergency Contact
      </h3>
      
      {isEditing ? (
        <div className="space-y-4">
          <ProfileInput 
            label="Contact Name" 
            value={editForm.emergencyContact?.name} 
            onChange={(v) => updateNestedField('emergencyContact', 'name', v)}
            required
          />
          <ProfileSelect 
            label="Relationship" 
            value={editForm.emergencyContact?.relationship} 
            onChange={(v) => updateNestedField('emergencyContact', 'relationship', v)}
            options={[
              { value: 'Spouse', label: 'Spouse' },
              { value: 'Parent', label: 'Parent' },
              { value: 'Child', label: 'Child' },
              { value: 'Sibling', label: 'Sibling' },
              { value: 'Friend', label: 'Friend' },
              { value: 'Other', label: 'Other' },
            ]}
          />
          <ProfileInput 
            label="Phone" 
            value={editForm.emergencyContact?.phone} 
            onChange={(v) => updateNestedField('emergencyContact', 'phone', v)}
            type="tel"
            required
          />
          <ProfileInput 
            label="Email (Optional)" 
            value={editForm.emergencyContact?.email} 
            onChange={(v) => updateNestedField('emergencyContact', 'email', v)}
            type="email"
          />
        </div>
      ) : (
        <div>
          {profile.emergencyContact?.name ? (
            <>
              <ProfileField label="Name" value={profile.emergencyContact.name} icon={User} />
              <ProfileField label="Relationship" value={profile.emergencyContact.relationship} icon={Users} />
              <ProfileField label="Phone" value={profile.emergencyContact.phone} icon={Phone} />
              <ProfileField label="Email" value={profile.emergencyContact.email} icon={Mail} />
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-red-400" />
              </div>
              <p className="text-gray-600 mb-3">No emergency contact added</p>
              <Button variant="secondary" onClick={() => setIsEditing(true)}>
                <Plus className="w-4 h-4" /> Add Contact
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );

  // Medical Info Section
  const MedicalSection = () => (
    <Card className="p-5">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Heart className="w-5 h-5 text-red-500" />
        Medical Information
      </h3>
      
      {isEditing ? (
        <div className="space-y-4">
          <ProfileSelect 
            label="Blood Type" 
            value={editForm.bloodType} 
            onChange={(v) => updateField('bloodType', v)}
            options={[
              { value: 'A+', label: 'A+' },
              { value: 'A-', label: 'A-' },
              { value: 'B+', label: 'B+' },
              { value: 'B-', label: 'B-' },
              { value: 'AB+', label: 'AB+' },
              { value: 'AB-', label: 'AB-' },
              { value: 'O+', label: 'O+' },
              { value: 'O-', label: 'O-' },
              { value: 'Unknown', label: 'Unknown' },
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <ProfileInput 
              label="Height" 
              value={editForm.height} 
              onChange={(v) => updateField('height', v)}
              placeholder="e.g., 5ft 10in"
            />
            <ProfileInput 
              label="Weight" 
              value={editForm.weight} 
              onChange={(v) => updateField('weight', v)}
              placeholder="e.g., 175 lbs"
            />
          </div>
          <ProfileInput 
            label="Primary Care Provider" 
            value={editForm.primaryCareProvider} 
            onChange={(v) => updateField('primaryCareProvider', v)}
          />
          <ProfileInput 
            label="Preferred Pharmacy" 
            value={editForm.preferredPharmacy} 
            onChange={(v) => updateField('preferredPharmacy', v)}
          />
        </div>
      ) : (
        <div>
          <ProfileField label="Blood Type" value={profile.bloodType} icon={Droplet} missing={!profile.bloodType} />
          <ProfileField label="Height" value={profile.height} icon={Ruler} missing={!profile.height} />
          <ProfileField label="Weight" value={profile.weight} icon={Scale} missing={!profile.weight} />
          <ProfileField label="Primary Care Provider" value={profile.primaryCareProvider} icon={User} missing={!profile.primaryCareProvider} />
          <ProfileField label="Preferred Pharmacy" value={profile.preferredPharmacy} icon={Building} missing={!profile.preferredPharmacy} />
          
          {/* Allergies */}
          <div className="py-3 border-b border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Known Allergies</p>
            {profile.allergies && profile.allergies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.allergies.map((allergy, i) => (
                  <span key={i} className="px-3 py-1 bg-red-50 text-red-700 rounded-full text-sm font-medium">
                    {allergy}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No known allergies</p>
            )}
          </div>
          
          {/* Conditions */}
          <div className="py-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Active Conditions</p>
            {profile.conditions && profile.conditions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.conditions.map((condition, i) => (
                  <span key={i} className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm font-medium">
                    {condition}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No active conditions</p>
            )}
          </div>
        </div>
      )}
    </Card>
  );

  // Insurance Section
  const InsuranceSection = () => (
    <Card className="p-5">
      <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-blue-500" />
        Insurance Information
      </h3>
      
      {isEditing ? (
        <div className="space-y-4">
          <ProfileInput 
            label="Insurance Provider" 
            value={editForm.insurance?.provider} 
            onChange={(v) => updateNestedField('insurance', 'provider', v)}
          />
          <ProfileInput 
            label="Member ID" 
            value={editForm.insurance?.memberId} 
            onChange={(v) => updateNestedField('insurance', 'memberId', v)}
          />
          <ProfileInput 
            label="Group Number" 
            value={editForm.insurance?.groupNumber} 
            onChange={(v) => updateNestedField('insurance', 'groupNumber', v)}
          />
          <ProfileSelect 
            label="Plan Type" 
            value={editForm.insurance?.planType} 
            onChange={(v) => updateNestedField('insurance', 'planType', v)}
            options={[
              { value: 'HMO', label: 'HMO' },
              { value: 'PPO', label: 'PPO' },
              { value: 'EPO', label: 'EPO' },
              { value: 'POS', label: 'POS' },
              { value: 'HDHP', label: 'HDHP' },
              { value: 'Other', label: 'Other' },
            ]}
          />
        </div>
      ) : (
        <div>
          {profile.insurance?.provider ? (
            <>
              <ProfileField label="Provider" value={profile.insurance.provider} icon={Shield} />
              <ProfileField label="Member ID" value={profile.insurance.memberId} icon={CreditCard} />
              <ProfileField label="Group Number" value={profile.insurance.groupNumber} icon={Users} />
              <ProfileField label="Plan Type" value={profile.insurance.planType} icon={FileText} />
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-blue-400" />
              </div>
              <p className="text-gray-600 mb-3">No insurance information added</p>
              <Button variant="secondary" onClick={() => setIsEditing(true)}>
                <Plus className="w-4 h-4" /> Add Insurance
              </Button>
            </div>
          )}
        </div>
      )}
    </Card>
  );

  // Render section based on active tab
  const renderSection = () => {
    switch (activeSection) {
      case 'personal': return PersonalSection();
      case 'contact': return ContactSection();
      case 'emergency': return EmergencySection();
      case 'medical': return MedicalSection();
      case 'insurance': return InsuranceSection();
      default: return PersonalSection();
    }
  };

  const content = (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar with Upload */}
          <div className="relative">
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <div className="w-20 h-20 bg-gradient-to-br from-teal-400 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.firstName} className="w-20 h-20 rounded-2xl object-cover" />
              ) : (
                <span className="text-3xl font-bold text-white">
                  {profile.firstName?.[0]}{profile.lastName?.[0]}
                </span>
              )}
            </div>
            <button 
              onClick={triggerImageUpload}
              className="absolute -bottom-1 -right-1 w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
              title="Upload profile photo"
            >
              <Camera className="w-4 h-4 text-gray-600" />
            </button>
          </div>
          
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{profile.firstName} {profile.lastName}</h1>
            <p className="text-gray-500">{profile.email}</p>
            <div className="flex items-center gap-2 mt-1">
              {completion >= 100 ? (
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <CheckCircle className="w-3 h-3" /> Profile Complete
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                  <Clock className="w-3 h-3" /> {completion}% Complete
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Edit Button */}
        {!isEditing ? (
          <Button variant="secondary" onClick={() => setIsEditing(true)}>
            <Edit className="w-4 h-4" />
            Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleCancel}>
              <X className="w-4 h-4" />
              Cancel
            </Button>
            <Button onClick={handleSave}>
              <Save className="w-4 h-4" />
              Save
            </Button>
          </div>
        )}
      </div>

      {/* Completion Banner */}
      {!isEditing && <CompletionBanner />}

      {/* Section Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0">
        {sections.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveSection(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-colors ${
              activeSection === id 
                ? 'bg-teal-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Section Content */}
      {renderSection()}

      {/* Quick Actions (View Mode Only) */}
      {!isEditing && (
        <Card className="p-5">
          <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { icon: Lock, label: 'Change Password', action: () => {} },
              { icon: Bell, label: 'Notification Preferences', action: () => {} },
              { icon: Shield, label: 'Privacy Settings', action: () => {} },
              { icon: FileText, label: 'Download My Data', action: () => {} },
            ].map(({ icon: Icon, label, action }) => (
              <button
                key={label}
                onClick={action}
                className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 text-gray-400" />
                  <span className="font-medium text-gray-700">{label}</span>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </button>
            ))}
          </div>
          
          {/* Sign Out */}
          <button
            onClick={onSignOut}
            className="w-full flex items-center justify-center gap-2 p-3 mt-4 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </Card>
      )}

      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-5 h-5" />
          Profile saved successfully!
        </div>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-6">
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="My Profile" onBack={onBack} />
      <div className="p-4 pb-24">
        {content}
      </div>
    </div>
  );
};

export default ProfilePage;
