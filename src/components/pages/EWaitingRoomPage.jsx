import React, { useState, useEffect } from 'react';
import { 
  Clock, MapPin, Users, Bell, CheckCircle, AlertCircle, ChevronRight, 
  Phone, Video, RefreshCw, Info, Navigation, Check, Car, FileText,
  Stethoscope, Activity, AlertTriangle, Shield, Loader, Timer, Calendar,
  BellRing, Lock, Unlock, QrCode, Download, Share2
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Button, Card, Badge } from '../ui';
import { KIOSKS } from '../../data/constants';

// ============================================================================
// QUEUE THRESHOLD CONFIGURATION
// ============================================================================
const QUEUE_THRESHOLDS = {
  standard: 45,      // minutes before appointment
  urgent: 60,        // urgent/high priority cases
  elevated: 50,      // elevated priority
  virtual: 15,       // virtual visits - no travel needed
  walkIn: 0,         // walk-ins can join immediately
  gracePeriod: 15,   // minutes after appointment time still allowed
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
const parseAppointmentDateTime = (dateStr, timeStr) => {
  // Parse date like "2025-12-26" and time like "10:30 AM"
  const date = new Date(dateStr);
  
  // Parse time
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
  
  // Determine threshold based on visit type and priority
  let threshold = QUEUE_THRESHOLDS.standard;
  
  if (appointment.visitType === 'Virtual') {
    threshold = QUEUE_THRESHOLDS.virtual;
  } else if (appointment.visitType === 'Walk-in' || appointment.isWalkIn) {
    threshold = QUEUE_THRESHOLDS.walkIn;
  } else if (aiPriority === 'emergency' || aiPriority === 'high') {
    threshold = QUEUE_THRESHOLDS.urgent;
  } else if (aiPriority === 'elevated') {
    threshold = QUEUE_THRESHOLDS.elevated;
  }

  // Calculate window open time
  const windowOpenTime = new Date(appointmentTime.getTime() - threshold * 60 * 1000);
  const windowCloseTime = new Date(appointmentTime.getTime() + QUEUE_THRESHOLDS.gracePeriod * 60 * 1000);
  
  // Check status
  const minutesUntilOpen = Math.ceil((windowOpenTime - now) / (60 * 1000));
  const minutesUntilAppointment = Math.ceil((appointmentTime - now) / (60 * 1000));
  const minutesPastAppointment = Math.ceil((now - appointmentTime) / (60 * 1000));

  if (now < windowOpenTime) {
    // Too early
    return {
      canJoin: false,
      status: 'early',
      minutesUntilOpen,
      windowOpenTime,
      threshold,
      message: `Queue opens ${minutesUntilOpen} min before your appointment`,
      appointmentTime,
    };
  } else if (now > windowCloseTime) {
    // Too late - past grace period
    return {
      canJoin: false,
      status: 'late',
      minutesPastAppointment,
      message: 'Your appointment window has passed',
      appointmentTime,
    };
  } else if (now > appointmentTime) {
    // In grace period
    return {
      canJoin: true,
      status: 'grace',
      minutesPastAppointment,
      gracePeriodRemaining: QUEUE_THRESHOLDS.gracePeriod - minutesPastAppointment,
      message: 'Grace period - join now!',
      appointmentTime,
    };
  } else {
    // Window is open
    return {
      canJoin: true,
      status: 'open',
      minutesUntilAppointment,
      message: 'Queue is open',
      appointmentTime,
    };
  }
};

const formatTime = (date) => {
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

const formatCountdown = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================
const EWaitingRoomPage = ({ 
  waitingRoom, 
  onUpdateWaitingRoom, 
  appointments, 
  bookingFlow,
  onBack, 
  onLeaveQueue,
  onCheckIn,
  onBackToHome 
}) => {
  const { isDesktop } = useResponsive();
  
  // Determine initial state based on waitingRoom status
  const getInitialCheckInState = () => {
    if (waitingRoom?.status === 'checked-in') return 'checked';
    if (waitingRoom?.status === 'in-session') return 'in-session';
    return 'waiting';
  };
  
  const getInitialActiveWaiting = () => {
    // Only show queue UI if status is 'waiting'
    return waitingRoom?.status === 'waiting';
  };

  const [activeWaiting, setActiveWaiting] = useState(() => getInitialActiveWaiting());
  const [travelTime, setTravelTime] = useState(null);
  const [travelStatus, setTravelStatus] = useState('calculating');
  const [checkInState, setCheckInState] = useState(() => getInitialCheckInState());
  const [showPreDiagnosis, setShowPreDiagnosis] = useState(false);
  const [liveUpdate, setLiveUpdate] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notificationSet, setNotificationSet] = useState({});

  // Sync state with waitingRoom.status when component receives new props
  useEffect(() => {
    const status = waitingRoom?.status;
    if (status === 'checked-in') {
      setCheckInState('checked');
      setActiveWaiting(false);
    } else if (status === 'in-session') {
      setCheckInState('in-session');
      setActiveWaiting(false);
    } else if (status === 'waiting') {
      setCheckInState('waiting');
      setActiveWaiting(true);
    } else {
      // No active visit
      setCheckInState('waiting');
      setActiveWaiting(false);
    }
  }, [waitingRoom?.status]);

  // Update current time every minute for countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  // Get current queue data
  const queuePosition = waitingRoom?.position || waitingRoom?.queuePosition || 1;
  const estimatedWait = waitingRoom?.estimatedWait || 5;
  const kioskInfo = waitingRoom?.kiosk || bookingFlow?.kiosk || KIOSKS[2];

  // Get AI priority from booking flow
  const aiPriority = bookingFlow?.aiAssessment?.priority || 'standard';

  // Generate pre-diagnosis summary
  const generatePreDiagnosisSummary = () => {
    const symptoms = bookingFlow?.symptomsData?.primarySymptom || 
                     bookingFlow?.getCareData?.symptoms || 
                     waitingRoom?.appointment?.reason ||
                     'Heart murmur detected during physical exam';
    
    const aiAssessment = bookingFlow?.aiAssessment;
    
    return {
      symptoms,
      possibleConditions: aiAssessment?.possibleConditions || [
        'Common cold or upper respiratory infection',
        'Seasonal allergies',
        'Viral syndrome'
      ],
      recommendation: aiAssessment?.recommendations?.[0] || 
        'These symptoms typically resolve within 7-10 days with rest and supportive care.',
      priority: aiAssessment?.priority || 'standard',
      vitalsToCheck: aiAssessment?.vitalsNeeded || ['Blood Pressure', 'Heart Rate', 'Temperature', 'Oxygen Saturation'],
    };
  };

  const preDiagnosis = generatePreDiagnosisSummary();

  // Travel time calculation
  useEffect(() => {
    const calculateTravelTime = () => {
      const baseTravelTime = Math.floor(Math.random() * 8) + 3;
      setTravelTime(baseTravelTime);
      
      const timeUntilTurn = estimatedWait;
      if (baseTravelTime > timeUntilTurn) {
        setTravelStatus('warning');
        setLiveUpdate({
          type: 'warning',
          message: "You're almost next! Please start heading to the kiosk."
        });
      } else if (baseTravelTime > timeUntilTurn - 2) {
        setTravelStatus('ready');
        setLiveUpdate({
          type: 'info',
          message: "Good timing! You should start heading to the kiosk soon."
        });
      } else {
        setTravelStatus('ready');
      }
    };

    if (activeWaiting) {
      setTimeout(calculateTravelTime, 1500);
      const interval = setInterval(calculateTravelTime, 60000);
      return () => clearInterval(interval);
    }
  }, [activeWaiting, estimatedWait]);

  // Queue updates
  useEffect(() => {
    if (activeWaiting && queuePosition > 0) {
      const updateInterval = setInterval(() => {
        if (queuePosition === 1) {
          setLiveUpdate({
            type: 'success',
            message: "You're next! Please proceed to the kiosk now."
          });
          setCheckInState('arriving');
        } else if (queuePosition === 2) {
          setLiveUpdate({
            type: 'warning', 
            message: "You're almost next! Please start heading to the kiosk."
          });
        }
      }, 10000);
      
      return () => clearInterval(updateInterval);
    }
  }, [activeWaiting, queuePosition]);

  const upcomingAppointments = appointments?.filter(a => 
    a.status === 'Confirmed' || a.status === 'Scheduled'
  ) || [];

  const handleJoinQueue = (appointment) => {
    const windowStatus = getQueueWindowStatus(appointment, aiPriority);
    
    if (!windowStatus.canJoin) {
      return; // Should not happen as button is disabled
    }

    const kiosk = KIOSKS.find(k => k.name === appointment.location) || KIOSKS[2];
    onUpdateWaitingRoom({
      isActive: true,
      status: 'waiting',
      position: Math.floor(Math.random() * 3) + 1,
      queuePosition: Math.floor(Math.random() * 3) + 1,
      estimatedWait: Math.floor(Math.random() * 15) + 5,
      kiosk: kiosk,
      joinedAt: new Date().toISOString(),
      appointmentType: appointment.type,
      appointmentId: appointment.id,
      appointment: appointment,
      reason: appointment.reason,
    });
    setActiveWaiting(true);
  };

  const handleLeaveQueue = () => {
    onUpdateWaitingRoom({
      isActive: false,
      status: null,
      position: null,
      queuePosition: null,
      estimatedWait: null,
      kiosk: null,
      joinedAt: null,
    });
    setActiveWaiting(false);
    if (onLeaveQueue) onLeaveQueue();
  };

  const handleCheckIn = () => {
    setCheckInState('checking');
    const checkInNum = generateCheckInNumber();
    
    setTimeout(() => {
      setCheckInState('checked');
      setActiveWaiting(false); // Stop showing queue UI
      // Update waitingRoom status to 'checked-in' - this persists the state
      onUpdateWaitingRoom(prev => ({
        ...prev,
        status: 'checked-in',
        isActive: false, // Clear isActive flag
        checkInNumber: checkInNum,
        checkedInAt: new Date().toISOString(),
      }));
      if (onCheckIn) onCheckIn(checkInNum);
    }, 2000);
  };

  // Handle back to home - keeps the checked-in status
  const handleBackToHome = () => {
    if (onBackToHome) {
      onBackToHome();
    } else if (onBack) {
      onBack();
    }
  };

  const handleSetReminder = (appointmentId) => {
    setNotificationSet(prev => ({ ...prev, [appointmentId]: true }));
    // In production, this would schedule a push notification
  };

  // Generate confirmation/check-in number - use stored one if available
  const generateCheckInNumber = () => {
    // First check if we have a stored check-in number (from previous check-in)
    if (waitingRoom?.checkInNumber) {
      return waitingRoom.checkInNumber;
    }
    const appointment = waitingRoom?.appointment;
    return appointment?.confirmationNumber || 
           waitingRoom?.appointmentId || 
           'CHK-' + Date.now().toString(36).toUpperCase().slice(-6);
  };

  // Generate QR code data for kiosk check-in
  const generateQRData = () => {
    const checkInNumber = generateCheckInNumber();
    const qrData = {
      type: 'EXTENDIHEALTH_CHECKIN',
      checkInNumber: checkInNumber,
      appointmentId: waitingRoom?.appointmentId,
      kiosk: kioskInfo?.name,
      timestamp: new Date().toISOString(),
      patientCheckedIn: true,
    };
    return JSON.stringify(qrData);
  };

  const checkInNumber = generateCheckInNumber();

  // Check-in confirmation screen with QR Code
  if (checkInState === 'checked') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="e-Waiting Room" onBack={onBack} />
        <div className="p-4 pb-24">
          <div className="flex flex-col items-center text-center">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">You're Checked In!</h2>
            <p className="text-gray-500 text-center mb-6">
              Please proceed to the kiosk. A healthcare provider will be with you shortly.
            </p>

            {/* QR Code Card */}
            <Card className="p-6 w-full max-w-sm mb-4 bg-white border-2 border-green-100">
              <div className="flex flex-col items-center">
                {/* QR Code */}
                <div className="bg-white p-3 rounded-2xl shadow-inner border border-gray-100 mb-4">
                  <QRCodeSVG 
                    value={generateQRData()}
                    size={160}
                    level="H"
                    includeMargin={true}
                    bgColor="#ffffff"
                    fgColor="#059669"
                  />
                </div>
                
                {/* Check-in Number */}
                <div className="text-center mb-3">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Check-In #</p>
                  <p className="text-2xl font-bold text-green-700 font-mono tracking-wider">{checkInNumber}</p>
                </div>

                {/* Scan Instructions */}
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-green-50 px-4 py-2 rounded-full">
                  <QrCode className="w-4 h-4 text-green-600" />
                  <span>Show this at the kiosk</span>
                </div>
              </div>
            </Card>

            {/* Location Card */}
            <Card className="p-4 w-full max-w-sm mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-cyan-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{kioskInfo?.name}</p>
                  <p className="text-sm text-gray-500">{kioskInfo?.address}</p>
                </div>
              </div>
            </Card>

            {/* Status Card */}
            <Card className="p-4 w-full max-w-sm mb-6 bg-green-50 border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <div className="text-left">
                  <p className="font-medium text-green-800">Ready for Your Visit</p>
                  <p className="text-sm text-green-600">A provider will call you shortly</p>
                </div>
              </div>
            </Card>

            {/* Save/Share Buttons */}
            <div className="flex gap-3 w-full max-w-sm mb-4">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 rounded-xl text-gray-700 font-medium hover:bg-gray-200 transition-colors">
                <Download className="w-4 h-4" />
                Save
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 rounded-xl text-gray-700 font-medium hover:bg-gray-200 transition-colors">
                <Share2 className="w-4 h-4" />
                Share
              </button>
            </div>

            <Button onClick={handleBackToHome} className="w-full max-w-sm">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Checking in screen
  if (checkInState === 'checking') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="e-Waiting Room" onBack={onBack} />
        <div className="p-4 flex flex-col items-center justify-center min-h-[70vh]">
          <Loader className="w-12 h-12 text-cyan-600 animate-spin mb-6" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Checking You In...</h2>
          <p className="text-gray-500">Please wait a moment</p>
        </div>
      </div>
    );
  }

  // In-Session screen - consultation is in progress
  if (checkInState === 'in-session') {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="e-Waiting Room" onBack={onBack} />
        <div className="p-4 pb-24">
          <div className="flex flex-col items-center text-center">
            {/* In Session Icon */}
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <Stethoscope className="w-10 h-10 text-blue-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Visit In Progress</h2>
            <p className="text-gray-500 text-center mb-6">
              Your consultation is currently in progress.
            </p>

            {/* Session Info Card */}
            <Card className="p-6 w-full max-w-sm mb-4 bg-blue-50 border-2 border-blue-200">
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                  <span className="text-blue-700 font-semibold">In Session</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full mb-4">
                  <div className="bg-white rounded-xl p-3 text-center">
                    <p className="text-blue-600 text-xs font-medium">Duration</p>
                    <p className="text-blue-900 text-xl font-bold">{waitingRoom?.sessionDuration || '5'} min</p>
                  </div>
                  <div className="bg-white rounded-xl p-3 text-center">
                    <p className="text-blue-600 text-xs font-medium">Provider</p>
                    <p className="text-blue-900 text-sm font-bold">{waitingRoom?.provider || 'Dr. Wang'}</p>
                  </div>
                </div>

                {/* Check-in Number */}
                <div className="text-center">
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Check-In #</p>
                  <p className="text-lg font-bold text-blue-700 font-mono">{checkInNumber}</p>
                </div>
              </div>
            </Card>

            {/* Location Card */}
            <Card className="p-4 w-full max-w-sm mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-gray-900">{kioskInfo?.name}</p>
                  <p className="text-sm text-gray-500">{kioskInfo?.address}</p>
                </div>
              </div>
            </Card>

            <Button onClick={handleBackToHome} className="w-full max-w-sm">
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================================
  // APPOINTMENT CARD WITH THRESHOLD LOGIC
  // ============================================================================
  const AppointmentQueueCard = ({ appointment }) => {
    const windowStatus = getQueueWindowStatus(appointment, aiPriority);
    
    return (
      <Card className={`p-4 ${windowStatus.status === 'late' ? 'border-red-200 bg-red-50' : ''}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{appointment.type}</h3>
            <p className="text-sm text-gray-500">{appointment.doctor}</p>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-3.5 h-3.5 text-gray-400" />
              <p className="text-sm text-gray-600">
                {new Date(appointment.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {appointment.time}
              </p>
            </div>
            <p className="text-xs text-gray-400 mt-1">{appointment.location}</p>
            {appointment.visitType && (
              <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                appointment.visitType === 'Virtual' ? 'bg-purple-100 text-purple-700' : 'bg-cyan-100 text-cyan-700'
              }`}>
                {appointment.visitType}
              </span>
            )}
          </div>
        </div>

        {/* Status-based UI */}
        {windowStatus.status === 'early' && (
          <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Lock className="w-5 h-5 text-amber-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-amber-800 text-sm">Queue Opens Soon</p>
                <p className="text-amber-700 text-xs mt-0.5">
                  You can join at {formatTime(windowStatus.windowOpenTime)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Timer className="w-4 h-4 text-amber-600" />
                  <span className="text-lg font-bold text-amber-800">
                    {formatCountdown(windowStatus.minutesUntilOpen)}
                  </span>
                  <span className="text-amber-600 text-sm">until queue opens</span>
                </div>
              </div>
            </div>
            
            {!notificationSet[appointment.id] ? (
              <button
                onClick={() => handleSetReminder(appointment.id)}
                className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 bg-amber-100 hover:bg-amber-200 rounded-lg text-amber-800 font-medium text-sm transition-colors"
              >
                <BellRing className="w-4 h-4" />
                Notify Me When Queue Opens
              </button>
            ) : (
              <div className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 bg-green-100 rounded-lg text-green-700 font-medium text-sm">
                <CheckCircle className="w-4 h-4" />
                Reminder Set!
              </div>
            )}
          </div>
        )}

        {windowStatus.status === 'open' && (
          <div className="mt-3">
            <div className="flex items-center gap-2 mb-3 p-2 bg-green-50 rounded-lg">
              <Unlock className="w-4 h-4 text-green-600" />
              <span className="text-green-700 text-sm font-medium">Queue is open!</span>
              <span className="text-green-600 text-xs ml-auto">
                {windowStatus.minutesUntilAppointment} min until appointment
              </span>
            </div>
            <Button onClick={() => handleJoinQueue(appointment)} className="w-full">
              Join e-Waiting Room
            </Button>
          </div>
        )}

        {windowStatus.status === 'grace' && (
          <div className="mt-3">
            <div className="flex items-center gap-2 mb-3 p-2 bg-orange-50 rounded-lg border border-orange-200">
              <AlertTriangle className="w-4 h-4 text-orange-600" />
              <span className="text-orange-700 text-sm font-medium">Grace Period</span>
              <span className="text-orange-600 text-xs ml-auto">
                {windowStatus.gracePeriodRemaining} min remaining
              </span>
            </div>
            <Button onClick={() => handleJoinQueue(appointment)} className="w-full" variant="warning">
              Join Now - Don't Miss Your Spot!
            </Button>
          </div>
        )}

        {windowStatus.status === 'late' && (
          <div className="mt-3 p-3 bg-red-100 rounded-xl border border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-800 text-sm">Appointment Window Passed</p>
                <p className="text-red-600 text-xs mt-0.5">
                  Your appointment was {windowStatus.minutesPastAppointment} minutes ago
                </p>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 py-2 px-3 bg-white border border-red-300 rounded-lg text-red-700 font-medium text-sm hover:bg-red-50 transition-colors flex items-center justify-center gap-1">
                <Phone className="w-4 h-4" />
                Call Kiosk
              </button>
              <button className="flex-1 py-2 px-3 bg-white border border-red-300 rounded-lg text-red-700 font-medium text-sm hover:bg-red-50 transition-colors">
                Reschedule
              </button>
            </div>
          </div>
        )}
      </Card>
    );
  };

  const content = (
    <div className="space-y-4">
      {/* Active Queue Status */}
      {activeWaiting && (
        <>
          {/* Position Card */}
          <div 
            style={{ background: 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #06b6d4 100%)' }}
            className="rounded-2xl p-5 text-white shadow-lg"
          >
            <p className="text-white/80 text-xs font-semibold uppercase tracking-wider mb-1">Your Position</p>
            <p className="text-6xl font-bold mb-2">{queuePosition}</p>
            <span className="inline-block bg-white/20 rounded-full px-3 py-1 text-sm font-medium">
              In queue
            </span>
          </div>

          {/* Estimated Wait Card */}
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-semibold text-gray-900">Estimated Wait</p>
                  <p className="text-xs text-gray-500">Based on current queue and consultation time</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-cyan-600">~{estimatedWait}</p>
                <p className="text-sm text-gray-500">min</p>
              </div>
            </div>
          </Card>

          {/* Location Card with Travel Time */}
          <Card className="p-4">
            <div className="flex items-start gap-3 mb-3">
              <MapPin className="w-5 h-5 text-cyan-600 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{kioskInfo?.name}</p>
                <p className="text-sm text-gray-500">{kioskInfo?.address}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-600">Travel Time</span>
              </div>
              <div className="flex items-center gap-2">
                {travelTime ? (
                  <>
                    <span className={`text-lg font-bold ${
                      travelStatus === 'warning' ? 'text-amber-600' : 'text-cyan-600'
                    }`}>~{travelTime} min</span>
                    {travelStatus === 'warning' && (
                      <AlertTriangle className="w-4 h-4 text-amber-500" />
                    )}
                  </>
                ) : (
                  <span className="text-sm text-gray-400">Calculating...</span>
                )}
              </div>
            </div>
          </Card>

          {/* Pre-Check Summary Card */}
          <Card 
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setShowPreDiagnosis(!showPreDiagnosis)}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-cyan-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Pre-Check Summary</p>
                  <p className="text-sm text-gray-600 mt-1">
                    Based on your symptoms of {preDiagnosis.symptoms.toLowerCase()}, you are likely experiencing a common cold or upper respiratory infection. These symptoms typically resolve within 7-10 days with rest and supportive care.
                  </p>
                </div>
              </div>
              <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showPreDiagnosis ? 'rotate-90' : ''}`} />
            </div>
            
            {showPreDiagnosis && (
              <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Possible Conditions</p>
                  <div className="space-y-1">
                    {preDiagnosis.possibleConditions.slice(0, 3).map((condition, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full" />
                        <span className="text-sm text-gray-700">{condition}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Vitals to be Checked</p>
                  <div className="flex flex-wrap gap-2">
                    {preDiagnosis.vitalsToCheck.map((vital, i) => (
                      <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs">
                        {vital}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-3 bg-gray-50 rounded-xl">
                  <p className="text-xs text-gray-500 italic">
                    <Shield className="w-3 h-3 inline mr-1" />
                    This is an AI-powered pre-assessment. A healthcare professional will provide a proper evaluation.
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Live Updates Card */}
          {liveUpdate && (
            <div 
              className={`p-4 rounded-xl flex items-start gap-3 ${
                liveUpdate.type === 'success' ? 'bg-green-50 border border-green-200' :
                liveUpdate.type === 'warning' ? 'bg-amber-50 border border-amber-200' :
                'bg-cyan-50 border border-cyan-200'
              }`}
            >
              <Bell className={`w-5 h-5 mt-0.5 ${
                liveUpdate.type === 'success' ? 'text-green-600' :
                liveUpdate.type === 'warning' ? 'text-amber-600' :
                'text-cyan-600'
              }`} />
              <div>
                <p className={`font-semibold ${
                  liveUpdate.type === 'success' ? 'text-green-800' :
                  liveUpdate.type === 'warning' ? 'text-amber-800' :
                  'text-cyan-800'
                }`}>Live Updates</p>
                <p className={`text-sm ${
                  liveUpdate.type === 'success' ? 'text-green-600' :
                  liveUpdate.type === 'warning' ? 'text-amber-600' :
                  'text-cyan-600'
                }`}>{liveUpdate.message}</p>
              </div>
            </div>
          )}

          {/* Queue Position Indicator */}
          <div className="flex items-center justify-center gap-2 py-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">
              {queuePosition - 1} {queuePosition - 1 === 1 ? 'person' : 'people'} ahead of you
            </span>
          </div>

          {/* Action Buttons */}
          <Button 
            size="lg" 
            onClick={handleCheckIn}
            className="w-full"
            disabled={queuePosition > 2}
          >
            I've Arrived – Check In
          </Button>

          <button 
            onClick={onBackToHome || onBack}
            className="w-full text-center text-cyan-600 font-medium py-3 hover:text-cyan-700"
          >
            Back to Home
          </button>

          <button 
            onClick={handleLeaveQueue}
            className="w-full text-center text-gray-400 text-sm py-2 hover:text-red-500"
          >
            Leave Queue
          </button>
        </>
      )}

      {/* No Active Queue - Show Join Options with Threshold Logic */}
      {!activeWaiting && (
        <>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Join e-Waiting Room</h2>
            <p className="text-gray-500 text-sm mb-4">
              Select an appointment to join the virtual queue. Queue opens 45 minutes before your scheduled time.
            </p>
          </div>

          {/* Priority Info Card */}
          {aiPriority && aiPriority !== 'standard' && (
            <Card className="p-3 bg-cyan-50 border-cyan-200">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-cyan-600" />
                <span className="text-cyan-800 text-sm">
                  <span className="font-semibold">Priority Status:</span> {aiPriority.charAt(0).toUpperCase() + aiPriority.slice(1)} - Extended queue window
                </span>
              </div>
            </Card>
          )}

          {upcomingAppointments.length > 0 ? (
            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <AppointmentQueueCard key={apt.id} appointment={apt} />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="font-semibold text-gray-900 mb-2">No Upcoming Appointments</h3>
              <p className="text-gray-500 text-sm">
                Book an appointment first, then you can join the e-Waiting Room.
              </p>
            </Card>
          )}

          {/* Queue Window Info */}
          <Card className="p-4 bg-gray-50 border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-gray-500" />
              Queue Window Times
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Standard appointments</span>
                <span className="font-medium text-gray-800">45 min before</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Urgent/High priority</span>
                <span className="font-medium text-gray-800">60 min before</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Virtual visits</span>
                <span className="font-medium text-gray-800">15 min before</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Grace period</span>
                <span className="font-medium text-gray-800">15 min after</span>
              </div>
            </div>
          </Card>

          {/* How It Works */}
          <Card className="p-4 bg-cyan-50 border-cyan-100">
            <h3 className="font-semibold text-cyan-800 mb-3">How e-Waiting Room Works</h3>
            <div className="space-y-3">
              {[
                { step: 1, text: 'Queue opens 45 min before your appointment' },
                { step: 2, text: 'Join from anywhere and get position updates' },
                { step: 3, text: 'Travel-aware alerts based on your location' },
                { step: 4, text: 'Check in when you arrive at the kiosk' },
              ].map((item) => (
                <div key={item.step} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-cyan-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {item.step}
                  </div>
                  <span className="text-sm text-cyan-800">{item.text}</span>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">e-Waiting Room</h1>
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="e-Waiting Room" onBack={onBack} />
      <div className="p-4 pb-24">
        {content}
      </div>
    </div>
  );
};

export default EWaitingRoomPage;
