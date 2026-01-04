import React, { useState } from 'react';
import { 
  FileText, Heart, Syringe, AlertTriangle, Activity, Calendar,
  ChevronRight, X, Download, User, Building, Clock, Shield,
  Pill, FlaskConical, Stethoscope, Eye, Search, Filter, Plus,
  CheckCircle, AlertCircle, Thermometer, Droplets, Scale, Ruler
} from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Button } from '../ui';

const HealthRecordsPage = ({ healthRecords = {}, onBack, onDownloadRecord }) => {
  const { isDesktop } = useResponsive();
  const [activeTab, setActiveTab] = useState('summary');
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Demo data if none provided
  const demoRecords = {
    summary: {
      bloodType: 'A+',
      height: '5\'10"',
      weight: '175 lbs',
      bmi: 25.1,
      lastUpdated: '2025-12-15'
    },
    conditions: [
      { id: 'c1', name: 'Hypertension', diagnosedDate: '2023-03-15', status: 'Active', managedBy: 'Dr. Michelle Chen', notes: 'Well controlled with medication' },
      { id: 'c2', name: 'Hyperlipidemia', diagnosedDate: '2023-03-15', status: 'Active', managedBy: 'Dr. Michelle Chen', notes: 'On statin therapy' },
      { id: 'c3', name: 'Type 2 Diabetes', diagnosedDate: '2022-06-20', status: 'Active', managedBy: 'Dr. Michelle Chen', notes: 'Diet controlled, A1C at target' },
      { id: 'c4', name: 'Seasonal Allergies', diagnosedDate: '2015-04-01', status: 'Active', managedBy: 'Dr. Michelle Chen', notes: 'Spring pollen' }
    ],
    allergies: [
      { id: 'a1', allergen: 'Penicillin', type: 'Medication', severity: 'Severe', reaction: 'Anaphylaxis', verifiedDate: '2020-01-15' },
      { id: 'a2', allergen: 'Sulfa drugs', type: 'Medication', severity: 'Moderate', reaction: 'Rash, hives', verifiedDate: '2018-05-20' },
      { id: 'a3', allergen: 'Peanuts', type: 'Food', severity: 'Mild', reaction: 'Itching, mild swelling', verifiedDate: '2019-08-10' },
      { id: 'a4', allergen: 'Latex', type: 'Environmental', severity: 'Moderate', reaction: 'Contact dermatitis', verifiedDate: '2021-02-28' }
    ],
    immunizations: [
      { id: 'i1', name: 'COVID-19 Vaccine (Pfizer)', date: '2025-10-15', dose: 'Booster (5th)', provider: 'Shoppers Drug Mart', lotNumber: 'FL5678' },
      { id: 'i2', name: 'Influenza Vaccine', date: '2025-10-01', dose: 'Annual', provider: 'ExtendiHealth Clinic', lotNumber: 'FLU2025A' },
      { id: 'i3', name: 'Tdap (Tetanus, Diphtheria, Pertussis)', date: '2023-06-20', dose: 'Booster', provider: 'Public Health Unit', lotNumber: 'TD4521' },
      { id: 'i4', name: 'Shingles Vaccine (Shingrix)', date: '2024-03-15', dose: '2 of 2', provider: 'Shoppers Drug Mart', lotNumber: 'SHX892' },
      { id: 'i5', name: 'Pneumococcal Vaccine', date: '2024-01-10', dose: 'Initial', provider: 'ExtendiHealth Clinic', lotNumber: 'PCV2341' }
    ],
    surgeries: [
      { id: 's1', procedure: 'Appendectomy', date: '2015-08-22', hospital: 'Toronto General Hospital', surgeon: 'Dr. Robert Kim', notes: 'Laparoscopic, no complications' },
      { id: 's2', procedure: 'Wisdom Teeth Extraction', date: '2010-06-15', hospital: 'Dental Surgery Center', surgeon: 'Dr. Sarah Wong', notes: 'All 4 impacted teeth removed' }
    ],
    familyHistory: [
      { id: 'f1', relation: 'Father', condition: 'Heart Disease', ageAtDiagnosis: 55, notes: 'MI at 55, bypass surgery' },
      { id: 'f2', relation: 'Mother', condition: 'Type 2 Diabetes', ageAtDiagnosis: 60, notes: 'Insulin dependent' },
      { id: 'f3', relation: 'Mother', condition: 'Breast Cancer', ageAtDiagnosis: 62, notes: 'Stage 1, in remission' },
      { id: 'f4', relation: 'Paternal Grandfather', condition: 'Stroke', ageAtDiagnosis: 70, notes: 'Fatal' }
    ],
    vitals: [
      { id: 'v1', date: '2025-12-15', bp: '128/82', pulse: 72, temp: '98.4°F', weight: '175 lbs', provider: 'Dr. Michelle Chen' },
      { id: 'v2', date: '2025-09-10', bp: '130/85', pulse: 75, temp: '98.6°F', weight: '178 lbs', provider: 'Dr. Michelle Chen' },
      { id: 'v3', date: '2025-06-05', bp: '135/88', pulse: 78, temp: '98.2°F', weight: '180 lbs', provider: 'Dr. Michelle Chen' },
      { id: 'v4', date: '2025-03-01', bp: '138/90', pulse: 80, temp: '98.6°F', weight: '182 lbs', provider: 'Dr. Michelle Chen' }
    ]
  };

  const records = { ...demoRecords, ...healthRecords };

  const severityConfig = {
    'Severe': { color: 'bg-red-50 text-red-700 border border-red-200', borderColor: '#ef4444' },
    'Moderate': { color: 'bg-amber-50 text-amber-700 border border-amber-200', borderColor: '#f59e0b' },
    'Mild': { color: 'bg-emerald-50 text-emerald-700 border border-emerald-200', borderColor: '#10b981' }
  };

  const statusConfig = {
    'Active': { color: 'bg-teal-50 text-teal-700 border border-teal-200', borderColor: '#14b8a6' },
    'Resolved': { color: 'bg-slate-50 text-slate-600 border border-slate-200', borderColor: '#94a3b8' },
    'In Remission': { color: 'bg-emerald-50 text-emerald-700 border border-emerald-200', borderColor: '#10b981' }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const SummaryTab = () => (
    <div className="space-y-4">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Droplets className="w-5 h-5 text-red-500" />
            <span className="text-sm text-gray-500">Blood Type</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{records.summary.bloodType}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="w-5 h-5 text-blue-500" />
            <span className="text-sm text-gray-500">BMI</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{records.summary.bmi}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Ruler className="w-5 h-5 text-purple-500" />
            <span className="text-sm text-gray-500">Height</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{records.summary.height}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Scale className="w-5 h-5 text-emerald-500" />
            <span className="text-sm text-gray-500">Weight</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{records.summary.weight}</p>
        </div>
      </div>

      {/* Allergies Alert */}
      {records.allergies.length > 0 && (
        <div className="bg-red-50 rounded-xl p-4 border border-red-200">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-bold text-red-800">Known Allergies</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {records.allergies.map(allergy => (
              <span 
                key={allergy.id} 
                className={`px-3 py-1 rounded-full text-sm font-medium ${severityConfig[allergy.severity]?.color}`}
              >
                {allergy.allergen}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Active Conditions */}
      <div className="bg-white rounded-xl p-4 border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-3">Active Conditions</h3>
        <div className="space-y-2">
          {records.conditions.filter(c => c.status === 'Active').map(condition => (
            <div key={condition.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="font-medium text-gray-900">{condition.name}</span>
              <span className="text-sm text-gray-500">Since {formatDate(condition.diagnosedDate)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Vitals */}
      {records.vitals.length > 0 && (
        <div className="bg-white rounded-xl p-4 border border-gray-100">
          <h3 className="font-bold text-gray-900 mb-3">Latest Vitals</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Blood Pressure</p>
              <p className="text-xl font-bold text-gray-900">{records.vitals[0].bp}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pulse</p>
              <p className="text-xl font-bold text-gray-900">{records.vitals[0].pulse} bpm</p>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-3">Recorded {formatDate(records.vitals[0].date)}</p>
        </div>
      )}
    </div>
  );

  const ConditionsTab = () => (
    <div className="space-y-4">
      {records.conditions.map(condition => {
        const config = statusConfig[condition.status] || statusConfig['Active'];
        return (
          <div 
            key={condition.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
            style={{ borderLeftWidth: '4px', borderLeftColor: config.borderColor }}
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-bold text-gray-900">{condition.name}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
                  {condition.status}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-2">Diagnosed: {formatDate(condition.diagnosedDate)}</p>
              <p className="text-gray-600 text-sm">{condition.notes}</p>
              <p className="text-gray-400 text-sm mt-2">Managed by: {condition.managedBy}</p>
            </div>
          </div>
        );
      })}
    </div>
  );

  const AllergiesTab = () => (
    <div className="space-y-4">
      {records.allergies.map(allergy => {
        const config = severityConfig[allergy.severity] || severityConfig['Mild'];
        return (
          <div 
            key={allergy.id}
            className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
            style={{ borderLeftWidth: '4px', borderLeftColor: config.borderColor }}
          >
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-bold text-gray-900">{allergy.allergen}</h3>
                  <p className="text-gray-500 text-sm">{allergy.type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
                  {allergy.severity}
                </span>
              </div>
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Reaction:</span> {allergy.reaction}
                </p>
              </div>
              <p className="text-gray-400 text-sm mt-2">Verified: {formatDate(allergy.verifiedDate)}</p>
            </div>
          </div>
        );
      })}
    </div>
  );

  const ImmunizationsTab = () => (
    <div className="space-y-4">
      {records.immunizations.map(imm => (
        <div 
          key={imm.id}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
          style={{ borderLeftWidth: '4px', borderLeftColor: '#10b981' }}
        >
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-gray-900">{imm.name}</h3>
                <p className="text-gray-500 text-sm">{imm.dose}</p>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <CheckCircle className="w-3 h-3 inline mr-1" />
                Complete
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              {formatDate(imm.date)} • {imm.provider}
            </p>
            <p className="text-gray-400 text-xs mt-1">Lot #: {imm.lotNumber}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const SurgeriesTab = () => (
    <div className="space-y-4">
      {records.surgeries.map(surgery => (
        <div 
          key={surgery.id}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
          style={{ borderLeftWidth: '4px', borderLeftColor: '#6366f1' }}
        >
          <div className="p-4">
            <h3 className="font-bold text-gray-900">{surgery.procedure}</h3>
            <p className="text-gray-500 text-sm mt-1">{formatDate(surgery.date)} • {surgery.hospital}</p>
            <p className="text-gray-600 text-sm mt-2">{surgery.notes}</p>
            <p className="text-gray-400 text-sm mt-2">Surgeon: {surgery.surgeon}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const FamilyHistoryTab = () => (
    <div className="space-y-4">
      {records.familyHistory.map(item => (
        <div 
          key={item.id}
          className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
          style={{ borderLeftWidth: '4px', borderLeftColor: '#f59e0b' }}
        >
          <div className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-bold text-gray-900">{item.condition}</h3>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                {item.relation}
              </span>
            </div>
            <p className="text-gray-500 text-sm">Age at diagnosis: {item.ageAtDiagnosis}</p>
            {item.notes && <p className="text-gray-600 text-sm mt-2">{item.notes}</p>}
          </div>
        </div>
      ))}
    </div>
  );

  const content = (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Health Records</h1>
        <button 
          onClick={() => onDownloadRecord && onDownloadRecord()}
          className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Download className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { key: 'summary', label: 'Summary', icon: Activity },
          { key: 'conditions', label: 'Conditions', icon: Heart },
          { key: 'allergies', label: 'Allergies', icon: AlertTriangle },
          { key: 'immunizations', label: 'Vaccines', icon: Syringe },
          { key: 'surgeries', label: 'Surgeries', icon: Stethoscope },
          { key: 'family', label: 'Family', icon: User },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2 ${
              activeTab === key 
                ? 'bg-teal-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'summary' && <SummaryTab />}
      {activeTab === 'conditions' && <ConditionsTab />}
      {activeTab === 'allergies' && <AllergiesTab />}
      {activeTab === 'immunizations' && <ImmunizationsTab />}
      {activeTab === 'surgeries' && <SurgeriesTab />}
      {activeTab === 'family' && <FamilyHistoryTab />}
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
      <Header title="Health Records" onBack={onBack} />
      <div className="p-4 pb-24">
        {content}
      </div>
    </div>
  );
};

export default HealthRecordsPage;
