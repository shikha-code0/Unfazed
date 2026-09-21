import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const ScheduleContext = createContext();

export const useSchedule = () => useContext(ScheduleContext);

export const ScheduleProvider = ({ children }) => {
  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState({
    workingDays: [1, 2, 3, 4, 5], // Mon-Fri
    startTime: '09:00',
    endTime: '18:00',
    sessionDuration: 50,
    bufferTime: 10,
    blockedDates: []
  });
  const [loading, setLoading] = useState(true);

  // Fetch availability on mount
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const res = await api.get('/availability/me');
        if (res.data.success && res.data.availability) {
          const fetchedAvail = res.data.availability;
          
          // Map backend array to frontend workingDays array
          let workingDays = [];
          if (Array.isArray(fetchedAvail.weeklySchedule)) {
            fetchedAvail.weeklySchedule.forEach(day => {
              if (day.enabled) {
                workingDays.push(day.dayOfWeek);
              }
            });
          }
          if (workingDays.length === 0) workingDays = [1, 2, 3, 4, 5];

          // We extract the first slot's start/end time as a basic representation
          // Assuming all enabled days have similar start/end for simplicity in the UI
          let startTime = '09:00';
          let endTime = '18:00';
          
          const firstEnabledDay = Array.isArray(fetchedAvail.weeklySchedule) 
            ? fetchedAvail.weeklySchedule.find(d => d.enabled)
            : null;

          if (firstEnabledDay && firstEnabledDay.periods && firstEnabledDay.periods.length > 0) {
            const periods = firstEnabledDay.periods;
            startTime = periods[0].startTime || '09:00';
            endTime = periods[periods.length - 1].endTime || '18:00';
          }

          setAvailability({
            workingDays,
            startTime,
            endTime,
            sessionDuration: fetchedAvail.slotDuration || 50,
            bufferTime: fetchedAvail.bufferMinutes || 10,
            blockedDates: fetchedAvail.blockedDates || []
          });
        }
      } catch (err) {
        console.error('Failed to fetch availability', err);
      } finally {
        setLoading(false);
      }
    };
    // Only run if token exists. Wait, we can just run it, api will handle 401.
    if (localStorage.getItem('unfazed_token')) {
      fetchAvailability();
    } else {
      setLoading(false);
    }
  }, []);

  const addAppointment = (appointment) => {
    // In a real app this might be a POST to /scheduling/book if not done elsewhere
    // but typically we refetch.
    setAppointments((prev) => [...prev, { ...appointment, id: `appt-${Date.now()}` }]);
  };

  const updateAvailability = async (newSettings) => {
    try {
      const merged = { ...availability, ...newSettings };
      setAvailability(merged);

      // Convert frontend representation back to backend array format
      const weeklySchedule = [];
      for (let i = 0; i < 7; i++) {
        const isWorking = merged.workingDays.includes(i);
        weeklySchedule.push({
          dayOfWeek: i,
          enabled: isWorking,
          periods: isWorking ? [{ startTime: merged.startTime, endTime: merged.endTime }] : []
        });
      }

      const payload = {
        weeklySchedule,
        slotDuration: merged.sessionDuration,
        bufferMinutes: merged.bufferTime,
        blockedDates: merged.blockedDates
      };

      await api.put('/availability/me', payload);
    } catch (err) {
      console.error('Failed to update availability', err);
    }
  };

  return (
    <ScheduleContext.Provider value={{ appointments, availability, addAppointment, updateAvailability, loading }}>
      {children}
    </ScheduleContext.Provider>
  );
};
