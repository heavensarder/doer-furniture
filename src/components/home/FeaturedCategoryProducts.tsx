'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  ShoppingBag,
  Phone,
  Video,
  Share2,
  Check,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { stripHtml } from '@/components/admin/RichTextEditor';
import { trackAddToCart, trackContact, trackViewContent } from '@/lib/fpixel';

export interface ProductItem {
  id: number;
  name: string;
  slug: string;
  main_image: string;
  price: number | null;
  is_call_for_price: number | boolean;
  short_description?: string;
  description?: string;
  video_type?: string;
  video_url?: string;
  created_at?: string;
}

export interface CategorySection {
  id: number;
  badge: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix?: string;
  subtitle: string;
  categoryId: number;
  categoryName: string;
  categorySlug: string;
  exploreButtonText: string;
  displayOrder: number;
  isActive: number;
  products: ProductItem[];
}

// Initial fallback data so initial render has zero layout shift or hydration lag
const DEFAULT_INITIAL_SECTIONS: CategorySection[] = [
  {
    id: 1,
    badge: 'Featured Product Category',
    titlePrefix: 'High-Performance',
    titleHighlight: 'Console Tables',
    titleSuffix: '& Command Workstations',
    subtitle:
      'Heavy-duty 24/7 mission-critical console tables, multi-monitor command desks, and modular control stations manufactured under one roof at our Khilkhet facility.',
    categoryId: 2,
    categoryName: 'Control Room Consoles',
    categorySlug: 'control-room-consoles',
    exploreButtonText: 'Explore All Console Tables',
    displayOrder: 1,
    isActive: 1,
    products: [
      {
        id: 1,
        name: 'Office Control Console YQ-DZ-01',
        slug: 'office-control-console-yq-dz-01',
        main_image: '/images/products/03-office-control-console-yq-dz-01.jpg',
        short_description:
          'Mission-critical command console featuring physical high/low-voltage EMI wire separation and heavy-duty 1.5mm cold-rolled steel chassis.',
        price: null,
        is_call_for_price: 1,
      },
      {
        id: 2,
        name: 'HG-B1 Executive Modular Control Console',
        slug: 'hg-b1-executive-modular-control-console',
        main_image: '/images/products/04-hg-b1-executive-modular-control-console.jpg',
        short_description:
          'Ergonomic curved profile command desk with dual-sided storage enclosures, step-style control panel, and ambient rear LED illumination.',
        price: 185000,
        is_call_for_price: 0,
      },
      {
        id: 3,
        name: 'HG-A2 Modular Smart Control Console',
        slug: 'hg-a2-modular-smart-control-console',
        main_image: '/images/products/05-hg-a2-modular-smart-control-console.jpg',
        short_description:
          'Linkable smart control console featuring specialized thermal dissipation airflow channels and multi-axis monitor arm tracks.',
        price: 165000,
        is_call_for_price: 0,
      },
      {
        id: 4,
        name: 'HG-A1 Modular Smart Control Console',
        slug: 'hg-a1-modular-smart-control-console',
        main_image: '/images/products/06-hg-a1-modular-smart-control-console.jpg',
        short_description:
          'Aerodynamic swallow-tail silhouette console with ice-blue anti-glare ambient lighting and full-metal laser-cut exterior finish.',
        price: null,
        is_call_for_price: 1,
      },
    ],
  },
];

