'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { trackLead } from '@/lib/fpixel';

const servicesList = [
  'Control Room Interior',
  'Commercial Space Design',
  'Corporate Office Interior',
  'Interior Project Execution',
  'Remodeling & Renovation',
  'Restaurant & Café Interior',
  'Retail & Showroom Interior',
  'Hotel & Hospitality Interior',
  'Other Custom Requirements',
];

function matchServiceFromQuery(param: string | null): string {
  if (!param) return 'Commercial Space Design';
  const clean = decodeURIComponent(param).trim().toLowerCase();

  const exact = servicesList.find((s) => s.toLowerCase() === clean);
  if (exact) return exact;

  if (clean.includes('control') || clean.includes('console')) return 'Control Room Interior';
  if (clean.includes('corporate') || clean.includes('office') || clean.includes('business')) return 'Corporate Office Interior';
  if (clean.includes('execution') || clean.includes('project')) return 'Interior Project Execution';
  if (clean.includes('remodel') || clean.includes('renovat')) return 'Remodeling & Renovation';
  if (clean.includes('restaurant') || clean.includes('caf')) return 'Restaurant & Café Interior';
  if (clean.includes('retail') || clean.includes('showroom')) return 'Retail & Showroom Interior';
  if (clean.includes('hotel') || clean.includes('hospitality')) return 'Hotel & Hospitality Interior';
  if (clean.includes('commercial')) return 'Commercial Space Design';

  return 'Other Custom Requirements';
}

