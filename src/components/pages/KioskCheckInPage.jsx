import React, { useState, useEffect } from 'react';
import { User, Shield, Activity, CheckCircle, Clock, Heart, Thermometer, AlertCircle, ChevronLeft, Video, Check } from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Button, Card, Badge } from '../ui';

const KioskCheckInPage = ({ appointment, kiosk, user, onBack, onCheckInComplete, onStartVisit }) => {
  const { isDesktop } = useResponsive();
  const [step, setStep] = useState(1); // 1: Verify, 2: Vitals, 3: Ready
  const [vitals, setVitals] = useState({
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    oxygenLevel: '',
    weight: '',
  });
  const [isCapturing, setIsCapturing] = useState(false);

  const simulateVitalCapture = () => {
    setIsCapturing(true);
    setTimeout(() => {
      setVitals({
        bloodPressure: '128/82',
        heartRate: '72',
        temperature: '98.4',
        oxygenLevel: '98',
        weight: '175',
      });
      setIsCapturing(false);
      setStep(3);
    }, 3000);
  };

  const content = (
    <div className="space-y-6">
      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8">
        {['Verify', 'Vitals', 'Ready'].map((label, i) => (
          <div key={label} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
              i + 1 < step ? 'bg-green-500 text-white' :
              i + 1 === step ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {i + 1 < step ? <Check className="w-5 h-5" /> : i + 1}
            </div>
            {i < 2 && <div className={`w-16 h-1 mx-2 ${i + 1 < step ? 'bg-green-500' : 'bg-gray-200'}`} />}
          </div>
        ))}
      </div>

      {step === 1 && (
        <>
          <div className="text-center">
            <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-10 h-10 text-cyan-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Verify Your Identity</h2>
            <p className="text-gray-500">Please confirm your information to check in</p>
          </div>

          <Card className="p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-500">Name</span>
              <span className="font-medium">{user?.name || `${user?.firstName} ${user?.lastName}`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date of Birth</span>
              <span className="font-medium">{user?.dob}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Health Card</span>
              <span className="font-medium">{user?.healthCard}</span>
            </div>
          </Card>

          <Card className="p-4 bg-amber-50 border-amber-100">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Health Card Required</p>
                <p className="text-sm text-amber-600 mt-1">
                  Please have your health card ready to scan at the kiosk.
                </p>
              </div>
            </div>
          </Card>

          <Button size="lg" className="w-full" onClick={() => setStep(2)}>
            Confirm & Continue
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="text-center">
            <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Activity className="w-10 h-10 text-cyan-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Capture Vitals</h2>
            <p className="text-gray-500">The kiosk will measure your vitals automatically</p>
          </div>

          {isCapturing ? (
            <Card className="p-8 text-center">
              <div className="animate-pulse">
                <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-cyan-600 animate-pulse" />
                </div>
                <p className="font-medium text-gray-900">Measuring vitals...</p>
                <p className="text-sm text-gray-500 mt-1">Please remain still</p>
              </div>
              <div className="mt-6 space-y-2">
                {['Blood Pressure', 'Heart Rate', 'Temperature', 'Oxygen Level'].map((vital, i) => (
                  <div key={vital} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${i < 2 ? 'bg-green-500' : 'bg-gray-300 animate-pulse'}`} />
                    <span className="text-sm text-gray-600">{vital}</span>
                    {i < 2 && <Check className="w-4 h-4 text-green-500 ml-auto" />}
                  </div>
                ))}
              </div>
            </Card>
          ) : (
            <>
              <Card className="p-4">
                <h3 className="font-semibold text-gray-900 mb-3">Instructions</h3>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    Sit comfortably in front of the kiosk
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    Place your arm in the blood pressure cuff
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    Place your finger on the pulse oximeter
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    Remain still during measurement
                  </li>
                </ol>
              </Card>

              <Button size="lg" className="w-full" onClick={simulateVitalCapture}>
                <Activity className="w-5 h-5" />
                Start Vital Capture
              </Button>
            </>
          )}
        </>
      )}

      {step === 3 && (
        <>
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Check-In Complete!</h2>
            <p className="text-gray-500">Your vitals have been recorded</p>
          </div>

          <Card className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Your Vitals</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-gray-900">{vitals.bloodPressure}</p>
                <p className="text-xs text-gray-500">Blood Pressure</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-gray-900">{vitals.heartRate} <span className="text-sm font-normal">bpm</span></p>
                <p className="text-xs text-gray-500">Heart Rate</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-gray-900">{vitals.temperature}°F</p>
                <p className="text-xs text-gray-500">Temperature</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-2xl font-bold text-gray-900">{vitals.oxygenLevel}%</p>
                <p className="text-xs text-gray-500">Oxygen Level</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-cyan-50 border-cyan-100">
            <div className="flex items-start gap-3">
              <Video className="w-5 h-5 text-cyan-600 mt-0.5" />
              <div>
                <p className="font-medium text-cyan-800">Provider Ready</p>
                <p className="text-sm text-cyan-600 mt-1">
                  Dr. Michelle Chen is ready to see you. Click below to start your visit.
                </p>
              </div>
            </div>
          </Card>

          <Button size="lg" className="w-full" onClick={onStartVisit}>
            <Video className="w-5 h-5" />
            Start Virtual Visit
          </Button>

          <Button variant="secondary" size="lg" className="w-full" onClick={onCheckInComplete}>
            I'll Wait for In-Person
          </Button>
        </>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <div className="max-w-lg mx-auto py-8">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ChevronLeft className="w-5 h-5" />
          Back
        </button>
        <Card className="p-6">
          {content}
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Kiosk Check-In" onBack={onBack} />
      <div className="p-4 pb-24">
        {content}
      </div>
    </div>
  );
};

// ============================================================================
// VIRTUAL VISIT PAGE
// ============================================================================


export default KioskCheckInPage;
