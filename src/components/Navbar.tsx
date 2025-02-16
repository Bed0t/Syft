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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        hasScrolled 
          ? 'bg-black/10 backdrop-blur-lg' 
          : 'bg-transparent'
      }`}
      style={{ 
        transform: 'translate3d(0, 0, 0)',
        transformStyle: 'preserve-3d'
      }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 justify-between items-center">
          <div className="flex">
            <Link to="/" className="flex flex-shrink-0 items-center">
              <motion.img 
                src="/images/logo.png"
                alt="Syft Logo" 
                className="h-12 w-auto"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span 
                className="ml-3 text-2xl font-bold text-white mix-blend-difference"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Syft
              </motion.span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link
              to="/"
              className="rounded-md px-3 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              to="/pricing"
              className="rounded-md px-3 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              to="/about"
              className="rounded-md px-3 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="rounded-md px-3 py-2 text-sm font-medium text-white/90 hover:text-white transition-colors"
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
              className="inline-flex items-center justify-center rounded-md p-2 text-white/90 hover:text-white focus:outline-none"
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
            className="sm:hidden bg-black/90 backdrop-blur-lg"
          >
            <div className="space-y-1 px-2 pb-3 pt-2">
              <Link
                to="/"
                className="block rounded-md px-3 py-2 text-base font-medium text-white/90 hover:text-white"
              >
                Home
              </Link>
              <Link
                to="/pricing"
                className="block rounded-md px-3 py-2 text-base font-medium text-white/90 hover:text-white"
              >
                Pricing
              </Link>
              <Link
                to="/about"
                className="block rounded-md px-3 py-2 text-base font-medium text-white/90 hover:text-white"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="block rounded-md px-3 py-2 text-base font-medium text-white/90 hover:text-white"
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
