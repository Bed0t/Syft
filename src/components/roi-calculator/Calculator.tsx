import { useState, useEffect } from 'react';
import { Calculator as CalculatorIcon, DollarSign, Users, Clock, BriefcaseIcon, MessageCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DEFAULT_METRICS, DEFAULT_INTERNAL_TEAM } from '../../lib/constants/roi';
import { calculateROI } from '../../lib/utils/roi';
import { CalculatorInputs, ROIMetrics, RecruitmentType } from '../../types/roi';
import { InputSlider } from './InputSlider';
import MetricsDisplay from './MetricsDisplay';
import ROIChart from './ROIChart';
import { PlanRecommendation } from './PlanRecommendation';
import { LeadCaptureDialog } from './LeadCaptureDialog';
import { RecruitmentTypeSelector } from './RecruitmentTypeSelector';
import YearSlider from './YearSlider';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { cn } from '../../lib/utils';
import { TOOLTIPS, DEFAULT_VALUES } from '../../lib/constants/tooltips';

export function Calculator() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [paymentType, setPaymentType] = useState<'Monthly' | 'Annual'>('Monthly');
  const [hasInteracted, setHasInteracted] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
    4: false
  });
  const [inputs, setInputs] = useState<CalculatorInputs>({
    recruitmentType: null as unknown as RecruitmentType,
    hiresPerYear: 0,
    timeToHire: 0,
    hrTimePerHire: 0,
    hrHourlyRate: 0,
    totalCostPerHire: 0,
    agencyFeesPerHire: 0,
    revenueLostPerDay: 0,
    internalTeam: {
      recruiters: 0,
      recruiterSalary: 0,
      coordinators: 0,
      coordinatorSalary: 0
    },
    yearsToProject: 3
  });

  const [metrics, setMetrics] = useState<ROIMetrics | null>(null);

  const handleInputChange = (key: keyof CalculatorInputs, value: number | RecruitmentType) => {
    if (key === 'recruitmentType') {
      const type = value as RecruitmentType;
      setInputs({
        ...inputs,
        recruitmentType: type,
        hiresPerYear: 0,
        timeToHire: 0,
        hrTimePerHire: 0,
        hrHourlyRate: 0,
        totalCostPerHire: 0,
        agencyFeesPerHire: 0,
        revenueLostPerDay: 0,
        internalTeam: {
          recruiters: 0,
          recruiterSalary: 0,
          coordinators: 0,
          coordinatorSalary: 0
        }
      });
      setHasInteracted({ 
        1: true,
        2: false,
        3: false,
        4: false
      });
      setCurrentStep(2);
      setShowResults(false);
      setMetrics(null);
    } else {
      const numericValue = typeof value === 'number' ? Math.max(0, value) : value;
      setInputs({ ...inputs, [key]: numericValue });
      
      if (typeof value === 'number' && value > 0) {
        if (currentStep === 2) setHasInteracted(prev => ({ ...prev, 2: true }));
        if (currentStep === 3) setHasInteracted(prev => ({ ...prev, 3: true }));
        if (currentStep === 4) setHasInteracted(prev => ({ ...prev, 4: true }));
      }
    }
  };

  const handleInternalTeamChange = (key: keyof typeof DEFAULT_INTERNAL_TEAM, value: number) => {
    const safeValue = Math.max(0, value);
    const newInputs = {
      ...inputs,
      internalTeam: {
        ...inputs.internalTeam,
        [key]: safeValue
      }
    };
    setInputs(newInputs);
    if (safeValue > 0) {
      setHasInteracted(prev => ({ ...prev, 2: true }));
    }
  };

  const calculateResults = () => {
    setIsCalculating(true);
    setTimeout(() => {
      const results = calculateROI(inputs, paymentType);
      setMetrics(results);
      setIsCalculating(false);
      setShowResults(true);
    }, 1500);
  };

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const isStepComplete = (step: number): boolean => {
    if (!hasInteracted[step]) return false;
    
    switch (step) {
      case 1:
        return inputs.recruitmentType !== null;
      case 2:
        if (inputs.recruitmentType === 'Agency') {
          return inputs.agencyFeesPerHire > 0;
        }
        return inputs.internalTeam.recruiters > 0;
      case 3:
        if (inputs.recruitmentType === 'Agency') {
          return inputs.hiresPerYear > 0 && 
                 inputs.hrTimePerHire > 0 && 
                 inputs.hrHourlyRate > 0;
        }
        return inputs.hiresPerYear > 0 && 
               inputs.hrTimePerHire > 0 && 
               inputs.totalCostPerHire > 0;
      case 4:
        return inputs.timeToHire > 0 && 
               inputs.revenueLostPerDay > 0;
      default:
        return false;
    }
  };

  const getStepStatus = (step: number) => {
    if (currentStep > step) return 'complete';
    if (currentStep === step) return 'current';
    if (currentStep < step) return 'upcoming';
    return 'upcoming';
  };

  const handleLeadCapture = async (email: string) => {
    console.log('Lead captured:', email);
    
    const element = document.getElementById('roi-calculator');
    if (element) {
      const canvas = await html2canvas(element);
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('syft-roi-analysis.pdf');
    }
  };

  if (isCalculating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-lg font-medium text-gray-900">Calculating your ROI...</p>
            <p className="text-sm text-gray-500 mt-2">This will only take a moment</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="roi-calculator" className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center">
          <motion.div 
            className="w-full max-w-2xl"
            layout="position"
            transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
          >
            <div className="grid grid-cols-1 gap-8">
              <motion.div
                layout="position"
                className={`${showResults ? 'lg:col-span-1' : 'lg:col-span-2'}`}
              >
                {!showResults ? (
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
                      <h2 className="text-xl font-semibold text-white">Current Hiring Metrics</h2>
                    </div>

                    <div className="p-6">
                      <div className="flex justify-between relative h-8 mb-8">
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2" />
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={cn(
                              "relative flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-all",
                              getStepStatus(step) === 'complete' && "bg-green-600 text-white",
                              getStepStatus(step) === 'current' && "bg-blue-600 text-white",
                              getStepStatus(step) === 'upcoming' && "bg-gray-200 text-gray-400"
                            )}
                          >
                            {getStepStatus(step) === 'complete' ? (
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            ) : (
                              step
                            )}
                          </div>
                        ))}
                      </div>

                      <AnimatePresence mode="popLayout">
                        {/* Step 1 */}
                        {currentStep === 1 && (
                          <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="min-h-[120px]"
                          >
                            <h3 className="text-sm font-medium text-gray-500 mb-4">Step 1: Select Recruitment Type</h3>
                            <RecruitmentTypeSelector
                              value={inputs.recruitmentType}
                              onChange={(type) => handleInputChange('recruitmentType', type)}
                            />
                            {inputs.recruitmentType && currentStep === 1 && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4"
                              >
                                <button
                                  onClick={handleNextStep}
                                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                                >
                                  Next Step
                                  <ArrowRight className="w-4 h-4" />
                                </button>
                              </motion.div>
                            )}
                          </motion.div>
                        )}

                        {/* Step 2 */}
                        {currentStep === 2 && (
                          <motion.div
                            key="step2"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6">
                              <h3 className="text-sm font-medium text-gray-200 mb-4">
                                Step 2: {inputs.recruitmentType === 'Agency' ? 'Agency Recruitment Details' : 'Internal Team Structure'}
                              </h3>
                              {inputs.recruitmentType === 'Agency' ? (
                                <div className="space-y-6">
                                  <InputSlider
                                    label="Agency Fees per Hire"
                                    value={inputs.agencyFeesPerHire}
                                    onChange={(value) => handleInputChange('agencyFeesPerHire', value)}
                                    min={5000}
                                    max={50000}
                                    step={1000}
                                    format="currency"
                                    icon={<DollarSign className="w-4 h-4" />}
                                    tooltip={TOOLTIPS.agencyFees}
                                    defaultValue={DEFAULT_VALUES.agencyFeesPerHire}
                                  />
                                </div>
                              ) : (
                                <div className="space-y-6">
                                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                                    <h4 className="text-sm font-medium text-gray-900 mb-4">Recruitment Team</h4>
                                    <div className="space-y-6">
                                      <InputSlider
                                        label="Number of Recruiters"
                                        value={inputs.internalTeam.recruiters}
                                        onChange={(value) => handleInternalTeamChange('recruiters', value)}
                                        min={1}
                                        max={10}
                                        step={1}
                                        icon={<Users className="w-4 h-4" />}
                                        tooltip={TOOLTIPS.recruiters}
                                      />
                                      <InputSlider
                                        label="Average Recruiter Salary"
                                        value={inputs.internalTeam.recruiterSalary}
                                        onChange={(value) => handleInternalTeamChange('recruiterSalary', value)}
                                        min={50000}
                                        max={150000}
                                        step={5000}
                                        format="currency"
                                        icon={<DollarSign className="w-4 h-4" />}
                                        tooltip={TOOLTIPS.recruiterSalary}
                                        defaultValue={DEFAULT_VALUES.recruiterSalary}
                                      />
                                    </div>
                                  </div>

                                  <div className="bg-white rounded-xl p-6 border border-gray-100">
                                    <h4 className="text-sm font-medium text-gray-900 mb-4">Support Team</h4>
                                    <div className="space-y-6">
                                      <InputSlider
                                        label="Number of Coordinators"
                                        value={inputs.internalTeam.coordinators}
                                        onChange={(value) => handleInternalTeamChange('coordinators', value)}
                                        min={0}
                                        max={10}
                                        step={1}
                                        icon={<Users className="w-4 h-4" />}
                                        tooltip={TOOLTIPS.coordinators}
                                      />
                                      <InputSlider
                                        label="Average Coordinator Salary"
                                        value={inputs.internalTeam.coordinatorSalary}
                                        onChange={(value) => handleInternalTeamChange('coordinatorSalary', value)}
                                        min={30000}
                                        max={80000}
                                        step={5000}
                                        format="currency"
                                        icon={<DollarSign className="w-4 h-4" />}
                                        tooltip={TOOLTIPS.coordinatorSalary}
                                        defaultValue={DEFAULT_VALUES.coordinatorSalary}
                                      />
                                    </div>
                                  </div>
                                </div>
                              )}
                              {currentStep === 2 && isStepComplete(2) && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-4"
                                >
                                  <button
                                    onClick={handleNextStep}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                                  >
                                    Next Step
                                    <ArrowRight className="w-4 h-4" />
                                  </button>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        )}

                        {/* Step 3 */}
                        {currentStep === 3 && (
                          <motion.div
                            key="step3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6">
                              <h3 className="text-sm font-medium text-gray-200 mb-4">Step 3: Hiring Metrics</h3>
                              <div className="space-y-6">
                                <InputSlider
                                  label="Number of Hires per Year"
                                  value={inputs.hiresPerYear}
                                  onChange={(value) => handleInputChange('hiresPerYear', value)}
                                  min={1}
                                  max={100}
                                  step={1}
                                  icon={<Users className="w-4 h-4" />}
                                  tooltip={TOOLTIPS.hiresPerYear}
                                  defaultValue={DEFAULT_VALUES.hiresPerYear}
                                />
                                <InputSlider
                                  label="HR Time per Hire (hours)"
                                  value={inputs.hrTimePerHire}
                                  onChange={(value) => handleInputChange('hrTimePerHire', value)}
                                  min={1}
                                  max={40}
                                  step={1}
                                  icon={<Clock className="w-4 h-4" />}
                                  tooltip={TOOLTIPS.hrTimePerHire}
                                  defaultValue={DEFAULT_VALUES.hrTimePerHire}
                                />
                                {inputs.recruitmentType === 'Agency' ? (
                                  <InputSlider
                                    label="HR Hourly Rate"
                                    value={inputs.hrHourlyRate}
                                    onChange={(value) => handleInputChange('hrHourlyRate', value)}
                                    min={20}
                                    max={100}
                                    step={5}
                                    format="currency"
                                    icon={<DollarSign className="w-4 h-4" />}
                                    tooltip={TOOLTIPS.hrHourlyRate}
                                    defaultValue={DEFAULT_VALUES.hrHourlyRate}
                                  />
                                ) : (
                                  <InputSlider
                                    label="Total Cost per Hire"
                                    value={inputs.totalCostPerHire}
                                    onChange={(value) => handleInputChange('totalCostPerHire', value)}
                                    min={2000}
                                    max={6000}
                                    step={100}
                                    format="currency"
                                    icon={<DollarSign className="w-4 h-4" />}
                                    tooltip={TOOLTIPS.totalCostPerHire}
                                    defaultValue={DEFAULT_VALUES.totalCostPerHire}
                                  />
                                )}
                              </div>
                              {currentStep === 3 && isStepComplete(3) && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-4"
                                >
                                  <button
                                    onClick={handleNextStep}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                                  >
                                    Next Step
                                    <ArrowRight className="w-4 h-4" />
                                  </button>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        )}

                        {/* Step 4 */}
                        {currentStep === 4 && (
                          <motion.div
                            key="step4"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6">
                              <h3 className="text-sm font-medium text-gray-200 mb-4">Step 4: Time & Revenue Impact</h3>
                              <div className="space-y-6">
                                <div className="bg-blue-900/50 backdrop-blur-sm rounded-xl p-4 mb-6">
                                  <div className="flex items-start gap-3">
                                    <div className="text-blue-400">
                                      <MessageCircle className="w-5 h-5" />
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-medium text-blue-200">Why This Matters</h4>
                                      <p className="text-sm text-blue-400 mt-1">
                                        Time-to-hire and revenue impact are crucial metrics that directly affect your bottom line. 
                                        Faster hiring not only reduces costs but also minimizes lost revenue from vacant positions.
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                <InputSlider
                                  label="Current Time-to-Hire (days)"
                                  value={inputs.timeToHire}
                                  onChange={(value) => handleInputChange('timeToHire', value)}
                                  min={1}
                                  max={90}
                                  step={1}
                                  icon={<Clock className="w-4 h-4" />}
                                  tooltip={TOOLTIPS.timeToHire}
                                  defaultValue={DEFAULT_VALUES.timeToHire}
                                />

                                <div className="relative">
                                  <InputSlider
                                    label="Revenue Lost per Vacant Position/Day"
                                    value={inputs.revenueLostPerDay}
                                    onChange={(value) => handleInputChange('revenueLostPerDay', value)}
                                    min={0}
                                    max={2000}
                                    step={50}
                                    format="currency"
                                    icon={<DollarSign className="w-4 h-4" />}
                                    tooltip={TOOLTIPS.revenueLostPerDay}
                                    defaultValue={DEFAULT_VALUES.revenueLostPerDay}
                                  />
                                  
                                  <div className="mt-2 text-sm text-gray-100 italic">
                                    Estimated annual revenue impact: 
                                    <span className="font-medium text-red-600">
                                      {' '}${(inputs.revenueLostPerDay * inputs.timeToHire * inputs.hiresPerYear).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {currentStep === 4 && isStepComplete(4) && !showResults && (
                                <motion.div
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  className="mt-6"
                                >
                                  <button
                                    onClick={calculateResults}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                                  >
                                    Calculate ROI
                                    <ArrowRight className="w-4 h-4" />
                                  </button>
                                  <p className="text-center text-sm text-gray-200 mt-2">
                                    We'll analyze your data and provide a detailed breakdown of potential savings.
                                  </p>
                                </motion.div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="fixed inset-0 bg-[#1a1f37] z-50 overflow-hidden"
                  >
                    <div className="h-full flex flex-col">
                      {/* Header */}
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                          <div className="flex justify-between items-center">
                            <div>
                              <h2 className="text-2xl font-bold text-white">Your ROI Analysis</h2>
                              <p className="text-sm text-blue-100 mt-1">Based on your recruitment data</p>
                            </div>
                            <button
                              onClick={() => {
                                setShowResults(false);
                                setCurrentStep(1);
                                setMetrics(null);
                              }}
                              className="text-white hover:text-blue-100 transition-colors"
                            >
                              Start Over
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 overflow-auto">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                          <div className="grid grid-cols-12 gap-6">
                            {/* Left column - Key Metrics */}
                            <div className="col-span-12 lg:col-span-8 space-y-6">
                              {/* Time & Efficiency Gains */}
                              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
                                <h3 className="text-xl font-semibold text-white mb-6">Potential Efficiency Gains</h3>
                                <div className="grid grid-cols-2 gap-6">
                                  <div>
                                    <div className="text-sm text-gray-400">Time-to-Hire Reduction</div>
                                    <div className="text-2xl font-bold text-green-400">
                                      {Math.round(metrics?.timeToHireReduction || 0)}% Faster
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                      {inputs.timeToHire} days → {Math.round(inputs.timeToHire * (1 - (metrics?.timeToHireReduction || 0) / 100))} days
                                    </div>
                                  </div>
                                  <div>
                                    <div className="text-sm text-gray-400">HR Hours Saved Annually</div>
                                    <div className="text-2xl font-bold text-green-400">
                                      {Math.round(metrics?.hrHoursSaved || 0)} Hours
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                      Per hire: {inputs.hrTimePerHire} → {Math.round(inputs.hrTimePerHire * 0.4)} hours
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* ROI Preview */}
                              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
                                <div className="flex items-center justify-between mb-6">
                                  <h3 className="text-xl font-semibold text-white">Estimated ROI Impact</h3>
                                  <div className="text-sm text-gray-400">
                                    Based on {inputs.hiresPerYear} hires/year
                                  </div>
                                </div>
                                <div className="relative">
                                  <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-10">
                                    <div className="text-center max-w-md">
                                      <p className="text-lg font-semibold text-white mb-2">
                                        Unlock Your Full ROI Analysis
                                      </p>
                                      <p className="text-sm text-gray-300">
                                        Get a detailed breakdown of your potential savings and optimization opportunities
                                      </p>
                                    </div>
                                  </div>
                                  <div className="h-[200px] bg-gray-800/30 rounded-lg" />
                                </div>
                              </div>

                              {/* Trust Indicators */}
                              <div className="grid grid-cols-3 gap-4">
                                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 text-center">
                                  <div className="text-2xl font-bold text-white mb-1">500+</div>
                                  <div className="text-sm text-gray-400">Companies Using Syft</div>
                                </div>
                                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 text-center">
                                  <div className="text-2xl font-bold text-white mb-1">70%</div>
                                  <div className="text-sm text-gray-400">Average Cost Reduction</div>
                                </div>
                                <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 text-center">
                                  <div className="text-2xl font-bold text-white mb-1">60%</div>
                                  <div className="text-sm text-gray-400">Faster Time-to-Hire</div>
                                </div>
                              </div>
                            </div>

                            {/* Right column - CTA */}
                            <div className="col-span-12 lg:col-span-4 space-y-6">
                              <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6">
                                <h3 className="text-lg font-semibold text-white mb-4">
                                  Your Full Report Includes:
                                </h3>
                                <ul className="space-y-3 mb-6">
                                  <li className="flex items-center gap-2 text-sm text-gray-300">
                                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Complete Cost Analysis
                                  </li>
                                  <li className="flex items-center gap-2 text-sm text-gray-300">
                                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    3-Year ROI Projection
                                  </li>
                                  <li className="flex items-center gap-2 text-sm text-gray-300">
                                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Optimization Recommendations
                                  </li>
                                  <li className="flex items-center gap-2 text-sm text-gray-300">
                                    <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Industry Benchmarks
                                  </li>
                                </ul>
                                
                                <div className="space-y-4">
                                  <LeadCaptureDialog 
                                    metrics={metrics!} 
                                    inputs={inputs}
                                    onCaptureLead={handleLeadCapture} 
                                  />
                                  <button
                                    onClick={() => window.open('https://www.usesyft.com/', '_blank')}
                                    className="w-full px-6 py-3 rounded-xl bg-gray-800 border border-blue-400 text-blue-400 hover:bg-gray-700 transition-all"
                                  >
                                    Book a Demo
                                  </button>
                                </div>
                              </div>

                              <div className="text-center text-sm text-gray-400">
                                * Calculations based on industry benchmarks and your provided data
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 