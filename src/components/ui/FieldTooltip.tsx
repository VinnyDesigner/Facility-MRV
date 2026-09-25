import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

export interface FieldTooltipProps {
  children?: React.ReactNode;
  content?: string | React.ReactNode;
  title?: string;
  example?: string;
  format?: string;
  unit?: string;
  value?: any;
  position?: 'auto' | 'bottom' | 'top' | 'left' | 'right';
  className?: string;
  tooltipClassName?: string;
  showDescription?: boolean;
}

/**
 * Helper to recursively extract a current value from React elements or text children.
 */
function extractValue(children: React.ReactNode, explicitValue?: any): any {
  if (explicitValue !== undefined && explicitValue !== null) {
    return explicitValue;
  }

  let foundValue: any = undefined;

  function traverse(node: React.ReactNode) {
    if (!node || foundValue !== undefined) return;

    if (React.isValidElement(node)) {
      const props = node.props as any;
      if (props) {
        if (props.value !== undefined && props.value !== null) {
          foundValue = props.value;
          return;
        }
        if (props.defaultValue !== undefined && props.defaultValue !== null) {
          foundValue = props.defaultValue;
          return;
        }
        if (props.checked !== undefined) {
          foundValue = props.checked ? 'Enabled / Yes' : 'Disabled / No';
          return;
        }
        // If it's a read-only badge, span, or div containing text
        if (typeof props.children === 'string' || typeof props.children === 'number') {
          const str = String(props.children).trim();
          if (str && str !== '—' && str !== '-') {
            foundValue = str;
            return;
          }
        }
        if (props.children) {
          React.Children.forEach(props.children, traverse);
        }
      }
    } else if (typeof node === 'string' || typeof node === 'number') {
      const str = String(node).trim();
      if (str && str !== '—' && str !== '-') {
        foundValue = str;
      }
    }
  }

  traverse(children);
  return foundValue;
}

/**
 * Determine if a value is considered non-empty / filled.
 */
function isValueFilled(val: any): boolean {
  if (val === undefined || val === null) return false;
  if (typeof val === 'string') {
    const trimmed = val.trim();
    return (
      trimmed !== '' &&
      trimmed !== '—' &&
      trimmed !== '-' &&
      trimmed !== 'ALL' &&
      trimmed !== 'Select' &&
      !trimmed.toLowerCase().startsWith('select ') &&
      !trimmed.toLowerCase().startsWith('e.g.')
    );
  }
  if (typeof val === 'number') return true;
  if (typeof val === 'boolean') return true;
  if (Array.isArray(val)) return val.length > 0;
  if (typeof val === 'object') return Object.keys(val).length > 0;
  return false;
}

/**
 * Format filled value for display in the tooltip.
 */
function formatValueDisplay(val: any): string {
  if (Array.isArray(val)) {
    if (val.length === 0) return 'No files attached';
    if (val[0]?.name) {
      return val.map((f: any) => f.name).join(', ');
    }
    return val.join(', ');
  }
  if (typeof val === 'object' && val !== null) {
    if (val.lat !== undefined && val.lng !== undefined) {
      return `Lat: ${val.lat}, Lng: ${val.lng}`;
    }
    return JSON.stringify(val);
  }
  return String(val);
}

