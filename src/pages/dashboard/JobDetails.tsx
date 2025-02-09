import React from 'react';
import { useParams } from 'react-router-dom';
import { Users, Clock, Target, BarChart, ChevronLeft, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Mock data - replace with actual API calls
const jobDetails = {
  id: 1,
  title: 'Senior Frontend Developer',
  department: 'Engineering',
  location: 'San Francisco, CA',
  type: 'Full-time',
  status: 'Active',
  postedDate: '2024-02-15',
  description: 'We are looking for an experienced Frontend Developer to join our team...',
  requirements: [
    '5+ years of React experience',
    'Strong TypeScript skills',
    'Experience with modern frontend tools'
  ],
  stats: {
    totalApplications: 45,
    inReview: 12,
    interviewed: 8,
    hired: 2
  }
};

const candidates = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah.johnson@example.com',
    status: 'Interviewed',
    rating: 4.5,
    appliedDate: '2024-02-15',
    experience: '8 years',
    location: 'San Francisco, CA',
    matchScore: 92
  },
  {
    id: 2,
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    status: 'In Review',
    rating: 4.0,
    appliedDate: '2024-02-14',
    experience: '5 years',
    location: 'New York, NY',
    matchScore: 88
  }
];

const statusColors = {
  'New': 'bg-blue-100 text-blue-800',
  'In Review': 'bg-yellow-100 text-yellow-800',
  'Interviewed': 'bg-purple-100 text-purple-800',
  'Hired': 'bg-green-100 text-green-800',
  'Rejected': 'bg-red-100 text-red-800'
};

const JobDetails = () => {
  const { id } = useParams();

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Link
              to="/dashboard/jobs"
              className="mr-4 text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft className="h-6 w-6" />
            </Link>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">{jobDetails.title}</h1>
              <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                <span>{jobDetails.department}</span>
                <span>•</span>
                <span>{jobDetails.location}</span>
                <span>•</span>
                <span>{jobDetails.type}</span>
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {jobDetails.status}
                </span>
              </div>
            </div>
          </div>
          <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
            Edit Job
          </button>
        </div>

        {/* Job Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {[
            { name: 'Total Applications', value: jobDetails.stats.totalApplications, icon: Users, color: 'bg-blue-500' },
            { name: 'In Review', value: jobDetails.stats.inReview, icon: Clock, color: 'bg-yellow-500' },
            { name: 'Interviewed', value: jobDetails.stats.interviewed, icon: Target, color: 'bg-purple-500' },
            { name: 'Hired', value: jobDetails.stats.hired, icon: BarChart, color: 'bg-green-500' }
          ].map((stat) => (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white overflow-hidden shadow rounded-lg"
            >
              <div className="p-5">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 p-3 rounded-md ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd className="text-lg font-semibold text-gray-900">{stat.value}</dd>
                    </dl>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Job Details and Analytics Split */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Job Details</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Description</h3>
                  <p className="mt-1 text-sm text-gray-900">{jobDetails.description}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Requirements</h3>
                  <ul className="mt-1 list-disc list-inside text-sm text-gray-900">
                    {jobDetails.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Posted Date</h3>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(jobDetails.postedDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Application Trends</h2>
              <div className="h-64 flex items-center justify-center text-gray-500">
                [Application Trends Chart Placeholder]
              </div>
            </div>
          </div>

          {/* Right Column - Candidates */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Candidates</h2>
                  <div className="flex space-x-3">
                    <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Filter
                    </button>
                    <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                      Export
                    </button>
                  </div>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {candidates.map((candidate) => (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-lg font-medium text-gray-600">
                            {candidate.name.charAt(0)}
                          </div>
                        </div>
                        <div className="ml-4">
                          <h3 className="text-lg font-medium text-gray-900">{candidate.name}</h3>
                          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                            <span>{candidate.experience} experience</span>
                            <span>•</span>
                            <span>{candidate.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">Match Score</div>
                          <div className="text-green-600">{candidate.matchScore}%</div>
                        </div>
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[candidate.status]}`}>
                          {candidate.status}
                        </span>
                        <Link
                          to={`/dashboard/candidates/${candidate.id}`}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          <ExternalLink className="h-5 w-5" />
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;