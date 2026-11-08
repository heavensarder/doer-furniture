'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface Slide {
  id: string;
  tag: string;
  titleLight: string;
  titleHighlight: string;
  description: string;
  image: string;
  primaryBtnText: string;
  primaryBtnHref: string;
  secondaryBtnText: string;
  secondaryBtnHref: string;
}

const SLIDES: Slide[] = [
  {
    id: 'console-tables',
    tag: 'Command Center Consoles • Turnkey Control Room Fit-Out',
    titleLight: 'Smart Console Tables &',
    titleHighlight: 'Control Room Design.',
    description:
      'DOER manufactures mission-critical command consoles, ergonomic modular workstations, and complete control room interiors. Custom-engineered in our in-house Khilkhet workshop with heavy-duty steel chassis, multi-monitor arrays, and smart cable management.',
    image: '/images/hero-slider-one.jpg',
    primaryBtnText: 'Explore Console Tables',
    primaryBtnHref: '/products',
    secondaryBtnText: 'Design Your Control Room',
    secondaryBtnHref: '/contact',
  },
  {
    id: 'architectural-materials',
    tag: 'Architectural Materials • Patinas & Surface Textures',
    titleLight: 'Architectural Patinas &',
    titleHighlight: 'Surface Textures.',
    description:
      'A premium decorative material collection combining artistic textures with sophisticated metallic and mineral finishes. Engineered for stylish partitions, feature walls, decorative panels, and statement luxury interiors.',
    image: '/images/hero-slider-two.jpg',
    primaryBtnText: 'Explore Materials',
    primaryBtnHref: '#materials',
    secondaryBtnText: 'Request Sample Kit',
    secondaryBtnHref: '/contact?subject=Inquiry%20for%20Architectural%20Materials',
  },
];

const SLIDE_DURATION = 5500; // 5.5s auto-slide

