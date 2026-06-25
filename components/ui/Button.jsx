import React from 'react';

const Button = ({
  children,
  onClick,
  type = 'button',
  variant = 'primary', // 'primary' | 'secondary' | 'glass' | 'ghost'
  className = '',
  disabled = false,
  ...props
}) => {
  const baseStyle = 'inline-flex items-center justify-center font-bold tracking-wide transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';
  
  const variants = {
    primary: 'bg-accent-yellow text-bg-dark rounded-full px-8 py-3.5 hover:shadow-[0_0_25px_rgba(255,186,9,0.35)] hover:scale-[1.02]',
    secondary: 'border border-outline-variant hover:bg-white/5 text-on-surface rounded-full px-8 py-3.5',
    glass: 'glass-card text-on-surface px-6 py-2.5 rounded-full hover:bg-white/5 transition-colors border-white/10',
    ghost: 'text-on-surface-variant hover:text-on-surface transition-colors px-4 py-2 rounded-lg',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
