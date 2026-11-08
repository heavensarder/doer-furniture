'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  ShoppingBag,
  PhoneCall,
  MessageSquare,
  ShieldCheck,
  Cpu,
} from 'lucide-react';

export interface ProductCardItem {
  id: number;
  name: string;
  slug: string;
  categoryName: string;
  categorySlug: string;
  image: string;
  shortDesc: string;
  price: number | null;
  isCallForPrice: boolean;
  specs?: string;
  badge?: string;
}

export interface CategorySectionConfig {
  badge: string;
  titlePrefix: string;
  titleHighlight: string;
  titleSuffix?: string;
  subtitle: string;
  categorySlug: string;
  categoryName: string;
  viewAllText?: string;
  products: ProductCardItem[];
}

// Default Data: 1st Category — Console Tables (Control Room Consoles)
// Designed for easy dynamic replacement later
export const DEFAULT_CONSOLE_CATEGORY: CategorySectionConfig = {
  badge: 'Featured Product Category',
  titlePrefix: 'High-Performance',
  titleHighlight: 'Console Tables',
  titleSuffix: '& Command Workstations',
  subtitle:
    'Heavy-duty 24/7 mission-critical console tables, multi-monitor command desks, and modular control stations manufactured under one roof at our Khilkhet facility.',
  categorySlug: 'control-room-consoles',
  categoryName: 'Control Room Consoles',
  viewAllText: 'Explore All Console Tables',
  products: [
    {
      id: 1,
      name: 'Office Control Console YQ-DZ-01',
      slug: 'office-control-console-yq-dz-01',
      categoryName: 'Control Room Consoles',
      categorySlug: 'control-room-consoles',
      image: '/images/products/03-office-control-console-yq-dz-01.jpg',
      shortDesc:
        'Mission-critical command console featuring physical high/low-voltage EMI wire separation and heavy-duty 1.5mm cold-rolled steel chassis.',
      price: null,
      isCallForPrice: true,
      specs: '1.5mm Steel • Dual EMI Isolation',
      badge: '24/7 Heavy Duty',
    },
    {
      id: 2,
      name: 'HG-B1 Executive Modular Control Console',
      slug: 'hg-b1-executive-modular-control-console',
      categoryName: 'Control Room Consoles',
      categorySlug: 'control-room-consoles',
      image: '/images/products/04-hg-b1-executive-modular-control-console.jpg',
      shortDesc:
        'Ergonomic curved profile command desk with dual-sided storage enclosures, step-style control panel, and ambient rear LED illumination.',
      price: 185000,
      isCallForPrice: false,
      specs: 'Curved Profile • Rear LED Backlight',
      badge: 'Executive Series',
    },
    {
      id: 3,
      name: 'HG-A2 Modular Smart Control Console',
      slug: 'hg-a2-modular-smart-control-console',
      categoryName: 'Control Room Consoles',
      categorySlug: 'control-room-consoles',
      image: '/images/products/05-hg-a2-modular-smart-control-console.jpg',
      shortDesc:
        'Linkable smart control console featuring specialized thermal dissipation airflow channels and multi-axis monitor arm tracks.',
      price: 165000,
      isCallForPrice: false,
      specs: 'Thermal Flow • Multi-Axis Tracks',
      badge: 'Thermal Smart',
    },
    {
      id: 4,
      name: 'HG-A1 Modular Smart Control Console',
      slug: 'hg-a1-modular-smart-control-console',
      categoryName: 'Control Room Consoles',
      categorySlug: 'control-room-consoles',
      image: '/images/products/06-hg-a1-modular-smart-control-console.jpg',
      shortDesc:
        'Aerodynamic swallow-tail silhouette console with ice-blue anti-glare ambient lighting and full-metal laser-cut exterior finish.',
      price: null,
      isCallForPrice: true,
      specs: 'Swallow-Tail • Ice-Blue Glow',
      badge: 'Full Metal Laser Cut',
    },
  ],
};

interface FeaturedCategoryProductsProps {
  config?: Partial<CategorySectionConfig>;
}

