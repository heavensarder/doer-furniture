'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ArrowUpRight,
  Phone,
  MapPin,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  shortLabel?: string;
}

interface CategorySubItem {
  id: number;
  name: string;
  slug: string;
  display_order: number;
  product_count?: number;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Services', href: '/services' },
  { label: 'Projects', href: '/projects' },
  { label: 'Workshop & Capabilities', href: '/workshop', shortLabel: 'Workshop' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact Us', href: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [categories, setCategories] = useState<CategorySubItem[]>([]);
  const [mobileProductsOpen, setMobileProductsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (pathname.startsWith('/admin')) return;

    const loadCategories = async () => {
      try {
        const res = await fetch('/api/categories?active=1', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          setCategories(data.categories || []);
        }
      } catch {
        // Silently ignore network error
      }
    };

    loadCategories();
    window.addEventListener('categories-updated', loadCategories);
    return () => window.removeEventListener('categories-updated', loadCategories);
  }, [pathname]);

  if (pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Studio Micro Bar */}
      <div className="bg-[#070A10] border-b border-white/10 text-slate-300 text-[11px] font-mono py-1 px-4 hidden sm:block">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-200 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3D00] animate-pulse shadow-[0_0_8px_#FF3D00]" />
              <span>DOER Interior Architecture & Manufacturing Studio</span>
            </span>
            <span className="text-white/20">|</span>
            <span className="flex items-center gap-1 text-slate-400">
              <MapPin className="w-3 h-3 text-[#FF3D00]" />
              <span>Khilkhet, Dhaka</span>
            </span>
          </div>

          <div className="flex items-center gap-5">
            <a
              href="tel:+8801976535654"
              className="flex items-center gap-1.5 text-slate-200 hover:text-[#FF3D00] transition-colors font-semibold"
            >
              <Phone className="w-3 h-3 text-[#FF3D00]" />
              <span>Hotline: 01976535654</span>
            </a>

            <span className="text-white/20">•</span>

            {/* Social Media Links */}
            <div className="flex items-center gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-5 h-5 rounded-full bg-white/5 hover:bg-[#FF3D00] text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200 border border-white/10"
                aria-label="Facebook"
              >
                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-5 h-5 rounded-full bg-white/5 hover:bg-[#FF3D00] text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200 border border-white/10"
                aria-label="Instagram"
              >
                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-5 h-5 rounded-full bg-white/5 hover:bg-[#FF3D00] text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200 border border-white/10"
                aria-label="LinkedIn"
              >
                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </a>
              <a
                href="https://wa.me/8801976535654"
                target="_blank"
                rel="noopener noreferrer"
                className="w-5 h-5 rounded-full bg-white/5 hover:bg-[#66CC66] text-slate-400 hover:text-white flex items-center justify-center transition-all duration-200 border border-white/10"
                aria-label="WhatsApp"
              >
                <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar - Technological Command Center Glass */}
      <div
        className={`transition-all duration-300 relative ${
          scrolled
            ? 'bg-[#05070B]/92 backdrop-blur-xl border-b border-cyan-500/25 shadow-[0_10px_35px_rgba(0,0,0,0.85)] py-2.5 sm:py-3'
            : 'bg-[#05070B]/80 backdrop-blur-md border-b border-white/10 py-3 sm:py-4'
        }`}
      >
        {/* Vertical Neon Laser Lines (On Navbar and Streaming Downward) */}
        <div className="neon-line-v-cyan absolute top-0 bottom-0 left-0 z-30" />
        <div className="neon-line-v-orange absolute top-0 bottom-0 right-0 z-30" />
        <div className="neon-line-v-cyan absolute top-full left-4 sm:left-10 w-[1px] h-24 sm:h-36 pointer-events-none z-30 opacity-75" />
        <div className="neon-line-v-orange absolute top-full right-4 sm:right-10 w-[1px] h-24 sm:h-36 pointer-events-none z-30 opacity-75" />
        <div className="neon-line-v-cyan absolute top-full left-1/3 w-[1px] h-16 sm:h-24 pointer-events-none z-30 opacity-40 hidden md:block" />
        <div className="neon-line-v-orange absolute top-full right-1/3 w-[1px] h-16 sm:h-24 pointer-events-none z-30 opacity-40 hidden md:block" />

        {/* Static Cyber Edge Border */}
        <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent pointer-events-none z-20" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-2 xl:gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative w-32 sm:w-36 xl:w-40 h-9 xl:h-10 transition-transform duration-300 group-hover:scale-105">
                <Image
                  src="/images/logo.webp"
                  alt="DOER Logo"
                  fill
                  priority
                  className="object-contain object-left drop-shadow-[0_0_15px_rgba(255,61,0,0.35)]"
                />
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1.5 shrink-0">
              {NAV_ITEMS.map((item) => {
                const isProducts = item.href === '/products';
                const isActive =
                  pathname === item.href ||
                  (isProducts && pathname.startsWith('/products'));

                if (isProducts && categories.length > 0) {
                  return (
                    <div key={item.href} className="relative group shrink-0">
                      <Link
                        href={item.href}
                        className={`inline-flex items-center gap-1 whitespace-nowrap text-[11px] xl:text-[13px] tracking-wide uppercase font-bold px-2.5 xl:px-3 py-2 rounded-lg transition-all duration-200 border ${
                          isActive
                            ? 'bg-[#FF3D00] text-white border-[#FF3D00] shadow-[0_0_15px_rgba(255,61,0,0.5)]'
                            : 'text-slate-300 hover:text-white hover:bg-white/10 border-transparent hover:border-white/15'
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className="w-3.5 h-3.5 opacity-80 transition-transform duration-200 group-hover:rotate-180" />
                      </Link>

                      {/* Dynamic Submenu Dropdown */}
                      <div className="absolute left-0 top-full pt-2 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                        <div className="bg-[#090D16]/95 backdrop-blur-2xl text-white rounded-2xl border border-cyan-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.85)] p-2 space-y-1">
                          <Link
                            href="/products"
                            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-white/5 hover:bg-[#FF3D00] transition-colors"
                          >
                            <span>All Products</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </Link>

                          <div className="h-px bg-white/10 my-1" />

                          {categories.map((cat) => (
                            <Link
                              key={cat.id}
                              href={`/products?category=${cat.slug}`}
                              className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-[#FF3D00] hover:text-white transition-colors group/sub"
                            >
                              <span className="truncate">{cat.name}</span>
                              {cat.product_count !== undefined && cat.product_count > 0 && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 border border-white/10 group-hover/sub:bg-white/20 text-slate-300 group-hover/sub:text-white font-mono">
                                  {cat.product_count}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap text-[11px] xl:text-[13px] tracking-wide uppercase font-bold px-2.5 xl:px-3 py-2 rounded-lg transition-all duration-200 shrink-0 border ${
                      isActive
                        ? 'bg-[#FF3D00] text-white border-[#FF3D00] shadow-[0_0_15px_rgba(255,61,0,0.5)]'
                        : 'text-slate-300 hover:text-white hover:bg-white/10 border-transparent hover:border-white/15'
                    }`}
                  >
                    {item.shortLabel ? (
                      <>
                        <span className="hidden xl:inline">{item.label}</span>
                        <span className="xl:hidden">{item.shortLabel}</span>
                      </>
                    ) : (
                      <span>{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center shrink-0">
              <Link
                href="/contact"
                className="group relative inline-flex items-center gap-1.5 xl:gap-2 px-3.5 xl:px-5 py-2 xl:py-2.5 bg-[#FF3D00] hover:bg-[#eb3800] text-white text-[11px] xl:text-xs font-bold uppercase tracking-wider rounded-lg shadow-[0_0_20px_rgba(255,61,0,0.45)] hover:shadow-[0_0_28px_rgba(255,61,0,0.6)] border border-[#FF3D00] transition-all duration-200 whitespace-nowrap shrink-0"
              >
                <span>Start Your Project</span>
                <ArrowUpRight className="w-3.5 h-3.5 xl:w-4 xl:h-4 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <div className="flex items-center gap-3 lg:hidden">
              <Link
                href="/contact"
                className="px-3.5 py-1.5 bg-[#FF3D00] text-white text-xs font-bold uppercase rounded-md shadow-[0_0_12px_rgba(255,61,0,0.4)]"
              >
                Quote
              </Link>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-slate-200 hover:text-[#FF3D00] transition-colors focus:outline-none"
                aria-label="Toggle Navigation Menu"
              >
                {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-[#05070B]/98 text-white border-b border-cyan-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.95)] backdrop-blur-2xl animate-in slide-in-from-top duration-300 max-h-[85vh] overflow-y-auto">
          <div className="max-w-7xl mx-auto px-6 py-6 space-y-2.5">
            {NAV_ITEMS.map((item) => {
              const isProducts = item.href === '/products';
              const isActive =
                pathname === item.href ||
                (isProducts && pathname.startsWith('/products'));

              if (isProducts && categories.length > 0) {
                return (
                  <div key={item.href} className="space-y-1.5">
                    <div className="flex items-center gap-1">
                      <Link
                        href="/products"
                        onClick={() => setIsOpen(false)}
                        className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold tracking-wide uppercase transition-colors border ${
                          isActive
                            ? 'bg-[#FF3D00] text-white border-[#FF3D00] shadow-[0_0_12px_rgba(255,61,0,0.4)]'
                            : 'text-slate-300 hover:bg-white/10 hover:text-white border-white/5'
                        }`}
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setMobileProductsOpen(!mobileProductsOpen)}
                        className="p-2.5 rounded-lg bg-[#0D121E] border border-white/10 text-slate-300 hover:text-white"
                        aria-label="Toggle Product Categories"
                      >
                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            mobileProductsOpen ? 'rotate-180' : ''
                          }`}
                        />
                      </button>
                    </div>

                    {mobileProductsOpen && (
                      <div className="ml-4 pl-3 border-l border-cyan-500/30 space-y-1">
                        <Link
                          href="/products"
                          onClick={() => setIsOpen(false)}
                          className="block py-2 px-3 rounded-lg text-xs font-bold uppercase text-[#FF3D00] hover:bg-white/5"
                        >
                          All Products
                        </Link>
                        {categories.map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/products?category=${cat.slug}`}
                            onClick={() => setIsOpen(false)}
                            className="block py-2 px-3 rounded-lg text-xs font-medium text-slate-300 hover:bg-white/5 hover:text-white"
                          >
                            {cat.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`block py-2.5 px-3 rounded-lg text-sm font-semibold tracking-wide uppercase transition-colors border ${
                    isActive
                      ? 'bg-[#FF3D00] text-white border-[#FF3D00] shadow-[0_0_12px_rgba(255,61,0,0.4)]'
                      : 'text-slate-300 hover:bg-white/10 hover:text-white border-white/5'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              <div className="flex items-center justify-center gap-2 text-xs text-slate-400 px-3 text-center font-mono">
                <Phone className="w-4 h-4 text-[#FF3D00] shrink-0" />
                <a href="tel:+8801976535654" className="hover:text-white transition-colors">
                  01976535654
                </a>
                <span className="text-slate-600">•</span>
                <a href="mailto:info@doerbd.com" className="hover:text-white transition-colors">
                  info@doerbd.com
                </a>
              </div>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-[0_0_20px_rgba(255,61,0,0.45)] border border-[#FF3D00]"
              >
                <span>Start Your Project</span>
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
