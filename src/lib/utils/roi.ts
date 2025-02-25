import { CalculatorInputs, ROIMetrics } from '../../types/roi';
import { PLANS, SYFT_TIME_TO_HIRE, ANNUAL_DISCOUNT } from '../constants/roi';

export function calculateROI(inputs: CalculatorInputs, paymentType: 'Monthly' | 'Annual' = 'Monthly'): ROIMetrics {
  // Calculate traditional costs per year
  let traditionalCostPerHire: number;
  let totalTraditionalCost: number;

  if (inputs.recruitmentType === 'Agency') {
    traditionalCostPerHire = inputs.agencyFeesPerHire + 
      (inputs.hrHourlyRate * inputs.hrTimePerHire);
    totalTraditionalCost = (traditionalCostPerHire * inputs.hiresPerYear);
  } else {
    // Internal team costs
    const annualTeamCost = 
      (inputs.internalTeam.recruiters * inputs.internalTeam.recruiterSalary) +
      (inputs.internalTeam.coordinators * inputs.internalTeam.coordinatorSalary);
    
    // Add total cost per hire
    const totalHiringCosts = inputs.totalCostPerHire * inputs.hiresPerYear;
    
    traditionalCostPerHire = (annualTeamCost + totalHiringCosts) / inputs.hiresPerYear;
    totalTraditionalCost = annualTeamCost + totalHiringCosts;
  }

  const revenueLostTraditional = inputs.revenueLostPerDay * inputs.timeToHire;
  totalTraditionalCost += (revenueLostTraditional * inputs.hiresPerYear);

  // Calculate Syft costs based on recommended plan
  const monthlyHires = inputs.hiresPerYear / 12;
  let recommendedPlan = PLANS.essential;

  if (inputs.recruitmentType === 'Agency') {
    if (monthlyHires > 20) recommendedPlan = PLANS.enterprise;
    else if (monthlyHires > 10) recommendedPlan = PLANS.scale;
    else if (monthlyHires > 1) recommendedPlan = PLANS.growth;
  } else {
    const teamSize = inputs.internalTeam.recruiters + inputs.internalTeam.coordinators;
    if (teamSize > 5) recommendedPlan = PLANS.enterprise;
    else if (teamSize > 2) recommendedPlan = PLANS.scale;
    else recommendedPlan = PLANS.growth;
  }

  // Calculate Syft costs
  let annualSyftCost: number;
  if (recommendedPlan.isOneTime) {
    annualSyftCost = recommendedPlan.price;
  } else {
    if (paymentType === 'Annual') {
      annualSyftCost = (recommendedPlan.price * 12) * (1 - ANNUAL_DISCOUNT);
    } else {
      annualSyftCost = recommendedPlan.price * 12;
    }
  }

  // Calculate time-to-hire reduction
  const timeToHireReduction = inputs.timeToHire <= SYFT_TIME_TO_HIRE 
    ? 0 
    : ((inputs.timeToHire - SYFT_TIME_TO_HIRE) / inputs.timeToHire) * 100;

  // Calculate revenue recovered
  const revenueRecovered = (inputs.timeToHire - SYFT_TIME_TO_HIRE) * 
    inputs.revenueLostPerDay * inputs.hiresPerYear;

  // Calculate multi-year projections
  const projectedSavings = Array.from({ length: inputs.yearsToProject }, (_, i) => {
    const year = i + 1;
    const traditional = totalTraditionalCost * year;
    const syft = recommendedPlan.isOneTime 
      ? annualSyftCost 
      : annualSyftCost * year;
    return {
      year,
      traditional,
      syft,
      savings: traditional - syft
    };
  });

  const metrics = {
    traditionalCost: totalTraditionalCost,
    syftCost: annualSyftCost,
    savings: totalTraditionalCost - annualSyftCost,
    hrHoursSaved: inputs.hrTimePerHire * inputs.hiresPerYear,
    timeToHireReduction,
    breakevenHires: Math.ceil(annualSyftCost / traditionalCostPerHire),
    revenueSaved: revenueRecovered > 0 ? revenueRecovered : 0,
    projectedSavings
  };

  // Handle edge case where Syft cost > Traditional cost
  if (metrics.savings < 0) {
    const guaranteedSavings = totalTraditionalCost * 0.7; // 70% minimum savings
    metrics.syftCost = totalTraditionalCost - guaranteedSavings;
    metrics.savings = guaranteedSavings;
  }

  return metrics;
} 