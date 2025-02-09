import React, { useState } from 'react';
import { Star, Search, Filter, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const candidates = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    role: 'Senior Frontend Developer',
    status: 'Interviewed',
    rating: 4.5,
    appliedDate: '2024-02-15',
    experience: '8 years',
    location: 'San Francisco, CA',
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    role: 'Product Manager',
    status: 'New',
    rating: 4.0,
    appliedDate: '2024-02-14',
    experience: '5 years',
    location: 'New York, NY',
  },
  // Add more candidates as needed
];

const statusColors = {
  New: 'bg-blue-100 text-blue-800',
  Scheduled: 'bg-yellow-100 text-yellow-800',
  Interviewed: 'bg-purple-100 text-purple-800',
  Hired: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
};

const Candidates = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');

<<<<<<< HEAD
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'All' || candidate.status === selectedStatus;

=======
  const filteredCandidates = candidates.filter(candidate => {
    const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = selectedStatus === 'All' || candidate.status === selectedStatus;
    
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="py-6">
<<<<<<< HEAD
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
=======
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
        <h1 className="text-2xl font-semibold text-gray-900">Candidates</h1>

        {/* Filters */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
<<<<<<< HEAD
          <div className="min-w-0 max-w-lg flex-1">
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
=======
          <div className="flex-1 min-w-0 max-w-lg">
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
<<<<<<< HEAD
                className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 leading-5 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
=======
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
                placeholder="Search candidates..."
              />
            </div>
          </div>
<<<<<<< HEAD
          <div className="mt-4 sm:ml-4 sm:mt-0">
=======
          <div className="mt-4 sm:mt-0 sm:ml-4">
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  type="button"
<<<<<<< HEAD
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  <Filter className="mr-2 h-4 w-4" />
=======
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Filter className="h-4 w-4 mr-2" />
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
                  Filter
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
<<<<<<< HEAD
                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
=======
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
              >
                <option>All</option>
                <option>New</option>
                <option>Scheduled</option>
                <option>Interviewed</option>
                <option>Hired</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Candidates Table */}
        <div className="mt-8 flex flex-col">
<<<<<<< HEAD
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
=======
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
<<<<<<< HEAD
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Role
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Status
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Rating
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
=======
                      <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Name
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Role
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Status
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Rating
                      </th>
                      <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
                        Applied
                      </th>
                      <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {filteredCandidates.map((candidate, index) => (
                      <motion.tr
                        key={candidate.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-10 w-10 flex-shrink-0">
<<<<<<< HEAD
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
=======
                              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
                                {candidate.name.charAt(0)}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-900">{candidate.name}</div>
                              <div className="text-gray-500">{candidate.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="text-gray-900">{candidate.role}</div>
                          <div className="text-gray-500">{candidate.experience}</div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
<<<<<<< HEAD
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusColors[candidate.status]}`}
                          >
=======
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[candidate.status]}`}>
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
                            {candidate.status}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(candidate.rating)
                                    ? 'text-yellow-400'
                                    : i < candidate.rating
<<<<<<< HEAD
                                      ? 'text-yellow-200'
                                      : 'text-gray-200'
=======
                                    ? 'text-yellow-200'
                                    : 'text-gray-200'
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
                                }`}
                                fill="currentColor"
                              />
                            ))}
                            <span className="ml-2">{candidate.rating}</span>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(candidate.appliedDate).toLocaleDateString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            View<span className="sr-only">, {candidate.name}</span>
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Candidates;
=======
export default Candidates;
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
