import React from 'react';

interface SortTrianglesProps {
  active: boolean;
  direction?: 'asc' | 'desc';
  className?: string;
}

export const SortTriangles: React.FC<SortTrianglesProps> = ({
  active,
  direction = 'asc',
  className = '',
}) => {
  const isAsc = active && direction === 'asc';
  const isDesc = active && direction === 'desc';

  return (
    <span
      className={`inline-flex flex-col items-center justify-center gap-[2px] ml-1.5 shrink-0 select-none ${className}`}
      aria-hidden="true"
    >
      {/* Upward Triangle */}
      <svg
        className={`w-[7.5px] h-[4.5px] transition-colors duration-150 ${
          isAsc
            ? 'fill-slate-900 text-slate-900'
            : 'fill-slate-400/80 text-slate-400/80 group-hover:fill-slate-500'
        }`}
        viewBox="0 0 8 5"
      >
        <polygon points="4,0.5 8,5 0,5" />
      </svg>

      {/* Downward Triangle */}
      <svg
        className={`w-[7.5px] h-[4.5px] transition-colors duration-150 ${
          isDesc
            ? 'fill-slate-900 text-slate-900'
            : 'fill-slate-400/80 text-slate-400/80 group-hover:fill-slate-500'
        }`}
        viewBox="0 0 8 5"
      >
        <polygon points="4,4.5 0,0 8,0" />
      </svg>
    </span>
  );
};
