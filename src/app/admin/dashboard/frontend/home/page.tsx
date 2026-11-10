'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Sparkles,
  Plus,
  Edit3,
  Trash2,
  ArrowUp,
  ArrowDown,
  Eye,
  Check,
  X,
  AlertCircle,
  Loader2,
  Upload,
  ExternalLink,
  Sliders,
  Image as ImageIcon,
  CheckCircle2,
  RefreshCw,
  FolderTree,
  ShoppingBag,
  Layers,
  ArrowRight,
  Monitor,
} from 'lucide-react';

interface CategoryOption {
  id: number;
  name: string;
  slug: string;
  product_count?: number;
}

interface HeroSlide {
  id: number;
  tag: string;
  titleLight: string;
  titleHighlight: string;
  description: string;
  image: string;
  primaryBtnText: string;
  primaryBtnHref: string;
  secondaryBtnText: string;
  secondaryBtnHref: string;
  displayOrder: number;
  isActive: number;
  createdAt?: string;
  updatedAt?: string;
}

interface AdminCategorySection {
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
  productCount: number;
  createdAt?: string;
  updatedAt?: string;
}

export default function AdminFrontendHomePage() {
  const [activeTab, setActiveTab] = useState<'hero' | 'categories'>('hero');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [categories, setCategories] = useState<CategoryOption[]>([]);

  // ---------------------------------------------------------------------------
  // TAB 1: HERO SLIDER STATE & LOGIC
  // ---------------------------------------------------------------------------
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [heroLoading, setHeroLoading] = useState(true);
  const [heroActionLoading, setHeroActionLoading] = useState(false);

  // Hero Edit / Create Modal State
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);

  // Hero Form Fields
  const [tag, setTag] = useState('');
  const [titleLight, setTitleLight] = useState('');
  const [titleHighlight, setTitleHighlight] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [primaryBtnText, setPrimaryBtnText] = useState('Explore Console Tables');
  const [primaryBtnHref, setPrimaryBtnHref] = useState('/products');
  const [secondaryBtnText, setSecondaryBtnText] = useState('Design Your Control Room');
  const [secondaryBtnHref, setSecondaryBtnHref] = useState('/contact');
  const [isActiveHero, setIsActiveHero] = useState(true);
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');

  // Hero Image Upload State
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageDragOver, setImageDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Hero Delete Confirmation State
  const [deletingHeroId, setDeletingHeroId] = useState<number | null>(null);

  // ---------------------------------------------------------------------------
  // TAB 2: CATEGORY SHOWCASE SECTIONS STATE & LOGIC
  // ---------------------------------------------------------------------------
  const [categorySections, setCategorySections] = useState<AdminCategorySection[]>([]);
  const [sectionsLoading, setSectionsLoading] = useState(true);
  const [sectionActionLoading, setSectionActionLoading] = useState(false);

  // Section Edit / Create Modal State
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<AdminCategorySection | null>(null);
  const [deletingSectionId, setDeletingSectionId] = useState<number | null>(null);

  // Section Form Fields
  const [secCategoryId, setSecCategoryId] = useState<number | ''>('');
  const [secBadge, setSecBadge] = useState('Featured Product Category');
  const [secTitlePrefix, setSecTitlePrefix] = useState('High-Performance');
  const [secTitleHighlight, setSecTitleHighlight] = useState('Console Tables');
  const [secTitleSuffix, setSecTitleSuffix] = useState('& Command Workstations');
  const [secSubtitle, setSecSubtitle] = useState('');
  const [secExploreButtonText, setSecExploreButtonText] = useState('Explore All Console Tables');
  const [secIsActive, setSecIsActive] = useState(true);

  // ---------------------------------------------------------------------------
  // DATA FETCHING
  // ---------------------------------------------------------------------------
  const fetchSlides = async () => {
    try {
      setHeroLoading(true);
      const res = await fetch('/api/admin/frontend/hero-slides');
      if (res.ok) {
        const data = await res.json();
        setSlides(data.slides || []);
      } else {
        setFeedback({ type: 'error', message: 'Failed to load hero slides from database.' });
      }
    } catch (err) {
      console.error('Error fetching slides:', err);
      setFeedback({ type: 'error', message: 'Network error fetching hero slides.' });
    } finally {
      setHeroLoading(false);
    }
  };

  const fetchCategorySections = async () => {
    try {
      setSectionsLoading(true);
      const res = await fetch('/api/admin/frontend/category-sections');
      if (res.ok) {
        const data = await res.json();
        setCategorySections(data.sections || []);
      } else {
        setFeedback({ type: 'error', message: 'Failed to load category sections from database.' });
      }
    } catch (err) {
      console.error('Error fetching category sections:', err);
      setFeedback({ type: 'error', message: 'Network error fetching category sections.' });
    } finally {
      setSectionsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories?active=1');
      if (res.ok) {
        const data = await res.json();
        setCategories(data.categories || []);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  useEffect(() => {
    fetchSlides();
    fetchCategorySections();
    fetchCategories();
  }, []);

  // ---------------------------------------------------------------------------
  // HERO SLIDERS HANDLERS
  // ---------------------------------------------------------------------------
  const handleHeroCategorySelect = (val: string) => {
    setSelectedCategorySlug(val);
    if (val === 'all') {
      setPrimaryBtnHref('/products');
      if (!primaryBtnText.trim() || primaryBtnText.startsWith('Explore')) {
        setPrimaryBtnText('Explore All Products');
      }
    } else if (val === 'custom') {
      // Leave primaryBtnHref as is for manual input
    } else {
      const cat = categories.find((c) => c.slug === val);
      if (cat) {
        setPrimaryBtnHref(`/products?category=${cat.slug}`);
        if (!primaryBtnText.trim() || primaryBtnText.startsWith('Explore')) {
          setPrimaryBtnText(`Explore ${cat.name}`);
        }
      }
    }
  };

  const openCreateHeroModal = () => {
    setEditingSlide(null);
    setTag('Command Center Consoles • Turnkey Control Room Fit-Out');
    setTitleLight('');
    setTitleHighlight('');
    setDescription('');
    setImage('');
    setPrimaryBtnText('Explore Console Tables');
    setPrimaryBtnHref('/products');
    setSelectedCategorySlug('all');
    setSecondaryBtnText('Design Your Control Room');
    setSecondaryBtnHref('/contact');
    setIsActiveHero(true);
    setIsHeroModalOpen(true);
  };

  const openEditHeroModal = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setTag(slide.tag || '');
    setTitleLight(slide.titleLight || '');
    setTitleHighlight(slide.titleHighlight || '');
    setDescription(slide.description || '');
    setImage(slide.image || '');
    setPrimaryBtnText(slide.primaryBtnText || '');
    const href = slide.primaryBtnHref || '';
    setPrimaryBtnHref(href);

    if (href === '/products' || href === '/products/') {
      setSelectedCategorySlug('all');
    } else if (href.startsWith('/products?category=')) {
      const catSlug = href.replace('/products?category=', '').trim();
      setSelectedCategorySlug(catSlug);
    } else {
      setSelectedCategorySlug('custom');
    }

    setSecondaryBtnText(slide.secondaryBtnText || '');
    setSecondaryBtnHref(slide.secondaryBtnHref || '');
    setIsActiveHero(Boolean(slide.isActive));
    setIsHeroModalOpen(true);
  };

  const handleFileUpload = async (file: File) => {
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
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload background image.');
      }

      const uploadedUrl = data.url || (data.urls && data.urls[0]);
      if (uploadedUrl) {
        setImage(uploadedUrl);
        setFeedback({ type: 'success', message: 'Background image uploaded successfully.' });
      }
    } catch (err: any) {
      console.error('Upload error:', err);
      setFeedback({ type: 'error', message: err.message || 'Image upload failed.' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSaveHeroSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleLight.trim() && !titleHighlight.trim()) {
      setFeedback({ type: 'error', message: 'Please enter a slide title (White Bold text or Glowing Highlight).' });
      return;
    }
    if (!image.trim()) {
      setFeedback({ type: 'error', message: 'Please provide or upload a background image.' });
      return;
    }

    try {
      setHeroActionLoading(true);
      const payload = {
        tag: tag.trim(),
        titleLight: titleLight.trim(),
        titleHighlight: titleHighlight.trim(),
        description: description.trim(),
        image: image.trim(),
        primaryBtnText: primaryBtnText.trim(),
        primaryBtnHref: primaryBtnHref.trim(),
        secondaryBtnText: secondaryBtnText.trim(),
        secondaryBtnHref: secondaryBtnHref.trim(),
        isActive: isActiveHero ? 1 : 0,
      };

      let res: Response;
      if (editingSlide) {
        res = await fetch(`/api/admin/frontend/hero-slides/${editingSlide.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/frontend/hero-slides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save slide.');
      }

      setFeedback({
        type: 'success',
        message: editingSlide ? 'Hero slide updated successfully!' : 'New hero slide added successfully!',
      });
      setIsHeroModalOpen(false);
      fetchSlides();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error saving hero slide.' });
    } finally {
      setHeroActionLoading(false);
    }
  };

  const handleToggleHeroActive = async (slide: HeroSlide) => {
    try {
      const newStatus = slide.isActive ? 0 : 1;
      const res = await fetch(`/api/admin/frontend/hero-slides/${slide.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toggleActive: true, isActive: newStatus }),
      });
      if (res.ok) {
        setSlides((prev) =>
          prev.map((s) => (s.id === slide.id ? { ...s, isActive: newStatus } : s))
        );
        setFeedback({
          type: 'success',
          message: `Slide #${slide.id} is now ${newStatus ? 'Published / Active' : 'Draft / Hidden'}.`,
        });
      }
    } catch (err) {
      console.error('Error toggling hero status:', err);
    }
  };

  const handleDeleteHeroSlide = async () => {
    if (!deletingHeroId) return;
    try {
      setHeroActionLoading(true);
      const res = await fetch(`/api/admin/frontend/hero-slides/${deletingHeroId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setFeedback({ type: 'success', message: 'Hero slide removed.' });
        setSlides((prev) => prev.filter((s) => s.id !== deletingHeroId));
      } else {
        const data = await res.json();
        setFeedback({ type: 'error', message: data.error || 'Failed to delete slide.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error deleting slide.' });
    } finally {
      setHeroActionLoading(false);
      setDeletingHeroId(null);
    }
  };

  const handleMoveHeroSlide = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= slides.length) return;

    const newSlides = [...slides];
    const [moved] = newSlides.splice(index, 1);
    newSlides.splice(targetIndex, 0, moved);

    const reorderedItems = newSlides.map((item, idx) => ({
      id: item.id,
      displayOrder: idx + 1,
    }));

    setSlides(newSlides);

    try {
      await fetch('/api/admin/frontend/hero-slides/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: reorderedItems }),
      });
      setFeedback({ type: 'success', message: 'Slide order updated.' });
    } catch (err) {
      console.error('Error saving slide order:', err);
      fetchSlides();
    }
  };

  // ---------------------------------------------------------------------------
  // CATEGORY SHOWCASE SECTIONS HANDLERS
  // ---------------------------------------------------------------------------
  const handleSecCategoryChange = (catId: number) => {
    setSecCategoryId(catId);
    const cat = categories.find((c) => c.id === catId);
    if (cat) {
      // Auto-suggest button text if empty or standard
      if (!secExploreButtonText.trim() || secExploreButtonText.startsWith('Explore All')) {
        setSecExploreButtonText(`Explore All ${cat.name}`);
      }
      // Auto-suggest title highlight if creating new
      if (!editingSection && (!secTitleHighlight.trim() || secTitleHighlight === 'Console Tables')) {
        setSecTitleHighlight(cat.name);
      }
    }
  };

  const openCreateSectionModal = () => {
    setEditingSection(null);
    const initialCatId = categories.length > 0 ? categories[0].id : '';
    setSecCategoryId(initialCatId);
    setSecBadge('Featured Product Category');
    setSecTitlePrefix('High-Performance');
    const initialCat = categories.find((c) => c.id === initialCatId);
    setSecTitleHighlight(initialCat ? initialCat.name : 'Console Tables');
    setSecTitleSuffix('& Command Workstations');
    setSecSubtitle(
      'Heavy-duty 24/7 mission-critical console tables, multi-monitor command desks, and modular control stations manufactured under one roof at our Khilkhet facility.'
    );
    setSecExploreButtonText(initialCat ? `Explore All ${initialCat.name}` : 'Explore All Console Tables');
    setSecIsActive(true);
    setIsSectionModalOpen(true);
  };

  const openEditSectionModal = (sec: AdminCategorySection) => {
    setEditingSection(sec);
    setSecCategoryId(sec.categoryId);
    setSecBadge(sec.badge || 'Featured Product Category');
    setSecTitlePrefix(sec.titlePrefix || '');
    setSecTitleHighlight(sec.titleHighlight || '');
    setSecTitleSuffix(sec.titleSuffix || '');
    setSecSubtitle(sec.subtitle || '');
    setSecExploreButtonText(sec.exploreButtonText || 'Explore All Products');
    setSecIsActive(Boolean(sec.isActive));
    setIsSectionModalOpen(true);
  };

  const handleSaveCategorySection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!secCategoryId) {
      setFeedback({ type: 'error', message: 'Please select a valid product category.' });
      return;
    }
    if (!secTitlePrefix.trim() && !secTitleHighlight.trim()) {
      setFeedback({ type: 'error', message: 'Section heading title is required.' });
      return;
    }

    try {
      setSectionActionLoading(true);
      const payload = {
        categoryId: Number(secCategoryId),
        badge: secBadge.trim(),
        titlePrefix: secTitlePrefix.trim(),
        titleHighlight: secTitleHighlight.trim(),
        titleSuffix: secTitleSuffix.trim(),
        subtitle: secSubtitle.trim(),
        exploreButtonText: secExploreButtonText.trim(),
        isActive: secIsActive ? 1 : 0,
      };

      let res: Response;
      if (editingSection) {
        res = await fetch(`/api/admin/frontend/category-sections/${editingSection.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch('/api/admin/frontend/category-sections', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save category section.');
      }

      setFeedback({
        type: 'success',
        message: editingSection
          ? 'Category showcase section updated successfully!'
          : 'New category showcase section added successfully!',
      });
      setIsSectionModalOpen(false);
      fetchCategorySections();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error saving category section.' });
    } finally {
      setSectionActionLoading(false);
    }
  };

  const handleToggleSectionActive = async (sec: AdminCategorySection) => {
    try {
      const newStatus = sec.isActive ? 0 : 1;
      const res = await fetch(`/api/admin/frontend/category-sections/${sec.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toggleActive: true, isActive: newStatus }),
      });
      if (res.ok) {
        setCategorySections((prev) =>
          prev.map((s) => (s.id === sec.id ? { ...s, isActive: newStatus } : s))
        );
        setFeedback({
          type: 'success',
          message: `Category section #${sec.id} is now ${newStatus ? 'Published / Active' : 'Draft / Hidden'}.`,
        });
      }
    } catch (err) {
      console.error('Error toggling category section status:', err);
    }
  };

  const handleDeleteCategorySection = async () => {
    if (!deletingSectionId) return;
    try {
      setSectionActionLoading(true);
      const res = await fetch(`/api/admin/frontend/category-sections/${deletingSectionId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setFeedback({ type: 'success', message: 'Category showcase section removed.' });
        setCategorySections((prev) => prev.filter((s) => s.id !== deletingSectionId));
      } else {
        const data = await res.json();
        setFeedback({ type: 'error', message: data.error || 'Failed to delete section.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Error deleting category section.' });
    } finally {
      setSectionActionLoading(false);
      setDeletingSectionId(null);
    }
  };

  const handleMoveCategorySection = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= categorySections.length) return;

    const newSections = [...categorySections];
    const [moved] = newSections.splice(index, 1);
    newSections.splice(targetIndex, 0, moved);

    const reorderedItems = newSections.map((item, idx) => ({
      id: item.id,
      displayOrder: idx + 1,
    }));

    setCategorySections(newSections);

    try {
      await fetch('/api/admin/frontend/category-sections/reorder', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: reorderedItems }),
      });
      setFeedback({ type: 'success', message: 'Category section order updated.' });
    } catch (err) {
      console.error('Error saving section order:', err);
      fetchCategorySections();
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] text-[10px] font-bold uppercase tracking-wider">
              Frontend Customization
            </span>
            <span className="text-xs text-slate-400 font-mono">/ Home Page</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
            <Monitor className="w-7 h-7 text-[#FF3D00]" />
            <span>Home Page Content Manager</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Customize and arrange dynamic homepage components — Hero Slider and Category Showcase Sections.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#0E1526] hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white text-xs font-bold uppercase transition-all"
          >
            <span>Live Home</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#FF3D00]" />
          </Link>

          {activeTab === 'hero' ? (
            <button
              onClick={openCreateHeroModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#FF3D00]/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Slide</span>
            </button>
          ) : (
            <button
              onClick={openCreateSectionModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#FF3D00]/25 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category Section</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-white/10 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'hero'
              ? 'border-[#FF3D00] text-white bg-white/[0.04]'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.01]'
          }`}
        >
          <Sliders className="w-4 h-4 text-[#FF3D00]" />
          <span>Hero Slider</span>
          <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-slate-300 font-mono">
            {slides.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('categories')}
          className={`flex items-center gap-2 px-5 py-3 border-b-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'categories'
              ? 'border-[#FF3D00] text-white bg-white/[0.04]'
              : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.01]'
          }`}
        >
          <FolderTree className="w-4 h-4 text-[#FF3D00]" />
          <span>Category Showcase Sections</span>
          <span className="ml-1.5 px-2 py-0.5 rounded-full text-[10px] bg-white/10 text-slate-300 font-mono">
            {categorySections.length}
          </span>
        </button>
      </div>

      {/* Feedback Toast */}
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
      {/* TAB 1: HERO SLIDER CONTENT */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'hero' && (
        <div className="space-y-6">
          {/* Preferred Image Size Specs Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0B101D] border border-cyan-500/30 shadow-lg cyber-corner flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Preferred Background Image Specs</span>
                  <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono uppercase">
                    16:9 Landscape
                  </span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Recommended: <strong className="text-white font-mono">1920 × 1080 px</strong> or <strong className="text-white font-mono">2560 × 1440 px</strong>. High-contrast dark backgrounds ensure maximum legibility for white text and orange neon highlights.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 shrink-0">
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">JPG / WebP / PNG</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">Max 5MB</span>
            </div>
          </div>

          {/* Hero Slides List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white uppercase tracking-wider text-xs">
                  Configured Hero Slides ({slides.length})
                </h3>
                <span className="text-[11px] text-slate-400">
                  • Changes appear instantly on the live storefront
                </span>
              </div>
              <button
                onClick={fetchSlides}
                disabled={heroLoading}
                className="p-1.5 rounded-lg bg-[#0E1526] hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Refresh Slides"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${heroLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {heroLoading ? (
              <div className="py-20 text-center space-y-3 bg-[#080C16] rounded-2xl border border-white/10">
                <Loader2 className="w-8 h-8 animate-spin text-[#FF3D00] mx-auto" />
                <p className="text-xs text-slate-400 font-mono">Loading hero slides from database...</p>
              </div>
            ) : slides.length === 0 ? (
              <div className="py-16 text-center space-y-4 bg-[#080C16] rounded-2xl border border-dashed border-white/15 p-6">
                <div className="w-12 h-12 rounded-full bg-white/5 text-slate-400 flex items-center justify-center mx-auto">
                  <Sliders className="w-6 h-6 text-slate-500" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">No Hero Slides Found</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    Click &ldquo;Add New Slide&rdquo; to create your first dynamic slide with custom titles, images, and CTA links.
                  </p>
                </div>
                <button
                  onClick={openCreateHeroModal}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Slide</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      slide.isActive
                        ? 'bg-[#0B101D] border-white/15 hover:border-cyan-500/40 shadow-md'
                        : 'bg-[#080C16]/60 border-white/5 opacity-75'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                      {/* Slide Preview & Thumbnail */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        <div className="relative w-28 sm:w-36 h-20 rounded-xl overflow-hidden border border-white/15 shrink-0 bg-slate-900 shadow-inner group">
                          <Image
                            src={slide.image || '/images/hero-slider-one.jpg'}
                            alt={slide.titleLight || 'Slide'}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                          <span className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold text-white">
                            #{index + 1}
                          </span>
                        </div>

                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-[#FF3D00]/15 text-[#FF3D00] text-[10px] font-bold uppercase tracking-wider border border-[#FF3D00]/30 truncate max-w-[280px]">
                              {slide.tag || 'Slide Tag'}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                slide.isActive
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-slate-700/30 text-slate-400 border border-white/10'
                              }`}
                            >
                              {slide.isActive ? 'Active' : 'Draft'}
                            </span>
                          </div>

                          <h4 className="text-sm sm:text-base font-black text-white leading-snug truncate">
                            <span>{slide.titleLight} </span>
                            <span className="text-[#FF3D00]">{slide.titleHighlight}</span>
                          </h4>

                          <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">
                            {slide.description}
                          </p>

                          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                            <span className="inline-flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#FF3D00]" />
                              <strong className="text-slate-300">Primary:</strong> {slide.primaryBtnText} →{' '}
                              <code className="text-[#FF3D00]">{slide.primaryBtnHref}</code>
                            </span>
                            {slide.secondaryBtnText && (
                              <span className="inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                <strong className="text-slate-300">Secondary:</strong> {slide.secondaryBtnText} →{' '}
                                <code className="text-cyan-400">{slide.secondaryBtnHref}</code>
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                        {/* Reorder Arrows */}
                        <div className="flex items-center rounded-xl bg-[#080C16] border border-white/10 p-0.5">
                          <button
                            onClick={() => handleMoveHeroSlide(index, 'up')}
                            disabled={index === 0}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 hover:bg-white/5 transition-all cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMoveHeroSlide(index, 'down')}
                            disabled={index === slides.length - 1}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 hover:bg-white/5 transition-all cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Active Toggle Switch */}
                        <button
                          onClick={() => handleToggleHeroActive(slide)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            slide.isActive
                              ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/10'
                          }`}
                        >
                          {slide.isActive ? 'Active' : 'Draft'}
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => openEditHeroModal(slide)}
                          className="p-2 rounded-xl bg-[#0E1526] hover:bg-[#FF3D00] text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
                          title="Edit Slide"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeletingHeroId(slide.id)}
                          className="p-2 rounded-xl bg-[#0E1526] hover:bg-red-500 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
                          title="Delete Slide"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* TAB 2: CATEGORY SHOWCASE SECTIONS CONTENT */}
      {/* --------------------------------------------------------------------- */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          {/* Info Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#0B101D] border border-cyan-500/30 shadow-lg cyber-corner flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] flex items-center justify-center shrink-0 mt-0.5">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Dynamic Product Category Showcase</span>
                  <span className="px-2 py-0.5 rounded-full bg-[#FF3D00]/20 text-[#FF3D00] text-[10px] font-mono uppercase font-bold">
                    Latest 4 Products Auto-Queried
                  </span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Each section connects directly to a store category. The homepage will strictly query and render the <strong className="text-white font-mono">latest 4 published products</strong> of that category with identical shop card styling. The &ldquo;Explore&rdquo; button automatically redirects to <code className="text-[#FF3D00] font-mono font-bold">/products?category=[slug]</code>.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 shrink-0">
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">Shop Card Parity</span>
              <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10">Zero Manual Sync</span>
            </div>
          </div>

          {/* Category Sections List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white uppercase tracking-wider text-xs">
                  Configured Category Sections ({categorySections.length})
                </h3>
                <span className="text-[11px] text-slate-400">
                  • Reorder or toggle active status anytime
                </span>
              </div>
              <button
                onClick={fetchCategorySections}
                disabled={sectionsLoading}
                className="p-1.5 rounded-lg bg-[#0E1526] hover:bg-white/10 border border-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                title="Refresh Sections"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${sectionsLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {sectionsLoading ? (
              <div className="py-20 text-center space-y-3 bg-[#080C16] rounded-2xl border border-white/10">
                <Loader2 className="w-8 h-8 animate-spin text-[#FF3D00] mx-auto" />
                <p className="text-xs text-slate-400 font-mono">Loading category sections from database...</p>
              </div>
            ) : categorySections.length === 0 ? (
              <div className="py-16 text-center space-y-4 bg-[#080C16] rounded-2xl border border-dashed border-white/15 p-6">
                <div className="w-12 h-12 rounded-full bg-white/5 text-slate-400 flex items-center justify-center mx-auto">
                  <FolderTree className="w-6 h-6 text-slate-500" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">No Category Sections Configured</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    Click &ldquo;Add Category Section&rdquo; to showcase a product category on the homepage.
                  </p>
                </div>
                <button
                  onClick={openCreateSectionModal}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Create Category Section</span>
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {categorySections.map((sec, index) => (
                  <div
                    key={sec.id}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                      sec.isActive
                        ? 'bg-[#0B101D] border-white/15 hover:border-cyan-500/40 shadow-md'
                        : 'bg-[#080C16]/60 border-white/5 opacity-75'
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                      {/* Section Info */}
                      <div className="flex items-start gap-4 flex-1 min-w-0">
                        {/* Display Order Badge */}
                        <div className="w-12 h-12 rounded-xl bg-[#080C16] border border-white/10 flex flex-col items-center justify-center shrink-0">
                          <span className="text-[10px] uppercase font-mono text-slate-400">Order</span>
                          <span className="text-base font-black text-[#FF3D00]">#{index + 1}</span>
                        </div>

                        <div className="space-y-1.5 flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-[#FF3D00]/15 text-[#FF3D00] text-[10px] font-bold uppercase tracking-wider border border-[#FF3D00]/30">
                              {sec.badge || 'Featured Category'}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-md bg-cyan-500/15 text-cyan-300 text-[10px] font-bold uppercase tracking-wider border border-cyan-500/30 flex items-center gap-1">
                              <ShoppingBag className="w-3 h-3" />
                              <span>Category: {sec.categoryName || `ID: ${sec.categoryId}`}</span>
                            </span>
                            <span className="px-2 py-0.5 rounded-md bg-white/5 text-slate-300 text-[10px] font-mono border border-white/10">
                              {sec.productCount || 0} published products
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                sec.isActive
                                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-slate-700/30 text-slate-400 border border-white/10'
                              }`}
                            >
                              {sec.isActive ? 'Active' : 'Draft'}
                            </span>
                          </div>

                          {/* Section Title */}
                          <h4 className="text-base sm:text-lg font-black text-white leading-snug truncate">
                            {sec.titlePrefix && <span>{sec.titlePrefix} </span>}
                            <span className="text-[#FF3D00]">{sec.titleHighlight}</span>
                            {sec.titleSuffix && <span> {sec.titleSuffix}</span>}
                          </h4>

                          {sec.subtitle && (
                            <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">
                              {sec.subtitle}
                            </p>
                          )}

                          {/* Target Category Route & Button */}
                          <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                            <span className="inline-flex items-center gap-1">
                              <strong className="text-slate-300">Explore Button:</strong>{' '}
                              <span className="text-white font-bold">{sec.exploreButtonText}</span>
                            </span>
                            <span className="text-white/20">|</span>
                            <span className="inline-flex items-center gap-1 font-mono">
                              <strong className="text-slate-300">Redirects To:</strong>{' '}
                              <code className="text-[#FF3D00]">
                                /products?category={sec.categorySlug || '...'}
                              </code>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Controls */}
                      <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                        {/* Reorder Arrows */}
                        <div className="flex items-center rounded-xl bg-[#080C16] border border-white/10 p-0.5">
                          <button
                            onClick={() => handleMoveCategorySection(index, 'up')}
                            disabled={index === 0}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 hover:bg-white/5 transition-all cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleMoveCategorySection(index, 'down')}
                            disabled={index === categorySections.length - 1}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 hover:bg-white/5 transition-all cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Active Toggle Switch */}
                        <button
                          onClick={() => handleToggleSectionActive(sec)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                            sec.isActive
                              ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                              : 'bg-white/5 hover:bg-white/10 text-slate-400 border-white/10'
                          }`}
                        >
                          {sec.isActive ? 'Active' : 'Draft'}
                        </button>

                        {/* Edit Button */}
                        <button
                          onClick={() => openEditSectionModal(sec)}
                          className="p-2 rounded-xl bg-[#0E1526] hover:bg-[#FF3D00] text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
                          title="Edit Category Section"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => setDeletingSectionId(sec.id)}
                          className="p-2 rounded-xl bg-[#0E1526] hover:bg-red-500 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
                          title="Delete Category Section"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* MODAL: HERO SLIDE ADD / EDIT */}
      {/* --------------------------------------------------------------------- */}
      {isHeroModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#0B101D] border border-cyan-500/30 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-white my-8 cyber-corner animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] flex items-center justify-center">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    {editingSlide ? 'Edit Hero Slide' : 'Create New Hero Slide'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Control texts, glow styling, background visual, and CTA links.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsHeroModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHeroSlide} className="space-y-5 overflow-y-auto pr-1 flex-1">
              {/* Field 1: Top Tag Pill */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block flex items-center justify-between">
                  <span>Slide Top Tag / Category Pill</span>
                  <span className="text-[10px] text-slate-500 font-mono">Appears in Orange Capsule</span>
                </label>
                <input
                  type="text"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  placeholder="e.g. Command Center Consoles • Turnkey Control Room Fit-Out"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 focus:border-[#FF3D00] focus:outline-none text-white text-xs font-medium"
                />
              </div>

              {/* Field 2 & 3: Two-part Title */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Slide Heading (Two-Part Styling)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400">Part 1: White Bold Text</span>
                    <input
                      type="text"
                      value={titleLight}
                      onChange={(e) => setTitleLight(e.target.value)}
                      placeholder="e.g. Next-Gen Mission Critical"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 focus:border-[#FF3D00] focus:outline-none text-white text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] text-[#FF3D00]">Part 2: Glowing Highlight Text</span>
                    <input
                      type="text"
                      value={titleHighlight}
                      onChange={(e) => setTitleHighlight(e.target.value)}
                      placeholder="e.g. Control Room Consoles"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-[#FF3D00]/40 focus:border-[#FF3D00] focus:outline-none text-[#FF3D00] text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Title Live Preview */}
                <div className="p-3 rounded-xl bg-[#05070B] border border-white/10 text-xs">
                  <span className="text-[10px] text-slate-500 font-mono block mb-1">Heading Live Preview:</span>
                  <div className="text-base sm:text-lg font-black tracking-tight leading-snug">
                    <span className="text-white">{titleLight || 'Your White Headline'} </span>
                    <span className="text-[#FF3D00] drop-shadow-[0_0_12px_rgba(255,61,0,0.6)]">
                      {titleHighlight || 'Your Glowing Highlight'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Field 4: Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Slide Description / Subtitle
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. Precision-engineered ergonomic modular control room workstations, motorized height-adjustable console tables..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 focus:border-[#FF3D00] focus:outline-none text-white text-xs leading-relaxed"
                />
              </div>

              {/* Field 5: Background Image Upload & URL */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                    Background Visual
                  </label>
                  <span className="text-[10px] text-cyan-400 font-mono">Recommended: 1920×1080 px</span>
                </div>

                {/* Dropzone */}
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setImageDragOver(true);
                  }}
                  onDragLeave={() => setImageDragOver(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setImageDragOver(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleFileUpload(e.dataTransfer.files[0]);
                    }
                  }}
                  className={`p-4 rounded-xl border-2 border-dashed transition-all text-center flex flex-col items-center justify-center gap-2 ${
                    imageDragOver
                      ? 'border-[#FF3D00] bg-[#FF3D00]/10'
                      : 'border-white/15 hover:border-cyan-500/40 bg-[#070A12]'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleFileUpload(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                  />
                  {uploadingImage ? (
                    <div className="py-2 flex items-center gap-2 text-xs text-[#FF3D00]">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Uploading high-resolution background image...</span>
                    </div>
                  ) : (
                    <>
                      <div className="w-10 h-10 rounded-xl bg-white/5 text-slate-400 flex items-center justify-center">
                        <Upload className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div className="text-xs text-slate-300">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="text-[#FF3D00] font-bold hover:underline cursor-pointer"
                        >
                          Click to upload
                        </button>{' '}
                        or drag & drop background image
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono">
                        PNG, JPG, WebP up to 5MB (16:9 Landscape preferred)
                      </p>
                    </>
                  )}
                </div>

                {/* Or Direct URL Input */}
                <div className="space-y-1">
                  <span className="text-[11px] text-slate-400">Or Image URL / Path</span>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="e.g. /images/hero-slider-one.jpg or https://..."
                    className="w-full px-4 py-2 rounded-xl bg-[#070A12] border border-white/15 focus:border-[#FF3D00] focus:outline-none text-white text-xs font-mono"
                  />
                </div>

                {/* Image Preview */}
                {image && (
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-white/15 bg-slate-900">
                    <Image src={image} alt="Preview" fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-2.5">
                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1 bg-black/80 px-2 py-0.5 rounded">
                        <Check className="w-3 h-3" /> Image Loaded
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Field 6 & 7: Primary CTA Button (With Category Selector) */}
              <div className="p-4 rounded-xl bg-[#070A12] border border-[#FF3D00]/30 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#FF3D00] block flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#FF3D00] animate-pulse" />
                  <span>Primary CTA Button (Orange Solid)</span>
                </span>

                {/* Category Dropdown Option */}
                <div className="space-y-1">
                  <label className="text-[11px] text-slate-300 font-bold block flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <FolderTree className="w-3.5 h-3.5 text-[#FF3D00]" />
                      <span>Select Destination Category (Optional Quick-Link)</span>
                    </span>
                    <span className="text-[10px] text-cyan-400 font-mono">Auto-links & formats</span>
                  </label>
                  <select
                    value={selectedCategorySlug}
                    onChange={(e) => handleHeroCategorySelect(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0B101D] border border-white/15 focus:border-[#FF3D00] focus:outline-none text-white text-xs font-bold cursor-pointer"
                  >
                    <option value="all">★ All Products Collection (/products)</option>
                    {categories.length > 0 && (
                      <optgroup label="Store Categories">
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.slug}>
                            Category: {cat.name} (/products?category={cat.slug})
                          </option>
                        ))}
                      </optgroup>
                    )}
                    <option value="custom">✎ Custom URL / Internal Route...</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400">Button Label</span>
                    <input
                      type="text"
                      value={primaryBtnText}
                      onChange={(e) => setPrimaryBtnText(e.target.value)}
                      placeholder="e.g. Explore Console Tables"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0B101D] border border-white/15 focus:border-[#FF3D00] focus:outline-none text-white text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400">Target Link URL</span>
                    <input
                      type="text"
                      value={primaryBtnHref}
                      onChange={(e) => {
                        setPrimaryBtnHref(e.target.value);
                        setSelectedCategorySlug('custom');
                      }}
                      placeholder="e.g. /products?category=control-room-consoles"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0B101D] border border-white/15 focus:border-[#FF3D00] focus:outline-none text-slate-200 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Field 8 & 9: Secondary CTA Button */}
              <div className="p-4 rounded-xl bg-[#070A12] border border-white/10 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span>Secondary CTA Button (Glass Outline)</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400">Button Label</span>
                    <input
                      type="text"
                      value={secondaryBtnText}
                      onChange={(e) => setSecondaryBtnText(e.target.value)}
                      placeholder="e.g. Design Your Control Room"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0B101D] border border-white/15 focus:border-[#FF3D00] focus:outline-none text-white text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400">Target Link URL</span>
                    <input
                      type="text"
                      value={secondaryBtnHref}
                      onChange={(e) => setSecondaryBtnHref(e.target.value)}
                      placeholder="e.g. /contact or #materials"
                      className="w-full px-3.5 py-2 rounded-xl bg-[#0B101D] border border-white/15 focus:border-[#FF3D00] focus:outline-none text-slate-200 text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Field 10: Active Status Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#070A12] border border-white/10">
                <div>
                  <span className="text-xs font-bold text-white block">Publish Slide Status</span>
                  <span className="text-[11px] text-slate-400">
                    When active, this slide appears in the homepage carousel loop.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActiveHero}
                    onChange={(e) => setIsActiveHero(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF3D00]"></div>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsHeroModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold uppercase transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={heroActionLoading || uploadingImage}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#FF3D00]/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {heroActionLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Slide...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{editingSlide ? 'Save Slide Changes' : 'Create Slide'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* MODAL: CATEGORY SHOWCASE SECTION ADD / EDIT */}
      {/* --------------------------------------------------------------------- */}
      {isSectionModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#0B101D] border border-cyan-500/30 rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6 text-white my-8 cyber-corner animate-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] flex items-center justify-center">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    {editingSection ? 'Edit Category Showcase Section' : 'Create Category Showcase Section'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Connect a product category to display its latest 4 products dynamically on the homepage.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsSectionModalOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCategorySection} className="space-y-5 overflow-y-auto pr-1 flex-1">
              {/* Field 1: Category Selector Dropdown */}
              <div className="p-4 rounded-xl bg-[#070A12] border border-[#FF3D00]/30 space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#FF3D00] block flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FolderTree className="w-4 h-4" />
                    <span>Select Product Category (Source)</span>
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono">Required</span>
                </label>
                <select
                  value={secCategoryId}
                  onChange={(e) => handleSecCategoryChange(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B101D] border border-white/20 focus:border-[#FF3D00] focus:outline-none text-white text-xs font-bold cursor-pointer"
                  required
                >
                  <option value="" disabled>-- Select a Product Category --</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.slug}) {cat.product_count !== undefined ? `— ${cat.product_count} products` : ''}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-400">
                  Selecting a category will automatically pull its latest 4 published products and link the &ldquo;Explore&rdquo; button directly to its filter page.
                </p>
              </div>

              {/* Field 2: Section Badge */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block flex items-center justify-between">
                  <span>Section Badge Pill</span>
                  <span className="text-[10px] text-slate-500 font-mono">Appears in Orange Capsule</span>
                </label>
                <input
                  type="text"
                  value={secBadge}
                  onChange={(e) => setSecBadge(e.target.value)}
                  placeholder="e.g. Featured Product Category"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 focus:border-[#FF3D00] focus:outline-none text-white text-xs font-medium"
                />
              </div>

              {/* Field 3: 3-Part Section Title */}
              <div className="space-y-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Section Heading (Three-Part Cyber Styling)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400">Prefix (White)</span>
                    <input
                      type="text"
                      value={secTitlePrefix}
                      onChange={(e) => setSecTitlePrefix(e.target.value)}
                      placeholder="e.g. High-Performance"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#070A12] border border-white/15 focus:border-[#FF3D00] focus:outline-none text-white text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] text-[#FF3D00]">Highlight (Glowing Orange)</span>
                    <input
                      type="text"
                      value={secTitleHighlight}
                      onChange={(e) => setSecTitleHighlight(e.target.value)}
                      placeholder="e.g. Console Tables"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#070A12] border border-[#FF3D00]/40 focus:border-[#FF3D00] focus:outline-none text-[#FF3D00] text-xs font-bold"
                    />
                  </div>
                  <div className="space-y-1">
                    <span className="text-[11px] text-slate-400">Suffix (White)</span>
                    <input
                      type="text"
                      value={secTitleSuffix}
                      onChange={(e) => setSecTitleSuffix(e.target.value)}
                      placeholder="e.g. & Command Workstations"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#070A12] border border-white/15 focus:border-[#FF3D00] focus:outline-none text-white text-xs font-bold"
                    />
                  </div>
                </div>

                {/* Heading Live Preview */}
                <div className="p-3 rounded-xl bg-[#05070B] border border-white/10 text-xs">
                  <span className="text-[10px] text-slate-500 font-mono block mb-1">Heading Live Preview:</span>
                  <div className="text-base sm:text-lg font-black tracking-tight leading-snug">
                    {secTitlePrefix && <span className="text-white">{secTitlePrefix} </span>}
                    <span className="text-[#FF3D00] drop-shadow-[0_0_12px_rgba(255,61,0,0.6)]">
                      {secTitleHighlight || 'Highlight'}
                    </span>
                    {secTitleSuffix && <span className="text-white"> {secTitleSuffix}</span>}
                  </div>
                </div>
              </div>

              {/* Field 4: Subtitle */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Section Subtitle / Description
                </label>
                <textarea
                  rows={3}
                  value={secSubtitle}
                  onChange={(e) => setSecSubtitle(e.target.value)}
                  placeholder="e.g. Heavy-duty 24/7 mission-critical console tables, multi-monitor command desks..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 focus:border-[#FF3D00] focus:outline-none text-white text-xs leading-relaxed"
                />
              </div>

              {/* Field 5: Explore Button Label */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300 block flex items-center justify-between">
                  <span>Explore Button Text</span>
                  <span className="text-[10px] text-cyan-400 font-mono">Redirects to category page</span>
                </label>
                <input
                  type="text"
                  value={secExploreButtonText}
                  onChange={(e) => setSecExploreButtonText(e.target.value)}
                  placeholder="e.g. Explore All Console Tables"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#070A12] border border-white/15 focus:border-[#FF3D00] focus:outline-none text-white text-xs font-bold"
                />
                {secCategoryId && (
                  <p className="text-[10px] text-slate-400 font-mono">
                    Target URL: /products?category=
                    <strong className="text-[#FF3D00]">
                      {categories.find((c) => c.id === Number(secCategoryId))?.slug || '...'}
                    </strong>
                  </p>
                )}
              </div>

              {/* Field 6: Active Status Toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-[#070A12] border border-white/10">
                <div>
                  <span className="text-xs font-bold text-white block">Publish Section Status</span>
                  <span className="text-[11px] text-slate-400">
                    When active, this showcase section appears on the homepage with its latest 4 products.
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={secIsActive}
                    onChange={(e) => setSecIsActive(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF3D00]"></div>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsSectionModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-bold uppercase transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={sectionActionLoading}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider shadow-lg shadow-[#FF3D00]/30 transition-all cursor-pointer disabled:opacity-50"
                >
                  {sectionActionLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving Section...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>{editingSection ? 'Save Section Changes' : 'Create Section'}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --------------------------------------------------------------------- */}
      {/* DELETE CONFIRMATION MODALS */}
      {/* --------------------------------------------------------------------- */}
      {/* Hero Slide Delete Confirmation Modal */}
      {deletingHeroId !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0B101D] border border-red-500/30 rounded-2xl shadow-2xl p-6 space-y-4 text-white cyber-corner animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Hero Slide?</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently remove this slide from the homepage carousel?
            </p>
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingHeroId(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={heroActionLoading}
                onClick={handleDeleteHeroSlide}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                {heroActionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Delete Slide</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Category Section Delete Confirmation Modal */}
      {deletingSectionId !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#0B101D] border border-red-500/30 rounded-2xl shadow-2xl p-6 space-y-4 text-white cyber-corner animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 text-red-400">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Category Section?</h3>
                <p className="text-xs text-slate-400">This action cannot be undone.</p>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to permanently remove this category showcase section from the homepage? The underlying products and category will remain intact.
            </p>
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeletingSectionId(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold uppercase transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={sectionActionLoading}
                onClick={handleDeleteCategorySection}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                {sectionActionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                <span>Delete Section</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
