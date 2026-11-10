'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Send,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { trackLead } from '@/lib/fpixel';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    serviceInterested: 'Commercial Space Design',
    projectLocation: '',
    projectDetails: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        serviceInterested: 'Commercial Space Design',
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
            <span>Connect With Us</span>
          </div>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            Let&apos;s Talk About Your Project.
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-lg lg:text-xl text-slate-300 font-normal px-2 sm:px-0 leading-relaxed">
            Have an idea or a project in mind? We would love to hear from you.
          </p>
        </div>
      </section>

      {/* 02. Main Content: Info & Inquiry Form */}
      <section className="py-16 sm:py-20 lg:py-24 bg-[#070A12] bg-cyber-grid relative text-white border-b border-cyan-500/20">
        <div className="neon-line-v-orange absolute top-0 bottom-0 left-0 z-20" />
        <div className="neon-line-v-cyan absolute top-0 bottom-0 right-0 z-20" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16">
            
            {/* Left: Contact Information */}
            <div className="lg:col-span-5 space-y-6 sm:space-y-8">
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF3D00]/10 border border-[#FF3D00]/30 text-[#FF3D00] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                  <span>Get in Touch</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                  Start a Conversation
                </h2>
                <p className="text-slate-300 leading-relaxed text-xs sm:text-sm lg:text-base font-normal">
                  Whether you are planning a commercial interior, corporate office, showroom, customized furniture, or renovation project, our team is ready to discuss your requirements.
                </p>
                <p className="text-slate-400 leading-relaxed text-xs sm:text-sm lg:text-base font-normal">
                  Reach out to us and let&apos;s explore how we can work together.
                </p>
              </div>

              {/* Contact Information Card */}
              <div className="bg-[#0B101D]/90 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 shadow-2xl space-y-5 sm:space-y-6 cyber-corner text-white">
                <h3 className="text-lg sm:text-xl font-black text-white border-b border-white/10 pb-3 sm:pb-4 flex items-center justify-between">
                  <span>DOER</span>
                  <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#FF3D00] font-bold">Studio Office</span>
                </h3>

                <ul className="space-y-4 sm:space-y-5 text-xs sm:text-sm">
                  {/* Address */}
                  <li className="flex items-start gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_15px_rgba(255,61,0,0.25)]">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Address
                      </span>
                      <p className="text-slate-200 font-semibold leading-relaxed">
                        House: DOER, Pachkani, Barua, Khilkhet, Dhaka, Bangladesh.
                      </p>
                    </div>
                  </li>

                  {/* Phone */}
                  <li className="flex items-start gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_15px_rgba(255,61,0,0.25)]">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Phone
                      </span>
                      <a
                        href="tel:01976535654"
                        className="text-white font-bold hover:text-[#FF3D00] transition-colors text-sm sm:text-base"
                      >
                        01976535654
                      </a>
                    </div>
                  </li>

                  {/* Email */}
                  <li className="flex items-start gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_15px_rgba(255,61,0,0.25)]">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Email
                      </span>
                      <a
                        href="mailto:info@doerbd.com"
                        className="text-white font-bold hover:text-[#FF3D00] transition-colors text-xs sm:text-sm"
                      >
                        info@doerbd.com
                      </a>
                    </div>
                  </li>

                  {/* Website */}
                  <li className="flex items-start gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_15px_rgba(255,61,0,0.25)]">
                      <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Website
                      </span>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 text-slate-200 font-bold text-xs sm:text-sm">
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
            <div className="lg:col-span-7">
              <div className="bg-[#0B101D]/90 rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 border border-white/10 shadow-2xl cyber-corner text-white">
                <div className="mb-6 sm:mb-8 space-y-1.5 sm:space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF3D00]/10 border border-[#FF3D00]/30 text-[#FF3D00] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                    <span>Project Form</span>
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
                      <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 sm:mb-2">
                        Service Interested In
                      </label>
                      <select
                        name="serviceInterested"
                        value={formData.serviceInterested}
                        onChange={handleChange}
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#0E1526] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:bg-[#121B30] focus:border-[#FF3D00] transition-colors font-medium"
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
