import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * WebSocket Hook for Real-time Updates
 * Handles connection, reconnection, and message parsing
 */
const useWebSocket = (url, options = {}) => {
  const {
    onMessage,
    onConnect,
    onDisconnect,
    onError,
    reconnect = true,
    reconnectInterval = 3000,
    reconnectAttempts = 5,
    heartbeatInterval = 30000,
  } = options;

  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState(null);
  const [connectionState, setConnectionState] = useState('disconnected'); // disconnected, connecting, connected, reconnecting
  
  const wsRef = useRef(null);
  const reconnectCountRef = useRef(0);
  const reconnectTimeoutRef = useRef(null);
  const heartbeatRef = useRef(null);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    setConnectionState('connecting');
    
    try {
      wsRef.current = new WebSocket(url);

      wsRef.current.onopen = () => {
        setIsConnected(true);
        setConnectionState('connected');
        reconnectCountRef.current = 0;
        onConnect?.();

        // Start heartbeat
        heartbeatRef.current = setInterval(() => {
          if (wsRef.current?.readyState === WebSocket.OPEN) {
            wsRef.current.send(JSON.stringify({ type: 'ping' }));
          }
        }, heartbeatInterval);
      };

      wsRef.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type !== 'pong') {
            setLastMessage(data);
            onMessage?.(data);
          }
        } catch (e) {
          console.error('Failed to parse WebSocket message:', e);
        }
      };

      wsRef.current.onclose = () => {
        setIsConnected(false);
        clearInterval(heartbeatRef.current);
        onDisconnect?.();

        // Attempt reconnection
        if (reconnect && reconnectCountRef.current < reconnectAttempts) {
          setConnectionState('reconnecting');
          reconnectCountRef.current += 1;
          reconnectTimeoutRef.current = setTimeout(() => {
            connect();
          }, reconnectInterval * reconnectCountRef.current);
        } else {
          setConnectionState('disconnected');
        }
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        onError?.(error);
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      setConnectionState('disconnected');
    }
  }, [url, onMessage, onConnect, onDisconnect, onError, reconnect, reconnectInterval, reconnectAttempts, heartbeatInterval]);

  const disconnect = useCallback(() => {
    clearTimeout(reconnectTimeoutRef.current);
    clearInterval(heartbeatRef.current);
    reconnectCountRef.current = reconnectAttempts; // Prevent reconnection
    wsRef.current?.close();
    setIsConnected(false);
    setConnectionState('disconnected');
  }, [reconnectAttempts]);

  const sendMessage = useCallback((message) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
      return true;
    }
    return false;
  }, []);

  // Subscribe to a specific channel/room
  const subscribe = useCallback((channel) => {
    return sendMessage({ type: 'subscribe', channel });
  }, [sendMessage]);

  // Unsubscribe from a channel
  const unsubscribe = useCallback((channel) => {
    return sendMessage({ type: 'unsubscribe', channel });
  }, [sendMessage]);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    isConnected,
    connectionState,
    lastMessage,
    connect,
    disconnect,
    sendMessage,
    subscribe,
    unsubscribe,
  };
};

export default useWebSocket;
