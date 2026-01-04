import React, { useState } from 'react';
import { MapPin, Clock, Calendar, Check, Activity, Pill, Video, ChevronRight, User, Mail, Phone, Heart, Bell, ChevronLeft, FlaskConical } from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Button, Card, Badge } from '../ui';
import { VISIT_REASONS } from '../../data/constants';

const BookKioskSlotPage = ({ kiosk, user, bookingFlow, onBack, onConfirm, onUpdateBooking }) => {
  const { isDesktop } = useResponsive();
  const [step, setStep] = useState(1); // 1: Reason, 2: Date/Time, 3: Review
  const [selectedReason, setSelectedReason] = useState(bookingFlow?.reason || null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [notes, setNotes] = useState('');
  const [visitType, setVisitType] = useState('in-person');

  const visitReasons = [
    { id: 'general', title: 'General Assessment', subtitle: 'Health check, minor concerns', icon: Activity, duration: '15-20 min' },
    { id: 'chronic', title: 'Chronic Condition Review', subtitle: 'Diabetes, hypertension, etc.', icon: Heart, duration: '20-30 min' },
    { id: 'prescription', title: 'Prescription Refill', subtitle: 'Renew medications', icon: Pill, duration: '10-15 min' },
    { id: 'labwork', title: 'Lab Work / Tests', subtitle: 'Blood work, vitals check', icon: FlaskConical, duration: '15-20 min' },
    { id: 'followup', title: 'Follow-up Visit', subtitle: 'Previous appointment follow-up', icon: Calendar, duration: '15-20 min' },
    { id: 'virtual', title: 'Virtual Consultation', subtitle: 'Video call with provider', icon: Video, duration: '15-30 min' },
  ];

  // Generate available dates (next 7 days)
  const availableDates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i);
    return {
      date: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      isToday: i === 0,
    };
  });

  // Generate time slots
  const timeSlots = [
    { time: '9:00 AM', available: true },
    { time: '9:30 AM', available: false },
    { time: '10:00 AM', available: true },
    { time: '10:30 AM', available: true },
    { time: '11:00 AM', available: true },
    { time: '11:30 AM', available: false },
    { time: '1:00 PM', available: true },
    { time: '1:30 PM', available: true },
    { time: '2:00 PM', available: true },
    { time: '2:30 PM', available: false },
    { time: '3:00 PM', available: true },
    { time: '3:30 PM', available: true },
    { time: '4:00 PM', available: true },
    { time: '4:30 PM', available: true },
  ];

  const handleContinue = () => {
    if (step === 1 && selectedReason) {
      setStep(2);
    } else if (step === 2 && selectedDate && selectedTime) {
      setStep(3);
    } else if (step === 3) {
      const appointmentNumber = `EH-${Date.now().toString(36).toUpperCase()}`;
      onConfirm({
        kiosk,
        reason: visitReasons.find(r => r.id === selectedReason),
        date: selectedDate,
        time: selectedTime,
        notes,
        visitType,
        appointmentNumber,
      });
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">What brings you in?</h2>
              <p className="text-gray-500">Select the reason for your visit</p>
            </div>

            <div className="space-y-3">
              {visitReasons.map((reason) => (
                <button
                  key={reason.id}
                  onClick={() => setSelectedReason(reason.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    selectedReason === reason.id
                      ? 'border-cyan-500 bg-cyan-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      selectedReason === reason.id ? 'bg-cyan-500 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <reason.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{reason.title}</h3>
                      <p className="text-sm text-gray-500">{reason.subtitle}</p>
                      <p className="text-xs text-cyan-600 mt-1">{reason.duration}</p>
                    </div>
                    {selectedReason === reason.id && (
                      <Check className="w-5 h-5 text-cyan-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Visit Type */}
            <div className="pt-4 border-t border-gray-100">
              <p className="text-sm font-medium text-gray-700 mb-3">Visit Type</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setVisitType('in-person')}
                  className={`flex-1 p-3 rounded-xl border-2 text-center transition-all ${
                    visitType === 'in-person' ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200'
                  }`}
                >
                  <MapPin className={`w-5 h-5 mx-auto mb-1 ${visitType === 'in-person' ? 'text-cyan-500' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium">In-Person</span>
                </button>
                <button
                  onClick={() => setVisitType('virtual')}
                  className={`flex-1 p-3 rounded-xl border-2 text-center transition-all ${
                    visitType === 'virtual' ? 'border-cyan-500 bg-cyan-50' : 'border-gray-200'
                  }`}
                >
                  <Video className={`w-5 h-5 mx-auto mb-1 ${visitType === 'virtual' ? 'text-cyan-500' : 'text-gray-400'}`} />
                  <span className="text-sm font-medium">Virtual</span>
                </button>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Select Date & Time</h2>
              <p className="text-gray-500">Choose your preferred appointment slot</p>
            </div>

            {/* Date Selection */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Select Date</p>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {availableDates.map((d) => (
                  <button
                    key={d.date}
                    onClick={() => setSelectedDate(d)}
                    className={`flex-shrink-0 w-16 py-3 rounded-xl text-center transition-all ${
                      selectedDate?.date === d.date
                        ? 'bg-cyan-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <p className="text-xs font-medium">{d.isToday ? 'Today' : d.dayName}</p>
                    <p className="text-xl font-bold">{d.dayNum}</p>
                    <p className="text-xs">{d.month}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-3">Select Time</p>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      disabled={!slot.available}
                      className={`py-3 px-2 rounded-xl text-sm font-medium transition-all ${
                        selectedTime === slot.time
                          ? 'bg-cyan-500 text-white'
                          : slot.available
                          ? 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          : 'bg-gray-50 text-gray-300 cursor-not-allowed line-through'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Additional Notes (Optional)</p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional information for your provider..."
                rows={3}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none resize-none"
              />
            </div>
          </div>
        );

      case 3:
        const reason = visitReasons.find(r => r.id === selectedReason);
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Review & Confirm</h2>
              <p className="text-gray-500">Please review your appointment details</p>
            </div>

            <Card className="p-4 space-y-4">
              {/* Kiosk Info */}
              <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{kiosk.name}</h3>
                  <p className="text-sm text-gray-500">{kiosk.address}</p>
                </div>
              </div>

              {/* Visit Details */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Visit Type</span>
                  <span className="font-medium flex items-center gap-2">
                    {visitType === 'virtual' ? <Video className="w-4 h-4" /> : <MapPin className="w-4 h-4" />}
                    {visitType === 'virtual' ? 'Virtual' : 'In-Person'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Reason</span>
                  <span className="font-medium">{reason?.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium">{selectedDate?.month} {selectedDate?.dayNum}, {new Date().getFullYear()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time</span>
                  <span className="font-medium">{selectedTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Duration</span>
                  <span className="font-medium">{reason?.duration}</span>
                </div>
              </div>

              {notes && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-1">Notes</p>
                  <p className="text-gray-700">{notes}</p>
                </div>
              )}
            </Card>

            {/* Patient Info */}
            <Card className="p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Patient Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium">{user?.name || user?.firstName + ' ' + user?.lastName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Health Card</span>
                  <span className="font-medium">{user?.healthCard || 'Not provided'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium">{user?.phone}</span>
                </div>
              </div>
            </Card>

            {/* Confirmation Notice */}
            <div className="bg-cyan-50 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <Bell className="w-5 h-5 text-cyan-600 mt-0.5" />
                <div>
                  <p className="font-medium text-cyan-800">Confirmation & Reminders</p>
                  <p className="text-sm text-cyan-600 mt-1">
                    You'll receive a confirmation email and SMS reminder 1 hour before your appointment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const content = (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center gap-2">
        {[1, 2, 3].map((s) => (
          <React.Fragment key={s}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              s < step ? 'bg-cyan-500 text-white' :
              s === step ? 'bg-cyan-500 text-white' : 'bg-gray-200 text-gray-500'
            }`}>
              {s < step ? <Check className="w-4 h-4" /> : s}
            </div>
            {s < 3 && <div className={`flex-1 h-1 rounded ${s < step ? 'bg-cyan-500' : 'bg-gray-200'}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      {renderStep()}

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-4">
        {step > 1 && (
          <Button variant="secondary" size="lg" onClick={() => setStep(step - 1)} className="flex-1">
            Back
          </Button>
        )}
        <Button 
          size="lg" 
          onClick={handleContinue}
          disabled={
            (step === 1 && !selectedReason) ||
            (step === 2 && (!selectedDate || !selectedTime))
          }
          className="flex-1"
        >
          {step === 3 ? 'Confirm Booking' : 'Continue'}
        </Button>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <div className="max-w-2xl mx-auto py-8">
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
      <Header title="Book Appointment" onBack={onBack} />
      <div className="p-4 pb-24">
        {content}
      </div>
    </div>
  );
};

// ============================================================================
// APPOINTMENT CONFIRMED PAGE
// ============================================================================


export default BookKioskSlotPage;