function ContactPageContent() {
  const searchParams = useSearchParams();
  const serviceParam = searchParams.get('service');

  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    serviceInterested: 'Commercial Space Design',
    projectLocation: '',
    projectDetails: '',
  });

  const [hasAutoSelected, setHasAutoSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (serviceParam) {
      const matched = matchServiceFromQuery(serviceParam);
      setFormData((prev) => ({
        ...prev,
        serviceInterested: matched,
      }));
      setHasAutoSelected(true);

      // Smooth scroll to the inquiry form
      const formEl = document.getElementById('project-form');
      if (formEl) {
        setTimeout(() => {
          formEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    }
  }, [serviceParam]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit inquiry. Please try again.');
      }

      setSuccessMessage(
        data.message ||
          'Thank you for contacting DOER. We have received your inquiry and look forward to discussing your project.'
      );

      // Meta Pixel Lead Event
      trackLead({
        content_name: formData.serviceInterested || 'General Contact Inquiry',
        content_category: 'Contact Form',
        value: 0,
        currency: 'BDT',
      });

      // Reset form
      setFormData({
        fullName: '',
        companyName: '',
        email: '',
        phone: '',
        serviceInterested: serviceParam ? matchServiceFromQuery(serviceParam) : 'Commercial Space Design',
        projectLocation: '',
        projectDetails: '',
      });
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-slate-100 selection:bg-[#FF3D00] selection:text-white relative overflow-hidden">
      {/* 01. Page Banner */}
      <section className="relative pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-20 lg:pb-28 bg-[#05070B] text-white overflow-hidden bg-circuit-grid border-b border-cyan-500/20">
        <div className="neon-line-v-cyan absolute top-0 bottom-0 left-0 z-20" />
        <div className="neon-line-v-orange absolute top-0 bottom-0 right-0 z-20" />
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
            alt="Contact DOER Banner"
            fill
            priority
            className="object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-[#05070B]/80 to-transparent" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-[140px] pointer-events-none" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF3D00]/10 border border-[#FF3D00]/30 text-[#FF3D00] text-[11px] sm:text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,61,0,0.25)]">
            <span className="w-2 h-2 rounded-full bg-[#FF3D00] animate-pulse" />
            <span>Direct Communications</span>
          </div>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Contact DOER
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-lg lg:text-xl text-slate-300 font-normal px-2 sm:px-0 leading-relaxed">
            Let&apos;s build mission-critical spaces and luxury interior experiences together.
          </p>
        </div>
      </section>

      {/* 02. Main Contact Grid */}
      <section className="py-16 sm:py-20 lg:py-28 bg-[#05070B] bg-cyber-grid relative">
        <div className="neon-line-v-orange absolute top-0 bottom-0 left-0 z-20" />
        <div className="neon-line-v-cyan absolute top-0 bottom-0 right-0 z-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            
            {/* Left: Direct Information */}
            <div className="lg:col-span-5 space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider mb-3">
                  <span>Headquarters &amp; Factory</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  Get In Touch
                </h2>
                <p className="mt-3 text-slate-300 leading-relaxed text-xs sm:text-sm lg:text-base font-normal">
                  Whether you require bespoke 24/7 command console tables, turnkey control room interior fit-outs, or architectural metal art, our team is ready to consult.
                </p>
              </div>

              {/* Contact Information Cards */}
              <div className="bg-[#0B101D]/90 rounded-2xl sm:rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6 cyber-corner text-white">
                <ul className="space-y-6">
                  {/* Address */}
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,61,0,0.25)]">
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 block">
                        Factory &amp; Engineering Studio
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 leading-snug font-medium">
                        Kazi Bari Road, Jagannathpur, Khilkhet, Dhaka-1229, Bangladesh
                      </p>
                    </div>
                  </li>

                  {/* Phone */}
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.25)]">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 block">
                        Direct Lines &amp; WhatsApp
                      </span>
                      <div className="flex flex-col text-xs sm:text-sm text-slate-200 font-semibold space-y-0.5">
                        <a href="tel:+8801976535654" className="hover:text-[#FF3D00] transition-colors">
                          +880 1976-535654
                        </a>
                        <a href="tel:+8801712716075" className="hover:text-[#FF3D00] transition-colors">
                          +880 1712-716075
                        </a>
                      </div>
                    </div>
                  </li>

                  {/* Email */}
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(255,61,0,0.25)]">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 block">
                        Official Correspondence
                      </span>
                      <div className="flex flex-col text-xs sm:text-sm text-slate-200 font-semibold space-y-0.5">
                        <a href="mailto:doer.interior@gmail.com" className="hover:text-[#FF3D00] transition-colors">
                          doer.interior@gmail.com
                        </a>
                        <a href="mailto:info@doerbd.com" className="hover:text-[#FF3D00] transition-colors">
                          info@doerbd.com
                        </a>
                      </div>
                    </div>
                  </li>

                  {/* Web */}
                  <li className="flex items-start gap-4">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(0,240,255,0.25)]">
                      <Globe className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-slate-400 block">
                        Official Domains
                      </span>
                      <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-200 font-semibold">
                        <a
                          href="https://www.doerbd.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#FF3D00] transition-colors"
                        >
                          www.doerbd.com
                        </a>
                        <span className="text-white/20">/</span>
                        <a
                          href="https://www.doerbd.net"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#FF3D00] transition-colors"
                        >
                          www.doerbd.net
                        </a>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Inquiry Form */}
            <div id="project-form" className="lg:col-span-7 scroll-mt-28">
              <div className="bg-[#0B101D]/90 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 border border-white/10 shadow-2xl cyber-corner text-white">
                <div className="mb-6 sm:mb-8 space-y-2">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF3D00]/10 border border-[#FF3D00]/30 text-[#FF3D00] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                      <span>Project Form</span>
                    </div>

                    {hasAutoSelected && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[11px] font-mono font-bold animate-in fade-in duration-300">
                        <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Pre-selected: {formData.serviceInterested}</span>
                      </div>
                    )}
                  </div>

                  <h3 className="text-xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                    Tell Us About Your Project
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 font-normal">
                    Submit your project parameters and our engineering team will get in touch.
                  </p>
                </div>

                {/* Feedback Alerts */}
                {errorMessage && (
                  <div className="mb-6 p-3.5 sm:p-4 rounded-xl bg-red-950/60 border border-red-500/30 text-red-400 text-xs sm:text-sm flex items-start gap-2.5 sm:gap-3">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="mb-6 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs sm:text-sm flex items-start gap-3 sm:gap-3.5 animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm sm:text-base text-emerald-300">Inquiry Confirmed</p>
                      <p className="mt-1 leading-relaxed text-emerald-400">{successMessage}</p>
                    </div>
                  </div>
                )}

                {/* Form Fields */}
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 sm:mb-2">
                        Full Name <span className="text-[#FF3D00]">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Mohammad Sharif"
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#0E1526] border border-white/10 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-[#121B30] focus:border-[#FF3D00] transition-colors"
                      />
                    </div>

                    {/* Company Name */}
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 sm:mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="e.g. Apex Holdings"
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#0E1526] border border-white/10 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-[#121B30] focus:border-[#FF3D00] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Email Address */}
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 sm:mb-2">
                        Email Address <span className="text-[#FF3D00]">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@company.com"
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#0E1526] border border-white/10 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-[#121B30] focus:border-[#FF3D00] transition-colors"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 sm:mb-2">
                        Phone Number <span className="text-[#FF3D00]">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="017XXXXXXXX"
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#0E1526] border border-white/10 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-[#121B30] focus:border-[#FF3D00] transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Service Interested In */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                        <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300">
                          Service Interested In
                        </label>
                        {hasAutoSelected && (
                          <span className="text-[10px] text-cyan-400 font-mono font-bold flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-cyan-400" />
                            <span>Auto-Selected</span>
                          </span>
                        )}
                      </div>
                      <select
                        name="serviceInterested"
                        value={formData.serviceInterested}
                        onChange={(e) => {
                          setHasAutoSelected(false);
                          handleChange(e);
                        }}
                        className={`w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#0E1526] border text-white text-xs sm:text-sm focus:outline-none focus:bg-[#121B30] focus:border-[#FF3D00] transition-all font-medium ${
                          hasAutoSelected
                            ? 'border-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                            : 'border-white/10'
                        }`}
                      >
                        {servicesList.map((srv) => (
                          <option key={srv} value={srv} className="bg-[#0E1526] text-white">
                            {srv}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Project Location */}
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 sm:mb-2">
                        Project Location
                      </label>
                      <input
                        type="text"
                        name="projectLocation"
                        value={formData.projectLocation}
                        onChange={handleChange}
                        placeholder="e.g. Gulshan / Uttara / Sylhet"
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#0E1526] border border-white/10 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-[#121B30] focus:border-[#FF3D00] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Project Details */}
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 sm:mb-2">
                      Project Details <span className="text-[#FF3D00]">*</span>
                    </label>
                    <textarea
                      name="projectDetails"
                      required
                      rows={4}
                      value={formData.projectDetails}
                      onChange={handleChange}
                      placeholder="Briefly describe your project scope, space size, functional requirements, or delivery timeline..."
                      className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#0E1526] border border-white/10 text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:bg-[#121B30] focus:border-[#FF3D00] transition-colors leading-relaxed"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-9 py-3.5 sm:py-4 bg-[#FF3D00] hover:bg-[#eb3800] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(255,61,0,0.45)] border border-[#FF3D00] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Sending Inquiry...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Inquiry</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#05070B] flex items-center justify-center text-slate-400 text-xs font-mono">
          Loading contact form...
        </div>
      }
    >
      <ContactPageContent />
    </Suspense>
  );
}
