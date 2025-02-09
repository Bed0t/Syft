import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { createSubscription } from '../lib/stripe';
import { Check, Brain, Mail, Phone, Building, Globe, User } from 'lucide-react';

interface SignupFormData {
  email: string;
  password: string;
  fullName: string;
  companyName: string;
  phone: string;
  website?: string;
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

interface ValidationErrors {
  email?: string;
  password?: string;
  fullName?: string;
  companyName?: string;
  phone?: string;
  website?: string;
  billingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  };
}

const SignupFlow = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const selectedPlan = location.state?.selectedPlan;

  const [formData, setFormData] = useState<SignupFormData>({
    email: '',
    password: '',
    fullName: '',
    companyName: '',
    phone: '',
    website: '',
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States',
    },
  });

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 8;
  };

  const validatePhone = (phone: string) => {
    const re = /^\+?[\d\s-()]{10,}$/;
    return re.test(phone);
  };

  const validateWebsite = (website: string) => {
    if (!website) return true;
    try {
      new URL(website);
      return true;
    } catch {
      return false;
    }
  };

  const validateZipCode = (zipCode: string, country: string) => {
    if (country === 'United States') {
      return /^\d{5}(-\d{4})?$/.test(zipCode);
    }
    return zipCode.length > 0;
  };

  const validateStep = (currentStep: number) => {
    const errors: ValidationErrors = {};

    if (currentStep === 1) {
      if (!validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
      if (!validatePassword(formData.password)) {
        errors.password = 'Password must be at least 8 characters long';
      }
    }

    if (currentStep === 2) {
      if (!formData.fullName.trim()) {
        errors.fullName = 'Full name is required';
      }
      if (!formData.companyName.trim()) {
        errors.companyName = 'Company name is required';
      }
      if (!validatePhone(formData.phone)) {
        errors.phone = 'Please enter a valid phone number';
      }
      if (!validateWebsite(formData.website || '')) {
        errors.website = 'Please enter a valid website URL';
      }
    }

    if (currentStep === 3) {
      if (!formData.billingAddress.street.trim()) {
        errors.billingAddress = { ...errors.billingAddress, street: 'Street address is required' };
      }
      if (!formData.billingAddress.city.trim()) {
        errors.billingAddress = { ...errors.billingAddress, city: 'City is required' };
      }
      if (!formData.billingAddress.state.trim()) {
        errors.billingAddress = { ...errors.billingAddress, state: 'State is required' };
      }
      if (!validateZipCode(formData.billingAddress.zipCode, formData.billingAddress.country)) {
        errors.billingAddress = {
          ...errors.billingAddress,
          zipCode: 'Please enter a valid ZIP code',
        };
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('billing.')) {
      const billingField = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [billingField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    // Clear validation error when user starts typing
    if (name.startsWith('billing.')) {
      const billingField = name.split('.')[1];
      setValidationErrors((prev) => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [billingField]: undefined,
        },
      }));
    } else {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) setError(error.message);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(step)) {
      return;
    }

    setError('');
    setLoading(true);

    try {
      // Check if user exists first
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', formData.email)
        .maybeSingle();

      if (existingUser) {
        setError('An account with this email already exists. Please sign in instead.');
        setLoading(false);
        return;
      }

      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            company_name: formData.companyName,
            phone: formData.phone,
            website: formData.website,
            billing_address: formData.billingAddress,
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          setError('An account with this email already exists. Please sign in instead.');
        } else {
          throw signUpError;
        }
        return;
      }

      if (!authData.user) {
        throw new Error('Failed to create user account');
      }

      // Create user profile
      const { error: profileError } = await supabase.from('users').insert({
        id: authData.user.id,
        email: formData.email,
        full_name: formData.fullName,
        company_name: formData.companyName,
        phone: formData.phone,
        website: formData.website,
        billing_address: formData.billingAddress,
        subscription_tier: selectedPlan?.name.toLowerCase() || 'free',
        subscription_status: 'pending',
      });

      if (profileError) throw profileError;

      if (selectedPlan?.stripe_price_id) {
        await createSubscription(selectedPlan.stripe_price_id);
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep((prev) => prev + 1);
    }
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const renderValidationError = (fieldName: string) => {
    const error = fieldName.startsWith('billing.')
      ? validationErrors.billingAddress?.[
          fieldName.split('.')[1] as keyof typeof validationErrors.billingAddress
        ]
      : validationErrors[fieldName as keyof ValidationErrors];

    return error ? <p className="mt-1 text-sm text-red-600">{error}</p> : null;
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Brain className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        {selectedPlan && (
          <div className="mt-4 text-center">
            <p className="text-lg font-medium text-gray-900">{selectedPlan.name} Plan</p>
            <p className="text-sm text-gray-600">
              ${selectedPlan.price}/{selectedPlan.interval}
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex justify-between">
              {['Account', 'Details', 'Billing'].map((stepName, index) => (
                <div key={stepName} className="flex flex-col items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      step > index + 1
                        ? 'bg-green-500'
                        : step === index + 1
                          ? 'bg-indigo-600'
                          : 'bg-gray-200'
                    } text-white`}
                  >
                    {step > index + 1 ? <Check className="h-5 w-5" /> : index + 1}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">{stepName}</div>
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 rounded-md bg-red-100 p-2 text-sm text-red-700">{error}</div>
          )}

          <form onSubmit={handleSignup} className="space-y-6">
            {step === 1 && (
              <>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`block w-full appearance-none border px-3 py-2 ${
                        validationErrors.email ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
                    />
                    {renderValidationError('email')}
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`block w-full appearance-none border px-3 py-2 ${
                        validationErrors.password ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
                    />
                    {renderValidationError('password')}
                  </div>
                </div>

                <div>
                  <button
                    type="button"
                    onClick={handleGoogleSignup}
                    className="flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    <img
                      src="https://www.google.com/favicon.ico"
                      alt="Google"
                      className="mr-2 h-5 w-5"
                    />
                    Continue with Google
                  </button>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className={`block w-full appearance-none border px-3 py-2 ${
                        validationErrors.fullName ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
                    />
                    {renderValidationError('fullName')}
                  </div>
                </div>

                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <div className="mt-1">
                    <input
                      id="companyName"
                      name="companyName"
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className={`block w-full appearance-none border px-3 py-2 ${
                        validationErrors.companyName ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
                    />
                    {renderValidationError('companyName')}
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="mt-1">
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className={`block w-full appearance-none border px-3 py-2 ${
                        validationErrors.phone ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
                    />
                    {renderValidationError('phone')}
                  </div>
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    Website (optional)
                  </label>
                  <div className="mt-1">
                    <input
                      id="website"
                      name="website"
                      type="url"
                      value={formData.website}
                      onChange={handleInputChange}
                      className={`block w-full appearance-none border px-3 py-2 ${
                        validationErrors.website ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
                    />
                    {renderValidationError('website')}
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <>
                <div>
                  <label
                    htmlFor="billing.street"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Street Address
                  </label>
                  <div className="mt-1">
                    <input
                      id="billing.street"
                      name="billing.street"
                      type="text"
                      required
                      value={formData.billingAddress.street}
                      onChange={handleInputChange}
                      className={`block w-full appearance-none border px-3 py-2 ${
                        validationErrors.billingAddress?.street
                          ? 'border-red-300'
                          : 'border-gray-300'
                      } rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
                    />
                    {renderValidationError('billing.street')}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="billing.city"
                      className="block text-sm font-medium text-gray-700"
                    >
                      City
                    </label>
                    <div className="mt-1">
                      <input
                        id="billing.city"
                        name="billing.city"
                        type="text"
                        required
                        value={formData.billingAddress.city}
                        onChange={handleInputChange}
                        className={`block w-full appearance-none border px-3 py-2 ${
                          validationErrors.billingAddress?.city
                            ? 'border-red-300'
                            : 'border-gray-300'
                        } rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
                      />
                      {renderValidationError('billing.city')}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="billing.state"
                      className="block text-sm font-medium text-gray-700"
                    >
                      State
                    </label>
                    <div className="mt-1">
                      <input
                        id="billing.state"
                        name="billing.state"
                        type="text"
                        required
                        value={formData.billingAddress.state}
                        onChange={handleInputChange}
                        className={`block w-full appearance-none border px-3 py-2 ${
                          validationErrors.billingAddress?.state
                            ? 'border-red-300'
                            : 'border-gray-300'
                        } rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
                      />
                      {renderValidationError('billing.state')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="billing.zipCode"
                      className="block text-sm font-medium text-gray-700"
                    >
                      ZIP Code
                    </label>
                    <div className="mt-1">
                      <input
                        id="billing.zipCode"
                        name="billing.zipCode"
                        type="text"
                        required
                        value={formData.billingAddress.zipCode}
                        onChange={handleInputChange}
                        className={`block w-full appearance-none border px-3 py-2 ${
                          validationErrors.billingAddress?.zipCode
                            ? 'border-red-300'
                            : 'border-gray-300'
                        } rounded-md shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500`}
                      />
                      {renderValidationError('billing.zipCode')}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="billing.country"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Country
                    </label>
                    <div className="mt-1">
                      <select
                        id="billing.country"
                        name="billing.country"
                        value={formData.billingAddress.country}
                        onChange={handleInputChange}
                        className="block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                      </select>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="flex justify-between">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  Back
                </button>
              )}

              {step < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Creating account...' : 'Complete Signup'}
                </button>
              )}
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">Already have an account?</span>
              </div>
            </div>

            <div className="mt-6">
              <button
                onClick={() => navigate('/login')}
                className="flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupFlow;
