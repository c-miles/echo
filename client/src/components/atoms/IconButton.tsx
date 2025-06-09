import React from 'react';

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'danger' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const IconButton: React.FC<IconButtonProps> = ({ 
  variant = 'default', 
  size = 'md',
  className = '',
  children,
  ...props 
}) => {
  const baseClasses = 'rounded-full transition-base focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 focus:ring-opacity-75 flex items-center justify-center';
  
  const variantClasses = {
    default: 'bg-surface hover:bg-primary text-text',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    primary: 'bg-primary hover:bg-primary-hov text-text'
  };
  
  const sizeClasses = {
    sm: 'p-2',
    md: 'p-3',
    lg: 'p-4'
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default IconButton;