'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCyberDialog } from '@/components/ui/CyberDialog';
import {
  Package,
  Plus,
  Search,
  Edit3,
  Trash2,
  ExternalLink,
  Upload,
  Video,
  Youtube,
  X,
  Check,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
  PhoneCall,
  Tag,
  Sparkles,
} from 'lucide-react';
import RichTextEditor, { stripHtml } from '@/components/admin/RichTextEditor';

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface ProductItem {
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
  status: 'published' | 'draft';
  created_at: string;
}

function toSlug(val: string): string {
  return val
    .toLowerCase()
    .trim()
    .replace(/&/g, '-and-')
    .replace(/[\s\W-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function extractYouTubeId(input: string): string | null {
  if (!input) return null;
  const trimmed = input.trim();
  const iframeSrcMatch = trimmed.match(/src=["']([^"']+)["']/i);
  const target = iframeSrcMatch ? iframeSrcMatch[1] : trimmed;

  const regExp =
    /(?:youtube(?:-nocookie)?\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?|shorts|live)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/i;
  const match = target.match(regExp);
  if (match && match[1]) {
    return match[1];
  }
  if (/^[a-zA-Z0-9_-]{11}$/.test(target)) {
    return target;
  }
  return null;
}

export default function AdminProductsPage() {
  const dialog = useCyberDialog();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal / Form State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManuallyEdited, setSlugManuallyEdited] = useState(false);
  const [categoryId, setCategoryId] = useState<string>('');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<string>('');
  const [isCallForPrice, setIsCallForPrice] = useState<boolean>(false);
  const [mainImage, setMainImage] = useState('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [videoType, setVideoType] = useState<'none' | 'upload' | 'youtube'>('none');
  const [videoUrl, setVideoUrl] = useState('');
  const [status, setStatus] = useState<'published' | 'draft'>('published');

  const [uploadingMain, setUploadingMain] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoUploadProgress, setVideoUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products?status=all'),
        fetch('/api/categories'),
      ]);
      if (prodRes.ok) {
        const prodData = await prodRes.json();
        setProducts(prodData.products || []);
      }
      if (catRes.ok) {
        const catData = await catRes.json();
        setCategories(catData.categories || []);
      }
    } catch (err) {
      console.error('Error loading products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showToast = (type: 'success' | 'error', msg: string) => {
    setFeedback({ type, msg });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (!slugManuallyEdited) {
      setSlug(toSlug(val));
    }
  };

  const handleSlugChange = (val: string) => {
    setSlug(val);
    if (val.trim() === '') {
      setSlugManuallyEdited(false);
    } else {
      setSlugManuallyEdited(true);
    }
  };

  const handleRegenerateSlug = () => {
    setSlug(toSlug(name));
    setSlugManuallyEdited(false);
  };

  const openCreateForm = () => {
    setEditingProduct(null);
    setName('');
    setSlug('');
    setSlugManuallyEdited(false);
    setCategoryId(categories[0]?.id ? String(categories[0].id) : '');
    setShortDesc('');
    setDescription('');
    setPrice('');
    setIsCallForPrice(false);
    setMainImage('');
    setGalleryImages([]);
    setVideoType('none');
    setVideoUrl('');
    setStatus('published');
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEditForm = (prod: ProductItem) => {
    setEditingProduct(prod);
    setName(prod.name);
    setSlug(prod.slug);
    // If existing slug matches auto-generated name slug, keep auto-sync active unless manually edited
    setSlugManuallyEdited(prod.slug !== toSlug(prod.name));
    setCategoryId(prod.category_id ? String(prod.category_id) : '');
    setShortDesc(prod.short_description || '');
    setDescription(prod.description || '');
    setPrice(prod.price !== null && prod.price > 0 ? String(prod.price) : '');
    setIsCallForPrice(Boolean(prod.is_call_for_price) || !prod.price);
    setMainImage(prod.main_image || '');
    setGalleryImages(Array.isArray(prod.gallery_images) ? prod.gallery_images : []);
    setVideoType((prod.video_type as any) || 'none');
    setVideoUrl(prod.video_url || '');
    setStatus(prod.status || 'published');
    setIsFormOpen(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Compress large images on the client so photos upload fast and stay crisp
  const compressImageIfNeeded = async (file: File): Promise<{ blob: Blob; fileName: string; mimeType: string }> => {
    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/gif') {
      return { blob: file, fileName: file.name, mimeType: file.type };
    }

    // If image is already under 500KB, no compression needed
    if (file.size <= 500 * 1024) {
      return { blob: file, fileName: file.name, mimeType: file.type };
    }

    return new Promise((resolve) => {
      const img = new window.Image();
      const objectUrl = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        const MAX_DIM = 1600;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({ blob: file, fileName: file.name, mimeType: file.type });
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);

        const outMime = file.type === 'image/png' ? 'image/webp' : 'image/jpeg';
        const outExt = outMime === 'image/webp' ? '.webp' : '.jpg';
        const base = file.name.replace(/\.[^.]+$/, '');

        canvas.toBlob(
          (blob) => {
            if (blob && blob.size < file.size) {
              resolve({ blob, fileName: `${base}${outExt}`, mimeType: outMime });
            } else {
              resolve({ blob: file, fileName: file.name, mimeType: file.type });
            }
          },
          outMime,
          0.86
        );
      };
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        resolve({ blob: file, fileName: file.name, mimeType: file.type });
      };
      img.src = objectUrl;
    });
  };

  // Upload any file (image or video) in 500KB chunks so Nginx 1MB client_max_body_size never blocks it
  const uploadSingleFileSafely = async (
    rawFile: File,
    onProgress?: (pct: number) => void
  ): Promise<string> => {
    const { blob, fileName, mimeType } = await compressImageIfNeeded(rawFile);
    const CHUNK_SIZE = 500 * 1024; // 500 KB per request (safe under default 1MB Nginx limit)
    const totalChunks = Math.max(1, Math.ceil(blob.size / CHUNK_SIZE));

    let targetName = '';
    let finalUrl = '';

    for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
      const start = chunkIndex * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, blob.size);
      const chunkSlice = blob.slice(start, end);

      const formData = new FormData();
      formData.append('chunk', chunkSlice, fileName);
      formData.append('fileName', fileName);
      formData.append('mimeType', mimeType);
      formData.append('chunkIndex', String(chunkIndex));
      formData.append('totalChunks', String(totalChunks));
      if (targetName) {
        formData.append('targetName', targetName);
      }

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const rawText = await res.text();
      let data: any = null;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(
          res.status === 413
            ? 'Server upload limit reached (413). Please try a smaller file.'
            : `Upload error (${res.status}): Server returned an unexpected response.`
        );
      }

      if (!res.ok) {
        throw new Error(data?.error || 'Upload failed');
      }

      targetName = data.targetName || targetName;
      finalUrl = data.url;
      if (onProgress) {
        onProgress(Math.round(((chunkIndex + 1) / totalChunks) * 100));
      }
    }

    return finalUrl;
  };

  // Upload Main Image
  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingMain(true);
      const url = await uploadSingleFileSafely(file);
      setMainImage(url);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to upload main image');
    } finally {
      setUploadingMain(false);
      e.target.value = '';
    }
  };

  // Upload Multiple Gallery Images (Sequential + Chunked to bypass Nginx 1MB limit)
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setUploadingGallery(true);
      const fileList = Array.from(files);
      for (const file of fileList) {
        const uploadedUrl = await uploadSingleFileSafely(file);
        if (uploadedUrl) {
          setGalleryImages((prev) => [...prev, uploadedUrl]);
        }
      }
    } catch (err: any) {
      showToast('error', err.message || 'Failed to upload gallery images');
    } finally {
      setUploadingGallery(false);
      e.target.value = '';
    }
  };

  // Upload Video File (Chunked to bypass Nginx 1MB limit)
  const handleVideoFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingVideo(true);
      setVideoUploadProgress(0);
      const uploadedUrl = await uploadSingleFileSafely(file, (pct) =>
        setVideoUploadProgress(pct)
      );
      setVideoType('upload');
      setVideoUrl(uploadedUrl);
    } catch (err: any) {
      showToast('error', err.message || 'Failed to upload video');
    } finally {
      setUploadingVideo(false);
      setVideoUploadProgress(0);
      e.target.value = '';
    }
  };

  const removeGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('error', 'Product name is required');
      return;
    }
    if (!mainImage.trim()) {
      showToast('error', 'Main product image is required');
      return;
    }

    const finalSlug = slug.trim() ? toSlug(slug) : toSlug(name);

    // Normalize video type & URL (supports YouTube watch, youtu.be, shorts, embed, or <iframe>)
    let resolvedVideoType = videoType;
    let resolvedVideoUrl = videoUrl.trim();
    if (!resolvedVideoUrl || resolvedVideoType === 'none') {
      resolvedVideoType = 'none';
      resolvedVideoUrl = '';
    } else {
      const detectedYtId = extractYouTubeId(resolvedVideoUrl);
      if (resolvedVideoType === 'youtube' || detectedYtId) {
        if (!detectedYtId) {
          showToast('error', 'Please enter a valid YouTube video link.');
          return;
        }
        resolvedVideoType = 'youtube';
        resolvedVideoUrl = `https://www.youtube.com/watch?v=${detectedYtId}`;
      }
    }

    try {
      setSubmitting(true);
      const url = editingProduct
        ? `/api/products/${editingProduct.id}`
        : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      const numericPrice =
        !isCallForPrice && price.trim() !== '' && !isNaN(Number(price)) && Number(price) > 0
          ? Number(price)
          : null;

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          slug: finalSlug,
          category_id: categoryId ? Number(categoryId) : null,
          short_description: shortDesc.trim(),
          description: description.trim(),
          price: numericPrice,
          is_call_for_price: isCallForPrice || numericPrice === null,
          main_image: mainImage.trim(),
          gallery_images: galleryImages,
          video_type: resolvedVideoType,
          video_url: resolvedVideoUrl,
          status,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save product');

      showToast(
        'success',
        editingProduct
          ? `Product "${name}" updated successfully!`
          : `Product "${name}" created successfully!`
      );
      setIsFormOpen(false);
      await fetchData();
    } catch (err: any) {
      showToast('error', err.message || 'Error saving product');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (prod: ProductItem) => {
    const confirmed = await dialog.confirm({
      title: 'Delete Product',
      message: `Are you sure you want to permanently delete "${prod.name}"? All associated gallery images and records will be deleted from the database.`,
      confirmText: 'Delete Product',
      cancelText: 'Cancel',
      type: 'danger',
      badge: 'PRODUCT CATALOG REMOVAL',
    });

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/products/${prod.id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('success', `Product "${prod.name}" deleted.`);
        await fetchData();
      }
    } catch (err) {
      showToast('error', 'Failed to delete product');
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesCategory =
      selectedCategory === 'all' || String(p.category_id) === selectedCategory;
    const matchesSearch =
      !search.trim() ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.short_description || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.category_name || '').toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 sm:pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-[#FF3D00] text-xs font-bold uppercase tracking-wider mb-1">
            <Package className="w-4 h-4" />
            <span>eCommerce • Product Catalog</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-black text-white tracking-tight">
            All Products
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage simple products, main & gallery photos, product videos (file upload or YouTube), and pricing / Call for Price.
          </p>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
          <Link
            href="/products"
            target="_blank"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0B101D] hover:bg-[#0E1526] border border-white/10 text-slate-200 hover:text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg cyber-corner"
          >
            <span>View Shop</span>
            <ExternalLink className="w-4 h-4 text-[#FF3D00]" />
          </Link>

          <button
            onClick={openCreateForm}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,61,0,0.35)] transition-all cursor-pointer active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`p-3.5 sm:p-4 rounded-xl border flex items-center justify-between gap-2 ${
            feedback.type === 'success'
              ? 'bg-[#0B101D] border-emerald-500/40 text-emerald-400'
              : 'bg-[#0B101D] border-red-500/40 text-red-400'
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-medium">
            {feedback.type === 'success' ? (
              <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            )}
            <span>{feedback.msg}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* CREATE / EDIT PRODUCT FORM PANEL */}
      {isFormOpen && (
        <div className="bg-[#0B101D] border border-cyan-500/30 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-2xl space-y-5 sm:space-y-6 cyber-corner">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
            <h2 className="text-base sm:text-xl font-black text-white flex items-center gap-2 min-w-0">
              {editingProduct ? (
                <>
                  <Edit3 className="w-5 h-5 text-[#FF3D00] shrink-0" />
                  <span className="truncate">Edit: {editingProduct.name}</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5 text-[#FF3D00] shrink-0" />
                  <span>Create New Simple Product</span>
                </>
              )}
            </h2>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="p-2 rounded-xl bg-[#0E1526] text-slate-400 hover:text-white hover:bg-white/10 border border-white/10 transition-colors shrink-0"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left 7 Cols: Basic Info & Descriptions */}
              <div className="lg:col-span-7 space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
                  <div>
                    <div className="flex items-center justify-between h-5 mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 whitespace-nowrap">
                        Product Name *
                      </label>
                    </div>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="e.g. HG-B1 Executive Control Console"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1526] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:bg-[#121B30] focus:border-[#FF3D00]"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-2 h-5 mb-1.5">
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 whitespace-nowrap">
                        Product Slug
                      </label>
                      <button
                        type="button"
                        onClick={handleRegenerateSlug}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#FF3D00]/15 hover:bg-[#FF3D00] text-[#FF3D00] hover:text-white border border-[#FF3D00]/30 text-[10px] font-bold whitespace-nowrap shrink-0 transition-colors cursor-pointer"
                        title="Auto-generate slug from Product Name"
                      >
                        <Sparkles className="w-3 h-3 shrink-0" />
                        <span>Auto-Generate</span>
                      </button>
                    </div>
                    <input
                      type="text"
                      value={slug}
                      onChange={(e) => handleSlugChange(e.target.value)}
                      placeholder="hg-b1-executive-control-console"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1526] border border-white/10 text-white font-mono text-xs focus:outline-none focus:bg-[#121B30] focus:border-[#FF3D00]"
                    />
                    <p className="text-[11px] text-slate-400 mt-1 truncate">
                      URL: <code className="text-cyan-400">/products/{slug || toSlug(name) || 'product-slug'}</code>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Product Category *
                    </label>
                    <select
                      value={categoryId}
                      onChange={(e) => setCategoryId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1526] border border-white/10 text-white text-sm focus:outline-none focus:bg-[#121B30] focus:border-[#FF3D00]"
                    >
                      <option value="" className="bg-[#0E1526] text-white">-- Select Category --</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id} className="bg-[#0E1526] text-white">
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Publish Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'published' | 'draft')}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1526] border border-white/10 text-white text-sm focus:outline-none focus:bg-[#121B30] focus:border-[#FF3D00]"
                    >
                      <option value="published" className="bg-[#0E1526] text-white">Published (Visible in Shop)</option>
                      <option value="draft" className="bg-[#0E1526] text-white">Draft (Hidden)</option>
                    </select>
                  </div>
                </div>

                {/* Pricing Box */}
                <div className="p-4 rounded-xl bg-[#0E1526] border border-white/10 space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Product Price (BDT) — Leave empty for &ldquo;Call for Price&rdquo;
                    </label>
                    <label className="inline-flex items-center gap-2 text-xs font-bold text-[#FF3D00] cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isCallForPrice}
                        onChange={(e) => setIsCallForPrice(e.target.checked)}
                        className="rounded border-white/20 bg-[#070A12] text-[#FF3D00] focus:ring-[#FF3D00]"
                      />
                      <span>Call for Price / Ask on WhatsApp</span>
                    </label>
                  </div>

                  {!isCallForPrice ? (
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                        BDT ৳
                      </span>
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. 165000 (Leave blank if Call for Price)"
                        className="w-full pl-16 pr-4 py-2.5 rounded-xl bg-[#070A12] border border-white/10 text-white text-sm focus:outline-none focus:border-[#FF3D00]"
                      />
                    </div>
                  ) : (
                    <div className="text-xs text-slate-300 bg-[#070A12] p-3 rounded-xl border border-white/10 flex items-center gap-2">
                      <PhoneCall className="w-4 h-4 text-[#FF3D00] shrink-0" />
                      <span>
                        Customer will see <strong className="text-white">Call for Price (+8801976535654)</strong>,{' '}
                        <strong className="text-white">Ask Price on WhatsApp</strong>, and <strong className="text-white">Send Query</strong> buttons.
                      </span>
                    </div>
                  )}
                </div>

                {/* Short Description (Rich Text Editor) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Short Description
                  </label>
                  <RichTextEditor
                    value={shortDesc}
                    onChange={setShortDesc}
                    placeholder="Concise summary displayed on product cards and top of single product page..."
                    minHeight="110px"
                    compact
                  />
                </div>

                {/* Full Description (Rich Text Editor) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    Full Product Description & Technical Specifications
                  </label>
                  <RichTextEditor
                    value={description}
                    onChange={setDescription}
                    placeholder="Format detailed product features, bullet points, technical specifications table, dimensions, and warranty info..."
                    minHeight="240px"
                  />
                </div>
              </div>

              {/* Right 5 Cols: Media (Main Image, Gallery Images, Video) */}
              <div className="lg:col-span-5 space-y-5">
                {/* 1. Main Image */}
                <div className="p-4 rounded-xl bg-[#0E1526] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#FF3D00]" />
                      <span>Main Product Image *</span>
                    </label>

                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold cursor-pointer transition-all shadow-[0_0_12px_rgba(255,61,0,0.35)]">
                      {uploadingMain ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>{uploadingMain ? 'Uploading...' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleMainImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  <input
                    type="text"
                    value={mainImage}
                    onChange={(e) => setMainImage(e.target.value)}
                    placeholder="Or paste image path/URL: /images/products/..."
                    className="w-full px-3 py-2 rounded-xl bg-[#070A12] border border-white/10 text-xs text-slate-200 focus:outline-none focus:border-[#FF3D00]"
                  />

                  {mainImage && (
                    <div className="relative aspect-square w-48 sm:w-56 rounded-xl overflow-hidden border border-white/10 bg-[#070A12]">
                      <Image
                        src={mainImage}
                        alt="Main preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* 2. Multiple Gallery Images */}
                <div className="p-4 rounded-xl bg-[#0E1526] border border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      Gallery Images ({galleryImages.length})
                    </label>

                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0B101D] hover:bg-white/10 text-slate-200 text-xs font-bold cursor-pointer border border-white/10 transition-all shadow-sm">
                      {uploadingGallery ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Plus className="w-3.5 h-3.5 text-[#FF3D00]" />
                      )}
                      <span>{uploadingGallery ? 'Uploading...' : 'Add Gallery Photos'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleGalleryUpload}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {galleryImages.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 pt-1">
                      {galleryImages.map((imgUrl, index) => (
                        <div
                          key={`${imgUrl}-${index}`}
                          className="relative group aspect-square w-full rounded-lg overflow-hidden border border-white/10 bg-[#070A12]"
                        >
                          <Image
                            src={imgUrl}
                            alt={`Gallery ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeGalleryImage(index)}
                            className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-600/90 text-white flex items-center justify-center opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity"
                            title="Remove photo"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">
                      Upload multiple gallery photos to auto-slide on the single product page.
                    </p>
                  )}
                </div>

                {/* 3. Product Video (Upload or YouTube Link) */}
                <div className="p-4 rounded-xl bg-[#0E1526] border border-white/10 space-y-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-[#FF3D00]" />
                    <span>Product Video (Auto-Slides in Gallery)</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setVideoType('none');
                        setVideoUrl('');
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        videoType === 'none'
                          ? 'bg-[#FF3D00] text-white border-[#FF3D00] shadow-[0_0_12px_rgba(255,61,0,0.35)]'
                          : 'bg-[#0B101D] text-slate-300 border-white/10 hover:text-white'
                      }`}
                    >
                      No Video
                    </button>

                    <button
                      type="button"
                      onClick={() => setVideoType('upload')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        videoType === 'upload'
                          ? 'bg-[#FF3D00] text-white border-[#FF3D00] shadow-[0_0_12px_rgba(255,61,0,0.35)]'
                          : 'bg-[#0B101D] text-slate-300 border-white/10 hover:text-white'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Video</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setVideoType('youtube')}
                      className={`py-2 px-3 rounded-xl text-xs font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                        videoType === 'youtube'
                          ? 'bg-[#FF3D00] text-white border-[#FF3D00] shadow-[0_0_12px_rgba(255,61,0,0.35)]'
                          : 'bg-[#0B101D] text-slate-300 border-white/10 hover:text-white'
                      }`}
                    >
                      <Youtube className="w-3.5 h-3.5" />
                      <span>YouTube Link</span>
                    </button>
                  </div>

                  {videoType === 'upload' && (
                    <div className="space-y-2.5 pt-1">
                      <label className="w-full py-2.5 px-4 rounded-xl bg-[#070A12] hover:bg-white/5 border border-dashed border-white/20 text-xs font-bold text-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-all">
                        {uploadingVideo ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-[#FF3D00]" />
                            <span>
                              Uploading Video File...{' '}
                              {videoUploadProgress > 0 ? `${videoUploadProgress}%` : ''}
                            </span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-[#FF3D00]" />
                            <span>Select MP4 / WebM Video File</span>
                          </>
                        )}
                        <input
                          type="file"
                          accept="video/mp4,video/webm,video/ogg,video/quicktime"
                          onChange={handleVideoFileUpload}
                          className="hidden"
                        />
                      </label>
                      <input
                        type="text"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="Uploaded video URL: /api/uploads/videos/..."
                        className="w-full px-3 py-2 rounded-xl bg-[#070A12] border border-white/10 text-xs text-slate-200"
                      />
                      {videoUrl && !extractYouTubeId(videoUrl) && (
                        <div className="rounded-xl overflow-hidden border border-white/10 bg-black">
                          <video
                            src={videoUrl}
                            controls
                            playsInline
                            className="w-full max-h-48 object-contain"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {videoType === 'youtube' && (
                    <div className="space-y-2 pt-1">
                      <input
                        type="text"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder="Paste YouTube URL (watch, youtu.be, shorts, or embed link)"
                        className="w-full px-3 py-2.5 rounded-xl bg-[#070A12] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#FF3D00]"
                      />
                      <p className="text-[11px] text-slate-400">
                        Supports standard watch links, shortened youtu.be links, YouTube Shorts, or embed URLs.
                      </p>

                      {videoUrl.trim() && (
                        extractYouTubeId(videoUrl) ? (
                          <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-white/10 bg-black">
                            <iframe
                              src={`https://www.youtube.com/embed/${extractYouTubeId(
                                videoUrl
                              )}?rel=0`}
                              title="YouTube video preview"
                              className="w-full h-full border-0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              referrerPolicy="strict-origin-when-cross-origin"
                              allowFullScreen
                            />
                          </div>
                        ) : (
                          <p className="text-[11px] font-semibold text-amber-400">
                            Could not detect a valid 11-character YouTube Video ID from this link.
                          </p>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2.5 sm:gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-[#0E1526] hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs font-bold uppercase tracking-wider cursor-pointer text-center transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] disabled:opacity-50 text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,61,0,0.35)] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving Product...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{editingProduct ? 'Update Product' : 'Publish Product'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5 sm:gap-4 bg-[#0B101D] border border-white/10 p-3.5 sm:p-4 rounded-2xl shadow-xl cyber-corner">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name, category, or description..."
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-[#0E1526] border border-white/10 text-base sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:bg-[#121B30] focus:ring-1 focus:ring-[#FF3D00] focus:border-[#FF3D00]"
          />
        </div>

        {/* Mobile Category Filter Dropdown */}
        <div className="sm:hidden">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0E1526] border border-white/10 text-xs font-bold text-white focus:outline-none focus:border-[#FF3D00]"
          >
            <option value="all" className="bg-[#0E1526] text-white">Category: All Products ({products.length})</option>
            {categories.map((cat) => (
              <option key={cat.id} value={String(cat.id)} className="bg-[#0E1526] text-white">
                Category: {cat.name}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop Category Filter Pills */}
        <div className="hidden sm:flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#FF3D00] text-white shadow-[0_0_15px_rgba(255,61,0,0.35)]'
                : 'bg-[#0E1526] text-slate-300 hover:text-white border border-white/10'
            }`}
          >
            All ({products.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(String(cat.id))}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === String(cat.id)
                  ? 'bg-[#FF3D00] text-white shadow-[0_0_15px_rgba(255,61,0,0.35)]'
                  : 'bg-[#0E1526] text-slate-300 hover:text-white border border-white/10'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTS TABLE / GRID */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#FF3D00]" />
          <span className="text-sm font-medium">Loading products...</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 text-center bg-[#0B101D] border border-dashed border-white/15 rounded-2xl space-y-3 cyber-corner">
          <Package className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-base font-bold text-white">No products found</p>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Click &ldquo;Add Product&rdquo; above to add a simple product to your catalog.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-[#0B101D] border border-white/10 hover:border-[#FF3D00]/50 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xl hover:shadow-[0_0_20px_rgba(255,61,0,0.2)] group transition-all cyber-corner"
            >
              <div>
                {/* Thumbnail (1:1 Square) */}
                <div className="relative aspect-square w-full bg-[#070A12] overflow-hidden border-b border-white/10">
                  <Image
                    src={prod.main_image}
                    alt={prod.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg bg-[#080C16]/90 backdrop-blur-md border border-white/15 text-[11px] font-bold text-white flex items-center gap-1 shadow-md">
                      <Tag className="w-3 h-3 text-[#FF3D00]" />
                      {prod.category_name || 'Uncategorized'}
                    </span>
                    {prod.video_type !== 'none' && prod.video_url && (
                      <span className="px-2 py-1 rounded-lg bg-[#FF3D00] text-white text-[10px] font-bold uppercase flex items-center gap-1 shadow-[0_0_10px_rgba(255,61,0,0.4)]">
                        <Video className="w-3 h-3" />
                        Video
                      </span>
                    )}
                  </div>

                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                        prod.status === 'published'
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      {prod.status}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="p-5 space-y-2.5">
                  <h3 className="text-base font-bold text-white group-hover:text-[#FF3D00] transition-colors line-clamp-1">
                    {prod.name}
                  </h3>
                  <p className="text-[11px] font-mono text-cyan-400 truncate">
                    /{prod.slug}
                  </p>
                  <p className="text-xs text-slate-400 line-clamp-2 min-h-[2.5em] leading-relaxed">
                    {stripHtml(prod.short_description || prod.description)}
                  </p>

                  <div className="pt-2 flex items-center justify-between border-t border-white/10">
                    <div>
                      {prod.is_call_for_price || !prod.price ? (
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF3D00]">
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>Call for Price</span>
                        </span>
                      ) : (
                        <span className="text-base font-black text-white">
                          ৳ {Number(prod.price).toLocaleString()}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] font-medium text-slate-500">
                      {1 + (prod.gallery_images?.length || 0)} Photos
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="px-5 py-3 bg-[#080C16] border-t border-white/10 flex items-center justify-between gap-2">
                <Link
                  href={`/products/${prod.slug}`}
                  target="_blank"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-[#FF3D00] transition-colors"
                >
                  <span>View Page</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditForm(prod)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#0E1526] hover:bg-[#FF3D00]/15 border border-white/10 hover:border-[#FF3D00]/30 text-white text-xs font-semibold transition-colors cursor-pointer shadow-sm"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-[#FF3D00]" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(prod)}
                    className="p-1.5 rounded-xl bg-[#0E1526] hover:bg-red-500/15 border border-white/10 hover:border-red-500/30 text-slate-400 hover:text-red-400 transition-colors cursor-pointer shadow-sm"
                    title="Delete Product"
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
  );
}
