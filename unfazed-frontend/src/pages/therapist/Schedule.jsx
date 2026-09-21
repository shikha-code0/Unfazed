import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Settings } from 'lucide-react';
import Sidebar from '../../components/common/Sidebar';
import Topbar from '../../components/common/Topbar';
import Button from '../../components/common/Button';
import WeeklyCalendar from '../../components/schedule/WeeklyCalendar';
import SessionModal from '../../components/schedule/SessionModal';
import AvailabilityPanel from '../../components/schedule/AvailabilityPanel';

const Schedule = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [selectedSession, setSelectedSession] = useState(null);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(false);

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

  const today = () => {
    setCurrentDate(new Date());
  };

  return (
    <>
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
                <Button variant="primary" size="sm" icon={Plus}>
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
              <div>
                <select className="bg-white border border-border text-sm font-bold text-ink rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary/20">
                  <option>Week</option>
                  <option>Day</option>
                  <option>Month</option>
                </select>
              </div>
            </div>

            {/* Weekly Calendar Grid */}
            <WeeklyCalendar currentDate={currentDate} onSessionClick={setSelectedSession} />

      </main>

      {/* Modals and Panels */}
      {selectedSession && (
        <SessionModal 
          session={selectedSession} 
          onClose={() => setSelectedSession(null)} 
        />
      )}
      
      <AvailabilityPanel 
        isOpen={isAvailabilityOpen} 
        onClose={() => setIsAvailabilityOpen(false)} 
      />
    </>
  );
};

export default Schedule;
