import React, { useState } from 'react';
import { 
  Pill, Clock, RefreshCw, AlertTriangle, CheckCircle, ChevronRight, 
  Calendar, MapPin, Phone, X, Info, Package, Bell, ShoppingCart,
  AlertCircle, Search, Sparkles, Shield, Heart, Loader, Truck, Building
} from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Card, Badge, Button } from '../ui';

const PharmacyPage = ({ prescriptions = [], onBack, onRequestRefill }) => {
  const { isDesktop } = useResponsive();
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Refill Request Modal State
  const [showRefillModal, setShowRefillModal] = useState(false);
  const [refillRx, setRefillRx] = useState(null);
  const [refillStep, setRefillStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deliveryOption, setDeliveryOption] = useState('pickup');

  // Demo pharmacy data
  const userPharmacy = {
    name: 'Shoppers Drug Mart',
    address: '123 Queen St W, Toronto, ON',
    phone: '(416) 555-0199',
    hours: 'Open until 10:00 PM',
  };

  const handleRefillRequest = (rx) => {
    setRefillRx(rx);
    setRefillStep(1);
    setShowRefillModal(true);
  };

  const submitRefillRequest = async () => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (onRequestRefill) {
      onRequestRefill(refillRx);
    }
    setIsSubmitting(false);
    setRefillStep(3); // Success
  };

  const closeRefillModal = () => {
    setShowRefillModal(false);
    setRefillRx(null);
    setRefillStep(1);
    setDeliveryOption('pickup');
  };

  // Refill Request Modal Component
  const RefillModal = () => {
    if (!showRefillModal || !refillRx) return null;

    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
          {refillStep === 3 ? (
            // Success State
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">Refill Requested!</h2>
              <p className="text-gray-500 mb-4">
                Your refill request for {refillRx.name} has been sent to your pharmacy.
              </p>
              
              <div className="bg-gray-50 rounded-xl p-4 mb-4 text-left">
                <div className="flex items-start gap-3">
                  <Building className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{userPharmacy.name}</p>
                    <p className="text-sm text-gray-500">{userPharmacy.address}</p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Estimated ready:</span>{' '}
                    {deliveryOption === 'pickup' ? '2-4 hours' : '1-2 business days'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    <span className="font-medium">Method:</span>{' '}
                    {deliveryOption === 'pickup' ? 'Pickup in store' : 'Home delivery'}
                  </p>
                </div>
              </div>

              <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-3 mb-4 text-left">
                <div className="flex items-start gap-2">
                  <Bell className="w-4 h-4 text-cyan-600 mt-0.5" />
                  <p className="text-sm text-cyan-800">
                    You'll receive a notification when your prescription is ready.
                  </p>
                </div>
              </div>

              <Button className="w-full" onClick={closeRefillModal}>
                Done
              </Button>
            </div>
          ) : refillStep === 2 ? (
            // Pharmacy & Delivery Options
            <>
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-900">Refill Options</h2>
                <button onClick={closeRefillModal} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Pharmacy */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pharmacy</label>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-start gap-3">
                      <Building className="w-5 h-5 text-cyan-500 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{userPharmacy.name}</p>
                        <p className="text-sm text-gray-500">{userPharmacy.address}</p>
                        <p className="text-xs text-green-600 mt-1">{userPharmacy.hours}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Delivery Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">How would you like to get it?</label>
                  <div className="space-y-2">
                    <button
                      onClick={() => setDeliveryOption('pickup')}
                      className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-all ${
                        deliveryOption === 'pickup'
                          ? 'border-cyan-500 bg-cyan-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        deliveryOption === 'pickup' ? 'bg-cyan-100' : 'bg-gray-100'
                      }`}>
                        <ShoppingCart className={`w-5 h-5 ${deliveryOption === 'pickup' ? 'text-cyan-600' : 'text-gray-500'}`} />
                      </div>
                      <div className="text-left flex-1">
                        <p className={`font-medium ${deliveryOption === 'pickup' ? 'text-cyan-900' : 'text-gray-900'}`}>
                          Pickup in Store
                        </p>
                        <p className="text-xs text-gray-500">Ready in 2-4 hours</p>
                      </div>
                      {deliveryOption === 'pickup' && (
                        <CheckCircle className="w-5 h-5 text-cyan-500" />
                      )}
                    </button>

                    <button
                      onClick={() => setDeliveryOption('delivery')}
                      className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 transition-all ${
                        deliveryOption === 'delivery'
                          ? 'border-cyan-500 bg-cyan-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        deliveryOption === 'delivery' ? 'bg-cyan-100' : 'bg-gray-100'
                      }`}>
                        <Truck className={`w-5 h-5 ${deliveryOption === 'delivery' ? 'text-cyan-600' : 'text-gray-500'}`} />
                      </div>
                      <div className="text-left flex-1">
                        <p className={`font-medium ${deliveryOption === 'delivery' ? 'text-cyan-900' : 'text-gray-900'}`}>
                          Home Delivery
                        </p>
                        <p className="text-xs text-gray-500">1-2 business days • Free</p>
                      </div>
                      {deliveryOption === 'delivery' && (
                        <CheckCircle className="w-5 h-5 text-cyan-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Summary */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 text-amber-600 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      This will use 1 of your {refillRx.refillsRemaining} remaining refills.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-gray-100 flex gap-3">
                <Button variant="secondary" className="flex-1" onClick={() => setRefillStep(1)}>
                  Back
                </Button>
                <Button 
                  className="flex-1" 
                  onClick={submitRefillRequest}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    'Submit Request'
                  )}
                </Button>
              </div>
            </>
          ) : (
            // Step 1: Confirm Medication
            <>
              <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="font-bold text-gray-900">Request Refill</h2>
                <button onClick={closeRefillModal} className="p-2 hover:bg-gray-100 rounded-lg">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              <div className="p-4">
                {/* Medication Info */}
                <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-xl flex items-center justify-center">
                    <Pill className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{refillRx.name}</h3>
                    <p className="text-sm text-gray-500">{refillRx.dosage} • {refillRx.frequency}</p>
                    <p className="text-xs text-gray-400 mt-1">Rx #{refillRx.rxNumber || 'RX-12345'}</p>
                  </div>
                </div>

                {/* Prescription Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Quantity</span>
                    <span className="font-medium text-gray-900">{refillRx.quantity || '30'} {refillRx.form || 'tablets'}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Days Supply</span>
                    <span className="font-medium text-gray-900">{refillRx.daysSupply || '30'} days</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-500">Refills Remaining</span>
                    <span className="font-medium text-gray-900">{refillRx.refillsRemaining}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-500">Prescribed By</span>
                    <span className="font-medium text-gray-900">{refillRx.prescribedBy || 'Dr. Sarah Chen'}</span>
                  </div>
                </div>

                {/* Warning if low refills */}
                {refillRx.refillsRemaining <= 1 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-amber-800">Last refill available</p>
                        <p className="text-xs text-amber-700 mt-0.5">Contact your doctor to renew this prescription.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 border-t border-gray-100">
                <Button className="w-full" onClick={() => setRefillStep(2)}>
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  const statusConfig = {
    'Active': { 
      color: 'bg-teal-50 text-teal-700 border border-teal-200', 
      borderColor: '#14b8a6',
      label: 'Active'
    },
    'Completed': { 
      color: 'bg-slate-50 text-slate-600 border border-slate-200', 
      borderColor: '#94a3b8',
      label: 'Completed'
    },
    'Discontinued': { 
      color: 'bg-red-50 text-red-700 border border-red-200', 
      borderColor: '#ef4444',
      label: 'Discontinued'
    },
    'Pending': { 
      color: 'bg-amber-50 text-amber-700 border border-amber-200', 
      borderColor: '#f59e0b',
      label: 'Pending'
    },
  };

  const filteredPrescriptions = prescriptions
    .filter(rx => {
      if (filter === 'all') return true;
      if (filter === 'active') return rx.status === 'Active';
      if (filter === 'refill') return rx.refillsRemaining > 0 && rx.status === 'Active';
      if (filter === 'completed') return rx.status === 'Completed';
      return true;
    })
    .filter(rx => 
      rx.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rx.genericName?.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const activePrescriptions = prescriptions.filter(rx => rx.status === 'Active');
  const needsRefillSoon = activePrescriptions.filter(rx => {
    const nextRefill = new Date(rx.nextRefillDate);
    const daysUntilRefill = Math.ceil((nextRefill - new Date()) / (1000 * 60 * 60 * 24));
    return daysUntilRefill <= 7 && rx.refillsRemaining > 0;
  });

  const PrescriptionCard = ({ rx }) => {
    const daysUntilRefill = rx.nextRefillDate 
      ? Math.ceil((new Date(rx.nextRefillDate) - new Date()) / (1000 * 60 * 60 * 24))
      : null;
    const isUrgent = daysUntilRefill !== null && daysUntilRefill <= 3 && rx.refillsRemaining > 0 && rx.status === 'Active';
    const config = statusConfig[rx.status] || statusConfig['Active'];
    
    return (
      <div 
        className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all border border-gray-100"
        style={{ borderLeftWidth: '4px', borderLeftColor: config.borderColor }}
        onClick={() => setSelectedPrescription(rx)}
      >
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{rx.name}</h3>
              <p className="text-gray-500 text-sm">{rx.genericName || rx.form}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
              {config.label}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-3">{rx.dosage} • {rx.frequency}</p>
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
            <span>Refills: <span className="font-semibold text-gray-700">{rx.refillsRemaining}</span> remaining</span>
            {rx.autoRefill && (
              <span className="flex items-center gap-1 text-emerald-600">
                <Sparkles className="w-3.5 h-3.5" />
                Auto-refill
              </span>
            )}
          </div>

          <p className="text-gray-400 text-sm">
            Last filled: {rx.lastFilled || 'N/A'} • By: {rx.prescribedBy}
          </p>

          {daysUntilRefill !== null && daysUntilRefill <= 7 && rx.refillsRemaining > 0 && rx.status === 'Active' && (
            <div className="mt-3 p-3 bg-teal-50 rounded-lg flex items-center justify-between border border-teal-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-teal-600" />
                <span className="text-sm font-medium text-teal-700">
                  Refill due: {rx.nextRefillDate}
                </span>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); handleRefillRequest(rx); }}
                className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Refill Now
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const content = (
    <div className="space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-900">My Pharmacy</h1>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'All', count: prescriptions.length },
          { key: 'active', label: 'Active', count: activePrescriptions.length },
          { key: 'refill', label: 'Needs Refill', count: needsRefillSoon.length },
          { key: 'completed', label: 'Completed', count: prescriptions.filter(rx => rx.status === 'Completed').length },
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
          placeholder="Search medications..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-400"
        />
      </div>

      {/* Prescriptions List */}
      {filteredPrescriptions.length > 0 ? (
        <div className="space-y-4">
          {filteredPrescriptions.map((rx) => (
            <PrescriptionCard key={rx.id} rx={rx} />
          ))}
        </div>
      ) : (
        <div className="p-10 text-center bg-white rounded-xl border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Pill className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">No Medications Found</h3>
          <p className="text-gray-500 text-sm">
            {searchQuery ? 'Try a different search term' : 'You don\'t have any prescriptions in this category.'}
          </p>
        </div>
      )}

      {/* Pharmacy Info Card */}
      {prescriptions[0]?.pharmacy && (
        <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center">
              <MapPin className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wide font-medium">Your Pharmacy</p>
              <h3 className="font-bold text-gray-900">{prescriptions[0].pharmacy.name}</h3>
            </div>
          </div>
          <div className="space-y-1 text-sm">
            <p className="text-gray-600">{prescriptions[0].pharmacy.address}</p>
            <a href={`tel:${prescriptions[0].pharmacy.phone}`} className="text-teal-600 font-medium hover:text-teal-700">
              {prescriptions[0].pharmacy.phone}
            </a>
          </div>
        </div>
      )}

      {/* Prescription Detail Modal */}
      {selectedPrescription && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
            <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Prescription Details</h2>
              <button onClick={() => setSelectedPrescription(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{selectedPrescription.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[selectedPrescription.status]?.color}`}>
                    {selectedPrescription.status}
                  </span>
                </div>
                <p className="text-gray-500">{selectedPrescription.genericName}</p>
              </div>

              {/* Dosage Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">Dosage</p>
                    <p className="font-semibold text-gray-900 mt-1">{selectedPrescription.dosage}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-medium">Form</p>
                    <p className="font-semibold text-gray-900 mt-1">{selectedPrescription.form}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-xs text-gray-500 uppercase font-medium">Frequency</p>
                    <p className="font-semibold text-gray-900 mt-1">{selectedPrescription.frequency}</p>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              {selectedPrescription.instructions && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Instructions</h4>
                  <p className="text-gray-600 text-sm">{selectedPrescription.instructions}</p>
                </div>
              )}

              {/* Warnings */}
              {selectedPrescription.warnings?.length > 0 && (
                <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-2">Important Warnings</h4>
                  <ul className="space-y-1">
                    {selectedPrescription.warnings.map((warning, i) => (
                      <li key={i} className="flex items-start gap-2 text-amber-700 text-sm">
                        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        {warning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Refill Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Refill Information</h4>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Refills Left</p>
                    <p className="font-semibold text-gray-900">{selectedPrescription.refillsRemaining} of {selectedPrescription.refillsTotal}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Next Refill</p>
                    <p className="font-semibold text-gray-900">{selectedPrescription.nextRefillDate || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Last Filled</p>
                    <p className="font-semibold text-gray-900">{selectedPrescription.lastFilled || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Quantity</p>
                    <p className="font-semibold text-gray-900">{selectedPrescription.quantity}</p>
                  </div>
                </div>
              </div>

              {/* Prescriber */}
              <div className="text-sm text-gray-500">
                <p>Prescribed by <span className="font-semibold text-gray-700">{selectedPrescription.prescribedBy}</span></p>
                <p className="mt-1">Date: {selectedPrescription.prescribedDate}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button variant="secondary" className="flex-1" onClick={() => setSelectedPrescription(null)}>
                  Close
                </Button>
                {selectedPrescription.status === 'Active' && selectedPrescription.refillsRemaining > 0 && (
                  <Button className="flex-1" onClick={() => {
                    handleRefillRequest(selectedPrescription);
                    setSelectedPrescription(null);
                  }}>
                    <RefreshCw className="w-4 h-4" />
                    Request Refill
                  </Button>
                )}
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
      <Header title="My Pharmacy" onBack={onBack} />
      <div className="p-4 pb-24">
        {content}
      </div>
      <RefillModal />
    </div>
  );
};

export default PharmacyPage;
