import React, { useState, useMemo } from 'react';
import { 
  Search, MapPin, Clock, Phone, Mail, Star, ChevronRight, ChevronDown,
  Filter, X, Check, User, Globe, Heart, Calendar, Building, 
  Stethoscope, CheckCircle, ArrowRight, AlertCircle, Loader,
  Navigation, ExternalLink, MessageSquare, Users, Baby, UserPlus,
  Accessibility, Car, Train, Video, Languages, Award
} from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Card, Badge, Button } from '../ui';
import { FAMILY_DOCTORS, DOCTOR_FILTER_OPTIONS } from '../../data/familyDoctors';

/**
 * FindFamilyDoctorPage
 * 
 * Allows patients to:
 * 1. Search for family doctors accepting new patients
 * 2. Filter by location, language, specialty interests
 * 3. View doctor profiles
 * 4. Request to join a doctor's practice
 */

const FindFamilyDoctorPage = ({ 
  user,
  onBack, 
  onNavigate,
  userLocation 
}) => {
  const { isDesktop } = useResponsive();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestStep, setRequestStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestComplete, setRequestComplete] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    acceptingPatients: true,
    maxDistance: 25,
    languages: [],
    gender: 'any',
    virtualCare: false,
    acceptingChildren: false,
    acceptingSeniors: false,
  });

  // Filter doctors based on search and filters
  const filteredDoctors = useMemo(() => {
    return FAMILY_DOCTORS.filter(doctor => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          doctor.name.toLowerCase().includes(query) ||
          doctor.clinic.toLowerCase().includes(query) ||
          doctor.address.toLowerCase().includes(query) ||
          doctor.specialInterests.some(s => s.toLowerCase().includes(query)) ||
          doctor.languages.some(l => l.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Accepting patients
      if (filters.acceptingPatients && !doctor.acceptingPatients) return false;

      // Distance
      if (doctor.distance > filters.maxDistance) return false;

      // Languages
      if (filters.languages.length > 0) {
        const hasLanguage = filters.languages.some(l => doctor.languages.includes(l));
        if (!hasLanguage) return false;
      }

      // Gender
      if (filters.gender !== 'any' && doctor.gender !== filters.gender) return false;

      // Virtual care
      if (filters.virtualCare && !doctor.virtualCareAvailable) return false;

      // Accepting children
      if (filters.acceptingChildren && !doctor.acceptingChildren) return false;

      // Accepting seniors
      if (filters.acceptingSeniors && !doctor.acceptingSeniors) return false;

      return true;
    }).sort((a, b) => a.distance - b.distance);
  }, [searchQuery, filters]);

  const toggleLanguage = (lang) => {
    setFilters(prev => ({
      ...prev,
      languages: prev.languages.includes(lang)
        ? prev.languages.filter(l => l !== lang)
        : [...prev.languages, lang]
    }));
  };

  const clearFilters = () => {
    setFilters({
      acceptingPatients: true,
      maxDistance: 25,
      languages: [],
      gender: 'any',
      virtualCare: false,
      acceptingChildren: false,
      acceptingSeniors: false,
    });
  };

  const handleRequestToJoin = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    setRequestComplete(true);
  };

  // Waitlist badge color
  const getWaitlistColor = (waitlist) => {
    if (waitlist.includes('Short')) return 'green';
    if (waitlist.includes('Medium')) return 'yellow';
    if (waitlist.includes('Long')) return 'orange';
    return 'gray';
  };

  // Doctor Card Component
  const DoctorCard = ({ doctor }) => (
    <Card 
      className="p-4 cursor-pointer hover:shadow-md transition-all border border-gray-100 hover:border-cyan-200"
      onClick={() => setSelectedDoctor(doctor)}
    >
      <div className="flex items-start gap-3">
        {/* Avatar */}
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
          {doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="font-bold text-gray-900 truncate">{doctor.name}</h3>
              <p className="text-xs text-gray-500">{doctor.credentials}</p>
            </div>
            {doctor.acceptingPatients ? (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 whitespace-nowrap">
                Accepting
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-500 whitespace-nowrap">
                Not Accepting
              </span>
            )}
          </div>
          
          <p className="text-sm text-gray-600 mt-0.5 truncate">{doctor.clinic}</p>
          
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-cyan-500" />
              <span className="font-medium text-gray-700">{doctor.distance} km</span>
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-current" />
              <span className="font-medium text-gray-700">{doctor.rating}</span>
              <span className="text-gray-400">({doctor.reviewCount})</span>
            </span>
            <span className="flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-blue-500" />
              {doctor.languages.slice(0, 2).join(', ')}
              {doctor.languages.length > 2 && <span className="text-gray-400">+{doctor.languages.length - 2}</span>}
            </span>
          </div>

          {doctor.acceptingPatients && (
            <div className="mt-2 flex items-center gap-2">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${
                doctor.waitlistLength.includes('Short') 
                  ? 'bg-emerald-50 text-emerald-700' 
                  : doctor.waitlistLength.includes('Medium')
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-orange-50 text-orange-700'
              }`}>
                <Clock className="w-3 h-3" />
                {doctor.waitlistLength}
              </span>
              {doctor.virtualCareAvailable && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                  <Video className="w-3 h-3" />
                  Virtual
                </span>
              )}
            </div>
          )}
        </div>
        
        <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0 mt-1" />
      </div>
    </Card>
  );

  // Filter Panel
  const FilterPanel = () => (
    <div className={`${isDesktop ? 'bg-white rounded-xl border border-gray-200 p-4 shadow-sm sticky top-4' : 'p-4'}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900">Filters</h3>
        <button onClick={clearFilters} className="text-xs text-cyan-600 font-medium hover:text-cyan-700">
          Clear all
        </button>
      </div>

      {/* Accepting Patients Toggle */}
      <div className="mb-4 pb-4 border-b border-gray-100">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm text-gray-700">Only accepting patients</span>
          <button
            onClick={() => setFilters(prev => ({ ...prev, acceptingPatients: !prev.acceptingPatients }))}
            className={`w-10 h-6 rounded-full transition-colors relative ${filters.acceptingPatients ? 'bg-cyan-500' : 'bg-gray-300'}`}
          >
            <div 
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${filters.acceptingPatients ? 'left-5' : 'left-1'}`} 
            />
          </button>
        </label>
      </div>

      {/* Distance */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Maximum Distance</label>
        <select
          value={filters.maxDistance}
          onChange={(e) => setFilters(prev => ({ ...prev, maxDistance: parseInt(e.target.value) }))}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
        >
          {DOCTOR_FILTER_OPTIONS.distanceOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>

      {/* Gender Preference */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Doctor Gender</label>
        <div className="flex gap-1">
          {['any', 'Female', 'Male'].map(gender => (
            <button
              key={gender}
              onClick={() => setFilters(prev => ({ ...prev, gender }))}
              className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium transition-all ${
                filters.gender === gender
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {gender === 'any' ? 'Any' : gender}
            </button>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Languages</label>
        <div className="flex flex-wrap gap-1.5">
          {DOCTOR_FILTER_OPTIONS.languages.slice(0, 8).map(lang => (
            <button
              key={lang}
              onClick={() => toggleLanguage(lang)}
              className={`px-2 py-1 rounded text-xs font-medium transition-all ${
                filters.languages.includes(lang)
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>
      </div>

      {/* Additional Options */}
      <div className="space-y-2 pt-3 border-t border-gray-100">
        <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-gray-50 transition-colors">
          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
            filters.virtualCare ? 'bg-cyan-500 border-cyan-500' : 'border-gray-300'
          }`}>
            {filters.virtualCare && <Check className="w-3 h-3 text-white" />}
          </div>
          <input
            type="checkbox"
            checked={filters.virtualCare}
            onChange={(e) => setFilters(prev => ({ ...prev, virtualCare: e.target.checked }))}
            className="hidden"
          />
          <span className="text-xs text-gray-700">Virtual care</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-gray-50 transition-colors">
          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
            filters.acceptingChildren ? 'bg-cyan-500 border-cyan-500' : 'border-gray-300'
          }`}>
            {filters.acceptingChildren && <Check className="w-3 h-3 text-white" />}
          </div>
          <input
            type="checkbox"
            checked={filters.acceptingChildren}
            onChange={(e) => setFilters(prev => ({ ...prev, acceptingChildren: e.target.checked }))}
            className="hidden"
          />
          <span className="text-xs text-gray-700">Accepts children</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer p-1.5 rounded hover:bg-gray-50 transition-colors">
          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
            filters.acceptingSeniors ? 'bg-cyan-500 border-cyan-500' : 'border-gray-300'
          }`}>
            {filters.acceptingSeniors && <Check className="w-3 h-3 text-white" />}
          </div>
          <input
            type="checkbox"
            checked={filters.acceptingSeniors}
            onChange={(e) => setFilters(prev => ({ ...prev, acceptingSeniors: e.target.checked }))}
            className="hidden"
          />
          <span className="text-xs text-gray-700">Accepts seniors (65+)</span>
        </label>
      </div>

      {!isDesktop && (
        <Button className="w-full mt-4" onClick={() => setShowFilters(false)}>
          Show {filteredDoctors.length} Results
        </Button>
      )}
    </div>
  );

  // Doctor Profile View
  const DoctorProfile = ({ doctor }) => (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-r from-cyan-500 to-teal-500 p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
              {doctor.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 text-white">
              <h2 className="text-xl font-bold">{doctor.name}</h2>
              <p className="text-cyan-100 text-sm">{doctor.credentials}</p>
              <div className="flex items-center gap-2 mt-1">
                <Star className="w-4 h-4 text-amber-300 fill-current" />
                <span className="font-semibold text-sm">{doctor.rating}</span>
                <span className="text-cyan-200 text-sm">• {doctor.reviewCount} reviews</span>
              </div>
            </div>
          </div>
        </div>
        <div className="p-3 bg-white">
          {doctor.acceptingPatients ? (
            <div className="flex items-center justify-between text-green-700 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                <span className="font-medium text-sm">Accepting New Patients</span>
              </div>
              <span className="text-green-600 text-sm">{doctor.waitlistLength}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
              <X className="w-4 h-4" />
              <span className="font-medium text-sm">Not Accepting New Patients</span>
            </div>
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      {doctor.acceptingPatients && (
        <Button className="w-full" onClick={() => setShowRequestModal(true)}>
          <UserPlus className="w-4 h-4" />
          Request to Join Practice
        </Button>
      )}

      {/* About */}
      <Card className="p-4">
        <h3 className="font-bold text-gray-900 mb-2">About</h3>
        <p className="text-gray-600 text-sm leading-relaxed">{doctor.bio}</p>
        
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-100">
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Experience</p>
            <p className="text-lg font-bold text-gray-900">{doctor.yearsExperience} years</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider">Medical School</p>
            <p className="text-sm font-semibold text-gray-900">{doctor.medicalSchool}</p>
          </div>
        </div>
      </Card>

      {/* Clinic Info */}
      <Card className="p-4">
        <h3 className="font-bold text-gray-900 mb-3">Clinic Information</h3>
        
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            <Building className="w-5 h-5 text-cyan-500 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">{doctor.clinic}</p>
              <p className="text-sm text-gray-500">{doctor.address}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <a href={`tel:${doctor.phone}`} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-cyan-50 transition-colors">
              <Phone className="w-4 h-4 text-gray-400" />
              <span className="text-cyan-600 font-medium text-sm">{doctor.phone}</span>
            </a>
            <a href={`mailto:${doctor.email}`} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-cyan-50 transition-colors">
              <Mail className="w-4 h-4 text-gray-400" />
              <span className="text-cyan-600 font-medium text-sm truncate">{doctor.email.split('@')[0]}@...</span>
            </a>
          </div>

          <div className="flex items-center gap-2 p-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400" />
            {doctor.distance} km from your location
          </div>
        </div>

        <div className="flex gap-2 mt-3">
          <Button variant="secondary" size="sm" className="flex-1">
            <Navigation className="w-4 h-4" />
            Directions
          </Button>
          <Button variant="secondary" size="sm" className="flex-1">
            <Phone className="w-4 h-4" />
            Call
          </Button>
        </div>
      </Card>

      {/* Languages & Interests in 2 columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Languages */}
        <Card className="p-4">
          <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-sm">
            <Languages className="w-4 h-4 text-cyan-500" />
            Languages
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {doctor.languages.map(lang => (
              <span key={lang} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                {lang}
              </span>
            ))}
          </div>
        </Card>

        {/* Virtual & Accessibility */}
        <Card className="p-4">
          <h3 className="font-bold text-gray-900 mb-2 text-sm">Access</h3>
          <div className="space-y-1.5">
            {doctor.virtualCareAvailable && (
              <div className="flex items-center gap-2 text-blue-700 text-sm">
                <Video className="w-4 h-4" />
                <span>Virtual care available</span>
              </div>
            )}
            <div className={`flex items-center gap-2 text-sm ${doctor.wheelchairAccessible ? 'text-green-700' : 'text-gray-500'}`}>
              <Accessibility className="w-4 h-4" />
              <span>{doctor.wheelchairAccessible ? 'Wheelchair accessible' : 'Limited access'}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Special Interests */}
      <Card className="p-4">
        <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2 text-sm">
          <Heart className="w-4 h-4 text-rose-500" />
          Special Interests
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {doctor.specialInterests.map(interest => (
            <span key={interest} className="px-2 py-1 bg-cyan-50 text-cyan-700 rounded text-xs font-medium border border-cyan-100">
              {interest}
            </span>
          ))}
        </div>
      </Card>

      {/* Office Hours */}
      <Card className="p-4">
        <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2 text-sm">
          <Calendar className="w-4 h-4 text-teal-500" />
          Office Hours
        </h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
          {Object.entries(doctor.officeHours).map(([day, hours]) => (
            <div key={day} className="flex justify-between py-1">
              <span className="text-gray-500 capitalize">{day.slice(0, 3)}</span>
              <span className={hours === 'Closed' ? 'text-gray-400' : 'text-gray-900 font-medium'}>{hours}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Transit & Parking */}
      <Card className="p-4">
        <h3 className="font-bold text-gray-900 mb-2 text-sm">Getting There</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <Train className="w-4 h-4 text-gray-400" />
            {doctor.publicTransit}
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Car className="w-4 h-4 text-gray-400" />
            {doctor.parking}
          </div>
        </div>
      </Card>
    </div>
  );

  // Request to Join Modal
  const RequestModal = () => (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {requestComplete ? (
          // Success State
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Request Submitted!</h2>
            <p className="text-gray-500 mb-4">
              Your request to join {selectedDoctor?.name}'s practice has been submitted.
            </p>
            <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mb-4 text-left">
              <h4 className="font-semibold text-cyan-900 mb-2">What happens next?</h4>
              <ul className="space-y-2 text-sm text-cyan-800">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  The clinic will review your request
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  You'll receive a confirmation within 1-2 weeks
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  Once accepted, you can book appointments
                </li>
              </ul>
            </div>
            <Button className="w-full" onClick={() => {
              setShowRequestModal(false);
              setRequestComplete(false);
              setRequestStep(1);
              setSelectedDoctor(null);
            }}>
              Done
            </Button>
          </div>
        ) : (
          // Request Form
          <>
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Request to Join Practice</h2>
              <button onClick={() => setShowRequestModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="p-4">
              {/* Doctor Info */}
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center text-white font-bold">
                  {selectedDoctor?.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{selectedDoctor?.name}</p>
                  <p className="text-sm text-gray-500">{selectedDoctor?.clinic}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Why are you looking for a family doctor?</label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg">
                    <option>I don't have a family doctor</option>
                    <option>My doctor retired</option>
                    <option>I moved to a new area</option>
                    <option>I want to switch doctors</option>
                    <option>Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Do you have any chronic conditions?</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none"
                    rows={2}
                    placeholder="E.g., diabetes, hypertension, asthma..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Additional notes (optional)</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg resize-none"
                    rows={2}
                    placeholder="Any other information you'd like to share..."
                  />
                </div>

                {/* Consent */}
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-cyan-500" />
                    <span className="text-sm text-amber-800">
                      I consent to sharing my health information with this clinic for the purpose of patient enrollment.
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100">
              <Button 
                className="w-full" 
                onClick={handleRequestToJoin}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    Submit Request
                  </>
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  // Main content based on state
  const renderContent = () => {
    // Doctor profile view
    if (selectedDoctor) {
      return (
        <div className="space-y-4">
          <button 
            onClick={() => setSelectedDoctor(null)}
            className="flex items-center gap-2 text-cyan-600 font-medium"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            Back to results
          </button>
          <DoctorProfile doctor={selectedDoctor} />
        </div>
      );
    }

    // Filter view (mobile)
    if (showFilters && !isDesktop) {
      return <FilterPanel />;
    }

    // Main search results
    return (
      <div className={isDesktop ? 'flex gap-6' : ''}>
        {/* Filters (Desktop) */}
        {isDesktop && (
          <div className="w-64 flex-shrink-0">
            <FilterPanel />
          </div>
        )}

        {/* Results */}
        <div className="flex-1 min-w-0 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, location, or specialty..."
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent bg-white shadow-sm text-gray-900 placeholder:text-gray-400"
            />
          </div>

          {/* Mobile Filter Button */}
          {!isDesktop && (
            <Button variant="secondary" className="w-full" onClick={() => setShowFilters(true)}>
              <Filter className="w-4 h-4" />
              Filters
              {(filters.languages.length > 0 || filters.gender !== 'any' || filters.virtualCare) && (
                <span className="ml-2 px-2 py-0.5 bg-cyan-500 text-white text-xs rounded-full">Active</span>
              )}
            </Button>
          )}

          {/* Results Count */}
          <div className="flex items-center justify-between py-1">
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">{filteredDoctors.length}</span> doctor{filteredDoctors.length !== 1 ? 's' : ''} found
            </p>
            {filters.acceptingPatients && (
              <span className="text-xs font-medium text-green-700 bg-green-50 px-2 py-1 rounded-full">
                Accepting patients only
              </span>
            )}
          </div>

          {/* Doctor List */}
          {filteredDoctors.length > 0 ? (
            <div className="space-y-3">
              {filteredDoctors.map(doctor => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">No doctors found</h3>
              <p className="text-gray-500 text-sm mb-4">
                Try adjusting your filters or search query
              </p>
              <Button variant="secondary" size="sm" onClick={clearFilters}>
                Clear All Filters
              </Button>
            </Card>
          )}
        </div>
      </div>
    );
  };

  if (isDesktop) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Find a Family Doctor</h1>
          <p className="text-gray-500 mt-1">Search for family doctors accepting new patients in your area</p>
        </div>
        
        {renderContent()}
        
        {showRequestModal && RequestModal()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title={selectedDoctor ? selectedDoctor.name : showFilters ? 'Filters' : 'Find a Family Doctor'}
        onBack={selectedDoctor ? () => setSelectedDoctor(null) : showFilters ? () => setShowFilters(false) : onBack}
      />
      <div className="p-4 pb-24">
        {renderContent()}
      </div>
      {showRequestModal && RequestModal()}
    </div>
  );
};

export default FindFamilyDoctorPage;
