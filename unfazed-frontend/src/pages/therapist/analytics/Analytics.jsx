import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, Calendar, DollarSign, Download } from 'lucide-react';
import Sidebar from '../../../components/common/Sidebar';
import Topbar from '../../../components/common/Topbar';
import api from '../../../api/axios';
import Loader from '../../../components/common/Loader';
import Button from '../../../components/common/Button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Jan', revenue: 4000 },
  { name: 'Feb', revenue: 3000 },
  { name: 'Mar', revenue: 2000 },
  { name: 'Apr', revenue: 2780 },
  { name: 'May', revenue: 1890 },
  { name: 'Jun', revenue: 2390 },
  { name: 'Jul', revenue: 3490 },
];

const Analytics = () => {
  const [metrics, setMetrics] = useState({
    activeClients: 0,
    sessionsThisMonth: 0,
    revenueThisMonth: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/analytics');
      if (res.data.success) {
        setMetrics(res.data.metrics);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, icon: Icon, trend, prefix = '' }) => (
    <div className="bg-bg-card border border-border rounded-xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-slate font-medium">{title}</h3>
        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="flex items-end gap-3">
        <div className="text-3xl font-bold text-ink font-serif">
          {prefix}{value}
        </div>
        {trend && (
          <div className="flex items-center gap-1 text-sm text-sage font-medium mb-1">
            <TrendingUp className="w-4 h-4" />
            <span>{trend}</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      <div className="max-w-7xl mx-auto w-full">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-ink font-serif mb-2">Analytics</h1>
              <p className="text-slate">Track your practice performance and growth.</p>
            </div>
            <Button variant="outline" icon={Download}>
              Export Report
            </Button>
          </div>

          {loading ? (
            <div className="flex justify-center py-20"><Loader /></div>
          ) : (
            <>
              {/* Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <MetricCard 
                  title="Active Clients" 
                  value={metrics.activeClients} 
                  icon={Users} 
                  trend="+12%" 
                />
                <MetricCard 
                  title="Sessions This Month" 
                  value={metrics.sessionsThisMonth} 
                  icon={Calendar} 
                  trend="+5%" 
                />
                <MetricCard 
                  title="Monthly Revenue" 
                  value={(metrics.revenueThisMonth / 100).toLocaleString(undefined, { minimumFractionDigits: 2 })} 
                  icon={DollarSign} 
                  trend="+18%"
                  prefix="₹" 
                />
              </div>

              {/* Chart Section */}
              <div className="bg-bg-card border border-border rounded-xl p-6 shadow-sm">
                <h3 className="font-bold text-ink text-lg mb-6">Revenue Overview (Mock Data)</h3>
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                      <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dx={-10} />
                      <Tooltip 
                        cursor={{fill: '#F1F5F9'}} 
                        contentStyle={{borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} 
                      />
                      <Bar dataKey="revenue" fill="#7C536F" radius={[4, 4, 0, 0]} barSize={40} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </>
          )}

      </div>
    </>
  );
};

export default Analytics;
