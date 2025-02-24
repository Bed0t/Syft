import { ROIMetrics, CalculatorInputs } from '../../types/roi';
import { formatCurrency } from '../../lib/utils/format';

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

  return `
    <div class="pdf-container" style="
      font-family: Arial, sans-serif;
      max-width: 595px;
      margin: 0 auto;
      padding: 16px;
      font-size: 10px;
      line-height: 1.2;
    ">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 16px;">
        <h1 style="color: #1e40af; margin: 0; font-size: 22px;">Recruitment ROI Analysis</h1>
        <p style="color: #6b7280; margin: 4px 0 0 0; font-size: 10px;">
          Prepared by Syft | ${currentDate}<br>
          www.usesyft.com | contact@usesyft.com
        </p>
      </div>

      <!-- Executive Summary -->
      <div style="background: #f8fafc; border-radius: 8px; padding: 12px; margin-bottom: 12px;">
        <h2 style="color: #1e40af; margin: 0 0 6px 0; font-size: 14px;">Executive Summary</h2>
        <p style="color: #4b5563; margin: 0 0 8px 0; font-size: 10px; line-height: 1.3;">
          Based on your current ${isAgency ? 'agency recruitment' : 'internal recruitment team'} metrics and industry benchmarks, 
          we've identified significant opportunities for optimization and cost reduction in your hiring process.
        </p>
        
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
          <div style="text-align: center;">
            <div style="font-size: 9px; color: #6b7280;">Current Annual Cost</div>
            <div style="font-size: 14px; color: #ef4444; font-weight: bold;">${formatCurrency(metrics.traditionalCost)}</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 9px; color: #6b7280;">Cost with Syft</div>
            <div style="font-size: 14px; color: #22c55e; font-weight: bold;">${formatCurrency(metrics.syftCost)}</div>
          </div>
          <div style="text-align: center;">
            <div style="font-size: 9px; color: #6b7280;">Annual Savings</div>
            <div style="font-size: 14px; color: #3b82f6; font-weight: bold;">${formatCurrency(metrics.savings)}</div>
          </div>
        </div>
      </div>

      <!-- Current State Assessment -->
      <div style="margin-bottom: 12px;">
        <h2 style="color: #1e40af; margin: 0 0 6px 0; font-size: 14px;">Current State Assessment</h2>
        ${isAgency ? `
          <div style="background: #f8fafc; border-radius: 8px; padding: 12px;">
            <h3 style="color: #1e40af; margin: 0 0 6px 0; font-size: 12px;">Agency Recruitment Analysis</h3>
            <ul style="color: #4b5563; margin: 0; padding-left: 16px; font-size: 10px; line-height: 1.3;">
              <li>Current agency fees per hire: ${formatCurrency(inputs.agencyFeesPerHire)}</li>
              <li>Annual hires: ${inputs.hiresPerYear}</li>
              <li>Total annual agency spend: ${formatCurrency(inputs.agencyFeesPerHire * inputs.hiresPerYear)}</li>
            </ul>
          </div>
        ` : `
          <div style="background: #f8fafc; border-radius: 8px; padding: 12px;">
            <h3 style="color: #1e40af; margin: 0 0 6px 0; font-size: 12px;">Internal Team Structure</h3>
            <ul style="color: #4b5563; margin: 0; padding-left: 16px; font-size: 10px; line-height: 1.3;">
              <li>Recruiters: ${inputs.internalTeam.recruiters} (${formatCurrency(inputs.internalTeam.recruiterSalary)} each)</li>
              <li>Coordinators: ${inputs.internalTeam.coordinators} (${formatCurrency(inputs.internalTeam.coordinatorSalary)} each)</li>
              <li>Total team cost: ${formatCurrency(
                inputs.internalTeam.recruiters * inputs.internalTeam.recruiterSalary +
                inputs.internalTeam.coordinators * inputs.internalTeam.coordinatorSalary
              )}</li>
            </ul>
          </div>
        `}
      </div>

      <!-- Process Inefficiencies & Optimization -->
      <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-bottom: 12px;">
        <div style="background: #f8fafc; border-radius: 8px; padding: 12px;">
          <h3 style="color: #1e40af; margin: 0 0 6px 0; font-size: 12px;">Process Inefficiencies</h3>
          <ul style="color: #4b5563; margin: 0; padding-left: 16px; font-size: 10px; line-height: 1.3;">
            <li>Annual HR hours spent: ${annualHRHours} hours</li>
            <li>Current time-to-hire: ${inputs.timeToHire} days</li>
            <li>Revenue impact: ${formatCurrency(annualRevenueLoss)} lost annually</li>
          </ul>
        </div>
        
        <div style="background: #f8fafc; border-radius: 8px; padding: 12px;">
          <h3 style="color: #1e40af; margin: 0 0 6px 0; font-size: 12px;">Optimization Potential</h3>
          <ul style="color: #4b5563; margin: 0; padding-left: 16px; font-size: 10px; line-height: 1.3;">
            <li>HR time saved: ${metrics.hrHoursSaved} hours annually</li>
            <li>Time-to-hire reduction: ${Math.round(metrics.timeToHireReduction)}%</li>
            <li>Revenue recovered: ${formatCurrency(metrics.revenueSaved)}</li>
          </ul>
        </div>
      </div>

      <!-- 3-Year Projection -->
      <div style="margin-bottom: 12px;">
        <h2 style="color: #1e40af; margin: 0 0 6px 0; font-size: 14px;">3-Year Projection</h2>
        <div style="background: #f8fafc; border-radius: 8px; padding: 12px;">
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
            ${metrics.projectedSavings.map(year => `
              <div style="text-align: center;">
                <div style="font-size: 9px; color: #6b7280;">Year ${year.year}</div>
                <div style="font-size: 12px; color: #22c55e; font-weight: bold;">${formatCurrency(year.savings)} saved</div>
                <div style="font-size: 9px; color: #6b7280; line-height: 1.3;">
                  Traditional: ${formatCurrency(year.traditional)}<br>
                  With Syft: ${formatCurrency(year.syft)}
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Industry Insights -->
      <div style="margin-bottom: 12px;">
        <h2 style="color: #1e40af; margin: 0 0 6px 0; font-size: 14px;">Industry Insights</h2>
        <div style="background: #f8fafc; border-radius: 8px; padding: 12px;">
          <p style="color: #4b5563; margin: 0 0 6px 0; font-size: 10px; line-height: 1.3;">
            According to recent data, the average HR time per hire is around 40 hours across various industries, though this can vary significantly
            depending on the role complexity and company size. The average revenue loss per vacant position per day ranges from $100 to
            $500 depending on the industry and the position's impact on operations.
          </p>
          <p style="color: #4b5563; margin: 0; font-size: 10px; line-height: 1.3;">
            In Australia, a junior HR or recruitment assistant can expect to earn between $60,000 and $70,000 per year, with platforms like
            SEEK and Glassdoor indicating a typical salary around $63,500 for a Human Resources Assistant.
          </p>
        </div>
      </div>

      <!-- Call to Action -->
      <div style="background: #1e40af; color: white; border-radius: 8px; padding: 12px; text-align: center;">
        <h2 style="color: white; margin: 0 0 4px 0; font-size: 14px;">Ready to Transform Your Recruitment Process?</h2>
        <p style="margin: 0; font-size: 10px;">
          Visit www.usesyft.com or contact us at contact@usesyft.com to learn how we can help optimize your recruitment costs.
        </p>
      </div>
    </div>
  `;
} 