import React, { useState } from 'react';
import { 
  Globe, Share2, Link2, QrCode, Clock, Shield, ChevronRight, X, Check,
  AlertTriangle, Eye, EyeOff, Calendar, Pill, FlaskConical, FileText,
  Copy, Download, Trash2, RefreshCw, Lock, Unlock, ExternalLink,
  Smartphone, Mail, CheckCircle, AlertCircle, Timer, Zap
} from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Button } from '../ui';

const ShareRecordsPage = ({ sharedLinks = [], onBack, onCreateLink, onRevokeLink }) => {
  const { isDesktop } = useResponsive();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(null);
  const [copiedLinkId, setCopiedLinkId] = useState(null);
  const [shareForm, setShareForm] = useState({
    purpose: '',
    expiresIn: '24h',
    sections: {
      summary: true,
      conditions: true,
      allergies: true,
      medications: true,
      labResults: false,
      immunizations: true,
      surgeries: false,
      vitals: true,
    }
  });

  // Demo shared links
  const demoLinks = sharedLinks.length > 0 ? sharedLinks : [
    {
      id: 'share-1',
      code: 'EH-7K9X-M2PL',
      purpose: 'Emergency Room Visit - Toronto General',
      createdAt: '2025-12-24T10:30:00',
      expiresAt: '2025-12-25T10:30:00',
      status: 'Active',
      accessCount: 2,
      lastAccessed: '2025-12-24T14:22:00',
      sections: ['summary', 'conditions', 'allergies', 'medications', 'vitals']
    },
    {
      id: 'share-2',
      code: 'EH-3R8T-J5VN',
      purpose: 'Second Opinion - Dr. Smith (NYC)',
      createdAt: '2025-12-20T09:00:00',
      expiresAt: '2025-12-27T09:00:00',
      status: 'Active',
      accessCount: 1,
      lastAccessed: '2025-12-21T16:45:00',
      sections: ['summary', 'conditions', 'allergies', 'medications', 'labResults', 'immunizations']
    },
    {
      id: 'share-3',
      code: 'EH-9P2L-K7RM',
      purpose: 'Travel Medical - Mexico Trip',
      createdAt: '2025-12-15T08:00:00',
      expiresAt: '2025-12-22T08:00:00',
      status: 'Expired',
      accessCount: 0,
      lastAccessed: null,
      sections: ['summary', 'allergies', 'medications']
    }
  ];

  const expirationOptions = [
    { value: '1h', label: '1 Hour', description: 'Best for immediate use' },
    { value: '24h', label: '24 Hours', description: 'One day access' },
    { value: '7d', label: '7 Days', description: 'Week-long access' },
    { value: '30d', label: '30 Days', description: 'Extended access' },
  ];

  const sectionLabels = {
    summary: { label: 'Health Summary', icon: FileText, description: 'Basic info, blood type, BMI' },
    conditions: { label: 'Medical Conditions', icon: AlertCircle, description: 'Active and past conditions' },
    allergies: { label: 'Allergies', icon: AlertTriangle, description: 'Drug and food allergies' },
    medications: { label: 'Current Medications', icon: Pill, description: 'Active prescriptions' },
    labResults: { label: 'Lab Results', icon: FlaskConical, description: 'Recent test results' },
    immunizations: { label: 'Immunizations', icon: Shield, description: 'Vaccination records' },
    surgeries: { label: 'Surgical History', icon: FileText, description: 'Past procedures' },
    vitals: { label: 'Recent Vitals', icon: Zap, description: 'BP, pulse, weight' },
  };

  const statusConfig = {
    'Active': { color: 'bg-emerald-50 text-emerald-700 border border-emerald-200', borderColor: '#10b981' },
    'Expired': { color: 'bg-gray-50 text-gray-600 border border-gray-200', borderColor: '#9ca3af' },
    'Revoked': { color: 'bg-red-50 text-red-700 border border-red-200', borderColor: '#ef4444' },
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  const getTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diff = expires - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days} day${days > 1 ? 's' : ''} left`;
    if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} left`;
    return 'Less than 1 hour';
  };

  const handleCopy = (code, linkId) => {
    navigator.clipboard.writeText(`https://extendihealth.com/share/${code}`);
    setCopiedLinkId(linkId);
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  const handleCreateLink = () => {
    if (onCreateLink) {
      onCreateLink(shareForm);
    }
    // Generate demo code
    const newCode = `EH-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    setShowLinkModal({
      code: newCode,
      purpose: shareForm.purpose,
      expiresIn: shareForm.expiresIn,
    });
    setShowCreateModal(false);
  };

  const LinkCard = ({ link }) => {
    const config = statusConfig[link.status] || statusConfig['Active'];
    const isActive = link.status === 'Active';
    
    return (
      <div 
        className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100"
        style={{ borderLeftWidth: '4px', borderLeftColor: config.borderColor }}
      >
        <div className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{link.purpose || 'Shared Access'}</h3>
              <p className="text-gray-500 text-sm font-mono mt-1">{link.code}</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.color}`}>
              {link.status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm mb-3">
            <div>
              <p className="text-gray-400 text-xs">Created</p>
              <p className="text-gray-700">{formatDate(link.createdAt)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">{isActive ? 'Expires' : 'Expired'}</p>
              <p className={`${isActive ? 'text-amber-600 font-medium' : 'text-gray-500'}`}>
                {isActive ? getTimeRemaining(link.expiresAt) : formatDate(link.expiresAt)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
            <Eye className="w-4 h-4" />
            <span>Accessed {link.accessCount} time{link.accessCount !== 1 ? 's' : ''}</span>
            {link.lastAccessed && (
              <span className="text-gray-400">• Last: {formatDate(link.lastAccessed)}</span>
            )}
          </div>

          {/* Shared Sections */}
          <div className="flex flex-wrap gap-1 mb-3">
            {link.sections.map(section => (
              <span key={section} className="px-2 py-0.5 bg-gray-100 rounded text-xs text-gray-600">
                {sectionLabels[section]?.label || section}
              </span>
            ))}
          </div>

          {/* Actions */}
          {isActive && (
            <div className="flex gap-2 pt-3 border-t border-gray-100">
              <button 
                onClick={() => handleCopy(link.code, link.id)}
                className="flex-1 flex items-center justify-center gap-2 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors"
              >
                <Copy className="w-4 h-4" />
                {copiedLinkId === link.id ? 'Copied!' : 'Copy Link'}
              </button>
              <button 
                onClick={() => {
                  if (onRevokeLink) onRevokeLink(link.id);
                }}
                className="flex items-center justify-center gap-2 px-4 py-2 hover:bg-red-50 rounded-lg text-sm font-medium text-red-600 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Revoke
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  const CreateModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
        <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Share Your Records</h2>
          <button onClick={() => setShowCreateModal(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-5 space-y-5">
          {/* Purpose */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Purpose (Optional)</label>
            <input
              type="text"
              value={shareForm.purpose}
              onChange={(e) => setShareForm({ ...shareForm, purpose: e.target.value })}
              placeholder="e.g., ER Visit, Second Opinion, Travel"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <p className="text-xs text-gray-400 mt-1">Helps you remember why you shared</p>
          </div>

          {/* Expiration */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Link Expires In</label>
            <div className="grid grid-cols-2 gap-2">
              {expirationOptions.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setShareForm({ ...shareForm, expiresIn: opt.value })}
                  className={`p-3 rounded-xl border-2 text-left transition-all ${
                    shareForm.expiresIn === opt.value 
                      ? 'border-teal-500 bg-teal-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <p className={`font-semibold ${shareForm.expiresIn === opt.value ? 'text-teal-700' : 'text-gray-900'}`}>
                    {opt.label}
                  </p>
                  <p className="text-xs text-gray-500">{opt.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Sections to Share */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Information to Share</label>
            <div className="space-y-2">
              {Object.entries(sectionLabels).map(([key, { label, icon: Icon, description }]) => (
                <label 
                  key={key} 
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                    shareForm.sections[key] ? 'bg-teal-50 border border-teal-200' : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${shareForm.sections[key] ? 'text-teal-600' : 'text-gray-400'}`} />
                    <div>
                      <span className={shareForm.sections[key] ? 'text-gray-900 font-medium' : 'text-gray-700'}>{label}</span>
                      <p className="text-xs text-gray-500">{description}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={shareForm.sections[key]}
                    onChange={(e) => setShareForm({
                      ...shareForm,
                      sections: { ...shareForm.sections, [key]: e.target.checked }
                    })}
                    className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                  />
                </label>
              ))}
            </div>
          </div>

          {/* Warning */}
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <p className="text-sm text-amber-800 font-medium">Share Responsibly</p>
                <p className="text-sm text-amber-700 mt-1">
                  Only share with healthcare providers you trust. You can revoke access at any time.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" className="flex-1" onClick={() => setShowCreateModal(false)}>
              Cancel
            </Button>
            <Button 
              className="flex-1" 
              onClick={handleCreateLink}
              disabled={!Object.values(shareForm.sections).some(v => v)}
            >
              <Link2 className="w-4 h-4" />
              Create Link
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  const LinkCreatedModal = () => {
    if (!showLinkModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl">
          <div className="p-6 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Link Created!</h2>
            <p className="text-gray-500 mb-6">Share this link with your healthcare provider</p>

            {/* Link Display */}
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-xs text-gray-400 mb-1">Access Code</p>
              <p className="text-2xl font-mono font-bold text-gray-900 tracking-wider">{showLinkModal.code}</p>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-xs text-gray-400 mb-1">Full Link</p>
              <p className="text-sm font-mono text-teal-600 break-all">
                https://extendihealth.com/share/{showLinkModal.code}
              </p>
            </div>

            {/* QR Code Placeholder */}
            <div className="bg-white border-2 border-dashed border-gray-200 rounded-xl p-6 mb-6">
              <QrCode className="w-24 h-24 text-gray-300 mx-auto" />
              <p className="text-sm text-gray-400 mt-2">QR Code for easy scanning</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button 
                variant="secondary" 
                className="flex-1" 
                onClick={() => handleCopy(showLinkModal.code, 'new-link')}
              >
                <Copy className="w-4 h-4" />
                {copiedLinkId === 'new-link' ? 'Copied!' : 'Copy Link'}
              </Button>
              <Button 
                className="flex-1" 
                onClick={() => setShowLinkModal(null)}
              >
                Done
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const activeLinks = demoLinks.filter(l => l.status === 'Active');
  const expiredLinks = demoLinks.filter(l => l.status !== 'Active');

  const content = (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Share Everywhere</h1>
          <p className="text-gray-500 text-sm mt-1">Give clinicians one-time access to your records</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-teal-500 hover:bg-teal-600 rounded-lg font-semibold text-sm text-white flex items-center gap-1.5 transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share Now
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <Globe className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Access Anywhere in the World</h3>
            <p className="text-sm text-gray-600 mt-1">
              Generate a secure link that any clinician can use to view your records. Perfect for travel, emergencies, or getting a second opinion.
            </p>
          </div>
        </div>
      </div>

      {/* Active Links */}
      {activeLinks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full" />
            Active Links ({activeLinks.length})
          </h2>
          {activeLinks.map((link) => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>
      )}

      {/* Expired Links */}
      {expiredLinks.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Expired Links ({expiredLinks.length})
          </h2>
          {expiredLinks.map((link) => (
            <LinkCard key={link.id} link={link} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {demoLinks.length === 0 && (
        <div className="p-10 text-center bg-white rounded-xl border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Share2 className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">No Shared Links</h3>
          <p className="text-gray-500 text-sm mb-4">
            Create a secure link to share your health records with any clinician.
          </p>
          <Button onClick={() => setShowCreateModal(true)}>
            <Share2 className="w-4 h-4" />
            Create Share Link
          </Button>
        </div>
      )}

      {/* How It Works */}
      <div className="bg-white rounded-xl p-5 border border-gray-100">
        <h3 className="font-bold text-gray-900 mb-4">How It Works</h3>
        <div className="space-y-4">
          {[
            { step: 1, icon: Lock, title: 'Choose what to share', desc: 'Select which parts of your health record to include' },
            { step: 2, icon: Link2, title: 'Get a secure link', desc: 'We generate an encrypted link with expiration' },
            { step: 3, icon: Globe, title: 'Share with clinician', desc: 'Send the link to any healthcare provider worldwide' },
            { step: 4, icon: Eye, title: 'They view your records', desc: 'Clinician sees only what you authorized' },
          ].map(({ step, icon: Icon, title, desc }) => (
            <div key={step} className="flex items-start gap-4">
              <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-teal-700 font-bold text-sm">{step}</span>
              </div>
              <div>
                <p className="font-medium text-gray-900">{title}</p>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Note */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-gray-500 mt-0.5" />
          <div>
            <p className="text-sm text-gray-700 font-medium">End-to-End Security</p>
            <p className="text-sm text-gray-500 mt-1">
              All shared data is encrypted. Links expire automatically and can be revoked instantly.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showCreateModal && <CreateModal />}
      {showLinkModal && <LinkCreatedModal />}
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
      <Header title="Share Records" onBack={onBack} />
      <div className="p-4 pb-24">
        {content}
      </div>
    </div>
  );
};

export default ShareRecordsPage;
