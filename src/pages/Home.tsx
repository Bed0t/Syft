import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, ArrowRight, Users, BarChart2, Globe2, UserCheck } from 'lucide-react';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center bg-[#1a1f37]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f37] to-[#2a1f67] z-0" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight">
                Revolutionise Your
                <span className="text-[#4361ee] block mt-2">Hiring Process</span>
              </h1>
              <p className="mt-6 text-xl text-gray-300 leading-relaxed">
                Transform recruitment with streamlined candidate screening, automated interviews, and data-driven decisions. Cut costs by upto 70% and hire 3x faster.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-[#4361ee] rounded-lg hover:bg-[#3651d4] transition-colors"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                >
                  View Pricing
                </Link>
              </div>
              <div className="mt-12 grid grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">75%</div>
                  <div className="mt-1 text-gray-400">Time Saved</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">60%</div>
                  <div className="mt-1 text-gray-400">Cost Reduction</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-white">3x</div>
                  <div className="mt-1 text-gray-400">Better Hires</div>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
                  alt="AI Recruitment Platform"
                  className="w-full h-[600px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1f37]/50 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">The Future of Recruitment</h2>
            <p className="mt-4 text-xl text-gray-600">
              Our AI-powered platform streamlines every aspect of your hiring process
            </p>
          </div>

          <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI-Powered Screening",
                description: "Automatically evaluate candidates based on skills, experience, and cultural fit"
              },
              {
                icon: UserCheck,
                title: "Smart Interviews",
                description: "Conduct AI interviews that adapt in real-time to candidate responses"
              },
              {
                icon: Users,
                title: "Bias Elimination",
                description: "Ensure fair hiring decisions with AI-driven objective assessments"
              },
              {
                icon: Globe2,
                title: "Global Talent Pool",
                description: "Access and evaluate top talent from anywhere in the world"
              },
              {
                icon: BarChart2,
                title: "Analytics Dashboard",
                description: "Track hiring metrics and optimize your recruitment process"
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description: "Streamline hiring decisions with built-in collaboration tools"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-[#4361ee]/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-[#4361ee]" />
                </div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-600">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">How It Works</h2>
            <p className="mt-4 text-xl text-gray-600">
              Four simple steps to transform your hiring process
            </p>
          </div>

          <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                number: "01",
                title: "Post Your Job",
                description: "Create and distribute your job posting across multiple platforms with one click"
              },
              {
                number: "02",
                title: "Smart Interviews",
                description: "Automated AI interviews assess technical and soft skills"
              },
              {
                number: "03",
                title: "AI Screening",
                description: "Our AI system will rank candidates based on your requirements"
              },
              {
                number: "04",
                title: "Make the Hire",
                description: "Review top candidates and make data-driven hiring decisions"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-[#4361ee]/30">{step.number}</div>
                <h3 className="mt-4 text-xl font-semibold text-gray-900">{step.title}</h3>
                <p className="mt-2 text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 bg-[#1a1f37]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white">
              Ready to transform your hiring process?
            </h2>
            <p className="mt-4 text-xl text-gray-300">
              Join thousands of companies already using Syft to revolutionize their recruitment. Get started today and see the difference AI-powered hiring can make.
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-[#4361ee] rounded-lg hover:bg-[#3651d4] transition-colors"
              >
                Get Started
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
              >
                Talk to Sales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;