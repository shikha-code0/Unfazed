import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, Calendar, FileText, CreditCard } from 'lucide-react';
import api from '../../api/axios';
import { useNavigate } from 'react-router-dom';

const NotificationsPopover = ({ onHover }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotifications();
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.data.success) {
        setNotifications(res.data.notifications);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, read: true } : n));
    } catch (err) {}
  };

  const markAllRead = async () => {
    try {
      await api.patch('/notifications/mark-all-read');
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    } catch (err) {}
  };

  const handleNotificationClick = (n) => {
    if (!n.read) markAsRead(n._id);
    setIsOpen(false);
    
    if (n.link) {
      navigate(n.link);
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative" ref={popoverRef}>
      <button
        type="button"
        className="relative p-2 text-slate hover:text-ink hover:bg-bg-main rounded-full transition-colors focus:outline-none"
        title="Notifications"
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={onHover}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-error text-white text-[10px] font-bold flex items-center justify-center border border-surface">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-surface rounded-xl shadow-card border border-border overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-4 py-3 border-b border-border flex justify-between items-center bg-bg-card">
            <h3 className="font-bold text-ink text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllRead}
                className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto divide-y divide-border">
            {loading ? (
              <div className="p-8 text-center text-slate text-sm">Loading...</div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-slate text-sm">You have no notifications.</div>
            ) : (
              notifications.map((n) => (
                <div 
                  key={n._id}
                  onClick={() => handleNotificationClick(n)}
                  className={`p-4 cursor-pointer hover:bg-bg-main transition-colors ${!n.read ? 'bg-primary/5' : ''}`}
                >
                  <div className="flex gap-3">
                    <div className={`mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${!n.read ? 'bg-primary/20 text-primary' : 'bg-slate/10 text-slate'}`}>
                      {n.type === 'booking' ? <Calendar className="w-4 h-4" /> :
                       n.type === 'payment' ? <CreditCard className="w-4 h-4" /> :
                       n.type === 'intake' ? <FileText className="w-4 h-4" /> :
                       <Bell className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className={`text-sm ${!n.read ? 'font-semibold text-ink' : 'text-slate'}`}>{n.title}</p>
                      <p className="text-xs text-slate mt-0.5 line-clamp-2">{n.message}</p>
                      <p className="text-[10px] text-slate/70 mt-1 uppercase font-semibold">{new Date(n.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsPopover;
