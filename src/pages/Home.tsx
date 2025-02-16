import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Users, BarChart2, Globe2, UserCheck, Rocket, DollarSign, Target } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-[#1a1f37]">
      {/* Hero Section */}
      <div className="relative h-screen pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f37] to-[#2a1f67]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pt-12">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight">
                Hire Smarter.
                <span className="text-[#4361ee] block mt-2">Spend Less.</span>
              </h1>
              <p className="mt-6 text-xl text-gray-300 leading-relaxed">
                Cut Hiring Costs by 70% & Hire 3x Faster with AI. Join hundreds of companies using Syft to revolutionise recruitment.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-[#4361ee] rounded-lg hover:bg-[#3651d4] transition-colors"
                >
                  <span>🔥 Get Started</span>
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white border border-white/20 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <span>📈 View Pricing</span>
                </Link>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative lg:block hidden"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=1200&q=80"
                  alt="AI Recruitment Platform"
                  className="w-full h-[600px] object-cover"
                />
              </div>
              
              {/* Blue glow effect */}
              <div className="absolute -inset-4 bg-blue-500/20 blur-3xl rounded-full -z-10" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-10 -mt-32">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Rocket,
                emoji: "🚀",
                stat: "75% Faster",
                title: "Faster Hiring",
                description: "Reduce time-to-hire from 40+ days to just 5-7 days.",
                hoverContent: {
                  title: "⏳ Why It's Faster",
                  sections: [
                    {
                      title: "Process Improvements:",
                      items: [
                        "AI-driven screening eliminates delays in resume filtering",
                        "Automated interview scheduling accelerates the hiring process",
                        "Immediate shortlisting of top candidates"
                      ]
                    },
                    {
                      title: "📊 Impact",
                      items: [
                        "Traditional hiring takes 40+ days",
                        "Syft reduces this to just 5-7 days"
                      ]
                    }
                  ]
                }
              },
              {
                icon: DollarSign,
                emoji: "💲",
                stat: "60% Lower",
                title: "Lower Costs",
                description: "Save up to $7,300 per hire vs. traditional recruitment.",
                hoverContent: {
                  title: "💡 Cost Breakdown",
                  sections: [
                    {
                      title: "Traditional Costs:",
                      items: [
                        "Agency/Advertising Fees: ~$15,000",
                        "HR Time: ~$3,200 (40 hours @ $80/hr)",
                        "Job Board & Sourcing: ~$1,200",
                        "Onboarding & Training: ~$3,600"
                      ]
                    },
                    {
                      title: "🔻 How We Cut Costs",
                      items: [
                        "No agency fees or expensive job board ads",
                        "AI-powered interviews reduce HR time by 35+ hours",
                        "Automated screening removes manual reviews"
                      ]
                    },
                    {
                      title: "📉 Result",
                      items: ["Save up to 87% on hiring costs"]
                    }
                  ]
                }
              },
              {
                icon: Target,
                emoji: "🎯",
                stat: "3x Better",
                title: "Better Hires",
                description: "AI-driven screening ensures precise candidate matching.",
                hoverContent: {
                  title: "🧠 Smarter Hiring",
                  sections: [
                    {
                      title: "AI-Powered Analysis:",
                      items: [
                        "AI analyzes candidate skills, experience, and cultural fit",
                        "Machine learning ranks top candidates based on real data",
                        "Automated behavioral analysis predicts long-term success"
                      ]
                    },
                    {
                      title: "📈 Results",
                      items: [
                        "Reduce turnover by up to 50%",
                        "Ensure 3x better hiring decisions with AI-driven insights"
                      ]
                    }
                  ]
                }
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group relative h-[280px] perspective-1000"
              >
                <motion.div
                  className="relative w-full h-full transition-all duration-500 transform-style-3d group-hover:rotate-y-180"
                >
                  {/* Front of card */}
                  <div className="absolute inset-0 w-full h-full text-center p-8 rounded-xl bg-white shadow-lg backface-hidden">
                    <div className="mx-auto w-12 h-12 bg-[#4361ee]/10 rounded-xl flex items-center justify-center mb-4">
                      <item.icon className="w-6 h-6 text-[#4361ee]" />
                    </div>
                    <div className="text-4xl mb-2">{item.emoji}</div>
                    <div className="text-3xl font-bold text-[#4361ee]">{item.stat}</div>
                    <div className="text-xl font-semibold text-gray-900 mt-2">{item.title}</div>
                    <p className="mt-2 text-gray-600">{item.description}</p>
                  </div>

                  {/* Back of card */}
                  <div className="absolute inset-0 w-full h-full p-8 rounded-xl bg-white shadow-lg backface-hidden rotate-y-180 overflow-y-auto">
                    <h3 className="text-xl font-bold text-[#4361ee] mb-4">{item.hoverContent.title}</h3>
                    {item.hoverContent.sections.map((section, sIndex) => (
                      <div key={sIndex} className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{section.title}</h4>
                        <ul className="space-y-2">
                          {section.items.map((listItem, lIndex) => (
                            <li key={lIndex} className="text-sm text-gray-600 flex items-start">
                              <span className="mr-2">•</span>
                              <span>{listItem}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <Link
                      to="/contact"
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-[#4361ee] rounded-lg hover:bg-[#3651d4] transition-colors mt-2"
                    >
                      Learn More
                    </Link>
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="pt-[50vh]">
        {/* Features Section */}
        <div className="py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900">Recruitment is Broken. Let's Fix It</h2>
              <p className="mt-4 text-xl text-gray-600">
                Technology is revolutionising how we hire. Are you ready to leave outdated practices behind?
              </p>
            </div>

            <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: Brain,
                  title: "Smarter Decisions",
                  description: "Our Algorithm analyzes real-time data to evaluate candidates based on skills, experience, and cultural fit"
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
                  description: "Automate repetitive tasks and say goodbye to agencies prioritising their % cut over your long-term success"
                },
                {
                  icon: Brain,
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
                  className="p-8 bg-gray-50 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#4361ee]/10 flex items-center justify-center">
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
              <h2 className="text-3xl font-bold text-gray-900">4 Simple Steps to Smarter Hiring</h2>
            </div>

            <div className="mt-20 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: "📤",
                  title: "Post Your Job",
                  description: "Distribute to a variety of job boards with one click."
                },
                {
                  icon: "🎙️",
                  title: "Smart Interviews",
                  description: "We assess skills, soft factors, and problem-solving abilities missed on resumes."
                },
                {
                  icon: "🔍",
                  title: "Intelligent Screening",
                  description: "Our algorithm ranks candidates based on communication skills, technical expertise, and culture fit."
                },
                {
                  icon: "✅",
                  title: "Hire with Confidence",
                  description: "Review a shortlist of top matches and make offers in days, not months!"
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="text-center p-8 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="text-4xl mb-4">{step.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900">{step.title}</h3>
                  <p className="mt-4 text-gray-600">{step.description}</p>
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
                Ready to revolutionise your hiring process?
              </h2>
              <p className="mt-4 text-xl text-gray-300">
                Join hundreds of companies already using Syft to transform their recruitment. Get started today and see the difference our solution can make.
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
    </div>
  );
};

export default Home;