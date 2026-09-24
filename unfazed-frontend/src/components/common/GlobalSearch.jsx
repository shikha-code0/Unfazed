import React, { useState, useEffect, useRef } from 'react';
import { Search, X, User, Calendar, CreditCard } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';

const GlobalSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        performSearch();
      } else {
        setResults(null);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const performSearch = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
      if (res.data.success) {
        setResults(res.data.results);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setResults(null);
    setIsOpen(false);
  };

  const handleResultClick = (type, item) => {
    clearSearch();
    if (type === 'client') {
      navigate(`/clients/${item._id}`);
    } else if (type === 'session') {
      navigate(`/schedule`); // Or open a specific modal if supported
    } else if (type === 'payment') {
      navigate(`/payments`);
    }
  };

  return (
    <div className="relative hidden md:block w-60 lg:w-72" ref={searchRef}>
      <Search className="w-4 h-4 text-slate absolute left-3.5 top-1/2 -translate-y-1/2" />
      <input
        type="text"
        placeholder="Search clients, sessions, payments..."
        className="w-full h-10 pl-9 pr-8 text-xs bg-bg-card border border-border rounded-lg text-ink placeholder:text-slate/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => {
          if (query.trim().length >= 2) setIsOpen(true);
        }}
      />
      {query && (
        <button 
          onClick={clearSearch}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate hover:text-ink focus:outline-none"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}

      {isOpen && (query.trim().length >= 2) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-xl shadow-card overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-slate text-sm">Searching...</div>
            ) : results && (results.clients.length === 0 && results.sessions.length === 0 && results.payments.length === 0) ? (
              <div className="p-4 text-center text-slate text-sm">No results found for "{query}"</div>
            ) : results ? (
              <div className="py-2">
                {results.clients.length > 0 && (
                  <div className="mb-2">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate uppercase tracking-wider bg-bg-main">Clients</div>
                    {results.clients.map(client => (
                      <div 
                        key={client._id}
                        onClick={() => handleResultClick('client', client)}
                        className="px-4 py-2 hover:bg-bg-main cursor-pointer flex items-center gap-3"
                      >
                        <User className="w-4 h-4 text-primary" />
                        <div>
                          <p className="text-sm font-semibold text-ink">{client.name}</p>
                          <p className="text-xs text-slate">{client.email}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {results.sessions.length > 0 && (
                  <div className="mb-2">
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate uppercase tracking-wider bg-bg-main">Sessions</div>
                    {results.sessions.map(session => (
                      <div 
                        key={session._id}
                        onClick={() => handleResultClick('session', session)}
                        className="px-4 py-2 hover:bg-bg-main cursor-pointer flex items-center gap-3"
                      >
                        <Calendar className="w-4 h-4 text-sage" />
                        <div>
                          <p className="text-sm font-semibold text-ink">{session.clientName || session.clientId?.name}</p>
                          <p className="text-xs text-slate capitalize">{session.serviceType ? `${session.serviceType} • ` : ''}{session.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {results.payments.length > 0 && (
                  <div>
                    <div className="px-3 py-1.5 text-[10px] font-bold text-slate uppercase tracking-wider bg-bg-main">Payments</div>
                    {results.payments.map(payment => (
                      <div 
                        key={payment._id}
                        onClick={() => handleResultClick('payment', payment)}
                        className="px-4 py-2 hover:bg-bg-main cursor-pointer flex items-center gap-3"
                      >
                        <CreditCard className="w-4 h-4 text-peach" />
                        <div>
                          <p className="text-sm font-semibold text-ink">₹{payment.amount} - {payment.clientId?.name}</p>
                          <p className="text-xs text-slate uppercase">{payment.status}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default GlobalSearch;
