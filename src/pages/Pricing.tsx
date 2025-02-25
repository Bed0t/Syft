import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Calculator, DollarSign, Clock, Users, Brain } from 'lucide-react';

const tiers = [
  {
    name: 'Essential Hire',
    price: 2990,
    type: 'one-time',
    description: 'Save over $1,700 compared to traditional internal recruitment',
    features: [
      '1 active job posting',
      'AI-powered interviews (Complete in 48 hours)',
      'Automated candidate screening',
      'No HR personnel time needed',
      'Reduce time-to-hire by 75%',
      'Basic analytics dashboard',
      'Email support',
      'Job board distribution'
    ],
    roi: '$1,700+ savings per hire',
    note: 'Perfect for: Single role hiring',
    stripe_price_id: 'price_1QpKV8Jzuhoe9LpBcqmxkjve'
  },
  {
    name: 'Growth',
    price: 3490,
    type: 'monthly',
    description: 'Replace a full-time internal recruiter ($85,000/year)',
    features: [
      'Up to 5 active job postings',
      'Potential savings of $40,000+ annually',
      'Reduce hiring time by 80%',
      'Automated screening and ranking',
      'Advanced analytics dashboard',
      'Priority support',
      'Custom interview templates'
    ],
    roi: '$7,000+ monthly savings compared to internal team',
    note: 'Perfect for: Companies hiring 5-10 roles monthly',
    stripe_price_id: 'price_1QpKmWJzuhoe9LpBmQqJQsJD',
    annual: {
      price: 33504,
      savings: 8376,
      stripe_price_id: 'price_1QpKoTJzuhoe9LpBYQRZOXFK'
    }
  },
  {
    name: 'Scale',
    price: 5990,
    type: 'monthly',
    description: 'Replace entire recruitment team ($250,000+/year)',
    features: [
      'Up to 15 active job postings',
      'Potential savings of $150,000+ annually',
      'Eliminate recruitment agency fees',
      'Full automation of screening process',
      'Custom analytics & reporting',
      'Dedicated success manager',
      'Custom integration options'
    ],
    roi: '$15,000+ monthly savings vs. traditional methods',
    note: 'Perfect for: High-volume hiring (10-20 roles monthly)',
    stripe_price_id: 'price_1QpKoxJzuhoe9LpBla9lu62G',
    annual: {
      price: 57504,
      savings: 14376,
      stripe_price_id: 'price_1QpKpUJzuhoe9LpB6skLhSY3'
    }
  },
  {
    name: 'Enterprise',
    price: 12000,
    type: 'monthly',
    description: 'Transform your entire recruitment operation',
    features: [
      'Unlimited job postings',
      'Unlimited AI interviews',
      'Replace multiple recruitment agencies',
      'Save 15-25% per hire in agency fees',
      'Reduce time-to-hire by 85%',
      'Full recruitment automation',
      'Custom AI model training',
      'White-label options',
      'API access',
      'Dedicated support team',
      'Custom development'
    ],
    roi: '$50,000+ monthly savings for large-scale hiring',
    note: 'Perfect for: Large organizations (20+ roles monthly)',
    stripe_price_id: 'price_1QpKpUJzuhoe9LpB6skLhSY3',
    custom: true,
    annualOnly: true
  }
];

