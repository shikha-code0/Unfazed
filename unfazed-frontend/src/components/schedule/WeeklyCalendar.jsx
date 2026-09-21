import React, { useState, useEffect } from 'react';
import AppointmentCard from './AppointmentCard';
import { useSchedule } from '../../context/ScheduleContext';
import api from '../../api/axios';
import Loader from '../common/Loader';

const WeeklyCalendar = ({ currentDate, onSessionClick }) => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = Array.from({ length: 13 }, (_, i) => i + 8); // 8 AM to 8 PM
  
  // Fetch sessions for the week
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Calculate week start and end dates
        const d = new Date(currentDate);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(d.setDate(diff));
        
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        
        const startDate = monday.toISOString().split('T')[0];
        const endDate = sunday.toISOString().split('T')[0];
        
        // Fetch sessions
        const response = await api.get('/scheduling/me', {
          params: {
            startDate,
            endDate,
          },
        });
        
        if (response.data.success) {
          setSessions(response.data.sessions);
        }
      } catch (err) {
        console.error('Failed to fetch sessions:', err);
        setError('Failed to load schedule');
        setSessions([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchSessions();
  }, [currentDate]);
  
  // Calculate the dates for the current week based on currentDate
  const getWeekDates = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    const monday = new Date(d.setDate(diff));
    
    return Array.from({ length: 7 }, (_, i) => {
      const nextDay = new Date(monday);
      nextDay.setDate(monday.getDate() + i);
      return nextDay;
    });
  };

  const weekDates = getWeekDates(currentDate);

  const formatHour = (hour) => {
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const h = hour % 12 || 12;
    return `${h}:00 ${ampm}`;
  };

  const getSessionsForDay = (date) => {
    return sessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      return sessionDate.getDate() === date.getDate() &&
             sessionDate.getMonth() === date.getMonth() &&
             sessionDate.getFullYear() === date.getFullYear();
    });
  };

  if (error) {
    return (
      <div className="bg-bg-card rounded-card border border-border shadow-sm p-8 text-center">
        <p className="text-error">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-bg-card rounded-card border border-border shadow-sm flex flex-col h-[700px] overflow-hidden">
      {/* Header Row */}
      <div className="flex border-b border-border bg-bg-card-elevated">
        <div className="w-16 flex-shrink-0 border-r border-border"></div>
        {weekDates.map((date, idx) => (
          <div key={idx} className="flex-1 text-center py-3 border-r border-border last:border-r-0">
            <div className="text-xs font-semibold text-slate uppercase tracking-wider">{days[idx]}</div>
            <div className={`text-lg font-bold mt-1 ${date.toDateString() === new Date().toDateString() ? 'text-primary bg-primary/10 w-8 h-8 rounded-full flex items-center justify-center mx-auto' : 'text-ink'}`}>
              {date.getDate()}
            </div>
          </div>
        ))}
      </div>

      {/* Grid Body */}
      <div className="flex-1 overflow-y-auto relative">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-bg-main/50">
            <Loader size="lg" color="primary" />
          </div>
        ) : (
          <div className="flex h-[1200px]"> {/* Fixed height to show all hours */}
            {/* Time Column */}
            <div className="w-16 flex-shrink-0 border-r border-border bg-bg-card">
              {hours.map((hour, idx) => (
                <div key={idx} className="h-[92.3px] text-right pr-2 -mt-2.5"> {/* 1200px / 13 hours approx 92.3 */}
                  <span className="text-[10px] font-medium text-slate">{formatHour(hour)}</span>
                </div>
              ))}
            </div>

            {/* Days Columns */}
            {weekDates.map((date, idx) => (
              <div key={idx} className="flex-1 relative border-r border-border last:border-r-0 border-dashed border-border/50">
                {/* Horizontal grid lines */}
                {hours.map((_, hIdx) => (
                  <div key={hIdx} className="absolute w-full border-t border-border/50 h-[92.3px]" style={{ top: `${(hIdx / 12) * 100}%` }}></div>
                ))}
                
                {/* Sessions */}
                {getSessionsForDay(date).map((session) => (
                  <AppointmentCard 
                    key={session._id} 
                    appointment={{
                      id: session._id,
                      clientName: session.clientName,
                      service: session.serviceType,
                      date: new Date(session.startTime),
                      endDate: new Date(session.endTime),
                      duration: 50,
                      status: session.status,
                      mode: session.sessionMode === 'Online' ? 'online' : 'in-person',
                      paymentStatus: session.paymentStatus,
                    }}
                    onClick={onSessionClick}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyCalendar;
