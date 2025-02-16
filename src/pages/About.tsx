import React from 'react';
import { Brain, Users, Target, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <div className="min-h-screen bg-[#1a1f37]">
      {/* Hero Section */}
      <div className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f37] to-[#2a1f67] z-0" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
              About <span className="text-[#4361ee]">Syft</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-300">
              We're revolutionizing the recruitment industry with AI-powered solutions that make
              hiring smarter, faster, and more efficient.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="relative py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:text-center"
          >
            <h2 className="text-base font-semibold uppercase tracking-wide text-[#4361ee]">
              Our Mission
            </h2>
            <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-white sm:text-4xl">
              Transforming recruitment through innovation
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-300 lg:mx-auto">
              We believe that hiring should be based on merit, not bias. Our AI-powered platform
              helps companies make better hiring decisions while saving time and resources.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Values Section */}
      <div className="relative py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12 lg:text-center"
          >
            <h2 className="text-base font-semibold uppercase tracking-wide text-[#4361ee]">
              Our Values
            </h2>
            <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-white sm:text-4xl">
              What drives us forward
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-10"
          >
            <div className="space-y-10 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 md:space-y-0">
              <div className="relative bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 p-8">
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-[#4361ee] text-white">
                  <Brain className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg font-medium leading-6 text-white">Innovation</p>
                <p className="ml-16 mt-2 text-base text-gray-300">
                  We continuously push the boundaries of what's possible in recruitment technology.
                </p>
              </div>

              <div className="relative bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 p-8">
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-[#4361ee] text-white">
                  <Users className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg font-medium leading-6 text-white">Diversity</p>
                <p className="ml-16 mt-2 text-base text-gray-300">
                  We believe in creating equal opportunities and eliminating bias in hiring.
                </p>
              </div>

              <div className="relative bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 p-8">
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-[#4361ee] text-white">
                  <Target className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg font-medium leading-6 text-white">Excellence</p>
                <p className="ml-16 mt-2 text-base text-gray-300">
                  We strive for excellence in everything we do, from our technology to our customer
                  service.
                </p>
              </div>

              <div className="relative bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 p-8">
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-[#4361ee] text-white">
                  <Shield className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg font-medium leading-6 text-white">Trust</p>
                <p className="ml-16 mt-2 text-base text-gray-300">
                  We maintain the highest standards of security and privacy in our operations.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
