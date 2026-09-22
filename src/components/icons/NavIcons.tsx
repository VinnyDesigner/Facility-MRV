import React from 'react';

/**
 * Custom Dashboard Bento Grid Icon matching the user specification:
 * 4 rounded rectangles in an asymmetric bento layout (short-tall on left, tall-short on right).
 */
export const DashboardBentoIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  className = 'w-4 h-4',
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Top-Left: Short rounded rectangle */}
    <rect x="2.5" y="2.5" width="8.5" height="7.5" rx="2" />
    {/* Bottom-Left: Tall rounded rectangle */}
    <rect x="2.5" y="12" width="8.5" height="9.5" rx="2" />
    {/* Top-Right: Tall rounded rectangle */}
    <rect x="13" y="2.5" width="8.5" height="11.5" rx="2" />
    {/* Bottom-Right: Short rounded rectangle */}
    <rect x="13" y="16" width="8.5" height="5.5" rx="2" />
  </svg>
);

/**
 * Custom Reports Analytics & Chart Icon matching the user specification:
 * 4 vertical capsule/pill bars with an ascending trend line above.
 */
export const ReportsChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  className = 'w-4 h-4',
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Ascending Trend Line */}
    <path
      d="M3.5 10.5L9.5 4.5L14.5 7.5L21 2"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Bar 1 (Leftmost, Short) */}
    <rect x="2" y="15.5" width="3.5" height="6.5" rx="1.75" />
    {/* Bar 2 (Medium-Tall) */}
    <rect x="7.5" y="10" width="3.5" height="12" rx="1.75" />
    {/* Bar 3 (Medium) */}
    <rect x="13" y="12.5" width="3.5" height="9.5" rx="1.75" />
    {/* Bar 4 (Rightmost, Tallest) */}
    <rect x="18.5" y="6.5" width="3.5" height="15.5" rx="1.75" />
  </svg>
);

/**
 * Custom Logout Icon matching user specification:
 * Pill/capsule shape with cutout slot and exiting horizontal arrow pointing right.
 */
export const LogoutNavIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  className = 'w-4 h-4',
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    {...props}
  >
    {/* Left Rounded Capsule with a horizontal notch/slot for the arrow */}
    <path
      d="M7 3C4.24 3 2 5.24 2 8v8c0 2.76 2.24 5 5 5s5-2.24 5-5v-2.2H6.5v-3.6H12V8c0-2.76-2.24-5-5-5z"
    />
    {/* Arrow exiting from inside the capsule notch */}
    <path
      d="M8.5 12H21.5M16.5 7L21.5 12L16.5 17"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * Custom Sidebar Collapse / Expand Toggle Icon matching user specification:
 * 3 left-aligned rounded horizontal bars of varying lengths (short top, long middle, medium bottom).
 */
export const SidebarToggleIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  className = 'w-4.5 h-4.5',
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    stroke="currentColor"
    strokeWidth="2.6"
    strokeLinecap="round"
    {...props}
  >
    {/* Top Bar (Short: ~50% width) */}
    <line x1="3.5" y1="5.5" x2="12.5" y2="5.5" />
    {/* Middle Bar (Long / Full: 100% width) */}
    <line x1="3.5" y1="12" x2="20.5" y2="12" />
    {/* Bottom Bar (Medium: ~75% width) */}
    <line x1="3.5" y1="18.5" x2="16.5" y2="18.5" />
  </svg>
);
