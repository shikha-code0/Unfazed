import React from 'react';
import { IndianRupee, Clock } from 'lucide-react';

const ServiceSelector = ({ selectedService, onSelect }) => {
  const services = [
    {
      id: 'individual',
      title: 'Individual Therapy',
      duration: '50 mins',
      price: '₹1,500',
      desc: 'One-on-one sessions addressing anxiety, depression, burnout, and personal growth.'
    },
    {
      id: 'couples',
      title: 'Couples Therapy',
      duration: '90 mins',
      price: '₹2,500',
      desc: 'Navigating relationship challenges, communication, and emotional intimacy.'
    },
    {
      id: 'initial',
      title: 'Initial Consultation',
      duration: '30 mins',
      price: '₹500',
      desc: 'A brief introductory call to understand your needs and see if we are a good fit.'
    }
  ];

  return (
    <div className="space-y-4">
      <h2 className="font-serif text-2xl font-bold text-ink">Choose a service</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {services.map((srv) => {
          const isSelected = selectedService?.id === srv.id;
          return (
            <button
              key={srv.id}
              onClick={() => onSelect(srv)}
              className={`text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                isSelected 
                  ? 'bg-primary/5 border-primary shadow-sm' 
                  : 'bg-bg-card border-border hover:border-primary/40 hover:shadow-card'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className={`font-bold ${isSelected ? 'text-primary-hover' : 'text-ink'}`}>{srv.title}</h3>
              </div>
              <div className="flex items-center gap-3 text-xs font-bold text-slate mb-3">
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {srv.duration}</span>
                <span className="flex items-center gap-0.5"><IndianRupee className="w-3.5 h-3.5" /> {srv.price}</span>
              </div>
              <p className="text-xs text-slate/90 leading-relaxed">{srv.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceSelector;
