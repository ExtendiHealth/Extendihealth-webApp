import React from 'react';
import { 
  MapPin, Clock, LogIn, UserPlus, ArrowLeft, 
  Calendar, CheckCircle, Shield, Heart
} from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Button, Card } from '../ui';

const LoginToBookPage = ({ kiosk, onBack, onSignIn, onCreateAccount }) => {
  const { isDesktop } = useResponsive();

  const content = (
    <div className="space-y-6">
      {/* Kiosk Info Card */}
      {kiosk && (
        <Card className="p-4 bg-gradient-to-r from-cyan-50 to-teal-50 border-cyan-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
              <MapPin className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">{kiosk.name}</h3>
              <p className="text-sm text-gray-500">{kiosk.address}</p>
              {kiosk.waitTime && (
                <div className="flex items-center gap-1 mt-1 text-sm text-cyan-600">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{kiosk.waitTime} wait</span>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Main CTA Section */}
      <div className="text-center py-6">
        <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
          <Calendar className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Book?</h2>
        <p className="text-gray-600 max-w-sm mx-auto">
          Create a free account or sign in to book your visit and join the queue.
        </p>
      </div>

      {/* Benefits */}
      <Card className="p-5">
        <h3 className="font-semibold text-gray-900 mb-4">With an account you can:</h3>
        <ul className="space-y-3">
          {[
            { icon: Calendar, text: 'Book appointments at any kiosk' },
            { icon: Clock, text: 'Join the e-Waiting Room from anywhere' },
            { icon: Heart, text: 'Save your health records securely' },
            { icon: Shield, text: 'HIPAA-compliant & protected' },
          ].map(({ icon: Icon, text }, index) => (
            <li key={index} className="flex items-center gap-3">
              <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center">
                <Icon className="w-4 h-4 text-cyan-600" />
              </div>
              <span className="text-gray-700">{text}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button className="w-full py-4 text-lg" onClick={onCreateAccount}>
          <UserPlus className="w-5 h-5" />
          Create Free Account
        </Button>
        
        <Button variant="secondary" className="w-full py-4 text-lg" onClick={onSignIn}>
          <LogIn className="w-5 h-5" />
          Sign In
        </Button>
      </div>

      {/* Note */}
      <p className="text-center text-sm text-gray-500">
        It only takes a minute to create an account. Your information is secure and private.
      </p>
    </div>
  );

  if (isDesktop) {
    return (
      <div className="max-w-lg mx-auto py-8 px-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Kiosk
        </button>
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Book a Visit" onBack={onBack} />
      <div className="p-4 pb-24">
        {content}
      </div>
    </div>
  );
};

export default LoginToBookPage;
