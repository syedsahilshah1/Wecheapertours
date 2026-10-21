import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Headphones, 
  ShieldCheck, 
  Sparkles,
  Minimize2,
  CheckCircle2,
  Compass,
  Ship,
  Car
} from 'lucide-react';
import { chatApi } from '../../services/chatApi';
import { getEcho } from '../../services/echo';

const LiveChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Visitor onboarding details
  const [visitorName, setVisitorName] = useState(() => localStorage.getItem('wecheaper_chat_name') || '');
  const [visitorEmail, setVisitorEmail] = useState(() => localStorage.getItem('wecheaper_chat_email') || '');
  const [isStarted, setIsStarted] = useState(() => Boolean(localStorage.getItem('wecheaper_chat_id')));

  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
    }
  }, [messages, isOpen]);

  // Load existing conversation if previously started
  useEffect(() => {
    const savedId = localStorage.getItem('wecheaper_chat_id');
    if (savedId) {
      chatApi.getMessages(savedId).then((res) => {
        if (res.data?.success) {
          const list = Array.isArray(res.data.data) ? res.data.data : [];
          setMessages(list);
          setConversation({ id: Number(savedId), visitor_name: visitorName, visitor_email: visitorEmail });
        }
      });
    }
  }, []);

  // Setup Reverb WebSocket listener + fallback polling
  useEffect(() => {
    const convId = conversation?.id;
    if (!convId) return;

    let echoChannel = null;
    const echo = getEcho();

    if (echo) {
      try {
        echoChannel = echo.channel(`chat.${convId}`);
        echoChannel.listen('.message.sent', (data) => {
          setMessages((prev) => {
            if (prev.some((m) => m.id === data.id)) return prev;
            return [...prev, data];
          });
          if (!isOpen) {
            setUnreadCount((c) => c + 1);
          }
        });
      } catch (err) {
        console.warn('Reverb listener fallback active:', err);
      }
    }

    // Fallback sync polling every 4s
    const interval = setInterval(() => {
      chatApi.getMessages(convId).then((res) => {
        if (res.data?.success) {
          const list = Array.isArray(res.data.data) ? res.data.data : [];
          setMessages(list);
        }
      });
    }, 4000);

    return () => {
      clearInterval(interval);
      if (echo && echoChannel) {
        echo.leaveChannel(`chat.${convId}`);
      }
    };
  }, [conversation?.id, isOpen]);

  const handleStartChat = async (e) => {
    e.preventDefault();
    if (!visitorName.trim()) return;

    setLoading(true);
    try {
      localStorage.setItem('wecheaper_chat_name', visitorName);
      if (visitorEmail) localStorage.setItem('wecheaper_chat_email', visitorEmail);

      const res = await chatApi.startConversation({
        visitor_name: visitorName,
        visitor_email: visitorEmail,
        initial_message: inputText.trim() || undefined,
      });

      if (res.data?.success) {
        const conv = res.data.data;
        setConversation(conv);
        setMessages(conv.messages || []);
        localStorage.setItem('wecheaper_chat_id', conv.id);
        setIsStarted(true);
        setInputText('');
      }
    } catch (err) {
      console.error('Error starting chat:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e?.preventDefault();
    if (!inputText.trim() || !conversation) return;

    const text = inputText.trim();
    setInputText('');

    // Optimistic UI append
    const tempMsg = {
      id: Date.now(),
      conversation_id: conversation.id,
      sender_type: 'customer',
      sender_name: visitorName || 'You',
      message: text,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      await chatApi.sendMessage(conversation.id, {
        message: text,
        sender_name: visitorName,
        sender_type: 'customer',
      });
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleQuickPrompt = (prompt) => {
    setInputText(prompt);
  };

  return (
    <>
      {/* Floating Toggle Button (Bottom Right) */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`relative group flex items-center gap-2.5 text-white px-4 py-3.5 rounded-full shadow-2xl transition-all duration-300 cursor-pointer ${
            isOpen
              ? 'bg-slate-900 hover:bg-slate-800'
              : 'bg-gradient-to-r from-amber-600 via-amber-500 to-amber-700 hover:from-amber-700 hover:to-amber-800 shadow-amber-600/35 hover:scale-105 active:scale-95'
          }`}
          aria-label={isOpen ? 'Close Live Chat' : 'Open Live Chat'}
        >
          {isOpen ? (
            <>
              <X className="w-5 h-5 text-white" />
              <span className="font-semibold text-xs pr-1">Close</span>
            </>
          ) : (
            <>
              <div className="relative">
                <MessageSquare className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0a1829] animate-pulse" />
              </div>
              <span className="font-semibold text-xs pr-1">Live Chat</span>

              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-bounce">
                  {unreadCount}
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* Chat Window (Positioned directly above the trigger button) */}
      {isOpen && (
        <div className="fixed bottom-22 right-4 sm:right-6 w-[92vw] sm:w-[380px] h-[530px] max-h-[80vh] z-50 bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/60 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-[#0a1829] via-[#0d233a] to-[#0a1829] text-white p-4 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white shadow-md shadow-amber-500/20">
                  <Headphones className="w-5 h-5" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0a1829]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm font-serif">WeCheaper Support</h3>
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                </div>
                <p className="text-[10px] text-slate-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live with Managers & Egyptologists
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Minimize Chat"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close Chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Body */}
          {!isStarted ? (
            /* Onboarding Form */
            <div className="flex-1 p-5 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="text-center pt-2 space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 text-[11px] font-semibold">
                    <Sparkles className="w-3 h-3 text-amber-600" />
                    Direct Local Travel Concierge
                  </div>
                  <h4 className="font-bold text-base text-slate-900 font-serif">
                    Start a Live Conversation
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Our Cairo operations managers and tour coordinators are online to answer questions and customize itineraries.
                  </p>
                </div>

                <form onSubmit={handleStartChat} className="space-y-3 pt-2">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder="e.g. Sarah Jenkins"
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Email (Optional)</label>
                    <input
                      type="email"
                      value={visitorEmail}
                      onChange={(e) => setVisitorEmail(e.target.value)}
                      placeholder="For itinerary quotes"
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">How can we help?</label>
                    <textarea
                      rows={2}
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Ask about Pyramids, Nile Cruise dates, luxury stays..."
                      className="w-full px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden resize-none"
                    />
                  </div>

                  {/* Quick Suggestions */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleQuickPrompt('I want to book a Nile Cruise')}
                      className="text-[10px] bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                    >
                      <Ship className="w-3 h-3 text-amber-600" />
                      Nile Cruise inquiry
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickPrompt('Private Giza Pyramids day tour')}
                      className="text-[10px] bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                    >
                      <Compass className="w-3 h-3 text-amber-600" />
                      Giza Day Tour
                    </button>
                    <button
                      type="button"
                      onClick={() => handleQuickPrompt('Airport transfer / car rental')}
                      className="text-[10px] bg-slate-100 hover:bg-amber-50 hover:text-amber-700 text-slate-600 px-2.5 py-1 rounded-lg border border-slate-200 transition-colors flex items-center gap-1"
                    >
                      <Car className="w-3 h-3 text-amber-600" />
                      Chauffeured Car
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full mt-2 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white font-bold text-xs rounded-xl shadow-md shadow-amber-600/25 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {loading ? 'Connecting...' : 'Connect With Travel Agent'}
                  </button>
                </form>
              </div>

              <div className="text-[10px] text-center text-slate-400 pt-3">
                Powered by Laravel Reverb WebSocket Engine
              </div>
            </div>
          ) : (
            /* Active Live Chat Thread */
            <>
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/60">
                {messages.map((m) => {
                  const isUser = m.sender_type === 'customer';
                  const isManager = m.sender_type === 'manager';
                  const isAdmin = m.sender_type === 'admin';

                  return (
                    <div
                      key={m.id}
                      className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}
                    >
                      {/* Sender tag */}
                      <span className="text-[10px] text-slate-400 mb-0.5 px-1 flex items-center gap-1">
                        {!isUser && (
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold uppercase ${
                            isManager ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {isManager ? 'Manager' : 'Admin'}
                          </span>
                        )}
                        <span>{m.sender_name}</span>
                      </span>

                      {/* Bubble */}
                      <div
                        className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed shadow-xs ${
                          isUser
                            ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-br-xs'
                            : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                        }`}
                      >
                        {m.message}
                      </div>

                      {/* Timestamp */}
                      <span className="text-[9px] text-slate-400 mt-0.5 px-1">
                        {new Date(m.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Footer */}
              <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-slate-200/70 flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  className="p-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-40"
                  aria-label="Send Message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

        </div>
      )}
    </>
  );
};

export default LiveChatWidget;
