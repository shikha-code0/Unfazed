import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = React.forwardRef(({
  label,
  error,
  type = 'text',
  placeholder,
  helperText,
  icon: Icon,
  disabled = false,
  className = '',
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordType = type === 'password';
  const inputType = isPasswordType ? (showPassword ? 'text' : 'password') : type;
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-ink uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative rounded-[10px]">
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate">
            <Icon className="w-5 h-5" />
          </div>
        )}
        
        <input
          id={inputId}
          ref={ref}
          type={inputType}
          disabled={disabled}
          placeholder={placeholder}
          className={`w-full h-[44px] px-3.5 bg-surface text-ink text-sm rounded-[10px] border ${
            error ? 'border-error focus:ring-error' : 'border-border focus:border-primary focus:ring-primary'
          } ${Icon ? 'pl-11' : ''} ${
            isPasswordType ? 'pr-11' : ''
          } focus:outline-none focus:ring-2 focus:ring-opacity-20 transition-colors disabled:bg-bg-main/50 disabled:cursor-not-allowed placeholder:text-slate/60`}
          {...props}
        />

        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate hover:text-ink focus:outline-none"
            tabIndex="-1"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>

      {error ? (
        <p className="text-xs text-error font-medium flex items-center gap-1 mt-1">
          <span>•</span> {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-slate mt-1">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
