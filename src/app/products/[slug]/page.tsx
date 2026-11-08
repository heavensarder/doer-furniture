'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Phone,
  Send,
  ShoppingBag,
  Share2,
  Copy,
  Check,
  Play,
  X,
  ShieldCheck,
  Factory,
  Ruler,
  Loader2,
} from 'lucide-react';
import { normalizeToHtml, stripHtml } from '@/components/admin/RichTextEditor';

interface ProductDetail {
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
}

interface MediaSlide {
  type: 'image' | 'upload-video' | 'youtube';
  url: string;
  embedUrl?: string;
  youtubeId?: string;
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

function getYouTubeEmbedUrl(url: string): string | null {
  const id = extractYouTubeId(url);
  if (id) {
    return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0`;
  }
  return url || null;
}

export default function SingleProductPage() {
  const params = useParams();
  const slug = Array.isArray(params?.slug) ? params.slug[0] : (params?.slug as string);

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<ProductDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [videoLightboxSlide, setVideoLightboxSlide] = useState<MediaSlide | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const loadProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${encodeURIComponent(slug)}`, {
          cache: 'no-store',
        });
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
          setActiveSlide(0);

          // Load related products
          const allRes = await fetch('/api/products?status=published');
          if (allRes.ok) {
            const allData = await allRes.json();
            const others = (allData.products || []).filter(
              (p: ProductDetail) => p.slug !== data.product.slug
            );
            setRelatedProducts(others.slice(0, 3));
          }
        } else {
          setProduct(null);
        }
      } catch (err) {
        console.error('Error loading product:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [slug]);

  // Build slides list: Main Image + Gallery Images + Video
  const slides: MediaSlide[] = React.useMemo(() => {
    if (!product) return [];
    const list: MediaSlide[] = [];

    if (product.main_image) {
      list.push({ type: 'image', url: product.main_image });
    }
    if (Array.isArray(product.gallery_images)) {
      product.gallery_images.forEach((img) => {
        if (img && img !== product.main_image) {
          list.push({ type: 'image', url: img });
        }
      });
    }
    if (product.video_type !== 'none' && product.video_url) {
      const ytId = extractYouTubeId(product.video_url);
      if (product.video_type === 'youtube' || ytId) {
        list.push({
          type: 'youtube',
          url: product.video_url,
          youtubeId: ytId || undefined,
          embedUrl: getYouTubeEmbedUrl(product.video_url) || product.video_url,
        });
      } else {
        list.push({ type: 'upload-video', url: product.video_url });
      }
    }
    return list;
  }, [product]);

  // Auto-slide every 4.5s across all thumbnails (including video thumbnail) unless paused or lightbox is open
  useEffect(() => {
    if (slides.length <= 1 || isPaused || videoLightboxSlide !== null) return;

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4500);

    return () => clearInterval(timer);
  }, [slides, activeSlide, isPaused, videoLightboxSlide]);

  // Close video lightbox on Escape key
  useEffect(() => {
    if (!videoLightboxSlide) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setVideoLightboxSlide(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [videoLightboxSlide]);

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/products/${product?.slug || slug}`;
    }
    return `https://doer.heavensarder.com/products/${product?.slug || slug}`;
  };

  const getWhatsAppLink = () => {
    if (!product) return 'https://wa.me/8801976535654';
    const url = getShareUrl();
    const message = `Hello, I want to buy ${product.name}\nProduct Link: ${url}`;
    return `https://wa.me/8801976535654?text=${encodeURIComponent(message)}`;
  };

  const handleCopyShareLink = async () => {
    const url = getShareUrl();
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const handleNativeShare = async () => {
    if (!product) return;
    const url = getShareUrl();
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
    await handleCopyShareLink();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#05070B] pt-24 gap-3 text-slate-200">
        <Loader2 className="w-9 h-9 animate-spin text-[#FF3D00]" />
        <p className="text-sm font-medium text-slate-400">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#05070B] pt-24 px-4 text-center space-y-4 text-white">
        <h1 className="text-2xl sm:text-3xl font-black text-white">Product Not Found</h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-md">
          The product you are looking for may have been moved or removed.
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(255,61,0,0.35)]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Shop</span>
        </Link>
      </div>
    );
  }

  const hasPrice =
    !product.is_call_for_price &&
    product.price !== null &&
    Number(product.price) > 0;

  const currentMedia = slides[activeSlide] || {
    type: 'image',
    url: product.main_image,
  };

  return (
    <div className="min-h-screen bg-[#05070B] text-slate-100 bg-cyber-grid pt-20 sm:pt-28 pb-28 sm:pb-20 relative overflow-hidden">
      {/* Vertical Neon Laser Lines */}
      <div className="neon-line-v-cyan absolute top-0 bottom-0 left-0 z-20" />
      <div className="neon-line-v-orange absolute top-0 bottom-0 right-0 z-20" />

      {/* Top App Navigation / Breadcrumb Bar */}
      <div className="sticky top-[60px] sm:static z-20 border-b border-cyan-500/20 bg-[#080C16]/90 backdrop-blur-xl sm:bg-transparent">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 flex items-center justify-between gap-3">
          {/* Mobile Back Button + Category */}
          <div className="flex items-center gap-2 min-w-0">
            <Link
              href="/products"
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 sm:px-0 sm:py-0 rounded-lg bg-[#0E1526] border border-white/10 sm:border-0 sm:bg-transparent text-xs font-bold text-white hover:text-[#FF3D00] transition-colors shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="sm:hidden">Shop</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 min-w-0">
              <Link href="/" className="hover:text-[#FF3D00]">
                Home
              </Link>
              <span className="text-white/20">/</span>
              <Link href="/products" className="hover:text-[#FF3D00]">
                Products
              </Link>
              {product.category_name && (
                <>
                  <span className="text-white/20">/</span>
                  <Link
                    href={`/products?category=${product.category_slug}`}
                    className="hover:text-[#FF3D00] font-medium text-slate-300 truncate max-w-[160px]"
                  >
                    {product.category_name}
                  </Link>
                </>
              )}
              <span className="text-white/20">/</span>
              <span className="font-bold text-white truncate max-w-[200px] lg:max-w-xs">
                {product.name}
              </span>
            </div>

            <span className="sm:hidden text-xs font-bold text-white truncate">
              {product.name}
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleNativeShare}
              className="sm:hidden inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#0E1526] border border-white/10 text-white text-xs font-bold active:scale-95"
              aria-label="Share product"
            >
              <Share2 className="w-3.5 h-3.5 text-[#FF3D00]" />
              <span>Share</span>
            </button>

            <Link
              href="/products"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-[#FF3D00] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to All Products</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Product Showcase Grid */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-10 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-10 lg:gap-12 items-start">
          {/* LEFT 6 COLS: AUTO-SLIDING MEDIA GALLERY (1:1 SQUARE IMAGES + VIDEO) */}
          <div
            className="lg:col-span-6 space-y-3 sm:space-y-4"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative aspect-square w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-[#070A12] border border-white/10 shadow-2xl cyber-corner">
              {currentMedia.type === 'image' && (
                <Image
                  src={currentMedia.url}
                  alt={product.name}
                  fill
                  priority
                  className="object-cover transition-all duration-500"
                />
              )}

              {(currentMedia.type === 'upload-video' || currentMedia.type === 'youtube') && (
                <div
                  onClick={() => setVideoLightboxSlide(currentMedia)}
                  className="relative w-full h-full cursor-pointer group select-none"
                >
                  {/* Video Poster / Thumbnail Backdrop (Does NOT auto-play) */}
                  {currentMedia.type === 'youtube' && currentMedia.youtubeId ? (
                    <Image
                      src={`https://img.youtube.com/vi/${currentMedia.youtubeId}/hqdefault.jpg`}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <>
                      <Image
                        src={product.main_image}
                        alt={product.name}
                        fill
                        className="object-cover opacity-50"
                      />
                      <video
                        src={`${currentMedia.url}#t=0.5`}
                        preload="metadata"
                        muted
                        playsInline
                        className="relative z-10 w-full h-full object-cover pointer-events-none"
                      />
                    </>
                  )}

                  {/* Dark Overlay + Manual Play Button */}
                  <div className="absolute inset-0 z-20 bg-slate-950/45 group-hover:bg-slate-950/35 transition-colors flex flex-col items-center justify-center gap-3 p-4 text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#FF3D00] text-white flex items-center justify-center shadow-[0_0_25px_rgba(255,61,0,0.5)] ring-8 ring-white/10 group-hover:scale-110 active:scale-95 transition-all">
                      <Play className="w-7 h-7 sm:w-9 sm:h-9 fill-white ml-1" />
                    </div>
                    <span className="px-3.5 py-1.5 rounded-full bg-[#080C16]/90 backdrop-blur-md border border-white/20 text-white text-xs sm:text-sm font-bold tracking-wide shadow-lg">
                      Click to Watch Video
                    </span>
                  </div>
                </div>
              )}

              {/* Prev / Next Controls */}
              {slides.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSlide((prev) => (prev - 1 + slides.length) % slides.length);
                    }}
                    className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0E1526]/85 hover:bg-[#FF3D00] active:scale-90 text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition-all cursor-pointer z-30"
                    aria-label="Previous Media"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveSlide((prev) => (prev + 1) % slides.length);
                    }}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0E1526]/85 hover:bg-[#FF3D00] active:scale-90 text-white flex items-center justify-center backdrop-blur-md border border-white/15 transition-all cursor-pointer z-30"
                    aria-label="Next Media"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Slide Counter Pill */}
              {slides.length > 1 && (
                <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 px-2.5 py-1 rounded-full bg-[#0E1526]/90 backdrop-blur-md text-cyan-300 text-[11px] font-mono font-bold border border-cyan-500/30 z-30">
                  {activeSlide + 1} / {slides.length}
                </div>
              )}
            </div>

            {/* Thumbnail Strip (1:1 Square Thumbnails) */}
            {slides.length > 1 && (
              <div className="flex items-center gap-2.5 sm:gap-3 overflow-x-auto pb-1 snap-x snap-mandatory no-scrollbar">
                {slides.map((slide, idx) => {
                  const isActive = idx === activeSlide;
                  const isVideoSlide = slide.type === 'upload-video' || slide.type === 'youtube';
                  return (
                    <button
                      key={`${slide.url}-${idx}`}
                      type="button"
                      onClick={() => {
                        if (isVideoSlide && isActive) {
                          setVideoLightboxSlide(slide);
                        } else {
                          setActiveSlide(idx);
                        }
                      }}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 aspect-square rounded-xl overflow-hidden shrink-0 snap-start border-2 transition-all cursor-pointer bg-[#070A12] ${
                        isActive
                          ? 'border-cyan-400 scale-105 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                          : 'border-white/10 opacity-70 hover:opacity-100 hover:border-white/30'
                      }`}
                    >
                      {slide.type === 'image' ? (
                        <Image
                          src={slide.url}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      ) : slide.type === 'youtube' && slide.youtubeId ? (
                        <div className="relative w-full h-full bg-[#070A12]">
                          <Image
                            src={`https://img.youtube.com/vi/${slide.youtubeId}/hqdefault.jpg`}
                            alt="YouTube Video Thumbnail"
                            fill
                            className="object-cover opacity-80"
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/40">
                            <Play className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 fill-cyan-400" />
                            <span className="text-[8px] sm:text-[9px] font-bold uppercase text-cyan-300">Video</span>
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full h-full bg-[#070A12]">
                          <Image
                            src={product.main_image}
                            alt="Video Thumbnail"
                            fill
                            className="object-cover opacity-50"
                          />
                          <video
                            src={`${slide.url}#t=0.5`}
                            preload="metadata"
                            muted
                            playsInline
                            className="relative z-10 w-full h-full object-cover pointer-events-none opacity-85"
                          />
                          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center text-white bg-black/40 gap-0.5">
                            <Play className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400 fill-cyan-400" />
                            <span className="text-[8px] sm:text-[9px] font-bold uppercase text-cyan-300">Video</span>
                          </div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT 6 COLS: PRODUCT INFO, PRICING, SHARE & CTA */}
          <div className="lg:col-span-6 space-y-5 sm:space-y-6">
            <div className="space-y-2.5 sm:space-y-3">
              {product.category_name && (
                <Link
                  href={`/products?category=${product.category_slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-[11px] sm:text-xs font-bold uppercase tracking-wider"
                >
                  <span>{product.category_name}</span>
                </Link>
              )}

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">
                {product.name}
              </h1>

              {product.short_description && (
                <div
                  className="text-xs sm:text-base text-slate-300 leading-relaxed
                    [&_p]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:space-y-1 [&_strong]:text-white"
                  dangerouslySetInnerHTML={{
                    __html: normalizeToHtml(product.short_description),
                  }}
                />
              )}
            </div>

            {/* Pricing Card */}
            <div className="p-4 sm:p-6 rounded-2xl bg-[#0A0F1D]/95 border border-cyan-500/25 space-y-4 sm:space-y-5 shadow-2xl cyber-corner text-white">
              {hasPrice ? (
                <div className="flex items-baseline justify-between gap-2 border-b border-white/10 pb-3.5 sm:pb-4">
                  <div>
                    <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-slate-400 block">
                      Unit Price
                    </span>
                    <span className="text-2xl sm:text-4xl font-black text-white">
                      ৳ {Number(product.price).toLocaleString()}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] sm:text-xs font-bold shrink-0">
                    Available for Order
                  </span>
                </div>
              ) : (
                <div className="border-b border-white/10 pb-3.5 sm:pb-4">
                  <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[#FF3D00] block">
                    Custom Engineered Configuration
                  </span>
                  <span className="text-xl sm:text-3xl font-black text-white mt-0.5 block">
                    Call for Price
                  </span>
                  <p className="text-xs text-slate-400 mt-1">
                    Contact our team directly via phone, WhatsApp, or send a query for instant quotation.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              {hasPrice ? (
                <div className="space-y-3">
                  {/* Quantity + Order Now */}
                  <div className="flex items-center gap-2.5 sm:gap-3">
                    <div className="flex items-center border border-white/10 rounded-xl bg-[#0E1526] shrink-0">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="px-3 sm:px-3.5 py-2.5 sm:py-3 text-slate-300 hover:text-[#FF3D00] font-bold"
                      >
                        -
                      </button>
                      <span className="px-2.5 sm:px-3 py-2.5 sm:py-3 text-sm font-bold text-white min-w-[2.25rem] text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="px-3 sm:px-3.5 py-2.5 sm:py-3 text-slate-300 hover:text-[#FF3D00] font-bold"
                      >
                        +
                      </button>
                    </div>

                    <Link
                      href={`/checkout?product=${product.slug}&qty=${quantity}`}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 sm:py-3.5 px-4 sm:px-6 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] active:scale-[0.98] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,61,0,0.4)] transition-all"
                    >
                      <ShoppingBag className="w-4 h-4 shrink-0" />
                      <span>Order Now</span>
                    </Link>
                  </div>

                  {/* WhatsApp & Direct Call */}
                  <div className="grid grid-cols-2 gap-2.5">
                    <a
                      href={getWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl bg-[#66CC66] hover:bg-[#55b855] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      <Image
                        src="/whatsapp.png"
                        alt="WhatsApp"
                        width={16}
                        height={16}
                        className="w-4 h-4 object-contain shrink-0"
                      />
                      <span className="truncate">WhatsApp</span>
                    </a>

                    <a
                      href="tel:+8801976535654"
                      className="inline-flex items-center justify-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-4 rounded-xl bg-[#0E1526] hover:bg-[#FF3D00]/20 active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider border border-white/10 hover:border-[#FF3D00]/50 transition-all"
                    >
                      <Phone className="w-4 h-4 text-[#FF3D00] shrink-0" />
                      <span className="truncate">+8801976535654</span>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-2.5 sm:space-y-3">
                  <div className="grid grid-cols-2 gap-2.5">
                    <a
                      href="tel:+8801976535654"
                      className="inline-flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-[#0E1526] hover:bg-[#FF3D00]/20 active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider border border-white/10 hover:border-[#FF3D00]/50 transition-all"
                    >
                      <Phone className="w-4 h-4 text-[#FF3D00] shrink-0" />
                      <span className="truncate">Call Price</span>
                    </a>

                    <a
                      href={getWhatsAppLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-[#66CC66] hover:bg-[#55b855] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider transition-all"
                    >
                      <Image
                        src="/whatsapp.png"
                        alt="WhatsApp"
                        width={16}
                        height={16}
                        className="w-4 h-4 object-contain shrink-0"
                      />
                      <span className="truncate">WhatsApp</span>
                    </a>
                  </div>

                  <Link
                    href={`/checkout?product=${product.slug}&qty=1`}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-[#FF3D00] hover:bg-[#eb3800] active:scale-[0.98] text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(255,61,0,0.4)] transition-all"
                  >
                    <Send className="w-4 h-4 shrink-0" />
                    <span>Send Query</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Share Product Link Box */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-[#0A0F1D]/90 border border-white/10 flex items-center justify-between gap-2 flex-wrap cyber-corner text-white">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <Share2 className="w-4 h-4 text-cyan-400" />
                <span>Share Product:</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyShareLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E1526] hover:bg-[#131d33] border border-white/10 text-slate-200 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleNativeShare}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-[#FF3D00]/20 border border-white/10 hover:border-[#FF3D00]/50 text-slate-300 hover:text-[#FF3D00] text-xs font-semibold transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>
            </div>

            {/* Studio Manufacturing Guarantees */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
              <div className="p-2.5 sm:p-3 rounded-xl bg-[#0A0F1D]/90 border border-white/10 text-center space-y-1 cyber-corner">
                <Factory className="w-4 h-4 text-cyan-400 mx-auto" />
                <p className="text-[10px] sm:text-[11px] font-bold text-white">In-House Built</p>
                <p className="text-[9px] sm:text-[10px] text-slate-400">Khilkhet Facility</p>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-[#0A0F1D]/90 border border-white/10 text-center space-y-1 cyber-corner">
                <Ruler className="w-4 h-4 text-cyan-400 mx-auto" />
                <p className="text-[10px] sm:text-[11px] font-bold text-white">Custom Sizing</p>
                <p className="text-[9px] sm:text-[10px] text-slate-400">CAD Millimeter Fit</p>
              </div>
              <div className="p-2.5 sm:p-3 rounded-xl bg-[#0A0F1D]/90 border border-white/10 text-center space-y-1 cyber-corner">
                <ShieldCheck className="w-4 h-4 text-cyan-400 mx-auto" />
                <p className="text-[10px] sm:text-[11px] font-bold text-white">Heavy-Duty</p>
                <p className="text-[9px] sm:text-[10px] text-slate-400">Structural Warranty</p>
              </div>
            </div>
          </div>
        </div>

        {/* FULL PRODUCT DESCRIPTION SECTION */}
        <div className="mt-10 sm:mt-20 border-t border-cyan-500/20 pt-8 sm:pt-14 relative">
          <div className="max-w-4xl space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF3D00]/15 border border-[#FF3D00]/30 text-[#FF3D00] text-[11px] sm:text-xs font-bold uppercase tracking-wider">
              <span>Product Description & Technical Specifications</span>
            </div>

            <h2 className="text-xl sm:text-3xl font-black text-white">
              Overview & Engineering Details
            </h2>

            <div
              className="max-w-none text-slate-300 text-xs sm:text-base leading-relaxed bg-[#0A0F1D]/90 p-4 sm:p-8 rounded-2xl sm:rounded-3xl border border-white/10 overflow-x-auto cyber-corner
                [&_h2]:text-lg [&_h2]:sm:text-2xl [&_h2]:font-black [&_h2]:text-white [&_h2]:mt-5 [&_h2]:mb-2.5 [&_h2:first-child]:mt-0
                [&_h3]:text-base [&_h3]:sm:text-lg [&_h3]:font-bold [&_h3]:text-white [&_h3]:mt-4 [&_h3]:mb-2 [&_h3:first-child]:mt-0
                [&_p]:mb-3 [&_p:last-child]:mb-0
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:sm:pl-6 [&_ul]:mb-4 [&_ul]:space-y-1.5
                [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:sm:pl-6 [&_ol]:mb-4 [&_ol]:space-y-1.5
                [&_blockquote]:border-l-4 [&_blockquote]:border-[#FF3D00] [&_blockquote]:bg-[#0E1526] [&_blockquote]:pl-3.5 [&_blockquote]:py-2 [&_blockquote]:my-3.5 [&_blockquote]:italic [&_blockquote]:text-slate-300 [&_blockquote]:rounded-r-xl
                [&_hr]:my-4 [&_hr]:border-white/10
                [&_a]:text-cyan-400 [&_a]:font-semibold [&_a]:underline
                [&_table]:w-full [&_table]:border-collapse [&_table]:my-4 [&_table]:bg-[#070A12] [&_table]:rounded-xl [&_table]:overflow-hidden [&_table]:text-xs [&_table]:sm:text-sm
                [&_th]:bg-[#0E1526] [&_th]:text-cyan-300 [&_th]:font-bold [&_th]:text-left [&_th]:p-2.5 [&_th]:sm:p-3.5 [&_th]:border [&_th]:border-white/10
                [&_td]:p-2.5 [&_td]:sm:p-3.5 [&_td]:border [&_td]:border-white/10 [&_td]:text-slate-300"
              dangerouslySetInnerHTML={{
                __html: normalizeToHtml(product.description || product.short_description),
              }}
            />
          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 sm:mt-24 border-t border-cyan-500/20 pt-10 sm:pt-12 relative">
            <div className="flex items-center justify-between mb-6 sm:mb-8">
              <h2 className="text-xl sm:text-2xl font-black text-white">More Products from DOER</h2>
              <Link
                href="/products"
                className="text-xs font-bold uppercase tracking-wider text-[#FF3D00] hover:text-[#eb3800] hover:underline"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {relatedProducts.map((rel) => (
                <Link
                  key={rel.id}
                  href={`/products/${rel.slug}`}
                  className="group bg-[#0B101D]/90 rounded-2xl border border-white/10 hover:border-[#FF3D00]/60 overflow-hidden shadow-xl hover:shadow-[0_0_25px_rgba(255,61,0,0.35)] transition-all flex flex-col justify-between cyber-corner text-white"
                >
                  <div>
                    <div className="relative aspect-square w-full bg-[#070A12] overflow-hidden">
                      <Image
                        src={rel.main_image}
                        alt={rel.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-4 sm:p-5 space-y-1.5 sm:space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF3D00]">
                        {rel.category_name}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-[#FF3D00] line-clamp-1 transition-colors">
                        {rel.name}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2">
                        {stripHtml(rel.short_description)}
                      </p>
                    </div>
                  </div>
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-2 flex items-center justify-between border-t border-white/10">
                    <span className="text-sm font-black text-white">
                      {!rel.is_call_for_price && rel.price
                        ? `৳ ${Number(rel.price).toLocaleString()}`
                        : 'Call for Price'}
                    </span>
                    <span className="text-xs font-bold text-cyan-400 group-hover:translate-x-1 transition-transform">View →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* MOBILE-RESPONSIVE VIDEO LIGHTBOX MODAL */}
      {videoLightboxSlide && (
        <div
          className="fixed inset-0 z-[70] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setVideoLightboxSlide(null)}
        >
          <div
            className="relative w-full max-w-4xl space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between gap-3 text-white px-1">
              <div className="flex items-center gap-2 min-w-0">
                <span className="px-2.5 py-1 rounded-md bg-[#FF3D00] text-white text-[10px] font-bold uppercase tracking-wider shrink-0">
                  Product Video
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-white truncate">
                  {product.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setVideoLightboxSlide(null)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-[#FF3D00] active:scale-95 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
                aria-label="Close Video Lightbox"
              >
                <span>Close</span>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Video Player Container */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-white/15 shadow-2xl">
              {videoLightboxSlide.type === 'youtube' ? (
                <iframe
                  src={videoLightboxSlide.embedUrl}
                  title={product.name}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <video
                  src={videoLightboxSlide.url}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-contain bg-black"
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* MOBILE STICKY BOTTOM APP ACTION BAR (< sm) */}
      <div className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-[#080C16]/95 backdrop-blur-xl border-t border-cyan-500/20 px-3.5 py-2.5 text-white shadow-2xl">
        {hasPrice ? (
          <div className="flex items-center justify-between gap-2.5">
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Total ({quantity}x)
              </span>
              <span className="text-base font-black text-white truncate block">
                ৳ {(Number(product.price) * quantity).toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <a
                href={getWhatsAppLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-[#66CC66] active:scale-95 text-white text-xs font-bold uppercase"
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

              <Link
                href={`/checkout?product=${product.slug}&qty=${quantity}`}
                className="inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-[#FF3D00] active:scale-95 text-white text-xs font-bold uppercase shadow-md shadow-[#FF3D00]/25"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order Now</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <a
              href="tel:+8801976535654"
              className="inline-flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl bg-[#0E1526] border border-white/10 active:scale-95 text-white text-[11px] font-bold uppercase"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF3D00]" />
              <span>Call</span>
            </a>

            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl bg-[#66CC66] active:scale-95 text-white text-[11px] font-bold uppercase"
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

            <Link
              href={`/checkout?product=${product.slug}&qty=1`}
              className="inline-flex items-center justify-center gap-1 py-2.5 px-2 rounded-xl bg-[#FF3D00] active:scale-95 text-white text-[11px] font-bold uppercase shadow-md shadow-[#FF3D00]/25"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Query</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
