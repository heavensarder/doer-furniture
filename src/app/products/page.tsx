'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Sparkles,
  Phone,
  Send,
  ShoppingBag,
  ArrowRight,
  ArrowUpRight,
  Share2,
  Check,
  Loader2,
  Video,
  Layers,
  Filter,
  ChevronRight,
  ChevronDown,
  LayoutGrid,
  List,
  Search,
  ShieldCheck,
  Ruler,
  Truck,
  Factory,
  X,
  SlidersHorizontal,
} from 'lucide-react';
import { stripHtml } from '@/components/admin/RichTextEditor';

interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  product_count?: number;
}

interface Product {
  id: number;
  category_id: number | null;
  category_name?: string;
  category_slug?: string;
  name: string;
  slug: string;
  short_description: string;
  description: string;
  price: number | null;
  is_call_for_price: boolean;
  main_image: string;
  gallery_images: string[];
  video_type: 'none' | 'upload' | 'youtube';
  video_url: string;
  status: string;
}

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const categoryParam = searchParams.get('category') || 'all';

  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>(categoryParam);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        setLoading(true);
        const [catRes, prodRes] = await Promise.all([
          fetch('/api/categories?active=1', { cache: 'no-store' }),
          fetch('/api/products?status=published', { cache: 'no-store' }),
        ]);
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(catData.categories || []);
        }
        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData.products || []);
        }
      } catch (err) {
        console.error('Error loading shop:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, []);

  const handleCategorySelect = (slug: string) => {
    setActiveCategory(slug);
    setMobileFilterOpen(false);
    if (slug === 'all') {
      router.push('/products', { scroll: false });
    } else {
      router.push(`/products?category=${slug}`, { scroll: false });
    }
  };

  const getProductUrl = (slug: string) => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/products/${slug}`;
    }
    return `https://doer.heavensarder.com/products/${slug}`;
  };

  const getWhatsAppUrl = (product: Product) => {
    const link = getProductUrl(product.slug);
    const text = `Hello, I want to buy ${product.name}\nProduct Link: ${link}`;
    return `https://wa.me/8801976535654?text=${encodeURIComponent(text)}`;
  };

  const handleShare = async (product: Product) => {
    const url = getProductUrl(product.slug);
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: stripHtml(product.short_description || product.name),
          url,
        });
        return;
      } catch {
        // Fallback to copy
      }
    }
    await navigator.clipboard.writeText(url);
    setCopiedSlug(product.slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  // Filter products by search query
  const searchFilteredProducts = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      stripHtml(p.short_description || '').toLowerCase().includes(q) ||
      (p.category_name || '').toLowerCase().includes(q)
    );
  });

  // Group products by category in the exact category display_order
  const visibleCategories =
    activeCategory === 'all'
      ? categories
      : categories.filter((c) => c.slug === activeCategory);

  const uncategorizedProducts = searchFilteredProducts.filter(
    (p) => !p.category_id || !categories.some((c) => c.id === p.category_id)
  );

  return (
    <div className="min-h-screen bg-[#05070B] text-slate-100 bg-cyber-grid pb-16 sm:pb-20">
      {/* 01. ARCHITECTURAL HERO / TITLE SECTION */}
      <section className="relative pt-24 sm:pt-32 lg:pt-40 pb-10 sm:pb-16 lg:pb-20 bg-slate-950 text-white overflow-hidden bg-circuit-grid border-b border-cyan-500/20">
        {/* Vertical Neon Laser Lines */}
        <div className="neon-line-v-cyan absolute top-0 bottom-0 left-0 z-20" />
        <div className="neon-line-v-orange absolute top-0 bottom-0 right-0 z-20" />
        {/* Background Atmospheric Image & Glows */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80"
            alt="DOER Products Banner"
            fill
            priority
            className="object-cover opacity-20 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/85 to-slate-950/60" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] sm:w-[700px] h-[300px] sm:h-[350px] bg-[#FF3D00]/15 rounded-full blur-3xl pointer-events-none" />
        </div>

        {/* Architectural Corner Marks */}
        <div className="hidden lg:block absolute top-28 left-10 w-12 h-12 border-t-2 border-l-2 border-[#FF3D00]/30 pointer-events-none" />
        <div className="hidden lg:block absolute bottom-8 right-10 w-12 h-12 border-b-2 border-r-2 border-[#FF3D00]/30 pointer-events-none" />

        <div className="relative z-10 w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-10 xl:px-14">
          <div className="max-w-4xl mx-auto text-center space-y-3.5 sm:space-y-5">
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full bg-[#FF3D00]/15 border border-[#FF3D00]/35 backdrop-blur-md text-[#FF3D00] text-[10px] sm:text-xs font-bold uppercase tracking-widest shadow-lg shadow-[#FF3D00]/10">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" />
              <span>Official Catalog & Direct Storefront</span>
            </div>

            {/* Main Heading (General — no specific product mentioned) */}
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              Our <span className="text-[#FF3D00]">Products</span>
            </h1>

            {/* Accent Divider */}
            <div className="flex items-center justify-center gap-2">
              <span className="w-8 sm:w-10 h-0.5 bg-slate-700 rounded-full" />
              <span className="w-10 sm:w-12 h-1 bg-[#FF3D00] rounded-full" />
              <span className="w-8 sm:w-10 h-0.5 bg-slate-700 rounded-full" />
            </div>

            {/* Subtitle */}
            <p className="text-xs sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed px-1">
              Precision-engineered and crafted in our in-house manufacturing facility. Browse by category, place a direct order online, or send a query for custom specifications.
            </p>

            {/* Architectural Feature Strip */}
            <div className="pt-2 sm:pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3.5 max-w-3xl mx-auto">
              {[
                { icon: Factory, label: 'In-House Built' },
                { icon: Ruler, label: 'Custom Sizing' },
                { icon: ShieldCheck, label: 'Quality Assured' },
                { icon: Truck, label: 'On-Site Setup' },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-center gap-1.5 sm:gap-2 px-2.5 py-2 sm:px-3 sm:py-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-md text-[11px] sm:text-xs font-semibold text-slate-200"
                >
                  <item.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF3D00] shrink-0" />
                  <span className="truncate">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 02. STICKY MOBILE & TABLET APP CONTROL BAR (< lg) — DROPDOWN FILTER (NO SIDE SCROLLING) */}
      <div className="lg:hidden sticky top-[60px] sm:top-[68px] z-30 bg-[#080C16]/95 backdrop-blur-xl border-b border-cyan-500/20 shadow-xl text-white">
        <div className="px-3.5 sm:px-6 py-2.5 space-y-2">
          {/* Row 1: Search Input + Grid/List Switcher */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 min-w-0">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#0E1526] border border-white/10 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:bg-[#121B30] focus:border-[#FF3D00] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Compact View Switcher */}
            <div className="inline-flex items-center bg-[#0E1526] p-0.5 rounded-xl border border-white/10 shrink-0">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#FF3D00] text-white shadow-[0_0_8px_rgba(255,61,0,0.5)]'
                    : 'text-slate-400 hover:text-white'
                }`}
                aria-label="Grid View"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === 'list'
                    ? 'bg-[#FF3D00] text-white shadow-[0_0_8px_rgba(255,61,0,0.5)]'
                    : 'text-slate-400 hover:text-white'
                }`}
                aria-label="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Row 2: Category Filter Dropdown (Instead of Side Scrolling) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all active:scale-[0.99] cursor-pointer ${
                activeCategory !== 'all'
                  ? 'bg-[#0E1526] border-[#FF3D00] text-white'
                  : 'bg-[#0E1526] border-white/10 text-slate-200 hover:bg-[#121B30]'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <Filter className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span className="text-slate-400 font-semibold shrink-0">Category:</span>
                <span className="truncate font-bold text-white">
                  {activeCategory === 'all'
                    ? `All Products (${products.length})`
                    : `${
                        categories.find((c) => c.slug === activeCategory)?.name || 'Selected'
                      } (${
                        products.filter(
                          (p) =>
                            p.category_id ===
                            categories.find((c) => c.slug === activeCategory)?.id
                        ).length
                      })`}
                </span>
              </div>

              <div className="flex items-center gap-1.5 shrink-0 ml-2">
                {activeCategory !== 'all' && (
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCategorySelect('all');
                    }}
                    className="px-2 py-0.5 rounded-md bg-[#FF3D00] text-white text-[10px] font-bold uppercase shadow-sm"
                  >
                    Reset
                  </span>
                )}
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                    mobileFilterOpen ? 'rotate-180 text-cyan-400' : ''
                  }`}
                />
              </div>
            </button>

            {/* Dropdown Menu Panel */}
            {mobileFilterOpen && (
              <>
                <div
                  className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm"
                  onClick={() => setMobileFilterOpen(false)}
                />
                <div className="absolute left-0 right-0 top-full mt-1.5 z-40 bg-[#090E1C] rounded-2xl border border-cyan-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.95)] p-2 space-y-1 max-h-[65vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150 text-white">
                  <button
                    type="button"
                    onClick={() => handleCategorySelect('all')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                      activeCategory === 'all'
                        ? 'bg-[#FF3D00] text-white shadow-[0_0_12px_rgba(255,61,0,0.5)]'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span>All Products</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        activeCategory === 'all'
                          ? 'bg-white/20 text-white'
                          : 'bg-white/5 text-slate-300'
                      }`}
                    >
                      {products.length}
                    </span>
                  </button>

                  {categories.map((cat) => {
                    const count = products.filter((p) => p.category_id === cat.id).length;
                    const isSelected = activeCategory === cat.slug;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategorySelect(cat.slug)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-left ${
                          isSelected
                            ? 'bg-[#FF3D00] text-white shadow-[0_0_12px_rgba(255,61,0,0.5)]'
                            : 'text-slate-300 hover:bg-white/10 hover:text-white'
                        }`}
                      >
                        <span className="truncate pr-2">{cat.name}</span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0 ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-white/5 text-slate-300'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 03. FULL-WIDTH SHOP LAYOUT: LEFT FILTER SIDEBAR (DESKTOP) + RIGHT PRODUCT SECTIONS */}
      <div className="w-full max-w-[1920px] mx-auto px-3.5 sm:px-6 lg:px-10 xl:px-14 pt-5 sm:pt-8 lg:pt-12">
        {loading ? (
          <div className="py-20 sm:py-24 flex flex-col items-center justify-center gap-3 text-slate-500">
            <Loader2 className="w-9 h-9 animate-spin text-[#FF3D00]" />
            <span className="text-sm font-medium">Loading product catalog...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-start">
            {/* LEFT SIDEBAR: CATEGORY FILTER & SUPPORT (Desktop lg+) */}
            <aside className="hidden lg:block lg:col-span-3 xl:col-span-2 lg:sticky lg:top-28 space-y-6">
              {/* Search Box */}
              <div className="bg-[#0A0F1D]/90 rounded-2xl border border-white/10 p-4 shadow-xl cyber-corner text-white">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Quick Search
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-[#0E1526] border border-white/10 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:bg-[#121B30] focus:border-[#FF3D00] transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter Card */}
              <div className="bg-[#0A0F1D]/90 rounded-2xl border border-white/10 p-5 shadow-xl space-y-4 cyber-corner text-white">
                <div className="flex items-center justify-between border-b border-white/10 pb-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
                      <Filter className="w-3.5 h-3.5" />
                    </div>
                    <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-white">
                      Categories
                    </h3>
                  </div>
                  {activeCategory !== 'all' && (
                    <button
                      type="button"
                      onClick={() => handleCategorySelect('all')}
                      className="text-[11px] font-bold text-[#FF3D00] hover:text-[#eb3800] hover:underline cursor-pointer"
                    >
                      Reset
                    </button>
                  )}
                </div>

                <div className="space-y-1.5">
                  <button
                    type="button"
                    onClick={() => handleCategorySelect('all')}
                    className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                      activeCategory === 'all'
                        ? 'bg-[#FF3D00] text-white shadow-[0_0_15px_rgba(255,61,0,0.4)]'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <ChevronRight
                        className={`w-3.5 h-3.5 ${
                          activeCategory === 'all' ? 'text-white' : 'text-[#FF3D00]'
                        }`}
                      />
                      <span>All Products</span>
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        activeCategory === 'all'
                          ? 'bg-white/20 text-white'
                          : 'bg-white/10 text-slate-400'
                      }`}
                    >
                      {products.length}
                    </span>
                  </button>

                  {categories.map((cat) => {
                    const count = products.filter((p) => p.category_id === cat.id).length;
                    const isSelected = activeCategory === cat.slug;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => handleCategorySelect(cat.slug)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'bg-[#FF3D00] text-white shadow-[0_0_15px_rgba(255,61,0,0.4)]'
                            : 'text-slate-300 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2 min-w-0">
                          <ChevronRight
                            className={`w-3.5 h-3.5 shrink-0 ${
                              isSelected ? 'text-white' : 'text-[#FF3D00]'
                            }`}
                          />
                          <span className="truncate">{cat.name}</span>
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                            isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-white/10 text-slate-400'
                          }`}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Direct Support Card */}
              <div className="relative overflow-hidden bg-[#070A14] text-white rounded-2xl p-5 border border-cyan-500/25 shadow-2xl space-y-3.5 cyber-corner">
                <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-[#FF3D00]/15 blur-xl pointer-events-none" />
                <span className="inline-block px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold uppercase tracking-wider">
                  Direct Support
                </span>
                <h4 className="text-base font-black leading-snug text-white">
                  Need Custom Sizing or Bulk Order?
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Speak directly with our team for custom specifications and volume quotations.
                </p>
                <div className="space-y-2 pt-1">
                  <a
                    href="tel:+8801976535654"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#FF3D00]/25"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>+8801976535654</span>
                  </a>
                  <a
                    href="https://wa.me/8801976535654?text=Hello%20DOER,%20I%20want%20to%20inquire%20about%20your%20products."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#66CC66] hover:bg-[#55b855] text-white text-xs font-bold uppercase tracking-wider transition-all"
                  >
                    <Image
                      src="/whatsapp.png"
                      alt="WhatsApp"
                      width={16}
                      height={16}
                      className="w-4 h-4 object-contain shrink-0"
                    />
                    <span>WhatsApp Chat</span>
                  </a>
                </div>
              </div>
            </aside>

            {/* RIGHT MAIN CONTENT: TOOLBAR (DESKTOP) + CATEGORIZED SECTIONS */}
            <div className="lg:col-span-9 xl:col-span-10 space-y-8 sm:space-y-12">
              {/* Desktop Top Toolbar (lg+) */}
              <div className="hidden lg:flex bg-[#0A0F1D]/90 rounded-2xl border border-white/10 px-5 py-4 shadow-xl flex-wrap items-center justify-between gap-4 cyber-corner text-white">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF3D00] animate-pulse shadow-[0_0_8px_#FF3D00]" />
                  <span className="font-black text-white uppercase tracking-wider text-xs sm:text-sm">
                    {activeCategory === 'all'
                      ? 'All Product Categories'
                      : categories.find((c) => c.slug === activeCategory)?.name || 'Products'}
                  </span>
                  <span className="text-white/20">|</span>
                  <span className="text-xs sm:text-sm text-slate-400">
                    Showing <strong className="text-white">{searchFilteredProducts.length}</strong>{' '}
                    {searchFilteredProducts.length === 1 ? 'product' : 'products'}
                  </span>
                </div>

                {/* Grid / List View Toggle */}
                <div className="flex items-center gap-2.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Layout:
                  </span>
                  <div className="inline-flex items-center bg-[#0E1526] p-1 rounded-xl border border-white/10">
                    <button
                      type="button"
                      onClick={() => setViewMode('grid')}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        viewMode === 'grid'
                          ? 'bg-[#FF3D00] text-white shadow-[0_0_10px_rgba(255,61,0,0.4)]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="Grid View"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>Grid</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('list')}
                      className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                        viewMode === 'list'
                          ? 'bg-[#FF3D00] text-white shadow-[0_0_10px_rgba(255,61,0,0.4)]'
                          : 'text-slate-400 hover:text-white'
                      }`}
                      title="List View"
                    >
                      <List className="w-3.5 h-3.5" />
                      <span>List</span>
                    </button>
                  </div>
                </div>
              </div>

              {searchFilteredProducts.length === 0 ? (
                <div className="py-16 sm:py-20 text-center bg-[#0A0F1D]/90 rounded-2xl sm:rounded-3xl border border-white/10 p-6 sm:p-8 space-y-4 shadow-xl cyber-corner text-white">
                  <Layers className="w-10 h-10 sm:w-12 sm:h-12 text-[#FF3D00] mx-auto animate-pulse" />
                  <h2 className="text-xl sm:text-2xl font-black text-white">No Matching Products</h2>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                    Try clearing your search filter or selecting another product category.
                  </p>
                  {(searchQuery || activeCategory !== 'all') && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        handleCategorySelect('all');
                      }}
                      className="px-4 py-2 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,61,0,0.35)]"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-10 sm:space-y-16">
                  {visibleCategories.map((cat, sectionIdx) => {
                    const catProducts = searchFilteredProducts.filter(
                      (p) => p.category_id === cat.id
                    );
                    if (catProducts.length === 0) return null;

                    return (
                      <section
                        key={cat.id}
                        id={`category-${cat.slug}`}
                        className="scroll-mt-36 lg:scroll-mt-28 space-y-4 sm:space-y-7"
                      >
                        {/* Architectural Category Section Header Card */}
                        <div className="relative overflow-hidden bg-[#0A0F1D]/90 rounded-2xl border border-white/10 p-4 sm:p-6 lg:p-7 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 cyber-corner text-white">
                          {/* Left orange accent bar with glow */}
                          <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#FF3D00] shadow-[0_0_12px_#FF3D00]" />
                          {/* Decorative ghost index number */}
                          <span className="hidden sm:block absolute right-6 -bottom-4 text-7xl font-black text-white/5 select-none pointer-events-none">
                            {String(sectionIdx + 1).padStart(2, '0')}
                          </span>

                          <div className="space-y-1 sm:space-y-1.5 max-w-3xl pl-2 relative z-10">
                            <div className="flex items-center justify-between sm:justify-start gap-2">
                              <div className="inline-flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#FF3D00]">
                                <span className="px-2 py-0.5 rounded bg-[#FF3D00]/15 text-[#FF3D00] border border-[#FF3D00]/30 font-mono">
                                  {String(sectionIdx + 1).padStart(2, '0')}
                                </span>
                                <span>Category Collection</span>
                              </div>
                              <span className="sm:hidden inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#0E1526] text-cyan-300 border border-cyan-500/30 text-[10px] font-bold uppercase">
                                {catProducts.length} {catProducts.length === 1 ? 'Item' : 'Items'}
                              </span>
                            </div>

                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-white tracking-tight">
                              {cat.name}
                            </h2>
                            {cat.description && (
                              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed line-clamp-2 sm:line-clamp-none">
                                {cat.description}
                              </p>
                            )}
                          </div>

                          <div className="hidden sm:block relative z-10 shrink-0">
                            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0E1526] text-cyan-300 border border-cyan-500/30 text-xs font-bold uppercase tracking-wider">
                              <span>{catProducts.length}</span>
                              <span>{catProducts.length === 1 ? 'Product' : 'Products'}</span>
                            </span>
                          </div>
                        </div>

                        {/* GRID VIEW vs LIST VIEW */}
                        {viewMode === 'grid' ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                            {catProducts.map((product) => {
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
                                          src={product.main_image}
                                          alt={product.name}
                                          fill
                                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#05070B] via-transparent to-transparent opacity-0 group-hover:opacity-80 transition-opacity duration-300" />
                                      </Link>

                                      {/* Top Badges */}
                                      <div className="absolute top-3 left-3 flex items-center gap-1.5 max-w-[75%]">
                                        <span className="px-2.5 py-1 rounded-lg bg-[#05070B]/85 backdrop-blur-md text-slate-200 border border-white/10 text-[10px] font-bold tracking-wide truncate">
                                          {cat.name}
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
                                        {stripHtml(product.short_description || product.description)}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Card Footer */}
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

                                    {hasPrice ? (
                                      <div className="grid grid-cols-2 gap-2">
                                        <Link
                                          href={`/checkout?product=${product.slug}`}
                                          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,61,0,0.35)] transition-all"
                                        >
                                          <ShoppingBag className="w-3.5 h-3.5 shrink-0" />
                                          <span>Order Now</span>
                                        </Link>

                                        <a
                                          href={getWhatsAppUrl(product)}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-[#66CC66] hover:bg-[#55b855] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all"
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
                                      <div className="space-y-2">
                                        <div className="grid grid-cols-2 gap-2">
                                          <a
                                            href="tel:+8801976535654"
                                            className="inline-flex items-center justify-center gap-1 py-2.5 px-2.5 rounded-xl bg-[#0E1526] hover:bg-[#FF3D00]/20 active:scale-[0.98] text-white text-[11px] font-bold uppercase tracking-wider border border-white/10 hover:border-[#FF3D00]/50 transition-all"
                                          >
                                            <Phone className="w-3 h-3 shrink-0" />
                                            <span>Call Price</span>
                                          </a>

                                          <a
                                            href={getWhatsAppUrl(product)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-2.5 rounded-xl bg-[#66CC66] hover:bg-[#55b855] active:scale-[0.98] text-white text-[11px] font-bold uppercase tracking-wider transition-all"
                                          >
                                            <Image
                                              src="/whatsapp.png"
                                              alt="WhatsApp"
                                              width={16}
                                              height={16}
                                              className="w-3.5 h-3.5 object-contain shrink-0"
                                            />
                                            <span>Ask Price</span>
                                          </a>
                                        </div>

                                        <Link
                                          href={`/checkout?product=${product.slug}`}
                                          className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,61,0,0.35)] transition-all"
                                        >
                                          <Send className="w-3.5 h-3.5 shrink-0" />
                                          <span>Send Query</span>
                                        </Link>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          /* LIST VIEW */
                          <div className="space-y-3.5 sm:space-y-4">
                            {catProducts.map((product) => {
                              const hasPrice =
                                !product.is_call_for_price &&
                                product.price !== null &&
                                Number(product.price) > 0;

                              return (
                                <div
                                  key={product.id}
                                  className="group relative bg-[#0B101D]/90 rounded-2xl border border-white/10 hover:border-[#FF3D00]/60 shadow-[0_10px_30px_rgba(0,0,0,0.8)] hover:shadow-[0_0_25px_rgba(255,61,0,0.35)] transition-all duration-300 p-3.5 sm:p-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 sm:gap-6 overflow-hidden cyber-corner text-white"
                                >
                                  <div className="hidden md:block absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-[#FF3D00] shadow-[0_0_8px_#FF3D00] transition-colors" />

                                  {/* Top/Left Image (1:1 Square) */}
                                  <div className="relative w-full sm:w-56 md:w-60 aspect-square rounded-xl overflow-hidden bg-[#070A12] border border-white/10 shrink-0">
                                    <Link href={`/products/${product.slug}`} className="block w-full h-full">
                                      <Image
                                        src={product.main_image}
                                        alt={product.name}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                      />
                                    </Link>
                                    {product.video_type !== 'none' && product.video_url && (
                                      <span className="absolute top-2.5 left-2.5 px-2 py-1 rounded-md bg-[#FF3D00] text-white text-[10px] font-bold uppercase flex items-center gap-1 shadow">
                                        <Video className="w-3 h-3" />
                                        Video
                                      </span>
                                    )}
                                  </div>

                                  {/* Center Info */}
                                  <div className="flex-1 min-w-0 space-y-2">
                                    <div className="flex items-center justify-between md:justify-start gap-2">
                                      <span className="px-2.5 py-0.5 rounded-md bg-[#0E1526] text-cyan-300 border border-cyan-500/30 text-[11px] font-bold truncate">
                                        {cat.name}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleShare(product)}
                                        className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-[#FF3D00] cursor-pointer shrink-0"
                                      >
                                        {copiedSlug === product.slug ? (
                                          <>
                                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                                            <span className="text-emerald-400 font-semibold">
                                              Copied!
                                            </span>
                                          </>
                                        ) : (
                                          <>
                                            <Share2 className="w-3.5 h-3.5" />
                                            <span>Share</span>
                                          </>
                                        )}
                                      </button>
                                    </div>

                                    <Link href={`/products/${product.slug}`}>
                                      <h3 className="text-base sm:text-xl font-black text-white group-hover:text-[#FF3D00] transition-colors leading-snug">
                                        {product.name}
                                      </h3>
                                    </Link>

                                    <p className="text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
                                      {stripHtml(product.short_description || product.description)}
                                    </p>

                                    <div className="pt-0.5">
                                      <Link
                                        href={`/products/${product.slug}`}
                                        className="inline-flex items-center gap-1 text-xs font-bold text-[#FF3D00] hover:text-[#eb3800] hover:underline"
                                      >
                                        <span>View Full Specifications</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                      </Link>
                                    </div>
                                  </div>

                                  {/* Right Actions */}
                                  <div className="md:w-64 shrink-0 border-t md:border-t-0 md:border-l border-white/10 pt-3 md:pt-0 md:pl-6 flex flex-col justify-center space-y-3">
                                    <div className="p-3 rounded-xl bg-[#070A12] border border-white/10 flex md:block items-center justify-between">
                                      {hasPrice ? (
                                        <>
                                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                                            Direct Price
                                          </span>
                                          <span className="text-lg sm:text-2xl font-black text-white">
                                            ৳ {Number(product.price).toLocaleString()}
                                          </span>
                                        </>
                                      ) : (
                                        <>
                                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF3D00] block">
                                            Custom Configuration
                                          </span>
                                          <span className="text-sm sm:text-lg font-black text-white">
                                            Call for Price
                                          </span>
                                        </>
                                      )}
                                    </div>

                                    {hasPrice ? (
                                      <div className="grid grid-cols-2 md:grid-cols-1 gap-2">
                                        <Link
                                          href={`/checkout?product=${product.slug}`}
                                          className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,61,0,0.35)] transition-all"
                                        >
                                          <ShoppingBag className="w-3.5 h-3.5" />
                                          <span>Order Now</span>
                                        </Link>
                                        <a
                                          href={getWhatsAppUrl(product)}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#66CC66] hover:bg-[#55b855] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all"
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
                                      <div className="space-y-2">
                                        <div className="grid grid-cols-2 gap-2">
                                          <a
                                            href="tel:+8801976535654"
                                            className="inline-flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl bg-[#0E1526] hover:bg-[#FF3D00]/20 text-white text-[11px] font-bold uppercase border border-white/10 hover:border-[#FF3D00]/50 transition-colors"
                                          >
                                            <Phone className="w-3 h-3" />
                                            <span>Call</span>
                                          </a>
                                          <a
                                            href={getWhatsAppUrl(product)}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#66CC66] hover:bg-[#55b855] text-white text-[11px] font-bold uppercase transition-colors"
                                          >
                                            <Image
                                              src="/whatsapp.png"
                                              alt="WhatsApp"
                                              width={16}
                                              height={16}
                                              className="w-3.5 h-3.5 object-contain shrink-0"
                                            />
                                            <span>WhatsApp</span>
                                          </a>
                                        </div>
                                        <Link
                                          href={`/checkout?product=${product.slug}`}
                                          className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,61,0,0.35)] transition-all"
                                        >
                                          <Send className="w-3.5 h-3.5" />
                                          <span>Send Query</span>
                                        </Link>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </section>
                    );
                  })}

                  {/* Uncategorized Products fallback */}
                  {activeCategory === 'all' && uncategorizedProducts.length > 0 && (
                    <section className="space-y-6">
                      <div className="bg-[#0A0F1D]/90 rounded-2xl border border-white/10 p-5 sm:p-6 cyber-corner text-white">
                        <h2 className="text-xl sm:text-2xl font-black text-white">Other Products</h2>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                        {uncategorizedProducts.map((product) => (
                          <div
                            key={product.id}
                            className="bg-[#0B101D]/90 rounded-2xl border border-white/10 p-4 sm:p-5 flex flex-col justify-between cyber-corner text-white"
                          >
                            <div>
                              <div className="relative h-48 sm:h-52 w-full rounded-xl overflow-hidden mb-4 bg-[#070A12] border border-white/10">
                                <Image
                                  src={product.main_image}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <h3 className="text-base sm:text-lg font-bold text-white">{product.name}</h3>
                              <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                                {stripHtml(product.short_description)}
                              </p>
                            </div>
                            <Link
                              href={`/products/${product.slug}`}
                              className="mt-4 inline-flex items-center justify-center py-2.5 px-4 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase shadow-[0_0_15px_rgba(255,61,0,0.35)]"
                            >
                              View Details
                            </Link>
                          </div>
                        ))}
                      </div>
                    </section>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ProductsShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#05070B] text-slate-200">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF3D00]" />
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
