import { useState, useRef, useEffect } from 'react';
import { Info } from 'lucide-react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export function Tooltip({ content, position = 'top' }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isVisible && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

      let top = rect.top + scrollTop;
      let left = rect.left + scrollLeft;

      // Adjust position based on the tooltip position prop
      switch (position) {
        case 'top':
          top -= 390; // Increased offset for better spacing
          left += rect.width / 2;
          break;
        case 'bottom':
          top += rect.height + 80; // Increased offset for better spacing
          left += rect.width / 2;
          break;
        case 'left':
          top += rect.height / 2;
          left -= 40; // Consistent spacing
          break;
        case 'right':
          top += rect.height / 2;
          left += rect.width + 40; // Consistent spacing
          break;
      }

      setTooltipPosition({ top, left });
    }
  }, [isVisible, position]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="text-gray-400 hover:text-gray-500 focus:outline-none relative"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
      >
        <Info className="w-4 h-4" />
      </button>

      {isVisible && createPortal(
        <div 
          className="fixed z-[9999]"
          style={{
            top: `${tooltipPosition.top}px`,
            left: `${tooltipPosition.left}px`,
            pointerEvents: 'auto'
          }}
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}
        >
          <div className="bg-gray-900 text-white text-sm rounded-lg py-2 px-4 max-w-sm shadow-lg transform -translate-x-1/2">
            <div className="relative">
              {content}
              <div 
                className={`absolute w-2 h-2 bg-gray-900 transform rotate-45
                  ${position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' : ''}
                  ${position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' : ''}
                  ${position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' : ''}
                  ${position === 'right' ? 'left-[-4px] top-1/2 -translate-y-1/2' : ''}`}
              />
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
} 