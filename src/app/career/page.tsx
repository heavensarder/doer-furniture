'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Briefcase,
  Calendar,
  Share2,
  Copy,
  Check,
  ArrowRight,
  Sparkles,
  Loader2,
  ArrowUpRight,
  ExternalLink,
} from 'lucide-react';
import ApplicationFormModal from '@/components/career/ApplicationFormModal';
import { normalizeToHtml, stripHtml } from '@/components/admin/RichTextEditor';

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
}

export default function CareerPage() {
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Application Modal Target
  const [selectedJobForApply, setSelectedJobForApply] = useState<JobItem | null>(null);

  // Detail Modal Target
  const [selectedJobForDetail, setSelectedJobForDetail] = useState<JobItem | null>(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/careers/jobs');
        if (res.ok) {
          const data = await res.json();
          setJobs(data.jobs || []);
        }
      } catch (err) {
        console.error('Error fetching career jobs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleCopyLink = (job: JobItem) => {
    const url = `${window.location.origin}/career/${job.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(job.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredJobs = jobs.filter(
    (j) => activeFilter === 'all' || j.job_type === activeFilter
  );

  return (
    <div className="min-h-screen bg-[#070E22] text-slate-100 bg-cyber-grid pt-24 sm:pt-32 pb-24 sm:pb-32 relative overflow-hidden selection:bg-[#FF3D00] selection:text-white">
      {/* Neon Vertical Lasers */}
      <div className="neon-line-v-cyan absolute top-0 bottom-0 left-0 z-20 pointer-events-none" />
      <div className="neon-line-v-orange absolute top-0 bottom-0 right-0 z-20 pointer-events-none" />

      {/* Atmospheric Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#FF3D00]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16 sm:space-y-24">
        {/* 01. Hero Banner */}
        <div className="text-center max-w-4xl mx-auto space-y-4 sm:space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,61,0,0.25)]">
            <span className="w-2 h-2 rounded-full bg-[#FF3D00] animate-pulse" />
            <span>Join DOER Careers</span>
          </div>

          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Build your future with{' '}
            <span className="text-[#FF3D00] drop-shadow-[0_0_25px_rgba(255,61,0,0.4)]">
              DOER
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-lg text-slate-300 font-normal leading-relaxed">
            We design, engineer, and manufacture mission-critical control room environments and turnkey commercial spaces. Discover where your craftsmanship and passion can thrive.
          </p>

          <div className="pt-2 flex items-center justify-center gap-3">
            <a
              href="#openings"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] active:scale-95 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,61,0,0.4)] transition-all cursor-pointer"
            >
              <span>View Open Positions</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* 02. Open Job Positions */}
        <div id="openings" className="space-y-8 pt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-cyan-500/20 pb-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] font-bold uppercase tracking-wider">
                <span>Current Openings</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Available Job Positions
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Explore available roles and apply directly with your CV and credentials.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {['all', 'Full-Time', 'Part-Time', 'Internship', 'Contractual'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    activeFilter === filter
                      ? 'bg-[#FF3D00] text-white shadow-[0_0_12px_rgba(255,61,0,0.4)]'
                      : 'bg-[#0E1B3D] text-slate-300 hover:text-white border border-white/10 hover:border-white/20'
                  }`}
                >
                  {filter === 'all' ? 'All Roles' : filter}
                </button>
              ))}
            </div>
          </div>

          {/* Job Listings Grid */}
          {loading ? (
            <div className="py-20 text-center space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-[#FF3D00] mx-auto" />
              <p className="text-xs text-slate-400 font-mono">Loading available positions...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#0E1B3D]/90 border border-white/10 space-y-3">
              <Briefcase className="w-12 h-12 text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-white">No Positions Open in This Category</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                We are always excited to connect with talented control room engineers, CAD modelers, and interior project managers. Check back soon or contact us directly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5">
              {filteredJobs.map((job) => {
                const isCopied = copiedId === job.id;
                const plainSnippet = stripHtml(job.details).slice(0, 180);

                return (
                  <div
                    key={job.id}
                    className="p-6 sm:p-7 rounded-2xl bg-[#0E1B3D]/90 border border-white/10 hover:border-[#FF3D00]/60 transition-all space-y-4 shadow-xl cyber-corner text-white group"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                      {/* Job Header & Metadata */}
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          {/* HIGHLIGHTED POSITION BADGE */}
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF3D00]/15 border border-[#FF3D00]/40 text-[#FF3D00] text-xs font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(255,61,0,0.3)]">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3D00] animate-pulse" />
                            <span>Position: {job.position || job.title}</span>
                          </div>

                          <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
                            {job.job_type}
                          </span>

                          {job.deadline && (
                            <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#FF3D00]" />
                              <span>Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                            </span>
                          )}

                          <span className="text-slate-600 hidden sm:inline">•</span>
                          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                            DOER Facility / Khilkhet, Dhaka
                          </span>
                        </div>

                        <Link
                          href={`/career/${job.slug}`}
                          className="block group-hover:text-[#FF3D00] transition-colors"
                        >
                          <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-[#FF3D00] transition-colors tracking-tight">
                            {job.title}
                          </h3>
                        </Link>

                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-2 font-normal">
                          {plainSnippet}...
                        </p>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap shrink-0 pt-2 lg:pt-0">
                        {/* Share Apply Link Button */}
                        <button
                          type="button"
                          onClick={() => handleCopyLink(job)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase transition-all cursor-pointer border ${
                            isCopied
                              ? 'bg-emerald-500 text-white border-emerald-500 shadow-[0_0_12px_#10B981]'
                              : 'bg-[#132247] hover:bg-[#1a2d5c] text-cyan-300 border-cyan-500/30'
                          }`}
                          title="Copy shareable direct application link to clipboard"
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

                        {/* View Details Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedJobForDetail(job)}
                          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white text-xs font-bold uppercase transition-all cursor-pointer"
                        >
                          <span>Details</span>
                        </button>

                        {/* Apply Now Button */}
                        <button
                          type="button"
                          onClick={() => setSelectedJobForApply(job)}
                          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] active:scale-95 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,61,0,0.35)] transition-all cursor-pointer"
                        >
                          <span>Apply Now</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* JOB DETAIL POPUP MODAL */}
      {selectedJobForDetail && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#0B101D] border border-white/15 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 my-8 text-white cyber-corner">
            <div className="flex items-start justify-between border-b border-white/10 pb-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] text-[10px] font-bold uppercase tracking-wider">
                    {selectedJobForDetail.job_type}
                  </span>
                  {selectedJobForDetail.deadline && (
                    <span className="text-[11px] font-mono text-slate-400">
                      Deadline: {new Date(selectedJobForDetail.deadline).toLocaleDateString()}
                    </span>
                  )}
                </div>
                <h2 className="text-xl sm:text-3xl font-black text-white">
                  {selectedJobForDetail.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedJobForDetail(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Rich Text Details */}
            <div
              className="text-xs sm:text-base text-slate-300 leading-relaxed max-h-[50vh] overflow-y-auto pr-2
                [&_*]:!text-slate-300
                [&_h2]:text-lg [&_h2]:font-black [&_h2]:!text-white [&_h2]:mt-4 [&_h2]:mb-2 [&_h2:first-child]:mt-0
                [&_h3]:text-base [&_h3]:font-bold [&_h3]:!text-white [&_h3]:mt-3 [&_h3]:mb-1.5
                [&_strong]:!text-white [&_b]:!text-white
                [&_p]:mb-2.5
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_ul]:mb-3
                [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1.5 [&_ol]:mb-3"
              dangerouslySetInnerHTML={{
                __html: normalizeToHtml(selectedJobForDetail.details),
              }}
            />

            {/* Footer Actions */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-white/10 flex-wrap">
              <button
                type="button"
                onClick={() => handleCopyLink(selectedJobForDetail)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#132247] hover:bg-[#1a2d5c] text-cyan-300 text-xs font-bold uppercase transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Apply Link</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedJobForDetail(null)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const target = selectedJobForDetail;
                    setSelectedJobForDetail(null);
                    setSelectedJobForApply(target);
                  }}
                  className="inline-flex items-center gap-1.5 px-6 py-2 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase shadow-lg cursor-pointer"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* APPLICATION FORM MODAL */}
      {selectedJobForApply && (
        <ApplicationFormModal
          job={selectedJobForApply}
          isOpen={true}
          onClose={() => setSelectedJobForApply(null)}
        />
      )}
    </div>
  );
}

