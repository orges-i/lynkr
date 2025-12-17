import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  isLoading = false,
  ...props 
}) => {
  // Base styles: rounded-full (standard pill shape), medium font weight, smooth transitions
  const baseStyles = "inline-flex items-center justify-center rounded-full font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    // Primary: Contrast background (Black in Light mode, White in Dark mode)
    primary: "bg-primary text-background hover:opacity-90 shadow-sm border border-transparent",
    // Secondary: Subtle background
    secondary: "bg-surfaceHighlight text-primary border border-border hover:border-primary/30 hover:bg-surfaceHighlight/80",
    // Outline: Transparent with border
    outline: "bg-transparent text-primary border border-border hover:border-primary",
    // Ghost: Text only
    ghost: "text-secondary hover:text-primary hover:bg-surfaceHighlight",
  };

  const sizes = {
    sm: "h-9 px-4 text-sm",
    md: "h-11 px-6 text-base",
    lg: "h-14 px-8 text-lg",
    xl: "h-16 px-10 text-xl font-semibold",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {isLoading && (
        <span className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
};