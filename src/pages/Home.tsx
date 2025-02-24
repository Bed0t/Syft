import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Brain, Users, BarChart2, Globe2, UserCheck, Rocket, DollarSign, Target } from 'lucide-react';
import { Globe } from '../components/Globe';

interface HoverContent {
  why?: string[];
  impact?: string[];
  breakdown?: string[];
  howWeCut?: string[];
  result?: string;
  smarter?: string[];
  results?: string[];
}

interface StatCard {
  icon: React.ElementType;
  stat: string;
  title: string;
  description: string;
  hoverContent: HoverContent;
}

const Home = () => {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["Co-Pilot", "Partner", "Sidekick", "Assistant", "Wingman", "Accelerator", "Game-Changer", "Hero"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="bg-[#1a1f37]">
      {/* Hero Section */}
      <div className="relative h-screen pt-1">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f37] to-[#2a1f67]" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-12 pt-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-2xl"
            >
              <h1 className="text-5xl sm:text-6xl font-bold text-white leading-tight">
                Your Recruitment
                <div className="relative h-[1.2em] overflow-hidden">
                  {titles.map((title, index) => (
                    <motion.span
                      key={index}
                      className="absolute text-[#4361ee]"
                      initial={{ opacity: 0, y: 50 }}
                      animate={
                        titleNumber === index
                          ? {
                              y: 0,
                              opacity: 1,
                            }
                          : {
                              y: titleNumber > index ? -50 : 50,
                              opacity: 0,
                            }
                      }
                      transition={{ type: "spring", stiffness: 25 }}
                    >
                      {title}
                    </motion.span>
                  ))}
                </div>
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
              <div className="relative rounded-3xl overflow-hidden">
                <Globe className="w-full h-[600px]" />
              </div>
              
              {/* Blue glow effect */}
              <div className="absolute -inset-6 bg-blue-500/20 blur-3xl rounded-full -z-10" />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="relative z-20 bg-[#1a1f37]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Rocket,
                stat: "75% Faster",
                title: "Faster Hiring",
                description: "Reduce time-to-hire from 40+ days to just 5-7 days.",
                hoverContent: {
                  why: [
                    "AI-driven screening eliminates delays in resume filtering",
                    "Automated interview scheduling accelerates the hiring process",
                    "Immediate shortlisting of top candidates"
                  ],
                  impact: [
                    "Traditional hiring takes 40+ days",
                    "Syft reduces this to just 5-7 days"
                  ]
                }
              },
              {
                icon: DollarSign,
                stat: "60% Lower",
                title: "Lower Costs",
                description: "Save up to $7,300 per hire vs. traditional recruitment.",
                hoverContent: {
                  breakdown: [
                    "Traditional Recruitment costs: ~$23,000 per hire",
                    "Agency/Advertising Fees: 15-25% of annual salary (avg. $15,000)",
                    "HR Time (Screening & Interviews): ~$3,200 (40 hours @ $80/hr)",
                    "Job Board & Sourcing Fees: ~$1,200",
                    "Onboarding & Training Costs: ~$3,600"
                  ],
                  howWeCut: [
                    "No agency fees or expensive job board ads",
                    "AI-powered interviews reduce HR time by 35+ hours",
                    "Automated screening removes the need for manual resume reviews"
                  ],
                  result: "Save up to 87% on hiring costs"
                }
              },
              {
                icon: Target,
                stat: "3x Better",
                title: "Better Hires",
                description: "AI-driven screening ensures precise candidate matching.",
                hoverContent: {
                  smarter: [
                    "AI analyzes candidate skills, experience, and cultural fit",
                    "Machine learning ranks top candidates based on real data",
                    "Automated behavioral analysis predicts long-term success"
                  ],
                  results: [
                    "Reduce turnover by up to 50%",
                    "Ensure 3x better hiring decisions with AI-driven insights"
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
                className="group relative h-full"
              >
                <div className="text-center p-8 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow h-full">
                  <div className="mx-auto w-12 h-12 bg-[#4361ee]/10 rounded-xl flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-[#4361ee]" />
                  </div>
                  <motion.div
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    className="text-3xl font-bold text-[#4361ee]"
                  >
                    {item.stat}
                  </motion.div>
                  <div className="text-xl font-semibold text-gray-900 mt-2">{item.title}</div>
                  <p className="mt-2 text-gray-600">{item.description}</p>
                </div>

                {/* Details Section (appears on hover) */}
                <div 
                  className="absolute top-full left-0 right-0 mt-2 p-6 rounded-xl bg-[#4361ee] text-white shadow-lg overflow-hidden opacity-0 group-hover:opacity-100 transition-all duration-200 transform origin-top scale-y-0 group-hover:scale-y-100"
                  style={{ transformOrigin: 'top' }}
                >
                  {index === 0 && (
                    <>
                      <h3 className="text-xl font-semibold mb-4">⏳ Why It's Faster:</h3>
                      <ul className="space-y-2 mb-6">
                        {item.hoverContent.why?.map((point, i) => (
                          <li key={i} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                      <h3 className="text-xl font-semibold mb-4">📊 Impact:</h3>
                      <ul className="space-y-2">
                        {item.hoverContent.impact?.map((point, i) => (
                          <li key={i} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {index === 1 && (
                    <>
                      <h3 className="text-xl font-semibold mb-4">💡 Cost Breakdown:</h3>
                      <ul className="space-y-2 mb-6">
                        {item.hoverContent.breakdown?.map((point, i) => (
                          <li key={i} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                      <h3 className="text-xl font-semibold mb-4">🔻 How We Cut Costs:</h3>
                      <ul className="space-y-2 mb-6">
                        {item.hoverContent.howWeCut?.map((point, i) => (
                          <li key={i} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                      <h3 className="text-xl font-semibold">📉 Result:</h3>
                      <p className="mt-2">{item.hoverContent.result}</p>
                    </>
                  )}

                  {index === 2 && (
                    <>
                      <h3 className="text-xl font-semibold mb-4">🧠 Smarter Hiring:</h3>
                      <ul className="space-y-2 mb-6">
                        {item.hoverContent.smarter?.map((point, i) => (
                          <li key={i} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                      <h3 className="text-xl font-semibold mb-4">📈 Results:</h3>
                      <ul className="space-y-2">
                        {item.hoverContent.results?.map((point, i) => (
                          <li key={i} className="flex items-start">
                            <span className="mr-2">•</span>
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                  
                  <Link
                    to="/contact"
                    className="mt-6 block text-center py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    Learn More
                  </Link>
                </div>
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