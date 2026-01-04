import React from 'react';
import { 
  Heart, Calendar, Clock, MapPin, Check, AlertCircle, 
  Stethoscope, HelpCircle, ArrowRight, Zap,
  Building, TrendingDown, Sparkles, CheckCircle
} from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Card, Button } from '../ui';

const CareScreen = ({ onGetCareNow, onBookAppointment, onERorKiosk }) => {
  const { isDesktop } = useResponsive();

  return (
    <div className={`${isDesktop ? 'p-6 lg:p-8' : 'pb-24'}`}>
      <div className={`${isDesktop ? 'max-w-4xl mx-auto' : ''}`}>
        {!isDesktop && (
          <div className="bg-gradient-to-r from-cyan-400 via-cyan-500 to-teal-500 px-6 pt-6 pb-8">
            <h1 className="text-white text-2xl font-bold">Get Care</h1>
            <p className="text-cyan-100">Choose how you'd like to receive care</p>
          </div>
        )}

        {isDesktop && (
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Get Care</h1>
            <p className="text-gray-500 mt-1">Choose how you'd like to receive care today</p>
          </div>
        )}

        <div className={`${isDesktop ? '' : 'px-4 -mt-4'} space-y-4`}>
          
          {/* ER or Kiosk? - FEATURED */}
          <Card 
            onClick={onERorKiosk} 
            className="overflow-hidden cursor-pointer hover:shadow-xl transition-all border-2 border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50"
          >
            <div className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <HelpCircle className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-gray-900">ER or Kiosk?</h2>
                    <span className="px-2 py-0.5 bg-teal-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      NEW
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">
                    Not sure where to go? Let our AI help you decide the best care option.
                  </p>
                  
                  <div className="flex items-center gap-4 mt-3">
                    <div className="flex items-center gap-1.5 text-sm text-teal-700">
                      <Clock className="w-4 h-4" />
                      <span>Skip 4+ hour waits</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-sm text-teal-700">
                      <CheckCircle className="w-4 h-4" />
                      <span>Get seen faster</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-teal-500 flex-shrink-0" />
              </div>
            </div>
            
            {/* Mini comparison preview */}
            <div className="px-5 pb-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white/60 rounded-xl p-3 text-center">
                  <Building className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                  <p className="text-xs text-gray-500">ER Average</p>
                  <p className="font-bold text-gray-700">4-6 hour wait</p>
                </div>
                <div className="bg-white rounded-xl p-3 text-center border-2 border-teal-300">
                  <Stethoscope className="w-5 h-5 text-teal-500 mx-auto mb-1" />
                  <p className="text-xs text-teal-600">Kiosk</p>
                  <p className="font-bold text-teal-700">~15 min wait</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Two column layout for other options */}
          <div className={`${isDesktop ? 'grid grid-cols-2 gap-4' : 'space-y-4'}`}>
            
            {/* Get Care Now */}
            <Card onClick={onGetCareNow} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
              <div className="bg-gradient-to-r from-cyan-500 to-teal-500 p-5 text-white">
                <div className="flex items-start justify-between">
                  <div>
                    <Clock className="w-10 h-10 mb-3" />
                    <h2 className="text-xl font-bold mb-1">Get Care Now</h2>
                    <p className="text-cyan-100 text-sm">Join the queue and get seen today</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-white/70" />
                </div>
              </div>
              <div className="p-4 bg-gray-50">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-500" />
                    AI-powered symptom assessment
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-500" />
                    Real-time queue updates
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-500" />
                    Same-day appointments
                  </li>
                </ul>
              </div>
            </Card>

            {/* Book Appointment */}
            <Card onClick={onBookAppointment} className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow">
              <div className="p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <Calendar className="w-10 h-10 text-cyan-600 mb-3" />
                    <h2 className="text-xl font-bold text-gray-900 mb-1">Book Appointment</h2>
                    <p className="text-gray-500 text-sm">Schedule for a later date</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-300" />
                </div>
              </div>
              <div className="p-4 bg-gray-50">
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-500" />
                    Choose your preferred kiosk
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-500" />
                    Select date and time
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-cyan-500" />
                    Calendar reminders
                  </li>
                </ul>
              </div>
            </Card>
          </div>

          {/* Info banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-blue-800">Not sure which to choose?</p>
                <p className="text-sm text-blue-700 mt-1">
                  Use our "ER or Kiosk?" tool above to get a personalized recommendation based on your symptoms.
                </p>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default CareScreen;