export default function FeaturedCategoryProducts() {
  const [sections, setSections] = useState<CategorySection[]>(DEFAULT_INITIAL_SECTIONS);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const whatsappNumber = '8801976535654';

  useEffect(() => {
    let isMounted = true;
    const fetchSections = async () => {
      try {
        const res = await fetch('/api/frontend/category-sections', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.sections && data.sections.length > 0) {
            setSections(data.sections);
          }
        }
      } catch (err) {
        console.error('Error fetching dynamic category sections:', err);
      }
    };

    fetchSections();

    // Listen for live updates
    const handleUpdate = () => fetchSections();
    window.addEventListener('products-updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('products-updated', handleUpdate);
    };
  }, []);

  const handleShare = (product: ProductItem) => {
    const url = `${window.location.origin}/products/${product.slug}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedSlug(product.slug);
      setTimeout(() => setCopiedSlug(null), 2500);
    }
  };

  const getWhatsAppUrl = (product: ProductItem, categoryName: string) => {
    const text = encodeURIComponent(
      `Hello DOER, I am interested in this product from ${categoryName}:\n*${product.name}*\nURL: https://doerbd.com/products/${product.slug}\nPlease share pricing and technical specifications.`
    );
    return `https://wa.me/${whatsappNumber}?text=${text}`;
  };

  if (!sections || sections.length === 0) return null;

  return (
    <div className="space-y-16 sm:space-y-24 bg-[#060913] text-white">
      {sections.map((section, sectionIdx) => {
        // Enforce strictly maximum 4 latest products per section
        const displayedProducts = (section.products || []).slice(0, 4);

        return (
          <section
            key={section.id || sectionIdx}
            className="py-14 sm:py-20 lg:py-24 relative overflow-hidden border-b border-cyan-500/20 w-full bg-circuit-grid"
          >
            {/* Vertical Neon Laser Lines (Matching site-wide tech vibe) */}
            <div className="neon-line-v-cyan absolute top-0 bottom-0 left-0 z-20 pointer-events-none" />
            <div className="neon-line-v-orange absolute top-0 bottom-0 right-0 z-20 pointer-events-none" />

            {/* Atmospheric Industrial Glows */}
            <div className="absolute top-1/3 -left-32 w-96 h-96 bg-[#FF3D00]/10 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-10 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

            <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
              {/* Section Header: Title, Subtitle, and Explore Button */}
              <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-14">
                <div className="space-y-3 max-w-3xl">
                  {/* Top Badge */}
                  {section.badge && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FF3D00]/10 border border-[#FF3D00]/30 text-[#FF3D00] text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-[0_0_12px_rgba(255,61,0,0.25)]">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF3D00] animate-pulse" />
                      <span>{section.badge}</span>
                    </div>
                  )}

                  {/* Section Heading */}
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                    {section.titlePrefix}{' '}
                    <span className="text-[#FF3D00] drop-shadow-[0_0_20px_rgba(255,61,0,0.45)]">
                      {section.titleHighlight}
                    </span>{' '}
                    {section.titleSuffix && (
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-cyan-300">
                        {section.titleSuffix}
                      </span>
                    )}
                  </h2>

                  {/* Section Subtitle */}
                  {section.subtitle && (
                    <p className="text-slate-300 text-xs sm:text-sm lg:text-base font-normal leading-relaxed max-w-2xl">
                      {section.subtitle}
                    </p>
                  )}
                </div>

                {/* Explore Button: Redirects directly to the selected category */}
                <div className="flex items-center gap-3 shrink-0">
                  <Link
                    href={`/products?category=${section.categorySlug || 'all'}`}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0B101D] hover:bg-[#FF3D00] text-slate-200 hover:text-white border border-white/10 hover:border-[#FF3D00] text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(255,61,0,0.4)] group cursor-pointer cyber-corner"
                  >
                    <span>{section.exploreButtonText || `Explore ${section.categoryName || 'Products'}`}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              {/* 4-Column Responsive Product Grid — EXACT MATCH TO SHOP PAGE CARD */}
              {displayedProducts.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#0B101D] border border-white/10 text-center text-slate-400 text-xs font-mono">
                  No published products found in this category yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {displayedProducts.map((product) => {
                    const hasPrice =
                      !product.is_call_for_price &&
                      product.price !== null &&
                      Number(product.price) > 0;

                    return (
                      <div
                        key={product.id}
                        className="group relative bg-[#0B101D]/90 rounded-2xl border border-white/10 hover:border-[#FF3D00]/60 shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:shadow-[0_0_25px_rgba(255,61,0,0.35)] sm:hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden cyber-corner text-white"
                      >
                        {/* Top Accent Line on Hover */}
                        <div className="h-1 w-full bg-transparent group-hover:bg-[#FF3D00] shadow-[0_0_8px_#FF3D00] transition-colors duration-300" />

                        <div>
                          {/* Image Container (1:1 Square) */}
                          <div className="relative aspect-square w-full bg-[#070A12] overflow-hidden">
                            <Link href={`/products/${product.slug}`} className="block w-full h-full">
                              <Image
                                src={product.main_image || '/images/products/03-office-control-console-yq-dz-01.jpg'}
                                alt={product.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300" />
                            </Link>

                            {/* Top Badges */}
                            <div className="absolute top-3 left-3 flex items-center gap-1.5 max-w-[75%] pointer-events-none">
                              <span className="px-2.5 py-1 rounded-lg bg-[#05070B]/85 backdrop-blur-md text-slate-200 border border-white/10 text-[10px] font-bold tracking-wide truncate">
                                {section.categoryName}
                              </span>
                              {product.video_type !== 'none' && product.video_url && (
                                <span className="px-2 py-1 rounded-lg bg-[#FF3D00] text-white text-[10px] font-bold uppercase flex items-center gap-1 shadow shrink-0">
                                  <Video className="w-3 h-3" />
                                  Video
                                </span>
                              )}
                            </div>

                            {/* Share Button */}
                            <button
                              type="button"
                              onClick={() => handleShare(product)}
                              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-[#0E1526]/90 hover:bg-[#FF3D00] text-slate-300 hover:text-white border border-white/10 flex items-center justify-center shadow-md transition-colors cursor-pointer active:scale-90"
                              title="Share Product Link"
                            >
                              {copiedSlug === product.slug ? (
                                <Check className="w-3.5 h-3.5 text-emerald-400" />
                              ) : (
                                <Share2 className="w-3.5 h-3.5" />
                              )}
                            </button>

                            {/* Quick View Overlay Pill on Hover */}
                            <Link
                              href={`/products/${product.slug}`}
                              className="hidden sm:inline-flex absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-[#0E1526]/90 text-white border border-white/15 text-[11px] font-bold items-center gap-1 shadow-md opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#FF3D00] hover:border-[#FF3D00]"
                            >
                              <span>Explore</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>

                          {/* Card Body */}
                          <div className="p-4 sm:p-5 space-y-2">
                            <Link href={`/products/${product.slug}`}>
                              <h3 className="text-base sm:text-lg font-black text-white group-hover:text-[#FF3D00] transition-colors line-clamp-2 leading-snug">
                                {product.name}
                              </h3>
                            </Link>

                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                              {stripHtml(product.short_description || product.description || '')}
                            </p>
                          </div>
                        </div>

                        {/* Card Footer: Pricing Box & Exact Action Buttons */}
                        <div className="p-4 sm:p-5 pt-0 space-y-3">
                          {/* Framed Pricing / Quote Box */}
                          <div className="p-3 rounded-xl bg-[#070A12] border border-white/10 flex items-center justify-between">
                            {hasPrice ? (
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                  Direct Price
                                </span>
                                <span className="text-base sm:text-lg font-black text-white">
                                  ৳ {Number(product.price).toLocaleString()}
                                </span>
                              </div>
                            ) : (
                              <div>
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF3D00] block">
                                  Custom Quote
                                </span>
                                <span className="text-xs sm:text-sm font-black text-white">
                                  Call for Price
                                </span>
                              </div>
                            )}

                            <Link
                              href={`/products/${product.slug}`}
                              className="inline-flex items-center gap-1 text-xs font-bold text-[#FF3D00] hover:text-[#eb3800] hover:underline"
                            >
                              <span>Details</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>

                          {/* Dual Action Buttons matching Shop Page exactly */}
                          {hasPrice ? (
                            <div className="grid grid-cols-2 gap-2">
                              <Link
                                href={`/checkout?product=${product.slug}`}
                                onClick={() =>
                                  trackAddToCart({
                                    content_name: product.name,
                                    content_ids: [product.id],
                                    value: product.price || 0,
                                  })
                                }
                                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,61,0,0.35)] transition-all cursor-pointer"
                              >
                                <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                                <span>Order Now</span>
                              </Link>

                              <a
                                href={getWhatsAppUrl(product, section.categoryName)}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() =>
                                  trackContact({
                                    channel: 'WhatsApp',
                                    content_name: product.name,
                                  })
                                }
                                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#66CC66] hover:bg-[#55b855] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_12px_rgba(102,204,102,0.3)]"
                              >
                                <Image
                                  src="/whatsapp.png"
                                  alt="WhatsApp"
                                  width={16}
                                  height={16}
                                  className="w-4 h-4 object-contain shrink-0"
                                />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-2">
                              <a
                                href="tel:+8801976535654"
                                onClick={() =>
                                  trackContact({
                                    channel: 'Phone',
                                    content_name: product.name,
                                  })
                                }
                                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,61,0,0.35)] transition-all cursor-pointer"
                              >
                                <Phone className="w-3.5 h-3.5 shrink-0" />
                                <span>Call Now</span>
                              </a>

                              <a
                                href={getWhatsAppUrl(product, section.categoryName)}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() =>
                                  trackContact({
                                    channel: 'WhatsApp',
                                    content_name: product.name,
                                  })
                                }
                                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#66CC66] hover:bg-[#55b855] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_12px_rgba(102,204,102,0.3)]"
                              >
                                <Image
                                  src="/whatsapp.png"
                                  alt="WhatsApp"
                                  width={16}
                                  height={16}
                                  className="w-4 h-4 object-contain shrink-0"
                                />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
