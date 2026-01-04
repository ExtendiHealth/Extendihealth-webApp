import React, { useState } from 'react';
import { Pill, Plus, X, Search, AlertTriangle, Check, ChevronRight, Clock } from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Button, Card, Badge } from '../ui';

const CurrentMedicationsPage = ({ onBack, onContinue, user, savedMedications }) => {
  const { isDesktop } = useResponsive();
  
  const [medications, setMedications] = useState(savedMedications || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [editingMed, setEditingMed] = useState(null);

  // Common medications database
  const commonMedications = [
    { name: 'Lisinopril', category: 'Blood Pressure', commonDosages: ['5mg', '10mg', '20mg', '40mg'] },
    { name: 'Metformin', category: 'Diabetes', commonDosages: ['500mg', '850mg', '1000mg'] },
    { name: 'Atorvastatin (Lipitor)', category: 'Cholesterol', commonDosages: ['10mg', '20mg', '40mg', '80mg'] },
    { name: 'Amlodipine', category: 'Blood Pressure', commonDosages: ['2.5mg', '5mg', '10mg'] },
    { name: 'Metoprolol', category: 'Heart/Blood Pressure', commonDosages: ['25mg', '50mg', '100mg'] },
    { name: 'Omeprazole (Prilosec)', category: 'Acid Reflux', commonDosages: ['20mg', '40mg'] },
    { name: 'Levothyroxine', category: 'Thyroid', commonDosages: ['25mcg', '50mcg', '75mcg', '100mcg', '125mcg'] },
    { name: 'Gabapentin', category: 'Nerve Pain', commonDosages: ['100mg', '300mg', '400mg', '600mg'] },
    { name: 'Sertraline (Zoloft)', category: 'Mental Health', commonDosages: ['25mg', '50mg', '100mg'] },
    { name: 'Hydrochlorothiazide', category: 'Blood Pressure', commonDosages: ['12.5mg', '25mg', '50mg'] },
    { name: 'Losartan', category: 'Blood Pressure', commonDosages: ['25mg', '50mg', '100mg'] },
    { name: 'Albuterol Inhaler', category: 'Respiratory', commonDosages: ['90mcg/puff'] },
    { name: 'Prednisone', category: 'Anti-inflammatory', commonDosages: ['5mg', '10mg', '20mg'] },
    { name: 'Tramadol', category: 'Pain', commonDosages: ['50mg', '100mg'] },
    { name: 'Fluticasone (Flonase)', category: 'Allergies', commonDosages: ['50mcg/spray'] },
    { name: 'Escitalopram (Lexapro)', category: 'Mental Health', commonDosages: ['5mg', '10mg', '20mg'] },
    { name: 'Montelukast (Singulair)', category: 'Allergies/Asthma', commonDosages: ['10mg'] },
    { name: 'Pantoprazole (Protonix)', category: 'Acid Reflux', commonDosages: ['20mg', '40mg'] },
    { name: 'Furosemide (Lasix)', category: 'Diuretic', commonDosages: ['20mg', '40mg', '80mg'] },
    { name: 'Clopidogrel (Plavix)', category: 'Blood Thinner', commonDosages: ['75mg'] },
    { name: 'Aspirin', category: 'Blood Thinner/Pain', commonDosages: ['81mg', '325mg'] },
    { name: 'Ibuprofen', category: 'Pain/Anti-inflammatory', commonDosages: ['200mg', '400mg', '600mg', '800mg'] },
    { name: 'Acetaminophen (Tylenol)', category: 'Pain', commonDosages: ['325mg', '500mg', '650mg'] },
  ];

  const frequencies = [
    'Once daily',
    'Twice daily',
    'Three times daily',
    'Four times daily',
    'Every morning',
    'Every evening',
    'At bedtime',
    'As needed',
    'Weekly',
    'Every other day',
  ];

  const filteredMedications = commonMedications.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !medications.find(existing => existing.name === m.name)
  );

  const addMedication = (med) => {
    const newMed = {
      id: Date.now(),
      name: med.name,
      category: med.category,
      dosage: med.commonDosages[0] || '',
      frequency: 'Once daily',
      startDate: '',
      prescribedBy: '',
      notes: '',
    };
    setMedications([...medications, newMed]);
    setEditingMed(newMed.id);
    setSearchTerm('');
    setShowDropdown(false);
  };

  const addCustomMedication = () => {
    if (searchTerm.trim()) {
      const newMed = {
        id: Date.now(),
        name: searchTerm.trim(),
        category: 'Other',
        dosage: '',
        frequency: 'Once daily',
        startDate: '',
        prescribedBy: '',
        notes: '',
      };
      setMedications([...medications, newMed]);
      setEditingMed(newMed.id);
      setSearchTerm('');
      setShowDropdown(false);
    }
  };

  const updateMedication = (id, field, value) => {
    setMedications(medications.map(med => 
      med.id === id ? { ...med, [field]: value } : med
    ));
  };

  const removeMedication = (id) => {
    setMedications(medications.filter(med => med.id !== id));
    if (editingMed === id) setEditingMed(null);
  };

  const handleContinue = () => {
    const medicationData = {
      medications,
      lastUpdated: new Date().toISOString(),
      dataClassification: 'PHI',
      reviewedByPatient: true,
    };
    onContinue(medicationData);
  };

  const getMedForEditing = () => medications.find(m => m.id === editingMed);
  const currentMed = getMedForEditing();
  const dbMed = currentMed ? commonMedications.find(m => m.name === currentMed.name) : null;

  return (
    <div className={`${isDesktop ? 'p-6 lg:p-8' : 'min-h-screen bg-gray-50'}`}>
      <div className={`${isDesktop ? 'max-w-3xl mx-auto' : ''}`}>
        {!isDesktop && <Header title="Current Medications" onBack={onBack} />}
        
        <div className={`${isDesktop ? '' : 'p-4'}`}>
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Current Medications</h2>
            <p className="text-gray-500">
              List all medications you're currently taking, including prescriptions and over-the-counter drugs.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex-1 h-1.5 bg-cyan-500 rounded-full" />
            <div className="flex-1 h-1.5 bg-cyan-500 rounded-full" />
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
          </div>

          {/* Search to Add Medication */}
          <Card className="p-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Pill className="w-5 h-5 text-cyan-600" />
              <h3 className="font-semibold text-gray-900">Add Medication</h3>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search for a medication..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              />
              
              {/* Dropdown */}
              {showDropdown && (searchTerm || filteredMedications.length > 0) && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
                  {filteredMedications.slice(0, 8).map((med) => (
                    <button
                      key={med.name}
                      onClick={() => addMedication(med)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                    >
                      <span className="font-medium text-gray-900">{med.name}</span>
                      <span className="text-gray-400 text-sm ml-2">• {med.category}</span>
                    </button>
                  ))}
                  {searchTerm && (
                    <button
                      onClick={addCustomMedication}
                      className="w-full px-4 py-3 text-left hover:bg-cyan-50 text-cyan-600 border-t border-gray-200"
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      Add "{searchTerm}" as custom medication
                    </button>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Medication List */}
          <div className="space-y-3 mb-4">
            {medications.length === 0 ? (
              <Card className="p-6 text-center">
                <Pill className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No medications added yet</p>
                <p className="text-sm text-gray-400">Search above to add your current medications</p>
              </Card>
            ) : (
              medications.map((med) => (
                <Card key={med.id} className={`overflow-hidden ${editingMed === med.id ? 'ring-2 ring-cyan-500' : ''}`}>
                  {/* Medication Header */}
                  <div 
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                    onClick={() => setEditingMed(editingMed === med.id ? null : med.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                        <Pill className="w-5 h-5 text-cyan-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{med.name}</p>
                        <p className="text-sm text-gray-500">
                          {med.dosage} • {med.frequency}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {med.dosage && med.frequency && (
                        <Check className="w-5 h-5 text-green-500" />
                      )}
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeMedication(med.id); }}
                        className="p-1 hover:bg-red-100 rounded text-red-500"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {editingMed === med.id && (
                    <div className="px-4 pb-4 border-t border-gray-100 bg-gray-50">
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        {/* Dosage */}
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">Dosage</label>
                          {dbMed?.commonDosages ? (
                            <select
                              value={med.dosage}
                              onChange={(e) => updateMedication(med.id, 'dosage', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                            >
                              <option value="">Select dosage</option>
                              {dbMed.commonDosages.map(d => (
                                <option key={d} value={d}>{d}</option>
                              ))}
                              <option value="other">Other</option>
                            </select>
                          ) : (
                            <input
                              type="text"
                              value={med.dosage}
                              onChange={(e) => updateMedication(med.id, 'dosage', e.target.value)}
                              placeholder="e.g., 10mg"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                            />
                          )}
                        </div>

                        {/* Frequency */}
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-1 block">Frequency</label>
                          <select
                            value={med.frequency}
                            onChange={(e) => updateMedication(med.id, 'frequency', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white"
                          >
                            {frequencies.map(f => (
                              <option key={f} value={f}>{f}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* Notes */}
                      <div className="mt-4">
                        <label className="text-sm font-medium text-gray-700 mb-1 block">Notes (optional)</label>
                        <input
                          type="text"
                          value={med.notes}
                          onChange={(e) => updateMedication(med.id, 'notes', e.target.value)}
                          placeholder="Any special instructions or notes..."
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                        />
                      </div>
                    </div>
                  )}
                </Card>
              ))
            )}
          </div>

          {/* Drug Interaction Warning */}
          {medications.length >= 2 && (
            <Card className="p-4 mb-6 bg-amber-50 border-amber-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">Drug Interaction Check</p>
                  <p className="text-sm text-amber-600">
                    Our healthcare provider will review your medication list for potential interactions during your visit.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* No Medications Option */}
          <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 mb-6">
            <input
              type="checkbox"
              checked={medications.length === 0}
              onChange={() => setMedications([])}
              className="w-5 h-5 text-cyan-600 rounded"
            />
            <span className="text-gray-700">I am not currently taking any medications</span>
          </label>

          {/* Continue Button */}
          <Button size="lg" onClick={handleContinue} className="w-full">
            Continue to Symptoms
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CurrentMedicationsPage;
