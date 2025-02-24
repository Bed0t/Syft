import { CalculatorInputs, PlanType } from '../../types/roi';

interface PlanRecommendationProps {
  inputs: CalculatorInputs;
  onSelectPlan: (plan: PlanType) => void;
}

export function PlanRecommendation({ inputs, onSelectPlan }: PlanRecommendationProps) {
  const getRecommendedPlan = (): { plan: PlanType; reasons: string[] } => {
    const monthlyHires = inputs.hiresPerYear / 12;

    if (inputs.recruitmentType === 'Agency') {
      if (monthlyHires <= 1) {
        return {
          plan: 'Essential',
          reasons: [
            '1 active job posting',
            'Save up to $1,700 per hire',
            'Perfect for low hiring volume (0-1/month)'
          ]
        };
      }
      if (monthlyHires <= 10) {
        return {
          plan: 'Growth',
          reasons: [
            'Up to 5 active job postings',
            'Save up to $2,500 per hire',
            'Ideal for growing teams (2-10 hires/month)'
          ]
        };
      }
      if (monthlyHires <= 20) {
        return {
          plan: 'Scale',
          reasons: [
            'Up to 15 active job postings',
            'Save up to $3,500 per hire',
            'Perfect for high-volume hiring (11-20 hires/month)'
          ]
        };
      }
      return {
        plan: 'Enterprise',
        reasons: [
          'Unlimited job postings',
          'Custom savings per hire',
          'Enterprise-grade support and features'
        ]
      };
    } else {
      // For internal teams, base recommendation on team size
      const teamSize = inputs.internalTeam.recruiters + inputs.internalTeam.coordinators;
      if (teamSize <= 2) {
        return {
          plan: 'Growth',
          reasons: [
            'Perfect for small internal teams',
            'Up to 5 active job postings',
            'Comprehensive ATS features'
          ]
        };
      }
      if (teamSize <= 5) {
        return {
          plan: 'Scale',
          reasons: [
            'Ideal for medium-sized recruitment teams',
            'Up to 15 active job postings',
            'Advanced workflow automation'
          ]
        };
      }
      return {
        plan: 'Enterprise',
        reasons: [
          'Built for large recruitment operations',
          'Unlimited job postings',
          'Custom integrations and features'
        ]
      };
    }
  };

  const recommendation = getRecommendedPlan();

  return (
    <div className="bg-blue-50 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Recommended Plan
      </h3>
      <div className="text-xl font-bold text-indigo-600 mb-4">
        {recommendation.plan}
      </div>
      <div className="text-sm text-gray-600 mb-4">
        Why this plan?
      </div>
      <ul className="space-y-2">
        {recommendation.reasons.map((reason, index) => (
          <li key={index} className="flex items-center text-sm text-gray-600">
            <svg
              className="h-4 w-4 text-indigo-500 mr-2 shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            {reason}
          </li>
        ))}
      </ul>
      <button
        onClick={() => onSelectPlan(recommendation.plan)}
        className="mt-6 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
      >
        Select {recommendation.plan} Plan
      </button>
    </div>
  );
} 