import React, { useState } from 'react';
import { X, Clock, Calendar as CalendarIcon, Save } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import { useSchedule } from '../../context/ScheduleContext';
import Toast from '../common/Toast';

const AvailabilityPanel = ({ isOpen, onClose }) => {
  const { availability, updateAvailability } = useSchedule();
  const [toastMessage, setToastMessage] = useState('');
  
  const [formData, setFormData] = useState({
    ...availability
  });

  const handleSave = () => {
    updateAvailability(formData);
    setToastMessage('Availability updated successfully');
    setTimeout(() => {
      setToastMessage('');
      onClose();
    }, 2000);
  };

  const daysOfWeek = [
    { id: 1, label: 'Mon' },
    { id: 2, label: 'Tue' },
    { id: 3, label: 'Wed' },
    { id: 4, label: 'Thu' },
    { id: 5, label: 'Fri' },
    { id: 6, label: 'Sat' },
    { id: 0, label: 'Sun' },
  ];

  const toggleDay = (dayId) => {
    setFormData(prev => ({
      ...prev,
      workingDays: prev.workingDays.includes(dayId)
        ? prev.workingDays.filter(d => d !== dayId)
        : [...prev.workingDays, dayId].sort()
    }));
  };

  return (
    <>
      {toastMessage && <Toast message={toastMessage} type="success" onClose={() => setToastMessage('')} />}
      
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-ink/20 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div 
        className={`fixed inset-y-0 right-0 z-50 w-full md:w-96 bg-bg-card-elevated border-l border-border shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex justify-between items-center p-6 border-b border-border bg-bg-main">
          <h2 className="font-serif text-xl font-bold text-ink flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            Availability
          </h2>
          <button onClick={onClose} className="p-2 text-slate hover:bg-bg-card rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Working Days */}
          <div>
            <label className="block text-sm font-bold text-ink mb-3">Working Days</label>
            <div className="flex flex-wrap gap-2">
              {daysOfWeek.map(day => {
                const isActive = formData.workingDays.includes(day.id);
                return (
                  <button
                    key={day.id}
                    onClick={() => toggleDay(day.id)}
                    className={`w-10 h-10 rounded-full text-xs font-bold transition-all ${
                      isActive 
                        ? 'bg-primary text-white shadow-md' 
                        : 'bg-bg-card border border-border text-slate hover:border-primary/50'
                    }`}
                  >
                    {day.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Start Time</label>
              <Input 
                type="time" 
                value={formData.startTime}
                onChange={(e) => setFormData({...formData, startTime: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-ink mb-1">End Time</label>
              <Input 
                type="time" 
                value={formData.endTime}
                onChange={(e) => setFormData({...formData, endTime: e.target.value})}
              />
            </div>
          </div>

          {/* Session Settings */}
          <div>
            <label className="block text-sm font-bold text-ink mb-3">Session Details</label>
            <div className="space-y-4 bg-bg-card border border-border p-4 rounded-xl">
              <div>
                <label className="block text-xs font-semibold text-slate mb-2">Duration (mins)</label>
                <div className="flex gap-2">
                  {[30, 45, 50, 60, 90].map(dur => (
                    <button
                      key={dur}
                      onClick={() => setFormData({...formData, sessionDuration: dur})}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                        formData.sessionDuration === dur 
                          ? 'bg-sage text-white' 
                          : 'bg-white border border-border text-slate hover:border-sage'
                      }`}
                    >
                      {dur}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-semibold text-slate mb-2">Buffer Time (mins)</label>
                <div className="flex gap-2">
                  {[0, 10, 15, 20].map(buf => (
                    <button
                      key={buf}
                      onClick={() => setFormData({...formData, bufferTime: buf})}
                      className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
                        formData.bufferTime === buf 
                          ? 'bg-primary text-white' 
                          : 'bg-white border border-border text-slate hover:border-primary'
                      }`}
                    >
                      {buf}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          {/* Blocked Dates */}
          <div>
             <label className="block text-sm font-bold text-ink mb-3">Time Off & Blocked Dates</label>
             <Button variant="outline" size="sm" className="w-full justify-center border-dashed" icon={CalendarIcon}>
               Add blockout period
             </Button>
          </div>
        </div>

        <div className="p-6 border-t border-border bg-bg-main">
          <Button variant="primary" className="w-full justify-center" onClick={handleSave} icon={Save}>
            Save Availability
          </Button>
        </div>
      </div>
    </>
  );
};

export default AvailabilityPanel;
