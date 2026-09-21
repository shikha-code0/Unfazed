import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import api from '../../api/axios';
import Loader from '../common/Loader';

const SlotPicker = ({ therapistSlug, selectedDate, selectedTime, onDateSelect, onTimeSelect, onError }) => {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getWeekDates = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(d.setDate(diff));
    
    return Array.from({ length: 5 }, (_, i) => { // Show Mon-Fri
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      return nextDay;
    });
  };

  const weekDates = getWeekDates(currentWeek);

  const prevWeek = () => {
    const d = new Date(currentWeek);
    d.setDate(d.getDate() - 7);
    setCurrentWeek(d);
  };

  const nextWeek = () => {
    const d = new Date(currentWeek);
    d.setDate(d.getDate() + 7);
    setCurrentWeek(d);
  };

  // Fetch slots for selected date
  useEffect(() => {
    if (!selectedDate) {
      setSlots([]);
      return;
    }

    const fetchSlots = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const dateStr = selectedDate.toISOString().split('T')[0];
        const response = await api.get(`/scheduling/public/${therapistSlug}/slots`, {
          params: { date: dateStr },
        });
        
        if (response.data.success) {
          setSlots(response.data.slots);
        }
      } catch (err) {
        const errorMsg = err.response?.data?.message || 'Failed to load available slots';
        setError(errorMsg);
        if (onError) onError(errorMsg);
        setSlots([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSlots();
  }, [selectedDate, therapistSlug]);

  const formatSlotTime = (slot) => {
    const date = new Date(slot.startTime);
    const hours = date.getHours();
    const mins = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const h = hours % 12 || 12;
    return `${h}:${String(mins).padStart(2, '0')} ${ampm}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="font-serif text-2xl font-bold text-ink">Choose a time</h2>
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate bg-bg-card-elevated px-3 py-1.5 rounded-full border border-border">
          <Globe className="w-3.5 h-3.5" />
          Times are shown in Asia/Kolkata
        </div>
      </div>

      <div className="bg-bg-card border border-border rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevWeek} className="p-2 hover:bg-bg-card-elevated rounded-full transition-colors text-slate">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-bold text-ink">
            {currentWeek.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <button onClick={nextWeek} className="p-2 hover:bg-bg-card-elevated rounded-full transition-colors text-slate">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {weekDates.map((date, idx) => {
            const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
            const isPast = date < new Date() && !isSelected;
            return (
              <button
                key={idx}
                onClick={() => {
                  onDateSelect(date);
                  onTimeSelect(null);
                }}
                disabled={isPast}
                className={`py-3 rounded-lg border text-center transition-all ${
                  isPast 
                    ? 'bg-bg-main/50 border-border/50 text-slate/50 cursor-not-allowed'
                    : isSelected
                    ? 'bg-primary text-white border-primary shadow-sm'
                    : 'bg-white border-border text-ink hover:border-primary/50'
                }`}
              >
                <div className="text-xs uppercase font-semibold mb-1 opacity-80">
                  {date.toLocaleDateString('en-US', { weekday: 'short' })}
                </div>
                <div className="text-xl font-bold">{date.getDate()}</div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedDate && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-sm font-bold text-ink mb-3">
            Available times for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </h3>
          
          {loading && (
            <div className="flex justify-center py-8">
              <Loader size="md" color="primary" />
            </div>
          )}
          
          {error && (
            <div className="bg-error-bg border border-error/20 rounded-lg p-4 text-error text-sm">
              {error}
            </div>
          )}
          
          {!loading && slots.length === 0 && !error && (
            <div className="bg-bg-card border border-border rounded-lg p-4 text-center text-slate text-sm">
              No available slots for this date.
            </div>
          )}
          
          {!loading && slots.length > 0 && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {slots.map((slot, idx) => {
                const timeStr = formatSlotTime(slot);
                const isSelected = selectedTime === slot.startTime;
                return (
                  <button
                    key={idx}
                    onClick={() => onTimeSelect(slot.startTime)}
                    className={`py-2 px-1 text-sm font-bold rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-md'
                        : 'bg-white border-border text-ink hover:border-primary/50 hover:shadow-sm'
                    }`}
                  >
                    {timeStr}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SlotPicker;
