import React, { useState } from 'react';
import { 
  CheckCircle, FileText, Pill, Calendar, AlertTriangle, 
  Download, Share2, Printer, ChevronDown, ChevronUp,
  MapPin, Clock, User, Stethoscope, Activity, Heart,
  Thermometer, Wind, Scale, ClipboardList, Phone,
  Building, ArrowRight, ExternalLink, Mail, MessageSquare
} from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Button, Card, Badge } from '../ui';

/**
 * PostVisitSummaryPage
 * 
 * Displays a comprehensive summary after a kiosk visit including:
 * - Visit details (date, location, provider)
 * - Vitals captured at kiosk
 * - Diagnosis/Assessment
 * - Prescriptions issued
 * - Follow-up instructions
 * - Referrals (if any)
 * - Lab orders (if any)
 */

const PostVisitSummaryPage = ({ 
  visit,
  onBack, 
  onNavigate,
  onDownload,
  onShare,
  onScheduleFollowUp,
  onViewPrescription,
  onContactProvider
}) => {
  const { isDesktop, isMobile } = useResponsive();
  const [expandedSections, setExpandedSections] = useState({
    vitals: true,
    diagnosis: true,
    prescriptions: true,
    instructions: true,
    followUp: true,
  });

  // Demo visit data (would come from props in real app)
  const visitData = visit || {
    id: 'VST-2025-1227-001',
    date: 'December 27, 2025',
    time: '2:30 PM',
    type: 'Walk-in Visit',
    status: 'Completed',
    duration: '18 minutes',
    kiosk: {
      name: 'ExtendiHealth - Queen St',
      address: '123 Queen St West, Toronto, ON',
    },
    provider: {
      name: 'Dr. Sarah Chen',
      specialty: 'Family Medicine',
      credentials: 'MD, CCFP',
    },
    chiefComplaint: 'Sore throat and mild fever for 2 days',
    vitals: {
      bloodPressure: { systolic: 118, diastolic: 76 },
      heartRate: 72,
      temperature: 37.8,
      oxygenSaturation: 98,
      weight: 68.5,
    },
    diagnosis: {
      primary: 'Acute Pharyngitis (Strep Throat)',
      icdCode: 'J02.0',
      severity: 'Mild',
      notes: 'Positive rapid strep test. No signs of complications. Patient is otherwise healthy.',
    },
    prescriptions: [
      {
        id: 'RX-001',
        medication: 'Amoxicillin 500mg',
        dosage: '1 capsule 3 times daily',
        duration: '10 days',
        quantity: '30 capsules',
        refills: 0,
        instructions: 'Take with food. Complete the full course even if feeling better.',
        pharmacy: 'Shoppers Drug Mart - 456 Queen St W',
        status: 'Sent to Pharmacy',
      },
      {
        id: 'RX-002',
        medication: 'Ibuprofen 400mg',
        dosage: 'As needed for pain/fever',
        duration: 'As needed',
        quantity: '20 tablets',
        refills: 0,
        instructions: 'Take with food. Do not exceed 3 tablets in 24 hours.',
        pharmacy: 'Shoppers Drug Mart - 456 Queen St W',
        status: 'Sent to Pharmacy',
      },
    ],
    instructions: [
      { icon: Pill, text: 'Take all medications as prescribed. Complete the full antibiotic course.' },
      { icon: Activity, text: 'Rest and stay hydrated. Drink plenty of fluids.' },
      { icon: Thermometer, text: 'Monitor temperature. If fever exceeds 39°C (102°F), seek care.' },
      { icon: Clock, text: 'You should start feeling better within 24-48 hours of starting antibiotics.' },
      { icon: AlertTriangle, text: 'Return if symptoms worsen or don\'t improve after 3 days.', urgent: true },
    ],
    followUp: {
      recommended: true,
      timeframe: '7-10 days if symptoms persist',
      reason: 'Re-evaluation if not improving',
      scheduled: null,
    },
    referrals: [],
    labOrders: [],
    returnPrecautions: [
      'Difficulty breathing or swallowing',
      'Fever above 39°C (102°F) that doesn\'t respond to medication',
      'Severe throat pain that worsens',
      'Signs of dehydration (dizziness, dark urine)',
      'Rash or new symptoms develop',
    ],
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  // Section Header Component
  const SectionHeader = ({ title, icon: Icon, section, badge, badgeColor = 'gray' }) => (
    <button
      onClick={() => toggleSection(section)}
      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center">
          <Icon className="w-5 h-5 text-cyan-600" />
        </div>
        <h3 className="font-semibold text-gray-900">{title}</h3>
        {badge && (
          <Badge variant={badgeColor} size="sm">{badge}</Badge>
        )}
      </div>
      {expandedSections[section] ? (
        <ChevronUp className="w-5 h-5 text-gray-400" />
      ) : (
        <ChevronDown className="w-5 h-5 text-gray-400" />
      )}
    </button>
  );

  const content = (
    <div className="space-y-4">
      {/* Success Header */}
      <Card className="overflow-hidden">
        <div 
          className="p-6 text-center"
          style={{ background: 'linear-gradient(to right, #22c55e, #10b981)' }}
        >
          <div 
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
          >
            <CheckCircle className="w-8 h-8" style={{ color: '#ffffff' }} />
          </div>
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#ffffff' }}>Visit Complete</h1>
          <p style={{ color: '#bbf7d0' }}>Your visit summary is ready</p>
        </div>
        
        <div className="p-4 bg-green-50 border-t border-green-100">
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="font-medium" style={{ color: '#15803d' }}>Visit ID: {visitData.id}</span>
            <span style={{ color: '#16a34a' }}>•</span>
            <span style={{ color: '#15803d' }}>{visitData.date} at {visitData.time}</span>
          </div>
        </div>
      </Card>

      {/* Visit Details */}
      <Card className="p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium text-gray-900">{visitData.kiosk.name}</p>
              <p className="text-sm text-gray-500">{visitData.kiosk.address}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Provider</p>
              <p className="font-medium text-gray-900">{visitData.provider.name}</p>
              <p className="text-sm text-gray-500">{visitData.provider.specialty}</p>
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-500 mb-1">Chief Complaint</p>
          <p className="text-gray-900">{visitData.chiefComplaint}</p>
        </div>
      </Card>

      {/* Vitals Section */}
      <Card className="overflow-hidden">
        <SectionHeader title="Vitals Recorded" icon={Activity} section="vitals" />
        {expandedSections.vitals && (
          <div className="px-4 pb-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <Activity className="w-5 h-5 text-red-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">
                  {visitData.vitals.bloodPressure.systolic}/{visitData.vitals.bloodPressure.diastolic}
                </p>
                <p className="text-xs text-gray-500">Blood Pressure</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <Heart className="w-5 h-5 text-pink-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{visitData.vitals.heartRate}</p>
                <p className="text-xs text-gray-500">Heart Rate (BPM)</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <Thermometer className="w-5 h-5 text-orange-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{visitData.vitals.temperature}°C</p>
                <p className="text-xs text-gray-500">Temperature</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <Wind className="w-5 h-5 text-cyan-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{visitData.vitals.oxygenSaturation}%</p>
                <p className="text-xs text-gray-500">Oxygen Level</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3 text-center">
                <Scale className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-gray-900">{visitData.vitals.weight} kg</p>
                <p className="text-xs text-gray-500">Weight</p>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Diagnosis Section */}
      <Card className="overflow-hidden">
        <SectionHeader 
          title="Diagnosis" 
          icon={Stethoscope} 
          section="diagnosis"
          badge={visitData.diagnosis.severity}
          badgeColor={visitData.diagnosis.severity === 'Mild' ? 'green' : 'yellow'}
        />
        {expandedSections.diagnosis && (
          <div className="px-4 pb-4">
            <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mb-3">
              <h4 className="font-bold text-cyan-900 text-lg">{visitData.diagnosis.primary}</h4>
              <p className="text-sm text-cyan-700 mt-1">ICD-10: {visitData.diagnosis.icdCode}</p>
            </div>
            <p className="text-gray-700">{visitData.diagnosis.notes}</p>
          </div>
        )}
      </Card>

      {/* Prescriptions Section */}
      {visitData.prescriptions.length > 0 && (
        <Card className="overflow-hidden">
          <SectionHeader 
            title="Prescriptions" 
            icon={Pill} 
            section="prescriptions"
            badge={`${visitData.prescriptions.length} Rx`}
            badgeColor="blue"
          />
          {expandedSections.prescriptions && (
            <div className="px-4 pb-4 space-y-3">
              {visitData.prescriptions.map((rx, index) => (
                <div key={rx.id} className="border border-gray-200 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-bold text-gray-900">{rx.medication}</h4>
                      <p className="text-sm text-gray-600">{rx.dosage}</p>
                    </div>
                    <Badge variant="green" size="sm">{rx.status}</Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <span className="ml-1 text-gray-900">{rx.duration}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Quantity:</span>
                      <span className="ml-1 text-gray-900">{rx.quantity}</span>
                    </div>
                  </div>
                  
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-3">
                    <p className="text-sm text-amber-800">
                      <strong>Instructions:</strong> {rx.instructions}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Building className="w-4 h-4" />
                    <span>{rx.pharmacy}</span>
                  </div>
                </div>
              ))}
              
              <div className="space-y-2">
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => onNavigate?.('pharmacy')}
                >
                  <Pill className="w-4 h-4" />
                  View in Pharmacy
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Button>
                
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => onNavigate?.('sendToPharmacy')}
                >
                  <Building className="w-4 h-4" />
                  Send to Different Pharmacy
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Care Instructions Section */}
      <Card className="overflow-hidden">
        <SectionHeader title="Care Instructions" icon={ClipboardList} section="instructions" />
        {expandedSections.instructions && (
          <div className="px-4 pb-4 space-y-3">
            {visitData.instructions.map((instruction, index) => {
              const Icon = instruction.icon;
              return (
                <div 
                  key={index}
                  className={`flex items-start gap-3 p-3 rounded-xl ${
                    instruction.urgent ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    instruction.urgent ? 'bg-red-100' : 'bg-white'
                  }`}>
                    <Icon className={`w-4 h-4 ${instruction.urgent ? 'text-red-600' : 'text-gray-600'}`} />
                  </div>
                  <p className={`text-sm ${instruction.urgent ? 'text-red-800 font-medium' : 'text-gray-700'}`}>
                    {instruction.text}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </Card>

      {/* Return Precautions */}
      <Card className="overflow-hidden border-red-200 bg-red-50">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="font-semibold text-red-900">When to Seek Immediate Care</h3>
          </div>
          <ul className="space-y-2">
            {visitData.returnPrecautions.map((precaution, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-red-800">
                <span className="text-red-500 mt-1">•</span>
                <span>{precaution}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>

      {/* Follow-Up Section */}
      {visitData.followUp.recommended && (
        <Card className="overflow-hidden">
          <SectionHeader title="Follow-Up" icon={Calendar} section="followUp" />
          {expandedSections.followUp && (
            <div className="px-4 pb-4">
              <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4 mb-4">
                <p className="text-cyan-900">
                  <strong>Recommended:</strong> {visitData.followUp.timeframe}
                </p>
                <p className="text-sm text-cyan-700 mt-1">{visitData.followUp.reason}</p>
              </div>
              
              <Button 
                className="w-full"
                onClick={onScheduleFollowUp}
              >
                <Calendar className="w-4 h-4" />
                Schedule Follow-Up Visit
              </Button>
            </div>
          )}
        </Card>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <Button 
          variant="secondary" 
          className="flex-1"
          onClick={onDownload}
        >
          <Download className="w-4 h-4" />
          Download PDF
        </Button>
        <Button 
          variant="secondary" 
          className="flex-1"
          onClick={onShare}
        >
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </div>

      {/* Contact Provider */}
      <Card className="p-4">
        <p className="text-sm text-gray-600 mb-3">Questions about your visit?</p>
        <div className="flex gap-3">
          <Button 
            variant="secondary" 
            className="flex-1"
            onClick={() => onNavigate?.('messages')}
          >
            <MessageSquare className="w-4 h-4" />
            Message Provider
          </Button>
          <Button 
            variant="secondary" 
            className="flex-1"
            onClick={onContactProvider}
          >
            <Phone className="w-4 h-4" />
            Call Clinic
          </Button>
        </div>
      </Card>

      {/* Return to Dashboard */}
      <Button 
        className="w-full"
        onClick={() => onNavigate?.('dashboard')}
      >
        Return to Dashboard
      </Button>
    </div>
  );

  if (isDesktop) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-6">
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Visit Summary" 
        onBack={onBack}
        rightContent={
          <button 
            onClick={onDownload}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <Download className="w-5 h-5 text-gray-600" />
          </button>
        }
      />
      <div className="p-4 pb-24">
        {content}
      </div>
    </div>
  );
};

export default PostVisitSummaryPage;
