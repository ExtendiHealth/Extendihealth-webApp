import React, { useState, useEffect } from 'react';
import { Heart, Calendar, Bell, Settings, Clock, MapPin, ChevronRight, Activity, Pill, FlaskConical, FileText, Navigation, BookOpen, Users, CheckCircle, Lock, Timer, BellRing, Unlock, QrCode, Stethoscope, UserCheck, Play, MessageSquare, Globe, CreditCard, FileHeart, HelpCircle, Building, Sparkles, ArrowRight } from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Button, Card, Badge } from '../ui';
import { KIOSKS } from '../../data/constants';

// ============================================================================
// QUEUE THRESHOLD CONFIGURATION (must match EWaitingRoomPage)
// ============================================================================
const QUEUE_THRESHOLDS = {
  standard: 45,
  urgent: 60,
  elevated: 50,
  virtual: 15,
  walkIn: 0,
  gracePeriod: 15,
};

const parseAppointmentDateTime = (dateStr, timeStr) => {
  const date = new Date(dateStr);
  const timeParts = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (timeParts) {
    let hours = parseInt(timeParts[1]);
    const minutes = parseInt(timeParts[2]);
    const period = timeParts[3].toUpperCase();
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    date.setHours(hours, minutes, 0, 0);
  }
  return date;
};

const getQueueWindowStatus = (appointment, aiPriority = 'standard') => {
  if (!appointment?.date || !appointment?.time) {
    return { canJoin: true, status: 'open', message: '' };
  }

  const now = new Date();
  const appointmentTime = parseAppointmentDateTime(appointment.date, appointment.time);
  
  let threshold = QUEUE_THRESHOLDS.standard;
  if (appointment.visitType === 'Virtual') threshold = QUEUE_THRESHOLDS.virtual;
  else if (appointment.visitType === 'Walk-in' || appointment.isWalkIn) threshold = QUEUE_THRESHOLDS.walkIn;
  else if (aiPriority === 'emergency' || aiPriority === 'high') threshold = QUEUE_THRESHOLDS.urgent;
  else if (aiPriority === 'elevated') threshold = QUEUE_THRESHOLDS.elevated;

  const windowOpenTime = new Date(appointmentTime.getTime() - threshold * 60 * 1000);
  const windowCloseTime = new Date(appointmentTime.getTime() + QUEUE_THRESHOLDS.gracePeriod * 60 * 1000);
  
  const minutesUntilOpen = Math.ceil((windowOpenTime - now) / (60 * 1000));
  const minutesUntilAppointment = Math.ceil((appointmentTime - now) / (60 * 1000));

  if (now < windowOpenTime) {
    return { canJoin: false, status: 'early', minutesUntilOpen, windowOpenTime, threshold, appointmentTime };
  } else if (now > windowCloseTime) {
    return { canJoin: false, status: 'late', appointmentTime };
  } else if (now > appointmentTime) {
    return { canJoin: true, status: 'grace', appointmentTime };
  } else {
    return { canJoin: true, status: 'open', minutesUntilAppointment, appointmentTime };
  }
};

const formatTime = (date) => date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

const formatCountdown = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// ============================================================================
// VISIT STATUS CONFIGURATIONS
// ============================================================================
const VISIT_STATUSES = {
  waiting: {
    label: 'In Queue',
    color: 'teal',
    bgGradient: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #06b6d4 100%)',
    icon: Users,
    description: 'You are in the virtual queue',
  },
  'checked-in': {
    label: 'Checked In',
    color: 'green',
    bgGradient: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)',
    icon: CheckCircle,
    description: 'Waiting at kiosk for provider',
  },
  'in-session': {
    label: 'In Session',
    color: 'blue',
    bgGradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%)',
    icon: Stethoscope,
    description: 'Your visit is in progress',
  },
  'completed': {
    label: 'Completed',
    color: 'gray',
    bgGradient: 'linear-gradient(135deg, #4b5563 0%, #6b7280 50%, #9ca3af 100%)',
    icon: UserCheck,
    description: 'Visit completed',
  },
};

