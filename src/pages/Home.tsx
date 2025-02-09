import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
<<<<<<< HEAD
import { Brain, ArrowRight, Check, Star, Users, Briefcase, Globe } from 'lucide-react';
=======
import { Brain, Clock, DollarSign, Target, Users, ChevronRight } from 'lucide-react';

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
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
<<<<<<< HEAD
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
=======
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
            <main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
              <div className="sm:text-center lg:text-left">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
                >
                  <span className="block">Transform your</span>
                  <span className="block text-indigo-600">hiring process with AI</span>
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"
                >
                  Automate candidate screening, conduct AI-powered interviews, and make data-driven hiring decisions with Syft's intelligent recruitment platform.
                </motion.p>
                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    <Link
                      to="/login"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                    >
                      Get Started
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 }}
                    className="mt-3 sm:mt-0 sm:ml-3"
                  >
                    <Link
                      to="/about"
                      className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
                    >
                      Learn More
                    </Link>
                  </motion.div>
                </div>
              </div>
            </main>
          </div>
        </div>
        <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
          <img
            className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
            src="https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
            alt="Team working"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              A better way to hire
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              Our AI-powered platform streamlines your recruitment process from start to finish.
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <Clock className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Time Efficiency</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Automated screening and AI interviews reduce time-to-hire by up to 75%.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <DollarSign className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Cost Reduction</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Save up to 60% on recruitment costs through automation and AI-driven processes.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <Target className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Quality Improvement</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Data-driven candidate assessment ensures better hiring decisions.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                  <Users className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Enhanced Experience</p>
                <p className="mt-2 ml-16 text-base text-gray-500">
                  Provide a seamless and professional experience for both recruiters and candidates.
                </p>
              </div>
            </div>
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
          </div>
        </div>
      </div>

<<<<<<< HEAD
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
=======
      {/* Testimonials Section */}
      <div className="bg-gray-50 py-16 lg:py-24">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative">
            <div className="text-center">
              <h2 className="text-3xl tracking-tight font-extrabold text-gray-900 sm:text-4xl">
                Trusted by leading companies
              </h2>
              <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
                See how Syft is transforming recruitment for businesses worldwide.
              </p>
            </div>
            <div className="mt-12 max-w-lg mx-auto grid gap-5 lg:grid-cols-3 lg:max-w-none">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className="flex flex-col rounded-lg shadow-lg overflow-hidden"
                >
                  <div className="flex-1 bg-white p-6 flex flex-col justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-indigo-600">
                        {testimonial.company}
                      </p>
                      <div className="mt-2">
                        <p className="text-xl font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="mt-3 text-base text-gray-500">{testimonial.content}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
          </div>
        </div>
      </div>

      {/* CTA Section */}
<<<<<<< HEAD
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
=======
      <div className="bg-indigo-700">
        <div className="max-w-2xl mx-auto text-center py-16 px-4 sm:py-20 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Ready to transform your hiring?</span>
            <span className="block">Start using Syft today.</span>
          </h2>
          <p className="mt-4 text-lg leading-6 text-indigo-200">
            Join thousands of companies already using Syft to revolutionize their recruitment process.
          </p>
          <Link
            to="/login"
            className="mt-8 w-full inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50 sm:w-auto"
          >
            Get started
            <ChevronRight className="ml-2 -mr-1 h-5 w-5" />
          </Link>
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Home;
=======
export default Home;
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
