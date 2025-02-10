import type { FC } from 'react';
import { useState } from 'react';
import { Star, Search, Filter, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface Candidate {
  id: number;
  name: string;
  email: string;
  role: string;
  status: keyof typeof statusColors;
  rating: number;
  appliedDate: string;
  experience: string;
  location: string;
}

const statusColors = {
  New: 'bg-blue-100 text-blue-800',
  Scheduled: 'bg-yellow-100 text-yellow-800',
  Interviewed: 'bg-purple-100 text-purple-800',
  Hired: 'bg-green-100 text-green-800',
  Rejected: 'bg-red-100 text-red-800',
} as const;

const candidates: Candidate[] = [
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

const Candidates: FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<'All' | keyof typeof statusColors>('All');

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = selectedStatus === 'All' || candidate.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Candidates</h1>

        {/* Filters */}
        <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 max-w-lg flex-1">
            <div className="relative rounded-md shadow-sm">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 leading-5 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Search candidates..."
              />
            </div>
          </div>
          <div className="mt-4 sm:ml-4 sm:mt-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button
                  type="button"
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  <Filter className="mr-2 h-4 w-4" />
                  Filter
                  <ChevronDown className="ml-2 h-4 w-4" />
                </button>
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as keyof typeof statusColors)}
                className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
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
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
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
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
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
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusColors[candidate.status]}`}
                          >
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
                                      ? 'text-yellow-200'
                                      : 'text-gray-200'
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

export default Candidates;
