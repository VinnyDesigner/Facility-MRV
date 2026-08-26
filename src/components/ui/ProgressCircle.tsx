import React from 'react';

interface ProgressCircleProps {
  value: number; // 0 to 100
  size?: number;
  strokeWidth?: number;
  label?: string;
  subtitle?: string;
  color?: string;
  trackColor?: string;
  className?: string;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  value,
  size = 140,
  strokeWidth = 10,
  label,
  subtitle,
  color = '#19B5D8',
  trackColor = 'rgba(8, 120, 201, 0.1)',
  className = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="circleProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0878C9" />
            <stop offset="50%" stopColor="#19B5D8" />
            <stop offset="100%" stopColor="#16A6A0" />
          </linearGradient>
        </defs>
        {/* Track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="transparent"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#circleProgressGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="transparent"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-3xl font-extrabold font-display text-navy-900 tracking-tight">
          {value}%
        </span>
        {label && (
          <span className="text-xs font-semibold text-primary-700 tracking-wide uppercase mt-0.5">
            {label}
          </span>
        )}
        {subtitle && (
          <span className="text-[10px] text-mrv-muted mt-0.5 max-w-[85px] leading-tight">
            {subtitle}
          </span>
        )}
      </div>
    </div>
  );
};
