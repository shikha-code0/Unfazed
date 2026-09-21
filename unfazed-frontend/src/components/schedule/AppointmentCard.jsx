import React from 'react';
import { Video, MapPin, User, Clock, IndianRupee } from 'lucide-react';

const AppointmentCard = ({ appointment, onClick }) => {
  // Session colors:
  // Confirmed: sage background
  // Pending: peach/amber background
  // Cancelled: muted red
  // Blocked/unavailable: soft blue-gray
  
  let bgColor = 'bg-slate/20 border-slate/30 text-ink'; // default
  let borderColor = 'border-slate/30';
  let badgeColor = 'bg-slate/20 text-slate';
  
  if (appointment.status === 'confirmed') {
    bgColor = 'bg-success-bg border-success/30 text-ink';
    borderColor = 'border-success/30';
    badgeColor = 'bg-success/20 text-success-dark';
  } else if (appointment.status === 'pending') {
    bgColor = 'bg-peach/30 border-peach/50 text-ink';
    borderColor = 'border-peach/50';
    badgeColor = 'bg-warning/20 text-warning-dark';
  } else if (appointment.status === 'cancelled') {
    bgColor = 'bg-error/10 border-error/20 text-error';
    borderColor = 'border-error/20';
    badgeColor = 'bg-error/20 text-error';
  } else if (appointment.status === 'blocked') {
    bgColor = 'bg-border/30 border-border/50 text-slate';
    borderColor = 'border-border/50';
    badgeColor = 'bg-border/50 text-slate';
  }

  // Calculate position and height based on time
  const startHour = appointment.date.getHours();
  const startMinute = appointment.date.getMinutes();
  
  // Assuming grid starts at 8:00 AM (hour 8)
  const offsetHours = startHour - 8;
  const topPercentage = ((offsetHours * 60 + startMinute) / (12 * 60)) * 100; // 12 hours total (8 AM to 8 PM)
  const heightPercentage = (appointment.duration / (12 * 60)) * 100;

  return (
    <div
      onClick={() => onClick(appointment)}
      className={`absolute left-1 right-1 rounded-md border p-2 cursor-pointer transition-shadow hover:shadow-md overflow-hidden ${bgColor} ${borderColor}`}
      style={{
        top: `${topPercentage}%`,
        height: `${heightPercentage}%`,
        minHeight: '40px'
      }}
    >
      <div className="flex flex-col h-full text-xs">
        <div className="font-bold truncate flex items-center justify-between">
          <span>{appointment.clientName}</span>
          {appointment.mode === 'online' ? (
            <Video className="w-3 h-3 flex-shrink-0 ml-1" />
          ) : (
            <MapPin className="w-3 h-3 flex-shrink-0 ml-1" />
          )}
        </div>
        <div className="truncate opacity-80 mt-0.5">{appointment.service}</div>
        <div className="mt-auto pt-1 text-[10px] font-medium uppercase tracking-wider opacity-90 truncate">
          {appointment.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {appointment.duration}m
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;
