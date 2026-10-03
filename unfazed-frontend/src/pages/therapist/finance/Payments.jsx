import React, { useState, useEffect } from 'react';
import { Plus, Filter, CreditCard, ArrowUpRight, X } from 'lucide-react';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import Toast from '../../../components/common/Toast';
import api from '../../../api/axios';
import Loader from '../../../components/common/Loader';

// ─── Record Payment Modal ─────────────────────────────────────────────────────

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'upi', label: 'UPI' },
  { value: 'card', label: 'Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'other', label: 'Other' },
];
const PAYMENT_STATUSES = [
  { value: 'paid', label: 'Paid' },
  { value: 'pending', label: 'Pending' },
  { value: 'failed', label: 'Failed' },
];

const RecordPaymentModal = ({ clients, onClose, onSaved }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    clientId: '',
    amount: '',
    method: 'upi',
    status: 'paid',
    transactionId: '',
    notes: '',
  });

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.clientId) {
      setError('Please select a client.');
      return;
    }
    const amount = Number(form.amount);
    if (!form.amount || isNaN(amount) || amount <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        clientId: form.clientId,
        amount,
        method: form.method,
        status: form.status,
        transactionId: form.transactionId.trim() || undefined,
        notes: form.notes.trim() || undefined,
      };

      const res = await api.post('/payments', payload);
      if (res.data.success) {
        onSaved(res.data.payment);
      } else {
        setError(res.data.message || 'Failed to record payment.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to record payment.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
      <div className="bg-bg-card-elevated rounded-2xl border border-border shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <h2 className="font-serif text-xl font-bold text-ink">Record Payment</h2>
          <button onClick={onClose} className="p-1.5 text-slate hover:text-ink hover:bg-bg-main rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6">
          {error && (
            <div className="mb-4 bg-error-bg border border-error/20 rounded-lg p-3 text-error text-sm">
              {error}
            </div>
          )}

          <form id="record-payment-form" onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-ink mb-1">Client *</label>
              <select
                required
                value={form.clientId}
                onChange={e => set('clientId', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select client...</option>
                {clients.map(c => (
                  <option key={c._id} value={c._id}>{c.name} — {c.email}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-1">Amount (₹) *</label>
              <Input
                required
                type="number"
                min="1"
                step="1"
                placeholder="1500"
                value={form.amount}
                onChange={e => set('amount', e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-ink mb-1">Method</label>
                <select
                  value={form.method}
                  onChange={e => set('method', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {PAYMENT_METHODS.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={e => set('status', e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                >
                  {PAYMENT_STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-1">Transaction ID (optional)</label>
              <Input
                placeholder="UPI ref / card last 4"
                value={form.transactionId}
                onChange={e => set('transactionId', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-ink mb-1">Notes (optional)</label>
              <textarea
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                placeholder="Any notes about this payment..."
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none h-20"
              />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border flex justify-end gap-3 flex-shrink-0">
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancel</Button>
          <Button
            variant="primary"
            type="submit"
            form="record-payment-form"
            loading={saving}
            disabled={saving}
          >
            {saving ? 'Recording...' : 'Record Payment'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── Payments Page ────────────────────────────────────────────────────────────

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [paymentsRes, clientsRes] = await Promise.all([
        api.get('/payments'),
        api.get('/clients'),
      ]);
      if (paymentsRes.data.success) setPayments(paymentsRes.data.payments);
      if (clientsRes.data.success) setClients(clientsRes.data.data || clientsRes.data.clients || []);
    } catch (err) {
      console.error('Failed to fetch payments/clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSaved = (payment) => {
    setShowModal(false);
    setToast({ message: 'Payment recorded successfully!', type: 'success' });
    // Refresh data
    fetchData();
  };

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-ink">Payments & Invoices</h1>
            <p className="text-slate mt-1">Manage your billing, track payments, and send invoices.</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="primary" icon={Plus} onClick={() => setShowModal(true)}>Record Payment</Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate mb-1">Outstanding Balance</div>
            <div className="text-3xl font-bold text-ink flex items-center gap-2">
              ₹{payments.filter(p => p.status === 'pending').reduce((acc, p) => acc + p.amount, 0)}
              <ArrowUpRight className="w-5 h-5 text-error" />
            </div>
          </div>
          <div className="bg-bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate mb-1">Received (All Time)</div>
            <div className="text-3xl font-bold text-ink flex items-center gap-2">
              ₹{payments.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.amount, 0)}
              <ArrowUpRight className="w-5 h-5 text-success" />
            </div>
          </div>
          <div className="bg-bg-card border border-border rounded-xl p-6 shadow-sm">
            <div className="text-sm font-semibold text-slate mb-1">Total Unpaid Payments</div>
            <div className="text-3xl font-bold text-ink">{payments.filter(p => p.status === 'pending').length}</div>
          </div>
        </div>

        {/* List */}
        <div className="bg-bg-card border border-border rounded-xl shadow-sm overflow-hidden mt-8">
          <div className="p-4 border-b border-border flex justify-between items-center bg-bg-card-elevated">
            <h3 className="font-bold text-ink">Recent Payments</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" icon={Filter}>Filter</Button>
            </div>
          </div>

          {loading ? (
            <div className="p-12 flex justify-center"><Loader /></div>
          ) : payments.length === 0 ? (
            <div className="p-12 text-center text-slate flex flex-col items-center">
              <CreditCard className="w-10 h-10 mb-4 opacity-50" />
              No payments found. Record one to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-bg-main border-b border-border">
                    <th className="py-4 px-6 text-xs font-bold text-slate uppercase tracking-wider">Transaction ID</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate uppercase tracking-wider">Client</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate uppercase tracking-wider">Amount</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate uppercase tracking-wider">Status</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate uppercase tracking-wider">Method</th>
                    <th className="py-4 px-6 text-xs font-bold text-slate uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {payments.map(p => (
                    <tr key={p._id} className="hover:bg-bg-main transition-colors">
                      <td className="py-4 px-6 font-semibold text-ink text-sm">{p.transactionId || '—'}</td>
                      <td className="py-4 px-6">
                        <div className="font-bold text-ink">{p.clientId?.name || 'Unknown'}</div>
                      </td>
                      <td className="py-4 px-6 font-bold">₹{p.amount}</td>
                      <td className="py-4 px-6">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize
                          ${p.status === 'paid' ? 'bg-sage/20 text-sage' :
                            p.status === 'failed' ? 'bg-error/10 text-error' :
                            'bg-warning/20 text-warning'}`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-sm text-slate capitalize">{p.method}</td>
                      <td className="py-4 px-6 text-sm text-slate">
                        {new Date(p.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* Record Payment Modal */}
      {showModal && (
        <RecordPaymentModal
          clients={clients}
          onClose={() => setShowModal(false)}
          onSaved={handlePaymentSaved}
        />
      )}
    </>
  );
};

export default Payments;
