import React, { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { Search, Filter, MessageSquare, Clock, AlertCircle } from 'lucide-react';

const priorityColors = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

const statusColors = {
  open: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
};

const SupportTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('support_tickets')
        .select(
          `
          *,
          users:user_id (
            email,
            full_name
          ),
          admin_users:assigned_to (
            email
          )
        `
        )
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTickets = tickets.filter((ticket: any) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.users?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.users?.full_name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">Support Tickets</h1>
        <div className="flex space-x-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <button className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
            New Ticket
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-lg">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 leading-5 placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
            placeholder="Search tickets..."
          />
        </div>
      </div>

      {/* Tickets List */}
      <div className="overflow-hidden bg-white shadow sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {loading ? (
            <li className="px-6 py-4 text-center text-gray-500">Loading...</li>
          ) : filteredTickets.length === 0 ? (
            <li className="px-6 py-4 text-center text-gray-500">No tickets found</li>
          ) : (
            filteredTickets.map((ticket: any) => (
              <li key={ticket.id}>
                <div className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                      <p className="ml-3 text-sm font-medium text-gray-900">{ticket.title}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${priorityColors[ticket.priority as keyof typeof priorityColors]}`}
                      >
                        {ticket.priority}
                      </span>
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${statusColors[ticket.status as keyof typeof statusColors]}`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">{ticket.description}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500">
                      <div className="mr-6 flex items-center">
                        <AlertCircle className="mr-1 h-4 w-4" />
                        From: {ticket.users?.full_name || ticket.users?.email}
                      </div>
                      {ticket.admin_users?.email && (
                        <div className="flex items-center">
                          <Users className="mr-1 h-4 w-4" />
                          Assigned to: {ticket.admin_users.email}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="mr-1 h-4 w-4" />
                      {new Date(ticket.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default SupportTickets;
