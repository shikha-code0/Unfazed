import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Mail, Phone, Calendar, Clock, FileText, UserCircle,
  CheckCircle, AlertCircle, MoreVertical, MessageSquare
} from 'lucide-react';
import Button from '../../../components/common/Button';
import Loader from '../../../components/common/Loader';
import Toast from '../../../components/common/Toast';
import IntakeForm from '../../../components/crm/IntakeForm';
import ConsentForm from '../../../components/crm/ConsentForm';
import { getClientById } from '../../../api/clientApi';
import { schedulingApi } from '../../../api/schedulingApi';
import api from '../../../api/axios';

const statusClass = (status) => {
  if (status === 'active') return 'bg-sage/20 text-sage';
  if (status === 'waitlisted') return 'bg-warning-bg text-warning';
  if (status === 'discharged') return 'bg-slate/10 text-slate';
  return 'bg-error-bg text-error';
};

const ClientProfile = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [notes, setNotes] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [toast, setToast] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  
  // Note Editor State
  const [newNote, setNewNote] = useState('');
  const [savingNote, setSavingNote] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [resClient, resSessions, resNotes, resPayments] = await Promise.all([
        getClientById(clientId),
        schedulingApi.getMySchedule().catch(() => ({ sessions: [] })),
        api.get(`/notes/client/${clientId}`).catch(() => ({ data: { notes: [] } })),
        api.get(`/payments`).catch(() => ({ data: { payments: [] } })), // In a real app we'd have /payments/client/:clientId
      ]);
      
      const loaded = resClient.data || resClient.client;
      if (resClient.success && loaded) {
        setClient(loaded);
      } else {
        setError('Client not found');
      }
      
      const allSessions = resSessions.sessions || resSessions.data || [];
      setSessions(
        allSessions.filter(
          (s) => String(s.clientId) === String(clientId) || s.clientEmail === loaded?.email
        )
      );

      setNotes(resNotes?.data?.notes || []);
      
      const allPayments = resPayments?.data?.payments || [];
      setPayments(allPayments.filter(p => String(p.clientId?._id || p.clientId) === String(clientId)));

    } catch (err) {
      setError(err.response?.status === 404 ? 'Client not found' : 'Could not load client.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [clientId]);

  const handleSaveNote = async () => {
    if (!newNote.trim()) return;
    setSavingNote(true);
    try {
      const res = await api.post('/notes', {
        clientId,
        content: newNote,
        type: 'progress'
      });
      if (res.data.success) {
        setNotes([res.data.note, ...notes]);
        setNewNote('');
        setToast({ message: 'Note saved securely.', type: 'success' });
      }
    } catch (err) {
      setToast({ message: 'Failed to save note.', type: 'error' });
    } finally {
      setSavingNote(false);
    }
  };

  const consentAccepted = Boolean(client?.consent?.given || client?.consentRecord?.accepted);
  const now = new Date();
  const upcoming = sessions
    .filter((s) => new Date(s.startTime) >= now && s.status !== 'cancelled')
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
  const recent = [...sessions].sort((a, b) => new Date(b.startTime) - new Date(a.startTime)).slice(0, 5);
  const paid = sessions.filter((s) => s.paymentStatus === 'paid').length;

  const handleBook = () => {
    if (!consentAccepted) {
      setToast({ message: 'Consent must be accepted before booking can be completed.', type: 'error' });
      setActiveTab('intake');
      return;
    }
    navigate('/schedule');
  };

  if (loading) {
    return <div className="flex-1 flex justify-center items-center h-[50vh]"><Loader /></div>;
  }

  if (error || !client) {
    return (
      <div className="max-w-5xl mx-auto space-y-4">
        <Link to="/clients" className="inline-flex items-center gap-2 text-sm text-slate hover:text-ink">
          <ArrowLeft className="w-4 h-4" /> Back to Clients
        </Link>
        <div className="bg-error-bg border border-error/20 text-error rounded-xl p-6">{error || 'Client not found'}</div>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'sessions', label: 'Sessions' },
    { id: 'notes', label: 'Notes' },
    { id: 'payments', label: 'Payments' },
    { id: 'intake', label: 'Intake' },
  ];

  const consentDate = client.consentRecord?.acceptedAt || client.consent?.timestamp;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <Link to="/clients" className="inline-flex items-center gap-2 text-sm text-slate hover:text-ink transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Clients
      </Link>

      <div className="bg-bg-card border border-border rounded-xl shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20 text-2xl font-bold">
              {client.name?.charAt(0) || <UserCircle className="w-10 h-10" />}
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold text-ink">{client.name}</h1>
              <div className="flex flex-wrap items-center gap-3 mt-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${statusClass(client.status)}`}>
                  {client.status}
                </span>
                {client.tags?.map((tag) => (
                  <span key={tag} className="bg-bg-main border border-border px-2 py-0.5 rounded text-xs text-slate">{tag}</span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate">
                <span className="flex items-center gap-1"><Mail className="w-4 h-4" /> {client.email}</span>
                {client.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4" /> {client.phone}</span>}
              </div>
              {consentAccepted && consentDate && (
                <p className="text-xs text-sage mt-2">Consent completed on {new Date(consentDate).toLocaleDateString()}</p>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-3 relative">
            <Button variant="primary" icon={Calendar} onClick={handleBook}>Book Session</Button>
            <Button variant="secondary" icon={MessageSquare} onClick={() => setToast({ message: 'Messaging arrives in a later module.', type: 'info' })}>
              Send Message
            </Button>
            <Button variant="ghost" icon={MoreVertical} onClick={() => setMenuOpen((v) => !v)} />
            {menuOpen && (
              <div className="absolute right-0 top-12 w-44 bg-white border border-border rounded-lg shadow-card py-1 z-10">
                <button className="w-full text-left px-3 py-2 text-sm text-slate">More actions coming soon</button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="border-b border-border flex gap-6 px-2 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`py-3 px-2 font-semibold text-sm whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-slate hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="pt-2">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              <div className="bg-bg-card border border-border rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-ink mb-4">Contact</h3>
                <div className="space-y-3 text-sm">
                  <div><span className="block text-slate text-xs mb-1">Pronouns</span><span className="font-semibold">{client.pronouns || 'Not provided'}</span></div>
                  <div>
                    <span className="block text-slate text-xs mb-1">Date of Birth</span>
                    <span className="font-semibold">{client.dateOfBirth ? new Date(client.dateOfBirth).toLocaleDateString() : 'Not provided'}</span>
                  </div>
                  <div><span className="block text-slate text-xs mb-1">Address</span><span className="font-semibold">{client.address || 'Not provided'}</span></div>
                  <div><span className="block text-slate text-xs mb-1">Client Since</span><span className="font-semibold">{new Date(client.createdAt).toLocaleDateString()}</span></div>
                </div>
              </div>
              {client.sessionSummary && (
                <div className="bg-bg-card border border-border rounded-xl shadow-sm p-6">
                  <h3 className="font-bold text-ink mb-3">Session summary</h3>
                  <p className="text-sm text-slate">{client.sessionSummary.total} sessions · {client.sessionSummary.paid} paid · {client.sessionSummary.upcoming} upcoming</p>
                </div>
              )}
            </div>

            <div className="lg:col-span-2 space-y-6">
              <div className="bg-bg-card border border-border rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-ink mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" /> Upcoming appointment
                </h3>
                {upcoming[0] ? (
                  <div className="border border-border rounded-lg p-4 bg-white">
                    <p className="font-bold text-ink">{upcoming[0].serviceType}</p>
                    <p className="text-sm text-slate mt-1">
                      {new Date(upcoming[0].startTime).toLocaleString()} · {upcoming[0].sessionMode} · {upcoming[0].status}
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-3">
                    <p className="font-bold text-ink">No upcoming sessions</p>
                    <Button variant="secondary" size="sm" onClick={handleBook}>Book Session</Button>
                  </div>
                )}
              </div>
              <div className="bg-bg-card border border-border rounded-xl shadow-sm p-6">
                <h3 className="font-bold text-ink mb-4">Recent timeline</h3>
                {recent.length === 0 ? (
                  <p className="text-sm text-slate">No session activity yet.</p>
                ) : (
                  <ul className="space-y-3">
                    {recent.map((s) => (
                      <li key={s._id} className="flex justify-between gap-3 text-sm border-b border-border pb-3 last:border-0">
                        <span className="font-semibold text-ink">{s.serviceType} · {s.status}</span>
                        <span className="text-slate">{new Date(s.startTime).toLocaleDateString()}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="bg-bg-card border border-border rounded-xl shadow-sm p-6 min-h-[300px]">
            <h3 className="font-bold text-ink mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" /> Sessions
            </h3>
            {sessions.length === 0 ? (
              <div className="text-center text-slate py-12 border-2 border-dashed border-border rounded-xl">No sessions found.</div>
            ) : (
              <div className="space-y-3">
                {sessions
                  .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))
                  .map((s) => (
                    <div key={s._id} className="border border-border rounded-lg p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <p className="font-bold text-ink">{s.serviceType}</p>
                        <p className="text-sm text-slate">{new Date(s.startTime).toLocaleString()} · {s.sessionMode}</p>
                      </div>
                      <div className="text-xs font-semibold capitalize text-slate">{s.status} · {s.paymentStatus}</div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="bg-bg-card border border-border rounded-xl shadow-sm p-6 min-h-[300px]">
            <h3 className="font-bold text-ink mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" /> Clinical Notes
            </h3>
            
            <div className="mb-8">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Write a new progress note..."
                className="w-full min-h-[120px] p-4 bg-bg-main border border-border rounded-lg text-ink text-sm focus:outline-none focus:border-primary/50 resize-y mb-3"
              />
              <div className="flex justify-end">
                <Button variant="primary" onClick={handleSaveNote} disabled={savingNote || !newNote.trim()}>
                  {savingNote ? 'Saving...' : 'Save Note'}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              {notes.length === 0 ? (
                <p className="text-slate text-sm text-center py-8">No clinical notes yet.</p>
              ) : (
                notes.map(note => (
                  <div key={note._id} className="border border-border rounded-lg p-4 bg-bg-main">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-slate uppercase">{note.type} Note</span>
                      <span className="text-xs text-slate">{new Date(note.createdAt).toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-ink whitespace-pre-wrap">{note.content}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="bg-bg-card border border-border rounded-xl shadow-sm p-6 min-h-[300px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-ink">Payments & Packages</h3>
              <Button variant="secondary" size="sm">Record Payment</Button>
            </div>
            
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div className="border border-border rounded-lg p-4 bg-bg-main">
                <p className="text-xs font-semibold text-slate mb-1 uppercase">Total Paid</p>
                <p className="text-2xl font-bold text-ink">₹{payments.filter(p => p.status === 'paid').reduce((a, b) => a + b.amount, 0)}</p>
              </div>
              <div className="border border-border rounded-lg p-4 bg-bg-main">
                <p className="text-xs font-semibold text-slate mb-1 uppercase">Outstanding</p>
                <p className="text-2xl font-bold text-error">₹{payments.filter(p => p.status === 'pending').reduce((a, b) => a + b.amount, 0)}</p>
              </div>
            </div>

            <h4 className="font-bold text-sm text-ink mb-3 uppercase tracking-wider">Transaction History</h4>
            {payments.length === 0 ? (
              <p className="text-slate text-sm text-center py-8 border border-dashed border-border rounded-lg">No payment records found.</p>
            ) : (
              <div className="space-y-2">
                {payments.map(payment => (
                  <div key={payment._id} className="border border-border rounded-lg p-4 bg-white flex justify-between items-center">
                    <div>
                      <p className="font-bold text-ink text-sm">₹{payment.amount} <span className="text-slate font-normal ml-2">via {payment.method}</span></p>
                      <p className="text-xs text-slate mt-1">{new Date(payment.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold uppercase ${payment.status === 'paid' ? 'bg-sage/10 text-sage' : 'bg-warning/10 text-warning-dark'}`}>
                      {payment.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'intake' && (
          <div className="space-y-8">
            <ConsentForm clientId={clientId} clientName={client.name} onSaved={load} />
            <IntakeForm
              clientId={clientId}
              consentAccepted={consentAccepted}
              onSaved={load}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientProfile;
