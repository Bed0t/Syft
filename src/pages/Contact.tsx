import React, { useState } from 'react';
import { Mail, Brain, Check, ArrowRight, Phone, MessageSquare, MapPin } from 'lucide-react';
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
    <div className="min-h-screen bg-[#1a1f37]">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form Section */}
          <div className="bg-[#242b50] rounded-2xl p-8 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <MessageSquare className="w-6 h-6" /> Get in Touch
            </h2>
            
            {/* Existing form with updated styling */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-200 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 rounded-lg bg-[#1a1f37] border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:border-[#4361ee]"
                  placeholder="John Doe"
                />
              </div>
              
              {/* ... other form fields with same styling ... */}
              
              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#4361ee] text-white rounded-lg hover:bg-[#3651d4] transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Info Section */}
          <div className="lg:pl-8">
            <div className="bg-[#242b50] rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-6">
                Transform Your Hiring Process
              </h2>
              <p className="text-gray-300 mb-8">
                Ready to revolutionize your recruitment? Our team is here to help you
                implement AI-powered hiring solutions that save time and reduce costs.
              </p>

              {/* Contact Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-4 text-gray-300">
                  <Mail className="w-6 h-6 text-[#4361ee]" />
                  <span>contact@syft.com</span>
                </div>
                <div className="flex items-center gap-4 text-gray-300">
                  <Phone className="w-6 h-6 text-[#4361ee]" />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-4 text-gray-300">
                  <MapPin className="w-6 h-6 text-[#4361ee]" />
                  <span>San Francisco, CA</span>
                </div>
              </div>

              {/* What Happens Next Section */}
              <div className="mt-12">
                <h3 className="text-xl font-semibold text-white mb-4">
                  What Happens Next?
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-[#4361ee]" />
                    We'll review your message within 24 hours
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-[#4361ee]" />
                    Our team will schedule your onboarding session
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-[#4361ee]" />
                    We'll set up your AI recruitment platform access
                  </li>
                  <li className="flex items-center gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-[#4361ee]" />
                    Quick training session to get you started
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;