import React, { useState } from 'react';
import { 
  CreditCard, DollarSign, FileText, CheckCircle, Clock, AlertCircle,
  ChevronRight, X, Download, Calendar, Building, Receipt, Shield,
  Plus, Search, Filter, TrendingUp, Wallet, BadgeCheck, ExternalLink
} from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Button } from '../ui';

const BillingPage = ({ bills = [], insurance = null, onBack, onPayBill, onViewClaim }) => {
  const { isDesktop } = useResponsive();
  const [filter, setFilter] = useState('all');
  const [selectedBill, setSelectedBill] = useState(null);
  const [activeTab, setActiveTab] = useState('bills'); // bills, claims, insurance

  // Demo data if none provided
  const demoBills = bills.length > 0 ? bills : [
    {
      id: 'bill-1',
      type: 'Visit',
      description: 'Office Visit - Dr. Michelle Chen',
      date: '2025-12-15',
      amount: 45.00,
      insurancePaid: 135.00,
      patientResponsibility: 45.00,
      status: 'Paid',
      paymentDate: '2025-12-18',
      paymentMethod: 'Visa ****4532',
      provider: 'ExtendiHealth Family Medicine',
      serviceCode: 'A003A'
    },
    {
      id: 'bill-2',
      type: 'Lab Work',
      description: 'Complete Blood Count (CBC)',
      date: '2025-12-09',
      amount: 0,
      insurancePaid: 85.00,
      patientResponsibility: 0,
      status: 'Covered',
      provider: 'LifeLabs Toronto',
      serviceCode: 'L700A'
    },
    {
      id: 'bill-3',
      type: 'Prescription',
      description: 'Lisinopril 10mg - 90 day supply',
      date: '2025-12-01',
      amount: 12.50,
      insurancePaid: 37.50,
      patientResponsibility: 12.50,
      status: 'Paid',
      paymentDate: '2025-12-01',
      paymentMethod: 'Debit ****8891',
      provider: 'Shoppers Drug Mart',
      serviceCode: 'RX001'
    },
    {
      id: 'bill-4',
      type: 'Specialist',
      description: 'Cardiology Consultation - Dr. Emily Wang',
      date: '2025-11-28',
      amount: 75.00,
      insurancePaid: 225.00,
      patientResponsibility: 75.00,
      status: 'Due',
      dueDate: '2025-12-28',
      provider: 'Toronto Heart Clinic',
      serviceCode: 'A604A'
    },
    {
      id: 'bill-5',
      type: 'Imaging',
      description: 'Chest X-Ray',
      date: '2025-11-10',
      amount: 25.00,
      insurancePaid: 125.00,
      patientResponsibility: 25.00,
      status: 'Overdue',
      dueDate: '2025-12-10',
      provider: 'Ontario Diagnostic Imaging',
      serviceCode: 'X090A'
    }
  ];

  const demoClaims = [
    {
      id: 'claim-1',
      claimNumber: 'CLM-2025-001234',
      serviceDate: '2025-12-15',
      submittedDate: '2025-12-16',
      provider: 'ExtendiHealth Family Medicine',
      service: 'Office Visit',
      billedAmount: 180.00,
      approvedAmount: 180.00,
      insurancePaid: 135.00,
      patientResponsibility: 45.00,
      status: 'Processed',
      eob: true
    },
    {
      id: 'claim-2',
      claimNumber: 'CLM-2025-001198',
      serviceDate: '2025-12-09',
      submittedDate: '2025-12-10',
      provider: 'LifeLabs Toronto',
      service: 'Laboratory Services',
      billedAmount: 85.00,
      approvedAmount: 85.00,
      insurancePaid: 85.00,
      patientResponsibility: 0,
      status: 'Processed',
      eob: true
    },
    {
      id: 'claim-3',
      claimNumber: 'CLM-2025-001156',
      serviceDate: '2025-11-28',
      submittedDate: '2025-11-29',
      provider: 'Toronto Heart Clinic',
      service: 'Specialist Consultation',
      billedAmount: 300.00,
      approvedAmount: 300.00,
      insurancePaid: 225.00,
      patientResponsibility: 75.00,
      status: 'Processed',
      eob: true
    },
    {
      id: 'claim-4',
      claimNumber: 'CLM-2025-001089',
      serviceDate: '2025-11-10',
      submittedDate: '2025-11-11',
      provider: 'Ontario Diagnostic Imaging',
      service: 'Diagnostic Imaging',
      billedAmount: 150.00,
      approvedAmount: 150.00,
      insurancePaid: 125.00,
      patientResponsibility: 25.00,
      status: 'Processed',
      eob: true
    }
  ];

  const demoInsurance = insurance || {
    provider: 'Sun Life Financial',
    policyNumber: 'SLF-98765432',
    groupNumber: 'GRP-EMP-2025',
    memberId: 'MBR-123456789',
    effectiveDate: '2025-01-01',
    planType: 'Extended Health Care',
    coverage: {
      medical: { limit: 50000, used: 1250, remaining: 48750 },
      dental: { limit: 2500, used: 350, remaining: 2150 },
      vision: { limit: 500, used: 0, remaining: 500 },
      prescription: { limit: 5000, used: 450, remaining: 4550 }
    },
    deductible: { annual: 500, met: 500 },
    coinsurance: 75
  };

  const statusConfig = {
    'Paid': { color: 'bg-emerald-50 text-emerald-700 border border-emerald-200', borderColor: '#10b981' },
    'Covered': { color: 'bg-teal-50 text-teal-700 border border-teal-200', borderColor: '#14b8a6' },
    'Due': { color: 'bg-amber-50 text-amber-700 border border-amber-200', borderColor: '#f59e0b' },
    'Overdue': { color: 'bg-red-50 text-red-700 border border-red-200', borderColor: '#ef4444' },
    'Processing': { color: 'bg-blue-50 text-blue-700 border border-blue-200', borderColor: '#3b82f6' },
    'Processed': { color: 'bg-emerald-50 text-emerald-700 border border-emerald-200', borderColor: '#10b981' },
    'Pending': { color: 'bg-amber-50 text-amber-700 border border-amber-200', borderColor: '#f59e0b' },
    'Denied': { color: 'bg-red-50 text-red-700 border border-red-200', borderColor: '#ef4444' }
  };

  const filteredBills = demoBills.filter(bill => {
    if (filter === 'all') return true;
    if (filter === 'due') return bill.status === 'Due' || bill.status === 'Overdue';
    if (filter === 'paid') return bill.status === 'Paid' || bill.status === 'Covered';
    return true;
  });

  const totalDue = demoBills
    .filter(b => b.status === 'Due' || b.status === 'Overdue')
    .reduce((sum, b) => sum + b.patientResponsibility, 0);

  const formatCurrency = (amount) => `$${amount.toFixed(2)}`;

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const BillCard = ({ bill }) => {
    const config = statusConfig[bill.status] || statusConfig['Due'];
    
    return (
      <div 
        className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all border border-gray-100"
        style={{ borderLeftWidth: '4px', borderLeftColor: config.borderColor }}
        onClick={() => setSelectedBill(bill)}
      >
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-gray-900">{bill.description}</h3>
              <p className="text-gray-500 text-sm">{bill.provider}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
              {bill.status}
            </span>
          </div>
          
          <p className="text-gray-400 text-sm mb-3">
            Service Date: {formatDate(bill.date)}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Insurance paid: <span className="text-gray-700 font-medium">{formatCurrency(bill.insurancePaid)}</span>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Your responsibility</p>
              <p className={`text-lg font-bold ${
                bill.patientResponsibility === 0 ? 'text-emerald-600' : 
                bill.status === 'Overdue' ? 'text-red-600' : 'text-gray-900'
              }`}>
                {bill.patientResponsibility === 0 ? 'Fully Covered' : formatCurrency(bill.patientResponsibility)}
              </p>
            </div>
          </div>

          {(bill.status === 'Due' || bill.status === 'Overdue') && (
            <div className="mt-3 flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-100">
              <span className="text-sm font-medium text-amber-700">
                Due: {formatDate(bill.dueDate)}
              </span>
              <button 
                onClick={(e) => { e.stopPropagation(); if (onPayBill) onPayBill(bill); }}
                className="px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Pay Now
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const ClaimCard = ({ claim }) => {
    const config = statusConfig[claim.status] || statusConfig['Processing'];
    
    return (
      <div 
        className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all border border-gray-100"
        style={{ borderLeftWidth: '4px', borderLeftColor: config.borderColor }}
      >
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-bold text-gray-900">{claim.service}</h3>
              <p className="text-gray-500 text-sm">{claim.provider}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
              {claim.status}
            </span>
          </div>
          
          <p className="text-gray-400 text-sm mb-3">
            Claim #: {claim.claimNumber}
          </p>
          
          <div className="grid grid-cols-3 gap-2 text-sm mb-3">
            <div>
              <p className="text-gray-400 text-xs">Billed</p>
              <p className="font-semibold text-gray-900">{formatCurrency(claim.billedAmount)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Insurance</p>
              <p className="font-semibold text-emerald-600">{formatCurrency(claim.insurancePaid)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">You Owe</p>
              <p className="font-semibold text-gray-900">{formatCurrency(claim.patientResponsibility)}</p>
            </div>
          </div>

          {claim.eob && (
            <button className="w-full flex items-center justify-center gap-2 p-2 bg-gray-50 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors">
              <FileText className="w-4 h-4" />
              View Explanation of Benefits
            </button>
          )}
        </div>
      </div>
    );
  };

  const InsuranceCard = () => (
    <div className="space-y-4">
      {/* Insurance Info Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-teal-500 to-teal-600 p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{demoInsurance.provider}</h3>
              <p className="text-teal-100 text-sm">{demoInsurance.planType}</p>
            </div>
          </div>
        </div>
        <div className="p-4 space-y-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Policy Number</p>
              <p className="font-semibold text-gray-900">{demoInsurance.policyNumber}</p>
            </div>
            <div>
              <p className="text-gray-400">Member ID</p>
              <p className="font-semibold text-gray-900">{demoInsurance.memberId}</p>
            </div>
            <div>
              <p className="text-gray-400">Group Number</p>
              <p className="font-semibold text-gray-900">{demoInsurance.groupNumber}</p>
            </div>
            <div>
              <p className="text-gray-400">Effective Date</p>
              <p className="font-semibold text-gray-900">{formatDate(demoInsurance.effectiveDate)}</p>
            </div>
          </div>
          
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Annual Deductible</span>
              <span className="text-sm font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" />
                Met ({formatCurrency(demoInsurance.deductible.met)}/{formatCurrency(demoInsurance.deductible.annual)})
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Coinsurance</span>
              <span className="text-sm font-semibold text-gray-900">{demoInsurance.coinsurance}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Coverage Breakdown */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 className="font-bold text-gray-900 mb-4">Coverage Breakdown</h3>
        <div className="space-y-4">
          {Object.entries(demoInsurance.coverage).map(([type, data]) => {
            const percentage = (data.used / data.limit) * 100;
            return (
              <div key={type}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700 capitalize">{type}</span>
                  <span className="text-sm text-gray-500">
                    {formatCurrency(data.remaining)} remaining
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-500 rounded-full transition-all"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {formatCurrency(data.used)} of {formatCurrency(data.limit)} used
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <h3 className="font-bold text-gray-900 mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="flex items-center gap-2 text-gray-700">
              <CreditCard className="w-5 h-5 text-gray-400" />
              View ID Card
            </span>
            <ExternalLink className="w-4 h-4 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="flex items-center gap-2 text-gray-700">
              <FileText className="w-5 h-5 text-gray-400" />
              Download Benefits Summary
            </span>
            <Download className="w-4 h-4 text-gray-400" />
          </button>
          <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <span className="flex items-center gap-2 text-gray-700">
              <Receipt className="w-5 h-5 text-gray-400" />
              Submit a Claim
            </span>
            <Plus className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </div>
  );

  const content = (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Billing & Insurance</h1>
        {totalDue > 0 && (
          <div className="text-right">
            <p className="text-xs text-gray-400">Amount Due</p>
            <p className="text-xl font-bold text-amber-600">{formatCurrency(totalDue)}</p>
          </div>
        )}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { key: 'bills', label: 'Bills', icon: Receipt },
          { key: 'claims', label: 'Claims', icon: FileText },
          { key: 'insurance', label: 'Insurance', icon: Shield },
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
      {activeTab === 'bills' && (
        <>
          {/* Filter Pills */}
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'due', label: 'Due' },
              { key: 'paid', label: 'Paid' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  filter === key 
                    ? 'bg-gray-900 text-white' 
                    : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Bills List */}
          {filteredBills.length > 0 ? (
            <div className="space-y-4">
              {filteredBills.map((bill) => (
                <BillCard key={bill.id} bill={bill} />
              ))}
            </div>
          ) : (
            <div className="p-10 text-center bg-white rounded-xl border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Receipt className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">No Bills Found</h3>
              <p className="text-gray-500 text-sm">You don't have any bills in this category.</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'claims' && (
        <div className="space-y-4">
          {demoClaims.map((claim) => (
            <ClaimCard key={claim.id} claim={claim} />
          ))}
        </div>
      )}

      {activeTab === 'insurance' && <InsuranceCard />}

      {/* Bill Detail Modal */}
      {selectedBill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Bill Details</h2>
              <button onClick={() => setSelectedBill(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <h3 className="font-bold text-gray-900 text-lg">{selectedBill.description}</h3>
                <p className="text-gray-500">{selectedBill.provider}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Service Date</span>
                  <span className="font-semibold text-gray-900">{formatDate(selectedBill.date)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Service Code</span>
                  <span className="font-semibold text-gray-900">{selectedBill.serviceCode}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Total Billed</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(selectedBill.amount + selectedBill.insurancePaid)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Insurance Paid</span>
                  <span className="font-semibold text-emerald-600">-{formatCurrency(selectedBill.insurancePaid)}</span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-gray-200">
                  <span className="font-semibold text-gray-900">Your Responsibility</span>
                  <span className="font-bold text-gray-900">{formatCurrency(selectedBill.patientResponsibility)}</span>
                </div>
              </div>

              {selectedBill.paymentDate && (
                <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-semibold">Paid on {formatDate(selectedBill.paymentDate)}</span>
                  </div>
                  <p className="text-emerald-600 text-sm mt-1">via {selectedBill.paymentMethod}</p>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <Button variant="secondary" className="flex-1" onClick={() => setSelectedBill(null)}>
                  Close
                </Button>
                {(selectedBill.status === 'Due' || selectedBill.status === 'Overdue') && (
                  <Button className="flex-1" onClick={() => {
                    if (onPayBill) onPayBill(selectedBill);
                    setSelectedBill(null);
                  }}>
                    <CreditCard className="w-4 h-4" />
                    Pay {formatCurrency(selectedBill.patientResponsibility)}
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
      <Header title="Billing & Insurance" onBack={onBack} />
      <div className="p-4 pb-24">
        {content}
      </div>
    </div>
  );
};

export default BillingPage;
