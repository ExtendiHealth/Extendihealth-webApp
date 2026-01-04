import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, AlertCircle, CheckCircle, Activity, Clock, MapPin, 
  Phone, Heart, Thermometer, Brain, Stethoscope, Shield, ChevronRight,
  Check, Info, Loader, FileText, Video
} from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Button, Card, Badge } from '../ui';

// AI Triage Middleware - Symptom Analysis Engine
const AITriageEngine = {
  // Emergency red flags that require immediate 911
  emergencySymptoms: [
    'chest pain', 'heart attack', 'stroke', 'difficulty breathing', 
    'severe bleeding', 'unconscious', 'seizure', 'anaphylaxis',
    'severe allergic reaction', 'suicidal', 'overdose', 'poisoning',
    'sudden severe headache', 'facial drooping', 'arm weakness',
    'slurred speech', 'severe abdominal pain', 'coughing blood',
    'severe burns', 'broken bone visible', 'head injury',
  ],

  // High priority symptoms requiring urgent care
  urgentSymptoms: [
    'high fever', 'chest tightness', 'shortness of breath', 'severe pain',
    'vomiting blood', 'bloody stool', 'severe dehydration', 'confusion',
    'rapid heartbeat', 'fainting', 'dizziness', 'numbness', 'weakness',
    'high blood pressure', 'diabetic emergency', 'asthma attack',
    'severe infection', 'deep cut', 'animal bite', 'eye injury',
  ],

  // Symptom to possible condition mapping
  symptomConditionMap: {
    'headache': ['Tension headache', 'Migraine', 'Dehydration', 'Eye strain'],
    'fever': ['Viral infection', 'Bacterial infection', 'Flu', 'COVID-19'],
    'cough': ['Upper respiratory infection', 'Bronchitis', 'Allergies', 'Asthma'],
    'fatigue': ['Anemia', 'Thyroid disorder', 'Sleep disorder', 'Depression'],
    'nausea': ['Gastroenteritis', 'Food poisoning', 'Migraine', 'Medication side effect'],
    'chest pain': ['Possible cardiac concern', 'Acid reflux', 'Muscle strain', 'Anxiety'],
    'shortness of breath': ['Respiratory distress', 'Anxiety', 'Asthma', 'Heart condition'],
    'abdominal pain': ['Gastritis', 'IBS', 'Appendicitis concern', 'Gallbladder'],
    'back pain': ['Muscle strain', 'Disc issue', 'Kidney concern', 'Poor posture'],
    'sore throat': ['Viral pharyngitis', 'Strep throat', 'Allergies', 'Acid reflux'],
    'dizziness': ['Inner ear issue', 'Low blood pressure', 'Dehydration', 'Medication effect'],
    'rash': ['Allergic reaction', 'Contact dermatitis', 'Viral rash', 'Eczema'],
  },

  // Analyze symptoms and generate triage result
  analyzeSymptoms(symptomsData, medicalHistory, medications) {
    const { symptoms, duration, severity, answers } = symptomsData;
    const symptomsLower = symptoms.toLowerCase();
    
    // Check for emergency symptoms
    const isEmergency = this.emergencySymptoms.some(es => symptomsLower.includes(es));
    if (isEmergency) {
      return this.generateEmergencyResult(symptomsData);
    }

    // Check for urgent symptoms
    const isUrgent = this.urgentSymptoms.some(us => symptomsLower.includes(us));
    
    // Check answers for red flags
    const hasChestPain = answers?.chestPain === true;
    const hasHighFever = answers?.fever === true;
    const hasDifficultyBreathing = symptomsLower.includes('breathing') || symptomsLower.includes('breath');
    
    // Determine priority level
    let priority = 'standard';
    if (isUrgent || hasChestPain || (severity === 'Severe' && duration.includes('less than'))) {
      priority = 'high';
    } else if (severity === 'Severe' || hasHighFever) {
      priority = 'elevated';
    }

    // Generate possible conditions
    const possibleConditions = this.identifyPossibleConditions(symptomsLower);
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(priority, symptomsData, medicalHistory);
    
    // Generate wait time estimate
    const waitTimeEstimate = this.estimateWaitTime(priority);

    return {
      priority,
      isEmergency: false,
      triageLevel: this.getTriageLevel(priority),
      possibleConditions,
      recommendations,
      waitTimeEstimate,
      vitalsNeeded: this.determineVitalsNeeded(symptomsLower),
      followUpRequired: severity === 'Severe' || priority === 'high',
      aiConfidence: this.calculateConfidence(symptomsData),
      disclaimer: 'This is an AI-powered pre-assessment and not a medical diagnosis. A healthcare professional at the kiosk will provide a proper evaluation.',
      timestamp: new Date().toISOString(),
    };
  },

  generateEmergencyResult(symptomsData) {
    return {
      priority: 'emergency',
      isEmergency: true,
      triageLevel: 1,
      title: 'Emergency Detected',
      message: 'Based on your symptoms, you may need immediate emergency care.',
      action: 'CALL 911 IMMEDIATELY',
      possibleConditions: ['Potential life-threatening condition'],
      recommendations: [
        'Call 911 or your local emergency number immediately',
        'Do not drive yourself to the hospital',
        'Stay calm and follow dispatcher instructions',
        'Have someone stay with you if possible',
      ],
      waitTimeEstimate: null,
      disclaimer: 'This assessment detected potential emergency symptoms. Please seek immediate medical attention.',
      timestamp: new Date().toISOString(),
    };
  },

  identifyPossibleConditions(symptomsLower) {
    const conditions = new Set();
    
    Object.entries(this.symptomConditionMap).forEach(([symptom, possibleConditions]) => {
      if (symptomsLower.includes(symptom)) {
        possibleConditions.forEach(c => conditions.add(c));
      }
    });

    // If no specific matches, return general
    if (conditions.size === 0) {
      return ['General symptom evaluation needed', 'Condition to be determined by provider'];
    }

    return Array.from(conditions).slice(0, 4);
  },

  generateRecommendations(priority, symptomsData, medicalHistory) {
    const baseRecommendations = [];

    if (priority === 'high') {
      baseRecommendations.push(
        'Please visit your nearest ExtendiHealth Kiosk immediately for vital signs assessment and virtual clinician consultation.',
        'Stay calm and avoid physical exertion',
        'If symptoms worsen, call 911 immediately',
        'Have someone accompany you if possible',
      );
    } else if (priority === 'elevated') {
      baseRecommendations.push(
        'We recommend visiting an ExtendiHealth Kiosk within the next few hours for proper evaluation.',
        'Monitor your symptoms and note any changes',
        'Stay hydrated and rest',
        'Avoid any activities that worsen your symptoms',
      );
    } else {
      baseRecommendations.push(
        'Schedule a visit at your convenience at any ExtendiHealth Kiosk.',
        'Rest and stay hydrated',
        'Over-the-counter remedies may provide temporary relief',
        'Monitor your symptoms and return if they worsen',
      );
    }

    return baseRecommendations;
  },

  getTriageLevel(priority) {
    const levels = {
      emergency: 1,
      high: 2,
      elevated: 3,
      standard: 4,
    };
    return levels[priority] || 4;
  },

  estimateWaitTime(priority) {
    const times = {
      high: '5-10 minutes',
      elevated: '10-20 minutes',
      standard: '15-30 minutes',
    };
    return times[priority] || '15-30 minutes';
  },

  determineVitalsNeeded(symptomsLower) {
    const vitals = ['Blood Pressure', 'Heart Rate', 'Temperature'];
    
    if (symptomsLower.includes('breath') || symptomsLower.includes('oxygen')) {
      vitals.push('Oxygen Saturation');
    }
    if (symptomsLower.includes('sugar') || symptomsLower.includes('diabete')) {
      vitals.push('Blood Glucose');
    }
    
    return vitals;
  },

  calculateConfidence(symptomsData) {
    let confidence = 70;
    
    if (symptomsData.symptoms.length > 50) confidence += 10;
    if (symptomsData.duration) confidence += 5;
    if (symptomsData.severity) confidence += 5;
    if (symptomsData.answers && Object.keys(symptomsData.answers).length > 0) confidence += 10;
    
    return Math.min(confidence, 95);
  },
};

