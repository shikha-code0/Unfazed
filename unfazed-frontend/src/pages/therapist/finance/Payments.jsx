import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, CreditCard, Download, ArrowUpRight } from 'lucide-react';
import Button from '../../../components/common/Button';
import api from '../../../api/axios';
import Loader from '../../../components/common/Loader';

const Payments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get('/payments');
      if (res.data.success) {
        setPayments(res.data.payments);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h1 className="text-3xl font-serif font-bold text-ink">Payments & Invoices</h1>
                <p className="text-slate mt-1">Manage your billing, track payments, and send invoices.</p>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="primary" icon={Plus}>Record Payment</Button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="text-sm font-semibold text-slate mb-1">Outstanding Balance</div>
                <div className="text-3xl font-bold text-ink flex items-center gap-2">
                  ₹{payments.filter(p => p.status === 'pending').reduce((acc, p) => acc + p.amount, 0)} <ArrowUpRight className="w-5 h-5 text-error" />
                </div>
              </div>
              <div className="bg-bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="text-sm font-semibold text-slate mb-1">Received This Month</div>
                <div className="text-3xl font-bold text-ink flex items-center gap-2">
                  ₹{payments.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.amount, 0)} <ArrowUpRight className="w-5 h-5 text-success" />
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
                  No payments found. Create one to get started.
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
                          <td className="py-4 px-6 font-bold">
                            ₹{p.amount}
                          </td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize
                              ${p.status === 'paid' ? 'bg-sage/20 text-sage' : 
                                p.status === 'failed' ? 'bg-error/10 text-error' :
                                'bg-warning/20 text-warning-dark'}`}
                            >
                              {p.status}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-sm text-slate capitalize">
                            {p.method}
                          </td>
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
    </>
  );
};

export default Payments;
