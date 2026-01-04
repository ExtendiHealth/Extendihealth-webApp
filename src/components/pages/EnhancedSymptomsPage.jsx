import React, { useState } from 'react';
import { 
  AlertTriangle, Check, ChevronRight, Clock, Plus, X,
  Activity, Brain, Eye, Heart, Bone, Stethoscope
} from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Button, Card, Badge } from '../ui';

const EnhancedSymptomsPage = ({ onBack, onContinue }) => {
  const { isDesktop } = useResponsive();
  
  const [primarySymptom, setPrimarySymptom] = useState('');
  const [additionalSymptoms, setAdditionalSymptoms] = useState([]);
  const [bodyRegion, setBodyRegion] = useState(null);
  const [duration, setDuration] = useState('');
  const [severity, setSeverity] = useState('');
  const [symptomPattern, setSymptomPattern] = useState('');
  const [triggers, setTriggers] = useState([]);
  const [customTrigger, setCustomTrigger] = useState('');

  // Body regions with associated common symptoms
  const bodyRegions = [
    { 
      id: 'head', 
      name: 'Head & Neck', 
      icon: Brain,
      symptoms: ['Headache', 'Dizziness', 'Sore throat', 'Ear pain', 'Sinus pressure', 'Neck pain', 'Vision changes']
    },
    { 
      id: 'chest', 
      name: 'Chest & Heart', 
      icon: Heart,
      symptoms: ['Chest pain', 'Chest tightness', 'Heart palpitations', 'Shortness of breath', 'Cough', 'Heartburn']
    },
    { 
      id: 'abdomen', 
      name: 'Stomach & Abdomen', 
      icon: Activity,
      symptoms: ['Stomach pain', 'Nausea', 'Vomiting', 'Diarrhea', 'Constipation', 'Bloating', 'Loss of appetite']
    },
    { 
      id: 'musculoskeletal', 
      name: 'Muscles & Joints', 
      icon: Bone,
      symptoms: ['Back pain', 'Joint pain', 'Muscle aches', 'Stiffness', 'Swelling', 'Limited mobility', 'Weakness']
    },
    { 
      id: 'skin', 
      name: 'Skin', 
      icon: Eye,
      symptoms: ['Rash', 'Itching', 'Hives', 'Swelling', 'Redness', 'Bruising', 'Wound/cut']
    },
    { 
      id: 'general', 
      name: 'General/Whole Body', 
      icon: Stethoscope,
      symptoms: ['Fever', 'Fatigue', 'Chills', 'Night sweats', 'Weight loss', 'General weakness', 'Malaise']
    },
  ];

  const durations = [
    { value: 'hours', label: 'Just started (hours)', detail: 'Within the last 24 hours' },
    { value: 'days', label: '1-3 days', detail: 'Started recently' },
    { value: 'week', label: '4-7 days', detail: 'About a week' },
    { value: 'weeks', label: '1-4 weeks', detail: 'A few weeks' },
    { value: 'month', label: 'More than a month', detail: 'Ongoing issue' },
  ];

  const severityLevels = [
    { value: 'mild', label: 'Mild', description: 'Noticeable but not interfering with daily activities' },
    { value: 'moderate', label: 'Moderate', description: 'Affecting some daily activities' },
    { value: 'severe', label: 'Severe', description: 'Significantly impacting daily life' },
  ];

  const patterns = [
    { value: 'constant', label: 'Constant', description: 'Always present' },
    { value: 'intermittent', label: 'Comes & Goes', description: 'Episodes with breaks' },
    { value: 'worsening', label: 'Getting Worse', description: 'Progressively increasing' },
    { value: 'improving', label: 'Getting Better', description: 'Gradually decreasing' },
  ];

  const commonTriggers = [
    'Physical activity', 'Eating', 'Stress', 'Certain foods', 
    'Weather changes', 'Morning/Night', 'Position changes', 'Nothing specific'
  ];

  const selectedRegion = bodyRegions.find(r => r.id === bodyRegion);

  const addSymptom = (symptom) => {
    if (!additionalSymptoms.includes(symptom) && symptom !== primarySymptom) {
      setAdditionalSymptoms([...additionalSymptoms, symptom]);
    }
  };

  const removeSymptom = (symptom) => {
    setAdditionalSymptoms(additionalSymptoms.filter(s => s !== symptom));
  };

  const toggleTrigger = (trigger) => {
    if (triggers.includes(trigger)) {
      setTriggers(triggers.filter(t => t !== trigger));
    } else {
      setTriggers([...triggers, trigger]);
    }
  };

  const addCustomTrigger = () => {
    if (customTrigger.trim() && !triggers.includes(customTrigger.trim())) {
      setTriggers([...triggers, customTrigger.trim()]);
      setCustomTrigger('');
    }
  };

  const isComplete = primarySymptom && duration && severity;

  const handleContinue = () => {
    const symptomsData = {
      primarySymptom,
      additionalSymptoms,
      bodyRegion,
      duration,
      severity,
      symptomPattern,
      triggers,
      symptoms: `${primarySymptom}. ${additionalSymptoms.join('. ')}`.trim(),
      timestamp: new Date().toISOString(),
      dataClassification: 'PHI',
    };
    onContinue(symptomsData);
  };

  return (
    <div className={`${isDesktop ? 'p-6 lg:p-8' : 'min-h-screen bg-gray-50'}`}>
      <div className={`${isDesktop ? 'max-w-3xl mx-auto' : ''}`}>
        {!isDesktop && <Header title="Describe Symptoms" onBack={onBack} />}
        
        <div className={`${isDesktop ? '' : 'p-4'}`}>
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell Us About Your Symptoms</h2>
            <p className="text-gray-500">
              The more detail you provide, the better we can help you.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex-1 h-1.5 bg-cyan-500 rounded-full" />
            <div className="flex-1 h-1.5 bg-cyan-500 rounded-full" />
            <div className="flex-1 h-1.5 bg-cyan-500 rounded-full" />
          </div>

          {/* Body Region Selection */}
          <Card className="p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">Where is the problem?</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {bodyRegions.map((region) => {
                const Icon = region.icon;
                return (
                  <button
                    key={region.id}
                    onClick={() => {
                      setBodyRegion(region.id);
                      setPrimarySymptom('');
                      setAdditionalSymptoms([]);
                    }}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${
                      bodyRegion === region.id
                        ? 'border-cyan-500 bg-cyan-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1 ${bodyRegion === region.id ? 'text-cyan-600' : 'text-gray-400'}`} />
                    <span className={`text-sm font-medium ${bodyRegion === region.id ? 'text-cyan-700' : 'text-gray-700'}`}>
                      {region.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </Card>

          {/* Primary Symptom */}
          {bodyRegion && (
            <Card className="p-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3">What's your main symptom?</h3>
              <div className="space-y-2">
                {selectedRegion?.symptoms.map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => setPrimarySymptom(symptom)}
                    className={`w-full p-3 text-left rounded-xl border-2 transition-all ${
                      primarySymptom === symptom
                        ? 'border-cyan-500 bg-cyan-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={primarySymptom === symptom ? 'text-cyan-700' : 'text-gray-700'}>
                        {symptom}
                      </span>
                      {primarySymptom === symptom && (
                        <Check className="w-5 h-5 text-cyan-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Custom symptom input */}
              <div className="mt-3">
                <input
                  type="text"
                  value={primarySymptom && !selectedRegion?.symptoms.includes(primarySymptom) ? primarySymptom : ''}
                  onChange={(e) => setPrimarySymptom(e.target.value)}
                  placeholder="Or describe your symptom..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                />
              </div>
            </Card>
          )}

          {/* Additional Symptoms */}
          {primarySymptom && (
            <Card className="p-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3">Any other symptoms?</h3>
              
              {/* Selected additional symptoms */}
              {additionalSymptoms.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                  {additionalSymptoms.map((symptom) => (
                    <span
                      key={symptom}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-sm"
                    >
                      {symptom}
                      <button onClick={() => removeSymptom(symptom)}>
                        <X className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Quick add buttons */}
              <div className="flex flex-wrap gap-2">
                {selectedRegion?.symptoms
                  .filter(s => s !== primarySymptom && !additionalSymptoms.includes(s))
                  .slice(0, 4)
                  .map((symptom) => (
                    <button
                      key={symptom}
                      onClick={() => addSymptom(symptom)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-200 text-gray-600 rounded-full text-sm hover:border-cyan-500 hover:text-cyan-600"
                    >
                      <Plus className="w-3 h-3" />
                      {symptom}
                    </button>
                  ))}
              </div>

              {/* General symptoms */}
              <p className="text-sm text-gray-500 mt-4 mb-2">Also experiencing?</p>
              <div className="flex flex-wrap gap-2">
                {['Fever', 'Fatigue', 'Chills', 'Nausea'].filter(s => !additionalSymptoms.includes(s)).map((symptom) => (
                  <button
                    key={symptom}
                    onClick={() => addSymptom(symptom)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 border border-gray-200 text-gray-600 rounded-full text-sm hover:border-cyan-500 hover:text-cyan-600"
                  >
                    <Plus className="w-3 h-3" />
                    {symptom}
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Duration */}
          {primarySymptom && (
            <Card className="p-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5 text-gray-400" />
                How long have you had these symptoms?
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {durations.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDuration(d.value)}
                    className={`p-3 text-left rounded-xl border-2 transition-all ${
                      duration === d.value
                        ? 'border-cyan-500 bg-cyan-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className={`font-medium ${duration === d.value ? 'text-cyan-700' : 'text-gray-900'}`}>
                      {d.label}
                    </span>
                    <p className="text-xs text-gray-500">{d.detail}</p>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Severity */}
          {duration && (
            <Card className="p-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-3">How severe are your symptoms?</h3>
              <div className="space-y-2">
                {severityLevels.map((level) => (
                  <button
                    key={level.value}
                    onClick={() => setSeverity(level.value)}
                    className={`w-full p-4 text-left rounded-xl border-2 transition-all ${
                      severity === level.value
                        ? level.value === 'severe' 
                          ? 'border-red-500 bg-red-50' 
                          : level.value === 'moderate'
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className={`font-medium ${
                          severity === level.value 
                            ? level.value === 'severe' ? 'text-red-700' 
                            : level.value === 'moderate' ? 'text-amber-700' 
                            : 'text-green-700'
                            : 'text-gray-900'
                        }`}>
                          {level.label}
                        </span>
                        <p className="text-sm text-gray-500">{level.description}</p>
                      </div>
                      {severity === level.value && (
                        <Check className={`w-5 h-5 ${
                          level.value === 'severe' ? 'text-red-600' 
                          : level.value === 'moderate' ? 'text-amber-600' 
                          : 'text-green-600'
                        }`} />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {/* Severity warning */}
              {severity === 'severe' && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-xl mt-4">
                  <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-red-800">Severe Symptoms Noted</p>
                    <p className="text-sm text-red-600">
                      If you're experiencing a medical emergency, please call 911 immediately.
                    </p>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Pattern (optional) */}
          {severity && (
            <Card className="p-4 mb-4">
              <h3 className="font-semibold text-gray-900 mb-1">How do your symptoms behave?</h3>
              <p className="text-sm text-gray-500 mb-3">Optional but helpful</p>
              <div className="grid grid-cols-2 gap-2">
                {patterns.map((p) => (
                  <button
                    key={p.value}
                    onClick={() => setSymptomPattern(symptomPattern === p.value ? '' : p.value)}
                    className={`p-3 text-left rounded-xl border-2 transition-all ${
                      symptomPattern === p.value
                        ? 'border-cyan-500 bg-cyan-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className={`text-sm font-medium ${symptomPattern === p.value ? 'text-cyan-700' : 'text-gray-900'}`}>
                      {p.label}
                    </span>
                    <p className="text-xs text-gray-500">{p.description}</p>
                  </button>
                ))}
              </div>
            </Card>
          )}

          {/* Continue Button */}
          <Button 
            size="lg" 
            onClick={handleContinue}
            disabled={!isComplete}
            className="w-full"
          >
            Continue to Assessment
            <ChevronRight className="w-5 h-5" />
          </Button>

          {!isComplete && (
            <p className="text-center text-sm text-gray-400 mt-3">
              Please complete all required fields to continue
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnhancedSymptomsPage;
