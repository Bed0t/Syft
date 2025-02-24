import { Plan } from '../../types/roi';
import { cn } from '../../lib/utils/cn';

interface PlanSelectorProps {
  plans: Record<Plan['id'], Plan>;
  selectedPlan: Plan['id'] | null;
  onSelect: (planId: Plan['id']) => void;
}

export default function PlanSelector({ plans, selectedPlan, onSelect }: PlanSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {Object.values(plans).map((plan) => (
        <button
          key={plan.id}
          onClick={() => onSelect(plan.id)}
          className={cn(
            'flex flex-col p-4 rounded-lg transition-all text-left',
            selectedPlan === plan.id
              ? 'bg-indigo-100 border-indigo-200'
              : 'bg-white border border-gray-200',
          )}
        >
          <div className="text-sm font-medium text-gray-900">{plan.name}</div>
          <div className="text-sm text-gray-600">
            ${plan.price.toLocaleString()}
            {plan.isOneTime ? ' one-time' : '/month'}
          </div>
        </button>
      ))}
    </div>
  );
} 