import React from 'react';
import Loader from './Loader';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  icon: Icon = null,
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-[10px] transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-hover focus:ring-primary shadow-sm',
    secondary: 'bg-surface text-primary border border-primary/30 hover:border-primary hover:bg-primary-light/50 focus:ring-primary',
    danger: 'bg-error-bg text-error border border-error/20 hover:bg-error-bg/80 focus:ring-error',
    ghost: 'bg-transparent text-slate hover:bg-primary-light/30 hover:text-ink focus:ring-slate-400',
    icon: 'p-2.5 text-slate hover:text-primary hover:bg-primary-light/50 rounded-full min-w-[40px] min-h-[40px]',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 min-h-[36px]',
    md: 'text-sm px-4 py-2.5 min-h-[44px]',
    lg: 'text-base px-6 py-3 min-h-[50px]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variants[variant]} ${variant !== 'icon' ? sizes[size] : ''} ${className}`}
    >
      {loading ? (
        <Loader size="sm" color={variant === 'primary' ? 'white' : 'primary'} />
      ) : (
        <>
          {Icon && <Icon className={`w-4 h-4 ${children ? 'mr-2' : ''}`} />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
