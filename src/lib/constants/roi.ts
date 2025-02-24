import { Plan } from '../../types/roi';

export const PLANS: Record<Plan['id'], Plan> = {
  essential: {
    id: 'Essential',
    name: 'Essential',
    price: 2990,
    isOneTime: true,
    features: [
      '1 active job posting',
      'Save up to $1,700 per hire',
      'Perfect for low hiring volume (0-1/month)'
    ]
  },
  growth: {
    id: 'Growth',
    name: 'Growth',
    price: 3490,
    isOneTime: false,
    features: [
      'Up to 5 active job postings',
      'Save up to $2,500 per hire',
      'Ideal for growing teams (2-10 hires/month)'
    ]
  },
  scale: {
    id: 'Scale',
    name: 'Scale',
    price: 5990,
    isOneTime: false,
    features: [
      'Up to 15 active job postings',
      'Save up to $3,500 per hire',
      'Perfect for high-volume hiring (11-20 hires/month)'
    ]
  },
  enterprise: {
    id: 'Enterprise',
    name: 'Enterprise',
    price: 12000,
    isOneTime: false,
    features: [
      'Unlimited job postings',
      'Custom savings per hire',
      'Enterprise-grade support and features'
    ]
  }
};

export const ANNUAL_DISCOUNT = 0.2; // 20% discount for annual plans

export const DEFAULT_METRICS = {
  agencyFeesPerHire: 15000,
  hiresPerYear: 10,
  hrTimePerHire: 30,
  hrHourlyRate: 50,
  timeToHire: 30,
  revenueLostPerDay: 500
};

export const DEFAULT_INTERNAL_TEAM = {
  recruiters: 1,
  recruiterSalary: 85000,
  coordinators: 1,
  coordinatorSalary: 45000
};

export const SYFT_TIME_TO_HIRE = 15; // Average time to hire with Syft in days

export const PRESET_SCENARIOS = {
  techStartup: {
    recruitmentType: 'Agency' as const,
    metrics: {
      agencyFeesPerHire: 25000,
      hiresPerYear: 24,
      hrTimePerHire: 35,
      hrHourlyRate: 60,
      timeToHire: 45,
      revenueLostPerDay: 800
    }
  },
  retail: {
    recruitmentType: 'Agency' as const,
    metrics: {
      agencyFeesPerHire: 12000,
      hiresPerYear: 48,
      hrTimePerHire: 25,
      hrHourlyRate: 45,
      timeToHire: 35,
      revenueLostPerDay: 600
    }
  },
  enterprise: {
    recruitmentType: 'Internal' as const,
    internalTeam: {
      recruiters: 3,
      recruiterSalary: 95000,
      coordinators: 2,
      coordinatorSalary: 55000
    },
    metrics: {
      hiresPerYear: 120,
      hrTimePerHire: 25,
      hrHourlyRate: 55,
      timeToHire: 40,
      revenueLostPerDay: 1000
    }
  }
}; 