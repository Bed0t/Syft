import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Brain, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <Link to="/" className="flex flex-shrink-0 items-center">
              <Brain className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Syft</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link
              to="/"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
            >
              Home
            </Link>
            <Link
              to="/pricing"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600"
            >
              Contact
            </Link>
            <Link
              to="/login"
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
            >
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:text-indigo-600 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden"
          >
            <div className="space-y-1 px-2 pb-3 pt-2">
              <Link
                to="/"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600"
              >
                Home
              </Link>
              <Link
                to="/pricing"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600"
              >
                Pricing
              </Link>
              <Link
                to="/about"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600"
              >
                Contact
              </Link>
              <Link
                to="/login"
                className="block rounded-md bg-indigo-600 px-3 py-2 text-base font-medium text-white hover:bg-indigo-700"
              >
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
