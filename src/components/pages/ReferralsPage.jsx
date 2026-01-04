import React, { useState } from 'react';
import { Clock, MapPin, Phone, FileText, ChevronRight, CheckCircle, AlertCircle, Calendar, X } from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Card, Badge, Button } from '../ui';

const ReferralsPage = ({ referrals, onBack }) => {
  const { isDesktop } = useResponsive();
  const [selectedReferral, setSelectedReferral] = useState(null);
  const [filter, setFilter] = useState('all');

  const statusColors = {
    'Pending Appointment': 'bg-amber-100 text-amber-800',
    'Appointment Scheduled': 'bg-cyan-100 text-cyan-800',
    'Completed': 'bg-green-100 text-green-800',
    'Cancelled': 'bg-red-100 text-red-800',
  };

  const filteredReferrals = filter === 'all' 
    ? referrals 
    : referrals.filter(r => r.status.toLowerCase().includes(filter));

  const content = (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'pending', 'scheduled', 'completed'].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              filter === f 
                ? 'bg-cyan-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Referrals List */}
      {filteredReferrals.length > 0 ? (
        <div className="space-y-3">
          {filteredReferrals.map((referral) => (
            <Card 
              key={referral.id} 
              className="p-4 cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedReferral(referral)}
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900">{referral.specialty}</h3>
                  <p className="text-sm text-gray-600">{referral.referredTo}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[referral.status] || 'bg-gray-100 text-gray-800'}`}>
                  {referral.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mb-2">{referral.reason}</p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>Referred: {referral.referralDate}</span>
                <span>By: {referral.referredBy}</span>
              </div>
              {referral.appointmentDate && (
                <div className="mt-2 bg-cyan-50 rounded-lg p-2">
                  <p className="text-sm text-cyan-800 font-medium">
                    📅 Appointment: {referral.appointmentDate} at {referral.appointmentTime}
                  </p>
                </div>
              )}
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No Referrals</h3>
          <p className="text-gray-500 text-sm">
            You don't have any {filter !== 'all' ? filter : ''} referrals.
          </p>
        </Card>
      )}

      {/* Referral Detail Modal */}
      {selectedReferral && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Referral Details</h2>
              <button onClick={() => setSelectedReferral(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[selectedReferral.status]}`}>
                  {selectedReferral.status}
                </span>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Specialty</label>
                  <p className="font-medium text-gray-900">{selectedReferral.specialty}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Referred To</label>
                  <p className="font-medium text-gray-900">{selectedReferral.referredTo}</p>
                  <p className="text-sm text-gray-600">{selectedReferral.referredToCredentials}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Facility</label>
                  <p className="font-medium text-gray-900">{selectedReferral.referredToFacility}</p>
                  <p className="text-sm text-gray-500">{selectedReferral.referredToAddress}</p>
                  <p className="text-sm text-cyan-600">{selectedReferral.referredToPhone}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Reason for Referral</label>
                  <p className="text-gray-700">{selectedReferral.reason}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase tracking-wider">Referred By</label>
                  <p className="font-medium text-gray-900">{selectedReferral.referredBy}</p>
                  <p className="text-sm text-gray-500">Date: {selectedReferral.referralDate}</p>
                </div>
                {selectedReferral.notes && (
                  <div>
                    <label className="text-xs text-gray-500 uppercase tracking-wider">Notes</label>
                    <p className="text-gray-700">{selectedReferral.notes}</p>
                  </div>
                )}
                {selectedReferral.appointmentDate && (
                  <div className="bg-cyan-50 rounded-xl p-4">
                    <label className="text-xs text-cyan-600 uppercase tracking-wider">Scheduled Appointment</label>
                    <p className="font-semibold text-cyan-800 mt-1">
                      {selectedReferral.appointmentDate} at {selectedReferral.appointmentTime}
                    </p>
                  </div>
                )}
                {selectedReferral.results && (
                  <div className="bg-green-50 rounded-xl p-4">
                    <label className="text-xs text-green-600 uppercase tracking-wider">Results</label>
                    <p className="text-green-800 mt-1">{selectedReferral.results}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="secondary" className="flex-1" onClick={() => setSelectedReferral(null)}>
                  Close
                </Button>
                {selectedReferral.status === 'Pending Appointment' && (
                  <Button className="flex-1">
                    <Phone className="w-4 h-4" />
                    Call to Book
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">My Referrals</h1>
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="My Referrals" onBack={onBack} />
      <div className="p-4 pb-24">
        {content}
      </div>
    </div>
  );
};

// ============================================================================
// VISIT HISTORY PAGE
// ============================================================================


export default ReferralsPage;
