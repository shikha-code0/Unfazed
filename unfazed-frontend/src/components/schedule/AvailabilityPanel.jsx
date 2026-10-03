import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar as CalendarIcon, Save, Plus, Trash2, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Toast from '../common/Toast';
import api from '../../api/axios';

const DAYS = [
  { id: 0, label: 'Sun' },
  { id: 1, label: 'Mon' },
  { id: 2, label: 'Tue' },
  { id: 3, label: 'Wed' },
  { id: 4, label: 'Thu' },
  { id: 5, label: 'Fri' },
  { id: 6, label: 'Sat' },
];

const AvailabilityPanel = ({ isOpen, onClose }) => {
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Working hours state
  const [workingDays, setWorkingDays] = useState([1, 2, 3, 4, 5]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('17:00');
  const [slotDuration, setSlotDuration] = useState(50);
  const [bufferMinutes, setBufferMinutes] = useState(10);
  const [timezone, setTimezone] = useState('Asia/Kolkata');

  // Blocked dates state
  const [blockedDates, setBlockedDates] = useState([]); // array of YYYY-MM-DD strings
  const [newBlockedDate, setNewBlockedDate] = useState('');

  // Time off state — stored as date overrides where enabled=false for a time range
  const [timeOff, setTimeOff] = useState([]); // [{date, startTime, endTime, reason}]
  const [newTimeOff, setNewTimeOff] = useState({ date: '', startTime: '', endTime: '', reason: '' });
  const [addingTimeOff, setAddingTimeOff] = useState(false);

  // Fetch existing availability when panel opens
  useEffect(() => {
    if (isOpen) {
      fetchAvailability();
    }
  }, [isOpen]);

  const fetchAvailability = async () => {
    setLoading(true);
    try {
      const res = await api.get('/availability/me');
      if (res.data.success && res.data.availability) {
        const avail = res.data.availability;

        // Extract working days
        const days = [];
        if (Array.isArray(avail.weeklySchedule)) {
          avail.weeklySchedule.forEach(d => {
            if (d.enabled) days.push(d.dayOfWeek);
          });
        }
        setWorkingDays(days.length > 0 ? days : [1, 2, 3, 4, 5]);

        // Extract start/end time from first enabled day
        const firstEnabled = avail.weeklySchedule?.find(d => d.enabled);
        if (firstEnabled?.periods?.length > 0) {
          setStartTime(firstEnabled.periods[0].startTime || '09:00');
          setEndTime(firstEnabled.periods[firstEnabled.periods.length - 1].endTime || '17:00');
        }

        setSlotDuration(avail.slotDuration || 50);
        setBufferMinutes(avail.bufferMinutes ?? 10);
        setTimezone(avail.timezone || 'Asia/Kolkata');
        setBlockedDates(avail.blockedDates || []);

        // Parse date overrides for time-off display
        const offs = [];
        if (avail.dateOverrides) {
          const entries = avail.dateOverrides instanceof Map
            ? Array.from(avail.dateOverrides.entries())
            : Object.entries(avail.dateOverrides);
          entries.forEach(([date, override]) => {
            if (!override.enabled && override.reason) {
              offs.push({
                date,
                startTime: override.periods?.[0]?.startTime || '',
                endTime: override.periods?.[0]?.endTime || '',
                reason: override.reason || '',
              });
            }
          });
        }
        setTimeOff(offs);
      }
    } catch (err) {
      console.error('Failed to fetch availability:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleDay = (dayId) => {
    setWorkingDays(prev =>
      prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId].sort()
    );
  };

  const addBlockedDate = () => {
    if (!newBlockedDate) return;
    if (blockedDates.includes(newBlockedDate)) {
      setToastMessage('This date is already blocked.');
      setToastType('error');
      return;
    }
    setBlockedDates(prev => [...prev, newBlockedDate].sort());
    setNewBlockedDate('');
  };

  const removeBlockedDate = (date) => {
    setBlockedDates(prev => prev.filter(d => d !== date));
  };

  const addTimeOff = () => {
    if (!newTimeOff.date) {
      setToastMessage('Please select a date for time off.');
      setToastType('error');
      return;
    }
    setTimeOff(prev => [...prev, { ...newTimeOff }]);
    setNewTimeOff({ date: '', startTime: '', endTime: '', reason: '' });
    setAddingTimeOff(false);
  };

  const removeTimeOff = (idx) => {
    setTimeOff(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Build weekly schedule
      const weeklySchedule = DAYS.map(({ id }) => ({
        dayOfWeek: id,
        enabled: workingDays.includes(id),
        periods: workingDays.includes(id) ? [{ startTime, endTime }] : [],
      }));

      // Build date overrides from time-off entries
      const dateOverrides = {};
      timeOff.forEach(t => {
        dateOverrides[t.date] = {
          enabled: false,
          reason: t.reason || 'Time Off',
          periods: t.startTime && t.endTime ? [{ startTime: t.startTime, endTime: t.endTime }] : [],
        };
      });

      const payload = {
        timezone,
        weeklySchedule,
        slotDuration,
        bufferMinutes,
        blockedDates,
        dateOverrides,
      };

      const res = await api.put('/availability/me', payload);
      if (res.data.success) {
        setToastMessage('Availability saved successfully!');
        setToastType('success');
        setTimeout(() => {
          setToastMessage('');
          onClose();
        }, 1500);
      } else {
        setToastMessage(res.data.message || 'Failed to save availability.');
        setToastType('error');
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to save availability.';
      setToastMessage(msg);
      setToastType('error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {toastMessage && (
        <Toast message={toastMessage} type={toastType} onClose={() => setToastMessage('')} />
      )}

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full md:w-[420px] bg-bg-card-elevated border-l border-border shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-border bg-bg-main flex-shrink-0">
          <h2 className="font-serif text-xl font-bold text-ink flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Availability Settings
          </h2>
          <button onClick={onClose} className="p-2 text-slate hover:bg-bg-card rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-7">
          {loading ? (
            <div className="flex justify-center py-12 text-slate text-sm">Loading availability...</div>
          ) : (
            <>
              {/* Working Days */}
              <section>
                <label className="block text-sm font-bold text-ink mb-3">Working Days</label>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map(day => {
                    const isActive = workingDays.includes(day.id);
                    return (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => toggleDay(day.id)}
                        className={`w-11 h-11 rounded-full text-xs font-bold transition-all ${
                          isActive
                            ? 'bg-primary text-white shadow-sm'
                            : 'bg-bg-card border border-border text-slate hover:border-primary/50'
                        }`}
                      >
                        {day.label}
                      </button>
                    );
                  })}
                </div>
              </section>

              {/* Time Range */}
              <section>
                <label className="block text-sm font-bold text-ink mb-3">Working Hours</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate mb-1">Start Time</label>
                    <Input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate mb-1">End Time</label>
                    <Input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                  </div>
                </div>
              </section>

              {/* Session Settings */}
              <section>
                <label className="block text-sm font-bold text-ink mb-3">Session Settings</label>
                <div className="space-y-4 bg-bg-card border border-border p-4 rounded-xl">
                  <div>
                    <label className="block text-xs font-semibold text-slate mb-2">Slot Duration (mins)</label>
                    <div className="flex gap-2 flex-wrap">
                      {[30, 45, 50, 60, 90].map(dur => (
                        <button
                          key={dur}
                          type="button"
                          onClick={() => setSlotDuration(dur)}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                            slotDuration === dur
                              ? 'bg-primary text-white'
                              : 'bg-white border border-border text-slate hover:border-primary/50'
                          }`}
                        >
                          {dur}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate mb-2">Buffer Time (mins)</label>
                    <div className="flex gap-2 flex-wrap">
                      {[0, 10, 15, 20].map(buf => (
                        <button
                          key={buf}
                          type="button"
                          onClick={() => setBufferMinutes(buf)}
                          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                            bufferMinutes === buf
                              ? 'bg-sage text-white'
                              : 'bg-white border border-border text-slate hover:border-sage/50'
                          }`}
                        >
                          {buf}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Blocked Dates */}
              <section>
                <label className="block text-sm font-bold text-ink mb-3">
                  Blocked Dates
                  <span className="ml-2 text-xs font-normal text-slate">(no slots on these days)</span>
                </label>
                <div className="flex gap-2 mb-3">
                  <Input
                    type="date"
                    value={newBlockedDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => setNewBlockedDate(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline" size="sm" icon={Plus} onClick={addBlockedDate}>
                    Block
                  </Button>
                </div>
                {blockedDates.length === 0 ? (
                  <p className="text-xs text-slate">No blocked dates.</p>
                ) : (
                  <div className="space-y-2">
                    {blockedDates.map(date => (
                      <div key={date} className="flex items-center justify-between bg-bg-card border border-border rounded-lg px-3 py-2">
                        <span className="text-sm font-medium text-ink">{date}</span>
                        <button
                          type="button"
                          onClick={() => removeBlockedDate(date)}
                          className="p-1 text-error hover:bg-error-bg rounded transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>

              {/* Time Off */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-bold text-ink">
                    Time Off
                    <span className="ml-2 text-xs font-normal text-slate">(partial-day blocks)</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setAddingTimeOff(!addingTimeOff)}
                    className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add
                  </button>
                </div>

                {addingTimeOff && (
                  <div className="bg-bg-card border border-border rounded-xl p-4 mb-3 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-slate mb-1">Date</label>
                        <Input
                          type="date"
                          value={newTimeOff.date}
                          min={new Date().toISOString().split('T')[0]}
                          onChange={e => setNewTimeOff(p => ({ ...p, date: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate mb-1">Start (optional)</label>
                        <Input
                          type="time"
                          value={newTimeOff.startTime}
                          onChange={e => setNewTimeOff(p => ({ ...p, startTime: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate mb-1">End (optional)</label>
                        <Input
                          type="time"
                          value={newTimeOff.endTime}
                          onChange={e => setNewTimeOff(p => ({ ...p, endTime: e.target.value }))}
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-xs font-semibold text-slate mb-1">Reason</label>
                        <Input
                          placeholder="Personal Leave, Holiday..."
                          value={newTimeOff.reason}
                          onChange={e => setNewTimeOff(p => ({ ...p, reason: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => setAddingTimeOff(false)}>Cancel</Button>
                      <Button variant="primary" size="sm" onClick={addTimeOff}>Add Time Off</Button>
                    </div>
                  </div>
                )}

                {timeOff.length === 0 ? (
                  <p className="text-xs text-slate">No time off configured.</p>
                ) : (
                  <div className="space-y-2">
                    {timeOff.map((t, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-warning-bg border border-warning/20 rounded-lg px-3 py-2 gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-ink">{t.date}</p>
                          <p className="text-xs text-slate truncate">
                            {t.startTime && t.endTime ? `${t.startTime} – ${t.endTime}` : 'All day'}{t.reason ? ` · ${t.reason}` : ''}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeTimeOff(idx)}
                          className="p-1 text-error hover:bg-error-bg rounded transition-colors flex-shrink-0"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-border bg-bg-main flex-shrink-0">
          <Button variant="primary" className="w-full justify-center" onClick={handleSave} icon={Save} loading={saving} disabled={saving || loading}>
            {saving ? 'Saving...' : 'Save Availability'}
          </Button>
        </div>
      </div>
    </>
  );
};

export default AvailabilityPanel;
