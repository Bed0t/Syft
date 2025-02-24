import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setHasScrolled(scrollPosition > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        hasScrolled 
          ? 'bg-[#1a1f37]/80 backdrop-blur-lg' 
          : 'bg-[#1a1f37]'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 justify-between items-center">
          <div className="flex">
            <Link to="/" className="flex flex-shrink-0 items-center">
              <img 
                src="/images/transparent-white-syft.png"
                alt="Syft Logo" 
                className="h-10 w-auto"
              />
              <span className="ml-3 text-xl font-bold text-white">Syft</span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-6">
            <Link
              to="/"
              className="rounded-md px-3 py-2 text-sm font-medium text-white hover:text-white/80 transition-colors"
            >
              Home
            </Link>
            <Link
              to="/pricing"
              className="rounded-md px-3 py- text-sm font-medium text-white hover:text-white/80 transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="rounded-md px-3 py-2 text-sm font-medium text-white hover:text-white/80 transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="rounded-md px-3 py-2 text-sm font-medium text-white hover:text-white/80 transition-colors"
            >
              Contact
            </Link>
            <Link
              to="/login"
              className="rounded-full bg-white/10 backdrop-blur-sm px-6 py-2 text-sm font-medium text-white transition-all hover:bg-white/20"
            >
              Login
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-md p-2 text-white hover:text-white/80 focus:outline-none"
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
            className="sm:hidden bg-[#1a1f37] border-t border-white/10"
          >
            <div className="space-y-1 px-2 pb-3 pt-2">
              <Link
                to="/"
                className="block rounded-md px-3 py-2 text-base font-medium text-white hover:text-white/80"
              >
                Home
              </Link>
              <Link
                to="/pricing"
                className="block rounded-md px-3 py-2 text-base font-medium text-white hover:text-white/80"
              >
                Pricing
              </Link>
              <Link
                to="/about"
                className="block rounded-md px-3 py-2 text-base font-medium text-white hover:text-white/80"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block rounded-md px-3 py-2 text-base font-medium text-white hover:text-white/80"
              >
                Contact
              </Link>
              <Link
                to="/login"
                className="block rounded-md bg-white/10 backdrop-blur-sm px-3 py-2 text-base font-medium text-white hover:bg-white/20"
              >
                Login
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
