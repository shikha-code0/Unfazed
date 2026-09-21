import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, MoreVertical, Mail, Phone } from 'lucide-react';
import Sidebar from '../../../components/common/Sidebar';
import Topbar from '../../../components/common/Topbar';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import api from '../../../api/axios';
import Loader from '../../../components/common/Loader';
import Toast from '../../../components/common/Toast';

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const res = await api.get('/clients');
      if (res.data.success) {
        setClients(res.data.clients);
      }
    } catch (err) {
      console.error('Error fetching clients', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-serif font-bold text-ink">Clients</h1>
                <p className="text-slate mt-1">Manage your active clients, leads, and waitlist.</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="primary" icon={Plus}>Add Client</Button>
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative w-full sm:w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white shadow-sm"
                />
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button variant="outline" icon={Filter} className="w-full sm:w-auto justify-center">Filter</Button>
              </div>
            </div>

            {/* List */}
            <div className="bg-bg-card border border-border rounded-xl shadow-sm overflow-hidden">
              {loading ? (
                <div className="p-12 flex justify-center"><Loader /></div>
              ) : filteredClients.length === 0 ? (
                <div className="p-12 text-center text-slate">
                  No clients found.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-bg-card-elevated border-b border-border">
                        <th className="py-4 px-6 text-xs font-bold text-slate uppercase tracking-wider">Client Name</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate uppercase tracking-wider">Contact</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate uppercase tracking-wider">Status</th>
                        <th className="py-4 px-6 text-xs font-bold text-slate uppercase tracking-wider">Tags</th>
                        <th className="py-4 px-6 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredClients.map(client => (
                        <tr 
                          key={client._id} 
                          className="hover:bg-bg-main cursor-pointer transition-colors"
                          onClick={() => navigate(`/clients/${client._id}`)}
                        >
                          <td className="py-4 px-6">
                            <div className="font-bold text-ink">{client.name}</div>
                            <div className="text-xs text-slate">Added {new Date(client.createdAt).toLocaleDateString()}</div>
                          </td>
                          <td className="py-4 px-6 space-y-1">
                            <div className="flex items-center gap-2 text-sm text-slate">
                              <Mail className="w-3.5 h-3.5" />
                              <span>{client.email}</span>
                            </div>
                            {client.phone && (
                              <div className="flex items-center gap-2 text-sm text-slate">
                                <Phone className="w-3.5 h-3.5" />
                                <span>{client.phone}</span>
                              </div>
                            )}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize
                              ${client.status === 'active' ? 'bg-sage/20 text-sage' : 
                                client.status === 'waitlisted' ? 'bg-amber-100 text-amber-700' : 
                                'bg-slate/10 text-slate'}`}
                            >
                              {client.status}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex gap-1 flex-wrap">
                              {client.tags?.slice(0,2).map(tag => (
                                <span key={tag} className="bg-bg-main border border-border px-2 py-0.5 rounded text-xs text-slate">{tag}</span>
                              ))}
                              {client.tags?.length > 2 && <span className="text-xs text-slate">+{client.tags.length - 2}</span>}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <button className="p-2 text-slate hover:bg-white rounded-md" onClick={(e) => { e.stopPropagation(); }}>
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
      </div>
    </>
  );
};

export default ClientsList;
