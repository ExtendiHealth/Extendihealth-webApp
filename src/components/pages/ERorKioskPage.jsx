import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, CheckCircle, Clock, MapPin, Phone,
  ChevronRight, ChevronLeft, AlertOctagon, Stethoscope, Activity,
  Thermometer, Heart, Brain, Wind, Eye, Ear, Bone, Baby,
  Pill, Shield, Navigation, ArrowRight, RefreshCw, Info,
  XCircle, Zap, Building, Timer, TrendingDown, Sparkles,
  CircleDot, HelpCircle, AlertCircle, Siren, LogIn, UserPlus
} from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Button, Card } from '../ui';

const ERorKioskPage = ({ onBack, onNavigate, userLocation, user, onSignIn, onCreateAccount }) => {
  const { isDesktop } = useResponsive();
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  
  const [formData, setFormData] = useState({
    mainConcern: '',
    selectedSymptoms: [],
    duration: '',
    severity: 5,
    redFlags: [],
    age: 'adult', // adult, child, senior
    forWhom: 'self', // self, someone
  });

  // Emergency red flags that indicate ER/911
  const emergencyRedFlags = [
    { id: 'chest_pain', label: 'Chest pain or pressure', icon: Heart, critical: true },
    { id: 'breathing', label: 'Severe difficulty breathing', icon: Wind, critical: true },
    { id: 'stroke', label: 'Signs of stroke (face drooping, arm weakness, speech difficulty)', icon: Brain, critical: true },
    { id: 'unconscious', label: 'Loss of consciousness or confusion', icon: Brain, critical: true },
    { id: 'severe_bleeding', label: 'Severe or uncontrollable bleeding', icon: Activity, critical: true },
    { id: 'allergic', label: 'Severe allergic reaction (swelling, can\'t breathe)', icon: AlertOctagon, critical: true },
    { id: 'head_injury', label: 'Serious head injury', icon: Brain, critical: true },
    { id: 'seizure', label: 'Seizure', icon: Zap, critical: true },
    { id: 'poisoning', label: 'Poisoning or overdose', icon: Pill, critical: true },
    { id: 'suicidal', label: 'Thoughts of self-harm', icon: Heart, critical: true },
  ];

  // Common symptoms suitable for kiosk
  const commonSymptoms = [
    { id: 'cold_flu', label: 'Cold or flu symptoms', icon: Thermometer },
    { id: 'headache', label: 'Headache', icon: Brain },
    { id: 'fever', label: 'Fever (mild to moderate)', icon: Thermometer },
    { id: 'sore_throat', label: 'Sore throat', icon: Stethoscope },
    { id: 'cough', label: 'Cough', icon: Wind },
    { id: 'ear_pain', label: 'Ear pain', icon: Ear },
    { id: 'eye_issue', label: 'Eye irritation or redness', icon: Eye },
    { id: 'skin_rash', label: 'Skin rash or irritation', icon: Activity },
    { id: 'minor_injury', label: 'Minor cuts, sprains, or bruises', icon: Bone },
    { id: 'stomach', label: 'Stomach pain or nausea', icon: Activity },
    { id: 'uti', label: 'Urinary symptoms', icon: Activity },
    { id: 'back_pain', label: 'Back or muscle pain', icon: Bone },
    { id: 'allergies', label: 'Mild allergies', icon: Wind },
    { id: 'prescription', label: 'Prescription refill needed', icon: Pill },
    { id: 'other', label: 'Other concern', icon: HelpCircle },
  ];

  const durationOptions = [
    { value: 'just_now', label: 'Just started', hours: 1 },
    { value: 'few_hours', label: 'Few hours', hours: 6 },
    { value: 'today', label: 'Since today', hours: 12 },
    { value: '1_2_days', label: '1-2 days', hours: 48 },
    { value: 'several_days', label: 'Several days', hours: 96 },
    { value: 'week_plus', label: 'A week or more', hours: 168 },
  ];

  // Nearby ER data (demo)
  const nearbyERs = [
    { name: 'Toronto General Hospital', distance: '4.2 km', waitTime: '4.5 hours' },
    { name: 'St. Michael\'s Hospital', distance: '3.8 km', waitTime: '5.2 hours' },
    { name: 'Mount Sinai Hospital', distance: '5.1 km', waitTime: '3.8 hours' },
  ];

  // Nearby Kiosks (demo)
  const nearbyKiosks = [
    { name: 'ExtendiHealth - Queen St', distance: '1.2 km', waitTime: '8 min', queueLength: 2 },
    { name: 'ExtendiHealth - Eaton Centre', distance: '1.8 km', waitTime: '15 min', queueLength: 4 },
    { name: 'ExtendiHealth - Union Station', distance: '2.4 km', waitTime: '5 min', queueLength: 1 },
  ];

  const analyzeSymptoms = () => {
    setIsAnalyzing(true);
    
    // Simulate AI analysis
    setTimeout(() => {
      const hasCriticalRedFlag = formData.redFlags.some(rf => 
        emergencyRedFlags.find(e => e.id === rf)?.critical
      );
      
      const severityScore = formData.severity;
      const hasRedFlags = formData.redFlags.length > 0;
      
      let recommendation;
      
      if (hasCriticalRedFlag) {
        recommendation = {
          type: 'emergency',
          title: 'Call 911 Immediately',
          subtitle: 'Your symptoms require emergency care',
          color: 'red',
          icon: Phone,
          message: 'Based on your symptoms, you need immediate emergency medical attention. Please call 911 or have someone drive you to the nearest emergency room.',
          action: 'call911',
          actionLabel: 'Call 911',
          savings: null,
        };
      } else if (hasRedFlags || severityScore >= 8) {
        recommendation = {
          type: 'er',
          title: 'Emergency Room Recommended',
          subtitle: 'Your symptoms need urgent evaluation',
          color: 'orange',
          icon: Building,
          message: 'Based on the severity of your symptoms, we recommend visiting an Emergency Room for proper evaluation. If symptoms worsen, call 911.',
          action: 'findER',
          actionLabel: 'Find Nearest ER',
          savings: null,
        };
      } else {
        const avgERWait = 4.5;
        const avgKioskWait = 0.25; // 15 min
        
        recommendation = {
          type: 'kiosk',
          title: 'Kiosk Visit Recommended',
          subtitle: 'Your symptoms are suitable for a kiosk visit',
          color: 'green',
          icon: CheckCircle,
          message: 'Good news! Based on your symptoms, an ExtendiHealth Kiosk can help you. Skip the long ER wait and get the care you need faster.',
          action: 'findKiosk',
          actionLabel: 'Find Nearest Kiosk',
          savings: {
            time: avgERWait - avgKioskWait,
          },
          comparison: {
            er: { wait: avgERWait },
            kiosk: { wait: avgKioskWait },
          }
        };
      }
      
      setResult(recommendation);
      setIsAnalyzing(false);
      setStep(4);
    }, 2000);
  };

  const handleRedFlagToggle = (flagId) => {
    setFormData(prev => ({
      ...prev,
      redFlags: prev.redFlags.includes(flagId)
        ? prev.redFlags.filter(f => f !== flagId)
        : [...prev.redFlags, flagId]
    }));
  };

  const handleSymptomToggle = (symptomId) => {
    setFormData(prev => ({
      ...prev,
      selectedSymptoms: prev.selectedSymptoms.includes(symptomId)
        ? prev.selectedSymptoms.filter(s => s !== symptomId)
        : [...prev.selectedSymptoms, symptomId]
    }));
  };

  const resetTool = () => {
    setStep(1);
    setResult(null);
    setFormData({
      mainConcern: '',
      selectedSymptoms: [],
      duration: '',
      severity: 5,
      redFlags: [],
      age: 'adult',
      forWhom: 'self',
    });
  };

  // Step 1: Who is this for & Emergency Check
  const Step1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Stethoscope className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">ER or Kiosk?</h2>
        <p className="text-gray-500 mt-2">Let's find the best care option for you</p>
      </div>

      {/* Emergency Banner */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertOctagon className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-800">If this is a life-threatening emergency</p>
            <p className="text-sm text-red-700 mt-1">Call 911 immediately or go to your nearest Emergency Room</p>
            <a href="tel:911" className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-red-600 text-white rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors">
              <Phone className="w-4 h-4" />
              Call 911
            </a>
          </div>
        </div>
      </div>

      {/* Who is this for */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Who needs care today?</label>
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: 'self', label: 'Myself', icon: '🙋' },
            { value: 'someone', label: 'Someone else', icon: '👥' },
          ].map(option => (
            <button
              key={option.value}
              onClick={() => setFormData(prev => ({ ...prev, forWhom: option.value }))}
              className={`p-4 rounded-xl border-2 transition-all ${
                formData.forWhom === option.value
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-2xl mb-2 block">{option.icon}</span>
              <span className={`font-medium ${formData.forWhom === option.value ? 'text-teal-700' : 'text-gray-700'}`}>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Age Group */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Age group</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { value: 'child', label: 'Child', sublabel: '0-17', icon: Baby },
            { value: 'adult', label: 'Adult', sublabel: '18-64', icon: Activity },
            { value: 'senior', label: 'Senior', sublabel: '65+', icon: Heart },
          ].map(option => {
            const Icon = option.icon;
            return (
              <button
                key={option.value}
                onClick={() => setFormData(prev => ({ ...prev, age: option.value }))}
                className={`p-4 rounded-xl border-2 transition-all ${
                  formData.age === option.value
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className={`w-6 h-6 mx-auto mb-2 ${formData.age === option.value ? 'text-teal-600' : 'text-gray-400'}`} />
                <span className={`font-medium block ${formData.age === option.value ? 'text-teal-700' : 'text-gray-700'}`}>
                  {option.label}
                </span>
                <span className="text-xs text-gray-500">{option.sublabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      <Button className="w-full" onClick={() => setStep(2)}>
        Continue
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );

  // Step 2: Symptoms Selection
  const Step2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">What's bothering you?</h2>
        <p className="text-gray-500 mt-1">Select all that apply</p>
      </div>

      {/* Main concern text input */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Describe your main concern</label>
        <textarea
          value={formData.mainConcern}
          onChange={(e) => setFormData(prev => ({ ...prev, mainConcern: e.target.value }))}
          placeholder="E.g., I have a headache and mild fever since yesterday..."
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
          rows={3}
        />
      </div>

      {/* Common Symptoms Grid */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">Common symptoms</label>
        <div className="grid grid-cols-2 gap-2">
          {commonSymptoms.map(symptom => {
            const Icon = symptom.icon;
            const isSelected = formData.selectedSymptoms.includes(symptom.id);
            return (
              <button
                key={symptom.id}
                onClick={() => handleSymptomToggle(symptom.id)}
                className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Icon className={`w-5 h-5 flex-shrink-0 ${isSelected ? 'text-teal-600' : 'text-gray-400'}`} />
                <span className={`text-sm font-medium ${isSelected ? 'text-teal-700' : 'text-gray-700'}`}>
                  {symptom.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-3">How long have you had these symptoms?</label>
        <div className="grid grid-cols-2 gap-2">
          {durationOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setFormData(prev => ({ ...prev, duration: option.value }))}
              className={`p-3 rounded-xl border-2 transition-all ${
                formData.duration === option.value
                  ? 'border-teal-500 bg-teal-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className={`font-medium ${formData.duration === option.value ? 'text-teal-700' : 'text-gray-700'}`}>
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => setStep(1)}>
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
        <Button 
          className="flex-1" 
          onClick={() => setStep(3)}
          disabled={!formData.duration}
        >
          Continue
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  // Step 3: Severity & Red Flags
  const Step3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-900">How severe are your symptoms?</h2>
        <p className="text-gray-500 mt-1">This helps us recommend the right care</p>
      </div>

      {/* Severity Slider - Enhanced */}
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-gray-700">Pain/Discomfort Level</label>
          <div className={`px-3 py-1 rounded-full text-lg font-bold ${
            formData.severity <= 3 ? 'bg-green-100 text-green-700' :
            formData.severity <= 6 ? 'bg-amber-100 text-amber-700' :
            'bg-red-100 text-red-700'
          }`}>
            {formData.severity}/10
          </div>
        </div>
        
        {/* Severity description */}
        <div className={`text-center py-2 px-4 rounded-lg mb-4 ${
          formData.severity <= 3 ? 'bg-green-50 text-green-700' :
          formData.severity <= 6 ? 'bg-amber-50 text-amber-700' :
          'bg-red-50 text-red-700'
        }`}>
          <span className="font-medium">
            {formData.severity <= 3 ? '😊 Mild - Manageable discomfort' :
             formData.severity <= 6 ? '😐 Moderate - Noticeable pain' :
             formData.severity <= 8 ? '😣 Severe - Significant pain' :
             '🚨 Very Severe - Intense pain'}
          </span>
        </div>

        {/* Custom Slider Track */}
        <div className="relative pt-2 pb-4">
          {/* Background track with gradient */}
          <div 
            className="h-3 rounded-full"
            style={{
              background: 'linear-gradient(to right, #22c55e 0%, #22c55e 30%, #f59e0b 30%, #f59e0b 60%, #ef4444 60%, #ef4444 100%)'
            }}
          />
          
          {/* Active fill */}
          <div 
            className="absolute top-2 left-0 h-3 rounded-full transition-all"
            style={{
              width: `${(formData.severity - 1) * 11.11}%`,
              background: formData.severity <= 3 ? '#22c55e' : 
                         formData.severity <= 6 ? '#f59e0b' : '#ef4444'
            }}
          />
          
          {/* Slider input */}
          <input
            type="range"
            min="1"
            max="10"
            value={formData.severity}
            onChange={(e) => setFormData(prev => ({ ...prev, severity: parseInt(e.target.value) }))}
            className="absolute top-0 left-0 w-full h-8 opacity-0 cursor-pointer z-10"
            style={{ margin: 0 }}
          />
          
          {/* Visual thumb */}
          <div 
            className="absolute top-0 w-7 h-7 bg-white rounded-full shadow-lg border-4 transition-all pointer-events-none"
            style={{
              left: `calc(${(formData.severity - 1) * 11.11}% - 14px)`,
              borderColor: formData.severity <= 3 ? '#22c55e' : 
                          formData.severity <= 6 ? '#f59e0b' : '#ef4444',
              top: '-4px'
            }}
          />
        </div>

        {/* Scale markers */}
        <div className="flex justify-between px-1 mb-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
            <button
              key={num}
              onClick={() => setFormData(prev => ({ ...prev, severity: num }))}
              className={`w-6 h-6 rounded-full text-xs font-bold transition-all ${
                formData.severity === num 
                  ? num <= 3 ? 'bg-green-500 text-white' :
                    num <= 6 ? 'bg-amber-500 text-white' :
                    'bg-red-500 text-white'
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Labels */}
        <div className="flex justify-between text-xs font-medium mt-2">
          <span className="text-green-600">Mild (1-3)</span>
          <span className="text-amber-600">Moderate (4-6)</span>
          <span className="text-red-600">Severe (7-10)</span>
        </div>
      </div>

      {/* Red Flags - Critical Warning */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <AlertCircle className="w-5 h-5 text-red-600" />
          <h3 className="font-semibold text-red-800">Emergency Warning Signs</h3>
        </div>
        <p className="text-sm text-red-700 mb-4">Check any that apply - these may require emergency care:</p>
        
        <div className="space-y-2">
          {emergencyRedFlags.map(flag => {
            const Icon = flag.icon;
            const isSelected = formData.redFlags.includes(flag.id);
            return (
              <button
                key={flag.id}
                onClick={() => handleRedFlagToggle(flag.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                  isSelected
                    ? 'border-red-500 bg-red-100'
                    : 'border-red-200 bg-white hover:border-red-300'
                }`}
              >
                {/* Checkbox */}
                <div 
                  className="w-6 h-6 rounded flex items-center justify-center flex-shrink-0"
                  style={{ 
                    backgroundColor: isSelected ? '#dc2626' : '#f3f4f6',
                    border: '2px solid ' + (isSelected ? '#dc2626' : '#374151'),
                  }}
                >
                  {isSelected && (
                    <svg className="w-4 h-4" fill="none" stroke="#ffffff" strokeWidth="3" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <Icon className={`w-5 h-5 flex-shrink-0 ${isSelected ? 'text-red-600' : 'text-gray-500'}`} />
                <span className={`text-sm font-medium ${isSelected ? 'text-red-800' : 'text-gray-700'}`}>
                  {flag.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* None of the above */}
      <button
        onClick={() => setFormData(prev => ({ ...prev, redFlags: [] }))}
        className={`w-full p-4 rounded-xl border-2 transition-all ${
          formData.redFlags.length === 0
            ? 'border-green-500 bg-green-50'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          <CheckCircle className={`w-5 h-5 ${formData.redFlags.length === 0 ? 'text-green-600' : 'text-gray-400'}`} />
          <span className={`font-medium ${formData.redFlags.length === 0 ? 'text-green-700' : 'text-gray-700'}`}>
            None of the above apply to me
          </span>
        </div>
      </button>

      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => setStep(2)}>
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
        <Button 
          className="flex-1" 
          onClick={analyzeSymptoms}
        >
          <Sparkles className="w-4 h-4" />
          Get Recommendation
        </Button>
      </div>
    </div>
  );

  // Step 4: Results
  const Step4 = () => {
    if (!result) return null;
    
    const ResultIcon = result.icon;
    
    // Get background color based on type
    const getHeaderStyle = () => {
      if (result.type === 'emergency') {
        return { background: '#dc2626' }; // red-600
      } else if (result.type === 'er') {
        return { background: '#f97316' }; // orange-500
      } else {
        return { background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)' }; // emerald to teal
      }
    };
    
    return (
      <div className="space-y-6">
        {/* Result Header */}
        <div 
          className="rounded-2xl p-6 text-center shadow-lg"
          style={getHeaderStyle()}
        >
          <div 
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
          >
            <ResultIcon className="w-10 h-10" style={{ color: '#ffffff' }} />
          </div>
          <h2 className="text-2xl font-bold" style={{ color: '#ffffff' }}>{result.title}</h2>
          <p className="mt-2" style={{ color: 'rgba(255,255,255,0.9)' }}>{result.subtitle}</p>
        </div>

        {/* Message */}
        <Card className="p-5">
          <p className="text-gray-700">{result.message}</p>
        </Card>

        {/* Savings (only for kiosk recommendation) */}
        {result.savings && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5 border border-green-200">
            <h3 className="font-bold text-green-800 mb-4 flex items-center gap-2">
              <TrendingDown className="w-5 h-5" />
              Skip the Wait
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">~{result.savings.time.toFixed(1)}hrs</p>
                <p className="text-sm text-green-700">Time saved</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">Faster</p>
                <p className="text-sm text-green-700">Access to care</p>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Table (only for kiosk recommendation) */}
        {result.comparison && (
          <Card className="overflow-hidden">
            <div className="grid grid-cols-2">
              {/* ER Column */}
              <div className="p-4 bg-gray-50 border-r border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Building className="w-5 h-5 text-gray-500" />
                  <h4 className="font-bold text-gray-700">Emergency Room</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">~{result.comparison.er.wait} hour wait</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">For emergencies</span>
                  </div>
                </div>
              </div>
              
              {/* Kiosk Column */}
              <div className="p-4 bg-teal-50">
                <div className="flex items-center gap-2 mb-4">
                  <Stethoscope className="w-5 h-5 text-teal-600" />
                  <h4 className="font-bold text-teal-700">ExtendiHealth Kiosk</h4>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-teal-600" />
                    <span className="text-teal-700 font-medium">~15 min wait</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                    <span className="text-teal-700 font-medium">Everyday health needs</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Nearby Kiosks (for kiosk recommendation) */}
        {result.type === 'kiosk' && (
          <div>
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-teal-500" />
              Nearest Kiosks
            </h3>
            <div className="space-y-3">
              {nearbyKiosks.map((kiosk, index) => (
                <Card 
                  key={index} 
                  className={`p-4 cursor-pointer hover:shadow-md transition-all ${index === 0 ? 'ring-2 ring-teal-500' : ''}`}
                  onClick={() => onNavigate?.('kiosks')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{kiosk.name}</h4>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {kiosk.distance}
                        </span>
                        <span className="flex items-center gap-1 text-teal-600 font-medium">
                          <Clock className="w-3.5 h-3.5" />
                          {kiosk.waitTime} wait
                        </span>
                        <span className="flex items-center gap-1">
                          <Activity className="w-3.5 h-3.5" />
                          {kiosk.queueLength} in queue
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      {index === 0 && (
                        <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full font-medium">
                          Shortest Wait
                        </span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Nearby ERs (for ER recommendation) */}
        {result.type === 'er' && (
          <div>
            <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Building className="w-5 h-5 text-orange-500" />
              Nearest Emergency Rooms
            </h3>
            <div className="space-y-3">
              {nearbyERs.map((er, index) => (
                <Card key={index} className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{er.name}</h4>
                      <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          {er.distance}
                        </span>
                        <span className="flex items-center gap-1 text-orange-600">
                          <Clock className="w-3.5 h-3.5" />
                          ~{er.waitTime} wait
                        </span>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm">
                      <Navigation className="w-4 h-4" />
                      Directions
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Safety Warning */}
        {result.type === 'kiosk' && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Important Safety Note</p>
                <p className="text-sm text-amber-700 mt-1">
                  If your symptoms worsen or you experience any emergency warning signs, 
                  please call 911 or go to the nearest Emergency Room immediately.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {result.type === 'emergency' ? (
            <a 
              href="tel:911" 
              className="w-full flex items-center justify-center gap-2 py-4 bg-red-600 text-white rounded-xl font-bold text-lg hover:bg-red-700 transition-colors"
            >
              <Phone className="w-6 h-6" />
              Call 911 Now
            </a>
          ) : result.type === 'er' ? (
            <Button className="w-full py-4 text-lg" onClick={() => {}}>
              <Navigation className="w-5 h-5" />
              Get Directions to Nearest ER
            </Button>
          ) : (
            <Button className="w-full py-4 text-lg" onClick={() => onNavigate?.('kiosks')}>
              <MapPin className="w-5 h-5" />
              Find Nearest Kiosk
            </Button>
          )}
          
          <Button variant="secondary" className="w-full" onClick={resetTool}>
            <RefreshCw className="w-4 h-4" />
            Start Over
          </Button>
          
          {/* Sign In / Create Account Prompt for non-logged-in users */}
          {!user && (
            <div className="mt-6 p-5 bg-gradient-to-r from-cyan-50 to-teal-50 rounded-xl border border-cyan-200">
              <h4 className="font-bold text-gray-900 text-center mb-2">Ready to get care?</h4>
              <p className="text-sm text-gray-600 text-center mb-4">
                Sign in or create an account to join the queue and track your visit.
              </p>
              <div className="flex gap-3">
                <Button 
                  variant="secondary" 
                  className="flex-1"
                  onClick={onSignIn}
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Button>
                <Button 
                  className="flex-1"
                  onClick={onCreateAccount}
                >
                  <UserPlus className="w-4 h-4" />
                  Create Account
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Analyzing State
  const AnalyzingState = () => (
    <div className="text-center py-12">
      <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
        <Sparkles className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Analyzing Your Symptoms</h2>
      <p className="text-gray-500">Our AI is determining the best care option for you...</p>
      
      <div className="mt-8 flex justify-center gap-2">
        <span className="w-3 h-3 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-3 h-3 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-3 h-3 bg-teal-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );

  // Progress indicator
  const ProgressBar = () => (
    <div className="flex gap-2 mb-6">
      {[1, 2, 3, 4].map((s) => (
        <div 
          key={s} 
          className={`flex-1 h-1.5 rounded-full transition-colors ${
            s <= step ? 'bg-teal-500' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );

  const content = (
    <div className="space-y-6">
      {step < 4 && !isAnalyzing && ProgressBar()}
      
      {isAnalyzing ? (
        AnalyzingState()
      ) : (
        <>
          {step === 1 && Step1()}
          {step === 2 && Step2()}
          {step === 3 && Step3()}
          {step === 4 && Step4()}
        </>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-6">
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title={step === 4 ? 'Your Recommendation' : 'ER or Kiosk?'} 
        onBack={step === 1 ? onBack : () => setStep(step - 1)} 
      />
      <div className="p-4 pb-24">
        {content}
      </div>
    </div>
  );
};

export default ERorKioskPage;
