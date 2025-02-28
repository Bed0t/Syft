import React, { useState } from 'react';
import { Mail, Brain, Check, ArrowRight, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

const plans = [
  { id: 'essential', name: 'Essential Hire', description: 'Single role', icon: '👤' },
  { id: 'growth', name: 'Growth', description: '5-10 roles', icon: '🚀' },
  { id: 'scale', name: 'Scale', description: '10-20 roles', icon: '📈' },
  { id: 'enterprise', name: 'Enterprise', description: '20+ roles', icon: '🏢' }
];

const avatarImages = [
  "https://originui.com/avatar-80-03.jpg",
  "https://originui.com/avatar-80-04.jpg",
  "https://originui.com/avatar-80-05.jpg"
];

const TeamAvatar = ({ image, delay, index }: { image: string; delay: number; index: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      type: "spring",
      stiffness: 100,
      delay: delay,
      duration: 0.5
    }}
    className="relative"
    style={{
      transform: `translateY(${index * 4}px)`,
    }}
  >
    <div className="absolute inset-0 rounded-full bg-[#4361ee]/10 blur-md transform scale-110" />
    <img
      src={image}
      alt={`Team member ${index + 1}`}
      width={56}
      height={56}
      className="relative w-14 h-14 rounded-full ring-4 ring-[#1a1f37] transform hover:scale-105 transition-transform duration-200"
    />
  </motion.div>
);

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    jobTitle: '',
    selectedPlan: '',
    message: '',
    preferredContact: 'email', // 'email' or 'phone'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent multiple submissions
    if (isSubmitting) {
      console.log('Form already submitting, preventing duplicate submission');
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    try {
      console.log('Form submission started');
      
      // Store lead in Supabase
      const { error: dbError } = await supabase
        .from('lead_tracking')
        .insert({
          company_name: formData.company,
          contact_name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          source: 'contact_form',
          status: 'new',
          notes: JSON.stringify({
            phone: formData.phone,
            jobTitle: formData.jobTitle,
            selectedPlan: formData.selectedPlan,
            message: formData.message,
            preferredContact: formData.preferredContact
          })
        });

      if (dbError) {
        console.error('Supabase insert error:', dbError);
        throw dbError;
      }
      
      console.log('Supabase insert successful');

      // Show success message immediately after successful DB insert
      // Don't wait for the edge function which might be causing the hang
      console.log('Setting success state');
      setShowSuccess(true);
      
      // Set up redirect (even before email notification)
      console.log('Setting timeout for redirect');
      const redirectTimer = setTimeout(() => {
        console.log('Navigating to thank-you page');
        navigate('/thank-you');
      }, 2000);

      // Fire email notification as a truly "fire and forget" operation
      // Using a separate try/catch to completely isolate it
      console.log('Attempting to send email notification');
      try {
        supabase.functions.invoke('send-contact-notification', { 
          body: formData,
          headers: { 'Content-Type': 'application/json' }
        })
        .then(response => {
          console.log('Edge function response received:', response);
          if (response.error) {
            console.error('Email notification error:', response.error);
          }
        })
        .catch(err => {
          console.error('Email notification error:', err);
        });
      } catch (functionErr) {
        console.error('Failed to invoke edge function:', functionErr);
        // Do not affect the form submission result
      }

      // Return early to ensure we don't hit any other code that might interfere
      return;

    } catch (err: any) {
      console.error('Error submitting form:', err);
      setError(err?.message || err?.error_description || 'Failed to submit form. Please try again or contact us directly.');
    } finally {
      // Set submitting to false to allow retry
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Success Message Overlay
  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h2>
          <p className="text-gray-600">
            Your message has been received. We'll get back to you shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1f37]">
      <div className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1f37] to-[#2a1f67] z-0" />
        
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header with Team Avatars */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center relative"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#4361ee]/20 rounded-full blur-xl opacity-60" />
                <div className="absolute -top-6 left-8 w-20 h-20 bg-[#4361ee]/20 rounded-full blur-lg opacity-60" />
                <div className="absolute -top-8 left-20 w-16 h-16 bg-[#4361ee]/20 rounded-full blur-md opacity-60" />
              </div>
            </div>

            <div className="flex justify-center -space-x-2 mb-8 relative">
              {avatarImages.map((imageUrl, index) => (
                <TeamAvatar
                  key={index}
                  image={imageUrl}
                  delay={index * 0.1}
                  index={index}
                />
              ))}
            </div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Contact Us</h1>
            <p className="mt-4 text-lg text-gray-300">
              Get in touch with our team to learn more about Syft
            </p>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 p-8 relative overflow-hidden"
          >
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
              <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6 relative">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold text-gray-300">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-2 border-white/10 px-4 py-3 bg-white/5 text-white placeholder-gray-400 shadow-sm focus:border-[#4361ee] focus:ring-2 focus:ring-[#4361ee]/50 focus:bg-white/10 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold text-gray-300">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-2 border-white/10 px-4 py-3 bg-white/5 text-white placeholder-gray-400 shadow-sm focus:border-[#4361ee] focus:ring-2 focus:ring-[#4361ee]/50 focus:bg-white/10 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-300">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-2 border-white/10 px-4 py-3 bg-white/5 text-white placeholder-gray-400 shadow-sm focus:border-[#4361ee] focus:ring-2 focus:ring-[#4361ee]/50 focus:bg-white/10 transition-all duration-200"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-300">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    id="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-lg border-2 border-white/10 px-4 py-3 bg-white/5 text-white placeholder-gray-400 shadow-sm focus:border-[#4361ee] focus:ring-2 focus:ring-[#4361ee]/50 focus:bg-white/10 transition-all duration-200"
                    required
                  />
                </div>
              </div>

              {/* Preferred Contact Method */}
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">
                  Preferred Contact Method
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="preferredContact"
                      id="preferredContact-email"
                      value="email"
                      checked={formData.preferredContact === 'email'}
                      onChange={handleChange}
                      className="h-4 w-4 text-white focus:ring-white border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-300">Email</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="preferredContact"
                      id="preferredContact-phone"
                      value="phone"
                      checked={formData.preferredContact === 'phone'}
                      onChange={handleChange}
                      className="h-4 w-4 text-white focus:ring-white border-gray-300"
                    />
                    <span className="ml-2 text-sm text-gray-300">Phone</span>
                  </label>
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-semibold text-gray-300">
                  Company Name *
                </label>
                <input
                  type="text"
                  name="company"
                  id="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-2 border-white/10 px-4 py-3 bg-white/5 text-white placeholder-gray-400 shadow-sm focus:border-[#4361ee] focus:ring-2 focus:ring-[#4361ee]/50 focus:bg-white/10 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="jobTitle" className="block text-sm font-semibold text-gray-300">
                  Job Title *
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-2 border-white/10 px-4 py-3 bg-white/5 text-white placeholder-gray-400 shadow-sm focus:border-[#4361ee] focus:ring-2 focus:ring-[#4361ee]/50 focus:bg-white/10 transition-all duration-200"
                  required
                />
              </div>

              {/* Plan Selection */}
              <div>
                <label htmlFor="selectedPlan" className="block text-sm font-semibold text-gray-300">
                  Interested in Plan *
                </label>
                <div className="mt-1 grid grid-cols-2 gap-4">
                  {plans.map((plan) => (
                    <label
                      key={plan.id}
                      htmlFor={`plan-${plan.id}`}
                      className={`
                        relative rounded-lg border-2 p-4 flex cursor-pointer focus:outline-none transition-all duration-200
                        ${formData.selectedPlan === plan.id 
                          ? 'border-[#4361ee] ring-2 ring-[#4361ee] bg-[#4361ee]/10 shadow-md transform scale-[1.02]' 
                          : 'border-white/10 hover:border-[#4361ee] hover:bg-white/10 hover:shadow-md hover:scale-[1.02]'}
                      `}
                    >
                      <input
                        type="radio"
                        name="selectedPlan"
                        id={`plan-${plan.id}`}
                        value={plan.id}
                        checked={formData.selectedPlan === plan.id}
                        onChange={handleChange}
                        className="sr-only"
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{plan.icon}</span>
                          <span className="block text-sm font-semibold text-gray-300">
                            {plan.name}
                          </span>
                        </div>
                        <span className="mt-1 flex items-center text-sm text-gray-300">
                          {plan.description}
                        </span>
                        {formData.selectedPlan === plan.id && (
                          <Check className="absolute top-4 right-4 h-5 w-5 text-white" />
                        )}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-semibold text-gray-300">
                  How can we help? *
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-2 border-white/10 px-4 py-3 bg-white/5 text-white placeholder-gray-400 shadow-sm focus:border-[#4361ee] focus:ring-2 focus:ring-[#4361ee]/50 focus:bg-white/10 transition-all duration-200"
                  required
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-xl text-base font-semibold text-white bg-[#4361ee] hover:bg-[#3651d4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4361ee] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit
                      <ArrowRight className="ml-2 h-5 w-5 transform group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Contact Email */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8 text-center"
          >
            <p className="text-gray-300">
              Or reach us directly at{' '}
              <a 
                href="mailto:contact@usesyft.com" 
                className="inline-flex items-center text-[#4361ee] font-medium hover:text-[#3651d4] transition-colors"
              >
                <Mail className="h-4 w-4 mr-1" />
                contact@usesyft.com
              </a>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;