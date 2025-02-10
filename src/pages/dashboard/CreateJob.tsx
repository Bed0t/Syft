import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, AlertCircle } from 'lucide-react';
import { postJobToLinkedIn } from '../../lib/linkedin';
import { supabase } from '../../lib/supabase';

const steps = [
  { id: 'create', name: 'Create', description: 'Job title and basic info' },
  { id: 'details', name: 'Details', description: 'Description and requirements' },
  { id: 'advertise', name: 'Advertise', description: 'Select job boards' },
  { id: 'share', name: 'Share', description: 'Get shareable link' },
];

interface JobBoard {
  id: string;
  name: string;
  logo: string;
  enabled: boolean;
  apiKey?: string;
}

const jobBoards: JobBoard[] = [
  { id: 'linkedin', name: 'LinkedIn', logo: '🔗', enabled: true },
  { id: 'indeed', name: 'Indeed', logo: '💼', enabled: true },
  { id: 'glassdoor', name: 'Glassdoor', logo: '🚪', enabled: true },
  { id: 'stackoverflow', name: 'Stack Overflow', logo: '⚡', enabled: true },
  { id: 'seek', name: 'Seek', logo: '🔍', enabled: true },
  { id: 'monster', name: 'Monster', logo: '👾', enabled: true },
];

const employmentTypes = [
  'FULL_TIME',
  'PART_TIME',
  'CONTRACT',
  'TEMPORARY',
  'INTERNSHIP',
  'VOLUNTEER',
  'OTHER',
];

const seniorityLevels = [
  'INTERNSHIP',
  'ENTRY_LEVEL',
  'ASSOCIATE',
  'MID_SENIOR',
  'DIRECTOR',
  'EXECUTIVE',
];

interface FormData {
  title: string;
  department: string;
  location: {
    country: string;
    city: string;
  };
  type: string;
  seniorityLevel: string;
  description: string;
  requirements: string;
  selectedBoards: string[];
  salary: {
    min: string;
    max: string;
    currency: string;
  };
  skills: string[];
  benefits: string[];
}

interface NestedFormData {
  location: { [key: string]: string };
  salary: { [key: string]: string };
}

