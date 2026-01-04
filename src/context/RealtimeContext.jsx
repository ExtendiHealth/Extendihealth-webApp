import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';

/**
 * Real-time Context Provider
 * Manages WebSocket connections and real-time state for queue and messages
 * 
 * In production, replace DEMO_MODE with actual WebSocket server
 */

const DEMO_MODE = true; // Set to false when connecting to real server
const WS_URL = 'wss://api.extendihealth.com/ws'; // Production WebSocket URL

const RealtimeContext = createContext(null);

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};

export const RealtimeProvider = ({ children, userId }) => {
  // Connection state
  const [isConnected, setIsConnected] = useState(DEMO_MODE);
  const [connectionState, setConnectionState] = useState(DEMO_MODE ? 'connected' : 'disconnected');
  
  // Queue state
  const [queuePosition, setQueuePosition] = useState(null);
  const [queueWaitTime, setQueueWaitTime] = useState(null);
  const [queueStatus, setQueueStatus] = useState(null); // waiting, called, in-progress, completed
  const [queueAlerts, setQueueAlerts] = useState([]);
  
  // Messages state
  const [unreadCount, setUnreadCount] = useState(2);
  const [newMessages, setNewMessages] = useState([]);
  const [typingIndicators, setTypingIndicators] = useState({}); // { conversationId: true/false }
  
  // Notifications state
  const [notifications, setNotifications] = useState([]);
  
  // WebSocket ref
  const wsRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const demoIntervalRef = useRef(null);

  // Demo mode simulation
  useEffect(() => {
    if (DEMO_MODE) {
      // Simulate real-time queue updates
      let position = 3;
      let waitTime = 12;
      
      demoIntervalRef.current = setInterval(() => {
        // Random chance of queue update
        if (Math.random() > 0.7 && position > 1) {
          position -= 1;
          waitTime = Math.max(0, waitTime - 4);
          
          setQueuePosition(position);
          setQueueWaitTime(waitTime);
          
          // Add alert
          const alert = {
            id: Date.now(),
            type: 'queue_update',
            message: position === 1 
              ? "You're next! Please head to the kiosk." 
              : `Queue updated: ${position} ahead of you`,
            timestamp: new Date().toISOString(),
          };
          setQueueAlerts(prev => [alert, ...prev].slice(0, 5));
          
          // If position is 1, simulate being called
          if (position === 1) {
            setTimeout(() => {
              setQueueStatus('called');
              const calledAlert = {
                id: Date.now(),
                type: 'called',
                message: "It's your turn! Please proceed to the consultation room.",
                timestamp: new Date().toISOString(),
                urgent: true,
              };
              setQueueAlerts(prev => [calledAlert, ...prev].slice(0, 5));
            }, 5000);
          }
        }
        
        // Random chance of new message
        if (Math.random() > 0.9) {
          const newMsg = {
            id: `msg-${Date.now()}`,
            conversationId: 'conv-1',
            from: 'Dr. Michelle Chen',
            preview: 'Just checking in - how are you feeling today?',
            timestamp: new Date().toISOString(),
          };
          setNewMessages(prev => [newMsg, ...prev]);
          setUnreadCount(prev => prev + 1);
          
          // Add notification
          const notif = {
            id: Date.now(),
            type: 'message',
            title: 'New Message',
            message: `${newMsg.from}: ${newMsg.preview}`,
            timestamp: new Date().toISOString(),
          };
          setNotifications(prev => [notif, ...prev].slice(0, 10));
        }
        
        // Simulate typing indicator
        if (Math.random() > 0.85) {
          setTypingIndicators({ 'conv-1': true });
          setTimeout(() => setTypingIndicators({}), 3000);
        }
      }, 5000);
      
      return () => clearInterval(demoIntervalRef.current);
    }
  }, []);

  // Real WebSocket connection (when not in demo mode)
  const connect = useCallback(() => {
    if (DEMO_MODE || !userId) return;
    
    setConnectionState('connecting');
    
    try {
      wsRef.current = new WebSocket(`${WS_URL}?userId=${userId}`);
      
      wsRef.current.onopen = () => {
        setIsConnected(true);
        setConnectionState('connected');
        
        // Subscribe to user's channels
        wsRef.current.send(JSON.stringify({
          type: 'subscribe',
          channels: ['queue', 'messages', 'notifications']
        }));
      };
      
      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          handleMessage(data);
        } catch (e) {
          console.error('Failed to parse message:', e);
        }
      };
      
      wsRef.current.onclose = () => {
        setIsConnected(false);
        setConnectionState('reconnecting');
        
        // Attempt reconnection
        reconnectTimeoutRef.current = setTimeout(() => {
          connect();
        }, 3000);
      };
      
      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Failed to connect:', error);
      setConnectionState('disconnected');
    }
  }, [userId]);

  const handleMessage = useCallback((data) => {
    switch (data.type) {
      case 'queue_update':
        setQueuePosition(data.position);
        setQueueWaitTime(data.waitTime);
        setQueueStatus(data.status);
        if (data.alert) {
          setQueueAlerts(prev => [data.alert, ...prev].slice(0, 5));
        }
        break;
        
      case 'queue_called':
        setQueueStatus('called');
        setQueueAlerts(prev => [{
          id: Date.now(),
          type: 'called',
          message: "It's your turn! Please proceed to the consultation room.",
          timestamp: new Date().toISOString(),
          urgent: true,
        }, ...prev]);
        break;
        
      case 'new_message':
        setNewMessages(prev => [data.message, ...prev]);
        setUnreadCount(prev => prev + 1);
        break;
        
      case 'typing':
        setTypingIndicators(prev => ({
          ...prev,
          [data.conversationId]: data.isTyping
        }));
        break;
        
      case 'message_read':
        // Handle read receipts
        break;
        
      case 'notification':
        setNotifications(prev => [data.notification, ...prev].slice(0, 10));
        break;
        
      default:
        console.log('Unknown message type:', data.type);
    }
  }, []);

  const disconnect = useCallback(() => {
    clearTimeout(reconnectTimeoutRef.current);
    wsRef.current?.close();
    setIsConnected(false);
    setConnectionState('disconnected');
  }, []);

  // Send message through WebSocket
  const sendMessage = useCallback((message) => {
    if (DEMO_MODE) {
      // Simulate send success
      return Promise.resolve(true);
    }
    
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return Promise.resolve(true);
    }
    return Promise.reject(new Error('Not connected'));
  }, []);

  // Mark messages as read
  const markMessagesRead = useCallback((conversationId) => {
    setUnreadCount(prev => Math.max(0, prev - 1));
    setNewMessages(prev => prev.filter(m => m.conversationId !== conversationId));
    
    if (!DEMO_MODE) {
      sendMessage({ type: 'mark_read', conversationId });
    }
  }, [sendMessage]);

  // Send typing indicator
  const sendTypingIndicator = useCallback((conversationId, isTyping) => {
    if (!DEMO_MODE) {
      sendMessage({ type: 'typing', conversationId, isTyping });
    }
  }, [sendMessage]);

  // Join queue
  const joinQueue = useCallback((kioskId, appointmentId) => {
    setQueuePosition(3);
    setQueueWaitTime(12);
    setQueueStatus('waiting');
    
    if (!DEMO_MODE) {
      sendMessage({ type: 'join_queue', kioskId, appointmentId });
    }
  }, [sendMessage]);

  // Leave queue
  const leaveQueue = useCallback(() => {
    setQueuePosition(null);
    setQueueWaitTime(null);
    setQueueStatus(null);
    setQueueAlerts([]);
    
    if (!DEMO_MODE) {
      sendMessage({ type: 'leave_queue' });
    }
  }, [sendMessage]);

  // Clear queue alerts
  const clearQueueAlerts = useCallback(() => {
    setQueueAlerts([]);
  }, []);

  // Clear all notifications
  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  useEffect(() => {
    if (!DEMO_MODE && userId) {
      connect();
    }
    
    return () => {
      disconnect();
      clearInterval(demoIntervalRef.current);
    };
  }, [userId, connect, disconnect]);

  const value = {
    // Connection
    isConnected,
    connectionState,
    connect,
    disconnect,
    
    // Queue
    queuePosition,
    queueWaitTime,
    queueStatus,
    queueAlerts,
    joinQueue,
    leaveQueue,
    clearQueueAlerts,
    
    // Messages
    unreadCount,
    newMessages,
    typingIndicators,
    markMessagesRead,
    sendTypingIndicator,
    sendMessage,
    
    // Notifications
    notifications,
    clearNotifications,
    
    // Demo mode flag
    isDemoMode: DEMO_MODE,
  };

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  );
};

export default RealtimeContext;
