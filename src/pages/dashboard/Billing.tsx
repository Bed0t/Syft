import React from 'react';
import { CreditCard, Download, Clock } from 'lucide-react';

const Billing = () => {
  const invoices = [
    {
      id: 1,
      date: '2024-02-01',
      amount: '$199.00',
      status: 'Paid',
      downloadUrl: '#',
    },
    {
      id: 2,
      date: '2024-01-01',
      amount: '$199.00',
      status: 'Paid',
      downloadUrl: '#',
    },
    {
      id: 3,
      date: '2023-12-01',
      amount: '$199.00',
      status: 'Paid',
      downloadUrl: '#',
    },
  ];

  return (
    <div className="py-6">
<<<<<<< HEAD
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Billing</h1>

        {/* Current Plan */}
        <div className="mt-8 rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
=======
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <h1 className="text-2xl font-semibold text-gray-900">Billing</h1>

        {/* Current Plan */}
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
            <h2 className="text-lg font-medium text-gray-900">Current Plan</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Professional Plan</h3>
                <p className="mt-1 text-sm text-gray-500">
                  $199/month • Up to 15 active job postings
                </p>
              </div>
<<<<<<< HEAD
              <button className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700">
=======
              <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700">
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
                Upgrade Plan
              </button>
            </div>
            <div className="mt-6">
<<<<<<< HEAD
              <div className="rounded-lg bg-gray-50 p-4">
=======
              <div className="bg-gray-50 rounded-lg p-4">
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <CreditCard className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="ml-3">
<<<<<<< HEAD
                    <div className="text-sm font-medium text-gray-900">Visa ending in 4242</div>
                    <div className="text-sm text-gray-500">Expires 12/2024</div>
=======
                    <div className="text-sm font-medium text-gray-900">
                      Visa ending in 4242
                    </div>
                    <div className="text-sm text-gray-500">
                      Expires 12/2024
                    </div>
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
                  </div>
                  <button className="ml-auto text-sm font-medium text-indigo-600 hover:text-indigo-500">
                    Update
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage */}
<<<<<<< HEAD
        <div className="mt-8 rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
=======
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
            <h2 className="text-lg font-medium text-gray-900">Usage</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <div className="text-sm font-medium text-gray-500">Active Jobs</div>
                <div className="mt-1">
                  <div className="text-2xl font-semibold text-gray-900">8/15</div>
<<<<<<< HEAD
                  <div className="mt-1 h-2 rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-indigo-600" style={{ width: '53%' }}></div>
=======
                  <div className="mt-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-indigo-600 rounded-full" style={{ width: '53%' }}></div>
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">AI Interviews</div>
                <div className="mt-1">
                  <div className="text-2xl font-semibold text-gray-900">156/200</div>
<<<<<<< HEAD
                  <div className="mt-1 h-2 rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-indigo-600" style={{ width: '78%' }}></div>
=======
                  <div className="mt-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-indigo-600 rounded-full" style={{ width: '78%' }}></div>
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
                  </div>
                </div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">API Calls</div>
                <div className="mt-1">
                  <div className="text-2xl font-semibold text-gray-900">8.2k/10k</div>
<<<<<<< HEAD
                  <div className="mt-1 h-2 rounded-full bg-gray-200">
                    <div className="h-2 rounded-full bg-indigo-600" style={{ width: '82%' }}></div>
=======
                  <div className="mt-1 h-2 bg-gray-200 rounded-full">
                    <div className="h-2 bg-indigo-600 rounded-full" style={{ width: '82%' }}></div>
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Billing History */}
<<<<<<< HEAD
        <div className="mt-8 rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
=======
        <div className="mt-8 bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
            <h2 className="text-lg font-medium text-gray-900">Billing History</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {invoices.map((invoice) => (
<<<<<<< HEAD
              <div key={invoice.id} className="flex items-center justify-between px-6 py-4">
=======
              <div key={invoice.id} className="px-6 py-4 flex items-center justify-between">
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-900">
                      {new Date(invoice.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="text-sm text-gray-500">{invoice.amount}</div>
                  </div>
                </div>
                <div className="flex items-center">
<<<<<<< HEAD
                  <span className="inline-flex rounded-full bg-green-100 px-2 text-xs font-semibold leading-5 text-green-800">
=======
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
                    {invoice.status}
                  </span>
                  <a
                    href={invoice.downloadUrl}
                    className="ml-4 flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
<<<<<<< HEAD
                    <Download className="mr-1 h-4 w-4" />
=======
                    <Download className="h-4 w-4 mr-1" />
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
                    Download
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

<<<<<<< HEAD
export default Billing;
=======
export default Billing;
>>>>>>> 9e75d840f68ddec40b22b2b8171ed1f9fb1f7b6f
