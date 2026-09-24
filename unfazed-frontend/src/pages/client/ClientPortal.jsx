import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Calendar, CreditCard, FileText } from 'lucide-react';
import Button from '../../components/common/Button';

const ClientPortal = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-bg-main flex flex-col">
      {/* Top Navigation */}
      <header className="bg-bg-card border-b border-border py-4 px-6 sm:px-10 flex justify-between items-center sticky top-0 z-30">
        <div className="font-serif font-bold text-xl text-ink tracking-tight">Unfazed.</div>
        <div className="flex items-center gap-4">
          <span className="text-sm font-semibold text-slate hidden sm:block">Hello, {user?.name}</span>
          <Button variant="outline" size="sm" icon={LogOut} onClick={logout}>
            Log Out
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 sm:p-10 space-y-8">
        
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-ink mb-2">Your Patient Portal</h1>
          <p className="text-slate">Manage your care, appointments, and payments securely.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-bg-card border border-border p-6 rounded-2xl shadow-sm hover:border-primary/30 transition-colors cursor-pointer">
            <Calendar className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-bold text-ink mb-1">Appointments</h3>
            <p className="text-sm text-slate">View upcoming and past sessions.</p>
          </div>
          
          <div className="bg-bg-card border border-border p-6 rounded-2xl shadow-sm hover:border-primary/30 transition-colors cursor-pointer">
            <FileText className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-bold text-ink mb-1">Intake & Forms</h3>
            <p className="text-sm text-slate">Complete pending paperwork.</p>
          </div>

          <div className="bg-bg-card border border-border p-6 rounded-2xl shadow-sm hover:border-primary/30 transition-colors cursor-pointer">
            <CreditCard className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-bold text-ink mb-1">Billing & Packages</h3>
            <p className="text-sm text-slate">Check your balance and packages.</p>
          </div>

          <div className="bg-bg-card border border-border p-6 rounded-2xl shadow-sm hover:border-primary/30 transition-colors cursor-pointer">
            <User className="w-8 h-8 text-primary mb-4" />
            <h3 className="font-bold text-ink mb-1">My Profile</h3>
            <p className="text-sm text-slate">Update personal information.</p>
          </div>
        </div>

        {/* Dashboard Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <div className="lg:col-span-2 bg-bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-bg-card-elevated">
              <h3 className="font-bold text-ink">Upcoming Session</h3>
            </div>
            <div className="p-12 text-center flex flex-col items-center justify-center text-slate">
              <Calendar className="w-12 h-12 mb-4 opacity-30" />
              <p>You have no upcoming sessions.</p>
              <Button variant="primary" className="mt-4">Request Appointment</Button>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-ink mb-4">Care Status</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate">Intake Form</span>
                    <span className="text-success font-semibold">Complete</span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-slate">Consent Agreement</span>
                    <span className="text-warning font-semibold">Pending</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-bg-card border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-ink mb-4">Package Balance</h3>
              <div className="text-3xl font-bold text-ink mb-1">0</div>
              <p className="text-sm text-slate">Sessions remaining</p>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default ClientPortal;
