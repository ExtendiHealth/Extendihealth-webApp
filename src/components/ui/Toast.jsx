import React, { useState, useEffect } from 'react';
import { X, CheckCircle, AlertTriangle, Info, Bell, MessageSquare, Users } from 'lucide-react';

/**
 * Toast Notification Component
 * For real-time alerts and notifications
 */
const Toast = ({ 
  id,
  type = 'info', // info, success, warning, error, message, queue
  title,
  message,
  duration = 5000,
  onClose,
  action,
  actionLabel,
  urgent = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Animate in
    setTimeout(() => setIsVisible(true), 10);

    // Auto dismiss
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose?.(id);
    }, 300);
  };

  const typeConfig = {
    info: {
      icon: Info,
      bg: 'bg-blue-50 border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600',
      titleColor: 'text-blue-900',
    },
    success: {
      icon: CheckCircle,
      bg: 'bg-emerald-50 border-emerald-200',
      iconBg: 'bg-emerald-100',
      iconColor: 'text-emerald-600',
      titleColor: 'text-emerald-900',
    },
    warning: {
      icon: AlertTriangle,
      bg: 'bg-amber-50 border-amber-200',
      iconBg: 'bg-amber-100',
      iconColor: 'text-amber-600',
      titleColor: 'text-amber-900',
    },
    error: {
      icon: AlertTriangle,
      bg: 'bg-red-50 border-red-200',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600',
      titleColor: 'text-red-900',
    },
    message: {
      icon: MessageSquare,
      bg: 'bg-indigo-50 border-indigo-200',
      iconBg: 'bg-indigo-100',
      iconColor: 'text-indigo-600',
      titleColor: 'text-indigo-900',
    },
    queue: {
      icon: Users,
      bg: 'bg-cyan-50 border-cyan-200',
      iconBg: 'bg-cyan-100',
      iconColor: 'text-cyan-600',
      titleColor: 'text-cyan-900',
    },
  };

  const config = typeConfig[type] || typeConfig.info;
  const Icon = config.icon;

  return (
    <div 
      className={`
        transform transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${urgent ? 'animate-pulse' : ''}
      `}
    >
      <div className={`
        flex items-start gap-3 p-4 rounded-xl border shadow-lg max-w-sm
        ${config.bg}
      `}>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${config.iconBg}`}>
          <Icon className={`w-4 h-4 ${config.iconColor}`} />
        </div>
        
        <div className="flex-1 min-w-0">
          {title && (
            <p className={`font-semibold text-sm ${config.titleColor}`}>{title}</p>
          )}
          {message && (
            <p className="text-sm text-gray-600 mt-0.5">{message}</p>
          )}
          {action && actionLabel && (
            <button 
              onClick={action}
              className={`mt-2 text-sm font-medium ${config.iconColor} hover:underline`}
            >
              {actionLabel}
            </button>
          )}
        </div>
        
        <button 
          onClick={handleClose}
          className="p-1 hover:bg-black/5 rounded-lg transition-colors flex-shrink-0"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

/**
 * Toast Container - manages multiple toasts
 */
export const ToastContainer = ({ toasts = [], onClose }) => {
  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </div>
  );
};

export default Toast;
