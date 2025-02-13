import React from 'react';
import { motion } from 'framer-motion';
import { Brain, Users, Shield, Target } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-[#1a1f37]">
      {/* Hero Section */}
      <div className="relative py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl font-bold text-white">
              About <span className="text-[#4361ee]">Syft</span>
            </h1>
            <p className="mt-6 text-xl text-gray-300">
              We're revolutionizing the recruitment industry with AI-powered solutions that make
              hiring smarter, faster, and more efficient.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-24 bg-[#242b50]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Our Mission</h2>
            <p className="text-xl text-gray-300">
              Transforming recruitment through innovation
            </p>
            <p className="mt-4 text-gray-300">
              We believe that hiring should be based on merit, not bias. Our AI-powered platform
              helps companies make better hiring decisions while saving time and resources.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">What drives us forward</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Brain,
                title: "Innovation",
                description: "We continuously push the boundaries of what's possible in recruitment technology"
              },
              {
                icon: Users,
                title: "Diversity",
                description: "We believe in creating equal opportunities and eliminating bias in hiring"
              },
              {
                icon: Target,
                title: "Excellence",
                description: "We strive for excellence in everything we do, from our technology to our service"
              },
              {
                icon: Shield,
                title: "Trust",
                description: "We maintain the highest standards of security and privacy in our operations"
              }
            ].map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-[#242b50] p-6 rounded-xl shadow-xl"
              >
                <div className="w-12 h-12 rounded-lg bg-[#4361ee]/10 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-[#4361ee]" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{value.title}</h3>
                <p className="text-gray-300">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-24 bg-[#242b50]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "1M+", label: "Candidates Screened" },
              { number: "10k+", label: "Companies" },
              { number: "98%", label: "Satisfaction Rate" },
              { number: "24/7", label: "AI Availability" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-[#4361ee]">{stat.number}</div>
                <div className="mt-2 text-gray-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
