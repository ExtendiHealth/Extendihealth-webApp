import React, { useState } from 'react';
import { 
  Users, UserPlus, Mail, Clock, Shield, ChevronRight, X, Check,
  AlertTriangle, Eye, EyeOff, Calendar, Pill, FlaskConical, FileText,
  MessageSquare, CreditCard, Settings, Trash2, Edit, Send, UserCheck,
  Baby, Heart, User, MoreVertical, ArrowRight, ArrowLeft, CheckCircle,
  Sparkles
} from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Button } from '../ui';

const FamilyAccessPage = ({ familyMembers = [], onBack, onInvite, onRemove, onUpdatePermissions }) => {
  const { isDesktop } = useResponsive();
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [inviteStep, setInviteStep] = useState(1);
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    email: '',
    name: '',
    relationship: '',
    permissions: {
      viewAppointments: true,
      viewMedications: true,
      viewLabResults: true,
      viewRecords: true,
      bookAppointments: false,
      messageProviders: false,
      viewBilling: false,
    }
  });

  // Demo data
  const demoMembers = familyMembers.length > 0 ? familyMembers : [
    {
      id: 'fm-1',
      name: 'Sarah Chen',
      email: 'sarah.chen@email.com',
      relationship: 'Spouse',
      status: 'Active',
      invitedDate: '2025-06-15',
      lastAccess: '2025-12-24',
      avatar: null,
      permissions: {
        viewAppointments: true,
        viewMedications: true,
        viewLabResults: true,
        viewRecords: true,
        bookAppointments: true,
        messageProviders: true,
        viewBilling: true,
      }
    },
    {
      id: 'fm-2',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      relationship: 'Adult Child',
      status: 'Active',
      invitedDate: '2025-09-01',
      lastAccess: '2025-12-20',
      avatar: null,
      permissions: {
        viewAppointments: true,
        viewMedications: true,
        viewLabResults: false,
        viewRecords: false,
        bookAppointments: true,
        messageProviders: false,
        viewBilling: false,
      }
    },
    {
      id: 'fm-3',
      name: 'Jennifer Wong',
      email: 'j.wong@email.com',
      relationship: 'Caregiver',
      status: 'Pending',
      invitedDate: '2025-12-20',
      lastAccess: null,
      avatar: null,
      permissions: {
        viewAppointments: true,
        viewMedications: true,
        viewLabResults: true,
        viewRecords: false,
        bookAppointments: false,
        messageProviders: false,
        viewBilling: false,
      }
    }
  ];

  const relationshipOptions = [
    { value: 'spouse', label: 'Spouse / Partner', icon: Heart, color: 'text-pink-600 bg-pink-50', description: 'Your husband, wife, or partner' },
    { value: 'parent', label: 'Parent', icon: Users, color: 'text-blue-600 bg-blue-50', description: 'Your mother or father' },
    { value: 'adult-child', label: 'Adult Child', icon: User, color: 'text-indigo-600 bg-indigo-50', description: 'Your son or daughter (18+)' },
    { value: 'child', label: 'Child (Minor)', icon: Baby, color: 'text-amber-600 bg-amber-50', description: 'Your child under 18' },
    { value: 'sibling', label: 'Sibling', icon: Users, color: 'text-teal-600 bg-teal-50', description: 'Your brother or sister' },
    { value: 'caregiver', label: 'Caregiver', icon: UserCheck, color: 'text-emerald-600 bg-emerald-50', description: 'Professional or family caregiver' },
    { value: 'other', label: 'Other', icon: User, color: 'text-gray-600 bg-gray-50', description: 'Other trusted person' },
  ];

  const relationshipConfig = {
    'Spouse': { icon: Heart, color: 'text-pink-600 bg-pink-50' },
    'Parent': { icon: Users, color: 'text-blue-600 bg-blue-50' },
    'Adult Child': { icon: User, color: 'text-indigo-600 bg-indigo-50' },
    'Child': { icon: Baby, color: 'text-amber-600 bg-amber-50' },
    'Sibling': { icon: Users, color: 'text-teal-600 bg-teal-50' },
    'Caregiver': { icon: UserCheck, color: 'text-emerald-600 bg-emerald-50' },
    'Other': { icon: User, color: 'text-gray-600 bg-gray-50' },
  };

  const permissionLabels = {
    viewAppointments: { label: 'View Appointments', icon: Calendar, description: 'See upcoming and past appointments' },
    viewMedications: { label: 'View Medications', icon: Pill, description: 'See current prescriptions' },
    viewLabResults: { label: 'View Lab Results', icon: FlaskConical, description: 'Access test results' },
    viewRecords: { label: 'View Health Records', icon: FileText, description: 'See medical history' },
    bookAppointments: { label: 'Book Appointments', icon: Calendar, description: 'Schedule visits on your behalf' },
    messageProviders: { label: 'Message Providers', icon: MessageSquare, description: 'Contact your care team' },
    viewBilling: { label: 'View Billing', icon: CreditCard, description: 'See bills and insurance' },
  };

  const statusConfig = {
    'Active': { color: 'bg-emerald-50 text-emerald-700 border border-emerald-200', dot: 'bg-emerald-500' },
    'Pending': { color: 'bg-amber-50 text-amber-700 border border-amber-200', dot: 'bg-amber-500' },
    'Expired': { color: 'bg-gray-50 text-gray-600 border border-gray-200', dot: 'bg-gray-400' },
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Never';
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const resetInviteForm = () => {
    setInviteStep(1);
    setInviteSuccess(false);
    setInviteForm({
      email: '',
      name: '',
      relationship: '',
      permissions: {
        viewAppointments: true,
        viewMedications: true,
        viewLabResults: true,
        viewRecords: true,
        bookAppointments: false,
        messageProviders: false,
        viewBilling: false,
      }
    });
  };

  const handleInvite = () => {
    if (onInvite) {
      onInvite(inviteForm);
    }
    setInviteSuccess(true);
  };

  const closeInviteModal = () => {
    setShowInviteModal(false);
    resetInviteForm();
  };

  const selectedRelationship = relationshipOptions.find(r => r.value === inviteForm.relationship);

  const MemberCard = ({ member }) => {
    const relConfig = relationshipConfig[member.relationship] || relationshipConfig['Other'];
    const statConfig = statusConfig[member.status] || statusConfig['Active'];
    
    return (
      <div 
        className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 cursor-pointer hover:shadow-md transition-all"
        style={{ borderLeftWidth: '4px', borderLeftColor: member.status === 'Active' ? '#10b981' : '#f59e0b' }}
        onClick={() => setSelectedMember(member)}
      >
        <div className="p-4">
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${relConfig.color}`}>
              <span className="text-lg font-semibold">
                {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <h3 className="font-bold text-gray-900">{member.name}</h3>
                  <p className="text-gray-500 text-sm">{member.email}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${statConfig.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statConfig.dot}`} />
                  {member.status}
                </span>
              </div>
              
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 rounded-lg text-xs font-medium ${relConfig.color}`}>
                  {member.relationship}
                </span>
                <span className="text-xs text-gray-400">
                  Last access: {formatDate(member.lastAccess)}
                </span>
              </div>

              <div className="flex items-center gap-1 mt-3">
                {Object.entries(member.permissions).filter(([_, v]) => v).slice(0, 5).map(([key]) => {
                  const PermIcon = permissionLabels[key]?.icon || Eye;
                  return (
                    <div key={key} className="w-6 h-6 bg-gray-100 rounded flex items-center justify-center" title={permissionLabels[key]?.label}>
                      <PermIcon className="w-3.5 h-3.5 text-gray-500" />
                    </div>
                  );
                })}
                {Object.values(member.permissions).filter(v => v).length > 5 && (
                  <span className="text-xs text-gray-400">+{Object.values(member.permissions).filter(v => v).length - 5} more</span>
                )}
              </div>
            </div>
            
            <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0 self-center" />
          </div>
        </div>
      </div>
    );
  };

  const content = (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-gray-900">Family Access</h1>
          <p className="text-gray-500 text-sm mt-1">Manage who can view your health records</p>
        </div>
        <button 
          onClick={() => setShowInviteModal(true)}
          className="flex-shrink-0 px-5 py-3 bg-teal-500 hover:bg-teal-600 rounded-xl font-semibold flex items-center gap-2 transition-colors shadow-lg"
          style={{ color: 'white', backgroundColor: '#14b8a6' }}
        >
          <UserPlus className="w-5 h-5 text-white" />
          <span className="text-white">Invite</span>
        </button>
      </div>

      {/* Info Banner */}
      <div className="bg-gradient-to-r from-pink-50 to-indigo-50 rounded-xl p-4 border border-pink-100">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
            <Heart className="w-5 h-5 text-pink-500" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Share with Loved Ones</h3>
            <p className="text-sm text-gray-600 mt-1">
              Invite family members or caregivers to view your health information. You control exactly what they can see and do.
            </p>
          </div>
        </div>
      </div>

      {/* Members List */}
      {demoMembers.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            People with Access ({demoMembers.length})
          </h2>
          {demoMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      ) : (
        <div className="p-10 text-center bg-white rounded-xl border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">No Family Members Yet</h3>
          <p className="text-gray-500 text-sm mb-4">
            Invite family members or caregivers to help manage your health.
          </p>
          <Button onClick={() => setShowInviteModal(true)}>
            <UserPlus className="w-4 h-4" />
            Invite Someone
          </Button>
        </div>
      )}

      {/* Privacy Note */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-gray-500 mt-0.5" />
          <div>
            <p className="text-sm text-gray-700 font-medium">Your Privacy Matters</p>
            <p className="text-sm text-gray-500 mt-1">
              You can revoke access at any time. All access is logged and audited for your security.
            </p>
          </div>
        </div>
      </div>

      {/* Invite Modal - INLINE to prevent re-render focus loss */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {inviteSuccess ? 'Invitation Sent!' : 'Invite Family Member'}
                  </h2>
                  {!inviteSuccess && (
                    <p className="text-sm text-gray-500">Step {inviteStep} of 3</p>
                  )}
                </div>
                <button onClick={closeInviteModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              
              {/* Progress Bar */}
              {!inviteSuccess && (
                <div className="flex gap-2 mt-4">
                  {[1, 2, 3].map((step) => (
                    <div 
                      key={step} 
                      className={`flex-1 h-1.5 rounded-full transition-colors ${
                        step <= inviteStep ? 'bg-teal-500' : 'bg-gray-200'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-5">
              {/* Success State */}
              {inviteSuccess ? (
                <div className="text-center py-6">
                  <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Invitation Sent!</h3>
                  <p className="text-gray-500 mb-6">
                    We've sent an invitation to <span className="font-semibold text-gray-700">{inviteForm.email}</span>
                  </p>
                  
                  <div className="bg-gray-50 rounded-xl p-4 text-left mb-6">
                    <h4 className="font-semibold text-gray-900 mb-2">What happens next?</h4>
                    <ul className="space-y-2 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                        {inviteForm.name} will receive an email invitation
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                        They'll need to create an account or sign in
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                        Once verified, they can view your selected records
                      </li>
                    </ul>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button variant="secondary" className="flex-1" onClick={resetInviteForm}>
                      <UserPlus className="w-4 h-4" />
                      Invite Another
                    </Button>
                    <Button className="flex-1" onClick={closeInviteModal}>
                      Done
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Step 1: Who are you inviting? */}
                  {inviteStep === 1 && (
                    <div className="space-y-5">
                      <div className="text-center mb-6">
                        <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Users className="w-7 h-7 text-teal-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Who are you inviting?</h3>
                        <p className="text-sm text-gray-500">Select your relationship with this person</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        {relationshipOptions.map((rel) => {
                          const RelIcon = rel.icon;
                          const isSelected = inviteForm.relationship === rel.value;
                          return (
                            <button
                              key={rel.value}
                              type="button"
                              onClick={() => setInviteForm({ ...inviteForm, relationship: rel.value })}
                              className={`p-4 rounded-xl border-2 text-left transition-all ${
                                isSelected 
                                  ? 'border-teal-500 bg-teal-50' 
                                  : 'border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-2 ${rel.color}`}>
                                <RelIcon className="w-5 h-5" />
                              </div>
                              <p className={`font-semibold ${isSelected ? 'text-teal-700' : 'text-gray-900'}`}>
                                {rel.label}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">{rel.description}</p>
                            </button>
                          );
                        })}
                      </div>
                      
                      <Button 
                        className="w-full mt-4" 
                        onClick={() => setInviteStep(2)}
                        disabled={!inviteForm.relationship}
                      >
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </div>
                  )}

                  {/* Step 2: Contact Information */}
                  {inviteStep === 2 && (
                    <div className="space-y-5">
                      <div className="text-center mb-6">
                        <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Mail className="w-7 h-7 text-teal-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Contact Information</h3>
                        <p className="text-sm text-gray-500">We'll send them an invitation email</p>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                          <input
                            type="text"
                            value={inviteForm.name}
                            onChange={(e) => setInviteForm(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter their full name"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                            autoComplete="off"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                          <input
                            type="email"
                            value={inviteForm.email}
                            onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="Enter their email address"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500"
                            autoComplete="off"
                          />
                        </div>
                      </div>

                      {selectedRelationship && (
                        <div className={`flex items-center gap-3 p-3 rounded-xl ${selectedRelationship.color}`}>
                          <selectedRelationship.icon className="w-5 h-5" />
                          <span className="text-sm font-medium">Inviting as: {selectedRelationship.label}</span>
                        </div>
                      )}
                      
                      <div className="flex gap-3 mt-4">
                        <Button variant="secondary" onClick={() => setInviteStep(1)}>
                          <ArrowLeft className="w-4 h-4" />
                          Back
                        </Button>
                        <Button 
                          className="flex-1" 
                          onClick={() => setInviteStep(3)}
                          disabled={!inviteForm.email || !inviteForm.name}
                        >
                          Continue
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Permissions */}
                  {inviteStep === 3 && (
                    <div className="space-y-5">
                      <div className="text-center mb-6">
                        <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Shield className="w-7 h-7 text-teal-600" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900">Set Permissions</h3>
                        <p className="text-sm text-gray-500">Choose what {inviteForm.name.split(' ')[0] || 'they'} can access</p>
                      </div>

                      {/* Quick Presets */}
                      <div className="flex gap-2 mb-4">
                        <button
                          type="button"
                          onClick={() => setInviteForm(prev => ({
                            ...prev,
                            permissions: Object.keys(prev.permissions).reduce((acc, key) => ({ ...acc, [key]: true }), {})
                          }))}
                          className="px-3 py-1.5 text-xs font-medium bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors"
                        >
                          Full Access
                        </button>
                        <button
                          type="button"
                          onClick={() => setInviteForm(prev => ({
                            ...prev,
                            permissions: {
                              viewAppointments: true,
                              viewMedications: true,
                              viewLabResults: false,
                              viewRecords: false,
                              bookAppointments: false,
                              messageProviders: false,
                              viewBilling: false,
                            }
                          }))}
                          className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Basic View
                        </button>
                        <button
                          type="button"
                          onClick={() => setInviteForm(prev => ({
                            ...prev,
                            permissions: Object.keys(prev.permissions).reduce((acc, key) => ({ ...acc, [key]: false }), {})
                          }))}
                          className="px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                      
                      <div className="space-y-2">
                        {Object.entries(permissionLabels).map(([key, { label, icon: Icon, description }]) => (
                          <label 
                            key={key} 
                            className={`flex items-center justify-between p-3 rounded-xl cursor-pointer transition-colors ${
                              inviteForm.permissions[key] ? 'bg-teal-50 border border-teal-200' : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                inviteForm.permissions[key] ? 'bg-teal-100' : 'bg-gray-200'
                              }`}>
                                <Icon className={`w-4 h-4 ${inviteForm.permissions[key] ? 'text-teal-600' : 'text-gray-400'}`} />
                              </div>
                              <div>
                                <span className={inviteForm.permissions[key] ? 'text-gray-900 font-medium' : 'text-gray-700'}>{label}</span>
                                <p className="text-xs text-gray-500">{description}</p>
                              </div>
                            </div>
                            <input
                              type="checkbox"
                              checked={inviteForm.permissions[key]}
                              onChange={(e) => setInviteForm(prev => ({
                                ...prev,
                                permissions: { ...prev.permissions, [key]: e.target.checked }
                              }))}
                              className="w-5 h-5 text-teal-600 rounded focus:ring-teal-500"
                            />
                          </label>
                        ))}
                      </div>

                      {/* Summary */}
                      <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
                          <div>
                            <p className="text-sm text-blue-800 font-medium">Ready to Send</p>
                            <p className="text-sm text-blue-700 mt-1">
                              {inviteForm.name} ({inviteForm.email}) will be invited as your {selectedRelationship?.label.toLowerCase()} with {Object.values(inviteForm.permissions).filter(v => v).length} permissions.
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3 mt-4">
                        <Button variant="secondary" onClick={() => setInviteStep(2)}>
                          <ArrowLeft className="w-4 h-4" />
                          Back
                        </Button>
                        <Button 
                          className="flex-1" 
                          onClick={handleInvite}
                          disabled={!Object.values(inviteForm.permissions).some(v => v)}
                        >
                          <Send className="w-4 h-4" />
                          Send Invitation
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Member Detail Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
            <div className="sticky top-0 bg-white z-10 px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Manage Access</h2>
              <button onClick={() => setSelectedMember(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-5">
              {(() => {
                const relConfig = relationshipConfig[selectedMember.relationship] || relationshipConfig['Other'];
                return (
                  <>
                    {/* Member Info */}
                    <div className="flex items-center gap-4">
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center ${relConfig.color}`}>
                        <span className="text-2xl font-semibold">
                          {selectedMember.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{selectedMember.name}</h3>
                        <p className="text-gray-500">{selectedMember.email}</p>
                        <span className={`inline-block mt-1 px-2 py-0.5 rounded-lg text-xs font-medium ${relConfig.color}`}>
                          {selectedMember.relationship}
                        </span>
                      </div>
                    </div>

                    {/* Access Info */}
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Status</span>
                        <span className={`font-medium ${selectedMember.status === 'Active' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {selectedMember.status}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Invited</span>
                        <span className="font-medium text-gray-900">{formatDate(selectedMember.invitedDate)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Last Access</span>
                        <span className="font-medium text-gray-900">{formatDate(selectedMember.lastAccess)}</span>
                      </div>
                    </div>

                    {/* Permissions */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3">Current Permissions</h3>
                      <div className="space-y-2">
                        {Object.entries(permissionLabels).map(([key, { label, icon: Icon }]) => (
                          <div key={key} className={`flex items-center justify-between p-3 rounded-xl ${
                            selectedMember.permissions[key] ? 'bg-emerald-50' : 'bg-gray-50'
                          }`}>
                            <div className="flex items-center gap-3">
                              <Icon className={`w-5 h-5 ${selectedMember.permissions[key] ? 'text-emerald-600' : 'text-gray-400'}`} />
                              <span className={selectedMember.permissions[key] ? 'text-gray-900' : 'text-gray-500'}>{label}</span>
                            </div>
                            {selectedMember.permissions[key] ? (
                              <Check className="w-5 h-5 text-emerald-600" />
                            ) : (
                              <X className="w-5 h-5 text-gray-300" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-3 pt-2">
                      <Button variant="secondary" className="w-full" onClick={() => setSelectedMember(null)}>
                        <Edit className="w-4 h-4" />
                        Edit Permissions
                      </Button>
                      {selectedMember.status === 'Pending' && (
                        <Button variant="secondary" className="w-full">
                          <Send className="w-4 h-4" />
                          Resend Invitation
                        </Button>
                      )}
                      <button 
                        onClick={() => {
                          if (onRemove) onRemove(selectedMember.id);
                          setSelectedMember(null);
                        }}
                        className="w-full py-3 text-red-600 font-medium hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" />
                        Remove Access
                      </button>
                    </div>
                  </>
                );
              })()}
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
      <Header title="Family Access" onBack={onBack} />
      <div className="p-4 pb-24">
        {content}
      </div>
    </div>
  );
};

export default FamilyAccessPage;
