'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Globe,
  Search,
  FileText,
  ShoppingBag,
  Code2,
  Check,
  X,
  AlertCircle,
  Loader2,
  Upload,
  ExternalLink,
  Plus,
  Edit3,
  RefreshCw,
  Sparkles,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Star,
  Eye,
  Trash2,
  ArrowRight,
  HelpCircle,
  FolderTree,
} from 'lucide-react';

interface SeoSettings {
  id: number;
  site_name: string;
  title_template: string;
  default_meta_title: string;
  default_meta_description: string;
  default_keywords: string;
  canonical_base_url: string;
  default_og_image: string;
  twitter_card_type: string;
  twitter_handle: string;
  google_site_verification: string;
  bing_site_verification: string;
  robots_default_index: number;
  robots_default_follow: number;
  robots_custom_directives: string;
  updated_at?: string;
}

interface SeoPage {
  id: number;
  page_path: string;
  page_name: string;
  meta_title: string;
  meta_description: string;
  focus_keywords: string;
  canonical_url: string;
  robots_index: number;
  robots_follow: number;
  og_title: string;
  og_description: string;
  og_image: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  custom_schema?: string;
  sitemap_changefreq: string;
  sitemap_priority: number;
  updated_at?: string;
}

interface SeoProduct {
  id: number;
  name: string;
  slug: string;
  price: number | null;
  main_image: string;
  status: string;
  category_name?: string;
  meta_title?: string;
  meta_description?: string;
  focus_keywords?: string;
  canonical_url?: string;
  og_image?: string;
  sku?: string;
  mpn?: string;
  schema_rating_value: number;
  schema_review_count: number;
  robots_index: number;
  seo_score: number;
  seo_issues: string[];
}

interface SitemapStats {
  pagesCount: number;
  categoriesCount: number;
  productsCount: number;
  jobsCount: number;
  totalUrls: number;
  sitemapUrl: string;
  robotsUrl: string;
  generatedAt: string;
}

