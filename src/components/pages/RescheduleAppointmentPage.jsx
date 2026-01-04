import React, { useState, useMemo } from 'react';
import { 
  Calendar, Clock, MapPin, ChevronLeft, ChevronRight, Check, X,
  AlertCircle, User, Building, Phone, Loader, CheckCircle
} from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Card, Button, Badge } from '../ui';

/**
 * RescheduleAppointmentPage
 * 
 * Allows patients to reschedule an existing appointment
 * by selecting a new date and time slot
 */

const RescheduleAppointmentPage = ({ 
  appointment,
  onBack, 
  onReschedule,
  onNavigate 
}) => {
  const { isDesktop } = useResponsive();
  const [step, setStep] = useState(1); // 1: select date, 2: select time, 3: confirm, 4: success
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

  // Generate available dates (next 4 weeks)
  const availableDates = useMemo(() => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 28; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip Sundays
      if (date.getDay() === 0) continue;
      
      dates.push({
        date: date,
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNum: date.getDate(),
        month: date.toLocaleDateString('en-US', { month: 'short' }),
        full: date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
        available: Math.random() > 0.2, // 80% chance of availability
      });
    }
    return dates;
  }, []);

  // Get dates for current week view
  const weekDates = useMemo(() => {
    const startIdx = currentWeekOffset * 7;
    return availableDates.slice(startIdx, startIdx + 7);
  }, [availableDates, currentWeekOffset]);

  // Available time slots for selected date
  const timeSlots = useMemo(() => {
    if (!selectedDate) return [];
    
    const slots = [];
    const baseHour = 8; // Start at 8 AM
    
    for (let h = baseHour; h < 17; h++) {
      // Morning slots
      if (h < 12) {
        slots.push({
          time: `${h}:00 AM`,
          value: `${h.toString().padStart(2, '0')}:00`,
          available: Math.random() > 0.3,
        });
        slots.push({
          time: `${h}:30 AM`,
          value: `${h.toString().padStart(2, '0')}:30`,
          available: Math.random() > 0.3,
        });
      } else {
        // Afternoon slots
        const displayHour = h === 12 ? 12 : h - 12;
        slots.push({
          time: `${displayHour}:00 PM`,
          value: `${h.toString().padStart(2, '0')}:00`,
          available: Math.random() > 0.3,
        });
        slots.push({
          time: `${displayHour}:30 PM`,
          value: `${h.toString().padStart(2, '0')}:30`,
          available: Math.random() > 0.3,
        });
      }
    }
    
    return slots;
  }, [selectedDate]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (onReschedule) {
      onReschedule({
        ...appointment,
        appointmentDate: selectedDate.date.toISOString(),
        appointmentTime: selectedTime.time,
      });
    }
    
    setIsSubmitting(false);
    setStep(4); // Success
  };

  // Original appointment info card
  const OriginalAppointmentCard = () => (
    <Card className="p-4 bg-gray-50 border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <AlertCircle className="w-4 h-4 text-amber-500" />
        <span className="text-sm font-medium text-amber-700">Current Appointment</span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{new Date(appointment?.appointmentDate).toLocaleDateString('en-US', { 
            weekday: 'long', month: 'long', day: 'numeric' 
          })}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>{appointment?.appointmentTime}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{appointment?.location}</span>
        </div>
      </div>
    </Card>
  );

  // Step 1: Select Date
  const DateSelection = () => (
    <div className="space-y-4">
      <OriginalAppointmentCard />
      
      <div>
        <h3 className="font-bold text-gray-900 mb-4">Select a new date</h3>
        
        {/* Week navigation */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCurrentWeekOffset(Math.max(0, currentWeekOffset - 1))}
            disabled={currentWeekOffset === 0}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <span className="font-medium text-gray-700">
            {weekDates[0]?.month} {weekDates[0]?.dayNum} - {weekDates[weekDates.length - 1]?.month} {weekDates[weekDates.length - 1]?.dayNum}
          </span>
          <button
            onClick={() => setCurrentWeekOffset(Math.min(3, currentWeekOffset + 1))}
            disabled={currentWeekOffset >= 3}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Date grid */}
        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((day, i) => (
            <button
              key={i}
              onClick={() => day.available && setSelectedDate(day)}
              disabled={!day.available}
              className={`p-3 rounded-xl text-center transition-all ${
                selectedDate?.dayNum === day.dayNum && selectedDate?.month === day.month
                  ? 'bg-cyan-500 text-white'
                  : day.available
                    ? 'bg-white border border-gray-200 hover:border-cyan-300 hover:bg-cyan-50'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <div className="text-xs font-medium mb-1">{day.dayName}</div>
              <div className="text-lg font-bold">{day.dayNum}</div>
            </button>
          ))}
        </div>
      </div>

      <Button 
        className="w-full" 
        onClick={() => setStep(2)}
        disabled={!selectedDate}
      >
        Continue
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );

  // Step 2: Select Time
  const TimeSelection = () => (
    <div className="space-y-4">
      <button 
        onClick={() => setStep(1)}
        className="flex items-center gap-1 text-cyan-600 font-medium text-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        Change date
      </button>

      <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-cyan-600" />
          <span className="font-medium text-cyan-900">{selectedDate?.full}</span>
        </div>
      </div>

      <div>
        <h3 className="font-bold text-gray-900 mb-4">Select a time</h3>
        
        {/* Morning slots */}
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-500 mb-2">Morning</p>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.filter(s => s.time.includes('AM')).map((slot, i) => (
              <button
                key={i}
                onClick={() => slot.available && setSelectedTime(slot)}
                disabled={!slot.available}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  selectedTime?.value === slot.value
                    ? 'bg-cyan-500 text-white'
                    : slot.available
                      ? 'bg-white border border-gray-200 hover:border-cyan-300'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>

        {/* Afternoon slots */}
        <div>
          <p className="text-sm font-medium text-gray-500 mb-2">Afternoon</p>
          <div className="grid grid-cols-3 gap-2">
            {timeSlots.filter(s => s.time.includes('PM')).map((slot, i) => (
              <button
                key={i}
                onClick={() => slot.available && setSelectedTime(slot)}
                disabled={!slot.available}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  selectedTime?.value === slot.value
                    ? 'bg-cyan-500 text-white'
                    : slot.available
                      ? 'bg-white border border-gray-200 hover:border-cyan-300'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                }`}
              >
                {slot.time}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button 
        className="w-full" 
        onClick={() => setStep(3)}
        disabled={!selectedTime}
      >
        Review Changes
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );

  // Step 3: Confirm
  const ConfirmReschedule = () => (
    <div className="space-y-4">
      <button 
        onClick={() => setStep(2)}
        className="flex items-center gap-1 text-cyan-600 font-medium text-sm"
      >
        <ChevronLeft className="w-4 h-4" />
        Change time
      </button>

      <h3 className="font-bold text-gray-900">Confirm Reschedule</h3>

      {/* Before and After */}
      <div className="grid grid-cols-2 gap-4">
        {/* Original */}
        <Card className="p-3 bg-gray-50 border-gray-200">
          <p className="text-xs font-medium text-gray-500 mb-2">ORIGINAL</p>
          <p className="font-medium text-gray-900 text-sm">
            {new Date(appointment?.appointmentDate).toLocaleDateString('en-US', { 
              month: 'short', day: 'numeric' 
            })}
          </p>
          <p className="text-gray-600 text-sm">{appointment?.appointmentTime}</p>
        </Card>

        {/* New */}
        <Card className="p-3 bg-cyan-50 border-cyan-200">
          <p className="text-xs font-medium text-cyan-600 mb-2">NEW</p>
          <p className="font-medium text-cyan-900 text-sm">
            {selectedDate?.month} {selectedDate?.dayNum}
          </p>
          <p className="text-cyan-700 text-sm">{selectedTime?.time}</p>
        </Card>
      </div>

      {/* Appointment Details */}
      <Card className="p-4">
        <h4 className="font-semibold text-gray-900 mb-3">Appointment Details</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Provider</p>
              <p className="font-medium text-gray-900">{appointment?.provider || 'Dr. Emily Wang'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Building className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium text-gray-900">{appointment?.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Reason</p>
              <p className="font-medium text-gray-900">{appointment?.type || appointment?.reason}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
        <div className="flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5" />
          <p className="text-sm text-amber-800">
            Your original appointment slot will be released and made available to other patients.
          </p>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="secondary" className="flex-1" onClick={onBack}>
          Cancel
        </Button>
        <Button 
          className="flex-1" 
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader className="w-4 h-4 animate-spin" />
              Rescheduling...
            </>
          ) : (
            'Confirm Reschedule'
          )}
        </Button>
      </div>
    </div>
  );

  // Step 4: Success
  const SuccessScreen = () => (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h2 className="text-xl font-bold text-gray-900 mb-2">Appointment Rescheduled!</h2>
      <p className="text-gray-500 mb-6">
        Your appointment has been moved to the new date and time.
      </p>

      <Card className="p-4 mb-6 text-left">
        <h4 className="font-semibold text-gray-900 mb-3">New Appointment</h4>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-4 h-4 text-cyan-500" />
            <span className="font-medium">{selectedDate?.full}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-4 h-4 text-cyan-500" />
            <span className="font-medium">{selectedTime?.time}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <MapPin className="w-4 h-4 text-cyan-500" />
            <span>{appointment?.location}</span>
          </div>
        </div>
      </Card>

      <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-3 mb-6 text-left">
        <p className="text-sm text-cyan-800">
          A confirmation has been sent to your email and phone.
        </p>
      </div>

      <Button className="w-full" onClick={() => onNavigate ? onNavigate('appointments') : onBack()}>
        View My Appointments
      </Button>
    </div>
  );

  const renderStep = () => {
    switch (step) {
      case 1: return DateSelection();
      case 2: return TimeSelection();
      case 3: return ConfirmReschedule();
      case 4: return SuccessScreen();
      default: return DateSelection();
    }
  };

  const getTitle = () => {
    switch (step) {
      case 1: return 'Select New Date';
      case 2: return 'Select Time';
      case 3: return 'Confirm Changes';
      case 4: return 'Success';
      default: return 'Reschedule';
    }
  };

  if (isDesktop) {
    return (
      <div className="max-w-lg mx-auto py-8 px-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Reschedule Appointment</h1>
          <p className="text-gray-500 mt-1">{appointment?.type || 'Medical Appointment'}</p>
        </div>
        
        {/* Progress indicator */}
        {step < 4 && (
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  s < step ? 'bg-cyan-500 text-white' : 
                  s === step ? 'bg-cyan-500 text-white' : 
                  'bg-gray-200 text-gray-500'
                }`}>
                  {s < step ? <Check className="w-4 h-4" /> : s}
                </div>
                {s < 3 && <div className={`w-12 h-1 rounded ${s < step ? 'bg-cyan-500' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        )}
        
        {renderStep()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title={getTitle()}
        onBack={step === 1 ? onBack : () => setStep(step - 1)}
      />
      <div className="p-4 pb-24">
        {renderStep()}
      </div>
    </div>
  );
};

export default RescheduleAppointmentPage;
