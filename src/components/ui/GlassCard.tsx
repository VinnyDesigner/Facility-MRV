import React from 'react';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'dark' | 'glow' | 'subtle';
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  variant = 'default',
  hoverEffect = true,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'dark':
        return 'bg-[#0D0E12] border border-slate-800 text-white shadow-xl rounded-[28px]';
      case 'subtle':
      case 'glow':
      case 'default':
      default:
        return 'bg-white/95 backdrop-blur-md border border-slate-200/70 shadow-[0_4px_24px_rgba(0,0,0,0.03)] rounded-[28px]';
    }
  };

  return (
    <div
      className={`relative overflow-hidden p-6 ${getVariantStyles()} ${
        hoverEffect ? 'hover:shadow-md hover:border-[#CBD5E1] transition-all duration-200' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
