import React from 'react';
import { CheckCircle, MapPin, Clock, Calendar, Mail, ChevronRight, Activity, Video, Check, QrCode, Download, Share2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useResponsive } from '../../hooks';
import { Button, Card } from '../ui';

const AppointmentConfirmedPage = ({ appointment, onDone, onJoinWaitingRoom, onViewAppointments }) => {
  const { isDesktop } = useResponsive();

  // Generate QR code data - includes all relevant appointment info
  const generateQRData = () => {
    const qrData = {
      type: 'EXTENDIHEALTH_APPOINTMENT',
      confirmationNumber: appointment?.appointmentNumber || 'EH-000000',
      kiosk: appointment?.kiosk?.name || 'ExtendiHealth Kiosk',
      date: `${appointment?.date?.month} ${appointment?.date?.dayNum}`,
      time: appointment?.time,
      visitType: appointment?.visitType || 'in-person',
    };
    return JSON.stringify(qrData);
  };

  const confirmationNumber = appointment?.appointmentNumber || 'EH-' + Math.random().toString(36).substr(2, 6).toUpperCase();

  const content = (
    <div className="space-y-6 text-center">
      {/* Success Icon */}
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Appointment Confirmed!</h1>
        <p className="text-gray-500">Your appointment has been successfully booked</p>
      </div>

      {/* QR Code Card */}
      <Card className="p-6 bg-white border-2 border-cyan-100">
        <div className="flex flex-col items-center">
          {/* QR Code */}
          <div className="bg-white p-4 rounded-2xl shadow-inner border border-gray-100 mb-4">
            <QRCodeSVG 
              value={generateQRData()}
              size={180}
              level="H"
              includeMargin={true}
              bgColor="#ffffff"
              fgColor="#0d9488"
              imageSettings={{
                src: "/logo-icon.png",
                x: undefined,
                y: undefined,
                height: 30,
                width: 30,
                excavate: true,
              }}
            />
          </div>
          
          {/* Confirmation Number */}
          <div className="text-center mb-3">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Appointment #</p>
            <p className="text-2xl font-bold text-cyan-700 font-mono tracking-wider">{confirmationNumber}</p>
          </div>

          {/* Scan Instructions */}
          <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
            <QrCode className="w-4 h-4" />
            <span>Scan at kiosk to check in</span>
          </div>
        </div>
      </Card>

      {/* Appointment Details */}
      <Card className="p-4 text-left">
        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-cyan-600" />
          Appointment Details
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">{appointment?.kiosk?.name}</p>
              <p className="text-sm text-gray-500">{appointment?.kiosk?.address}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <p className="text-gray-700">
              {appointment?.date?.month} {appointment?.date?.dayNum} at {appointment?.time}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-gray-400" />
            <p className="text-gray-700">{appointment?.reason?.title || 'General Consultation'}</p>
          </div>
          <div className="flex items-center gap-3">
            {appointment?.visitType === 'virtual' ? (
              <Video className="w-5 h-5 text-gray-400" />
            ) : (
              <MapPin className="w-5 h-5 text-gray-400" />
            )}
            <p className="text-gray-700">{appointment?.visitType === 'virtual' ? 'Virtual Visit' : 'In-Person Visit'}</p>
          </div>
        </div>
      </Card>

      {/* Next Steps */}
      <Card className="p-4 text-left">
        <h3 className="font-semibold text-gray-900 mb-3">What's Next?</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            Confirmation sent to your email and phone
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            Reminder 1 hour before appointment
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            Join e-Waiting Room 45 min before to skip the line
          </li>
          <li className="flex items-start gap-2">
            <Check className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            Show QR code at kiosk to check in instantly
          </li>
        </ul>
      </Card>

      {/* Save/Share QR Code */}
      <div className="flex gap-3">
        <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 rounded-xl text-gray-700 font-medium hover:bg-gray-200 transition-colors">
          <Download className="w-5 h-5" />
          Save QR Code
        </button>
        <button className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 rounded-xl text-gray-700 font-medium hover:bg-gray-200 transition-colors">
          <Share2 className="w-5 h-5" />
          Share
        </button>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Button size="lg" className="w-full" onClick={onJoinWaitingRoom}>
          <Clock className="w-5 h-5" />
          Join e-Waiting Room
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" size="lg" onClick={onViewAppointments}>
            View Appointments
          </Button>
          <Button variant="secondary" size="lg" onClick={onDone}>
            Done
          </Button>
        </div>
      </div>

      {/* Add to Calendar */}
      <button className="flex items-center justify-center gap-2 text-cyan-600 font-medium mx-auto">
        <Calendar className="w-5 h-5" />
        Add to Calendar
      </button>
    </div>
  );

  if (isDesktop) {
    return (
      <div className="max-w-lg mx-auto py-8">
        <Card className="p-8">
          {content}
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 pb-24">
      {content}
    </div>
  );
};

export default AppointmentConfirmedPage;
