'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  LogOut,
  ExternalLink,
  Database,
  Menu,
  X,
  UserCheck,
} from 'lucide-react';

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [newCount, setNewCount] = useState<number>(0);

  // Poll count of new inquiries for live badge
  useEffect(() => {
    let isMounted = true;
    const fetchNewCount = async () => {
      try {
        const res = await fetch('/api/inquiries?status=new');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) {
            setNewCount(data.inquiries?.length || 0);
          }
        }
      } catch (err) {
        // Silently catch network glitches
      }
    };

    fetchNewCount();
    const interval = setInterval(fetchNewCount, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [pathname]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800">
        <div className="relative w-28 h-8 bg-white px-2 py-1 rounded">
          <Image
            src="/images/logo.webp"
            alt="DOER Logo"
            fill
            className="object-contain"
          />
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {mobileSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-72 bg-slate-900 border-r border-slate-800 z-50 flex flex-col justify-between transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Brand Box */}
          <div className="p-6 border-b border-slate-800">
            <Link href="/" className="inline-block bg-white px-3 py-2 rounded-lg shadow-sm">
              <div className="relative w-32 h-8">
                <Image
                  src="/images/logo.webp"
                  alt="DOER Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <div className="mt-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Admin Control Center
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <div className="p-4">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              Main Menu
            </div>
            <nav className="space-y-1.5">
              <Link
                href="/admin/dashboard"
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  pathname === '/admin/dashboard'
                    ? 'bg-[#FF3D00] text-white shadow-md shadow-[#FF3D00]/20 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <LayoutDashboard className="w-5 h-5 shrink-0" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/admin/dashboard/enquiries"
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  pathname?.startsWith('/admin/dashboard/enquiries') || pathname?.startsWith('/admin/dashboard/inquiries')
                    ? 'bg-[#FF3D00] text-white shadow-md shadow-[#FF3D00]/20 font-semibold'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Inbox className="w-5 h-5 shrink-0" />
                  <span>Enquiries</span>
                </div>
                {newCount > 0 && (
                  <span
                    className={`px-2 py-0.5 text-[11px] font-bold rounded-full transition-colors ${
                      pathname?.startsWith('/admin/dashboard/enquiries') || pathname?.startsWith('/admin/dashboard/inquiries')
                        ? 'bg-white text-[#FF3D00]'
                        : 'bg-[#FF3D00] text-white animate-pulse'
                    }`}
                  >
                    {newCount}
                  </span>
                )}
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Section: DB Status & Profile & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-4">
          {/* Database Info Card */}
          <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-semibold mb-1">
              <Database className="w-4 h-4 text-[#FF3D00]" />
              <span>MySQL Database</span>
            </div>
            <div className="text-slate-400 flex flex-col gap-0.5">
              <span>Database: <strong className="text-slate-200">doer-furniture</strong></span>
              <span>Host: <strong className="text-slate-200">127.0.0.1:3306</strong></span>
              <span className="flex items-center gap-1.5 text-emerald-400 text-[11px] mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Connected (Native Driver)
              </span>
            </div>
          </div>

          {/* Admin Identity */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FF3D00]/20 border border-[#FF3D00]/40 flex items-center justify-center text-[#FF3D00]">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-200">doer-admin</p>
                <p className="text-[11px] text-slate-400">Super Administrator</p>
              </div>
            </div>
          </div>

          {/* Logout Action */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800/80 hover:bg-red-950/40 hover:text-red-300 border border-slate-700/60 hover:border-red-800/50 text-slate-300 text-xs font-medium transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>{isLoggingOut ? 'Logging out...' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="h-16 bg-slate-900/60 backdrop-blur border-b border-slate-800 px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-white tracking-tight">
              DOER Administration
            </h1>
            <span className="hidden sm:inline-flex px-2 py-0.5 text-[11px] font-semibold bg-[#FF3D00]/10 text-[#FF3D00] border border-[#FF3D00]/20 rounded">
              v1.0
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 bg-slate-900 transition-colors"
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs text-slate-400 hover:text-red-400 flex items-center gap-1 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

