'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  Eye,
  Trash2,
  Download,
  Mail,
  Phone,
  Building2,
  MapPin,
  Calendar,
  X,
  Sparkles,
  Copy,
  Check,
  ChevronDown,
  ArrowUpDown,
  ExternalLink,
  MessageSquare,
} from 'lucide-react';

interface Inquiry {
  id: number;
  full_name: string;
  company_name: string | null;
  email: string;
  phone: string;
  service_interested: string;
  project_location: string | null;
  project_details: string;
  status: 'new' | 'contacted' | 'in_progress' | 'completed';
  created_at: string;
}

export default function EnquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'new' | 'contacted' | 'in_progress' | 'completed'>('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    showToast(`Copied to clipboard: ${text}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Fetch inquiries from API
  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.set('search', searchTerm);
      if (statusFilter !== 'all') queryParams.set('status', statusFilter);

      const res = await fetch(`/api/inquiries?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Failed to load inquiries');
      const data = await res.json();
      setInquiries(data.inquiries || []);
    } catch (err) {
      console.error(err);
      showToast('Error connecting to MySQL database. Please verify connection.');
    } finally {
      setLoading(false);
    }
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    fetchInquiries();
  }, [fetchInquiries]);

  // Update status in MySQL
  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      setUpdatingId(id);
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update status');

      setInquiries((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, status: newStatus as Inquiry['status'] } : item
        )
      );

      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry((prev) =>
          prev ? { ...prev, status: newStatus as Inquiry['status'] } : null
        );
      }

      showToast(`Status updated to "${newStatus.replace('_', ' ').toUpperCase()}" in MySQL`);
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete inquiry
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to permanently remove this inquiry record from MySQL?')) {
      return;
    }

    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete inquiry');

      setInquiries((prev) => prev.filter((item) => item.id !== id));
      if (selectedInquiry?.id === id) setSelectedInquiry(null);

      showToast('Inquiry record deleted from MySQL database');
    } catch (err: any) {
      alert(err.message || 'Error deleting inquiry');
    }
  };

  // Filtered and sorted inquiries
  const filteredInquiries = useMemo(() => {
    let result = [...inquiries];

    // Local Service Filter
    if (serviceFilter !== 'all') {
      result = result.filter((i) =>
        (i.service_interested || '').toLowerCase().includes(serviceFilter.toLowerCase())
      );
    }

    // Sort
    result.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      }
      if (sortBy === 'name') {
        return a.full_name.localeCompare(b.full_name);
      }
      return 0;
    });

    return result;
  }, [inquiries, serviceFilter, sortBy]);

  // Overall counts (independent of current filter)
  const counts = useMemo(() => {
    return {
      all: inquiries.length,
      new: inquiries.filter((i) => i.status === 'new').length,
      contacted: inquiries.filter((i) => i.status === 'contacted').length,
      in_progress: inquiries.filter((i) => i.status === 'in_progress').length,
      completed: inquiries.filter((i) => i.status === 'completed').length,
    };
  }, [inquiries]);

  // Distinct services for filter dropdown
  const uniqueServices = useMemo(() => {
    const set = new Set<string>();
    inquiries.forEach((i) => {
      if (i.service_interested) set.add(i.service_interested);
    });
    return Array.from(set);
  }, [inquiries]);

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredInquiries.length === 0) {
      showToast('No records to export');
      return;
    }
    const headers = [
      'Inquiry ID',
      'Client Name',
      'Company Name',
      'Email Address',
      'Phone Number',
      'Service Required',
      'Project Location',
      'Status',
      'Submission Date',
      'Project Details / Scope',
    ];
    const rows = filteredInquiries.map((i) => [
      i.id,
      `"${(i.full_name || '').replace(/"/g, '""')}"`,
      `"${(i.company_name || '').replace(/"/g, '""')}"`,
      `"${(i.email || '').replace(/"/g, '""')}"`,
      `"${(i.phone || '').replace(/"/g, '""')}"`,
      `"${(i.service_interested || '').replace(/"/g, '""')}"`,
      `"${(i.project_location || '').replace(/"/g, '""')}"`,
      i.status,
      `"${new Date(i.created_at).toLocaleString()}"`,
      `"${(i.project_details || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,\uFEFF' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `doer-enquiries-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${filteredInquiries.length} enquiries to CSV`);
  };

  const getStatusBadge = (status: Inquiry['status']) => {
    switch (status) {
      case 'new':
        return {
          pill: 'bg-red-500/10 text-red-400 border-red-500/30',
          dot: 'bg-red-500',
          label: 'New Lead',
        };
      case 'contacted':
        return {
          pill: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
          dot: 'bg-blue-400',
          label: 'Contacted',
        };
      case 'in_progress':
        return {
          pill: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-400',
          label: 'In Progress',
        };
      case 'completed':
        return {
          pill: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-400',
          label: 'Completed',
        };
      default:
        return {
          pill: 'bg-slate-800 text-slate-300 border-slate-700',
          dot: 'bg-slate-400',
          label: status,
        };
    }
  };

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-[#FF3D00] text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-3 duration-200 max-w-md">
          <div className="w-2 h-2 rounded-full bg-[#FF3D00] animate-ping" />
          <span className="text-xs font-medium">{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-auto text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF3D00]/10 border border-[#FF3D00]/20 text-[#FF3D00] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DOER Client Lead Management</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <span>Website Enquiries</span>
            {counts.new > 0 && (
              <span className="text-xs font-bold px-2.5 py-1 bg-[#FF3D00] text-white rounded-full shadow-md shadow-[#FF3D00]/30 animate-pulse">
                {counts.new} New
              </span>
            )}
          </h1>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Review, track, and respond to commercial fit-out, residential, and custom fabrication enquiries submitted via the DOER website.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => fetchInquiries()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-[#FF3D00]' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF3D00] hover:bg-[#e63700] text-white rounded-lg text-xs font-bold shadow-md shadow-[#FF3D00]/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Status KPI Tabs Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {/* All Tab */}
        <button
          onClick={() => setStatusFilter('all')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'all'
              ? 'bg-slate-900 border-[#FF3D00] shadow-md shadow-[#FF3D00]/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-slate-400">
            <span>All Leads</span>
            <Inbox className="w-4 h-4 text-slate-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-white">{counts.all}</div>
        </button>

        {/* New Leads */}
        <button
          onClick={() => setStatusFilter('new')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'new'
              ? 'bg-slate-900 border-red-500 shadow-md shadow-red-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-red-400">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              New Leads
            </span>
            <AlertCircle className="w-4 h-4 text-red-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-red-400">{counts.new}</div>
        </button>

        {/* Contacted */}
        <button
          onClick={() => setStatusFilter('contacted')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'contacted'
              ? 'bg-slate-900 border-blue-500 shadow-md shadow-blue-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-blue-400">
            <span>Contacted</span>
            <Phone className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-blue-400">{counts.contacted}</div>
        </button>

        {/* In Progress */}
        <button
          onClick={() => setStatusFilter('in_progress')}
          className={`p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'in_progress'
              ? 'bg-slate-900 border-amber-500 shadow-md shadow-amber-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-amber-400">
            <span>In Progress</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-amber-400">{counts.in_progress}</div>
        </button>

        {/* Completed */}
        <button
          onClick={() => setStatusFilter('completed')}
          className={`col-span-2 sm:col-span-1 p-3.5 rounded-xl border text-left transition-all ${
            statusFilter === 'completed'
              ? 'bg-slate-900 border-emerald-500 shadow-md shadow-emerald-500/10'
              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-emerald-400">
            <span>Completed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-emerald-400">{counts.completed}</div>
        </button>
      </div>

      {/* Control Filter Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-3 shadow-md">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search name, company, email, phone..."
            className="w-full pl-9 pr-8 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#FF3D00] focus:border-[#FF3D00]"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Service Filter */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
            <span className="text-slate-500 text-[11px] font-semibold uppercase">Service:</span>
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none font-medium text-xs cursor-pointer"
            >
              <option value="all">All Services</option>
              {uniqueServices.map((svc) => (
                <option key={svc} value={svc}>
                  {svc}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-xs">
            <ArrowUpDown className="w-3 h-3 text-slate-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-200 focus:outline-none font-medium text-xs cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Client Name (A-Z)</option>
            </select>
          </div>

          <span className="text-xs text-slate-400 ml-auto md:ml-2">
            Showing <strong className="text-white">{filteredInquiries.length}</strong> inquiries
          </span>
        </div>
      </div>

      {/* Main Content: Desktop Table + Mobile Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Loading state */}
        {loading && inquiries.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <div className="inline-flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-[#FF3D00] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-medium">Fetching enquiries from MySQL...</span>
            </div>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <Inbox className="w-10 h-10 mx-auto mb-3 text-slate-600" />
            <h3 className="text-base font-semibold text-white">No Enquiries Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {searchTerm || statusFilter !== 'all' || serviceFilter !== 'all'
                ? 'No inquiries match your current filters. Try clearing the search or status filter.'
                : 'When prospective clients submit contact requests through the website, they will appear here.'}
            </p>
            {(searchTerm || statusFilter !== 'all' || serviceFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setServiceFilter('all');
                }}
                className="mt-4 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-lg transition-colors"
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop Table View (Hidden on mobile) */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/70 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-5">Lead / Client</th>
                    <th className="py-4 px-5">Contact Details</th>
                    <th className="py-4 px-5">Service & Scope</th>
                    <th className="py-4 px-5">Status</th>
                    <th className="py-4 px-5">Received</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 text-sm">
                  {filteredInquiries.map((inquiry) => {
                    const badge = getStatusBadge(inquiry.status);
                    const initials = inquiry.full_name
                      ? inquiry.full_name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase()
                      : 'CL';

                    return (
                      <tr
                        key={inquiry.id}
                        className="hover:bg-slate-800/40 transition-colors group"
                      >
                        {/* Client Info */}
                        <td className="py-4 px-5">
                          <div className="flex items-start gap-3">
                            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                              {initials}
                            </div>
                            <div>
                              <div className="font-semibold text-white text-sm flex items-center gap-1.5">
                                <span>{inquiry.full_name}</span>
                                {inquiry.status === 'new' && (
                                  <span className="w-2 h-2 rounded-full bg-[#FF3D00] animate-ping" />
                                )}
                              </div>
                              {inquiry.company_name ? (
                                <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                  <Building2 className="w-3 h-3 text-slate-500" />
                                  <span>{inquiry.company_name}</span>
                                </div>
                              ) : (
                                <span className="text-[11px] text-slate-500 italic">Individual client</span>
                              )}
                              {inquiry.project_location && (
                                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                                  <MapPin className="w-3 h-3 text-[#FF3D00]" />
                                  <span>{inquiry.project_location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Contact Info */}
                        <td className="py-4 px-5 text-xs space-y-1.5">
                          <div className="flex items-center gap-2 text-slate-300">
                            <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <a
                              href={`mailto:${inquiry.email}`}
                              className="hover:text-[#FF3D00] font-medium transition-colors truncate max-w-[180px]"
                              title={inquiry.email}
                            >
                              {inquiry.email}
                            </a>
                            <button
                              onClick={() => copyToClipboard(inquiry.email, `email-${inquiry.id}`)}
                              className="text-slate-500 hover:text-white"
                              title="Copy email"
                            >
                              {copiedKey === `email-${inquiry.id}` ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>

                          <div className="flex items-center gap-2 text-slate-400">
                            <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                            <a
                              href={`tel:${inquiry.phone}`}
                              className="hover:text-white font-medium transition-colors"
                            >
                              {inquiry.phone}
                            </a>
                            <button
                              onClick={() => copyToClipboard(inquiry.phone, `phone-${inquiry.id}`)}
                              className="text-slate-500 hover:text-white"
                              title="Copy phone"
                            >
                              {copiedKey === `phone-${inquiry.id}` ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        </td>

                        {/* Service & Scope */}
                        <td className="py-4 px-5 max-w-xs">
                          <div className="inline-block px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-800 text-slate-200 border border-slate-700/80 mb-1">
                            {inquiry.service_interested}
                          </div>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            {inquiry.project_details}
                          </p>
                        </td>

                        {/* Status Dropdown */}
                        <td className="py-4 px-5">
                          <div className="relative inline-block">
                            <select
                              disabled={updatingId === inquiry.id}
                              value={inquiry.status}
                              onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                              className={`text-xs font-bold pl-2.5 pr-7 py-1 rounded-full border bg-slate-950 focus:outline-none cursor-pointer appearance-none ${badge.pill}`}
                            >
                              <option value="new">● New Lead</option>
                              <option value="contacted">● Contacted</option>
                              <option value="in_progress">● In Progress</option>
                              <option value="completed">● Completed</option>
                            </select>
                            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </td>

                        {/* Date */}
                        <td className="py-4 px-5 text-xs text-slate-400 whitespace-nowrap">
                          <div className="text-white font-medium">
                            {formatRelativeTime(inquiry.created_at)}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {new Date(inquiry.created_at).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => setSelectedInquiry(inquiry)}
                              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                              title="View Full Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <a
                              href={`mailto:${inquiry.email}?subject=Regarding Your Inquiry with DOER`}
                              className="p-2 text-slate-400 hover:text-[#FF3D00] hover:bg-[#FF3D00]/10 rounded-lg transition-colors"
                              title="Send Email"
                            >
                              <Mail className="w-4 h-4" />
                            </a>
                            <a
                              href={`tel:${inquiry.phone}`}
                              className="p-2 text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors"
                              title="Call Client"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                            <button
                              onClick={() => handleDelete(inquiry.id)}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                              title="Delete Record"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View (Displayed on screens < lg) */}
            <div className="lg:hidden divide-y divide-slate-800">
              {filteredInquiries.map((inquiry) => {
                const badge = getStatusBadge(inquiry.status);

                return (
                  <div key={inquiry.id} className="p-4 space-y-3 hover:bg-slate-800/30 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-white text-base flex items-center gap-2">
                          <span>{inquiry.full_name}</span>
                          {inquiry.status === 'new' && (
                            <span className="w-2 h-2 rounded-full bg-[#FF3D00] animate-pulse" />
                          )}
                        </div>
                        {inquiry.company_name && (
                          <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-500" />
                            <span>{inquiry.company_name}</span>
                          </div>
                        )}
                      </div>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badge.pill}`}>
                        {badge.label}
                      </span>
                    </div>

                    <div className="text-xs space-y-1 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800/60">
                      <div className="flex items-center gap-2 text-slate-300">
                        <Mail className="w-3.5 h-3.5 text-[#FF3D00]" />
                        <a href={`mailto:${inquiry.email}`} className="hover:text-white truncate">
                          {inquiry.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <Phone className="w-3.5 h-3.5 text-slate-500" />
                        <a href={`tel:${inquiry.phone}`} className="hover:text-white">
                          {inquiry.phone}
                        </a>
                      </div>
                      {inquiry.project_location && (
                        <div className="flex items-center gap-2 text-slate-400">
                          <MapPin className="w-3.5 h-3.5 text-slate-500" />
                          <span>{inquiry.project_location}</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <span className="inline-block px-2 py-0.5 bg-slate-800 text-slate-200 text-[11px] font-semibold rounded mb-1 border border-slate-700/60">
                        {inquiry.service_interested}
                      </span>
                      <p className="text-xs text-slate-300 line-clamp-2">{inquiry.project_details}</p>
                    </div>

                    <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-800/60">
                      <span className="text-slate-500 text-[11px]">
                        {formatRelativeTime(inquiry.created_at)}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedInquiry(inquiry)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleDelete(inquiry.id)}
                          className="p-1.5 text-slate-400 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Comprehensive Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200 my-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#FF3D00]">
                    Inquiry #{selectedInquiry.id}
                  </span>
                  <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(selectedInquiry.status).pill}`}>
                    {getStatusBadge(selectedInquiry.status).label}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">
                  {selectedInquiry.full_name}
                </h3>
                {selectedInquiry.company_name && (
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>{selectedInquiry.company_name}</span>
                  </p>
                )}
              </div>
              <button
                onClick={() => setSelectedInquiry(null)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions Bar */}
            <div className="flex flex-wrap items-center gap-2.5 p-3 bg-slate-950 rounded-xl border border-slate-800/80">
              <a
                href={`tel:${selectedInquiry.phone}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Client</span>
              </a>

              <a
                href={`mailto:${selectedInquiry.email}?subject=Regarding Your DOER Interior Inquiry`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF3D00] hover:bg-[#e63700] text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Send Email</span>
              </a>

              <button
                onClick={() =>
                  copyToClipboard(
                    `DOER LEAD #${selectedInquiry.id}\nName: ${selectedInquiry.full_name}\nCompany: ${selectedInquiry.company_name || 'N/A'}\nEmail: ${selectedInquiry.email}\nPhone: ${selectedInquiry.phone}\nService: ${selectedInquiry.service_interested}\nLocation: ${selectedInquiry.project_location || 'N/A'}\nDetails: ${selectedInquiry.project_details}`,
                    'full-lead'
                  )
                }
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors ml-auto"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Summary</span>
              </button>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                  Email Address
                </span>
                <div className="flex items-center justify-between">
                  <a
                    href={`mailto:${selectedInquiry.email}`}
                    className="text-white hover:text-[#FF3D00] font-medium flex items-center gap-1.5 truncate"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#FF3D00] shrink-0" />
                    <span>{selectedInquiry.email}</span>
                  </a>
                  <button
                    onClick={() => copyToClipboard(selectedInquiry.email, 'modal-email')}
                    className="text-slate-500 hover:text-white ml-2"
                  >
                    {copiedKey === 'modal-email' ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                  Phone Number
                </span>
                <div className="flex items-center justify-between">
                  <a
                    href={`tel:${selectedInquiry.phone}`}
                    className="text-white hover:text-[#FF3D00] font-medium flex items-center gap-1.5"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#FF3D00] shrink-0" />
                    <span>{selectedInquiry.phone}</span>
                  </a>
                  <button
                    onClick={() => copyToClipboard(selectedInquiry.phone, 'modal-phone')}
                    className="text-slate-500 hover:text-white ml-2"
                  >
                    {copiedKey === 'modal-phone' ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                  Service Interested In
                </span>
                <span className="text-white font-medium">
                  {selectedInquiry.service_interested}
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80">
                <span className="text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                  Project Location
                </span>
                <span className="text-white font-medium flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedInquiry.project_location || 'Not specified'}</span>
                </span>
              </div>
            </div>

            {/* Project Details */}
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block mb-2">
                Project Requirements & Description:
              </span>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto select-text">
                {selectedInquiry.project_details}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Submitted: {new Date(selectedInquiry.created_at).toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <span className="text-slate-400 text-xs">Update Status:</span>
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold py-2 px-3 text-white focus:outline-none cursor-pointer"
                >
                  <option value="new">● New</option>
                  <option value="contacted">● Contacted</option>
                  <option value="in_progress">● In Progress</option>
                  <option value="completed">● Completed</option>
                </select>

                <button
                  onClick={() => handleDelete(selectedInquiry.id)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded-lg transition-colors"
                  title="Delete Inquiry"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

