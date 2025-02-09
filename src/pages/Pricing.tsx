<<<<<<< HEAD
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
      'Job board distribution',
    ],
    roi: '$1,700+ savings per hire',
    note: 'Perfect for: Single role hiring',
    stripe_price_id: 'price_1QpKV8Jzuhoe9LpBcqmxkjve',
  },
  {
    name: 'Growth',
    price: 3490,
    type: 'monthly',
    description: 'Replace a full-time internal recruiter ($85,000/year)',
    features: [
      'Up to 5 active job postings',
      '75 AI-powered interviews per job',
      'Potential savings of $40,000+ annually',
      'Reduce hiring time by 80%',
      'Automated screening and ranking',
      'Advanced analytics dashboard',
      'Priority support',
      'Custom interview templates',
    ],
    roi: '$7,000+ monthly savings compared to internal team',
    note: 'Perfect for: Companies hiring 5-10 roles monthly',
    stripe_price_id: 'price_1QpKmWJzuhoe9LpBmQqJQsJD',
    annual: {
      price: 33504,
      savings: 8376,
      stripe_price_id: 'price_1QpKoTJzuhoe9LpBYQRZOXFK',
    },
  },
  {
    name: 'Scale',
    price: 5990,
    type: 'monthly',
    description: 'Replace entire recruitment team ($250,000+/year)',
    features: [
      'Up to 15 active job postings',
      '200 AI-powered interviews per job',
      'Potential savings of $150,000+ annually',
      'Eliminate recruitment agency fees',
      'Full automation of screening process',
      'Custom analytics & reporting',
      'Dedicated success manager',
      'Custom integration options',
    ],
    roi: '$15,000+ monthly savings vs. traditional methods',
    note: 'Perfect for: High-volume hiring (10-20 roles monthly)',
    stripe_price_id: 'price_1QpKoxJzuhoe9LpBla9lu62G',
    annual: {
      price: 57504,
      savings: 14376,
      stripe_price_id: 'price_1QpKpUJzuhoe9LpB6skLhSY3',
    },
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
      'Custom development',
    ],
    roi: '$50,000+ monthly savings for large-scale hiring',
    note: 'Perfect for: Large organizations (20+ roles monthly)',
    stripe_price_id: 'price_1QpKpUJzuhoe9LpB6skLhSY3',
    custom: true,
    annualOnly: true,
