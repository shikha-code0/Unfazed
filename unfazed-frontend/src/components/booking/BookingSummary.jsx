import React, { useState } from 'react';
import { Calendar, Clock, Video, IndianRupee, ShieldCheck } from 'lucide-react';
import Input from '../common/Input';
import Button from '../common/Button';
import api from '../../api/axios';

const BookingSummary = ({ 
  therapistSlug, 
  service, 
  date, 
  time, 
  onConfirm, 
  clientDetails, 
  setClientDetails,
  onError 
}) => {
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!consent) return;
    
    setError('');
    setLoading(true);
    
    try {
      // Create booking payload
      const bookingData = {
        therapistSlug,
        clientName: clientDetails.name,
        clientEmail: clientDetails.email,
        clientPhone: clientDetails.phone,
        serviceType: service.title,
        sessionMode: 'Online',
        startTime: time, // Already an ISO string from SlotPicker
        endTime: new Date(new Date(time).getTime() + (service.duration || 50) * 60000).toISOString(),
        timezone: 'Asia/Kolkata',
        presentingConcern: clientDetails.concern,
        consentGiven: true,
      };
      
      // Call booking API
      const response = await api.post('/scheduling/book', bookingData);
      
      if (response.data.success) {
        // Call onConfirm with booking data
        onConfirm({
          date,
          time: new Date(time).toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true
          }),
        });
      } else {
        setError(response.data.message || 'Booking failed. Please try again.');
        if (onError) onError(response.data.message);
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to book session';
      setError(errorMsg);
      if (onError) onError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left side: Client Details Form */}
      <div className="lg:col-span-7 space-y-6">
        <div>
          <h2 className="font-serif text-2xl font-bold text-ink">Confirm your details</h2>
          <p className="text-sm text-slate mt-1">Please provide your information to secure this session.</p>
        </div>

        {error && (
          <div className="bg-error-bg border border-error/20 rounded-lg p-3 text-error text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">Full Name</label>
              <Input 
                required
                placeholder="Jane Doe" 
                value={clientDetails.name}
                onChange={(e) => setClientDetails({...clientDetails, name: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-ink mb-1.5">Phone Number</label>
              <Input 
                required
                type="tel" 
                placeholder="+91 98765 43210" 
                value={clientDetails.phone}
                onChange={(e) => setClientDetails({...clientDetails, phone: e.target.value})}
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-ink mb-1.5">Email Address</label>
            <Input 
              required
              type="email" 
              placeholder="jane@example.com" 
              value={clientDetails.email}
              onChange={(e) => setClientDetails({...clientDetails, email: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-ink mb-1.5">Presenting Concern (Optional)</label>
            <textarea 
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-bg-card text-ink focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all resize-none h-24"
              placeholder="Briefly describe what you'd like to focus on..."
              value={clientDetails.concern}
              onChange={(e) => setClientDetails({...clientDetails, concern: e.target.value})}
            ></textarea>
          </div>

          <label className="flex items-start gap-3 p-4 rounded-xl border border-border bg-bg-card hover:bg-bg-card-elevated transition-colors cursor-pointer group">
            <div className="pt-0.5">
              <input 
                type="checkbox" 
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="w-4 h-4 rounded border-border text-primary focus:ring-primary accent-primary" 
              />
            </div>
            <div className="text-sm text-slate">
              <span className="font-bold text-ink">Privacy Consent</span>
              <p className="mt-0.5 leading-relaxed">
                I understand that this booking request and my information will be handled securely and treated with strict confidentiality.
              </p>
            </div>
          </label>

          <div className="bg-bg-card-elevated border border-border rounded-xl p-3 flex items-center gap-2 text-xs text-slate font-medium">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            Payment will be requested after confirmation.
          </div>
        </form>
      </div>

      {/* Right side: Summary Card */}
      <div className="lg:col-span-5 relative">
        <div className="sticky top-24 bg-bg-card-elevated rounded-2xl border border-border p-6 shadow-card">
          <h3 className="text-sm font-bold tracking-wider uppercase text-slate mb-4">Session Summary</h3>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className="font-bold text-ink text-lg">{service?.title}</h4>
                <div className="flex items-center gap-1.5 text-xs text-slate mt-1">
                  <Video className="w-3.5 h-3.5" /> Online Video Session
                </div>
              </div>
              <div className="font-bold text-xl text-ink">
                {service?.price}
              </div>
            </div>

            <div className="h-px w-full bg-border/60"></div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-ink">{date?.toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</div>
                  <div className="text-xs text-slate">Asia/Kolkata</div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-ink">
                    {time ? new Date(time).toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true
                    }) : 'TBD'}
                  </div>
                  <div className="text-xs text-slate">{service?.duration} min session</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-sage/10 border border-sage/20 rounded-xl p-3 flex items-center gap-2 text-xs text-sage-dark font-medium mb-6">
            <ShieldCheck className="w-4 h-4 flex-shrink-0" />
            Payment will be requested after confirmation.
          </div>

          <Button 
            variant="primary" 
            className="w-full justify-center" 
            size="lg"
            onClick={handleSubmit}
            loading={loading}
            disabled={!consent}
          >
            Confirm Booking
          </Button>
          
          <p className="text-center text-[11px] text-slate mt-4">
            By booking, you agree to the <a href="#" className="underline hover:text-ink">Cancellation Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BookingSummary;