export default function FeaturedCategoryProducts({
  config,
}: FeaturedCategoryProductsProps) {
  const data = { ...DEFAULT_CONSOLE_CATEGORY, ...config };
  // Strictly enforce a maximum of the latest 4 products
  const [displayedProducts, setDisplayedProducts] = useState<ProductCardItem[]>(
    () => (data.products || []).slice(0, 4)
  );

  const whatsappNumber = '8801976535654';

  // Fetch the latest 4 console tables from the database dynamically
  useEffect(() => {
    let isMounted = true;

    const fetchLatestConsoleTables = async () => {
      try {
        const res = await fetch('/api/products?status=published', { cache: 'no-store' });
        if (!res.ok) return;
        const json = await res.json();
        const allProducts = json.products || [];

        // Filter products that belong to Control Room Consoles / Console Tables
        const consoleProducts = allProducts.filter((p: any) => {
          const slug = (p.category_slug || '').toLowerCase();
          const catName = (p.category_name || '').toLowerCase();
          const prodName = (p.name || '').toLowerCase();
          return (
            slug === 'control-room-consoles' ||
            slug.includes('console') ||
            catName.includes('console') ||
            prodName.includes('console')
          );
        });

        if (consoleProducts.length > 0 && isMounted) {
          const mapped: ProductCardItem[] = consoleProducts.map((p: any) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            categoryName: p.category_name || data.categoryName,
            categorySlug: p.category_slug || data.categorySlug,
            image: p.main_image || '/images/products/03-office-control-console-yq-dz-01.jpg',
            shortDesc:
              p.short_description ||
              (p.description ? p.description.replace(/<[^>]+>/g, '').slice(0, 110) : ''),
            price: p.price,
            isCallForPrice: Boolean(p.is_call_for_price),
            specs: p.short_description
              ? p.short_description.replace(/<[^>]+>/g, '').slice(0, 40)
              : 'Precision Modular Console',
            badge: p.is_call_for_price ? 'Quote on Demand' : '24/7 Heavy Duty',
          }));

          // Strictly limit to the latest 4 console tables, no more
          setDisplayedProducts(mapped.slice(0, 4));
        }
      } catch (err) {
        // Fall back safely to default initial 4 tables
      }
    };

    fetchLatestConsoleTables();

    // Listen for live product updates from admin panel
    const handleUpdate = () => fetchLatestConsoleTables();
    window.addEventListener('products-updated', handleUpdate);
    return () => {
      isMounted = false;
      window.removeEventListener('products-updated', handleUpdate);
    };
  }, [data.categorySlug, data.categoryName]);

  const getWhatsAppUrl = (product: ProductCardItem) => {
    const text = encodeURIComponent(
      `Hello DOER, I am interested in your console product:\n*${product.name}*\nURL: https://doerinterior.com/products/${product.slug}\nPlease share pricing and technical specifications.`
    );
    return `https://wa.me/${whatsappNumber}?text=${text}`;
  };

  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-[#060913] text-white relative overflow-hidden border-b border-cyan-500/20 w-full bg-circuit-grid">
      {/* Vertical Neon Laser Lines (Matching site-wide tech vibe) */}
      <div className="neon-line-v-cyan absolute top-0 bottom-0 left-0 z-20 pointer-events-none" />
      <div className="neon-line-v-orange absolute top-0 bottom-0 right-0 z-20 pointer-events-none" />

      {/* Atmospheric Industrial Glows */}
      <div className="absolute top-1/3 -left-32 w-96 h-96 bg-[#FF3D00]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 2xl:px-24 relative z-10">
        
        {/* Section Header: Title, Subtitle, and View All Link */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 sm:mb-14">
          <div className="space-y-3 max-w-3xl">
            {/* Section Heading */}
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              {data.titlePrefix}{' '}
              <span className="text-[#FF3D00] drop-shadow-[0_0_20px_rgba(255,61,0,0.45)]">
                {data.titleHighlight}
              </span>{' '}
              {data.titleSuffix && (
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-cyan-300">
                  {data.titleSuffix}
                </span>
              )}
            </h2>

            {/* Section Subtitle */}
            <p className="text-slate-300 text-xs sm:text-sm lg:text-base font-normal leading-relaxed max-w-2xl">
              {data.subtitle}
            </p>
          </div>

          {/* View All Link to Category */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/products?category=${data.categorySlug}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0B101D] hover:bg-[#FF3D00] text-slate-200 hover:text-white border border-white/10 hover:border-[#FF3D00] text-xs font-bold uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-[0_0_20px_rgba(255,61,0,0.4)] group cursor-pointer cyber-corner"
            >
              <span>{data.viewAllText}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>

        {/* 4-Column Responsive Product Grid — STRICTLY LATEST 4 TABLES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayedProducts.slice(0, 4).map((product) => {
            const hasPrice = !product.isCallForPrice && product.price && Number(product.price) > 0;

            return (
              <div
                key={product.id}
                className="group bg-[#0B101D]/90 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-white/10 hover:border-[#FF3D00]/60 shadow-[0_15px_35px_rgba(0,0,0,0.7)] hover:shadow-[0_0_30px_rgba(255,61,0,0.3)] transition-all duration-500 flex flex-col justify-between overflow-hidden cyber-corner"
              >
                <div>
                  {/* Square 1:1 Product Thumbnail */}
                  <div className="relative aspect-square w-full bg-[#070A12] overflow-hidden border-b border-white/10">
                    <Link href={`/products/${product.slug}`} className="block w-full h-full">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover img-zoom transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B101D] via-transparent to-black/30" />
                    </Link>

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10 pointer-events-none">
                      {product.badge && (
                        <span className="px-2.5 py-1 rounded-md bg-[#FF3D00] text-white text-[10px] font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(255,61,0,0.5)]">
                          {product.badge}
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md text-[#FF3D00] font-mono text-[10px] font-bold border border-[#FF3D00]/30 ml-auto">
                        DOER
                      </span>
                    </div>

                    {/* Quick Explore Button Overlay on Hover */}
                    <Link
                      href={`/products/${product.slug}`}
                      className="hidden sm:inline-flex absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-[#090D18]/90 text-white border border-white/20 text-[11px] font-bold items-center gap-1 shadow-xl opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 hover:bg-[#FF3D00] hover:border-[#FF3D00]"
                    >
                      <span>Explore</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Product Details */}
                  <div className="p-4 sm:p-5 space-y-2.5">
                    {/* Micro Spec pill */}
                    {product.specs && (
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                        <Cpu className="w-3 h-3 text-[#FF3D00]" />
                        <span className="truncate">{product.specs}</span>
                      </div>
                    )}

                    {/* Product Name */}
                    <Link href={`/products/${product.slug}`} className="block">
                      <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-[#FF3D00] transition-colors leading-snug line-clamp-2">
                        {product.name}
                      </h3>
                    </Link>

                    {/* Short Description */}
                    <p className="text-xs text-slate-400 font-normal line-clamp-2 leading-relaxed">
                      {product.shortDesc}
                    </p>
                  </div>
                </div>

                {/* Footer Section: Pricing Box & Action Buttons */}
                <div className="p-4 sm:p-5 pt-0 space-y-3">
                  {/* Pricing / Quote Status Box */}
                  <div className="p-3 rounded-xl bg-[#080C16] border border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        {hasPrice ? 'Unit Price' : 'Commercial Fit-Out'}
                      </span>
                      <span className="text-sm sm:text-base font-black text-white">
                        {hasPrice ? `৳ ${Number(product.price).toLocaleString()}` : 'Call for Price'}
                      </span>
                    </div>

                    <Link
                      href={`/products/${product.slug}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#FF3D00] hover:text-[#eb3800] transition-colors"
                    >
                      <span>Specs</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    {hasPrice ? (
                      <Link
                        href={`/checkout?product=${product.slug}`}
                        className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,61,0,0.35)] transition-all cursor-pointer"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                        <span>Order</span>
                      </Link>
                    ) : (
                      <Link
                        href={`/contact?service=Control+Room+Consoles&product=${encodeURIComponent(product.name)}`}
                        className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,61,0,0.35)] transition-all cursor-pointer"
                      >
                        <PhoneCall className="w-3.5 h-3.5 shrink-0" />
                        <span>Quote</span>
                      </Link>
                    )}

                    <a
                      href={getWhatsAppUrl(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#66CC66] hover:bg-[#55b855] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer shadow-[0_0_12px_rgba(102,204,102,0.3)]"
                      title="Ask on WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5 shrink-0" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Guarantee Banner */}
        <div className="mt-8 sm:mt-12 p-4 sm:p-5 rounded-2xl bg-[#090E1B]/90 border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 cyber-corner">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-white">
                Bespoke Dimensional & Multi-Screen Engineering Available
              </p>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Every console table can be custom fabricated according to your facility radians, operator counts, and monitor specifications.
              </p>
            </div>
          </div>

          <Link
            href="/contact?service=Control+Room+Setup+%26+Console+Workstations"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0E1526] hover:bg-[#FF3D00] text-white border border-white/10 hover:border-[#FF3D00] text-xs font-bold uppercase tracking-wider transition-all duration-300 shrink-0"
          >
            <span>Request Custom Layout</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}

