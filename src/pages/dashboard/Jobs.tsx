import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, Calendar, Users, MapPin, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  applicants: number;
  posted: string;
  status: string;
  description: string;
  requirements: string[];
}

const jobs: Job[] = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'Full-time',
    applicants: 45,
    posted: '2 days ago',
    status: 'Active',
    description: 'We are looking for an experienced Frontend Developer to join our team...',
    requirements: [
      '5+ years of React experience',
      'Strong TypeScript skills',
      'Experience with modern frontend tools',
    ],
  },
  {
    id: 2,
    title: 'Product Manager',
    department: 'Product',
    location: 'Remote',
    type: 'Full-time',
    applicants: 28,
    posted: '5 days ago',
    status: 'Active',
    description: 'Seeking a Product Manager to lead our core product initiatives...',
    requirements: [
      '3+ years of Product Management',
      'Strong analytical skills',
      'Experience with Agile methodologies',
    ],
  },
  // Add more job listings as needed
];

const Jobs: React.FC = () => {
  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">Jobs</h1>
          <Link
            to="/dashboard/jobs/create"
            className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700"
          >
            <Plus className="mr-2 h-5 w-5" />
            Post New Job
          </Link>
        </div>

        {/* Job Listings */}
        <div className="mt-8 grid gap-6">
          {jobs.map((job, index) => (
            <motion.div
              key={job.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="overflow-hidden rounded-lg bg-white shadow"
            >
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>{job.department}</span>
                      <span>•</span>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4" />
                        {job.location}
                      </div>
                      <span>•</span>
                      <span>{job.type}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="mr-1 h-4 w-4" />
                      {job.posted}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="mr-1 h-4 w-4" />
                      {job.applicants} applicants
                    </div>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800">
                      {job.status}
                    </span>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-gray-600">{job.description}</p>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900">Requirements:</h3>
                  <ul className="mt-2 list-inside list-disc text-sm text-gray-600">
                    {job.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex items-center justify-between">
                  <Link
                    to={`/dashboard/candidates?job=${job.id}`}
                    className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    View Candidates
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </Link>
                  <div className="flex space-x-3">
                    <button className="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50">
                      Edit
                    </button>
                    <button className="rounded-md border border-red-300 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-50">
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Jobs;
