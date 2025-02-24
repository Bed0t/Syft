interface YearSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function YearSlider({ value, onChange }: YearSliderProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">Years to Project ROI</span>
        <span className="text-sm text-gray-500">Year {value}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={1}
          max={5}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
        />
        <div className="absolute -bottom-4 left-0 right-0 flex justify-between px-1">
          <span className="text-xs text-gray-500">1</span>
          <span className="text-xs text-gray-500">2</span>
          <span className="text-xs text-gray-500">3</span>
          <span className="text-xs text-gray-500">4</span>
          <span className="text-xs text-gray-500">5</span>
        </div>
      </div>
    </div>
  );
} 