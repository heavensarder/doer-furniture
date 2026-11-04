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
  Building2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

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
    'Commercial Space Design',
    'Corporate Office Interior',
    'Furniture Customization & Fabrication',
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
    <div className="min-h-screen bg-white">
      {/* Page Banner */}
      <section className="relative pt-28 sm:pt-36 lg:pt-40 pb-16 sm:pb-20 lg:pb-28 bg-slate-950 text-white overflow-hidden bg-architectural-grid-dark">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
            alt="Contact DOER Banner"
            fill
            priority
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 sm:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
            <span>Connect With Us</span>
          </div>
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Let&apos;s Talk About Your Project.
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-lg lg:text-xl text-slate-300 font-light px-2 sm:px-0 leading-relaxed">
            Have an idea or a project in mind? We would love to hear from you.
          </p>
        </div>
      </section>

      {/* Main Content: Info & Inquiry Form */}
      <section className="py-16 sm:py-20 lg:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-16">
            
            {/* Left: Contact Information */}
            <div className="lg:col-span-5 space-y-6 sm:space-y-8">
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-orange-50 border border-orange-200 text-[#FF3D00] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                  <span>Get in Touch</span>
                </div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Start a Conversation
                </h2>
                <p className="text-slate-600 leading-relaxed text-xs sm:text-sm lg:text-base font-normal">
                  Whether you are planning a commercial interior, corporate office, showroom, customized furniture, or renovation project, our team is ready to discuss your requirements.
                </p>
                <p className="text-slate-600 leading-relaxed text-xs sm:text-sm lg:text-base font-normal">
                  Reach out to us and let&apos;s explore how we can work together.
                </p>
              </div>

              {/* Contact Information Card */}
              <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-slate-200 shadow-xl space-y-5 sm:space-y-6">
                <h3 className="text-lg sm:text-xl font-black text-slate-900 border-b border-slate-100 pb-3 sm:pb-4 flex items-center justify-between">
                  <span>DOER</span>
                  <span className="text-[11px] sm:text-xs uppercase tracking-widest text-[#FF3D00] font-bold">Studio Office</span>
                </h3>

                <ul className="space-y-4 sm:space-y-5 text-xs sm:text-sm">
                  {/* Address */}
                  <li className="flex items-start gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FF3D00]/10 text-[#FF3D00] flex items-center justify-center shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Address
                      </span>
                      <p className="text-slate-800 font-semibold leading-relaxed">
                        House: DOER, Pachkani, Barua, Khilkhet, Dhaka, Bangladesh.
                      </p>
                    </div>
                  </li>

                  {/* Phone */}
                  <li className="flex items-start gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FF3D00]/10 text-[#FF3D00] flex items-center justify-center shrink-0 mt-0.5">
                      <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Phone
                      </span>
                      <a
                        href="tel:01716535654"
                        className="text-slate-900 font-bold hover:text-[#FF3D00] transition-colors text-sm sm:text-base"
                      >
                        01716535654
                      </a>
                    </div>
                  </li>

                  {/* Email */}
                  <li className="flex items-start gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FF3D00]/10 text-[#FF3D00] flex items-center justify-center shrink-0 mt-0.5">
                      <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Email
                      </span>
                      <a
                        href="mailto:info@doerbd.com"
                        className="text-slate-900 font-bold hover:text-[#FF3D00] transition-colors text-xs sm:text-sm"
                      >
                        info@doerbd.com
                      </a>
                    </div>
                  </li>

                  {/* Website */}
                  <li className="flex items-start gap-3 sm:gap-4">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-[#FF3D00]/10 text-[#FF3D00] flex items-center justify-center shrink-0 mt-0.5">
                      <Globe className="w-4 h-4 sm:w-5 sm:h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block mb-0.5">
                        Website
                      </span>
                      <div className="flex flex-wrap gap-1.5 sm:gap-2 text-slate-800 font-bold text-xs sm:text-sm">
                        <a
                          href="https://www.doerbd.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-[#FF3D00] transition-colors"
                        >
                          www.doerbd.com
                        </a>
                        <span className="text-slate-300">/</span>
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
              <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-12 border border-slate-200 shadow-xl sm:shadow-2xl">
                <div className="mb-6 sm:mb-8 space-y-1.5 sm:space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-orange-50 border border-orange-200 text-[#FF3D00] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
                    <span>Project Form</span>
                  </div>
                  <h3 className="text-xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                    Tell Us About Your Project
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 font-normal">
                    Submit your project parameters and our engineering team will get in touch.
                  </p>
                </div>

                {/* Feedback Alerts */}
                {errorMessage && (
                  <div className="mb-6 p-3.5 sm:p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start gap-2.5 sm:gap-3">
                    <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="mb-6 p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs sm:text-sm flex items-start gap-3 sm:gap-3.5 animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-sm sm:text-base text-emerald-800">Inquiry Confirmed</p>
                      <p className="mt-1 leading-relaxed text-emerald-700">{successMessage}</p>
                    </div>
                  </div>
                )}

                {/* Form Fields */}
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Full Name */}
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 sm:mb-2">
                        Full Name <span className="text-[#FF3D00]">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="e.g. Mohammad Sharif"
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3D00] focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Company Name */}
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 sm:mb-2">
                        Company Name
                      </label>
                      <input
                        type="text"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        placeholder="e.g. Apex Holdings"
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3D00] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Email Address */}
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 sm:mb-2">
                        Email Address <span className="text-[#FF3D00]">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="name@company.com"
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3D00] focus:border-transparent transition-all"
                      />
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 sm:mb-2">
                        Phone Number <span className="text-[#FF3D00]">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="017XXXXXXXX"
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3D00] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    {/* Service Interested In */}
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 sm:mb-2">
                        Service Interested In
                      </label>
                      <select
                        name="serviceInterested"
                        value={formData.serviceInterested}
                        onChange={handleChange}
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3D00] focus:border-transparent transition-all font-medium"
                      >
                        {servicesList.map((srv) => (
                          <option key={srv} value={srv}>
                            {srv}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Project Location */}
                    <div>
                      <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 sm:mb-2">
                        Project Location
                      </label>
                      <input
                        type="text"
                        name="projectLocation"
                        value={formData.projectLocation}
                        onChange={handleChange}
                        placeholder="e.g. Gulshan / Uttara / Sylhet"
                        className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3D00] focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  {/* Project Details */}
                  <div>
                    <label className="block text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 sm:mb-2">
                      Project Details <span className="text-[#FF3D00]">*</span>
                    </label>
                    <textarea
                      name="projectDetails"
                      required
                      rows={4}
                      value={formData.projectDetails}
                      onChange={handleChange}
                      placeholder="Briefly describe your project scope, space size, functional requirements, or delivery timeline..."
                      className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#FF3D00] focus:border-transparent transition-all leading-relaxed"
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="pt-1">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 sm:px-9 py-3.5 sm:py-4 bg-[#FF3D00] hover:bg-[#eb3800] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#FF3D00]/25 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
