import React, { useState } from 'react';
import { Clock, MapPin, FileText, ChevronRight, ChevronDown, Pill, Activity, X } from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Card, Badge, Button } from '../ui';

const VisitHistoryPage = ({ visits, onBack }) => {
  const { isDesktop } = useResponsive();
  const [selectedVisit, setSelectedVisit] = useState(null);

  const content = (
    <div className="space-y-4">
      {visits.length > 0 ? (
        visits.map((visit) => (
          <Card 
            key={visit.id} 
            className="p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => setSelectedVisit(visit)}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-gray-900">{visit.type}</h3>
                <p className="text-sm text-gray-600">{visit.provider}</p>
              </div>
              <span className="text-sm text-gray-500">{visit.date}</span>
            </div>
            <p className="text-sm text-gray-500 mb-2">{visit.chiefComplaint}</p>
            {visit.diagnosis && visit.diagnosis.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {visit.diagnosis.slice(0, 2).map((dx, i) => (
                  <span key={i} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                    {dx.split('(')[0].trim()}
                  </span>
                ))}
                {visit.diagnosis.length > 2 && (
                  <span className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                    +{visit.diagnosis.length - 2} more
                  </span>
                )}
              </div>
            )}
          </Card>
        ))
      ) : (
        <Card className="p-8 text-center">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-semibold text-gray-900 mb-2">No Visit History</h3>
          <p className="text-gray-500 text-sm">Your visit history will appear here.</p>
        </Card>
      )}

      {/* Visit Detail Modal */}
      {selectedVisit && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-lg font-bold text-gray-900">Visit Summary</h2>
              <button onClick={() => setSelectedVisit(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedVisit.type}</h3>
                  <p className="text-sm text-gray-500">{selectedVisit.date}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 uppercase">Provider</label>
                  <p className="font-medium">{selectedVisit.provider}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-500 uppercase">Facility</label>
                  <p className="text-sm">{selectedVisit.facility}</p>
                </div>
              </div>

              {selectedVisit.vitals && (
                <div className="bg-cyan-50 rounded-xl p-4">
                  <label className="text-xs text-cyan-600 uppercase tracking-wider mb-2 block">Vitals</label>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {selectedVisit.vitals.bp && <p>BP: <strong>{selectedVisit.vitals.bp}</strong></p>}
                    {selectedVisit.vitals.hr && <p>HR: <strong>{selectedVisit.vitals.hr} bpm</strong></p>}
                    {selectedVisit.vitals.temp && <p>Temp: <strong>{selectedVisit.vitals.temp}</strong></p>}
                    {selectedVisit.vitals.weight && <p>Weight: <strong>{selectedVisit.vitals.weight}</strong></p>}
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs text-gray-500 uppercase">Chief Complaint</label>
                <p className="text-gray-700">{selectedVisit.chiefComplaint}</p>
              </div>

              {selectedVisit.diagnosis && selectedVisit.diagnosis.length > 0 && (
                <div>
                  <label className="text-xs text-gray-500 uppercase">Diagnosis</label>
                  <ul className="mt-1 space-y-1">
                    {selectedVisit.diagnosis.map((dx, i) => (
                      <li key={i} className="text-sm text-gray-700">• {dx}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedVisit.treatment && (
                <div>
                  <label className="text-xs text-gray-500 uppercase">Treatment Plan</label>
                  <p className="text-gray-700">{selectedVisit.treatment}</p>
                </div>
              )}

              {selectedVisit.prescriptions && selectedVisit.prescriptions.length > 0 && (
                <div>
                  <label className="text-xs text-gray-500 uppercase">Prescriptions</label>
                  <ul className="mt-1 space-y-1">
                    {selectedVisit.prescriptions.map((rx, i) => (
                      <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                        <Pill className="w-4 h-4 text-cyan-600" /> {rx}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedVisit.notes && (
                <div>
                  <label className="text-xs text-gray-500 uppercase">Notes</label>
                  <p className="text-gray-700 text-sm">{selectedVisit.notes}</p>
                </div>
              )}

              {selectedVisit.followUp && (
                <div className="bg-amber-50 rounded-xl p-4">
                  <label className="text-xs text-amber-600 uppercase">Follow-up</label>
                  <p className="text-amber-800 font-medium">{selectedVisit.followUp}</p>
                </div>
              )}

              <Button variant="secondary" className="w-full" onClick={() => setSelectedVisit(null)}>
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <div className="max-w-3xl mx-auto py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Visit History</h1>
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Visit History" onBack={onBack} />
      <div className="p-4 pb-24">
        {content}
      </div>
    </div>
  );
};

// ============================================================================
// KIOSKS LIST PAGE
// ============================================================================


export default VisitHistoryPage;
