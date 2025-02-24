import { ROIMetrics } from '../../types/roi';
import { DollarSign, Clock, Users, TrendingUp } from 'lucide-react';

interface MetricsDisplayProps {
  metrics: ROIMetrics;
}

export default function MetricsDisplay({ metrics }: MetricsDisplayProps) {
  return (
    <div className="bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl shadow-lg p-6 text-white">
      <h2 className="text-2xl font-bold mb-6">ROI Summary</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-indigo-200" />
            <h3 className="text-sm font-medium text-indigo-200">Annual Savings</h3>
          </div>
          <div className="mt-1 flex items-baseline">
            <span className="text-4xl font-bold">
              ${Math.max(0, metrics.savings).toLocaleString()}
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-200" />
            <h3 className="text-sm font-medium text-indigo-200">HR Hours Saved</h3>
          </div>
          <div className="mt-1 flex items-baseline">
            <span className="text-4xl font-bold">
              {Math.round(metrics.hrHoursSaved).toLocaleString()}
            </span>
            <span className="ml-1 text-xl text-indigo-200">hrs/year</span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-200" />
            <h3 className="text-sm font-medium text-indigo-200">Time-to-Hire Reduction</h3>
          </div>
          <div className="mt-1 flex items-baseline">
            <span className="text-4xl font-bold">
              {Math.max(0, Math.round(metrics.timeToHireReduction))}%
            </span>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-200" />
            <h3 className="text-sm font-medium text-indigo-200">Breakeven in</h3>
          </div>
          <div className="mt-1 flex items-baseline">
            <span className="text-4xl font-bold">
              {metrics.breakevenHires === Infinity ? '∞' : metrics.breakevenHires}
            </span>
            <span className="ml-1 text-xl text-indigo-200">hires</span>
          </div>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-white/10 rounded-lg p-4">
          <h3 className="text-sm font-medium text-indigo-200">Traditional Cost</h3>
          <div className="mt-1">
            <span className="text-2xl font-bold">
              ${metrics.traditionalCost.toLocaleString()}
            </span>
          </div>
        </div>

        <div className="bg-white/10 rounded-lg p-4">
          <h3 className="text-sm font-medium text-indigo-200">Syft Cost</h3>
          <div className="mt-1">
            <span className="text-2xl font-bold">
              ${metrics.syftCost.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 bg-white/10 rounded-lg p-4">
        <h3 className="text-sm font-medium text-indigo-200">Revenue Recovered by Faster Hiring</h3>
        <div className="mt-1">
          <span className="text-2xl font-bold">
            ${metrics.revenueSaved.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
} 