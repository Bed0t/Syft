import React, { useState } from 'react';
import { Save } from 'lucide-react';

const Settings = () => {
  const [formData, setFormData] = useState({
    companyName: 'Acme Inc.',
    email: 'admin@acme.com',
    notifications: {
      email: true,
      desktop: true,
      mobile: false,
    },
    jobBoards: {
      linkedin: true,
      indeed: true,
      glassdoor: false,
      stackoverflow: true,
    },
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    if (type === 'checkbox') {
      if (name.startsWith('notifications.')) {
        const notificationKey = name.split('.')[1];
        setFormData((prev) => ({
          ...prev,
          notifications: {
            ...prev.notifications,
            [notificationKey]: checked,
          },
        }));
      } else if (name.startsWith('jobBoards.')) {
        const boardKey = name.split('.')[1];
        setFormData((prev) => ({
          ...prev,
          jobBoards: {
            ...prev.jobBoards,
            [boardKey]: checked,
          },
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle settings update
    console.log('Settings updated:', formData);
  };

  return (
    <div className="py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>

        <div className="mt-8">
          <form onSubmit={handleSubmit}>
            {/* Company Settings */}
            <div className="rounded-lg bg-white shadow">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">Company Settings</h2>
              </div>
              <div className="space-y-6 p-6">
                <div>
                  <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Company Name
                  </label>
                  <input
                    type="text"
                    name="companyName"
                    id="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Admin Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="mt-8 rounded-lg bg-white shadow">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">Notification Settings</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="notifications.email"
                      id="notifications.email"
                      checked={formData.notifications.email}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="notifications.email" className="ml-3 text-sm text-gray-700">
                      Email Notifications
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="notifications.desktop"
                      id="notifications.desktop"
                      checked={formData.notifications.desktop}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="notifications.desktop" className="ml-3 text-sm text-gray-700">
                      Desktop Notifications
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="notifications.mobile"
                      id="notifications.mobile"
                      checked={formData.notifications.mobile}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="notifications.mobile" className="ml-3 text-sm text-gray-700">
                      Mobile Notifications
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Job Board Integration */}
            <div className="mt-8 rounded-lg bg-white shadow">
              <div className="border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">Job Board Integration</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="jobBoards.linkedin"
                      id="jobBoards.linkedin"
                      checked={formData.jobBoards.linkedin}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="jobBoards.linkedin" className="ml-3 text-sm text-gray-700">
                      LinkedIn
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="jobBoards.indeed"
                      id="jobBoards.indeed"
                      checked={formData.jobBoards.indeed}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="jobBoards.indeed" className="ml-3 text-sm text-gray-700">
                      Indeed
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="jobBoards.glassdoor"
                      id="jobBoards.glassdoor"
                      checked={formData.jobBoards.glassdoor}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="jobBoards.glassdoor" className="ml-3 text-sm text-gray-700">
                      Glassdoor
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="jobBoards.stackoverflow"
                      id="jobBoards.stackoverflow"
                      checked={formData.jobBoards.stackoverflow}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <label htmlFor="jobBoards.stackoverflow" className="ml-3 text-sm text-gray-700">
                      Stack Overflow
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
