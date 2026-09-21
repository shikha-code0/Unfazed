import React from 'react';
import { Check } from 'lucide-react';

const BookingProgress = ({ currentStep }) => {
  const steps = [
    { num: 1, label: 'Choose service' },
    { num: 2, label: 'Choose a time' },
    { num: 3, label: 'Confirm & pay' },
  ];

  return (
    <div className="flex items-center justify-center space-x-2 sm:space-x-4">
      {steps.map((step, idx) => {
        const isActive = currentStep === step.num;
        const isCompleted = currentStep > step.num;

        return (
          <React.Fragment key={step.num}>
            <div className="flex items-center space-x-2">
              <div 
                className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-bold transition-colors ${
                  isActive 
                    ? 'bg-primary text-white ring-4 ring-primary/20' 
                    : isCompleted 
                      ? 'bg-success text-white' 
                      : 'bg-bg-card border border-border text-slate'
                }`}
              >
                {isCompleted ? <Check className="w-3 h-3 sm:w-4 sm:h-4" /> : step.num}
              </div>
              <span className={`text-xs sm:text-sm font-bold hidden sm:block ${isActive || isCompleted ? 'text-ink' : 'text-slate'}`}>
                {step.label}
              </span>
            </div>
            
            {idx < steps.length - 1 && (
              <div className={`w-8 sm:w-12 h-px ${isCompleted ? 'bg-success' : 'bg-border'}`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default BookingProgress;
