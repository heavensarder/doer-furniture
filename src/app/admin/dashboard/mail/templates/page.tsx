'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FileCode,
  Eye,
  Code,
  Save,
  Check,
  Copy,
  Sparkles,
  RefreshCw,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Smartphone,
  Monitor,
  ExternalLink,
  Sliders,
  Mail,
  ShoppingBag,
  Briefcase,
  Layers,
} from 'lucide-react';

interface TemplateItem {
  id: number;
  template_key: string;
  name: string;
  category: string;
  subject: string;
  body_html: string;
  description?: string;
  available_variables: string; // JSON string of [{ key, label, desc }]
  is_active: number | boolean;
}

interface VariableInfo {
  key: string;
  label: string;
  desc: string;
}

const CATEGORIES = [
  {
    id: 'enquiries',
    label: 'Customer Enquiries',
    icon: Mail,
    description: 'Inquiries & Consultation Requests',
  },
  {
    id: 'orders',
    label: 'E-commerce Orders',
    icon: ShoppingBag,
    description: 'Direct Checkout & Order Confirmations',
  },
  {
    id: 'careers',
    label: 'Career Applications',
    icon: Briefcase,
    description: 'Job Postings & CV Submissions',
  },
];

export default function MailTemplatesPage() {
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('enquiries');
  const [selectedKey, setSelectedKey] = useState<string>('enquiry_admin');
  const [activeTemplate, setActiveTemplate] = useState<TemplateItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'code'>('preview');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [copiedVar, setCopiedVar] = useState<string | null>(null);

  // Form states
  const [subject, setSubject] = useState('');
  const [bodyHtml, setBodyHtml] = useState('');
  const [isActive, setIsActive] = useState(true);

  // Test send state
  const [testEmailRecipient, setTestEmailRecipient] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/mail/templates');
      if (res.ok) {
        const data = await res.json();
        setTemplates(data.templates || []);
        if (data.templates && data.templates.length > 0) {
          const current = data.templates.find((t: TemplateItem) => t.template_key === selectedKey) || data.templates[0];
          setSelectedCategory(current.category || 'enquiries');
          loadTemplateDetails(current.template_key);
        }
      }
    } catch (err) {
      console.error('Error loading templates:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadTemplateDetails = async (key: string) => {
    try {
      const res = await fetch(`/api/admin/mail/templates/${key}`);
      if (res.ok) {
        const data = await res.json();
        if (data.template) {
          setActiveTemplate(data.template);
          setSelectedKey(data.template.template_key);
          setSelectedCategory(data.template.category || 'enquiries');
          setSubject(data.template.subject);
          setBodyHtml(data.template.body_html);
          setIsActive(data.template.is_active === 1 || data.template.is_active === true);
        }
      }
    } catch (err) {
      console.error('Error fetching template detail:', err);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleSelectTemplate = (key: string) => {
    setSelectedKey(key);
    loadTemplateDetails(key);
    setFeedback(null);
  };

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    setFeedback(null);
    const catTemplates = templates.filter((t) => (t.category || 'enquiries') === catId);
    if (catTemplates.length > 0) {
      const alreadyInCat = catTemplates.some((t) => t.template_key === selectedKey);
      if (!alreadyInCat) {
        handleSelectTemplate(catTemplates[0].template_key);
      }
    }
  };

  const handleCopyVariable = (varKey: string) => {
    const textToCopy = `{{${varKey}}}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedVar(varKey);
    setTimeout(() => setCopiedVar(null), 2000);
  };

  const handleInsertVariable = (varKey: string) => {
    const textToInsert = `{{${varKey}}}`;
    setBodyHtml((prev) => prev + textToInsert);
    setFeedback({
      type: 'success',
      message: `Inserted ${textToInsert} at the bottom of the HTML template.`,
    });
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedKey) return;
    try {
      setSaving(true);
      setFeedback(null);

      const res = await fetch(`/api/admin/mail/templates/${selectedKey}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subject,
          body_html: bodyHtml,
          is_active: isActive,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update template.');

      setFeedback({ type: 'success', message: `Template "${activeTemplate?.name}" saved successfully!` });
      loadTemplateDetails(selectedKey);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error updating template.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSendPreviewEmail = async () => {
    if (!testEmailRecipient.trim()) {
      setFeedback({ type: 'error', message: 'Please enter a recipient email address to send the preview to.' });
      return;
    }

    try {
      setSendingTest(true);
      setFeedback(null);

      const res = await fetch(`/api/admin/mail/templates/${selectedKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: testEmailRecipient.trim(),
          subject,
          body_html: bodyHtml,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to dispatch preview email.');

      setFeedback({ type: 'success', message: data.message || `Preview successfully sent to ${testEmailRecipient}!` });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error sending preview email.' });
    } finally {
      setSendingTest(false);
    }
  };

  // Parse available variables safely
  let variablesList: VariableInfo[] = [];
  try {
    if (activeTemplate?.available_variables) {
      variablesList = JSON.parse(activeTemplate.available_variables);
    }
  } catch {
    variablesList = [];
  }

  // Generate realistic sample preview HTML by interpolating variables
  const getInterpolatedPreview = () => {
    if (!bodyHtml) return '';
    const sampleValues: Record<string, string> = {
      full_name: 'Engr. Tanvir Ahmed',
      company_name: 'Apex Infrastructure Ltd.',
      email: 'tanvir.ahmed@apexholdings.bd',
      phone: '+880 1812-345678',
      service_interested: 'Control Room Interior',
      project_location: 'Gulshan-2, Dhaka',
      project_details: 'We require a 6-operator mission-critical curved modular console table with high/low-voltage EMI separation and articulated video wall mounts for our facility.',
      submission_time: 'Tuesday, November 10, 2026, 11:45 PM',
      inquiry_id: '1042',
      admin_dashboard_url: '#',
      site_name: 'DOER',
      site_url: 'http://doerbd.com',
      logo_url: '/logo-white.png',
      hotline: '+880 1976-535654',
      job_title: 'Control Room Project Engineer',
      position: 'Senior Systems Architect',
      experience_years: '4+ Years',
      highest_qualification: 'B.Sc in Industrial & Production Engineering',
      institution: 'BUET',
      current_address: 'Kazi Bari Road, Khilkhet, Dhaka-1229',
      why_join: 'I have 4+ years of hands-on experience in mission-critical control room console design and wish to contribute my engineering expertise to DOER projects.',
      cv_url: '#',
      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      application_id: '108',
      order_number: 'DOER-2026-9041',
      product_name: 'HG-B1 Executive Modular Control Console',
      quantity: '2',
      product_price: '185,000',
      total_price: '370,000',
      customer_name: 'Engr. Tanvir Ahmed',
      delivery_address: 'Plot 45, Road 11, Gulshan-2, Dhaka-1212',
      notes: 'Please contact our site manager before gate entry.',
      order_date: 'Tuesday, November 10, 2026, 11:45 PM',
    };

    let result = bodyHtml;
    for (const [key, value] of Object.entries(sampleValues)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'gi');
      result = result.replace(regex, value);
    }
    return result;
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] text-[10px] font-bold uppercase tracking-wider">
              Template Designer
            </span>
            <span className="text-xs text-slate-400 font-mono">/ Mail Config / Templates</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <FileCode className="w-7 h-7 text-[#FF3D00]" />
            <span>HTML Email Templates &amp; Variables</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Design luxury, responsive HTML emails sent through Hostinger Titan SMTP. Interactive placeholder variables panel, real-time live preview, and test sender.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/admin/dashboard/mail/settings"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#0E1526] hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold uppercase transition-all"
          >
            <Sliders className="w-4 h-4 text-[#FF3D00]" />
            <span>SMTP Settings</span>
          </Link>
        </div>
      </div>

      {/* Feedback Alert Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-medium animate-in fade-in duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              : 'bg-red-500/15 border-red-500/40 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            &times;
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2-TIER TAB SYSTEM: UP BAR (CATEGORIES) & BOTTOM BAR (SPECIFIC TEMPLATES) */}
      {/* ========================================================================= */}
      <div className="space-y-3">
        {/* UP BAR: Category Selection */}
        <div>
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#FF3D00]" />
              Select Email Category (Top Bar)
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              {templates.length} Total Email Templates Active
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {CATEGORIES.map((cat) => {
              const isCatSelected = selectedCategory === cat.id;
              const catTemplates = templates.filter((t) => (t.category || 'enquiries') === cat.id);
              const Icon = cat.icon;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden flex items-center justify-between gap-3 group cursor-pointer ${
                    isCatSelected
                      ? 'bg-[#0E1526] border-[#FF3D00] shadow-[0_0_25px_rgba(255,61,0,0.2)]'
                      : 'bg-[#070A12] border-white/10 hover:border-white/20 hover:bg-[#0A0F1D]'
                  }`}
                >
                  {/* Top Neon Glow on Active */}
                  {isCatSelected && (
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF3D00] via-[#00F0FF] to-[#FF3D00]" />
                  )}

                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isCatSelected
                          ? 'bg-[#FF3D00]/20 text-[#FF3D00] border border-[#FF3D00]/40 shadow-[0_0_12px_rgba(255,61,0,0.3)]'
                          : 'bg-white/[0.04] text-slate-400 group-hover:text-white border border-white/5'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div
                        className={`text-xs font-bold uppercase tracking-wider truncate ${
                          isCatSelected ? 'text-white' : 'text-slate-300 group-hover:text-white'
                        }`}
                      >
                        {cat.label}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {cat.description}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                      isCatSelected
                        ? 'bg-[#FF3D00]/20 text-[#FF3D00] border border-[#FF3D00]/30'
                        : 'bg-white/5 text-slate-400 border border-white/10'
                    }`}
                  >
                    {catTemplates.length} {catTemplates.length === 1 ? 'Template' : 'Templates'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* BOTTOM BAR: Specific Templates within Active Category */}
        <div className="rounded-2xl bg-[#080C16] border border-white/10 shadow-inner overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 px-4 py-2.5 border-b border-white/5 bg-[#060911]">
            <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Templates in {CATEGORIES.find((c) => c.id === selectedCategory)?.label || 'Active Category'} (Bottom Tab Bar):
            </span>
            <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
              Click template tab to switch editor &amp; preview
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto overflow-y-hidden no-scrollbar px-3 pt-2 border-b border-white/10 bg-[#070A12]">
            {templates
              .filter((tpl) => (tpl.category || 'enquiries') === selectedCategory)
              .map((tpl) => {
                const isSelected = tpl.template_key === selectedKey;
                const isTplActive = tpl.is_active === 1 || tpl.is_active === true;

                return (
                  <button
                    key={tpl.template_key}
                    type="button"
                    onClick={() => handleSelectTemplate(tpl.template_key)}
                    className={`flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-all border-b-2 cursor-pointer whitespace-nowrap rounded-t-lg ${
                      isSelected
                        ? 'border-[#FF3D00] text-white bg-white/[0.05] shadow-[0_2px_12px_rgba(255,61,0,0.35)]'
                        : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.02]'
                    }`}
                  >
                    <Mail
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-[#FF3D00]' : 'text-slate-500'
                      }`}
                    />
                    <span>{tpl.name}</span>

                    <span
                      className={`ml-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider ${
                        isTplActive
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {isTplActive ? 'Active' : 'Off'}
                    </span>
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="py-24 text-center space-y-3 bg-[#080C16] rounded-2xl border border-white/10">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF3D00] mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Loading template and variables...</p>
        </div>
      ) : activeTemplate ? (
        <div className="space-y-6">
          
          {/* ========================================================================= */}
          {/* SECTION 1: INCLUDED VARIABLES PANEL (SHOW MUST) */}
          {/* ========================================================================= */}
          <div className="p-6 rounded-2xl bg-[#0B101D] border border-cyan-500/40 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
                  Included Variables &amp; Placeholders (Click to Copy)
                </h3>
              </div>
              <span className="text-[10px] text-cyan-300 font-mono">
                {variablesList.length} Variables Available
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              These variables automatically populate with real client data when an email is generated. Click any tag to copy it, or insert it directly into your HTML email body or subject line:
            </p>

            {/* Variable Badges Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-1">
              {variablesList.map((v) => {
                const isCopied = copiedVar === v.key;
                return (
                  <div
                    key={v.key}
                    onClick={() => handleCopyVariable(v.key)}
                    className="group p-3 rounded-xl bg-[#070A12] border border-white/10 hover:border-cyan-400 hover:bg-[#0E1526] transition-all cursor-pointer flex items-center justify-between gap-3 shadow-sm"
                    title="Click to copy placeholder tag"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <code className="text-xs font-mono font-bold text-cyan-300 group-hover:text-white transition-colors">
                          &#123;&#123;{v.key}&#125;&#125;
                        </code>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mt-0.5">
                        {v.label} &bull; <span className="opacity-80">{v.desc}</span>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleInsertVariable(v.key);
                        }}
                        className="p-1 rounded bg-white/5 hover:bg-[#FF3D00] text-slate-400 hover:text-white text-[10px] font-bold transition-colors"
                        title="Append to HTML editor"
                      >
                        + Insert
                      </button>
                      <div className="w-6 h-6 rounded flex items-center justify-center bg-cyan-500/10 text-cyan-300">
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ========================================================================= */}
          {/* SECTION 2: SUBJECT & TEMPLATE CONTROLS */}
          {/* ========================================================================= */}
          <form onSubmit={handleSaveTemplate} className="space-y-6">
            <div className="p-6 rounded-2xl bg-[#0B101D] border border-white/15 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1 space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Email Subject Line <span className="text-[#FF3D00]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. New Project Enquiry: {{service_interested}} from {{full_name}}"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs font-semibold focus:border-[#FF3D00] focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 font-mono block">
                    Supports placeholders like <code className="text-cyan-300">&#123;&#123;full_name&#125;&#125;</code> and <code className="text-cyan-300">&#123;&#123;service_interested&#125;&#125;</code>
                  </span>
                </div>

                <div className="flex items-center gap-4 shrink-0 sm:pt-4">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-white">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4 accent-[#FF3D00] rounded cursor-pointer"
                    />
                    <span>Active Template</span>
                  </label>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#FF3D00]/30 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    <span>Save Template</span>
                  </button>
                </div>
              </div>
            </div>

            {/* ========================================================================= */}
            {/* SECTION 3: HTML CODE & LIVE PREVIEW SPLIT / TABS */}
            {/* ========================================================================= */}
            <div className="rounded-2xl bg-[#0B101D] border border-white/15 overflow-hidden shadow-2xl">
              {/* Editor Bar */}
              <div className="flex items-center justify-between px-6 py-3.5 bg-[#080C16] border-b border-white/10 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setViewMode('preview')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                      viewMode === 'preview'
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Live Visual Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode('code')}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all cursor-pointer ${
                      viewMode === 'code'
                        ? 'bg-[#FF3D00]/20 text-[#FF3D00] border border-[#FF3D00]/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>HTML Source Code</span>
                  </button>
                </div>

                {viewMode === 'preview' && (
                  <div className="flex items-center gap-1 bg-[#070A12] p-1 rounded-lg border border-white/10">
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('desktop')}
                      className={`p-1.5 rounded text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                        previewDevice === 'desktop' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Desktop Layout Preview"
                    >
                      <Monitor className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-[11px]">Desktop</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('mobile')}
                      className={`p-1.5 rounded text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                        previewDevice === 'mobile' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Mobile Layout Preview"
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline text-[11px]">Mobile</span>
                    </button>
                  </div>
                )}
              </div>

              {/* View 1: Live Preview Mode */}
              {viewMode === 'preview' ? (
                <div className="p-4 sm:p-8 bg-[#05070B] flex justify-center items-center overflow-x-auto min-h-[580px]">
                  <div
                    className={`transition-all duration-300 ${
                      previewDevice === 'mobile'
                        ? 'w-[380px] max-w-full bg-[#000000] p-3.5 rounded-[40px] border-4 border-slate-700 shadow-[0_0_60px_rgba(0,0,0,0.9)] ring-1 ring-white/15'
                        : 'w-full max-w-3xl'
                    }`}
                  >
                    {previewDevice === 'mobile' && (
                      <div className="w-24 h-4 bg-slate-900 rounded-full mx-auto mb-3 flex items-center justify-center gap-1.5 border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-slate-800" />
                        <div className="w-8 h-1 bg-slate-800 rounded-full" />
                      </div>
                    )}
                    <div
                      className={`overflow-hidden shadow-2xl ${
                        previewDevice === 'mobile'
                          ? 'rounded-[26px] border border-white/10 bg-[#0A0F1D]'
                          : 'bg-[#0A0F1D] rounded-xl border border-white/10'
                      }`}
                    >
                      <iframe
                        srcDoc={getInterpolatedPreview()}
                        title="Live Email Preview"
                        className={`w-full border-0 ${
                          previewDevice === 'mobile' ? 'min-h-[680px]' : 'min-h-[650px]'
                        }`}
                        sandbox="allow-same-origin"
                      />
                    </div>
                    {previewDevice === 'mobile' && (
                      <div className="w-28 h-1 bg-slate-600 rounded-full mx-auto mt-3" />
                    )}
                  </div>
                </div>
              ) : (
                /* View 2: Code Editor Mode */
                <div className="p-4 bg-[#070A12]">
                  <textarea
                    value={bodyHtml}
                    onChange={(e) => setBodyHtml(e.target.value)}
                    rows={26}
                    className="w-full p-4 rounded-xl bg-[#04060A] border border-white/15 text-slate-200 text-xs font-mono leading-relaxed focus:border-[#FF3D00] focus:outline-none resize-y selection:bg-[#FF3D00] selection:text-white"
                    placeholder="<!DOCTYPE html>..."
                  />
                </div>
              )}
            </div>
          </form>

          {/* ========================================================================= */}
          {/* SECTION 4: LIVE PREVIEW EMAIL DISPATCHER */}
          {/* ========================================================================= */}
          <div className="p-6 rounded-2xl bg-[#080C16] border border-white/15 space-y-4">
            <div className="flex items-center gap-2 border-b border-white/10 pb-3">
              <Send className="w-4 h-4 text-cyan-400" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                Send Live Preview of this Template to Real Inbox
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end">
              <div className="sm:col-span-8 space-y-1.5">
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                  Target Recipient Email:
                </label>
                <input
                  type="email"
                  value={testEmailRecipient}
                  onChange={(e) => setTestEmailRecipient(e.target.value)}
                  placeholder="e.g. your-name@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div className="sm:col-span-4">
                <button
                  type="button"
                  onClick={handleSendPreviewEmail}
                  disabled={sendingTest}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#0E1526] hover:bg-[#FF3D00] text-slate-200 hover:text-white text-xs font-bold uppercase tracking-wider border border-white/15 hover:border-[#FF3D00] transition-all cursor-pointer disabled:opacity-50"
                >
                  {sendingTest ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  <span>Send Preview Email</span>
                </button>
              </div>
            </div>
          </div>

        </div>
      ) : null}
    </div>
  );
}

