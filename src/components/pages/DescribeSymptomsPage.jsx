import React, { useState } from 'react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Button } from '../ui';

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


export default DescribeSymptomsPage;
