import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
  glow?: 'blue' | 'cyan' | 'none';
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  glow = 'none',
  onClick,
}) => {
  const glowStyles = {
    none: '',
    blue: 'hover:shadow-glow-sm hover:border-primary/40',
    cyan: 'hover:shadow-glow-md hover:border-cyan/40',
  };

  return (
    <div
      onClick={onClick}
      className={`bg-card border border-borderSubtle rounded-xl p-5 transition-all duration-200 ${
        hoverable ? 'cursor-pointer hover:border-borderElevated hover:-translate-y-0.5' : ''
      } ${glowStyles[glow]} ${className}`}
    >
      {children}
    </div>
  );
};
