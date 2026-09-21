import React from 'react';
import { X, Clock, MapPin, IndianRupee, Video, Calendar, User, ShieldCheck } from 'lucide-react';
import Button from '../common/Button';

const SessionModal = ({ session, onClose }) => {
  if (!session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm">
      <div className="bg-bg-card-elevated w-full max-w-md rounded-2xl shadow-2xl overflow-hidden border border-border">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-border/50 bg-bg-main">
          <h2 className="font-serif text-xl text-ink font-bold">Session Details</h2>
          <button onClick={onClose} className="p-2 text-slate hover:text-ink hover:bg-bg-card rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center text-lg font-bold">
              {session.clientName.charAt(0)}
            </div>
            <div>
              <h3 className="text-lg font-bold text-ink">{session.clientName}</h3>
              <p className="text-sm text-slate">{session.service}</p>
            </div>
            {session.status === 'confirmed' && (
              <div className="ml-auto flex items-center gap-1 text-xs font-bold text-success-dark bg-success-bg px-2.5 py-1 rounded-full">
                <ShieldCheck className="w-3.5 h-3.5" /> Confirmed
              </div>
            )}
          </div>

          <div className="bg-bg-card rounded-xl p-4 border border-border space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="font-medium text-ink">
                {session.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-medium text-ink">
                {session.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({session.duration} mins)
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              {session.mode === 'online' ? <Video className="w-4 h-4 text-primary" /> : <MapPin className="w-4 h-4 text-primary" />}
              <span className="font-medium text-ink">
                {session.mode === 'online' ? 'Online Session (Zoom)' : 'In-person Clinic'}
              </span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <IndianRupee className="w-4 h-4 text-primary" />
              <span className="font-medium text-ink">
                Payment: <span className={session.paymentStatus === 'paid' ? 'text-success-dark font-bold capitalize' : 'text-warning-dark font-bold capitalize'}>{session.paymentStatus}</span>
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="primary" className="flex-1">Join Session</Button>
            <Button variant="outline" className="flex-1 border-error/50 text-error hover:bg-error/10">Reschedule</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionModal;