const CreateJob = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    department: '',
    location: {
      country: '',
      city: '',
    },
    type: 'FULL_TIME',
    seniorityLevel: 'MID_SENIOR',
    description: '',
    requirements: '',
    selectedBoards: [],
    salary: {
      min: '',
      max: '',
      currency: 'USD',
    },
    skills: [],
    benefits: [],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof NestedFormData] as { [key: string]: string }),
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleBoardToggle = (boardId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedBoards: prev.selectedBoards.includes(boardId)
        ? prev.selectedBoards.filter((id) => id !== boardId)
        : [...prev.selectedBoards, boardId],
    }));
  };

  const handleSkillAdd = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
  };

  const handleBenefitAdd = (benefit: string) => {
    if (benefit && !formData.benefits.includes(benefit)) {
      setFormData((prev) => ({
        ...prev,
        benefits: [...prev.benefits, benefit],
      }));
    }
  };

  const validateStep = (step: number): boolean => {
    setError(null);

    switch (step) {
      case 0:
        if (!formData.title || !formData.department || !formData.location.city) {
          setError('Please fill in all required fields');
          return false;
        }
        break;
      case 1:
        if (!formData.description || !formData.requirements) {
          setError('Please provide both description and requirements');
          return false;
        }
        break;
      case 2:
        if (formData.selectedBoards.length === 0) {
          setError('Please select at least one job board');
          return false;
        }
        break;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Create job in database
      const { error: dbError } = await supabase
        .from('jobs')
        .insert({
          title: formData.title,
          department: formData.department,
          location: formData.location,
          type: formData.type,
          seniority_level: formData.seniorityLevel,
          description: formData.description,
          requirements: formData.requirements,
          salary_range: formData.salary,
          skills: formData.skills,
          benefits: formData.benefits,
          job_boards: formData.selectedBoards,
          status: 'active',
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Post to selected job boards
      const postPromises = formData.selectedBoards.map(async (boardId) => {
        if (boardId === 'linkedin') {
          return postJobToLinkedIn({
            jobPostingOperationType: 'CREATE',
            companyId: '123', // Replace with actual company ID
            title: formData.title,
            description: formData.description,
            location: formData.location,
            employmentType: formData.type,
            seniorityLevel: formData.seniorityLevel,
            industries: ['SOFTWARE'],
          });
        }
        // Add other job board APIs here
      });

      await Promise.all(postPromises);

      navigate('/dashboard/jobs');
    } catch (err: any) {
      console.error('Error creating job:', err);
      setError(err.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Create New Job</h1>
        </div>

        {/* Progress Steps */}
        <nav aria-label="Progress">
          <ol className="divide-y divide-gray-300 rounded-md border border-gray-300 md:flex md:divide-y-0">
            {steps.map((step, stepIdx) => (
              <li key={step.name} className="relative md:flex md:flex-1">
                {stepIdx < currentStep ? (
                  <div className="group flex w-full items-center">
                    <span className="flex items-center px-6 py-4 text-sm font-medium">
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-indigo-600">
                        <Check className="h-6 w-6 text-white" />
                      </span>
                      <span className="ml-4 text-sm font-medium text-gray-900">{step.name}</span>
                    </span>
                  </div>
                ) : stepIdx === currentStep ? (
                  <div
                    className="flex items-center px-6 py-4 text-sm font-medium"
                    aria-current="step"
                  >
                    <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-indigo-600">
                      <span className="text-indigo-600">{stepIdx + 1}</span>
                    </span>
                    <span className="ml-4 text-sm font-medium text-indigo-600">{step.name}</span>
                  </div>
                ) : (
                  <div className="group flex items-center">
                    <span className="flex items-center px-6 py-4 text-sm font-medium">
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 border-gray-300">
                        <span className="text-gray-500">{stepIdx + 1}</span>
                      </span>
                      <span className="ml-4 text-sm font-medium text-gray-500">{step.name}</span>
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ol>
        </nav>

        {error && (
          <div className="mt-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">{error}</h3>
              </div>
            </div>
          </div>
        )}

        {/* Form Steps */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow">
          {currentStep === 0 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Job Title*
                </label>
                <input
                  type="text"
                  name="title"
                  id="title"
                  required
                  value={formData.title}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="department" className="block text-sm font-medium text-gray-700">
                  Department*
                </label>
                <input
                  type="text"
                  name="department"
                  id="department"
                  required
                  value={formData.department}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="location.city"
                    className="block text-sm font-medium text-gray-700"
                  >
                    City*
                  </label>
                  <input
                    type="text"
                    name="location.city"
                    id="location.city"
                    required
                    value={formData.location.city}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="location.country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country*
                  </label>
                  <input
                    type="text"
                    name="location.country"
                    id="location.country"
                    required
                    value={formData.location.country}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Employment Type
                </label>
                <select
                  name="type"
                  id="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                >
                  {employmentTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.replace('_', ' ').toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="seniorityLevel" className="block text-sm font-medium text-gray-700">
                  Seniority Level
                </label>
                <select
                  name="seniorityLevel"
                  id="seniorityLevel"
                  value={formData.seniorityLevel}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                >
                  {seniorityLevels.map((level) => (
                    <option key={level} value={level}>
                      {level.replace('_', ' ').toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="salary.min" className="block text-sm font-medium text-gray-700">
                    Minimum Salary
                  </label>
                  <input
                    type="number"
                    name="salary.min"
                    id="salary.min"
                    value={formData.salary.min}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="salary.max" className="block text-sm font-medium text-gray-700">
                    Maximum Salary
                  </label>
                  <input
                    type="number"
                    name="salary.max"
                    id="salary.max"
                    value={formData.salary.max}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Job Description*
                </label>
                <textarea
                  name="description"
                  id="description"
                  rows={6}
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  placeholder="Describe the role, responsibilities, and what success looks like..."
                />
              </div>

              <div>
                <label htmlFor="requirements" className="block text-sm font-medium text-gray-700">
                  Requirements*
                </label>
                <textarea
                  name="requirements"
                  id="requirements"
                  rows={6}
                  required
                  value={formData.requirements}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  placeholder="List the required qualifications, skills, and experience..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Required Skills</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            skills: prev.skills.filter((_, i) => i !== index),
                          }));
                        }}
                        className="ml-2 inline-flex items-center rounded-full p-0.5 text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Add a skill..."
                    className="inline-flex items-center rounded-full border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleSkillAdd((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Benefits</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.benefits.map((benefit, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-800"
                    >
                      {benefit}
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            benefits: prev.benefits.filter((_, i) => i !== index),
                          }));
                        }}
                        className="ml-2 inline-flex items-center rounded-full p-0.5 text-green-400 hover:bg-green-200 hover:text-green-500 focus:outline-none"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    placeholder="Add a benefit..."
                    className="inline-flex items-center rounded-full border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleBenefitAdd((e.target as HTMLInputElement).value);
                        (e.target as HTMLInputElement).value = '';
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <label className="text-sm font-medium text-gray-700">Select Job Boards*</label>
                <p className="mt-1 text-sm text-gray-500">
                  Choose where you want to advertise this position
                </p>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {jobBoards.map((board) => (
                    <div
                      key={board.id}
                      className={`relative flex items-center space-x-3 rounded-lg border p-4 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400 ${
                        formData.selectedBoards.includes(board.id)
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-300'
                      } ${!board.enabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                      onClick={() => board.enabled && handleBoardToggle(board.id)}
                    >
                      <div className="flex-shrink-0 text-2xl">{board.logo}</div>
                      <div className="min-w-0 flex-1">
                        <span className="absolute inset-0" aria-hidden="true" />
                        <p className="text-sm font-medium text-gray-900">{board.name}</p>
                        {!board.enabled && <p className="text-xs text-gray-500">Coming soon</p>}
                      </div>
                      {formData.selectedBoards.includes(board.id) && (
                        <div className="flex-shrink-0 text-indigo-600">
                          <Check className="h-5 w-5" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Review and Share</h3>
                <div className="mt-6 border-t border-gray-200 pt-6">
                  <dl className="divide-y divide-gray-200">
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Job Title</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {formData.title}
                      </dd>
                    </div>
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Department</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {formData.department}
                      </dd>
                    </div>
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Location</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        {formData.location.city}, {formData.location.country}
                      </dd>
                    </div>
                    <div className="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                      <dt className="text-sm font-medium text-gray-500">Job Boards</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                        <div className="flex flex-wrap gap-2">
                          {formData.selectedBoards.map((boardId) => {
                            const board = jobBoards.find((b) => b.id === boardId);
                            return board ? (
                              <span
                                key={board.id}
                                className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-800"
                              >
                                {board.logo} {board.name}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={loading}
              className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg
                    className="-ml-1 mr-3 h-5 w-5 animate-spin text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating job...
                </>
              ) : currentStep === steps.length - 1 ? (
                'Publish Job'
              ) : (
                'Next'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateJob;
