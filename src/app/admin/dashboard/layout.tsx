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
  ShoppingBag,
  Package,
  FolderTree,
  ClipboardList,
  ChevronDown,
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
  const [pendingOrdersCount, setPendingOrdersCount] = useState<number>(0);
  const [ecommerceOpen, setEcommerceOpen] = useState<boolean>(true);

  // Poll count of new inquiries & pending orders for live badges
  useEffect(() => {
    let isMounted = true;
    const fetchCounts = async () => {
      try {
        const [inqRes, ordRes] = await Promise.all([
          fetch('/api/inquiries?status=new'),
          fetch('/api/orders?status=pending'),
        ]);
        if (inqRes.ok) {
          const data = await inqRes.json();
          if (isMounted) {
            setNewCount(data.inquiries?.length || 0);
          }
        }
        if (ordRes.ok) {
          const ordData = await ordRes.json();
          if (isMounted) {
            setPendingOrdersCount(ordData.orders?.length || 0);
          }
        }
      } catch (err) {
        // Silently catch network glitches
      }
    };

    fetchCounts();
    const interval = setInterval(fetchCounts, 25000);
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

  const isEcommerceRoute =
    pathname?.startsWith('/admin/dashboard/orders') ||
    pathname?.startsWith('/admin/dashboard/products') ||
    pathname?.startsWith('/admin/dashboard/categories');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      {/* Mobile Top App Bar */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 -ml-1 text-slate-700 hover:text-slate-900 rounded-xl bg-slate-100/80 active:scale-95 transition-all"
            aria-label="Toggle Menu"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div className="relative w-24 h-7">
            <Image
              src="/images/logo.webp"
              alt="DOER Logo"
              fill
              className="object-contain object-left"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/products"
            target="_blank"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold"
          >
            <span>Shop</span>
            <ExternalLink className="w-3 h-3 text-[#FF3D00]" />
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:text-red-600"
            aria-label="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar (Desktop & Mobile Drawer) */}
      <aside
        className={`fixed md:sticky top-0 h-screen w-72 bg-white border-r border-slate-200 z-50 flex flex-col justify-between transition-transform duration-300 overflow-y-auto shadow-xl md:shadow-none ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo Brand Box */}
          <div className="p-6 border-b border-slate-200">
            <Link href="/" className="inline-block">
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
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
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
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <LayoutDashboard className="w-5 h-5 shrink-0" />
                <span>Dashboard</span>
              </Link>

              <Link
                href="/admin/dashboard/enquiries"
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  pathname?.startsWith('/admin/dashboard/enquiries') ||
                  pathname?.startsWith('/admin/dashboard/inquiries')
                    ? 'bg-[#FF3D00] text-white shadow-md shadow-[#FF3D00]/20 font-semibold'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Inbox className="w-5 h-5 shrink-0" />
                  <span>Enquiries</span>
                </div>
                {newCount > 0 && (
                  <span
                    className={`px-2 py-0.5 text-[11px] font-bold rounded-full transition-colors ${
                      pathname?.startsWith('/admin/dashboard/enquiries') ||
                      pathname?.startsWith('/admin/dashboard/inquiries')
                        ? 'bg-white text-[#FF3D00]'
                        : 'bg-[#FF3D00] text-white animate-pulse'
                    }`}
                  >
                    {newCount}
                  </span>
                )}
              </Link>

              {/* ECOMMERCE NAV SECTION */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setEcommerceOpen(!ecommerceOpen)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                    isEcommerceRoute
                      ? 'bg-slate-100 text-slate-900 font-semibold border border-slate-200'
                      : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingBag
                      className={`w-5 h-5 shrink-0 ${
                        isEcommerceRoute ? 'text-[#FF3D00]' : 'text-slate-500'
                      }`}
                    />
                    <span>Ecommerce</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {pendingOrdersCount > 0 && !ecommerceOpen && (
                      <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-[#FF3D00] text-white">
                        {pendingOrdersCount}
                      </span>
                    )}
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                        ecommerceOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </button>

                {ecommerceOpen && (
                  <div className="mt-1.5 ml-4 pl-3 border-l-2 border-slate-200 space-y-1">
                    {/* Sub-item: Orders */}
                    <Link
                      href="/admin/dashboard/orders"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        pathname?.startsWith('/admin/dashboard/orders')
                          ? 'bg-[#FF3D00] text-white shadow-md shadow-[#FF3D00]/20 font-semibold'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <ClipboardList className="w-4 h-4 shrink-0" />
                        <span>Orders</span>
                      </div>
                      {pendingOrdersCount > 0 && (
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${
                            pathname?.startsWith('/admin/dashboard/orders')
                              ? 'bg-white text-[#FF3D00]'
                              : 'bg-[#FF3D00] text-white animate-pulse'
                          }`}
                        >
                          {pendingOrdersCount}
                        </span>
                      )}
                    </Link>

                    {/* Sub-item: All Products */}
                    <Link
                      href="/admin/dashboard/products"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        pathname?.startsWith('/admin/dashboard/products')
                          ? 'bg-[#FF3D00] text-white shadow-md shadow-[#FF3D00]/20 font-semibold'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <Package className="w-4 h-4 shrink-0" />
                      <span>All Products</span>
                    </Link>

                    {/* Sub-item: Categories */}
                    <Link
                      href="/admin/dashboard/categories"
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        pathname?.startsWith('/admin/dashboard/categories')
                          ? 'bg-[#FF3D00] text-white shadow-md shadow-[#FF3D00]/20 font-semibold'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <FolderTree className="w-4 h-4 shrink-0" />
                      <span>Categories</span>
                    </Link>
                  </div>
                )}
              </div>
            </nav>
          </div>
        </div>

        {/* Bottom Section: DB Status & Profile & Logout */}
        <div className="p-4 border-t border-slate-200 space-y-4 bg-slate-50/50">
          {/* Database Info Card */}
          <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs shadow-2xs">
            <div className="flex items-center gap-2 text-slate-800 font-semibold mb-1">
              <Database className="w-4 h-4 text-[#FF3D00]" />
              <span>MySQL Database</span>
            </div>
            <div className="text-slate-500 flex flex-col gap-0.5">
              <span>
                Database: <strong className="text-slate-800">doer-furniture</strong>
              </span>
              <span>
                Host: <strong className="text-slate-800">127.0.0.1:3306</strong>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 font-medium text-[11px] mt-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Connected (Native Driver)
              </span>
            </div>
          </div>

          {/* Admin Identity */}
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#FF3D00]/10 border border-[#FF3D00]/30 flex items-center justify-center text-[#FF3D00]">
                <UserCheck className="w-4 h-4" />
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-800">doer-admin</p>
                <p className="text-[11px] text-slate-500">Super Administrator</p>
              </div>
            </div>
          </div>

          {/* Logout Action */}
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white hover:bg-red-50 hover:text-red-600 border border-slate-200 hover:border-red-200 text-slate-700 text-xs font-semibold transition-all cursor-pointer shadow-2xs"
          >
            <LogOut className="w-4 h-4" />
            <span>{isLoggingOut ? 'Logging out...' : 'Sign Out'}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar (Desktop & Tablet) */}
        <header className="hidden md:flex h-16 bg-white/90 backdrop-blur border-b border-slate-200 px-6 items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              DOER Administration
            </h1>
            <span className="hidden sm:inline-flex px-2 py-0.5 text-[11px] font-semibold bg-[#FF3D00]/10 text-[#FF3D00] border border-[#FF3D00]/20 rounded">
              v2.0 eCommerce
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/products"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-[#FF3D00]/50 bg-slate-50 hover:bg-white transition-colors"
            >
              <span>View Shop</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#FF3D00]" />
            </Link>

            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50 hover:bg-white transition-colors"
            >
              <span>Live Site</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs font-semibold text-slate-500 hover:text-red-600 flex items-center gap-1 transition-colors cursor-pointer ml-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* MOBILE BOTTOM APP TAB BAR */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-lg border-t border-slate-200 px-2 py-1.5 shadow-[0_-8px_25px_rgba(15,23,42,0.08)]">
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          <Link
            href="/admin/dashboard"
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-bold transition-all active:scale-95 ${
              pathname === '/admin/dashboard'
                ? 'text-[#FF3D00] bg-[#FF3D00]/10'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 mb-0.5" />
            <span>Home</span>
          </Link>

          <Link
            href="/admin/dashboard/orders"
            className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-bold transition-all active:scale-95 ${
              pathname?.startsWith('/admin/dashboard/orders')
                ? 'text-[#FF3D00] bg-[#FF3D00]/10'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ClipboardList className="w-4 h-4 mb-0.5" />
            <span>Orders</span>
            {pendingOrdersCount > 0 && (
              <span className="absolute top-1 right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#FF3D00] text-white text-[9px] font-black flex items-center justify-center">
                {pendingOrdersCount}
              </span>
            )}
          </Link>

          <Link
            href="/admin/dashboard/products"
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-bold transition-all active:scale-95 ${
              pathname?.startsWith('/admin/dashboard/products')
                ? 'text-[#FF3D00] bg-[#FF3D00]/10'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Package className="w-4 h-4 mb-0.5" />
            <span>Products</span>
          </Link>

          <Link
            href="/admin/dashboard/categories"
            className={`flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-bold transition-all active:scale-95 ${
              pathname?.startsWith('/admin/dashboard/categories')
                ? 'text-[#FF3D00] bg-[#FF3D00]/10'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <FolderTree className="w-4 h-4 mb-0.5" />
            <span>Categories</span>
          </Link>

          <Link
            href="/admin/dashboard/enquiries"
            className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl text-[10px] font-bold transition-all active:scale-95 ${
              pathname?.startsWith('/admin/dashboard/enquiries') ||
              pathname?.startsWith('/admin/dashboard/inquiries')
                ? 'text-[#FF3D00] bg-[#FF3D00]/10'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Inbox className="w-4 h-4 mb-0.5" />
            <span>Enquiries</span>
            {newCount > 0 && (
              <span className="absolute top-1 right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#FF3D00] text-white text-[9px] font-black flex items-center justify-center">
                {newCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </div>
  );
}
