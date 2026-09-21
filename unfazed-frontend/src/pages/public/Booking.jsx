import React, { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Button from '../../components/common/Button';
import BookingProgress from '../../components/booking/BookingProgress';
import ServiceSelector from '../../components/booking/ServiceSelector';
import SlotPicker from '../../components/booking/SlotPicker';
import BookingSummary from '../../components/booking/BookingSummary';
import Toast from '../../components/common/Toast';

const Booking = () => {
  const { slug } = useParams();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');
  
  // Wizard State
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [clientDetails, setClientDetails] = useState({
    name: '',
    phone: '',
    email: '',
    concern: ''
  });

  const nextStep = () => setCurrentStep(prev => prev + 1);
  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleConfirm = (bookingData) => {
    setSuccessData(bookingData);
    setIsSuccess(true);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-bg-main flex flex-col items-center justify-center p-4">
        <div className="bg-bg-card-elevated border border-border rounded-2xl p-8 sm:p-12 max-w-lg w-full text-center shadow-card animate-in fade-in slide-in-from-bottom-8 duration-500">
          <div className="w-20 h-20 rounded-full bg-success/20 text-success mx-auto flex items-center justify-center mb-6 ring-8 ring-success/10">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-ink mb-2">Your session is confirmed</h1>
          <p className="text-slate text-lg mb-8">
            {successData?.date && successData.date.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' })} at {successData?.time} <br/>
            Online session with Dr. Ananya Sharma
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button variant="outline" className="justify-center">Add to calendar</Button>
            <Link to={`/${slug}`}>
              <Button variant="primary" className="w-full justify-center">Return to Profile</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-main flex flex-col">
      <Toast 
        message={toastMessage} 
        type={toastType} 
        onClose={() => setToastMessage('')} 
      />
      
      {/* Minimal Header */}
      <header className="bg-bg-card-elevated border-b border-border py-4 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to={`/${slug}`} className="flex items-center gap-2 text-slate hover:text-ink transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-bold text-sm hidden sm:inline-block">Back to Profile</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sage ring-4 ring-sage/20"></span>
            <span className="text-xl font-bold tracking-tight text-ink">unfazed</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col pt-8 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto w-full space-y-10">
          {/* Progress Indicator */}
          <BookingProgress currentStep={currentStep} />

          {/* Wizard Steps */}
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {currentStep === 1 && (
              <div className="space-y-8">
                <ServiceSelector 
                  selectedService={selectedService} 
                  onSelect={setSelectedService} 
                />
                <div className="flex justify-end border-t border-border pt-6">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    onClick={nextStep} 
                    disabled={!selectedService}
                  >
                    Continue to Time
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                <SlotPicker 
                  therapistSlug={slug}
                  selectedDate={selectedDate}
                  selectedTime={selectedTime}
                  onDateSelect={setSelectedDate}
                  onTimeSelect={setSelectedTime}
                  onError={(msg) => {
                    setToastMessage(msg);
                    setToastType('error');
                  }}
                />
                <div className="flex justify-between border-t border-border pt-6">
                  <Button variant="outline" onClick={prevStep}>Back</Button>
                  <Button 
                    variant="primary" 
                    size="lg" 
                    onClick={nextStep}
                    disabled={!selectedDate || !selectedTime}
                  >
                    Continue to Details
                  </Button>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8">
                <BookingSummary 
                  therapistSlug={slug}
                  service={selectedService}
                  date={selectedDate}
                  time={selectedTime}
                  clientDetails={clientDetails}
                  setClientDetails={setClientDetails}
                  onConfirm={handleConfirm}
                  onError={(msg) => {
                    setToastMessage(msg);
                    setToastType('error');
                  }}
                />
                <div className="flex justify-start border-t border-border pt-6 lg:hidden">
                  <Button variant="outline" onClick={prevStep}>Back to Time</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Booking;
