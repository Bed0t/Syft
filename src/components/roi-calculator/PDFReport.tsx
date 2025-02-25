import { ROIMetrics, CalculatorInputs } from '../../types/roi';
import { formatCurrency } from '../../lib/utils/format';
import { Chart } from 'chart.js/auto';

interface PDFReportProps {
  metrics: ROIMetrics;
  inputs: CalculatorInputs;
}

export function generatePDFContent({ metrics, inputs }: PDFReportProps) {
  const isAgency = inputs.recruitmentType === 'Agency';
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const annualHRHours = inputs.hrTimePerHire * inputs.hiresPerYear;
  const annualRevenueLoss = inputs.revenueLostPerDay * inputs.timeToHire * inputs.hiresPerYear;
  
  const currentAnnualCost = isAgency
    ? inputs.agencyFeesPerHire * inputs.hiresPerYear
    : (inputs.internalTeam.recruiters * inputs.internalTeam.recruiterSalary) +
      (inputs.internalTeam.coordinators * inputs.internalTeam.coordinatorSalary);

  // Generate the projection chart
  const chartCanvas = document.createElement('canvas');
  chartCanvas.width = 800;
  chartCanvas.height = 200; // Reduced height
  const ctx = chartCanvas.getContext('2d');
  
  if (ctx) {
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: metrics.projectedSavings.map(d => `Year ${d.year}`),
        datasets: [
          {
            label: 'Traditional Cost',
            data: metrics.projectedSavings.map(d => d.traditional),
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            fill: true,
            tension: 0.4
          },
          {
            label: 'Syft Cost',
            data: metrics.projectedSavings.map(d => d.syft),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              padding: 10,
              font: { size: 10 }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(0,0,0,0.1)' },
            ticks: {
              callback: (value) => formatCurrency(value as number),
              font: { size: 10 }
            }
          },
          x: {
            grid: { display: false },
            ticks: { font: { size: 10 } }
          }
        }
      }
    });
  }

  return `
    <div class="pdf-container" style="
      font-family: Arial, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px 40px;
      color: #1a1a1a;
    ">
      <!-- Header -->
      <div style="display: flex; align-items: center; margin-bottom: 20px;">
        <img src="/images/logo.png" alt="Syft Logo" style="height: 30px;" />
        <div style="margin-left: 20px;">
          <h1 style="color: #1e40af; margin: 0; font-size: 24px;">ROI Analysis Report</h1>
          <p style="color: #6b7280; margin: 4px 0 0 0; font-size: 12px;">
            Generated ${currentDate}
          </p>
        </div>
      </div>

      <!-- Executive Summary -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px;">
        <div style="text-align: center; padding: 12px; background: #f8fafc; border-radius: 8px;">
          <div style="font-size: 12px; color: #6b7280;">Current Annual Cost</div>
          <div style="font-size: 18px; color: #ef4444; font-weight: bold;">${formatCurrency(metrics.traditionalCost)}</div>
        </div>
        <div style="text-align: center; padding: 12px; background: #f8fafc; border-radius: 8px;">
          <div style="font-size: 12px; color: #6b7280;">Optimized Cost</div>
          <div style="font-size: 18px; color: #16a34a; font-weight: bold;">${formatCurrency(metrics.syftCost)}</div>
        </div>
        <div style="text-align: center; padding: 12px; background: #f8fafc; border-radius: 8px;">
          <div style="font-size: 12px; color: #6b7280;">Annual Savings</div>
          <div style="font-size: 18px; color: #3b82f6; font-weight: bold;">${formatCurrency(metrics.savings)}</div>
        </div>
      </div>

      <!-- Current State & Process Analysis -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
        <div style="background: #f8fafc; border-radius: 8px; padding: 16px;">
          <h3 style="color: #1e40af; margin: 0 0 12px 0; font-size: 14px;">Current State Analysis</h3>
          <div style="color: #4b5563; font-size: 12px; line-height: 1.4;">
            ${isAgency ? `
              • Agency fees per hire: ${formatCurrency(inputs.agencyFeesPerHire)}
              • Annual hires: ${inputs.hiresPerYear}
              • Total agency spend: ${formatCurrency(inputs.agencyFeesPerHire * inputs.hiresPerYear)}
            ` : `
              • Recruiters: ${inputs.internalTeam.recruiters} (${formatCurrency(inputs.internalTeam.recruiterSalary)} each)
              • Coordinators: ${inputs.internalTeam.coordinators} (${formatCurrency(inputs.internalTeam.coordinatorSalary)} each)
              • Total team cost: ${formatCurrency(currentAnnualCost)}
            `}
            • Current time-to-hire: ${inputs.timeToHire} days
            • Annual HR hours: ${annualHRHours} hours
            • Revenue impact: ${formatCurrency(annualRevenueLoss)}
          </div>
        </div>

        <div style="background: #f8fafc; border-radius: 8px; padding: 16px;">
          <h3 style="color: #1e40af; margin: 0 0 12px 0; font-size: 14px;">Optimization Impact</h3>
          <div style="color: #4b5563; font-size: 12px; line-height: 1.4;">
            • HR time saved: ${metrics.hrHoursSaved} hours annually
            • Time-to-hire reduction: ${Math.round(metrics.timeToHireReduction)}%
            • Revenue recovered: ${formatCurrency(metrics.revenueSaved)}
            • Break-even in ${metrics.breakevenHires} hires
            • Projected 3-year savings: ${formatCurrency(metrics.projectedSavings[2].savings)}
          </div>
        </div>
      </div>

      <!-- 3-Year Projection -->
      <div style="margin-bottom: 20px;">
        <h3 style="color: #1e40af; margin: 0 0 12px 0; font-size: 14px;">3-Year Cost Projection</h3>
        <div style="background: #f8fafc; border-radius: 8px; padding: 16px;">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 16px;">
            ${metrics.projectedSavings.map(year => `
              <div style="text-align: center;">
                <div style="font-size: 12px; color: #6b7280;">Year ${year.year}</div>
                <div style="font-size: 14px; color: #16a34a; font-weight: bold;">${formatCurrency(year.savings)} saved</div>
                <div style="font-size: 10px; color: #6b7280;">
                  Traditional: ${formatCurrency(year.traditional)}<br>
                  With Syft: ${formatCurrency(year.syft)}
                </div>
              </div>
            `).join('')}
          </div>
          <div style="height: 200px;">
            <img src="${chartCanvas.toDataURL()}" style="width: 100%; height: 100%; object-fit: contain;" />
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 20px; padding-top: 12px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 10px; margin: 0;">
          www.usesyft.com | contact@usesyft.com | Transform your recruitment process with Syft
        </p>
      </div>
    </div>
  `;
} 