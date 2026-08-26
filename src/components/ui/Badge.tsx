import React from 'react';
import { SubmissionStatus } from '../../types/mrv';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 
    | 'default'
    | 'success'
    | 'warning'
    | 'danger'
    | 'info'
    | 'cyan'
    | 'teal'
    | 'neutral'
    | 'outline';
  status?: SubmissionStatus | string;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant,
  status,
  size = 'md',
  dot = false,
  className = '',
}) => {
  // Determine variant from status if provided
  let computedVariant = variant || 'default';

  if (status) {
    switch (status) {
      case 'Approved':
      case 'Registered':
      case 'Active':
      case 'Verified':
        computedVariant = 'success';
        break;
      case 'Under Review':
      case 'Submitted':
        computedVariant = 'info';
        break;
      case 'Correction Required':
      case 'Renewal Pending':
        computedVariant = 'warning';
        break;
      case 'Rejected':
      case 'Expired':
        computedVariant = 'danger';
        break;
      case 'Draft':
        computedVariant = 'neutral';
        break;
      default:
        computedVariant = 'cyan';
    }
  }

  const getVariantStyles = () => {
    switch (computedVariant) {
      case 'success':
        return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30';
      case 'warning':
        return 'bg-amber-500/10 text-amber-700 border-amber-500/30';
      case 'danger':
        return 'bg-rose-500/10 text-rose-700 border-rose-500/30';
      case 'info':
        return 'bg-primary-500/10 text-primary-700 border-primary-500/30';
      case 'cyan':
        return 'bg-cyan-brand/10 text-cyan-700 border-cyan-brand/30';
      case 'teal':
        return 'bg-teal-brand/10 text-teal-700 border-teal-brand/30';
      case 'neutral':
        return 'bg-slate-200/60 text-slate-700 border-slate-300/50';
      case 'outline':
        return 'bg-transparent text-navy-800 border-navy-800/20';
      default:
        return 'bg-primary-50 text-primary-700 border-primary-200';
    }
  };

  const getDotStyles = () => {
    switch (computedVariant) {
      case 'success':
        return 'bg-emerald-500';
      case 'warning':
        return 'bg-amber-500 animate-pulse';
      case 'danger':
        return 'bg-rose-500';
      case 'info':
        return 'bg-primary-500 animate-pulse';
      case 'cyan':
        return 'bg-cyan-brand';
      case 'teal':
        return 'bg-teal-brand';
      case 'neutral':
        return 'bg-slate-400';
      default:
        return 'bg-primary-500';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-2 py-0.5 font-medium';
      case 'lg':
        return 'text-sm px-3.5 py-1 font-semibold';
      default:
        return 'text-xs px-2.5 py-1 font-medium';
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur-sm transition-colors ${getVariantStyles()} ${getSizeStyles()} ${className}`}
    >
      {dot && <span className={`h-1.5 w-1.5 rounded-full ${getDotStyles()}`} />}
      {children}
    </span>
  );
};
