import { ReactNode } from 'react';
import { cn } from '../../lib/utils/cn';
import { Tooltip } from './Tooltip';
import { Undo2 } from 'lucide-react';

interface InputSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  format?: 'currency' | 'number';
  icon?: ReactNode;
  className?: string;
  tooltip?: string;
  defaultValue?: number;
}

export function InputSlider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  format = 'number',
  icon,
  className,
  tooltip,
  defaultValue
}: InputSliderProps) {
  const formatValue = (val: number) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(val);
    }
    return val.toLocaleString();
  };

  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <div className={cn("relative bg-gray-100 rounded-lg p-4", className)}>
      {/* Header with label and value */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          {icon && <span className="text-blue-600">{icon}</span>}
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {tooltip && <Tooltip content={tooltip} />}
        </div>
        <div className="flex items-center gap-2">
          {defaultValue !== undefined && (
            <button
              onClick={() => onChange(defaultValue)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="Use industry average"
            >
              <Undo2 className="w-4 h-4" />
            </button>
          )}
          <span className="text-sm font-medium text-blue-600">{formatValue(value)}</span>
        </div>
      </div>

      {/* Slider container */}
      <div className="relative pt-2 pb-8">
        {/* Track background */}
        <div className="absolute h-2 left-0 right-0 bg-gray-200 rounded-full" />
        
        {/* Filled track */}
        <div 
          className="absolute h-2 left-0 bg-blue-600 rounded-full"
          style={{ width: `${percentage}%` }}
        />

        {/* Slider input */}
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="absolute w-full h-8 -top-3 opacity-0 cursor-pointer z-20"
        />

        {/* Handle */}
        <div 
          className="absolute top-1/2 -mt-3 w-6 h-6 rounded-full bg-white border-2 border-blue-600 shadow-lg transform -translate-x-1/2 z-10 cursor-grab"
          style={{ left: `${percentage}%` }}
        />

        {/* Min/Max labels */}
        <div className="absolute w-full flex justify-between mt-6 px-0">
          <span className="text-xs text-gray-500 -translate-x-1/2">{formatValue(min)}</span>
          <span className="text-xs text-gray-500 translate-x-1/2">{formatValue(max)}</span>
        </div>
      </div>
    </div>
  );
} 