const Pricing = () => {
  const [isAnnual, setIsAnnual] = useState(true);
  const [isPriceBlurred] = useState(false);
  const navigate = useNavigate();

  // Add console log to debug
  console.log('Pricing component rendering');

  const handleContactSales = (tier: any) => {
    // Redirect all users to contact page
    navigate('/contact');
  };

  const filteredTiers = tiers.filter(tier => 
    isAnnual || (!isAnnual && !tier.annualOnly)
  );

  const maxFeatures = Math.max(...filteredTiers.map(tier => tier.features.length));

  const cardVariants = {
    enter: (index: number) => ({
      x: isAnnual ? 0 : [0, -50, 0],
      opacity: 1,
      transition: {
        duration: 0.3,
        delay: index * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 25
      }
    }),
    exit: {
      x: 50,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    }
  };

  const blurStyle = {
    filter: 'blur(4px)',
    userSelect: 'none' as 'none'
  };

  return (
    <div className="min-h-screen bg-[#1a1f37]">
      <div className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f37] to-[#2a1f67] z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Save Up to 70% on Traditional Recruitment Costs
            </h1>
            <p className="mt-4 text-xl text-gray-300">
              Cut costs, reduce bias, and make data-driven hiring decisions
            </p>
          </motion.div>

          {/* Traditional Costs Comparison */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-8 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-6"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
              <div className="flex items-center space-x-3">
                <DollarSign className="h-5 w-5 text-[#4361ee]" />
                <div>
                  <p className="font-medium text-white text-sm">Internal Recruitment</p>
                  <p className="text-gray-300 text-sm">~$4,700 per hire</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Users className="h-5 w-5 text-[#4361ee]" />
                <div>
                  <p className="font-medium text-white text-sm">External Recruitment</p>
                  <p className="text-gray-300 text-sm">15-25% of salary</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-[#4361ee]" />
                <div>
                  <p className="font-medium text-white text-sm">Time-to-Hire</p>
                  <p className="text-gray-300 text-sm">40+ days</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calculator className="h-5 w-5 text-[#4361ee]" />
                <div>
                  <p className="font-medium text-white text-sm">HR Personnel</p>
                  <p className="text-gray-300 text-sm">$40-60+/hour</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Billing Toggle */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 mb-8 relative"
          >
            <div className="text-center mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-yellow-500" />
                  <span className="text-yellow-500 text-sm font-medium">
                    Pre-Launch Pricing
                  </span>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-300">
              We’re fine-tuning our platform to deliver the best experience for you.
              <br></br>
              Pricing plans are coming soon! In the meantime, every customer is paired with a dedicated account manager
              <br></br>
              to handle all your needs—think of us as your recruitment concierge. Contact us to learn more and get early access.
              </p>
            </div>

            <div className="flex justify-center">
              <div className="relative flex items-center p-1 bg-white/10 rounded-full">
                <button
                  onClick={() => setIsAnnual(false)}
                  className={`${
                    !isAnnual ? 'bg-[#4361ee] text-white' : 'text-gray-300'
                  } relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200`}
                >
                  Monthly billing
                </button>
                <button
                  onClick={() => setIsAnnual(true)}
                  className={`${
                    isAnnual ? 'bg-[#4361ee] text-white' : 'text-gray-300'
                  } relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200`}
                >
                  Annual billing
                  <span className="absolute -top-2 -right-2 px-2 py-0.5 text-xs font-semibold text-white bg-green-500 rounded-full">
                    Save 20%
                  </span>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="mt-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={isAnnual ? 'annual' : 'monthly'}
                className={`grid grid-cols-1 gap-8 ${
                  isAnnual 
                    ? 'lg:grid-cols-4' 
                    : 'lg:grid-cols-3 max-w-5xl mx-auto'
                }`}
                initial="exit"
                animate="enter"
                exit="exit"
              >
                {filteredTiers.map((tier, index) => {
                  const price = isAnnual && tier.annual
                    ? tier.annual.price / 12
                    : tier.price;

                  const paddedFeatures = [
                    ...tier.features,
                    ...Array(maxFeatures - tier.features.length).fill('')
                  ];

                  const isScale = tier.name === 'Scale';

                  return (
                    <motion.div
                      key={tier.name}
                      custom={index}
                      variants={cardVariants}
                      className={`relative bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl hover:border-[#4361ee] hover:shadow-lg transition-all duration-200 flex flex-col ${
                        isScale ? 'border-[#4361ee] shadow-md' : ''
                      }`}
                    >
                      {isScale && (
                        <div className="absolute -top-5 inset-x-0 flex justify-center">
                          <span className="inline-flex rounded-full bg-[#4361ee] px-4 py-1 text-sm font-semibold text-white">
                            Most Popular
                          </span>
                        </div>
                      )}
                      <div className="flex-1 p-8">
                        <h3 className="text-xl font-semibold text-white">{tier.name}</h3>
                        <p className="mt-4 h-12 text-sm text-gray-300">{tier.description}</p>
                        <div className="mt-8">
                          <div style={isPriceBlurred ? blurStyle : {}}>
                            <span className="text-4xl font-bold tracking-tight text-white blur-md select-none">
                              ${Math.round(price).toLocaleString()}
                            </span>
                            <span className="text-base font-medium text-gray-300">
                              /{tier.type === 'monthly' ? 'mo' : 'project'}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-6 text-sm font-medium text-[#4361ee]">
                          ROI: {tier.roi}
                        </div>

                        <ul className="mt-8 space-y-2 min-h-[400px]">
                          {paddedFeatures.map((feature, index) => (
                            <li
                              key={index}
                              className={`flex items-start ${!feature ? 'invisible' : ''} h-10`}
                            >
                              <Check
                                className={`h-5 w-5 shrink-0 mt-0.5 ${isScale ? 'text-[#4361ee]' : 'text-gray-400'}`}
                              />
                              <span className="ml-3 text-sm text-gray-300 leading-tight">
                                {feature || 'placeholder'}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-8 pt-0">
                        <button
                          onClick={() => handleContactSales(tier)}
                          className={`block w-full text-center py-3 px-4 rounded-xl font-medium transition-colors ${
                            isScale
                              ? 'bg-[#4361ee] text-white hover:bg-[#3651d4]'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          {tier.custom ? 'Contact Sales' : 'Contact Sales'}
                        </button>
                        {tier.note && (
                          <p className="mt-4 text-xs text-center text-gray-300">{tier.note}</p>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Cost Savings Breakdown */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 p-8"
          >
            <h3 className="text-lg font-semibold text-white mb-6">
              Cost Savings Breakdown (Per Hire)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-medium text-white mb-4">Traditional Recruitment Costs:</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-300">Agency/Advertising Fees:</span>
                    <span className="font-medium text-white">$15,000</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-300">HR Time (40 hours @ $80/hr):</span>
                    <span className="font-medium text-white">$3,200</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-300">Job Board & Sourcing Fees:</span>
                    <span className="font-medium text-white">$1,200</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-300">Onboarding & Training:</span>
                    <span className="font-medium text-white">$3,600</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-300">Time-to-Hire:</span>
                    <span className="font-medium text-white">40+ days</span>
                  </li>
                  <li className="flex justify-between border-t border-white/10 pt-2 mt-2">
                    <span className="font-medium text-white">Total Traditional Cost:</span>
                    <span className="font-medium text-white">$23,000/hire</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-white mb-4">Syft Cost:</h4>
                <ul className="space-y-2">
                  <li className="flex justify-between">
                    <span className="text-gray-300">Essential Hire Package:</span>
                    <span className="font-medium text-white">$2,990</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-300">AI-Powered Interviews & Screening:</span>
                    <span className="font-medium text-white">Included</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-300">HR Time Saved:</span>
                    <span className="font-medium text-white">35+ hours</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-300">Time-to-Hire:</span>
                    <span className="font-medium text-white">5-7 days</span>
                  </li>
                  <li className="flex justify-between border-t border-white/10 pt-2 mt-2">
                    <span className="font-medium text-white">Total Syft Cost:</span>
                    <span className="font-medium text-white">$2,990/hire</span>
                  </li>
                  <li className="flex justify-between text-[#4361ee] font-medium">
                    <span>Total Savings:</span>
                    <span>$20,010/hire (87% reduction)</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Additional Value */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            <div className="bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 p-6">
              <h3 className="text-lg font-medium text-white mb-4">Additional Value</h3>
              <ul className="space-y-3">
                {[
                  'Cut to the chase, Reduce bias in hiring!',
                  'Commission hungry recruiters!',
                  'Consistent evaluation',
                  'Precise data-driven decisions',
                  'Scalable process',
                  'Compliance documentation',
                  '24/7 operation'
                ].map((value, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-[#4361ee]" />
                    <span className="ml-3 text-sm text-gray-300">{value}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 p-6">
              <h3 className="text-lg font-medium text-white mb-4">Annual Commitment Benefits</h3>
              <ul className="space-y-3">
                {[
                  '20% discount on all plans',
                  'Additional AI interviews',
                  'Premium support',
                  'Custom integrations',
                  'ROI reporting'
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-[#4361ee]" />
                    <span className="ml-3 text-sm text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 p-6">
              <h3 className="text-lg font-medium text-white mb-4">Enterprise Value Adds</h3>
              <ul className="space-y-3">
                {[
                  'Custom AI model training',
                  'White-label options',
                  'API access',
                  'Dedicated support',
                  'Custom development'
                ].map((value, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="h-5 w-5 text-[#4361ee]" />
                    <span className="ml-3 text-sm text-gray-300">{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-16 text-center"
          >
            <h3 className="text-2xl font-semibold text-white">
              Ready to transform your hiring process?
            </h3>
            <p className="mt-4 text-gray-300 max-w-2xl mx-auto">
              Contact us for custom ROI calculation, volume pricing,
              multi-year agreements, or integration planning.
            </p>
            <Link
              to="/contact"
              className="mt-8 inline-flex items-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-[#4361ee] hover:bg-[#3651d4] transition-colors"
            >
              Contact Sales
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
