'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Share2,
  Copy,
  Check,
  Loader2,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import ApplicationFormModal from '@/components/career/ApplicationFormModal';
import { normalizeToHtml } from '@/components/admin/RichTextEditor';

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

export default function CareerJobDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : (params?.slug as string);

  const [job, setJob] = useState<JobItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchJob = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/careers/jobs/${encodeURIComponent(slug)}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          setJob(data.job || null);
        } else {
          setJob(null);
        }
      } catch (err) {
        console.error('Error fetching job details:', err);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [slug]);

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/career/${job?.slug || slug}`;
    }
    return `https://doer.heavensarder.com/career/${job?.slug || slug}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getShareUrl());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (!job) return;
    const url = getShareUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${job.title} | DOER Careers`,
          text: `Join DOER as ${job.title} (${job.job_type}). Apply online now.`,
          url,
        });
        return;
      } catch {
        // Fallback
      }
    }
    handleCopyLink();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#070E22] text-slate-100 pt-24 gap-3">
        <Loader2 className="w-9 h-9 animate-spin text-[#FF3D00]" />
        <p className="text-sm font-medium text-slate-400">Loading job details & application form...</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#070E22] text-white pt-24 px-4 text-center space-y-4">
        <h1 className="text-2xl sm:text-4xl font-black text-white">Job Position Not Found</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md">
          This position may have closed or the link has expired. Explore all current openings on our career portal.
        </p>
        <Link
          href="/career"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,61,0,0.35)]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>View All Openings</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070E22] text-slate-100 bg-cyber-grid pt-24 sm:pt-32 pb-24 sm:pb-32 relative overflow-hidden selection:bg-[#FF3D00] selection:text-white">
      {/* Neon Vertical Lasers */}
      <div className="neon-line-v-cyan absolute top-0 bottom-0 left-0 z-20 pointer-events-none" />
      <div className="neon-line-v-orange absolute top-0 bottom-0 right-0 z-20 pointer-events-none" />

      {/* Ambient Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-[#FF3D00]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8 sm:space-y-12">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Link href="/" className="hover:text-[#FF3D00] transition-colors">
              Home
            </Link>
            <span className="text-white/20">/</span>
            <Link href="/career" className="hover:text-[#FF3D00] transition-colors">
              Career
            </Link>
            <span className="text-white/20">/</span>
            <span className="font-bold text-white truncate max-w-[200px] sm:max-w-md">
              {job.title}
            </span>
          </div>

          <Link
            href="/career"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#FF3D00] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Careers</span>
          </Link>
        </div>

        {/* Job Header Hero */}
        <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1B3D]/95 border border-cyan-500/25 shadow-2xl cyber-corner relative overflow-hidden space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5 flex-wrap">
                {/* HIGHLIGHTED POSITION BADGE */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FF3D00]/20 border border-[#FF3D00]/50 text-[#FF3D00] text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,61,0,0.35)]">
                  <span className="w-2 h-2 rounded-full bg-[#FF3D00] animate-pulse" />
                  <span>Position: {job.position || job.title}</span>
                </div>

                <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold uppercase tracking-wider">
                  {job.job_type}
                </span>

                {job.deadline && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                    <span>
                      Deadline:{' '}
                      {new Date(job.deadline).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                {job.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-2 font-mono">
                <Briefcase className="w-4 h-4 text-[#FF3D00]" />
                <span>DOER Command Center &amp; Interior Architecture Studio</span>
              </p>
            </div>

            {/* Shareable Buttons */}
            <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#070E22] hover:bg-[#070E22]/80 border border-white/10 hover:border-[#FF3D00] text-slate-200 text-xs font-bold transition-all cursor-pointer shadow-md"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span className="text-emerald-400">Apply Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-[#FF3D00]" />
                    <span>Copy Share Link</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleNativeShare}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 text-xs font-bold transition-all cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>Share Job</span>
              </button>

              <a
                href="#apply-form"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] active:scale-95 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,61,0,0.4)] transition-all"
              >
                <span>Apply Now</span>
              </a>
            </div>
          </div>
        </div>

        {/* 2-Column Layout: Left = Job Details, Right = Application Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
          {/* LEFT 6 COLS: Full Rich Text Job Details */}
          <div className="lg:col-span-6 space-y-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-[#0E1B3D]/90 border border-white/10 shadow-xl space-y-5 cyber-corner">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Job Description &amp; Requirements</span>
              </div>

              <div
                className="text-slate-300 text-sm sm:text-base leading-relaxed overflow-x-auto
                  [&_*]:!text-slate-300
                  [&_h2]:text-lg [&_h2]:sm:text-xl [&_h2]:font-black [&_h2]:!text-white [&_h2]:mt-5 [&_h2]:mb-2.5 [&_h2:first-child]:mt-0
                  [&_h3]:text-base [&_h3]:font-bold [&_h3]:!text-white [&_h3]:mt-4 [&_h3]:mb-2 [&_h3:first-child]:mt-0
                  [&_strong]:!text-white [&_b]:!text-white
                  [&_p]:mb-3 [&_p:last-child]:mb-0
                  [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-4 [&_ul]:space-y-1.5
                  [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-4 [&_ol]:space-y-1.5
                  [&_blockquote]:border-l-4 [&_blockquote]:border-[#FF3D00] [&_blockquote]:bg-[#070E22] [&_blockquote]:pl-3.5 [&_blockquote]:py-2 [&_blockquote]:my-3.5 [&_blockquote]:italic [&_blockquote]:!text-slate-300 [&_blockquote]:rounded-r-xl
                  [&_hr]:my-4 [&_hr]:border-white/10
                  [&_a]:!text-cyan-400 [&_a]:underline
                  [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:bg-[#070E22] [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:text-xs [&_table]:sm:text-sm
                  [&_th]:bg-[#070E22] [&_th]:!text-cyan-300 [&_th]:font-bold [&_th]:text-left [&_th]:p-2.5 [&_th]:border [&_th]:border-white/10
                  [&_td]:p-2.5 [&_td]:border [&_td]:border-white/10 [&_td]:!text-slate-300"
                dangerouslySetInnerHTML={{
                  __html: normalizeToHtml(job.details),
                }}
              />
            </div>

            {/* Why Join DOER Quick Callout */}
            <div className="p-6 rounded-2xl bg-[#070E22]/90 border border-white/10 space-y-3 cyber-corner">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#FF3D00]" />
                <span>Equal Opportunity &amp; Excellence</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-normal">
                DOER is an equal opportunity employer committed to fostering an inclusive, high-performance team culture. We empower our engineers, interior architects, and craftsmen with state-of-the-art tools and real ownership over mission-critical infrastructure projects.
              </p>
            </div>
          </div>

          {/* RIGHT 6 COLS: Direct Online Application Form */}
          <div id="apply-form" className="lg:col-span-6 sticky top-28">
            <ApplicationFormModal
              job={job}
              isInline={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

