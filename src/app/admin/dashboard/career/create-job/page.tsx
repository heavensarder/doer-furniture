'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Briefcase,
  Calendar,
  Check,
  Copy,
  ArrowLeft,
  Loader2,
  Sparkles,
  Share2,
  Eye,
  CheckCircle2,
  PlusCircle,
  Layers,
  X,
  Trash2,
} from 'lucide-react';
import RichTextEditor from '@/components/admin/RichTextEditor';

interface PositionItem {
  id: number;
  name: string;
}

export default function CreateJobPage() {
  const router = useRouter();

  // Positions list & selection
  const [positions, setPositions] = useState<PositionItem[]>([]);
  const [loadingPositions, setLoadingPositions] = useState(true);
  const [selectedPosition, setSelectedPosition] = useState('');
  const [isCreatingNewPosition, setIsCreatingNewPosition] = useState(false);
  const [newPositionName, setNewPositionName] = useState('');
  const [savingNewPosition, setSavingNewPosition] = useState(false);

  // Job fields
  const [title, setTitle] = useState('');
  const [jobType, setJobType] = useState<'Full-Time' | 'Part-Time' | 'Internship' | 'Contractual'>('Full-Time');
  const [deadline, setDeadline] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [details, setDetails] = useState('');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdJob, setCreatedJob] = useState<{ id: number; slug: string; title: string; position?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  // Load existing positions
  const fetchPositions = async () => {
    try {
      setLoadingPositions(true);
      const res = await fetch('/api/admin/career/positions');
      if (res.ok) {
        const data = await res.json();
        setPositions(data.positions || []);
      }
    } catch (err) {
      console.error('Error fetching positions:', err);
    } finally {
      setLoadingPositions(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, []);

  // Handle creating a new position on the fly
  const handleCreatePosition = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newPositionName.trim()) return;

    try {
      setSavingNewPosition(true);
      const res = await fetch('/api/admin/career/positions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newPositionName.trim() }),
      });

      const data = await res.json();
      if (res.ok && data.position) {
        setPositions((prev) => {
          const exists = prev.some((p) => p.name.toLowerCase() === data.position.name.toLowerCase());
          if (exists) return prev;
          return [...prev, data.position].sort((a, b) => a.name.localeCompare(b.name));
        });
        setSelectedPosition(data.position.name);
        if (!title.trim()) {
          setTitle(data.position.name);
        }
        setNewPositionName('');
        setIsCreatingNewPosition(false);
      } else {
        alert(data.error || 'Failed to create position');
      }
    } catch (err: any) {
      alert(err.message || 'Error creating position');
    } finally {
      setSavingNewPosition(false);
    }
  };

  // Handle deleting the currently selected position
  const handleDeleteSelectedPosition = async () => {
    if (!selectedPosition) return;
    const target = positions.find((p) => p.name === selectedPosition);
    if (!target) return;

    if (!confirm(`Are you sure you want to delete the position "${selectedPosition}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/career/positions?id=${target.id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setPositions((prev) => prev.filter((p) => p.id !== target.id));
        setSelectedPosition('');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete position');
      }
    } catch (err: any) {
      alert(err.message || 'Error deleting position');
    }
  };

  // Generate real-time preview slug
  const previewSlug = title
    .toLowerCase()
    .trim()
    .replace(/&/g, '-and-')
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'new-job-position';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Job title is required.');
      return;
    }

    if (!details.trim() || details === '<p><br></p>' || details === '<br>') {
      setError('Job details and requirements are required. Please format the description.');
      return;
    }

    try {
      setSaving(true);
      const res = await fetch('/api/admin/career/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: title.trim(),
          position: selectedPosition.trim() || title.trim(),
          job_type: jobType,
          details,
          deadline: deadline || null,
          is_active: isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create job position');
      }

      setCreatedJob({
        id: data.jobId,
        slug: data.slug,
        title: title.trim(),
        position: selectedPosition.trim() || title.trim(),
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred while creating the position.');
    } finally {
      setSaving(false);
    }
  };

  const shareableUrl = typeof window !== 'undefined' && createdJob
    ? `${window.location.origin}/career/${createdJob.slug}`
    : '';

  const handleCopyLink = () => {
    if (!shareableUrl) return;
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Top Breadcrumb & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard/career/jobs"
            className="p-2 rounded-xl bg-[#0E1526] hover:bg-[#132247] border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
            title="Back to All Jobs"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] text-[10px] font-bold uppercase tracking-wider">
                Recruitment ATS
              </span>
              <span className="text-xs text-slate-400 font-mono">/ Career Management</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Create New Job Position
            </h1>
          </div>
        </div>

        <Link
          href="/admin/dashboard/career/jobs"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0E1526] hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider transition-all self-start sm:self-auto cursor-pointer"
        >
          <Briefcase className="w-4 h-4 text-[#FF3D00]" />
          <span>View All Jobs</span>
        </Link>
      </div>

      {/* Success Modal / Banner upon Job Creation with Share Link */}
      {createdJob && (
        <div className="p-5 sm:p-6 rounded-2xl bg-[#0E1B3D] border border-emerald-500/40 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Job Position Created Successfully!
              </h3>
              <p className="text-xs text-slate-300">
                &ldquo;{createdJob.title}&rdquo; (Position: <strong className="text-cyan-300">{createdJob.position}</strong>) is now active and ready to receive candidate applications.
              </p>
            </div>
          </div>

          {/* Shareable Link Box */}
          <div className="p-4 rounded-xl bg-[#070A12] border border-white/10 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-[#FF3D00]" />
                <span>Direct Shareable Job Application Link:</span>
              </span>
              <span className="text-emerald-400 font-mono text-[11px] font-bold">Ready to Share</span>
            </div>

            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <input
                type="text"
                readOnly
                value={shareableUrl}
                className="w-full sm:flex-1 px-3 py-2 bg-[#0E1526] border border-white/15 rounded-lg text-xs font-mono text-cyan-300 select-all focus:outline-none"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="px-4 py-2 bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-md"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-white" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-white" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
              <Link
                href={`/career/${createdJob.slug}`}
                target="_blank"
                className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase rounded-lg transition-all flex items-center gap-1.5 shrink-0"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Page</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={() => {
                setCreatedJob(null);
                setTitle('');
                setSelectedPosition('');
                setDetails('');
                setDeadline('');
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase cursor-pointer"
            >
              + Create Another Job
            </button>
            <Link
              href="/admin/dashboard/career/jobs"
              className="px-4 py-2 rounded-xl bg-[#0E1526] hover:bg-[#132247] border border-white/15 text-slate-200 text-xs font-bold uppercase"
            >
              Go to Jobs List →
            </Link>
          </div>
        </div>
      )}

      {/* Main Creation Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-2">
            <span>⚠️ {error}</span>
          </div>
        )}

        {/* Card 1: Primary Details */}
        <div className="p-5 sm:p-7 rounded-2xl bg-[#0B101D] border border-white/10 space-y-5 shadow-xl cyber-corner">
          <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-white/10 pb-3">
            <Sparkles className="w-4 h-4 text-[#FF3D00]" />
            <span>Position Specifications</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* 1. SELECT OR CREATE POSITION */}
            <div className="md:col-span-12 space-y-2 p-4 rounded-xl bg-[#070A12] border border-cyan-500/30">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-[#FF3D00]" />
                  <span>Select or Create Position Designation <span className="text-[#FF3D00]">*</span></span>
                </label>

                {!isCreatingNewPosition && (
                  <button
                    type="button"
                    onClick={() => setIsCreatingNewPosition(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#FF3D00]/15 hover:bg-[#FF3D00]/25 border border-[#FF3D00]/30 text-[#FF3D00] text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>+ Create New Position</span>
                  </button>
                )}
              </div>

              {isCreatingNewPosition ? (
                <div className="p-3.5 rounded-xl bg-[#0E1526] border border-white/20 space-y-3 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Create New Position Name:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingNewPosition(false);
                        setNewPositionName('');
                      }}
                      className="text-slate-400 hover:text-white text-xs cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      autoFocus
                      value={newPositionName}
                      onChange={(e) => setNewPositionName(e.target.value)}
                      placeholder="e.g. Acoustic & Noise Control Specialist"
                      className="flex-1 px-3.5 py-2 rounded-lg bg-[#070A12] border border-white/15 text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-[#FF3D00]"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCreatePosition();
                        }
                      }}
                    />
                    <button
                      type="button"
                      disabled={savingNewPosition || !newPositionName.trim()}
                      onClick={() => handleCreatePosition()}
                      className="px-4 py-2 rounded-lg bg-[#FF3D00] hover:bg-[#eb3800] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider cursor-pointer transition-all shrink-0"
                    >
                      {savingNewPosition ? 'Saving...' : 'Add Position'}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedPosition}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === '__create_new__') {
                          setIsCreatingNewPosition(true);
                        } else {
                          setSelectedPosition(val);
                          if (val && !title.trim()) {
                            setTitle(val);
                          }
                        }
                      }}
                      className="flex-1 px-4 py-3 rounded-xl bg-[#0E1526] border border-white/15 text-white text-sm focus:outline-none focus:border-[#FF3D00] transition-colors cursor-pointer"
                    >
                      <option value="">-- Choose from Available Positions --</option>
                      {positions.map((pos) => (
                        <option key={pos.id} value={pos.name}>
                          {pos.name}
                        </option>
                      ))}
                      <option value="__create_new__" className="text-[#FF3D00] font-bold">
                        + Create a new position...
                      </option>
                    </select>

                    {selectedPosition && (
                      <button
                        type="button"
                        onClick={handleDeleteSelectedPosition}
                        className="p-3 rounded-xl bg-red-500/15 hover:bg-red-500/25 border border-red-500/30 text-red-400 hover:text-red-300 transition-colors shrink-0 cursor-pointer"
                        title={`Delete position "${selectedPosition}"`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <span>This position will be highlighted prominently on the career portal.</span>
                    <Link
                      href="/admin/dashboard/career/positions"
                      className="text-cyan-400 hover:text-cyan-300 hover:underline font-mono"
                    >
                      Manage &amp; Delete Positions →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Job Title */}
            <div className="md:col-span-8 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Job Posting Title <span className="text-[#FF3D00]">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Senior Control Room Console CAD & 3D Visualization Designer"
                className="w-full px-4 py-3 rounded-xl bg-[#070A12] border border-white/15 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:border-[#FF3D00] transition-colors"
              />
              <p className="text-[11px] text-slate-500 font-mono">
                Direct Apply URL preview: <span className="text-cyan-400">/career/{previewSlug}</span>
              </p>
            </div>

            {/* Job Type */}
            <div className="md:col-span-4 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Employment Type <span className="text-[#FF3D00]">*</span>
              </label>
              <select
                value={jobType}
                onChange={(e) => setJobType(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl bg-[#070A12] border border-white/15 text-white text-sm focus:outline-none focus:border-[#FF3D00] transition-colors cursor-pointer"
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Internship">Internship</option>
                <option value="Contractual">Contractual</option>
              </select>
            </div>

            {/* Application Deadline */}
            <div className="md:col-span-6 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Application Deadline (Optional)
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#070A12] border border-white/15 text-white text-sm focus:outline-none focus:border-[#FF3D00] transition-colors cursor-pointer"
                />
              </div>
              <p className="text-[11px] text-slate-500">
                Leave empty if applications are open until position is filled.
              </p>
            </div>

            {/* Active Status */}
            <div className="md:col-span-6 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Publication Status
              </label>
              <div className="flex items-center gap-3 pt-1">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF3D00]" />
                  <span className="ml-3 text-xs font-bold text-white">
                    {isActive ? 'Active (Published on Career Portal)' : 'Draft (Hidden from Public)'}
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Rich Text Job Details */}
        <div className="p-5 sm:p-7 rounded-2xl bg-[#0B101D] border border-white/10 space-y-4 shadow-xl cyber-corner">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/10 pb-3">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#FF3D00]" />
                <span>Job Details &amp; Requirements</span>
                <span className="text-[#FF3D00]">*</span>
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Format responsibilities, candidate requirements, and work culture using the rich editor.
              </p>
            </div>
          </div>

          <RichTextEditor
            value={details}
            onChange={setDetails}
            placeholder="Outline role responsibilities, key requirements, technical qualifications, and why candidates should join DOER..."
            minHeight="340px"
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Link
            href="/admin/dashboard/career/jobs"
            className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold uppercase transition-all"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] active:scale-95 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,61,0,0.4)] transition-all cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Position...</span>
              </>
            ) : (
              <>
                <Briefcase className="w-4 h-4" />
                <span>Publish Job Position</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
