import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Search, Filter, Building, Users, DollarSign } from 'lucide-react';

const Companies = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      // Group users by company_name and get relevant metrics
      const { data, error } = await supabase
        .from('users')
        .select('company_name, subscription_tier, subscription_status')
        .not('company_name', 'is', null);

      if (error) throw error;

      // Process and aggregate company data
      const companyMap = new Map();
      data.forEach((user: any) => {
        if (!companyMap.has(user.company_name)) {
          companyMap.set(user.company_name, {
            name: user.company_name,
            users: 1,
            subscription_tier: user.subscription_tier,
            status: user.subscription_status,
          });
        } else {
          const company = companyMap.get(user.company_name);
          company.users += 1;
        }
      });

      setCompanies(Array.from(companyMap.values()));
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCompanies = companies.filter((company) =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Companies</h1>
        <button className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
          Add Company
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex justify-between">
        <div className="relative max-w-lg flex-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 leading-5 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="Search companies..."
          />
        </div>
        <button className="ml-4 rounded-md border border-gray-300 p-2 hover:bg-gray-50">
          <Filter className="h-5 w-5 text-gray-400" />
        </button>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full py-4 text-center text-gray-500">Loading...</div>
        ) : filteredCompanies.length === 0 ? (
          <div className="col-span-full py-4 text-center text-gray-500">No companies found</div>
        ) : (
          filteredCompanies.map((company: any) => (
            <div key={company.name} className="rounded-lg bg-white p-6 shadow">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Building className="h-8 w-8 text-gray-400" />
                  <h3 className="ml-2 text-lg font-medium text-gray-900">{company.name}</h3>
                </div>
                <span
                  className={`rounded-full px-2 py-1 text-xs font-semibold ${
                    company.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {company.status}
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Users className="mr-1 h-4 w-4" />
                    Users
                  </div>
                  <p className="mt-1 text-lg font-semibold text-gray-900">{company.users}</p>
                </div>
                <div>
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign className="mr-1 h-4 w-4" />
                    Plan
                  </div>
                  <p className="mt-1 text-lg font-semibold text-gray-900">
                    {company.subscription_tier}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <button className="w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Companies;
