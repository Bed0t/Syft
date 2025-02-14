import React from 'react';
import { Link } from 'react-router-dom';
import { Check, ArrowLeft } from 'lucide-react';

const ThankYou = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-xl w-full text-center">
        {/* Success Icon */}
        <div className="mx-auto w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-8">
          <Check className="h-12 w-12 text-green-600" />
        </div>

        {/* Main Content */}
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Thank You!
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          We've received your message and will get back to you within 24 hours.
        </p>

        {/* What to Expect Section */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            What happens next?
          </h2>
          <ul className="text-left space-y-4">
            <li className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mt-1">
                <span className="text-indigo-600 font-semibold">1</span>
              </div>
              <p className="ml-3 text-gray-600">
                Our team will review your inquiry and prepare a personalized response.
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mt-1">
                <span className="text-indigo-600 font-semibold">2</span>
              </div>
              <p className="ml-3 text-gray-600">
                You'll receive an email from us within 24 hours to discuss your needs in detail.
              </p>
            </li>
            <li className="flex items-start">
              <div className="flex-shrink-0 w-6 h-6 bg-indigo-100 rounded-full flex items-center justify-center mt-1">
                <span className="text-indigo-600 font-semibold">3</span>
              </div>
              <p className="ml-3 text-gray-600">
                We'll schedule a call if needed to better understand how we can help you succeed.
              </p>
            </li>
          </ul>
        </div>

        {/* Additional Resources */}
        <div className="text-gray-600 mb-8">
          <p>
            While you wait, you might be interested in:
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/about"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              About Us
            </Link>
            <Link
              to="/blog"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Read Our Blog
            </Link>
          </div>
        </div>

        {/* Return Home Link */}
        <Link
          to="/"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-500 font-medium"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Return to Homepage
        </Link>
      </div>
    </div>
  );
};

export default ThankYou; 