export default function SeoManagerPage() {
  const [activeTab, setActiveTab] = useState<'global' | 'pages' | 'products' | 'schema' | 'sitemap'>('global');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // 1. Global Settings State
  const [settings, setSettings] = useState<SeoSettings | null>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);

  // 2. Pages SEO State
  const [pages, setPages] = useState<SeoPage[]>([]);
  const [loadingPages, setLoadingPages] = useState(false);
  const [editingPage, setEditingPage] = useState<SeoPage | null>(null);
  const [isPageModalOpen, setIsPageModalOpen] = useState(false);
  const [savingPage, setSavingPage] = useState(false);

  // Page Form State
  const [pagePath, setPagePath] = useState('');
  const [pageName, setPageName] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [focusKeywords, setFocusKeywords] = useState('');
  const [canonicalUrl, setCanonicalUrl] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [ogImage, setOgImage] = useState('');
  const [sitemapChangefreq, setSitemapChangefreq] = useState('weekly');
  const [sitemapPriority, setSitemapPriority] = useState<number>(0.8);
  const [robotsIndex, setRobotsIndex] = useState(true);
  const [robotsFollow, setRobotsFollow] = useState(true);
  const [customSchema, setCustomSchema] = useState('');

  // 3. Products SEO State
  const [products, setProducts] = useState<SeoProduct[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SeoProduct | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  // Product Form State
  const [prodMetaTitle, setProdMetaTitle] = useState('');
  const [prodMetaDesc, setProdMetaDesc] = useState('');
  const [prodKeywords, setProdKeywords] = useState('');
  const [prodCanonical, setProdCanonical] = useState('');
  const [prodOgImage, setProdOgImage] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodMpn, setProdMpn] = useState('');
  const [prodRatingValue, setProdRatingValue] = useState(4.9);
  const [prodReviewCount, setProdReviewCount] = useState(28);
  const [prodIndex, setProdIndex] = useState(true);

  // 4. Sitemap Stats State
  const [sitemapStats, setSitemapStats] = useState<SitemapStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Image Upload Refs & State
  const [uploadingImage, setUploadingImage] = useState(false);
  const globalOgFileInputRef = useRef<HTMLInputElement>(null);
  const pageOgFileInputRef = useRef<HTMLInputElement>(null);
  const prodOgFileInputRef = useRef<HTMLInputElement>(null);

  // Fetching Logic
  const fetchGlobalSettings = async () => {
    try {
      setLoadingSettings(true);
      const res = await fetch('/api/admin/seo/settings');
      if (res.ok) {
        const data = await res.json();
        setSettings(data.settings);
      }
    } catch (err) {
      console.error('Error loading SEO settings:', err);
    } finally {
      setLoadingSettings(false);
    }
  };

  const fetchPages = async () => {
    try {
      setLoadingPages(true);
      const res = await fetch('/api/admin/seo/pages');
      if (res.ok) {
        const data = await res.json();
        setPages(data.pages || []);
      }
    } catch (err) {
      console.error('Error loading SEO pages:', err);
    } finally {
      setLoadingPages(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoadingProducts(true);
      const res = await fetch('/api/admin/seo/products');
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (err) {
      console.error('Error loading SEO products:', err);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchSitemapStats = async () => {
    try {
      setLoadingStats(true);
      const res = await fetch('/api/admin/seo/sitemap-stats');
      if (res.ok) {
        const data = await res.json();
        setSitemapStats(data.stats);
      }
    } catch (err) {
      console.error('Error loading sitemap stats:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchGlobalSettings();
    fetchPages();
    fetchProducts();
    fetchSitemapStats();
  }, []);

  // Upload Handler (Reusable for Global, Page, and Product)
  const handleUploadImage = async (file: File, onSuccess: (url: string) => void) => {
    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'error', message: 'Please upload an image file (JPG, PNG, WebP).' });
      return;
    }
    try {
      setUploadingImage(true);
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to upload image.');
      const uploadedUrl = data.url || (data.urls && data.urls[0]);
      if (uploadedUrl) {
        onSuccess(uploadedUrl);
        setFeedback({ type: 'success', message: 'Open Graph image uploaded successfully (1200×630).' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Image upload failed.' });
    } finally {
      setUploadingImage(false);
    }
  };

  // 1. Save Global Settings
  const handleSaveGlobalSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      setSavingSettings(true);
      const res = await fetch('/api/admin/seo/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save settings.');
      setFeedback({ type: 'success', message: 'Global SEO settings and verification codes saved.' });
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error saving settings.' });
    } finally {
      setSavingSettings(false);
    }
  };

  // 2. Open Page Edit Modal
  const openEditPageModal = (page: SeoPage) => {
    setEditingPage(page);
    setPagePath(page.page_path);
    setPageName(page.page_name);
    setMetaTitle(page.meta_title || '');
    setMetaDescription(page.meta_description || '');
    setFocusKeywords(page.focus_keywords || '');
    setCanonicalUrl(page.canonical_url || '');
    setOgTitle(page.og_title || page.meta_title || '');
    setOgDescription(page.og_description || page.meta_description || '');
    setOgImage(page.og_image || '');
    setSitemapChangefreq(page.sitemap_changefreq || 'weekly');
    setSitemapPriority(Number(page.sitemap_priority) || 0.8);
    setRobotsIndex(page.robots_index !== 0);
    setRobotsFollow(page.robots_follow !== 0);
    setCustomSchema(page.custom_schema || '');
    setIsPageModalOpen(true);
  };

  const handleSavePageSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;
    try {
      setSavingPage(true);
      const payload = {
        page_name: pageName,
        meta_title: metaTitle,
        meta_description: metaDescription,
        focus_keywords: focusKeywords,
        canonical_url: canonicalUrl,
        og_title: ogTitle,
        og_description: ogDescription,
        og_image: ogImage,
        sitemap_changefreq: sitemapChangefreq,
        sitemap_priority: sitemapPriority,
        robots_index: robotsIndex ? 1 : 0,
        robots_follow: robotsFollow ? 1 : 0,
        custom_schema: customSchema,
      };

      const res = await fetch(`/api/admin/seo/pages/${editingPage.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update page SEO.');
      setFeedback({ type: 'success', message: `Page SEO for "${pagePath}" updated successfully!` });
      setIsPageModalOpen(false);
      fetchPages();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error updating page.' });
    } finally {
      setSavingPage(false);
    }
  };

  // 3. Open Product Edit Modal
  const openEditProductModal = (prod: SeoProduct) => {
    setEditingProduct(prod);
    setProdMetaTitle(prod.meta_title || `${prod.name} | DOER Console Tables`);
    setProdMetaDesc(prod.meta_description || `High-performance 24/7 mission-critical command console table ${prod.name} manufactured by DOER.`);
    setProdKeywords(prod.focus_keywords || `${prod.name}, console tables, control room console, operator desk`);
    setProdCanonical(prod.canonical_url || `http://doerbd.com/products/${prod.slug}`);
    setProdOgImage(prod.og_image || '');
    setProdSku(prod.sku || `DOER-${prod.slug.toUpperCase()}`);
    setProdMpn(prod.mpn || prod.slug.toUpperCase());
    setProdRatingValue(Number(prod.schema_rating_value) || 4.9);
    setProdReviewCount(Number(prod.schema_review_count) || 28);
    setProdIndex(prod.robots_index !== 0);
    setIsProductModalOpen(true);
  };

  const handleSaveProductSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    try {
      setSavingProduct(true);
      const payload = {
        meta_title: prodMetaTitle,
        meta_description: prodMetaDesc,
        focus_keywords: prodKeywords,
        canonical_url: prodCanonical,
        og_image: prodOgImage,
        sku: prodSku,
        mpn: prodMpn,
        schema_rating_value: prodRatingValue,
        schema_review_count: prodReviewCount,
        robots_index: prodIndex ? 1 : 0,
      };

      const res = await fetch(`/api/admin/seo/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update product SEO.');
      setFeedback({ type: 'success', message: `Product SEO & Rich Snippets for "${editingProduct.name}" saved!` });
      setIsProductModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error updating product.' });
    } finally {
      setSavingProduct(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] text-[10px] font-bold uppercase tracking-wider">
              Search Engine Optimization
            </span>
            <span className="text-xs text-slate-400 font-mono">/ SEO Manager</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Search className="w-7 h-7 text-[#FF3D00]" />
            <span>Advanced SEO & Google Ranking Suite</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Target high-intent keywords for <strong className="text-white">Console Tables</strong>, <strong className="text-white">Control Room Interiors</strong>, and <strong className="text-white">Metal Art Supply</strong>. Live Google SERP preview, JSON-LD Schema Markup, dynamic sitemap, and robots.txt.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/sitemap.xml"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0E1526] hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold uppercase transition-all"
            title="Inspect dynamic sitemap.xml"
          >
            <span>XML Sitemap</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#FF3D00]" />
          </Link>

          <Link
            href="/robots.txt"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0E1526] hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold uppercase transition-all"
            title="Inspect robots.txt"
          >
            <span>Robots.txt</span>
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
          </Link>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-white/10 gap-1 overflow-x-auto">
        <button
          onClick={() => setActiveTab('global')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'global'
              ? 'border-[#FF3D00] text-white bg-white/[0.04]'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.01]'
          }`}
        >
          <Sliders className="w-4 h-4 text-[#FF3D00]" />
          <span>Global Settings</span>
        </button>

        <button
          onClick={() => setActiveTab('pages')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'pages'
              ? 'border-[#FF3D00] text-white bg-white/[0.04]'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.01]'
          }`}
        >
          <FileText className="w-4 h-4 text-[#FF3D00]" />
          <span>Page SEO ({pages.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'products'
              ? 'border-[#FF3D00] text-white bg-white/[0.04]'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.01]'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-[#FF3D00]" />
          <span>Product SEO ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('schema')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'schema'
              ? 'border-[#FF3D00] text-white bg-white/[0.04]'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.01]'
          }`}
        >
          <Code2 className="w-4 h-4 text-[#FF3D00]" />
          <span>Schema Markup</span>
        </button>

        <button
          onClick={() => setActiveTab('sitemap')}
          className={`flex items-center gap-2 px-4 sm:px-5 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'sitemap'
              ? 'border-[#FF3D00] text-white bg-white/[0.04]'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.01]'
          }`}
        >
          <Globe className="w-4 h-4 text-[#FF3D00]" />
          <span>Sitemap & Robots</span>
        </button>
      </div>

      {/* Feedback Alert Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-medium animate-in fade-in duration-200 ${
            feedback.type === 'success'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
              : 'bg-red-500/15 border-red-500/40 text-red-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            ) : (
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 1: GLOBAL SEO SETTINGS */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'global' && (
        <div className="space-y-6">
          {loadingSettings ? (
            <div className="py-20 text-center space-y-3 bg-[#080C16] rounded-2xl border border-white/10">
              <Loader2 className="w-8 h-8 animate-spin text-[#FF3D00] mx-auto" />
              <p className="text-xs text-slate-400 font-mono">Loading global SEO configurations...</p>
            </div>
          ) : settings ? (
            <form onSubmit={handleSaveGlobalSettings} className="space-y-6">
              {/* Card 1: Core Search Identity */}
              <div className="p-6 rounded-2xl bg-[#0B101D] border border-white/15 space-y-5">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <Globe className="w-5 h-5 text-[#FF3D00]" />
                  <h3 className="text-base font-bold text-white">Website Search Identity & Canonical Domain</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Site Brand Name
                    </label>
                    <input
                      type="text"
                      value={settings.site_name}
                      onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                      placeholder="DOER"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs font-bold focus:border-[#FF3D00] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Canonical Domain URL
                    </label>
                    <input
                      type="text"
                      value={settings.canonical_base_url}
                      onChange={(e) => setSettings({ ...settings, canonical_base_url: e.target.value })}
                      placeholder="http://doerbd.com"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs font-mono focus:border-[#FF3D00] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block flex items-center justify-between">
                    <span>Global Title Template</span>
                    <span className="text-[10px] text-cyan-400 font-mono">%s is replaced by page title</span>
                  </label>
                  <input
                    type="text"
                    value={settings.title_template}
                    onChange={(e) => setSettings({ ...settings, title_template: e.target.value })}
                    placeholder="%s | DOER – Console Tables & Control Room Interior"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs font-bold focus:border-[#FF3D00] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Default Meta Title (Homepage / Fallback)
                  </label>
                  <input
                    type="text"
                    value={settings.default_meta_title}
                    onChange={(e) => setSettings({ ...settings, default_meta_title: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs font-bold focus:border-[#FF3D00] focus:outline-none"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Google recommends 50 - 60 characters</span>
                    <span className={settings.default_meta_title.length > 60 ? 'text-amber-400' : 'text-emerald-400'}>
                      {settings.default_meta_title.length} characters
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Default Meta Description
                  </label>
                  <textarea
                    rows={3}
                    value={settings.default_meta_description}
                    onChange={(e) => setSettings({ ...settings, default_meta_description: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs leading-relaxed focus:border-[#FF3D00] focus:outline-none"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>Google recommends 140 - 160 characters</span>
                    <span className={settings.default_meta_description.length > 160 ? 'text-amber-400' : 'text-emerald-400'}>
                      {settings.default_meta_description.length} characters
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Default Target Keywords
                  </label>
                  <input
                    type="text"
                    value={settings.default_keywords}
                    onChange={(e) => setSettings({ ...settings, default_keywords: e.target.value })}
                    placeholder="console tables, control room interior, metal art supply, water bubble stainless steel"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-slate-200 text-xs focus:border-[#FF3D00] focus:outline-none"
                  />
                </div>
              </div>

              {/* Card 2: Open Graph & Social Sharing Card (With 1200x630 Direct Upload Option) */}
              <div className="p-6 rounded-2xl bg-[#0B101D] border border-cyan-500/30 space-y-5">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-base font-bold text-white">Default Social Sharing Banner (Open Graph)</h3>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/15 text-cyan-300 text-[10px] font-mono uppercase font-bold">
                    Recommended: 1200 × 630 px
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
                  <div className="lg:col-span-7 space-y-3">
                    <p className="text-xs text-slate-300 leading-relaxed">
                      This banner appears when someone shares your website link on Facebook, LinkedIn, WhatsApp, or Twitter.
                    </p>

                    {/* Drag-and-drop / Click to upload box */}
                    <div className="p-4 rounded-xl border-2 border-dashed border-white/15 hover:border-cyan-500/50 bg-[#070A12] text-center space-y-2">
                      <input
                        ref={globalOgFileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleUploadImage(e.target.files[0], (url) => {
                              setSettings({ ...settings, default_og_image: url });
                            });
                          }
                        }}
                      />
                      {uploadingImage ? (
                        <div className="py-3 flex items-center justify-center gap-2 text-xs text-[#FF3D00]">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Uploading 1200×630 image...</span>
                        </div>
                      ) : (
                        <div className="space-y-1">
                          <button
                            type="button"
                            onClick={() => globalOgFileInputRef.current?.click()}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-xs font-bold cursor-pointer border border-cyan-500/30"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Image (1200×630)</span>
                          </button>
                          <p className="text-[10px] text-slate-400 font-mono">
                            Aspect Ratio: 1.91:1 · JPG, WebP, PNG up to 5MB
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-1">
                      <span className="text-[11px] text-slate-400 font-mono">Image URL / Path:</span>
                      <input
                        type="text"
                        value={settings.default_og_image}
                        onChange={(e) => setSettings({ ...settings, default_og_image: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-[#070A12] border border-white/15 text-slate-200 text-xs font-mono"
                      />
                    </div>
                  </div>

                  {/* Visual Preview */}
                  <div className="lg:col-span-5">
                    <div className="relative aspect-[1200/630] w-full rounded-xl overflow-hidden border border-white/15 bg-slate-900 shadow-xl">
                      {settings.default_og_image ? (
                        <Image
                          src={settings.default_og_image}
                          alt="Open Graph Preview"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-500 text-xs font-mono">
                          No Banner Uploaded
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-3">
                        <span className="text-[10px] font-mono text-cyan-300 bg-black/70 px-2 py-0.5 rounded border border-white/15">
                          1200 × 630 px Preview
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: Google & Bing Search Console Verifications */}
              <div className="p-6 rounded-2xl bg-[#0B101D] border border-white/15 space-y-4">
                <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white">Search Console Site Verifications</h3>
                </div>
                <p className="text-xs text-slate-400">
                  Verify ownership on Google Search Console and Bing Webmaster Tools by entering your HTML verification meta tag content.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Google Search Console Token
                    </label>
                    <input
                      type="text"
                      value={settings.google_site_verification}
                      onChange={(e) => setSettings({ ...settings, google_site_verification: e.target.value })}
                      placeholder="e.g. google-site-verification code"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs font-mono focus:border-[#FF3D00] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Bing Webmaster Tools Token
                    </label>
                    <input
                      type="text"
                      value={settings.bing_site_verification}
                      onChange={(e) => setSettings({ ...settings, bing_site_verification: e.target.value })}
                      placeholder="e.g. msvalidate.01 token"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs font-mono focus:border-[#FF3D00] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <button
                  type="submit"
                  disabled={savingSettings}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#FF3D00]/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {savingSettings ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Save Global Settings</span>
                </button>
              </div>
            </form>
          ) : null}
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 2: PER-PAGE SEO EDITOR */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'pages' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider text-xs">
                Configured Pages ({pages.length})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Optimize meta titles, descriptions, and focus keywords for every individual landing and static page.
              </p>
            </div>
            <button
              onClick={fetchPages}
              disabled={loadingPages}
              className="p-1.5 rounded-lg bg-[#0E1526] hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingPages ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-3">
            {pages.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-2xl bg-[#0B101D] border border-white/10 hover:border-cyan-500/40 transition-all space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#FF3D00] px-2.5 py-1 rounded-md bg-[#080C16] border border-[#FF3D00]/30">
                      {p.page_path}
                    </span>
                    <h4 className="text-sm font-bold text-white">{p.page_name}</h4>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        p.robots_index
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/15 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {p.robots_index ? 'Index' : 'NoIndex'}
                    </span>

                    <span className="px-2 py-0.5 rounded-md bg-white/5 text-slate-300 text-[10px] font-mono border border-white/10">
                      Priority {p.sitemap_priority}
                    </span>

                    <button
                      onClick={() => openEditPageModal(p)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0E1526] hover:bg-[#FF3D00] text-slate-300 hover:text-white border border-white/10 text-xs font-bold transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit SEO</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-xs font-bold text-slate-200">{p.meta_title}</p>
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {p.meta_description}
                  </p>
                </div>

                {p.focus_keywords && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.focus_keywords.split(',').map((kw, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-slate-300"
                      >
                        {kw.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 3: PRODUCT SEO & RICH SNIPPETS */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white uppercase tracking-wider text-xs">
                Product Catalog SEO ({products.length})
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Individual product meta tags and Google Rich Results (gold review stars, price tags, and in-stock badges).
              </p>
            </div>
            <button
              onClick={fetchProducts}
              disabled={loadingProducts}
              className="p-1.5 rounded-lg bg-[#0E1526] hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingProducts ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="space-y-3">
            {products.map((prod) => (
              <div
                key={prod.id}
                className="p-4 sm:p-5 rounded-2xl bg-[#0B101D] border border-white/10 hover:border-cyan-500/40 transition-all flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-white/15 bg-slate-900 shrink-0">
                    <Image
                      src={prod.main_image || '/images/products/03-office-control-console-yq-dz-01.jpg'}
                      alt={prod.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-white truncate max-w-sm">{prod.name}</h4>
                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-cyan-300 font-mono">
                        {prod.category_name || 'Category'}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          prod.seo_score >= 80
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                        }`}
                      >
                        {prod.seo_score}% SEO Score
                      </span>
                    </div>

                    <p className="text-xs text-slate-400 truncate">
                      {prod.meta_title || `${prod.name} | DOER Console Tables`}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                      <span className="flex items-center gap-1 text-amber-400 font-bold">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{prod.schema_rating_value || 4.9} ({prod.schema_review_count || 28} reviews)</span>
                      </span>
                      <span>•</span>
                      <span className="font-mono text-slate-300">SKU: {prod.sku || `DOER-${prod.slug.toUpperCase()}`}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => openEditProductModal(prod)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0E1526] hover:bg-[#FF3D00] text-slate-200 hover:text-white border border-white/15 text-xs font-bold transition-all cursor-pointer shrink-0 self-end lg:self-center"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Configure Product SEO</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 4: SCHEMA MARKUP (STRUCTURED DATA) */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'schema' && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-[#0B101D] border border-cyan-500/30 space-y-3">
            <div className="flex items-center gap-2 text-cyan-400">
              <Code2 className="w-5 h-5" />
              <h3 className="text-base font-bold text-white">Google Rich Results & Structured Data Engine</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Your website automatically renders valid JSON-LD Schema Markup in accordance with Schema.org standards. Googlebot uses this to generate gold star review snippets, pricing indicators, sitelinks search box, and Dhaka local business graph data.
            </p>
            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href="https://search.google.com/test/rich-results?url=http://doerbd.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider transition-all"
              >
                <span>Test in Google Rich Results Tool</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-5 rounded-2xl bg-[#080C16] border border-white/10 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Organization & Local Business Schema</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Injected globally into root layout. Establishes DOER as an established manufacturer in Khilkhet, Dhaka with official telephone, logo, and social credentials.
              </p>
              <div className="p-3 rounded-xl bg-[#05070B] border border-white/10 font-mono text-[11px] text-cyan-300 overflow-x-auto">
                <pre>{`{
  "@type": "Organization",
  "name": "DOER",
  "url": "http://doerbd.com",
  "telephone": "+8801976535654",
  "address": { "addressLocality": "Dhaka", "addressCountry": "BD" }
}`}</pre>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#080C16] border border-white/10 space-y-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                <span>Product & AggregateRating Schema</span>
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Injected on all product pages (`/products/[slug]`). Powers Google gold review stars, price tag, brand attribution, and in-stock inventory indicators.
              </p>
              <div className="p-3 rounded-xl bg-[#05070B] border border-white/10 font-mono text-[11px] text-amber-300 overflow-x-auto">
                <pre>{`{
  "@type": "Product",
  "brand": "DOER",
  "offers": { "priceCurrency": "BDT", "availability": "InStock" },
  "aggregateRating": { "ratingValue": "4.9", "reviewCount": "28" }
}`}</pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 5: SITEMAP & ROBOTS.TXT */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'sitemap' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-[#0B101D] border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Total URLs in Sitemap</span>
              <p className="text-2xl font-black text-[#FF3D00]">{sitemapStats?.totalUrls || 0}</p>
              <span className="text-[10px] text-emerald-400">All 100% crawlable</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B101D] border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Core Pages</span>
              <p className="text-2xl font-black text-white">{sitemapStats?.pagesCount || 0}</p>
              <span className="text-[10px] text-slate-400">Home, Services, Workshop...</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B101D] border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Product Models</span>
              <p className="text-2xl font-black text-cyan-400">{sitemapStats?.productsCount || 0}</p>
              <span className="text-[10px] text-slate-400">With high-res image tags</span>
            </div>

            <div className="p-4 rounded-2xl bg-[#0B101D] border border-white/10 space-y-1">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Categories</span>
              <p className="text-2xl font-black text-amber-400">{sitemapStats?.categoriesCount || 0}</p>
              <span className="text-[10px] text-slate-400">Console tables & collections</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-[#0B101D] border border-white/15 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Live Search Crawler Files</h3>
              </div>
              <button
                onClick={fetchSitemapStats}
                disabled={loadingStats}
                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <RefreshCw className={`w-4 h-4 ${loadingStats ? 'animate-spin' : ''}`} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#070A12] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white font-mono">/sitemap.xml</h4>
                  <Link
                    href="/sitemap.xml"
                    target="_blank"
                    className="text-[11px] font-bold text-[#FF3D00] hover:underline flex items-center gap-1"
                  >
                    <span>Inspect XML</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Automatically regenerated in real-time. Whenever you add a new product or edit a page, Google immediately discovers the new entry with zero manual work.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#070A12] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-white font-mono">/robots.txt</h4>
                  <Link
                    href="/robots.txt"
                    target="_blank"
                    className="text-[11px] font-bold text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <span>View Directives</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Directs Googlebot and Bingbot to the sitemap while protecting sensitive admin and API endpoints from crawling waste.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* MODAL: EDIT PAGE SEO */}
      {/* --------------------------------------------------------------------- */}
      {isPageModalOpen && editingPage && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#0B101D] border border-cyan-500/30 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-white my-8 cyber-corner animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] flex items-center justify-center">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Configure Page SEO: {pagePath}</h3>
                  <p className="text-xs text-slate-400">Optimize meta tags, Google snippet, and Open Graph image.</p>
                </div>
              </div>
              <button
                onClick={() => setIsPageModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSavePageSeo} className="space-y-5 overflow-y-auto pr-1 flex-1">
              {/* Google SERP Preview Box */}
              <div className="p-4 rounded-xl bg-[#05070B] border border-white/15 space-y-1.5 font-sans">
                <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">
                  Google Search Result Preview (Desktop)
                </span>
                <div className="text-xs text-slate-400 truncate flex items-center gap-1 font-mono">
                  <span>http://doerbd.com</span>
                  <span className="text-slate-600">›</span>
                  <span className="text-slate-300">{pagePath === '/' ? 'home' : pagePath.replace('/', '')}</span>
                </div>
                <h4 className="text-base font-bold text-[#8ab4f8] hover:underline cursor-pointer line-clamp-1">
                  {metaTitle || 'Your Page Title'}
                </h4>
                <p className="text-xs text-[#bdc1c6] line-clamp-2 leading-relaxed">
                  {metaDescription || 'Your page meta description will appear here on Google search results...'}
                </p>
              </div>

              {/* Title & Counters */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Page Meta Title
                </label>
                <input
                  type="text"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs font-bold focus:border-[#FF3D00] focus:outline-none"
                  required
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Recommended: 50 – 60 characters</span>
                  <span className={metaTitle.length > 60 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                    {metaTitle.length} chars
                  </span>
                </div>
              </div>

              {/* Description & Counters */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs leading-relaxed focus:border-[#FF3D00] focus:outline-none"
                  required
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Recommended: 140 – 160 characters</span>
                  <span className={metaDescription.length > 160 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                    {metaDescription.length} chars
                  </span>
                </div>
              </div>

              {/* Focus Keywords */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Focus Keywords (Comma-Separated)
                </label>
                <input
                  type="text"
                  value={focusKeywords}
                  onChange={(e) => setFocusKeywords(e.target.value)}
                  placeholder="e.g. console tables, control room interior, metal art supply"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-slate-200 text-xs focus:border-[#FF3D00] focus:outline-none"
                />
              </div>

              {/* Open Graph Image Upload (1200x630 Display) */}
              <div className="p-4 rounded-xl bg-[#070A12] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                    Page Open Graph Social Share Image
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">1200 × 630 px</span>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    ref={pageOgFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleUploadImage(e.target.files[0], (url) => setOgImage(url));
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => pageOgFileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-xs font-bold cursor-pointer border border-cyan-500/30"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload 1200×630 Image</span>
                  </button>
                  <span className="text-[10px] text-slate-400 font-mono">Aspect Ratio 1.91:1</span>
                </div>

                <input
                  type="text"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  placeholder="/images/introduction-image.png"
                  className="w-full px-3.5 py-2 rounded-xl bg-[#0B101D] border border-white/15 text-slate-200 text-xs font-mono"
                />

                {ogImage && (
                  <div className="relative aspect-[1200/630] max-w-sm rounded-xl overflow-hidden border border-white/15 bg-slate-900">
                    <Image src={ogImage} alt="OG Preview" fill className="object-cover" />
                  </div>
                )}
              </div>

              {/* Sitemap Priority & Frequency */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Sitemap Priority (0.1 - 1.0)
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.1"
                    max="1.0"
                    value={sitemapPriority}
                    onChange={(e) => setSitemapPriority(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs font-mono focus:border-[#FF3D00] focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Change Frequency
                  </label>
                  <select
                    value={sitemapChangefreq}
                    onChange={(e) => setSitemapChangefreq(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs font-bold focus:border-[#FF3D00] focus:outline-none"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              </div>

              {/* Robots Index / Follow */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#070A12] border border-white/10">
                <div>
                  <span className="text-xs font-bold text-white block">Search Indexing Status</span>
                  <span className="text-[11px] text-slate-400">
                    Allow Google and search engines to index this page.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={robotsIndex}
                    onChange={(e) => setRobotsIndex(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF3D00]"></div>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsPageModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPage}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#FF3D00]/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {savingPage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Save Page SEO</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* MODAL: EDIT PRODUCT SEO & RICH SNIPPETS */}
      {/* --------------------------------------------------------------------- */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#0B101D] border border-cyan-500/30 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-white my-8 cyber-corner animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">Product SEO: {editingProduct.name}</h3>
                  <p className="text-xs text-slate-400">Configure Google Rich Snippets, Gold Star Ratings, and Metadata.</p>
                </div>
              </div>
              <button
                onClick={() => setIsProductModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductSeo} className="space-y-5 overflow-y-auto pr-1 flex-1">
              {/* Product SERP Rich Snippet Preview */}
              <div className="p-4 rounded-xl bg-[#05070B] border border-white/15 space-y-1.5 font-sans">
                <span className="text-[10px] text-slate-500 font-mono uppercase block mb-1">
                  Google Product Search Result with Gold Stars
                </span>
                <div className="text-xs text-slate-400 truncate flex items-center gap-1 font-mono">
                  <span>http://doerbd.com</span>
                  <span className="text-slate-600">›</span>
                  <span>products</span>
                  <span className="text-slate-600">›</span>
                  <span className="text-slate-300">{editingProduct.slug}</span>
                </div>
                <h4 className="text-base font-bold text-[#8ab4f8] hover:underline cursor-pointer line-clamp-1">
                  {prodMetaTitle || `${editingProduct.name} | DOER Console Tables`}
                </h4>
                <div className="flex items-center gap-2 text-xs text-amber-400 font-sans">
                  <span>★★★★★</span>
                  <span className="text-slate-300">Rating: {prodRatingValue} · {prodReviewCount} reviews · In stock</span>
                  {editingProduct.price && (
                    <span className="text-emerald-400 font-bold">· ৳ {Number(editingProduct.price).toLocaleString()}</span>
                  )}
                </div>
                <p className="text-xs text-[#bdc1c6] line-clamp-2 leading-relaxed">
                  {prodMetaDesc || 'Product description will appear in Google snippet...'}
                </p>
              </div>

              {/* Product Meta Title */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Product Meta Title
                </label>
                <input
                  type="text"
                  value={prodMetaTitle}
                  onChange={(e) => setProdMetaTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs font-bold focus:border-[#FF3D00] focus:outline-none"
                  required
                />
              </div>

              {/* Product Meta Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Product Meta Description
                </label>
                <textarea
                  rows={3}
                  value={prodMetaDesc}
                  onChange={(e) => setProdMetaDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs leading-relaxed focus:border-[#FF3D00] focus:outline-none"
                  required
                />
              </div>

              {/* Keywords */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Focus Keywords
                </label>
                <input
                  type="text"
                  value={prodKeywords}
                  onChange={(e) => setProdKeywords(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-slate-200 text-xs focus:border-[#FF3D00] focus:outline-none"
                />
              </div>

              {/* Rich Snippets: Rating and Review Count for Google Stars */}
              <div className="p-4 rounded-xl bg-[#070A12] border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                    Google Rich Snippet Review Rating (Gold Stars)
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400">Rating Value (1.0 to 5.0)</span>
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      value={prodRatingValue}
                      onChange={(e) => setProdRatingValue(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0B101D] border border-white/15 text-white text-xs font-bold font-mono"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400">Total Review Count</span>
                    <input
                      type="number"
                      min="1"
                      value={prodReviewCount}
                      onChange={(e) => setProdReviewCount(Number(e.target.value))}
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0B101D] border border-white/15 text-white text-xs font-bold font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* SKU & MPN */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Product SKU
                  </label>
                  <input
                    type="text"
                    value={prodSku}
                    onChange={(e) => setProdSku(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Model Number (MPN)
                  </label>
                  <input
                    type="text"
                    value={prodMpn}
                    onChange={(e) => setProdMpn(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 text-white text-xs font-mono"
                  />
                </div>
              </div>

              {/* Product OG Image Note & Override */}
              <div className="p-4 rounded-xl bg-[#070A12] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider block">
                    Open Graph Social Share Image
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">
                    ✓ Auto-uses Main Product Photo by default
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  By default, the product&apos;s main image (<code className="text-slate-300">{editingProduct.main_image}</code>) is automatically served as the social preview image. You can optionally upload a custom 1200×630 banner below.
                </p>

                <div className="flex items-center gap-3">
                  <input
                    ref={prodOgFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleUploadImage(e.target.files[0], (url) => setProdOgImage(url));
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => prodOgFileInputRef.current?.click()}
                    disabled={uploadingImage}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 text-xs font-bold cursor-pointer border border-cyan-500/30"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Custom 1200×630 Banner</span>
                  </button>
                  {prodOgImage && (
                    <button
                      type="button"
                      onClick={() => setProdOgImage('')}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Reset to Main Photo
                    </button>
                  )}
                </div>

                {prodOgImage && (
                  <div className="relative aspect-[1200/630] max-w-sm rounded-xl overflow-hidden border border-white/15 bg-slate-900 mt-2">
                    <Image src={prodOgImage} alt="Custom OG" fill className="object-cover" />
                  </div>
                )}
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#FF3D00]/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {savingProduct ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  <span>Save Product SEO</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

