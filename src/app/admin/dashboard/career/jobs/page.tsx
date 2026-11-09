'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  UserPlus,
  Search,
  Share2,
  Copy,
  Check,
  Eye,
  Trash2,
  Calendar,
  FileText,
  Loader2,
  ExternalLink,
  Edit,
  X,
  Sparkles,
} from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface JobItem {
  id: number;
  title: string;
  position?: string;
  slug: string;
  job_type: 'Full-Time' | 'Part-Time' | 'Internship' | 'Contractual';
  details: string;
  deadline: string | null;
  is_active: number;
  created_at: string;
  applications_count: number;
  new_applications_count: number;
}

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Edit Job Modal State
  const [editingJob, setEditingJob] = useState<JobItem | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPosition, setEditPosition] = useState('');
  const [editType, setEditType] = useState<'Full-Time' | 'Part-Time' | 'Internship' | 'Contractual'>('Full-Time');
  const [editDetails, setEditDetails] = useState('');
  const [editDeadline, setEditDeadline] = useState('');
  const [editActive, setEditActive] = useState(true);
  const [savingEdit, setSavingEdit] = useState(false);

  // Delete Confirmation State
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/career/jobs');
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleToggleActive = async (job: JobItem) => {
    const nextStatus = job.is_active === 1 ? 0 : 1;
    // Optimistic UI update
    setJobs((prev) =>
      prev.map((j) => (j.id === job.id ? { ...j, is_active: nextStatus } : j))
    );

    try {
      await fetch(`/api/admin/career/jobs/${job.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toggle_active: true, is_active: nextStatus === 1 }),
      });
    } catch (err) {
      console.error('Error toggling job status:', err);
      fetchJobs();
    }
  };

  const handleCopyShareLink = (job: JobItem) => {
    const url = `${window.location.origin}/career/${job.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(job.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const openEditModal = (job: JobItem) => {
    setEditingJob(job);
    setEditTitle(job.title);
    setEditPosition(job.position || job.title);
    setEditType(job.job_type);
    setEditDetails(job.details);
    setEditDeadline(job.deadline ? job.deadline.split('T')[0] : '');
    setEditActive(job.is_active === 1);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJob) return;

    try {
      setSavingEdit(true);
      const res = await fetch(`/api/admin/career/jobs/${editingJob.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle.trim(),
          position: editPosition.trim() || editTitle.trim(),
          job_type: editType,
          details: editDetails,
          deadline: editDeadline || null,
          is_active: editActive,
        }),
      });

      if (res.ok) {
        setEditingJob(null);
        fetchJobs();
      }
    } catch (err) {
      console.error('Error updating job:', err);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteJob = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/career/jobs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setJobs((prev) => prev.filter((j) => j.id !== id));
        setDeletingId(null);
      }
    } catch (err) {
      console.error('Error deleting job:', err);
    }
  };

  const filteredJobs = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.job_type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] text-[10px] font-bold uppercase tracking-wider">
              Recruitment ATS
            </span>
            <span className="text-xs text-slate-400 font-mono">/ Job Openings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
            All Job Positions
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/career"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#0E1526] hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold uppercase transition-all"
          >
            <span>Public Career Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#FF3D00]" />
          </Link>

          <Link
            href="/admin/dashboard/career/create-job"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] active:scale-95 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,61,0,0.4)] transition-all cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>+ Create Job</span>
          </Link>
        </div>
      </div>

      {/* Search Bar & Summary */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search positions by title or type..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#0B101D] border border-white/10 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#FF3D00] transition-colors"
          />
        </div>

        <div className="text-xs font-mono text-slate-400 flex items-center gap-2">
          <span>Total Positions:</span>
          <span className="px-2 py-0.5 rounded-md bg-[#0E1526] text-white font-bold border border-white/10">
            {jobs.length}
          </span>
        </div>
      </div>

      {/* Jobs Listing */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF3D00] mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Loading positions...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0B101D] border border-white/10 space-y-4">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Job Positions Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {search ? 'No job positions match your search query.' : 'Create your first job opening to start receiving candidate applications.'}
          </p>
          <Link
            href="/admin/dashboard/career/create-job"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF3D00] text-white text-xs font-bold uppercase"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Position</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredJobs.map((job) => {
            const isCopied = copiedId === job.id;
            const isLive = job.is_active === 1;

            return (
              <div
                key={job.id}
                className={`p-5 rounded-2xl bg-[#0B101D] border transition-all space-y-4 shadow-lg ${
                  isLive ? 'border-white/10 hover:border-[#FF3D00]/50' : 'border-white/5 opacity-70'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Title & Metadata */}
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] text-[10px] font-bold uppercase tracking-wider">
                        Position: {job.position || job.title}
                      </span>

                      <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
                        {job.job_type}
                      </span>

                      {job.deadline ? (
                        <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#FF3D00]" />
                          <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                        </span>
                      ) : (
                        <span className="text-[11px] font-mono text-slate-500">Continuous Opening</span>
                      )}

                      <span className="text-slate-600">•</span>
                      <span className="text-[11px] font-mono text-slate-500">
                        Posted {new Date(job.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <h2 className="text-lg font-bold text-white hover:text-[#FF3D00] transition-colors truncate">
                      {job.title}
                    </h2>

                    <p className="text-xs font-mono text-slate-400 flex items-center gap-1.5 truncate">
                      <span className="text-slate-500">Apply Slug:</span>
                      <span className="text-cyan-300">/career/{job.slug}</span>
                    </p>
                  </div>

                  {/* Actions & Applications Stats */}
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap shrink-0">
                    {/* View Applications Counter Button */}
                    <Link
                      href={`/admin/dashboard/career/applications?job_id=${job.id}`}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0E1526] hover:bg-[#132247] border border-white/15 text-white text-xs font-bold transition-all shadow-sm"
                      title="View all applications received for this job"
                    >
                      <FileText className="w-3.5 h-3.5 text-[#FF3D00]" />
                      <span>{job.applications_count || 0} Apps</span>
                      {job.new_applications_count > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full bg-[#FF3D00] text-white text-[10px] font-bold animate-pulse">
                          {job.new_applications_count} New
                        </span>
                      )}
                    </Link>

                    {/* Share Apply Link Button */}
                    <button
                      type="button"
                      onClick={() => handleCopyShareLink(job)}
                      className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer border ${
                        isCopied
                          ? 'bg-emerald-500 text-white border-emerald-500 shadow-[0_0_12px_#10B981]'
                          : 'bg-[#132247] hover:bg-[#1a2d5c] text-cyan-300 border-cyan-500/30'
                      }`}
                      title="Copy direct shareable apply link to clipboard"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Copied Link</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Share Link</span>
                        </>
                      )}
                    </button>

                    {/* Active Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => handleToggleActive(job)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer border ${
                        isLive
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/25'
                          : 'bg-slate-800 border-white/10 text-slate-400 hover:bg-slate-700'
                      }`}
                      title={isLive ? 'Click to deactivate / unpublish' : 'Click to activate / publish'}
                    >
                      {isLive ? 'Active' : 'Draft'}
                    </button>

                    {/* Edit Button */}
                    <button
                      type="button"
                      onClick={() => openEditModal(job)}
                      className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                      title="Edit Job Details"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {/* Delete Button */}
                    <button
                      type="button"
                      onClick={() => setDeletingId(job.id)}
                      className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500 text-red-400 hover:text-white border border-red-500/20 transition-all cursor-pointer"
                      title="Delete Job"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* EDIT JOB MODAL */}
      {editingJob && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#0B101D] border border-white/15 rounded-2xl shadow-2xl p-6 space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit className="w-4 h-4 text-[#FF3D00]" />
                <span>Edit Job Position</span>
              </h3>
              <button
                type="button"
                onClick={() => setEditingJob(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                    Position Designation *
                  </label>
                  <input
                    type="text"
                    required
                    value={editPosition}
                    onChange={(e) => setEditPosition(e.target.value)}
                    placeholder="e.g. Control Room Interior Architect"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-sm focus:outline-none focus:border-[#FF3D00]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                    Job Posting Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-sm focus:outline-none focus:border-[#FF3D00]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                    Job Type *
                  </label>
                  <select
                    value={editType}
                    onChange={(e) => setEditType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-sm focus:outline-none focus:border-[#FF3D00]"
                  >
                    <option value="Full-Time">Full-Time</option>
                    <option value="Part-Time">Part-Time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contractual">Contractual</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    value={editDeadline}
                    onChange={(e) => setEditDeadline(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-sm focus:outline-none focus:border-[#FF3D00]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Publication Status
                </label>
                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={editActive}
                    onChange={(e) => setEditActive(e.target.checked)}
                    className="w-4 h-4 accent-[#FF3D00] rounded"
                  />
                  <span className="text-xs font-bold text-white">
                    {editActive ? 'Active (Live on /career)' : 'Draft (Hidden from public)'}
                  </span>
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Job Description &amp; Requirements *
                </label>
                <RichTextEditor
                  value={editDetails}
                  onChange={setEditDetails}
                  minHeight="220px"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setEditingJob(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingEdit}
                  className="px-5 py-2 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {savingEdit ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Save Changes</span>
                </button>
              </div>
            </form>
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
            <h3 className="text-lg font-bold text-white">Delete Job Position?</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently delete this job position? All candidate applications associated with this job will also be removed.
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
                onClick={() => handleDeleteJob(deletingId)}
                className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase cursor-pointer shadow-lg"
              >
                Delete Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

