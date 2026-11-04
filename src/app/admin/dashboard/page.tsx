'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
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
  ArrowUpRight,
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

export default function AdminDashboardPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchInquiries = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.set('search', searchTerm);
      if (statusFilter && statusFilter !== 'all') queryParams.set('status', statusFilter);

      const res = await fetch(`/api/inquiries?${queryParams.toString()}`);
      if (!res.ok) throw new Error('Failed to load inquiries');
      const data = await res.json();
      setInquiries(data.inquiries || []);
    } catch (err) {
      console.error(err);
      setActionMessage('Failed to fetch inquiries. Please check MySQL connection.');
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
          item.id === id ? { ...item, status: newStatus as any } : item
        )
      );

      if (selectedInquiry && selectedInquiry.id === id) {
        setSelectedInquiry((prev) => (prev ? { ...prev, status: newStatus as any } : null));
      }

      setActionMessage('Status updated successfully in MySQL');
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error updating status');
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete inquiry
  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this inquiry record?')) return;

    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete inquiry');

      setInquiries((prev) => prev.filter((item) => item.id !== id));
      if (selectedInquiry?.id === id) setSelectedInquiry(null);

      setActionMessage('Inquiry deleted from database');
      setTimeout(() => setActionMessage(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Error deleting inquiry');
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (inquiries.length === 0) return;
    const headers = ['ID', 'Name', 'Company', 'Email', 'Phone', 'Service', 'Location', 'Status', 'Date', 'Details'];
    const rows = inquiries.map((i) => [
      i.id,
      `"${(i.full_name || '').replace(/"/g, '""')}"`,
      `"${(i.company_name || '').replace(/"/g, '""')}"`,
      `"${(i.email || '').replace(/"/g, '""')}"`,
      `"${(i.phone || '').replace(/"/g, '""')}"`,
      `"${(i.service_interested || '').replace(/"/g, '""')}"`,
      `"${(i.project_location || '').replace(/"/g, '""')}"`,
      i.status,
      new Date(i.created_at).toLocaleString(),
      `"${(i.project_details || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `doer-inquiries-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Stats calculation
  const totalInquiries = inquiries.length;
  const newInquiries = inquiries.filter((i) => i.status === 'new').length;
  const inProgressInquiries = inquiries.filter((i) => i.status === 'in_progress' || i.status === 'contacted').length;
  const completedInquiries = inquiries.filter((i) => i.status === 'completed').length;

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF3D00]/10 border border-[#FF3D00]/20 text-[#FF3D00] text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>DOER Project & Inquiry Management</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Administrative Dashboard
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Real-time inquiries, project leads, and client requirements stored in MySQL.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchInquiries()}
            className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-200 rounded-lg text-sm font-medium transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#FF3D00]' : ''}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF3D00] hover:bg-[#e63700] text-white rounded-lg text-sm font-semibold shadow-sm transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-slate-900 border border-[#FF3D00]/40 text-[#FF3D00] text-xs font-medium rounded-lg flex items-center justify-between animate-in fade-in">
          <span>{actionMessage}</span>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {newInquiries > 0 && (
        <div className="p-4 bg-gradient-to-r from-[#FF3D00]/15 via-slate-900 to-slate-900 border border-[#FF3D00]/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF3D00] animate-ping shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">
                You have {newInquiries} new website {newInquiries === 1 ? 'enquiry' : 'enquiries'} waiting for review
              </p>
              <p className="text-xs text-slate-400">
                Prospective clients have submitted project briefs through the contact form.
              </p>
            </div>
          </div>
          <Link
            href="/admin/dashboard/enquiries"
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#FF3D00] hover:bg-[#e63700] text-white text-xs font-bold rounded-lg shadow-sm transition-colors shrink-0"
          >
            <span>Open Enquiries Center</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inquiries */}
        <Link
          href="/admin/dashboard/enquiries"
          className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-[#FF3D00]/60 transition-all group block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-slate-300">
              Total Inquiries
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Inbox className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-white">{totalInquiries}</span>
            <span className="text-xs text-slate-500 group-hover:text-[#FF3D00] flex items-center gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </Link>

        {/* New / Pending */}
        <Link
          href="/admin/dashboard/enquiries"
          className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-red-500/60 transition-all group block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-slate-300">
              New Leads
            </span>
            <div className="w-9 h-9 rounded-lg bg-[#FF3D00]/10 text-[#FF3D00] flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-[#FF3D00]">{newInquiries}</span>
            <span className="text-xs text-slate-500 group-hover:text-[#FF3D00] flex items-center gap-1">
              Review new <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </Link>

        {/* In Progress */}
        <Link
          href="/admin/dashboard/enquiries"
          className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-amber-500/60 transition-all group block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-slate-300">
              In Progress / Contacted
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-amber-400">{inProgressInquiries}</span>
            <span className="text-xs text-slate-500 group-hover:text-amber-400 flex items-center gap-1">
              Active leads <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </Link>

        {/* Completed */}
        <Link
          href="/admin/dashboard/enquiries"
          className="bg-slate-900 border border-slate-800 rounded-xl p-5 hover:border-emerald-500/60 transition-all group block"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 group-hover:text-slate-300">
              Converted / Completed
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-3xl font-extrabold text-emerald-400">{completedInquiries}</span>
            <span className="text-xs text-slate-500 group-hover:text-emerald-400 flex items-center gap-1">
              Finalized <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </Link>
      </div>

      {/* Main Table Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Table Top Header with link to dedicated Enquiries */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span>Website Enquiries</span>
              <span className="text-[11px] font-normal text-slate-400">({inquiries.length} total)</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Quick overview of website leads directly from MySQL</p>
          </div>
          <Link
            href="/admin/dashboard/enquiries"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FF3D00] hover:bg-[#e63700] text-xs font-bold text-white transition-all shadow-sm shadow-[#FF3D00]/20"
          >
            <span>Full Enquiries Manager</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        {/* Table Filters & Search Bar */}
        <div className="p-5 border-b border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name, company, email, service..."
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#FF3D00] focus:border-[#FF3D00]"
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span>Filter Status:</span>
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg text-xs font-medium text-slate-200 py-2 px-3 focus:outline-none focus:ring-1 focus:ring-[#FF3D00]"
            >
              <option value="all">All Inquiries</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>

        {/* Inquiries Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 px-4">Client / Company</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Service Required</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Submitted Date</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {loading && inquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="inline-flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#FF3D00] border-t-transparent rounded-full animate-spin" />
                      <span>Loading inquiries from MySQL...</span>
                    </div>
                  </td>
                </tr>
              ) : inquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Inbox className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <p className="font-medium text-slate-400">No inquiries found</p>
                    <p className="text-xs mt-1">When prospective clients fill out the contact form, submissions appear here.</p>
                  </td>
                </tr>
              ) : (
                inquiries.map((inquiry) => {
                  const statusColors: Record<string, string> = {
                    new: 'bg-red-500/10 text-red-400 border-red-500/30',
                    contacted: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
                    in_progress: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
                    completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
                  };

                  return (
                    <tr
                      key={inquiry.id}
                      className="hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Name & Company */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-white">
                          {inquiry.full_name}
                        </div>
                        {inquiry.company_name ? (
                          <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <Building2 className="w-3 h-3 text-slate-500" />
                            <span>{inquiry.company_name}</span>
                          </div>
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">Individual client</span>
                        )}
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 text-xs space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <a href={`mailto:${inquiry.email}`} className="hover:text-[#FF3D00] transition-colors">
                            {inquiry.email}
                          </a>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <a href={`tel:${inquiry.phone}`} className="hover:text-white transition-colors">
                            {inquiry.phone}
                          </a>
                        </div>
                      </td>

                      {/* Service */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-medium text-slate-200 bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700/60 inline-block">
                          {inquiry.service_interested}
                        </span>
                        {inquiry.project_location && (
                          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3 text-slate-500" />
                            <span>{inquiry.project_location}</span>
                          </div>
                        )}
                      </td>

                      {/* Status Dropdown */}
                      <td className="py-3.5 px-4">
                        <select
                          disabled={updatingId === inquiry.id}
                          value={inquiry.status}
                          onChange={(e) => handleStatusChange(inquiry.id, e.target.value)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full border bg-slate-950 focus:outline-none cursor-pointer ${
                            statusColors[inquiry.status] || 'text-slate-300 border-slate-700'
                          }`}
                        >
                          <option value="new">● New</option>
                          <option value="contacted">● Contacted</option>
                          <option value="in_progress">● In Progress</option>
                          <option value="completed">● Completed</option>
                        </select>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-xs text-slate-400">
                        {new Date(inquiry.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedInquiry(inquiry)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-md transition-colors"
                            title="View Full Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(inquiry.id)}
                            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-950/40 rounded-md transition-colors"
                            title="Delete Inquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiry Detail Drawer / Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-[#FF3D00]">
                  Inquiry #{selectedInquiry.id}
                </span>
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
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
                <span className="text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                  Email Address
                </span>
                <a
                  href={`mailto:${selectedInquiry.email}`}
                  className="text-white hover:text-[#FF3D00] font-medium flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#FF3D00]" />
                  <span>{selectedInquiry.email}</span>
                </a>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
                <span className="text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                  Phone Number
                </span>
                <a
                  href={`tel:${selectedInquiry.phone}`}
                  className="text-white hover:text-[#FF3D00] font-medium flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5 text-[#FF3D00]" />
                  <span>{selectedInquiry.phone}</span>
                </a>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
                <span className="text-slate-500 uppercase tracking-wider font-semibold block mb-1">
                  Service Interested In
                </span>
                <span className="text-white font-medium">
                  {selectedInquiry.service_interested}
                </span>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
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
                Project Requirements & Details:
              </span>
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-sm text-slate-200 leading-relaxed whitespace-pre-wrap max-h-56 overflow-y-auto">
                {selectedInquiry.project_details}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Submitted: {new Date(selectedInquiry.created_at).toLocaleString()}</span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  value={selectedInquiry.status}
                  onChange={(e) => handleStatusChange(selectedInquiry.id, e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold py-2 px-3 text-white focus:outline-none"
                >
                  <option value="new">Status: New</option>
                  <option value="contacted">Status: Contacted</option>
                  <option value="in_progress">Status: In Progress</option>
                  <option value="completed">Status: Completed</option>
                </select>

                <a
                  href={`mailto:${selectedInquiry.email}?subject=Regarding Your Inquiry at DOER Interior`}
                  className="px-4 py-2 bg-[#FF3D00] hover:bg-[#e63700] text-white font-semibold rounded-lg text-xs transition-colors"
                >
                  Reply via Email
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

