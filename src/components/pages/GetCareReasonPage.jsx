import React, { useState } from 'react';
import { ChevronRight, Check } from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Button } from '../ui';

// Define care reasons with icons inline to avoid import issues
const CARE_REASONS = [
  { id: 'sick', label: 'I feel sick / have symptoms', icon: '🤒' },
  { id: 'chronic', label: 'I have a chronic condition flare-up', icon: '💊' },
  { id: 'question', label: 'I have a question about my health', icon: '❓' },
  { id: 'prescription', label: 'I need a prescription renewal', icon: '💉' },
  { id: 'specialist', label: 'I need a specialist consultation', icon: '👨‍⚕️' },
  { id: 'followup', label: 'I need a follow-up on a previous visit', icon: '📋' },
];

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
            {CARE_REASONS.map((reason) => (
              <button
                key={reason.id}
                onClick={() => setSelected(reason.id)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all flex items-center justify-between ${
                  selected === reason.id
                    ? 'border-cyan-500 bg-cyan-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{reason.icon}</span>
                  <span className={`font-medium ${selected === reason.id ? 'text-cyan-700' : 'text-gray-900'}`}>
                    {reason.label}
                  </span>
                </div>
                {selected === reason.id && (
                  <Check className="w-5 h-5 text-cyan-600" />
                )}
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

export default GetCareReasonPage;
