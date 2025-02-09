import React from 'react';
import { Brain, Users, Target, Shield } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              About <span className="text-indigo-600">Syft</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-xl text-gray-500">
              We're revolutionizing the recruitment industry with AI-powered solutions that make
              hiring smarter, faster, and more efficient.
            </p>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base font-semibold uppercase tracking-wide text-indigo-600">
              Our Mission
            </h2>
            <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
              Transforming recruitment through innovation
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We believe that hiring should be based on merit, not bias. Our AI-powered platform
              helps companies make better hiring decisions while saving time and resources.
            </p>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 lg:text-center">
            <h2 className="text-base font-semibold uppercase tracking-wide text-indigo-600">
              Our Values
            </h2>
            <p className="mt-2 text-3xl font-extrabold leading-8 tracking-tight text-gray-900 sm:text-4xl">
              What drives us forward
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10 md:space-y-0">
              <div className="relative">
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                  <Brain className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg font-medium leading-6 text-gray-900">Innovation</p>
                <p className="ml-16 mt-2 text-base text-gray-500">
                  We continuously push the boundaries of what's possible in recruitment technology.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                  <Users className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg font-medium leading-6 text-gray-900">Diversity</p>
                <p className="ml-16 mt-2 text-base text-gray-500">
                  We believe in creating equal opportunities and eliminating bias in hiring.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                  <Target className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg font-medium leading-6 text-gray-900">Excellence</p>
                <p className="ml-16 mt-2 text-base text-gray-500">
                  We strive for excellence in everything we do, from our technology to our customer
                  service.
                </p>
              </div>

              <div className="relative">
                <div className="absolute flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                  <Shield className="h-6 w-6" />
                </div>
                <p className="ml-16 text-lg font-medium leading-6 text-gray-900">Trust</p>
                <p className="ml-16 mt-2 text-base text-gray-500">
                  We maintain the highest standards of security and privacy in our operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
