import React from 'react';

const Input = ({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  className = '',
  error,
  required = false,
  ...props
}) => {
  return (
    <div className={`flex flex-col gap-2 w-full ${className}`}>
      {label && (
        <label className="text-xs font-bold text-accent-yellow uppercase tracking-widest">
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full bg-bg-dark border rounded-2xl px-6 py-4 outline-none transition-all duration-300 font-body text-on-surface placeholder:text-on-surface-variant/40
          ${error 
            ? 'border-red-400 focus:border-red-500 focus:ring-1 focus:ring-red-400/30' 
            : 'border-white/10 focus:border-accent-yellow focus:ring-1 focus:ring-accent-yellow/20 focus:shadow-[0_0_15px_rgba(255,186,9,0.1)]'
          }`}
        {...props}
      />
      {error && <span className="text-xs text-red-400 font-medium mt-1">{error}</span>}
    </div>
  );
};

export default Input;
