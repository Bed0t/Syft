import { RecruitmentMetrics, RecruitmentType, InternalTeam } from '../../types/roi';
import { cn } from '../../lib/utils/cn';

interface InputMetricsProps {
  metrics: RecruitmentMetrics;
  internalTeam: InternalTeam;
  recruitmentType: RecruitmentType;
  onMetricsChange: (metrics: Partial<RecruitmentMetrics>) => void;
  onInternalTeamChange: (team: Partial<InternalTeam>) => void;
}

interface InputFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  min?: number;
  max?: number;
  step?: number;
}

function InputField({
  label,
  value,
  onChange,
  prefix,
  suffix,
  min = 0,
  max = 1000000,
  step = 1
}: InputFieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="relative rounded-md shadow-sm">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{prefix}</span>
          </div>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className={cn(
            'block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm',
            prefix && 'pl-7',
            suffix && 'pr-12'
          )}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{suffix}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function InputMetrics({
  metrics,
  internalTeam,
  recruitmentType,
  onMetricsChange,
  onInternalTeamChange
}: InputMetricsProps) {
  return (
    <div className="space-y-6">
      {recruitmentType === 'agency' && (
        <InputField
          label="Agency Fees per Hire"
          value={metrics.agencyFeesPerHire}
          onChange={(value) => onMetricsChange({ agencyFeesPerHire: value })}
          prefix="$"
        />
      )}

      {recruitmentType === 'internal' && (
        <div className="space-y-4">
          <InputField
            label="Number of Recruiters"
            value={internalTeam.recruiters}
            onChange={(value) => onInternalTeamChange({ recruiters: value })}
            min={0}
            max={100}
          />
          <InputField
            label="Number of Coordinators"
            value={internalTeam.coordinators}
            onChange={(value) => onInternalTeamChange({ coordinators: value })}
            min={0}
            max={100}
          />
          <InputField
            label="Average Annual Salary"
            value={internalTeam.avgSalary}
            onChange={(value) => onInternalTeamChange({ avgSalary: value })}
            prefix="$"
          />
        </div>
      )}

      <div className="space-y-4">
        <InputField
          label="Number of Hires per Year"
          value={metrics.hiresPerYear}
          onChange={(value) => onMetricsChange({ hiresPerYear: value })}
          min={1}
        />

        <InputField
          label="HR Time per Hire"
          value={metrics.hrTimePerHire}
          onChange={(value) => onMetricsChange({ hrTimePerHire: value })}
          suffix="hours"
        />

        <InputField
          label="HR Hourly Rate"
          value={metrics.hrHourlyRate}
          onChange={(value) => onMetricsChange({ hrHourlyRate: value })}
          prefix="$"
          suffix="/hr"
        />

        <InputField
          label="Current Time-to-Hire"
          value={metrics.timeToHire}
          onChange={(value) => onMetricsChange({ timeToHire: value })}
          suffix="days"
        />

        <InputField
          label="Revenue Lost per Vacant Position/Day"
          value={metrics.revenueLostPerDay}
          onChange={(value) => onMetricsChange({ revenueLostPerDay: value })}
          prefix="$"
          suffix="/day"
        />
      </div>
    </div>
  );
} 