export default function HeroSlider() {
  const [activeSlide, setActiveSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % SLIDES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const goToSlide = (idx: number) => {
    setActiveSlide(idx);
  };

  // Reliable Auto-slide Interval
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % SLIDES.length);
    }, SLIDE_DURATION);

    return () => clearInterval(timer);
  }, [activeSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) nextSlide();
      else prevSlide();
    }
    touchStartX.current = null;
  };

  const current = SLIDES[activeSlide];

  return (
    <section
      className="relative min-h-[100svh] min-h-[100dvh] flex flex-col justify-center text-white overflow-hidden px-3.5 sm:px-6 lg:px-8 pt-[60px] sm:pt-[84px] lg:pt-[88px] pb-4 sm:pb-6 bg-[#05070B] select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label="DOER Featured Highlights"
    >
      {/* Vertical Neon Laser Lines */}
      <div className="neon-line-v-cyan absolute top-0 bottom-0 left-0 z-20" />
      <div className="neon-line-v-orange absolute top-0 bottom-0 right-0 z-20" />
      <style jsx>{`
        @keyframes sliderLineFill {
          from {
            width: 0%;
          }
          to {
            width: 100%;
          }
        }
      `}</style>

      {/* 01. FULL-BLEED BACKGROUND SLIDER WITH SMOOTH CROSSFADE */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {SLIDES.map((slide, idx) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeSlide ? 'opacity-100 z-0' : 'opacity-0 -z-10'
            }`}
          >
            <Image
              src={slide.image}
              alt={`${slide.titleLight} ${slide.titleHighlight}`}
              fill
              priority={idx === 0}
              className="object-cover object-center"
            />
          </div>
        ))}
        {/* Subtle cinematic gradient overlay for mobile clarity and contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70 sm:via-transparent sm:to-black/30 pointer-events-none" />
      </div>

      {/* 02. MAIN CONTENT STACK WITH TRANSLUCENT OVERLAY BOX BEHIND TEXT */}
      <div className="relative z-10 max-w-7xl mx-auto w-full flex-1 flex flex-col items-start justify-center my-auto">
        <div className="w-full max-w-xl lg:max-w-2xl text-left space-y-3.5 sm:space-y-5 md:space-y-6 p-4 sm:p-7 md:p-10 rounded-2xl sm:rounded-3xl bg-[#090D18]/90 sm:bg-[#070A12]/85 backdrop-blur-xl border border-cyan-500/25 shadow-2xl cyber-corner">
          {/* Studio Category Badge */}
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-[#0E1526]/90 border border-cyan-500/30 backdrop-blur-md text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-cyan-300 shadow-sm transition-all duration-500 max-w-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF3D00] animate-pulse shrink-0 shadow-[0_0_8px_#FF3D00]" />
            <span className="truncate">{current.tag}</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight drop-shadow-md transition-all duration-500">
            <span className="block">{current.titleLight}</span>
            <span className="text-[#FF3D00] block mt-0.5 sm:mt-1 drop-shadow-[0_0_15px_rgba(255,61,0,0.35)]">
              {current.titleHighlight}
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xs sm:text-sm md:text-base text-slate-300 leading-relaxed font-normal drop-shadow-sm max-w-xl transition-all duration-500 line-clamp-4 sm:line-clamp-none">
            {current.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-2 sm:gap-3.5 pt-1 w-full sm:w-auto">
            <Link
              href={current.primaryBtnHref}
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 bg-[#FF3D00] hover:bg-[#eb3800] active:scale-[0.98] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(255,61,0,0.45)] border border-[#FF3D00] transition-all text-center"
            >
              <span>{current.primaryBtnText}</span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>

            <Link
              href={current.secondaryBtnHref}
              className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 bg-[#0E1526]/80 hover:bg-[#131d33] active:scale-[0.98] text-white hover:text-[#FF3D00] font-bold text-xs uppercase tracking-wider rounded-xl border border-white/20 hover:border-[#FF3D00] backdrop-blur-md transition-all text-center group"
            >
              <span>{current.secondaryBtnText}</span>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-[#FF3D00] shrink-0 transition-colors" />
            </Link>
          </div>

          {/* 03. SLIDER INDICATORS & TOUCH-FRIENDLY CONTROLS */}
          <div className="pt-2.5 sm:pt-4 flex items-center justify-between gap-3 border-t border-white/10">
            <div className="flex items-center gap-2">
              {SLIDES.map((slide, idx) => {
                const isActive = idx === activeSlide;
                return (
                  <button
                    key={slide.id}
                    onClick={() => goToSlide(idx)}
                    className="group py-2 focus:outline-none flex items-center cursor-pointer"
                    aria-label={`Go to slide ${idx + 1}`}
                  >
                    <div
                      className={`h-1.5 rounded-full overflow-hidden transition-all duration-300 relative ${
                        isActive
                          ? 'w-12 sm:w-20 md:w-24 bg-white/25'
                          : 'w-5 sm:w-7 md:w-8 bg-white/35 hover:bg-white/60'
                      }`}
                    >
                      {isActive && (
                        <div
                          key={`bar-${activeSlide}-${idx}`}
                          className="h-full bg-[#FF3D00] rounded-full"
                          style={{
                            animation: `sliderLineFill ${SLIDE_DURATION}ms linear forwards`,
                          }}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Micro Controls & Numbering */}
            <div className="flex items-center gap-2">
              <div className="text-[11px] font-bold tracking-wider text-slate-300/80 select-none flex items-center gap-1">
                <span className="text-[#FF3D00] font-black">{`0${activeSlide + 1}`}</span>
                <span className="text-white/30">/</span>
                <span>{`0${SLIDES.length}`}</span>
              </div>

              {/* Mobile Prev / Next Arrows */}
              <div className="flex items-center gap-1 sm:hidden ml-1">
                <button
                  type="button"
                  onClick={prevSlide}
                  className="w-7 h-7 rounded-lg bg-white/10 active:scale-95 text-white flex items-center justify-center border border-white/15"
                  aria-label="Previous slide"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={nextSlide}
                  className="w-7 h-7 rounded-lg bg-white/10 active:scale-95 text-white flex items-center justify-center border border-white/15"
                  aria-label="Next slide"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sleek Floating Side Navigation Arrows (Desktop) */}
      <button
        onClick={prevSlide}
        className="hidden lg:flex absolute left-4 xl:left-8 top-[calc(50%+44px)] -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#0E1526]/80 hover:bg-[#FF3D00] text-slate-300 hover:text-white items-center justify-center border border-white/15 hover:border-[#FF3D00] backdrop-blur-md transition-all duration-300 shadow-xl cursor-pointer"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        onClick={nextSlide}
        className="hidden lg:flex absolute right-4 xl:right-8 top-[calc(50%+44px)] -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#0E1526]/80 hover:bg-[#FF3D00] text-slate-300 hover:text-white items-center justify-center border border-white/15 hover:border-[#FF3D00] backdrop-blur-md transition-all duration-300 shadow-xl cursor-pointer"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </section>
  );
}
