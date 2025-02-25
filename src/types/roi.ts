export type PlanType = 'Essential' | 'Growth' | 'Scale' | 'Enterprise';
export type PaymentType = 'Monthly' | 'Annual';
export type RecruitmentType = 'Agency' | 'Internal';

export interface Plan {
  id: PlanType;
  name: string;
  price: number;
  isOneTime: boolean;
  features: string[];
}

export interface RecruitmentMetrics {
  agencyFeesPerHire: number;
  hiresPerYear: number;
  hrTimePerHire: number;
  hrHourlyRate: number;
  interviewCost: number;
  timeToHire: number;
  revenueLostPerDay: number;
}

export interface InternalTeam {
  recruiters: number;
  recruiterSalary: number;
  coordinators: number;
  coordinatorSalary: number;
}

export interface CalculatorInputs {
  hiresPerYear: number;
  recruitmentType: RecruitmentType;
  agencyFeesPerHire: number;
  internalTeam: InternalTeam;
  hrHourlyRate: number;
  interviewCost: number;
  hrTimePerHire: number;
  timeToHire: number;
  revenueLostPerDay: number;
  yearsToProject: number;
}

export interface ROIMetrics {
  traditionalCost: number;
  syftCost: number;
  savings: number;
  hrHoursSaved: number;
  timeToHireReduction: number;
  breakevenHires: number;
  revenueSaved: number;
  projectedSavings: {
    year: number;
    traditional: number;
    syft: number;
    savings: number;
  }[];
}

export interface CalculatorState {
  selectedPlan: Plan['id'] | null;
  recruitmentType: RecruitmentType;
  metrics: RecruitmentMetrics;
  internalTeam: InternalTeam;
  yearsToProject: number;
} 