const Dashboard = ({ 
  user, 
  appointments, 
  prescriptions, 
  labResults, 
  waitingRoom,
  onNavigate, 
  onGetCareNow, 
  onBookAppointment, 
  onSettings, 
  onJoinWaitingRoom,
  onResumeWaitingRoom, 
  onFindKiosk, 
  onNotifications,
  onViewVisitDetails,
}) => {
  const { isDesktop, isLargeDesktop } = useResponsive();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [reminderSet, setReminderSet] = useState(false);
  
  const upcomingAppointments = appointments.filter(a => a.status !== 'Completed').slice(0, 2);
  const nextAppointment = upcomingAppointments[0];
  const activePrescriptions = prescriptions.filter(p => p.status === 'Active');
  const recentLabResults = labResults.length;

  // Update time every minute for countdown
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  // Check various visit states
  const hasActiveWaitingRoom = waitingRoom && waitingRoom.status === 'waiting';
  const isCheckedIn = waitingRoom && waitingRoom.status === 'checked-in';
  const isInSession = waitingRoom && waitingRoom.status === 'in-session';
  const hasActiveVisit = hasActiveWaitingRoom || isCheckedIn || isInSession;

  const formatAppointmentDate = (dateStr) => {
    const appointmentDate = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    appointmentDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    tomorrow.setHours(0, 0, 0, 0);
    
    if (appointmentDate.getTime() === today.getTime()) return 'Today';
    else if (appointmentDate.getTime() === tomorrow.getTime()) return 'Tomorrow';
    else return appointmentDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // ============================================================================
  // VISIT STATUS CARD - Shows current visit status
  // ============================================================================
  const VisitStatusCard = ({ isMobile = false }) => {
    const status = waitingRoom?.status;
    const statusConfig = VISIT_STATUSES[status];
    const StatusIcon = statusConfig?.icon || Clock;
    const checkInNumber = waitingRoom?.checkInNumber || waitingRoom?.appointment?.confirmationNumber || 'EH-000000';

    // Checked In Status
    if (isCheckedIn) {
      return (
        <div 
          style={{ background: statusConfig.bgGradient }}
          className={`rounded-2xl p-5 ${isMobile ? 'mb-6' : ''} cursor-pointer hover:shadow-xl transition-all relative overflow-hidden shadow-lg`}
          onClick={onViewVisitDetails || onResumeWaitingRoom}
        >
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="inline-flex items-center gap-2 mb-2 rounded-full px-3 py-1.5" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}>
            <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
            <span className="text-white text-sm font-semibold">Checked In</span>
          </div>
          
          <h2 className="text-white text-2xl font-bold mb-2">You're at the Kiosk</h2>
          <p className="text-white/90 text-sm mb-3">A healthcare provider will see you shortly</p>
          
          <div className="bg-white rounded-xl p-3 mb-3 inline-block">
            <div className="flex items-center gap-2">
              <QrCode className="w-4 h-4 text-green-600" />
              <span className="text-green-800 font-mono font-bold">{checkInNumber}</span>
            </div>
          </div>
          
          <p className="text-white/80 text-sm font-medium">
            📍 {waitingRoom?.kiosk?.name || 'ExtendiHealth Kiosk'}
          </p>
        </div>
      );
    }

    // In Session Status
    if (isInSession) {
      return (
        <div 
          style={{ background: statusConfig.bgGradient }}
          className={`rounded-2xl p-5 ${isMobile ? 'mb-6' : ''} relative overflow-hidden shadow-lg`}
        >
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <div className="inline-flex items-center gap-2 mb-2 rounded-full px-3 py-1.5" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}>
            <Play className="w-3 h-3 text-white" />
            <span className="text-white text-sm font-semibold">In Progress</span>
          </div>
          
          <h2 className="text-white text-2xl font-bold mb-2">Visit In Session</h2>
          <p className="text-white/90 text-sm mb-3">Your consultation is currently in progress</p>
          
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <span className="text-white text-xs block">Duration</span>
              <span className="text-white text-lg font-bold">{waitingRoom?.sessionDuration || '5'} min</span>
            </div>
            <div className="bg-white/20 rounded-lg px-4 py-2">
              <span className="text-white text-xs block">Provider</span>
              <span className="text-white text-sm font-bold">{waitingRoom?.provider || 'Dr. Wang'}</span>
            </div>
          </div>
        </div>
      );
    }

    // In Queue Status (existing)
    if (hasActiveWaitingRoom) {
      return (
        <div 
          onClick={onResumeWaitingRoom}
          style={{ background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #06b6d4 100%)' }}
          className={`rounded-2xl p-5 ${isMobile ? 'mb-6' : ''} cursor-pointer hover:shadow-xl transition-all relative overflow-hidden shadow-lg`}
        >
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                <Users className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
          
          <div className="inline-flex items-center gap-2 mb-3 rounded-full px-3 py-1.5" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}>
            <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
            <span className="text-white text-sm font-semibold">You're in the queue!</span>
          </div>
          
          <h2 className="text-white text-2xl font-bold mb-3">e-Waiting Room</h2>
          
          <div className="flex items-center gap-3 mb-3">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <span style={{ color: '#0d9488' }} className="text-xs font-medium block">Position</span>
              <span style={{ color: '#115e59' }} className="text-xl font-bold">#{waitingRoom.position || 2}</span>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <span style={{ color: '#0d9488' }} className="text-xs font-medium block">Est. wait</span>
              <span style={{ color: '#115e59' }} className="text-xl font-bold">{waitingRoom.estimatedWait || 10} min</span>
            </div>
          </div>
          
          <p className="text-white text-sm mb-4 font-medium" style={{ opacity: 0.95 }}>
            📍 {waitingRoom.kiosk?.name || waitingRoom.appointment?.location || 'ExtendiHealth Kiosk'}
          </p>
          
          <div className="rounded-xl py-2.5 px-4 inline-flex items-center gap-2" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}>
            <span className="text-white font-semibold text-sm">Tap to view queue status</span>
            <ChevronRight className="w-4 h-4 text-white" />
          </div>
        </div>
      );
    }

    return null;
  };

  // ============================================================================
  // APPOINTMENT QUEUE CARD - Shows queue join options
  // ============================================================================
  const AppointmentQueueCard = ({ isMobile = false }) => {
    // If there's an active visit, show status card instead
    if (hasActiveVisit) {
      return <VisitStatusCard isMobile={isMobile} />;
    }

    if (nextAppointment) {
      const windowStatus = getQueueWindowStatus(nextAppointment);
      
      // Queue window not open yet - show countdown
      if (windowStatus.status === 'early') {
        return (
          <div 
            style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #b45309 100%)' }}
            className={`rounded-2xl p-5 ${isMobile ? 'mb-6' : ''} relative overflow-hidden shadow-lg`}
          >
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <Lock className="w-8 h-8 text-white" />
            </div>
            
            <div className="inline-flex items-center gap-2 mb-2 rounded-full px-3 py-1" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}>
              <Timer className="w-4 h-4 text-white" />
              <span className="text-white text-sm font-semibold">Queue Opens Soon</span>
            </div>
            
            <h2 className="text-white text-xl font-bold mb-1">e-Waiting Room</h2>
            <p className="text-white/90 text-sm mb-3">
              {formatAppointmentDate(nextAppointment.date)} at {nextAppointment.time}
            </p>
            
            <div className="bg-white rounded-xl p-3 mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-800 text-xs font-medium">Queue opens in</p>
                  <p className="text-amber-900 text-2xl font-bold">{formatCountdown(windowStatus.minutesUntilOpen)}</p>
                </div>
                <div className="text-right">
                  <p className="text-amber-700 text-xs">Opens at</p>
                  <p className="text-amber-800 font-semibold">{formatTime(windowStatus.windowOpenTime)}</p>
                </div>
              </div>
            </div>
            
            {!reminderSet ? (
              <button 
                onClick={(e) => { e.stopPropagation(); setReminderSet(true); }}
                className="w-full rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}
              >
                <BellRing className="w-4 h-4 text-white" />
                <span className="text-white font-semibold text-sm">Notify Me When Queue Opens</span>
              </button>
            ) : (
              <div className="w-full rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 bg-white/30">
                <CheckCircle className="w-4 h-4 text-white" />
                <span className="text-white font-semibold text-sm">Reminder Set!</span>
              </div>
            )}
          </div>
        );
      }
      
      // Queue window is open - show join card
      if (windowStatus.status === 'open' || windowStatus.status === 'grace') {
        return (
          <div 
            onClick={onJoinWaitingRoom}
            style={{ background: 'linear-gradient(135deg, #f97316 0%, #f43f5e 50%, #ec4899 100%)' }}
            className={`rounded-2xl p-5 ${isMobile ? 'mb-6' : ''} cursor-pointer hover:shadow-xl transition-all relative overflow-hidden shadow-lg`}
          >
            <div className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
              <Clock className="w-8 h-8 text-white" />
            </div>
            
            {windowStatus.status === 'grace' ? (
              <div className="inline-flex items-center gap-2 mb-2 rounded-full px-3 py-1 bg-red-500/50">
                <Timer className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-semibold">Grace Period - Join Now!</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 mb-2 rounded-full px-3 py-1" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}>
                <Unlock className="w-4 h-4 text-white" />
                <span className="text-white text-sm font-semibold">Queue Open!</span>
              </div>
            )}
            
            <h2 className="text-white text-2xl font-bold mb-2">Join e-Waiting Room</h2>
            <p className="text-white text-sm mb-3 font-medium" style={{ opacity: 0.95 }}>Your appointment is coming up!</p>
            
            <div className="inline-flex items-center gap-2 bg-white rounded-lg px-3 py-2 mb-4 shadow-sm">
              <Calendar className="w-4 h-4" style={{ color: '#f97316' }} />
              <span style={{ color: '#c2410c' }} className="font-bold text-sm">
                {formatAppointmentDate(nextAppointment.date)} at {nextAppointment.time}
              </span>
            </div>
            
            <div className="rounded-xl py-2.5 px-4 inline-flex items-center gap-2" style={{ backgroundColor: 'rgba(255,255,255,0.25)' }}>
              <span className="text-white font-semibold text-sm">Tap to join the queue</span>
              <ChevronRight className="w-4 h-4 text-white" />
            </div>
          </div>
        );
      }
      
      // Appointment time passed
      if (windowStatus.status === 'late') {
        return (
          <div 
            style={{ background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' }}
            className={`rounded-2xl p-5 ${isMobile ? 'mb-6' : ''} relative overflow-hidden shadow-lg`}
          >
            <h2 className="text-white text-xl font-bold mb-2">Appointment Time Passed</h2>
            <p className="text-white/90 text-sm mb-4">
              Your {nextAppointment.type} appointment time has passed. Please contact the kiosk or reschedule.
            </p>
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  // Call kiosk phone number
                  const kiosk = nextAppointment.kiosk || { phone: '(416) 555-0123' };
                  window.location.href = `tel:${kiosk.phone?.replace(/[^0-9]/g, '')}`;
                }}
                className="flex-1 py-2 px-4 bg-white/20 rounded-xl text-white font-medium text-sm hover:bg-white/30 transition-colors"
              >
                Call Kiosk
              </button>
              <button 
                onClick={() => onNavigate('kiosks')}
                className="flex-1 py-2 px-4 bg-white rounded-xl text-red-700 font-medium text-sm hover:bg-white/90 transition-colors"
              >
                Reschedule
              </button>
            </div>
          </div>
        );
      }
    }

    return null;
  };

  return (
    <div className={`${isDesktop ? 'p-6 lg:p-8' : 'pb-24'}`}>
      <div className={`${isDesktop ? 'max-w-7xl mx-auto' : ''}`}>
        {/* Welcome Header */}
        <div className={`${isDesktop ? 'mb-8' : 'bg-gradient-to-r from-cyan-500 to-teal-500 px-5 pt-6 pb-6'}`}>
          {isDesktop ? (
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Welcome back, {user?.name?.split(' ')[0] || 'User'}
                </h1>
                <p className="text-gray-500 mt-1">How can we help you today?</p>
              </div>
              <div className="flex gap-3">
                <Button onClick={onGetCareNow} size="lg">
                  <Heart className="w-5 h-5" />
                  Get Care Now
                </Button>
                <Button onClick={onBookAppointment} variant="secondary" size="lg">
                  <Calendar className="w-5 h-5" />
                  Book Appointment
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start mb-5">
                <div>
                  <p className="text-cyan-100 text-sm">Hello, {user?.name?.split(' ')[0] || 'User'}</p>
                  <h1 className="text-white text-2xl font-bold">How can we help you today?</h1>
                </div>
                <div className="flex gap-2">
                  <button onClick={onNotifications} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors relative">
                    <Bell className="w-5 h-5 text-white" />
                    <div className="absolute top-0 right-0 w-2.5 h-2.5 bg-orange-400 rounded-full border-2 border-cyan-500" />
                  </button>
                  <button onClick={onSettings} className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors">
                    <Settings className="w-5 h-5 text-white" />
                  </button>
                </div>
              </div>

              <div className="bg-cyan-400/50 rounded-2xl p-1">
                <button onClick={onGetCareNow} className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-colors">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Get care now</span>
                </button>
                <div className="border-t border-cyan-300/30 mx-4" />
                <button onClick={onBookAppointment} className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-colors">
                  <Calendar className="w-5 h-5" />
                  <span className="font-medium">Book Kiosk Appointment</span>
                </button>
                <div className="border-t border-cyan-300/30 mx-4" />
                <button onClick={onFindKiosk} className="w-full flex items-center gap-3 px-4 py-3 text-white hover:bg-white/10 rounded-xl transition-colors">
                  <MapPin className="w-5 h-5" />
                  <span className="font-medium">Find Nearby Kiosk</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* Desktop Grid Layout */}
        {isDesktop ? (
          <div className={`grid gap-6 ${isLargeDesktop ? 'grid-cols-3' : 'grid-cols-2'}`}>
            
            {/* ER or Kiosk? - Featured Card */}
            <div className="col-span-full">
              <Card 
                onClick={() => onNavigate('erOrKiosk')}
                className="overflow-hidden cursor-pointer hover:shadow-xl transition-all border-2 border-teal-200 bg-gradient-to-r from-teal-50 via-cyan-50 to-blue-50"
              >
                <div className="p-5">
                  <div className="flex items-center gap-5">
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
                      style={{ background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)' }}
                    >
                      <HelpCircle className="w-8 h-8" style={{ color: 'white' }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h2 className="text-xl font-bold text-gray-900">Not sure? ER or Kiosk?</h2>
                        <span 
                          className="px-2 py-0.5 text-white text-xs font-bold rounded-full flex items-center gap-1"
                          style={{ background: 'linear-gradient(90deg, #14b8a6 0%, #06b6d4 100%)' }}
                        >
                          <Sparkles className="w-3 h-3" />
                          AI-Powered
                        </span>
                      </div>
                      <p className="text-gray-600">
                        Let our AI help you decide the best care option. Skip the wait and get seen faster.
                      </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-6">
                      <div className="text-center px-4 py-2 bg-white/60 rounded-xl">
                        <Building className="w-5 h-5 text-gray-400 mx-auto mb-1" />
                        <p className="text-xs text-gray-500">ER Average</p>
                        <p className="font-bold text-gray-700">4-6 hour wait</p>
                      </div>
                      <div className="text-center px-4 py-2 bg-white rounded-xl border-2 border-teal-300">
                        <Stethoscope className="w-5 h-5 text-teal-500 mx-auto mb-1" />
                        <p className="text-xs text-teal-600">Kiosk</p>
                        <p className="font-bold text-teal-700">~15 min wait</p>
                      </div>
                    </div>
                    <ArrowRight className="w-6 h-6 text-teal-500 flex-shrink-0" />
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Visit Status or Queue Card - Desktop */}
            {(hasActiveVisit || nextAppointment) && (
              <div className="col-span-full">
                <AppointmentQueueCard />
              </div>
            )}

            {/* Upcoming Appointment - Only show if not in active visit */}
            {nextAppointment && !hasActiveVisit && (
              <Card className="p-6 col-span-1">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-gray-900">Next Appointment</h3>
                  <Badge variant={nextAppointment.status === 'Pending' ? 'warning' : 'info'}>
                    {nextAppointment.status}
                  </Badge>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="font-semibold text-gray-900">{nextAppointment.type}</p>
                    <p className="text-sm text-gray-500">{nextAppointment.doctor}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{formatAppointmentDate(nextAppointment.date)} at {nextAppointment.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{nextAppointment.location}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                  <Button size="sm" onClick={onJoinWaitingRoom} className="flex-1">
                    Join Waiting Room
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => onNavigate('appointments')}>Details</Button>
                </div>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { icon: Clock, label: 'e-Waiting Room', action: hasActiveVisit ? onResumeWaitingRoom : () => onNavigate('eWaitingRoom'), color: 'text-cyan-500 bg-cyan-50', badge: hasActiveVisit ? (isCheckedIn ? 'Checked In' : isInSession ? 'In Session' : 'Active') : null },
                  { icon: Stethoscope, label: 'Find Family Doctor', action: () => onNavigate('findFamilyDoctor'), color: 'text-rose-500 bg-rose-50' },
                  { icon: FileText, label: 'Visit Summary', action: () => onNavigate('postVisitSummary'), color: 'text-emerald-500 bg-emerald-50', badge: 'New' },
                  { icon: MessageSquare, label: 'Messages', action: () => onNavigate('messages'), color: 'text-indigo-500 bg-indigo-50', badge: '2', badgeColor: 'bg-red-500' },
                  { icon: Pill, label: 'Pharmacy', action: () => onNavigate('pharmacy'), color: 'text-green-500 bg-green-50' },
                  { icon: FlaskConical, label: 'Lab Results', action: () => onNavigate('labResults'), color: 'text-purple-500 bg-purple-50' },
                  { icon: Calendar, label: 'Appointments', action: () => onNavigate('appointments'), color: 'text-teal-500 bg-teal-50' },
                  { icon: Users, label: 'Family Access', action: () => onNavigate('familyAccess'), color: 'text-pink-500 bg-pink-50' },
                  { icon: CreditCard, label: 'Billing', action: () => onNavigate('billing'), color: 'text-amber-500 bg-amber-50' },
                ].map(({ icon: Icon, label, action, color, badge, badgeColor }) => (
                  <button
                    key={label}
                    onClick={action}
                    className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-gray-50 transition-colors relative"
                  >
                    {badge && (
                      <span className={`absolute top-1 right-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center text-white text-xs rounded-full font-medium ${
                        badgeColor ? badgeColor : badge === 'Checked In' ? 'bg-green-500' : badge === 'In Session' ? 'bg-blue-500' : 'bg-cyan-500'
                      }`}>
                        {badge}
                      </span>
                    )}
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium text-gray-700 text-center">{label}</span>
                  </button>
                ))}
              </div>
            </Card>

            {/* Active Prescriptions */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Active Prescriptions</h3>
                <button onClick={() => onNavigate('pharmacy')} className="text-cyan-600 text-sm font-medium">View All</button>
              </div>
              {activePrescriptions.length > 0 ? (
                <div className="space-y-3">
                  {activePrescriptions.slice(0, 3).map((rx) => (
                    <div key={rx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <p className="font-medium text-gray-900">{rx.name}</p>
                        <p className="text-sm text-gray-500">{rx.dosage} • {rx.frequency}</p>
                      </div>
                      <Badge variant="success">{rx.refillsRemaining} refills</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No active prescriptions</p>
              )}
            </Card>

            {/* Lab Results */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Recent Lab Results</h3>
                <button onClick={() => onNavigate('labResults')} className="text-cyan-600 text-sm font-medium">View All</button>
              </div>
              {recentLabResults > 0 ? (
                <div className="space-y-3">
                  {labResults.slice(0, 3).map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <FlaskConical className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="font-medium text-gray-900">{result.name}</p>
                          <p className="text-sm text-gray-500">{result.date}</p>
                        </div>
                      </div>
                      <Badge variant={result.status === 'Normal' ? 'success' : 'warning'}>{result.status}</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">No recent lab results</p>
              )}
            </Card>

            {/* Recent Messages */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Recent Messages</h3>
                <button onClick={() => onNavigate('messages')} className="text-cyan-600 text-sm font-medium">View All</button>
              </div>
              <div className="space-y-3">
                {[
                  { id: 'm1', from: 'Dr. Michelle Chen', preview: 'I reviewed your recent lab results. Everything looks good!', time: '2h ago', unread: true },
                  { id: 'm2', from: 'Nurse Sarah', preview: 'Your prescription refill has been sent to the pharmacy.', time: '1d ago', unread: false },
                ].map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => onNavigate('messages')}
                    className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-colors ${msg.unread ? 'bg-indigo-50 hover:bg-indigo-100' : 'bg-gray-50 hover:bg-gray-100'}`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-semibold text-sm">
                        {msg.from.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className={`font-medium text-gray-900 truncate ${msg.unread ? 'font-semibold' : ''}`}>{msg.from}</p>
                        <span className="text-xs text-gray-400 flex-shrink-0">{msg.time}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{msg.preview}</p>
                    </div>
                    {msg.unread && <span className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0 mt-2" />}
                  </button>
                ))}
              </div>
            </Card>

            {/* Find Kiosk */}
            <Card className="p-6 bg-gradient-to-br from-cyan-500 to-teal-600 text-white">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Find a Kiosk</h3>
                  <p className="text-cyan-100 text-sm">{KIOSKS.filter(k => k.isOpen).length} kiosks open nearby</p>
                </div>
              </div>
              <button 
                onClick={onFindKiosk}
                className="w-full py-3 bg-white/20 rounded-xl font-semibold hover:bg-white/30 transition-colors flex items-center justify-center gap-2"
              >
                <Navigation className="w-4 h-4" />
                Find Nearest Kiosk
              </button>
            </Card>
          </div>
        ) : (
          /* Mobile Layout */
          <div className="px-4 pt-4">
            {/* Visit Status or Queue Banner - Mobile */}
            <AppointmentQueueCard isMobile />

            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Your Health Journey</h2>

            {/* Appointment Card - Only show if not in active visit */}
            {nextAppointment && !hasActiveVisit && (
              <Card className="mb-4 p-4">
                <h3 className="font-bold text-gray-900 mb-1">Upcoming Appointment</h3>
                <p className="text-gray-500 text-sm mb-4">{nextAppointment.reason || nextAppointment.type}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Date, Time</p>
                    <p className="font-semibold text-gray-900">
                      {formatAppointmentDate(nextAppointment.date)} at {nextAppointment.time}
                    </p>
                  </div>
                  <Button variant="secondary" size="sm">Reschedule</Button>
                </div>
                
                <button onClick={() => onNavigate('appointments')} className="text-cyan-600 font-medium text-sm">
                  View Details
                </button>
              </Card>
            )}

            {/* Prescriptions Card */}
            {activePrescriptions.length > 0 && (
              <Card className="mb-4 p-4">
                <h3 className="font-bold text-gray-900 mb-1">Your Prescriptions</h3>
                <p className="text-gray-500 text-sm mb-4">{activePrescriptions.length} active prescriptions</p>
                
                <div className="space-y-3">
                  {activePrescriptions.slice(0, 2).map((rx) => (
                    <div key={rx.id} className="bg-gray-50 rounded-xl p-3">
                      <h4 className="font-semibold text-gray-900">{rx.name}</h4>
                      <p className="text-sm text-gray-500">{rx.dosage} - {rx.frequency}</p>
                      <p className="text-xs text-gray-400">{rx.refillsRemaining} refills remaining</p>
                    </div>
                  ))}
                </div>
                
                {activePrescriptions.length > 2 && (
                  <p className="text-gray-400 text-sm mt-2">+{activePrescriptions.length - 2} more</p>
                )}
                
                <button onClick={() => onNavigate('pharmacy')} className="text-cyan-600 font-medium text-sm mt-3">
                  View Details
                </button>
              </Card>
            )}

            {/* Lab Results Card */}
            {recentLabResults > 0 && (
              <Card className="mb-4 p-4">
                <h3 className="font-bold text-gray-900 mb-1">Lab Results</h3>
                <p className="text-gray-500 text-sm mb-3">{recentLabResults} results available</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FlaskConical className="w-5 h-5 text-purple-500" />
                    <span className="text-sm text-gray-600">Latest: {labResults[0]?.name}</span>
                  </div>
                  <button onClick={() => onNavigate('labResults')} className="text-cyan-600 font-medium text-sm">
                    View All
                  </button>
                </div>
              </Card>
            )}

            {/* Find Kiosk Card - Mobile */}
            <Card className="mb-4 overflow-hidden">
              <div className="bg-gradient-to-r from-cyan-500 to-teal-600 p-4 text-white relative">
                <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">Find a Kiosk</h3>
                    <p className="text-cyan-100 text-sm">{KIOSKS.filter(k => k.isOpen).length} kiosks open nearby</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-white/70" />
                </div>
              </div>
              <button 
                onClick={onFindKiosk}
                className="w-full p-3 flex items-center justify-center gap-2 text-cyan-600 font-semibold hover:bg-cyan-50 transition-colors"
              >
                <Navigation className="w-4 h-4" />
                Find Nearest Kiosk
              </button>
            </Card>

            {/* ER or Kiosk? - Mobile Featured */}
            <Card 
              onClick={() => onNavigate('erOrKiosk')}
              className="mb-4 overflow-hidden cursor-pointer border-2 border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50"
            >
              <div className="p-4">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)' }}
                  >
                    <HelpCircle className="w-6 h-6" style={{ color: 'white' }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-gray-900">ER or Kiosk?</h3>
                      <span 
                        className="px-1.5 py-0.5 text-white text-[10px] font-bold rounded-full"
                        style={{ backgroundColor: '#14b8a6' }}
                      >
                        NEW
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm">AI helps you decide where to go</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-teal-500" />
                </div>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="bg-white/60 rounded-lg p-2 text-center">
                    <p className="text-[10px] text-gray-500">ER Average</p>
                    <p className="text-xs font-bold text-gray-700">4-6 hour wait</p>
                  </div>
                  <div className="bg-white rounded-lg p-2 text-center border border-teal-200">
                    <p className="text-[10px] text-teal-600">Kiosk</p>
                    <p className="text-xs font-bold text-teal-700">~15 min wait</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 mt-6">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { icon: HelpCircle, label: 'ER or Kiosk?', action: () => onNavigate('erOrKiosk'), highlight: true },
                { icon: Stethoscope, label: 'Find a Family Doctor', action: () => onNavigate('findFamilyDoctor') },
                { icon: FileText, label: 'Visit Summary', action: () => onNavigate('postVisitSummary'), badge: 'New', badgeColor: 'bg-emerald-500' },
                { icon: MessageSquare, label: 'Messages', action: () => onNavigate('messages'), badge: 2 },
                { icon: Pill, label: 'My Pharmacy', action: () => onNavigate('pharmacy') },
                { icon: Calendar, label: 'My Appointments', action: () => onNavigate('appointments') },
                { icon: FlaskConical, label: 'Lab Results', action: () => onNavigate('labResults') },
                { icon: FileHeart, label: 'Health Records', action: () => onNavigate('healthRecords') },
                { icon: Users, label: 'Family Access', action: () => onNavigate('familyAccess') },
                { icon: CreditCard, label: 'Billing & Insurance', action: () => onNavigate('billing') },
              ].map(({ icon: Icon, label, action, badge, badgeColor, highlight }) => (
                <Card key={label} onClick={action} className={highlight ? 'border-2 border-teal-200 bg-teal-50' : ''}>
                  <div className="flex items-center gap-4 p-4">
                    <Icon className={`w-5 h-5 ${highlight ? 'text-teal-600' : 'text-cyan-600'}`} />
                    <span className={`font-medium flex-1 ${highlight ? 'text-teal-700' : 'text-gray-800'}`}>{label}</span>
                    {badge && (
                      <span className={`min-w-[20px] h-5 px-1.5 flex items-center justify-center text-white text-xs rounded-full font-medium ${badgeColor || 'bg-red-500'}`}>
                        {badge}
                      </span>
                    )}
                    <ChevronRight className="w-5 h-5 text-gray-300" />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
