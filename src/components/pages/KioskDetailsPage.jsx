import React from 'react';
import { MapPin, Clock, Phone, Mail, Star, Activity, Globe, Users, CheckCircle, Navigation, Calendar, ChevronLeft, User } from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Button, Card, Badge } from '../ui';

const KioskDetailsPage = ({ kiosk, onBack, onBookSlot, onWalkIn, onGetDirections }) => {
  const { isDesktop } = useResponsive();
  
  if (!kiosk) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Kiosk not found</p>
      </div>
    );
  }

  const getTypeColor = (type) => {
    if (type.includes('Pharmacy')) return 'bg-green-100 text-green-700';
    if (type.includes('Clinic')) return 'bg-cyan-100 text-cyan-700';
    if (type.includes('Hospital')) return 'bg-purple-100 text-purple-700';
    if (type.includes('Rural')) return 'bg-amber-100 text-amber-700';
    return 'bg-gray-100 text-gray-700';
  };

  const content = (
    <div className="space-y-6">
      {/* Hero Section */}
      <Card className="overflow-hidden">
        <div className="h-40 bg-gradient-to-r from-cyan-500 to-teal-500 flex items-center justify-center">
          <MapPin className="w-16 h-16 text-white/50" />
        </div>
        <div className="p-4">
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${getTypeColor(kiosk.type)}`}>
            {kiosk.type}
          </span>
          <h1 className="text-xl font-bold text-gray-900 mb-1">{kiosk.name}</h1>
          <p className="text-gray-500">{kiosk.address}</p>
          
          {kiosk.rating && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center gap-1">
                <span className="text-amber-500">★</span>
                <span className="font-semibold">{kiosk.rating}</span>
              </div>
              <span className="text-gray-400">•</span>
              <span className="text-sm text-gray-500">{kiosk.reviews} reviews</span>
            </div>
          )}
        </div>
      </Card>

      {/* Quick Info */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 text-center">
          <Clock className="w-6 h-6 text-cyan-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">{kiosk.wait} min</p>
          <p className="text-xs text-gray-500">Wait Time</p>
        </Card>
        <Card className="p-4 text-center">
          <Navigation className="w-6 h-6 text-cyan-500 mx-auto mb-1" />
          <p className="text-lg font-bold text-gray-900">{kiosk.distance} km</p>
          <p className="text-xs text-gray-500">Distance</p>
        </Card>
        <Card className="p-4 text-center">
          <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${kiosk.isOpen ? 'bg-green-500' : 'bg-red-500'}`} />
          <p className="text-lg font-bold text-gray-900">{kiosk.isOpen ? 'Open' : 'Closed'}</p>
          <p className="text-xs text-gray-500">Status</p>
        </Card>
      </div>

      {/* Hours & Contact */}
      <Card className="p-4 space-y-4">
        <h3 className="font-semibold text-gray-900">Hours & Contact</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <div>
              <p className="font-medium text-gray-900">{kiosk.hours}</p>
              <p className="text-sm text-cyan-600">Next available: {kiosk.nextAvailable}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <p className="text-gray-700">{kiosk.phone}</p>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <p className="text-gray-700">{kiosk.email}</p>
          </div>
        </div>
      </Card>

      {/* Services */}
      <Card className="p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Services Available</h3>
        <div className="flex flex-wrap gap-2">
          {kiosk.services.map((service, i) => (
            <span key={i} className="px-3 py-1.5 bg-cyan-50 text-cyan-700 rounded-full text-sm font-medium">
              {service}
            </span>
          ))}
        </div>
      </Card>

      {/* Providers */}
      {kiosk.providers && (
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Healthcare Providers</h3>
          <div className="space-y-2">
            {kiosk.providers.map((provider, i) => (
              <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                <div className="w-10 h-10 bg-cyan-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-cyan-600" />
                </div>
                <span className="font-medium text-gray-700">{provider}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Amenities */}
      {kiosk.amenities && (
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {kiosk.amenities.map((amenity, i) => (
              <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm">
                {amenity}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Languages */}
      {kiosk.languages && (
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Languages</h3>
          <div className="flex flex-wrap gap-2">
            {kiosk.languages.map((lang, i) => (
              <span key={i} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-sm flex items-center gap-1">
                <Globe className="w-3 h-3" />
                {lang}
              </span>
            ))}
          </div>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <Button size="lg" className="w-full" onClick={() => onBookSlot(kiosk)}>
          <Calendar className="w-5 h-5" />
          Book Appointment
        </Button>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" size="lg" onClick={() => onWalkIn(kiosk)}>
            <Clock className="w-5 h-5" />
            Walk-In Now
          </Button>
          <Button variant="secondary" size="lg" onClick={onGetDirections}>
            <Navigation className="w-5 h-5" />
            Directions
          </Button>
        </div>
      </div>
    </div>
  );

  if (isDesktop) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6">
          <ChevronLeft className="w-5 h-5" />
          Back to Kiosks
        </button>
        {content}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Kiosk Details" onBack={onBack} />
      <div className="p-4 pb-24">
        {content}
      </div>
    </div>
  );
};

// ============================================================================
// BOOK KIOSK SLOT PAGE
// ============================================================================


export default KioskDetailsPage;
