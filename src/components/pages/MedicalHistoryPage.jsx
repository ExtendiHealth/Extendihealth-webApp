import React, { useState } from 'react';
import { Heart, AlertTriangle, Plus, X, Search, Check, ChevronRight } from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Button, Card, Badge } from '../ui';

const MedicalHistoryPage = ({ onBack, onContinue, user, savedHistory }) => {
  const { isDesktop } = useResponsive();
  
  const [conditions, setConditions] = useState(savedHistory?.conditions || []);
  const [allergies, setAllergies] = useState(savedHistory?.allergies || []);
  const [surgeries, setSurgeries] = useState(savedHistory?.surgeries || []);
  const [familyHistory, setFamilyHistory] = useState(savedHistory?.familyHistory || []);
  
  const [conditionSearch, setConditionSearch] = useState('');
  const [allergySearch, setAllergySearch] = useState('');
  const [showConditionDropdown, setShowConditionDropdown] = useState(false);
  const [showAllergyDropdown, setShowAllergyDropdown] = useState(false);

  // Common conditions for quick selection
  const commonConditions = [
    'Hypertension (High Blood Pressure)',
    'Type 2 Diabetes',
    'Asthma',
    'Heart Disease',
    'Arthritis',
    'Depression',
    'Anxiety',
    'COPD',
    'Hypothyroidism',
    'High Cholesterol',
    'Chronic Kidney Disease',
    'Migraine',
    'Sleep Apnea',
    'GERD (Acid Reflux)',
    'Fibromyalgia',
    'Osteoporosis',
    'Atrial Fibrillation',
    'Epilepsy',
    'Crohn\'s Disease',
    'Ulcerative Colitis',
  ];

  const commonAllergies = [
    { name: 'Penicillin', type: 'Medication' },
    { name: 'Sulfa Drugs', type: 'Medication' },
    { name: 'Aspirin', type: 'Medication' },
    { name: 'Ibuprofen (NSAIDs)', type: 'Medication' },
    { name: 'Codeine', type: 'Medication' },
    { name: 'Latex', type: 'Environmental' },
    { name: 'Peanuts', type: 'Food' },
    { name: 'Tree Nuts', type: 'Food' },
    { name: 'Shellfish', type: 'Food' },
    { name: 'Eggs', type: 'Food' },
    { name: 'Dairy/Lactose', type: 'Food' },
    { name: 'Gluten/Wheat', type: 'Food' },
    { name: 'Soy', type: 'Food' },
    { name: 'Bee Stings', type: 'Environmental' },
    { name: 'Contrast Dye', type: 'Medication' },
  ];

  const familyConditions = [
    'Heart Disease',
    'Diabetes',
    'Cancer',
    'High Blood Pressure',
    'Stroke',
    'Mental Health Conditions',
    'Autoimmune Disorders',
    'Alzheimer\'s/Dementia',
  ];

  const filteredConditions = commonConditions.filter(c => 
    c.toLowerCase().includes(conditionSearch.toLowerCase()) && !conditions.includes(c)
  );

  const filteredAllergies = commonAllergies.filter(a => 
    a.name.toLowerCase().includes(allergySearch.toLowerCase()) && 
    !allergies.find(existing => existing.name === a.name)
  );

  const addCondition = (condition) => {
    if (!conditions.includes(condition)) {
      setConditions([...conditions, condition]);
    }
    setConditionSearch('');
    setShowConditionDropdown(false);
  };

  const addAllergy = (allergy) => {
    if (!allergies.find(a => a.name === allergy.name)) {
      setAllergies([...allergies, { ...allergy, severity: 'Moderate' }]);
    }
    setAllergySearch('');
    setShowAllergyDropdown(false);
  };

  const addCustomCondition = () => {
    if (conditionSearch.trim() && !conditions.includes(conditionSearch.trim())) {
      setConditions([...conditions, conditionSearch.trim()]);
      setConditionSearch('');
      setShowConditionDropdown(false);
    }
  };

  const addCustomAllergy = () => {
    if (allergySearch.trim() && !allergies.find(a => a.name === allergySearch.trim())) {
      setAllergies([...allergies, { name: allergySearch.trim(), type: 'Other', severity: 'Moderate' }]);
      setAllergySearch('');
      setShowAllergyDropdown(false);
    }
  };

  const removeCondition = (condition) => {
    setConditions(conditions.filter(c => c !== condition));
  };

  const removeAllergy = (allergyName) => {
    setAllergies(allergies.filter(a => a.name !== allergyName));
  };

  const updateAllergySeverity = (allergyName, severity) => {
    setAllergies(allergies.map(a => 
      a.name === allergyName ? { ...a, severity } : a
    ));
  };

  const toggleFamilyHistory = (condition) => {
    if (familyHistory.includes(condition)) {
      setFamilyHistory(familyHistory.filter(c => c !== condition));
    } else {
      setFamilyHistory([...familyHistory, condition]);
    }
  };

  const handleContinue = () => {
    const historyData = {
      conditions,
      allergies,
      surgeries,
      familyHistory,
      lastUpdated: new Date().toISOString(),
      dataClassification: 'PHI',
      complianceFramework: 'HIPAA',
    };
    onContinue(historyData);
  };

  return (
    <div className={`${isDesktop ? 'p-6 lg:p-8' : 'min-h-screen bg-gray-50'}`}>
      <div className={`${isDesktop ? 'max-w-3xl mx-auto' : ''}`}>
        {!isDesktop && <Header title="Medical History" onBack={onBack} />}
        
        <div className={`${isDesktop ? '' : 'p-4'}`}>
          {/* Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Medical History</h2>
            <p className="text-gray-500">
              Help us understand your health background for better care.
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-2 mb-6">
            <div className="flex-1 h-1.5 bg-cyan-500 rounded-full" />
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
            <div className="flex-1 h-1.5 bg-gray-200 rounded-full" />
          </div>

          {/* Current Medical Conditions */}
          <Card className="p-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-cyan-600" />
              <h3 className="font-semibold text-gray-900">Current Medical Conditions</h3>
            </div>
            
            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={conditionSearch}
                onChange={(e) => {
                  setConditionSearch(e.target.value);
                  setShowConditionDropdown(true);
                }}
                onFocus={() => setShowConditionDropdown(true)}
                placeholder="Search or add a condition..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              />
              
              {/* Dropdown */}
              {showConditionDropdown && (conditionSearch || filteredConditions.length > 0) && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {filteredConditions.slice(0, 6).map((condition) => (
                    <button
                      key={condition}
                      onClick={() => addCondition(condition)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50 text-gray-700"
                    >
                      {condition}
                    </button>
                  ))}
                  {conditionSearch && !filteredConditions.includes(conditionSearch) && (
                    <button
                      onClick={addCustomCondition}
                      className="w-full px-4 py-2 text-left hover:bg-cyan-50 text-cyan-600 border-t border-gray-100"
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      Add "{conditionSearch}"
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Selected Conditions */}
            <div className="flex flex-wrap gap-2">
              {conditions.length === 0 ? (
                <p className="text-gray-400 text-sm">No conditions added</p>
              ) : (
                conditions.map((condition) => (
                  <span
                    key={condition}
                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-sm"
                  >
                    {condition}
                    <button onClick={() => removeCondition(condition)} className="hover:text-cyan-900">
                      <X className="w-4 h-4" />
                    </button>
                  </span>
                ))
              )}
            </div>
          </Card>

          {/* Allergies */}
          <Card className="p-4 mb-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold text-gray-900">Allergies</h3>
              <Badge variant="danger">Important</Badge>
            </div>
            
            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={allergySearch}
                onChange={(e) => {
                  setAllergySearch(e.target.value);
                  setShowAllergyDropdown(true);
                }}
                onFocus={() => setShowAllergyDropdown(true)}
                placeholder="Search or add an allergy..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none"
              />
              
              {/* Dropdown */}
              {showAllergyDropdown && (allergySearch || filteredAllergies.length > 0) && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                  {filteredAllergies.slice(0, 6).map((allergy) => (
                    <button
                      key={allergy.name}
                      onClick={() => addAllergy(allergy)}
                      className="w-full px-4 py-2 text-left hover:bg-gray-50"
                    >
                      <span className="text-gray-700">{allergy.name}</span>
                      <span className="text-gray-400 text-sm ml-2">({allergy.type})</span>
                    </button>
                  ))}
                  {allergySearch && !filteredAllergies.find(a => a.name.toLowerCase() === allergySearch.toLowerCase()) && (
                    <button
                      onClick={addCustomAllergy}
                      className="w-full px-4 py-2 text-left hover:bg-red-50 text-red-600 border-t border-gray-100"
                    >
                      <Plus className="w-4 h-4 inline mr-2" />
                      Add "{allergySearch}"
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Selected Allergies with Severity */}
            <div className="space-y-2">
              {allergies.length === 0 ? (
                <p className="text-gray-400 text-sm">No allergies added (or select "No Known Allergies" below)</p>
              ) : (
                allergies.map((allergy) => (
                  <div
                    key={allergy.name}
                    className="flex items-center justify-between p-3 bg-red-50 rounded-xl"
                  >
                    <div>
                      <span className="font-medium text-gray-900">{allergy.name}</span>
                      <span className="text-gray-500 text-sm ml-2">({allergy.type})</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <select
                        value={allergy.severity}
                        onChange={(e) => updateAllergySeverity(allergy.name, e.target.value)}
                        className="text-sm border border-red-200 rounded-lg px-2 py-1 bg-white"
                      >
                        <option value="Mild">Mild</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Severe">Severe</option>
                        <option value="Life-threatening">Life-threatening</option>
                      </select>
                      <button onClick={() => removeAllergy(allergy.name)} className="text-red-500 hover:text-red-700">
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* No Known Allergies Option */}
            <label className="flex items-center gap-3 mt-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
              <input
                type="checkbox"
                checked={allergies.length === 0 && conditions.includes('NKDA')}
                onChange={() => {
                  if (conditions.includes('NKDA')) {
                    setConditions(conditions.filter(c => c !== 'NKDA'));
                  } else {
                    setConditions([...conditions, 'NKDA']);
                    setAllergies([]);
                  }
                }}
                className="w-5 h-5 text-cyan-600 rounded"
              />
              <span className="text-gray-700">No Known Drug Allergies (NKDA)</span>
            </label>
          </Card>

          {/* Family History */}
          <Card className="p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">Family History</h3>
            <p className="text-sm text-gray-500 mb-3">
              Select conditions that run in your immediate family (parents, siblings):
            </p>
            <div className="grid grid-cols-2 gap-2">
              {familyConditions.map((condition) => (
                <button
                  key={condition}
                  onClick={() => toggleFamilyHistory(condition)}
                  className={`p-3 text-left rounded-xl border-2 transition-all text-sm ${
                    familyHistory.includes(condition)
                      ? 'border-cyan-500 bg-cyan-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {familyHistory.includes(condition) && (
                      <Check className="w-4 h-4 text-cyan-600" />
                    )}
                    <span className={familyHistory.includes(condition) ? 'text-cyan-700' : 'text-gray-700'}>
                      {condition}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </Card>

          {/* Continue Button */}
          <Button size="lg" onClick={handleContinue} className="w-full">
            Continue to Medications
            <ChevronRight className="w-5 h-5" />
          </Button>

          {/* Skip Option */}
          <button
            onClick={() => onContinue({ conditions: [], allergies: [], surgeries: [], familyHistory: [], skipped: true })}
            className="w-full mt-3 text-gray-500 text-sm hover:text-gray-700"
          >
            Skip for now (not recommended)
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalHistoryPage;
