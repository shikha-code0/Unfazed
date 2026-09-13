import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 4000 }) => {
  useEffect(() => {
    if (duration && onClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  if (!message) return null;

  const styles = {
    success: 'bg-surface border-success/30 text-ink shadow-card',
    error: 'bg-surface border-error/30 text-ink shadow-card',
    info: 'bg-surface border-primary/30 text-ink shadow-card',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-error flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-primary flex-shrink-0" />,
  };

  return (
    <div className="fixed top-5 right-5 z-50 max-w-sm w-full transition-all duration-300 transform translate-y-0 opacity-100">
      <div className={`flex items-start gap-3 p-4 rounded-card border ${styles[type]}`}>
        {icons[type]}
        <div className="flex-1 text-sm font-medium text-ink leading-snug">
          {message}
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-slate hover:text-ink transition-colors p-0.5 rounded focus:outline-none"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Toast;
