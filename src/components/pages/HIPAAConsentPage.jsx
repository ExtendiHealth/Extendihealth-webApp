import React, { useState } from 'react';
import { Shield, Lock, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Button, Card } from '../ui';

const HIPAAConsentPage = ({ onBack, onConsent, user }) => {
  const { isDesktop } = useResponsive();
  const [mainConsent, setMainConsent] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleSubmit = () => {
    const consentRecord = {
      timestamp: new Date().toISOString(),
      userId: user?.id,
      consents: {
        hipaaNotice: true,
        treatmentConsent: true,
        electronicConsent: true,
        dataSharing: true,
      },
      version: '2.0',
      complianceFramework: 'HIPAA',
    };
    onConsent(consentRecord);
  };

  return (
    <div className={`${isDesktop ? 'p-6 lg:p-8' : 'min-h-screen bg-gray-50'}`}>
      <div className={`${isDesktop ? 'max-w-2xl mx-auto' : ''}`}>
        {!isDesktop && <Header title="Privacy & Consent" onBack={onBack} />}
        
        <div className={`${isDesktop ? '' : 'p-4'}`}>
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-cyan-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Privacy & Consent</h2>
            <p className="text-gray-500">
              Your health information is protected by HIPAA federal regulations.
            </p>
          </div>

          {/* HIPAA Badge */}
          <Card className="p-4 mb-6 bg-gradient-to-r from-cyan-50 to-teal-50 border-cyan-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                <Lock className="w-5 h-5 text-cyan-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">HIPAA Compliant Platform</p>
                <p className="text-sm text-gray-600">Your health information is encrypted and secure</p>
              </div>
            </div>
          </Card>

          {/* Summary of what you're agreeing to */}
          <Card className="p-4 mb-4">
            <h3 className="font-semibold text-gray-900 mb-3">By proceeding, you agree to:</h3>
            <ul className="space-y-2 text-gray-700">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Receive AI-powered symptom assessment and care recommendations</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Share health information with healthcare providers for treatment</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Receive electronic communications about your care</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>Understand AI assessments are not a substitute for medical diagnosis</span>
              </li>
            </ul>
          </Card>

          {/* Expandable Details */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full flex items-center justify-between p-4 mb-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <span className="text-sm text-gray-600">View full privacy notice & terms</span>
            {showDetails ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {showDetails && (
            <Card className="p-4 mb-4 bg-gray-50 max-h-64 overflow-y-auto">
              <div className="text-sm text-gray-600 space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Notice of Privacy Practices</h4>
                  <p>ExtendiHealth protects your Protected Health Information (PHI) in accordance with HIPAA. You have the right to access, correct, and know who has accessed your information.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Consent for Treatment</h4>
                  <p>You authorize ExtendiHealth to conduct AI-powered pre-assessments, virtual triage, and connect you with licensed healthcare providers. AI assessments are not a substitute for professional medical diagnosis.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Electronic Communications</h4>
                  <p>You consent to receive health-related communications electronically, including appointment reminders, test results, and care instructions. All communications are encrypted.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-1">Health Information Exchange</h4>
                  <p>Your information may be shared with your care team, pharmacies, and laboratories as needed for treatment. You may request restrictions at any time.</p>
                </div>
              </div>
            </Card>
          )}

          {/* Single Consent Checkbox */}
          <Card className="p-4 mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={mainConsent}
                onChange={(e) => setMainConsent(e.target.checked)}
                className="w-6 h-6 mt-0.5 text-cyan-600 rounded focus:ring-cyan-500 accent-cyan-500"
              />
              <div>
                <p className="font-medium text-gray-900">
                  I have read and agree to the Privacy Notice and Consent for Treatment
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Including electronic communications and health information sharing
                </p>
              </div>
            </label>
          </Card>

          {/* Submit Button */}
          <Button 
            size="lg" 
            onClick={handleSubmit}
            disabled={!mainConsent}
            className="w-full"
          >
            <Check className="w-5 h-5" />
            Continue
          </Button>

          {/* Legal Footer */}
          <p className="text-xs text-gray-400 text-center mt-4">
            Consent recorded: {new Date().toLocaleDateString()}. A copy will be available in your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HIPAAConsentPage;
