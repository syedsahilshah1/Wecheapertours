import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  User, 
  Clock, 
  Search, 
  CheckCircle2, 
  CheckCheck,
  ShieldCheck, 
  Briefcase,
  XCircle, 
  Sparkles,
  Phone,
  Mail,
  RefreshCw
} from 'lucide-react';
import { chatApi } from '../../services/chatApi';
import { getEcho } from '../../services/echo';
import { useAuth } from '../../context/AuthContext';

const AdminChatPage = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConv, setSelectedConv] = useState(null);
  const [messages, setMessages] = useState([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Staff sender persona: default to logged-in user role or manager
  const staffRole = user?.role === 'admin' ? 'admin' : 'manager';
  const staffName = user?.name || (staffRole === 'admin' ? 'Administrator' : 'Operations Manager');

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = () => {
    chatApi.getConversations().then((res) => {
      if (res.data?.success) {
        const list = Array.isArray(res.data.data) ? res.data.data : [];
        setConversations(list);
        if (!selectedConv && list.length > 0) {
          selectConversation(list[0]);
        }
      }
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  const selectConversation = (conv) => {
    setSelectedConv(conv);
    chatApi.getMessages(conv.id).then((res) => {
      if (res.data?.success) {
        const list = Array.isArray(res.data.data) ? res.data.data : [];
        setMessages(list);
      }
    });
  };

  // Setup Reverb WebSocket on active conversation + admin channel
  useEffect(() => {
    const echo = getEcho();
    let convChannel = null;
    let adminChannel = null;

    if (echo) {
      try {
        adminChannel = echo.channel('admin.chats');
        adminChannel.listen('.message.sent', () => {
          fetchConversations();
        });

        if (selectedConv?.id) {
          convChannel = echo.channel(`chat.${selectedConv.id}`);
          convChannel.listen('.message.sent', (data) => {
            setMessages((prev) => {
              if (prev.some((m) => m.id === data.id)) return prev;
              return [...prev, data];
            });
            fetchConversations();
          });
        }
      } catch (err) {
        console.warn('Reverb listener fallback active:', err);
      }
    }

    // Polling fallback every 4s
    const interval = setInterval(() => {
      if (selectedConv?.id) {
        chatApi.getMessages(selectedConv.id).then((res) => {
          if (res.data?.success) {
            const list = Array.isArray(res.data.data) ? res.data.data : [];
            setMessages(list);
          }
        });
      }
    }, 4000);

    return () => {
      clearInterval(interval);
      if (echo) {
        if (convChannel && selectedConv?.id) echo.leaveChannel(`chat.${selectedConv.id}`);
        if (adminChannel) echo.leaveChannel('admin.chats');
      }
    };
  }, [selectedConv?.id]);

  const handleSendReply = async (e) => {
    e?.preventDefault();
    if (!replyText.trim() || !selectedConv) return;

    const text = replyText.trim();
    setReplyText('');

    const tempMsg = {
      id: Date.now(),
      conversation_id: selectedConv.id,
      sender_type: staffRole,
      sender_name: staffName,
      message: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      await chatApi.adminReply(selectedConv.id, {
        message: text,
        sender_type: staffRole,
        sender_name: staffName,
      });
      fetchConversations();
    } catch (err) {
      console.error('Error sending reply:', err);
    }
  };

  const handleCloseChat = async () => {
    if (!selectedConv) return;
    try {
      await chatApi.closeConversation(selectedConv.id);
      setSelectedConv((prev) => ({ ...prev, status: 'closed' }));
      fetchConversations();
    } catch (err) {
      console.error('Error closing conversation:', err);
    }
  };

  const filteredConversations = conversations.filter((c) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      (c.visitor_name && c.visitor_name.toLowerCase().includes(q)) ||
      (c.visitor_email && c.visitor_email.toLowerCase().includes(q)) ||
      (c.last_message && c.last_message.toLowerCase().includes(q));

    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900 font-serif">
              Live Customer Support Chat
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Laravel Reverb Connected
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Two-way real-time communication between guests, customers, operations managers, and admins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-xs bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-medium flex items-center gap-1.5">
            {staffRole === 'admin' ? (
              <ShieldCheck className="w-4 h-4 text-amber-600" />
            ) : (
              <Briefcase className="w-4 h-4 text-blue-600" />
            )}
            <span>Replying as: <strong>{staffName}</strong> ({staffRole.toUpperCase()})</span>
          </div>
          <button
            onClick={fetchConversations}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer"
            title="Refresh Conversations"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Chat Hub Container */}
      <div className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row min-h-0">
        
        {/* Left Sidebar: Conversations List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col shrink-0 bg-slate-50/50">
          
          {/* Search & Filter Header */}
          <div className="p-3.5 border-b border-slate-200 space-y-2.5 bg-white">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats by guest or query..."
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
              <button
                onClick={() => setStatusFilter('all')}
                className={`flex-1 py-1 rounded-lg text-center transition-colors cursor-pointer ${
                  statusFilter === 'all' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                All ({conversations.length})
              </button>
              <button
                onClick={() => setStatusFilter('active')}
                className={`flex-1 py-1 rounded-lg text-center transition-colors cursor-pointer ${
                  statusFilter === 'active' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setStatusFilter('closed')}
                className={`flex-1 py-1 rounded-lg text-center transition-colors cursor-pointer ${
                  statusFilter === 'closed' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Closed
              </button>
            </div>
          </div>

          {/* Conversations Scrollable List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading chats...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center space-y-1">
                <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No conversations</p>
                <p className="text-[11px] text-slate-400">Visitor messages will appear here in real-time.</p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = selectedConv?.id === conv.id;
                const initial = conv.visitor_name?.charAt(0) || 'G';

                return (
                  <button
                    key={conv.id}
                    onClick={() => selectConversation(conv)}
                    className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors cursor-pointer ${
                      isSelected ? 'bg-amber-50/80 border-r-4 border-amber-600' : 'hover:bg-slate-100/70'
                    }`}
                  >
                    <div className="relative shrink-0">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-600 to-amber-700 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                        {initial}
                      </div>
                      {conv.status === 'active' && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-bold text-xs text-slate-900 truncate">
                          {conv.visitor_name}
                        </span>
                        <span className="text-[10px] text-slate-400 whitespace-nowrap ml-1">
                          {new Date(conv.updated_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 truncate leading-tight">
                        {conv.last_message || 'New conversation'}
                      </p>

                      <div className="flex items-center justify-between mt-1.5 pt-0.5 text-[10px]">
                        <span className="text-slate-400 truncate max-w-[150px]">
                          {conv.visitor_email || 'Guest'}
                        </span>
                        {conv.unread_count > 0 && (
                          <span className="bg-amber-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                            {conv.unread_count} new
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Main Chat Thread */}
        <div className="flex-1 flex flex-col min-h-0 bg-slate-50/30">
          {selectedConv ? (
            <>
              {/* Active Conversation Topbar */}
              <div className="p-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
                    {selectedConv.visitor_name?.charAt(0) || 'G'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-slate-900 font-serif">
                        {selectedConv.visitor_name}
                      </h3>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        selectedConv.status === 'active' 
                          ? 'bg-emerald-100 text-emerald-800' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {selectedConv.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                      {selectedConv.visitor_email && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-600">
                          <Mail className="w-3 h-3 text-slate-400" />
                          {selectedConv.visitor_email}
                        </span>
                      )}
                      {selectedConv.visitor_phone && (
                        <span className="flex items-center gap-1 text-[11px] text-slate-600">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {selectedConv.visitor_phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {selectedConv.status === 'active' ? (
                    <button
                      onClick={handleCloseChat}
                      className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5 text-slate-400" />
                      <span>Close Chat</span>
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Closed</span>
                  )}
                </div>
              </div>

              {/* Messages Stream */}
              <div className="flex-1 p-5 overflow-y-auto space-y-3.5">
                {messages.map((m) => {
                  const isCustomer = m.sender_type === 'customer';
                  const isManager = m.sender_type === 'manager';
                  const isAdmin = m.sender_type === 'admin';

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
                    >
                      <div className="text-[10px] text-slate-400 mb-0.5 px-1 flex items-center gap-1.5">
                        <span className="font-semibold text-slate-600">{m.sender_name}</span>
                        <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                          isCustomer 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : isManager 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {m.sender_type}
                        </span>
                      </div>

                      <div
                        className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                          isCustomer
                            ? 'bg-white text-slate-900 border border-slate-200/90 rounded-bl-xs'
                            : 'bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-br-xs'
                        }`}
                      >
                        {m.message}
                      </div>

                      <span className="text-[9px] text-slate-400 mt-0.5 px-1 flex items-center gap-1">
                        {new Date(m.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        {!isCustomer && <CheckCheck className="w-3 h-3 text-amber-600" />}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Reply Suggestions for Managers & Admins */}
              <div className="px-4 py-1.5 bg-slate-50 border-t border-slate-200/60 flex items-center gap-1.5 overflow-x-auto text-xs shrink-0">
                <span className="text-[10px] text-slate-400 font-semibold mr-1">Quick replies:</span>
                <button
                  onClick={() => setReplyText('Hello! Yes, that Nile Cruise is available for your requested dates.')}
                  className="px-2 py-0.5 bg-white rounded-md border border-slate-200 text-slate-600 hover:text-amber-700 hover:border-amber-400 text-[11px] whitespace-nowrap cursor-pointer"
                >
                  Confirm Cruise Available
                </button>
                <button
                  onClick={() => setReplyText('I have prepared a custom itinerary with licensed Egyptologist guide.')}
                  className="px-2 py-0.5 bg-white rounded-md border border-slate-200 text-slate-600 hover:text-amber-700 hover:border-amber-400 text-[11px] whitespace-nowrap cursor-pointer"
                >
                  Send Itinerary Info
                </button>
                <button
                  onClick={() => setReplyText('Would you like a chauffeured private car from Cairo Airport?')}
                  className="px-2 py-0.5 bg-white rounded-md border border-slate-200 text-slate-600 hover:text-amber-700 hover:border-amber-400 text-[11px] whitespace-nowrap cursor-pointer"
                >
                  Offer Airport Transfer
                </button>
              </div>

              {/* Message Reply Form */}
              <form onSubmit={handleSendReply} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply as ${staffName} (${staffRole})...`}
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim()}
                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Reply</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-700">Select a conversation</p>
              <p className="text-xs">Choose a guest chat from the left panel to begin replying.</p>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default AdminChatPage;
