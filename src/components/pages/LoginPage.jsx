import React, { useState } from 'react';
import { Mail, ChevronLeft } from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Button, Card, AnimatedPulseIcon } from '../ui';
import { Header } from '../layout';

const LoginPage = ({ onBack, onLogin, onForgotPin, onCreateAccount }) => {
  const { isDesktop } = useResponsive();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [step, setStep] = useState('email');
  const [loginMethod, setLoginMethod] = useState('password');

  const handleContinue = () => {
    if (step === 'email' && email) {
      setStep('auth');
    } else if (step === 'auth') {
      if (loginMethod === 'pin' && pin.length === 4) {
        onLogin({ email, pin });
      } else if (loginMethod === 'password' && password) {
        onLogin({ email, password });
      }
    }
  };

  const useTestAccount = () => {
    setEmail('jide@gmail.com');
  };

  const content = (
    <div className="space-y-6">
      {step === 'email' ? (
        <>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-500">Enter your email to continue</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
              />
            </div>
          </div>
          
          <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-4">
            <p className="text-sm text-cyan-700 mb-2">
              <strong>Demo Account:</strong> Use <span className="font-mono">jide@gmail.com</span> with any 4-digit PIN or password
            </p>
            <button onClick={useTestAccount} className="text-cyan-600 font-medium text-sm underline">
              Use test account
            </button>
          </div>

          <Button size="lg" onClick={handleContinue} disabled={!email} className="w-full">
            Continue
          </Button>
          <p className="text-center text-gray-500">
            Don't have an account?{' '}
            <button onClick={onCreateAccount} className="text-cyan-600 font-medium">
              Create one
            </button>
          </p>
        </>
      ) : (
        <>
          <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
            <button
              onClick={() => setLoginMethod('password')}
              className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${
                loginMethod === 'password' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              Password
            </button>
            <button
              onClick={() => setLoginMethod('pin')}
              className={`flex-1 py-2.5 rounded-lg font-medium text-sm transition-all ${
                loginMethod === 'pin' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500'
              }`}
            >
              Use PIN instead
            </button>
          </div>

          {loginMethod === 'password' ? (
            <>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter your password</h2>
                <p className="text-gray-500">Password for {email}</p>
              </div>
              
              {email.toLowerCase() === 'jide@gmail.com' && (
                <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-3">
                  <p className="text-sm text-cyan-700 text-center">Demo mode: Enter any password</p>
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
                />
              </div>
              
              <Button size="lg" onClick={handleContinue} disabled={!password} className="w-full">
                Sign In
              </Button>
              <button onClick={onForgotPin} className="w-full text-center text-cyan-600 font-medium">
                Forgot Password?
              </button>
            </>
          ) : (
            <>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter your PIN</h2>
                <p className="text-gray-500">4-digit PIN for {email}</p>
              </div>
              
              {email.toLowerCase() === 'jide@gmail.com' && (
                <div className="bg-cyan-50 border border-cyan-100 rounded-xl p-3">
                  <p className="text-sm text-cyan-700 text-center">Demo mode: Enter any 4-digit PIN (e.g., 1234)</p>
                </div>
              )}
              
              <div className="flex justify-center gap-4">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`w-14 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                      pin.length > i ? 'border-cyan-500 bg-cyan-50 text-cyan-600' : 'border-gray-200'
                    }`}
                  >
                    {pin.length > i ? '•' : ''}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'del'].map((num, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (num === 'del') setPin(pin.slice(0, -1));
                      else if (num !== '' && pin.length < 4) setPin(pin + num);
                    }}
                    className={`h-14 rounded-xl font-semibold text-xl transition-all ${
                      num === '' ? 'invisible' : num === 'del' ? 'text-gray-500' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                    }`}
                  >
                    {num === 'del' ? '⌫' : num}
                  </button>
                ))}
              </div>
              <Button size="lg" onClick={handleContinue} disabled={pin.length !== 4} className="w-full">
                Sign In
              </Button>
              <button onClick={onForgotPin} className="w-full text-center text-cyan-600 font-medium">
                Forgot PIN?
              </button>
            </>
          )}
        </>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-cyan-500 to-teal-600 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AnimatedPulseIcon size={40} color="white" />
            </div>
            <h1 className="text-2xl font-bold text-white">ExtendiHealth</h1>
          </div>
          <Card className="p-8">
            {step === 'auth' && (
              <button onClick={() => setStep('email')} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-4">
                <ChevronLeft className="w-5 h-5" />
                Back
              </button>
            )}
            {content}
          </Card>
          <p className="text-center text-white/70 mt-6 text-sm">
            © 2025 ExtendiHealth Inc. • HIPAA Compliant
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Sign In" onBack={onBack} />
      <div className="p-6 max-w-md mx-auto">
        {content}
      </div>
    </div>
  );
};

export default LoginPage;
