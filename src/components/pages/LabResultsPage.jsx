import React, { useState } from 'react';
import { 
  FlaskConical, Clock, CheckCircle, AlertTriangle, ChevronRight, 
  Calendar, MapPin, X, Download, FileText, TrendingUp, TrendingDown,
  Minus, Search, AlertCircle, User, Building, Activity
} from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Card, Badge, Button } from '../ui';

const LabResultsPage = ({ labResults = [], onBack }) => {
  const { isDesktop } = useResponsive();
  const [selectedResult, setSelectedResult] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const statusConfig = {
    'Completed': { 
      color: 'bg-teal-50 text-teal-700 border border-teal-200', 
      borderColor: '#14b8a6',
      label: 'Completed'
    },
    'Pending Collection': { 
      color: 'bg-amber-50 text-amber-700 border border-amber-200', 
      borderColor: '#f59e0b',
      label: 'Pending Collection'
    },
    'Processing': { 
      color: 'bg-blue-50 text-blue-700 border border-blue-200', 
      borderColor: '#3b82f6',
      label: 'Processing'
    },
    'Cancelled': { 
      color: 'bg-red-50 text-red-700 border border-red-200', 
      borderColor: '#ef4444',
      label: 'Cancelled'
    },
  };

  const resultStatusConfig = {
    'normal': { color: 'text-emerald-600 bg-emerald-50 border-emerald-200', icon: CheckCircle },
    'high': { color: 'text-red-600 bg-red-50 border-red-200', icon: TrendingUp },
    'low': { color: 'text-amber-600 bg-amber-50 border-amber-200', icon: TrendingDown },
    'critical': { color: 'text-red-700 bg-red-100 border-red-300', icon: AlertTriangle },
  };

  const filteredResults = labResults
    .filter(result => {
      if (filter === 'all') return true;
      if (filter === 'completed') return result.status === 'Completed';
      if (filter === 'pending') return result.status === 'Pending Collection' || result.status === 'Processing';
      if (filter === 'abnormal') return result.results?.some(r => r.status !== 'normal');
      return true;
    })
    .filter(result => 
      result.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const completedResults = labResults.filter(r => r.status === 'Completed');
  const pendingResults = labResults.filter(r => r.status === 'Pending Collection' || r.status === 'Processing');
  const abnormalResults = labResults.filter(r => r.results?.some(item => item.status !== 'normal'));

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const ResultCard = ({ result }) => {
    const hasAbnormal = result.results?.some(r => r.status !== 'normal');
    const config = statusConfig[result.status] || statusConfig['Completed'];
    
    // Use amber/orange border for abnormal results
    const borderColor = result.status === 'Completed' && hasAbnormal ? '#f59e0b' : config.borderColor;
    
    return (
      <div 
        className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all border border-gray-100"
        style={{ borderLeftWidth: '4px', borderLeftColor: borderColor }}
        onClick={() => setSelectedResult(result)}
      >
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{result.name}</h3>
              <p className="text-gray-500 text-sm">{result.facility}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
              {config.label}
            </span>
          </div>
          
          <p className="text-gray-600 text-sm mb-3">
            {result.reason || 'Routine lab work'}
          </p>
          
          <p className="text-gray-400 text-sm mb-2">
            Ordered: {formatDate(result.orderDate)} • By: {result.orderedBy}
          </p>

          {result.status === 'Completed' && result.results && (
            <div className="flex flex-wrap gap-2 mt-3">
              {hasAbnormal ? (
                result.results.filter(r => r.status !== 'normal').slice(0, 3).map((r, i) => (
                  <span key={i} className={`px-2 py-1 rounded-lg text-xs font-semibold border ${resultStatusConfig[r.status]?.color}`}>
                    {r.name}: {r.status === 'high' ? '↑' : '↓'} {r.value}
                  </span>
                ))
              ) : (
                <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-lg text-xs font-semibold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  All Results Normal
                </span>
              )}
            </div>
          )}

          {result.status === 'Pending Collection' && result.collectionLocation && (
            <div className="mt-3 p-3 bg-teal-50 rounded-lg flex items-center gap-2 border border-teal-100">
              <Calendar className="w-4 h-4 text-teal-600" />
              <span className="text-sm font-medium text-teal-700">
                Collection at: {result.collectionLocation}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  const content = (
    <div className="space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-900">Lab Results</h1>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'All', count: labResults.length },
          { key: 'completed', label: 'Completed', count: completedResults.length },
          { key: 'pending', label: 'Pending', count: pendingResults.length },
          { key: 'abnormal', label: 'Abnormal', count: abnormalResults.length },
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
          placeholder="Search lab results..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-gray-900 placeholder-gray-400"
        />
      </div>

      {/* Results List */}
      {filteredResults.length > 0 ? (
        <div className="space-y-4">
          {filteredResults.map((result) => (
            <ResultCard key={result.id} result={result} />
          ))}
        </div>
      ) : (
        <div className="p-10 text-center bg-white rounded-xl border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FlaskConical className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">No Lab Results Found</h3>
          <p className="text-gray-500 text-sm">
            {searchQuery ? 'Try a different search term' : 'You don\'t have any lab results in this category.'}
          </p>
        </div>
      )}

      {/* Result Detail Modal */}
      {selectedResult && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
            <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Lab Result Details</h2>
              <button onClick={() => setSelectedResult(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              {/* Header */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{selectedResult.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig[selectedResult.status]?.color}`}>
                    {selectedResult.status}
                  </span>
                </div>
                <p className="text-gray-500">{selectedResult.facility}</p>
              </div>

              {/* Dates */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Ordered</p>
                    <p className="font-semibold text-gray-900">{formatDate(selectedResult.orderDate)}</p>
                  </div>
                  {selectedResult.collectionDate && (
                    <div>
                      <p className="text-gray-500">Collected</p>
                      <p className="font-semibold text-gray-900">{formatDate(selectedResult.collectionDate)}</p>
                    </div>
                  )}
                  {selectedResult.resultDate && (
                    <div>
                      <p className="text-gray-500">Results Ready</p>
                      <p className="font-semibold text-gray-900">{formatDate(selectedResult.resultDate)}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-gray-500">Ordered By</p>
                    <p className="font-semibold text-gray-900">{selectedResult.orderedBy}</p>
                  </div>
                </div>
              </div>

              {/* Results Table */}
              {selectedResult.results && selectedResult.results.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Test Results</h4>
                  <div className="space-y-2">
                    {selectedResult.results.map((item, i) => {
                      const StatusIcon = resultStatusConfig[item.status]?.icon || CheckCircle;
                      const isAbnormal = item.status !== 'normal';
                      return (
                        <div 
                          key={i} 
                          className={`p-3 rounded-lg border ${
                            isAbnormal ? resultStatusConfig[item.status]?.color : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900">{item.name}</p>
                              <p className="text-xs text-gray-500">Reference: {item.range} {item.unit}</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <p className={`text-lg font-bold ${
                                item.status === 'normal' ? 'text-gray-900' : 
                                item.status === 'high' ? 'text-red-600' : 
                                item.status === 'low' ? 'text-amber-600' : 'text-red-700'
                              }`}>
                                {item.value}
                                <span className="text-sm font-normal text-gray-500 ml-1">{item.unit}</span>
                              </p>
                              <StatusIcon className={`w-5 h-5 ${
                                item.status === 'normal' ? 'text-emerald-500' : 
                                item.status === 'high' ? 'text-red-500' : 
                                item.status === 'low' ? 'text-amber-500' : 'text-red-600'
                              }`} />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Interpretation */}
              {selectedResult.interpretation && (
                <div className="bg-teal-50 rounded-xl p-4 border border-teal-100">
                  <h4 className="font-semibold text-teal-800 mb-2">Interpretation</h4>
                  <p className="text-teal-700 text-sm">{selectedResult.interpretation}</p>
                </div>
              )}

              {/* Doctor Comments */}
              {selectedResult.doctorComments && (
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h4 className="font-semibold text-blue-800 mb-2">Doctor's Notes</h4>
                  <p className="text-blue-700 text-sm">{selectedResult.doctorComments}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button variant="secondary" className="flex-1" onClick={() => setSelectedResult(null)}>
                  Close
                </Button>
                {selectedResult.status === 'Completed' && (
                  <Button className="flex-1">
                    <Download className="w-4 h-4" />
                    Download PDF
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
      <Header title="Lab Results" onBack={onBack} />
      <div className="p-4 pb-24">
        {content}
      </div>
    </div>
  );
};

export default LabResultsPage;
