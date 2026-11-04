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
      // Full page navigation ensures the cookie is sent immediately to middleware
      setTimeout(() => {
        window.location.href = '/admin/dashboard';
      }, 400);
    } catch (err: any) {
      setError(err.message || 'An error occurred during login');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-[#FF3D00]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#FF3D00]/5 rounded-full blur-2xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        {/* DOER Logo */}
        <div className="flex justify-center">
          <Link href="/" className="inline-block bg-white p-3 rounded-xl shadow-lg border border-slate-800">
            <div className="relative w-40 h-10">
              <Image
                src="/images/logo.webp"
                alt="DOER Logo"
                fill
                priority
                className="object-contain"
              />
            </div>
          </Link>
        </div>

        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/60 text-slate-300 text-xs font-medium mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF3D00]" />
            <span>DOER Internal Management Portal</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white">
            Admin Sign In
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Enter your administrative credentials to continue
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4 sm:px-0">
        <div className="bg-slate-900/90 border border-slate-800 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          
          {error && (
            <div className="mb-5 p-3.5 rounded-lg bg-red-950/60 border border-red-800 text-red-200 text-sm flex items-start gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-5 p-3.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-200 text-sm flex items-start gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Authentication verified. Redirecting to dashboard...</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Username
              </label>
              <div className="relative rounded-lg shadow-sm">
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
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF3D00] focus:border-transparent text-sm transition-all"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative rounded-lg shadow-sm">
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
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#FF3D00] focus:border-transparent text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
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
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-semibold text-white bg-[#FF3D00] hover:bg-[#e63700] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-[#FF3D00] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
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
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
            >
              ← Back to DOER Website
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
