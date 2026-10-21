import apiClient from './apiClient';

const wrapData = (data) => ({
  data: {
    success: true,
    data,
  },
});

const getLocalConversations = () => {
  try {
    const raw = localStorage.getItem('wecheaper_chat_conversations');
    if (raw) return JSON.parse(raw);
  } catch (e) {}

  const defaults = [
    {
      id: 1,
      visitor_name: 'Sarah Jenkins',
      visitor_email: 'sarah.jenkins@example.com',
      visitor_phone: '+44 7700 900077',
      status: 'active',
      unread_count: 1,
      last_message: 'Is the 4-night Nile cruise from Luxor available next Thursday?',
      updated_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      messages: [
        {
          id: 101,
          conversation_id: 1,
          sender_type: 'customer',
          sender_name: 'Sarah Jenkins',
          message: 'Hello! I am planning a holiday to Egypt in November.',
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
        },
        {
          id: 102,
          conversation_id: 1,
          sender_type: 'manager',
          sender_name: 'Ahmed Mansoor (Operations)',
          message: 'Welcome Sarah! I would be delighted to assist you with your Nile Cruise plans.',
          created_at: new Date(Date.now() - 1000 * 60 * 20).toISOString(),
        },
        {
          id: 103,
          conversation_id: 1,
          sender_type: 'customer',
          sender_name: 'Sarah Jenkins',
          message: 'Is the 4-night Nile cruise from Luxor available next Thursday?',
          created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
        },
      ],
    },
    {
      id: 2,
      visitor_name: 'David Miller',
      visitor_email: 'david.miller@example.com',
      visitor_phone: '+1 202 555 0192',
      status: 'active',
      unread_count: 0,
      last_message: 'Thank you for the quick quote!',
      updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      messages: [
        {
          id: 201,
          conversation_id: 2,
          sender_type: 'customer',
          sender_name: 'David Miller',
          message: 'Hi, can we arrange private Giza airport pickup with an English guide?',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        },
        {
          id: 202,
          conversation_id: 2,
          sender_type: 'admin',
          sender_name: 'WeCheaperTours Support',
          message: 'Yes David, chauffeured private transfer with an Egyptologist guide is 100% available!',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2.5).toISOString(),
        },
        {
          id: 203,
          conversation_id: 2,
          sender_type: 'customer',
          sender_name: 'David Miller',
          message: 'Thank you for the quick quote!',
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        },
      ],
    },
  ];

  try {
    localStorage.setItem('wecheaper_chat_conversations', JSON.stringify(defaults));
  } catch (e) {}
  return defaults;
};

const saveLocalConversations = (list) => {
  try {
    localStorage.setItem('wecheaper_chat_conversations', JSON.stringify(list));
  } catch (e) {}
};

export const chatApi = {
  // Customer: Start or get active conversation
  startConversation: async (data) => {
    try {
      const res = await apiClient.post('/chat/start', data);
      if (res.data && res.data.success) return res;
    } catch (e) {}

    const convs = getLocalConversations();
    let existing = convs.find(
      (c) => c.visitor_email && c.visitor_email.toLowerCase() === data.visitor_email?.toLowerCase()
    );

    if (!existing) {
      existing = {
        id: Date.now(),
        visitor_name: data.visitor_name || 'Website Visitor',
        visitor_email: data.visitor_email || '',
        visitor_phone: data.visitor_phone || '',
        status: 'active',
        unread_count: 0,
        last_message: 'Conversation started',
        updated_at: new Date().toISOString(),
        messages: [
          {
            id: Date.now() + 1,
            conversation_id: Date.now(),
            sender_type: 'admin',
            sender_name: 'WeCheaperTours Team',
            message: `Hello ${data.visitor_name || 'traveler'}! Welcome to WeCheaperTours. How can we help you plan your journey in Egypt today?`,
            created_at: new Date().toISOString(),
          },
        ],
      };
      convs.unshift(existing);
      saveLocalConversations(convs);
    }

    return wrapData(existing);
  },

  // Customer & Admin: Get messages for conversation
  getMessages: async (conversationId) => {
    try {
      const res = await apiClient.get(`/chat/${conversationId}/messages`);
      if (res.data && res.data.success) {
        const raw = res.data.data;
        const list = Array.isArray(raw) ? raw : (raw?.data || []);
        return wrapData(list);
      }
    } catch (e) {}

    const convs = getLocalConversations();
    const found = convs.find((c) => c.id === Number(conversationId));
    return wrapData(found ? found.messages || [] : []);
  },

  // Customer: Send message
  sendMessage: async (conversationId, messageData) => {
    try {
      const res = await apiClient.post(`/chat/${conversationId}/messages`, messageData);
      if (res.data && res.data.success) return res;
    } catch (e) {}

    const convs = getLocalConversations();
    const conv = convs.find((c) => c.id === Number(conversationId));
    const newMsg = {
      id: Date.now(),
      conversation_id: Number(conversationId),
      sender_type: messageData.sender_type || 'customer',
      sender_name: messageData.sender_name || 'Customer',
      message: messageData.message,
      created_at: new Date().toISOString(),
    };

    if (conv) {
      conv.messages = conv.messages || [];
      conv.messages.push(newMsg);
      conv.last_message = messageData.message;
      conv.updated_at = new Date().toISOString();
      if (messageData.sender_type === 'customer') {
        conv.unread_count = (conv.unread_count || 0) + 1;
      }
      saveLocalConversations(convs);
    }

    return wrapData(newMsg);
  },

  // Admin: Get all conversations
  getConversations: async () => {
    try {
      const res = await apiClient.get('/admin/chat/conversations');
      if (res.data && res.data.success) {
        const raw = res.data.data;
        const list = Array.isArray(raw) ? raw : (raw?.data || []);
        return wrapData(list);
      }
    } catch (e) {}

    return wrapData(getLocalConversations());
  },

  // Admin: Reply to customer
  adminReply: async (conversationId, messageData) => {
    try {
      const res = await apiClient.post(`/admin/chat/conversations/${conversationId}/messages`, messageData);
      if (res.data && res.data.success) return res;
    } catch (e) {}

    const convs = getLocalConversations();
    const conv = convs.find((c) => c.id === Number(conversationId));
    const newMsg = {
      id: Date.now(),
      conversation_id: Number(conversationId),
      sender_type: messageData.sender_type || 'admin',
      sender_name: messageData.sender_name || 'Support Agent',
      message: messageData.message,
      created_at: new Date().toISOString(),
    };

    if (conv) {
      conv.messages = conv.messages || [];
      conv.messages.push(newMsg);
      conv.last_message = messageData.message;
      conv.updated_at = new Date().toISOString();
      conv.unread_count = 0;
      saveLocalConversations(convs);
    }

    return wrapData(newMsg);
  },

  // Admin: Close conversation
  closeConversation: async (conversationId) => {
    try {
      const res = await apiClient.post(`/admin/chat/conversations/${conversationId}/close`);
      if (res.data && res.data.success) return res;
    } catch (e) {}

    const convs = getLocalConversations();
    const conv = convs.find((c) => c.id === Number(conversationId));
    if (conv) {
      conv.status = 'closed';
      saveLocalConversations(convs);
    }
    return wrapData({ success: true });
  },
};

export default chatApi;