=======
import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const tiers = [
  {
    name: 'Starter',
    price: 99,
    description: 'Perfect for small businesses starting their hiring journey.',
    features: [
      'Up to 5 active job postings',
      '50 AI-powered interviews per month',
      'Basic analytics dashboard',
      'Email support',
      'Job board integrations',
    ],
  },
  {
    name: 'Professional',
    price: 199,
    description: 'Ideal for growing companies with regular hiring needs.',
    features: [
      'Up to 15 active job postings',
      '200 AI-powered interviews per month',
      'Advanced analytics and reporting',
      'Priority email & phone support',
      'Custom interview templates',
      'API access',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'For large organizations with complex hiring requirements.',
    features: [
      'Unlimited job postings',
      'Unlimited AI-powered interviews',
      'Custom analytics and reporting',
      '24/7 dedicated support',
      'Custom integration options',
      'Dedicated account manager',
      'Custom AI model training',
    ],
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
  },
];

const Pricing = () => {
<<<<<<< HEAD
  const [isAnnual, setIsAnnual] = useState(true);
  const navigate = useNavigate();

  const handleGetStarted = (tier: any) => {
    const planData = {
      name: tier.name,
      price: isAnnual && tier.annual ? tier.annual.price / 12 : tier.price,
      interval: isAnnual ? 'year' : tier.type,
      features: tier.features,
      stripe_price_id: isAnnual && tier.annual ? tier.annual.stripe_price_id : tier.stripe_price_id,
    };

    if (tier.custom) {
      navigate('/contact');
    } else {
      navigate('/signup', { state: { selectedPlan: planData } });
    }
  };

  const filteredTiers = tiers.filter((tier) => isAnnual || (!isAnnual && !tier.annualOnly));

  const maxFeatures = Math.max(...filteredTiers.map((tier) => tier.features.length));

  const cardVariants = {
    enter: (index: number) => ({
      x: isAnnual ? 0 : [0, -50, 0],
      opacity: 1,
      transition: {
        duration: 0.3,
        delay: index * 0.1,
        type: 'spring',
        stiffness: 300,
        damping: 25,
      },
    }),
    exit: {
      x: 50,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Save Up to 70% on Traditional Recruitment Costs
          </h1>
          <p className="mt-4 text-xl text-gray-600">
            Cut costs, reduce bias, and make data-driven hiring decisions
          </p>
        </div>

        {/* Traditional Costs Comparison */}
        <div className="mt-12 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h3 className="mb-6 text-lg font-semibold text-gray-900">
            Traditional Recruitment Costs in Australia
          </h3>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-start">
              <DollarSign className="mt-1 h-6 w-6 text-indigo-600" />
              <div className="ml-3">
                <p className="font-medium">Internal Recruitment</p>
                <p className="text-gray-600">~$4,700 per hire</p>
              </div>
            </div>
            <div className="flex items-start">
              <Users className="mt-1 h-6 w-6 text-indigo-600" />
              <div className="ml-3">
                <p className="font-medium">External Recruitment</p>
                <p className="text-gray-600">15-25% of annual salary</p>
              </div>
            </div>
            <div className="flex items-start">
              <Clock className="mt-1 h-6 w-6 text-indigo-600" />
              <div className="ml-3">
                <p className="font-medium">Average Time-to-Hire</p>
                <p className="text-gray-600">40+ days</p>
              </div>
            </div>
            <div className="flex items-start">
              <Calculator className="mt-1 h-6 w-6 text-indigo-600" />
              <div className="ml-3">
                <p className="font-medium">HR Personnel Costs</p>
                <p className="text-gray-600">$40-60+/hour</p>
              </div>
            </div>
          </div>
        </div>

        {/* Billing Toggle */}
        <div className="mt-12 flex justify-center">
          <div className="relative flex items-center rounded-full bg-gray-100 p-1">
            <button
              onClick={() => setIsAnnual(false)}
              className={`${
                !isAnnual ? 'bg-white shadow-sm' : ''
              } relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200`}
            >
              Monthly billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`${
                isAnnual ? 'bg-white shadow-sm' : ''
              } relative rounded-full px-4 py-2 text-sm font-medium transition-all duration-200`}
            >
              Annual billing
              <span className="absolute -right-2 -top-2 rounded-full bg-green-500 px-2 py-0.5 text-xs font-semibold text-white">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="mt-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={isAnnual ? 'annual' : 'monthly'}
              className={`grid grid-cols-1 gap-8 ${
                isAnnual ? 'lg:grid-cols-4' : 'mx-auto max-w-5xl lg:grid-cols-3'
              }`}
              initial="exit"
              animate="enter"
              exit="exit"
            >
              {filteredTiers.map((tier, index) => {
                const price = isAnnual && tier.annual ? tier.annual.price / 12 : tier.price;

                const paddedFeatures = [
                  ...tier.features,
                  ...Array(maxFeatures - tier.features.length).fill(''),
                ];

                const isScale = tier.name === 'Scale';

                return (
                  <motion.div
                    key={tier.name}
                    custom={index}
                    variants={cardVariants}
                    className={`relative flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:border-indigo-600 hover:shadow-lg ${
                      isScale ? 'border-indigo-600 shadow-md' : ''
                    }`}
                  >
                    {isScale && (
                      <div className="absolute inset-x-0 -top-5 flex justify-center">
                        <span className="inline-flex rounded-full bg-indigo-600 px-4 py-1 text-sm font-semibold text-white">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <div className="flex-1 p-8">
                      <h3 className="text-xl font-semibold text-gray-900">{tier.name}</h3>
                      <p className="mt-4 h-12 text-sm text-gray-500">{tier.description}</p>
                      <p className="mt-8">
                        <span className="text-4xl font-bold tracking-tight text-gray-900">
                          ${Math.round(price).toLocaleString()}
                        </span>
                        <span className="text-base font-medium text-gray-500">
                          /{tier.type === 'monthly' ? 'mo' : 'project'}
                        </span>
                      </p>
                      {tier.annual && isAnnual && (
                        <p className="mt-2 text-sm text-green-600">
                          Save ${tier.annual.savings.toLocaleString()} annually
                        </p>
                      )}

                      <div className="mt-6 text-sm font-medium text-indigo-600">
                        ROI: {tier.roi}
                      </div>

                      <ul className="mt-8 space-y-4">
                        {paddedFeatures.map((feature, index) => (
                          <li
                            key={index}
                            className={`flex items-start ${!feature ? 'invisible' : ''}`}
                          >
                            <Check
                              className={`h-5 w-5 shrink-0 ${isScale ? 'text-indigo-600' : 'text-gray-400'}`}
                            />
                            <span className="ml-3 text-sm text-gray-600">
                              {feature || 'placeholder'}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-8 pt-0">
                      <button
                        onClick={() => handleGetStarted(tier)}
                        className={`block w-full rounded-xl px-4 py-3 text-center font-medium transition-colors ${
                          isScale
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        {tier.custom ? 'Contact Sales' : 'Get Started'}
                      </button>
                      {tier.note && (
                        <p className="mt-4 text-center text-xs text-gray-500">{tier.note}</p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Cost Savings Breakdown */}
        <div className="mt-16 rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h3 className="mb-6 text-lg font-semibold text-gray-900">
            Cost Savings Breakdown (Per Hire)
          </h3>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <div>
              <h4 className="mb-4 font-medium text-gray-900">Traditional Costs:</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Internal Recruitment:</span>
                  <span className="font-medium">$4,700</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">HR Time (20 hours @ $60/hr):</span>
                  <span className="font-medium">$1,200</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Job Board Fees:</span>
                  <span className="font-medium">$500</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Screening Time (15 hours @ $60/hr):</span>
                  <span className="font-medium">$900</span>
                </li>
                <li className="mt-2 flex justify-between border-t pt-2">
                  <span className="font-medium">Total Traditional Cost:</span>
                  <span className="font-medium">$7,300/hire</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-4 font-medium text-gray-900">Syft Cost:</h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Essential Hire ($149.50/interview):</span>
                  <span className="font-medium">$2,990</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Automated Screening:</span>
                  <span className="font-medium">$0</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">HR Time Saved:</span>
                  <span className="font-medium">35+ hours</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Time-to-Hire:</span>
                  <span className="font-medium">5-7 days</span>
                </li>
                <li className="mt-2 flex justify-between border-t pt-2">
                  <span className="font-medium">Total Syft Cost:</span>
                  <span className="font-medium">$2,990/hire</span>
                </li>
                <li className="flex justify-between font-medium text-green-600">
                  <span>Total Savings:</span>
                  <span>$4,310/hire (59% reduction)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Additional Value */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Additional Value</h3>
            <ul className="space-y-3">
              {[
                'Cut to the chase, Reduce bias in hiring!',
                'Commission hungry recruiters!',
                'Consistent evaluation',
                'Precise data-driven decisions',
                'Scalable process',
                'Compliance documentation',
                '24/7 operation',
              ].map((value, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-indigo-600" />
                  <span className="ml-3 text-sm text-gray-600">{value}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Annual Commitment Benefits</h3>
            <ul className="space-y-3">
              {[
                '20% discount on all plans',
                'Additional AI interviews',
                'Premium support',
                'Custom integrations',
                'ROI reporting',
              ].map((benefit, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-indigo-600" />
                  <span className="ml-3 text-sm text-gray-600">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-medium text-gray-900">Enterprise Value Adds</h3>
            <ul className="space-y-3">
              {[
                'Custom AI model training',
                'White-label options',
                'API access',
                'Dedicated support',
                'Custom development',
              ].map((value, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-indigo-600" />
                  <span className="ml-3 text-sm text-gray-600">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-semibold text-gray-900">
            Ready to transform your hiring process?
          </h3>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Contact us for custom ROI calculation, volume pricing, multi-year agreements, or
            integration planning.
          </p>
          <Link
            to="/contact"
            className="mt-8 inline-flex items-center rounded-xl border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-indigo-700"
          >
            Contact Sales
          </Link>
=======
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Choose the plan that best fits your hiring needs
          </p>
        </div>

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {tiers.map((tier, index) => (
            <div
              key={tier.name}
              className="relative bg-white rounded-2xl shadow-lg overflow-hidden"
            >
              <div className="p-8">
                <h3 className="text-2xl font-semibold text-gray-900">{tier.name}</h3>
                <p className="mt-4 text-gray-500">{tier.description}</p>
                <div className="mt-6">
                  <p className="text-5xl font-extrabold text-gray-900">
                    {typeof tier.price === 'number' ? `$${tier.price}` : tier.price}
                  </p>
                  <p className="mt-2 text-gray-500">{typeof tier.price === 'number' ? '/month' : ' pricing'}</p>
                </div>

                <ul className="mt-8 space-y-4">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 shrink-0" />
                      <span className="ml-3 text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8">
                  <Link
                    to="/login"
                    className="block w-full bg-indigo-600 text-white text-center py-3 px-4 rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Get started
                  </Link>
                </div>
              </div>
            </div>
          ))}
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Pricing;
=======
export default Pricing;
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
