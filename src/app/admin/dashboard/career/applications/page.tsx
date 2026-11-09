'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  FileText,
  Search,
  Download,
  ExternalLink,
  Trash2,
  Calendar,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Briefcase,
  User,
  CheckCircle2,
  Clock,
  XCircle,
  Award,
  X,
  Loader2,
  MessageSquare,
  AlertCircle,
  Eye,
} from 'lucide-react';

interface ApplicationItem {
  id: number;
  job_id: number;
  job_title: string;
  position?: string;
  photo_url: string;
  full_name: string;
  email: string;
  phone: string;
  current_address: string;
  highest_qualification: string;
  institution: string;
  experience_years: string;
  cv_url: string;
  why_join: string;
  status: 'new' | 'reviewing' | 'shortlisted' | 'rejected' | 'hired';
  admin_notes: string | null;
  created_at: string;
}

interface StatusCounts {
  total: number;
  count_new: number;
  count_reviewing: number;
  count_shortlisted: number;
  count_rejected: number;
  count_hired: number;
}

export default function ApplicationsPage() {
  const searchParams = useSearchParams();
  const initialJobId = searchParams.get('job_id') || 'all';

  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [counts, setCounts] = useState<StatusCounts>({
    total: 0,
    count_new: 0,
    count_reviewing: 0,
    count_shortlisted: 0,
    count_rejected: 0,
    count_hired: 0,
  });
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [jobFilter, setJobFilter] = useState<string>(initialJobId);

  // Selected Application for Detail Drawer
  const [selectedApp, setSelectedApp] = useState<ApplicationItem | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (jobFilter !== 'all') params.append('job_id', jobFilter);
      if (search.trim()) params.append('search', search.trim());

      const res = await fetch(`/api/admin/career/applications?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setApplications(data.applications || []);
        if (data.counts) {
          setCounts(data.counts);
        }
      }
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, [statusFilter, jobFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplications();
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/career/applications/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setApplications((prev) =>
          prev.map((app) => (app.id === id ? { ...app, status: newStatus as any } : app))
        );
        if (selectedApp && selectedApp.id === id) {
          setSelectedApp({ ...selectedApp, status: newStatus as any });
        }
        // Update summary counts
        fetchApplications();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedApp) return;
    try {
      setSavingNotes(true);
      const res = await fetch(`/api/admin/career/applications/${selectedApp.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: selectedApp.status,
          admin_notes: adminNotes,
        }),
      });

      if (res.ok) {
        setSelectedApp({ ...selectedApp, admin_notes: adminNotes });
        setApplications((prev) =>
          prev.map((app) => (app.id === selectedApp.id ? { ...app, admin_notes: adminNotes } : app))
        );
      }
    } catch (err) {
      console.error('Error saving notes:', err);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDeleteApplication = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/career/applications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setApplications((prev) => prev.filter((app) => app.id !== id));
        if (selectedApp?.id === id) setSelectedApp(null);
        setDeletingId(null);
        fetchApplications();
      }
    } catch (err) {
      console.error('Error deleting application:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return (
          <span className="px-2.5 py-1 rounded-md bg-[#FF3D00]/15 border border-[#FF3D00]/40 text-[#FF3D00] text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3D00] animate-pulse" />
            <span>New</span>
          </span>
        );
      case 'reviewing':
        return (
          <span className="px-2.5 py-1 rounded-md bg-blue-500/15 border border-blue-500/40 text-blue-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>Reviewing</span>
          </span>
        );
      case 'shortlisted':
        return (
          <span className="px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Shortlisted</span>
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-1 rounded-md bg-red-500/15 border border-red-500/40 text-red-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <XCircle className="w-3 h-3" />
            <span>Rejected</span>
          </span>
        );
      case 'hired':
        return (
          <span className="px-2.5 py-1 rounded-md bg-purple-500/15 border border-purple-500/40 text-purple-400 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
            <Award className="w-3 h-3" />
            <span>Hired</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] text-[10px] font-bold uppercase tracking-wider">
              Recruitment ATS
            </span>
            <span className="text-xs text-slate-400 font-mono">/ Candidate Applications</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            Job Applications
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard/career/jobs"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0E1526] hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider transition-all"
          >
            <Briefcase className="w-3.5 h-3.5 text-[#FF3D00]" />
            <span>Manage Jobs</span>
          </Link>
          <Link
            href="/admin/dashboard/career/create-job"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-[#FF3D00]/25 transition-all"
          >
            <span>+ Create Job</span>
          </Link>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { label: 'All Applications', value: 'all', count: counts.total },
          { label: 'New', value: 'new', count: counts.count_new },
          { label: 'Reviewing', value: 'reviewing', count: counts.count_reviewing },
          { label: 'Shortlisted', value: 'shortlisted', count: counts.count_shortlisted },
          { label: 'Rejected', value: 'rejected', count: counts.count_rejected },
          { label: 'Hired', value: 'hired', count: counts.count_hired },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer flex items-center gap-2 border ${
              statusFilter === tab.value
                ? 'bg-[#FF3D00] text-white border-[#FF3D00] shadow-[0_0_12px_rgba(255,61,0,0.4)]'
                : 'bg-[#0B101D] text-slate-400 hover:text-white border-white/10 hover:border-white/20'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                statusFilter === tab.value ? 'bg-black/40 text-white' : 'bg-white/10 text-slate-300'
              }`}
            >
              {tab.count || 0}
            </span>
          </button>
        ))}
      </div>

      {/* Search & Actions Bar */}
      <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search candidates by name, email, phone, university, or position..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B101D] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#FF3D00] transition-colors"
          />
        </div>

        <button
          type="submit"
          className="px-4 py-2.5 rounded-xl bg-[#0E1526] hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase cursor-pointer"
        >
          Search
        </button>

        {jobFilter !== 'all' && (
          <button
            type="button"
            onClick={() => setJobFilter('all')}
            className="px-3 py-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
          >
            <span>Filtered by Job</span>
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </form>

      {/* Applications Table / Cards */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF3D00] mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Loading candidates...</p>
        </div>
      ) : applications.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0B101D] border border-white/10 space-y-3">
          <FileText className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Applications Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {search || statusFilter !== 'all'
              ? 'No candidate applications match the selected status or query.'
              : 'Candidate applications submitted from the public career portal will appear here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {applications.map((app) => (
            <div
              key={app.id}
              className={`p-4 sm:p-5 rounded-2xl bg-[#0B101D] border transition-all shadow-md hover:shadow-xl ${
                selectedApp?.id === app.id
                  ? 'border-[#FF3D00] ring-1 ring-[#FF3D00]/50'
                  : 'border-white/10 hover:border-white/25'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Candidate Info with Photo */}
                <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                  {/* Photo Thumbnail */}
                  <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-[#070A12] border border-white/15 shrink-0 shadow-md">
                    {app.photo_url ? (
                      <Image
                        src={app.photo_url}
                        alt={app.full_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  {/* Candidate Details */}
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-bold text-white truncate">
                        {app.full_name}
                      </h3>
                      {getStatusBadge(app.status)}
                    </div>

                    <p className="text-xs text-[#FF3D00] font-semibold flex items-center gap-1.5 truncate">
                      <Briefcase className="w-3.5 h-3.5 shrink-0" />
                      <span>Position: {app.position || app.job_title}</span>
                    </p>

                    <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <a href={`mailto:${app.email}`} className="hover:text-white transition-colors">
                          {app.email}
                        </a>
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-500" />
                        <a href={`tel:${app.phone}`} className="hover:text-white transition-colors font-mono">
                          {app.phone}
                        </a>
                      </span>
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3 h-3 text-slate-500" />
                        <span className="truncate">{app.highest_qualification} • {app.institution}</span>
                      </span>
                      <span className="text-slate-500 font-mono text-[11px]">
                        Exp: {app.experience_years}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions & Status Dropdown */}
                <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-white/10">
                  {/* Status Dropdown */}
                  <select
                    value={app.status}
                    onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                    className="px-3 py-2 rounded-xl bg-[#070A12] border border-white/15 text-xs font-bold uppercase text-white focus:outline-none focus:border-[#FF3D00] cursor-pointer"
                  >
                    <option value="new">Status: New</option>
                    <option value="reviewing">Status: Reviewing</option>
                    <option value="shortlisted">Status: Shortlisted</option>
                    <option value="rejected">Status: Rejected</option>
                    <option value="hired">Status: Hired</option>
                  </select>

                  {/* CV Download Button */}
                  <a
                    href={app.cv_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#132247] hover:bg-[#1a2d5c] border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase transition-all shadow-sm"
                    title="Download Applicant CV"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>CV</span>
                  </a>

                  {/* Review Detail Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedApp(app);
                      setAdminNotes(app.admin_notes || '');
                    }}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0E1526] hover:bg-white/10 border border-white/15 text-white text-xs font-bold uppercase transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#FF3D00]" />
                    <span>Review</span>
                  </button>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => setDeletingId(app.id)}
                    className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 transition-all cursor-pointer"
                    title="Delete Application"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CANDIDATE DETAIL REVIEW MODAL / DRAWER */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#0B101D] border border-white/15 rounded-2xl shadow-2xl p-6 space-y-6 my-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-black border border-white/20 shrink-0 shadow-lg">
                  <Image
                    src={selectedApp.photo_url}
                    alt={selectedApp.full_name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{selectedApp.full_name}</h2>
                    {getStatusBadge(selectedApp.status)}
                  </div>
                  <p className="text-xs text-[#FF3D00] font-semibold mt-0.5">
                    Applied for: {selectedApp.job_title}
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 mt-0.5">
                    Submitted on {new Date(selectedApp.created_at).toLocaleString()}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Candidate Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-[#070A12] border border-white/10 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Email Address
                </span>
                <a href={`mailto:${selectedApp.email}`} className="text-slate-200 hover:text-[#FF3D00] font-semibold block break-all">
                  {selectedApp.email}
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-[#070A12] border border-white/10 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Phone Number
                </span>
                <a href={`tel:${selectedApp.phone}`} className="text-slate-200 hover:text-[#FF3D00] font-mono font-bold block">
                  {selectedApp.phone}
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-[#070A12] border border-white/10 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Highest Educational Qualification
                </span>
                <p className="text-slate-200 font-semibold">{selectedApp.highest_qualification}</p>
                <p className="text-slate-400 text-[11px]">{selectedApp.institution}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#070A12] border border-white/10 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Professional Experience
                </span>
                <p className="text-slate-200 font-semibold">{selectedApp.experience_years}</p>
              </div>

              <div className="sm:col-span-2 p-3.5 rounded-xl bg-[#070A12] border border-white/10 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                  Current Residential Address
                </span>
                <p className="text-slate-200">{selectedApp.current_address}</p>
              </div>
            </div>

            {/* Why Join DOER Statement */}
            <div className="p-4 rounded-xl bg-[#070A12] border border-white/10 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Why do you want to join DOER?</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {selectedApp.why_join}
              </p>
            </div>

            {/* CV Action Banner */}
            <div className="p-4 rounded-xl bg-[#0E1B3D] border border-cyan-500/30 flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <FileText className="w-5 h-5 text-cyan-400" />
                <div>
                  <h4 className="text-xs font-bold text-white">Candidate Resume / Curriculum Vitae</h4>
                  <p className="text-[10px] text-slate-400 font-mono">Maximum 5MB PDF/DOC Document</p>
                </div>
              </div>

              <a
                href={selectedApp.cv_url}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider shadow-md shadow-[#FF3D00]/30 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download / Open CV</span>
              </a>
            </div>

            {/* Internal Admin Notes & Hiring Pipeline */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Update Candidate Pipeline Status
                </span>
                <select
                  value={selectedApp.status}
                  onChange={(e) => handleUpdateStatus(selectedApp.id, e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-[#070A12] border border-white/15 text-xs font-bold uppercase text-white focus:outline-none focus:border-[#FF3D00] cursor-pointer"
                >
                  <option value="new">New</option>
                  <option value="reviewing">Under Review</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                  <option value="hired">Hired</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Internal HR &amp; Interview Notes (Private)
                </label>
                <textarea
                  rows={3}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Record interview impressions, technical assessment scores, salary expectations, or follow-up notes..."
                  className="w-full p-3 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs focus:outline-none focus:border-[#FF3D00] leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={savingNotes}
                  className="px-4 py-2 rounded-lg bg-[#0E1526] hover:bg-white/10 border border-white/15 text-white text-xs font-bold uppercase transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {savingNotes ? 'Saving Notes...' : 'Save Private Notes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deletingId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-[#0B101D] border border-red-500/40 rounded-2xl p-6 text-center space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white">Delete Application?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete this candidate&apos;s application record and uploaded CV? This action cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 text-xs font-bold uppercase cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteApplication(deletingId)}
                className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase cursor-pointer shadow-lg"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

