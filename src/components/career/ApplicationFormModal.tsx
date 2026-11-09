'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import {
  Upload,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  User,
  GraduationCap,
  Briefcase,
  Phone,
  Mail,
  MapPin,
  Check,
  Sparkles,
} from 'lucide-react';

interface ApplicationFormModalProps {
  job: {
    id: number;
    title: string;
    position?: string;
    job_type?: string;
  };
  onClose?: () => void;
  isOpen?: boolean;
  isInline?: boolean; // When true, rendered directly on page instead of modal dialog
}

export default function ApplicationFormModal({
  job,
  onClose,
  isOpen = true,
  isInline = false,
}: ApplicationFormModalProps) {
  // Form fields
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoDragOver, setPhotoDragOver] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [highestQualification, setHighestQualification] = useState('');
  const [institution, setInstitution] = useState('');
  const [experienceYears, setExperienceYears] = useState('');

  const [cv, setCv] = useState<File | null>(null);
  const [cvDragOver, setCvDragOver] = useState(false);

  const [whyJoin, setWhyJoin] = useState('');
  const [agreed, setAgreed] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const photoInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen && !isInline) return null;

  // Handle Photo Selection
  const handlePhotoFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Please upload a valid image file (JPG, PNG, WebP) for the photo.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Candidate photo size must be less than 5MB.');
      return;
    }
    setError(null);
    setPhoto(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  // Handle CV Selection
  const handleCvFile = (file: File) => {
    const validExtensions = ['.pdf', '.doc', '.docx'];
    const fileExt = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!validExtensions.includes(fileExt) && !file.type.includes('pdf') && !file.type.includes('word')) {
      setError('CV must be in PDF, DOC, or DOCX format.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('CV file size exceeds the 5MB maximum limit. Please upload a file under 5MB.');
      return;
    }
    setError(null);
    setCv(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!photo) {
      setError('Candidate photo is required. Please upload or drag and drop your photo.');
      return;
    }
    if (!fullName.trim()) {
      setError('Full Name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError('A valid Email Address is required.');
      return;
    }
    if (!phone.trim()) {
      setError('Phone Number is required.');
      return;
    }
    if (!currentAddress.trim()) {
      setError('Current Address is required.');
      return;
    }
    if (!highestQualification.trim()) {
      setError('Highest Educational Qualifications is required.');
      return;
    }
    if (!institution.trim()) {
      setError('University / Institution is required.');
      return;
    }
    if (!experienceYears.trim()) {
      setError('Years of Professional Experience is required.');
      return;
    }
    if (!cv) {
      setError('CV Upload is required. Please attach your resume (Max 5MB).');
      return;
    }
    if (!whyJoin.trim()) {
      setError('Please share why you want to join DOER.');
      return;
    }
    if (!agreed) {
      setError('Please confirm that the information provided is accurate and agree to DOER\'s Privacy Policy.');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('job_id', String(job.id));
      formData.append('job_title', job.title);
      formData.append('position', job.position || job.title);
      formData.append('photo', photo);
      formData.append('full_name', fullName.trim());
      formData.append('email', email.trim());
      formData.append('phone', phone.trim());
      formData.append('current_address', currentAddress.trim());
      formData.append('highest_qualification', highestQualification.trim());
      formData.append('institution', institution.trim());
      formData.append('experience_years', experienceYears.trim());
      formData.append('cv', cv);
      formData.append('why_join', whyJoin.trim());
      formData.append('agreed', 'true');

      const res = await fetch('/api/careers/apply', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit application.');
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred during submission. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const formContent = (
    <div className="space-y-6">
      {success ? (
        <div className="p-8 text-center space-y-4 my-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(16,185,129,0.35)]">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-white">Application Received!</h3>
          <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
            Thank you for applying for the position of <strong className="text-white">&ldquo;{job.title}&rdquo;</strong>. Our Talent Acquisition team will carefully review your credentials and contact shortlisted candidates.
          </p>
          <div className="pt-3">
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg"
              >
                Close Window
              </button>
            ) : (
              <a
                href="/career"
                className="inline-block px-6 py-2.5 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider cursor-pointer shadow-lg"
              >
                Explore Other Openings
              </a>
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {/* HIGHLIGHTED POSITION BANNER */}
          <div className="p-3.5 rounded-xl bg-[#070A12] border border-[#FF3D00]/40 flex items-center justify-between gap-3 flex-wrap shadow-[0_0_15px_rgba(255,61,0,0.15)]">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block font-mono">
                Applying For Position
              </span>
              <span className="text-sm sm:text-base font-black text-white flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-[#FF3D00] animate-pulse" />
                <span className="text-[#FF3D00]">{job.position || job.title}</span>
              </span>
            </div>
            {job.job_type && (
              <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
                {job.job_type}
              </span>
            )}
          </div>

          {/* Section 1: Photo Upload with Drag and Drop */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              Photo with drag and drop option <span className="text-[#FF3D00]">*</span>
            </label>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setPhotoDragOver(true);
              }}
              onDragLeave={() => setPhotoDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setPhotoDragOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handlePhotoFile(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => photoInputRef.current?.click()}
              className={`p-4 rounded-2xl border-2 border-dashed transition-all cursor-pointer flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left ${
                photoDragOver
                  ? 'border-[#FF3D00] bg-[#FF3D00]/10'
                  : photoPreview
                  ? 'border-emerald-500/40 bg-[#0E1526]'
                  : 'border-white/15 bg-[#070A12] hover:border-[#FF3D00]/60 hover:bg-white/5'
              }`}
            >
              <input
                ref={photoInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handlePhotoFile(e.target.files[0]);
                  }
                }}
              />

              {photoPreview ? (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border-2 border-emerald-400 shadow-md shrink-0 mx-auto sm:mx-0">
                  <Image src={photoPreview} alt="Preview" fill className="object-cover" />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-xl bg-[#0E1526] border border-white/15 text-slate-400 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                  <User className="w-8 h-8 text-slate-500" />
                </div>
              )}

              <div className="space-y-1 flex-1">
                <p className="text-xs font-bold text-white">
                  {photo ? photo.name : 'Drag & drop your passport-size photo here, or browse'}
                </p>
                <p className="text-[11px] text-slate-400">
                  Supports JPG, PNG, WebP (Max 5MB). Professional photo recommended.
                </p>
              </div>

              {photo && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPhoto(null);
                    setPhotoPreview(null);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-red-500/15 hover:bg-red-500 text-red-400 hover:text-white text-[11px] font-bold transition-all shrink-0 cursor-pointer"
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Section 2: Personal Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Full Name <span className="text-[#FF3D00]">*</span>
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your complete legal name"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-[#FF3D00] transition-colors"
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Email Address <span className="text-[#FF3D00]">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="candidate@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-[#FF3D00] transition-colors"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Phone Number <span className="text-[#FF3D00]">*</span>
              </label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+880 1XXX-XXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-[#FF3D00] transition-colors"
              />
            </div>

            {/* Current Address */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Current Address <span className="text-[#FF3D00]">*</span>
              </label>
              <textarea
                rows={2}
                required
                value={currentAddress}
                onChange={(e) => setCurrentAddress(e.target.value)}
                placeholder="Apartment/House, Road, Area, City, Postal Code"
                className="w-full px-3.5 py-2 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-[#FF3D00] transition-colors resize-none"
              />
            </div>
          </div>

          {/* Section 3: Educational Qualifications & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Highest Educational Qualifications */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Highest Educational Qualifications <span className="text-[#FF3D00]">*</span>
              </label>
              <input
                type="text"
                required
                value={highestQualification}
                onChange={(e) => setHighestQualification(e.target.value)}
                placeholder="e.g. B.Sc. in Architecture / Mechanical Eng."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-[#FF3D00] transition-colors"
              />
            </div>

            {/* University / Institution */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                University / Institution <span className="text-[#FF3D00]">*</span>
              </label>
              <input
                type="text"
                required
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. BUET / AUST / NSU"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-[#FF3D00] transition-colors"
              />
            </div>

            {/* Years of Professional Experience */}
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                Years of Professional Experience <span className="text-[#FF3D00]">*</span>
              </label>
              <input
                type="text"
                required
                value={experienceYears}
                onChange={(e) => setExperienceYears(e.target.value)}
                placeholder="e.g. Fresh Graduate / 2 Years in Interior CAD"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-[#FF3D00] transition-colors"
              />
            </div>
          </div>

          {/* Section 4: CV Upload option with drag and drop system maximum size 5mb */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                CV Upload (Drag &amp; Drop) <span className="text-[#FF3D00]">*</span>
              </label>
              <span className="text-[10px] font-mono text-cyan-400 font-bold">Maximum size: 5MB</span>
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setCvDragOver(true);
              }}
              onDragLeave={() => setCvDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setCvDragOver(false);
                if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                  handleCvFile(e.dataTransfer.files[0]);
                }
              }}
              onClick={() => cvInputRef.current?.click()}
              className={`p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center space-y-2 ${
                cvDragOver
                  ? 'border-[#FF3D00] bg-[#FF3D00]/10'
                  : cv
                  ? 'border-emerald-500/50 bg-[#0E1526]'
                  : 'border-white/15 bg-[#070A12] hover:border-[#FF3D00]/60 hover:bg-white/5'
              }`}
            >
              <input
                ref={cvInputRef}
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleCvFile(e.target.files[0]);
                  }
                }}
              />

              {cv ? (
                <div className="flex items-center justify-center gap-3">
                  <FileText className="w-7 h-7 text-emerald-400 shrink-0" />
                  <div className="text-left">
                    <p className="text-xs font-bold text-white truncate max-w-xs">{cv.name}</p>
                    <p className="text-[11px] text-emerald-400 font-mono">
                      {(cv.size / (1024 * 1024)).toFixed(2)} MB • Ready for upload
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setCv(null);
                    }}
                    className="p-1 rounded-md text-red-400 hover:text-white hover:bg-red-500/20 text-xs ml-2"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs font-bold text-white">
                    Drag and drop your CV file here, or click to browse
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Accepted formats: PDF, DOC, DOCX • Strictly capped at 5MB
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 5: Why do you want to join DOER? */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
              Why do you want to join DOER? <span className="text-[#FF3D00]">*</span>
            </label>
            <textarea
              rows={4}
              required
              value={whyJoin}
              onChange={(e) => setWhyJoin(e.target.value)}
              placeholder="Tell us what motivates you to join DOER, how your skills align with our control room and precision interior projects, and your career aspirations..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-[#FF3D00] transition-colors leading-relaxed"
            />
          </div>

          {/* Section 6: Confirmation Checkbox */}
          <div className="pt-1">
            <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300 select-none">
              <input
                type="checkbox"
                required
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-[#FF3D00] rounded shrink-0 cursor-pointer"
              />
              <span className="leading-relaxed">
                I confirm that the information provided is accurate and agree to DOER&apos;s Privacy Policy.
              </span>
            </label>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] active:scale-95 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,61,0,0.4)] disabled:opacity-50 transition-all cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Submitting Application...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Submit Application</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );

  // If inline, return form wrapped in a clean section container
  if (isInline) {
    return (
      <div className="p-5 sm:p-8 rounded-2xl bg-[#0B101D] border border-cyan-500/20 shadow-2xl cyber-corner text-white">
        <div className="border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md bg-[#FF3D00] text-white text-[10px] font-bold uppercase tracking-wider">
              Application Portal
            </span>
            <span className="text-xs text-slate-400 font-mono">Job ID #{job.id}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
            Apply for: {job.title}
          </h2>
        </div>
        {formContent}
      </div>
    );
  }

  // Otherwise, return modal overlay
  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#0B101D] border border-white/15 rounded-3xl shadow-2xl p-5 sm:p-8 space-y-4 my-8 text-white cyber-corner">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-white/10 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-md bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] text-[10px] font-bold uppercase tracking-wider">
                DOER Careers
              </span>
              {job.job_type && (
                <span className="px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-400 text-[10px] font-bold uppercase">
                  {job.job_type}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
              Apply for {job.title}
            </h2>
          </div>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {formContent}
      </div>
    </div>
  );
}

