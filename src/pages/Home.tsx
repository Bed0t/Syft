import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, ArrowRight, Check, Star, Users, Briefcase, Globe } from 'lucide-react';

const testimonials = [
  {
    name: "Sarah Johnson",
    company: "TechCorp Inc.",
    content: "Syft has reduced our time-to-hire by 70% and improved our quality of hires significantly. The AI-powered interviews are a game-changer."
  },
  {
    name: "Michael Chen",
    company: "Global Solutions",
    content: "We've saved over $100,000 in recruitment costs since implementing Syft. The platform's efficiency and accuracy are unmatched."
  },
  {
    name: "Emma Williams",
    company: "Innovation Labs",
    content: "The data-driven insights from Syft have transformed our hiring process. We're making better decisions faster than ever before."
  }
];

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative flex min-h-screen items-center">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-50 to-white" />

        <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <h1 className="text-5xl font-bold leading-tight text-gray-900 sm:text-6xl lg:text-7xl">
                Hire Smarter with
                <span className="mt-2 block text-indigo-600">AI-Powered Recruitment</span>
              </h1>
              <p className="mt-6 text-xl leading-relaxed text-gray-600">
                Transform your hiring process with AI-driven candidate screening, automated
                interviews, and data-driven decisions. Save time, reduce costs, and find the perfect
                fit.
              </p>
              <div className="mt-10 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/signup"
                  className="group inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-indigo-700"
                >
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center rounded-full bg-indigo-50 px-8 py-4 text-lg font-medium text-indigo-600 transition-colors hover:bg-indigo-100"
                >
                  View Pricing
                </Link>
              </div>
              <div className="mt-10 flex items-center gap-6">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <img
                      key={i}
                      className="h-10 w-10 rounded-full border-2 border-white"
                      src={`https://randomuser.me/api/portraits/men/${i}.jpg`}
                      alt="User"
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="h-5 w-5 fill-current text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-gray-600">
                    <span className="font-semibold">4.9/5</span> from 2,000+ reviews
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
                  alt="AI Recruitment"
                  className="h-[600px] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/50 to-transparent" />
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-4xl font-bold text-gray-900"
            >
              Everything you need to hire better
            </motion.h2>
            <p className="mt-4 text-xl text-gray-600">
              Our AI-powered platform streamlines your entire recruitment process
            </p>
          </div>

          <div className="mt-20 grid gap-12 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Brain,
                title: 'AI-Powered Screening',
                description:
                  'Automatically screen and rank candidates based on skills and experience',
              },
              {
                icon: Users,
                title: 'Smart Interviews',
                description: 'Conduct AI interviews that adapt to candidate responses',
              },
              {
                icon: Globe,
                title: 'Global Talent Pool',
                description: 'Access top talent from anywhere in the world',
              },
              {
                icon: Briefcase,
                title: 'Job Board Integration',
                description: 'Post to multiple job boards with one click',
              },
              {
                icon: Star,
                title: 'Skills Assessment',
                description: 'Evaluate technical and soft skills objectively',
              },
              {
                icon: Check,
                title: 'Bias Reduction',
                description: 'Make fair hiring decisions with AI-driven insights',
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative"
              >
                <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-indigo-50 to-indigo-100 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="mt-6 text-xl font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-indigo-50 py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              { number: '75%', label: 'Time Saved' },
              { number: '60%', label: 'Cost Reduction' },
              { number: '3x', label: 'Better Hires' },
              { number: '24/7', label: 'AI Availability' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-5xl font-bold text-indigo-600">{stat.number}</div>
                <div className="mt-2 text-lg text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="relative bg-white py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative z-10 overflow-hidden rounded-3xl bg-indigo-600 px-8 py-16 md:p-16">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-indigo-800" />
              <div className="bg-grid-white/10 bg-grid absolute inset-0" />
            </div>

            <div className="relative z-10 max-w-2xl">
              <h2 className="text-3xl font-bold text-white md:text-4xl">
                Ready to transform your hiring process?
              </h2>
              <p className="mt-4 text-lg text-indigo-100">
                Join thousands of companies already using Syft to revolutionize their recruitment.
                Get started today with a free trial.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center rounded-full bg-white px-8 py-4 text-lg font-medium text-indigo-600 transition-colors hover:bg-indigo-50"
                >
                  Start Free Trial
                </Link>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center rounded-full border-2 border-white px-8 py-4 text-lg font-medium text-white transition-colors hover:bg-white/10"
                >
                  Talk to Sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
