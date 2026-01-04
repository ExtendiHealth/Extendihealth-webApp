import React, { useState, useEffect } from 'react';
import { Video, Mic, MicOff, VideoOff, Phone, FileText, CheckCircle, User, Clock, X } from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Button, Card } from '../ui';

const VirtualVisitPage = ({ appointment, user, onBack, onEndVisit }) => {
  const { isDesktop } = useResponsive();
  const [isConnecting, setIsConnecting] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [visitDuration, setVisitDuration] = useState(0);

  useEffect(() => {
    // Simulate connection
    const connectTimer = setTimeout(() => setIsConnecting(false), 2000);
    return () => clearTimeout(connectTimer);
  }, []);

  useEffect(() => {
    if (!isConnecting) {
      const timer = setInterval(() => {
        setVisitDuration(prev => prev + 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isConnecting]);

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isConnecting) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-20 h-20 bg-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Video className="w-10 h-10" />
          </div>
          <h2 className="text-xl font-bold mb-2">Connecting...</h2>
          <p className="text-gray-400">Please wait while we connect you to your provider</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Video Area */}
      <div className="flex-1 relative">
        {/* Main Video (Provider) */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 bg-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-16 h-16 text-white" />
            </div>
            <p className="text-white text-xl font-semibold">Dr. Michelle Chen</p>
            <p className="text-gray-400">Family Medicine</p>
          </div>
        </div>

        {/* Self Video (Small) */}
        <div className="absolute top-4 right-4 w-32 h-40 bg-gray-700 rounded-xl overflow-hidden shadow-lg">
          {isVideoOff ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <User className="w-8 h-8 text-gray-500" />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center">
              <User className="w-8 h-8 text-gray-400" />
            </div>
          )}
        </div>

        {/* Visit Info Overlay */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-2">
          <div className="flex items-center gap-2 text-white">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium">{formatDuration(visitDuration)}</span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-6">
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              isMuted ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            {isMuted ? <Phone className="w-6 h-6 rotate-135" /> : <Phone className="w-6 h-6" />}
          </button>
          
          <button
            onClick={() => setIsVideoOff(!isVideoOff)}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
              isVideoOff ? 'bg-red-500 text-white' : 'bg-gray-700 text-white hover:bg-gray-600'
            }`}
          >
            <Video className="w-6 h-6" />
          </button>

          <button
            onClick={onEndVisit}
            className="w-14 h-14 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <button className="w-14 h-14 rounded-full bg-gray-700 text-white flex items-center justify-center hover:bg-gray-600 transition-colors">
            <FileText className="w-6 h-6" />
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-4">
          Tap the red button to end the visit
        </p>
      </div>
    </div>
  );
};


export default VirtualVisitPage;