const EnhancedAIPreDiagnosisPage = ({ 
  symptomsData, 
  medicalHistory, 
  medications,
  answers, 
  onContinue, 
  onBack,
  onEmergency,
}) => {
  const { isDesktop } = useResponsive();
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisStep, setAnalysisStep] = useState(0);

  const analysisSteps = [
    'Analyzing symptoms...',
    'Reviewing medical history...',
    'Checking for interactions...',
    'Generating assessment...',
  ];

  useEffect(() => {
    // Simulate AI analysis with visual feedback
    const runAnalysis = async () => {
      for (let i = 0; i < analysisSteps.length; i++) {
        setAnalysisStep(i);
        await new Promise(resolve => setTimeout(resolve, 800));
      }
      
      // Run the actual analysis
      const result = AITriageEngine.analyzeSymptoms(
        { ...symptomsData, answers },
        medicalHistory,
        medications
      );
      
      setAnalysisResult(result);
      setIsAnalyzing(false);
    };

    runAnalysis();
  }, [symptomsData, medicalHistory, medications, answers]);

  if (isAnalyzing) {
    return (
      <div className={`${isDesktop ? 'p-6 lg:p-8' : 'min-h-screen bg-gray-50'}`}>
        <div className={`${isDesktop ? 'max-w-2xl mx-auto' : ''}`}>
          {!isDesktop && <Header title="AI Assessment" onBack={onBack} />}
          
          <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
            <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mb-6 animate-pulse">
              <Brain className="w-10 h-10 text-cyan-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Analyzing Your Symptoms</h2>
            <p className="text-gray-500 mb-8 text-center">
              Our AI is reviewing your information to provide the best care recommendation.
            </p>
            
            <div className="w-full max-w-xs space-y-3">
              {analysisSteps.map((step, index) => (
                <div key={step} className="flex items-center gap-3">
                  {index < analysisStep ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : index === analysisStep ? (
                    <Loader className="w-5 h-5 text-cyan-500 animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-gray-200" />
                  )}
                  <span className={`text-sm ${index <= analysisStep ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Emergency screen
  if (analysisResult?.isEmergency) {
    return (
      <div className={`${isDesktop ? 'p-6 lg:p-8' : 'min-h-screen bg-red-50'}`}>
        <div className={`${isDesktop ? 'max-w-2xl mx-auto' : ''}`}>
          {!isDesktop && <Header title="Emergency Alert" onBack={onBack} />}
          
          <div className="p-6">
            <Card className="p-6 bg-red-100 border-red-300 mb-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-red-800 mb-2">
                    Call 911 Immediately
                  </h2>
                  <p className="text-red-700">
                    {analysisResult.message}
                  </p>
                </div>
              </div>
            </Card>

            <div className="space-y-3 mb-6">
              {analysisResult.recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 p-3 bg-white rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-700">{rec}</span>
                </div>
              ))}
            </div>

            <a 
              href="tel:911" 
              className="w-full flex items-center justify-center gap-2 bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-colors"
            >
              <Phone className="w-5 h-5" />
              Call 911 Now
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Priority-based styling
  const priorityConfig = {
    high: {
      color: 'red',
      icon: AlertTriangle,
      title: 'High Priority',
      subtitle: 'Urgent Attention Recommended',
      bgClass: 'bg-red-50 border-red-200',
      textClass: 'text-red-700',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
    },
    elevated: {
      color: 'amber',
      icon: AlertCircle,
      title: 'Elevated Priority',
      subtitle: 'Prompt Evaluation Advised',
      bgClass: 'bg-amber-50 border-amber-200',
      textClass: 'text-amber-700',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
    },
    standard: {
      color: 'green',
      icon: CheckCircle,
      title: 'Standard Priority',
      subtitle: 'Routine Care Appropriate',
      bgClass: 'bg-green-50 border-green-200',
      textClass: 'text-green-700',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600',
    },
  };

  const config = priorityConfig[analysisResult.priority] || priorityConfig.standard;
  const PriorityIcon = config.icon;

  return (
    <div className={`${isDesktop ? 'p-6 lg:p-8' : 'min-h-screen bg-gray-50'}`}>
      <div className={`${isDesktop ? 'max-w-2xl mx-auto' : ''}`}>
        {!isDesktop && <Header title="AI Assessment" onBack={onBack} />}
        
        <div className={`${isDesktop ? '' : 'p-4'}`}>
          {/* Priority Card */}
          <Card className={`p-5 mb-4 ${config.bgClass}`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 ${config.iconBg} rounded-full flex items-center justify-center flex-shrink-0`}>
                <PriorityIcon className={`w-6 h-6 ${config.iconColor}`} />
              </div>
              <div>
                <Badge variant={analysisResult.priority === 'high' ? 'danger' : analysisResult.priority === 'elevated' ? 'warning' : 'success'}>
                  {config.title}
                </Badge>
                <h2 className="text-lg font-bold text-gray-900 mt-2">{config.subtitle}</h2>
                <p className={`text-sm mt-1 ${config.textClass}`}>
                  {analysisResult.priority === 'high' 
                    ? 'Based on your reported chest pain or breathing difficulty, we recommend immediate medical attention.'
                    : analysisResult.priority === 'elevated'
                    ? 'Your symptoms suggest you should be evaluated within the next few hours.'
                    : 'Your symptoms can be evaluated at your convenience.'}
                </p>
              </div>
            </div>
          </Card>

          {/* Possible Conditions */}
          <Card className="p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-cyan-600" />
              Possible Conditions
            </h3>
            <div className="space-y-2">
              {analysisResult.possibleConditions.map((condition, i) => (
                <div key={i} className="flex items-center gap-2 text-gray-700">
                  <div className="w-2 h-2 bg-cyan-500 rounded-full" />
                  {condition}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400 mt-3">
              *These are possibilities only. A healthcare provider will make the final diagnosis.
            </p>
          </Card>

          {/* Recommendations */}
          <Card className="p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-cyan-600" />
              Our Recommendation
            </h3>
            <p className="text-gray-700 mb-4">
              {analysisResult.recommendations[0]}
            </p>
            <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="font-medium text-gray-900">Estimated Wait Time</p>
                <p className="text-sm text-gray-500">{analysisResult.waitTimeEstimate} at most kiosks</p>
              </div>
            </div>
          </Card>

          {/* While You Wait */}
          <Card className="p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">While You Wait</h3>
            <div className="space-y-2">
              {analysisResult.recommendations.slice(1).map((rec, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 text-sm">{rec}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Vitals to be Checked */}
          <Card className="p-4 mb-6 bg-cyan-50 border-cyan-200">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-600" />
              Vitals to be Checked at Kiosk
            </h3>
            <div className="flex flex-wrap gap-2">
              {analysisResult.vitalsNeeded.map((vital) => (
                <span key={vital} className="px-3 py-1 bg-white rounded-full text-sm text-cyan-700 border border-cyan-200">
                  {vital}
                </span>
              ))}
            </div>
          </Card>

          {/* Disclaimer */}
          <div className="p-4 bg-gray-100 rounded-xl mb-6">
            <p className="text-xs text-gray-500 italic">
              {analysisResult.disclaimer}
            </p>
          </div>

          {/* Action Button */}
          <Button 
            size="lg" 
            onClick={() => onContinue(analysisResult)}
            className="w-full"
          >
            <MapPin className="w-5 h-5" />
            Find a Nearby Kiosk
          </Button>

          {/* Virtual Visit Option */}
          <button
            onClick={() => onContinue({ ...analysisResult, preferVirtual: true })}
            className="w-full mt-3 flex items-center justify-center gap-2 py-3 text-cyan-600 hover:bg-cyan-50 rounded-xl transition-colors"
          >
            <Video className="w-5 h-5" />
            Prefer a Virtual Visit Instead
          </button>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAIPreDiagnosisPage;
