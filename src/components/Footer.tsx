import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Twitter, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  return (
<<<<<<< HEAD
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
=======
    <footer className="bg-white border-t">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
          <div className="space-y-4">
            <div className="flex items-center">
              <Brain className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Syft</span>
            </div>
<<<<<<< HEAD
            <p className="text-gray-600">Revolutionizing recruitment with AI-powered solutions.</p>
=======
            <p className="text-gray-600">
              Revolutionizing recruitment with AI-powered solutions.
            </p>
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </div>

          <div>
<<<<<<< HEAD
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Product
            </h3>
=======
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Product</h3>
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/pricing" className="text-base text-gray-500 hover:text-gray-900">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-base text-gray-500 hover:text-gray-900">
                  Features
                </Link>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                  Security
                </a>
              </li>
            </ul>
          </div>

          <div>
<<<<<<< HEAD
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
              Company
            </h3>
=======
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Company</h3>
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
            <ul className="mt-4 space-y-4">
              <li>
                <Link to="/about" className="text-base text-gray-500 hover:text-gray-900">
                  About
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-base text-gray-500 hover:text-gray-900">
                  Contact
                </Link>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                  Careers
                </a>
              </li>
            </ul>
          </div>

          <div>
<<<<<<< HEAD
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">Legal</h3>
=======
            <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">Legal</h3>
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
            <ul className="mt-4 space-y-4">
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                  Privacy
                </a>
              </li>
              <li>
                <a href="#" className="text-base text-gray-500 hover:text-gray-900">
                  Terms
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8">
<<<<<<< HEAD
          <p className="text-center text-base text-gray-400">
=======
          <p className="text-base text-gray-400 text-center">
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
            &copy; {new Date().getFullYear()} Syft. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

<<<<<<< HEAD
export default Footer;
=======
export default Footer;
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
