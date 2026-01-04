import React from 'react';
import { Heart, MapPin, Clock, Shield, HelpCircle, ArrowRight } from 'lucide-react';
import { useResponsive } from '../../hooks';
import { AnimatedPulseIcon } from '../ui';

const LandingPage = ({ onGetStarted, onSignIn, onFindKiosk, onCheckWaitingRoom, onERorKiosk }) => {
  const { isMobile, isTablet, isDesktop, isLargeDesktop } = useResponsive();

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-400 via-cyan-500 to-teal-600 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-300/10 rounded-full blur-3xl" />
      </div>

      {/* Header - All Screen Sizes */}
      <header className="relative z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <AnimatedPulseIcon size={28} color="white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-white">ExtendiHealth</span>
          </div>
          
          {/* Desktop Nav */}
          {(isDesktop || isTablet) && (
            <nav className="flex items-center gap-2 sm:gap-4">
              <button onClick={onFindKiosk} className="px-3 py-2 text-white/90 hover:text-white font-medium transition-colors">
                Find Kiosks
              </button>
              <button onClick={onSignIn} className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white font-medium rounded-xl transition-all">
                Sign In
              </button>
              <button 
                onClick={onGetStarted} 
                className="px-5 py-2.5 bg-white text-cyan-600 font-semibold rounded-xl hover:bg-white/90 hover:shadow-lg transition-all"
              >
                Get Started
              </button>
            </nav>
          )}

          {/* Mobile Nav */}
          {isMobile && (
            <div className="flex items-center gap-2">
              <button onClick={onSignIn} className="px-3 py-2 text-white font-medium text-sm">
                Sign In
              </button>
              <button 
                onClick={onGetStarted} 
                className="px-4 py-2 bg-white text-cyan-600 font-semibold rounded-xl text-sm"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`min-h-[calc(100vh-140px)] flex flex-col ${isDesktop ? 'lg:flex-row lg:items-center lg:gap-12' : 'items-center justify-center'}`}>
            
            {/* Hero Section */}
            <div className={`flex-1 ${isDesktop ? 'py-12' : 'py-8 text-center'}`}>
              {/* Animated Icon - Mobile/Tablet */}
              {!isDesktop && (
                <div className="w-28 h-28 sm:w-36 sm:h-36 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6">
                  <AnimatedPulseIcon size={isMobile ? 70 : 90} color="white" />
                </div>
              )}

              {/* Animated Icon - Desktop (inline with text) */}
              {isDesktop && (
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
                  <AnimatedPulseIcon size={50} color="white" />
                </div>
              )}
              
              <h1 className={`font-bold text-white leading-tight mb-4 ${
                isLargeDesktop ? 'text-6xl' : isDesktop ? 'text-5xl' : isTablet ? 'text-4xl' : 'text-3xl'
              }`}>
                Healthcare at Your{' '}
                <span className="text-cyan-100">Fingertips</span>
              </h1>
              
              <p className={`text-cyan-50 mb-6 max-w-xl ${
                isDesktop ? 'text-lg' : isTablet ? 'text-base mx-auto' : 'text-base mx-auto'
              }`}>
                Skip the wait. Get fast, accessible healthcare through our network of smart kiosks. 
                Book appointments, track prescriptions, and manage your health records — all in one place.
              </p>

              {/* CTA Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-8">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-white font-medium text-sm">Skip the wait. Get care in minutes.</span>
              </div>

              {/* CTA Buttons - Desktop */}
              {isDesktop && (
                <div className="flex flex-wrap items-center gap-4">
                  <button 
                    onClick={onGetStarted} 
                    className="px-8 py-4 bg-white text-cyan-600 font-bold rounded-2xl hover:bg-white/90 hover:shadow-xl hover:shadow-cyan-500/30 transition-all text-lg"
                  >
                    Create Free Account
                  </button>
                  <button 
                    onClick={onSignIn} 
                    className="px-8 py-4 bg-transparent text-white font-semibold rounded-2xl border-2 border-white/50 hover:bg-white/10 hover:border-white transition-all text-lg"
                  >
                    Sign In
                  </button>
                </div>
              )}

              {/* Quick Stats - Desktop */}
              {isDesktop && (
                <div className="flex items-center gap-8 mt-10 pt-8 border-t border-white/20">
                  <div>
                    <div className="text-3xl font-bold text-white">24/7</div>
                    <div className="text-cyan-100 text-sm">Always Available</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">HIPAA</div>
                    <div className="text-cyan-100 text-sm">Compliant & Secure</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">Real-Time</div>
                    <div className="text-cyan-100 text-sm">Queue Updates</div>
                  </div>
                </div>
              )}
            </div>

            {/* Feature Cards Section */}
            <div className={`${isDesktop ? 'flex-1 max-w-xl' : 'w-full max-w-md'} ${!isDesktop ? 'pb-8' : ''}`}>
              
              {/* ER or Kiosk? - Featured Card */}
              <div 
                onClick={onERorKiosk}
                className="bg-white rounded-2xl cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all mb-4 overflow-hidden"
              >
                <div 
                  className="p-4"
                  style={{ background: 'linear-gradient(135deg, #0d9488 0%, #0891b2 100%)' }}
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                    >
                      <HelpCircle className="w-6 h-6" style={{ color: '#ffffff' }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-lg" style={{ color: '#ffffff' }}>Not sure? ER or Kiosk?</h3>
                        <span 
                          className="px-2 py-0.5 text-xs font-bold rounded-full"
                          style={{ backgroundColor: 'rgba(255,255,255,0.25)', color: '#ffffff' }}
                        >
                          AI
                        </span>
                      </div>
                      <p className="text-sm" style={{ color: '#a5f3fc' }}>
                        Let AI help you decide. Skip the wait.
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.8)' }} />
                  </div>
                </div>
                <div className="p-3 bg-gray-50 flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-gray-500">ER: <span className="font-semibold text-gray-700">4-6 hour wait</span></span>
                    <span className="text-teal-600">Kiosk: <span className="font-semibold">~15 min wait</span></span>
                  </div>
                </div>
              </div>

              <div className={`grid ${isMobile ? 'grid-cols-2 gap-3' : 'grid-cols-2 gap-4'}`}>
                {/* Card 1 - Find Nearby Kiosks */}
                <div 
                  onClick={onFindKiosk}
                  className={`bg-white rounded-2xl cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all ${
                    isMobile ? 'p-4' : 'p-6'
                  }`}
                >
                  <div className={`bg-cyan-50 rounded-xl flex items-center justify-center mb-3 ${
                    isMobile ? 'w-10 h-10' : 'w-12 h-12'
                  }`}>
                    <MapPin className={`text-cyan-600 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                  </div>
                  <h3 className={`font-bold text-gray-900 mb-1 ${isMobile ? 'text-sm' : 'text-base'}`}>Find Nearby Kiosks</h3>
                  <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    Multiple locations across the city. Find the closest kiosk with shortest wait.
                  </p>
                </div>

                {/* Card 2 - e-Waiting Room */}
                <div 
                  onClick={onGetStarted}
                  className={`bg-white rounded-2xl cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all ${
                    isMobile ? 'p-4' : 'p-6'
                  }`}
                >
                  <div className={`bg-cyan-50 rounded-xl flex items-center justify-center mb-3 ${
                    isMobile ? 'w-10 h-10' : 'w-12 h-12'
                  }`}>
                    <Clock className={`text-cyan-600 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                  </div>
                  <h3 className={`font-bold text-gray-900 mb-1 ${isMobile ? 'text-sm' : 'text-base'}`}>e-Waiting Room</h3>
                  <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    Wait from home, not the clinic. Get notified when it's your turn.
                  </p>
                </div>

                {/* Card 3 - Get Care in Minutes */}
                <div 
                  onClick={onGetStarted}
                  className={`bg-white rounded-2xl cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all ${
                    isMobile ? 'p-4' : 'p-6'
                  }`}
                >
                  <div className={`bg-cyan-50 rounded-xl flex items-center justify-center mb-3 ${
                    isMobile ? 'w-10 h-10' : 'w-12 h-12'
                  }`}>
                    <Heart className={`text-cyan-600 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                  </div>
                  <h3 className={`font-bold text-gray-900 mb-1 ${isMobile ? 'text-sm' : 'text-base'}`}>Get Care in Minutes</h3>
                  <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    Skip the Wait. AI-powered triage gets you seen faster.
                  </p>
                </div>

                {/* Card 4 - Secure Health Records */}
                <div 
                  onClick={onGetStarted}
                  className={`bg-white rounded-2xl cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all ${
                    isMobile ? 'p-4' : 'p-6'
                  }`}
                >
                  <div className={`bg-cyan-50 rounded-xl flex items-center justify-center mb-3 ${
                    isMobile ? 'w-10 h-10' : 'w-12 h-12'
                  }`}>
                    <Shield className={`text-cyan-600 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`} />
                  </div>
                  <h3 className={`font-bold text-gray-900 mb-1 ${isMobile ? 'text-sm' : 'text-base'}`}>Secure Health Records</h3>
                  <p className={`text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    Access prescriptions, lab results & visit history. HIPAA compliant.
                  </p>
                </div>
              </div>

              {/* Mobile CTA Buttons */}
              {!isDesktop && (
                <div className="mt-6 space-y-3">
                  <button 
                    onClick={onGetStarted} 
                    className="w-full px-6 py-4 bg-white text-cyan-600 font-bold rounded-2xl hover:bg-white/90 transition-all shadow-lg"
                  >
                    Get Started Free
                  </button>
                  <button 
                    onClick={onSignIn} 
                    className="w-full px-6 py-4 bg-white/20 text-white font-semibold rounded-2xl border-2 border-white/30 hover:bg-white/30 transition-all"
                  >
                    Already have an account? Sign In
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-4 text-center text-white/60 text-xs sm:text-sm">
        <p>© 2025 ExtendiHealth Systems Inc. • HIPAA Compliant • Privacy Policy • Terms of Service</p>
      </footer>
    </div>
  );
};

export default LandingPage;
