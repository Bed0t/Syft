import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Brain, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm">
<<<<<<< HEAD
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <Link to="/" className="flex flex-shrink-0 items-center">
=======
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
              <Brain className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-2xl font-bold text-gray-900">Syft</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
<<<<<<< HEAD
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
=======
            <Link to="/" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Home
            </Link>
            <Link to="/pricing" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              Pricing
            </Link>
            <Link to="/about" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
              About
            </Link>
            <Link to="/contact" className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium">
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
              Contact
            </Link>
            <Link
              to="/login"
<<<<<<< HEAD
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
=======
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
            >
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
<<<<<<< HEAD
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-700 hover:text-indigo-600 focus:outline-none"
=======
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 focus:outline-none"
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
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
<<<<<<< HEAD
            <div className="space-y-1 px-2 pb-3 pt-2">
              <Link
                to="/"
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600"
=======
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600"
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
              >
                Home
              </Link>
              <Link
                to="/pricing"
<<<<<<< HEAD
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600"
=======
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600"
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
              >
                Pricing
              </Link>
              <Link
                to="/about"
<<<<<<< HEAD
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600"
=======
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600"
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
              >
                About
              </Link>
              <Link
                to="/contact"
<<<<<<< HEAD
                className="block rounded-md px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600"
=======
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-indigo-600"
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
              >
                Contact
              </Link>
              <Link
                to="/login"
<<<<<<< HEAD
                className="block rounded-md bg-indigo-600 px-3 py-2 text-base font-medium text-white hover:bg-indigo-700"
=======
                className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700"
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
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

<<<<<<< HEAD
export default Navbar;
=======
export default Navbar;
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
