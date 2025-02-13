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
                Transform recruitment with AI-powered candidate screening, automated interviews, and data-driven decisions. Cut costs by upto 70% and hire 3x faster.
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
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="/hero-image.jpg" // Replace with your actual image
                  alt="AI Recruitment"
                  className="w-full h-[600px] object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">The Recruitment Industry is Broken. Let’s Fix It</h2>
            <p className="mt-4 text-xl text-gray-600">
              Technology is revolutionising how we hire. Are you ready to leave outdated practices behind?
            </p>
          </div>

          <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Smarter Decisions",
                description: "Our Algorithm analyzes real-time data to evaluate candidates based on skills, experience, and cultural fits"
              },
              {
                icon: UserCheck,
                title: "Skills over Keywords",
                description: "Focus on what candidates can do, not just the buzz words on their resumes"
              },
              {
                icon: Users,
                title: "Bias Elimination",
                description: "Never miss out on top talent, we'll let you know when a good hire is in front of you"
              },
              {
                icon: Globe2,
                title: "Dilute that hiring team",
                description: "Stop paying for a team of assistants to do a job that can be done by an algorithm"
              },
              {
                icon: BarChart2,
                title: "Time & Cost Savings",
                description: "Automate repetitive tasks and say goodbye to agencies prioritise their % cut over your long-term success"
              },
              {
                icon: Users,
                title: "Make fact-based decisions",
                description: "Stop hiring based on gut feelings, let the data and facts guide your decisions"
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
            <h2 className="text-3xl font-bold text-gray-900">Want to Know How This Works?</h2>
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
                description: "We analyze the call with the candidate assess technical and soft skills, that may have been missed in the resume"
              },
              {
                number: "03",
                title: "AI Screening",
                description: "Our algorithm will rank candidates based on your requirements"
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
              Now, are you ready to transform your hiring process?
            </h2>
            <p className="mt-4 text-xl text-gray-300">
              Join hundreds of others already using Syft to revolutionise their recruitment. Get started today and see the difference our solution can make to your business, and your pockets.
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