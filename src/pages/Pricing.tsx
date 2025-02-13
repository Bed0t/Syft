import React from 'react';
import { motion } from 'framer-motion';
import { Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Pricing = () => {
  const plans = [
    {
      name: "Essential Hire",
      price: "499",
      description: "Perfect for single role hiring",
      features: [
        "1 active job posting",
        "AI candidate screening",
        "Basic analytics",
        "Email support",
        "Interview scheduling"
      ]
    },
    {
      name: "Growth",
      price: "999",
      description: "Ideal for growing teams",
      features: [
        "5 active job postings",
        "Advanced AI screening",
        "Full analytics dashboard",
        "Priority support",
        "Custom workflow automation",
        "Team collaboration tools"
      ]
    },
    {
      name: "Scale",
      price: "1,999",
      description: "For high-volume hiring",
      features: [
        "Unlimited job postings",
        "Advanced AI features",
        "Custom analytics",
        "24/7 priority support",
        "API access",
        "Custom integrations",
        "Dedicated account manager"
      ]
    }
  ];

  return (
    <div className="bg-[#1a1f37] min-h-screen">
      {/* Header */}
      <div className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-white mb-6">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-300">
              Choose the perfect plan for your hiring needs. All plans include our core AI-powered features.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="pb-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-[#242b50] rounded-2xl shadow-xl p-8"
              >
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-300 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-300">/month</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-300">
                      <Check className="w-5 h-5 text-[#4361ee]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center w-full px-6 py-3 text-white bg-[#4361ee] rounded-lg hover:bg-[#3651d4] transition-colors"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-24 bg-[#242b50]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-12">
              Frequently Asked Questions
            </h2>
            {/* Add FAQ items here if needed */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
