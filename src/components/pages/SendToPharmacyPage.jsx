import React, { useState } from 'react';
import { 
  Pill, MapPin, Clock, CheckCircle, ChevronRight, Phone, 
  Navigation, Search, Star, Building, AlertCircle, Loader,
  ChevronDown, Check, X, ExternalLink, Bell, Package
} from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Card, Badge, Button } from '../ui';

/**
 * SendToPharmacyPage
 * 
 * Flow for sending prescriptions to a pharmacy:
 * 1. Review prescriptions from visit
 * 2. Select preferred pharmacy or choose new one
 * 3. Send prescriptions
 * 4. Track status and get pickup notifications
 */

const SendToPharmacyPage = ({ 
  prescriptions,
  preferredPharmacy,
  onBack, 
  onComplete,
  onChangePharmacy,
  onNavigate
}) => {
  const { isDesktop, isMobile } = useResponsive();
  const [step, setStep] = useState(1); // 1: Review, 2: Select Pharmacy, 3: Confirm, 4: Success
  const [selectedPharmacy, setSelectedPharmacy] = useState(preferredPharmacy || null);
  const [selectedRx, setSelectedRx] = useState(prescriptions?.map(rx => rx.id) || []);
  const [isSending, setIsSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPharmacySearch, setShowPharmacySearch] = useState(false);

  // Demo prescriptions if none provided
  const rxList = prescriptions || [
    {
      id: 'RX-001',
      medication: 'Amoxicillin 500mg',
      dosage: '1 capsule 3 times daily',
      duration: '10 days',
      quantity: '30 capsules',
      refills: 0,
      instructions: 'Take with food. Complete the full course.',
      prescriber: 'Dr. Sarah Chen',
      prescribedDate: 'December 27, 2025',
      urgent: false,
    },
    {
      id: 'RX-002',
      medication: 'Ibuprofen 400mg',
      dosage: 'As needed for pain/fever',
      duration: 'As needed',
      quantity: '20 tablets',
      refills: 2,
      instructions: 'Take with food. Max 3 per day.',
      prescriber: 'Dr. Sarah Chen',
      prescribedDate: 'December 27, 2025',
      urgent: false,
    },
  ];

  // Demo nearby pharmacies
  const nearbyPharmacies = [
    {
      id: 'PH-001',
      name: 'Shoppers Drug Mart',
      address: '456 Queen St West, Toronto, ON',
      distance: '0.3 km',
      phone: '(416) 555-0101',
      hours: 'Open until 10 PM',
      isPreferred: true,
      rating: 4.5,
      hasDelivery: true,
    },
    {
      id: 'PH-002',
      name: 'Rexall Pharmacy',
      address: '789 King St West, Toronto, ON',
      distance: '0.8 km',
      phone: '(416) 555-0102',
      hours: 'Open until 9 PM',
      isPreferred: false,
      rating: 4.2,
      hasDelivery: false,
    },
    {
      id: 'PH-003',
      name: 'Pharmasave',
      address: '321 Dundas St West, Toronto, ON',
      distance: '1.2 km',
      phone: '(416) 555-0103',
      hours: 'Open until 8 PM',
      isPreferred: false,
      rating: 4.7,
      hasDelivery: true,
    },
    {
      id: 'PH-004',
      name: 'Costco Pharmacy',
      address: '100 Billy Bishop Way, Toronto, ON',
      distance: '3.5 km',
      phone: '(416) 555-0104',
      hours: 'Open until 6 PM',
      isPreferred: false,
      rating: 4.4,
      hasDelivery: false,
    },
  ];

  const defaultPharmacy = selectedPharmacy || nearbyPharmacies.find(p => p.isPreferred) || nearbyPharmacies[0];

  const toggleRxSelection = (rxId) => {
    setSelectedRx(prev => 
      prev.includes(rxId) 
        ? prev.filter(id => id !== rxId)
        : [...prev, rxId]
    );
  };

  const handleSendPrescriptions = async () => {
    setIsSending(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSending(false);
    setStep(4);
  };

  const filteredPharmacies = nearbyPharmacies.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Step 1: Review Prescriptions
  const renderReviewStep = () => (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
            <Pill className="w-5 h-5 text-cyan-600" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900">Your Prescriptions</h2>
            <p className="text-sm text-gray-500">{rxList.length} prescription{rxList.length !== 1 ? 's' : ''} to send</p>
          </div>
        </div>

        <div className="space-y-3">
          {rxList.map((rx) => (
            <div 
              key={rx.id}
              onClick={() => toggleRxSelection(rx.id)}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedRx.includes(rx.id)
                  ? 'border-cyan-500 bg-cyan-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  selectedRx.includes(rx.id)
                    ? 'bg-cyan-500 border-cyan-500'
                    : 'border-gray-300 bg-white'
                }`}>
                  {selectedRx.includes(rx.id) && (
                    <Check className="w-4 h-4 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{rx.medication}</h3>
                  <p className="text-sm text-gray-600">{rx.dosage}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                    <span>Qty: {rx.quantity}</span>
                    <span>•</span>
                    <span>{rx.duration}</span>
                    {rx.refills > 0 && (
                      <>
                        <span>•</span>
                        <span>{rx.refills} refill{rx.refills !== 1 ? 's' : ''}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Selected Pharmacy Preview */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-gray-900">Send to Pharmacy</h3>
          <button 
            onClick={() => setStep(2)}
            className="text-cyan-600 text-sm font-medium"
          >
            Change
          </button>
        </div>
        
        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border border-gray-200">
            <Building className="w-5 h-5 text-gray-600" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-medium text-gray-900">{defaultPharmacy.name}</h4>
              {defaultPharmacy.isPreferred && (
                <Badge variant="cyan" size="sm">Preferred</Badge>
              )}
            </div>
            <p className="text-sm text-gray-500">{defaultPharmacy.address}</p>
            <p className="text-sm text-gray-500">{defaultPharmacy.hours}</p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
      </Card>

      <Button 
        className="w-full" 
        size="lg"
        disabled={selectedRx.length === 0}
        onClick={() => setStep(3)}
      >
        Continue
        <ChevronRight className="w-5 h-5" />
      </Button>
    </div>
  );

  // Step 2: Select Pharmacy
  const renderPharmacyStep = () => (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search pharmacies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 outline-none"
        />
      </div>

      {/* Pharmacy List */}
      <div className="space-y-3">
        {filteredPharmacies.map((pharmacy) => (
          <Card 
            key={pharmacy.id}
            onClick={() => {
              setSelectedPharmacy(pharmacy);
              setStep(1);
            }}
            className={`p-4 cursor-pointer transition-all ${
              selectedPharmacy?.id === pharmacy.id
                ? 'border-2 border-cyan-500 bg-cyan-50'
                : 'hover:shadow-md'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                <Building className="w-6 h-6 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-gray-900">{pharmacy.name}</h3>
                  {pharmacy.isPreferred && (
                    <Badge variant="cyan" size="sm">Preferred</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{pharmacy.address}</p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1 text-gray-500">
                    <MapPin className="w-4 h-4" />
                    {pharmacy.distance}
                  </span>
                  <span className="flex items-center gap-1 text-gray-500">
                    <Clock className="w-4 h-4" />
                    {pharmacy.hours}
                  </span>
                  {pharmacy.hasDelivery && (
                    <Badge variant="green" size="sm">Delivery</Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-medium">{pharmacy.rating}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button 
        variant="secondary" 
        className="w-full"
        onClick={() => setStep(1)}
      >
        Back to Review
      </Button>
    </div>
  );

  // Step 3: Confirm and Send
  const renderConfirmStep = () => (
    <div className="space-y-4">
      <Card className="p-4">
        <h2 className="font-bold text-gray-900 mb-4">Confirm & Send</h2>
        
        {/* Prescriptions Summary */}
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500 mb-2">
            {selectedRx.length} Prescription{selectedRx.length !== 1 ? 's' : ''}
          </h3>
          <div className="space-y-2">
            {rxList.filter(rx => selectedRx.includes(rx.id)).map((rx) => (
              <div key={rx.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <Pill className="w-5 h-5 text-cyan-600" />
                <div>
                  <p className="font-medium text-gray-900">{rx.medication}</p>
                  <p className="text-sm text-gray-500">{rx.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pharmacy */}
        <div className="pt-4 border-t border-gray-100">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Sending to</h3>
          <div className="flex items-start gap-3 p-3 bg-cyan-50 rounded-xl border border-cyan-200">
            <Building className="w-5 h-5 text-cyan-600 mt-0.5" />
            <div>
              <p className="font-medium text-gray-900">{defaultPharmacy.name}</p>
              <p className="text-sm text-gray-600">{defaultPharmacy.address}</p>
              <p className="text-sm text-cyan-600 mt-1">{defaultPharmacy.phone}</p>
            </div>
          </div>
        </div>

        {/* Notification Preference */}
        <div className="pt-4 border-t border-gray-100 mt-4">
          <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
            <Bell className="w-5 h-5 text-amber-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">Ready for Pickup Notification</p>
              <p className="text-xs text-amber-600">We'll notify you when your prescription is ready</p>
            </div>
            <CheckCircle className="w-5 h-5 text-amber-600" />
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <Button 
          className="w-full" 
          size="lg"
          onClick={handleSendPrescriptions}
          disabled={isSending}
        >
          {isSending ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              <Package className="w-5 h-5" />
              Send to Pharmacy
            </>
          )}
        </Button>
        
        <Button 
          variant="secondary" 
          className="w-full"
          onClick={() => setStep(1)}
          disabled={isSending}
        >
          Back
        </Button>
      </div>
    </div>
  );

  // Step 4: Success
  const renderSuccessStep = () => (
    <div className="space-y-4">
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
          <h1 className="text-2xl font-bold mb-1" style={{ color: '#ffffff' }}>Prescriptions Sent!</h1>
          <p style={{ color: '#bbf7d0' }}>Your pharmacy has been notified</p>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-cyan-100 rounded-xl flex items-center justify-center">
            <Clock className="w-5 h-5 text-cyan-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Estimated Ready Time</h3>
            <p className="text-cyan-600 font-medium">Within 2-4 hours</p>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <h4 className="font-medium text-gray-900 mb-2">{defaultPharmacy.name}</h4>
          <p className="text-sm text-gray-600 mb-2">{defaultPharmacy.address}</p>
          <div className="flex items-center gap-4">
            <a 
              href={`tel:${defaultPharmacy.phone}`}
              className="flex items-center gap-2 text-cyan-600 text-sm font-medium"
            >
              <Phone className="w-4 h-4" />
              {defaultPharmacy.phone}
            </a>
            <button className="flex items-center gap-2 text-cyan-600 text-sm font-medium">
              <Navigation className="w-4 h-4" />
              Directions
            </button>
          </div>
        </div>

        {/* Status Timeline */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Status</h4>
          <div className="space-y-0">
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-white" />
                </div>
                <div className="w-0.5 h-8 bg-green-500" />
              </div>
              <div className="pt-1">
                <p className="font-medium text-gray-900">Sent to Pharmacy</p>
                <p className="text-sm text-gray-500">Just now</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                  <Loader className="w-4 h-4 text-white animate-spin" />
                </div>
                <div className="w-0.5 h-8 bg-gray-200" />
              </div>
              <div className="pt-1">
                <p className="font-medium text-gray-900">Being Prepared</p>
                <p className="text-sm text-gray-500">In progress</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <Package className="w-4 h-4 text-gray-400" />
                </div>
              </div>
              <div className="pt-1">
                <p className="font-medium text-gray-400">Ready for Pickup</p>
                <p className="text-sm text-gray-400">Pending</p>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* What's Next */}
      <Card className="p-4 bg-blue-50 border border-blue-200">
        <div className="flex items-start gap-3">
          <Bell className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">We'll notify you</h4>
            <p className="text-sm text-blue-700">You'll receive a notification when your prescription is ready for pickup.</p>
          </div>
        </div>
      </Card>

      <div className="space-y-3">
        <Button 
          className="w-full" 
          onClick={() => onNavigate?.('pharmacy')}
        >
          View in Pharmacy
          <ChevronRight className="w-5 h-5" />
        </Button>
        
        <Button 
          variant="secondary" 
          className="w-full"
          onClick={() => onNavigate?.('dashboard')}
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (step) {
      case 1:
        return renderReviewStep();
      case 2:
        return renderPharmacyStep();
      case 3:
        return renderConfirmStep();
      case 4:
        return renderSuccessStep();
      default:
        return renderReviewStep();
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Send Prescriptions';
      case 2: return 'Select Pharmacy';
      case 3: return 'Confirm & Send';
      case 4: return 'Prescriptions Sent';
      default: return 'Send Prescriptions';
    }
  };

  if (isDesktop) {
    return (
      <div className="max-w-lg mx-auto py-8 px-6">
        {/* Progress Indicator */}
        {step < 4 && (
          <div className="flex items-center justify-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  s === step 
                    ? 'bg-cyan-500 text-white' 
                    : s < step 
                      ? 'bg-green-500 text-white' 
                      : 'bg-gray-200 text-gray-500'
                }`}>
                  {s < step ? <Check className="w-4 h-4" /> : s}
                </div>
                {s < 3 && (
                  <div className={`w-12 h-1 rounded ${s < step ? 'bg-green-500' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}
        {renderContent()}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title={getStepTitle()}
        onBack={step > 1 && step < 4 ? () => setStep(step - 1) : onBack}
      />
      <div className="p-4 pb-24">
        {/* Mobile Progress */}
        {step < 4 && (
          <div className="flex items-center justify-center gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div 
                key={s}
                className={`h-1.5 rounded-full flex-1 max-w-[60px] ${
                  s <= step ? 'bg-cyan-500' : 'bg-gray-200'
                }`} 
              />
            ))}
          </div>
        )}
        {renderContent()}
      </div>
    </div>
  );
};

export default SendToPharmacyPage;
