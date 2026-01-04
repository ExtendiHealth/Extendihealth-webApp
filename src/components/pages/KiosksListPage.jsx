import React, { useState } from 'react';
import { MapPin, Clock, Activity, Search, Filter, ChevronDown } from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Card, Badge } from '../ui';
import { KIOSKS } from '../../data/constants';

const KiosksListPage = ({ onBack, onSelectKiosk, onBookSlot, selectedFilter = 'all' }) => {
  const { isDesktop } = useResponsive();
  const [filter, setFilter] = useState(selectedFilter);
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const filterOptions = [
    { id: 'all', label: 'All Types' },
    { id: 'pharmacy', label: 'Pharmacy' },
    { id: 'clinic', label: 'Clinic' },
    { id: 'hospital', label: 'Hospital' },
    { id: 'rural', label: 'Rural' },
  ];

  const filteredKiosks = KIOSKS.filter(kiosk => {
    const matchesFilter = filter === 'all' || kiosk.type.toLowerCase().includes(filter);
    const matchesSearch = !searchQuery || 
      kiosk.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      kiosk.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getTypeColor = (type) => {
    if (type.includes('Pharmacy')) return 'bg-green-100 text-green-700';
    if (type.includes('Clinic')) return 'bg-cyan-100 text-cyan-700';
    if (type.includes('Hospital')) return 'bg-purple-100 text-purple-700';
    if (type.includes('Rural')) return 'bg-amber-100 text-amber-700';
    return 'bg-gray-100 text-gray-700';
  };

  // Mobile-optimized Kiosk Card
  const MobileKioskCard = ({ kiosk }) => (
    <Card className="p-4 border border-gray-200">
      {/* Header Row */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-gray-900 text-base leading-tight flex-1">
          {kiosk.name}
        </h3>
        {kiosk.rating && (
          <div className="flex items-center gap-1 text-sm flex-shrink-0">
            <span className="text-amber-500">★</span>
            <span className="font-medium">{kiosk.rating}</span>
          </div>
        )}
      </div>
      
      {/* Type Badge */}
      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mb-3 ${getTypeColor(kiosk.type)}`}>
        {kiosk.type}
      </span>

      {/* Info Stack */}
      <div className="space-y-1.5 text-sm text-gray-600 mb-3">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
          <span className="line-clamp-1">{kiosk.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <span>
            {kiosk.distance} km • 
            <span className={kiosk.isOpen ? 'text-green-600 ml-1' : 'text-red-600 ml-1'}>
              {kiosk.isOpen ? 'Open' : 'Closed'}
            </span>
            <span className="text-gray-400 ml-1">• {kiosk.hours}</span>
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-500 flex-shrink-0" />
          <span className="text-cyan-600 font-medium text-xs">{kiosk.walkInStatus}</span>
        </div>
      </div>

      {/* Services - Horizontal scroll on mobile */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
        {kiosk.services.map((service, i) => (
          <span key={i} className="px-2 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs whitespace-nowrap flex-shrink-0">
            {service}
          </span>
        ))}
      </div>

      {/* Action Buttons - Stack on very small screens */}
      <div className="grid grid-cols-2 gap-2">
        <button 
          onClick={() => onSelectKiosk(kiosk)}
          className="px-3 py-2.5 border-2 border-cyan-500 text-cyan-600 font-semibold rounded-xl hover:bg-cyan-50 transition-colors text-sm"
        >
          View Details
        </button>
        <button 
          onClick={() => onBookSlot(kiosk)}
          className="px-3 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm"
        >
          Book Slot
        </button>
      </div>
    </Card>
  );

  // Desktop Kiosk Card
  const DesktopKioskCard = ({ kiosk }) => (
    <Card className="p-5 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-gray-900 text-lg">{kiosk.name}</h3>
        {kiosk.rating && (
          <div className="flex items-center gap-1 text-sm">
            <span className="text-amber-500">★</span>
            <span className="font-medium">{kiosk.rating}</span>
          </div>
        )}
      </div>
      
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${getTypeColor(kiosk.type)}`}>
        {kiosk.type}
      </span>

      <div className="space-y-2 text-sm text-gray-600 mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{kiosk.address}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{kiosk.distance} km • {kiosk.isOpen ? <span className="text-green-600">Open</span> : <span className="text-red-600">Closed</span>} • {kiosk.hours}</span>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-500" />
          <span className="text-cyan-600 font-medium">{kiosk.walkInStatus}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-1 mb-4">
        {kiosk.services.slice(0, 3).map((service, i) => (
          <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
            {service}
          </span>
        ))}
        {kiosk.services.length > 3 && (
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
            +{kiosk.services.length - 3} more
          </span>
        )}
      </div>

      <div className="flex gap-3">
        <button 
          onClick={() => onSelectKiosk(kiosk)}
          className="flex-1 px-4 py-2.5 border-2 border-cyan-500 text-cyan-600 font-semibold rounded-xl hover:bg-cyan-50 transition-colors text-sm"
        >
          View Details
        </button>
        <button 
          onClick={() => onBookSlot(kiosk)}
          className="flex-1 px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm"
        >
          Book Slot
        </button>
      </div>
    </Card>
  );

  // Mobile Content
  const mobileContent = (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search kiosks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none bg-white text-base"
        />
      </div>

      {/* Count & View Toggle Row */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">{filteredKiosks.length} kiosks found</span>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              viewMode === 'map' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500'
            }`}
          >
            Map
          </button>
        </div>
      </div>

      {/* Filter Pills - Horizontal Scroll */}
      <div className="relative -mx-4 px-4">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0 ${
                filter === opt.id 
                  ? 'bg-cyan-500 text-white shadow-md' 
                  : 'bg-white border border-gray-200 text-gray-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map View Placeholder */}
      {viewMode === 'map' && (
        <Card className="h-64 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border border-gray-200">
          <div className="text-center text-gray-500">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
              <MapPin className="w-7 h-7 text-cyan-500" />
            </div>
            <p className="font-semibold text-gray-700">Map View</p>
            <p className="text-xs">Interactive map coming soon</p>
          </div>
        </Card>
      )}

      {/* Kiosks List */}
      {viewMode === 'list' && (
        <div className="space-y-3">
          {filteredKiosks.map((kiosk) => (
            <MobileKioskCard key={kiosk.id} kiosk={kiosk} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredKiosks.length === 0 && (
        <Card className="p-8 text-center border border-gray-200">
          <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <MapPin className="w-7 h-7 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">No Kiosks Found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your filters or search.</p>
        </Card>
      )}
    </div>
  );

  // Desktop Content
  const desktopContent = (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search kiosks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none bg-white"
        />
      </div>

      {/* View Toggle & Count */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          {filteredKiosks.length} kiosks found
        </div>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setViewMode('map')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              viewMode === 'map' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Map View
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
              viewMode === 'list' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            List View
          </button>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 flex-wrap">
        {filterOptions.map((opt) => (
          <button
            key={opt.id}
            onClick={() => setFilter(opt.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filter === opt.id 
                ? 'bg-cyan-500 text-white shadow-md' 
                : 'bg-white border border-gray-200 text-gray-600 hover:border-cyan-300 hover:text-cyan-600'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Map View Placeholder */}
      {viewMode === 'map' && (
        <Card className="h-80 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center border border-gray-200">
          <div className="text-center text-gray-500">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
              <MapPin className="w-8 h-8 text-cyan-500" />
            </div>
            <p className="font-semibold text-gray-700">Map View</p>
            <p className="text-sm">Interactive map coming soon</p>
          </div>
        </Card>
      )}

      {/* Kiosks Grid */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-2 gap-4">
          {filteredKiosks.map((kiosk) => (
            <DesktopKioskCard key={kiosk.id} kiosk={kiosk} />
          ))}
        </div>
      )}

      {filteredKiosks.length === 0 && (
        <Card className="p-12 text-center border border-gray-200">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">No Kiosks Found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your filters or search.</p>
        </Card>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <div className="max-w-5xl mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kiosks Near You</h1>
            <p className="text-gray-500 mt-1">Find and book appointments at nearby health kiosks</p>
          </div>
        </div>
        {desktopContent}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Kiosks Near You" onBack={onBack} />
      <div className="p-4 pb-24">
        {mobileContent}
      </div>
    </div>
  );
};

export default KiosksListPage;
