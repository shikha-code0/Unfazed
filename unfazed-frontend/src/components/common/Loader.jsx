import React from 'react';

const Loader = ({ size = 'md', color = 'primary', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  };

  const colors = {
    primary: 'border-primary/20 border-t-primary',
    white: 'border-white/30 border-t-white',
    sage: 'border-sage/30 border-t-sage',
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full ${sizes[size]} ${colors[color]} ${className}`}
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default Loader;
