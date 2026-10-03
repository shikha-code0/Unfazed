import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Plus, Settings, X } from 'lucide-react';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import WeeklyCalendar from '../../components/schedule/WeeklyCalendar';
import SessionModal from '../../components/schedule/SessionModal';
import AvailabilityPanel from '../../components/schedule/AvailabilityPanel';
import Toast from '../../components/common/Toast';
import api from '../../api/axios';

// ─── Add Appointment Modal ───────────────────────────────────────────────────

const SERVICE_TYPES = ['Individual Therapy', 'Couples Therapy', 'Initial Consultation'];
const SESSION_MODES = ['Online', 'In-person'];

const AddAppointmentModal = ({ onClose, onSaved }) => {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    serviceType: 'Individual Therapy',
    sessionMode: 'Online',
    date: '',        // YYYY-MM-DD
    startTime: '',   // HH:mm
    duration: 50,    // minutes
    notes: '',
    timezone: 'Asia/Kolkata',
  });

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate
    if (!form.clientName.trim() || !form.clientEmail.trim()) {
      setError('Client name and email are required.');
      return;
    }
    if (!form.date || !form.startTime) {
      setError('Date and start time are required.');
      return;
    }

    // Build ISO datetime strings deterministically
    const startISO = `${form.date}T${form.startTime}:00`;
    const startDate = new Date(startISO);
    if (isNaN(startDate.getTime())) {
      setError('Invalid date or time. Please check your input.');
      return;
    }
    const endDate = new Date(startDate.getTime() + Number(form.duration) * 60 * 1000);
    const endISO = endDate.toISOString();

    setSaving(true);
    try {
      const payload = {
        clientName: form.clientName.trim(),
        clientEmail: form.clientEmail.trim().toLowerCase(),
        clientPhone: form.clientPhone.trim(),
        serviceType: form.serviceType,
        sessionMode: form.sessionMode,
        startTime: startDate.toISOString(),
        endTime: endISO,
        timezone: form.timezone,
        notes: form.notes.trim(),
      };

      const res = await api.post('/scheduling/me', payload);
      if (res.data.success) {
        onSaved(res.data.session);
      } else {
        setError(res.data.message || 'Failed to create appointment.');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create appointment.';
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
      <div className="bg-bg-card-elevated rounded-2xl border border-border shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <h2 className="font-serif text-xl font-bold text-ink">Add Appointment</h2>
          <button onClick={onClose} className="p-1.5 text-slate hover:text-ink hover:bg-bg-main rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="overflow-y-auto flex-1 p-6">
          {error && (
            <div className="mb-4 bg-error-bg border border-error/20 rounded-lg p-3 text-error text-sm">
              {error}
            </div>
          )}

          <form id="add-appt-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Client info */}
            <div>
              <p className="text-xs font-bold text-ink uppercase tracking-wide mb-3">Client Information</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1">Full Name *</label>
                  <Input
                    required
                    placeholder="Jane Doe"
                    value={form.clientName}
                    onChange={e => set('clientName', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1">Email *</label>
                  <Input
                    required
                    type="email"
                    placeholder="jane@example.com"
                    value={form.clientEmail}
                    onChange={e => set('clientEmail', e.target.value)}
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-semibold text-ink mb-1">Phone</label>
                <Input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={form.clientPhone}
                  onChange={e => set('clientPhone', e.target.value)}
                />
              </div>
            </div>

            <hr className="border-border" />

            {/* Session details */}
            <div>
              <p className="text-xs font-bold text-ink uppercase tracking-wide mb-3">Session Details</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1">Service Type *</label>
                  <select
                    required
                    value={form.serviceType}
                    onChange={e => set('serviceType', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {SERVICE_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1">Mode</label>
                  <select
                    value={form.sessionMode}
                    onChange={e => set('sessionMode', e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {SESSION_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            </div>

            <hr className="border-border" />

            {/* Date & time */}
            <div>
              <p className="text-xs font-bold text-ink uppercase tracking-wide mb-3">Date & Time</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1">Date *</label>
                  <Input
                    required
                    type="date"
                    value={form.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => set('date', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1">Start Time *</label>
                  <Input
                    required
                    type="time"
                    value={form.startTime}
                    onChange={e => set('startTime', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-ink mb-1">Duration (min)</label>
                  <select
                    value={form.duration}
                    onChange={e => set('duration', Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl border border-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    {[30, 45, 50, 60, 90].map(d => <option key={d} value={d}>{d} min</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-semibold text-ink mb-1">Notes (optional)</label>
              <textarea
                value={form.notes}
                onChange={e => set('notes', e.target.value)}
                placeholder="Any relevant notes..."
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
            form="add-appt-form"
            loading={saving}
            disabled={saving}
          >
            {saving ? 'Creating...' : 'Create Appointment'}
          </Button>
        </div>
      </div>
    </div>
  );
};

// ─── Schedule Page ────────────────────────────────────────────────────────────

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState(null);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);
  const [isAddingAppointment, setIsAddingAppointment] = useState(false);
  const [calendarRefreshKey, setCalendarRefreshKey] = useState(0);
  const [toast, setToast] = useState(null);

  const prevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  const nextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  const today = () => setCurrentDate(new Date());

  const handleAppointmentSaved = useCallback((session) => {
    setIsAddingAppointment(false);
    setToast({ message: 'Appointment created successfully!', type: 'success' });
    // Navigate calendar to the session date
    if (session?.startTime) {
      setCurrentDate(new Date(session.startTime));
    }
    // Refresh calendar
    setCalendarRefreshKey(k => k + 1);
  }, []);

  return (
    <>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <main className="relative max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-ink">Calendar</h1>
            <p className="text-slate mt-1">Manage your availability and upcoming sessions.</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="outline" size="sm" onClick={() => setIsAvailabilityOpen(true)} icon={Settings}>
              Availability
            </Button>
            <Button variant="primary" size="sm" icon={Plus} onClick={() => setIsAddingAppointment(true)}>
              Add appointment
            </Button>
          </div>
        </div>

        {/* Calendar Controls */}
        <div className="flex items-center justify-between bg-bg-card-elevated p-3 rounded-xl border border-border">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={today}>Today</Button>
            <div className="flex items-center ml-2 border border-border rounded-lg bg-white overflow-hidden">
              <button onClick={prevWeek} className="p-1.5 hover:bg-bg-main text-slate transition-colors border-r border-border">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextWeek} className="p-1.5 hover:bg-bg-main text-slate transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
            <span className="ml-3 text-sm font-bold text-ink">
              {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </span>
          </div>
        </div>

        {/* Weekly Calendar Grid */}
        <WeeklyCalendar
          key={calendarRefreshKey}
          currentDate={currentDate}
          onSessionClick={setSelectedSession}
        />

      </main>

      {/* Add Appointment Modal */}
      {isAddingAppointment && (
        <AddAppointmentModal
          onClose={() => setIsAddingAppointment(false)}
          onSaved={handleAppointmentSaved}
        />
      )}

      {/* Session Detail Modal */}
      {selectedSession && (
        <SessionModal
          session={selectedSession}
          onClose={() => setSelectedSession(null)}
        />
      )}

      {/* Availability Panel */}
      <AvailabilityPanel
        isOpen={isAvailabilityOpen}
        onClose={() => setIsAvailabilityOpen(false)}
      />
    </>
  );
};

export default Schedule;
