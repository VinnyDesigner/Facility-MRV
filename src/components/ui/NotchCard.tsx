import React, { useRef, useState, useLayoutEffect, useId } from 'react';

interface NotchCardProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  iconGradient?: string;
  iconShadow?: string;
  badgeShape?: 'circle' | 'squircle';
  className?: string;
  onClick?: () => void;
}

export const NotchCard: React.FC<NotchCardProps> = ({
  children,
  icon,
  iconGradient = 'from-blue-500 to-blue-600',
  iconShadow = 'shadow-blue-500/20',
  badgeShape = 'circle',
  className = '',
  onClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState<{ w: number; h: number }>({ w: 220, h: 170 });
  const rawId = useId();
  const id = rawId.replace(/[^a-zA-Z0-9-_]/g, '');

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    
    const updateDims = () => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        if (clientWidth > 0 && clientHeight > 0) {
          setDims({ w: clientWidth, h: clientHeight });
        }
      }
    };

    updateDims();
    const ro = new ResizeObserver(updateDims);
    ro.observe(containerRef.current);

    return () => ro.disconnect();
  }, []);

  const { w, h } = dims;
  const rCard = 24; // Smooth outer card corner radius
  const btnOffset = 30; // Button center (cx = w - 30, cy = 30)
  const R = 30; // Circular cutout radius around the badge
  const rf = 18; // Smooth inverted concave fillet radius

  const pW = Math.max(w, 120);
  const pH = Math.max(h, 120);

  const cx = pW - btnOffset;
  const cy = btnOffset;

  // Exact Tangent Geometry for Miraihome organic corner scoop
  const sumR = R + rf;
  const diffY = cy - rf;
  const delta = Math.sqrt(Math.max(0, sumR * sumR - diffY * diffY));

  const x1 = cx - delta;
  const y1 = rf;
  const PtopX = x1;
  const P1x = x1 + (rf / sumR) * (cx - x1);
  const P1y = y1 + (rf / sumR) * (cy - y1);

  const x2 = pW - rf;
  const y2 = cy + delta;
  const P2x = x2 + (rf / sumR) * (cx - x2);
  const P2y = y2 + (rf / sumR) * (cy - y2);
  const PrightY = y2;

  // SVG Path: Continuous G1 tangent blend (Top Edge -> Inverted Fillet -> Circular Cutout -> Inverted Fillet -> Right Edge)
  const d = `
    M ${rCard} 0
    H ${Math.max(rCard, PtopX)}
    A ${rf} ${rf} 0 0 1 ${P1x} ${P1y}
    A ${R} ${R} 0 0 0 ${P2x} ${P2y}
    A ${rf} ${rf} 0 0 1 ${pW} ${PrightY}
    V ${pH - rCard}
    A ${rCard} ${rCard} 0 0 1 ${pW - rCard} ${pH}
    H ${rCard}
    A ${rCard} ${rCard} 0 0 1 0 ${pH - rCard}
    V ${rCard}
    A ${rCard} ${rCard} 0 0 1 ${rCard} 0
    Z
  `.replace(/\s+/g, ' ').trim();

  return (
    <div
      ref={containerRef}
      onClick={onClick}
      className={`relative group transition-all duration-300 h-[185px] rounded-[24px] ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
      style={{
        filter: 'drop-shadow(0 10px 24px rgba(0, 75, 135, 0.08)) drop-shadow(0 2px 6px rgba(0, 75, 135, 0.04))',
      }}
    >
      {/* SVG Background Path with Glass Gradients */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Glass Body Linear Gradient */}
          <linearGradient id={`${id}-glass-bg`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.97" />
            <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.90" />
            <stop offset="75%" stopColor="#F0F8FF" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#E0F2FE" stopOpacity="0.75" />
          </linearGradient>

          {/* Glass Stroke Gradient */}
          <linearGradient id={`${id}-glass-stroke`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="40%" stopColor="#E2E8F0" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        <path
          d={d}
          fill={`url(#${id}-glass-bg)`}
          stroke={`url(#${id}-glass-stroke)`}
          strokeWidth="1.2"
          className="group-hover:stroke-sky-300 transition-colors duration-300"
        />
      </svg>

      {/* Radiant Blue Ambient Glow at bottom of the card (matches reference image) */}
      <div className="absolute inset-x-2 bottom-1 h-24 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-sky-400/25 via-sky-300/10 to-transparent rounded-b-[22px] pointer-events-none opacity-80 group-hover:opacity-100 group-hover:scale-[1.02] transition-all duration-500" />

      {/* Top Specular Rim Highlight */}
      <div className="absolute inset-x-6 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent pointer-events-none z-20 opacity-90" />

      {/* Top-Right Nestled Icon Badge with Tactile 3D Glass Ring */}
      <div className="absolute top-[6px] right-[6px] p-1 bg-white/70 backdrop-blur-md rounded-full shadow-[0_4px_12px_rgba(0,75,135,0.10),inset_0_1px_1px_rgba(255,255,255,0.9)] border border-white/80 z-10">
        <div
          className={`w-[40px] h-[40px] ${
            badgeShape === 'squircle' ? 'rounded-[14px]' : 'rounded-full'
          } bg-gradient-to-br ${iconGradient} flex items-center justify-center text-white shadow-md ${iconShadow} ring-2 ring-white/90 group-hover:scale-105 transition-all duration-300`}
        >
          {icon}
        </div>
      </div>

      {/* Card Content Area */}
      <div className="relative z-10 h-full p-5 flex flex-col justify-between">
        {children}
      </div>
    </div>
  );
};

