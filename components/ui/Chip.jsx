import React from 'react';

const Chip = ({
  children,
  active = false,
  onClick,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'accent'
  className = '',
  ...props
}) => {
  const isClickable = !!onClick;
  
  const baseStyle = `inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
    isClickable ? 'cursor-pointer select-none' : ''
  }`;

  const styles = {
    primary: active 
      ? 'bg-primary-navy text-on-surface border border-primary-navy' 
      : 'bg-primary-navy/10 text-on-surface border border-primary-navy/20 hover:bg-primary-navy/20',
    secondary: active 
      ? 'bg-secondary-sand text-bg-dark border border-secondary-sand' 
      : 'bg-secondary-sand/10 text-secondary-sand border border-secondary-sand/20 hover:bg-secondary-sand/20',
    accent: active 
      ? 'bg-accent-yellow text-bg-dark border border-accent-yellow shadow-[0_0_10px_rgba(255,186,9,0.3)]' 
      : 'bg-accent-yellow/10 text-accent-yellow border border-accent-yellow/20 hover:bg-accent-yellow/20',
    outline: active 
      ? 'border border-on-surface text-on-surface bg-white/5' 
      : 'border border-outline-variant text-on-surface-variant hover:border-on-surface hover:text-on-surface',
  };

  return (
    <span
      onClick={onClick}
      className={`${baseStyle} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
};

export default Chip;
