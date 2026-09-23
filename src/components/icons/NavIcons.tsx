import React from 'react';

/**
 * Custom Dashboard Bento Grid Icon (Lined / Stroke style matching other sidebar icons):
 * 4 rounded line rectangles in an asymmetric bento layout.
 */
export const DashboardBentoIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  className = 'w-4 h-4',
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Top-Left: Rounded rectangle */}
    <rect x="3" y="3" width="7" height="9" rx="1.5" />
    {/* Bottom-Left: Rounded rectangle */}
    <rect x="3" y="15" width="7" height="6" rx="1.5" />
    {/* Top-Right: Rounded rectangle */}
    <rect x="14" y="3" width="7" height="5" rx="1.5" />
    {/* Bottom-Right: Rounded rectangle */}
    <rect x="14" y="11" width="7" height="10" rx="1.5" />
  </svg>
);

/**
 * Custom Reports Analytics & Chart Icon (Lined / Stroke style matching other sidebar icons):
 * Ascending trend line with outlined bar columns below.
 */
export const ReportsChartIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  className = 'w-4 h-4',
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* Ascending Trend Line */}
    <path d="M3 11L8.5 5.5L13.5 8.5L21 2" />
    <polyline points="16 2 21 2 21 7" />
    {/* Line Bars */}
    <line x1="4" y1="16" x2="4" y2="21" />
    <line x1="9.5" y1="12" x2="9.5" y2="21" />
    <line x1="14.5" y1="14" x2="14.5" y2="21" />
    <line x1="19.5" y1="9" x2="19.5" y2="21" />
  </svg>
);

/**
 * Custom Logout Icon (Lined / Stroke style matching Lucide style):
 * Door bracket with arrow pointing outward to the right.
 */
export const LogoutNavIcon: React.FC<React.SVGProps<SVGSVGElement>> = ({
  className = 'w-4 h-4',
  ...props
}) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
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
