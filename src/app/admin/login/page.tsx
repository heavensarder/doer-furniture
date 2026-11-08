'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Lock, User, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password: password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed. Please verify credentials.');
      }

      setSuccess(true);
      setTimeout(() => {
        window.location.href = '/admin/dashboard';
      }, 400);
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-slate-100 bg-cyber-grid flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Atmospheric Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#FF3D00]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[400px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Vertical Neon Laser Lines */}
      <div className="neon-line-v-cyan absolute top-0 bottom-0 left-4 sm:left-8 z-20 pointer-events-none opacity-50" />
      <div className="neon-line-v-orange absolute top-0 bottom-0 right-4 sm:right-8 z-20 pointer-events-none opacity-50" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* DOER Logo */}
        <div className="flex justify-center">
          <Link href="/" className="inline-block bg-[#0B101D] p-3 rounded-2xl shadow-2xl border border-cyan-500/30 cyber-corner group">
            <div className="relative w-40 h-10 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/images/logo.webp"
                alt="DOER Logo"
                fill
                priority
                className="object-contain drop-shadow-[0_0_15px_rgba(255,61,0,0.35)]"
              />
            </div>
          </Link>
        </div>

        <div className="mt-6 text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0E1526] border border-white/10 text-slate-300 text-xs font-semibold mb-3 shadow-sm">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF3D00]" />
            <span>DOER Internal Management Portal</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
            Admin Sign In
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Enter your administrative credentials to continue
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-[#0B101D]/95 border border-white/10 py-8 px-6 shadow-[0_20px_50px_rgba(0,0,0,0.85)] rounded-3xl sm:px-10 cyber-corner backdrop-blur-xl">
          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-red-500/15 border border-red-500/30 text-red-300 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-sm flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Authentication verified. Redirecting to dashboard...</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Username
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  autoComplete="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username (doer-admin)"
                  className="block w-full pl-10 pr-3 py-2.5 bg-[#0E1526] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:bg-[#121B30] focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] text-sm transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="block w-full pl-10 pr-10 py-2.5 bg-[#0E1526] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:bg-[#121B30] focus:border-[#FF3D00] focus:ring-1 focus:ring-[#FF3D00] text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading || success}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl shadow-[0_0_20px_rgba(255,61,0,0.4)] text-sm font-bold uppercase tracking-wider text-white bg-[#FF3D00] hover:bg-[#eb3800] focus:outline-none focus:ring-2 focus:ring-[#FF3D00] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer border border-[#FF3D00]"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In to Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Back to site */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-400 hover:text-[#FF3D00] transition-colors"
            >
              ← Back to DOER Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
