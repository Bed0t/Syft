import { Calculator } from '../components/roi-calculator/Calculator';
import { motion } from 'framer-motion';

export default function ROICalculator() {
  return (
    <div className="min-h-screen bg-[#1a1f37]">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-600/20 to-transparent" />
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Calculate Your Recruitment ROI
            </h1>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              See how much you could save with Syft's AI-powered recruitment platform.
              Compare traditional recruitment costs with our innovative solution.
            </p>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-gradient-to-br from-blue-500/30 to-purple-500/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-gradient-to-tr from-indigo-500/30 to-blue-500/30 rounded-full blur-3xl" />
        </div>
      </div>

      {/* Calculator Section */}
      <div className="relative z-10 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Calculator />
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-[#1a1f37]/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Why Calculate Your ROI?
            </h2>
            <p className="text-gray-300">
              Make data-driven decisions about your recruitment strategy
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6">
              <div className="text-blue-400 mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Cost Analysis</h3>
              <p className="text-gray-400">
                Get a detailed breakdown of your current recruitment costs and potential savings
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6">
              <div className="text-blue-400 mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Performance Metrics</h3>
              <p className="text-gray-400">
                Understand key metrics like time-to-hire reduction and HR hours saved
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6">
              <div className="text-blue-400 mb-4">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Future Projections</h3>
              <p className="text-gray-400">
                See your potential savings and ROI projected over multiple years
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 