export const FieldTooltip: React.FC<FieldTooltipProps> = ({
  children,
  content,
  title,
  example,
  format,
  unit,
  value,
  position = 'auto',
  className = 'w-full',
  tooltipClassName = '',
  showDescription = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    actualPosition: 'bottom' | 'top' | 'left' | 'right';
    arrowLeft: number;
    arrowTop: number;
  } | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Extract live value
  const extractedVal = extractValue(children, value);
  const filled = isValueFilled(extractedVal);

  const hasContent = Boolean(content || title || example || format || unit || filled);
  if (!hasContent) {
    return <>{children}</>;
  }

  const getAnchorElement = useCallback((): HTMLElement | null => {
    if (!containerRef.current) return null;
    // Find the most specific interactive element or content control within the tooltip wrapper
    const interactive = containerRef.current.querySelector<HTMLElement>(
      'input, select, textarea, button, a, [role="button"], [role="combobox"], [tabindex]:not([tabindex="-1"])'
    );
    if (interactive) {
      const rect = interactive.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) return interactive;
    }
    // Fallback to first child element if present with valid dimensions
    const firstChild = containerRef.current.firstElementChild as HTMLElement | null;
    if (firstChild) {
      const rect = firstChild.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) return firstChild;
    }
    return containerRef.current;
  }, []);

  const updatePosition = useCallback(() => {
    const anchorEl = getAnchorElement();
    if (!anchorEl) return;
    const rect = anchorEl.getBoundingClientRect();

    if (rect.width === 0 && rect.height === 0) {
      setIsVisible(false);
      return;
    }

    const spaceAbove = rect.top;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceLeft = rect.left;
    const spaceRight = window.innerWidth - rect.right;

    // Accurate measurement of tooltip dimensions
    const tooltipRect = tooltipRef.current?.getBoundingClientRect();
    const tooltipWidth = tooltipRect?.width && tooltipRect.width > 0 ? tooltipRect.width : 260;
    const tooltipHeight = tooltipRect?.height && tooltipRect.height > 0 ? tooltipRect.height : 40;

    // Preference: TOP (Above control) unless space above is insufficient (< tooltipHeight + 10px)
    let actualPos: 'bottom' | 'top' | 'left' | 'right' = 'top';

    if (position === 'bottom') {
      actualPos = spaceBelow >= tooltipHeight + 10 || spaceBelow >= spaceAbove ? 'bottom' : 'top';
    } else if (position === 'left') {
      actualPos = spaceLeft >= tooltipWidth + 10 || spaceLeft >= spaceRight ? 'left' : 'right';
    } else if (position === 'right') {
      actualPos = spaceRight >= tooltipWidth + 10 || spaceRight >= spaceLeft ? 'right' : 'left';
    } else {
      // Default / 'auto' / 'top': ALWAYS PREFER ABOVE
      if (spaceAbove >= tooltipHeight + 10) {
        actualPos = 'top';
      } else if (spaceBelow >= tooltipHeight + 10) {
        actualPos = 'bottom';
      } else {
        // Fallback: whichever side has more clearance
        actualPos = spaceAbove >= spaceBelow ? 'top' : 'bottom';
      }
    }

    const triggerCenterX = rect.left + rect.width / 2;
    const triggerCenterY = rect.top + rect.height / 2;

    let top = 0;
    let left = 0;
    let arrowLeft = tooltipWidth / 2;
    let arrowTop = tooltipHeight / 2;

    const margin = 8;

    if (actualPos === 'bottom' || actualPos === 'top') {
      left = triggerCenterX - tooltipWidth / 2;
      if (left < margin) left = margin;
      if (left + tooltipWidth > window.innerWidth - margin) {
        left = window.innerWidth - tooltipWidth - margin;
      }

      // Exact arrow positioning pointing directly to trigger center
      arrowLeft = Math.max(12, Math.min(triggerCenterX - left, tooltipWidth - 12));

      if (actualPos === 'top') {
        top = rect.top - tooltipHeight - 7;
      } else {
        top = rect.bottom + 7;
      }
    } else {
      top = triggerCenterY - tooltipHeight / 2;
      if (top < margin) top = margin;
      if (top + tooltipHeight > window.innerHeight - margin) {
        top = window.innerHeight - tooltipHeight - margin;
      }
      arrowTop = Math.max(10, Math.min(triggerCenterY - top, tooltipHeight - 10));

      if (actualPos === 'right') {
        left = rect.right + 7;
      } else {
        left = rect.left - tooltipWidth - 7;
      }
    }

    setCoords({
      top,
      left,
      actualPosition: actualPos,
      arrowLeft,
      arrowTop,
    });
  }, [position, getAnchorElement]);

  const showTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(true);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(false);
    }, 60);
  };

  useEffect(() => {
    if (!isVisible) return;

    updatePosition();
    const animFrame = requestAnimationFrame(updatePosition);
    const timer = setTimeout(updatePosition, 10);

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener('scroll', handleScrollOrResize, { capture: true, passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsVisible(false);
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      cancelAnimationFrame(animFrame);
      clearTimeout(timer);
      window.removeEventListener('scroll', handleScrollOrResize, { capture: true });
      window.removeEventListener('resize', handleScrollOrResize);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isVisible, updatePosition]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocusCapture={showTooltip}
      onBlurCapture={(e) => {
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
          hideTooltip();
        }
      }}
      className={`relative ${children ? 'block' : 'inline-block'} ${className}`}
    >
      {children}

      {isVisible &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={tooltipRef}
            role="tooltip"
            style={{
              position: 'fixed',
              top: `${coords?.top ?? -9999}px`,
              left: `${coords?.left ?? -9999}px`,
              zIndex: 99999,
              opacity: coords ? 1 : 0,
            }}
            className={`pointer-events-none select-none max-w-[260px] sm:max-w-[280px] px-2.5 py-1.5 bg-[#0B1E33] text-white rounded-lg shadow-xl border border-slate-700/80 text-[11px] leading-snug transition-opacity duration-150 text-left ${tooltipClassName}`}
          >
            {/* Title / Field Name Header */}
            {title && (
              <div className="font-bold text-sky-300 text-[11px] mb-0.5 whitespace-normal leading-tight">
                {title}
              </div>
            )}

            {/* DYNAMIC CONTENT SWITCH: Filled vs Empty */}
            {filled ? (
              /* FILLED / EDIT / READ-ONLY: Complete submitted value (wraps cleanly to 2 lines if long) */
              <div className="space-y-0.5 text-[11px]">
                <div className="text-[11px] leading-snug break-words">
                  <span className="font-semibold text-emerald-400 text-[11px] font-mono mr-1.5 inline-block shrink-0">
                    Value:
                  </span>
                  <span className="text-slate-100 font-medium select-text">
                    {formatValueDisplay(extractedVal)}
                  </span>
                  {unit && (
                    <span className="text-emerald-300 font-mono text-[10px] ml-1.5 inline-block shrink-0">
                      ({unit})
                    </span>
                  )}
                </div>
                {format && (
                  <div className="text-[10px] text-slate-400 font-mono pt-0.5">
                    Format: {format}
                  </div>
                )}
              </div>
            ) : (
              /* EMPTY / CREATE: Field guidance & example (medium weight, non-italic) */
              <div className="space-y-1 text-[11px]">
                {example && (
                  <div className="text-[11px] leading-snug break-words">
                    <span className="font-semibold text-sky-300 text-[11px] mr-1.5 inline-block shrink-0">
                      e.g.
                    </span>
                    <span className="text-slate-100 font-medium">{example}</span>
                  </div>
                )}
                {(format || unit) && (
                  <div className="flex items-center gap-2.5 pt-0.5 text-[10px] text-slate-300 border-t border-slate-700/60 mt-1">
                    {format && (
                      <div>
                        <span className="text-slate-400 font-semibold">Format:</span>{' '}
                        <span className="font-mono text-amber-200">{format}</span>
                      </div>
                    )}
                    {unit && (
                      <div>
                        <span className="text-slate-400 font-semibold">Unit:</span>{' '}
                        <span className="text-emerald-300 font-mono font-medium">{unit}</span>
                      </div>
                    )}
                  </div>
                )}
                {content && !example && !format && !unit && (
                  <div className="text-slate-100 font-medium text-[11px] leading-snug break-words">
                    {content}
                  </div>
                )}
                {showDescription && content && (example || format || unit) && (
                  <div className="text-slate-300 text-[11px] pt-1 border-t border-slate-700/50 mt-1 leading-snug break-words">
                    {content}
                  </div>
                )}
              </div>
            )}

            {/* Dynamic Arrow Pointer */}
            {coords && (
              <span
                style={
                  coords.actualPosition === 'bottom' || coords.actualPosition === 'top'
                    ? { left: `${coords.arrowLeft}px` }
                    : { top: `${coords.arrowTop}px` }
                }
                className={`absolute w-0 h-0 ${
                  coords.actualPosition === 'top'
                    ? 'top-full -translate-x-1/2 border-t-[#0B1E33] border-t-[6px] border-x-[5px] border-x-transparent border-b-0'
                    : coords.actualPosition === 'bottom'
                    ? 'bottom-full -translate-x-1/2 border-b-[#0B1E33] border-b-[6px] border-x-[5px] border-x-transparent border-t-0'
                    : coords.actualPosition === 'left'
                    ? 'left-full -translate-y-1/2 border-l-[#0B1E33] border-l-[6px] border-y-[5px] border-y-transparent border-r-0'
                    : 'right-full -translate-y-1/2 border-r-[#0B1E33] border-r-[6px] border-y-[5px] border-y-transparent border-l-0'
                }`}
              />
            )}
          </div>,
          document.body
        )}
    </div>
  );
};

export default FieldTooltip;
