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
  chartCanvas.height = 400;
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
            fill: true
          },
          {
            label: 'Syft Cost',
            data: metrics.projectedSavings.map(d => d.syft),
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => formatCurrency(value as number)
            }
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
      padding: 20px;
      color: #1a1a1a;
    ">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 20px; position: relative;">
        <div style="position: absolute; top: 0; left: 0; width: 100%; height: 80px; background: linear-gradient(135deg, #1e40af, #3b82f6); opacity: 0.1; border-radius: 12px;"></div>
        <img src="/images/logo.png" alt="Syft Logo" style="height: 40px; margin-bottom: 10px;" />
        <h1 style="color: #1e40af; margin: 0; font-size: 28px; font-weight: 800;">ROI Analysis Report</h1>
        <p style="color: #6b7280; margin: 5px 0 0 0; font-size: 14px;">
          Prepared for Your Company | ${currentDate}
        </p>
      </div>

      <!-- Executive Summary -->
      <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin-bottom: 20px;">
        <h2 style="color: #1e40af; margin: 0 0 10px 0; font-size: 20px;">Executive Summary</h2>
        <p style="color: #4b5563; margin: 0; font-size: 14px; line-height: 1.5;">
          Based on your current ${isAgency ? 'agency recruitment' : 'internal recruitment team'} metrics and industry benchmarks, 
          we've identified significant opportunities for optimization and cost reduction in your hiring process. Our analysis shows 
          potential annual savings of ${formatCurrency(metrics.savings)} through improved efficiency and reduced time-to-hire.
        </p>
      </div>

      <!-- Current State Assessment -->
      <div style="margin-bottom: 20px;">
        <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px;">Current State Assessment</h2>
        ${isAgency ? `
          <div style="background: #f8fafc; border-radius: 12px; padding: 20px;">
            <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 16px;">Agency Recruitment Analysis</h3>
            <ul style="color: #4b5563; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.5;">
              <li>Current agency fees per hire: ${formatCurrency(inputs.agencyFeesPerHire)}</li>
              <li>Annual hires: ${inputs.hiresPerYear}</li>
              <li>Total annual agency spend: ${formatCurrency(inputs.agencyFeesPerHire * inputs.hiresPerYear)}</li>
            </ul>
          </div>
        ` : `
          <div style="background: #f8fafc; border-radius: 12px; padding: 20px;">
            <h3 style="color: #1e40af; margin: 0 0 10px 0; font-size: 16px;">Internal Team Structure</h3>
            <ul style="color: #4b5563; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.5;">
              <li>Recruiters: ${inputs.internalTeam.recruiters} (${formatCurrency(inputs.internalTeam.recruiterSalary)} each)</li>
              <li>Coordinators: ${inputs.internalTeam.coordinators} (${formatCurrency(inputs.internalTeam.coordinatorSalary)} each)</li>
              <li>Total team cost: ${formatCurrency(currentAnnualCost)}</li>
            </ul>
          </div>
        `}
      </div>

      <!-- Process Analysis -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
        <div style="background: #f8fafc; border-radius: 12px; padding: 20px;">
          <h3 style="color: #ef4444; margin: 0 0 10px 0; font-size: 16px;">Process Inefficiencies</h3>
          <ul style="color: #4b5563; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.5;">
            <li>Annual HR hours spent: ${annualHRHours} hours</li>
            <li>Current time-to-hire: ${inputs.timeToHire} days</li>
            <li>Revenue impact: ${formatCurrency(annualRevenueLoss)} lost annually</li>
          </ul>
        </div>

        <div style="background: #f8fafc; border-radius: 12px; padding: 20px;">
          <h3 style="color: #16a34a; margin: 0 0 10px 0; font-size: 16px;">Optimization Potential</h3>
          <ul style="color: #4b5563; margin: 0; padding-left: 20px; font-size: 14px; line-height: 1.5;">
            <li>HR time saved: ${metrics.hrHoursSaved} hours annually</li>
            <li>Time-to-hire reduction: ${Math.round(metrics.timeToHireReduction)}%</li>
            <li>Revenue recovered: ${formatCurrency(metrics.revenueSaved)}</li>
          </ul>
        </div>
      </div>

      <!-- Cost Analysis -->
      <div style="margin-bottom: 20px;">
        <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px;">Cost Analysis</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
          <div style="background: #f8fafc; border-radius: 12px; padding: 20px;">
            <h3 style="color: #ef4444; margin: 0 0 15px 0; font-size: 16px;">Current Costs</h3>
            <div style="color: #4b5563; font-size: 14px; line-height: 1.5;">
              <div style="display: flex; justify-content: between; margin-bottom: 10px;">
                <span>Total Annual Cost:</span>
                <span style="font-weight: 600; color: #ef4444;">${formatCurrency(metrics.traditionalCost)}</span>
              </div>
              <div style="display: flex; justify-content: between; margin-bottom: 10px;">
                <span>Cost per Hire:</span>
                <span style="font-weight: 600; color: #ef4444;">${formatCurrency(metrics.traditionalCost / inputs.hiresPerYear)}</span>
              </div>
            </div>
          </div>

          <div style="background: #f8fafc; border-radius: 12px; padding: 20px;">
            <h3 style="color: #16a34a; margin: 0 0 15px 0; font-size: 16px;">With Syft</h3>
            <div style="color: #4b5563; font-size: 14px; line-height: 1.5;">
              <div style="display: flex; justify-content: between; margin-bottom: 10px;">
                <span>Total Annual Cost:</span>
                <span style="font-weight: 600; color: #16a34a;">${formatCurrency(metrics.syftCost)}</span>
              </div>
              <div style="display: flex; justify-content: between; margin-bottom: 10px;">
                <span>Cost per Hire:</span>
                <span style="font-weight: 600; color: #16a34a;">${formatCurrency(metrics.syftCost / inputs.hiresPerYear)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3-Year Projection -->
      <div style="margin-bottom: 20px;">
        <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px;">3-Year Cost Projection</h2>
        <div style="background: white; border-radius: 12px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <img src="${chartCanvas.toDataURL()}" style="width: 100%; height: auto;" />
          <div style="margin-top: 15px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
            ${metrics.projectedSavings.map(year => `
              <div style="text-align: center; padding: 15px; background: #f8fafc; border-radius: 8px;">
                <div style="font-size: 14px; color: #6b7280;">Year ${year.year}</div>
                <div style="font-size: 18px; color: #16a34a; font-weight: bold; margin: 5px 0;">
                  ${formatCurrency(year.savings)} saved
                </div>
                <div style="font-size: 12px; color: #6b7280;">
                  Traditional: ${formatCurrency(year.traditional)}<br>
                  With Syft: ${formatCurrency(year.syft)}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Industry Insights -->
      <div style="margin-bottom: 20px;">
        <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px;">Industry Insights</h2>
        <div style="background: #f8fafc; border-radius: 12px; padding: 20px;">
          <p style="color: #4b5563; margin: 0 0 10px 0; font-size: 14px; line-height: 1.5;">
            According to recent data, the average HR time per hire is around 40 hours across various industries, though this can vary significantly
            depending on the role complexity and company size. The average revenue loss per vacant position per day ranges from $100 to
            $500 depending on the industry and the position's impact on operations.
          </p>
          <p style="color: #4b5563; margin: 0; font-size: 14px; line-height: 1.5;">
            In Australia, a junior HR or recruitment assistant can expect to earn between $60,000 and $70,000 per year, with platforms like
            SEEK and Glassdoor indicating a typical salary around $63,500 for a Human Resources Assistant.
          </p>
        </div>
      </div>

      <!-- Call to Action -->
      <div style="background: #1e40af; color: white; border-radius: 12px; padding: 20px; text-align: center;">
        <h2 style="color: white; margin: 0 0 10px 0; font-size: 20px;">Ready to Transform Your Recruitment Process?</h2>
        <p style="margin: 0; font-size: 14px; line-height: 1.5;">
          Visit www.usesyft.com or contact us at contact@usesyft.com to learn how we can help optimize your recruitment costs.
        </p>
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <img src="/images/logo.png" alt="Syft Logo" style="height: 30px; margin-bottom: 10px;" />
        <p style="color: #6b7280; font-size: 12px; margin: 0;">
          www.usesyft.com | contact@usesyft.com<br>
          Transform your recruitment process with Syft
        </p>
      </div>
    </div>
  `;
} 