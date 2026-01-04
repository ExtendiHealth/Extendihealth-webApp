import React, { useState } from 'react';
import { 
  MessageSquare, Send, Paperclip, Image, Search, ChevronLeft,
  CheckCheck, Check, Clock, User, Plus, MoreVertical, Phone,
  Video, X, FileText, Download, Stethoscope, Calendar, AlertCircle
} from 'lucide-react';
import { useResponsive } from '../../hooks';
import { Header } from '../layout';
import { Button } from '../ui';

const MessagesPage = ({ conversations = [], onBack, onSendMessage }) => {
  const { isDesktop } = useResponsive();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewMessage, setShowNewMessage] = useState(false);

  // Demo conversations if none provided
  const demoConversations = conversations.length > 0 ? conversations : [
    {
      id: 'conv-1',
      participant: {
        name: 'Dr. Michelle Chen',
        role: 'Family Physician',
        avatar: null,
        online: true
      },
      lastMessage: {
        text: 'I reviewed your recent lab results. Everything looks good! Let\'s discuss at your next visit.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        sender: 'provider',
        read: false
      },
      unreadCount: 1,
      messages: [
        { id: 'm1', text: 'Hi Dr. Chen, I wanted to ask about my blood pressure readings from last week.', sender: 'patient', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), status: 'read' },
        { id: 'm2', text: 'Of course! I see your readings have been slightly elevated. Are you taking your medication regularly?', sender: 'provider', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47).toISOString() },
        { id: 'm3', text: 'Yes, I take Lisinopril every morning as prescribed.', sender: 'patient', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 46).toISOString(), status: 'read' },
        { id: 'm4', text: 'Good. Let\'s also look at reducing sodium in your diet. I\'ll send you some resources.', sender: 'provider', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString() },
        { id: 'm5', text: 'Thank you! Also, my lab results came in. Should I be concerned about anything?', sender: 'patient', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), status: 'read' },
        { id: 'm6', text: 'I reviewed your recent lab results. Everything looks good! Let\'s discuss at your next visit.', sender: 'provider', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString() }
      ]
    },
    {
      id: 'conv-2',
      participant: {
        name: 'Dr. James Martinez',
        role: 'Dermatologist',
        avatar: null,
        online: false
      },
      lastMessage: {
        text: 'Your appointment has been confirmed for December 30th at 2:00 PM.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
        sender: 'provider',
        read: true
      },
      unreadCount: 0,
      messages: [
        { id: 'm1', text: 'Hi Dr. Martinez, I was referred to you for a skin concern on my forearms.', sender: 'patient', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(), status: 'read' },
        { id: 'm2', text: 'Welcome! I received the referral from Dr. Chen. Can you describe the symptoms?', sender: 'provider', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 4).toISOString() },
        { id: 'm3', text: 'It\'s a persistent rash that\'s been there for about 2 weeks. OTC creams haven\'t helped.', sender: 'patient', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(), status: 'read' },
        { id: 'm4', text: 'I\'d like to see you in person. Let me schedule an appointment.', sender: 'provider', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2.5).toISOString() },
        { id: 'm5', text: 'Your appointment has been confirmed for December 30th at 2:00 PM.', sender: 'provider', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString() }
      ]
    },
    {
      id: 'conv-3',
      participant: {
        name: 'Nurse Sarah Thompson',
        role: 'Care Coordinator',
        avatar: null,
        online: true
      },
      lastMessage: {
        text: 'Your prescription refill has been sent to the pharmacy. It should be ready in 2 hours.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
        sender: 'provider',
        read: true
      },
      unreadCount: 0,
      messages: [
        { id: 'm1', text: 'Hi, I need to request a refill for my Atorvastatin prescription.', sender: 'patient', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3.5).toISOString(), status: 'read' },
        { id: 'm2', text: 'No problem! I\'ll process that for you right away.', sender: 'provider', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3.2).toISOString() },
        { id: 'm3', text: 'Your prescription refill has been sent to the pharmacy. It should be ready in 2 hours.', sender: 'provider', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString() }
      ]
    },
    {
      id: 'conv-4',
      participant: {
        name: 'LifeLabs Toronto',
        role: 'Laboratory',
        avatar: null,
        online: false
      },
      lastMessage: {
        text: 'Reminder: You have a pending lab requisition for Lipid Panel. Please visit any LifeLabs location.',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
        sender: 'provider',
        read: true
      },
      unreadCount: 0,
      messages: [
        { id: 'm1', text: 'Reminder: You have a pending lab requisition for Lipid Panel. Please visit any LifeLabs location.', sender: 'provider', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString() }
      ]
    }
  ];

  const filteredConversations = demoConversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.participant.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalUnread = demoConversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const handleSend = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    if (onSendMessage) {
      onSendMessage(selectedConversation.id, newMessage);
    }
    
    // Add message locally for demo
    const newMsg = {
      id: `m${Date.now()}`,
      text: newMessage,
      sender: 'patient',
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    selectedConversation.messages.push(newMsg);
    setNewMessage('');
  };

  const ConversationList = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          {totalUnread > 0 && (
            <p className="text-sm text-gray-500 mt-1">{totalUnread} unread message{totalUnread !== 1 ? 's' : ''}</p>
          )}
        </div>
        <button 
          onClick={() => setShowNewMessage(true)}
          className="p-2 bg-teal-500 hover:bg-teal-600 rounded-lg text-white transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      {/* Conversations */}
      {filteredConversations.length > 0 ? (
        <div className="space-y-2">
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              className={`bg-white rounded-xl p-4 cursor-pointer hover:shadow-md transition-all border ${
                conv.unreadCount > 0 ? 'border-teal-200 bg-teal-50/30' : 'border-gray-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {conv.participant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </span>
                  </div>
                  {conv.participant.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full" />
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className={`font-semibold text-gray-900 ${conv.unreadCount > 0 ? 'font-bold' : ''}`}>
                        {conv.participant.name}
                      </h3>
                      <p className="text-xs text-gray-500">{conv.participant.role}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {formatTimestamp(conv.lastMessage.timestamp)}
                      </span>
                      {conv.unreadCount > 0 && (
                        <span className="w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center text-xs text-white font-semibold">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <p className={`text-sm mt-1 line-clamp-1 ${
                    conv.unreadCount > 0 ? 'text-gray-900 font-medium' : 'text-gray-500'
                  }`}>
                    {conv.lastMessage.sender === 'patient' && 'You: '}
                    {conv.lastMessage.text}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-10 text-center bg-white rounded-xl border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="w-8 h-8 text-gray-300" />
          </div>
          <h3 className="font-bold text-gray-900 mb-2">No Conversations</h3>
          <p className="text-gray-500 text-sm">Start a new conversation with your healthcare provider.</p>
        </div>
      )}
    </div>
  );

  const ChatView = () => (
    <div className="flex flex-col h-full bg-gray-50 -m-4 sm:m-0 sm:rounded-xl sm:border sm:border-gray-200 overflow-hidden">
      {/* Chat Header */}
      <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center gap-3">
        <button 
          onClick={() => setSelectedConversation(null)}
          className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-6 h-6 text-gray-600" />
        </button>
        
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center">
            <span className="text-white font-semibold">
              {selectedConversation.participant.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </span>
          </div>
          {selectedConversation.participant.online && (
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate">{selectedConversation.participant.name}</h3>
          <p className="text-xs text-gray-500">
            {selectedConversation.participant.online ? 'Online' : selectedConversation.participant.role}
          </p>
        </div>
        
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Phone className="w-5 h-5 text-gray-500" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Video className="w-5 h-5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {selectedConversation.messages.map((msg, index) => {
          const isPatient = msg.sender === 'patient';
          const showDate = index === 0 || 
            new Date(msg.timestamp).toDateString() !== new Date(selectedConversation.messages[index - 1].timestamp).toDateString();
          
          return (
            <React.Fragment key={msg.id}>
              {showDate && (
                <div className="text-center">
                  <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                    {new Date(msg.timestamp).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                  </span>
                </div>
              )}
              <div className={`flex ${isPatient ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${isPatient ? 'order-2' : ''}`}>
                  <div className={`px-4 py-2.5 rounded-2xl ${
                    isPatient 
                      ? 'bg-teal-500 text-white rounded-br-md' 
                      : 'bg-white text-gray-900 rounded-bl-md border border-gray-100'
                  }`}>
                    <p className="text-sm">{msg.text}</p>
                  </div>
                  <div className={`flex items-center gap-1 mt-1 ${isPatient ? 'justify-end' : ''}`}>
                    <span className="text-xs text-gray-400">{formatMessageTime(msg.timestamp)}</span>
                    {isPatient && msg.status && (
                      msg.status === 'read' 
                        ? <CheckCheck className="w-3.5 h-3.5 text-teal-500" />
                        : msg.status === 'delivered'
                        ? <CheckCheck className="w-3.5 h-3.5 text-gray-400" />
                        : <Check className="w-3.5 h-3.5 text-gray-400" />
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      {/* Message Input */}
      <div className="bg-white px-4 py-3 border-t border-gray-200">
        <div className="flex items-end gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Paperclip className="w-5 h-5 text-gray-500" />
          </button>
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-4 py-2.5 bg-gray-100 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-teal-500 text-gray-900 placeholder-gray-400"
            />
          </div>
          <button 
            onClick={handleSend}
            disabled={!newMessage.trim()}
            className={`p-2.5 rounded-xl transition-colors ${
              newMessage.trim() 
                ? 'bg-teal-500 hover:bg-teal-600 text-white' 
                : 'bg-gray-100 text-gray-400'
            }`}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">
          Messages are encrypted and secure. Response times may vary.
        </p>
      </div>
    </div>
  );

  const content = selectedConversation ? <ChatView /> : <ConversationList />;

  if (isDesktop) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-6">
        {selectedConversation ? (
          <div className="h-[calc(100vh-8rem)]">
            {content}
          </div>
        ) : content}
      </div>
    );
  }

  if (selectedConversation) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="flex-1">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Messages" onBack={onBack} />
      <div className="p-4 pb-24">
        {content}
      </div>
    </div>
  );
};

export default MessagesPage;
