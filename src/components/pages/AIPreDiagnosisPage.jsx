import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle, Activity, Clock, MapPin, Check } from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Button, Card } from '../ui';

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


export default AIPreDiagnosisPage;
