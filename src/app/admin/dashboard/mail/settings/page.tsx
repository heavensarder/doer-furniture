'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Mail,
  Send,
  Server,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
  Check,
  RefreshCw,
  ExternalLink,
  Sliders,
  FileCode,
  Bell,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';

interface MailSettings {
  id?: number;
  provider: string;
  smtp_host: string;
  smtp_port: number;
  smtp_secure: boolean | number;
  smtp_user: string;
  smtp_pass?: string;
  sender_name: string;
  sender_email: string;
  receiver_email: string;
  order_receiver_email?: string;
  cc_email?: string;
  order_cc_email?: string;
  reply_to_email?: string;
  enquiry_notification_enabled: boolean | number;
  career_notification_enabled: boolean | number;
  order_notification_enabled: boolean | number;
  customer_reply_enabled: boolean | number;
  updated_at?: string;
}

export default function MailSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [settings, setSettings] = useState<MailSettings>({
    provider: 'hostinger',
    smtp_host: 'smtp.titan.email',
    smtp_port: 465,
    smtp_secure: true,
    smtp_user: 'info@doerbd.com',
    smtp_pass: '',
    sender_name: 'DOER Notifications',
    sender_email: 'info@doerbd.com',
    receiver_email: 'doer.interior@gmail.com',
    order_receiver_email: 'orders@doerbd.com',
    cc_email: '',
    order_cc_email: '',
    reply_to_email: '',
    enquiry_notification_enabled: true,
    career_notification_enabled: true,
    order_notification_enabled: true,
    customer_reply_enabled: true,
  });

  // Test Email State
  const [testRecipient, setTestRecipient] = useState('');
  const [sendingTest, setSendingTest] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; details?: string } | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/mail/settings');
      if (res.ok) {
        const data = await res.json();
        if (data.settings) {
          setSettings({
            ...data.settings,
            smtp_secure: data.settings.smtp_secure === 1 || data.settings.smtp_secure === true,
            enquiry_notification_enabled: data.settings.enquiry_notification_enabled === 1 || data.settings.enquiry_notification_enabled === true,
            career_notification_enabled: data.settings.career_notification_enabled === 1 || data.settings.career_notification_enabled === true,
            order_notification_enabled: data.settings.order_notification_enabled === 1 || data.settings.order_notification_enabled === true,
            customer_reply_enabled: data.settings.customer_reply_enabled === 1 || data.settings.customer_reply_enabled === true,
          });
          if (data.settings.receiver_email) {
            setTestRecipient(data.settings.receiver_email);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching mail settings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleApplyTitanDefaults = () => {
    setSettings((prev) => ({
      ...prev,
      provider: 'hostinger-titan',
      smtp_host: 'smtp.titan.email',
      smtp_port: 465,
      smtp_secure: true,
    }));
    setFeedback({
      type: 'success',
      message: 'Hostinger Titan SMTP default parameters (smtp.titan.email : 465 SSL/TLS) applied!',
    });
  };

  const handleApplyHostingerStandard = () => {
    setSettings((prev) => ({
      ...prev,
      provider: 'hostinger-standard',
      smtp_host: 'smtp.hostinger.com',
      smtp_port: 465,
      smtp_secure: true,
    }));
    setFeedback({
      type: 'success',
      message: 'Standard Hostinger Webmail parameters (smtp.hostinger.com : 465 SSL/TLS) applied!',
    });
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setFeedback(null);

      const res = await fetch('/api/admin/mail/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save mail settings.');

      setFeedback({ type: 'success', message: 'Mail & SMTP server configuration saved successfully!' });
      fetchSettings();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error saving settings.' });
    } finally {
      setSaving(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testRecipient.trim()) {
      setTestResult({
        success: false,
        message: 'Please enter a recipient email address to receive the test message.',
      });
      return;
    }

    try {
      setSendingTest(true);
      setTestResult(null);

      const res = await fetch('/api/admin/mail/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...settings,
          test_recipient: testRecipient.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'SMTP Connection Test Failed.');
      }

      setTestResult({
        success: true,
        message: data.message || `Test email successfully dispatched to ${testRecipient}!`,
        details: data.messageId ? `Message ID: ${data.messageId}` : undefined,
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Failed to connect to SMTP server.',
      });
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] text-[10px] font-bold uppercase tracking-wider">
              Email Dispatch Engine
            </span>
            <span className="text-xs text-slate-400 font-mono">/ Mail Config / Settings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Mail className="w-7 h-7 text-[#FF3D00]" />
            <span>Hostinger Titan SMTP &amp; Mail Settings</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Configure your <strong className="text-white">Hostinger Titan SMTP</strong> mail server so all website inquiries, customer inquiries, and order events reach your inbox reliably.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/admin/dashboard/mail/templates"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#0E1526] hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold uppercase transition-all"
          >
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span>HTML Templates</span>
          </Link>

          <button
            type="button"
            onClick={fetchSettings}
            disabled={loading}
            className="p-2.5 rounded-xl bg-[#0E1526] hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Refresh settings"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#FF3D00]' : ''}`} />
          </button>
        </div>
      </div>

      {/* Feedback Toast */}
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

      {loading ? (
        <div className="py-24 text-center space-y-3 bg-[#080C16] rounded-2xl border border-white/10">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF3D00] mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Loading SMTP &amp; mail configurations...</p>
        </div>
      ) : (
        <form onSubmit={handleSaveSettings} className="space-y-8">
          
          {/* Card 1: Hostinger Titan SMTP Credentials */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#0B101D] border border-cyan-500/30 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2.5">
                <Server className="w-5 h-5 text-cyan-400" />
                <div>
                  <h3 className="text-base font-bold text-white">Hostinger Titan SMTP Configuration</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Outgoing email connection parameters for your Titan / Hostinger custom domain email account.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleApplyTitanDefaults}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/30 cursor-pointer self-start sm:self-auto transition-all"
                  title="Host: smtp.titan.email, Port: 465 (SSL)"
                >
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Titan Email</span>
                </button>

                <button
                  type="button"
                  onClick={handleApplyHostingerStandard}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold border border-white/15 cursor-pointer self-start sm:self-auto transition-all"
                  title="Host: smtp.hostinger.com, Port: 465 (SSL)"
                >
                  <Server className="w-3.5 h-3.5 text-[#FF3D00]" />
                  <span>Hostinger Standard</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
              {/* SMTP Host */}
              <div className="md:col-span-6 space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  SMTP Host Server <span className="text-[#FF3D00]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={settings.smtp_host}
                  onChange={(e) => setSettings({ ...settings, smtp_host: e.target.value })}
                  placeholder="smtp.titan.email"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 font-mono block">
                  Hostinger Titan default: <code className="text-cyan-300">smtp.titan.email</code>
                </span>
              </div>

              {/* SMTP Port */}
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  SMTP Port <span className="text-[#FF3D00]">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={settings.smtp_port}
                  onChange={(e) => {
                    const port = parseInt(e.target.value, 10) || 465;
                    setSettings({
                      ...settings,
                      smtp_port: port,
                      smtp_secure: port === 465,
                    });
                  }}
                  placeholder="465"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 font-mono block">
                  465 (SSL) or 587 (TLS)
                </span>
              </div>

              {/* Encryption Security Mode */}
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Encryption
                </label>
                <div className="flex rounded-xl bg-[#070A12] p-1 border border-white/15 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, smtp_secure: true, smtp_port: 465 })}
                    className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                      settings.smtp_secure
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    SSL (465)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSettings({ ...settings, smtp_secure: false, smtp_port: 587 })}
                    className={`flex-1 py-1.5 rounded-lg text-center transition-all ${
                      !settings.smtp_secure
                        ? 'bg-[#FF3D00]/20 text-[#FF3D00] border border-[#FF3D00]/40 shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    STARTTLS (587)
                  </button>
                </div>
              </div>

              {/* SMTP Username / Email */}
              <div className="md:col-span-6 space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  SMTP Username / Email <span className="text-[#FF3D00]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={settings.smtp_user}
                  onChange={(e) => setSettings({ ...settings, smtp_user: e.target.value })}
                  placeholder="e.g. info@doerbd.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 font-mono block">
                  Your full email address created on Hostinger Titan
                </span>
              </div>

              {/* SMTP Password */}
              <div className="md:col-span-6 space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  SMTP Password <span className="text-[#FF3D00]">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={settings.smtp_pass || ''}
                    onChange={(e) => setSettings({ ...settings, smtp_pass: e.target.value })}
                    placeholder="Enter Hostinger Titan email password"
                    className="w-full px-4 py-2.5 pr-10 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <span className="text-[10px] text-slate-400 font-mono block">
                  Encrypted &amp; securely stored in MySQL
                </span>
              </div>
            </div>
          </div>

          {/* Card 2: Sender & Receiver Addresses */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#0B101D] border border-white/15 space-y-6">
            <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
              <Mail className="w-5 h-5 text-[#FF3D00]" />
              <div>
                <h3 className="text-base font-bold text-white">Sender &amp; Receiver Addresses</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Control the From name that shows on incoming emails and the destination inbox where notifications arrive.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Sender Name */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Sender Name (From Name)
                </label>
                <input
                  type="text"
                  value={settings.sender_name}
                  onChange={(e) => setSettings({ ...settings, sender_name: e.target.value })}
                  placeholder="DOER Notifications"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs font-bold focus:border-[#FF3D00] focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 font-mono block">
                  Displays in client email app as sender (e.g. &quot;DOER Notifications&quot;)
                </span>
              </div>

              {/* Sender Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Sender Email (From Address)
                </label>
                <input
                  type="email"
                  value={settings.sender_email}
                  onChange={(e) => setSettings({ ...settings, sender_email: e.target.value })}
                  placeholder="info@doerbd.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs font-mono focus:border-[#FF3D00] focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 font-mono block">
                  Must match or be an authorized alias of your Hostinger Titan account
                </span>
              </div>

              {/* General Enquiries Receiver Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white uppercase tracking-wider block flex items-center justify-between">
                  <span>General Enquiries Primary Receiver (Admin Inbox)</span>
                  <span className="text-[10px] text-[#FF3D00] font-mono">Contact Leads Only</span>
                </label>
                <input
                  type="email"
                  required
                  value={settings.receiver_email}
                  onChange={(e) => setSettings({ ...settings, receiver_email: e.target.value })}
                  placeholder="e.g. doer.interior@gmail.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-[#FF3D00]/50 text-white text-xs font-mono font-bold focus:border-[#FF3D00] focus:outline-none shadow-[0_0_15px_rgba(255,61,0,0.15)]"
                />
                <span className="text-[10px] text-slate-400 font-mono block">
                  All customer inquiries, project layouts, and consultation requests are sent here. (E-Commerce orders are kept strictly separate).
                </span>
              </div>

              {/* CC Email */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Enquiries CC Email (Optional)
                </label>
                <input
                  type="email"
                  value={settings.cc_email || ''}
                  onChange={(e) => setSettings({ ...settings, cc_email: e.target.value })}
                  placeholder="e.g. partner@doerbd.com"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs font-mono focus:border-[#FF3D00] focus:outline-none"
                />
                <span className="text-[10px] text-slate-400 font-mono block">
                  Optional second inbox to receive copies of general inquiries
                </span>
              </div>
            </div>

            {/* Dedicated Ecommerce Order Routing Box (Strictly Separate) */}
            <div className="pt-6 border-t border-white/10 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    E-Commerce Order Notification Routing (Strictly Separate)
                  </span>
                </div>
                <span className="text-[10px] text-cyan-300 font-mono bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 font-bold">
                  <span>Isolated Store Inbox</span>
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-xs text-cyan-200/90 leading-relaxed flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Strict Inbox Separation:</strong> All e-commerce checkout orders are routed exclusively to the e-commerce inbox below. The general enquiries primary receiver will <strong>never</strong> receive e-commerce order notifications.
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-1">
                {/* Ecommerce Primary Receiver Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white uppercase tracking-wider block flex items-center justify-between">
                    <span>
                      E-Commerce Order Receiver Email <span className="text-[#FF3D00]">*</span>
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono font-bold">Mandatory Store Inbox</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={settings.order_receiver_email || ''}
                    onChange={(e) => setSettings({ ...settings, order_receiver_email: e.target.value })}
                    placeholder="e.g. orders@doerbd.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-cyan-500/50 focus:border-cyan-400 text-white text-xs font-mono font-bold focus:outline-none shadow-[0_0_15px_rgba(0,240,255,0.15)] ring-1 ring-cyan-500/30"
                  />
                  <span className="text-[10px] text-slate-400 font-mono block">
                    Every incoming customer checkout order is dispatched exclusively to this address.
                  </span>
                </div>

                {/* Ecommerce CC Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-200 uppercase tracking-wider block flex items-center justify-between">
                    <span>E-Commerce CC Email (Optional)</span>
                    <span className="text-[10px] text-slate-400 font-mono">Order Copies</span>
                  </label>
                  <input
                    type="email"
                    value={settings.order_cc_email || ''}
                    onChange={(e) => setSettings({ ...settings, order_cc_email: e.target.value })}
                    placeholder="e.g. storemanager@doerbd.com"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 focus:border-cyan-400 text-white text-xs font-mono focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 font-mono block">
                    Optional secondary address to receive copies of incoming e-commerce orders
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Automated Notification Event Toggles */}
          <div className="p-6 sm:p-7 rounded-2xl bg-[#0B101D] border border-white/15 space-y-5">
            <div className="flex items-center gap-2.5 border-b border-white/10 pb-4">
              <Bell className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-base font-bold text-white">Automated Trigger Notifications</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select which website actions automatically dispatch emails through Hostinger Titan SMTP.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Toggle 1: Enquiries */}
              <label className="flex items-start gap-3 p-4 rounded-xl bg-[#070A12] border border-white/10 hover:border-white/20 transition-all cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(settings.enquiry_notification_enabled)}
                  onChange={(e) => setSettings({ ...settings, enquiry_notification_enabled: e.target.checked })}
                  className="w-4 h-4 mt-0.5 accent-[#FF3D00] rounded cursor-pointer shrink-0"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">
                    Customer Project Enquiries (Admin Alert)
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Sends an email with full client parameters and scope details to the Receiver Email whenever someone submits the Contact / Project form.
                  </p>
                </div>
              </label>

              {/* Toggle 2: Customer Acknowledgment */}
              <label className="flex items-start gap-3 p-4 rounded-xl bg-[#070A12] border border-white/10 hover:border-white/20 transition-all cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(settings.customer_reply_enabled)}
                  onChange={(e) => setSettings({ ...settings, customer_reply_enabled: e.target.checked })}
                  className="w-4 h-4 mt-0.5 accent-[#00F0FF] rounded cursor-pointer shrink-0"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">
                    Customer Auto-Acknowledgment Email
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Sends an immediate automated confirmation email back to the customer acknowledging their project details were received.
                  </p>
                </div>
              </label>

              {/* Toggle 3: Career Applications */}
              <label className="flex items-start gap-3 p-4 rounded-xl bg-[#070A12] border border-white/10 opacity-80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(settings.career_notification_enabled)}
                  onChange={(e) => setSettings({ ...settings, career_notification_enabled: e.target.checked })}
                  className="w-4 h-4 mt-0.5 accent-[#FF3D00] rounded cursor-pointer shrink-0"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">
                    Career Job Applications (Pre-Configured)
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Sends candidate CV link and details when an application is submitted through the career portal.
                  </p>
                </div>
              </label>

              {/* Toggle 4: Orders */}
              <label className="flex items-start gap-3 p-4 rounded-xl bg-[#070A12] border border-white/10 opacity-80 cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(settings.order_notification_enabled)}
                  onChange={(e) => setSettings({ ...settings, order_notification_enabled: e.target.checked })}
                  className="w-4 h-4 mt-0.5 accent-[#FF3D00] rounded cursor-pointer shrink-0"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-white block">
                    Ecommerce Order Alerts (Pre-Configured)
                  </span>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Dispatches order summaries with product items, quantity, and BDT totals on new orders.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Primary Save Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#FF3D00]/30 transition-all cursor-pointer disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>Save Mail Settings</span>
            </button>
          </div>
        </form>
      )}

      {/* Card 4: Live SMTP Connection Tester */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#080C16] border border-cyan-500/30 space-y-5 mt-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4 flex-wrap gap-2">
          <div className="flex items-center gap-2.5">
            <Send className="w-5 h-5 text-cyan-400" />
            <div>
              <h3 className="text-base font-bold text-white">Live Hostinger Titan SMTP Connection Test</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Send an immediate test message to verify that your Titan SMTP credentials authenticate without errors.
              </p>
            </div>
          </div>

          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 text-[10px] font-mono font-bold border border-cyan-500/30">
            Self-Diagnostic Tool
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-end">
          <div className="sm:col-span-8 space-y-1.5">
            <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Send Test Email To:
            </label>
            <input
              type="email"
              value={testRecipient}
              onChange={(e) => setTestRecipient(e.target.value)}
              placeholder="e.g. doer.interior@gmail.com"
              className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs font-mono focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-4">
            <button
              type="button"
              onClick={handleSendTestEmail}
              disabled={sendingTest}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 active:scale-95 text-slate-950 text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.35)]"
            >
              {sendingTest ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Send Test Email</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Test Result Callout */}
        {testResult && (
          <div
            className={`p-4 sm:p-5 rounded-xl border space-y-3 animate-in fade-in text-xs ${
              testResult.success
                ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                : 'bg-red-500/15 border-red-500/40 text-red-300'
            }`}
          >
            <div className="flex items-center gap-2 font-bold text-sm">
              {testResult.success ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              )}
              <span>{testResult.success ? 'SMTP Connection Succeeded!' : 'SMTP Authentication Error (535)'}</span>
            </div>
            <p className="pl-7 text-xs leading-relaxed">{testResult.message}</p>
            {testResult.details && (
              <p className="pl-7 text-[11px] font-mono opacity-80">{testResult.details}</p>
            )}

            {!testResult.success && testResult.message.includes('535') && (
              <div className="ml-7 p-3.5 rounded-xl bg-black/40 border border-red-500/30 text-slate-200 text-xs space-y-2">
                <span className="font-bold text-[#FF3D00] block uppercase tracking-wider text-[11px]">
                  How to Fix Error 535 (Authentication Failed):
                </span>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-300 text-[11px] leading-relaxed">
                  <li>
                    <strong>Check Email Password:</strong> Ensure you entered the password for this specific mailbox (the password you use to log in at your webmail inbox), NOT your Hostinger hPanel main account password.
                  </li>
                  <li>
                    <strong>Check Full Username:</strong> The SMTP Username must be your complete email address (e.g. <code className="text-cyan-300">info@doerbd.com</code>), not just &quot;info&quot;.
                  </li>
                  <li>
                    <strong>Check Titan vs Standard Hostinger:</strong> If your mailbox was created under Hostinger Business/Webmail instead of Titan Email, click{' '}
                    <button
                      type="button"
                      onClick={handleApplyHostingerStandard}
                      className="underline text-cyan-300 hover:text-white font-bold cursor-pointer"
                    >
                      &quot;Switch to smtp.hostinger.com&quot;
                    </button>{' '}
                    and test again.
                  </li>
                  <li>
                    <strong>Two-Factor Authentication (2FA):</strong> If 2FA is active on your mailbox, create and enter an <em>App Password</em> from your webmail security settings.
                  </li>
                </ol>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

