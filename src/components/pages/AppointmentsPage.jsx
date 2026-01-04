import React, { useState } from 'react';
import { 
  Calendar, Clock, MapPin, ChevronRight, X, User, Phone, 
  Video, CheckCircle, AlertCircle, Plus, Search,
  CalendarDays, Stethoscope, Building, Navigation
} from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Card, Badge, Button } from '../ui';

const AppointmentsPage = ({ 
  appointments = [], 
  onBack, 
  onBookAppointment,
  onJoinWaitingRoom,
  onCancelAppointment,
  onReschedule 
}) => {
  const { isDesktop } = useResponsive();
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [filter, setFilter] = useState('upcoming');
  const [searchQuery, setSearchQuery] = useState('');

  const statusConfig = {
    'Confirmed': { 
      color: 'bg-teal-50 text-teal-700 border border-teal-200', 
      borderColor: '#14b8a6',
      label: 'Confirmed'
    },
    'Pending': { 
      color: 'bg-amber-50 text-amber-700 border border-amber-200', 
      borderColor: '#f59e0b',
      label: 'Pending'
    },
    'Completed': { 
      color: 'bg-slate-50 text-slate-600 border border-slate-200', 
      borderColor: '#94a3b8',
      label: 'Completed'
    },
    'Cancelled': { 
      color: 'bg-red-50 text-red-700 border border-red-200', 
      borderColor: '#ef4444',
      label: 'Cancelled'
    },
    'In Progress': { 
      color: 'bg-blue-50 text-blue-700 border border-blue-200', 
      borderColor: '#3b82f6',
      label: 'In Progress'
    },
  };

  const visitTypeConfig = {
    'In-Person': { icon: Building, color: 'text-cyan-700 bg-cyan-50' },
    'Virtual': { icon: Video, color: 'text-purple-700 bg-purple-50' },
    'Walk-in': { icon: Navigation, color: 'text-orange-700 bg-orange-50' },
  };

  const now = new Date();
  
  const filteredAppointments = appointments
    .filter(apt => {
      const aptDate = new Date(apt.date);
      if (filter === 'upcoming') return aptDate >= now && apt.status !== 'Cancelled' && apt.status !== 'Completed';
      if (filter === 'past') return aptDate < now || apt.status === 'Completed';
      if (filter === 'cancelled') return apt.status === 'Cancelled';
      return true;
    })
    .filter(apt => 
      apt.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.doctor?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.location?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return filter === 'past' ? dateB - dateA : dateA - dateB;
    });

  const upcomingCount = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return aptDate >= now && apt.status !== 'Cancelled' && apt.status !== 'Completed';
  }).length;

  const todayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    const today = new Date();
    return aptDate.toDateString() === today.toDateString() && apt.status !== 'Cancelled';
  });

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  const formatFullDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  };

  const AppointmentCard = ({ appointment }) => {
    const VisitIcon = visitTypeConfig[appointment.visitType]?.icon || Building;
    const isToday = new Date(appointment.date).toDateString() === new Date().toDateString();
    const isPast = new Date(appointment.date) < now;
    const config = statusConfig[appointment.status] || statusConfig['Confirmed'];
    
    return (
      <div 
        className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all border border-gray-100"
        style={{ borderLeftWidth: '4px', borderLeftColor: config.borderColor }}
        onClick={() => setSelectedAppointment(appointment)}
      >
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{appointment.type}</h3>
              <p className="text-gray-500 text-sm">{appointment.doctor}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
              {config.label}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-3">
            {appointment.reason || 'General consultation'}
          </p>
          
          <p className="text-gray-400 text-sm mb-2">
            {formatDate(appointment.date)} at {appointment.time} • {appointment.location}
          </p>

          {isToday && !isPast && appointment.status !== 'Completed' && (
            <div className="mt-3 p-3 bg-teal-50 rounded-lg flex items-center justify-between border border-teal-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-medium text-teal-700">
                  Appointment: {appointment.date} at {appointment.time}
                </span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); if (onJoinWaitingRoom) onJoinWaitingRoom(appointment); }}
                className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Join Queue
              </button>
            </div>
          )}
          
          {!isToday && appointment.appointmentDate && appointment.status !== 'Completed' && appointment.status !== 'Cancelled' && (
            <div className="mt-3 p-3 bg-teal-50 rounded-lg flex items-center gap-2 border border-teal-100">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-medium text-teal-700">
                Appointment: {formatFullDate(appointment.date)} at {appointment.time}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const content = (
    <div className="space-y-6">
      {/* Page Title with Book Button */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">My Appointments</h1>
        {onBookAppointment && (
          <button 
            onClick={onBookAppointment}
            className="px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-lg font-semibold text-sm text-white flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Book New
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { key: 'upcoming', label: 'Upcoming', count: upcomingCount },
          { key: 'past', label: 'Past', count: appointments.filter(a => new Date(a.date) < now || a.status === 'Completed').length },
          { key: 'cancelled', label: 'Cancelled', count: appointments.filter(a => a.status === 'Cancelled').length },
          { key: 'all', label: 'All', count: appointments.length },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === key 
                ? 'bg-teal-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search appointments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-400"
        />
      </div>

      {/* Appointments List */}
      {filteredAppointments.length > 0 ? (
        <div className="space-y-4">
          {filteredAppointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))}
        </div>
      ) : (
        <div className="p-10 text-center bg-white rounded-xl border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">No Appointments Found</h3>
          <p className="text-gray-500 text-sm mb-4">
            {searchQuery ? 'Try a different search term' : 'You don\'t have any appointments in this category.'}
          </p>
          {filter === 'upcoming' && onBookAppointment && (
            <Button onClick={onBookAppointment}>
              <Plus className="w-4 h-4" />
              Book an Appointment
            </Button>
          )}
        </div>
      )}

      {/* Appointment Detail Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
            <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Appointment Details</h2>
              <button onClick={() => setSelectedAppointment(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{selectedAppointment.type}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[selectedAppointment.status]?.color}`}>
                    {selectedAppointment.status}
                  </span>
                </div>
                <p className="text-gray-500">{selectedAppointment.doctor}</p>
              </div>

              {/* Date & Time */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Date</p>
                    <p className="font-semibold text-gray-900">{formatFullDate(selectedAppointment.date)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Time</p>
                    <p className="font-semibold text-gray-900">{selectedAppointment.time}</p>
                  </div>
                </div>
              </div>

              {/* Location */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-semibold text-gray-900">Location</p>
                    <p className="text-gray-600 text-sm mt-1">{selectedAppointment.location}</p>
                    {selectedAppointment.address && (
                      <p className="text-gray-500 text-sm mt-1">{selectedAppointment.address}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Visit Type */}
              {selectedAppointment.visitType && (
                <div className={`rounded-xl p-4 ${visitTypeConfig[selectedAppointment.visitType]?.color || 'bg-gray-50'}`}>
                  <div className="flex items-center gap-3">
                    {React.createElement(visitTypeConfig[selectedAppointment.visitType]?.icon || Building, { className: 'w-5 h-5' })}
                    <div>
                      <p className="font-semibold">Visit Type</p>
                      <p className="text-sm mt-0.5">{selectedAppointment.visitType} Visit</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Reason */}
              {selectedAppointment.reason && (
                <div>
                  <p className="font-semibold text-gray-900 mb-2">Reason for Visit</p>
                  <p className="text-gray-600 text-sm">{selectedAppointment.reason}</p>
                </div>
              )}

              {/* Notes */}
              {selectedAppointment.notes && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <p className="font-semibold text-amber-800 mb-2">Notes</p>
                  <p className="text-amber-700 text-sm">{selectedAppointment.notes}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3 pt-2">
                {selectedAppointment.status !== 'Completed' && selectedAppointment.status !== 'Cancelled' && (
                  <>
                    {new Date(selectedAppointment.date).toDateString() === new Date().toDateString() && onJoinWaitingRoom && (
                      <Button className="w-full" onClick={() => {
                        onJoinWaitingRoom(selectedAppointment);
                        setSelectedAppointment(null);
                      }}>
                        Join Waiting Room
                      </Button>
                    )}
                    <div className="flex gap-3">
                      {onReschedule && (
                        <Button variant="secondary" className="flex-1" onClick={() => {
                          onReschedule(selectedAppointment);
                          setSelectedAppointment(null);
                        }}>
                          Reschedule
                        </Button>
                      )}
                      {onCancelAppointment && (
                        <Button variant="secondary" className="flex-1 text-red-600 hover:bg-red-50" onClick={() => {
                          onCancelAppointment(selectedAppointment);
                          setSelectedAppointment(null);
                        }}>
                          Cancel
                        </Button>
                      )}
                    </div>
                  </>
                )}
                <Button variant="secondary" className="w-full" onClick={() => setSelectedAppointment(null)}>
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-6">
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="My Appointments" onBack={onBack} />
      <div className="p-4 pb-24">
        {content}
      </div>
    </div>
  );
};

export default AppointmentsPage;
