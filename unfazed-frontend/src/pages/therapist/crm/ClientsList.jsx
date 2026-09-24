import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, MoreVertical, Mail, Phone, Calendar, Trash2, Eye, X } from 'lucide-react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Loader from '../../../components/common/Loader';
import Toast from '../../../components/common/Toast';
import { getClients, createClient, deleteClient } from '../../../api/clientApi';

const STATUSES = ['all', 'active', 'waitlisted', 'inactive', 'discharged'];

const statusClass = (status) => {
  if (status === 'active') return 'bg-sage/20 text-sage';
  if (status === 'waitlisted') return 'bg-warning-bg text-warning';
  if (status === 'discharged') return 'bg-slate/10 text-slate';
  return 'bg-error-bg text-error';
};

const formatSession = (session) => {
  if (!session?.startTime) return '—';
  return new Date(session.startTime).toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  dateOfBirth: '',
  pronouns: '',
  address: '',
  tags: '',
  status: 'active',
};

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await getClients();
      if (res.success) {
        setClients(res.data || res.clients || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load clients.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter((c) => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    const q = searchTerm.toLowerCase().trim();
    if (!q) return true;
    const tags = (c.tags || []).join(' ').toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      tags.includes(q)
    );
  });

  const validate = () => {
    const next = {};
    if (!form.name.trim() || form.name.trim().length < 2) next.name = 'Name is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Valid email is required.';
    setFormErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      const res = await createClient({
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      });
      if (res.success) {
        setToast({ message: 'Client added.', type: 'success' });
        setShowModal(false);
        setForm(emptyForm);
        await fetchClients();
      }
    } catch (err) {
      setToast({
        message: err.response?.data?.message || 'Could not add client.',
        type: 'error',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (client) => {
    if (!window.confirm(`Remove ${client.name} from your caseload?`)) return;
    try {
      await deleteClient(client._id);
      setToast({ message: 'Client removed.', type: 'success' });
      setClients((prev) => prev.filter((c) => c._id !== client._id));
    } catch (err) {
      setToast({ message: err.response?.data?.message || 'Could not delete client.', type: 'error' });
    }
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-ink">Clients</h1>
            <p className="text-slate mt-1">Manage your caseload, intake, and consent.</p>
          </div>
          <Button variant="primary" icon={Plus} onClick={() => setShowModal(true)}>
            Add Client
          </Button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate" />
            <input
              type="text"
              placeholder="Search name, email, phone, tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white shadow-sm"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold capitalize border transition-colors ${
                  statusFilter === status
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-slate border-border hover:text-ink'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-error-bg border border-error/20 text-error rounded-xl p-4 text-sm">{error}</div>
        )}

        <div className="bg-bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 flex justify-center"><Loader /></div>
          ) : filteredClients.length === 0 ? (
            <div className="p-12 text-center text-slate">
              {clients.length === 0 ? 'No clients yet. Add your first client.' : 'No clients match this search.'}
            </div>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-bg-card-elevated border-b border-border">
                      <th className="py-4 px-6 text-xs font-bold text-slate uppercase tracking-wider">Client</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate uppercase tracking-wider">Contact</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate uppercase tracking-wider">Status</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate uppercase tracking-wider">Tags</th>
                      <th className="py-4 px-6 text-xs font-bold text-slate uppercase tracking-wider">Last / Next</th>
                      <th className="py-4 px-6 text-right text-xs font-bold text-slate uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredClients.map((client) => (
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
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusClass(client.status)}`}>
                            {client.status}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-1 flex-wrap">
                            {client.tags?.slice(0, 2).map((tag) => (
                              <span key={tag} className="bg-bg-main border border-border px-2 py-0.5 rounded text-xs text-slate">{tag}</span>
                            ))}
                            {client.tags?.length > 2 && <span className="text-xs text-slate">+{client.tags.length - 2}</span>}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-xs text-slate">
                          <div>Last: {formatSession(client.lastSession)}</div>
                          <div>Next: {formatSession(client.nextSession)}</div>
                        </td>
                        <td className="py-4 px-6 text-right relative" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="p-2 text-slate hover:bg-white rounded-md"
                            onClick={() => setOpenMenu(openMenu === client._id ? null : client._id)}
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          {openMenu === client._id && (
                            <div className="absolute right-6 top-12 z-10 w-40 bg-white border border-border rounded-lg shadow-card py-1 text-left">
                              <button className="w-full px-3 py-2 text-sm hover:bg-bg-main flex items-center gap-2" onClick={() => navigate(`/clients/${client._id}`)}>
                                <Eye className="w-4 h-4" /> View
                              </button>
                              <button className="w-full px-3 py-2 text-sm hover:bg-bg-main flex items-center gap-2" onClick={() => navigate(`/schedule`)}>
                                <Calendar className="w-4 h-4" /> Book
                              </button>
                              <button className="w-full px-3 py-2 text-sm text-error hover:bg-error-bg flex items-center gap-2" onClick={() => handleDelete(client)}>
                                <Trash2 className="w-4 h-4" /> Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden divide-y divide-border">
                {filteredClients.map((client) => (
                  <div key={client._id} className="p-4 space-y-3" onClick={() => navigate(`/clients/${client._id}`)}>
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <div className="font-bold text-ink">{client.name}</div>
                        <div className="text-sm text-slate">{client.email}</div>
                        {client.phone && <div className="text-sm text-slate">{client.phone}</div>}
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusClass(client.status)}`}>
                        {client.status}
                      </span>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {client.tags?.map((tag) => (
                        <span key={tag} className="bg-bg-main border border-border px-2 py-0.5 rounded text-xs text-slate">{tag}</span>
                      ))}
                    </div>
                    <div className="text-xs text-slate">Last: {formatSession(client.lastSession)} · Next: {formatSession(client.nextSession)}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
          <div className="bg-bg-card-elevated w-full max-w-lg rounded-2xl shadow-2xl border border-border max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-5 border-b border-border">
              <h2 className="font-serif text-xl text-ink font-bold">Add Client</h2>
              <button onClick={() => setShowModal(false)} className="p-2 text-slate hover:text-ink rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <Input label="Full name" value={form.name} error={formErrors.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              <Input label="Email" type="email" value={form.email} error={formErrors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Input label="Date of birth" type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} />
              <Input label="Pronouns" value={form.pronouns} onChange={(e) => setForm({ ...form, pronouns: e.target.value })} />
              <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              <Input label="Tags" helperText="Comma-separated" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              <div>
                <label className="block text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="w-full h-[44px] px-3.5 bg-surface border border-border rounded-[10px] text-sm"
                >
                  {STATUSES.filter((s) => s !== 'all').map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="ghost" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary" loading={saving}>Save Client</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ClientsList;
