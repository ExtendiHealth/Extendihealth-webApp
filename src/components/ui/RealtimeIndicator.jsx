import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

/**
 * Real-time Connection Status Indicator
 * Shows WebSocket connection state with visual feedback
 */
const RealtimeIndicator = ({ 
  isConnected, 
  connectionState = 'disconnected',
  showLabel = true,
  size = 'sm' // sm, md, lg
}) => {
  const sizeClasses = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const getStatusConfig = () => {
    switch (connectionState) {
      case 'connected':
        return {
          color: 'bg-emerald-500',
          pulse: true,
          icon: Wifi,
          label: 'Live',
          textColor: 'text-emerald-600',
        };
      case 'connecting':
        return {
          color: 'bg-amber-500',
          pulse: true,
          icon: RefreshCw,
          label: 'Connecting...',
          textColor: 'text-amber-600',
          spin: true,
        };
      case 'reconnecting':
        return {
          color: 'bg-amber-500',
          pulse: true,
          icon: RefreshCw,
          label: 'Reconnecting...',
          textColor: 'text-amber-600',
          spin: true,
        };
      case 'disconnected':
      default:
        return {
          color: 'bg-gray-400',
          pulse: false,
          icon: WifiOff,
          label: 'Offline',
          textColor: 'text-gray-500',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <span className={`block ${sizeClasses[size]} rounded-full ${config.color}`} />
        {config.pulse && (
          <span className={`absolute inset-0 ${sizeClasses[size]} rounded-full ${config.color} animate-ping opacity-75`} />
        )}
      </div>
      {showLabel && (
        <div className="flex items-center gap-1">
          <Icon className={`${iconSizes[size]} ${config.textColor} ${config.spin ? 'animate-spin' : ''}`} />
          <span className={`text-xs font-medium ${config.textColor}`}>{config.label}</span>
        </div>
      )}
    </div>
  );
};

export default RealtimeIndicator;
