import React, { useState, useEffect, useRef } from 'react';
import { Send, Search, MessageSquare, Clock } from 'lucide-react';
import Sidebar from '../../../components/common/Sidebar';
import Topbar from '../../../components/common/Topbar';
import api from '../../../api/axios';
import Loader from '../../../components/common/Loader';

const Chat = () => {
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClient) {
      fetchMessages(selectedClient._id);
    }
  }, [selectedClient]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchClients = async () => {
    try {
      const res = await api.get('/clients');
      if (res.data.success) {
        const list = res.data.data || res.data.clients || [];
        setClients(list);
        if (list.length > 0) {
          setSelectedClient(list[0]);
        } else {
          setLoading(false);
        }
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchMessages = async (clientId) => {
    try {
      setLoading(true);
      const res = await api.get(`/chat/${clientId}`);
      if (res.data.success) {
        setMessages(res.data.messages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedClient) return;

    try {
      const res = await api.post(`/chat/${selectedClient._id}`, { text: newMessage });
      if (res.data.success) {
        setMessages([...messages, res.data.message]);
        setNewMessage('');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-140px)] max-w-7xl mx-auto w-full">
          
          {/* Left Column: Client List */}
          <div className="w-full lg:w-80 flex flex-col bg-bg-card border border-border rounded-xl shadow-sm h-[250px] lg:h-full overflow-hidden shrink-0">
            <div className="p-4 border-b border-border bg-bg-card-elevated">
              <h2 className="font-bold text-ink mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                Messages
              </h2>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
              {clients.map(client => (
                <button
                  key={client._id}
                  onClick={() => setSelectedClient(client)}
                  className={`w-full text-left px-3 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                    selectedClient?._id === client._id 
                      ? 'bg-primary/10' 
                      : 'hover:bg-bg-main'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm shrink-0">
                    {client.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <span className={`text-sm truncate ${selectedClient?._id === client._id ? 'font-bold text-primary' : 'font-semibold text-ink'}`}>
                        {client.name}
                      </span>
                      {/* Placeholder for timestamp */}
                    </div>
                    <span className="text-xs text-slate truncate block">
                      Click to view chat
                    </span>
                  </div>
                </button>
              ))}
              {clients.length === 0 && !loading && (
                <div className="text-sm text-slate p-4 text-center">No clients available</div>
              )}
            </div>
          </div>

          {/* Right Column: Chat Area */}
          <div className="flex-1 flex flex-col bg-bg-card border border-border rounded-xl shadow-sm overflow-hidden h-full">
            {selectedClient ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-border bg-bg-card-elevated flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                      {selectedClient.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-ink">{selectedClient.name}</h3>
                      <p className="text-xs text-slate capitalize">{selectedClient.status} Client</p>
                    </div>
                  </div>
                </div>

                {/* Messages Container */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-bg-main">
                  {loading ? (
                    <div className="flex justify-center p-12"><Loader /></div>
                  ) : messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate">
                      <MessageSquare className="w-12 h-12 mb-4 opacity-30" />
                      <p>No messages yet. Send a message to start the conversation.</p>
                    </div>
                  ) : (
                    messages.map((msg, idx) => {
                      const isTherapist = msg.senderModel === 'Therapist';
                      const showTimestamp = idx === 0 || new Date(msg.createdAt) - new Date(messages[idx-1].createdAt) > 300000;
                      return (
                        <div key={msg._id} className="flex flex-col">
                          {showTimestamp && (
                            <div className="text-[10px] font-semibold text-slate/60 text-center my-3 uppercase tracking-wider">
                              {new Date(msg.createdAt).toLocaleString()}
                            </div>
                          )}
                          <div className={`flex ${isTherapist ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                              isTherapist 
                                ? 'bg-primary text-white rounded-br-sm' 
                                : 'bg-white border border-border text-ink rounded-bl-sm'
                            }`}>
                              <p className="text-sm break-words">{msg.text}</p>
                              <div className={`text-[10px] mt-1 text-right ${isTherapist ? 'text-white/70' : 'text-slate'}`}>
                                {new Date(msg.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-border bg-white shrink-0">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 bg-bg-main border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button 
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shrink-0"
                    >
                      <Send className="w-4 h-4 ml-0.5" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate">
                <MessageSquare className="w-12 h-12 mb-4 opacity-30" />
                <p>Select a client to start chatting.</p>
              </div>
            )}
          </div>

      </div>
    </>
  );
};

export default Chat;
