import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'contrast' | 'danger';
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false,
  className = '',
  ...props 
}) => {
  let bgClass = '';
  let textClass = '';
  let borderClass = 'border-brand-black';

  switch (variant) {
    case 'primary':
      bgClass = 'bg-brand-pink';
      textClass = 'text-brand-black';
      break;
    case 'secondary':
      bgClass = 'bg-brand-lime';
      textClass = 'text-brand-black';
      break;
    case 'contrast':
      bgClass = 'bg-brand-black';
      textClass = 'text-white';
      break;
    case 'danger':
      bgClass = 'bg-black hover:bg-red-600';
      textClass = 'text-white';
      break;
  }

  return (
    <button
      className={`
        relative border-3 font-black uppercase tracking-wider py-3 px-6
        shadow-hard transition-all duration-200
        hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px]
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 disabled:hover:shadow-hard
        ${bgClass} ${textClass} ${borderClass} ${fullWidth ? 'w-full' : ''} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;