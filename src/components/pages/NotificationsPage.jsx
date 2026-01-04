import React, { useState } from 'react';
import { 
  Bell, Calendar, Pill, FlaskConical, MessageSquare, AlertTriangle,
  CheckCircle, Clock, X, ChevronRight, Settings, BellOff, Trash2,
  FileText, CreditCard, User, Stethoscope, Search, Check
} from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Button } from '../ui';

const NotificationsPage = ({ notifications = [], onBack, onMarkAsRead, onDelete, onNotificationClick }) => {
  const { isDesktop } = useResponsive();
  const [filter, setFilter] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState(null);

  // Demo notifications if none provided
  const demoNotifications = notifications.length > 0 ? notifications : [
    {
      id: 'n1',
      type: 'appointment',
      title: 'Appointment Reminder',
      message: 'Your appointment with Dr. Michelle Chen is tomorrow at 10:30 AM',
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 min ago
      read: false,
      priority: 'high',
      actionUrl: '/appointments',
      metadata: { appointmentId: 'apt-1', doctor: 'Dr. Michelle Chen', time: '10:30 AM' }
    },
    {
      id: 'n2',
      type: 'prescription',
      title: 'Refill Ready',
      message: 'Your prescription for Lisinopril is ready for pickup at Shoppers Drug Mart',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
      read: false,
      priority: 'normal',
      actionUrl: '/pharmacy',
      metadata: { prescriptionId: 'rx-1', medication: 'Lisinopril' }
    },
    {
      id: 'n3',
      type: 'lab',
      title: 'Lab Results Available',
      message: 'Your Complete Blood Count (CBC) results are now available. All values are within normal range.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
      read: true,
      priority: 'normal',
      actionUrl: '/lab-results',
      metadata: { labId: 'lab-1', testName: 'Complete Blood Count' }
    },
    {
      id: 'n4',
      type: 'message',
      title: 'New Message from Dr. Chen',
      message: 'I reviewed your recent lab results. Everything looks good! Let\'s discuss at your next visit.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
      read: true,
      priority: 'normal',
      actionUrl: '/messages',
      metadata: { messageId: 'msg-1', from: 'Dr. Michelle Chen' }
    },
    {
      id: 'n5',
      type: 'billing',
      title: 'Payment Processed',
      message: 'Your payment of $45.00 for the visit on Dec 15 has been processed successfully.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
      read: true,
      priority: 'low',
      actionUrl: '/billing',
      metadata: { paymentId: 'pay-1', amount: 45.00 }
    },
    {
      id: 'n6',
      type: 'prescription',
      title: 'Refill Reminder',
      message: 'Your Atorvastatin prescription will need a refill in 5 days. Would you like to request a refill now?',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
      read: true,
      priority: 'normal',
      actionUrl: '/pharmacy',
      metadata: { prescriptionId: 'rx-2', medication: 'Atorvastatin', daysLeft: 5 }
    },
    {
      id: 'n7',
      type: 'system',
      title: 'Profile Update Required',
      message: 'Please update your emergency contact information to ensure we can reach someone in case of emergency.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
      read: true,
      priority: 'low',
      actionUrl: '/settings',
      metadata: {}
    },
    {
      id: 'n8',
      type: 'appointment',
      title: 'Appointment Confirmed',
      message: 'Your dermatology appointment with Dr. James Martinez has been confirmed for Dec 30 at 2:00 PM',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(), // 5 days ago
      read: true,
      priority: 'normal',
      actionUrl: '/appointments',
      metadata: { appointmentId: 'apt-2', doctor: 'Dr. James Martinez' }
    }
  ];

  const typeConfig = {
    appointment: { 
      icon: Calendar, 
      color: 'text-blue-600', 
      bgColor: 'bg-blue-50',
      borderColor: '#3b82f6',
      label: 'Appointment'
    },
    prescription: { 
      icon: Pill, 
      color: 'text-teal-600', 
      bgColor: 'bg-teal-50',
      borderColor: '#14b8a6',
      label: 'Prescription'
    },
    lab: { 
      icon: FlaskConical, 
      color: 'text-purple-600', 
      bgColor: 'bg-purple-50',
      borderColor: '#9333ea',
      label: 'Lab Results'
    },
    message: { 
      icon: MessageSquare, 
      color: 'text-indigo-600', 
      bgColor: 'bg-indigo-50',
      borderColor: '#6366f1',
      label: 'Message'
    },
    billing: { 
      icon: CreditCard, 
      color: 'text-emerald-600', 
      bgColor: 'bg-emerald-50',
      borderColor: '#10b981',
      label: 'Billing'
    },
    system: { 
      icon: Settings, 
      color: 'text-gray-600', 
      bgColor: 'bg-gray-50',
      borderColor: '#6b7280',
      label: 'System'
    },
    alert: { 
      icon: AlertTriangle, 
      color: 'text-amber-600', 
      bgColor: 'bg-amber-50',
      borderColor: '#f59e0b',
      label: 'Alert'
    }
  };

  const filteredNotifications = demoNotifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const unreadCount = demoNotifications.filter(n => !n.read).length;

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const handleMarkAllRead = () => {
    if (onMarkAsRead) {
      demoNotifications.filter(n => !n.read).forEach(n => onMarkAsRead(n.id));
    }
  };

  const NotificationCard = ({ notification }) => {
    const config = typeConfig[notification.type] || typeConfig.system;
    const Icon = config.icon;
    
    return (
      <div 
        className={`bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-all border border-gray-100 ${
          !notification.read ? 'ring-1 ring-teal-200' : ''
        }`}
        style={{ borderLeftWidth: '4px', borderLeftColor: config.borderColor }}
        onClick={() => setSelectedNotification(notification)}
      >
        <div className="p-4">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${config.bgColor}`}>
              <Icon className={`w-5 h-5 ${config.color}`} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex items-center gap-2">
                  <h3 className={`font-semibold text-gray-900 ${!notification.read ? 'font-bold' : ''}`}>
                    {notification.title}
                  </h3>
                  {!notification.read && (
                    <span className="w-2 h-2 bg-teal-500 rounded-full flex-shrink-0" />
                  )}
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {formatTimestamp(notification.timestamp)}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-2">{notification.message}</p>
              
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${config.bgColor} ${config.color}`}>
                  {config.label}
                </span>
                {notification.priority === 'high' && (
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-600">
                    Urgent
                  </span>
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-500 mt-1">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllRead}
            className="text-sm text-teal-600 font-medium hover:text-teal-700 flex items-center gap-1"
          >
            <Check className="w-4 h-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'All' },
          { key: 'unread', label: 'Unread', count: unreadCount },
          { key: 'appointment', label: 'Appointments' },
          { key: 'prescription', label: 'Prescriptions' },
          { key: 'lab', label: 'Lab Results' },
          { key: 'message', label: 'Messages' },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              filter === key 
                ? 'bg-teal-500 text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {label}
            {count !== undefined && count > 0 && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                filter === key ? 'bg-white/20' : 'bg-teal-100 text-teal-700'
              }`}>
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {filteredNotifications.length > 0 ? (
        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))}
        </div>
      ) : (
        <div className="p-10 text-center bg-white rounded-xl border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BellOff className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">No Notifications</h3>
          <p className="text-gray-500 text-sm">
            {filter === 'unread' ? 'You\'re all caught up!' : 'No notifications in this category.'}
          </p>
        </div>
      )}

      {/* Notification Detail Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Notification Details</h2>
              <button onClick={() => setSelectedNotification(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {(() => {
                const config = typeConfig[selectedNotification.type] || typeConfig.system;
                const Icon = config.icon;
                return (
                  <>
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${config.bgColor}`}>
                        <Icon className={`w-6 h-6 ${config.color}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg">{selectedNotification.title}</h3>
                        <p className="text-gray-500 text-sm">{formatTimestamp(selectedNotification.timestamp)}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-700">{selectedNotification.message}</p>
                    
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bgColor} ${config.color}`}>
                        {config.label}
                      </span>
                      {selectedNotification.priority === 'high' && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-50 text-red-600">
                          Urgent
                        </span>
                      )}
                    </div>
                  </>
                );
              })()}

              <div className="flex gap-3 pt-4">
                <Button 
                  variant="secondary" 
                  className="flex-1"
                  onClick={() => {
                    if (onDelete) onDelete(selectedNotification.id);
                    setSelectedNotification(null);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
                <Button 
                  className="flex-1"
                  onClick={() => {
                    if (onNotificationClick) onNotificationClick(selectedNotification);
                    setSelectedNotification(null);
                  }}
                >
                  View Details
                </Button>
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
      <Header title="Notifications" onBack={onBack} />
      <div className="p-4 pb-24">
        {content}
      </div>
    </div>
  );
};

export default NotificationsPage;
