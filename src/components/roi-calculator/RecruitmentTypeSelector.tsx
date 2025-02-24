import { RecruitmentType } from '../../types/roi';
import { Building2, Users } from 'lucide-react';

interface RecruitmentTypeSelectorProps {
  value: RecruitmentType | null;
  onChange: (type: RecruitmentType) => void;
}

export function RecruitmentTypeSelector({ value, onChange }: RecruitmentTypeSelectorProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      <button
        onClick={() => onChange('Agency')}
        className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all ${
          value === 'Agency'
            ? 'bg-blue-50 border-2 border-blue-600 text-blue-600 shadow-md'
            : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-200 hover:bg-blue-50/50'
        }`}
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
          <Building2 className="w-6 h-6 text-blue-600" />
        </div>
        <div className="text-left">
          <div className="font-medium text-lg">I use an external Recruitment Agency to hire</div>
          <div className="text-sm text-gray-500 mt-1">Best for companies that primarily use recruitment agencies</div>
        </div>
      </button>

      <button
        onClick={() => onChange('Internal')}
        className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all ${
          value === 'Internal'
            ? 'bg-blue-50 border-2 border-blue-600 text-blue-600 shadow-md'
            : 'bg-white border border-gray-200 text-gray-600 hover:border-blue-200 hover:bg-blue-50/50'
        }`}
      >
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-100">
          <Users className="w-6 h-6 text-blue-600" />
        </div>
        <div className="text-left">
          <div className="font-medium text-lg">I have an Internal Hiring Team</div>
          <div className="text-sm text-gray-500 mt-1">Best for companies with in-house recruiters and coordinators</div>
        </div>
      </button>
    </div>
  );
} 