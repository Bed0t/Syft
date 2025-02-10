import React, { useState } from 'react';
import { Mail, Brain, Check, ArrowRight, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const plans = [
  { id: 'essential', name: 'Essential Hire', description: 'Single role', icon: '👤' },
  { id: 'growth', name: 'Growth', description: '5-10 roles', icon: '🚀' },
  { id: 'scale', name: 'Scale', description: '10-20 roles', icon: '📈' },
  { id: 'enterprise', name: 'Enterprise', description: '20+ roles', icon: '🏢' }
];

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
    setIsSubmitting(true);
    setError('');

    try {
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

      if (dbError) throw dbError;

      // Send email notification using Edge Function
      const { error: emailError } = await supabase.functions.invoke('send-contact-notification', {
        body: {
          to: 'contact@usesyft.com',
          subject: `New Contact Form Submission - ${formData.company}`,
          formData
        }
      });

      if (emailError) throw emailError;

      // Show success message
      setShowSuccess(true);
      
      // Redirect after 2 seconds
      setTimeout(() => {
        navigate('/thank-you');
      }, 2000);

    } catch (err: any) {
      console.error('Error submitting form:', err);
      setError('Failed to submit form. Please try again or contact us directly.');
    } finally {
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Team Photos */}
        <div className="text-center relative">
          {/* Decorative elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full">
            <div className="relative">
              {/* Background bubbles with enhanced shadows */}
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-indigo-100 rounded-full blur-xl opacity-60 shadow-lg"></div>
              <div className="absolute -top-6 left-8 w-20 h-20 bg-blue-100 rounded-full blur-lg opacity-60 shadow-lg"></div>
              <div className="absolute -top-8 left-20 w-16 h-16 bg-purple-100 rounded-full blur-md opacity-60 shadow-lg"></div>
            </div>
          </div>

          <div className="flex justify-center -space-x-2 mb-8 relative">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="relative"
                style={{
                  transform: `translateY(${i * 4}px)`,
                }}
              >
                <div className="absolute inset-0 rounded-full bg-indigo-600/10 blur-sm transform scale-110 shadow-xl"></div>
                <img
                  className="relative inline-block h-14 w-14 rounded-full ring-4 ring-white shadow-lg transform hover:scale-105 transition-transform duration-200"
                  src={`https://randomuser.me/api/portraits/${i % 2 ? 'women' : 'men'}/${i}.jpg`}
                  alt="Team member"
                />
              </div>
            ))}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Contact Us</h1>
          <p className="mt-4 text-lg text-gray-600">
            Get in touch with our team to learn more about Syft
          </p>
        </div>

        {/* Contact Form */}
        <div className="mt-12 bg-white rounded-xl shadow-xl border border-gray-200 p-8 relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
            <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, gray 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6 relative">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-semibold text-gray-900">
                  First Name *
                </label>
                <input
                  type="text"
                  name="firstName"
                  id="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-2 border-gray-200 px-4 py-3 bg-gray-50 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-semibold text-gray-900">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="lastName"
                  id="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-2 border-gray-200 px-4 py-3 bg-gray-50 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-200"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-900">
                  Work Email *
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-2 border-gray-200 px-4 py-3 bg-gray-50 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-200"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-900">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-lg border-2 border-gray-200 px-4 py-3 bg-gray-50 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-200"
                />
              </div>
            </div>

            {/* Preferred Contact Method */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                Preferred Contact Method
              </label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="preferredContact"
                    value="email"
                    checked={formData.preferredContact === 'email'}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-600">Email</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="preferredContact"
                    value="phone"
                    checked={formData.preferredContact === 'phone'}
                    onChange={handleChange}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                  />
                  <span className="ml-2 text-sm text-gray-600">Phone</span>
                </label>
              </div>
            </div>

            <div>
              <label htmlFor="company" className="block text-sm font-semibold text-gray-900">
                Company Name *
              </label>
              <input
                type="text"
                name="company"
                id="company"
                value={formData.company}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-2 border-gray-200 px-4 py-3 bg-gray-50 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-200"
                required
              />
            </div>

            <div>
              <label htmlFor="jobTitle" className="block text-sm font-semibold text-gray-900">
                Job Title *
              </label>
              <input
                type="text"
                name="jobTitle"
                id="jobTitle"
                value={formData.jobTitle}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-2 border-gray-200 px-4 py-3 bg-gray-50 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-200"
                required
              />
            </div>

            {/* Plan Selection */}
            <div>
              <label htmlFor="selectedPlan" className="block text-sm font-semibold text-gray-900">
                Interested in Plan *
              </label>
              <div className="mt-1 grid grid-cols-2 gap-4">
                {plans.map((plan) => (
                  <label
                    key={plan.id}
                    className={`
                      relative rounded-lg border-2 p-4 flex cursor-pointer focus:outline-none transition-all duration-200
                      ${formData.selectedPlan === plan.id 
                        ? 'border-indigo-500 ring-2 ring-indigo-500 bg-indigo-50 shadow-md transform scale-[1.02]' 
                        : 'border-gray-200 hover:border-indigo-500 hover:bg-gray-50 hover:shadow-md hover:scale-[1.02]'}
                    `}
                  >
                    <input
                      type="radio"
                      name="selectedPlan"
                      value={plan.id}
                      checked={formData.selectedPlan === plan.id}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className="flex flex-col">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl">{plan.icon}</span>
                        <span className="block text-sm font-semibold text-gray-900">
                          {plan.name}
                        </span>
                      </div>
                      <span className="mt-1 flex items-center text-sm text-gray-600">
                        {plan.description}
                      </span>
                      {formData.selectedPlan === plan.id && (
                        <Check className="absolute top-4 right-4 h-5 w-5 text-indigo-600" />
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-gray-900">
                How can we help? *
              </label>
              <textarea
                name="message"
                id="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border-2 border-gray-200 px-4 py-3 bg-gray-50 text-gray-900 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:bg-white transition-all duration-200"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-xl text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group"
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
        </div>

        {/* Contact Email */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            Or reach us directly at{' '}
            <a 
              href="mailto:contact@usesyft.com" 
              className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-500 transition-colors"
            >
              <Mail className="h-4 w-4 mr-1" />
              contact@usesyft.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;